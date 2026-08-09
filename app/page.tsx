"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Loader from "@/components/loader/Loader";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import NewArrivals from "@/components/home/NewArrivals";
import PageReveal from "@/components/animations/PageReveal";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader key="loader" />}
      </AnimatePresence>

      {!loading && (
        <PageReveal>
          <Navbar />
          <Hero />
          <FeaturedCollections />
          <NewArrivals />
        </PageReveal>
      )}
    </>
  );
}