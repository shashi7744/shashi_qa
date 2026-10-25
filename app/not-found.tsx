import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container page-head">
      <span className="eyebrow mono">BUG-404 · Severity: low</span>
      <h1>This page doesn&apos;t exist.</h1>
      <p className="lead">
        Steps to reproduce: you followed a link. Expected: a page. Actual: nothing here. It may have moved, or the
        address has a typo.
      </p>
      <div className="row">
        <Link href="/" className="btn btn-primary">Back to home →</Link>
        <Link href="/services" className="btn btn-ghost">See services</Link>
      </div>
    </section>
  );
}
