import { NextResponse } from "next/server";
import { releaseExpiredReservations } from "@/lib/inventory";

function getExpectedSecret(): string | undefined {
  // `||` (not `??`) so an empty INVENTORY_CLEANUP_SECRET does not shadow the
  // Vercel Cron secret, and a blank value is treated as unconfigured.
  return (
    process.env.INVENTORY_CLEANUP_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    undefined
  );
}

function isAuthorized(request: Request): boolean {
  const expected = getExpectedSecret();

  if (!expected) {
    return false;
  }

  const header = request.headers.get("authorization");

  if (header === `Bearer ${expected}`) {
    return true;
  }

  return request.headers.get("x-cleanup-secret") === expected;
}

async function handle(request: Request) {
  if (!getExpectedSecret()) {
    // No cleanup secret configured: refuse rather than expose the endpoint.
    return NextResponse.json(
      {
        success: false,
        message: "Inventory cleanup is not configured.",
      },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  try {
    const released = await releaseExpiredReservations();

    return NextResponse.json({ success: true, released });
  } catch (error) {
    console.error("Inventory cleanup failed:", error);

    return NextResponse.json(
      { success: false, message: "Inventory cleanup failed." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  return handle(request);
}

// Supports schedulers (such as Vercel Cron) that invoke cleanup via GET with an
// Authorization: Bearer secret header.
export async function GET(request: Request) {
  return handle(request);
}
