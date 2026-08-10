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

      {/* =====================================================
          PRIMARY PURPLE ATMOSPHERIC GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          z-0

          h-[65%]
          w-[65%]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full
          bg-violet-600/20
          blur-[120px]

          lg:h-[62%]
          lg:w-[62%]
          lg:blur-[150px]
        "
      />


      {/* =====================================================
          SECONDARY GLOW
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[54%]
          z-0

          h-[38%]
          w-[38%]

          -translate-x-1/2
          -translate-y-1/2

          rounded-full
          bg-purple-500/10
          blur-[90px]
        "
      />


      {/* =====================================================
          CONTROLLED MODEL AREA
      ===================================================== */}

      <div
        className="
          relative
          z-10

          flex
          h-full
          w-full
          items-center
          justify-center

          max-w-[430px]

          sm:max-w-[470px]

          md:max-w-[520px]

          lg:max-w-[620px]

          xl:max-w-[680px]
        "
      >
        <div
          className="
            relative
            h-full
            w-full

            /* MOBILE */
            scale-[0.92]

            /* TABLET */
            md:scale-[0.94]

            /* DESKTOP */
            lg:scale-[0.90]

            xl:scale-[0.94]
          "
        >
          <HeroCanvas />
        </div>
      </div>

    </div>
  );
}