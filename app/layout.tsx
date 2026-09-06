import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  absoluteUrl,
  brandIcon,
  defaultDescription,
  defaultSocialImage,
  siteName,
  siteUrl,
} from "@/lib/seo";
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
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  title: {
    default: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    template: "%s | DotVerse",
  },
  description: defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    description: defaultDescription,
    type: "website",
    url: siteUrl,
    siteName,
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse cosmic streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    description: defaultDescription,
    images: [absoluteUrl(defaultSocialImage)],
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
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify([
                  {
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    name: siteName,
                    url: siteUrl,
                    logo: absoluteUrl(brandIcon),
                    description: defaultDescription,
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    name: siteName,
                    url: siteUrl,
                  },
                ]),
              }}
            />
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
