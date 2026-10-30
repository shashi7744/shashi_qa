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
  {
    slug: "custom-crm-vs-hubspot-pipedrive",
    title: "Custom CRM vs HubSpot or Pipedrive: which is right for a small business?",
    description:
      "When an off-the-shelf CRM is the smart choice, when a simple custom CRM pays off, and the questions to ask before you move your customer data.",
    date: "2026-10-31",
    readMins: 6,
    service: "crm",
    body: [
      { p: "Most small businesses start tracking customers in a spreadsheet, a notebook or WhatsApp chats. It works until it doesn't: a lead is forgotten, two people call the same customer, or nobody knows which quotes are still open. That is the moment to choose a CRM. The big question is whether to subscribe to a ready-made one or have a simple one built for you." },
      { h2: "When an off-the-shelf CRM is the right choice" },
      { list: [
        "You want to start this week and have no special workflow.",
        "Your process looks like a classic sales pipeline: lead, call, quote, won or lost.",
        "You need many ready-made integrations, such as email marketing or accounting tools.",
        "Your team is small and is likely to stay small, so per-user prices stay low.",
      ] },
      { p: "Tools like HubSpot, Pipedrive and Zoho are mature and well supported. If they fit, use them. You will be up and running quickly, and you can always export your data later." },
      { h2: "When a custom CRM pays off" },
      { list: [
        "Your process doesn't fit a sales pipeline: bookings, repairs, field visits, memberships or stock.",
        "You pay for many users and only use a fraction of the features.",
        "Your team works mainly on WhatsApp and needs follow-ups built around it.",
        "You need quotes and invoices in your own format, in several languages.",
        "You want to own the software and your data, without a monthly fee per person.",
      ] },
      { h2: "What a custom CRM really costs" },
      { p: "A simple custom CRM for leads and customers typically starts in the low thousands of euros, and systems with automation or special workflows cost more. Compare that with your yearly subscription bill: per-user fees add up fast as a team grows, while a custom tool is mostly a one-time cost plus hosting and occasional updates." },
      { tip: "Calculate three years, not one. Multiply the monthly subscription by the number of users and by 36, then compare it with a fixed-price quote for a custom tool." },
      { h2: "Questions to ask before you move your data" },
      { list: [
        "Can I import my existing spreadsheet, and export everything again later?",
        "Where is the data hosted, and is it in the EU?",
        "Who can see what? Can I give staff different roles?",
        "What happens when something breaks, and how fast is it fixed?",
        "Will it work well on a phone for people who are not at a desk?",
      ] },
      { h2: "A sensible way to start" },
      { p: "Start with the smallest version that solves your biggest problem, usually one shared list of leads and customers with reminders. Use it for a month, then add quotes, invoices or automation based on what your team actually needs. Whichever route you choose, insist on testing before handover: a CRM that loses an entry or sends a reminder to the wrong customer quickly loses your team's trust." },
    ],
  },
  {
    slug: "instagram-reel-ideas-small-business",
    title: "20 Instagram reel ideas for small businesses (no dancing needed)",
    description:
      "Twenty reel ideas any café, salon, shop or service business can film on a phone, plus how to write hooks that keep people watching to the end.",
    date: "2026-10-31",
    readMins: 5,
    service: "ig",
    body: [
      { p: "Reels are still one of the best ways for a small business to reach people who don't follow it yet. The good news: the reels that work best for local businesses are rarely trends or dances. They are short, honest clips that show what you do, who you are and why it is worth a visit. Here are twenty ideas you can film on a phone this week." },
      { h2: "Behind the scenes" },
      { list: [
        "Opening up in the morning, in 10 seconds.",
        "How your best-selling product is made, sped up.",
        "A day in the life of one team member.",
        "Unpacking a new delivery or new stock.",
        "The before and after of a job: a haircut, a repair, a clean, a garden.",
      ] },
      { h2: "Teach something" },
      { list: [
        "One mistake customers often make, and how to avoid it.",
        "Three tips in 15 seconds related to your trade.",
        "How to choose the right product or service for your situation.",
        "A myth in your industry, busted.",
        "A quick how-to: store it, use it, care for it.",
      ] },
      { h2: "Show the product or service" },
      { list: [
        "Three ways to use one product.",
        "The full menu or range in one fast swipe.",
        "A price-and-value breakdown: what you get for your money.",
        "The quiet hour: what it feels like to visit at your best time.",
        "A new item or offer, revealed.",
      ] },
      { h2: "Build trust" },
      { list: [
        "Meet the team, one person per reel.",
        "A real customer question, answered on camera.",
        "Your story: why you started the business, in 20 seconds.",
        "Packing or preparing an order with care.",
        "A thank-you to customers after a milestone.",
      ] },
      { h2: "Hooks that keep people watching" },
      { p: "Most viewers decide in the first one or two seconds. Put the most interesting moment first and say what the reel is about immediately, for example \"The one thing we do before every haircut\" or \"Why our bread takes 24 hours\". Add captions, because many people watch without sound, and keep most reels under 30 seconds." },
      { tip: "Film several clips at once on one quiet afternoon. Ten minutes of raw footage is often enough for a whole month of reels once it is edited." },
      { h2: "Consistency beats perfection" },
      { p: "Posting two or three good reels every week, month after month, usually does more for a small business than one expensive video. If you don't have time to script and edit, you can hand over your raw clips and get finished, ready-to-upload reels back." },
    ],
  },
  {
    slug: "multilingual-website-europe",
    title: "Multilingual websites: how to reach customers across Europe",
    description:
      "How to add languages to a small business website properly: which languages to start with, translation quality, SEO with hreflang, and common mistakes.",
    date: "2026-10-31",
    readMins: 6,
    service: "web",
    body: [
      { p: "Selling across Europe means selling in many languages. Many people are happy to browse in English, but most still prefer to buy in their own language, and search engines show local-language pages to local searchers. A second or third language can open a whole new market, if it is done properly." },
      { h2: "Which languages to start with" },
      { list: [
        "Look at where your current customers, enquiries and website visitors come from.",
        "Start with one or two languages where you already see demand.",
        "Add a language only when you can answer customers in it, or have a clear plan for how you will.",
        "Remember that some countries have several languages: Belgium, Switzerland and Luxembourg among them.",
      ] },
      { h2: "Translation quality matters" },
      { p: "Machine translation has become very good, and it is a fine starting point. But a page that reads slightly wrong costs trust, especially for prices, legal text and anything a customer pays for. Have a native speaker review at least your homepage, service pages, checkout and contact pages." },
      { h2: "Do it in a way Google understands" },
      { list: [
        "Give each language its own address, such as /de/ or /fr/, not text that switches by script.",
        "Add hreflang tags so search engines know which page is the version for which language.",
        "Translate the page titles and descriptions, not just the visible text.",
        "List every language version in your sitemap.",
        "Never force visitors into a language based on their location; suggest it and let them switch.",
      ] },
      { tip: "Automatic redirects by country or browser language can stop search engines from ever seeing your other languages, because most crawlers visit from one country with one language setting. A small \"also available in German\" banner is safer." },
      { h2: "Common mistakes" },
      { list: [
        "Translating the menu but leaving buttons, forms and emails in English.",
        "Prices or VAT text that don't match the customer's country.",
        "Phone numbers, dates and currency in the wrong format.",
        "A language switcher hidden at the bottom of the page.",
        "Forgetting to test every language on a phone before launch.",
      ] },
      { h2: "Keep it maintainable" },
      { p: "Every new page now has to exist in every language. Keep the number of pages small, store texts in one place so translations stay in sync, and update all languages together. A smaller site in three good languages beats a large site in five half-translated ones." },
    ],
  },
];

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);
