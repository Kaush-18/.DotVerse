import type { Metadata } from "next";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Premium Cosmic & Futuristic Streetwear",
  description: "Discover premium streetwear inspired by space, cosmos, and futuristic culture. Explore unique cosmic T-shirts and futuristic designs by DotVerse.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomeContent />;
}
