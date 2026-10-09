import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SceneLoader from "./components/SceneLoader";

export const metadata: Metadata = {
  title: {
    default: "Shashi.QA | Software Testing Services",
    template: "%s | Shashi.QA",
  },
  description:
    "Manual QA, release testing and bug reports for startups. Shashi Gautam tests your web and mobile apps before your users find the bugs.",
  keywords: ["software testing", "QA services", "manual testing", "bug report", "regression testing", "freelance QA tester"],
  openGraph: {
    title: "Shashi.QA | Software Testing Services",
    description: "Find the bugs before your users do. Manual QA and release testing for startups.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0d1c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <SceneLoader />
        <Header />
        <main className="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
