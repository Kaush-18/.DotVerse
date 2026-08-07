"use client";

import Button from "@/components/ui/Button";
import FadeUp from "@/components/animations/FadeUp";
import { HERO } from "@/constants/content";

export default function HeroContent() {
  return (
    <div className="relative z-10 max-w-[650px]">

      <FadeUp>
        <p className="mb-6 text-sm uppercase tracking-[0.45em] text-primary">
          {HERO.badge}
        </p>
      </FadeUp>

      <FadeUp delay={0.2}>
        <h1 className="text-7xl font-black leading-[0.9] tracking-tight md:text-8xl xl:text-9xl">
          {HERO.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </FadeUp>

      <FadeUp delay={0.4}>
        <p className="mt-8 text-xl leading-9 text-text-secondary">
          {HERO.description}
        </p>
      </FadeUp>

      <FadeUp delay={0.6}>
        <div className="mt-12 flex gap-5">
          <Button>
            {HERO.primaryButton}
          </Button>

          <Button variant="secondary">
            {HERO.secondaryButton}
          </Button>
        </div>
      </FadeUp>

    </div>
  );
}