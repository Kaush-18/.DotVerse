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
};

export default function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      router.replace("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(orderNumber)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Order not found");
        }

        const data = await response.json();

        if (!data.success || !data.order) {
          throw new Error(data.message || "Order not found");
        }

        setOrder(data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, [orderNumber, router]);

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

  return (
    <PageReveal>
      <main className="min-h-screen bg-[#07040d] px-6 py-16 text-white md:py-24">
        <div className="mx-auto max-w-5xl">

          <section className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-violet-400/30 bg-violet-500/10">
              <span className="text-4xl text-violet-300">✓</span>
            </div>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">
              DotVerse
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
              ORDER CONFIRMED
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/50 md:text-base">
              Thank you for your purchase,{" "}
              <span className="text-white">{order.firstName}</span>.
              Your order has been successfully placed.
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

          <section className="mt-6 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <h2 className="text-lg font-semibold">DELIVERY</h2>

              <div className="mt-6">
                <p className="font-medium">
                  {order.firstName} {order.lastName}
                </p>

                <p className="mt-2 text-sm leading-6 text-white/50">
                  {order.city}, {order.state}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
              <h2 className="text-lg font-semibold">
                ORDER SUMMARY
              </h2>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>

                <div className="flex justify-between text-white/50">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0
                      ? "FREE"
                      : `₹${order.shipping}`}
                  </span>
                </div>

                <div className="my-5 border-t border-white/10" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-bold text-violet-300">
                    ₹{order.total}
                  </span>
                </div>
              </div>
            </div>

          </section>

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
