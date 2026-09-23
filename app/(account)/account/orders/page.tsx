import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  CircleDot,
  Clock3,
  Package,
  Truck,
  X,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const money = formatPrice;

const statusDetails = {
  PENDING: { icon: Clock3, label: "Pending" },
  CONFIRMED: { icon: Check, label: "Confirmed" },
  PROCESSING: { icon: Package, label: "Processing" },
  SHIPPED: { icon: Truck, label: "Shipped" },
  DELIVERED: { icon: Check, label: "Delivered" },
  CANCELLED: { icon: X, label: "Cancelled" },
} as const;

function getStatusDetails(status: string) {
  return statusDetails[status as keyof typeof statusDetails] ?? {
    icon: CircleDot,
    label: status,
  };
}

function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/account/orders");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      createdAt: true,
      status: true,
      total: true,
      items: { select: { productName: true, quantity: true } },
    },
  });

  return (
    <div className="dot-orders-page">
      <header className="dot-orders-header">
        <div>
          <p className="dot-orders-kicker">.DOT / ORDER ARCHIVE</p>
          <h1>
            YOUR
            <br />
            <em>COLLECTION.</em>
          </h1>
          <p className="dot-orders-intro">
            Your purchases, collected in one place.
          </p>
        </div>
        <div className="dot-orders-index" aria-hidden="true">
          <span>PRIVATE RECORD</span>
          <strong>{String(orders.length).padStart(2, "0")}</strong>
          <span>ORDERS</span>
        </div>
      </header>

      <section className="dot-orders-history" aria-labelledby="order-history-heading">
        <div className="dot-orders-section-label">
          <span>01</span>
          <span id="order-history-heading">Order history</span>
        </div>

        {orders.length === 0 ? (
          <div className="dot-orders-empty">
            <p className="dot-orders-eyebrow">Order archive</p>
            <h2>NO ORDERS YET</h2>
            <p>Your collection starts here.</p>
            <Link href="/shop" className="dot-orders-shop-link">
              Explore .DOT <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="dot-orders-list">
            {orders.map((order, index) => {
              const status = getStatusDetails(order.status);
              const StatusIcon = status.icon;
              const itemCount = order.items.reduce(
                (sum, item) => sum + item.quantity,
                0,
              );
              const itemNames = order.items
                .slice(0, 2)
                .map((item) => item.productName)
                .join(" / ");
              const remainingItems = order.items.length - 2;

              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${encodeURIComponent(order.orderNumber)}`}
                  className="dot-order-row"
                  style={{ "--order-index": index } as React.CSSProperties}
                  aria-label={`View order ${order.orderNumber}, ${status.label}, ${itemCount} items, ${money(order.total)}`}
                >
                  <span className="dot-order-number">{order.orderNumber}</span>
                  <span className="dot-order-date">
                    {formatOrderDate(order.createdAt)}
                  </span>
                  <span className={`dot-order-status dot-order-status-${order.status.toLowerCase()}`}>
                    <StatusIcon size={14} strokeWidth={1.7} aria-hidden="true" />
                    <span>{status.label}</span>
                  </span>
                  <span className="dot-order-items">
                    <strong>
                      {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
                    </strong>
                    <span>
                      {itemNames}
                      {remainingItems > 0 ? ` +${remainingItems}` : ""}
                    </span>
                  </span>
                  <span className="dot-order-total">{money(order.total)}</span>
                  <span className="dot-order-view">
                    View order <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
