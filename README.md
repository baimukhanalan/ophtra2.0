# OPHTRA 2.0 — Ophthalmic Centre of Dr Kulmaganbetov

**Live:** https://ophtra2.vercel.app

Redesign of the OPHTRA site to the Figma file «Ophtra — дизайн сайта · 2026» and the technical
specification «Платформа клиники» (docs/TZ.txt). Design contract, Figma notes and the verified
facts about the doctor and the centre: **DESIGN.md** (§7 = the only facts allowed on the site).
Audits and their follow-ups: **audit/** (UI/UX, E2E, performance/SEO, TZ + Figma compliance).

## Deploy (Vercel, with static prerender for search and AI crawlers)

```bash
scripts/deploy.sh          # vercel build → prerender every sitemap route → deploy --prebuilt --prod
```

## Tests

```bash
npm --prefix frontend run verify            # tsc + design/spec tests + SEO files + build
cd e2e && npx playwright test               # ~600 E2E tests (desktop + mobile), needs `vite preview` on :4173
```

## What the client still has to provide (the site is ready for it)

* Real contact data: address, phone/WhatsApp, e-mail, licence number, opening hours → `data/site.json`, `data/clinics.json`.
* Real doctors (photos, credentials) → `data/doctors.json`; set `DOCTORS_ARE_DEMO = false` in `frontend/src/content/pages/people.ts`.
* Backend hosting + database for leads, bookings, account and admin (the Express API in `backend/`), CRM keys
  (HubSpot / Zoho / Salesforce Health Cloud), WhatsApp/e-mail provider, Zoom/Meet/Teams keys.
* Analytics IDs: `VITE_GA4_ID`, `VITE_GTM_ID`, `VITE_CLARITY_ID`, `VITE_GSC_VERIFICATION`.
* Medical reviewers' sign-off for knowledge-base articles; real patient stories (published only with consent).
* Arabic (phase 2) translations.

---

# OPHTRA

Premium corporate website and API for a modern ophthalmology centre.

**Live:** https://ophtra.vercel.app

---

## What this is

A production-ready, API-first web product for an eye clinic: 23 public pages in
three languages, online booking wired to CRM and MIS, a 24/7 assistant, a
patient account with payments, and an administrator panel — on a custom design
system with heavy scroll choreography.

Nothing outside the specification is implemented; every capability the
specification lists is.

## Repository layout

```
data/        Canonical trilingual dataset (ru/kk/en). One source of truth,
             consumed by the API seed and bundled by the site.
shared/      Domain logic used by both runtimes:
             assistant/  intent engine, phrases, voice-channel contract
             booking/    slot rules, duplicate detection, references
frontend/    Vite + React 19 site (design system, motion engine, pages)
backend/     Express + TypeScript API (booking, CRM, MIS, payments, admin)
docs/        Architecture, integrations, database, deployment
```

The `shared/` module is what keeps the two runtimes honest: the browser and the
server run the *same* assistant engine and the *same* booking rules, so the
site's offline fallback can never disagree with the API.

## Quick start

```bash
npm run install:all      # frontend + backend dependencies

npm run dev:api          # API on http://localhost:4000 (seeds itself on first boot)
npm run dev:web          # site on http://localhost:5173 (proxies /api)
```

The site is fully browsable without the API: the catalogue is bundled, the
assistant falls back to the in-browser engine, and the account and admin panels
run against demo data.

**Demo credentials** — patient account: any phone, code `0000`. Admin panel:
`admin` / `ophtra`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run verify` | lint (tsc) + tests + production build |
| `npm run lint` | type-checks both packages |
| `npm test` | 36 contract tests across both packages |
| `npm run build` | generates SEO files, builds the site |
| `npm run db:seed` | seeds the demo database from `data/` |
| `npm run db:reset` | drops and re-seeds the demo database |

## Design system

Tokens live in `frontend/src/styles/tokens.css` and nothing hard-codes a raw
value. The identity is **green and white**: a full `--oph-brand-50…950` emerald
ramp with white space carrying the layout. Typography is Manrope throughout.

Layers load in dependency order — `tokens → base → components → motion →
layout`. The component layer covers every element the specification names
(buttons, inputs, cards, badges, tables, forms, icons, illustrations, empty,
loading, skeleton, success and error states); the motion layer covers the
interaction set.

Illustrations are custom vector art built on one motif — the iris — in
`frontend/src/ui/Illustration.tsx`. No raster assets, no stock imagery.

## Motion

Every scroll effect subscribes to one controller
(`frontend/src/motion/scrollController.ts`): a single passive listener and a
single rAF loop, one layout read per frame, all writes batched after it. That
is what holds 60 FPS on pages with sticky scenes, parallax layers and
horizontal tracks at once.

Animation amplitude is driven by `--oph-motion-scale`. The accessibility panel
and `prefers-reduced-motion` set it to `0`, which collapses scenes into plain
stacked sections rather than merely disabling transitions.

## Accessibility

WCAG 2.1 AA: skip link, visible focus rings, labelled controls, live-region
route announcements, focus trapping and restoration in every overlay, and a
floating panel offering large fonts (up to 128%), a 7:1 high-contrast mode and
reduced motion. Preferences are restored before first paint.

## Documentation

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — module map and data flow
- [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md) — CRM, MIS, WhatsApp, payments, omnichannel
- [docs/DATABASE.md](docs/DATABASE.md) — demo database and the path to production
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel, environment variables, Neon
- [backend/openapi.yaml](backend/openapi.yaml) — API contract

## Status

Implemented to specification except where the brief explicitly scoped it down:
the security section and a full production database were excluded, so the
database ships as a demo driver behind a port that a PostgreSQL implementation
slots into (see `docs/DATABASE.md`), and security is limited to what the
architecture needs to be sound rather than a hardened deployment.
