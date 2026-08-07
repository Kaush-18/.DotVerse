"use client";

import { Environment, ContactShadows } from "@react-three/drei";

export default function SceneEnvironment() {
  return (
    <>
      {/* HDR environment map for realistic reflections on the fabric */}
      <Environment preset="city" />

      {/* Soft contact shadow beneath the shirt */}
      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.35}
        scale={4}
        blur={2.5}
        far={2}
        color="#000000"
      />
    </>
  );
}
