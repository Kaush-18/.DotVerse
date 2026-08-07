"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export default function TShirt() {
  const groupRef = useRef<THREE.Group>(null!);

  // Slow idle rotation so the shirt breathes in the scene
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <Float
      speed={1.6}
      rotationIntensity={0.25}
      floatIntensity={0.6}
      floatingRange={[-0.08, 0.08]}
    >
      <group ref={groupRef}>
        {/* ── Body ─────────────────────────────────────────────────── */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 1.6, 0.12]} />
          <meshStandardMaterial
            color="#0f0f14"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* ── Left sleeve ──────────────────────────────────────────── */}
        <mesh castShadow receiveShadow position={[-0.92, 0.42, 0]}>
          <boxGeometry args={[0.44, 0.58, 0.11]} />
          <meshStandardMaterial
            color="#0f0f14"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* ── Right sleeve ─────────────────────────────────────────── */}
        <mesh castShadow receiveShadow position={[0.92, 0.42, 0]}>
          <boxGeometry args={[0.44, 0.58, 0.11]} />
          <meshStandardMaterial
            color="#0f0f14"
            roughness={0.85}
            metalness={0.05}
          />
        </mesh>

        {/* ── Collar ───────────────────────────────────────────────── */}
        <mesh castShadow receiveShadow position={[0, 0.88, 0.01]}>
          <torusGeometry args={[0.28, 0.055, 12, 48, Math.PI]} />
          <meshStandardMaterial
            color="#1a1a2e"
            roughness={0.7}
            metalness={0.0}
          />
        </mesh>

        {/* ── Brand mark — glowing purple dot ──────────────────────── */}
        <mesh position={[0, 0.15, 0.07]}>
          <circleGeometry args={[0.1, 32]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={1.8}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* ── Subtle chest graphic line ─────────────────────────────── */}
        <mesh position={[0, -0.05, 0.07]}>
          <planeGeometry args={[0.55, 0.018]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>
    </Float>
  );
}
