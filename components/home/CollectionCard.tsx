"use client";

import { motion } from "framer-motion";
import type { Collection } from "./collectionData";

interface CollectionCardProps {
  collection: Collection;
  index: number;
}

export default function CollectionCard({
  collection,
  index,
}: CollectionCardProps) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 50,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.75,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        group
        relative
        min-w-0
        overflow-hidden
        rounded-[24px]
        border
        border-white/[0.08]
        ${collection.className}

        min-h-[400px]

        sm:min-h-[420px]

        md:min-h-[430px]

        xl:min-h-[440px]

        transition-all
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]

        hover:-translate-y-1
        hover:border-violet-400/30
        hover:shadow-[0_24px_70px_rgba(0,0,0,0.28)]
      `}
    >
      {/* =====================================================
          AMBIENT GLOW
          ===================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-64
          w-64
          rounded-full
          blur-3xl

          sm:h-72
          sm:w-72

          ${collection.glowClass}

          opacity-70
          transition-all
          duration-1000
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover:scale-125
          group-hover:opacity-90
        `}
      />

      {/* =====================================================
          GRID TEXTURE
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.055]

          [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]

          [background-size:42px_42px]

          [mask-image:linear-gradient(to_bottom,black,transparent)]
        "
      />

      {/* =====================================================
          DECORATIVE ORB
          ===================================================== */}

      <motion.div
        className="
          pointer-events-none
          absolute

          right-[10%]
          top-[15%]

          h-24
          w-24

          rounded-full

          border
          border-violet-300/20

          bg-white/[0.025]

          shadow-[0_0_70px_rgba(124,58,237,0.18)]

          backdrop-blur-sm

          transition-all
          duration-700
          ease-out

          group-hover:scale-110
          group-hover:border-violet-300/30

          sm:h-28
          sm:w-28

          md:h-32
          md:w-32
        "
        animate={{
          y: [0, -10, 0],
          rotate: [0, 4, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="
            absolute
            inset-3
            rounded-full
            border
            border-white/[0.06]

            sm:inset-4
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-1.5
            w-1.5
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-400
            shadow-[0_0_20px_rgba(139,92,246,0.9)]

            sm:h-2
            sm:w-2
          "
        />
      </motion.div>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="
          relative
          z-10

          flex
          min-h-[400px]
          flex-col
          justify-between

          p-5

          sm:min-h-[420px]
          sm:p-7

          md:min-h-[430px]
          md:p-8

          xl:min-h-[440px]
          xl:p-10
        "
      >
        {/* ===================================================
            TOP CONTENT
            =================================================== */}

        <div className="min-w-0">
          {/* Eyebrow */}

          <div
            className="
              mb-4
              flex
              items-center
              gap-2

              sm:mb-5
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                flex-shrink-0
                rounded-full
                bg-violet-400
                shadow-[0_0_10px_rgba(139,92,246,0.9)]
              "
            />

            <span
              className="
                min-w-0
                truncate
                text-[9px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-violet-300/80

                sm:text-[10px]
                sm:tracking-[0.28em]
              "
            >
              {collection.eyebrow}
            </span>
          </div>

          {/* Title */}

          <h3
            className="
              relative
              z-10

              max-w-full

              text-[2.35rem]
              font-black
              leading-[0.92]
              tracking-[-0.06em]
              text-white

              whitespace-nowrap

              sm:text-[2.6rem]
              md:text-[2.75rem]
              xl:text-[3rem]
            "
          >
            {collection.title}
          </h3>

          {/* Description */}

          <p
            className="
              mt-4

              max-w-[330px]

              text-[12px]

              leading-[1.5]

              text-white/50

              sm:mt-5
              sm:text-[13px]
              sm:leading-5

              md:text-sm
              md:leading-6
            "
          >
            {collection.description}
          </p>
        </div>

        {/* ===================================================
            BOTTOM CONTENT
            =================================================== */}

        <div
          className="
            mt-8

            flex
            items-end
            justify-between

            gap-3

            sm:mt-10
            sm:gap-5
          "
        >
          {/* Button */}

          <button
            type="button"
            className="
              inline-flex
              min-w-0
              max-w-[75%]
              shrink

              items-center
              gap-2

              rounded-full

              border
              border-white/10

              bg-white/[0.06]

              px-4
              py-2.5

              text-[11px]
              font-semibold
              text-white

              backdrop-blur-md

              transition-all
              duration-300

              hover:border-violet-400/40
              hover:bg-violet-500/90
              hover:shadow-[0_0_24px_rgba(124,58,237,0.28)]

              sm:gap-3
              sm:px-5
              sm:py-3
              sm:text-xs
            "
          >
            <span className="truncate">
              {collection.label}
            </span>

            <span
              className="
                flex-shrink-0

                transition-transform
                duration-300

                group-hover:translate-x-1
              "
            >
              →
            </span>
          </button>

          {/* Background number */}

          <span
            className="
              pointer-events-none
              flex-shrink-0

              text-[4rem]

              font-black

              leading-none

              tracking-[-0.08em]

              text-white/[0.035]

              transition-all
              duration-700
              ease-out

              group-hover:translate-x-1
              group-hover:text-white/[0.08]

              sm:text-6xl

              md:text-7xl
            "
          >
            0{index + 1}
          </span>
        </div>
      </div>

      {/* =====================================================
          HOVER BORDER
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0

          rounded-[24px]

          opacity-0

          ring-1
          ring-violet-400/20

          transition-opacity
          duration-500

          group-hover:opacity-100
        "
      />
    </motion.article>
  );
}