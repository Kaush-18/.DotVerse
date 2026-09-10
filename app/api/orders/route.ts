import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  OrderValidationError,
  parseCreateOrderRequest,
} from "@/lib/validation/order";
import {
  ensureActiveReservations,
  InsufficientInventoryError,
  InventoryStateError,
} from "@/lib/inventory";

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `DOT-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  let idempotencyKey: string | null = null;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    const userId = session?.user.id || null;

    const rawBody: unknown = await request.json();

    const body = parseCreateOrderRequest(rawBody);

    idempotencyKey = request.headers.get("Idempotency-Key");

    if (!idempotencyKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Idempotency-Key.",
        },
        { status: 400 },
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: {
        idempotencyKey,
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        total: true,
      },
    });

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        message: "Order already exists.",
        order: existingOrder,
        idempotent: true,
      });
    }

    const productIds = body.items.map((item) => item.id);

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        variants: true,
      },
    });

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    let subtotal = 0;

    const orderItems: {
      productId: string;
      variantId: string;
      productName: string;
      variantSize: string;
      variantColor: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of body.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid item quantity.",
          },
          { status: 400 },
        );
      }

      const product = productMap.get(item.id);

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: `Product not found: ${item.id}`,
          },
          { status: 400 },
        );
      }

      const variant = product.variants.find(
        (currentVariant) =>
          currentVariant.size === item.size &&
          currentVariant.colorName === item.color,
      );

      if (!variant) {
        return NextResponse.json(
          {
            success: false,
            message: `Variant not found for ${product.name}.`,
          },
          { status: 400 },
        );
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `${product.name} (${item.color} / ${item.size}) does not have enough stock.`,
          },
          { status: 400 },
        );
      }

      subtotal += product.price * item.quantity;

      orderItems.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantSize: variant.size,
        variantColor: variant.colorName,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const shipping = 0;
    const total = subtotal + shipping;

    const isOnlinePayment = body.paymentMethod !== "COD";

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          idempotencyKey: idempotencyKey!,
          userId: userId,

          email: body.email,
          phone: body.phone,

          firstName: body.firstName,
          lastName: body.lastName,

          address: body.address,
          apartment: body.apartment || null,
          city: body.city,
          state: body.state,
          postalCode: body.postalCode,

          subtotal,
          shipping,
          total,

          paymentMethod: body.paymentMethod,
          // COD is fulfilled immediately; online orders stay pending until the
          // payment webhook confirms them.
          status: isOnlinePayment ? "PENDING" : "CONFIRMED",

          items: {
            create: orderItems,
          },
        },

        include: {
          items: true,
        },
      });

      if (isOnlinePayment) {
        // Reserve inventory for the payment window without selling it yet.
        await ensureActiveReservations(
          tx,
          createdOrder.id,
          orderItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        );
      } else {
        // COD preserves the existing immediate stock consumption.
        for (const item of orderItems) {
          const updatedVariant = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              stock: {
                gte: item.quantity,
              },
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          if (updatedVariant.count !== 1) {
            throw new InsufficientInventoryError(
              `${item.productName} (${item.variantColor} / ${item.variantSize}) is no longer available in the requested quantity.`,
            );
          }
        }
      }

      return createdOrder;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          email: order.email,
          firstName: order.firstName,
          lastName: order.lastName,
          address: order.address,
          apartment: order.apartment,
          city: order.city,
          state: order.state,
          postalCode: order.postalCode,
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          items: order.items,
          createdAt: order.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 400 },
      );
    }

    if (error instanceof InsufficientInventoryError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 409 },
      );
    }

    if (error instanceof InventoryStateError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 409 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const existingOrder = await prisma.order.findUnique({
        where: {
          idempotencyKey: idempotencyKey!,
        },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          total: true,
        },
      });

      if (existingOrder) {
        return NextResponse.json({
          success: true,
          message: "Order already exists.",
          order: existingOrder,
          idempotent: true,
        });
      }
    }

    console.error("Order creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create order.",
      },
      { status: 500 },
    );
  }
}
