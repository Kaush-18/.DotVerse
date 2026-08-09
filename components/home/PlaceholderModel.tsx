"use client";

export default function PlaceholderModel() {
  return (
    <group
      scale={0.68}
      position={[0.38, 0.06, 0]}
      rotation={[0.15, 0.55, 0]}
    >
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.28, 320, 32]} />

        <meshPhysicalMaterial
          color="#050507"
          metalness={0.88}
          roughness={0.12}
          envMapIntensity={1.8}
          clearcoat={1}
          clearcoatRoughness={0.08}
          reflectivity={1}
          sheen={0.25}
          sheenRoughness={0.18}
          sheenColor="#24105c"
        />
      </mesh>
    </group>
  );
}