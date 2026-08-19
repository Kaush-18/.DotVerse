"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";
import Container from "@/components/layout/Container";
import Navbar from "@/components/layout/Navbar";
import PageReveal from "@/components/animations/PageReveal";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { formData, setFormData } = useCheckout();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinue = () => {
    if (
      !formData.email ||
      !formData.phone ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      alert("Please complete all required checkout details.");
      return;
    }

    router.push("/payment");
  };

  return (
    <PageReveal>
      <Navbar />

      <main className="pt-20 pb-20">
        <Container>
          <h1 className="mb-12 text-4xl font-bold text-white">
            CHECKOUT
          </h1>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="space-y-8 lg:col-span-2">
              {/* Contact */}
              <div>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-violet-400">
                  CONTACT
                </h2>

                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500"
                  />
                </div>
              </div>

              {/* Delivery */}
              <div>
                <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-violet-400">
                  DELIVERY
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500"
                  />

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500 sm:col-span-2"
                  />

                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment || ""}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500 sm:col-span-2"
                  />

                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500"
                  />

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500"
                  />

                  <input
                    type="text"
                    name="postalCode"
                    placeholder="PIN code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white outline-none transition focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 h-fit rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-violet-400">
                  YOUR ORDER
                </h2>

                <div className="mb-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}-${item.color}`}
                      className="flex justify-between gap-4 text-white/80"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <span className="shrink-0">
                        ₹
                        {(
                          item.price * item.quantity
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="mb-6 border-white/10" />

                <div className="space-y-4">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-white/60">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-white">
                    <span>TOTAL</span>
                    <span>
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="mt-6 w-full rounded-full bg-violet-600 py-4 font-bold text-white transition-colors hover:bg-violet-700"
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