import type { ServiceKey } from "./data";

/* Extra content for each service's own page (/services/[id]): search titles, who it's for and FAQs.
   ✏️ Edit freely; titles under ~60 characters and descriptions under ~155 show fully in Google. */

export type ServiceDetail = {
  seoTitle: string;
  seoDescription: string;
  audience: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  related: ServiceKey[];
};

export const serviceDetails: Record<ServiceKey, ServiceDetail> = {
  web: {
    seoTitle: "Website Design for Small Businesses in Europe",
    seoDescription:
      "Fast, mobile-first websites in your language for shops, salons, cafés, clinics and startups across Europe. Tested on real devices. From €690, fixed price.",
    audience: [
      { title: "Shops, salons and cafés", text: "A clear site that shows opening hours, prices and a way to book or order." },
      { title: "Clinics and local services", text: "Trust-building pages, Google Maps, reviews and an easy contact form." },
      { title: "Startups", text: "A fast landing page or product site that converts visitors into sign-ups." },
      { title: "Businesses selling abroad", text: "English plus your local language, with each version built and tested." },
    ],
    faqs: [
      { q: "How long does a website take?", a: "A starter site takes 2–3 weeks. Business sites and webshops take 4–8 weeks, depending on pages, languages and features." },
      { q: "Do I need to write the texts?", a: "You share the key facts about your business; I structure the pages and draft the copy, and you approve it before launch." },
      { q: "Can you take over my existing website?", a: "Yes. I can redesign it, move it to faster hosting, or rebuild it while keeping your domain and Google rankings." },
      { q: "What does it cost after launch?", a: "Usually only the domain (about €10–€20 a year) and hosting, which is often free or a few euros a month for a small site. Support plans are optional." },
    ],
    related: ["qa", "crm", "ig"],
  },
  crm: {
    seoTitle: "Custom CRM for Small Businesses",
    seoDescription:
      "Stop losing leads in Excel and WhatsApp. A simple custom CRM for leads, customers, quotes and follow-ups, built around how your team works. From €1,490.",
    audience: [
      { title: "Teams living in Excel", text: "One shared place for leads and customers instead of spreadsheets that go out of date." },
      { title: "WhatsApp-heavy businesses", text: "Track every enquiry and follow up on time, with message templates." },
      { title: "Service businesses", text: "Bookings, quotes and invoices in EUR, connected to the customer record." },
      { title: "Field and office teams", text: "Staff logins with the right access for each role, on phone or desktop." },
    ],
    faqs: [
      { q: "Why custom instead of HubSpot or Pipedrive?", a: "Off-the-shelf CRMs are great but charge per user every month and force their workflow. A custom CRM fits your process and you own it, with no per-seat fees." },
      { q: "How long does a CRM take?", a: "A lead CRM takes about a month. CRMs with automation or custom workflows take 2–3 months, delivered in stages so you can start using it early." },
      { q: "Can I import my existing data?", a: "Yes. Excel and CSV imports are included, and exports too, so your data is never locked in." },
      { q: "Where is the data stored?", a: "On EU hosting on request, with logins, roles and backups set up for GDPR-friendly handling of customer data." },
    ],
    related: ["web", "qa", "ai"],
  },
  ai: {
    seoTitle: "AI Video Ads for Small Businesses",
    seoDescription:
      "Product ads, explainers and AI presenters with voice-overs in 10+ European languages, ready for Instagram, TikTok, YouTube and Meta ads. From €249 per video.",
    audience: [
      { title: "Product launches", text: "A short, polished ad for a new product or offer, without a film crew." },
      { title: "Brands advertising on Meta & TikTok", text: "Several versions to test which hook and message sells best." },
      { title: "Businesses in several countries", text: "The same ad with voice-over and subtitles in each market's language." },
      { title: "Explainers", text: "Show how your service works in 30–60 seconds." },
    ],
    faqs: [
      { q: "How long does an AI video take?", a: "The first video is usually ready in 3–5 working days, including one script round and two rounds of changes." },
      { q: "Can I use the videos in paid ads?", a: "Yes. Every video comes with commercial usage rights for your own marketing and ads." },
      { q: "Do I need to provide footage?", a: "No, but product photos, your logo and any existing clips help the ad look like your brand." },
      { q: "Do AI videos need to be labelled?", a: "Platforms such as Meta and TikTok have rules for labelling realistic AI-generated content. I'll tell you when a label applies and set it up correctly." },
    ],
    related: ["ig", "web", "crm"],
  },
  ig: {
    seoTitle: "Instagram Reels & Post Creation",
    seoDescription:
      "Hook-first reels, carousels and posts with captions and hashtags in your language, delivered ready to upload every month. From €390 per month.",
    audience: [
      { title: "Busy owners", text: "Your feed stays active without you spending evenings editing videos." },
      { title: "Cafés, salons and shops", text: "Turn everyday moments and raw clips into reels people watch to the end." },
      { title: "Brands growing reach", text: "A monthly plan of reels and posts built around what your audience saves and shares." },
      { title: "Multilingual audiences", text: "Captions and hashtags written in the language your customers use." },
    ],
    faqs: [
      { q: "Do you post the content for me?", a: "No. You receive finished, ready-to-upload reels and posts with captions and hashtags, plus suggested posting times, and you upload them yourself." },
      { q: "What do I need to send?", a: "Raw clips and photos from your phone are enough. I write the hooks and scripts, edit, add captions and music, and send the finished files." },
      { q: "How fast do I get the first content?", a: "You get a content plan in week 1 and the first reels and posts within 7 days." },
      { q: "Can I use the reels on TikTok and YouTube Shorts?", a: "Yes. The Brand Pro plan includes versions sized for TikTok and YouTube Shorts." },
    ],
    related: ["ai", "web", "qa"],
  },
  qa: {
    seoTitle: "Website & App Testing Services",
    seoDescription:
      "Manual testing of your website or app on real phones and browsers, with clear bug reports your developers can fix straight away. From €290, report in 3 days.",
    audience: [
      { title: "Before a launch", text: "Find the bugs in sign-up, checkout and payments before your customers do." },
      { title: "After a redesign", text: "Check that everything that used to work still works, on every device." },
      { title: "Teams shipping often", text: "Testing before every release, with a regression checklist kept up to date." },
      { title: "Agencies", text: "An extra tester for client projects, without hiring." },
    ],
    faqs: [
      { q: "Do you need access to our code?", a: "No. I test your website or app the way your users use it. A staging link and a test account are enough." },
      { q: "Which devices do you test on?", a: "iPhone, Android and desktop, in Chrome, Safari, Firefox and Edge, at real phone, tablet and desktop sizes." },
      { q: "What does a bug report look like?", a: "Each issue has the device, steps to reproduce, expected and actual result, severity, and a screenshot or screen recording." },
      { q: "Can I try before I commit?", a: "Yes. I test one key flow of your website or app for free and send you the bugs I find." },
    ],
    related: ["web", "crm", "ai"],
  },
};
