"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string; accent: string };

/** Sticky menu on /services that highlights the section you are reading. */
export default function ServiceNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.35;
      let current = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= line) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  // keep the active pill visible when the menu scrolls sideways on phones
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`.svc-nav a[href="#${active}"]`);
    const row = el?.parentElement;
    if (el && row && row.scrollWidth > row.clientWidth) {
      row.scrollTo({ left: el.offsetLeft - row.clientWidth / 2 + el.offsetWidth / 2, behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav className="svc-nav" aria-label="Jump to a service">
      <div className="container svc-nav-inner">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`accent-${it.accent} ${active === it.id ? "on" : ""}`}
            aria-current={active === it.id ? "true" : undefined}
          >
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
