import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressValidationError, parseAddressInput } from "@/lib/validation/address";
import { addressSelect } from "../route";

type Context = { params: Promise<Record<string, string>> };

async function getOwner(request: Request) {
  return auth.api.getSession({ headers: request.headers });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await getOwner(request);
  if (!session) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  const { id } = await params;
  try {
    const input = parseAddressInput(await request.json());
    const address = await prisma.$transaction(async (tx) => {
      const owned = await tx.address.findFirst({ where: { id, userId: session.user.id }, select: { id: true, isDefault: true } });
      if (!owned) return null;
      const shouldBeDefault = input.isDefault || owned.isDefault;
      if (shouldBeDefault) await tx.address.updateMany({ where: { userId: session.user.id, isDefault: true, id: { not: id } }, data: { isDefault: false } });
      return tx.address.update({ where: { id }, data: { ...input, isDefault: shouldBeDefault }, select: addressSelect });
    });
    if (!address) return NextResponse.json({ success: false, message: "Address not found." }, { status: 404 });
    return NextResponse.json({ success: true, address });
  } catch (error) {
    if (error instanceof AddressValidationError) return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    console.error("Address update failed:", error);
    return NextResponse.json({ success: false, message: "Unable to update this address." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const session = await getOwner(request);
  if (!session) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  const { id } = await params;
  try {
    const result = await prisma.$transaction(async (tx) => {
      const address = await tx.address.findFirst({ where: { id, userId: session.user.id }, select: { id: true, isDefault: true } });
      if (!address) return null;
      await tx.address.delete({ where: { id } });
      if (address.isDefault) {
        const next = await tx.address.findFirst({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" }, select: { id: true } });
        if (next) await tx.address.update({ where: { id: next.id }, data: { isDefault: true } });
      }
      return address;
    });
    if (!result) return NextResponse.json({ success: false, message: "Address not found." }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Address deletion failed:", error);
    return NextResponse.json({ success: false, message: "Unable to delete this address." }, { status: 500 });
  }
}
