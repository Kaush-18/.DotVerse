import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  OrderValidationError,
  parseCreateOrderRequest,
} from "@/lib/validation/order";

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

    const order = await prisma.$transaction(async (tx) => {
      for (const item of body.items) {
        const product = productMap.get(item.id);

        if (!product) {
          throw new Error("Product disappeared during order creation.");
        }

        const variant = product.variants.find(
          (currentVariant) =>
            currentVariant.size === item.size &&
            currentVariant.colorName === item.color,
        );

        if (!variant) {
          throw new Error("Variant disappeared during order creation.");
        }

        const updatedVariant = await tx.productVariant.updateMany({
          where: {
            id: variant.id,
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
          throw new Error(
            `${product.name} (${item.color} / ${item.size}) is no longer available in the requested quantity.`,
          );
        }
      }

      return tx.order.create({
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

          items: {
            create: orderItems,
          },
        },

        include: {
          items: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully.",
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          items: order.items,
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
