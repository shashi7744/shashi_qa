import type { ServiceKey } from "../data";

/* Small illustrative mock-ups shown next to each service. Decorative only. */

const Bar = ({ label }: { label: string }) => (
  <div className="spec-bar"><b /><b /><b /><span>{label}</span></div>
);

function Website() {
  return (
    <div className="specimen" aria-hidden="true">
      <Bar label="cafe-lumiere.fr · EN | FR | DE" />
      <div className="spec-site">
        <div className="hero-m"><b>Fresh pastries, every morning.</b><i /><em>Book a table</em></div>
        <div className="row3"><div /><div /><div /></div>
        <div className="vitals"><span>Performance <b>98</b></span><span>SEO <b>100</b></span><span>Mobile <b>✓</b></span><span>GDPR <b>✓</b></span></div>
      </div>
    </div>
  );
}

function Crm() {
  const rows: [string, string, "new" | "fol" | "won", string, string][] = [
    ["Salon Lotte", "Amsterdam", "new", "New", "€1,200"],
    ["Café Lumière", "Lyon", "fol", "Follow up", "€2,450"],
    ["Velo Werk GmbH", "Munich", "won", "Won", "€3,900"],
    ["Studio Sol", "Barcelona", "new", "New", "€860"],
  ];
  return (
    <div className="specimen" aria-hidden="true">
      <Bar label="crm · leads this week" />
      <div className="spec-crm">
        <table>
          <thead><tr><th>Lead</th><th>City</th><th>Status</th><th className="num">Value</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td><span className={`st ${r[2]}`}>{r[3]}</span></td><td className="num">{r[4]}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AiVideo() {
  const tracks: [string, [number, number, string][]][] = [
    ["VIDEO", [[0, 34, "var(--violet)"], [36, 30, "color-mix(in srgb, var(--violet) 70%, #fff)"], [68, 32, "var(--violet)"]]],
    ["VOICE", [[4, 58, "var(--teal)"], [66, 28, "var(--teal)"]]],
    ["MUSIC", [[0, 100, "color-mix(in srgb, var(--amber) 60%, var(--surface-solid))"]]],
    ["SUBS", [[4, 20, "var(--muted)"], [28, 22, "var(--muted)"], [54, 18, "var(--muted)"], [76, 18, "var(--muted)"]]],
  ];
  return (
    <div className="specimen" aria-hidden="true">
      <Bar label="render · go-gember-ad-nl.mp4 · 01:00" />
      <div className="spec-vid">
        {/* a real frame from the Go Gember ad in /work */}
        <div className="vframe" style={{ backgroundImage: "url(/work/frames/ai-frame.jpg)" }} />
        <div className="tl">
          {tracks.map(([name, clips]) => (
            <div className="trk" key={name}>
              {name}
              <div>{clips.map(([l, w, c], i) => <i key={i} style={{ left: `${l}%`, width: `${w}%`, background: c }} />)}</div>
            </div>
          ))}
          <div className="langs">{["EN", "DE", "FR", "NL", "ES", "IT", "+5"].map((l) => <span key={l}>{l}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

function Instagram() {
  // [frame from our own videos, is a reel, hook text, kind]
  const tiles: [string, boolean, string, string][] = [
    ["/work/frames/ig-1.jpg", true, "Tired by 3 pm?", "reel · 0:15"],
    ["/work/frames/ig-2.jpg", false, "Why cold-pressed?", "carousel · 6"],
    ["/work/frames/ig-3.jpg", true, "Meet the maker", "reel · 0:28"],
    ["/work/cloutcraft-studio-promo.jpg", false, "Fast websites", "post"],
    ["/work/frames/ig-6.jpg", true, "New: Mango Leaf", "reel · 0:20"],
    ["/work/frames/ig-4.jpg", false, "How we build it", "carousel · 5"],
  ];
  return (
    <div className="specimen" aria-hidden="true">
      <Bar label="sample feed · one month's plan" />
      <div className="spec-ig">
        <div className="prof">
          <div className="av"><i /></div>
          <div className="nums"><span><b>12</b>posts</span><span><b>6</b>reels</span><span><b>4</b>carousels</span></div>
        </div>
        <div className="gridp">
          {tiles.map(([img, reel, hook, meta], i) => (
            <div key={i} className={`igp ${reel ? "r" : ""}`} style={{ backgroundImage: `url(${img})` }}>
              <span className="igp-hook">{hook}</span>
              <span className="igp-meta">{meta}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Testing() {
  return (
    <div className="specimen" aria-hidden="true">
      <Bar label="qa-runner · webshop-checkout" />
      <pre className="spec-run">
        <span className="ok">✓</span> login with email + code       <span className="dim">212ms</span>{"\n"}
        <span className="ok">✓</span> add item to cart              <span className="dim">340ms</span>{"\n"}
        <span className="ok">✓</span> pay with iDEAL                <span className="dim">880ms</span>{"\n"}
        <span className="bad">✗</span> pay button on iPhone Safari{"\n"}
        {"  "}<span className="dim">→ BUG-014 · Severity: High</span>{"\n"}
        <span className="ok">✓</span> order confirmation email      <span className="dim">1.2s</span>{"\n\n"}
        <span className="ok">4 passed</span> · <span className="bad">1 failed</span> · report sent to team
      </pre>
    </div>
  );
}

export const SERVICE_PREVIEW: Record<ServiceKey, () => React.JSX.Element> = {
  web: Website,
  crm: Crm,
  ai: AiVideo,
  ig: Instagram,
  qa: Testing,
};
