"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";

export default function PlaceholderModel() {
  return (
    <group
      scale={0.70}
      position={[0.2, 0.08, 0]}
      rotation={[0.15, 0.55, 0]}
    >
      <mesh>
        <torusKnotGeometry args={[1, 0.28, 320, 32]} />

        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={1}
          roughness={0.06}
          transmission={1}
          ior={1.45}
          chromaticAberration={0.025}
          anisotropy={0.2}
          distortion={0.08}
          distortionScale={0.2}
          temporalDistortion={0.08}
          attenuationDistance={1}
          attenuationColor="#7c3aed"
          color="#4c1d95"
        />
      </mesh>
    </group>
  );
}