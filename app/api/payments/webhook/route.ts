import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import {
  finalizeActiveReservations,
  releaseActiveReservations,
} from "@/lib/inventory";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !secret) {
    console.error("Webhook signature or secret missing");
    return NextResponse.json({ success: false }, { status: 400 });
  }

  let signatureValid = false;

  try {
    // NOTE: this SDK method returns a boolean and does not throw on mismatch.
    signatureValid = Razorpay.validateWebhookSignature(
      rawBody,
      signature,
      secret,
    );
  } catch (e) {
    console.error("Webhook signature verification errored:", e);
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (!signatureValid) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);

  try {
    if (payload.event === "payment.captured") {
      const { order_id, id: payment_id, amount, currency } = payload.payload.payment.entity;

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
          where: { providerOrderId: order_id },
        });

        if (!order) {
          console.error("Order not found for webhook:", order_id);
          return;
        }

        if (order.paymentStatus === "PAID") {
          return; // Already processed
        }

        // Security: Verify amount and currency against the server-owned total.
        if (order.total * 100 !== amount || currency !== "INR") {
          throw new Error("Amount or currency mismatch");
        }

        // Total reservation rows for the order, including released/expired.
        const reservationCount = await tx.inventoryReservation.count({
          where: { orderId: order.id },
        });

        // Flips ACTIVE -> FINALIZED. Duplicate/concurrent deliveries cannot
        // double-finalize because the conditional update only matches ACTIVE
        // rows, and the row lock serializes the competing transactions.
        const finalized = await finalizeActiveReservations(tx, order.id);

        // A concurrent duplicate webhook that lost the row lock sees the
        // already-FINALIZED rows here (READ COMMITTED picks up the committed
        // snapshot), so it still routes to confirmation instead of being
        // mistaken for a released reservation.
        const finalizedCount = await tx.inventoryReservation.count({
          where: {
            orderId: order.id,
            status: "FINALIZED",
          },
        });

        if (finalized > 0 || finalizedCount > 0) {
          // Inventory is secured: confirm the order.
          await tx.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "PAID",
              providerPaymentId: payment_id,
              paidAt: new Date(),
              status: "CONFIRMED",
              inventoryExceptionAt: null,
            },
          });

          return;
        }

        if (reservationCount === 0) {
          // Legacy order created before the reservation model existed. Its
          // stock was already consumed at order creation, so there is nothing
          // to finalize and the payment can be honoured safely.
          await tx.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "PAID",
              providerPaymentId: payment_id,
              paidAt: new Date(),
              status: "CONFIRMED",
            },
          });

          return;
        }

        // Reservation rows exist but none could be finalized: the reservation
        // was already released or expired (for example by cleanup after an
        // abandoned payment). The payment is real, so record PAID honestly but
        // flag the order for manual fulfilment instead of pretending inventory
        // was secured. No automatic refund is issued by this architecture.
        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            providerPaymentId: payment_id,
            paidAt: new Date(),
            status: "PENDING",
            inventoryExceptionAt: new Date(),
          },
        });

        console.error(
          "Inventory exception: payment captured without reservable stock for order",
          order.orderNumber,
        );
      });
    } else if (payload.event === "payment.failed") {
      const { order_id, id: payment_id } = payload.payload.payment.entity;

      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
          where: { providerOrderId: order_id },
        });

        if (!order) {
          console.error("Order not found for webhook:", order_id);
          return;
        }

        if (order.paymentStatus === "PAID") {
          return; // Already paid, don't downgrade
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "FAILED",
            providerPaymentId: payment_id,
          },
        });

        // Return reserved stock to availability exactly once. The order stays
        // PENDING so the customer can retry payment with the same order.
        await releaseActiveReservations(tx, order.id);
      });
    }
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
