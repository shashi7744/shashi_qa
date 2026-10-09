"use client";

import { useEffect, useState } from "react";

const lines: { s: "pass" | "fail" | "info"; text: string; ms?: string }[] = [
  { s: "info", text: "$ run suite --app checkout-web --devices all" },
  { s: "pass", text: "login with email + OTP", ms: "212ms" },
  { s: "pass", text: "add item to cart", ms: "340ms" },
  { s: "pass", text: "apply coupon SAVE10", ms: "118ms" },
  { s: "fail", text: "pay button on iPhone Safari" },
  { s: "info", text: "  → BUG-014 · severity: high · repro attached" },
  { s: "pass", text: "order confirmation email", ms: "96ms" },
  { s: "info", text: "4 passed · 1 failed · report sent to team" },
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
    <div className="console" aria-label="Example test run">
      <div className="console-bar">
        <i /><i /><i />
        <span>qa-runner · checkout-web</span>
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
