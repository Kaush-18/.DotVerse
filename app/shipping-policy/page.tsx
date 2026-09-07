import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Review DotVerse shipping details, including delivery within India, free shipping, and 1–7 day order processing.",
  alternates: { canonical: absoluteUrl("/shipping-policy") },
  openGraph: {
    title: "Shipping Policy | DotVerse",
    description:
      "Review DotVerse shipping details, including delivery within India, free shipping, and 1–7 day order processing.",
    type: "website",
    url: absoluteUrl("/shipping-policy"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping Policy | DotVerse",
    description:
      "Review DotVerse shipping details, including delivery within India, free shipping, and 1–7 day order processing.",
    images: [absoluteUrl(defaultSocialImage)],
  },
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
