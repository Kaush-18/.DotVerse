import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { isOrderOwnedByUser } from "@/lib/account-authorization";

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

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Return the same not-found response for guests and non-owned orders so
    // the endpoint never reveals another customer's order existence.
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 },
      );
    }

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
        userId: true,
        address: true,
        apartment: true,
        postalCode: true,
        phone: true,
        cancelledAt: true,

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

    if (!order || !isOrderOwnedByUser(order.userId, session.user.id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 },
      );
    }

    const safeOrder = Object.fromEntries(
      Object.entries(order).filter(([key]) => key !== "userId"),
    );

    return NextResponse.json({
      success: true,
      order: safeOrder,
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
