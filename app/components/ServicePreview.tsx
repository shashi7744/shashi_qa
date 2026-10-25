import type { ServiceKey } from "../data";

/* Small illustrative mock-ups shown next to each service. Decorative only. */

const Bar = ({ label }: { label: string }) => (
  <div className="spec-bar"><b /><b /><b /><span>{label}</span></div>
);

function Website() {
  return (
    <div className="specimen" aria-hidden="true">
      <Bar label="bakkerijdezon.nl" />
      <div className="spec-site">
        <div className="hero-m"><b>Vers brood, elke ochtend.</b><i /><em>Bestel online</em></div>
        <div className="row3"><div /><div /><div /></div>
        <div className="vitals"><span>Performance <b>98</b></span><span>SEO <b>100</b></span><span>Mobile <b>✓</b></span><span>GDPR <b>✓</b></span></div>
      </div>
    </div>
  );
}

function Crm() {
  const rows: [string, string, "new" | "fol" | "won", string, string][] = [
    ["Salon Lotte", "Amsterdam", "new", "New", "€1,200"],
    ["Café Moselle", "Luxembourg", "fol", "Follow up", "€2,450"],
    ["FietsFix BV", "Rotterdam", "won", "Won", "€3,900"],
    ["Studio Noor", "Den Haag", "new", "New", "€860"],
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
      <Bar label="render · skincare-ad-v2.mp4 · 00:30" />
      <div className="spec-vid">
        <div className="vframe">Glow in 7 days</div>
        <div className="tl">
          {tracks.map(([name, clips]) => (
            <div className="trk" key={name}>
              {name}
              <div>{clips.map(([l, w, c], i) => <i key={i} style={{ left: `${l}%`, width: `${w}%`, background: c }} />)}</div>
            </div>
          ))}
          <div className="langs">{["NL", "FR", "DE", "EN", "LB"].map((l) => <span key={l}>{l}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

function Instagram() {
  const tiles: [string, boolean][] = [
    ["linear-gradient(160deg,#FF3B5C,#7A1F5C)", true], ["linear-gradient(170deg,#E8862B,#5A2410)", false],
    ["linear-gradient(150deg,#16A37B,#0E3B47)", true], ["linear-gradient(170deg,#2D5BFF,#13152A)", false],
    ["linear-gradient(160deg,#B05BFF,#2A1450)", true], ["linear-gradient(160deg,#2B8CB0,#0F2A3A)", false],
  ];
  return (
    <div className="specimen" aria-hidden="true">
      <Bar label="@bakkerijdezon · November plan" />
      <div className="spec-ig">
        <div className="prof">
          <div className="av"><i /></div>
          <div className="nums"><span><b>142</b>posts</span><span><b>8.4k</b>followers</span><span><b>+21%</b>reach</span></div>
        </div>
        <div className="gridp">{tiles.map(([bg, reel], i) => <i key={i} className={reel ? "r" : ""} style={{ background: bg }} />)}</div>
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
