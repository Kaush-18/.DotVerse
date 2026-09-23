import { describe, it, mock } from "node:test";
import assert from "node:assert/strict";

import { cancelOrderInTransaction, OrderCancellationError } from "../lib/order-cancellation";
import type { Prisma } from "../generated/prisma/client";

type MockVariantUpdateData = { stock: { increment: number } };
type MockOrderWhere = { id: string; status?: { not: string } };
type MockOrderUpdateData = { status: string; cancelledAt?: Date };
type MockReservationCountWhere = { orderId: string; status?: string };
type MockReservationFindManyWhere = { orderId: string; status?: string };
type MockReservationUpdateManyWhere = { id: string; status?: { in?: string[] } };

function makeTx() {
  const data: {
    orders: Map<string, { status: string; paymentStatus: string; items: { variantId: string | null; quantity: number }[] }>;
    variants: Map<string, number>;
    reservations: Array<{ id: string; orderId: string; status: string }>;
  } = {
    orders: new Map(),
    variants: new Map(),
    reservations: [],
  };

  const tx = {
    order: {
      findUnique: mock.fn(({ where }: { where: { id: string } }) => {
        const o = data.orders.get(where.id);
        return o
          ? {
              id: where.id,
              ...o,
            }
          : null;
      }),
      updateMany: mock.fn(({ where, data: updateData }: { where: MockOrderWhere; data: MockOrderUpdateData | Record<string, unknown> }) => {
        const o = data.orders.get(where.id);
        if (!o) return { count: 0 };
        if (where.status && o.status === where.status.not) {
          return { count: 0 };
        }
        const wasCancellable = o.status !== "CANCELLED";
        if (wasCancellable) {
          const ud = updateData as MockOrderUpdateData;
          o.status = ud.status ?? o.status;
        }
        return { count: wasCancellable ? 1 : 0 };
      }),
    },
    inventoryReservation: {
      count: mock.fn(({ where }: { where: MockReservationCountWhere }) => {
        return data.reservations.filter(
          (r) => r.orderId === where.orderId && (!where.status || r.status === where.status),
        ).length;
      }),
      findMany: mock.fn(({ where }: { where: MockReservationFindManyWhere }) => {
        const rows = data.reservations.filter(
          (r) => r.orderId === where.orderId && (!where.status || r.status === where.status),
        );
        return rows.map((r) => ({ id: r.id, variantId: "var-1", quantity: 1 }));
      }),
      updateMany: mock.fn(({ where }: { where: MockReservationUpdateManyWhere }) => {
        const idx = data.reservations.findIndex((r) => r.id === where.id);
        if (idx === -1) return { count: 0 };
        if (where.status?.in && !where.status.in.includes(data.reservations[idx].status)) return { count: 0 };
        data.reservations[idx].status = "RELEASED";
        return { count: 1 };
      }),
    },
    productVariant: {
      update: mock.fn(({ where, data: updateData }: { where: { id: string }; data: MockVariantUpdateData }) => {
        const current = data.variants.get(where.id) ?? 0;
        data.variants.set(where.id, current + updateData.stock.increment);
      }),
    },
  } as unknown as Prisma.TransactionClient;

  return { tx, data };
}

describe("cancelOrderInTransaction", () => {
  it("should cancel a COD order and restore stock", async () => {
    const { tx, data } = makeTx();
    data.orders.set("order-1", {
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      items: [{ variantId: "var-1", quantity: 1 }],
    });
    data.variants.set("var-1", 48);

    const result = await cancelOrderInTransaction(tx, {
      id: "order-1",
      paymentStatus: "PENDING",
      status: "CONFIRMED",
      items: [{ variantId: "var-1", quantity: 1 }],
    });

    assert.ok(result.wasCancelled, "should cancel");
    assert.deepEqual(result.restoredVariantIds, ["var-1"]);
    assert.equal(result.releasedReservations, false);
    assert.equal(data.variants.get("var-1"), 49, "stock should restore to 48+1=49");
    assert.equal(data.orders.get("order-1")!.status, "CANCELLED");
  });

  it("should be idempotent on second call for COD", async () => {
    const { tx, data } = makeTx();
    data.orders.set("order-1", {
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      items: [{ variantId: "var-1", quantity: 1 }],
    });
    data.variants.set("var-1", 48);

    const first = await cancelOrderInTransaction(tx, {
      id: "order-1",
      paymentStatus: "PENDING",
      status: "CONFIRMED",
      items: [{ variantId: "var-1", quantity: 1 }],
    });
    assert.ok(first.wasCancelled);

    const second = await cancelOrderInTransaction(tx, {
      id: "order-1",
      paymentStatus: "PENDING",
      status: "CANCELLED",
      items: [{ variantId: "var-1", quantity: 1 }],
    });
    assert.equal(second.wasCancelled, false);
    assert.equal(second.restoredVariantIds.length, 0);
    // stock should NOT have been incremented again
    assert.equal(data.variants.get("var-1"), 49);
  });

  it("should cancel an online PENDING order with ACTIVE reservations", async () => {
    const { tx, data } = makeTx();
    data.orders.set("order-1", {
      status: "PENDING",
      paymentStatus: "PENDING",
      items: [{ variantId: "var-1", quantity: 1 }],
    });
    data.reservations.push({ id: "res-order-1", orderId: "order-1", status: "ACTIVE" });

    const result = await cancelOrderInTransaction(tx, {
      id: "order-1",
      paymentStatus: "PENDING",
      status: "PENDING",
      items: [{ variantId: "var-1", quantity: 1 }],
    });

    assert.ok(result.wasCancelled);
    assert.ok(result.releasedReservations);
    // The release path was taken, not the direct increment
    assert.equal(result.restoredVariantIds.length, 0);
    assert.equal(data.orders.get("order-1")!.status, "CANCELLED");
  });

  it("should reject paid orders", async () => {
    const { tx } = makeTx();

    await assert.rejects(
      cancelOrderInTransaction(tx, {
        id: "order-1",
        paymentStatus: "PAID",
        status: "CONFIRMED",
        items: [{ variantId: "var-1", quantity: 1 }],
      }),
      (err: OrderCancellationError) => err.code === "NOT_CANCELLABLE",
    );
  });

  it("should handle already-cancelled order without restoring stock", async () => {
    const { tx, data } = makeTx();
    data.orders.set("order-1", {
      status: "CANCELLED",
      paymentStatus: "PENDING",
      items: [{ variantId: "var-1", quantity: 1 }],
    });
    data.variants.set("var-1", 48);

    const result = await cancelOrderInTransaction(tx, {
      id: "order-1",
      paymentStatus: "PENDING",
      status: "CANCELLED",
      items: [{ variantId: "var-1", quantity: 1 }],
    });

    assert.equal(result.wasCancelled, false);
    assert.equal(result.restoredVariantIds.length, 0);
    assert.equal(data.variants.get("var-1"), 48, "stock unchanged");
  });

  it("should handle COD order with multiple items and variants", async () => {
    const { tx, data } = makeTx();
    data.orders.set("order-1", {
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      items: [
        { variantId: "var-1", quantity: 2 },
        { variantId: "var-2", quantity: 3 },
      ],
    });
    data.variants.set("var-1", 50);
    data.variants.set("var-2", 100);

    const result = await cancelOrderInTransaction(tx, {
      id: "order-1",
      paymentStatus: "PENDING",
      status: "CONFIRMED",
      items: [
        { variantId: "var-1", quantity: 2 },
        { variantId: "var-2", quantity: 3 },
      ],
    });

    assert.ok(result.wasCancelled);
    assert.equal(data.variants.get("var-1"), 52);
    assert.equal(data.variants.get("var-2"), 103);
  });

  it("should skip items with no variantId", async () => {
    const { tx, data } = makeTx();
    data.orders.set("order-1", {
      status: "CONFIRMED",
      paymentStatus: "PENDING",
      items: [{ variantId: null, quantity: 1 }],
    });
    data.variants.set("var-1", 50);

    const result = await cancelOrderInTransaction(tx, {
      id: "order-1",
      paymentStatus: "PENDING",
      status: "CONFIRMED",
      items: [{ variantId: null, quantity: 1 }],
    });

    assert.ok(result.wasCancelled);
    assert.equal(result.restoredVariantIds.length, 0);
  });

  it("should not increment stock if online order reservations were already expired/released", async () => {
    const { tx, data } = makeTx();
    data.orders.set("order-1", {
      status: "PENDING",
      paymentStatus: "PENDING",
      items: [{ variantId: "var-1", quantity: 1 }],
    });
    data.reservations.push({ id: "res-order-1", orderId: "order-1", status: "EXPIRED" });
    data.variants.set("var-1", 50);

    const result = await cancelOrderInTransaction(tx, {
      id: "order-1",
      paymentStatus: "PENDING",
      status: "PENDING",
      items: [{ variantId: "var-1", quantity: 1 }],
    });

    assert.ok(result.wasCancelled);
    assert.equal(result.releasedReservations, false);
    assert.equal(result.restoredVariantIds.length, 0);
    assert.equal(data.variants.get("var-1"), 50, "stock should not be incremented again");
    assert.equal(data.orders.get("order-1")!.status, "CANCELLED");
  });
});
