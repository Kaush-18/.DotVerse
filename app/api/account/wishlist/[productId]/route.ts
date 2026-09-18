import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

  const { productId } = await params;
  if (!productId || productId.length > 100) return NextResponse.json({ success: false, message: "Invalid product." }, { status: 400 });

  await prisma.wishlistItem.deleteMany({ where: { userId: session.user.id, productId } });
  return NextResponse.json({ success: true });
}
