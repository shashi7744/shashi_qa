export const site = {
  name: "Shashi Gautam",
  brand: "Shashi.QA",
  email: "shashi.gautam22@gmail.com",
  github: "https://github.com/shashi7744",
  location: "Mumbai, India",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/check", label: "Free Check" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const packages = [
  {
    id: "audit",
    name: "Quick Audit",
    price: "$199",
    unit: "one-time",
    turnaround: "Report in 3 working days",
    best: "Apps about to launch or just launched",
    features: [
      "Up to 15 key user flows tested",
      "Desktop + mobile, 3 browsers",
      "Bug report with screenshots & repro steps",
      "Severity ranking for every issue",
      "One retest of fixed bugs",
    ],
  },
  {
    id: "release",
    name: "Release Testing",
    price: "$499",
    unit: "per month",
    turnaround: "Testing within 48h of each release",
    best: "Startups shipping every week",
    featured: true,
    features: [
      "Testing for up to 4 releases a month",
      "Regression checklist kept up to date",
      "Smoke test before every deploy",
      "Bugs logged in your Jira, Linear or GitHub",
      "Weekly quality summary",
    ],
  },
  {
    id: "partner",
    name: "QA Partner",
    price: "$899",
    unit: "per month",
    turnaround: "Dedicated hours in your time zone",
    best: "Teams without an in-house tester",
    features: [
      "Everything in Release Testing",
      "Written test cases for your whole app",
      "API testing with Postman",
      "Accessibility & performance basics",
      "Joins your standups on Slack",
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
  { title: "Scope", text: "We agree on the flows, devices and browsers to cover. You share a test account." },
  { title: "Test", text: "I run structured test cases plus exploratory testing to find what scripts miss." },
  { title: "Report", text: "You get a clear bug report: steps, expected vs actual, screenshots, severity." },
  { title: "Retest", text: "Once your team fixes the bugs, I verify each fix and close the loop." },
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
  { q: "Do you need access to our code?", a: "No. I test your app the way your users use it. A staging link and a test account are enough." },
  { q: "Which tools do you report bugs in?", a: "Jira, Linear, GitHub Issues, Trello or a shared Google Sheet, whichever your team already uses." },
  { q: "How do we pay?", a: "Monthly plans are billed at the start of each month. The Quick Audit is paid 50% upfront and 50% on delivery." },
  { q: "Can I try before I commit?", a: "Yes. I'll test one flow of your app for free and send you the bugs I find." },
];
