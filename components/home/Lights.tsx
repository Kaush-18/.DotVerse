"use client";

export default function Lights() {
  return (
    <>
      {/* Ambient fill — keeps the shirt readable without hard shadows */}
      <ambientLight intensity={0.4} />

      {/* Key light — warm front-top */}
      <directionalLight
        position={[3, 5, 3]}
        intensity={2.5}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Rim light — cool purple from behind to match the brand palette */}
      <directionalLight
        position={[-4, 2, -4]}
        intensity={1.8}
        color="#7c3aed"
      />

      {/* Under-fill — soft bounce to lift shadow areas */}
      <directionalLight
        position={[0, -3, 2]}
        intensity={0.6}
        color="#3b82f6"
      />

      {/* Point light — subtle glow near the shirt */}
      <pointLight position={[0, 0, 2.5]} intensity={0.8} color="#a78bfa" />
    </>
  );
}
