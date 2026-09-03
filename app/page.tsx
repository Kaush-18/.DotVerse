import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Premium Streetwear Inspired by Space & Innovation",
  description: "Explore DotVerse, a premium streetwear brand inspired by space, cosmos, and futuristic design. Discover unique, high-quality apparel for the modern explorer.",
  alternates: {
    canonical: "https://dotverse.store",
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
