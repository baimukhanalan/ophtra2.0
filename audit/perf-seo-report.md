# OPHTRA 2.0: performance, SEO, AI-readiness, security and accessibility audit

Date: 2026-09-25 · Build: `frontend/dist` (built 10:10) · Scope: spec §15–19 (docs/TZ.txt) and DESIGN.md
This is a report only. Nothing in `frontend/` or `vercel.json` was changed.

Severity scale: **Critical** means the spec target is missed or search/AI visibility is broken. **High** means a large score or UX impact. **Medium** means a measurable impact. **Low** means polish.

---

## 0. Executive summary

| Spec target (§19 / §15) | Measured now | Status |
|---|---|---|
| Lighthouse desktop 90+ | **86–98** (only home reaches 98 on the `vite preview` run; 86–88 on every inner page) | Fail |
| Lighthouse mobile 85+ | **62–69** | Fail |
| Load < 3 s | Desktop: content revealed at **2.86 s** and the curtain is fully gone at 4.0 s. Mobile Slow-4G: revealed at **4.3–5.5 s** and gone at 5.4–6.7 s | Fails on mobile |
| Core Web Vitals | CLS **0.22–0.26 on every route** (the "poor" threshold is 0.25). Mobile LCP 4.0–7.2 s | Fail |
| TBT / INP proxy | TBT 0–243 ms, longest task 259 ms at 4× CPU | OK |
| SEO schema (Medical, FAQ, Article, Breadcrumb) | Present after JS runs. Article schema is missing on knowledge-base articles. The raw HTML is identical on every route | Partial |
| AI readiness (§16) | Content and FAQ architecture are strong. Crawlers see only the SPA shell, get a fixed language (EN for Googlebot) and a wrong host | Partial |
| Security (§17) | Headers and CSP are good: 0 CSP violations. No secrets in the bundle. Demo admin credentials ship in the public JS. On the static deploy, leads never leave the browser | Partial |
| Accessibility | 2 serious axe rules (colour-contrast on 20/20 scans, aria-prohibited-attr on 8/20). No critical rules | Needs fixes |

**The five issues that decide the scores:**

1. **CLS 0.22–0.26 on every page.** It comes from one shift of `footer.oph-footer`. The lazy route's Suspense fallback is only `70vh` tall, so the footer is painted inside the viewport and then pushed down when the page chunk arrives. This costs about 12–14 Lighthouse points on desktop by itself. The fix is one line (§2.3).
2. **Mobile FCP/LCP is 3–6.7 s.** The 268 kB (34 kB brotli) stylesheet blocks render, including the static preloader, which has its CSS inline. The preloader's own text starts clipped (`translateY(110%)`), so nothing counts as "contentful" for about 1 s after the CSS arrives. The real hero is held at `opacity:0` until the curtain lifts, so the LCP falls on the header logo (hidden under the curtain) or, on mobile, on the **cookie-banner paragraph** at 4.0–4.7 s (§2.2).
3. **The SPA ships no per-route HTML.** Every URL returns the same `index.html`, with the home title, home description and **a canonical pointing to the home page**. Hreflang points ru/kk/en to the same URL. Language is auto-detected from `navigator.language`, so **Googlebot (en-US) indexes the English version and Russian/Kazakh content is effectively unindexable** (§4).
4. **Host mismatch.** `sitemap.xml`, `robots.txt` and `llms.txt` use `https://ophtra.kz`, while every runtime canonical, OG URL and JSON-LD `@id` uses `https://ophtra.vercel.app` (`data/site.json` → `site.organization.url`). The sitemap URLs therefore never match the canonicals (§4.2).
5. **Page weight is driven by fonts, not JS.** Home in Russian downloads 7 font files (**529 kB**) plus a **161 kB favicon.png**, out of a 0.98–1.19 MB total. JS is only 167–271 kB brotli per route (§2.5).

---

## 1. Method and environment

* **Servers.** `vite preview` on :4173 serves files **uncompressed**, which Vercel does not do. For realistic numbers I added `e2e/perf/serve-dist.mjs` (:4174). It serves `frontend/dist` with brotli q11, the SPA rewrite and **every header from `vercel.json`** (CSP, HSTS, cache-control), so CSP violations can be observed. All CDP numbers below come from :4174. Lighthouse was run against both servers.
* **CDP lab measurement:** `e2e/perf/measure.mjs`. Each run uses a fresh Chrome context with cache disabled and `locale ru-RU`. FCP, LCP (+ element), CLS (+ shift sources) and long tasks come from `PerformanceObserver`. Network comes from CDP `Network.*`. Two runs per cell; the table shows the better run.
  * `desktop`: 1440×900, no CPU throttle, 40 ms RTT, 10 Mbps.
  * `mobile-4g`: Pixel 7 emulation, **4× CPU**, 150 ms RTT, 1.6 Mbps (the Lighthouse "Slow 4G" / DevTools "Fast 3G" class).
  * `mobile-fast4g`: Pixel 7, **4× CPU**, 60 ms RTT, 9 Mbps.
* **Lighthouse 12.8.2** (`npx`-installed into the scratchpad, using installed Chrome through `CHROME_PATH`; no browser was downloaded). Default mobile (simulated Slow 4G, 4× CPU) and `--preset=desktop`.
* **Scroll traces:** `e2e/perf/scroll-trace.mjs`, CDP `Tracing` with `devtools.timeline` and stack categories. Wheel scroll at ~1,500 px/s to the bottom, plus an in-page rAF interval probe.
* **SEO crawl:** `e2e/perf/seo-crawl.mjs` covers all 84 sitemap URLs plus 3 extra URLs, as raw HTML and rendered DOM.
* **Accessibility:** `e2e/perf/axe-scan.mjs`, @axe-core/playwright with WCAG 2.0/2.1/2.2 A/AA and best-practice rules. Ten routes × desktop/mobile, with reduced motion emulated so reveals are settled.
* **Bundle attribution:** `e2e/perf/bundle-attribution.mjs`. It uses sourcemaps from a scratch build (`vite build --sourcemap --outDir <scratchpad>`); `dist` was not modified.

Raw outputs are in `e2e/results/perf/`: `measure.json`, `lh-*.json`, `lighthouse*/` (HTML + JSON reports), `scroll-*.trace.json` (these open in the DevTools Performance panel), `scroll-summary.json`, `seo-crawl.json`, `axe.json` and `bundle-attribution.json`.

Routes measured: `/`, `/services/oct`, `/knowledge-base/glaucoma-early-signs`, `/international-patients` and `/dr-kulmaganbetov`.

---

## 2. Performance

### 2.1 Lighthouse scores

`vite preview` on :4173 is uncompressed. The "Vercel-like" server on :4174 uses brotli and the vercel.json headers.

| Route | Desktop perf (4173 / 4174) | Mobile perf (4173 / 4174) | A11y | BP | SEO* |
|---|---|---|---|---|---|
| `/` | 98 / 87 | 69 / 64 | 92 | 100 | 100 |
| `/services/oct` | 87 / 86 | 63 / 62 | 97 | 100 | 100 |
| `/knowledge-base/glaucoma-early-signs` | 88 / 86 | 62 / 64 | 96 | 100 | 100 |
| `/international-patients` | 86 / 86 | 62 / 66 | 93 | 100 | 100 |
| `/dr-kulmaganbetov` | 86 / 87 | 62 / 66 | 93 | 100 | 100 |

\*The Lighthouse SEO score is measured on the JS-rendered DOM, so the 100 hides the SPA problems in §4.

Lighthouse metrics on the Vercel-like server (:4174):

| Run | FCP | LCP | SI | TBT | CLS | LCP element | LCP phases |
|---|---|---|---|---|---|---|---|
| home-desktop | 0.61 s | 0.81 s | 0.61 s | 0 | **0.246** | header logo `img.oph-logo__lockup` (under the curtain) | render delay 684 ms |
| service-desktop | 0.69 s | 0.96 s | 0.69 s | 0 | **0.247** | header logo | render delay 833 ms |
| kb-desktop | 0.61 s | 1.05 s | 0.61 s | 0 | **0.246** | header logo | render delay 930 ms |
| home-mobile | **3.76 s** | **6.69 s** | 6.10 s | 0 | 0.038 | header logo | **render delay 6,237 ms** |
| service-mobile | 3.39 s | 5.19 s | 3.39 s | 0 | 0.222 | header logo | render delay 4,441 ms |
| intl-mobile | 3.01 s | 4.73 s | 3.01 s | 0 | 0.222 | header logo | render delay 3,654 ms |

Lighthouse flags:
* **Render-blocking** `index-*.css`, estimated savings 900–1,790 ms on mobile.
* **Unused CSS** 18–31 kB of 34 kB (69 % unused on home).
* Header logo PNG could be WebP/AVIF (14 kB).
* Hero JPEG could be AVIF (18 kB).
* DOM size 1,162 elements on home (OK).

### 2.2 CDP lab measurements (Vercel-like server, ru-RU, cold cache)

| Profile | Route | FCP | LCP | LCP element | Curtain lifts (`data-loading` removed) | Overlay removed | CLS | TBT | Longest task | Requests | Transfer |
|---|---|---|---|---|---|---|---|---|---|---|---|
| desktop | `/` | 476 | 480 | header logo | 2,861 | 4,001 | **0.219** | 0 | 0 | 24 | 983 kB |
| desktop | `/services/oct` | 696 | 3,172 | `p.svc-pricecard__value` | 2,862 | 4,001 | **0.219** | 0 | 0 | 34 | 1,001 kB |
| desktop | `/knowledge-base/…` | 520 | 528 | header logo | 2,862 | 4,001 | **0.219** | 0 | 0 | 29 | 870 kB |
| desktop | `/international-patients` | 408 | **4,268** | hero photo `clinic-facade.sm.jpg` | 2,861 | 4,002 | **0.219** | 0 | 0 | 31 | 1,013 kB |
| desktop | `/dr-kulmaganbetov` | 420 | 432 | header logo | 2,861 | 4,002 | **0.219** | 0 | 0 | 28 | 804 kB |
| mobile-4g | `/` | 2,100 | **4,668** | **cookie banner text** `p.oph-consent__text` | **5,197** | 6,335 | 0.041 | 174 | 138 | 24 | 1,064 kB |
| mobile-4g | `/services/oct` | 2,084 | **4,484** | cookie banner text | **5,445** | 6,583 | **0.244** | 67 | 115 | 34 | 1,081 kB |
| mobile-4g | `/knowledge-base/…` | 1,908 | **4,356** | cookie banner text | 4,615 | 5,758 | **0.244** | 6 | 54 | 29 | 950 kB |
| mobile-4g | `/international-patients` | 1,900 | **7,220** | hero photo `clinic-facade.jpg` | **5,522** | 6,663 | **0.264** | 176 | 226 | 31 | 1,188 kB |
| mobile-4g | `/dr-kulmaganbetov` | 1,972 | **4,032** | cookie banner text | 4,274 | 5,414 | **0.264** | 48 | 98 | 28 | 885 kB |
| mobile-fast4g | `/` | 804 | 804 | header logo | 2,861 | 4,001 | **0.263** | 116 | 166 | 24 | 1,064 kB |
| mobile-fast4g | `/services/oct` | 1,004 | 1,004 | header logo | 2,865 | 4,005 | **0.263** | 92 | 142 | 34 | 1,081 kB |
| mobile-fast4g | `/knowledge-base/…` | 628 | 628 | header logo | 2,862 | 4,002 | **0.263** | 4 | 56 | 29 | 950 kB |
| mobile-fast4g | `/international-patients` | 732 | **4,552** | hero photo | 2,864 | 4,005 | **0.263** | 243 | 259 | 31 | 1,188 kB |
| mobile-fast4g | `/dr-kulmaganbetov` | 696 | 696 | header logo | 2,861 | 4,004 | **0.263** | 61 | 111 | 28 | 885 kB |

All times are in ms. "Curtain lifts" is the moment content starts revealing; users cannot see anything but the preloader before it.

**Transfer by type (brotli):**

| Route | Script | Font | Image | CSS | favicon.png | Total |
|---|---|---|---|---|---|---|
| `/` desktop | 167 kB / 11 files | **529 kB / 7 files** | 86 kB | 35 kB | **161 kB** | 983 kB |
| `/services/oct` | 268 kB / 21 | 446 kB / 7 | 86 kB | 35 kB | 161 kB | 1,001 kB |
| `/knowledge-base/…` | 271 kB / 18 | 311 kB / 5 | 86 kB | 35 kB | 161 kB | 870 kB |
| `/international-patients` mobile | 209 kB / 17 | 446 kB / 7 | 332 kB | 35 kB | 161 kB | 1,188 kB |
| `/dr-kulmaganbetov` | 206 kB / 17 | 311 kB / 5 | 86 kB | 35 kB | 161 kB | 804 kB |

**Route-specific JS on top of the shared ~110 kB** (index 49 + react-vendor 52 + router 13 + icons 9 kB, brotli):

| Route | Largest route chunks (brotli) |
|---|---|
| `/` | HomePage 11, articles 9, AssistantWidget 8, editorial 6, faq 5 |
| `/services/oct` | **ServiceDetailPage 70**, services 10, **HomePage 11 (not needed)**, articles 9, AssistantWidget 8 |
| `/knowledge-base/…` | **knowledge-data 80**, knowledge-authors 12, **HomePage 11 (not needed)** |
| `/international-patients` | **PortalParts 25**, HomePage 11 (not needed) |
| `/dr-kulmaganbetov` | **people 25**, HomePage 11 (not needed) |

`HomePage`, `editorial`, `CtaBand` and `articles` are modulepreloaded from `index.html` on **every** route (vite.config.ts `preloadLandingRoute`). The `clinic-night` hero image is also preloaded on every route (54 kB on desktop, 134 kB on mobile), even when the page never shows it.

No CSP violations and no console errors on any route or profile (collected with `securitypolicyviolation` and `page.on('console')`).

### 2.3 Issue P1 (Critical): CLS 0.22–0.26 from the footer

**Evidence:** `measure.json` records one shift of `v=0.214` (desktop) or `v=0.223` (mobile), source `footer.oph-footer`, 0.7–4.4 s after navigation on every route. Lighthouse reports CLS 0.246 on desktop inner pages and 0.222 on mobile.

**Cause:** `frontend/src/app/App.tsx`. `<Footer/>` sits outside `<Suspense>`, and `RouteFallback` is only `minHeight: '70vh'`. With the header, the footer top lands inside the 900 px viewport. When the lazy page resolves, the footer is pushed off-screen. The curtain hides this visually, but Chrome still scores it.

**Fix (pick one; A is the smallest):**

* **A.** In `App.tsx`, change the `RouteFallback` style to `minHeight: '100svh'` (fallback `100vh`). The footer then always starts below the fold.
* **B.** In `App.tsx`, move `<Footer />` inside the `<Suspense>` boundary after `<Pages />`, so it only mounts together with the page.
* **C.** Add `main#main { min-height: 100svh; }` in `frontend/src/styles/shell.css` (integrator file).

**Expected result:** CLS on desktop drops from 0.219 to about 0.004. That is worth roughly +12–14 points on desktop Lighthouse (86 becomes about 98–99) and moves mobile CLS from "poor" to "good".

### 2.4 Issue P2 (High): floating buttons shift when the cookie banner appears

**Evidence:** shifts of 0.004–0.040 from `button.oph-a11y-toggle` and `button.oph-assistant-launcher`.

**Cause:** `frontend/src/styles/layout.css:111, 528, 548` animate `bottom: calc(... + var(--oph-consent-offset))`. `ConsentBanner.tsx:61` publishes the offset after mount. Changing `bottom` is a layout shift.

**Fix:** keep `bottom` static and move the buttons with `transform: translateY(calc(-1 * var(--oph-consent-offset, 0px)))`. Transforms are excluded from CLS and are compositor-only.

### 2.5 Logo-reveal preloader (a client requirement): how to keep it and still score

**What happens today** (`index.html` plus `main.tsx`):

1. `#oph-preloader` is static HTML with inline CSS, but the external `index-*.css` link in `<head>` **blocks the first render of everything**, including the preloader. Lighthouse estimates 0.9–1.8 s of savings on mobile.
2. The preloader wordmark starts at `transform: translateY(110%)` inside `overflow:hidden`, and the blades start at `opacity:0`. Nothing is contentful until about 1.05 s after first render. That is why mobile FCP is 1.9–2.1 s in CDP and 3.0–3.8 s in Lighthouse.
3. The curtain lifts after `max(2600 ms, fonts.ready)`, capped at 4500 ms. **Both timers start when `main.tsx` executes, not at navigation start.** On Slow 4G the module runs at about 0.7–1.0 s, so the "4.5 s cap" actually ends at **5.2–5.5 s** (measured lift 5,197 / 5,445 / 5,522 ms). `document.fonts.ready` waits for every font the page uses, and those weigh 311–529 kB.
4. While `data-loading` is set, every hero `Reveal` and `SplitText` is held at `opacity:0` or translated out of its clip (`motion.css:489–497`). Chrome records an element's LCP size **at its first paint**, so these elements are never LCP candidates. The LCP is instead one of:
   * the header logo, painted under the curtain (Chrome ignores occlusion), which gives a good-looking 0.4–1.0 s that says nothing about real content;
   * the **cookie-banner paragraph** on mobile (25,604 px², painted at 4.0–4.7 s);
   * the hero photo once it fades in after the lift (4.3 s desktop / 7.2 s mobile on `/international-patients`).

**Recommendations. These keep the reveal and choreography and change only when content is painted.**

| # | Change | File | Effect |
|---|---|---|---|
| R1 | Paint the hero LCP element at full opacity **under** the curtain. For the hero image, change `<Reveal variant="scale">` (HomePage.tsx:96) and the PageHero photo to a transform-only entrance: add a `variant="zoom"` in `motion.css` that uses `transform: scale(1.06)` → `1` with **no opacity change**. For the hero `<h1>`, keep `SplitText` for the words but never start them clipped out of view. Use `transform: translateY(0.35em)` without `overflow:hidden` clipping, or keep the h1 static and animate the eyebrow and CTAs. The curtain wiping away is the reveal, so the effect looks the same. | `frontend/src/motion/components.tsx` (Reveal variants), `frontend/src/styles/motion.css:489-497`, `frontend/src/pages/HomePage.tsx:52-105`, `frontend/src/components/PageHero.tsx` | LCP becomes the hero image or heading at about 0.6–1.2 s on desktop and about 2.0–2.5 s on mobile. The cookie text (much smaller) can no longer become LCP. |
| R2 | Anchor the cap to navigation start: `const ceiling = new Promise(r => setTimeout(r, Math.max(0, MAX_REVEAL_MS - performance.now())))`, and do the same for `minimum`, which already subtracts `elapsed` but reads it once at module time. | `frontend/src/main.tsx:41-45` | The cap truly ends at 4.5 s instead of about 5.5 s. |
| R3 | Shorten `MIN_REVEAL_MS` from 2600 to **1800** and `MAX_REVEAL_MS` from 4500 to **3000**. Stop waiting for `document.fonts.ready`: all faces use `font-display: swap`, so wait at most 300 ms past the minimum, e.g. `Promise.race([document.fonts.ready, wait(300)])`. The blade and ring animations already finish by about 2.1 s (0.5 s delay + 1.6 s ring), so the reveal still plays in full. | `frontend/src/main.tsx:24-25,43-45` and the `animation-delay`s in `index.html` (`pl-line--1` 1.05 s → 0.7 s, `pl-line--2` 1.2 s → 0.85 s, `pl-bar` 2.3 s → 1.6 s) | Content is visible at about 1.9–2.1 s, which meets "load < 3 s" on desktop and on mobile Fast-4G. |
| R4 | Play the full reveal only on the first landing of a session: set `sessionStorage['oph.reveal']=1` after the lift. Later visits and deep links opened within a session get a 500 ms version. Adding a class needs a **CSP hash update** for the inline script; `generate-seo.mjs` already warns about this. | `index.html` first inline script (hash), `main.tsx` | Returning visitors see content in under 1 s. |
| R5 | Make the preloader contentful at t=0: start `.pl-line > span` at `translateY(30%)` with `opacity:1` inside the clip, or render the mark at `opacity:1, scale(.85)` and spin it. Keep the rise but don't start fully clipped. | `frontend/index.html` inline `<style>` | FCP about 1 s earlier on mobile, and a better Speed Index. |
| R6 | Stop render-blocking on the main CSS. The curtain covers the page anyway, so let the stylesheet load in parallel: in the `preloadLandingRoute` plugin (vite.config.ts), rewrite `<link rel="stylesheet" href="/assets/index-*.css">` to `<link rel="preload" as="style" href="…">` plus `<link rel="stylesheet" href="…" media="print" data-oph-css>`. First thing in `main.tsx`, switch it on with `document.querySelector('link[data-oph-css]')!.media='all'` and have the lift **also await that link's `load` event**. No inline handler is needed, so the CSP stays hash-only. | `frontend/vite.config.ts` (plugin `generateBundle`), `frontend/src/main.tsx` | Mobile FCP about 0.9–1.6 s earlier (Lighthouse estimate). The preloader paints from HTML plus inline CSS alone. |
| R7 | Preload the fonts the **preloader** actually uses. The wordmark "Dr Kulmaganbetov / Ophthalmic Centre of" is **Latin**, yet `index.html` preloads `ss4-cyrillic` and `manrope-cyrillic`. Preload `ss4-latin` and `manrope-latin` instead; after the subsetting in §2.6 they are small. | `frontend/index.html` `<link rel=preload as=font>` | The curtain text renders in its real face on the first frame. |

With R1–R3 and P1 applied, the expected Lighthouse results are desktop about 97–99 and mobile about 80–88. Adding R6 plus the font and image work in §2.6 should reach the §19 target of mobile 85+.

### 2.6 Fonts and images

| # | Severity | Evidence | Recommendation |
|---|---|---|---|
| F1 | High | Home (ru) loads **7 font files, 529 kB**: ss4-latin 121, ss4-latin-italic 128, ss4-cyrillic 93, ss4-cyrillic-italic 90, manrope-cyrillic 35, manrope-cyrillic-ext 36, manrope-latin 27. The Source Serif 4 faces are **variable 300–600**, but DESIGN.md §1 fixes headings at **weight 400** only. | Instance Source Serif 4 at `wght=400` (fontTools `varLib.instancer`) and re-subset. Extend `frontend/scripts/subset-fonts.py`, which currently handles Manrope only. Expect each ss4 file to drop from 90–130 kB to about 30–45 kB. Then set `font-weight: 400` (not `300 600`) in `frontend/src/styles/fonts.css`. |
| F2 | Medium | Italics are 90–128 kB each and are used only for one accent word per hero (`.oph-italic`, hero accent). | Subset the italic to the glyphs used in the hero accents (all 3 languages), or accept `font-synthesis: style` for the accent word. Expected saving: about 200 kB on home. |
| F3 | Medium | `manrope-latin-ext` and `ss4-latin-ext` (35 and 100 kB) load on `/services/oct` and `/international-patients` because of a few characters such as `₸` or typographic dashes. | Add the characters actually used (₸ U+20B8, № U+2116, en and em dashes, NBSP) to the base subsets and drop the `-ext` files for ru/en. Keep `cyrillic-ext` only for kk (ә ғ қ ң ө ұ ү һ і). |
| I1 | High | `favicon.png` is **161 kB** (512×512) and is fetched on every page view. | Add `favicon.ico` (32×32, about 2 kB) plus `favicon.svg`, and make `apple-touch-icon` a 180×180 PNG (about 8 kB). Keep the 512 only in `manifest.webmanifest`. Edit `frontend/index.html` `<link rel="icon">`. |
| I2 | Medium | `/media/clinic-night*.jpg` is preloaded from `index.html` on **every** route (54 kB desktop / 134 kB mobile) but shown only on `/`. | Remove the static `<link rel=preload as=image>` from `frontend/index.html`, and rely on `fetchpriority="high"` on the home `<Photo eager>`, which already exists. Alternatively, have `preloadLandingRoute` emit it and let `index.html` stay home-only once prerendering exists (§4.4). |
| I3 | Medium | Hero and page photos are JPEG. On Pixel 7 (DPR 2.6) the 1440w `clinic-facade.jpg` (165 kB) and `clinic-night.jpg` (134 kB) are chosen. | Add AVIF/WebP via `<picture>` in `frontend/src/components/Photo.tsx` (`image/avif` then `image/webp` then jpg), with an 1080w middle size. Expect about 60 % fewer bytes. |
| I4 | Low | `logo.png` is 460×80 at 16 kB, rendered at 184×32. `logo-light.png` loads eagerly for the footer. | Use an inline SVG lockup (the mark is already SVG in the preloader), or WebP at 368×64. Add `loading="lazy"` on the footer logo in `frontend/src/layout/Logo.tsx`. |
| I5 | Medium | `vercel.json` sets long cache only for `/assets/(.*)`. `/fonts/*`, `/media/*` and `/brand/*` get Vercel's default `max-age=0, must-revalidate`, so they are revalidated on every visit. | Add header rules: `/fonts/(.*)` → `public, max-age=31536000, immutable` (the names are stable, so rename when fonts change) and `/(media|brand|og)/(.*)` → `public, max-age=604800, stale-while-revalidate=86400`. |

### 2.7 Bundle analysis and code splitting

`frontend/dist/assets`, sizes raw and brotli q11:

| Chunk | Raw | Brotli | Main contents (from sourcemaps) | Loaded on |
|---|---|---|---|---|
| `knowledge-data` | 352 kB | 80 kB | knowledge-articles-b 84k, -core 76k, -a 70k (full bodies of **all 17 articles × 3 languages**) | `/knowledge-base` and **every** article |
| `ServiceDetailPage` | 329 kB | 70 kB | services-surgery 67k, -children-optical 52k, -treatment 47k, -diagnostics 44k (**all 20 services × 3 languages**) plus the page (7k) | every `/services/:slug` |
| `index.css` | 268 kB | 34 kB | tokens, base, shell **plus all 6 page stylesheets** (home, patients, knowledge, people, services, platform ≈ 197 kB source) | every page, render-blocking |
| `react-vendor` | 194 kB | 52 kB | react-dom | all |
| `index` (entry) | 185 kB | 49 kB | **content/pages/platform.ts 33k** (admin, account, leads, security copy), analytics 7k, ru dictionary 12k, routes, header, motion | all |
| `people` | 97 kB | 23 kB | content/pages/people.ts | founder, management, doctors |
| `PortalParts` | 96 kB | 24 kB | content/pages/patients.ts (international, second-opinion and consultation copy together) | each patient page |
| `AdminPage` | 63 kB | 17 kB | admin | `/admin` only (fine) |

**Concrete splits, in order of payoff:**

1. **Service content per slug (or at least per category).** In `frontend/src/content/pages/services-content.ts`, replace the static spread of four maps with lazy loaders:
   ```ts
   const loaders = {
     diagnostics: () => import('./services-diagnostics').then((m) => m.diagnosticsServices),
     treatment:   () => import('./services-treatment').then((m) => m.treatmentServices),
     surgery:     () => import('./services-surgery').then((m) => m.surgeryServices),
     children:    () => import('./services-children-optical').then((m) => m.childrenOpticalServices),
   } as const;
   // slug → group, derived from data/services.json departmentId (small, already in the services chunk)
   export const loadServiceContent = async (slug: string) => (await loaders[groupOf(slug)]())[slug];
   ```
   In `ServiceDetailPage.tsx`, read it with React 19 `use(cachedPromise(slug))` inside the existing Suspense, or with `useEffect` state. The route chunk drops from 70 kB to about 3 kB brotli, plus one 10–15 kB group. **Next step:** one file per service (`content/services/<slug>.ts`) loaded through `import.meta.glob('./services/*.ts')`, about 4 kB brotli per page.
2. **Knowledge base: index vs bodies.** Add `knowledge-index.ts` with only `{id, slug, category, tags, authorId, date, reviewed, readingMinutes, title, excerpt, serviceSlug}`; a build step in `generate-seo.mjs` can emit it. Move each article body into `content/knowledge/<slug>.ts` and load it in `ArticleDetailPage.tsx` with `const bodies = import.meta.glob('./knowledge/*.ts')`. `KnowledgePage` then imports only the index. Listing drops from 80 kB to about 8 kB; an article drops from 80 kB to about 6 kB. `relatedArticles` works on the index.
3. **Entry chunk:** move `consentCopy` and `notFoundCopy` out of `content/pages/platform.ts` into a new `content/pages/consent.ts`, and update the imports in `layout/ConsentBanner.tsx:8` and `pages/NotFoundPage.tsx:8`. Rollup cannot split a module, so today the ~33 kB of admin, account and CRM copy ride in the entry. That saves about 9 kB brotli and about 33 kB of parse on every page.
4. **CSS per route:** remove the six `@import './styles/pages/*.css'` lines from `frontend/src/index.css` and import each file from its page modules (e.g. `import '@/styles/pages/services.css'` in `ServiceDetailPage.tsx`, `ServicesIndexPage.tsx` and the department pages). Vite then emits per-chunk CSS. The render-blocking CSS drops from 34 kB to about 12 kB brotli, and Lighthouse "unused CSS" falls from 69 % to under 25 %.
5. **Patient pages:** split `content/pages/patients.ts` into `patients-international.ts`, `patients-second-opinion.ts` and `patients-consultation.ts`, with `PortalParts.tsx` keeping only the shared components. Split `people.ts` into founder / management / doctors the same way.
6. **Stop preloading HomePage on inner routes:** the `preloadLandingRoute` plugin injects `modulepreload` for HomePage, editorial, CtaBand and articles into the single `index.html` (about 28 kB brotli wasted on deep links). It helps only `/`. Once prerendered per-route HTML exists (§4.4), emit these links only into `dist/index.html` for `/`. Until then this is a trade-off: keep it, since home is the main entry.
7. **Language dictionaries** are already split (`dictionary.en/kk`), which is good. The content modules, however, carry all 3 languages. The long-term option is to key content files per language (`services/<slug>.ru.ts`), which cuts another about 66 %.
8. `AccessibilityPanel` (index) can be lazy-loaded on the first toggle click, like `AssistantWidget`.

---

## 3. Scroll performance (CDP traces)

The traces are `e2e/results/perf/scroll-{home,founder}-{desktop,mobile-4xcpu}.trace.json`.

| Page / profile | Scrolled | rAF frames | Frames > 1.5× budget | Worst frames (ms) | Long tasks | Style recalcs (forced) | Style ms | Layouts (forced) | Script + rAF ms | Paint ms |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` desktop | 15,000 px / 13.7 s | 939 | 6 (0.6 %) | 183, 183, 100, 50 | 0 | 1,883 (**1,762**) | 319 | 292 (220) | 933 | 68 |
| `/` mobile 4× CPU | 18,400 px / 16.4 s | 1,134 | 4 (0.4 %) | 133, 133, 117, 50 | 0 | 2,044 (**1,913**) | **1,104** | 192 (90) | **3,223** | 221 |
| `/dr-kulmaganbetov` desktop | 15,800 px / 14.1 s | 963 | 3 (0.3 %) | 183, 50, 33 | 0 | 1,793 (1,696) | 292 | 148 (145) | 871 | 67 |
| `/dr-kulmaganbetov` mobile 4× CPU | 18,600 px / 16.4 s | 1,127 | 3 (0.3 %) | 100, 33, 33 | 0 | 1,909 (1,797) | 867 | 92 (85) | 2,513 | 249 |

**Verdict:** scrolling is smooth in practice: 99.4 %+ of frames are on budget and there are no long tasks. The single rAF controller does its job. There is still a structural inefficiency: **about 94 % of all style recalcs are forced synchronously by script**, 2 per frame on average. On a 4× slowed phone that is about 1.1 s of style work plus 3.2 s of script over a 16 s scroll, roughly 27 % of the main thread. That is the headroom mid-range Android phones will need. The isolated 100–183 ms frames coincide with lazy sections and images mounting and decoding, not with the scroll handlers.

**Top forced-reflow call sites** (resolved from minified line and column to source):

| Count / cost (mobile) | Site | Source |
|---|---|---|
| 1,020 × / 561 ms | `index-*.js` `useParallax`: `o.getBoundingClientRect()` then `setProperty('--oph-parallax-shift')` | `frontend/src/motion/hooks.ts:22-30` |
| 298 × / 144 ms | `editorial-*.js` `useProgressVars`: `getBoundingClientRect()` then `setProperty('--p'/'--pin'/'--enter')` | `frontend/src/motion/story.tsx:42-53` |
| 61 × / 116 ms | `TextFill`: `getBoundingClientRect()` then `span.dataset.lit=…` on every word (attribute writes invalidate style on N spans) | `frontend/src/motion/story.tsx:110-121` |
| 184 × / 88 ms | scrollController `measure()` reading `documentElement.scrollHeight` each dirty frame | `frontend/src/motion/scrollController.ts:81-87` |
| 286 × / 43 ms | `StackCard`: rect of self **and** `nextElementSibling` | `frontend/src/motion/story.tsx:250-258` |
| 63 × / 53 ms | horizontal-scroll hook: `scrollWidth` read after writes | `frontend/src/motion/hooks.ts:98-111` |

**Root cause:** subscribers run in sequence and each does *read (getBoundingClientRect) → write (style.setProperty)*. The next subscriber's read therefore forces the style and layout invalidated by the previous write. The controller comment ("single layout read per frame") does not hold, because reads happen inside subscribers.

**Fixes:**
* **S1 (Medium). Split read and write phases in `scrollController.ts`.** Change the API to `onScroll({ read(state), write(state, measured) })`. In `tick`, first call every `read` (all `getBoundingClientRect` calls batched, one style/layout flush), then every `write`. Migrate `useParallax`, `useProgressVars`, `TextFill`, `StackCard`, the horizontal scroll and autorail.
* **S2 (Medium). Stop measuring per frame.** Cache each element's document offset (`top = rect.top + scrollY`, `height`) on mount, on `resize` and through a shared `ResizeObserver`. Per frame, compute `top = cachedTop - state.y`, which needs no DOM read at all. That removes almost all 1,700–1,900 forced recalcs.
* **S3 (Low). Cache `documentHeight`** in `measure()` and refresh it from a `ResizeObserver` on `document.body` instead of reading `scrollHeight` on every dirty frame.
* **S4 (Low). Scope custom-property writes.** `--p`, `--pin` and `--enter` are set on section roots and inherit into every descendant (the maximum style-recalc scope observed was 1,507 elements). Where possible, write them on the one element that consumes them, or register them with `@property { inherits: false }` in `motion.css` so the recalc does not cascade.
* **S5 (Low).** In `TextFill`, toggle one CSS variable (`--lit: 12`) on the paragraph and use `:nth-child` or a per-span `--i` comparison in CSS instead of writing `data-lit` on every span.

---

## 4. SEO

### 4.1 Crawl results for 84 sitemap URLs plus 3 extras (rendered DOM)

| Check | Result |
|---|---|
| HTTP status | 84/84 return 200. Unknown URLs also return **200** (soft 404, but `noindex, nofollow` is set by NotFoundPage) |
| Exactly one `<h1>` | 84/84 pass |
| Heading order (no skipped levels) | 84/84 pass |
| Title unique | Unique across the sitemap. Duplicates exist only between redirected aliases (`/articles/:slug` → knowledge base, and `/authors/<unknown>` → `/knowledge-base`; the redirect is client-side, so the old URL answers 200 with a duplicate title) |
| Title length ≤ 65 | **49/84 are over 65 characters**, and articles reach 101–117. The suffix " — Ophthalmic Centre of Dr Kulmaganbetov" (40 characters) is appended to every title (`Seo.tsx:78`) |
| Description 70–160 characters | 18 outside the range: `/contacts` 52, `/doctors` 69, `/appointment` 69, 3 news items at 61–68, `/services/glaucoma-treatment` **235**, and 6 more at 164–184 |
| Canonical | Self-referencing on every sitemap URL, but the **host is `ophtra.vercel.app` while the sitemap host is `ophtra.kz`** |
| hreflang | ru-RU, kk-KZ, en-US and x-default are present, but **all point to the same URL** |
| Open Graph | title, description, url, type and locale are present. `og:image` is the same **SVG** everywhere (`/og/ophtra-cover.svg`), and Facebook, LinkedIn, Telegram and WhatsApp do not render SVG previews. There is no `og:image:width/height/alt` |
| Raw HTML (what non-JS crawlers and many AI fetchers see) | Identical for all 84 URLs: home title, home description, `<link rel="canonical" href="https://ophtra.vercel.app/">`, no `<h1>`, **315 characters of body text** (the preloader plus the noscript line) |

### 4.2 Issues

| # | Severity | Issue and evidence | Fix (file and change) |
|---|---|---|---|
| SEO-1 | **Critical** | **Static canonical to the home page on every URL.** `frontend/index.html` has `<link rel="canonical" href="https://ophtra.vercel.app/">` plus `og:url`. Google sees this in the first (HTML) wave before rendering and can fold every page into `/`. | Remove the static `<link rel="canonical">` and `og:url` from `frontend/index.html`; `Seo.tsx` sets them per route. Better still, emit per-route values through prerendering (SEO-5). |
| SEO-2 | **Critical** | **Language negotiated from `navigator.language`** (`frontend/src/i18n/index.tsx:37-46`). Googlebot and headless AI renderers report `en-US`, so they index the **English** version, while `<title>` in the raw HTML is Russian and the primary market is ru/kk. Verified: a context with the default (en-US) locale renders English copy. Hreflang alternates all point to the same URL, so they are useless (`Seo.tsx:92-95`). | (a) Short term: default to `'ru'` when there is no stored preference, and do not auto-switch on `navigator.language` (offer the switch in a non-blocking hint instead). (b) Proper fix: put the language in the URL (`/` = ru, `/kk/...`, `/en/...`). Add an optional `:lang` segment in `routes.tsx`, read it in `detectLanguage`, make the `LanguageSwitcher` navigate to the other prefix, point hreflang in `Seo.tsx` to the three distinct URLs plus x-default=`/`, and emit 3 `<url>` entries per page in `generate-seo.mjs`. |
| SEO-3 | **Critical** | **Host mismatch:** `generate-seo.mjs:32` defaults to `https://ophtra.kz`, while `Seo.tsx:7` falls back to `site.organization.url` = `https://ophtra.vercel.app` (`data/site.json:16`). The static JSON-LD `@id`s in `index.html` also use vercel.app. `AppointmentPage.tsx:40` hard-codes `https://ophtra.kz`. | Pick one production origin and set `VITE_SITE_URL` in the Vercel project env (it feeds both). Update `data/site.json` → `organization.url`, the static JSON-LD in `index.html` and `AppointmentPage.tsx:40`; the last should use `SITE_URL` from Seo instead of a literal. |
| SEO-4 | High | **Sitemap is incomplete:** the 9 author pages (`/authors/dr-kulmaganbetov`, `/authors/amina-baitursyn`, …), which Article JSON-LD links to as `author.url`, are missing. `<lastmod>` is present only for articles and news. The hreflang entries in the sitemap all point to the same URL (see SEO-2). | In `generate-seo.mjs`, add the `authors` paths (founder plus doctors who author articles) and emit `<lastmod>` for every URL (article `reviewed`/`date`, build date for static pages). |
| SEO-5 | High | **SPA rendering limits:** all content, titles, meta and JSON-LD exist only after JS runs. Google renders JS (with a delay). Bing, Yandex (important for KZ), social scrapers, and most AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot fetch the HTML only) see the 315-character shell. | Prerender (§4.4). |
| SEO-6 | High | **Knowledge-base articles have no `Article` schema.** They emit only `MedicalWebPage` (+FAQPage), built in `knowledge-schema.ts`. There is no `image` or `publisher.logo`. Spec §15 requires "Схема статьи". `articleSchema()` in `Seo.tsx` exists but isn't used for knowledge articles. | In `frontend/src/content/pages/knowledge-schema.ts`, emit `"@type": ["MedicalWebPage","Article"]` (as `articleSchema` does) with `headline`, `image` (1200×630 raster), `datePublished`, `dateModified`, `author{@type:Physician,url}`, `reviewedBy`, `lastReviewed` and `publisher{logo}`. |
| SEO-7 | Medium | **NewsArticle has no `image`** (6/6), so it is ineligible for Top Stories and rich results. | Add `image` (a raster per news item or a default OG raster) in `NewsDetailPage.tsx`. |
| SEO-8 | Medium | **Duplicate or conflicting MedicalClinic entities:** the static graph in `index.html` holds a full `MedicalClinic` (`#clinic`), while the home, contacts and reviews pages add another `MedicalClinic` without `@id`, `address` or `telephone`. Google may treat these as separate entities. The Almaty branch is not described. | Give every page-level clinic reference `"@id": "<SITE>/#clinic"` instead of redefining it (Seo.tsx `physicianSchema.memberOf`, `personSchema.worksFor`, `medicalWebPageSchema.publisher`, `reviewSchema`). Add the Almaty branch as a second `MedicalClinic` with `parentOrganization`. |
| SEO-9 | Medium | **Self-serving review markup:** `/reviews` emits `MedicalClinic.aggregateRating` (4.8 / 8 reviews) with review bodies. Google ignores self-serving LocalBusiness/Organization reviews for rich results. If these reviews are demo content, this is fabricated review markup, which is a policy and legal risk for a medical provider. | Remove `reviewSchema` from `ReviewsPage.tsx` until the reviews are real, verifiable and moderated. Even then, don't expect stars. |
| SEO-10 | Medium | **MedicalProcedure typing:** every service that is not a test gets `procedureType: SurgicalProcedure` (`Seo.tsx medicalProcedureSchema`), including consultation, glasses fitting, contact lens fitting, hardware therapy and dry-eye treatment. Legal pages (`/privacy-policy`, `/terms-of-use`) are typed `MedicalWebPage`. | Map `procedureType` per service: `NoninvasiveProcedure`, `PercutaneousProcedure` for injections, `SurgicalProcedure` only for LASIK/SMILE/PRK/phaco/YAG. Use `MedicalBusiness`-offered `Service` for glasses and lens fitting. Legal pages should be plain `WebPage`. |
| SEO-11 | Medium | **Home `<h1>` text has no space between lines:** `Зрение, которомудоверяют`. The two `SplitText` spans in `HomePage.tsx:52-55` are siblings with no whitespace, so crawlers and screen readers get a run-together word (the same class of error DESIGN.md §2 calls out). | Add `{' '}` between the two `<SplitText>` elements in `frontend/src/pages/HomePage.tsx:53-54`, or render the space inside `SplitText`. |
| SEO-12 | Medium | Titles are too long (49/84 over 65 characters), so they get truncated in SERPs and the brand suffix eats the budget. | In `Seo.tsx:78`, use a short brand suffix (e.g. " — Dr Kulmaganbetov", 19 characters) and omit it when `title.length > 45`. Provide a short `seoTitle` for articles and doctors. |
| SEO-13 | Medium | The OG image is SVG. | Generate 1200×630 PNG/JPEG covers (site default plus per section) in `public/og/` and use them in `Seo.tsx` `ogImage`. Add `og:image:width`, `og:image:height` and `og:image:alt`. |
| SEO-14 | Medium | **A reload on any deep link redirects to `/`** (inline script in `index.html`: `if (isReload && location.pathname !== '/') history.replaceState(null,'','/')`). Crawlers are unaffected (their navigation type is `navigate`), but a patient who refreshes `/appointment` or an article loses the page. That hurts engagement signals and UX. | Remove the redirect and keep only `scrollRestoration='manual'` plus `scrollTo(0,0)`. If the client insists, restrict it to replaying the reveal on the same URL. This requires a CSP hash update. |
| SEO-15 | Low | Soft 404: unknown URLs return 200 plus `noindex`. That is acceptable for an SPA, but prerendering allows a real 404. | With prerendering, write `dist/404.html`; Vercel serves it with status 404 for unmatched paths once the catch-all rewrite is narrowed to known routes. |
| SEO-16 | Low | `robots.txt` is fine: AI bots are explicitly allowed; `/account`, `/admin` and `/api/` are disallowed; the `Sitemap:` line is present (but on ophtra.kz, see SEO-3). `Bingbot` sits in the "AI bots" group, which is fine. | Only fix the host. |

### 4.3 llms.txt

The strengths: it follows llmstxt.org structure (H1, blockquote summary, sections), and it has a clear founder bio with DOIs, all 20 services with prices and durations, clinics with hours, and the disclaimer.

The gaps:
* **11 of 17 knowledge-base articles appear as bare URLs** with no title or summary. These are exactly the newest, best-structured articles (presbyopia, AMD, diabetic retinopathy, retinal detachment, amblyopia, keratoconus, and the three founder articles). In `generate-seo.mjs`, read titles and excerpts from `src/content/pages/knowledge-articles-*.ts` or from the generated knowledge index (§2.7 item 2), not only from `data/articles.json`.
* There are no author lines ("written by / reviewed by, date") per article and no doctor list with specialisations. AI answer engines use these for attribution.
* There is no `llms-full.txt` (full plain-text article and service bodies), which Perplexity and ChatGPT browsing use when HTML is JS-only. It could be generated from the same content modules and is the cheapest AI-readiness win until prerendering lands.
* It is English only. Add a short Russian section or `llms-ru.txt`, since most queries in the market are Russian.
* The phone and WhatsApp numbers are placeholders (`+7 717 000 00 00`, `wa.me/77000000000`). They must be real before launch, because AI engines will quote them.

### 4.4 Prerendering / SSG on Vercel with Vite (recommendation)

| Option | How | On Vercel | Verdict |
|---|---|---|---|
| **A. Custom SSG script (recommended)** | Add `src/entry-server.tsx` that renders `<StaticRouter location>` with the same providers through `react-dom/server` `prerenderToNodeStream`/`renderToString`. Build it with `vite build --ssr src/entry-server.tsx --outDir dist-ssr`. A new `scripts/prerender.mjs` iterates the route list that `generate-seo.mjs` already computes (static paths, services, doctors, articles, news, authors) and writes `dist/<path>/index.html` (or `<path>.html` with `"cleanUrls": true`), injecting the rendered markup into `#root` and the head tags. Hydrate with `hydrateRoot` in `main.tsx`. | Pure Node at build time, no browser needed. Vercel serves filesystem matches before the catch-all rewrite. Build command: `seo:generate && build && build:ssr && prerender`. | Most practical. It keeps the current router, lazy routes (the SSR entry imports pages eagerly), and the preloader, which stays static HTML over the prerendered content. |
| B. React Router v7 framework mode with `prerender` | Migrate to `@react-router/dev` (`routes.ts`, `root.tsx`) and use `prerender: () => paths` in `react-router.config.ts`. | Official SSG output, static on Vercel. | The best long-term option, but a larger refactor of `routes.tsx`, `App.tsx` and Seo into `meta` exports. |
| C. `vite-plugin-prerender` / `react-snap` (Puppeteer) | Headless Chrome crawls the built app. | Needs Chromium in the Vercel build image (`@sparticuz/chromium` workarounds). react-snap is unmaintained, and snapshots capture curtain and animation state. | Not recommended. |

**Code changes needed for option A:**
* `Seo.tsx`: today it mutates `document.head` in `useEffect`, which does nothing on the server. Add a `HeadContext` that collects `{title, meta, links, jsonLd}` during render. On the server, serialise it into `<head>`; on the client, keep the effect.
* Guard window access at module level: `i18n/index.tsx detectLanguage` already guards; check `motion/*` and `services/analytics.ts`.
* Render ru (default) for `/…`. If SEO-2(b) is adopted, also render `/kk/…` and `/en/…`, which gives real per-language HTML, working hreflang and indexable Kazakh.
* Narrow the `vercel.json` rewrite to non-file paths only (it already skips `/api/`). Add `"cleanUrls": true, "trailingSlash": false`.
* Hydration mismatch risk: `Reveal`/`SplitText` must render the same initial markup on server and client. They do, because state is attribute-driven after mount.

---

## 5. AI readiness (spec §16)

| Requirement | Status | Evidence | Gaps / actions |
|---|---|---|---|
| Structured medical content | **Good** | Services and articles follow a fixed template: indications, diagnostics, treatment, risks, cost and duration, FAQ, sources (`services-*.ts`, `knowledge-articles-*.ts`), with 6–7.5 k characters of body text per article and sources to AAO, NEI, NICE and NHS. | Invisible to non-JS crawlers (SEO-5). Add `llms-full.txt` now and prerender later. |
| Expert author profiles | **Partial / risky** | The founder profile is strong (ProfilePage + Person with `hasCredential`, `alumniOf`, publications as `subjectOf` ScholarlyArticle, `sameAs` Threads). Articles link `author.url` to `/authors/<slug>`. | (1) **13 of 17 medical articles are attributed to demo doctors** (Амина Байтурсын, Рустам Ибрагимов, …). DESIGN.md §5 itself says the doctor dataset is demo data. Attributing medical advice to fictional physicians is an E-E-A-T and trust problem, and a regulatory one for a clinic. Before launch, re-attribute to real, licensed doctors or to the founder as reviewer. (2) The author pages are not in the sitemap (SEO-4). (3) The author `Person`/`Physician` lacks `sameAs` (ORCID, Google Scholar, ResearchGate, LinkedIn), `identifier` (licence number) and `medicalSpecialty` per author. Add them in `knowledge-authors.ts` and `physicianSchema`. (4) Add ORCID and Scholar to the founder's `sameAs` (Threads alone is weak). |
| FAQ architecture | **Good** | FAQPage on 30+ pages (every service, article, patient page, `/faq`, `/knowledge-base`). | Google shows FAQ rich results only for authoritative government and health sites, but the markup still helps AI engines. Make sure answers are self-contained (they are). Consider `speakable` on key answers. |
| Semantic structure | **Good** | One h1 per page, no skipped levels (84/84); `<main>`, `<nav>`, `<article>`; a TOC with anchors; `MedicalWebPage.lastReviewed` and `reviewedBy`. | The home h1 whitespace bug (SEO-11). `TextFill` statements use `aria-label` on `<p>`, which axe flags as `aria-prohibited-attr` (§7); AI parsers read the spans fine. |
| Schema markup | **Good coverage, a few errors** | MedicalClinic, Person/Physician, MedicalWebPage, MedicalTest, MedicalProcedure, FAQPage, BreadcrumbList, OfferCatalog, NewsArticle, ScholarlyArticle, VideoObject, EducationEvent, JobPosting, ReserveAction, ItemList, ProfilePage, AboutPage and WebSite are all present and all parse (0 JSON errors). | SEO-6 through SEO-10. |
| Target platforms (ChatGPT, Gemini, Perplexity, AI Overviews) | **Partial** | robots.txt welcomes all AI agents, and llms.txt exists. | GPTBot, ClaudeBot and PerplexityBot don't execute JS, so they get the shell. Gemini and AI Overviews render, but in **English** (SEO-2). The top two fixes for AI visibility are prerendering and language-in-URL. |

---

## 6. Security and configuration (spec §17)

### 6.1 Response headers (`vercel.json`), verified live on the Vercel-like server

| Header | Value | Verdict |
|---|---|---|
| Content-Security-Policy | `default-src 'self'`; scripts `'self'` + 2 sha256 hashes + GTM, Clarity, Yandex, Meta and TikTok hosts; `object-src 'none'`; `base-uri 'self'`; `form-action 'self'`; `frame-ancestors 'self'`; `upgrade-insecure-requests` | **Good.** 0 violations across all measured routes and profiles. The inline-script hashes match `index.html`. `style-src 'unsafe-inline'` is required by React `style` props and is acceptable. |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | Good for the custom domain. `preload` + `includeSubDomains` commits **every** subdomain of the production domain to HTTPS. Confirm that before submitting to hstspreload.org. It is irrelevant on `*.vercel.app`. |
| X-Content-Type-Options | `nosniff` | Good |
| X-Frame-Options / frame-ancestors | `SAMEORIGIN` / `'self'` | Good (consistent) |
| Referrer-Policy | `strict-origin-when-cross-origin` | Good |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` | OK. Consider adding `payment=(), usb=(), browsing-topics=(), interest-cohort=()`. If online consultation ever uses in-page video, `camera` and `microphone` must be `(self)` on that route. |
| Cross-Origin-Opener-Policy | `same-origin` | Good |
| Cache-Control | Only `/assets/*` is immutable | See I5 |

**CSP versus the analytics that are not enabled yet.** No `VITE_*` analytics IDs are set in this build, so no vendor tags loaded and they could not be observed. Static review of what each vendor needs:

* **GA4 via gtag:** `script-src www.googletagmanager.com` and `connect-src *.google-analytics.com *.analytics.google.com` are covered.
* **GTM:** covered. **Custom HTML tags in GTM will be blocked** because there is no `'unsafe-inline'` or nonce, so use only built-in templates, or plan a nonce, which needs an edge function.
* **Clarity:** `*.clarity.ms` plus `c.bing.com` are covered.
* **Yandex Metrica:** `mc.yandex.ru` is covered. Webvisor and some regions also use `mc.yandex.com`, `*.yandex.com` and `wss://mc.yandex.ru`. Add `https://mc.yandex.com wss://mc.yandex.ru` to connect-src and `https://mc.yandex.com` to img-src and frame-src if Webvisor is enabled.
* **Meta Pixel:** covered.
* **TikTok:** `analytics.tiktok.com` is covered. Newer pixels also call `https://analytics-ipv6.tiktokw.us` and `*.tiktokw.us`; verify after enabling.
* **YouTube (nocookie) and i.ytimg thumbnails:** covered.
* The Contacts map link to `2gis.kz` is a link only, which is fine.

**Action:** after setting the IDs in Vercel, rerun `BASE_URL=<preview> node e2e/perf/measure.mjs`. It records `securitypolicyviolation` events per route.

### 6.2 Findings

| # | Severity | Finding | Fix |
|---|---|---|---|
| SEC-1 | **High** | **Demo admin credentials are in the public bundle:** `AdminPage.tsx:44-45` has `DEMO_LOGIN='admin'` and `DEMO_PASSWORD='ophtra'`, and the dictionary hint "Demo access: admin / ophtra." With no API, `/admin` opens a client-side panel with a `demo-admin-*` token. The data is local-only, so there is no server data exposure, but spec §17 RBAC is not met and the panel looks real. | Build-flag the demo: `if (import.meta.env.VITE_DEMO_ADMIN === 'true')`, and strip `/admin` and `/account` from production builds until the backend with real auth is deployed. |
| SEC-2 | **High (functional + GDPR)** | **On the static Vercel deploy, leads never reach the clinic.** `api.ts` calls `/api/leads`, the rewrite returns `index.html`, the client throws `api_unavailable` and the lead (name, phone, e-mail, free-text comment that may contain health details, file names) is kept in **`localStorage` `ophtra.outbox.leads`** on the patient's device (`services/outbox.ts`). It is retried only if that same browser returns after an API exists. | Before launch, deploy a real endpoint (Vercel Function `/api/leads` forwarding to the CRM, Telegram or e-mail), or point `VITE_API_URL` to the backend. Encrypt nothing client-side; just don't persist health data in localStorage longer than needed (add a TTL, and clear it after a successful flush). |
| SEC-3 | Medium | **Spam protection is client-only:** a honeypot plus a 2.5 s minimum fill time (`LeadForm.tsx:178`). Bots that POST directly to the API bypass both. The admin "rate limit / captcha" toggles are UI only. | In the API/Function: server-side honeypot and timing check (send `startedAt` signed), per-IP rate limit (Vercel KV/Upstash, or a Vercel Firewall rate-limit rule on `/api/leads`), and Cloudflare Turnstile. Turnstile needs CSP `script-src` and `frame-src https://challenges.cloudflare.com`. |
| SEC-4 | Low | **No secrets in `dist`.** A grep for AWS, Google API, Stripe, OpenAI-style keys, GitHub and Slack tokens, JWTs, private keys and `apiKey/secret/password/token` assignments returned no hits. The only `VITE_*` names are public analytics IDs (GA, GTM, Clarity, Yandex, Meta, TikTok, GSC verification, call tracking). | None. Keep server secrets out of `VITE_*`. |
| SEC-5 | Low | Firewall and DDoS: rely on the Vercel Firewall (attack challenge mode, rate-limit rules). Daily backups and encryption (§17) apply to the backend, which is not in the static deploy. | Document this in the ops runbook. |
| SEC-6 | Low | The `/api/` exclusion in the rewrite returns Vercel's 404 page, which is fine. `robots.txt` disallows `/account` and `/admin`, and the pages are also `noindex`. | None. |

---

## 7. Accessibility quick scan (axe-core 4.x, 10 routes × desktop/mobile, reduced motion)

Routes: `/`, `/services/oct`, `/knowledge-base/glaucoma-early-signs`, `/international-patients`, `/dr-kulmaganbetov`, `/doctors`, `/appointment`, `/contacts`, `/faq`, `/pricing`.

| Impact | Rule | Scans affected | Nodes | Main culprits | Fix |
|---|---|---|---|---|---|
| critical | none | 0 | 0 | | |
| **serious** | `color-contrast` | **20 / 20** | 288 (the most on `/international-patients`: 66 desktop / 56 mobile) | (1) Gold text `--oph-gold #a88b5e` on cream `#f4f2ed` at **2.88:1**: section numbers `.oph-index__n`, eyebrows `.oph-eyebrow`, `.oph-why-visual__label`, TOC eyebrow; on sand `#e9e7e1` it is **2.60:1**. (2) Muted `--oph-muted #6e7671` on cream at **4.18:1** (`.oph-index__label`, hero eyebrow, TOC links, `.svc-count`, `.oph-faq__count`, disclaimers), on sand 3.78, on paper 4.40. (3) Footer disclaimer `#6c736e` on `#131f1b` at 3.48:1. | These are design tokens (DESIGN.md forbids new colours), so the **design owner must approve** the change. Proposed values: text-only token `--oph-gold-ink: #7d6238` (5.11 on cream, 4.62 on sand) for small gold text, keeping `#a88b5e` for rails, bullets and large numerals of 24px and up; `--oph-muted: #5f6762` (5.21 on cream, 4.71 on sand, 5.49 on paper); footer muted text `#8b928d` or lighter on forest-deep (5.3:1 or more). File: `frontend/src/styles/tokens.css` (integrator). |
| **serious** | `aria-prohibited-attr` | 8 / 20 (`/`, `/international-patients`, `/dr-kulmaganbetov`, `/faq`) | 10 | `<p class="oph-textfill" aria-label="…">`: `aria-label` is not allowed on a `<p>` (generic role), so some screen readers ignore it and the word spans are `aria-hidden`, which means **the statement text can be lost**. | In `frontend/src/motion/story.tsx` `TextFill`: drop `aria-label` and `aria-hidden` on the spans, so the spans themselves are the readable text (keep a space between them). Or render `<span className="sr-only">{text}</span>` plus an `aria-hidden` visual layer. |
| moderate (Lighthouse) | `label-content-name-mismatch` | desktop header | 1 | Language switcher button `aria-label="Language switcher"` while its visible text is "RU", so voice-control users can't say "RU". | In `frontend/src/layout/LanguageSwitcher.tsx`, use `aria-label={\`${t.a11y.language}: RU\`}` or drop `aria-label` and add visually hidden text after the visible code. |

Other a11y points: the skip link exists, `main` is focusable, the reduced-motion path exists (`data-reduced-motion`, and the preloader honours `prefers-reduced-motion`). The preloader has `role="status"` with a label but no live text change; that is fine.

---

## 8. Prioritised backlog: every issue with severity, file and change

| # | Sev. | Area | Change (file) | Expected gain |
|---|---|---|---|---|
| 1 | Critical | CLS | `App.tsx`: `RouteFallback` `minHeight: '100svh'`, or move `<Footer/>` inside `<Suspense>` | CLS 0.22–0.26 → under 0.01; desktop LH about +12 |
| 2 | Critical | SEO | `index.html`: remove the static `<link rel="canonical">` and `og:url` | Stops canonicalisation of all pages to `/` |
| 3 | Critical | SEO/AI | `i18n/index.tsx`: default to ru and stop auto-detecting `navigator.language`; later, language in URL plus real hreflang (`routes.tsx`, `Seo.tsx`, `generate-seo.mjs`) | Russian/Kazakh indexable; hreflang valid |
| 4 | Critical | SEO | One origin: set `VITE_SITE_URL` in Vercel; update `data/site.json`, `index.html` JSON-LD and `AppointmentPage.tsx:40` | Sitemap and canonicals match |
| 5 | High | SEO/AI | Build-time prerender (`src/entry-server.tsx`, `scripts/prerender.mjs`, `Seo.tsx` head collection, `vercel.json` `cleanUrls`) | Per-route HTML for Bing, Yandex, AI crawlers and social cards |
| 6 | High | LCP | Hero image and h1 painted at opacity 1 under the curtain, with transform-only entrance (`motion.css:489-497`, Reveal variant, `HomePage.tsx`, `PageHero.tsx`) | LCP becomes the real hero at about 1 s desktop and about 2.5 s mobile; the cookie banner no longer becomes LCP |
| 7 | High | Load < 3 s | `main.tsx`: MIN 1800, MAX 3000 anchored to navigation start, no `fonts.ready` wait; `index.html` keyframe delays shortened; first-visit-only full reveal | Content visible at about 2 s; spec §19 met |
| 8 | High | FCP | Non-blocking main CSS switched on from `main.tsx` (vite plugin); preloader contentful at t=0 (`index.html`) | Mobile FCP about 1–1.6 s earlier |
| 9 | High | Weight | Instance Source Serif 4 at 400, subset the italic, drop the -ext files for ru/en (`scripts/subset-fonts.py`, `styles/fonts.css`); preload the Latin faces for the preloader | Fonts 529 kB → about 150 kB on home |
| 10 | High | Weight | 2 kB favicon.ico/svg plus 180 px touch icon (`index.html`) | −160 kB per page view |
| 11 | High | Bundle | Lazy service content by group or slug (`services-content.ts`, `ServiceDetailPage.tsx`) | `/services/*` JS −60 kB brotli (−300 kB parse) |
| 12 | High | Bundle | Knowledge index plus per-article bodies (`knowledge-data.ts`, `ArticleDetailPage.tsx`, `KnowledgePage.tsx`) | `/knowledge-base*` JS −70 kB brotli |
| 13 | High | Security | Gate the demo admin behind `VITE_DEMO_ADMIN`; remove admin/account from production (`AdminPage.tsx:44-45`, `routes.tsx`) | RBAC claim is honest |
| 14 | High | Leads | Deploy `/api/leads` (Vercel Function) plus server-side anti-spam (rate limit, Turnstile) | Leads reach the CRM; spam protection per §17 |
| 15 | High | SEO | Article schema on knowledge articles (`knowledge-schema.ts`); sitemap adds `/authors/*` and `lastmod` (`generate-seo.mjs`) | §15 "Article schema" met |
| 16 | High | AI | Real, licensed authors or reviewers for medical articles; author `sameAs` and licence identifiers | E-E-A-T |
| 17 | Medium | A11y | Contrast tokens (`tokens.css`, design sign-off), `TextFill` aria fix (`story.tsx`), language switcher label | axe serious → 0; LH a11y 92–97 → 100 |
| 18 | Medium | CSS | Per-route CSS imports instead of `index.css` `@import`s | Render-blocking CSS 34 → about 12 kB brotli |
| 19 | Medium | Bundle | `consentCopy`/`notFoundCopy` → `content/pages/consent.ts`; split `patients.ts` and `people.ts`; lazy `AccessibilityPanel` | Entry −9 kB brotli |
| 20 | Medium | CLS | Floating buttons move by `transform`, not `bottom` (`layout.css:111,528,548`) | −0.04 CLS on mobile |
| 21 | Medium | Images | Remove the global hero preload (`index.html`); AVIF/WebP `<picture>` in `Photo.tsx`; SVG logo | −50…130 kB on inner pages, −60 % hero bytes |
| 22 | Medium | Cache | `vercel.json` cache headers for `/fonts`, `/media`, `/brand`, `/og` | Repeat visits without revalidation |
| 23 | Medium | Scroll | Read/write phases plus cached offsets in `scrollController.ts`; migrate the hooks in `hooks.ts` and `story.tsx` | About −1,800 forced style recalcs per scroll; about −30 % main-thread time on mobile |
| 24 | Medium | SEO | Home h1 space (`HomePage.tsx:53-54`); shorter title suffix (`Seo.tsx:78`); description lengths; raster OG images; NewsArticle `image`; clinic `@id` references; drop the self-serving `reviewSchema`; `procedureType` mapping | Clean rich-result eligibility |
| 25 | Medium | UX/SEO | Remove the reload-to-home redirect (`index.html` inline script plus CSP hash) | Refresh keeps the page |
| 26 | Medium | AI | `llms.txt`: titles and summaries for all 17 articles, authors, a Russian section; add `llms-full.txt`; real phone numbers (`generate-seo.mjs`) | Better AI citation |
| 27 | Low | CSP | Add the Yandex `.com`/`wss` and TikTok `tiktokw.us` hosts when those tags are enabled; no GTM Custom HTML | No silent analytics loss |
| 28 | Low | Scroll | `@property --p { inherits:false }`; `TextFill` single variable; cached `documentHeight` | Smaller style scope |

---

## 9. Reproducing

```bash
cd e2e
node perf/serve-dist.mjs 4174 &                     # Vercel-like server (brotli + vercel.json headers)
node perf/measure.mjs                               # CDP lab metrics  -> results/perf/measure.json
node perf/scroll-trace.mjs                          # scroll traces    -> results/perf/scroll-*.trace.json, scroll-summary.json
node perf/seo-crawl.mjs                             # 84 sitemap URLs  -> results/perf/seo-crawl.json
node perf/axe-scan.mjs                              # axe              -> results/perf/axe.json
node perf/lh-summary.mjs results/perf/lighthouse-vercel-like   # summarise Lighthouse JSON
# Lighthouse itself: npx lighthouse <url> [--preset=desktop] with
# CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

Every script accepts `BASE_URL`; `measure.mjs` also accepts `ROUTES`, `RUNS` and `LOCALE`. To check CSP against a Vercel preview deployment after analytics IDs are set, run `BASE_URL=https://<preview>.vercel.app node perf/measure.mjs`.
