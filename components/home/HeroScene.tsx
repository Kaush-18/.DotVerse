import HeroCanvas from "./HeroCanvas";

    export default function HeroScene() {
      return (
        <div className="relative flex h-[420px] sm:h-[520px] lg:h-[720px] items-center justify-center">

          <div className="absolute h-[700px] w-[700px] rounded-full bg-primary/20 blur-[180px]" />

          <div className="relative h-full w-full">
            <HeroCanvas />
          </div>

        </div>
      );
    }