"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "../data";

/** Quote button that stays at the bottom of the screen on phones. */
export default function MobileCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/contact") || pathname.startsWith("/admin")) return null;
  return (
    <div className="mobile-cta">
      <Link href="/contact" className="btn btn-primary">Get a fixed quote →</Link>
      <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">WhatsApp</a>
    </div>
  );
}
