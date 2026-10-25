import { ImageResponse } from "next/og";
import { services } from "./data";

/* The preview image shown when the site is shared on WhatsApp, LinkedIn, Facebook or X */
export const alt = "Shashi.QA: websites, CRM, AI video, Instagram and testing for the Netherlands and Luxembourg";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS: Record<string, string> = { teal: "#3ee0cf", amber: "#f2a649", violet: "#9b8cff", rec: "#ff5d6c", pass: "#4ade8a" };

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "64px 72px", color: "#eceefb", fontFamily: "sans-serif",
          backgroundColor: "#0a0d1c",
          backgroundImage: "radial-gradient(circle at 85% 0%, #1a2150 0%, rgba(10,13,28,0) 60%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 800 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#3ee0cf,#f2a649)", transform: "rotate(45deg)" }} />
          Shashi.QA
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>Build it. Test it.</div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            <span style={{ color: "#3ee0cf" }}>Grow</span>&nbsp;it on reels.
          </div>
          <div style={{ fontSize: 30, color: "#9aa1c8" }}>For small businesses in the Netherlands &amp; Luxembourg · Fixed prices in EUR</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {services.map((s) => (
            <div
              key={s.key}
              style={{
                display: "flex", flexDirection: "column", padding: "14px 20px", borderRadius: 14,
                border: "1px solid rgba(141,150,201,0.3)", borderTop: `4px solid ${COLORS[s.accent]}`, background: "rgba(20,25,50,0.8)",
              }}
            >
              <span style={{ fontSize: 24, fontWeight: 700 }}>{s.label}</span>
              <span style={{ fontSize: 20, color: COLORS[s.accent] }}>{s.from}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
