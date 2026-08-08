"use client";

import { useEffect, useRef, useState } from "react";

type MousePosition = { x: number; y: number };

export default function HeroGlow() {
  const [mouse, setMouse] = useState<MousePosition>({ x: 50, y: 50 });
  const rafRef = useRef<number | null>(null);
  const pendingMouse = useRef<MousePosition>({ x: 50, y: 50 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pendingMouse.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    const loop = () => {
      setMouse({ ...pendingMouse.current });
      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute h-[700px] w-[700px] rounded-full blur-[180px] transition-all duration-500"
        style={{
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(124,58,237,.18) 0%, rgba(124,58,237,.08) 35%, transparent 70%)",
        }}
      />
    </div>
  );
}