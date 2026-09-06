"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroScene() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-visible">
      <div className="hero-product-haze" aria-hidden="true" />

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <motion.div
          className="relative flex h-full w-full items-center justify-center"
          initial={{ opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            className="hero-product-image"
            src="/images/hero/dotverse-hero-tshirts.png"
            alt="DotVerse premium streetwear T-shirts"
            width={1536}
            height={1024}
            sizes="(max-width: 768px) 100vw, (max-width: 1100px) 52vw, 50vw"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
