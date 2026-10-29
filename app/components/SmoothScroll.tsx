"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Gliding "momentum" scrolling for mouse wheels and trackpads. Phones keep their own native
    scrolling, and visitors who prefer reduced motion get normal scrolling. */
export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({
      lerp: 0.09, // lower = smoother and slower to settle
      wheelMultiplier: 1,
      anchors: { offset: -140 }, // in-page links (#websites…) glide and stop below the sticky menus
    });
    lenis.current = l;
    let id = requestAnimationFrame(function raf(t) {
      l.raf(t);
      id = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(id);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // new page: start at the top, without gliding there
  useEffect(() => {
    if (!window.location.hash) lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
