import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Order number is required.",
        },
        { status: 400 },
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        orderNumber,
      },
      select: {
        id: true,
        orderNumber: true,

        firstName: true,
        lastName: true,
        city: true,
        state: true,

        subtotal: true,
        shipping: true,
        total: true,

        status: true,
        paymentStatus: true,
        paymentMethod: true,

        items: {
          select: {
            id: true,
            productName: true,
            variantSize: true,
            variantColor: true,
            price: true,
            quantity: true,
          },
        },

        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order lookup failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve order.",
      },
      { status: 500 },
    );
  }
}
