import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type OrderItemInput = {
  id: string;
  size: string;
  color: string;
  quantity: number;
};

type CreateOrderRequest = {
  email: string;
  phone: string;


  firstName: string;
  lastName: string;


  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;


  paymentMethod: "COD" | "UPI" | "CARD";


  items: OrderItemInput[];
};

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();

  return `DOT-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderRequest;

    if (
      !body.email ||
      !body.phone ||
      !body.firstName ||
      !body.lastName ||
      !body.address ||
      !body.city ||
      !body.state ||
      !body.postalCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required customer or delivery information.",
        },
        { status: 400 },
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Your cart is empty.",
        },
        { status: 400 },
      );
    }

    if (!["COD", "UPI", "CARD"].includes(body.paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method.",
        },
        { status: 400 },
      );
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
      if (
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
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
    console.error("Order creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create order.",
      },
      { status: 500 },
    );
  }
}