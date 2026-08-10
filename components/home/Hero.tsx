import Container from "@/components/layout/Container";
import HeroContent from "./HeroContent";
import HeroScene from "./HeroScene";
import HeroGlow from "./HeroGlow";
import HeroAurora from "./HeroAurora";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section
      className="
        relative
        isolate
        min-h-[calc(100svh-80px)]
        overflow-hidden
      "
    >
      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <HeroGlow />
      <HeroAurora />

      {/* =====================================================
          HERO CONTAINER
      ===================================================== */}

      <Container className="relative z-10">
        <div
          className="
            relative
            grid

            /* MOBILE */
            min-h-[calc(100svh-80px)]
            grid-cols-1
            items-start
            gap-0
            pt-6

            /* TABLET */
            sm:pt-8

            /* DESKTOP */
            lg:min-h-[calc(100svh-80px)]
            lg:grid-cols-[44%_56%]
            lg:items-center
            lg:gap-0
            lg:pt-0

            /* LARGE DESKTOP */
            xl:grid-cols-[42%_58%]
          "
        >

          {/* =================================================
              LEFT — HERO CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-20
              min-w-0
              w-full

              lg:self-center
            "
          >
            <HeroContent />
          </div>


          {/* =================================================
              RIGHT — 3D HERO MODEL
          ================================================= */}

          <div
            className="
              relative
              z-10
              flex
              w-full
              min-w-0
              items-center
              justify-center

              /* MOBILE */
              h-[245px]
              mt-4

              /* SMALL MOBILE */
              sm:h-[270px]
              sm:mt-5

              /* TABLET */
              md:h-[330px]
              md:mt-4

              /* DESKTOP */
              lg:h-[calc(100svh-80px)]
              lg:min-h-[560px]
              lg:mt-0

              /* LARGE DESKTOP */
              xl:min-h-[620px]
            "
          >
            <HeroScene />
          </div>

        </div>


        {/* ===================================================
            SCROLL INDICATOR
        =================================================== */}

        <ScrollIndicator />

      </Container>
    </section>
  );
}