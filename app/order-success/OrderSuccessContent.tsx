"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageReveal from "@/components/animations/PageReveal";
import Loader from "@/components/loader/Loader";

// Define the order interface based on the API response structure
interface OrderItem {
  id: string;
  productName: string;
  variantSize: string;
  variantColor: string;
  price: number;
  quantity: number;
}

interface Order {
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
}

export default function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      router.push("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderNumber}`);
        if (!response.ok) throw new Error("Order not found");
        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, router]);

  if (loading) return <Loader />;
  if (!order) return <div>Order not found.</div>;

  return (
    <PageReveal>
      <main className="mx-auto max-w-2xl px-6 py-20 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">THANK YOU</h1>
          <p className="mt-4 text-white/60">
            Your order <span className="font-mono text-violet-400">{order.orderNumber}</span> has been confirmed.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          <section className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <h2 className="text-lg font-semibold">CUSTOMER</h2>
              <p className="mt-5 font-medium">
                {order.firstName} {order.lastName}
              </p>
              <p className="mt-2 text-sm leading-6 text-white/50">
                {order.city}, {order.state}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <h2 className="text-lg font-semibold">SUMMARY</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>

                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0 ? "FREE" : `₹${order.shipping}`}
                  </span>
                </div>

                <div className="my-4 border-t border-white/10" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="rounded-full bg-violet-600 px-8 py-4 font-semibold transition hover:bg-violet-500"
            >
              Continue Shopping
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-full border border-white/10 px-8 py-4 font-medium text-white/70 transition hover:bg-white/5"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </PageReveal>
  );
}
