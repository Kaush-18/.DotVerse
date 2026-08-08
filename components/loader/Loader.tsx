"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        return prev + 2;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 1.05,
        y: -120,
      }}
      transition={{
        duration: 0.9,
        ease: [0.76, 0, 0.24, 1],
      }}
      className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      overflow-hidden
      bg-[#05050A]
      "
    >
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
          linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),
          linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Purple Glow */}
      <div
        className="
        absolute
        h-[900px]
        w-[900px]
        rounded-full
        bg-violet-600/20
        blur-[220px]
        animate-pulse
        "
      />

      <div className="relative z-10 flex flex-col items-center">

        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
          text-6xl
          font-black
          tracking-tight
          "
        >
          .DotVerse
        </motion.h1>

        <p
          className="
          mt-5
          text-xs
          uppercase
          tracking-[0.45em]
          text-violet-400
          "
        >
          Premium Streetwear
        </p>

        <div className="mt-12 w-80">

          <div
            className="
            h-[3px]
            overflow-hidden
            rounded-full
            bg-white/10
            "
          >
            <motion.div
              className="
              h-full
              bg-gradient-to-r
              from-violet-500
              via-purple-400
              to-violet-500
              shadow-[0_0_25px_rgba(124,58,237,.8)]
              "
              animate={{
                width: `${progress}%`,
              }}
              transition={{
                ease: "linear",
              }}
            />
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">

            <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />

            <p
              className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-white/60
              "
            >
              Loading {progress}%
            </p>

          </div>

        </div>

      </div>

    </motion.div>
  );
}