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
          MAIN HERO CONTAINER
      ===================================================== */}

      <Container className="relative z-10">
        <div
          className="
            relative
            grid
            min-h-[calc(100svh-80px)]
            items-center

            gap-8
            py-8

            lg:grid-cols-[46%_54%]
            lg:gap-6
            lg:py-6

            xl:grid-cols-[44%_56%]
            2xl:grid-cols-[42%_58%]
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

              pl-4
              sm:pl-6
              md:pl-8
              lg:pl-10
              xl:pl-12
              2xl:pl-16
            "
          >
            <HeroContent />
          </div>

          {/* =================================================
              RIGHT — 3D HERO SCENE
          ================================================= */}

          <div
            className="
              relative
              z-10
              flex
              min-w-0
              items-center
              justify-center

              h-[420px]
              w-full

              sm:h-[500px]

              lg:h-[calc(100svh-110px)]
              lg:min-h-[560px]

              xl:h-[calc(100svh-100px)]
              xl:min-h-[600px]
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