"use client";

import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

import PlaceholderModel from "./PlaceholderModel";
import SceneLights from "./SceneLights";

export default function HeroCanvas() {
  return (
    <Canvas
      className="h-full w-full"
      shadows={{
        type: THREE.PCFShadowMap,
      }}
      dpr={[1, 1.75]}
      camera={{
        position: [0, 0.15, 6.1],
        fov: 36,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <SceneLights />

      <Float
        speed={1.15}
        rotationIntensity={0.12}
        floatIntensity={0.45}
        floatingRange={[-0.06, 0.06]}
      >
        <group
          position={[0, 0.15, 0]}
          rotation={[0, -0.15, 0]}
          scale={1.15}
        >
          <PlaceholderModel />
        </group>
      </Float>
    </Canvas>
  );
}