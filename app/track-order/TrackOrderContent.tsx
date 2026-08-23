"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Package, Search, Truck } from "lucide-react";

import PageReveal from "@/components/animations/PageReveal";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

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

const statuses = [
  {
    key: "PENDING",
    label: "Order Confirmed",
    description: "Your order has been received.",
    icon: Check,
  },
  {
    key: "PROCESSING",
    label: "Processing",
    description: "We're preparing your order.",
    icon: Package,
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    description: "Your order is on its way.",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Your order has been delivered.",
    icon: Check,
  },
];

const statusIndex: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 0,
  PROCESSING: 1,
  SHIPPED: 2,
  DELIVERED: 3,
};

function formatStatus(status: string) {
  return status.toLowerCase().replace(/_/g, " ");
}

export default function TrackOrderContent() {
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedOrderNumber = orderNumber.trim();

    if (!trimmedOrderNumber) {
      setError("Please enter your order number.");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch(
        `/api/orders/${encodeURIComponent(trimmedOrderNumber)}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.order) {
        throw new Error(data.message || "Order not found.");
      }

      setOrder(data.order);
    } catch (requestError) {
      console.error("Track order error:", requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to find this order.",
      );
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = order
    ? statusIndex[order.status] ?? 0
    : -1;

  return (
    <PageReveal>
      <main className="min-h-screen bg-[#05020c] text-white">
        <Container>
          <div className="mx-auto max-w-5xl py-20 md:py-28">

            {/* Header */}

            <section className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-400">
                DotVerse
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
                TRACK YOUR ORDER
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-white/50 md:text-base">
                Enter your DotVerse order number to see the
                latest status of your order.
              </p>
            </section>

            {/* Search */}

            <section className="mx-auto mt-12 max-w-2xl">
              <form
                onSubmit={handleSubmit}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.035]
                  p-3
                  shadow-[0_25px_80px_rgba(0,0,0,.35)]
                  backdrop-blur-xl
                "
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={20}
                      strokeWidth={1.7}
                      className="
                        absolute
                        left-5
                        top-1/2
                        -translate-y-1/2
                        text-white/35
                      "
                    />

                    <input
                      type="text"
                      value={orderNumber}
                      onChange={(event) =>
                        setOrderNumber(event.target.value)
                      }
                      placeholder="DOT-XXXXXXXX-XXXXX"
                      aria-label="Order number"
                      className="
                        h-14
                        w-full
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.04]
                        pl-14
                        pr-5
                        font-mono
                        text-sm
                        text-white
                        outline-none
                        placeholder:text-white/25
                        focus:border-violet-500/60
                        focus:bg-white/[0.06]
                      "
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-14 shrink-0 px-8"
                  >
                    {loading ? "TRACKING..." : "TRACK ORDER"}
                  </Button>
                </div>
              </form>

              {error && (
                <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-center text-sm text-red-300">
                  {error}
                </div>
              )}
            </section>

            {/* Order */}

            {order && (
              <section className="mt-16">

                {/* Order heading */}

                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                    Order Number
                  </p>

                  <h2 className="mt-2 font-mono text-xl font-semibold text-violet-300 md:text-2xl">
                    {order.orderNumber}
                  </h2>

                  <p className="mt-3 text-sm text-white/45">
                    Current status:{" "}
                    <span className="capitalize text-white/75">
                      {formatStatus(order.status)}
                    </span>
                  </p>
                </div>

                {/* Timeline */}

                <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-10">
                  <div className="grid gap-8 md:grid-cols-4">
                    {statuses.map((status, index) => {
                      const Icon = status.icon;

                      const completed =
                        index <= currentIndex;

                      const current =
                        index === currentIndex;

                      return (
                        <div
                          key={status.key}
                          className="relative"
                        >
                          {index < statuses.length - 1 && (
                            <div
                              className={`
                                absolute
                                left-[22px]
                                top-[48px]
                                hidden
                                h-px
                                w-[calc(100%+2rem)]
                                md:block
                                ${
                                  index < currentIndex
                                    ? "bg-violet-500"
                                    : "bg-white/10"
                                }
                              `}
                            />
                          )}

                          <div className="relative z-10 flex flex-col items-center text-center">
                            <div
                              className={`
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                border
                                transition-all
                                duration-500
                                ${
                                  completed
                                    ? "border-violet-400/50 bg-violet-500/15 text-violet-300"
                                    : "border-white/10 bg-white/[0.04] text-white/25"
                                }
                                ${
                                  current
                                    ? "shadow-[0_0_30px_rgba(124,58,237,.3)]"
                                    : ""
                                }
                              `}
                            >
                              <Icon size={18} />
                            </div>

                            <p
                              className={`
                                mt-4
                                text-sm
                                font-semibold
                                ${
                                  completed
                                    ? "text-white"
                                    : "text-white/30"
                                }
                              `}
                            >
                              {status.label}
                            </p>

                            <p className="mt-2 max-w-[150px] text-xs leading-5 text-white/35">
                              {status.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items */}

                <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035]">
                  <div className="border-b border-white/10 px-6 py-5 md:px-8">
                    <h3 className="font-semibold">
                      YOUR ORDER
                    </h3>
                  </div>

                  <div className="divide-y divide-white/10">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-6
                          px-6
                          py-6
                          md:px-8
                        "
                      >
                        <div className="min-w-0">
                          <p className="font-medium">
                            {item.productName}
                          </p>

                          <p className="mt-2 text-sm text-white/40">
                            {item.variantColor} • Size{" "}
                            {item.variantSize} • Qty{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="shrink-0 font-semibold">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}

                <div className="mt-6 grid gap-6 md:grid-cols-2">

                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
                    <h3 className="font-semibold">
                      DELIVERY
                    </h3>

                    <div className="mt-6">
                      <p className="font-medium">
                        {order.firstName} {order.lastName}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white/45">
                        {order.city}, {order.state}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 md:p-8">
                    <h3 className="font-semibold">
                      SUMMARY
                    </h3>

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
                </div>

                {/* Actions */}

                <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={() => router.push("/shop")}
                  >
                    Continue Shopping
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      router.push(
                        `/order-success?order=${encodeURIComponent(
                          order.orderNumber,
                        )}`,
                      )
                    }
                  >
                    View Order Confirmation
                  </Button>
                </div>
              </section>
            )}
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}
