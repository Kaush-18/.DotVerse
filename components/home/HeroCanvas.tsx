"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";

import SceneLights from "./SceneLights";
import PlaceholderModel from "./PlaceholderModel";

export default function HeroCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{
        position: [0, 0, 5],
        fov: 40,
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <SceneLights />

      <Float
        speed={2}
        rotationIntensity={0.4}
        floatIntensity={1.4}
        floatingRange={[-0.2, 0.2]}
      >
        <PlaceholderModel />
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
      />
    </Canvas>
  );
}