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
  title: {
    default: "DotVerse — Premium Streetwear",
    template: "%s | DotVerse",
  },
  description:
    "Minimal premium streetwear inspired by space, innovation, and futuristic culture.",
  keywords: ["streetwear", "premium", "fashion", "space", "futuristic"],
  openGraph: {
    title: "DotVerse — Premium Streetwear",
    description:
      "Minimal premium streetwear inspired by space, innovation, and futuristic culture.",
    type: "website",
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
