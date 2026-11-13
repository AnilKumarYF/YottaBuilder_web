# YottaBuilder.ai — website (v2)

Next.js 16 (App Router) + React 19 + Tailwind v4 frontend for yottabuilder.ai, running **headless on the existing WordPress site**.

## Architecture

| Concern | Where it lives |
|---|---|
| Marketing pages (Home, Platform, How It Works, Integrations, About Us, Early Access) | This app |
| Blog posts and job openings | WordPress (categories `Blog` = 26, `JOBS` = 24), read through the REST API with 10-minute ISR |
| Early-access form | Posted to `/api/early-access` → forwarded server-side to the existing Elementor Pro form (post 2282, form `51fe5f41`) so WordPress email notifications and submission records keep working |
| Job application form | Posted to `/api/apply` → forwarded to the existing Elementor Pro form (post 2424, form `2970557`), including the resume upload |

Blog and job posts keep their original URLs (`/<slug>/`). `/careers-2` → `/careers` is a permanent redirect.

## Before cutover

1. WordPress must stay reachable at a URL the app can call. If yottabuilder.ai is pointed at this app, move WordPress to a subdomain, for example `cms.yottabuilder.ai`, and set `WP_BASE_URL`. Keep the WordPress *Site URL* setting consistent, or Elementor form submissions can fail.
2. Allow that host in `next.config.ts` → `images.remotePatterns` (currently `yottabuilder.ai`).
3. Submit one real early-access form and one job application end to end, and confirm the notification emails arrive. Automated tests run in `FORMS_DRY_RUN=1` mode and never post to WordPress.
4. Resume uploads are capped at 4 MB, which stays under the ~4.5 MB request-body limit of serverless hosts such as Vercel.

## Environment

See `.env.example`: `NEXT_PUBLIC_SITE_URL`, `WP_BASE_URL`, `FORMS_DRY_RUN`.

## Scripts

```bash
npm run dev        # local dev
npm run build      # production build
npm run start      # serve the build
npm run typecheck
npm run test:e2e   # Playwright: desktop / tablet / mobile (build first)
```

## Design system — "Graphite & Signal"

- Tokens live in `src/app/globals.css` (`@theme`). Token names are kept from v1, so components didn't change.
- **Neutrals:** abyss `#0A0B0D`, midnight `#121417`, graphite `#1A1D22`, paper `#F6F6F3`, ink `#0D0F12`, slate `#575D68`, steel `#9AA1AC`.
- **Signal cyan** `#22C3C9` (`electric`) marks AI work and interactive elements. It harmonises with the teal in the YottaBuilder logo. Use `electric-700` `#0E7F84` for cyan text on light backgrounds.
- **Deep petrol** `#0B3B3F` (`brand`) is used for feature surfaces and for links and labels on light backgrounds.
- **Amber** `#E8A33D` (`gold`) is reserved for human approval gates. **Green** `#3DD68C` (`teal`) means verified or shipped.
- Primary buttons are cyan with dark ink text. Headline accents use a muted second tone, not a gradient.
- Type: Geist (headings and body) and Geist Mono (technical labels).
- Brand files: originals are kept untouched in `brand-assets/original/`. Web copies are in `public/brand/`. The YottaBuilder lockup has a white wordmark, so use it on dark backgrounds only.

## Content rules

- Verified business facts live in `src/content/site.ts`, and product copy lives in `src/content/product.ts`. Both are sourced from the live site.
- No certifications are displayed. The live site's "SOC 2 Ready" label was left out because no evidence was supplied.
- Product UI in the demo and the audit-trail card is labelled as illustrative sample data.
- Technology names are typographic wordmarks with a no-endorsement footnote, not third-party logos.
