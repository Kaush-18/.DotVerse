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
        py-28
        sm:py-32
        lg:py-40
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[500px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          bg-violet-700/[0.08]
          blur-[140px]
        "
      />

      <Container className="relative z-10">
        {/* =====================================================
            SECTION HEADER
            ===================================================== */}
        <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-[1fr_auto] lg:items-end">
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
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-violet-500" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-300">
                Featured collections
              </span>
            </div>

            <h2
              className="
                max-w-4xl
                text-5xl
                font-black
                leading-[0.9]
                tracking-[-0.06em]
                text-white
                sm:text-6xl
                lg:text-8xl
              "
            >
              Find your
              <br />
              <span className="text-white/35">frequency.</span>
            </h2>
          </motion.div>

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
              max-w-md
              text-sm
              leading-6
              text-white/45
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
            pt-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/25">
            .Dot / DotVerse
          </span>

          <span className="text-[10px] uppercase tracking-[0.25em] text-white/25">
            Designed beyond the ordinary
          </span>
        </motion.div>
      </Container>
    </section>
  );
}