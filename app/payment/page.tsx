"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";
import PageReveal from "@/components/animations/PageReveal";
import Script from "next/script";

type RazorpayPaymentFailure = {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
  };
};

type RazorpayCheckout = {
  open: () => void;
  close?: () => void;
  on?: (
    event: string,
    handler: (response: RazorpayPaymentFailure) => void,
  ) => void;
};

type RazorpayConstructor = new (
  options: Record<string, unknown>,
) => RazorpayCheckout;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

type CreatedOrder = {
  id: string;
  orderNumber: string;
  raw: Record<string, unknown>;
};

export default function PaymentPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { formData } = useCheckout();

  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "UPI" | "CARD">("COD");

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  const [orderError, setOrderError] =
    useState("");

  const [paymentFailed, setPaymentFailed] =
    useState(false);

  const [createdOrder, setCreatedOrder] =
    useState<CreatedOrder | null>(null);

  const [razorpayReady, setRazorpayReady] =
    useState(false);

  const [razorpayLoadError, setRazorpayLoadError] =
    useState(false);

  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const paymentFailedRef = useRef(false);

  const total = subtotal; // Simplified

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const hasCheckoutDetails =
    formData.email &&
    formData.phone &&
    formData.firstName &&
    formData.lastName &&
    formData.address &&
    formData.city &&
    formData.state &&
    formData.postalCode;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#07040d] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold">Your cart is empty</h1>

          <button
            onClick={() => router.push("/shop")}
            className="mt-8 rounded-full bg-violet-600 px-8 py-4 font-medium transition hover:bg-violet-500"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (!hasCheckoutDetails) {
    return (
      <main className="min-h-screen bg-[#07040d] px-6 py-24 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold">
            Checkout details are incomplete
          </h1>

          <p className="mt-3 text-white/50">
            Please complete your delivery information before continuing.
          </p>

          <button
            onClick={() => router.push("/checkout")}
            className="mt-8 rounded-full bg-violet-600 px-8 py-4 font-medium transition hover:bg-violet-500"
          >
            Back to Checkout
          </button>
        </div>
      </main>
    );
  }

  const createOrderOnce = async (): Promise<CreatedOrder> => {
    if (createdOrder) {
      return createdOrder;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKeyRef.current,
      },
      body: JSON.stringify({
        ...formData,
        paymentMethod,
        items: items.map((item) => ({
          id: item.id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to place order.");
    }

    const order: CreatedOrder = {
      id: data.order.id,
      orderNumber: data.order.orderNumber,
      raw: data.order,
    };

    sessionStorage.setItem(
      `dotverse-order-${order.orderNumber}`,
      JSON.stringify(order.raw),
    );

    setCreatedOrder(order);

    return order;
  };

  const selectPaymentMethod = (
    method: "COD" | "UPI" | "CARD",
  ) => {
    // Prevent switching once a local order exists so repeated clicks or a
    // retry never create a second order or decrement inventory twice.
    if (isPlacingOrder || createdOrder) return;

    setPaymentMethod(method);
    setOrderError("");
    setPaymentFailed(false);
  };

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;

    setIsPlacingOrder(true);
    setOrderError("");
    setPaymentFailed(false);
    paymentFailedRef.current = false;

    try {
      // COD never touches Razorpay and keeps the existing flow.
      if (paymentMethod === "COD") {
        const order = await createOrderOnce();

        clearCart();
        router.push(
          `/order-success?order=${encodeURIComponent(
            order.orderNumber,
          )}`,
        );
        return;
      }

      // Fail fast before creating a local order so an unavailable gateway
      // never leaves an orphan order or unnecessarily decrements inventory.
      if (!razorpayKey) {
        throw new Error(
          "Online payments are not configured yet. Please choose Cash on Delivery.",
        );
      }

      if (razorpayLoadError) {
        throw new Error(
          "Payment gateway failed to load. Please check your connection and try again.",
        );
      }

      const RazorpayConstructor = window.Razorpay;

      if (!razorpayReady || typeof RazorpayConstructor === "undefined") {
        throw new Error(
          "Payment gateway is still loading. Please try again in a moment.",
        );
      }

      const order = await createOrderOnce();

      // Server creates (or reuses) the Razorpay order and owns the amount.
      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok || !paymentData.success) {
        throw new Error(
          paymentData.message || "Failed to initialize payment.",
        );
      }

      const options: Record<string, unknown> = {
        key: razorpayKey,
        amount: paymentData.amount,
        currency: paymentData.currency,
        order_id: paymentData.razorpayOrderId,
        name: "DotVerse",
        description: `Order #${order.orderNumber}`,
        handler: function () {
          // Frontend callback is not authoritative proof of payment. The
          // webhook confirms the order in the database; this only advances
          // the user to the confirmation view.
          clearCart();
          router.push(
            `/order-success?order=${encodeURIComponent(
              order.orderNumber,
            )}`,
          );
        },
        modal: {
          ondismiss: function () {
            setIsPlacingOrder(false);

            if (paymentFailedRef.current) {
              return;
            }

            setOrderError(
              "Payment was cancelled. Your order is saved — you can retry payment.",
            );
          },
        },
        theme: {
          color: "#7c3aed", // violet-600
        },
      };

      let razorpay: RazorpayCheckout;

      try {
        razorpay = new RazorpayConstructor(options);
      } catch (initError) {
        console.error("Razorpay initialization failed:", initError);
        throw new Error(
          "Unable to open the payment window. Please try again.",
        );
      }

      razorpay.on?.(
        "payment.failed",
        function (response: RazorpayPaymentFailure) {
          console.error("Razorpay payment failed:", response?.error);

          paymentFailedRef.current = true;
          setPaymentFailed(true);
          setIsPlacingOrder(false);
          setOrderError(
            response?.error?.description ||
              "Payment failed. No amount was charged. Please try again.",
          );
        },
      );

      razorpay.open();
    } catch (error) {
      console.error("Place order failed:", error);

      setOrderError(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order.",
      );
      setIsPlacingOrder(false);
    }
  };

  const isOnline = paymentMethod !== "COD";

  const gatewayLoading =
    isOnline && !razorpayReady && !razorpayLoadError;

  const orderButtonDisabled =
    isPlacingOrder || gatewayLoading;

  const orderButtonLabel = isPlacingOrder
    ? paymentMethod === "COD"
      ? "PLACING ORDER..."
      : "PROCESSING..."
    : gatewayLoading
      ? "LOADING GATEWAY..."
      : createdOrder && orderError
        ? "RETRY PAYMENT"
        : "PLACE ORDER";

  return (
    <PageReveal>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setRazorpayReady(true)}
        onError={() => {
          setRazorpayReady(false);
          setRazorpayLoadError(true);
        }}
      />
      <main className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="mb-10 text-3xl font-bold">PAYMENT</h1>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Payment form placeholder */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="mb-6 text-lg font-semibold">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => selectPaymentMethod("COD")}
                    disabled={isPlacingOrder || Boolean(createdOrder)}
                    className={`w-full rounded-xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-70 ${
                      paymentMethod === "COD"
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="mt-1 text-sm text-white/50">
                      Pay when your order arrives.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectPaymentMethod("UPI")}
                    disabled={isPlacingOrder || Boolean(createdOrder)}
                    className={`w-full rounded-xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-70 ${
                      paymentMethod === "UPI"
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <p className="font-medium">UPI</p>
                    <p className="mt-1 text-sm text-white/50">
                      Google Pay, PhonePe, Paytm and other UPI apps.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectPaymentMethod("CARD")}
                    disabled={isPlacingOrder || Boolean(createdOrder)}
                    className={`w-full rounded-xl border p-5 text-left transition disabled:cursor-not-allowed disabled:opacity-70 ${
                      paymentMethod === "CARD"
                        ? "border-violet-500 bg-violet-500/10"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <p className="font-medium">
                      Credit / Debit Card
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Visa, Mastercard, RuPay and more.
                    </p>
                  </button>
                </div>
              </div>
            </section>

            {/* Order summary */}
            <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="mb-6 text-lg font-semibold">
                YOUR ORDER
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                                <div
                                  key={`${item.id}-${item.size}-${item.color}`}
                                  className="flex items-center justify-between gap-4"
                                >

                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-white/50">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-white/10" />

              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-white/60">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="my-5 border-t border-white/10" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={orderButtonDisabled}
                className="mt-6 w-full rounded-full bg-violet-600 px-6 py-4 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {orderButtonLabel}
              </button>

              {orderError && (
                <div
                  className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
                    paymentFailed
                      ? "border-red-500/30 bg-red-500/10 text-red-300"
                      : "border-white/10 bg-white/[0.03] text-white/70"
                  }`}
                >
                  {paymentFailed && (
                    <p className="font-semibold text-red-300">
                      Payment failed
                    </p>
                  )}
                  <p className={paymentFailed ? "mt-1" : ""}>
                    {orderError}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.back()}
                disabled={isPlacingOrder}
                className="mt-3 w-full rounded-full border border-white/10 px-6 py-4 text-sm text-white/70 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Back to checkout
              </button>
            </aside>
          </div>
        </div>
      </main>
    </PageReveal>
  );
}
