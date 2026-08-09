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
      {/* Primary atmospheric glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          z-0

          h-[58%]
          w-[58%]

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
          left-1/2
          top-[48%]
          z-0

          h-[36%]
          w-[36%]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full
          bg-purple-500/10
          blur-[100px]
        "
      />

      {/* 3D scene */}
      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-center

          w-full
          aspect-square

          max-w-[620px]

          sm:max-w-[660px]

          md:max-w-[700px]

          lg:max-w-[720px]

          xl:max-w-[760px]

          2xl:max-w-[800px]

          lg:translate-x-[3%]
          lg:translate-y-[1%]

          xl:translate-x-[4%]
        "
      >
        <div
          className="
            relative
            h-full
            w-full
          "
        >
          <HeroCanvas />
        </div>
      </div>
    </div>
  );
}