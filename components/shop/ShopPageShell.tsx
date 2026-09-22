"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

const navbarGap = 12;

export default function ShopPageShell({ children }: { children: ReactNode }) {
  const shellRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const navbar = document.querySelector<HTMLElement>("header.navbar");

    if (!shell || !navbar) return;

    const updateClearance = () => {
      const navbarBottom = Math.ceil(navbar.getBoundingClientRect().bottom);
      const clearance = navbarBottom + navbarGap;
      shell.style.setProperty("--shop-navbar-clearance", `${clearance}px`);
    };

    updateClearance();

    const observer = new ResizeObserver(updateClearance);
    observer.observe(navbar);
    window.addEventListener("resize", updateClearance);
    window.visualViewport?.addEventListener("resize", updateClearance);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateClearance);
      window.visualViewport?.removeEventListener("resize", updateClearance);
    };
  }, []);

  return (
    <main ref={shellRef} className="dot-shop-redesign">
      {children}
    </main>
  );
}
