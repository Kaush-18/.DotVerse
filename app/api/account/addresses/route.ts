import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressValidationError, parseAddressInput } from "@/lib/validation/address";

const MAX_ADDRESSES = 5;
const addressSelect = {
  id: true,
  label: true,
  firstName: true,
  lastName: true,
  phone: true,
  address: true,
  apartment: true,
  city: true,
  state: true,
  postalCode: true,
  isDefault: true,
} as const;

async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    select: addressSelect,
  });
  return NextResponse.json({ success: true, addresses });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

  try {
    const input = parseAddressInput(await request.json());
    const address = await prisma.$transaction(async (tx) => {
      const count = await tx.address.count({ where: { userId: session.user.id } });
      if (count >= MAX_ADDRESSES) throw new AddressValidationError("You can save up to 5 addresses.");
      const isDefault = input.isDefault || count === 0;
      if (isDefault) await tx.address.updateMany({ where: { userId: session.user.id, isDefault: true }, data: { isDefault: false } });
      return tx.address.create({ data: { ...input, userId: session.user.id, isDefault }, select: addressSelect });
    });
    return NextResponse.json({ success: true, address }, { status: 201 });
  } catch (error) {
    if (error instanceof AddressValidationError) return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    console.error("Address creation failed:", error);
    return NextResponse.json({ success: false, message: "Unable to save this address." }, { status: 500 });
  }
}

export { addressSelect };
