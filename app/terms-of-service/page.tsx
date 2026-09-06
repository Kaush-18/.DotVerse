import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service | DotVerse",
  description: "Terms of service for DotVerse Clothing Brand.",
  alternates: { canonical: absoluteUrl("/terms-of-service") },
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-4">
        <p>These Terms of Service govern your use of the DotVerse website and your purchase of products.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Use of Website</h2>
        <p>You agree to use this website for lawful purposes only and in a way that does not infringe the rights of, restrict, or inhibit anyone else&apos;s use and enjoyment of the website.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Products and Orders</h2>
        <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Pricing and Payment</h2>
        <p>Prices for our products are subject to change without notice. We accept various payment methods, including Cash on Delivery.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Intellectual Property</h2>
        <p>The content on this website, including text, graphics, and logos, is the property of DotVerse and is protected by intellectual property laws.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Limitation of Liability</h2>
        <p>DotVerse is not liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our website or products.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Jurisdiction</h2>
        <p>These terms are governed by the laws of India, with jurisdiction in Farrukhabad, Uttar Pradesh.</p>
      </div>
    </div>
  );
}
