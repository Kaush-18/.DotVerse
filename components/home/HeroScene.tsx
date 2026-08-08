"use client";

import HeroCanvas from "./HeroCanvas";

export default function HeroScene() {
  return (
    <div
      className="
        relative
        flex
        h-full
        w-full
        items-center
        justify-center
        overflow-visible
      "
    >
      {/* Atmospheric purple glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          z-0
          h-[55%]
          w-[55%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-violet-600/20
          blur-[120px]
        "
      />

      {/* Secondary glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-[52%]
          top-[48%]
          z-0
          h-[35%]
          w-[35%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-purple-500/10
          blur-[100px]
        "
      />

      {/* 3D Scene */}
      <div
        className="
          relative
          z-10
          flex
          h-full
          w-full
          max-w-[680px]
          items-center
          justify-center

          /* Desktop */
          lg:translate-x-[-2%]
          lg:translate-y-[1%]

          /* Large desktop */
          xl:max-w-[700px]
          xl:translate-x-[-4%]

          /* Tablet */
          md:max-w-[600px]
          md:translate-x-[-2%]

          /* Mobile */
          max-md:max-w-[520px]
          max-md:translate-x-0
          max-md:translate-y-0
        "
      >
        <div
          className="
            h-full
            w-full
            scale-[0.88]

            md:scale-[0.9]

            lg:scale-[0.92]

            xl:scale-[0.94]
          "
        >
          <HeroCanvas />
        </div>
      </div>
    </div>
  );
}