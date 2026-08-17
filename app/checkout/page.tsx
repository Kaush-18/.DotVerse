"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import PageReveal from "@/components/animations/PageReveal";

type CheckoutForm = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const [formData, setFormData] = useState<CheckoutForm>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PageReveal>
      <Navbar />

      <main className="pt-20 pb-20">
        <Container>
          <h1 className="text-4xl font-bold text-white mb-12">CHECKOUT</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-4">CONTACT</h2>
                <div className="space-y-4">
                  <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
              </div>
              
              <div>
                <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-4">DELIVERY</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white" />
                  <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white" />
                  <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white sm:col-span-2" />
                  <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white" />
                  <input type="text" name="postalCode" placeholder="PIN" value={formData.postalCode} onChange={handleChange} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white" />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5 h-fit sticky top-28">
                <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-6">YOUR ORDER</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex justify-between text-white/80">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <hr className="border-white/10 mb-6" />
                <div className="space-y-4">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>TOTAL</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/payment")}
                    className="w-full py-4 bg-violet-600 rounded-full font-bold text-white mt-6 hover:bg-violet-700 transition-colors"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}
