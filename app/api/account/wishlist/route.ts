import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapProduct, type FullProduct } from "@/services/products";

const productInclude = {
  category: true,
  collection: true,
  images: { orderBy: { position: "asc" as const } },
  variants: true,
};

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { product: { include: productInclude } },
  });

  return NextResponse.json({
    success: true,
    items: items.map((item) => ({ id: item.id, product: mapProduct(item.product as FullProduct) })),
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ success: false, message: "A product is required." }, { status: 400 }); }
  const productId = typeof body === "object" && body !== null && "productId" in body && typeof body.productId === "string" ? body.productId.trim() : "";
  if (!productId || productId.length > 100) return NextResponse.json({ success: false, message: "A valid product is required." }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) return NextResponse.json({ success: false, message: "Product not found." }, { status: 404 });

  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    create: { userId: session.user.id, productId },
    update: {},
    select: { id: true, productId: true },
  });
  return NextResponse.json({ success: true, item });
}
