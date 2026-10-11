import type { Metadata } from "next";
import LeadAgent from "./LeadAgent";
import "./agent.css";

export const metadata: Metadata = {
  title: "Lead Agent",
  robots: { index: false, follow: false },
};

export default function LeadsPage() {
  return (
    <section className="container section-tight agent-page">
      <LeadAgent />
    </section>
  );
}
