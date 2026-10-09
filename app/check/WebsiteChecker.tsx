"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Report, Status } from "@/lib/checker";

const steps = [
  "Loading your page",
  "Checking SEO tags and headings",
  "Scanning images and forms for accessibility",
  "Testing links and images",
  "Reviewing security headers",
  "Running Google's mobile speed test",
  "Writing your summary",
];

const statusLabel: Record<Status, string> = { pass: "Passed", warn: "Improve", fail: "Fix" };

function grade(score: number) {
  if (score >= 90) return { label: "Excellent", tone: "pass" as Status };
  if (score >= 70) return { label: "Good", tone: "pass" as Status };
  if (score >= 50) return { label: "Needs work", tone: "warn" as Status };
  return { label: "Poor", tone: "fail" as Status };
}

function Gauge({ score, size = 168 }: { score: number; size?: number }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const tone = grade(score).tone;
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" className={`gauge tone-${tone}`} role="img" aria-label={`Score ${score} out of 100`}>
      <circle cx="90" cy="90" r={r} className="gauge-track" />
      <circle
        cx="90" cy="90" r={r} className="gauge-fill"
        strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)}
        transform="rotate(-90 90 90)"
      />
      <text x="90" y="92" textAnchor="middle" className="gauge-num">{score}</text>
      <text x="90" y="118" textAnchor="middle" className="gauge-sub">/ 100</text>
    </svg>
  );
}

export default function WebsiteChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) return;
    setStep(0);
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 4500);
    return () => clearInterval(id);
  }, [loading]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setReport(data);
      const worst = [...data.categories].filter((c: any) => c.score !== null).sort((a: any, b: any) => a.score - b.score)[0];
      setOpen(worst?.key ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const issues = report ? report.categories.flatMap((c) => c.items).filter((i) => i.status !== "pass").length : 0;
  const host = report ? new URL(report.finalUrl).hostname : "";

  return (
    <div className="checker">
      <form className="check-form" onSubmit={onSubmit}>
        <label htmlFor="check-url" className="sr-only">Website address</label>
        {!/^https?:\/\//i.test(url) && <span className="check-prefix mono" aria-hidden="true">https://</span>}
        <input
          id="check-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourwebsite.com"
          inputMode="url"
          autoComplete="url"
          required
          disabled={loading}
        />
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Checking…" : "Check my site →"}
        </button>
      </form>
      <p className="muted small check-note">Free · 5 checks a day · Only public pages are scanned, nothing is changed on your site.</p>

      {error && <div className="check-error" role="alert">{error}</div>}

      {loading && (
        <div className="check-loading card" aria-live="polite">
          <div className="scan-bar"><span /></div>
          <ol className="check-steps">
            {steps.map((s, i) => (
              <li key={s} className={i < step ? "done" : i === step ? "now" : ""}>
                <span className="mono">{i < step ? "✓" : i === step ? "›" : "·"}</span> {s}
              </li>
            ))}
          </ol>
          <p className="muted small">This takes 20–50 seconds because Google's speed test loads your site on a simulated phone.</p>
        </div>
      )}

      {report && (
        <div className="report" aria-live="polite">
          {/* Summary */}
          <div className="report-top card">
            <div className="report-score">
              <Gauge score={report.overall} />
              <span className={`pill tone-pill-${grade(report.overall).tone}`}>{grade(report.overall).label}</span>
            </div>
            <div className="stack">
              <div>
                <span className="label">Report for</span>
                <h2 className="report-host">{host}</h2>
                <span className="muted small mono">
                  {issues} issue{issues === 1 ? "" : "s"} found · checked {new Date(report.checkedAt).toLocaleString()}
                </span>
              </div>
              <div className="ai-box">
                <span className="label">{report.aiWritten ? "AI summary" : "Summary"}</span>
                <p>{report.summary}</p>
              </div>
              {report.topFixes.length > 0 && (
                <div>
                  <span className="label">Fix these first</span>
                  <ol className="fixes">
                    {report.topFixes.map((f) => <li key={f}>{f}</li>)}
                  </ol>
                </div>
              )}
            </div>
          </div>

          {/* Category scores */}
          <div className="cat-grid">
            {report.categories.map((c) => (
              <button
                key={c.key}
                className={`cat-tile ${open === c.key ? "active" : ""}`}
                onClick={() => setOpen(open === c.key ? null : c.key)}
                aria-expanded={open === c.key}
              >
                <span className="label">{c.label}</span>
                {c.score === null ? (
                  <strong className="muted">n/a</strong>
                ) : (
                  <strong className={`tone-${grade(c.score).tone}`}>{c.score}</strong>
                )}
                <span className="cat-bar"><span style={{ width: `${c.score ?? 0}%` }} className={`bg-${c.score === null ? "warn" : grade(c.score).tone}`} /></span>
                <span className="muted small">
                  {c.items.filter((i) => i.status !== "pass").length
                    ? `${c.items.filter((i) => i.status !== "pass").length} to improve`
                    : "All checks passed"}
                </span>
              </button>
            ))}
          </div>

          {/* Details */}
          {report.categories.filter((c) => c.key === open).map((c) => (
            <div key={c.key} className="card detail-card">
              <h3>{c.label}</h3>
              <ul className="check-list">
                {[...c.items].sort((a, b) => ["fail", "warn", "pass"].indexOf(a.status) - ["fail", "warn", "pass"].indexOf(b.status)).map((i) => (
                  <li key={i.id} className={`ci ci-${i.status}`}>
                    <span className={`pill tone-pill-${i.status}`}>{statusLabel[i.status]}</span>
                    <div>
                      <strong>{i.title}</strong>
                      <p className="muted">{i.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Speed metrics */}
          {report.metrics.length > 0 && (
            <div className="card">
              <h3>Mobile speed (Google Lighthouse)</h3>
              <div className="metric-row">
                {report.metrics.map((m) => (
                  <div key={m.label} className="metric">
                    <span className="label">{m.label}</span>
                    <strong className={`tone-${m.status}`}>{m.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="cta-band">
            <div>
              <h2>Automated checks catch {issues ? "these" : "the basics"}. A tester catches the rest.</h2>
              <p className="lead">
                Tools can't tell you if your checkout fails on an iPhone or your sign-up email never arrives. I'll test
                one key flow on {host} for free.
              </p>
            </div>
            <Link href={`/contact?plan=free&url=${encodeURIComponent(report.finalUrl)}`} className="btn btn-primary">
              Book a free manual test →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
