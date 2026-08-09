"use client";

import { Environment } from "@react-three/drei";

export default function SceneLights() {
  return (
    <>
      {/* Soft studio ambient */}
      <ambientLight intensity={0.45} />

      {/* Main soft key */}
      <directionalLight
        position={[5, 6, 6]}
        intensity={2.8}
        castShadow
      />

      {/* Cool fill */}
      <directionalLight
        position={[-5, 2, 3]}
        intensity={1.4}
        color="#6d5cff"
      />

      {/* Purple rim */}
      <pointLight
        position={[1, 4, 4]}
        intensity={10}
        color="#7c3aed"
      />

      {/* Subtle blue edge */}
      <pointLight
        position={[-4, 0, 2]}
        intensity={5}
        color="#3030ff"
      />

      {/* Bottom reflection */}
      <pointLight
        position={[0, -3, 4]}
        intensity={3}
        color="#ffffff"
      />

      {/* Studio environment */}
      <Environment
        preset="city"
        environmentIntensity={0.7}
      />
    </>
  );
}