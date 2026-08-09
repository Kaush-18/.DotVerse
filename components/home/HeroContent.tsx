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
        className="mb-5"
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
        className="
          font-black
          tracking-[-0.065em]
          leading-[0.84]
          text-white

          text-[clamp(4rem,6vw,6.5rem)]

          sm:text-[clamp(4.5rem,6vw,6.8rem)]

          lg:text-[clamp(5rem,5.8vw,7rem)]

          xl:text-[clamp(5.2rem,5.6vw,7.2rem)]
        "
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
        className="
          mt-5
          max-w-[620px]

          text-sm
          leading-6
          text-white/60

          sm:mt-6
          sm:text-base
          sm:leading-7

          lg:text-xl
          lg:leading-8
        "
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
        className="
          mt-6
          flex
          flex-wrap
          items-center
          gap-3

          sm:mt-7
        "
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


      {/* =====================================================
          STATS
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
          delay: 1.8,
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          mt-7
          grid
          w-full
max-w-[620px]
          grid-cols-3
          gap-2

          sm:mt-8
          sm:gap-3
        "
      >

        {stats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1.9 + index * 0.1,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              y: -4,
            }}
            className="
              group
              min-w-0

              rounded-xl
              border
              border-white/10

              bg-violet-500/[0.12]
              backdrop-blur-xl

              px-3
              py-2.5

              transition-all
              duration-500

              hover:border-violet-500/40
              hover:bg-violet-500/[0.18]
              hover:shadow-[0_15px_40px_rgba(124,58,237,0.15)]

              sm:rounded-2xl
              sm:px-4
              sm:py-3
            "
          >

            {/* Number */}

            <div
              className="
                flex
                items-baseline
                whitespace-nowrap

                text-2xl
                font-black
                leading-none
                text-white

                sm:text-3xl
                lg:text-[2.6rem]
              "
            >
              <CountUp
                end={item.number}
                duration={2}
                separator=","
              />

              <span
                className="
                  transition-colors
                  duration-300
                  group-hover:text-violet-400
                "
              >
                {item.suffix}
              </span>
            </div>


            {/* Label */}

            <p
              className="
                mt-1
                truncate

                text-[8px]
                font-medium
                uppercase
                tracking-wide
                text-white/45

                sm:text-[9px]
                lg:text-[10px]
              "
            >
              {item.label}
            </p>

          </motion.div>
        ))}

      </motion.div>

    </div>
  );
}