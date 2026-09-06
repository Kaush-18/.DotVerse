"use client";

import { motion } from "framer-motion";

import Button from "@/components/ui/Button";
import { HERO } from "@/constants/content";

export default function HeroContent() {
  return (
    <div className="hero-content">
      {/* =====================================================
          BADGE
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.8,
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="hero-badge"
      >
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-violet-500/40
            bg-violet-500/10
            px-3
            py-1
            backdrop-blur-md
            sm:px-4
            sm:py-1.5
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-violet-500
              shadow-[0_0_12px_rgba(139,92,246,0.9)]
              animate-pulse
              sm:h-2
              sm:w-2
            "
          />

          <p
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.32em]
              text-violet-400
              sm:text-[10px]
              md:text-xs
            "
          >
            {HERO.badge}
          </p>
        </div>
      </motion.div>


      {/* =====================================================
          HEADING
      ===================================================== */}

      <motion.h1
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.9,
          duration: 0.5,
        }}
        className="hero-title"
      >
        {HERO.title.map((line, index) => (
          <motion.span
            key={`${line}-${index}`}
            className="block"
            initial={{
              opacity: 0,
              y: 70,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1 + index * 0.12,
              duration: 0.75,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        ))}
      </motion.h1>


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.4,
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="hero-description"
      >
        {HERO.description}
      </motion.p>


      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.6,
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="hero-actions"
      >

        <Button
          className="
            px-7
            py-3.5
            text-sm
            sm:px-8
            sm:py-4
            sm:text-base
          "
        >
          {HERO.primaryButton}
        </Button>

        <Button
          variant="secondary"
          className="
            px-7
            py-3.5
            text-sm
            sm:px-8
            sm:py-4
            sm:text-base
          "
        >
          {HERO.secondaryButton}
        </Button>

      </motion.div>

    </div>
  );
}
