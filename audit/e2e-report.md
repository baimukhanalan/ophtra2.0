# OPHTRA 2.0: E2E and stress audit (Playwright)

**Build under test:** production preview at http://localhost:4173, the current `frontend/dist` after the audit-fix rebuild (25 Sep 2026). The API was intentionally down (`/api/*` returned 500).
**Browsers:** installed Google Chrome (`channel: chrome`). Two projects: `desktop` (1440×900) and `mobile` (Pixel 7, 412×915, touch).
**Suite:** `e2e/tests/*.spec.ts`. Re-run it with `cd e2e && npx playwright test`. Summarise the results with `node scripts/summarize.mjs`.

## Summary

| | |
|---|---|
| Tests in the suite | 598 (desktop and mobile; 65 are skipped by design, e.g. desktop-only menu tests on mobile and axe on mobile) |
| Full run (`results/full-run.txt`, `results/report.json`, `results/summary.txt`) | 447 passed · 85 failed · 1 flaky · 65 skipped |
| Failures caused by the tests, not the site (fixed after the run and re-verified) | 14. 8 × `/authors/editorial-team` was missing from the route inventory. 4 × a 404-heading regex did not tolerate the NBSP in «Page not found». 2 × the estimator test expected the clamped «days» slider to move. A targeted re-run afterwards (18 tests) confirmed that only the real soft-404s (#11) still fail. |
| Failures that are real site defects | 71 test results, grouped into **16 defects** below (0 blocker · 7 major · 9 minor) |
| Routes crawled | 96 routes × 2 viewports. Every route returned 200 with exactly one h1, a title, JSON-LD that parses, no horizontal overflow, no broken images and no console errors. The only exception is `/admin`, which has no meta description |
| Forms | All 10 LeadForm sources × 2 viewports × (empty / invalid / valid→queued + outbox / honeypot / double-click) pass. So do file-type rules, the 10 MB limit, the 10-file cap and the anti-spam timer (108/108) |
| axe (35 static routes, desktop) | Only one rule fails: `color-contrast` (serious), 477 nodes on 34 pages. **0 critical** violations and no other serious rules |

What works well, all verified by the suite:
- Logo reveal, and reload landing on `/` at the top.
- Deep links and back/forward.
- Language switching (ru/kk/en) on 5 pages, including persistence.
- Cookie consent. Accept and essential-only both persist, and no third-party requests go out before consent.
- Accessibility attributes and their persistence.
- LeadForm degradation: honest «Request saved» state, `OPH-…` reference, outbox entry. The queued lead then appears in admin → Leads.
- Booking with the API down: the honest warning state, a reference, a WhatsApp hand-off and a queued lead.
- Admin CRUD (pages, articles, doctors, prices, photos), stage changes, CSV export, and the forms toggle, which disables the public form.
- Knowledge-base search, topic and tag filters with URL state.
- Doctors, FAQ, publications, services and experts filters. Media tabs with `?tab=`. Video facades.
- XSS-looking input renders as text everywhere it is echoed: assistant, admin CRM and KB search.
- 5 000-character input, offline submit, rapid navigation, language hammering, menu and drawer thrash, and resize across 320 to 1440 px.

## Defects

Severity: **major** means a real user or business flow is broken or data is lost. **minor** means a cosmetic, a11y or SEO issue with a workaround.
Evidence paths are relative to `e2e/`. The full error text for every failure in the full run is in `results/summary.txt` (and `results/full-run.txt`). Failure screenshots and traces go to `results/artifacts/<test>/` (`failure.png`, `trace.zip`), but Playwright clears that folder on every run. Re-run a single spec to regenerate them, e.g. `npx playwright test tests/widgets.spec.ts --retries=0`. The one-off probe scripts cited below are in `e2e/scratch/`.

### 1. Knowledge base crashes on an unknown `?tag=` (major)
- **Routes:** `/knowledge-base?tag=foo`. Any stale or shared link with a tag that no longer exists triggers it, as does a tampered URL.
- **Repro:** open `/knowledge-base?tag=foo`.
- **Expected:** the list renders and the unknown tag is ignored.
- **Actual:** the whole page is replaced by the error boundary. The error text is in Russian («Не удалось отобразить страницу») even when the UI is English.
- **Evidence:** `widgets.spec.ts › knowledge base › unknown ?tag= / ?topic= …` fails on desktop and mobile. `?topic=foo` is fine.
- **Source:** `frontend/src/pages/KnowledgePage.tsx:89`. An unknown `tag` is appended to the visible chips, and then `L(TAG_LABELS[entry])` (line ~279) dereferences `undefined`. The boundary copy is in `frontend/src/app/ErrorBoundary.tsx` and is not localised.

### 2. The booking deep link `?doctor=<slug>` loses the doctor (major)
- **Routes:** `/appointment?doctor=aigul-akhmetova`. This is the «Записаться» CTA on every doctor profile and author page.
- **Repro:** open the link, then choose Doctor appointment → Next. The department is prefilled correctly. Pick a service → Next.
- **Expected:** the linked doctor is preselected on the Doctor step.
- **Actual:** «Any available doctor» is selected. The patient who clicked «Book with Dr X» is booked with anyone.
- **Evidence:** `booking.spec.ts › prefill ?doctor=<slug> keeps the doctor through the flow` fails on desktop and mobile. A manual probe (`scratch/bk.mjs`) shows `Doctor | pressed: ['Any available doctor']`.
- **Source:** `frontend/src/features/booking/BookingWizard.tsx`. The service tile's `onSelect={() => update({ serviceId, doctorId: '' })}` (~line 667) clears the prefilled doctor. It should keep `doctorId` when that doctor provides the chosen service.

### 3. Pricing department chips are unreachable on phones (major)
- **Routes:** `/pricing` on mobile (412 px).
- **Repro:** on a phone, look at the department chip row above the price table.
- **Expected:** the row scrolls horizontally, or wraps.
- **Actual:** `.oph-chips` is 1 155 px wide and its `clientWidth` equals its `scrollWidth`, so it never becomes scrollable. Its parent `.svc-pricefilter__row` is not width-constrained, so the row just overflows the 373 px panel. «Cataract surgery department» sits at x=705, off-screen. `scrollIntoView` cannot bring it in and Playwright reports «Element is outside of the viewport». 4 of 7 filters cannot be tapped.
- **Evidence:** `widgets.spec.ts › pricing …` fails on mobile. `scratch/pr2.mjs` prints `oph-chips ox=auto sw=1153 cw=1153`.
- **Source:** `frontend/src/pages/PricingPage.tsx:119` (`.svc-pricefilter__row`). The styles are in `frontend/src/styles/pages/services.css`. Give the row or the chip scroller `min-width: 0` or `max-width: 100%` so `overflow-x: auto` can work, or wrap the chips.

### 4. Clicking a mega-menu trigger with the mouse closes the menu (major, desktop)
- **Routes:** every page on desktop, all 4 groups.
- **Repro:** move the mouse onto «About». `pointerenter` opens the sheet. Now click «About».
- **Expected:** the menu stays open (or a click without hover opens it).
- **Actual:** `onClick` toggles the menu, so it closes. Users who click menus, which is most users, see it flash and disappear. `aria-expanded` ends up `false`.
- **Evidence:** `header.spec.ts › group "…" opens on mouse click` fails for all 4 groups.
- **Source:** `frontend/src/layout/Header.tsx`, trigger `onClick` (~line 137): `setOpenGroup(current => current === group.id ? null : group.id)`. For mouse pointers, a click right after the hover-open should keep the menu open.

### 5. Keyboard: Tab from an open menu trigger skips the menu links (major, a11y)
- **Routes:** every page on desktop.
- **Repro:** Tab onto «About». Focus opens the sheet. Press Tab again.
- **Expected:** focus moves into the sheet's links.
- **Actual:** focus moves to the next trigger («Services»), which swaps the sheet. The persistent `.oph-nav__panel` is rendered after the whole `nav`, so a keyboard user can only reach a group's links after tabbing past every trigger, the phone link, the language switcher, the account link and Book. By then the sheet shows the last group they passed.
- **Evidence:** `header.spec.ts › group "About|Services|Patients" keyboard: Tab opens, Enter keeps open, Escape closes` fails with `Tab from an open menu trigger reaches the menu links`.
- **Source:** `frontend/src/layout/Header.tsx`, where the panel is a sibling after `nav.oph-nav`. Options: move focus into the sheet on ArrowDown/Enter, or render the sheet's links in DOM order after the active trigger (or `aria-owns` plus focus management).

### 6. Keyboard: Enter on a focused menu trigger closes the menu (minor, a11y)
- **Repro:** Tab onto «Services». It opens on focus. Press Enter, the natural "activate" key.
- **Actual:** the menu closes (`aria-expanded=false`). A second Enter reopens it.
- **Evidence:** `header.spec.ts › … keyboard: Tab onto trigger then Enter keeps the menu open` fails for all 4 groups.
- **Source:** `frontend/src/layout/Header.tsx`. `onFocus` opens the menu and `onClick` toggles it (same root cause as #4).

### 7. Leads can be lost when two tabs submit at the same time (major)
- **Repro:** open `/contacts` in 4 tabs, fill all 4 forms, and submit them together with the API down.
- **Expected:** 4 entries in `ophtra.outbox.leads`.
- **Actual:** 2 or 3 entries survive. `queueLead` and `flushOutbox` each do read, then modify, then write on localStorage. `flushOutbox` runs before every submission and rewrites the list it read earlier, which erases leads that another tab queued in the meantime.
- **Evidence:** `stress.spec.ts › many parallel tabs on the same form do not corrupt the outbox` fails on desktop and mobile (`Expected - 2 / Received + 0` means 2 of 4 were missing).
- **Source:** `frontend/src/services/outbox.ts` (`write(remaining)` in `flushOutbox`, and `queueLead`). Re-read before writing and merge by a lead id, or use a Web Lock or BroadcastChannel.

### 8. The assistant throws an unhandled promise rejection on close (major: an uncaught error on every close with the API down)
- **Repro:** open the assistant, send any message, then close it (× or Escape).
- **Actual:** `Uncaught (in promise) Error: API unavailable` on the page.
- **Evidence:** `chrome.spec.ts › assistant widget › close button closes …` fails on desktop and mobile with the page error `API unavailable`.
- **Source:** `frontend/src/features/assistant/AssistantWidget.tsx:159`, where `void api.assistantTranscript(...)` has no `.catch`.

### 9. Focus is lost when closing the assistant (minor, a11y)
- **Repro:** open the assistant, then press Escape.
- **Expected:** focus returns to the launcher.
- **Actual:** focus falls to `<body>`. `launcherRef.current?.focus()` runs in the same tick as `setOpen(false)`, before the launcher button has re-mounted.
- **Evidence:** `chrome.spec.ts › assistant widget › opens, answers …` fails at `expect(launcher).toBeFocused()` on desktop and mobile.
- **Source:** `frontend/src/features/assistant/AssistantWidget.tsx:~167`. Focus in an effect after the launcher renders.

### 10. Focus is lost when closing the accessibility panel with Escape (minor, a11y)
- **Repro:** desktop. Click the floating accessibility toggle, then press Escape.
- **Actual:** `document.activeElement` is `<body>`, not the toggle.
- **Evidence:** `chrome.spec.ts › accessibility panel › Escape and outside click …` fails on desktop.
- **Source:** `frontend/src/layout/AccessibilityPanel.tsx:26-35`. The restore targets the element stored as "opener". When the panel is opened by the toggle itself, that element or its `offsetParent` check fails.

### 11. Soft-404s for unknown dynamic slugs (minor, SEO)
- **Routes:** `/doctors/nobody` → `/doctors`, `/news/nope` → `/news`, `/knowledge-base/nope` → `/knowledge-base`, `/authors/nope` → `/knowledge-base`.
- **Expected:** the 404 page, with `noindex`.
- **Actual:** a silent client redirect to the list page, which is `index, follow` and served with HTTP 200. A mistyped or removed URL looks like a valid page to search engines and users get no explanation. `/services/nope` and unknown top-level paths do render a proper noindex «not found» page.
- **Evidence:** `behaviour.spec.ts › unknown route … renders the 404 page` fails for these 4 routes on desktop and mobile. Probe output: `http://localhost:4173/doctors Doctors index, follow`.
- **Source:** `frontend/src/pages/DoctorDetailPage.tsx`, `NewsDetailPage.tsx`, `ArticleDetailPage.tsx` and `AuthorPage.tsx` (their not-found branches use `<Navigate>`). Render `NotFoundPage` (or a local not-found state with `noIndex`) instead.

### 12. Account «Upcoming» lists past appointments, and the status reads «Confirm» (minor)
- **Repro:** `/account` → any phone → code 0000.
- **Actual:** «Upcoming» shows 19 Aug 2026 and 2 Sep 2026 while today is 25 Sep 2026. The status badge shows the verb «Confirm» (and «Cancel» for cancelled) instead of the state «Confirmed» / «Cancelled».
- **Evidence:** `portals.spec.ts › "Upcoming" appointments are in the future …` fails on desktop and mobile.
- **Source:** `frontend/src/pages/AccountPage.tsx:~378` splits upcoming and past by `status`, not by date. The badge at ~437 uses `t.common.confirm` / `t.common.cancel`. The demo dates are in `data/patient-demo.json`.

### 13. The mobile drawer close button and the toast region are labelled in Russian on EN/KK pages (minor, i18n/a11y)
- **Actual:** the drawer and modal close button has `aria-label="Закрыть"` in every language. The toast live region has `aria-label="Уведомления"`.
- **Evidence:** `header.spec.ts › mobile drawer › drawer close button is labelled in the page language` fails.
- **Source:** `frontend/src/ui/Overlay.tsx:109,159` and `frontend/src/ui/Toast.tsx:73`. Use `t.common.close`.

### 14. `/admin` has no meta description (minor, SEO/contract)
- **Evidence:** `crawl.spec.ts › crawl /admin` fails on desktop and mobile with «meta description not empty». Every other one of the 96 routes has one. The page is `noindex`, so the impact is small, but DESIGN.md §5 requires every page to render `<Seo>` with a description.
- **Source:** `frontend/src/pages/AdminPage.tsx` (the `<Seo title=… noIndex />` in the sign-in and panel views).

### 15. Colour contrast below WCAG AA (minor for most nodes; serious in axe terms)
- **Routes:** 34 of 35 static routes, 477 nodes.
- **Footer disclaimer** `.oph-footer__disclaimer` on every page: #6c736e on #131f1b, 3.48:1 at 12 px (needs 4.5:1). Source: `frontend/src/styles/shell.css` (footer).
- **Home «why» section** `.oph-why-visual__ring > em` and `.oph-why-chapter__n`: #919993 on #ecebe6, 2.44:1. Source: `frontend/src/styles/pages/home.css`.
- **TextFill unlit words** (`span[data-lit=false][aria-hidden=true]`) on most pages. The un-highlighted words are deliberately faint before scrolling "lights" them. These spans are `aria-hidden` duplicates, so the practical impact is visual only, but a low-vision reader sees near-invisible text until it animates. Consider a higher base opacity, or skip the effect under `data-reduced-motion`/`data-contrast=high`. Source: `frontend/src/motion` (TextFill).
- **Evidence:** `a11y.spec.ts`. Per-route JSON is in `results/axe/*.json`.

### 16. A triple click on the header «Book» CTA pushes three history entries (minor)
- **Repro:** from `/`, triple-click «Book», then press browser Back.
- **Expected:** you are back on `/`.
- **Actual:** you are still on `/appointment`. It takes three Backs to leave.
- **Evidence:** `stress.spec.ts › triple-click on primary CTAs …` fails on desktop.
- **Source:** `frontend/src/ui/Button.tsx` (`ButtonLink`) or `frontend/src/layout/Header.tsx`. Pass `replace` when the target equals the current location, or ignore a repeat navigation to the same path.

## Booking wizard with the API down: the flow and a UX verdict
Type → Department → Service → Doctor → Date/time → Confirmation. The clinic step is skipped because there is only one clinic.
- Every step works with Next and Back and with the step pills. Future pills are disabled. Next without a choice shows «Choose an option first» and does not advance.
- Slots fall back to locally generated ones.
- The confirmation form validates name, phone, e-mail and consent.
- Submit ends in a **warning** state «Request saved»: «the time is not held yet… send the request number on WhatsApp». It shows a reference, a WhatsApp link with the reference prefilled, and a lead queued in the outbox.
- A double-click creates one request. Offline submit behaves the same way.
- **Verdict:** acceptable and honest. The only flow defect is #2 (the doctor deep link).

## Notes on the environment and the tests
- `/api/*` 500 console errors are counted separately as environment noise and are not reported as defects. So are the demo-mode banners.
- Playwright's built-in failure screenshot hung for about 75 s on this site in some states. The config disables it. `tests/support/fixtures.ts` takes a bounded screenshot instead.
- The preview server was rebuilt several times during the audit. `tests/support/global-setup.ts` waits for it, and the config allows 1 retry. Anything that only passed on retry is reported as flaky: 1 test, the language switch on `/appointment`, which is not a defect.
- The route inventory and the header menu expectations are parsed from `navigation.ts`, `dictionary.en.ts`, `data/*.json` and the knowledge modules (`tests/support/routes.ts`, `tests/support/nav.ts`), so the suite follows content changes.
