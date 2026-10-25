import type { Metadata } from "next";
import WebsiteChecker from "./WebsiteChecker";

export const metadata: Metadata = {
  title: "Free Website Scan",
  alternates: { canonical: "/check" },
  description:
    "Check your website's speed, SEO, accessibility, security and broken links in under a minute. Free report with an AI-written summary of what to fix first.",
};

export default function CheckPage() {
  return (
    <>
      <section className="container page-head">
        <span className="eyebrow"><span className="dot" /> Free website scan</span>
        <h1>How healthy is your website?</h1>
        <p className="lead">
          Enter your address and get a report on speed, SEO, accessibility, security and broken links in under a
          minute, with the three fixes that matter most.
        </p>
      </section>
      <section className="container section-tight">
        <WebsiteChecker />
      </section>
    </>
  );
}
