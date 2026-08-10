"use client";

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function PlaceholderModel() {
  const { scene } = useGLTF("/models/dotverse-tshirt.glb");

  scene.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;

    // =====================================================
    // HIDE HANGER ONLY
    // =====================================================

    if (object.name === "ShirtToHanger_Hanger_0") {
      object.visible = false;
      return;
    }

    // =====================================================
    // STYLE THE ACTUAL T-SHIRT
    // =====================================================

    if (object.name === "ShirtToHanger_Shirt_0") {
      object.visible = true;

      object.castShadow = true;
      object.receiveShadow = true;

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#09090D"),
        roughness: 0.62,
        metalness: 0.02,

        // Very subtle purple reflected light
        emissive: new THREE.Color("#16002D"),
        emissiveIntensity: 0.12,
      });

      object.material = material;
    }
  });

  return (
    <primitive
      object={scene}
      scale={3.4}
      position={[0.35, -0.45, 0]}
      rotation={[0, -0.18, 0]}
    />
  );
}

useGLTF.preload("/models/dotverse-tshirt.glb");