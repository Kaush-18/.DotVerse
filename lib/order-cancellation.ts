import type { Prisma } from "../generated/prisma/client";
import { prisma } from "./prisma";
import { releaseActiveReservations } from "./inventory";

/**
 * Cancels an order and restores its inventory exactly once, atomically.

/**
 * Cancels an order and restores its inventory exactly once, atomically.
 *
 * Non-goals (this architecture deliberately does NOT handle):
 * - Refunding a PAID order. There is no Razorpay refund mechanism in this codebase,
 *   so PAID/FINALIZED orders are rejected here rather than partially processed.
 * - Admin authorization. No admin system exists; authorization is enforced by the caller
 *   (the route verifies order ownership).
 *
 * COD orders decrement stock directly at creation and DO NOT create InventoryReservation
 * rows, so cancellation restores stock by incrementing each order item's variant quantity.
 *
 * Online orders hold ACTIVE reservations; cancellation releases those reservations (which
 * restores stock through the existing reservation release path) instead of blindly
 * incrementing stock.
 *
 * Idempotency: the transition to CANCELLED is guarded by a conditional order update so at
 * most one concurrent cancellation wins and restores stock. Subsequent calls short-circuit.
 */
export class OrderCancellationError extends Error {
  code: "NOT_FOUND" | "NOT_CANCELLABLE" | "UNAUTHORIZED";
  constructor(
    code: OrderCancellationError["code"],
    message: string,
  ) {
    super(message);
    this.code = code;
    this.name = "OrderCancellationError";
  }
}

export type CancelOrderResult = {
  wasCancelled: boolean;
  restoredVariantIds: string[];
  releasedReservations: boolean;
};

/**
 * Attempts to cancel an order inside an existing transaction.
 *
 * @param tx - the active Prisma transaction client.
 * @param orderId - the order's internal id.
 * @returns the cancellation result. Throws OrderCancellationError for non-cancellable states.
 */
export async function cancelOrderInTransaction(
  tx: Prisma.TransactionClient,
  order: {
    id: string;
    paymentStatus: string;
    status: string;
    items: { variantId: string | null; quantity: number }[];
  },
  now: Date = new Date(),
): Promise<CancelOrderResult> {
  // PAID orders must never be cancelled through the unpaid cancellation path.
  if (order.paymentStatus === "PAID") {
    throw new OrderCancellationError(
      "NOT_CANCELLABLE",
      "Paid orders cannot be cancelled through this process.",
    );
  }

  if (order.status === "CANCELLED") {
    return { wasCancelled: false, restoredVariantIds: [], releasedReservations: false };
  }

  // Atomically claim the order for cancellation. Only the first concurrent call that
  // flips a non-CANCELLED order to CANCELLED wins; everyone else sees CANCELLED and
  // restores nothing.
  const claimed = await tx.order.updateMany({
    where: { id: order.id, status: { not: "CANCELLED" } },
    data: {
      status: "CANCELLED",
      cancelledAt: now,
    },
  });

  if (claimed.count !== 1) {
    // Someone else cancelled it first (idempotent).
    return { wasCancelled: false, restoredVariantIds: [], releasedReservations: false };
  }

  // Check for ACTIVE reservations (online orders). Release those rather than incrementing
  // stock directly, so concurrency and the reservation state machine stay consistent.
  const activeReservationCount = await tx.inventoryReservation.count({
    where: { orderId: order.id, status: "ACTIVE" },
  });

  if (activeReservationCount > 0) {
    const released = await releaseActiveReservations(tx, order.id, now);
    return {
      wasCancelled: true,
      restoredVariantIds: [],
      releasedReservations: released > 0,
    };
  }

  // If this order ever had reservations (i.e. online order whose reservations were already
  // released or expired), stock was already returned to availability earlier. Do not restore again.
  const totalReservationCount = await tx.inventoryReservation.count({
    where: { orderId: order.id },
  });

  if (totalReservationCount > 0) {
    return { wasCancelled: true, restoredVariantIds: [], releasedReservations: false };
  }

  // No reservations at all (COD or legacy orders). Restore stock by
  // the order items' variant quantities.
  const restored: string[] = [];

  for (const item of order.items) {
    if (!item.variantId) continue;

    await tx.productVariant.update({
      where: { id: item.variantId },
      data: { stock: { increment: item.quantity } },
    });

    restored.push(item.variantId);
  }

  return { wasCancelled: true, restoredVariantIds: restored, releasedReservations: false };
}

/**
 * Cancels an order by id, running the whole operation in a single transaction.
 */
export async function cancelOrder(
  orderId: string,
  now: Date = new Date(),
): Promise<CancelOrderResult> {
  const validator = async (tx: Prisma.TransactionClient) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        paymentStatus: true,
        items: {
          select: { variantId: true, quantity: true },
        },
      },
    });

    if (!order) {
      throw new OrderCancellationError("NOT_FOUND", "Order not found.");
    }

    return await cancelOrderInTransaction(tx, order, now);
  };

  try {
    const result = await prisma.$transaction(validator);
    return result;
  } catch (error) {
    throw error;
  }
}
