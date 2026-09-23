import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CreditCard, MapPin, ReceiptText } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import CancelOrderButton from "@/components/account/CancelOrderButton";
import CopyOrderNumber from "@/components/account/CopyOrderNumber";
import OrderTimeline from "@/components/account/OrderTimeline";
import { isOrderOwnedByUser } from "@/lib/account-authorization";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { headers } from "next/headers";

const money = formatPrice;

function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

function formatPaymentMethod(method: string) {
  return method === "COD" ? "Cash on delivery" : method;
}

function formatPaymentStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect(`/login?redirect=/account/orders/${encodeURIComponent(orderNumber)}`);
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      orderNumber: true,
      createdAt: true,
      status: true,
      paymentStatus: true,
      paymentMethod: true,
      subtotal: true,
      shipping: true,
      total: true,
      firstName: true,
      lastName: true,
      address: true,
      apartment: true,
      city: true,
      state: true,
      postalCode: true,
      phone: true,
      email: true,
      cancelledAt: true,
      userId: true,
      items: {
        select: {
          id: true,
          productName: true,
          variantSize: true,
          variantColor: true,
          price: true,
          quantity: true,
        },
      },
    },
  });

  if (!order || !isOrderOwnedByUser(order.userId, session.user.id)) notFound();

  const canCancel =
    order.paymentStatus !== "PAID" &&
    ["PENDING", "CONFIRMED", "PROCESSING"].includes(order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="dot-order-detail">
      <Link href="/account/orders" className="dot-order-back">
        <ArrowLeft size={14} aria-hidden="true" />
        Back to orders
      </Link>

      <header className="dot-order-detail-header">
        <div>
          <p className="dot-order-detail-kicker">.DOT / ORDER DETAIL</p>
          <h1>
            ORDER <em>{order.orderNumber}</em>
          </h1>
          <div className="dot-order-detail-meta">
            <span>Placed {formatOrderDate(order.createdAt)}</span>
            <span aria-hidden="true">/</span>
            <span>
              {itemCount} {itemCount === 1 ? "piece" : "pieces"}
            </span>
          </div>
          <CopyOrderNumber orderNumber={order.orderNumber} />
        </div>
        <div className="dot-order-detail-record" aria-hidden="true">
          <span>PRIVATE PURCHASE RECORD</span>
          <strong>01</strong>
          <span>{order.status}</span>
        </div>
      </header>

      <div className="dot-order-detail-layout">
        <main className="dot-order-detail-main">
          <section className="dot-order-status-section" aria-labelledby="order-status-heading">
            <div className="dot-order-detail-label">
              <span>01</span>
              <span id="order-status-heading">Order status</span>
            </div>
            <OrderTimeline
              status={order.status}
              createdAt={order.createdAt}
              cancelledAt={order.cancelledAt}
            />
          </section>

          <section className="dot-order-items-section" aria-labelledby="order-items-heading">
            <div className="dot-order-detail-label">
              <span>02</span>
              <span id="order-items-heading">Purchased pieces</span>
            </div>
            <div className="dot-order-items-list">
              {order.items.map((item, index) => (
                <article
                  key={item.id}
                  className="dot-order-item"
                  style={{ "--item-index": index } as React.CSSProperties}
                >
                  <div className="dot-order-item-index">0{index + 1}</div>
                  <div className="dot-order-item-copy">
                    <h2>{item.productName}</h2>
                    <p>
                      {item.variantColor} <span aria-hidden="true">/</span> Size {item.variantSize}
                    </p>
                    <span>Quantity {item.quantity}</span>
                  </div>
                  <div className="dot-order-item-price">
                    <span>{money(item.price)} each</span>
                    <strong>{money(item.price * item.quantity)}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="dot-order-delivery-section" aria-labelledby="order-delivery-heading">
            <div className="dot-order-detail-label">
              <span>03</span>
              <span id="order-delivery-heading">Delivery</span>
            </div>
            <div className="dot-order-detail-panel dot-order-delivery-panel">
              <MapPin size={18} aria-hidden="true" />
              <div>
                <h2>{order.firstName} {order.lastName}</h2>
                <address>
                  {order.address}
                  {order.apartment && <><br />{order.apartment}</>}
                  <br />{order.city}, {order.state} {order.postalCode}
                </address>
                <p>{order.phone}</p>
              </div>
            </div>
          </section>
        </main>

        <aside className="dot-order-detail-aside">
          <section className="dot-order-summary" aria-labelledby="order-summary-heading">
            <div className="dot-order-detail-label">
              <span>04</span>
              <span id="order-summary-heading">Order summary</span>
            </div>
            <dl>
              <div><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
              <div><dt>Shipping</dt><dd>{order.shipping ? money(order.shipping) : "Free"}</dd></div>
              <div className="dot-order-total-row"><dt>Total</dt><dd>{money(order.total)}</dd></div>
            </dl>
          </section>

          <section className="dot-order-payment" aria-labelledby="order-payment-heading">
            <div className="dot-order-detail-label">
              <span>05</span>
              <span id="order-payment-heading">Payment</span>
            </div>
            <div className="dot-order-payment-content">
              <CreditCard size={18} aria-hidden="true" />
              <div>
                <strong>{formatPaymentMethod(order.paymentMethod)}</strong>
                <span>{formatPaymentStatus(order.paymentStatus)}</span>
              </div>
            </div>
          </section>

          <section className="dot-order-actions" aria-labelledby="order-actions-heading">
            <div className="dot-order-detail-label">
              <span>06</span>
              <span id="order-actions-heading">Order actions</span>
            </div>
            <div className="dot-order-action-list">
              <Link href="/shop" className="dot-order-action dot-order-action-primary">
                Continue shopping <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
              <Link
                href={`/order-success?order=${encodeURIComponent(order.orderNumber)}`}
                className="dot-order-action"
              >
                View confirmation <ReceiptText size={15} aria-hidden="true" />
              </Link>
              {canCancel && <CancelOrderButton orderNumber={order.orderNumber} />}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
