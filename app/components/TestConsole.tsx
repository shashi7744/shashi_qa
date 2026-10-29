"use client";

import { useEffect, useState } from "react";

// An example project run: one client, every service, realistic timings
const lines: { s: "pass" | "fail" | "info"; text: string; ms?: string }[] = [
  { s: "info", text: '$ ship --client "cafe-lumiere" --country fr' },
  { s: "info", text: "website · EN + FR" },
  { s: "pass", text: "8 pages · booking · cookie banner", ms: "week 3" },
  { s: "pass", text: "64 tests passed on 8 devices", ms: "week 4" },
  { s: "info", text: "crm" },
  { s: "pass", text: "reservations + WhatsApp leads synced", ms: "week 6" },
  { s: "info", text: "ai video" },
  { s: "pass", text: "30 s ad · French voice-over", ms: "day 4" },
  { s: "info", text: "instagram" },
  { s: "pass", text: "12 reels delivered for November", ms: "week 1" },
  { s: "fail", text: "reel #7 waiting for your approval" },
  { s: "info", text: "live · customers can find you now" },
];

export default function TestConsole() {
  const [count, setCount] = useState(lines.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCount(1);
    let i = 1;
    let id: ReturnType<typeof setTimeout>;
    const step = () => {
      i = i >= lines.length ? 1 : i + 1;
      setCount(i);
      // hold the finished run on screen before starting again
      id = setTimeout(step, i === lines.length ? 4000 : 700);
    };
    id = setTimeout(step, 700);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="console" aria-label="Example project from build to launch">
      <div className="console-bar">
        <i /><i /><i />
        <span>project · cafe-lumiere</span>
      </div>
      <pre>
        {lines.slice(0, count).map((l, i) => (
          <div key={i} className={`cl cl-${l.s}`}>
            {l.s === "pass" && <b>✓ </b>}
            {l.s === "fail" && <b>✗ </b>}
            {l.text}
            {l.ms && <span className="cl-ms">{l.ms}</span>}
          </div>
        ))}
        <span className="cursor">▍</span>
      </pre>
    </div>
  );
}
