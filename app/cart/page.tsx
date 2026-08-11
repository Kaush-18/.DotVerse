"use client";

import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import Image from "next/image";

import { useCart } from "@/context/CartContext";
import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import PageReveal from "@/components/animations/PageReveal";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <PageReveal>
      <Navbar />

      <main className="pt-20 pb-20">
        <Container>
          <h1 className="text-4xl font-bold text-white mb-8">CART</h1>

          {items.length === 0 ? (
            <div className="text-white/60">
              Your cart is empty.{" "}
              <Link href="/shop" className="text-violet-400 underline">
                Go shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}-${item.color}`}
                    className="flex gap-4 p-4 rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{item.name}</h3>
                      <p className="text-sm text-white/60">
                        {item.color} / {item.size}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="p-1 rounded-full bg-white/10"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="p-1 rounded-full bg-white/10"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="ml-auto text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-white">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 h-fit">
                <h2 className="text-xl font-bold text-white mb-6">ORDER SUMMARY</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Shipping</span>
                    <span className="text-white">Free</span>
                  </div>
                  <hr className="border-white/10" />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-white">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <button className="w-full py-4 bg-violet-600 rounded-full font-bold text-white mt-6">
                    Proceed to checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </PageReveal>
  );
}
