"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Quote button that stays at the bottom of the screen on phones. */
export default function MobileCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/contact") || pathname.startsWith("/admin")) return null;
  return (
    <div className="mobile-cta">
      <Link href="/contact" className="btn btn-primary">Get a fixed quote →</Link>
      <Link href="/services" className="btn btn-ghost">Prices</Link>
    </div>
  );
}
