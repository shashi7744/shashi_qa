import type { ServiceKey } from "../data";

/* Blog guides. Each answers a question business owners search for and links to the matching service.
   ✏️ To add a post, copy one block, give it a new slug, and it appears on /blog and in the sitemap. */

export type Block =
  | { h2: string }
  | { p: string }
  | { list: string[] }
  | { tip: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  readMins: number;
  service: ServiceKey; // the service this guide leads to
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "website-cost-small-business-europe",
    title: "How much does a website cost for a small business in Europe?",
    description:
      "Realistic price ranges for a small business website in Europe, what drives the price up, the running costs nobody mentions, and what to ask before you pay.",
    date: "2026-10-30",
    readMins: 6,
    service: "web",
    body: [
      { p: "Ask five web designers for a price and you will get five very different answers, from a few hundred euros to well over ten thousand. Most of that gap comes from a handful of decisions you can make yourself. This guide explains them, so you can compare quotes properly and pay for what your business actually needs." },
      { h2: "Typical price ranges" },
      { p: "These are rough ranges for small businesses across Europe. Prices vary by country and by who builds the site, so treat them as a starting point, not a rule." },
      { list: [
        "Do-it-yourself builders (Wix, Squarespace and similar): around €15–€50 per month, plus your own time.",
        "Simple business site from a freelancer: roughly €600–€2,500 for 3–6 pages.",
        "Business site with booking, a blog or several languages: roughly €1,500–€6,000.",
        "Webshop or custom web app: roughly €3,000 and up, depending on products, payments and features.",
        "Agency projects: often €5,000–€20,000 or more, because you also pay for project management and a larger team.",
      ] },
      { h2: "What makes a website more expensive" },
      { list: [
        "Number of pages and how unique each page design is.",
        "Languages: every extra language means more pages to build, translate and test.",
        "Features: online booking, a shop, customer accounts, payments and integrations.",
        "Content: whether you supply texts and photos or need them written and produced.",
        "Design: a template you adapt costs less than a fully custom design.",
        "Testing: a site checked on real iPhones, Android phones and browsers takes longer, but breaks far less after launch.",
      ] },
      { h2: "The running costs nobody mentions" },
      { p: "The build price is only part of the bill. Budget for these too:" },
      { list: [
        "Domain name: about €10–€20 a year for a .com, .eu or country domain.",
        "Hosting: free to around €30 a month for a small business site; more for busy webshops.",
        "Business email: a few euros per person per month.",
        "Updates and fixes: either your own time, or a support plan.",
        "Paid plugins or apps on platforms like WordPress or Shopify.",
      ] },
      { tip: "Ask every designer for a full list of yearly running costs before you sign. A cheap build with expensive plugins can cost more over three years than a better build." },
      { h2: "Five questions to ask before you pay" },
      { list: [
        "Do I own the website, the code and the domain once it is paid for?",
        "Which devices and browsers will you test it on before launch?",
        "How many rounds of changes are included?",
        "Is it fast on a phone, and will it be set up for Google (titles, descriptions, sitemap)?",
        "What happens if something breaks a month after launch?",
      ] },
      { h2: "How to get a good site without overpaying" },
      { p: "Start small. A clear five-page site that loads fast, works perfectly on phones and tells visitors exactly what to do next will usually win you more customers than a big site with half-finished pages. You can add a blog, booking or a second language later." },
      { p: "Whatever you choose, insist on a fixed price with a clear list of what is included, and on testing before launch. Fixing a broken booking form after customers have found it is always more expensive than catching it first." },
    ],
  },
  {
    slug: "website-launch-checklist",
    title: "Website launch checklist: 25 things to test before you go live",
    description:
      "A practical pre-launch checklist from a software tester: forms, mobile, payments, speed, SEO and legal basics to check before your new website goes live.",
    date: "2026-10-30",
    readMins: 7,
    service: "qa",
    body: [
      { p: "Most website problems are not discovered by the people who built the site. They are discovered by customers, usually on a phone, usually at the worst moment. This is the checklist I use as a tester before a site goes live. Work through it yourself, or hand it to whoever built your site." },
      { h2: "Forms and contact" },
      { list: [
        "Send a test message through every form and confirm it actually arrives.",
        "Submit each form empty, with a wrong email address, and with very long text.",
        "Check the thank-you message or page appears after sending.",
        "Tap every phone number and email link on a phone.",
        "Check WhatsApp or chat buttons open the right conversation.",
      ] },
      { h2: "Mobile and browsers" },
      { list: [
        "Open every page on an iPhone (Safari) and an Android phone (Chrome).",
        "Check nothing is cut off or scrolls sideways on a small screen.",
        "Make sure buttons are big enough to tap with a thumb.",
        "Test on desktop in Chrome, Safari, Firefox and Edge.",
        "Rotate a tablet and check the layout still works.",
      ] },
      { h2: "Bookings, shop and payments" },
      { list: [
        "Complete a real booking or order from start to finish.",
        "Test the payment methods your customers use most, including on a phone.",
        "Check confirmation emails arrive and contain the right details.",
        "Try cancelling, changing quantities and using a discount code.",
        "Check prices, VAT and shipping costs are correct for each country you sell to.",
      ] },
      { h2: "Speed and links" },
      { list: [
        "Load the homepage on mobile data, not just office Wi-Fi.",
        "Make sure images are compressed and not several megabytes each.",
        "Click every link in the menu and footer; look for 404 pages.",
        "Check the site loads with https and shows no security warnings.",
        "Make sure old addresses redirect to the new pages if you replaced a site.",
      ] },
      { h2: "Google and the legal basics" },
      { list: [
        "Every page has its own title and description.",
        "A sitemap exists and is submitted in Google Search Console.",
        "Images have alt text so screen readers and Google understand them.",
        "A cookie banner appears if you use tracking or marketing cookies.",
        "Your privacy page, company details and contact information are easy to find.",
      ] },
      { tip: "You can check several of these automatically with the free Website Scan on this site: speed, SEO tags, security headers, broken links and accessibility basics. A person still needs to test the forms, payments and real phones." },
      { h2: "After launch" },
      { p: "Test again after every bigger change. A new plugin, a theme update or a new payment method can quietly break a form that worked yesterday. A short regression check before each release costs far less than lost bookings." },
    ],
  },
  {
    slug: "ai-video-ads-small-business",
    title: "AI video ads for small businesses: what they cost and when they work",
    description:
      "What AI video ads are, when they work and when they don't, typical costs, formats for Instagram, TikTok and YouTube, and the rules on labelling AI content.",
    date: "2026-10-30",
    readMins: 6,
    service: "ai",
    body: [
      { p: "A few years ago a polished video ad meant a film crew, a studio and a budget most small businesses did not have. AI video tools have changed that. Today a short product ad with a voice-over in several languages can be made in days, for a fraction of the cost. But AI video is not right for every business or every message. Here is how to decide." },
      { h2: "What an AI video ad actually is" },
      { p: "An AI video ad combines AI-generated or AI-edited visuals, a script, a synthetic or recorded voice-over, music and subtitles. It can show your product in new settings, explain a service with motion graphics, or use an AI presenter who speaks to the camera. The best results still start with a clear message and real material from your business: product photos, your logo and your offer." },
      { h2: "When AI video works well" },
      { list: [
        "Product launches and offers that need a short, eye-catching ad.",
        "Testing several hooks or messages in Meta or TikTok ads to see which sells.",
        "Selling in several countries: the same ad with a voice-over in each language.",
        "Explaining a service or process in 30–60 seconds.",
        "Keeping social media active with fresh video every month.",
      ] },
      { h2: "When to choose real footage instead" },
      { list: [
        "When trust depends on seeing real people: your team, your kitchen, your workshop.",
        "Testimonials and reviews, which should always be real customers.",
        "Anything where an AI look would make your brand feel less genuine.",
      ] },
      { p: "Many businesses combine both: real clips from their phone for authenticity, and AI-made ads for launches and campaigns." },
      { h2: "What AI video ads cost" },
      { p: "As a rough guide for small businesses in Europe: a single short AI ad typically costs from a few hundred euros, packs of several ads or monthly plans cost more but bring the price per video down. Traditional video production for a commercial often starts around €1,500 and can reach €5,000 or more. Always check that commercial usage rights are included." },
      { h2: "Formats you need" },
      { list: [
        "9:16 vertical for Instagram Reels, TikTok and YouTube Shorts.",
        "1:1 or 4:5 for feed posts and many ad placements.",
        "16:9 for YouTube and websites.",
        "Subtitles burned in: most social video is watched without sound.",
      ] },
      { h2: "Labelling AI content" },
      { p: "Platforms such as Meta and TikTok have rules for labelling realistic AI-generated content, and the EU AI Act includes transparency rules for AI-generated content. Honest labelling protects your reputation: never present an AI presenter as a real customer, and never use a real person's face or voice without permission." },
      { tip: "Start with one ad and one clear offer. Measure clicks and sales, then make variations of the version that worked. That is where AI video really saves money." },
    ],
  },
];

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);
