import type { Metadata } from "next";
import { absoluteUrl, defaultSocialImage } from "@/lib/seo";
import HomeContent from "@/components/home/HomeContent";

const homepageTitle = "DotVerse | Graphic T-Shirts & Modern Streetwear";
const homepageDescription =
  "DotVerse creates original graphic T-shirts and modern streetwear with distinctive visual design, everyday comfort, and quality you can wear. Explore the collection.";
const homepageUrl = "https://dotverse.store/";

export const metadata: Metadata = {
  title: homepageTitle,
  description: homepageDescription,
  alternates: {
    canonical: homepageUrl,
  },
  openGraph: {
    title: homepageTitle,
    description: homepageDescription,
    url: homepageUrl,
    siteName: "DotVerse",
    locale: "en_US",
    type: "website",
    images: [{ url: absoluteUrl(defaultSocialImage), alt: "DotVerse cosmic streetwear" }],
  },
  twitter: {
    card: "summary_large_image",
    title: homepageTitle,
    description: homepageDescription,
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
