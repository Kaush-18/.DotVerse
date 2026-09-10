import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !secret) {
    console.error("Webhook signature or secret missing");
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    Razorpay.validateWebhookSignature(rawBody, signature, secret);
  } catch (e) {
    console.error("Webhook signature verification failed:", e);
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

        // Security: Verify amount and currency
        if (order.total * 100 !== amount || currency !== "INR") {
          throw new Error("Amount or currency mismatch");
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: "PAID",
            providerPaymentId: payment_id,
            paidAt: new Date(),
            status: "CONFIRMED",
          },
        });
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
      });
    }
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
