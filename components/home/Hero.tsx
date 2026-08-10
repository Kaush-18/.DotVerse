"use client";

import HeroContent from "./HeroContent";
import HeroScene from "./HeroScene";
import HeroGlow from "./HeroGlow";
import HeroAurora from "./HeroAurora";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section className="hero">
      {/* =====================================================
          BACKGROUND ATMOSPHERE
      ===================================================== */}

      <HeroGlow />
      <HeroAurora />

      {/* =====================================================
          HERO INNER
      ===================================================== */}

      <div className="hero-inner">
        {/* =================================================
            LEFT — HERO CONTENT
        ================================================= */}

        <div className="hero-content">
          <HeroContent />
        </div>

        {/* =================================================
            RIGHT — 3D HERO MODEL
        ================================================= */}

        <div className="hero-model">
          <HeroScene />
        </div>
      </div>

      {/* ===================================================
          SCROLL INDICATOR
      =================================================== */}

      <ScrollIndicator />
    </section>
  );
}