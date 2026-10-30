import Link from "next/link";
import { eur, type Service } from "../data";

/** The three price cards plus delivery time and price comparison for one service. */
export default function PlanCards({ s }: { s: Service }) {
  return (
    <>
      <div className="grid-3 pricing">
        {s.plans.map((p) => (
          <div key={p.name} className={`price-card ${p.popular ? "featured" : ""}`}>
            {p.popular && <span className="badge">Most popular</span>}
            <span className="label">{p.name}</span>
            <div className="price">
              <strong>{eur(p.price)}</strong>
              <span className="muted">{p.per}</span>
            </div>
            <p className="muted">{p.for}</p>
            <ul className="checks">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link
              href={`/contact?service=${s.key}&plan=${encodeURIComponent(p.name)}`}
              className={`btn ${p.popular ? "btn-primary" : "btn-ghost"}`}
            >
              Choose {p.name}
            </Link>
          </div>
        ))}
      </div>
      <div className="svc-meta">
        <span className="svc-time"><b>Delivery</b> {s.time}</span>
        <span className="muted small">For comparison: {s.local} Prices in EUR, excl. VAT.</span>
      </div>
    </>
  );
}
