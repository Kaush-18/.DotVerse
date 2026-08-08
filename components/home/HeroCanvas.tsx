"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

import PlaceholderModel from "./PlaceholderModel";
import SceneLights from "./SceneLights";

export default function HeroCanvas() {
  return (
    <Canvas
      className="!h-full !w-full"
      shadows
      dpr={[1, 2]}
      camera={{
        position: [0, 0.2, 5.6],
        fov: 34,
      }}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      {/* Lighting */}
      <SceneLights />

      {/* Model */}
      <Float
        speed={1.2}
        rotationIntensity={0.18}
        floatIntensity={0.7}
        floatingRange={[-0.08, 0.08]}
      >
        <PlaceholderModel />
      </Float>

      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.28}
      />
    </Canvas>
  );
}