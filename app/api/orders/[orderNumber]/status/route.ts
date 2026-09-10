import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

// Minimal, PII-free status lookup so guests returning from Razorpay can see
// the authoritative pending -> paid/failed transition. It intentionally does
// not return any customer or order content.
export async function GET(
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

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: {
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        inventoryExceptionAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order status lookup failed:", error);

    return NextResponse.json(
      { success: false, message: "Failed to retrieve order status." },
      { status: 500 },
    );
  }
}
