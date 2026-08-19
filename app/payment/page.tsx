"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";
import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import PageReveal from "@/components/animations/PageReveal";

export default function PaymentPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { formData } = useCheckout();
  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "UPI" | "CARD">("COD");
  const total = subtotal; // Simplified

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

  return (
    <PageReveal>
      <Navbar />

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
                    onClick={() => setPaymentMethod("COD")}
                    className={`w-full rounded-xl border p-5 text-left transition ${
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
                    onClick={() => setPaymentMethod("UPI")}
                    className={`w-full rounded-xl border p-5 text-left transition ${
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
                    onClick={() => setPaymentMethod("CARD")}
                    className={`w-full rounded-xl border p-5 text-left transition ${
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
                className="mt-6 w-full rounded-full bg-violet-600 px-6 py-4 font-semibold transition hover:bg-violet-500"
              >
                PLACE ORDER
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="mt-3 w-full rounded-full border border-white/10 px-6 py-4 text-sm text-white/70 transition hover:bg-white/5"
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
