"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageReveal from "@/components/animations/PageReveal";
import Loader from "@/components/loader/Loader";

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
    return <Loader />;
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#07040d] px-6 py-24 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold">ORDER NOT FOUND</h1>

          <p className="mt-4 text-white/50">
            We couldn&apos;t retrieve the details for this order.
          </p>

          <button
            type="button"
            onClick={() => router.push("/shop")}
            className="mt-8 rounded-full bg-violet-600 px-8 py-4 font-semibold transition hover:bg-violet-500"
          >
            Continue Shopping
          </button>
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

  return (
    <PageReveal>
      <main className="min-h-screen bg-[#07040d] px-6 py-16 text-white md:py-24">
        <div className="mx-auto max-w-5xl">

          <section className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10">
              <span className="text-4xl text-violet-300">
                {paymentFailed || inventoryException
                  ? "!"
                  : awaitingConfirmation
                    ? "…"
                    : "✓"}
              </span>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">
              DotVerse
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              {heading}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/50 md:text-base">
              {!isGuestView && orderConfirmed && order.firstName && (
                <>
                  Thank you for your purchase,{" "}
                  <span className="text-white">{order.firstName}</span>.{" "}
                </>
              )}
              {description}
            </p>

            <div className="mt-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/30">
                Order Number
              </p>

              <p className="mt-2 font-mono text-lg font-semibold text-violet-300 md:text-xl">
                {order.orderNumber}
              </p>
            </div>
          </section>

          <section className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Order Status
              </p>
              <p className="mt-3 font-semibold text-violet-300">
                {order.status}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Payment Method
              </p>
              <p className="mt-3 font-semibold">
                {order.paymentMethod}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/35">
                Payment Status
              </p>
              <p className="mt-3 font-semibold text-violet-300">
                {order.paymentStatus}
              </p>
            </div>
          </section>

          {!isGuestView && order.items && order.items.length > 0 && (
            <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
              <div className="border-b border-white/10 px-6 py-5 md:px-8">
                <h2 className="text-lg font-semibold">YOUR ORDER</h2>
              </div>

              <div className="divide-y divide-white/10">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-6 px-6 py-6 md:px-8"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {item.productName}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/45">
                        <span>{item.variantColor}</span>
                        <span>•</span>
                        <span>Size {item.variantSize}</span>
                        <span>•</span>
                        <span>Qty {item.quantity}</span>
                      </div>
                    </div>

                    <p className="shrink-0 font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!isGuestView && order.firstName && (
            <section className="mt-6 grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
                <h2 className="text-lg font-semibold">DELIVERY</h2>

                <div className="mt-6">
                  <p className="font-medium">
                    {order.firstName} {order.lastName}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    {order.city}, {order.state}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
                <h2 className="text-lg font-semibold">ORDER SUMMARY</h2>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-white/45">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>

                  <div className="flex justify-between text-white/45">
                    <span>Shipping</span>
                    <span>
                      {order.shipping === 0
                        ? "FREE"
                        : `₹${order.shipping}`}
                    </span>
                  </div>

                  <div className="my-4 border-t border-white/10" />

                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="text-violet-300">
                      ₹{order.total}
                    </span>
                  </div>
                </div>
              </div>

            </section>
          )}

          <section className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="w-full rounded-full bg-violet-600 px-8 py-4 font-semibold transition hover:bg-violet-500 sm:w-auto"
            >
              Continue Shopping
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full rounded-full border border-white/10 px-8 py-4 font-medium text-white/65 transition hover:bg-white/5 hover:text-white sm:w-auto"
            >
              Back to Home
            </button>
          </section>

        </div>
      </main>
    </PageReveal>
  );
}
