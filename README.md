# Aevia Launch

An AI-assisted **client-site generator**. A prospect picks a theme, describes their
business in a short wizard, and gets a production-ready, mostly plug-and-play website —
delivered in hours, not weeks.

Aevia Launch is the **lead magnet** of the Aevia suite: a near-ready site is the offer
that converts small businesses without a website, and the natural next step is **Aevia
Inbox** (the AI receptionist/inbox product that Aevia actually sells). Launch is the
door; Inbox is the room.

## What it does

- **373 themes** (`impact-XX`), each a full site design. The catalogue covers ~68 trades
  (5+ models each). Not "15+ templates".
- **Wizard-driven personalization.** The client fills a multi-step form (identity,
  services & prices, reviews, key figures, team, FAQ, hours, address, legal identity,
  brand colour, photos). The chosen theme reads that data directly — this is
  **plug-and-play**: what the client types is shown, what they leave blank keeps the
  theme's own content.
- **AI is a fallback, not the source.** `/api/generate` calls **Gemini 2.5 Flash**
  (with **Groq** as backup, then a local mock as last resort) to fill empty copy blocks
  and SEO metadata only. The content contract always reads client data first, generated
  content second, theme demo content last. AI cost is roughly **$0.0054 per site**.
- **Legal pages generated per business** (mentions légales, CGV by trade archetype,
  privacy, CGU) from the wizard's legal step — templated, no AI call.
- Instant preview via a shareable session link (`/preview/[sessionId]`).

## Stack

Next.js 16 · React 19 · Tailwind CSS v4 · Framer Motion · TypeScript · Vercel (hosting +
Blob sessions). AI: Gemini 2.5 Flash → Groq → local mock fallback.

## Two theme systems — do not confuse them

| System | Route | IDs | Files |
|---|---|---|---|
| **Impact templates** (what clients get) | `app/templates/impact-XX/page.tsx` | numeric `impact-XX` | 373 folders in `app/templates/` |
| **Semantic themes** (older) | `app/themes/[id]/page.tsx` | `ecommerce`, `vitrine`, `landing`, `saas`… | `components/themes/` + `GeneratedSite.tsx` |

The catalogue sold to clients is **100% impact templates**. An `impact-XX` id 404s at
`/themes/impact-XX` — never mix the two in links or redirects.

## Run locally

```bash
npm install
npm run dev        # next dev — http://localhost:3000
```

Local sessions need a Vercel Blob token, or `/api/sessions` returns 404 and themes fall
back to their demo content:

```bash
export BLOB_READ_WRITE_TOKEN=…   # from Vercel dashboard / `vercel env pull`
npm run dev
```

```bash
npm run build      # next build
npm run test       # vitest
```

## Deploy

**Deploy is manual.** Pushing to GitHub does **not** update production.

```bash
export VERCEL_API_TOKEN=…
npx vercel --prod --yes --token "$VERCEL_API_TOKEN"
```

Verify live: `curl -sI https://launch.aevia.services | head -2`

## Live

[launch.aevia.services](https://launch.aevia.services)

## Docs

Start with [`docs/OVERVIEW.md`](docs/OVERVIEW.md) (product role · architecture · pricing ·
legal status). Terms are defined in [`docs/GLOSSARY.md`](docs/GLOSSARY.md). The docs index
is [`docs/README.md`](docs/README.md).
