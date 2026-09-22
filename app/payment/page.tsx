"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from "lucide-react";
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
  guestPaymentToken?: string;
  raw: Record<string, unknown>;
};

type PendingCheckout = {
  fingerprint: string;
  idempotencyKey: string;
  paymentMethod: "COD" | "UPI" | "CARD";
  order: CreatedOrder | null;
};

const PENDING_CHECKOUT_STORAGE_KEY = "dotverse-pending-checkout";

function checkoutFingerprint(
  items: { id: string; size: string; color: string; quantity: number }[],
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  },
): string {
  const cart = items
    .map((item) => `${item.id}:${item.size}:${item.color}:${item.quantity}`)
    .sort()
    .join("|");

  const details = [
    formData.email,
    formData.phone,
    formData.firstName,
    formData.lastName,
    formData.address,
    formData.apartment ?? "",
    formData.city,
    formData.state,
    formData.postalCode,
  ].join("|");

  return `${cart}::${details}`;
}

function readPendingCheckout(): PendingCheckout | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(PENDING_CHECKOUT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PendingCheckout) : null;
  } catch {
    return null;
  }
}

function clearPendingCheckout(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(PENDING_CHECKOUT_STORAGE_KEY);
}

export default function PaymentPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { formData } = useCheckout();

  const fingerprint = useMemo(
    () =>
      checkoutFingerprint(
        items.map((item) => ({
          id: item.id,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        formData,
      ),
    [items, formData],
  );

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

  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());
  const restoredRef = useRef(false);

  // Restore an in-flight checkout after a refresh so the same order (and its
  // inventory reservation) is reused instead of a duplicate being created.
  // Deferred to an effect to avoid a static-prerender/hydration mismatch.
  useEffect(() => {
    if (restoredRef.current) {
      return;
    }
    restoredRef.current = true;

    const pending = readPendingCheckout();

    if (!pending || pending.fingerprint !== fingerprint) {
      return;
    }

    idempotencyKeyRef.current = pending.idempotencyKey;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPaymentMethod(pending.paymentMethod);

    if (pending.order) {
      setCreatedOrder(pending.order);
    }
  }, [fingerprint]);

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

    sessionStorage.setItem(
      PENDING_CHECKOUT_STORAGE_KEY,
      JSON.stringify({
        fingerprint,
        idempotencyKey: idempotencyKeyRef.current,
        paymentMethod,
        order: null,
      } satisfies PendingCheckout),
    );

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
      guestPaymentToken: data.order.guestPaymentToken,
      raw: data.order,
    };

    sessionStorage.setItem(
      `dotverse-order-${order.orderNumber}`,
      JSON.stringify(order.raw),
    );

    // Reuse this exact order if the page is refreshed or payment is retried.
    sessionStorage.setItem(
      PENDING_CHECKOUT_STORAGE_KEY,
      JSON.stringify({
        fingerprint,
        idempotencyKey: idempotencyKeyRef.current,
        paymentMethod,
        order,
      } satisfies PendingCheckout),
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

        clearPendingCheckout();
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
        body: JSON.stringify({
          orderId: order.id,
          guestPaymentToken: order.guestPaymentToken,
        }),
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
          clearPendingCheckout();
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
      <main className="dot-payment-page">
        <div className="dot-payment-container">
          <header className="dot-payment-header">
            <div><p className="dot-payment-kicker">.DOT / SECURE CHECKOUT</p><h1>PAY<br /><em>SECURELY.</em></h1></div>
            <div className="dot-payment-progress"><span>01 Information</span><i aria-hidden="true" /><span>02 Delivery</span><i aria-hidden="true" /><strong>03 Payment</strong></div>
          </header>

          <div className="dot-payment-layout">
            <section className="dot-payment-methods" aria-labelledby="payment-method-heading">
              <div className="dot-payment-section-heading"><span>01</span><div><p>Payment method</p><h2 id="payment-method-heading">Choose how to pay.</h2></div></div>
              <div className="dot-payment-method-list" role="radiogroup" aria-label="Payment method">
                {([
                  ["COD", "Cash on Delivery", "Pay when your order arrives.", "COD"],
                  ["UPI", "UPI", "Google Pay, PhonePe, Paytm and other UPI apps.", "ONLINE PAYMENT"],
                  ["CARD", "Credit / Debit Card", "Visa, Mastercard, RuPay and more.", "ONLINE PAYMENT"],
                ] as const).map(([method, title, description, label]) => (
                  <button key={method} type="button" role="radio" aria-checked={paymentMethod === method} onClick={() => selectPaymentMethod(method)} disabled={isPlacingOrder || Boolean(createdOrder)} className={`dot-payment-method ${paymentMethod === method ? "is-selected" : ""}`}>
                    <span className="dot-payment-method-mark" aria-hidden="true">{paymentMethod === method ? <Check size={14} /> : null}</span><span className="dot-payment-method-copy"><small>{label}</small><strong>{title}</strong><span>{description}</span></span><ArrowRight className="dot-payment-method-arrow" size={16} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div className="dot-payment-action-block"><div className="dot-payment-action-label"><span>02</span><div><p>Final step</p><h2>{paymentMethod === "COD" ? "Place your order." : "Open secure payment."}</h2></div></div><button type="button" onClick={handlePlaceOrder} disabled={orderButtonDisabled} className="dot-payment-primary">{isPlacingOrder ? <><span className="dot-payment-spinner" aria-hidden="true" />{paymentMethod === "COD" ? "Placing order..." : "Processing payment..."}</> : gatewayLoading ? "Loading gateway..." : createdOrder && orderError ? "Retry payment" : paymentMethod === "COD" ? "Place order" : "Pay securely"}<ArrowRight size={16} aria-hidden="true" /></button>{orderError && <div className={`dot-payment-error ${paymentFailed ? "is-failed" : ""}`} role="alert">{paymentFailed && <strong>Payment failed</strong>}<span>{orderError}</span></div>}</div>
              <div className="dot-payment-trust"><LockKeyhole size={16} aria-hidden="true" /><div><strong>Secure payment</strong><span>Your payment is handled through the existing secure payment provider.</span></div></div>
              <button type="button" onClick={() => router.back()} disabled={isPlacingOrder} className="dot-payment-back"><ArrowLeft size={14} /> Back to checkout</button>
            </section>

            <aside className="dot-payment-summary" aria-labelledby="payment-summary-heading"><div className="dot-payment-summary-inner"><p className="dot-payment-kicker">02 / YOUR ORDER</p><h2 id="payment-summary-heading">ORDER SUMMARY</h2><div className="dot-payment-items">{items.map((item) => <div className="dot-payment-item" key={`${item.id}-${item.size}-${item.color}`}><div className="dot-payment-item-image"><Image src={item.image} alt={`${item.name} by DotVerse`} fill sizes="58px" /></div><div><p>{item.name}</p><span>{item.color} / {item.size} × {item.quantity}</span></div><strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong></div>)}</div><div className="dot-payment-totals"><div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div><div><span>Shipping</span><strong>Free</strong></div><div className="dot-payment-total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div></div></div></aside>
          </div>
        </div>
      </main>
    </PageReveal>
  );
}
