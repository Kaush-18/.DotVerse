import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import Navbar from "@/components/layout/Navbar";
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
    default: "DotVerse — Premium Cosmic & Futuristic Streetwear",
    template: "%s | DotVerse",
  },
  description:
    "Discover premium streetwear inspired by space, cosmos, and futuristic culture. Explore unique cosmic T-shirts and futuristic designs by DotVerse.",
  keywords: ["streetwear", "premium", "fashion", "space", "futuristic", "cosmic"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DotVerse — Premium Cosmic & Futuristic Streetwear",
    description:
      "Discover premium streetwear inspired by space, cosmos, and futuristic culture. Explore unique cosmic T-shirts and futuristic designs by DotVerse.",
    type: "website",
    url: "https://dotverse.store",
    siteName: "DotVerse",
  },
  twitter: {
    card: "summary_large_image",
    title: "DotVerse — Premium Cosmic & Futuristic Streetwear",
    description:
      "Discover premium streetwear inspired by space, cosmos, and futuristic culture. Explore unique cosmic T-shirts and futuristic designs by DotVerse.",
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
          </CartProvider>
        </CheckoutProvider>
      </body>
    </html>
  );
}
