import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | DotVerse",
  description: "Get in touch with DotVerse Clothing Brand support.",
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
