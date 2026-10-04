# OPHTRA 2.0: final compliance re-audit (TZ, Figma, fact-check)

Date: 2026-09-25 (afternoon). Build audited: production preview at http://localhost:4173 (`frontend/dist`, built after the latest source change). Backend: not running. `/api/*` returns 500.
Scope: this is a report only. Nothing under `frontend/` was edited, and the build and server were not restarted.
Baseline: `audit/compliance-report.md` (morning run). Its totals were ✅ 98 · ⚠️ 63 · ❌ 7 · N/A 6.

Evidence and tooling
- Scripts are in `e2e/final/`:
  - `crawl.mjs`: 43 routes × RU/KK/EN at 1440 px. Records h1/h2, JSON-LD types, hreflang, select styling, overflow, broken images and console errors, and writes innerText to `text/<lang>/*.txt`.
  - `targeted.mjs`: first-visit cookie card, header, mega-menu frame sampler, viewport shots.
  - `floats.mjs`: consent card and floating buttons against the hero CTAs; Pixel 7, iPhone SE and 1440; RU and EN.
  - `perf.mjs`: preloader lift, FCP, LCP and CLS; desktop, and Pixel 7 on slow 4G with 4× CPU.
  - `sheets.py`: contact sheets.
- Outputs are in `e2e/results/final/`:
  - `crawl-{ru,en,kk}.json`, `text/{ru,en,kk}/`
  - `shots/ru/*.png` (full page, 1440), `sheets/*.jpg`
  - `targeted/targeted.json`, `targeted/floats.json`, `targeted/*.png`
  - `perf.json`
- Code-level re-checks used file reads plus `curl` of the raw HTML. `tsc --noEmit` passes.
- Caveat: a full E2E run was using the same server at the same time, so the absolute timing numbers are somewhat pessimistic.

Legend: ✅ done · ⚠️ partial · ❌ missing · N/A process deliverable · **Δ** = status or evidence changed since the previous report · **🔑** = "⚠️ ready — needs client keys/infrastructure" (listed in §2).

---

## 0. Status of the previous critical findings (A-1 … A-8)

| # | Previous | Now | What changed / what remains |
|---|---|---|---|
| A-1 Leads not delivered | ❌ | ⚠️ 🔑 Δ | The UI no longer claims delivery. When the API fails, the form says «Заявка сохранена… будет отправлена автоматически» (`LeadForm.tsx:52-63,219-224`), and offline booking says the slot is not held (`BookingWizard.tsx:411-429`). The backend is still not deployed: `vercel.json` rewrites everything except `/api/` and has no function. **New:** `BookingWizard.tsx:416` fires `trackConversion('booking_confirmed')` in the offline branch, so analytics counts bookings that never reached the clinic. |
| A-2 Files never uploaded | ❌ | ⚠️ Δ | The copy is now honest: the hint says the coordinator will send a secure link, and the "encrypted" claim is gone (`LeadForm.tsx:44-48,64`; `patients-second-opinion.ts:99-101`). File bytes are still not sent (`LeadForm.tsx:195,209`). One leftover: «загрузите их в заявку» (`patients-consultation.ts:142`). |
| A-3 Demo credentials public | ❌ | ⚠️ Δ | The footer admin link is gone and `/admin` no longer prints the credentials. However, `AdminPage.tsx:56-57,213` ships a salted SHA-256 of the same `admin:ophtra` pair, so they are unchanged and guessable. `/account` still shows and auto-fills code 0000 (`AccountPage.tsx:56,203-206,375-380`). The backend defaults are unchanged (`backend/src/config/env.ts:38-41`). |
| A-4 Fabricated reviews + AggregateRating | ❌ | ❌ Δ | The AggregateRating and Review JSON-LD are removed (`Seo.tsx:370-382`). **Regression:** the 8 invented reviews are still on `/reviews` and in the home «Истории пациентов» rail, and neither place has a demo label. `/reviews` now *asserts* verification: «Отзывы публикуются после проверки клиникой: мы подтверждаем, что автор был на приёме…» (`content/pages/platform.ts:573-582`). Meanwhile the site itself says the centre has not opened yet (`media.ts`, `/about`). |
| A-5 Figma #4 / #5 | ❌ | #4 ✅ · #5 ⚠️ Δ | See §3. |
| A-6 Tiled select chevrons | ❌ | ✅ Δ | `figma-components.css:198-218`. In the crawl, every `<select>` on 43 routes × 3 languages has `background-repeat: no-repeat`. |
| A-7 Preloader delays content | ❌ | ⚠️ Δ | The curtain now lifts at 2.3–3.2 s (`main.tsx:24-25`); before, content appeared at 4.4 s. Measured lift: desktop 2.33–2.38 s; mobile on slow 4G 2.7–4.1 s. LCP: desktop 4.4–5.7 s; mobile 4.7–7.0 s. **CLS is fixed: 0–0.025** (was 0.22–0.24). There is still no skip for repeat visits or inner routes. **New:** `index.html:7-20` rewrites every in-tab *reload* of an inner URL to `/`, so a patient who refreshes `/appointment` lands on the home page. |
| A-8 No prerender / language URLs | ❌ | ❌ | `frontend/scripts/prerender.mjs` exists but is not part of any build (not `package.json` build and not the `vercel.json` buildCommand). `dist/` has a single `index.html`. `curl /dr-kulmaganbetov`, `/services/oct` and `/en/dr-kulmaganbetov` return the same 13 kB shell: generic title, no h1, static JSON-LD only. Client-side hreflang now uses `?lang=kk|en` (`Seo.tsx:96-101`, honoured by `i18n/index.tsx:40-44`) Δ, but `sitemap.xml` still points all alternates at the same URL, and the raw HTML for `?lang=en` is Russian. |

---

## 1. TZ compliance matrix

### 6.1 Goals / §1 Project goal
| Item | Status | Evidence / gap |
|---|---|---|
| Patient acquisition platform | ⚠️ 🔑 Δ | `/appointment` wizard (6 steps) and lead forms on 9 pages work. The copy is now honest, but leads stay in the browser outbox until a backend is deployed. |
| Scientific authority | ✅ | `/science`, `/dr-kulmaganbetov`, 3 real 2026 papers |
| International patient portal | ✅ | `/international-patients` |
| Medical tourism platform | ✅ | `CostEstimator.tsx` (KZT + USD), travel cards, coordinator |
| Founder personal brand | ✅ | `/dr-kulmaganbetov`, `/authors/dr-kulmaganbetov`, Threads, 24.kz video |
| Research & education platform | ✅ | `/science` collaboration form, `/academy` |
| Investors / strategic partners | ✅ Δ | `/partnerships`. The figures block now uses verified numbers only |

### 6.2 / §3 Architecture
| Item | Status | Evidence |
|---|---|---|
| Home | ✅ | `/` |
| About the centre | ✅ | `/about` |
| Founder | ✅ | `/dr-kulmaganbetov` |
| Medical services | ✅ | `/services`, 20 `/services/:slug`, 6 department pages |
| Science & innovation | ✅ | `/science` |
| International patients | ✅ | `/international-patients` |
| Academy | ✅ | `/academy` |
| Global expert network | ✅ | `/global-experts` (profiles tagged «Демо-профиль») |
| Knowledge base | ✅ | `/knowledge-base` |
| Media centre | ✅ | `/media-center`, `/news` |
| Partnerships | ✅ | `/partnerships` |
| Contacts | ✅ | `/contacts` |

### 6.3 / §4 Home page
| Item | Status | Evidence / gap |
|---|---|---|
| Hero answers what / why trust / what to do; TZ positioning | ✅ | Eyebrow «Новая эра заботы о зрении — в Казахстане» plus the «Офтальмологическая наука мирового уровня…» lead |
| Hero visual: founder, lab, diagnostics, clinical environment | ⚠️ | The only image is still the night photo of the building (`targeted/vp-home.png`). Needs client photography |
| CTA «Записаться на консультацию» | ✅ | |
| CTA «Международные пациенты» | ✅ | |
| CTA «Получить второе мнение» | ✅ | Wraps to a second row at 1440 (see §3) |
| Why: Global experience | ✅ Δ | «PhD … в Великобритании и совместные публикации с международными исследовательскими группами» plus «Испытания в Гонконге и Канаде». The unsourced "Europe, North America and Asia" claim is gone. The "international research groups" wording is an inference and should be confirmed (§4, F-3) |
| Why: Scientific expertise | ✅ | Scientific Reports / Diagnostics |
| Why: Patient care | ✅ Δ | The unverified "98 %" is removed; the copy is now qualitative |
| Mission «Предотвращение слепоты…» | ✅ | Section 02 |
| Centres of excellence (5 named) | ✅ | Bento with the 5 exact TZ names |
| Global expert network block | ⚠️ Δ | "4 continents / 12+ countries" is removed. Figures are now 3 languages · 3 platforms · 200 patients (HK/Canada, sourced). The block still says «совместные публикации с группами Великобритании, Канады и Гонконга» (`home.ts:161-163`), which §7 does not support (only testing in HK/Canada is sourced). |
| Patient stories | ❌ Δ | 8 invented reviews (`data/reviews.json`) shown as real in the home rail and on `/reviews`, which now claims they were checked against visit records (`platform.ts:573-582`). The centre has not opened. Downgraded from ⚠️ |
| Knowledge-base preview | ✅ | «Здоровье глаз простым языком», 5 articles |

### 6.4 / §5 Founder page
| Item | Status | Evidence / gap |
|---|---|---|
| "Scientist behind the mission" framing | ✅ | h1 as in TZ |
| Scientific path | ✅ | «Один вопрос, семь шагов…» (all steps map to §7 facts) |
| Global experience | ✅ | Cardiff (UK), testing in HK and Canada |
| Research directions | ✅ | AMD quantum-optics device, myopia technology, AI and retinal imaging |
| Vision for Kazakhstan | ✅ | |
| Publications | ✅ | 3 papers + 24.kz, searchable, ScholarlyArticle JSON-LD |
| Awards | ⚠️ | Honest empty state: «Награды, гранты и членства добавляются клиникой после проверки документов». Needs client documents |
| Conferences | ⚠️ | `FOUNDER_CONFERENCES = []` (`people-founder.ts:519`) with an honest «Доклады» empty state |
| Media & appearances | ✅ | 24.kz video (consent-gated) + Threads |
| Founder portrait | ⚠️ | "MK" monogram only. Needs a client photo |
| Publications DB managed via CMS | ⚠️ | Static array `people-founder.ts:449`. There is no publications collection in the admin. This is a code gap |

### 6.5 / §8 International patient portal
| Item | Status | Evidence / gap |
|---|---|---|
| URL `/international-patients` | ✅ | |
| Why Kazakhstan | ✅ | «Близко, понятно и прозрачно» |
| Why our centre | ✅ | «Решение принимается до поездки, а не после» |
| Treatment path (6 TZ steps) | ✅ | «Шесть шагов от заявки до наблюдения» |
| Cost calculation | ✅ | Interactive estimator |
| Visa support | ✅ | |
| Accommodation | ✅ | |
| Transport | ✅ | |
| Translation services | ✅ | |
| International coordinator | ✅ | «Один человек на связи всю поездку» (placeholder phone) |
| Online application form | ⚠️ Δ | Selects are fixed and the copy is honest. Files are still not uploaded (A-2) and the lead is not delivered (A-1 🔑) |
| Languages EN / RU / KK | ✅ | |
| Arabic (next phase) | ⚠️ | «AR — скоро, второй этап». `Language` is still `'ru'|'kk'|'en'` (`i18n/types.ts:3`) and there is no `dir` handling |

### 6.6 / §9 Second opinion
| Item | Status | Evidence / gap |
|---|---|---|
| Process: records → review → conclusion → invitation | ✅ | «Четыре шага к заключению» |
| Medical file upload | ⚠️ Δ | Type, size and count validation. The UI now says a secure link is sent by the coordinator, but the files themselves are not transmitted |
| Secure transfer | ❌ Δ | Nothing is transferred. The false "encrypted" claim is removed, which is honest but not a feature. Needs an upload endpoint (code) plus a storage bucket (🔑) |
| Automatic confirmation | ⚠️ | The reference number is generated client-side. No e-mail or WhatsApp is sent for leads |
| Medical review process | ⚠️ | Described, with a status-tracker mock-up. No backend workflow |
| Doctor response management | ⚠️ | Admin demo (localStorage) only |
| CRM integration | ⚠️ 🔑 | See 6.10 |
| Formats PDF / JPG / PNG | ✅ | `accept` on file inputs |

### 6.7 / §10 Knowledge base
| Item | Status | Evidence / gap |
|---|---|---|
| Children's vision | ✅ | |
| Eye health after 40 | ✅ | |
| Cataract & refractive surgery | ✅ | |
| Retina & macula | ✅ | |
| Glaucoma | ✅ | |
| Disease library | ✅ | A–Z library |
| Research in plain language | ✅ | |
| Prevention | ✅ | |
| Blog system | ⚠️ | 17 static TS articles; the admin editor saves only to localStorage |
| Search | ✅ | query + topic + reset («Материалов: 17») |
| Categories & tags | ✅ | |
| Author pages | ✅ | `/authors/:slug` |
| Related articles | ✅ | |
| FAQ sections | ✅ | FAQPage |

### 6.8 / §16 AI readiness
| Item | Status | Evidence / gap |
|---|---|---|
| Expert authorship / author profiles | ⚠️ Δ | Author pages exist, but most articles are authored by *demo* doctors (labelled on the page, yet emitted as `Person` authors in Article JSON-LD, `Seo.tsx:329-341`). `reviewedBy` is empty on every article (`knowledge-articles-index.ts:10-12`). Downgraded: the site has no real named medical author yet |
| Scientific sources | ✅ | NEI / NHS / AAO / IMI source boxes |
| FAQ architecture | ✅ | FAQPage on service, department, knowledge, international and FAQ routes |
| Structured / semantic medical content | ✅ | MedicalTest / MedicalProcedure / MedicalWebPage, numbered sections |
| Schema markup reachable by crawlers | ⚠️ | Complete, but injected client-side only; the prerender is not wired (A-8) |
| Targets ChatGPT / Gemini / Perplexity / AI Overview | ⚠️ Δ | `llms.txt` is rewritten to §7 facts (good). Non-JS crawlers still see only the shell |

### 6.9 / §12 Online consultations
| Item | Status | Evidence / gap |
|---|---|---|
| Process (5 steps) | ✅ | `/online-consultation` |
| Zoom | ⚠️ 🔑 | Platform choice only. Needs a Zoom S2S OAuth app, and the adapter code is not written yet (`backend/src/modules/booking.ts`) |
| Google Meet | ⚠️ 🔑 | Same (Google Calendar API) |
| Microsoft Teams | ⚠️ 🔑 | Same (MS Graph) |

### 6.10 / §13 CRM
| Item | Status | Evidence / gap |
|---|---|---|
| HubSpot / Zoho / Salesforce Health Cloud | ⚠️ 🔑 | Dropdown in admin settings only (`AdminSettings.tsx:240-242`). The backend payload is Bitrix24-shaped (`backend/src/integrations/crm.ts`). Adapters must be written *and* keys supplied |
| Field: country | ⚠️ | Collected, then flattened into `comment` (`LeadForm.tsx:186-210`). Not a field in `Lead` (`types.ts:326-336`) or in `schema.sql` |
| Field: lead source | ✅ | `source` + UTM attribution |
| Field: diagnosis | ⚠️ | Flattened into `comment` |
| Field: lead stage | ⚠️ | Admin localStorage model only |
| Field: conversion status | ⚠️ | Same |
| E-mail sequences | ❌ | None in code |
| WhatsApp notifications | ⚠️ 🔑 | Appointment templates are simulated without credentials; there are none for leads |
| Appointment reminders | ⚠️ | Templates exist, but there is no scheduler/cron (no `backend/src/jobs`). `site.json:50` still promises reminders 24 h and 2 h before |
| Follow-up scenarios | ❌ | None |
| Site fully integrated with CRM | ❌ | Backend not deployed, and there is no adapter for the recommended CRMs |

### 6.11 Digital team · 6.12 KPI · 6.13 Main idea
| Item | Status | Evidence / gap |
|---|---|---|
| Digital team roles | N/A | Process deliverable |
| KPI traffic 500k | N/A | Needs analytics IDs |
| KPI leads / month | ⚠️ 🔑 | `trackLead` is instrumented; delivery is blocked by A-1. Offline bookings are counted as conversions (A-1 note) |
| KPI 10+ countries | ⚠️ | Country is in analytics events only, not as a CRM field |
| KPI 200+ expert materials | ⚠️ | ≈46 (17 articles + 20 service pages + 6 news + 3 press) |
| KPI SEO top positions | N/A | Partly blocked by A-8 |
| Tone "world-class scientific centre" | ✅ | Calm, evidence-based copy |

### §2 Languages
| Item | Status | Evidence / gap |
|---|---|---|
| Kazakh | ✅ | All 43 crawled routes render in KK (`text/kk/`) |
| Russian | ✅ | |
| English | ✅ | |
| Arabic (phase 2) | ⚠️ | Not started (see 6.5) |
| Full multilingual architecture | ⚠️ Δ | `?lang=` alternates in client hreflang are new. There are still no crawlable per-language documents, and the sitemap alternates all point to one URL |

### §6 Medical service pages (20 slugs; verified on `/services/oct` in 3 languages)
| Item | Status | Evidence |
|---|---|---|
| Overview | ✅ | |
| Indications | ✅ | |
| Diagnostics | ✅ | |
| Treatment options | ✅ | |
| FAQ | ✅ | + FAQPage |
| Related articles | ✅ | |
| Consultation booking form | ✅ | `LeadForm source="service-consultation"` (subject to A-1/A-2) |

### §7 Science & innovation
| Item | Status | Evidence / gap |
|---|---|---|
| Scientific projects | ✅ | |
| Publications | ✅ | |
| Clinical research | ✅ | Programmes with honest statuses (planned / awaiting ethics) |
| Innovation programmes | ✅ | |
| Collaboration | ✅ | Form |
| Scientific reports | ⚠️ | «Открытая отчётность» is an announcement only; there is no report yet (client content) |

### §11 Media centre
| Item | Status | Evidence / gap |
|---|---|---|
| News | ✅ Δ | 6 items. Invented facts were rewritten via `newsCorrections` (`media.ts:274+`), each item is labelled «ДЕМО», and demo items are kept out of indexing and NewsArticle schema |
| Press releases | ✅ | |
| Interviews | ⚠️ | Q&A cards that link to articles; not interviews |
| Video | ⚠️ | One real 24.kz video, plus «скоро» |
| Podcasts | ⚠️ | Episodes «В работе», no audio |
| Events | ✅ | Academy calendar |

### §14 Admin panel
| Item | Status | Evidence / gap |
|---|---|---|
| Create pages | ⚠️ | localStorage-first; mirrors to the API when present (`admin/store.ts:14-19`). The public site reads static TS/JSON |
| Edit content | ⚠️ | Same |
| Publish articles | ⚠️ | Same |
| Manage forms | ⚠️ | Flags apply only in the admin's browser |
| Manage leads | ⚠️ | Demo leads |
| View analytics | ⚠️ 🔑 | Demo charts. Real data needs GA4 IDs and an API |
| No programmer needed | ❌ | Every public content change is still a code edit and redeploy |

### §15 SEO
| Item | Status | Evidence / gap |
|---|---|---|
| Schema markup | ✅ | JSON-LD on every route (`crawl-*.json → ld`) |
| Medical schema | ✅ | MedicalClinic, MedicalTest, MedicalProcedure, MedicalWebPage. Physician is suppressed for demo doctors |
| FAQ schema | ✅ | |
| Article schema | ✅ Δ | Knowledge articles now emit `Article` + `MedicalWebPage` with an author (`Seo.tsx:329-341`). The author-quality caveat is in 6.8 |
| Breadcrumb schema | ✅ | BreadcrumbList on every inner route except `/account` and `/admin` (acceptable) |
| Mobile first | ✅ | `overflowX = 0` on all routes; no page-level horizontal scroll on mobile |
| Core Web Vitals optimisation | ⚠️ Δ | CLS fixed (0–0.025). LCP is 4.4–5.7 s desktop and 4.7–7.0 s mobile, driven by the preloader (`perf.json`) |

### §17 Security
| Item | Status | Evidence / gap |
|---|---|---|
| SSL | ✅ | Vercel TLS + HSTS |
| Daily backups | ⚠️ 🔑 Δ | Pure infrastructure: a DB host with a snapshot policy. Nothing is in code or docs yet (was ❌; reclassified per audit rules) |
| Firewall | ⚠️ 🔑 | CSP/XFO/COOP headers are present. A WAF or edge rate limit needs Vercel Firewall or Cloudflare |
| GDPR | ✅ | Consent gate, "only necessary" option, privacy policy |
| Data encryption | ⚠️ | In transit only. No at-rest encryption for clinical data (needs code + a KMS key 🔑) |
| RBAC | ⚠️ | UI roles in localStorage; the backend has only `patient|admin` (`backend/src/lib/auth.ts:15`); credentials are guessable (A-3) |
| Spam protection | ⚠️ | Client honeypot + minimum fill time. No server validation, rate limit or captcha |

### §18 Analytics
| Item | Status | Evidence / gap |
|---|---|---|
| GA4 | ⚠️ 🔑 | Loader ready (`services/analytics.ts:35-45`); `VITE_GA4_ID` empty |
| Search Console | ⚠️ 🔑 | Meta verification ready. `VITE_GSC_VERIFICATION` is empty and missing from `.env.example` |
| GTM | ⚠️ 🔑 | `VITE_GTM_ID` empty |
| Clarity | ⚠️ 🔑 | `VITE_CLARITY_ID` empty and missing from `.env.example` |
| Tracked: traffic, leads, conversion, country, appointments | ✅ | `trackLead`, booking funnel, country from timezone. Note the offline-booking conversion bug (A-1) |

### §19 Performance
| Item | Status | Evidence / gap |
|---|---|---|
| Desktop 90+ | ⚠️ | No Lighthouse. CLS 0 is good, but LCP 4.4–5.7 s would cap the score well below 90 |
| Mobile 85+ | ⚠️ | Slow 4G: FCP 2.6–5.1 s, LCP 4.7–7.0 s |
| Load under 3 s | ❌ | The preloader holds content until 2.3–4.1 s and LCP is over 4 s everywhere. Improved from 4.4–6.9 s, but still over 3 s |
| Responsive 100 % | ✅ | No overflow on any route (1440 and 412) |

### §20 Deliverables
| Item | Status | Evidence |
|---|---|---|
| UX research | N/A | Process |
| Information architecture | ✅ | `app/navigation.ts`, `docs/ARCHITECTURE.md` |
| Wireframes | N/A | Figma (external) |
| UI design | ✅ | Figma + `DESIGN.md` + tokens |
| Responsive design | ✅ | |
| Front-end development | ✅ | `frontend/` |
| Back-end development | ⚠️ 🔑 | `backend/` exists but is not deployed (needs hosting + DB) |
| CRM integration | ⚠️ 🔑 | See 6.10 |
| SEO setup | ⚠️ | sitemap / robots / llms.txt / JSON-LD done; no prerender and no language URLs (code) |
| Analytics setup | ⚠️ 🔑 | Code ready, no IDs |
| Testing | ✅ Δ | 11 Playwright specs, about 92 tests (598 desktop+mobile cases) plus axe. The last full run: 447 passed, 85 failed, 16 real defects (`audit/e2e-report.md`) |
| Deployment | ⚠️ 🔑 | Frontend only |
| Documentation | ✅ | `docs/*`, `DESIGN.md`. Gap: no backup or admin runbook |
| Staff training | N/A | Process (no admin manual yet) |

**Totals (174 rows): ✅ 101 · ⚠️ 60 · ❌ 7 · N/A 6**. Of the 60 ⚠️, **19 are 🔑** (ready or blocked only by client keys or infrastructure).
Changes since the previous report:
- Up: 6.3 global experience ⚠️→✅; 6.3 patient care ⚠️→✅; §15 Article ⚠️→✅; §20 testing ⚠️→✅; §17 backups ❌→⚠️🔑 (reclassified).
- Down: 6.3 patient stories ⚠️→❌; 6.8 expert authorship ✅→⚠️.
- Improved but still ⚠️: A-1, A-2, A-3, A-7, the international form, the multilingual hreflang, CWV/CLS.

---

## 2. Client-dependent items (🔑): exactly what the client must provide

| Area | TZ rows | Client must provide | Code status |
|---|---|---|---|
| Backend hosting + DB | 6.1 acquisition, 6.5 form, 6.12 leads, §20 back-end, deployment | A host for the Express API (Vercel Functions, Render or Fly) plus a persistent DB (managed Postgres, or a SQLite volume); production `ADMIN_PASSWORD`, `TOKEN_SECRET` and `CORS` origin; the final domain (the repo mixes `ophtra2.vercel.app` and `ophtra.kz`) | Backend code exists (`backend/`, `openapi.yaml`); `vercel.json` needs an `/api` route |
| CRM | 6.6 CRM, 6.10 CRM choice / integrated, §20 CRM | The chosen CRM, with: HubSpot private-app token + pipeline and stage IDs, **or** a Zoho CRM OAuth client (client id/secret/refresh token, data centre), **or** a Salesforce Health Cloud connected app (consumer key/secret, instance URL). Also the field mapping for country / diagnosis / stage / conversion status | Only a Bitrix-shaped payload today. **The adapter and the structured fields are code work** (see §5) |
| WhatsApp | 6.10 WhatsApp | Meta WhatsApp Cloud API: permanent token, phone-number ID, business account ID, approved templates (lead confirmation, reminder 24 h/2 h) | Templates are simulated (`integrations/whatsapp.ts`) |
| E-mail | (6.10 sequences, 6.6 confirmation) | An ESP key (Postmark/SendGrid/SES), a sender domain with SPF/DKIM/DMARC, and approved sequence texts | No sequence engine yet (code) |
| Video platforms | 6.9 Zoom / Meet / Teams | Zoom Server-to-Server OAuth (account id, client id/secret); Google Workspace service account with Calendar API + delegated user; Microsoft 365 Entra app registration (tenant, client id/secret, `OnlineMeetings.ReadWrite.All`) | Adapters not written (code) |
| Analytics | §18 GA4 / GSC / GTM / Clarity, §14 analytics, §20 analytics | GA4 measurement ID `G-…`, GTM container `GTM-…`, Clarity project ID, a Search Console HTML-tag token. Set as `VITE_GA4_ID`, `VITE_GTM_ID`, `VITE_CLARITY_ID`, `VITE_GSC_VERIFICATION` in Vercel | Loaders ready and consent-gated |
| Backups | §17 backups | A DB provider with daily snapshots and 30-day retention (or a cron plus an object-storage bucket), and a restore-test owner | Nothing in code or docs |
| Firewall | §17 firewall | Vercel Firewall / Cloudflare WAF rules + edge rate limit for `/api/crm/*` | Headers only |
| File storage | 6.6 secure transfer (with code) | An S3/R2 bucket (private, SSE-KMS), access keys, retention policy | Upload endpoint not written (code) |
| Content and real data (not keys, but only the client can supply them) | 6.3 visuals, 6.4 portrait / awards / conferences, §7 reports, §11 media, placeholders | Real phone, WhatsApp, BIN, licence №, address and hours (`data/site.json:8-14`, `data/clinics.json`); real social handles (Instagram/Facebook/Telegram in `site.json:327-347` are unverified; only Threads is verified); founder, team, lab and diagnostics photos; real doctor profiles; genuine reviews with consent; awards, conference and annual-report documents; the founder's sign-off on texts attributed to him; Arabic translations | — |

---

## 3. Figma check (1440 px, RU) of the 10 frames plus header, footer and home

Evidence: `e2e/results/final/targeted/vp-*.png`, `sheets/*.jpg`, `shots/ru/*.png`.

### Header and mega-menu
- ✅ One global header on all 43 routes (`/admin` is standalone). No second variant, no stray «ЦЕНТР И ЗНАНИЯ» row, and the skip link is not visible.
- ✅ Δ The account icon is now a 22 px glyph in a 44 px circle (`targeted/header-1440.png`). It was about 6 px before.
- **Mega-menu** (`targeted.json → mega`; rAF sampler, 178 frames during a slow sweep across all 4 groups, then down into the sheet, across, and back up to another group):
  - ✅ **One persistent sheet.** The DOM node was never replaced (`nodeReplaced:false`).
  - ✅ **No closing while moving between groups.** 0 frames closed and 0 frames with the sheet hidden or below full opacity. It closes on pointer-leave after 180 ms (`closesOnLeave:true`).
  - ✅ **Identical height.** 448 px for «О центре», «Услуги», «Пациентам» and «Наука и медиа», with a single height value across the whole sweep.
  - ⚠️ Minor: the *content* inside the sheet re-mounts per group (`key={shownGroup.id}`) and fades from opacity 0 over 220 ms (`shell.css:2128-2135`). During a fast sweep the text blinks empty for a few frames even though the sheet stays put. A cross-fade that starts from about 0.4, or keeping both contents mounted, would remove the last trace of flicker.
- ⚠️ The header shows the placeholder phone `+7 717 000 00 00` (client data).

### Footer
- ✅ Δ One footer on all routes. The «Наша миссия» duplicate and the «Панель администратора» link are removed.
- ⚠️ It shows the placeholder licence № 00-0000000 and the phone, plus Instagram, Facebook and Telegram handles that are not in the verified facts.

### Home `/`
- ✅ Hero composition: sans «Зрение, которому» + italic green serif «доверяют», photo on a forest block, chips «Диагностика 60 минут» and «Микрохирургия», the 3 CTAs.
- ⚠️ The third CTA «Получить второе мнение» still wraps to a second row at 1440 (`homeCtas`: y 612 vs 678). In Figma all three sit on one row.
- ✅ Δ Dark metric band now 6 · 200 · 3 · 1 (founder years · trial patients · 2026 papers · patent), all §7-verified; equipment marquee.
- ⚠️ The founder split uses the «MK» monogram card instead of the Figma portrait (client photo needed).
- ⚠️ The pinned «Почему» scene still leaves a long near-empty scroll run (sheet `home__0.jpg`, column 1).
- ❌ «Истории пациентов» rail = invented reviews (A-4).

### 02 О центре → `/about`
- ✅ Hero «О клинике», «Все врачи →» / muted «Руководство», building photo.
- ✅ Δ The 4 metric cards now show verified numbers (200 · 2 countries · 3 papers · 6 years) with a source note. This is a deliberate deviation from Figma's 17+/9400+/28+/98 %, which DESIGN.md §7 forbids.
- ✅ Δ The 2009–2026 history timeline is replaced by «От исследования — к центру в Астане» (Наука → Разработка → Испытания → Центр), all §7. «Две клиники» is gone and a single «Центр в Астане» card is shown.
- ⚠️ The Figma frame's dark mission block, doctor split and «Наука и открытый обмен» live on `/`, not `/about`. This is correct per fix #7.

### 03 Врачи → `/doctors`
- ✅ Hero, search, two chip rows. The department chips now **wrap** (scrollWidth = clientWidth, `flex-wrap: wrap`) Δ.
- ✅ Δ **Fix #4 applied**: monogram portrait tiles (no photos, no initials over clinic photos), a real gutter, a «ДЕМО-ПРОФИЛЬ» tag on every card and a footnote.
- ⚠️ With a single clinic, the "clinic" chip row has only «Все / Центр в Астане». The hero still says «поиск по отделению и клинике».

### 04 Профиль врача → `/doctors/aigul-akhmetova`
- ✅ Hero with name, role eyebrow, «ДЕМО-ПРОФИЛЬ» tag, «Записаться на приём», portrait card (monogram, «СТАЖ 22 ГОДА»), info cards, service cards with «от … ₸».

### 05 Услуги → `/services`
- ✅ «Направления помощи» (title unbroken), balanced bento, full catalogue.

### 06 Страница услуги — ОКТ → `/services/oct`
- ✅ Article template, sticky TOC, ring bullets, «Продолжить знакомство», sources box.
- ⚠️ Hero price card not in Figma; it duplicates «от 14 000 ₸ · 25 мин» shown under the lead. «Врачей в команде: 3» counts demo doctors.
- ⚠️ The «Кто проводит» strip uses `DoctorCard` without the «Демо-профиль» tag (`cards.tsx:36-42`).
- ⚠️ The TZ §6 section set is used instead of Figma's four sections (intentional).

### 07 База знаний → `/knowledge-base`
- ✅ Hero, search + «Тема» select (chevron fixed Δ) + «Сбросить», «Материалов: 17», article bento.
- ⚠️ Order still differs from Figma: a statement and a «С чего начать» grid come before the search.

### 08 Статья → `/knowledge-base/eye-check-after-40`
- ✅ Same template as 06, author card, related materials, sources.

### 09 Международным пациентам → `/international-patients`
- ✅ Hero with clinic photo and the 4 Figma sections. Page height dropped from 19 400 to 13 970 px Δ. The form selects are fixed Δ.

### 10 Онлайн-запись → `/appointment`
- ✅ Δ The stepper and copy are consistent: 6 steps (Тип записи → Отделение → Услуга → Врач → Дата и время → Подтверждение), «Шаг 1 из 6», and the title no longer says «Шесть шагов». The Figma «Клиника» step is dropped because only one centre exists (§7), which is acceptable.
- ⚠️ The hero lead still says «Выберите клинику, услугу…» although there is no clinic step.
- ✅ «Далее» is forest (fix #8); the 3 tiles are present.

### 11 Контакты → `/contacts`
- ✅ Hero with phone + WhatsApp actions and a feedback form. There is one «Центр в Астане» card instead of Figma's two, which is correct per §7.
- ⚠️ All contact values are placeholders.

### Surviving DESIGN.md §2 Figma errors
| # | Error | Status |
|---|---|---|
| 1 | Titles broken mid-word / clipped | ✅ none seen in 43 routes × 3 languages |
| 2 | Missing spaces | ✅ none found |
| 3 | Bento holes | ✅ |
| 4 | Doctor cards touching / initials over clinic photos | ✅ **fixed** Δ |
| 5 | Cookie banner / floating buttons over content | ⚠️ **fixed on desktop, not on small mobile** Δ. At 1440×900 and 1280×720 the card sits bottom-right clear of the CTAs, and the floating buttons do not overlap. On first visit on **Pixel 7** the consent sheet covers the bottom edge of «Получить второе мнение» and the «Помощник» launcher sits on top of «Международные пациенты» and «Получить второе мнение» (`targeted/first-ru-mobile-first.png`). On **iPhone SE** (RU and EN) the sheet covers the first two CTAs, and even after accepting, the launcher overlaps them (`first-ru-iphone-se-*.png`, `floats.json`) |
| 6 | Inconsistent headers/footers | ✅ |
| 7 | Empty «Наука» headings / home pasted into О центре | ✅ |
| 8 | Disabled-looking primary buttons | ✅ |

---

## 4. Fact check against DESIGN.md §7

Method:
1. Grep `frontend/src`, `data/`, `frontend/public/llms.txt` and `frontend/index.html` for 2009, 9400, 17+, 28, 98 %, Almaty, awards, quotes, "clinical trials", named institutions and partners, and the old invented figures.
2. Scan the **rendered text** of 43 routes in RU/KK/EN (`e2e/results/final/text/`).

**Result: the rendered site contains none of the forbidden numbers** (17+, 9 400, 28, 98 %, 2009, Almaty, 380 / 42 %, "Nineteen", Moorfields, ZEISS, "4 continents", "12+ countries"). The demo doctors' real-institution claims are gone (`data/doctors.json` now says "Medical university…"). News items are rewritten and labelled «ДЕМО». `llms.txt` and the founder JSON-LD match §7. The only mentions of "awards" are the honest empty-state sentence. No quotes are attributed to the founder: the manifesto is labelled «Манифест центра».

Remaining unsupported or at-risk claims:

| # | Claim | Location | Assessment |
|---|---|---|---|
| F-1 | 8 patient reviews (names, dates, ratings, procedures such as "Делала Femto-LASIK…") presented as verified: «мы подтверждаем, что автор был на приёме» | `data/reviews.json` (8 records); `frontend/src/content/pages/platform.ts:573-582`; rendered on `/` and `/reviews` | **Invented, and contradicts §7** (the centre is new and not yet open). Highest-priority fact issue |
| F-2 | "Research ties: joint publications with groups in the United Kingdom, Canada and Hong Kong" | `frontend/src/content/pages/home.ts:161-163` | Not in §7. HK/Canada are *testing* sites; there are no sourced co-publications there |
| F-3 | "PhD in the UK and joint publications with international research groups" | `home.ts:46-48` | Mild inference from the 3 co-authored papers. Confirm or soften to "co-authored papers in 2026" |
| F-4 | Home science card: "Publications, **clinical research** and international collaboration"; research-centre card "…clinical research" | `home.ts:145-147, 255-257` | The centre has no clinical research yet (science page statuses: planned / awaiting ethics). Soften to "planned clinical research" |
| F-5 | MedicalClinic JSON-LD states `streetAddress` «пр. Мәңгілік Ел, 72», `openingHours` Mo–Sa 08–20 / Su 09–15 and `telephone` +7 717 000 00 00 as facts, for a centre that is "preparing to open" | `frontend/index.html:133,160,165-166` | Placeholders emitted as machine-readable facts. §7: "do not present invented numbers as facts" |
| F-6 | `llms.txt` "Astana centre: 72 Mangilik El Ave… Mon–Sat 08:00–20:00… Phone +7 717 000 00 00" | `frontend/public/llms.txt:74-75` | Same as F-5, and it goes directly to AI engines. Label as "to be confirmed" or omit until confirmed |
| F-7 | `"founded": 2009` | `data/site.json:10` | Not rendered anywhere (`types.ts:184` only), but it is still in the data file. Remove |
| F-8 | Instagram / Facebook / Telegram handles `drkulmaganbetov` | `data/site.json:327, 342, 347`; footer | Unverified (§7 verifies only Threads) |
| F-9 | "Up to twelve tests in a single visit; the doctor's conclusion the same day"; "Confirmation arrives immediately, reminders 24 h and 2 h before" | `data/site.json:50, 64` | Operational promises for an unopened centre, and the reminders do not exist in code. Soften or mark as planned |
| F-10 | Knowledge articles authored by demo doctors, emitted as `Person` authors in Article JSON-LD | `frontend/src/seo/Seo.tsx:329-341`; `content/pages/knowledge-articles-index.ts` | Demo people reach search engines as real authors. Suppress, as `DoctorDetailPage.tsx:66` already does for Physician |
| F-11 | Dead helper would render the metrics with a "+" and "%" suffix ("1 %" patent) if reused | `frontend/src/components/people.tsx:36-52` (`siteStats`, unused) | Not rendered; its docblock still cites 17+/9400+/28+/98 %. Delete |
| F-12 | Code comments that still quote forbidden figures | `people.tsx:36`, `AboutPage.tsx:26` | Comments only. Harmless, but they will keep resurfacing in greps |

Confirmed clean: `people-founder.ts` (every claim maps to §7: MD, PhD Cardiff, AFHEA, KazNII postgraduate department, AMD device, HK and Canada, 200 patients, patent, myopia animal stage, interest from the USA/Europe/China/Canada/Japan, Astana plan); `media.ts` news corrections; `data/doctors.json`; `science.ts` (programme statuses are honest); `/global-experts` (demo profiles tagged; the countries-in-scope list matches the §7 "interest from…" list).

---

## 5. Still fixable in code (prioritised; separate from the 🔑 list)

**P0 (trust / legal)**
1. Remove the invented reviews (or show them only with a «Демо» label) **and** delete the verification claims. Files: `data/reviews.json`, `content/pages/platform.ts:573-582`, `pages/HomePage.tsx:394-425` (stories rail), `pages/ReviewsPage.tsx`.
2. Stop shipping guessable admin credentials: remove the client-side hash login `AdminPage.tsx:56-57,213`; hide the «0000» demo code on `/account` (`AccountPage.tsx:56,203-206,375-380`); require env secrets in `backend/src/config/env.ts:38-41`.
3. Stop publishing placeholder address, hours and phone as facts: `frontend/index.html:133-166` (drop `openingHours`/`telephone`/`streetAddress` until confirmed); `public/llms.txt:74-75`; `data/site.json:10` (founded 2009), `:327-347` (unverified socials), `:50,64` (promises).
4. Soften the unsupported research claims: `content/pages/home.ts:46-48, 145-147, 161-163, 255-257`.
5. Do not emit demo doctors as Article authors: `seo/Seo.tsx:329-341`. Add the «Демо-профиль» tag to `components/cards.tsx:36-42` (`DoctorCard`, used by `ServiceDetailPage.tsx:364` and `DepartmentPageTemplate.tsx:257`).

**P1 (Figma / UX bugs)**
6. Figma #5 on small mobile: the consent sheet and the «Помощник» launcher overlap the hero CTAs on Pixel 7 and iPhone SE. Hide the launcher while consent is open and on the first viewport, or dock it below the CTA block. Files: `layout/ConsentBanner.tsx`, `styles/shell.css:1926-1950`, `features/assistant/AssistantWidget.tsx:266`, `styles/layout.css:115-118,636-638`.
7. Remove the reload-to-home redirect (`frontend/index.html:7-20`).
8. Don't count offline bookings as conversions (`features/booking/BookingWizard.tsx:416`).
9. Preloader / LCP: skip the reveal on repeat visits and on inner routes, or cap it at about 1 s. Files: `main.tsx:24-25`, `index.html` preloader CSS.
10. Wire `frontend/scripts/prerender.mjs` into the build (per route and per `?lang`, or `/kk/` and `/en/` paths), and emit the language alternates in the sitemap. Files: `frontend/package.json` build script, `vercel.json` buildCommand, `scripts/generate-seo.mjs`.
11. Put the home hero CTAs on one row at 1440 (`styles/pages/home.css`, hero actions).
12. Mega-menu content blink: cross-fade instead of fading from 0 (`styles/shell.css:2128-2135`; `layout/Header.tsx:201` `key`).
13. Copy leftovers: `/appointment` lead «Выберите клинику» (`content/pages/services.ts`), «загрузите их в заявку» (`content/pages/patients-consultation.ts:142`), the `LeadForm.tsx:17-18` docblock, the `/doctors` hero «…и клинике», the dead `siteStats` (`components/people.tsx:36-52`), and the unused `footer.mission*` keys.
14. axe colour contrast: 477 nodes on 34 pages, e.g. `.oph-footer__disclaimer` (tokens / `shell.css`).

**P2 (TZ functional gaps that are code, not keys)**
15. Structured CRM fields (country, diagnosis, stage, conversionStatus) in `LeadForm.tsx`, `types.ts:326-336`, `backend/src/db/schema.sql`; HubSpot / Zoho / Salesforce adapters in `backend/src/integrations/crm.ts`.
16. Automation: lead confirmation (e-mail and WhatsApp), e-mail sequences, a reminder scheduler, follow-ups. New `backend/src/jobs/`, plus `integrations/notifications.ts`.
17. File upload endpoint (signed URL, encrypted at rest) and the second-opinion doctor-response model. `LeadForm.tsx:195-211`, new `backend/src/modules/uploads.ts`.
18. Admin → public content pipeline (pages, articles, **publications collection**), server RBAC (editor / coordinator / doctor), audit log. `pages/admin/*`, `backend/src/modules/admin.ts`, `backend/src/lib/auth.ts`.
19. Server-side validation, rate limit and captcha on `/api/crm/*` (`backend/src/server.ts`).
20. Zoom / Meet / Teams adapters in `backend/src/modules/booking.ts`, to be activated by 🔑 keys.
21. Arabic phase-2 scaffolding: `Language` type, `dir="rtl"`, logical CSS properties (`i18n/types.ts:3`, `i18n/index.tsx`).
22. A backup runbook and an admin/staff manual in `docs/`.
