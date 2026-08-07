"use client";

import dynamic from "next/dynamic";

// Three.js / WebGL cannot run on the server — disable SSR here.
// Per Next.js docs, ssr:false must live inside a Client Component.
const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  ),
});

export default function HeroScene() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow behind the canvas */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent blur-3xl" />

      <HeroCanvas />
    </div>
  );
}