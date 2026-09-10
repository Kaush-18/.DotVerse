import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  finalizeActiveReservations,
  releaseActiveReservations,
} from "@/lib/inventory";

type PaymentEntity = {
  order_id?: string;
  id?: string;
  amount?: number;
  currency?: string;
};

type WebhookPayload = {
  event?: string;
  payload?: { payment?: { entity?: PaymentEntity } };
};

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

  let payload: WebhookPayload;

  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    console.error("Webhook payload was not valid JSON");
    return NextResponse.json({ success: false }, { status: 400 });
  }

  // Unhandled events are acknowledged so Razorpay does not retry them.
  if (payload.event !== "payment.captured" && payload.event !== "payment.failed") {
    return NextResponse.json({ success: true });
  }

  const entity = payload.payload?.payment?.entity;

  if (!entity?.order_id) {
    console.error("Webhook payment entity missing for", payload.event);
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    if (payload.event === "payment.captured") {
      await handleCapture(entity);
    } else {
      await handleFailure(entity);
    }
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

async function handleCapture(entity: PaymentEntity): Promise<void> {
  const { order_id, id: payment_id, amount, currency } = entity;

  await prisma.$transaction(async (tx) => {
    const order = await lockOrderByProviderOrderId(tx, order_id!);

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
}

async function handleFailure(entity: PaymentEntity): Promise<void> {
  const { order_id, id: payment_id } = entity;

  await prisma.$transaction(async (tx) => {
    const order = await lockOrderByProviderOrderId(tx, order_id!);

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

/**
 * Locks the order row (SELECT ... FOR UPDATE) as the very first write-lock any
 * webhook transaction takes. Both payment.captured and payment.failed acquire
 * locks in the same order (Order -> InventoryReservation -> ProductVariant as
 * needed), which prevents the cross-transaction deadlock (Postgres 40P01) that
 * occurred when capture locked reservations before the order while a concurrent
 * failure locked the order before reservations.
 */
async function lockOrderByProviderOrderId(
  tx: Prisma.TransactionClient,
  providerOrderId: string,
) {
  const locked = await tx.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM "Order" WHERE "providerOrderId" = ${providerOrderId} FOR UPDATE
  `;

  if (locked.length === 0) {
    return null;
  }

  return tx.order.findUnique({ where: { id: locked[0].id } });
}
