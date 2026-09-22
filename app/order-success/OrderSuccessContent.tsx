"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Copy, LockKeyhole } from "lucide-react";
import PageReveal from "@/components/animations/PageReveal";

type OrderItem = {
  id: string;
  productName: string;
  variantSize: string;
  variantColor: string;
  price: number;
  quantity: number;
};

// A full order as returned by the authenticated endpoint. Guests never see these
// optional (PII-bearing) fields.
type Order = {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  address?: string;
  apartment?: string | null;
  postalCode?: string;
  phone?: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
  inventoryExceptionAt?: string | null;
};

// The minimal, PII-free status snapshot exposed to guests through the unauthenticated
// /status endpoint. It never contains customer detail, items, IDs, or Razorpay IDs.
type OrderStatusSnapshot = {
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  inventoryExceptionAt: string | null;
};

const PENDING_POLL_INTERVAL_MS = 5000;

export default function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyOrderNumber = async () => {
    if (!orderNumber || !navigator.clipboard) return;
    await navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  // Initial load: authenticated users get the full order; guests (or a stale auth
  // order) fall back to the minimal status endpoint so the page can still reflect the
  // authoritative payment state without exposing any customer PII.
  useEffect(() => {
    let cancelled = false;

    if (!orderNumber) {
      router.replace("/");
      return;
    }

    const fetchFullOrder = async () => {
      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(orderNumber)}`,
          { cache: "no-store" },
        );

        const data = await response.json();

        if (!cancelled && response.ok && data.success && data.order) {
          setOrder(data.order as Order);
          return true;
        }

        return false;
      } catch {
        return false;
      }
    };

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(orderNumber)}/status`,
          { cache: "no-store" },
        );

        const data = await response.json();

        if (!cancelled && response.ok && data.success && data.order) {
          return { found: true, snapshot: data.order as OrderStatusSnapshot };
        }
      } catch {
        // fall through
      }

      return { found: false, snapshot: null };
    };

    (async () => {
      const hasFull = await fetchFullOrder();

      if (hasFull) {
        // A cached copy (from the payment flow) can still surface detail that the
        // authenticated endpoint could not (for example an unauthenticated session).
        const cached = sessionStorage.getItem(
          `dotverse-order-${orderNumber}`,
        );

        if (cached && !cancelled) {
          const parsed = JSON.parse(cached) as Order;
          setOrder((current) => current ?? parsed);
        }

        if (!cancelled) setLoading(false);
        return;
      }

      const cached = sessionStorage.getItem(`dotverse-order-${orderNumber}`);

      if (cached) {
        const parsed = JSON.parse(cached) as Order;
        setOrder(parsed);
      }

      // For guests (no session) or when the full endpoint 404s, recover the
      // payment/order state from the minimal status endpoint. This produces a
      // state-only view with no customer PII. Cached data takes precedence so
      // the status fallback only applies when no cached full order is available.
      if (!cached) {
        const statusResult = await fetchStatus();

        if (!cancelled && statusResult.found && statusResult.snapshot) {
          const snapshot = statusResult.snapshot;
          setOrder({
            id: "",
            orderNumber,
            firstName: "",
            lastName: "",
            city: "",
            state: "",
            subtotal: 0,
            shipping: 0,
            total: 0,
            status: snapshot.status,
            paymentStatus: snapshot.paymentStatus,
            paymentMethod: snapshot.paymentMethod,
            items: [],
            createdAt: "",
            inventoryExceptionAt: snapshot.inventoryExceptionAt,
          });
        }
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [orderNumber, router]);

  const awaitingPayment =
    order != null &&
    order.paymentMethod !== "COD" &&
    order.paymentStatus !== "PAID" &&
    order.paymentStatus !== "FAILED";

  // Polls the minimal status endpoint while a payment is still in flight. The
  // webhook is the sole authoritative source of payment state; this only reflects it.
  useEffect(() => {
    if (!orderNumber || !awaitingPayment) {
      return;
    }

    let cancelled = false;

    const poll = async () => {
      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(orderNumber)}/status`,
          { cache: "no-store" },
        );

        const data = await response.json();

        if (cancelled || !response.ok || !data.success || !data.order) {
          return;
        }

        const snapshot = data.order as OrderStatusSnapshot;

        setOrder((current) =>
          current
            ? {
                ...current,
                status: snapshot.status,
                paymentStatus: snapshot.paymentStatus,
                paymentMethod: snapshot.paymentMethod,
                inventoryExceptionAt: snapshot.inventoryExceptionAt,
              }
            : {
                id: "",
                orderNumber: orderNumber,
                firstName: "",
                lastName: "",
                city: "",
                state: "",
                subtotal: 0,
                shipping: 0,
                total: 0,
                status: snapshot.status,
                paymentStatus: snapshot.paymentStatus,
                paymentMethod: snapshot.paymentMethod,
                items: [],
                createdAt: "",
                inventoryExceptionAt: snapshot.inventoryExceptionAt,
              },
        );
      } catch (error) {
        console.error("Error polling order status:", error);
      }
    };

    void poll();

    const interval = setInterval(poll, PENDING_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [orderNumber, awaitingPayment]);

  if (loading) {
    return <main className="dot-success-page"><div className="dot-success-loading"><span className="dot-success-loading-mark" /><p>Retrieving your order</p></div></main>;
  }

  if (!order) {
    return (
      <main className="dot-success-page"><div className="dot-success-fallback"><p className="dot-success-kicker">.DOT / ORDER STATUS</p><h1>ORDER DETAILS<br /><em>UNAVAILABLE.</em></h1><p>We couldn&apos;t verify the details for this order. You can return to the collection or track a purchase with its order number.</p><div className="dot-success-actions"><button type="button" onClick={() => router.push("/track-order")} className="dot-success-primary">Track order <ArrowRight size={15} /></button><button type="button" onClick={() => router.push("/shop")} className="dot-success-secondary">Continue shopping</button></div>
        </div>
      </main>
    );
  }

  const isOnline = order.paymentMethod !== "COD";
  const paymentConfirmed = order.paymentStatus === "PAID";
  const paymentFailed = order.paymentStatus === "FAILED";
  const inventoryException =
    isOnline && paymentConfirmed && Boolean(order.inventoryExceptionAt);
  const awaitingConfirmation =
    isOnline && !paymentConfirmed && !paymentFailed && !inventoryException;
  const orderConfirmed = !isOnline || (paymentConfirmed && !inventoryException);

  // Guests only ever hold a state-only view (empty PII/detail fields), so we can
  // render the safe confirmation layout without leaking customer order content.
  const isGuestView = order.items?.length === 0;

  const heading = paymentFailed
    ? "PAYMENT FAILED"
    : inventoryException
      ? "ACTION REQUIRED"
      : orderConfirmed
        ? "ORDER CONFIRMED"
        : "ORDER PLACED";

  const description = paymentFailed
    ? "We couldn't confirm your payment for this order. No amount was charged. You can retry payment from the payment page."
    : inventoryException
      ? "Your payment was received, but one or more items are no longer available. Our team will contact you to arrange a replacement or refund."
      : orderConfirmed
        ? "Your order has been successfully placed."
        : "Your order has been received. We're confirming your payment with the payment provider — this can take a moment.";

  return <PageReveal><main className="dot-success-page"><div className="dot-success-container"><section className={`dot-success-hero ${paymentFailed || inventoryException ? "is-alert" : ""}`}><div className="dot-success-mark" aria-hidden="true">{paymentFailed || inventoryException ? "!" : awaitingConfirmation ? "…" : <Check size={34} />}</div><p className="dot-success-kicker">.DOT / PURCHASE JOURNEY</p><h1>{heading}</h1><p className="dot-success-description">{!isGuestView && orderConfirmed && order.firstName && <>Thank you for your purchase, <strong>{order.firstName}</strong>. </>}{description}</p><div className="dot-success-order-number"><span>Order number</span><strong>{order.orderNumber}</strong><button type="button" onClick={copyOrderNumber} aria-label="Copy order number"><Copy size={14} />{copied ? "Copied" : "Copy"}</button></div></section><section className="dot-success-meta" aria-label="Order status"><div><span>Order status</span><strong>{order.status}</strong></div><div><span>Payment method</span><strong>{order.paymentMethod}</strong></div><div><span>Payment status</span><strong>{order.paymentStatus}</strong></div></section>{!isGuestView && order.items?.length > 0 && <section className="dot-success-order"><div className="dot-success-section-heading"><h2>YOUR ORDER</h2><span>01 / ITEMS</span></div><div className="dot-success-items">{order.items.map((item) => <div className="dot-success-item" key={item.id}><div className="dot-success-item-image"><span aria-hidden="true">.DOT</span></div><div><strong>{item.productName}</strong><span>{item.variantColor} / Size {item.variantSize} / Qty {item.quantity}</span></div><b>₹{(item.price * item.quantity).toLocaleString("en-IN")}</b></div>)}</div></section>}{!isGuestView && order.firstName && <section className="dot-success-details"><div><p className="dot-success-kicker">02 / DELIVERY</p><h2>Delivering to</h2><p className="dot-success-address"><strong>{order.firstName} {order.lastName}</strong>{order.address && <>{order.address}{order.apartment ? `, ${order.apartment}` : ""}</>}{order.city}, {order.state} {order.postalCode}{order.phone && order.phone}</p></div><div><p className="dot-success-kicker">03 / SUMMARY</p><h2>Order total</h2><div className="dot-success-totals"><span>Subtotal <b>₹{order.subtotal.toLocaleString("en-IN")}</b></span><span>Shipping <b>{order.shipping === 0 ? "FREE" : `₹${order.shipping.toLocaleString("en-IN")}`}</b></span><strong>Total <b>₹{order.total.toLocaleString("en-IN")}</b></strong></div></div></section>}<section className="dot-success-actions"><button type="button" onClick={() => router.push("/track-order")} className="dot-success-primary">Track order <ArrowRight size={15} /></button><button type="button" onClick={() => router.push("/shop")} className="dot-success-secondary">Continue shopping</button></section><div className="dot-success-trust"><LockKeyhole size={15} /> Your order status reflects the latest available order information.</div></div></main></PageReveal>;
}
