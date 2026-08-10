"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 2.4,
        duration: 0.8,
      }}
      className="scroll-indicator"
    >

      {/* Label */}

      <span className="scroll-indicator-text">
        Scroll
        <span
          className="
            inline-flex
            ml-2
            h-1
            w-1
            rounded-full
            bg-violet-400
            shadow-[0_0_8px_rgba(139,92,246,0.9)]
          "
        />
      </span>

      {/* Vertical line */}

      <div className="scroll-indicator-line">
        <motion.span
          animate={{
            y: [0, 22, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Tiny arrow */}

      <motion.span
        animate={{
          y: [0, 3, 0],
          opacity: [0.35, 0.8, 0.35],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="scroll-indicator-text"
      >
        ↓
      </motion.span>

    </motion.div>
  );
}