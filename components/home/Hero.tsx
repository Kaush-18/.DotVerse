"use client";

import HeroContent from "./HeroContent";
import HeroScene from "./HeroScene";
import ScrollIndicator from "./ScrollIndicator";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-campaign-detail hero-campaign-detail-left" aria-hidden="true">
        <span>WEAR</span>
        <span>YOUR</span>
        <span>STORY</span>
      </div>

      <div className="hero-campaign-detail hero-campaign-detail-right" aria-hidden="true">
        <span>CLOTHES</span>
        <span>IDEAS</span>
        <span>PEOPLE</span>
        <span>A BETTER YOU</span>
      </div>

      {/* =====================================================
          HERO INNER
      ===================================================== */}

      <div className="hero-inner">
        {/* =================================================
            LEFT — HERO CONTENT
        ================================================= */}

        <HeroContent />

        {/* =================================================
            RIGHT — HERO PRODUCT VISUAL
        ================================================= */}

        <div className="hero-model">
          <HeroScene />
        </div>
      </div>

      <div className="hero-campaign-meta hero-campaign-meta-left" aria-hidden="true">
        <span>MINIMAL</span>
        <span>BOLD</span>
        <span>TIMELESS</span>
      </div>

      <div className="hero-campaign-meta hero-campaign-meta-right" aria-hidden="true">
        <span>.DotVerse</span>
        <span>EST. 2025</span>
      </div>

      {/* ===================================================
          SCROLL INDICATOR
      =================================================== */}

      <ScrollIndicator />
    </section>
  );
}
