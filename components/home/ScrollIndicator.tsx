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
      className="
        pointer-events-none
        absolute

        left-1/2
        bottom-5

        z-30

        flex
        -translate-x-1/2
        flex-col
        items-center

        sm:bottom-6

        lg:bottom-5
      "
    >

      {/* Label */}

      <div
        className="
          mb-2
          flex
          items-center
          gap-2

          text-[7px]
          font-medium
          uppercase
          tracking-[0.45em]
          text-violet-400/70

          sm:text-[8px]
        "
      >
        <span>Scroll</span>

        <span
          className="
            h-1
            w-1
            rounded-full
            bg-violet-400
            shadow-[0_0_8px_rgba(139,92,246,0.9)]
          "
        />
      </div>


      {/* Vertical line */}

      <div
        className="
          relative
          h-8
          w-px
          overflow-hidden
          bg-white/10
        "
      >
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
          className="
            absolute
            left-1/2
            top-0

            h-2
            w-px

            -translate-x-1/2

            bg-violet-400

            shadow-[0_0_8px_rgba(139,92,246,0.9)]
          "
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
        className="
          mt-1
          text-[9px]
          leading-none
          text-violet-400/60
        "
      >
        ↓
      </motion.span>

    </motion.div>
  );
}