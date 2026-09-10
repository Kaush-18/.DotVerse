import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import {
  ensureActiveReservations,
  InsufficientInventoryError,
  InventoryStateError,
} from "@/lib/inventory";

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

    if (order.status === "CANCELLED") {
      return NextResponse.json(
        { success: false, message: "This order has been cancelled." },
        { status: 400 }
      );
    }

    const reservationItems = order.items
      .filter((item) => item.variantId)
      .map((item) => ({
        variantId: item.variantId as string,
        quantity: item.quantity,
      }));

    if (reservationItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "Order has no reservable inventory." },
        { status: 400 }
      );
    }

    // Orders created before the reservation model existed already had their
    // stock consumed at creation and have no reservation rows. Re-reserving
    // them would decrement stock a second time, so skip reservation handling
    // for that transitional case only.
    const existingReservationCount = await prisma.inventoryReservation.count({
      where: { orderId: order.id },
    });

    const isLegacyOrder = existingReservationCount === 0;

    if (!isLegacyOrder) {
      // Re-establish/renew the inventory reservation atomically before any
      // payment attempt, so stock is guaranteed for the payment window and
      // expired/released reservations never silently proceed.
      try {
        await prisma.$transaction(async (tx) => {
          await ensureActiveReservations(tx, order.id, reservationItems);
        });
      } catch (error) {
        if (
          error instanceof InsufficientInventoryError ||
          error instanceof InventoryStateError
        ) {
          return NextResponse.json(
            { success: false, message: error.message },
            { status: 409 }
          );
        }

        throw error;
      }
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
