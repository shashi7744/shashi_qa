import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SceneLoader from "./components/SceneLoader";
import MobileCta from "./components/MobileCta";
import { services, site } from "./data";

// Self-hosted by Next.js: no request to Google Fonts, no layout shift while fonts load
const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display", display: "swap" });
const body = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

const description =
  "Websites, CRMs, AI video ads, Instagram reels and software testing for small businesses across Europe. Fixed prices in EUR, delivered remotely.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Shashi Studio | Websites, CRM, AI video, Instagram & Testing",
    template: "%s | Shashi Studio",
  },
  description,
  keywords: [
    "website for small business Europe", "freelance web developer Europe", "CRM for small business",
    "AI video ads", "AI video agency Europe", "Instagram reels management", "social media management",
    "software testing services", "website testing", "website laten maken", "Webseite erstellen lassen",
  ],
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Shashi Studio | Build it. Test it. Grow it on reels.",
    description: "Websites, CRMs, AI video, Instagram and testing for businesses across Europe. Fixed prices in EUR.",
    siteName: site.brand,
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // ✏️ set GOOGLE_SITE_VERIFICATION in Vercel to the code from Google Search Console (HTML tag method)
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0a0d1c",
};

/* Tells Google who the business is, where it works and what it offers */
const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#business`,
  name: site.brand,
  url: site.url,
  email: site.email,
  image: `${site.url}/opengraph-image`,
  description,
  priceRange: "€€",
  currenciesAccepted: "EUR",
  telephone: site.phone.replace(/\s/g, ""),
  areaServed: { "@type": "Continent", name: "Europe" },
  availableLanguage: ["English"],
  founder: {
    "@type": "Person",
    name: site.name,
    jobTitle: "Web developer, software tester and AI video creator",
    sameAs: [site.github],
  },
  sameAs: [site.github],
  knowsAbout: services.map((s) => s.label),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
        <SceneLoader />
        <Header />
        <main className="main">{children}</main>
        <Footer />
        <MobileCta />
      </body>
    </html>
  );
}
