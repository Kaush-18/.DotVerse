"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Container from "@/components/layout/Container";
import PageReveal from "@/components/animations/PageReveal";
import SavedAddresses from "@/components/checkout/SavedAddresses";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";

const requiredFields = ["email", "phone", "firstName", "lastName", "address", "city", "state", "postalCode"] as const;
type RequiredField = (typeof requiredFields)[number];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { formData, setFormData } = useCheckout();
  const [errors, setErrors] = useState<Partial<Record<(typeof requiredFields)[number], string>>>({});
  const [isContinuing, setIsContinuing] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleContinue = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isContinuing) return;

    const nextErrors: typeof errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field].trim()) nextErrors[field] = "Required";
    });
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) nextErrors.email = "Enter a valid email";
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) nextErrors.phone = "Enter a valid phone number";
    if (formData.postalCode && !/^\d{6}$/.test(formData.postalCode)) nextErrors.postalCode = "Enter a valid PIN code";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsContinuing(true);
    router.push("/payment");
  };

  if (items.length === 0) {
    return (
      <PageReveal>
        <main className="dot-checkout-page">
          <Container>
            <section className="dot-checkout-empty">
              <p className="dot-checkout-kicker">.DOT / CHECKOUT</p>
              <h1>Your bag is empty.</h1>
              <p>Return to the collection to find your next piece.</p>
              <Link href="/shop" className="dot-checkout-primary">Continue shopping <ArrowRight size={15} /></Link>
            </section>
          </Container>
        </main>
      </PageReveal>
    );
  }

  const field = (name: keyof typeof formData, label: string, type = "text", className = "") => {
    const fieldError = name === "apartment" ? undefined : errors[name as RequiredField];

    return (
    <label className={`dot-checkout-field ${className}`} htmlFor={`checkout-${name}`}>
      <span>{label}{requiredFields.includes(name as (typeof requiredFields)[number]) ? " *" : ""}</span>
      <input id={`checkout-${name}`} name={name} type={type} value={formData[name] ?? ""} onChange={handleChange} autoComplete={name === "postalCode" ? "postal-code" : name} inputMode={name === "phone" || name === "postalCode" ? "numeric" : undefined} maxLength={name === "postalCode" ? 6 : undefined} aria-invalid={Boolean(fieldError)} aria-describedby={fieldError ? `checkout-${name}-error` : undefined} />
      {fieldError && <small id={`checkout-${name}-error`} role="alert">{fieldError}</small>}
    </label>
    );
  };

  return (
    <PageReveal>
      <main className="dot-checkout-page">
        <Container>
          <header className="dot-checkout-header">
            <div>
              <p className="dot-checkout-kicker">.DOT / CHECKOUT</p>
              <h1>COMPLETE<br /><em>THE EDIT.</em></h1>
            </div>
            <div className="dot-checkout-progress" aria-label="Checkout progress">
              <span className="is-current"><b>01</b> Information</span><i aria-hidden="true" /><span><b>02</b> Delivery</span><i aria-hidden="true" /><span><b>03</b> Payment</span>
            </div>
          </header>

          <div className="dot-checkout-layout">
            <form className="dot-checkout-form" onSubmit={handleContinue} noValidate>
              <section className="dot-checkout-section" aria-labelledby="contact-heading">
                <div className="dot-checkout-section-heading"><span>01</span><div><p>Contact</p><h2 id="contact-heading">Your details</h2></div></div>
                <div className="dot-checkout-fields">{field("email", "Email", "email", "dot-checkout-field-wide")}{field("phone", "Phone number", "tel", "dot-checkout-field-wide")}</div>
              </section>

              <section className="dot-checkout-section" aria-labelledby="delivery-heading">
                <div className="dot-checkout-section-heading"><span>02</span><div><p>Delivery</p><h2 id="delivery-heading">Where should we send it?</h2></div></div>
                <SavedAddresses onSelect={(address) => { setFormData({ ...formData, firstName: address.firstName, lastName: address.lastName, phone: address.phone, address: address.address, apartment: address.apartment || "", city: address.city, state: address.state, postalCode: address.postalCode }); setErrors({}); }} />
                <div className="dot-checkout-fields">
                  {field("firstName", "First name")}{field("lastName", "Last name")}
                  {field("address", "Address", "text", "dot-checkout-field-wide")}{field("apartment", "Apartment, suite, etc. (optional)", "text", "dot-checkout-field-wide")}
                  {field("city", "City")}{field("state", "State")}{field("postalCode", "PIN code")}
                </div>
              </section>

              <button type="submit" className="dot-checkout-continue" disabled={isContinuing}>{isContinuing ? "Opening payment..." : "Continue to payment"}<ArrowRight size={16} /></button>
            </form>

            <aside className="dot-checkout-summary" aria-labelledby="checkout-summary-heading">
              <div className="dot-checkout-summary-inner">
                <p className="dot-checkout-kicker">03 / YOUR ORDER</p>
                <h2 id="checkout-summary-heading">ORDER SUMMARY</h2>
                <div className="dot-checkout-order-items">
                  {items.map((item) => <div className="dot-checkout-order-item" key={`${item.id}-${item.size}-${item.color}`}><div className="dot-checkout-order-image"><Image src={item.image} alt={`${item.name} by DotVerse`} fill sizes="64px" /></div><div><p>{item.name}</p><span>{item.color} / {item.size} × {item.quantity}</span></div><strong>₹{(item.price * item.quantity).toLocaleString("en-IN")}</strong></div>)}
                </div>
                <div className="dot-checkout-totals"><div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div><div><span>Shipping</span><strong>Free</strong></div><div className="dot-checkout-total"><span>Total</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div></div>
                <div className="dot-checkout-trust"><LockKeyhole size={15} /><span>Your payment is handled securely on the next step.</span></div>
              </div>
            </aside>
          </div>
        </Container>
      </main>
    </PageReveal>
  );
}
