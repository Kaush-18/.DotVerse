import type { Metadata } from "next";
import { absoluteUrl, defaultDescription, defaultSocialImage, siteUrl } from "@/lib/seo";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
  description: defaultDescription,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    description: defaultDescription,
    url: siteUrl,
    siteName: "DotVerse",
    locale: "en_US",
    type: "website",
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse cosmic streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    description: defaultDescription,
    images: [absoluteUrl(defaultSocialImage)],
  },
};

export default function Home() {
  return (
    <>
      <HomeContent />
    </>
  );
}
