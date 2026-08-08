"use client";

import { Environment } from "@react-three/drei";

export default function SceneLights() {
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={1.6} />

      {/* Main Light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={6}
        castShadow
      />

      {/* Fill Light */}
      <directionalLight
        position={[-5, 3, 2]}
        intensity={3}
      />

      {/* Rim Light */}
      <pointLight
        position={[0, 4, 5]}
        intensity={30}
        color="#8b5cf6"
      />

      {/* Bottom Light */}
      <pointLight
        position={[0, -3, 3]}
        intensity={8}
        color="#ffffff"
      />

      {/* HDRI Environment */}
      <Environment preset="city" />
    </>
  );
}