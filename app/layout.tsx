import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
