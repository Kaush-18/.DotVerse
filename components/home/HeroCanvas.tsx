"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lights from "./Lights";
import SceneEnvironment from "./SceneEnvironment";
import TShirt from "./TShirt";

function CanvasFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
    </div>
  );
}

export default function HeroCanvas() {
  return (
    <div className="h-[600px] w-full cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Lights />
          <SceneEnvironment />
          <TShirt />

          {/* Allow subtle user interaction — damped so it stays tasteful */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.6}
            dampingFactor={0.06}
            enableDamping
          />
        </Suspense>
      </Canvas>

      {/* Fallback shown while the R3F Canvas boots */}
      <noscript>
        <CanvasFallback />
      </noscript>
    </div>
  );
}
