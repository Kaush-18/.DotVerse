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
        y: 70,
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
        min-h-[440px]
        overflow-hidden
        rounded-[28px]
        border
        border-white/[0.08]
        ${collection.className}
        transition-all
        duration-500
        hover:border-violet-400/30
      `}
    >
      {/* Ambient glow */}
      <div
        className={`
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-72
          w-72
          rounded-full
          blur-3xl
          ${collection.glowClass}
          transition-transform
          duration-700
          group-hover:scale-125
        `}
      />

      {/* Grid texture */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.06]
          [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)]
          [background-size:48px_48px]
          [mask-image:linear-gradient(to_bottom,black,transparent)]
        "
      />

      {/* Decorative orb */}
      <motion.div
        className="
          pointer-events-none
          absolute
          right-[12%]
          top-[15%]
          h-32
          w-32
          rounded-full
          border
          border-violet-300/20
          bg-white/[0.025]
          shadow-[0_0_80px_rgba(124,58,237,0.18)]
          backdrop-blur-sm
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
        <div className="absolute inset-4 rounded-full border border-white/[0.06]" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.9)]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[440px] flex-col justify-between p-7 sm:p-8 lg:p-10">
        <div>
          <div className="mb-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]" />

            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-violet-300/80">
              {collection.eyebrow}
            </span>
          </div>

          <h3
            className="
              max-w-[360px]
              text-5xl
              font-black
              tracking-[-0.06em]
              text-white
              sm:text-6xl
            "
          >
            {collection.title}
          </h3>

          <p
            className="
              mt-5
              max-w-[330px]
              text-sm
              leading-6
              text-white/50
              sm:text-base
            "
          >
            {collection.description}
          </p>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between gap-5">
          <button
            type="button"
            className="
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-white/10
              bg-white/[0.06]
              px-5
              py-3
              text-xs
              font-semibold
              text-white
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-violet-400/40
              hover:bg-violet-500
              hover:shadow-[0_0_30px_rgba(124,58,237,0.35)]
            "
          >
            {collection.label}

            <span
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </button>

          <span
            className="
              text-7xl
              font-black
              tracking-[-0.08em]
              text-white/[0.035]
              transition-all
              duration-500
              group-hover:text-white/[0.08]
            "
          >
            0{index + 1}
          </span>
        </div>
      </div>

      {/* Hover border glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-[28px]
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