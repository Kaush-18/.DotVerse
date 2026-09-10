import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    if (!razorpay) {
      throw new Error("Razorpay not configured.");
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID required." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    if (order.paymentMethod === "COD") {
      return NextResponse.json(
        { success: false, message: "COD orders cannot use this payment method." },
        { status: 400 }
      );
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { success: false, message: "Order already paid." },
        { status: 400 }
      );
    }

    // Amount in paise
    const amount = order.total * 100;

    // Use order.idempotencyKey or orderNumber as receipt
    const receipt = order.orderNumber;

    // Check if provider order already exists to prevent duplicate creation
    if (order.providerOrderId) {
        return NextResponse.json(
            { 
                success: true, 
                razorpayOrderId: order.providerOrderId,
                amount,
                currency: "INR"
            }
        );
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: receipt,
    });

    // Update the local order with the provider order ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        providerOrderId: razorpayOrder.id,
      },
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to initialize payment." },
      { status: 500 }
    );
  }
}
