import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy | DotVerse",
  description: "Privacy policy for DotVerse Clothing Brand.",
  alternates: { canonical: absoluteUrl("/privacy-policy") },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-4">
        <p>This Privacy Policy explains how DotVerse Clothing Brand collects, uses, and discloses information from users of our website.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Information We Collect</h2>
        <p>We collect information necessary for order processing, account management, and service functionality. This includes contact details and order information provided during the checkout process.</p>
        
        <h2 className="text-2xl font-semibold mt-6">How We Use Information</h2>
        <p>We use the collected information to fulfill orders, communicate with you regarding your purchases, and improve our services.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Third-Party Services</h2>
        <p>We use Vercel Analytics to understand how visitors interact with our website. Please refer to Vercel&apos;s privacy policy for more information on how they handle data.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Cookies</h2>
        <p>We use cookies to improve your browsing experience. By using our website, you agree to the use of cookies.</p>
        
        <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
        <p>If you have any questions about our privacy policy, please contact us at dotversetshirts@gmail.com.</p>
      </div>
    </div>
  );
}
