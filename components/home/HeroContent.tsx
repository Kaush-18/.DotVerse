"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

import Button from "@/components/ui/Button";
import { HERO } from "@/constants/content";

const stats = [
  {
    number: 500,
    suffix: "+",
    label: "Premium Designs",
  },
  {
    number: 24,
    suffix: "K+",
    label: "Happy Customers",
  },
  {
    number: 100,
    suffix: "%",
    label: "Premium Quality",
  },
];

export default function HeroContent() {
  return (
    <div
      className="
        relative
        z-20
        w-full
        max-w-[680px]
      "
    >

      {/* =========================================================
          BADGE
      ========================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.8,
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div
          className="
            inline-flex
            items-center
            gap-2

            rounded-full
            border
            border-violet-500/30
            bg-violet-500/[0.08]

            px-4
            py-1.5

            backdrop-blur-xl

            shadow-[0_0_30px_rgba(124,58,237,0.08)]
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-violet-400

              shadow-[0_0_12px_rgba(167,139,250,0.9)]

              animate-pulse
            "
          />

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.42em]
              text-violet-300
              sm:text-xs
            "
          >
            {HERO.badge}
          </p>
        </div>
      </motion.div>

      {/* =========================================================
          MAIN HEADING
      ========================================================= */}

      <motion.h1
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.95,
          duration: 0.5,
        }}
        className="
          mt-5

          max-w-[650px]

          text-[clamp(3.8rem,6.2vw,6.8rem)]
          font-black
          leading-[0.86]
          tracking-[-0.055em]

          text-white
        "
      >
        {HERO.title.map((line, index) => (
          <motion.span
            key={`${line}-${index}`}
            className="block overflow-hidden"
          >
            <motion.span
              className="block"
              initial={{
                opacity: 0,
                y: 90,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1.05 + index * 0.12,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.span>
          </motion.span>
        ))}
      </motion.h1>

      {/* =========================================================
          DESCRIPTION
      ========================================================= */}

      <motion.p
        initial={{
          opacity: 0,
          y: 22,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.5,
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          mt-6

          max-w-[520px]

          text-sm
          leading-7
          text-white/60

          sm:text-base
          sm:leading-7

          lg:text-[17px]
          lg:leading-8
        "
      >
        {HERO.description}
      </motion.p>

      {/* =========================================================
          CTA BUTTONS
      ========================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 24,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.7,
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          mt-7
          flex
          flex-wrap
          items-center
          gap-3
        "
      >
        <Button
          className="
            px-7
            py-4
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
            py-4
            text-sm
            sm:px-8
            sm:py-4
            sm:text-base
          "
        >
          {HERO.secondaryButton}
        </Button>
      </motion.div>

      {/* =========================================================
          STATS
      ========================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 28,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.9,
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          mt-9

          grid
          grid-cols-3

          gap-2
          sm:gap-3

          max-w-[600px]
        "
      >
        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 2 + index * 0.1,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -5,
            }}
            className="
              group
              relative
              overflow-hidden

              rounded-2xl

              border
              border-white/[0.10]

              bg-white/[0.035]

              px-3
              py-3.5

              backdrop-blur-xl

              transition-all
              duration-500

              hover:border-violet-400/30
              hover:bg-white/[0.055]

              hover:shadow-[0_18px_50px_rgba(124,58,237,0.12)]

              sm:px-4
              sm:py-4
            "
          >
            {/* Hover glow */}
            <div
              className="
                pointer-events-none
                absolute
                -right-8
                -top-8

                h-20
                w-20

                rounded-full

                bg-violet-500/10

                blur-2xl

                opacity-0

                transition-opacity
                duration-500

                group-hover:opacity-100
              "
            />

            <div className="relative">
              <h3
                className="
                  flex
                  items-baseline
                  gap-0.5

                  text-[clamp(1.8rem,3vw,3rem)]
                  font-black
                  leading-none
                  tracking-[-0.04em]

                  text-white

                  transition-colors
                  duration-300

                  group-hover:text-violet-300
                "
              >
                <CountUp
                  end={item.number}
                  duration={2}
                  separator=","
                />

                <span>{item.suffix}</span>
              </h3>

              <p
                className="
                  mt-1.5

                  whitespace-nowrap

                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.08em]

                  text-white/45

                  sm:text-[10px]
                  sm:tracking-[0.1em]
                "
              >
                {item.label}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}