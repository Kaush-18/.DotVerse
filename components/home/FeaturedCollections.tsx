"use client";

import { motion } from "framer-motion";

import Container from "@/components/layout/Container";
import CollectionCard from "./CollectionCard";
import { collections } from "./collectionData";

export default function FeaturedCollections() {
  return (
    <section
      id="collections"
      className="
        relative
        overflow-hidden
        bg-[#05030b]
        py-20
        sm:py-24
        md:py-28
        lg:py-32
        xl:py-40
      "
    >
      {/* =====================================================
          BACKGROUND ATMOSPHERE
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          z-0
          h-[420px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-violet-700/[0.07]
          blur-[130px]
          sm:h-[500px]
          sm:w-[700px]
        "
      />

      <Container className="relative z-10">
        {/* =====================================================
            SECTION HEADER
            ===================================================== */}

        <div
          className="
            mb-12
            grid
            gap-8
            sm:mb-14
            md:mb-16
            lg:mb-20
            lg:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]
            lg:items-end
            lg:gap-12
            xl:gap-20
          "
        >
          {/* Heading */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="min-w-0"
          >
            {/* Eyebrow */}

            <div
              className="
                mb-4
                flex
                items-center
                gap-3
                sm:mb-5
              "
            >
              <span className="h-px w-8 bg-violet-500 sm:w-10" />

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-violet-300
                  sm:text-[10px]
                  sm:tracking-[0.3em]
                "
              >
                Featured collections
              </span>
            </div>

            {/* Main heading */}

            <h2
              className="
                max-w-[850px]
                text-[clamp(3.1rem,7vw,6rem)]
                font-black
                leading-[0.88]
                tracking-[-0.065em]
                text-white
              "
            >
              Find your
              <br />
              <span className="text-white/35">
                frequency.
              </span>
            </h2>
          </motion.div>

          {/* Supporting text */}

          <motion.p
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              max-w-[360px]
              text-sm
              leading-6
              text-white/45
              lg:ml-auto
              lg:pb-2
              lg:text-right
            "
          >
            Three expressions of the DotVerse.
            <br />
            One universe. Yours to explore.
          </motion.p>
        </div>

        {/* =====================================================
            COLLECTION GRID
            ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-4

            sm:gap-5

            md:grid-cols-2
            md:gap-5

            xl:grid-cols-3
            xl:gap-5
          "
        >
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>

        {/* =====================================================
            BOTTOM LABEL
            ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
          className="
            mt-8
            flex
            flex-col
            gap-3
            border-t
            border-white/[0.07]
            pt-5

            sm:mt-10
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:pt-6
          "
        >
          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.25em]
              text-white/25
              sm:text-[10px]
            "
          >
            .Dot / DotVerse
          </span>

          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.25em]
              text-white/25
              sm:text-[10px]
            "
          >
            Designed beyond the ordinary
          </span>
        </motion.div>
      </Container>
    </section>
  );
}