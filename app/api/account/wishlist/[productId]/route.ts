import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

  const { productId } = await params;
  if (!productId || productId.length > 100) return NextResponse.json({ success: false, message: "Invalid product." }, { status: 400 });

  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { id: productId },
        { slug: productId },
      ],
    },
    select: { id: true },
  });
  const targetId = product ? product.id : productId;

  await prisma.wishlistItem.deleteMany({ where: { userId: session.user.id, productId: targetId } });
  return NextResponse.json({ success: true });
}
