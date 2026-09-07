import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage, siteName } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact DotVerse",
  description:
    "Contact DotVerse Clothing Brand by email or phone for support from Farrukhabad, Uttar Pradesh, India.",
  alternates: { canonical: absoluteUrl("/contact") },
  openGraph: {
    title: "Contact DotVerse | DotVerse",
    description:
      "Contact DotVerse Clothing Brand by email or phone for support from Farrukhabad, Uttar Pradesh, India.",
    type: "website",
    url: absoluteUrl("/contact"),
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact DotVerse | DotVerse",
    description:
      "Contact DotVerse Clothing Brand by email or phone for support from Farrukhabad, Uttar Pradesh, India.",
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="space-y-4">
        <p><strong>Dotverse Clothing Brand</strong></p>
        <p><strong>Email:</strong> dotversetshirts@gmail.com</p>
        <p><strong>Phone:</strong> 9599217665</p>
        <p><strong>Location:</strong> Farrukhabad, Uttar Pradesh, India</p>
        <p><strong>Support hours:</strong> 10:00 AM–9:00 PM</p>
      </div>
    </div>
  );
}
