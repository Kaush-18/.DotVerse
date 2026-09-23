"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Loader from "@/components/loader/Loader";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewArrivals from "@/components/home/NewArrivals";
import BrandContext from "@/components/home/BrandContext";
import PageReveal from "@/components/animations/PageReveal";
import type { Product } from "@/types/product";

interface HomeContentProps {
  featuredProducts?: Product[];
}

export default function HomeContent({ featuredProducts }: HomeContentProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-editorial">
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" />}
      </AnimatePresence>

      {!loading && (
        <PageReveal>
          <Hero />
          <FeaturedCollections />
          <NewArrivals initialProducts={featuredProducts} />
          <BrandContext />
        </PageReveal>
      )}
    </div>
  );
}
