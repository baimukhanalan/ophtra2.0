# Architecture

API-first, modular, and built so each concern has exactly one home.

## Runtimes

```
                     ┌──────────────────────────┐
   data/*.json ─────▶│  backend  (Express + TS) │◀──── integrations
   (single source)   │  content · booking · CRM │      CRM · MIS · WhatsApp
        │            │  account · payments      │      SMS · email · payments
        │            │  assistant · admin · SEO │
        │            └────────────┬─────────────┘
        │                         │  REST /api
        │            ┌────────────▼─────────────┐
        └───────────▶│ frontend  (Vite + React) │
          bundled     │  design system · motion  │
          fallback    │  23 pages · booking · AI │
                      └──────────────────────────┘
                                  ▲
                        shared/   │  assistant engine · booking rules
                        (both runtimes import the same code)
```

## Why `shared/` exists

The assistant and the booking rules run in both places. If they were
implemented twice they would drift, and the browser fallback would start
answering differently from the API. Keeping them in `shared/` makes that
impossible:

- `shared/assistant/` — intent engine, trilingual phrase templates, the
  `VoiceChannel` contract reserved for the voice assistant.
- `shared/booking/` — opening hours, slot granularity, lead time, deterministic
  demo availability, duplicate detection, booking references.

## Frontend modules

| Module | Responsibility |
| --- | --- |
| `styles/` | Design system: tokens → base → components → motion → layout |
| `motion/` | One scroll controller + hooks + animated components |
| `ui/` | Reusable primitives (Button, Card, Field, Table, Modal, …) |
| `i18n/` | Three dictionaries with a type-enforced identical shape |
| `content/` | Bundled catalogue + selectors |
| `services/` | API client, analytics, accessibility, image optimization |
| `seo/` | Head manager and schema.org builders |
| `layout/` | Header, footer, consent, accessibility panel, route manager |
| `features/` | Booking wizard, assistant widget |
| `pages/` | One file per route, lazily loaded |

Route-level code splitting keeps the initial bundle to the shell plus the home
page; every other page arrives on navigation.

## Backend modules

Each router owns its routes and nothing else:

`catalog` · `booking` · `crm` · `account` · `payments` · `assistant` · `admin` ·
`analytics` · `seo`

Storage sits behind a driver port (`db/types.ts`), integrations behind adapters
(`integrations/*`), and cross-cutting concerns in `lib/` (HTTP errors, auth
tokens, structured logging).

## Data flow: one booking

1. Wizard collects clinic → department → service → doctor → slot → contact.
2. `POST /api/booking/appointments` opens a transaction: upsert patient, check
   for a duplicate and for a taken slot, insert the appointment, raise the
   invoice. Commit.
3. **After** the commit — so a vendor hiccup cannot roll back a confirmed
   appointment — the API upserts the patient in the MIS, creates the MIS
   appointment, pushes the lead to the CRM, records the lead locally with its
   sync status, and dispatches the confirmation on the notification cascade.
4. The browser records a conversion; the server has already stored the event,
   joined to the same session id.

## Degradation

Every public read falls back to the bundled dataset. The assistant falls back to
the in-browser engine. Booking falls back to local slot rules and still captures
the lead. The account and admin panels fall back to demo data and *say so* in
the UI rather than pretending a write persisted.

The principle: a back-office outage must never make the public site look broken,
and must never silently lie to the user about what was saved.
