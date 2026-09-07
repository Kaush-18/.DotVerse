import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description:
    "Review DotVerse return, exchange, refund, and damaged-item procedures, including the 7-day return window.",
  alternates: { canonical: absoluteUrl("/return-refund-policy") },
  openGraph: {
    title: "Return & Refund Policy | DotVerse",
    description:
      "Review DotVerse return, exchange, refund, and damaged-item procedures, including the 7-day return window.",
    type: "website",
    url: absoluteUrl("/return-refund-policy"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Return & Refund Policy | DotVerse",
    description:
      "Review DotVerse return, exchange, refund, and damaged-item procedures, including the 7-day return window.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Return & Refund Policy</h1>
      <div className="space-y-4">
        <p>- Returns are accepted within 7 days, subject to the stated conditions.</p>
        <p>- Exchanges are allowed.</p>
        <p>- Opened, damaged, or worn products are not eligible for normal return/exchange.</p>
        <p>- DotVerse covers return shipping costs.</p>
        <p>- Refunds are processed within 1–7 business days after the applicable return/refund process is completed.</p>
        <p><strong>Damaged or Incorrect Items:</strong> For damaged or incorrect items, please contact support at dotversetshirts@gmail.com as soon as possible with your order details and photographs so that DotVerse can review the issue and provide the applicable resolution.</p>
      </div>
    </div>
  );
}
