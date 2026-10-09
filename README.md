# Shashi.QA — Software testing portfolio

Next.js 15 + React Three Fiber site with a 3D background.
Pages: Home, Services (pricing), Projects, About, Contact.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Edit content
All text, prices, projects and experience live in `app/data.ts`.

## Contact form
The form posts to `/api/contact`. To receive messages by email, set up ONE of these
(in `.env.local` locally, or in Vercel project settings):

- **Gmail:** `GMAIL_USER` and `GMAIL_APP_PASSWORD`. Create the App Password at
  https://myaccount.google.com/apppasswords (needs 2-Step Verification). Used first if set.
- **Resend:** create a free account at resend.com and set `RESEND_API_KEY`.

Without either, messages are printed in the terminal during development.

## Free Website Check (/check)
Visitors enter a URL and get a report on speed, SEO, accessibility, security and broken links.
Logic lives in `lib/checker.ts`; the API is `app/api/check/route.ts`.

Environment variables (all optional, add them in Vercel → Settings → Environment Variables):

| Variable | What it does |
|---|---|
| `PAGESPEED_API_KEY` | Google PageSpeed key (free, from Google Cloud Console). Works without one, but with a low shared limit. |
| `ANTHROPIC_API_KEY` | Turns on the AI-written summary and top 3 fixes. Without it, a rule-based summary is used. |
| `AI_MODEL` | Model for the summary. Default `claude-haiku-4-5-20251001` (cheapest). |
| `CHECK_DAILY_LIMIT` | Free checks per visitor per day. Default 5. |

Only public websites can be checked: private and internal addresses are blocked, including through redirects.
The daily limit is kept in server memory, so it resets when Vercel restarts the function. For a strict limit, move it to Vercel KV or Upstash Redis.

## Go live (Vercel)
1. Push this folder to a GitHub repo.
2. On vercel.com → Add New Project → import the repo → Deploy.
