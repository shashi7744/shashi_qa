"use client";

import { useEffect, useState } from "react";

type SceneComponent = React.ComponentType;

/** Starts the 3D scene only after the page is usable: on the first scroll, tap, mouse move or key press,
    or once the browser is idle after loading (at most ~2.5 s). Text and buttons respond instantly,
    then the unchanged scene fades in. The 3D code (three.js) isn't even downloaded until then. */
export default function SceneLoader() {
  const [Scene, setScene] = useState<SceneComponent | null>(null);

  useEffect(() => {
    let started = false;
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const events = ["pointerdown", "pointermove", "scroll", "keydown", "touchstart", "wheel"] as const;

    const start = () => {
      if (started) return;
      started = true;
      cleanup();
      import("./Scene").then((m) => setScene(() => m.default));
    };
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      if (idleId !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      if (timer) clearTimeout(timer);
    };

    events.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    const whenIdle = () => {
      if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(start, { timeout: 2500 });
      else timer = setTimeout(start, 1500);
    };
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });

    return () => {
      cleanup();
      window.removeEventListener("load", whenIdle);
    };
  }, []);

  return Scene ? <Scene /> : null;
}
