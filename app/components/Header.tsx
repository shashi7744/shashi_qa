"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "../data";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label={`${site.brand} home`}>
          <span className="brand-mark" />
          {site.brand}
        </Link>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
        <nav id="main-nav" className={`nav-links ${open ? "open" : ""}`}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={pathname === l.href ? "active" : ""}>
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary btn-sm nav-cta">
            Free bug check
          </Link>
        </nav>
      </div>
    </header>
  );
}
