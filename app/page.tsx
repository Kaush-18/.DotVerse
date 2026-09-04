import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
  description: "Shop DotVerse for premium streetwear and graphic T-shirts inspired by space, innovation, and futuristic culture. High-quality designs for the modern explorer.",
  alternates: {
    canonical: "https://dotverse.store",
  },
  openGraph: {
    title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    description: "Shop DotVerse for premium streetwear and graphic T-shirts inspired by space, innovation, and futuristic culture.",
    url: "https://dotverse.store",
    siteName: "DotVerse",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DotVerse | Premium Streetwear & Graphic T-Shirts",
    description: "Shop DotVerse for premium streetwear and graphic T-shirts inspired by space, innovation, and futuristic culture.",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DotVerse",
    url: "https://dotverse.store",
    potentialAction: {
      "@type": "SearchAction",
      "target": "https://dotverse.store/shop?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      "name": "DotVerse",
      "url": "https://dotverse.store",
      "description": "Premium streetwear and graphic T-shirt brand"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}
