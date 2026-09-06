"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  const scrollToCollections = () => {
    // Find the next section by ID, or fallback to body if not found
    const nextSection = document.getElementById("collections");
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.button
      type="button"
      onClick={scrollToCollections}
      aria-label="Scroll to featured collections"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="scroll-indicator"
    >
      <div className="scroll-indicator-label">
        <span>SCROLL</span>
      </div>

      <div className="scroll-indicator-line" />
    </motion.button>
  );
}
