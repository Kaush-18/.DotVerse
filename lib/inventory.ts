import type { Prisma } from "../generated/prisma/client";
import { prisma } from "./prisma";

const DEFAULT_RESERVATION_WINDOW_MINUTES = 15;

export function getReservationWindowMinutes(): number {
  const raw = process.env.INVENTORY_RESERVATION_MINUTES;
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN;

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return DEFAULT_RESERVATION_WINDOW_MINUTES;
}

export function getReservationExpiry(now: Date = new Date()): Date {
  return new Date(
    now.getTime() + getReservationWindowMinutes() * 60_000,
  );
}

export class InsufficientInventoryError extends Error {
  constructor(message = "Insufficient stock.") {
    super(message);
    this.name = "InsufficientInventoryError";
  }
}

export class InventoryStateError extends Error {
  constructor(message = "Inventory cannot be reserved for this order.") {
    super(message);
    this.name = "InventoryStateError";
  }
}

export type ReservationInput = {
  variantId: string;
  quantity: number;
};

function aggregateByVariant(
  items: ReservationInput[],
): ReservationInput[] {
  const quantities = new Map<string, number>();

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new InventoryStateError("Invalid reservation quantity.");
    }

    quantities.set(
      item.variantId,
      (quantities.get(item.variantId) ?? 0) + item.quantity,
    );
  }

  return Array.from(quantities, ([variantId, quantity]) => ({
    variantId,
    quantity,
  }));
}

/**
 * Atomically ensures every variant in the order holds an ACTIVE reservation
 * and that the reserved quantity is removed from available stock.
 *
 * - Missing reservation rows are created after a conditional stock decrement.
 * - RELEASED/EXPIRED rows are first claimed with a conditional status update,
 *   and only the winning transaction decrements stock again.
 * - ACTIVE rows are left untouched (expired ones get a fresh window).
 * - FINALIZED rows abort: the inventory is already sold and cannot move again.
 *
 * All stock mutations use conditional `updateMany` guards so concurrent callers
 * can never decrement the same reservation twice (which leaked stock before).
 */
export async function ensureActiveReservations(
  tx: Prisma.TransactionClient,
  orderId: string,
  items: ReservationInput[],
  now: Date = new Date(),
): Promise<void> {
  const aggregated = aggregateByVariant(items);
  const expiry = getReservationExpiry(now);

  for (const { variantId, quantity } of aggregated) {
    const existing = await tx.inventoryReservation.findUnique({
      where: {
        orderId_variantId: {
          orderId,
          variantId,
        },
      },
    });

    if (existing?.status === "FINALIZED") {
      throw new InventoryStateError(
        "Inventory for this order has already been finalized.",
      );
    }

    if (existing?.status === "ACTIVE") {
      if (existing.expiresAt.getTime() <= now.getTime()) {
        await tx.inventoryReservation.update({
          where: { id: existing.id },
          data: { expiresAt: expiry },
        });
      }

      continue;
    }

    if (!existing) {
      // No reservation row yet: decrement stock, then create.
      await decrementVariantStockOrThrow(tx, variantId, quantity);

      // If a concurrent transaction created the row first, the unique
      // constraint aborts this transaction and rolls back the decrement.
      await tx.inventoryReservation.create({
        data: {
          orderId,
          variantId,
          quantity,
          expiresAt: expiry,
        },
      });

      continue;
    }

    // RELEASED/EXPIRED row: claim the state transition atomically *before*
    // touching stock. This is what prevents two concurrent revivals from both
    // decrementing the same reservation (which permanently leaked stock).
    const claimed = await tx.inventoryReservation.updateMany({
      where: {
        id: existing.id,
        status: { in: ["RELEASED", "EXPIRED"] },
      },
      data: {
        status: "ACTIVE",
        quantity,
        expiresAt: expiry,
        releasedAt: null,
        finalizedAt: null,
      },
    });

    if (claimed.count !== 1) {
      // A competing transaction changed the row first. Re-read to decide how
      // to proceed without mutating stock a second time.
      const fresh = await tx.inventoryReservation.findUnique({
        where: { id: existing.id },
      });

      if (fresh?.status === "FINALIZED") {
        throw new InventoryStateError(
          "Inventory for this order has already been finalized.",
        );
      }

      if (fresh?.status === "ACTIVE") {
        // The competing transaction already revived and secured the stock.
        continue;
      }

      // Rare release/expire churn after the claim lost; abort so the caller
      // can retry from a fresh snapshot rather than risk a lost decrement.
      throw new InventoryStateError(
        "Inventory state changed while reserving. Please retry.",
      );
    }

    // We own the revival: the conditional decrement runs exactly once. If it
    // fails, the whole transaction (including the claim) rolls back.
    await decrementVariantStockOrThrow(tx, variantId, quantity);
  }
}

async function decrementVariantStockOrThrow(
  tx: Prisma.TransactionClient,
  variantId: string,
  quantity: number,
): Promise<void> {
  const decremented = await tx.productVariant.updateMany({
    where: {
      id: variantId,
      stock: { gte: quantity },
    },
    data: {
      stock: { decrement: quantity },
    },
  });

  if (decremented.count !== 1) {
    throw new InsufficientInventoryError(
      "One or more items are no longer available in the requested quantity.",
    );
  }
}

/**
 * Flips every ACTIVE reservation for an order to FINALIZED without touching
 * stock (the quantity was already removed from available stock when reserved).
 * Returns the number of reservations finalized.
 */
export async function finalizeActiveReservations(
  tx: Prisma.TransactionClient,
  orderId: string,
  now: Date = new Date(),
): Promise<number> {
  const result = await tx.inventoryReservation.updateMany({
    where: {
      orderId,
      status: "ACTIVE",
    },
    data: {
      status: "FINALIZED",
      finalizedAt: now,
    },
  });

  return result.count;
}

/**
 * Releases every ACTIVE reservation for an order back to available stock.
 * Each reservation is claimed with a conditional status update before stock is
 * incremented, so concurrent or duplicate releases never double-count.
 * Returns the number of reservations actually released.
 */
export async function releaseActiveReservations(
  tx: Prisma.TransactionClient,
  orderId: string,
  now: Date = new Date(),
): Promise<number> {
  const active = await tx.inventoryReservation.findMany({
    where: {
      orderId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      variantId: true,
      quantity: true,
    },
  });

  let released = 0;

  for (const reservation of active) {
    const claimed = await tx.inventoryReservation.updateMany({
      where: {
        id: reservation.id,
        status: "ACTIVE",
      },
      data: {
        status: "RELEASED",
        releasedAt: now,
      },
    });

    if (claimed.count !== 1) {
      continue;
    }

    await tx.productVariant.update({
      where: { id: reservation.variantId },
      data: {
        stock: { increment: reservation.quantity },
      },
    });

    released += 1;
  }

  return released;
}

/**
 * Expires ACTIVE reservations whose window has elapsed and returns their stock.
 *
 * There is no scheduler in the repository yet; this function is the cleanup
 * primitive intended to be invoked by a production scheduler (for example a
 * Vercel Cron job calling a protected route). Until such a job is wired up,
 * abandoned online orders keep their reserved stock until they are released by
 * a payment failure or revived/expired lazily by another lifecycle event.
 */
export async function releaseExpiredReservations(
  now: Date = new Date(),
): Promise<number> {
  const expired = await prisma.inventoryReservation.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: { lt: now },
    },
    select: {
      id: true,
      variantId: true,
      quantity: true,
    },
  });

  let released = 0;

  for (const reservation of expired) {
    const didRelease = await prisma.$transaction(async (tx) => {
      const claimed = await tx.inventoryReservation.updateMany({
        where: {
          id: reservation.id,
          status: "ACTIVE",
          expiresAt: { lt: now },
        },
        data: {
          status: "EXPIRED",
          releasedAt: now,
        },
      });

      if (claimed.count !== 1) {
        return false;
      }

      await tx.productVariant.update({
        where: { id: reservation.variantId },
        data: {
          stock: { increment: reservation.quantity },
        },
      });

      return true;
    });

    if (didRelease) {
      released += 1;
    }
  }

  return released;
}
