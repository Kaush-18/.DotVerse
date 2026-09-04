import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dotverse.store"),
  title: {
    default: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    template: "%s | DotVerse",
  },
  description:
    "Explore DotVerse, a premium streetwear brand inspired by space, cosmos, and futuristic design. Discover unique, high-quality apparel for the modern explorer.",
  alternates: {
    canonical: "https://dotverse.store",
  },
  openGraph: {
    title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    description:
      "Explore DotVerse, a premium streetwear brand inspired by space, cosmos, and futuristic design. Discover unique, high-quality apparel for the modern explorer.",
    type: "website",
    url: "https://dotverse.store",
    siteName: "DotVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    description:
      "Explore DotVerse, a premium streetwear brand inspired by space, cosmos, and futuristic design. Discover unique, high-quality apparel for the modern explorer.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07070b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen" suppressHydrationWarning>
        <CheckoutProvider>
          <CartProvider>
            <Navbar />
            <main className="site-content w-full min-w-0">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </CheckoutProvider>
      </body>
    </html>
  );
}
