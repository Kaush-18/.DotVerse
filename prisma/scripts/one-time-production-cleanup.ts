import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../../generated/prisma/client";

const EXPECTED_DATABASE_HOST =
  "ep-damp-rain-b3sf1wna.c-4.ap-southeast-1.aws.neon.tech";
const EXPECTED_DATABASE_NAME = "neondb";
const REQUIRED_CONFIRMATION = "DOTVERSE_PRODUCTION_CLEANUP";
const execute = process.argv.includes("--execute");

type DatabaseClient = PrismaClient | Prisma.TransactionClient;

type Summary = {
  users: number;
  accounts: number;
  sessions: number;
  verification: number;
  orders: number;
  orderItems: number;
  reservations: number;
  products: number;
  productImages: number;
  productVariants: number;
  categories: number;
  collections: number;
};

type ReservationSummary = {
  ACTIVE: { reservations: number; units: number };
  EXPIRED: { reservations: number; units: number };
  FINALIZED: { reservations: number; units: number };
  RELEASED: { reservations: number; units: number };
  totalUnits: number;
};

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DIRECT_URL or DATABASE_URL is required.");
  }

  return databaseUrl;
}

function getDatabaseIdentity(databaseUrl: string) {
  const url = new URL(databaseUrl);
  const database = url.pathname.replace(/^\/+/, "");

  if (url.hostname !== EXPECTED_DATABASE_HOST) {
    throw new Error(
      `Refusing cleanup: unexpected database host "${url.hostname}".`,
    );
  }

  if (database !== EXPECTED_DATABASE_NAME) {
    throw new Error(
      `Refusing cleanup: unexpected database name "${database}".`,
    );
  }

  if (process.env.PRODUCTION_CLEANUP_CONFIRMATION !== REQUIRED_CONFIRMATION) {
    throw new Error(
      "Refusing cleanup: PRODUCTION_CLEANUP_CONFIRMATION is missing or invalid.",
    );
  }

  return {
    host: url.hostname,
    database,
    sslmode: url.searchParams.get("sslmode") || "not specified",
  };
}

async function getSummary(db: DatabaseClient): Promise<Summary> {
  const [
    users,
    accounts,
    sessions,
    verification,
    orders,
    orderItems,
    reservations,
    products,
    productImages,
    productVariants,
    categories,
    collections,
  ] = await Promise.all([
    db.user.count(),
    db.account.count(),
    db.session.count(),
    db.verification.count(),
    db.order.count(),
    db.orderItem.count(),
    db.inventoryReservation.count(),
    db.product.count(),
    db.productImage.count(),
    db.productVariant.count(),
    db.category.count(),
    db.collection.count(),
  ]);

  return {
    users,
    accounts,
    sessions,
    verification,
    orders,
    orderItems,
    reservations,
    products,
    productImages,
    productVariants,
    categories,
    collections,
  };
}

async function getReservationSummary(
  db: DatabaseClient,
): Promise<ReservationSummary> {
  const rows = await db.inventoryReservation.groupBy({
    by: ["status"],
    _count: { _all: true },
    _sum: { quantity: true },
  });

  const result: ReservationSummary = {
    ACTIVE: { reservations: 0, units: 0 },
    EXPIRED: { reservations: 0, units: 0 },
    FINALIZED: { reservations: 0, units: 0 },
    RELEASED: { reservations: 0, units: 0 },
    totalUnits: 0,
  };

  for (const row of rows) {
    const reservations = row._count._all;
    const units = row._sum.quantity ?? 0;
    result[row.status] = { reservations, units };
    result.totalUnits += units;
  }

  return result;
}

async function getOperationalSummary(db: DatabaseClient) {
  const [active, orderStatuses, paymentStatuses, paymentMethods, paid, cod, cancelled, providerOrders, providerPayments] =
    await Promise.all([
      db.inventoryReservation.aggregate({
        where: { status: "ACTIVE" },
        _count: { _all: true },
        _sum: { quantity: true },
      }),
      db.order.groupBy({ by: ["status"], _count: { _all: true } }),
      db.order.groupBy({ by: ["paymentStatus"], _count: { _all: true } }),
      db.order.groupBy({ by: ["paymentMethod"], _count: { _all: true } }),
      db.order.count({ where: { paymentStatus: "PAID" } }),
      db.order.count({ where: { paymentMethod: "COD" } }),
      db.order.count({ where: { status: "CANCELLED" } }),
      db.order.count({ where: { providerOrderId: { not: null } } }),
      db.order.count({ where: { providerPaymentId: { not: null } } }),
    ]);

  return {
    activeReservations: active._count._all,
    activeReservationUnits: active._sum.quantity ?? 0,
    orderStatuses: Object.fromEntries(
      orderStatuses.map((row) => [row.status, row._count._all]),
    ),
    paymentStatuses: Object.fromEntries(
      paymentStatuses.map((row) => [row.paymentStatus, row._count._all]),
    ),
    paymentMethods: Object.fromEntries(
      paymentMethods.map((row) => [row.paymentMethod, row._count._all]),
    ),
    paidOrders: paid,
    codOrders: cod,
    cancelledOrders: cancelled,
    ordersWithProviderOrderId: providerOrders,
    ordersWithProviderPaymentId: providerPayments,
  };
}

function printReport(
  label: string,
  summary: Summary,
  reservations: ReservationSummary,
  operational: Awaited<ReturnType<typeof getOperationalSummary>>,
): void {
  console.log(`\n${label}`);
  console.log(JSON.stringify({ summary, reservations, operational }, null, 2));
}

async function main(): Promise<void> {
  const databaseUrl = getDatabaseUrl();
  const identity = getDatabaseIdentity(databaseUrl);
  const adapter = new PrismaPg({ connectionString: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("DotVerse one-time production cleanup");
    console.log(`Database host: ${identity.host}`);
    console.log(`Database name: ${identity.database}`);
    console.log(`SSL mode: ${identity.sslmode}`);
    console.log(`Mode: ${execute ? "EXECUTE" : "DRY RUN"}`);

    const before = await getSummary(prisma);
    const beforeReservations = await getReservationSummary(prisma);
    const beforeOperational = await getOperationalSummary(prisma);
    printReport("BEFORE", before, beforeReservations, beforeOperational);

    const activeReservations = await prisma.inventoryReservation.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, variantId: true, quantity: true },
    });

    for (const reservation of activeReservations) {
      if (!Number.isInteger(reservation.quantity) || reservation.quantity <= 0) {
        throw new Error(
          `Refusing cleanup: invalid ACTIVE reservation quantity for ${reservation.id}.`,
        );
      }

      const variant = await prisma.productVariant.findUnique({
        where: { id: reservation.variantId },
        select: { id: true },
      });

      if (!variant) {
        throw new Error(
          `Refusing cleanup: variant for ACTIVE reservation ${reservation.id} was not found.`,
        );
      }
    }

    if (!execute) {
      console.log(
        "\nDRY RUN: no DELETE or stock update was performed. Re-run with --execute only after explicit approval.",
      );
      return;
    }

    console.warn("\n!!! DESTRUCTIVE PRODUCTION CLEANUP STARTING !!!");
    console.warn("Only authentication, customer, and transactional data will be deleted.");

    await prisma.$transaction(async (tx) => {
      const active = await tx.inventoryReservation.findMany({
        where: { status: "ACTIVE" },
        select: { id: true, variantId: true, quantity: true },
      });

      for (const reservation of active) {
        if (!Number.isInteger(reservation.quantity) || reservation.quantity <= 0) {
          throw new Error(
            `Refusing cleanup: invalid ACTIVE reservation quantity for ${reservation.id}.`,
          );
        }

        const claimed = await tx.inventoryReservation.updateMany({
          where: { id: reservation.id, status: "ACTIVE" },
          data: { status: "RELEASED", releasedAt: new Date() },
        });

        if (claimed.count !== 1) {
          throw new Error(
            `Refusing cleanup: ACTIVE reservation ${reservation.id} changed during cleanup.`,
          );
        }

        const restored = await tx.productVariant.updateMany({
          where: { id: reservation.variantId },
          data: { stock: { increment: reservation.quantity } },
        });

        if (restored.count !== 1) {
          throw new Error(
            `Refusing cleanup: variant ${reservation.variantId} was not found during restoration.`,
          );
        }
      }

      await tx.inventoryReservation.deleteMany();
      await tx.orderItem.deleteMany();
      await tx.order.deleteMany();
      await tx.session.deleteMany();
      await tx.account.deleteMany();
      await tx.verification.deleteMany();
      await tx.user.deleteMany();
    });

    const after = await getSummary(prisma);
    const afterReservations = await getReservationSummary(prisma);
    const afterOperational = await getOperationalSummary(prisma);
    printReport("AFTER", after, afterReservations, afterOperational);

    const catalogUnchanged =
      after.categories === before.categories &&
      after.collections === before.collections &&
      after.products === before.products &&
      after.productImages === before.productImages &&
      after.productVariants === before.productVariants;
    const transactionalDataRemoved =
      after.users === 0 &&
      after.accounts === 0 &&
      after.sessions === 0 &&
      after.verification === 0 &&
      after.orders === 0 &&
      after.orderItems === 0 &&
      after.reservations === 0;

    if (!catalogUnchanged) {
      throw new Error("Cleanup verification failed: catalog counts changed.");
    }

    if (!transactionalDataRemoved) {
      throw new Error("Cleanup verification failed: deleted data remains.");
    }

    console.log("\nProduction cleanup completed and catalog counts are unchanged.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("\nCleanup failed safely. Any transaction was rolled back.");
  console.error(error);
  process.exitCode = 1;
});
