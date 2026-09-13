import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import {
  cancelOrderInTransaction,
  OrderCancellationError,
} from "@/lib/order-cancellation";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

/**
 * POST /api/orders/[orderNumber]/cancel
 *
 * Cancels an order and restores inventory. Requires authentication as the
 * order owner. The webhook-authorised payment flow is NOT involved here:
 * this endpoint is for customers to cancel their own unpaid COD or PENDING
 * online orders.
 *
 * Paired/FINALIZED orders are rejected — no Razorpay refund mechanism exists
 * in this codebase, so this endpoint explicitly refuses to process them rather
 * than partially handling inventory while leaving a paid order in a confusing
 * state.
 */
export async function POST(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: "Order number is required." },
        { status: 400 },
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 },
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { orderNumber },
        select: {
          id: true,
          status: true,
          paymentStatus: true,
          userId: true,
          items: {
            select: { variantId: true, quantity: true },
          },
        },
      });

      if (!order) {
        return { notFound: true as const };
      }

      if (order.userId !== session.user.id) {
        return { unauthorized: true as const };
      }

      const cancelResult = await cancelOrderInTransaction(tx, order);
      return { notFound: false as const, unauthorized: false as const, ...cancelResult };
    });

    if ("notFound" in result && result.notFound) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 },
      );
    }

    if ("unauthorized" in result && result.unauthorized) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 },
      );
    }

    if (!result.wasCancelled) {
      return NextResponse.json({
        success: true,
        message: "Order was already cancelled.",
        alreadyCancelled: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully.",
      restoredVariantIds: result.restoredVariantIds,
      releasedReservations: result.releasedReservations,
    });
  } catch (error) {
    if (error instanceof OrderCancellationError && error.code === "NOT_CANCELLABLE") {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    console.error("Order cancellation failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel order." },
      { status: 500 },
    );
  }
}