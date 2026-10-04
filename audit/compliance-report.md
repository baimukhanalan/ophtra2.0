# OPHTRA 2.0: compliance audit (TZ, Figma, fact-check)

Date: 2026-09-25. Build audited: production preview at http://localhost:4173. Backend: not running (see A-1).
Auditor scope: this is a report only, and nothing in `frontend/` was changed.

Evidence and tooling
- Crawl scripts: `e2e/compliance/crawl.mjs` (all 35 static routes in EN, 24 routes in RU at 1440 px), `e2e/compliance/perf.mjs` (web vitals), `e2e/compliance/targeted.mjs` (first-visit cookie banner, header, mobile overflow), `e2e/compliance/tiles.py` (splits the screenshots into tiles).
- Raw data: `e2e/results/compliance/crawl.json` (EN: h1/h2/h3, JSON-LD types, links, inputs per route), `e2e/results/compliance/ru/crawl.json`, `e2e/results/compliance/perf.json`.
- Screenshots (1440 wide, full page): `e2e/results/compliance/shots/*.png` (EN), `e2e/results/compliance/ru/shots/*.png` (RU, used for the Figma comparison). The same screenshots cut into tiles are in `e2e/results/compliance/ru/tiles/<page>__t NN.jpg` and `__sheet N.jpg`. Targeted shots are in `e2e/results/compliance/targeted/`.
- Note: Chrome cannot capture more than about 16 384 px in one full-page screenshot. On `/international-patients` (19 414 px) and `/dr-kulmaganbetov` (16 695 px) the bottom of the PNG repeats the top of the page. That repeat comes from the screenshot tool and is not a bug in the site.
- No Lighthouse is installed and none was downloaded. The performance numbers below come from PerformanceObserver: desktop without throttling, and mobile as Pixel 7 on slow 4G with 4× CPU throttling.
- Not done: logging in to `/admin` and `/account`. Both show demo credentials, but entering credentials is outside what the auditor may do. The admin panel was therefore assessed from the code (`frontend/src/pages/admin/*`).

Legend: ✅ done · ⚠️ partial · ❌ missing · N/A process deliverable (not a website feature).

---

## 0. Critical cross-cutting findings (read first)

| # | Finding | Evidence |
|---|---|---|
| A-1 | **No backend is deployed, so no lead reaches a CRM.** `vercel.json` ships `frontend/dist` only and has no `/api` function. Locally, `/api/*` returns 500 because the proxy target at :4000 is down. Every form falls back to `localStorage` (`ophtra.outbox.leads`), so the enquiry exists only in the visitor's browser. The admin panel is a demo that runs on localStorage. | `vercel.json`; `frontend/src/services/outbox.ts`; `frontend/src/pages/admin/store.ts:14-19`; `curl /api/health` returned 500 |
| A-2 | **Medical files are never uploaded.** `LeadForm` only appends the file *names and sizes* to the `comment` string; the file bytes are never sent. The UI still says "Files are sent over an encrypted connection". | `frontend/src/components/LeadForm.tsx:195-211, 47` |
| A-3 | **Demo admin credentials are shown publicly and hard-coded in the client bundle.** The `/admin` page displays "Демо-доступ: admin / ophtra". `AdminPage.tsx:44-45` accepts them client-side. The backend defaults are the same (`ADMIN_PASSWORD='ophtra'`, `TOKEN_SECRET='ophtra-demo-secret'`). The public footer links to "Панель администратора". `/account` shows "demo code 0000". | `frontend/src/pages/AdminPage.tsx:44-45,134,179`; `backend/src/config/env.ts:38-41`; screenshot `ru/tiles/admin__sheet0.jpg` |
| A-4 | **Fabricated patient reviews are presented as real, and AggregateRating schema is built from them.** This conflicts with Google's review-snippet policy and with DESIGN.md §5 ("never invent…"). | `data/reviews.json` (8 reviews); `frontend/src/seo/Seo.tsx:375-386`; `/reviews` JSON-LD `AggregateRating` |
| A-5 | **Two Figma errors that must be fixed are still present:** #4, initials pasted over clinic photos on every doctor card and profile; and #5, the cookie banner covering the hero CTAs on first visit (desktop and mobile), with floating buttons overlapping the CTAs on mobile. | `ru/tiles/doctors__sheet0.jpg`, `ru/tiles/doctors__aigul-akhmetova__sheet0.jpg`, `targeted/cookie-first-visit-desktop.png`, `targeted/cookie-first-visit-mobile.png` |
| A-6 | **Site-wide bug: every `<select>` renders as a field of tiled chevrons.** In `figma-components.css` the shorthand `background: var(--oph-paper)` on `.oph-input, .oph-select, .oph-textarea` resets `background-repeat`. The later `.oph-select { background-image }` then repeats the icon across the whole field. It affects the forms on international, second opinion, consultation, experts, partnerships and academy. | `frontend/src/styles/figma-components.css:200-216`; `ru/tiles/international-patients__t10.jpg` |
| A-7 | **Content is visible only after 4.4 s (desktop) and 5.6–6.9 s (mobile, slow 4G)**, because of the `#oph-preloader` logo reveal. CLS is 0.22–0.24 on every page. This fails TZ §19 ("under 3 s") and puts Core Web Vitals at risk. | `e2e/results/compliance/perf.json` |
| A-8 | **No prerendering and no per-language URLs.** Every route serves the same `index.html`: the title is generic and there is no h1 and no page JSON-LD until JavaScript runs. AI crawlers that do not execute JS (GPTBot, PerplexityBot, ClaudeBot) see only the shell. All hreflang alternates (ru/kk/en) point to the *same* URL, so kk and en content cannot be indexed separately. | `curl /dr-kulmaganbetov`; `frontend/src/seo/Seo.tsx:96-99`; `frontend/public/sitemap.xml` |

---

## 1. TZ compliance matrix

### 6.1 Goals of the site / §1 project goal
| Item | Status | Evidence / gap |
|---|---|---|
| Patient acquisition platform | ⚠️ | Booking wizard `/appointment` and lead forms on 9 pages exist, but leads are not delivered (A-1) |
| Scientific authority | ✅ | `/science`, `/dr-kulmaganbetov`, 3 real papers with DOI links |
| International patient portal | ✅ | `/international-patients` (16 sections) |
| Medical tourism platform | ✅ | Cost estimator `pages/patients/CostEstimator.tsx`, travel section, coordinator |
| Dr (founder) personal brand | ✅ | `/dr-kulmaganbetov`, author page `/authors/dr-kulmaganbetov`, Threads, 24kz video |
| Research & education / scientific community | ✅ | `/science` (collaboration form), `/academy` |
| Info for investors / strategic partners | ✅ | `/partnerships`, «Инвесторам и стратегическим партнёрам» track + figures block |

### 6.2 / §3 Site architecture
| Item | Status | Evidence |
|---|---|---|
| Home | ✅ | `/` |
| About the centre | ✅ | `/about` |
| Dr (founder) | ✅ | `/dr-kulmaganbetov` (nav «О центре → Dr Kulmaganbetov») |
| Medical services | ✅ | `/services` + 20 `/services/:slug` + 6 department pages |
| Science & innovation | ✅ | `/science` |
| International patients | ✅ | `/international-patients` |
| Academy | ✅ | `/academy` |
| Global expert network | ✅ | `/global-experts` |
| Knowledge base | ✅ | `/knowledge-base` |
| Media centre | ✅ | `/media-center` (+ `/news`) |
| Partnerships | ✅ | `/partnerships` |
| Contacts | ✅ | `/contacts` |

### 6.3 / §4 Home page
| Item | Status | Evidence / gap |
|---|---|---|
| Hero answers "what / why trust / what to do"; positioning «Новая эра…» / «Офтальмологическая наука мирового уровня…» | ✅ | Eyebrow «Новая эра заботы о зрении — в Казахстане» and the lead text (`content/pages/home.ts:12,19`) |
| Hero visual content: Dr, lab work, modern diagnostics, clinical environment | ⚠️ | The only image is a night photo of the building. There is no photo of the doctor, the lab or diagnostics |
| CTA «Записаться на консультацию» | ✅ | hero primary button |
| CTA «Международные пациенты» | ✅ | hero secondary button |
| CTA «Получить второе мнение» | ✅ | hero button (wraps to a 2nd row at 1440) |
| Why Dr: Global experience | ⚠️ | Present, but the copy claims "research with teams in Europe, North America and Asia" with no source (§3 fact-check) |
| Why Dr: Scientific expertise | ✅ | «3 публикации в 2026 году» |
| Why Dr: Patient care | ⚠️ | Present; "98 % of patients recommend us" is an unverified metric |
| Our mission quote «Предотвращение слепоты…» | ✅ | Section 02, dark |
| Centres of excellence: 5 named centres | ✅ | Bento of 5 cards with the exact TZ names |
| Global expert network block | ⚠️ | Present, but "4 continents / 12+ countries / Canada, NZ, HK, UK" are invented figures (the experts page itself says the profiles are demo) |
| Patient stories | ⚠️ | Horizontal carousel of 8 reviews from `data/reviews.json`. These are fabricated reviews presented as real (A-4) |
| Knowledge-base preview | ✅ | «Здоровье глаз простым языком», 5 articles |

### 6.4 / §5 Founder page
| Item | Status | Evidence / gap |
|---|---|---|
| Not a biography: «Учёный, стоящий за миссией…» framing | ✅ | h1 exactly as TZ |
| Scientific path | ✅ | «Шесть глав одного вопроса» (6 chapters) |
| Global experience | ✅ | «Образование в Великобритании, испытания в Азии…» |
| Research directions | ✅ | 4 directions |
| Vision for Kazakhstan | ✅ | vision statement + 3 pillars |
| Publications | ✅ | Searchable, filterable list (3 papers + 24kz) |
| Awards | ⚠️ | Only degrees and AFHEA («Подтверждённые достижения»). There are no awards; the page states that the list is verified-only, which is the honest choice |
| Conferences | ⚠️ | `FOUNDER_CONFERENCES = []`, and the section shows "speaking topics" instead |
| Media & appearances | ✅ | YouTube (consent-gated) + Threads |
| Portrait / face of the founder | ⚠️ | No photo anywhere. The hero shows an "MK" monogram; he appears only in the YouTube poster |
| Publications database managed via CMS | ⚠️ | Static array `content/pages/people.ts:388`. The admin panel has no publications collection |

### 6.5 / §8 International patient portal
| Item | Status | Evidence / gap |
|---|---|---|
| URL `/international-patients` | ✅ | route exists |
| Why Kazakhstan | ✅ | «Близко, понятно и без переплат» |
| Why our centre | ✅ | «Решение принимается до поездки, а не после» |
| Treatment path (online application → review → plan → travel → treatment → follow-up) | ✅ | «Шесть шагов от заявки до наблюдения» (6 steps match TZ) |
| Cost calculation | ✅ | Interactive estimator (`pages/patients/CostEstimator.tsx`), KZT + USD |
| Visa support | ✅ | card «Визовая поддержка» |
| Accommodation | ✅ | card «Проживание» |
| Transport | ✅ | card «Транспорт» |
| Translation services | ✅ | card «Услуги перевода» |
| International coordinator | ✅ | «Один человек на связи всю поездку» (placeholder phone/WhatsApp) |
| Online application form | ⚠️ | The form exists (country, language, service, diagnosis, dates, files). But the selects are broken (A-6), files are not uploaded (A-2) and the lead is not delivered (A-1) |
| Languages EN / RU / KK | ✅ | Switcher, all 3 dictionaries |
| Arabic (next phase) | ⚠️ | Shown as «AR — скоро, второй этап». There is no `ar` locale, no RTL (`dir`) handling and the `Language` type is fixed to `ru|kk|en` (`i18n/types.ts:3`) |

### 6.6 / §9 Second-opinion platform
| Item | Status | Evidence / gap |
|---|---|---|
| Process: send records → review → conclusion → invitation to KZ | ✅ | «Четыре шага к заключению» |
| Medical file upload | ⚠️ | The UI accepts files and validates type, size (10 MB) and count (10). The files themselves are never transmitted (A-2) |
| Secure transfer | ❌ | Nothing is transferred, so there is nothing to secure. The UI claims encryption |
| Automatic confirmation | ⚠️ | A reference number is generated client-side. The text promises a WhatsApp/e-mail confirmation, but `backend/src/modules/crm.ts` sends no notification for leads |
| Medical review process | ⚠️ | Described, plus a status tracker mock-up. There is no backend review workflow |
| Doctor response management | ⚠️ | Only in the admin demo (localStorage). There is no server model for "doctor's answer" |
| CRM integration | ⚠️ | See 6.10 |
| Formats PDF / JPG / PNG | ✅ | `LeadForm.tsx:79, 376` |

### 6.7 / §10 Knowledge base
| Item | Status | Evidence / gap |
|---|---|---|
| Category: children's vision | ✅ | `KnowledgeCategory 'children'` |
| Category: eye health after 40 | ✅ | `'after40'` |
| Category: cataract & refractive surgery | ✅ | `'surgery'` |
| Category: retina & macula | ✅ | `'retina'` |
| Category: glaucoma | ✅ | `'glaucoma'` |
| Category: disease library | ✅ | A–Z library on `/knowledge-base` |
| Category: research in plain language | ✅ | `'research'` (3 founder articles) |
| Category: prevention | ✅ | `'prevention'` |
| Blog system | ⚠️ | 17 articles as static TS. The admin article editor saves to localStorage only and publishing does not change the public site |
| Search | ✅ | query + topic + tag filters, URL state |
| Categories & tags | ✅ | 8 themes + controlled tag vocabulary |
| Author pages | ✅ | `/authors/:slug` (8 authors) |
| Related articles | ✅ | `ArticleDetailPage.tsx:70` |
| FAQ sections | ✅ | per article + hub FAQ, FAQPage schema |

### 6.8 / §16 AI readiness
| Item | Status | Evidence / gap |
|---|---|---|
| Expert authorship / author profiles | ✅ | Author box, `Person`/`Physician` JSON-LD, "reviewed by" date |
| Scientific sources | ✅ | «Источники и дополнительное чтение» with AAO / EyeWiki / WHO links |
| FAQ architecture | ✅ | FAQPage on 13+ routes |
| Structured / semantic medical content | ✅ | MedicalProcedure / MedicalTest / MedicalWebPage, numbered sections |
| Schema markup | ⚠️ | Complete, but injected client-side only (A-8) |
| Targets ChatGPT / Gemini / Perplexity / Google AI Overview | ⚠️ | `robots.txt` allows AI bots and `llms.txt` exists, but the page content is invisible to crawlers that do not run JS (A-8) |

### 6.9 / §12 Online consultations
| Item | Status | Evidence / gap |
|---|---|---|
| Process: request → coordinator → online consult → plan → clinic visit | ✅ | `/online-consultation` «От заявки до визита в клинику» (5 steps) |
| Zoom integration | ⚠️ | Platform choice in the form only. No API or meeting-link generation |
| Google Meet integration | ⚠️ | same |
| Microsoft Teams integration | ⚠️ | same |

### 6.10 / §13 CRM
| Item | Status | Evidence / gap |
|---|---|---|
| HubSpot / Zoho / Salesforce Health Cloud | ⚠️ | Dropdown in the admin settings only (`AdminSettings.tsx:236`). The backend payload is Bitrix24-shaped (`backend/src/integrations/crm.ts:33`) |
| Field: country | ⚠️ | Collected, then flattened into the `comment` text. It is not a CRM field (`LeadForm.tsx:187-211`) |
| Field: lead source | ✅ | `source = form|attribution` + UTM |
| Field: diagnosis | ⚠️ | Flattened into `comment` |
| Field: lead stage | ⚠️ | Exists only in the admin localStorage model (`admin/store.ts` `LeadStage`). There is no DB column (`backend/src/db/schema.sql:120`) |
| Field: conversion status | ⚠️ | same (`ConversionStatus` in the admin store only) |
| Email sequences | ❌ | No e-mail chain or drip logic anywhere |
| WhatsApp notifications | ⚠️ | Templates exist for appointments (`integrations/whatsapp.ts`), and they are simulated without credentials. None exist for leads |
| Appointment reminders | ⚠️ | `appointment_reminder_24h/2h` templates exist, but there is no scheduler or cron to send them |
| Follow-up scenarios | ❌ | none |
| Site "fully integrated with CRM" | ❌ | The backend is not deployed (A-1) |

### 6.11 Digital team · 6.12 KPI · 6.13 Main idea
| Item | Status | Evidence / gap |
|---|---|---|
| Digital team roles | N/A — process deliverable | Not a site feature. The admin roles (admin / editor / coordinator / doctor) can be mapped to them |
| KPI traffic 500k | N/A | Needs analytics IDs (§18) |
| KPI leads / month | ⚠️ | `trackLead` events are instrumented. Delivery is blocked by A-1 |
| KPI applications from 10+ countries | ⚠️ | Country is captured in analytics events but not as a CRM field |
| KPI 200+ expert materials | ⚠️ | 17 articles + 20 service pages + 6 news items + 3 press releases, about 46 in total |
| KPI SEO top positions | N/A | Blocked in part by A-8 |
| Tone: "world-class scientific ophthalmic centre", not "come to our clinic" | ✅ | Calm, evidence-based copy throughout |

### §2 Languages
| Item | Status | Evidence / gap |
|---|---|---|
| Kazakh | ✅ | `dictionary.kk.ts` + `Localized.kk` in all page content |
| Russian | ✅ | default |
| English | ✅ | |
| Arabic (phase 2) | ⚠️ | Not started (see 6.5) |
| Full multilingual architecture | ⚠️ | Language is stored in localStorage (`ophtra.lang`). There are no `/kk/`, `/en/` URLs and hreflang points everywhere to the same URL (A-8) |

### §6 Medical service pages (checked on all 20 slugs, verified on `/services/oct`)
| Item | Status | Evidence |
|---|---|---|
| Overview | ✅ | `ServiceDetailPage.tsx:105` `svc-overview` |
| Indications | ✅ | `svc-indications` |
| Diagnostics | ✅ | `svc-diagnostics` |
| Treatment options | ✅ | `svc-treatment` |
| FAQ | ✅ | `svc-faq` + FAQPage schema |
| Related articles | ✅ | `svc-articles` «Похожие статьи» |
| Consultation booking form | ✅ | `svc-form` `LeadForm source="service-consultation"` (subject to A-1/A-2) |

### §7 Science & innovation
| Item | Status | Evidence / gap |
|---|---|---|
| Scientific projects | ✅ | «Три направления исследований» |
| Publications | ✅ | «Рецензируемые статьи» (3 real) |
| Clinical research | ✅ | «Программы клинических исследований» with honest statuses (protocol prep / planned / awaiting ethics) |
| Innovation programmes | ✅ | «Что мы внедряем в практику» (in the full-page screenshot the first card is cut off by the horizontal-scroll block) |
| Collaboration | ✅ | «Давайте исследовать вместе» + form |
| Scientific reports | ⚠️ | «Открытая отчётность» only announces an annual report. There is no report or download |

### §11 Media centre
| Item | Status | Evidence / gap |
|---|---|---|
| News | ✅ | 6 items, `/news/:slug`. Several contain invented facts (§3) |
| Press releases | ✅ | 3 items |
| Interviews | ⚠️ | "Q&A" cards that link to knowledge-base articles. These are not interviews |
| Video | ⚠️ | One real 24kz video. «Видеоответы врачей — скоро» |
| Podcasts | ⚠️ | 3 episodes marked «В работе» with no audio |
| Events | ✅ | Linked to the Academy calendar (7 events with dates) |

### §14 Admin panel
| Item | Status | Evidence / gap |
|---|---|---|
| Create pages | ⚠️ | `AdminContent.tsx:121` saves to localStorage. It never reaches the public site |
| Edit content | ⚠️ | same |
| Publish articles | ⚠️ | `ArticlesManager` (localStorage). Public articles come from static TS |
| Manage forms | ⚠️ | The enable/disable flags take effect only in the admin's own browser |
| Manage leads | ⚠️ | `AdminLeads.tsx` runs on seeded demo leads (`admin/store.ts:295+`) |
| View analytics | ⚠️ | `AdminAnalytics.tsx` shows demo charts, not GA4 data |
| No programmer needed for daily changes | ❌ | Every real content change is still a code edit and redeploy |

### §15 SEO
| Item | Status | Evidence / gap |
|---|---|---|
| Schema markup | ✅ | JSON-LD on every route (see `crawl.json → ld`) |
| Medical schema | ✅ | MedicalClinic, Physician, MedicalProcedure, MedicalTest, MedicalWebPage |
| FAQ schema | ✅ | FAQPage |
| Article schema | ⚠️ | Knowledge articles emit `MedicalWebPage` + `CreativeWork`, not `Article`/`MedicalScholarlyArticle`. `reviewedBy` is the same person as `author` (`knowledge-schema.ts:55-70`) |
| Breadcrumb schema | ✅ | BreadcrumbList on every inner page |
| Mobile first | ✅ | No horizontal overflow on `/`, `/international-patients`, `/dr-kulmaganbetov`, `/doctors` (Pixel 7) |
| Core Web Vitals optimisation | ⚠️ | CLS 0.22–0.24 on all tested pages. The preloader delays content (A-7). Code splitting and modulepreload are done |

### §17 Security
| Item | Status | Evidence / gap |
|---|---|---|
| SSL certificate | ✅ | Vercel TLS + HSTS preload header (`vercel.json`) |
| Daily backups | ❌ | Not mentioned in code or docs (SQLite file `backend/data/ophtra.db`) |
| Firewall protection | ⚠️ | CSP, XFO, COOP headers. No WAF or rate limiting (the only limit is the Express JSON size) |
| GDPR compliance | ✅ | Consent gate before any analytics tag, GDPR section in `/privacy-policy`, "only necessary" option |
| Data encryption | ⚠️ | In transit only. `docs/DATABASE.md:101` says there is no row-level encryption for clinical records |
| RBAC | ⚠️ | Roles and permissions exist in the admin UI (localStorage). The backend knows only `patient|admin` (`backend/src/lib/auth.ts:15`). Demo credentials are public (A-3) |
| Spam protection | ⚠️ | Client-side honeypot + 2.5 s minimum fill time (`LeadForm.tsx:178`). No server-side validation, captcha or rate limit |

### §18 Analytics
| Item | Status | Evidence / gap |
|---|---|---|
| Google Analytics 4 | ⚠️ | Loader ready (`services/analytics.ts:267`). `VITE_GA4_ID` is empty |
| Google Search Console | ⚠️ | Meta/file verification ready. `VITE_GSC_VERIFICATION` is empty |
| Google Tag Manager | ⚠️ | Ready. `VITE_GTM_ID` is empty |
| Microsoft Clarity | ⚠️ | Ready. `VITE_CLARITY_ID` is empty |
| Tracked: traffic, leads, conversion, country, appointment requests | ✅ | `trackLead({form,country,service,diagnosis})`, booking events and funnels in `analytics.ts` |

### §19 Performance
| Item | Status | Evidence / gap |
|---|---|---|
| Desktop score 90+ | ⚠️ | Not measured with Lighthouse. FCP 40 ms and LCP about 60 ms (the preloader logo), but CLS 0.24 and content hidden for 4.4 s |
| Mobile score 85+ | ⚠️ | On slow 4G: FCP 2.1 s, LCP 5.6–7.2 s on inner pages, CLS 0.22. Likely below 85 |
| Page load under 3 s | ❌ | Content is readable only after the preloader: 4.4 s desktop, 5.6–6.9 s mobile |
| Responsive design 100 % | ✅ | No page-level horizontal scroll at 412 px |

### §20 Deliverables
| Item | Status | Evidence / what the repo offers |
|---|---|---|
| UX research | N/A — process deliverable | Nothing in the repo |
| Information architecture | ✅ | `app/navigation.ts`, `docs/ARCHITECTURE.md` |
| Wireframes | N/A — process deliverable | Figma file (external) |
| UI design | ✅ | Figma + `DESIGN.md` + `styles/tokens.css` |
| Responsive design | ✅ | see §19 |
| Front-end development | ✅ | `frontend/` |
| Back-end development | ⚠️ | `backend/` (Express + SQLite, OpenAPI) exists but is not deployed |
| CRM integration | ⚠️ | see 6.10 |
| SEO setup | ⚠️ | sitemap / robots / llms.txt / JSON-LD done. No SSR and no language URLs |
| Analytics setup | ⚠️ | Code ready, no IDs |
| Testing | ⚠️ | `e2e/tests/smoke.spec.ts` (1 test), `backend/tests/domain.test.ts` |
| Deployment | ⚠️ | Frontend only (`vercel.json`) |
| Documentation | ✅ | `docs/ARCHITECTURE.md`, `DATABASE.md`, `DEPLOYMENT.md`, `INTEGRATIONS.md`, `DESIGN.md` |
| Staff training | N/A — process deliverable | No admin manual. The admin panel has inline hints only |

**Totals (174 TZ matrix rows): ✅ 98 · ⚠️ 63 · ❌ 7 · N/A 6**

---

## 2. Figma matrix (DESIGN.md §2)

Screenshots are RU at 1440 wide: `e2e/results/compliance/ru/shots/<page>.png`, with tiles in `ru/tiles/`.

### Global (header, footer, language)
- ✅ One global header and footer on every page (fix #6 is applied). The skip link is not visible.
- ⚠️ **Header account button**: the `UserRound` icon renders as a roughly 6 px glyph in an empty 40 px square, so it reads as a broken control (`targeted/header-zoom.png`; `layout/Header.tsx:181-188`).
- ⚠️ **Footer "Наша миссия" block** repeats the mission statement on every page, including the home page where it appears twice. It is also not in any Figma frame.
- ⚠️ **Footer bottom row links to «Панель администратора»**. This is not in Figma and is a security smell (A-3).
- ❌ **Fix #5 still visible**: on first visit the cookie banner (420×244 px, bottom-left) covers «Записаться на консультацию» and half of «Международные пациенты» at 1440×900. On mobile it covers «Получить второе мнение», and the floating accessibility and «Помощник» buttons sit on top of the CTA buttons (`targeted/cookie-first-visit-*.png`). Its buttons are no longer grey (fix #8 ✅).
- ⚠️ All placeholder contact data is still shown to visitors: `+7 717 000 00 00`, WhatsApp `+77000000000`, licence `№ 00-0000000`, BIN `000000000000` (`data/site.json`).

### 02 О центре → `/about` (`ru/tiles/about__sheet0.jpg`, `__sheet1.jpg`)
- ✅ Hero «О клинике», actions «Все врачи →» and muted «Руководство», building photo on the right.
- ✅ 4 metric cards (17+ · 9 400+ · 28+ · 98 %), dark mission block, 5-card bento, equipment marquee and cards, dark «Наука и открытый обмен» with 2 filled columns (fix #7 applied: no empty headings and no home page pasted in).
- ⚠️ Split «Доктор Кулмаганбетов»: Figma has a *photo* on the left. The build shows a dark card with an MK monogram.
- ⚠️ Blocks added that are not in Figma: «На чём держится работа центра» (4 stacked cards), history timeline 2009–2026 (unsupported facts, §3), «Две клиники, одни стандарты». They are acceptable in style, but the history facts are invented.
- ⚠️ The home excerpts described in frame 02 (hero, metric band, marquee, mission, doctor split, bento, science) all live on `/` rather than `/about`. This is correct per fix #7.

### Home page `/` (`ru/tiles/home__t00.jpg`, `home__sheet0/1.jpg`, `targeted/home-vp-*.png`)
- ✅ Hero composition matches: sans «Зрение, которому» + italic green serif «доверяют», photo on the right on a forest block, chips «Диагностика 60 минут», «Микрохирургия», CTAs.
- ⚠️ The third CTA «Получить второе мнение» wraps onto its own row at 1440. In Figma all three CTAs sit on one row.
- ✅ Dark metric band + equipment marquee directly under the hero, as in Figma.
- ⚠️ «Доктор Кулмаганбетов» split uses the **building photo** instead of a portrait. The same building photo is reused on about 12 pages (hero, founder split, doctor cards, CTA band, contacts, forms), which dilutes the premium feel.
- ⚠️ Pinned "why" and horizontal "stories" scenes leave about 1 000–1 400 px of near-empty scroll distance. This is intended pinning, but on mobile and in full-page views it reads as empty space.
- ✅ Dark «Проверять факты…» block with 2 columns + latest publications list.

### 03 Врачи → `/doctors` (`ru/tiles/doctors__sheet0.jpg`)
- ✅ Hero «Врачи», search field, two chip rows (departments, clinics), cards with serif name, role, pill «СТАЖ 22 ГОДА», arrow; gutters between cards (half of fix #4).
- ❌ **Fix #4 not applied**: every card shows **initials (АА, ДС, СН…) pasted over green-tinted clinic photos**. This is exactly the Figma error DESIGN.md forbids. `DoctorPortrait` falls back to building photos (the footnote says «Карточки врачей показаны на фотографиях центра, пока клиника готовит портреты»).
- ⚠️ The department chip row overflows and is clipped («Оптический…» is cut at the right edge).
- ⚠️ Demo doctors are not labelled as demo on the cards (only the experts page uses a «Демо-профиль» tag).

### 04 Профиль врача → `/doctors/aigul-akhmetova` (`ru/tiles/doctors__aigul-akhmetova__sheet0.jpg`)
- ✅ Hero with name, role eyebrow, text, «Записаться на приём»; portrait card on the right; 3 info cards (Стаж / Языки / Клиники + department tags); «Все услуги» cards (title, text, «от 12 000 ₸», duration, «Записаться →»).
- ❌ The portrait card is again **initials over a clinic photo** (fix #4).
- ⚠️ Added blocks: reviews, «Врач объясняет», «Другие врачи отделения». They fit the style.

### 05 Услуги → `/services` (`ru/tiles/services__sheet0.jpg`)
- ✅ Hero «Направления помощи» (title not broken, fix #1 ✅), bento of 6 departments with «Открыть материал →», full catalogue of 20, 4-step path.
- ✅ Bento rows are balanced with no grey holes (fix #3 ✅).

### 06 Страница услуги — ОКТ → `/services/oct` (`ru/tiles/services__oct__sheet0.jpg`)
- ✅ Article template: sticky «На этой странице» TOC, numbered sections with ring bullets, «Продолжить знакомство» sand box, «Источники…» dark box.
- ⚠️ The section set is the TZ §6 set (Обзор / Показания / Диагностика / Варианты лечения / Подготовка / Результат / FAQ) instead of Figma's (01 Что показывает ОКТ … 04 Заменяет ли ОКТ консультацию?). This follows the TZ and is acceptable, but it differs from Figma.
- ⚠️ A price card was added to the hero (not in Figma), and so was the «Кто проводит» doctor strip, which carries fix #4 initials.
- ⚠️ «Похожие статьи» for OCT shows glaucoma and dry-eye articles, which are weakly related.

### 07 База знаний → `/knowledge-base` (`ru/tiles/knowledge-base__sheet0.jpg`)
- ✅ Hero, search + «Тема» select + «Сбросить», count «Материалов: 17», bento of articles (gold category, serif title, excerpt, «Открыть материал →»).
- ⚠️ Order differs from Figma: the search is preceded by a scroll-fill statement and a «С чего начать» 8-theme grid. The added disease library A–Z and authors block fit the style.
- ⚠️ The «Тема» select is affected by the tiled-chevron bug (A-6) whenever it is unfocused.

### 08 Статья → `/knowledge-base/eye-check-after-40` (`ru/tiles/knowledge-base__eye-check-after-40__sheet0.jpg`)
- ✅ Same template as 06, with «Проверено врачом …» tags, author card, related materials, sources box.

### 09 Международным пациентам → `/international-patients` (`ru/tiles/international-patients__sheet0/1.jpg`, `__t10.jpg`)
- ✅ Hero with clinic photo; article template with exactly Figma's 4 sections (До покупки билетов · Стоимость и длительность · Поездка: четыре вопроса · После возвращения); «Продолжить знакомство».
- ⚠️ The TZ portal (12 further sections) is appended after the Figma article, which makes the page 19 400 px long. Consider tabs or anchors.
- ❌ Form selects render tiled chevrons (A-6).

### 10 Онлайн-запись → `/appointment` (`ru/tiles/appointment__sheet0.jpg`)
- ✅ Hero with calendar illustration; option cards with icon tiles; «Назад» / «Далее» where «Далее» is forest, not grey (fix #8 ✅); 3 tiles «Автоматические уведомления», «WhatsApp», «Политика конфиденциальности».
- ⚠️ The stepper has **7 steps** (adds «Подтверждение») while the section title still says «Шесть шагов — около минуты» and the counter shows «Шаг 1 из 7». This is internally inconsistent, and Figma has 6.

### 11 Контакты → `/contacts` (`ru/tiles/contacts__sheet0.jpg`)
- ✅ Hero «Контакты» with phone + WhatsApp actions; «Клиники» two cards (address, hours, phone, e-mail, «Как добраться»); «Форма обратной связи» panel.
- ⚠️ Clinic photos are rendered small and inset with large padding inside the cards. The map is a schematic illustration («Схема упрощена»), not a real map.

### New TZ pages: consistency with the Figma language
All of them use `PageHero` (forest, breadcrumbs, gold eyebrow, serif title, text-style actions), gold section indexes, paper cards, `CtaBand` and the global footer. Tokens are respected; no stray colours or fonts were seen.

| Page | Verdict | Notes (screenshot) |
|---|---|---|
| Founder `/dr-kulmaganbetov` | ✅ consistent | Strong editorial page. No portrait (monogram only); a large faded TextFill area in full-page view (`ru/tiles/dr-kulmaganbetov__sheet0/1.jpg`) |
| Experts `/global-experts` | ✅ / ⚠️ | Selects bug (A-6). The 14-country "network" map implies real partners (`ru/tiles/global-experts__sheet0.jpg`) |
| Partnerships `/partnerships` | ✅ / ⚠️ | Selects bug. The investor block reuses unverified metrics (`ru/tiles/partnerships__sheet0.jpg`) |
| Services index | ✅ | see 05 |
| International | ✅ / ❌ | see 09 |
| Second opinion `/second-opinion` | ✅ / ⚠️ | Selects bug. The status tracker is a mock-up (`ru/tiles/second-opinion__sheet0.jpg`) |
| Consultation `/online-consultation` | ✅ / ⚠️ | Selects bug (`ru/tiles/online-consultation__sheet0.jpg`) |
| Science `/science` | ✅ | The first horizontal-scroll innovation card starts off-screen (`ru/tiles/science__sheet0.jpg`) |
| Academy `/academy` | ✅ / ⚠️ | Selects bug (`ru/tiles/academy__sheet0.jpg`) |
| Knowledge base | ✅ | see 07 |
| Media centre `/media-center` | ✅ | «скоро» / «в работе» placeholders are honest (`ru/tiles/media-center__sheet0.jpg`) |
| Admin `/admin` | ⚠️ | Consistent styling, but it displays the demo credentials (`ru/tiles/admin__sheet0.jpg`) |
| Account `/account` | ⚠️ | Consistent styling. It shows «Демо-режим: код 0000» (`ru/tiles/account__sheet0.jpg`) |

Figma-error status: #1 ✅ fixed · #2 ✅ no missing spaces found · #3 ✅ · **#4 ❌ initials over photos persist** · **#5 ❌ cookie banner and floating buttons over the hero CTAs** · #6 ✅ · #7 ✅ · #8 ✅.

---

## 3. Fact-check

The facts allowed by DESIGN.md §5 are: MD in Ophthalmology · PhD in Vision Sciences (Cardiff University) · AFHEA · interests: ophthalmology, AI, quantum physics · Scientific Reports 2026, Diagnostics 2026, Healthcare 2026 · 24kz video · Threads.

### 3a. Founder claims that go beyond §5
| # | Claim | Location | Assessment |
|---|---|---|---|
| F-1 | "Training in the United Kingdom **and research with teams in Europe, North America and Asia**" | `frontend/src/content/pages/home.ts:48` (ru/kk lines 46-47) | Unsupported. Only Cardiff (UK) and the Hong Kong trial are sourced |
| F-2 | "**leads the centre's research policy**" | `frontend/src/content/pages/knowledge.ts:281` | Unsupported role or position |
| F-3 | Hong Kong labelled «**Клинические испытания**» / "Clinical trials" | `frontend/src/content/pages/people.ts:193` | 24kz says «проходит испытания», which does not say *clinical* trials. Soften to "testing / trial" |
| F-4 | "**his development**" for the 24kz device (founder as the developer) | `people.ts:161`, `FOUNDER.path.hk` | §5 lists the video as founder material, but it does not state he is the developer. Needs confirmation from the clinic |
| F-5 | "Co-author" of all three papers, plus DOIs `10.3390/diagnostics16162672`, `10.3390/healthcare14162575` | `people.ts:396,412,427`; `science.ts:51` | Plausible, derived from the URLs, but authorship position and DOIs are not in §5. Verify |
| F-6 | Speaking topics "the topics Dr Kulmaganbetov speaks about to doctors and students" | `people.ts:318, 321-326` | Implies a speaking history that is not sourced |
| F-7 | "The centre was **founded by** Dr Mukhit Kulmaganbetov" | `content/pages/patients.ts:296` | DESIGN calls him "founder / face". The founding date 2009 (F-12) combined with a 2026 PhD makes the timeline doubtful; confirm |
| F-8 | 3 knowledge-base articles **authored by** the founder (AI in retinal imaging; retina as a window to the brain; structured-light entoptic tests), with `reviewedBy` = himself | `knowledge-articles-b.ts:237,439,616`; `knowledge-schema.ts:68-69` | Ghost-written medical content attributed to a real person. Needs his sign-off |
| F-9 | Media "interview" «Заменит ли ИИ офтальмолога?» attributed to him | `content/pages/media.ts:170-180` | It is not a real interview; it links to F-8 content |
| F-10 | Podcast episode "A conversation with Dr Kulmaganbetov…" | `media.ts:230` | Announced as «в работе». Confirm he agreed |
| F-11 | "Research at Dr Kulmaganbetov's centre… neuro-ophthalmology"; clinical programmes such as the "glaucoma patient registry" and "AI assistant research prototype" | `science.ts:18, 281-319` | These are programmes of the *centre*, marked planned or awaiting ethics. Acceptable if the clinic confirms |

Quotes in quotation marks attributed to him: none found beyond the manifesto/vision statements (`people.ts:87-90, 254-257`). Those are unsourced paraphrases presented as his voice and need approval. Awards: none claimed, which is correct. Numbers of operations for the founder: none.

### 3b. Centre-level claims with no source (presented as fact)
| # | Claim | Location |
|---|---|---|
| F-12 | Founded 2009; timeline 2009 → 2013 theatre → 2017 laser → 2021 paediatric → 2026 Astana | `data/site.json:10, 246-310`; `people.ts:906-908`; `/about` |
| F-13 | 17+ years, 9 400+ operations a year, 28+ doctors, **98 % recommend** | `data/site.json` metrics; `home.ts:68`; about, partnerships and international pages |
| F-14 | Expert network: "4 continents", "12+ countries served by second opinion", pins for UK / HK / Canada / New Zealand; the 14 "participating countries" map | `home.ts:163-176`; `people.ts:734-750, 563-569` |
| F-15 | News: "380 children, progression down 42 %, accepted for publication" (international conference) | `data/news.json:126-128` |
| F-16 | News: "Nineteen participants showed above-normal readings" | `data/news.json:76` |
| F-17 | News: femtosecond platform installed; WhatsApp Business connected; Astana main centre opened | `data/news.json` (`new-femtosecond-platform`, `whatsapp-reminders`, `astana-clinic-opening`) |
| F-18 | Equipment specs "resolution to 5 microns", "2.2 mm micro-incision" | `data/site.json:121-149`; `data/departments.json:90` |
| F-19 | 8 patient reviews with names, dates and ratings, plus AggregateRating JSON-LD | `data/reviews.json`; `seo/Seo.tsx:375-386` |
| F-20 | `llms.txt`: "Founded 2009", "written and reviewed by ophthalmologists" (these reach AI engines directly) | `frontend/public/llms.txt:3-5` |

### 3c. Demo doctors attached to real institutions (these read as real people)
| # | Claim | Location |
|---|---|---|
| F-21 | "Over 12 000 cataract operations; fellowships in Germany and South Korea; 18 publications" | `data/doctors.json:31` |
| F-22 | "Asfendiyarov Kazakh National Medical University" (real university) | `data/doctors.json:41` |
| F-23 | "KazNMU, **ZEISS VisuMax certification**" (real manufacturer) | `data/doctors.json:82-84` |
| F-24 | "More than 8 000 refractive procedures" | `data/doctors.json:74` |
| F-25 | "Developed the myopia control program … since 2019" | `data/doctors.json:118` |
| F-26 | "Candidate of Medical Sciences" / "Doctor of Medical Sciences" | `data/doctors.json:161, 335` |
| F-27 | "Takes part in **international neuroprotection research**" | `data/doctors.json:292` |
| F-28 | "KazNMU, **fellowship at Moorfields Eye Hospital**" (real institution) | `data/doctors.json:300-302` |
| F-29 | "Astana Medical University" (real institution) | `data/doctors.json:214` |

These profiles are not tagged «Демо-профиль», unlike `/global-experts`, which does tag its demo profiles (`ExpertsPage.tsx:319`).

Partners, accreditations and trial registrations: no invented partner logos, accreditations (JCI/ISO), NCT numbers or awards were found. External links go to AAO / EyeWiki / WHO / NEI only as reading sources. That is correct.

---

## 4. Prioritised fix list

**P0: blockers (legal, trust, data loss)**
1. Deploy the backend, or a serverless `/api/crm/leads`, and connect a real CRM. Until then, change the success copy so it does not claim delivery. Files: `vercel.json`, `backend/src/server.ts`, `docs/DEPLOYMENT.md`, `frontend/src/components/LeadForm.tsx`.
2. Implement a real file upload (signed URL / multipart, stored encrypted), or remove the upload claim. Files: `LeadForm.tsx:195-211`, new `backend/src/modules/uploads.ts`.
3. Remove the demo credentials from the UI and the bundle, rotate the backend defaults and remove the footer admin link. Files: `pages/AdminPage.tsx:44-45,134,179`, `backend/src/config/env.ts:38-41`, `layout/Footer.tsx`, `pages/AccountPage.tsx` (demo code).
4. Remove fabricated reviews and AggregateRating, or replace them with verified reviews that carry consent. Files: `data/reviews.json`, `seo/Seo.tsx:375-386`, home stories and `/reviews`.
5. Remove or verify the invented facts F-1…F-3, F-12…F-20 and the demo doctors F-21…F-29. Either label every doctor «Демо-профиль» or strip the real institutions and numbers. Files: `content/pages/home.ts:48,68,163-176`, `knowledge.ts:281`, `people.ts:193,906`, `data/site.json`, `data/news.json`, `data/doctors.json`, `public/llms.txt`.
6. Get the founder's sign-off on the articles, manifesto and interview attributed to him (F-8…F-10).

**P1: Figma-mandated fixes and visible bugs**
7. Fix #4: drop the initials-over-building-photo portraits and use a neutral `DoctorPortrait` (monogram tile without a photo, or real portraits). Files: `components/people.tsx` (`DoctorPortrait`), `DoctorsPage.tsx`, `DoctorDetailPage.tsx`, `ServiceDetailPage.tsx` doctor strip.
8. Fix #5: keep the cookie banner off the hero CTAs (compact bar or bottom-right on desktop; push the floating a11y and assistant buttons above it and away from CTAs on mobile). Files: `layout/ConsentBanner.tsx`, `styles/shell.css` (`--oph-consent-offset`), `layout/AccessibilityPanel.tsx`, `features/assistant/AssistantWidget.tsx`.
9. Select chevron bug: add `background-repeat:no-repeat; background-position:right 16px center` to `.oph-select` in `styles/figma-components.css:214`, or remove the `background` shorthand at `:200-205`.
10. Header account icon renders about 6 px. Files: `layout/Header.tsx:181-188` and the `.oph-btn--icon svg` sizing in `styles/shell.css`.
11. Appointment says «Шесть шагов» but has 7 steps. Files: `features/booking/BookingWizard.tsx` and the appointment page copy.

**P2: TZ functional gaps**
12. CRM fields: send `country`, `diagnosis`, `stage`, `conversionStatus` as structured fields and add DB columns. Add HubSpot / Zoho / Salesforce adapters. Files: `backend/src/integrations/crm.ts`, `backend/src/db/schema.sql:120`, `LeadForm.tsx`.
13. Automation: lead confirmation (e-mail/WhatsApp), e-mail sequences, a reminder scheduler (cron for `appointment_reminder_24h/2h`), follow-ups. Files: `backend/src/integrations/notifications.ts`, new `backend/src/jobs/`.
14. Make the admin real: the public site should read pages, articles, publications and forms from the API/CMS; add server RBAC with roles and permissions and an audit trail. Files: `pages/admin/*`, `backend/src/modules/admin.ts`, `backend/src/lib/auth.ts`, content loaders in `src/content/*`.
15. Prerender or SSR every route (e.g. `vite-plugin-ssr`/`vike` or a build-time prerender), and add language-prefixed URLs `/kk/…`, `/en/…` with correct hreflang. Files: `vite.config.ts`, `seo/Seo.tsx:96-99`, `scripts/generate-seo.mjs`, `i18n/index.tsx`.
16. Performance: shorten the preloader or skip it on repeat visits and inner routes; reveal the content (and LCP) before about 1.5 s; find the source of CLS 0.22–0.24 (probably preloader removal or the font swap). Files: `frontend/index.html` (inline preloader), `styles/motion.css`.
17. Video platforms: generate Zoom / Meet / Teams links through their APIs when a slot is confirmed. File: `backend/src/modules/booking.ts`.
18. Knowledge schema: emit `MedicalScholarlyArticle`/`Article` with `author`, and a distinct `reviewedBy`. File: `content/pages/knowledge-schema.ts:55-70`.
19. Security: backups (daily DB snapshot job + doc), rate limiting and captcha on `/api/crm/leads`, at-rest encryption for uploads and clinical data. Files: `backend/src/server.ts`, `docs/DEPLOYMENT.md`.
20. Analytics: set `VITE_GA4_ID`, `VITE_GTM_ID`, `VITE_CLARITY_ID`, `VITE_GSC_VERIFICATION` in Vercel.
21. Arabic phase 2 preparation: extend the `Language` type, add `dir="rtl"` support and logical CSS properties. Files: `i18n/types.ts:3`, `i18n/index.tsx`, `styles/*`.

**P3: content and polish**
22. Replace the placeholder phone, WhatsApp, BIN and licence (`data/site.json`).
23. Add founder and team portraits, plus lab and diagnostics photos for the home hero (TZ 6.3 visual content). Reduce the reuse of the building photo.
24. Founder page: add conferences and awards once they are verified; move publications into the CMS.
25. Media: real interviews, video and podcast audio. Science: publish the first annual report.
26. Grow the knowledge base toward 200+ materials (currently 17 articles).
27. The doctors chip row clips at 1440: wrap it or add scroll affordance (`DoctorsPage.tsx`).
28. Expand e2e coverage beyond the single smoke test: forms, booking, i18n, a11y.
