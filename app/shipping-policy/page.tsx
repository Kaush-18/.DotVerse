import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shipping Policy | DotVerse",
  description: "Shipping policy for DotVerse Clothing Brand.",
  alternates: { canonical: absoluteUrl("/shipping-policy") },
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
      <div className="space-y-4">
        <p>- DotVerse currently ships within India.</p>
        <p>- Shipping is free.</p>
        <p>- Orders are processed within 1–7 days.</p>
        <p>- Shipping carrier is currently not specified.</p>
      </div>
    </div>
  );
}
