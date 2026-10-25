"use client";

import { useEffect, useMemo, useState } from "react";

type LeadStatus = "queued" | "checking" | "ready" | "contacted" | "skipped" | "error";

interface Lead {
  url: string;
  title: string;
  source: string;
  status: LeadStatus;
  score?: number;
  issues?: { status: "pass" | "warn" | "fail"; text: string }[];
  emails?: string[];
  emailSources?: Record<string, string>;
  hnUser?: string;
  contactPage?: string;
  socials?: string[];
  subject?: string;
  body?: string;
  aiWritten?: boolean;
  business?: { score: number; label: "Business" | "Maybe" | "Hobby"; signals: string[] };
  need?: { score: number; label: "Needs testing" | "Some issues" | "Looks solid"; evidence: string[] };
  error?: string;
  addedAt: string;
  checkedAt?: string;
  contactedAt?: string;
  followedUpAt?: string;
}

const STORE = "shashiqa-leads-v1";
const SEEN = "shashiqa-seen-v1"; // domains already handled, so they never come back
const KEY = "shashiqa-admin-key";
const DAY = 86_400_000;

type Filter = "all" | LeadStatus | "followup";

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};
const age = (iso?: string) => (iso ? Date.now() - new Date(iso).getTime() : 0);
const needsFollowUp = (l: Lead) => l.status === "contacted" && !l.followedUpAt && age(l.contactedAt) >= 5 * DAY;

/** Old leads drop off on their own: skipped/errors after 3 days, unsent drafts after 14, contacted after 60. */
function prune(ls: Lead[]) {
  const keep: Lead[] = [];
  const gone: Lead[] = [];
  for (const l of ls) {
    const since = l.checkedAt || l.addedAt;
    const expired =
      ((l.status === "skipped" || l.status === "error") && age(since) > 3 * DAY) ||
      ((l.status === "ready" || l.status === "queued") && age(since) > 14 * DAY) ||
      (l.status === "contacted" && age(l.followedUpAt || l.contactedAt) > 60 * DAY);
    (expired ? gone : keep).push(l);
  }
  return { keep, gone };
}

function load<T>(k: string, fallback: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

const statusText: Record<LeadStatus, string> = {
  queued: "Queued",
  checking: "Checking…",
  ready: "Ready to send",
  contacted: "Contacted",
  skipped: "Skipped",
  error: "Couldn't check",
};

export default function LeadAgent() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [paste, setPaste] = useState("");
  const [running, setRunning] = useState(false);
  const [finding, setFinding] = useState(false);
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [seen, setSeen] = useState<string[]>([]);
  const [skipHobby, setSkipHobby] = useState(true);
  const [skipSolid, setSkipSolid] = useState(true);
  const [openUrl, setOpenUrl] = useState<string | null>(null);
  const [warnUrl, setWarnUrl] = useState<string | null>(null);

  useEffect(() => {
    const { keep, gone } = prune(load<Lead[]>(STORE, []));
    setLeads(keep);
    setSeen([...new Set([...load<string[]>(SEEN, []), ...gone.map((l) => hostOf(l.url))])]);
    if (gone.length) setMsg(`Cleaned up ${gone.length} old lead${gone.length === 1 ? "" : "s"}. They won't be added again.`);
    try {
      const k = sessionStorage.getItem(KEY);
      if (k) {
        setKey(k);
        setAuthed(true);
      }
    } catch {}
  }, []);
  useEffect(() => save(STORE, leads), [leads]);
  useEffect(() => save(SEEN, seen.slice(-3000)), [seen]);

  const update = (url: string, patch: Partial<Lead>) =>
    setLeads((ls) => ls.map((l) => (l.url === url ? { ...l, ...patch } : l)));

  /** Removes leads from the list but remembers their domains, so "Find new launches" skips them. */
  function removeLeads(match: (l: Lead) => boolean) {
    const gone = leads.filter(match);
    setLeads((ls) => ls.filter((l) => !match(l)));
    setSeen((s) => [...new Set([...s, ...gone.map((l) => hostOf(l.url))])]);
    return gone.length;
  }

  function addLeads(items: { url: string; title?: string; source: string; hnUser?: string }[]) {
    const known = new Set(seen);
    setLeads((ls) => {
      const have = new Set(ls.map((l) => hostOf(l.url)));
      const fresh: Lead[] = [];
      let old = 0;
      for (const it of items) {
        let u: URL;
        try {
          u = new URL(/^https?:\/\//.test(it.url) ? it.url : "https://" + it.url);
        } catch {
          continue;
        }
        const h = hostOf(u.href);
        if (have.has(h)) continue;
        if (known.has(h) && it.source !== "Manual") {
          old++;
          continue;
        }
        have.add(h);
        fresh.push({ url: u.href, title: it.title || u.hostname, source: it.source, hnUser: it.hnUser, status: "queued", addedAt: new Date().toISOString() });
      }
      const skippedNote = old ? ` Skipped ${old} you've already seen.` : "";
      setMsg(fresh.length ? `Added ${fresh.length} new site${fresh.length === 1 ? "" : "s"}.${skippedNote}` : `No new sites.${skippedNote || " They're already in your list."}`);
      return [...fresh, ...ls];
    });
  }

  function cleanUp(kind: "skipped" | "keep-contacted" | "all") {
    if (kind === "all") {
      if (!confirm("Remove every lead, including people you've contacted? You'll lose your follow-up history.")) return;
      if (leads.length && confirm("Download a CSV backup first?")) exportCsv();
    }
    const n = removeLeads((l) =>
      kind === "skipped" ? l.status === "skipped" || l.status === "error" : kind === "keep-contacted" ? l.status !== "contacted" : true
    );
    setFilter("all");
    setMsg(n ? `Removed ${n} lead${n === 1 ? "" : "s"}. Their sites won't be added again.` : "Nothing to clean up.");
  }

  async function api(path: string, body: unknown) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify(body),
    });
    // a crashed or restarting server can answer with an HTML error page instead of JSON
    const data = await res.json().catch(() => ({ error: `Server error (HTTP ${res.status}). Try again.` }));
    if (res.status === 401) {
      setAuthed(false);
      try { sessionStorage.removeItem(KEY); } catch {}
    }
    if (!res.ok) throw new Error(data.error || "Request failed.");
    return data;
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/agent/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: "{}",
      });
      if (res.status === 401) throw new Error((await res.json()).error || "Wrong password.");
      try { sessionStorage.setItem(KEY, key); } catch {}
      setAuthed(true);
      setMsg("");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Wrong password.");
    }
  }

  async function findNew() {
    setFinding(true);
    setMsg("");
    try {
      const { launches } = await api("/api/agent/launches", { limit: 40 });
      addLeads(launches.map((l: { url: string; title: string; author?: string }) => ({ url: l.url, title: l.title, source: "Show HN", hnUser: l.author })));
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Couldn't load launches.");
    } finally {
      setFinding(false);
    }
  }

  async function runAgent() {
    setRunning(true);
    const queue = leads.filter((l) => l.status === "queued" || l.status === "error");
    for (const l of queue) {
      update(l.url, { status: "checking", error: undefined });
      try {
        const r = await api("/api/agent/analyze", { url: l.url, product: l.title, hnUser: l.hnUser });
        const business = r.contacts.business as Lead["business"];
        const need = r.need as Lead["need"];
        const hobby = skipHobby && business?.label === "Hobby";
        const solid = skipSolid && need?.label === "Looks solid";
        update(l.url, {
          status: hobby || solid ? "skipped" : "ready",
          checkedAt: new Date().toISOString(),
          business,
          need,
          score: r.score,
          issues: r.issues,
          emails: r.contacts.emails,
          emailSources: r.contacts.emailSources,
          contactPage: r.contacts.contactPage,
          socials: r.contacts.socials,
          subject: r.draft.subject,
          body: r.draft.body,
          aiWritten: r.draft.aiWritten,
          error: hobby
            ? "Looks like a hobby project: no pricing, payments, sign-up or app found, so it's unlikely to pay for testing."
            : solid
            ? "Looks solid: no errors, failed requests or broken links found automatically. Low chance of a bug-first pitch."
            : undefined,
        });
      } catch (err) {
        update(l.url, { status: "error", error: err instanceof Error ? err.message : "Failed." });
      }
    }
    setRunning(false);
    setMsg("Agent finished. Review each draft, test the site yourself, then send.");
  }

  /** Blocks sending while the draft still has the placeholder for the bug you found yourself. */
  function needsBug(l: Lead) {
    if (!l.body?.includes("[YOUR BUG HERE")) return false;
    setWarnUrl(l.url); // shown right under the buttons, where you're looking
    document.getElementById(`body-${l.url}`)?.focus();
    return true;
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMsg("Copied.");
    } catch {
      setMsg("Couldn't copy. Select the text and copy it manually.");
    }
  }

  function exportCsv() {
    const rows = [["Site", "Product", "Status", "Score", "Emails", "Email found on", "Contact page", "Subject", "Message"]];
    leads.forEach((l) =>
      rows.push([
        l.url, l.title, statusText[l.status], String(l.score ?? ""), (l.emails || []).join(" "),
        (l.emails || []).map((e) => l.emailSources?.[e] || "").join(" | "), l.contactPage || "", l.subject || "", l.body || "",
      ])
    );
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    leads.forEach((l) => (c[l.status] = (c[l.status] || 0) + 1));
    c.followup = leads.filter(needsFollowUp).length;
    return c;
  }, [leads]);
  // most promising first: real problems count double, business signals add on; unchecked leads stay on top
  const priority = (l: Lead) => (l.need ? l.need.score * 2 + (l.business?.score ?? 0) : 1000);
  const shown = leads
    .filter((l) => filter === "all" || (filter === "followup" ? needsFollowUp(l) : l.status === filter))
    .sort((a, b) => priority(b) - priority(a));
  const queued = (counts.queued || 0) + (counts.error || 0);
  const contactedToday = leads.filter((l) => l.contactedAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;

  if (!authed) {
    return (
      <div className="agent-login card">
        <span className="eyebrow">Private</span>
        <h1 className="agent-h1">Lead Agent</h1>
        <p className="muted">Finds new product launches, checks their sites, and drafts a personal message for each one.</p>
        <form className="form" onSubmit={login}>
          <label htmlFor="admin-key">Admin password
            <input id="admin-key" type="password" autoComplete="current-password" value={key} onChange={(e) => setKey(e.target.value)} required />
          </label>
          {msg && <p className="form-error" role="alert">{msg}</p>}
          <button className="btn btn-primary">Unlock</button>
        </form>
      </div>
    );
  }

  return (
    <div className="agent">
      <header className="agent-head">
        <div>
          <span className="eyebrow">Private · Lead Agent</span>
          <h1 className="agent-h1">Find → Check → Draft → You send</h1>
        </div>
        <div className="agent-kpis">
          <div><strong>{counts.ready || 0}</strong><span>ready</span></div>
          <div><strong>{counts.contacted || 0}</strong><span>contacted</span></div>
          <div className={contactedToday >= 10 ? "kpi-done" : ""}><strong>{contactedToday}/10</strong><span>today</span></div>
        </div>
      </header>

      <div className="agent-controls">
        <div className="card agent-step">
          <span className="step-tag mono">1 · Find</span>
          <button className="btn btn-ghost" onClick={findNew} disabled={finding || running}>
            {finding ? "Searching…" : "Find new launches (Show HN)"}
          </button>
          <label htmlFor="paste" className="label">Or paste websites, one per line</label>
          <textarea id="paste" rows={3} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder={"startup.com\nanother-app.io"} />
          <button className="btn btn-ghost btn-sm fit" disabled={!paste.trim()} onClick={() => {
            addLeads(paste.split(/[\s,]+/).filter(Boolean).map((url) => ({ url, source: "Manual" })));
            setPaste("");
          }}>Add to list</button>
        </div>
        <div className="card agent-step">
          <span className="step-tag mono">2 · Check & draft</span>
          <p className="muted small">Loads each site in Google's real mobile browser, looks for errors, failed requests and broken links, finds a contact email, and writes a draft. About 30 seconds per site.</p>
          <label className="agent-check">
            <input type="checkbox" checked={skipSolid} onChange={(e) => setSkipSolid(e.target.checked)} />
            Skip sites that look solid (no real problems found)
          </label>
          <label className="agent-check">
            <input type="checkbox" checked={skipHobby} onChange={(e) => setSkipHobby(e.target.checked)} />
            Skip hobby projects (no pricing, payments, sign-up or app)
          </label>
          <button className="btn btn-primary" onClick={runAgent} disabled={running || !queued}>
            {running ? "Agent running…" : `Run agent on ${queued} site${queued === 1 ? "" : "s"}`}
          </button>
        </div>
        <div className="card agent-step">
          <span className="step-tag mono">3 · You send</span>
          <ol className="agent-rules">
            <li>Open the site and test one flow yourself for 10 minutes.</li>
            <li>Add one bug <em>you</em> found to the draft.</li>
            <li>Send from your own email. Max 10 a day.</li>
            <li>No reply in 5 days? One short follow-up, then stop.</li>
          </ol>
          <button className="btn btn-ghost btn-sm fit" onClick={exportCsv} disabled={!leads.length}>Export CSV</button>
          <details className="agent-clean">
            <summary className="label">Clean up</summary>
            <p className="muted small">Old leads also clear themselves: skipped after 3 days, unsent after 14, contacted after 60. Removed sites are never added again.</p>
            <div className="row">
              <button className="btn btn-ghost btn-sm" onClick={() => cleanUp("skipped")}>Clear skipped & errors</button>
              <button className="btn btn-ghost btn-sm" onClick={() => cleanUp("keep-contacted")}>Clear all except contacted</button>
              <button className="btn btn-ghost btn-sm" onClick={() => cleanUp("all")}>Clear everything</button>
            </div>
          </details>
        </div>
      </div>

      {msg && <p className="agent-msg" role="status">{msg}</p>}

      <div className="agent-filters" role="tablist">
        {(["all", "ready", "followup", "queued", "contacted", "skipped", "error"] as const).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`${filter === f ? "on" : ""} ${f === "followup" && counts.followup ? "due" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All" : f === "followup" ? "Follow up today" : statusText[f]} <span>{counts[f] || 0}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <div className="card agent-empty">
          <h3>No sites here yet</h3>
          <p className="muted">Click <strong>Find new launches</strong> or paste a few websites to start.</p>
        </div>
      )}

      <ul className="lead-list">
        {shown.map((l) => {
          const open = openUrl === l.url;
          return (
            <li key={l.url} className={`lead card lead-${l.status}`}>
              <button className="lead-row" onClick={() => setOpenUrl(open ? null : l.url)} aria-expanded={open}>
                <span className={`lead-score ${l.score === undefined ? "" : l.score < 50 ? "s-fail" : l.score < 75 ? "s-warn" : "s-pass"}`}>
                  {l.status === "checking" ? "…" : l.score ?? "–"}
                </span>
                <span className="lead-main">
                  <strong>{l.title}</strong>
                  <span className="mono small muted">
                    {new URL(l.url).hostname} · {l.source}
                    {l.business && <span className={`biz biz-${l.business.label.toLowerCase()}`}>{l.business.label}</span>}
                    {l.need && <span className={`biz need-${l.need.label.split(" ")[0].toLowerCase()}`}>{l.need.label}</span>}
                  </span>
                  {l.emails?.[0] && <span className="lead-email mono small">✉ {l.emails[0]}{l.emails.length > 1 ? ` +${l.emails.length - 1}` : ""}</span>}
                </span>
                <span className={`pill lead-pill-${l.status}`}>{statusText[l.status]}</span>
              </button>

              {open && (
                <div className="lead-body">
                  {l.error && <p className="muted small">{l.error}</p>}
                  {l.need && l.need.evidence.length > 0 && (
                    <div className="start-here">
                      <span className="label">Start your manual check here · needs testing {l.need.score}/100</span>
                      <ul className="lead-issues">
                        {l.need.evidence.map((e) => <li key={e} className="li-fail">{e}</li>)}
                      </ul>
                    </div>
                  )}
                  {l.business && (
                    <div>
                      <span className="label">Business signals · {l.business.score}/100</span>
                      <p className="muted small">{l.business.signals.length ? l.business.signals.join(" · ") : "None found"}</p>
                    </div>
                  )}
                  {l.issues && l.issues.length > 0 && (
                    <div>
                      <span className="label">Issues found</span>
                      <ul className="lead-issues">
                        {l.issues.map((i) => <li key={i.text} className={`li-${i.status}`}>{i.text}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="lead-contacts">
                    <span className="label">Contact</span>
                    {l.emails?.length ? (
                      l.emails.map((e) => (
                        <span key={e} className="lead-email-item">
                          <span className="tag selectable">{e}</span>
                          {l.emailSources?.[e] && <span className="muted small">from {l.emailSources[e]}</span>}
                          <button className="btn btn-ghost btn-sm" onClick={() => copy(e)}>Copy</button>
                        </span>
                      ))
                    ) : (
                      <span className="muted small">No public email found. Try the contact page or social links below.</span>
                    )}
                    {l.contactPage && <a className="link small" href={l.contactPage} target="_blank" rel="noopener noreferrer">Contact page ↗</a>}
                    {l.socials?.map((s) => <a key={s} className="link small" href={s} target="_blank" rel="noopener noreferrer">{new URL(s).hostname} ↗</a>)}
                    <a className="link small" href={l.url} target="_blank" rel="noopener noreferrer">Open site ↗</a>
                  </div>
                  {l.body !== undefined && (
                    <div className="lead-draft">
                      <span className="label">Draft {l.aiWritten ? "(AI)" : "(template)"} · edit before sending</span>
                      <input id={`subj-${l.url}`} value={l.subject || ""} onChange={(e) => update(l.url, { subject: e.target.value })} aria-label="Subject" />
                      <textarea id={`body-${l.url}`} rows={10} value={l.body} onChange={(e) => update(l.url, { body: e.target.value })} aria-label="Message" />
                      <div className="row">
                        <button className="btn btn-ghost btn-sm" onClick={() => needsBug(l) || copy(`${l.subject}\n\n${l.body}`)}>Copy message</button>
                        {l.emails?.[0] && (
                          <a
                            className="btn btn-ghost btn-sm"
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(l.emails[0])}&su=${encodeURIComponent(l.subject || "")}&body=${encodeURIComponent(l.body || "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => needsBug(l) && e.preventDefault()}
                          >
                            Open in Gmail
                          </a>
                        )}
                        {l.emails?.[0] && (
                          <a
                            className="btn btn-ghost btn-sm"
                            href={`mailto:${l.emails[0]}?subject=${encodeURIComponent(l.subject || "")}&body=${encodeURIComponent(l.body || "")}`}
                            onClick={(e) => needsBug(l) && e.preventDefault()}
                          >
                            Open in email app
                          </a>
                        )}
                        {l.status !== "contacted" ? (
                          <button className="btn btn-primary btn-sm" onClick={() => needsBug(l) || update(l.url, { status: "contacted", contactedAt: new Date().toISOString() })}>Mark as sent</button>
                        ) : (
                          <>
                            <span className="mono small muted">
                              Sent {new Date(l.contactedAt!).toLocaleDateString()}
                              {l.followedUpAt && ` · followed up ${new Date(l.followedUpAt).toLocaleDateString()}`}
                            </span>
                            {needsFollowUp(l) && (
                              <button className="btn btn-primary btn-sm" onClick={() => update(l.url, { followedUpAt: new Date().toISOString() })}>
                                Mark follow-up sent
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      {warnUrl === l.url && l.body?.includes("[YOUR BUG HERE") && (
                        <p className="form-error" role="alert">
                          Can&apos;t send yet: replace the line <strong>[YOUR BUG HERE …]</strong> in the message above with a real bug you
                          found on this site. Generic emails rarely get replies.
                        </p>
                      )}
                    </div>
                  )}
                  <div className="row">
                    {l.status !== "queued" && l.status !== "contacted" && (
                      <button className="btn btn-ghost btn-sm" onClick={() => update(l.url, { status: "queued" })}>Check again</button>
                    )}
                    {l.status !== "skipped" && l.status !== "contacted" && (
                      <button className="btn btn-ghost btn-sm" onClick={() => update(l.url, { status: "skipped" })}>Skip</button>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => removeLeads((x) => x.url === l.url)}>Remove</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
