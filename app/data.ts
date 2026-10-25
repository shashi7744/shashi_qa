export const site = {
  name: "Shashi Gautam",
  brand: "Shashi.QA",
  email: "shashi.gautam22@gmail.com",
  github: "https://github.com/shashi7744",
  location: "Mumbai, India",
  // ✏️ when you buy a domain, set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://shashiqa.nl) and redeploy
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://shashiqa.vercel.app").replace(/\/$/, ""),
  serving: "Netherlands · Luxembourg · Remote",
  hours: "Mon–Fri · 09:00–17:00 CET",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/check", label: "Website Scan" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/* ---------- Services (Netherlands & Luxembourg, prices in EUR excl. VAT) ---------- */

export type ServiceKey = "web" | "crm" | "ai" | "ig" | "qa";

export type Plan = {
  name: string;
  price: number; // EUR, excl. VAT
  per: string;
  for: string;
  features: string[];
  popular?: boolean;
};

export type Service = {
  key: ServiceKey;
  id: string; // section anchor on /services
  num: string;
  label: string; // short name used in menus and the contact form
  accent: "teal" | "amber" | "violet" | "rec" | "pass";
  title: string;
  lead: string;
  includes: string[];
  from: string;
  local: string; // local market comparison line
  plans: Plan[];
};

export const eur = (n: number) => "€" + n.toLocaleString("en-US");

export const services: Service[] = [
  {
    key: "web", id: "websites", num: "01", label: "Websites", accent: "teal",
    title: "A website that brings in customers, in Dutch and English.",
    lead: "Fast, mobile-first websites for shops, salons, restaurants, clinics and startups. Built in Next.js or WordPress, and tested on every phone and browser before launch.",
    includes: ["NL + EN language versions", "GDPR cookie banner & privacy page", "Google Business & Maps setup", "Online booking or ordering", "Basic SEO & speed tuning", "Hosting & domain setup"],
    from: "from €690",
    local: "Typical Dutch freelancer: €70/hour, €2,000–€6,000 per business site.",
    plans: [
      { name: "Starter", price: 690, per: "one-time", for: "For a shop, salon or café that needs to be found online.", features: ["Up to 5 pages", "NL + EN versions", "Contact form + WhatsApp button", "Cookie banner & privacy page", "Google Maps & basic SEO", "Tested on 8 devices"] },
      { name: "Business", price: 1490, per: "one-time", popular: true, for: "For growing businesses that want leads and bookings.", features: ["Up to 12 pages", "Online booking or ordering", "Blog or product catalogue", "Animated or 3D hero section", "Analytics & speed tuning", "1 month of support"] },
      { name: "Webshop / Web app", price: 2990, per: "starting", for: "For selling online or running a custom platform.", features: ["Products, cart & iDEAL / card payments", "Customer accounts", "Admin dashboard", "Full regression test", "3 months of support"] },
    ],
  },
  {
    key: "crm", id: "crm", num: "02", label: "CRM & apps", accent: "amber",
    title: "All your leads, customers and orders in one place.",
    lead: "Stop losing leads in Excel and WhatsApp. I build simple CRMs and business tools around how your team already works.",
    includes: ["Leads & customer records", "WhatsApp & email follow-ups", "Quotes & invoices in EUR", "Staff logins & roles", "Excel import / export", "EU-hosted, GDPR-friendly data"],
    from: "from €1,490",
    local: "Typical Dutch custom CRM: €5,000–€15,000 plus monthly SaaS fees.",
    plans: [
      { name: "Lead CRM", price: 1490, per: "one-time", for: "For teams tracking leads in Excel or WhatsApp.", features: ["Leads & customer records", "Search, filters, notes", "Excel import / export", "Up to 3 staff logins", "Tested before handover"] },
      { name: "CRM + Automation", price: 2990, per: "one-time", popular: true, for: "For businesses that follow up with many customers.", features: ["Everything in Lead CRM", "WhatsApp & email templates", "Follow-up reminders", "Quotes & invoices in EUR", "Up to 10 staff logins"] },
      { name: "Custom system", price: 4900, per: "starting", for: "For bookings, stock, field teams or anything custom.", features: ["Built around your process", "Web, Android or desktop app", "Reports dashboard", "EU hosting setup", "3 months of support"] },
    ],
  },
  {
    key: "ai", id: "ai-video", num: "03", label: "AI video", accent: "violet",
    title: "Studio-quality video ads without a film crew.",
    lead: "Product ads, explainers and AI presenters, with voice-overs in Dutch, French, German or English. Ready for Instagram, TikTok, YouTube and Meta ads.",
    includes: ["AI product ads", "AI avatar spokesperson", "NL · FR · DE · EN voice-over", "Subtitles burned in", "9:16, 1:1 and 16:9 formats", "Commercial usage rights"],
    from: "from €249",
    local: "Typical Dutch video production: €1,500–€5,000 per commercial.",
    plans: [
      { name: "Single ad", price: 249, per: "per video", for: "For one product launch or offer.", features: ["1 AI video up to 30 s", "Voice-over in 1 language", "Subtitles & music", "9:16 + 1:1 formats", "2 rounds of changes"] },
      { name: "Ad pack", price: 590, per: "3 videos", popular: true, for: "For testing different ads on Meta and TikTok.", features: ["3 AI videos up to 45 s", "Voice-over in 2 languages", "AI avatar presenter option", "All formats incl. 16:9", "Commercial usage rights"] },
      { name: "Monthly video", price: 990, per: "/ month", for: "For brands that need fresh ads every month.", features: ["6 AI videos per month", "NL · FR · DE · EN voice-overs", "Your own AI brand presenter", "Ad hooks tested & refreshed", "Priority delivery"] },
    ],
  },
  {
    key: "ig", id: "instagram", num: "04", label: "Instagram", accent: "rec",
    title: "A feed that posts itself, and reels people watch to the end.",
    lead: "Hook-first reel scripts, fast edits from your raw clips, carousels and a monthly calendar, posted at the hours your audience is online.",
    includes: ["Reel scripts & hooks", "Editing, captions, trending audio", "Carousels & story designs", "Content calendar", "Captions & hashtags in NL/EN", "Monthly growth report"],
    from: "from €390/mo",
    local: "Typical Dutch agency: €500–€3,000 per month for Instagram.",
    plans: [
      { name: "Starter", price: 390, per: "/ month", for: "For keeping your feed active without the effort.", features: ["8 edited reels", "4 carousels or posts", "Captions & hashtags", "Content calendar"] },
      { name: "Growth", price: 790, per: "/ month", popular: true, for: "For businesses that want real reach and followers.", features: ["12 reels + 8 posts", "Hook-first scripts", "Scheduling at peak hours", "Stories every week", "Monthly growth report"] },
      { name: "Brand Pro", price: 1290, per: "/ month", for: "For brands that want Instagram and ads handled.", features: ["20 reels + 12 posts", "2 AI video ads", "Meta ads setup & management", "Comment & DM replies", "Bi-weekly strategy call"] },
    ],
  },
  {
    key: "qa", id: "testing", num: "05", label: "Testing", accent: "pass",
    title: "I find the bugs before your users do.",
    lead: "Already have a website or app? I test it like your customers would, on real phones and browsers, and send bug reports your developers can fix straight away.",
    includes: ["Functional & regression testing", "Cross-browser & mobile", "Checkout & payment flows", "API testing", "Usability review", "Retest after every fix"],
    from: "from €290",
    local: "Typical Dutch freelance tester: €55–€80 per hour.",
    plans: [
      { name: "Quick Audit", price: 290, per: "one-time", for: "Before a launch or after a redesign.", features: ["Test your 3 key flows", "Cross-browser & mobile", "Bug report with screenshots", "Retest after fixes"] },
      { name: "Release Testing", price: 690, per: "/ month", popular: true, for: "For teams that ship updates every month.", features: ["Testing before every release", "Regression checklist", "Bugs logged in your tool", "Weekly summary"] },
      { name: "QA Partner", price: 1190, per: "/ month", for: "Your own part-time tester, without hiring.", features: ["Ongoing testing for your team", "API & usability testing", "Test cases written & maintained", "Priority response in CET hours"] },
    ],
  },
];

export const testTypes = [
  { title: "Functional testing", text: "Every button, form and flow does what it should, including the edge cases users find first." },
  { title: "Regression testing", text: "New releases don't break features that worked yesterday." },
  { title: "Cross-browser & device", text: "Chrome, Safari, Firefox and Edge on desktop, Android and iPhone." },
  { title: "UI & responsive", text: "Layouts, spacing and text checked at real phone, tablet and desktop widths." },
  { title: "API testing", text: "Endpoints checked for correct responses, status codes and error handling." },
  { title: "Usability review", text: "Confusing steps and unclear messages flagged from a real user's point of view." },
];

export const processSteps = [
  { day: "Day 1", title: "Video call", text: "30 minutes on Google Meet or Teams, in your working hours." },
  { day: "Day 2", title: "Fixed quote", text: "Plan, timeline and a fixed price in EUR. No surprises." },
  { day: "Day 3–5", title: "Build & create", text: "I build the site or app, or produce the videos and posts." },
  { day: "Day 5–6", title: "Test & review", text: "Tested on real devices. Two rounds of changes included." },
  { day: "Day 7", title: "Launch", text: "Site live, CRM handed over, content posted on schedule." },
];

export const projects = [
  {
    slug: "parking",
    title: "Secure Parking Management",
    summary: "A web app to manage vehicles, parking slots, entries and exits from one dashboard.",
    stack: ["Next.js", "React", "Vercel"],
    live: "https://secure-parking-nine.vercel.app/",
    screens: [
      { src: "/projects/parking/register.png", label: "Register parking" },
      { src: "/projects/parking/monthly-users.png", label: "Monthly users" },
      { src: "/projects/parking/daily-summary.png", label: "Daily summary" },
      { src: "/projects/parking/reports.png", label: "Reports" },
    ],
    tested: [
      "Vehicle entry and exit flow end to end",
      "Slot availability updates after each action",
      "Form validation for vehicle numbers",
      "Layout on mobile and desktop",
    ],
    accent: "teal",
  },
  {
    slug: "client-intake",
    title: "Client Data Management",
    summary:
      "A member portal for a community organisation: role-based logins, client records organised by State, District, Taluka, City and Ward, citizen complaints and announcements.",
    stack: ["Next.js", "PostgreSQL", "Auth"],
    live: "https://client-intake-app-ten.vercel.app/login",
    screens: [
      { src: "/projects/client-intake/login.jpg", label: "Login" },
      { src: "/projects/client-intake/admin-menu.jpg", label: "Admin menu" },
      { src: "/projects/client-intake/new-client.jpg", label: "New client entry" },
      { src: "/projects/client-intake/announcements.jpg", label: "Announcements" },
    ],
    tested: [
      "Member and citizen-complaint logins, logout and sessions",
      "Admin-only pages blocked for regular members",
      "Multi-step new client entry (account, personal, location)",
      "Announcements with links and photo upload",
      "Empty, long and invalid inputs on every form",
    ],
    accent: "amber",
  },
  {
    slug: "news-weather",
    title: "News & Weather Apps",
    summary: "React apps that pull live headlines and forecasts from public APIs.",
    stack: ["React", "REST APIs"],
    live: "https://github.com/shashi7744",
    liveLabel: "View on GitHub",
    tested: [
      "API errors and slow network states",
      "Loading and empty states",
      "Search by city and category",
    ],
    accent: "violet",
  },
];

export const skills = {
  Testing: ["Manual testing", "Test cases", "Bug reporting", "Regression", "Cross-browser", "API testing (Postman)"],
  Development: ["React.js", "Next.js", "TypeScript", "REST APIs", "GitHub", "Vercel"],
  Data: ["SQL", "PostgreSQL"],
  AI: ["Prompt engineering", "Generative AI", "AI-assisted development"],
};

export const timeline = [
  { role: "Application Support & Testing", org: "Empronc Solution", date: "Feb 2026 – Present", current: true },
  { role: "Medical Representative", org: "Flagship Biotic", date: "Nov 2025 – Feb 2026" },
  { role: "Medical Representative", org: "Celagenex Pvt Ltd", date: "Jan 2024 – Nov 2025" },
  { role: "Medical Representative", org: "Stedman", date: "May 2023 – Jan 2024" },
  { role: "Medical Representative", org: "Prism Life Science", date: "Feb 2021 – May 2023" },
  { role: "Medical Representative", org: "Biotic Health Care", date: "Mar 2019 – Jan 2021" },
];

export const faqs = [
  { q: "Are your prices including VAT?", a: "All prices are in EUR, excluding VAT. For business clients in the EU, the reverse-charge rule usually applies. Check with your accountant." },
  { q: "Can my website be in Dutch, French or German?", a: "Yes. Websites can have Dutch, French, German and English versions. You provide or approve the final texts, and I build and test every language." },
  { q: "Is the website GDPR-compliant?", a: "Every website includes a cookie consent banner, a privacy page template and EU hosting on request. Your legal texts should still be checked for your business." },
  { q: "How long does a project take?", a: "A starter website takes about one week. Business sites take 2–3 weeks and CRMs 3–6 weeks, depending on features. Video and Instagram work starts within a few days." },
  { q: "Do I own the website, code and videos?", a: "Yes. After the final payment you own the code, domain, footage and edited videos, including commercial rights to AI videos." },
  { q: "How do payments work?", a: "50% to start and 50% at handover, by bank transfer (SEPA via Wise) or PayPal. Monthly plans are billed at the start of each month and can be cancelled with 30 days' notice." },
  { q: "Do you need access to our code for testing?", a: "No. I test your app the way your users use it. A staging link and a test account are enough." },
  { q: "Can I try before I commit?", a: "Yes. I'll test one key flow of your website or app for free and send you the bugs I find." },
];
