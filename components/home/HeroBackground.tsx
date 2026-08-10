"use client";

export default function HeroBackground() {
  return (
    <>
      {/* Base Background */}
      <div className="absolute inset-0 -z-30 bg-[#07070b]" />

      {/* Blue Glow */}
      <div
        className="
          absolute
          left-[-20%]
          top-0
          -z-20
          h-[600px]
          w-[600px]
          rounded-full
          bg-indigo-500/10
          blur-[180px]
        "
      />

      {/* Grid */}
      <div
        className="
          absolute
          inset-0
          -z-10
          opacity-40
          [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]
          [background-size:52px_52px]
        "
      />

      {/* Vignette */}
      <div
        className="
          absolute
          inset-0
          -z-10
          bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.7))]
        "
      />
    </>
  );
}