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
        min-h-[calc(100svh-72px)]
        overflow-hidden
      "
    >
      {/* Background atmosphere */}
      <HeroGlow />
      <HeroAurora />

      <Container className="relative z-10">
        <div
          className="
            relative
            grid
            min-h-[calc(100svh-72px)]
            items-center

            grid-cols-1

            md:grid-cols-[48%_52%]

            lg:grid-cols-[46%_54%]

            xl:grid-cols-[44%_56%]

            2xl:grid-cols-[42%_58%]
          "
        >
          {/* =====================================================
              HERO CONTENT
              ===================================================== */}
          <div
            className="
              relative
              z-20
              min-w-0

              flex
              items-center

              py-14

              sm:py-16

              md:py-0
            "
          >
            <HeroContent />
          </div>

          {/* =====================================================
              3D SCENE
              ===================================================== */}
          <div
            className="
              relative
              z-10
              min-w-0
              w-full

              h-[390px]

              sm:h-[420px]

              md:h-[500px]

              lg:h-[calc(100svh-72px)]

              flex
              items-center
              justify-center

              md:-ml-4

              lg:ml-0

              -mt-8

              md:mt-0
            "
          >
            <HeroScene />
          </div>
        </div>

        <ScrollIndicator />
      </Container>
    </section>
  );
}