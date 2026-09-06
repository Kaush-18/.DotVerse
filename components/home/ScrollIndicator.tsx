"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ScrollIndicator() {
  const shouldReduceMotion = useReducedMotion();

  const scrollToCollections = () => {
    const nextSection = document.getElementById("collections");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Fluid gliding dot animation that stretches slightly to simulate downward momentum
  const dotAnimation = shouldReduceMotion
    ? { y: 6, opacity: 0.6 }
    : {
        y: [0, 12, 12],
        opacity: [0, 1, 0],
        scaleY: [1, 1.4, 1],
      };

  const dotTransition = shouldReduceMotion
    ? undefined
    : {
        duration: 2,
        repeat: Infinity,
        ease: [0.25, 1, 0.5, 1] as const,
        times: [0, 0.4, 1],
      };

  return (
    <motion.button
      type="button"
      onClick={scrollToCollections}
      aria-label="Scroll to featured collections"
      initial={{ opacity: 0, x: "-50%", y: shouldReduceMotion ? 0 : 15 }}
      animate={{ opacity: 1, x: "-50%", y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { x: "-50%", y: -4 }}
      transition={{
        opacity: { delay: 1.4, duration: 0.8 },
        y: { type: "spring", stiffness: 350, damping: 25 },
        default: { duration: 0.4 },
      }}
      className="scroll-indicator"
    >
      <div className="scroll-indicator-mouse">
        <motion.div
          className="scroll-indicator-dot"
          animate={dotAnimation}
          transition={dotTransition}
        />
      </div>
      <span className="scroll-indicator-text">SCROLL</span>
    </motion.button>
  );
}

