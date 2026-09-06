"use client";

import { useLayoutEffect } from "react";
import HeroContent from "./HeroContent";
import HeroScene from "./HeroScene";
import ScrollIndicator from "./ScrollIndicator";

/**
 * Measures the actual rendered bottom edge of the fixed navbar in the DOM
 * and writes it as --hero-nav-bottom on :root. This eliminates all guesswork
 * from hardcoded navbar-height values: the hero content spacer is always
 * exactly as tall as the real navbar, regardless of device or font scaling.
 */
function useNavbarMeasure() {
  useLayoutEffect(() => {
    function measure() {
      // The navbar is the first <header> in the document
      const nav = document.querySelector("header");
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      // bottom = distance from viewport top to the visual bottom edge of navbar
      document.documentElement.style.setProperty(
        "--hero-nav-bottom",
        `${rect.bottom}px`
      );
    }

    measure();

    // Re-measure on resize (handles orientation changes, browser chrome resize)
    const ro = new ResizeObserver(measure);
    const nav = document.querySelector("header");
    if (nav) ro.observe(nav);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
}

export default function Hero() {
  useNavbarMeasure();

  return (
    <section className="hero">
      {/* Decorative editorial lettering — desktop only */}
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
          HERO INNER — the measured spacer lives here via CSS
      ===================================================== */}
      <div className="hero-inner">
        <HeroContent />

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

      <ScrollIndicator />
    </section>
  );
}

