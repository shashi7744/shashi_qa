import Link from "next/link";
import { navLinks, site } from "../data";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="stack-sm">
          <span className="brand">
            <span className="brand-mark" />
            {site.brand}
          </span>
          <p className="muted">Websites, CRMs, AI video, Instagram and software testing for businesses in the Netherlands and Luxembourg.</p>
        </div>
        <div className="stack-sm">
          <span className="label">Pages</span>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </div>
        <div className="stack-sm">
          <span className="label">Contact</span>
          <span className="selectable">{site.email}</span>
          <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <span className="muted">{site.serving}</span>
          <span className="muted">{site.hours}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {site.name} · Prices in EUR excl. VAT</span>
        <span className="mono">status: all checks passing ✓</span>
      </div>
    </footer>
  );
}
