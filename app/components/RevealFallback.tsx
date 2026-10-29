"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Section fade-in for browsers without CSS scroll animations (Firefox, older Safari).
    Chrome and Edge use the pure-CSS version in globals.css and skip this entirely. */
export default function RevealFallback() {
  const pathname = usePathname();

  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // only sections that start below the screen are hidden; anything already visible stays visible
    const els = [...document.querySelectorAll<HTMLElement>("main section")].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight
    );
    els.forEach((el) => el.classList.add("rv"));

    const show = () => {
      for (const el of els) {
        if (!el.classList.contains("rv-in") && el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          el.classList.add("rv-in");
        }
      }
    };
    // a scroll check as well as the observer, so a section can never stay hidden on screen
    const io = new IntersectionObserver(show, { threshold: 0 });
    els.forEach((el) => io.observe(el));
    window.addEventListener("scroll", show, { passive: true });
    show();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", show);
      els.forEach((el) => el.classList.remove("rv", "rv-in"));
    };
  }, [pathname]);

  return null;
}
