# Android / touch jitter audit (android-jitter)

Target: production https://ophtra2.vercel.app. Browser: Chromium, Chrome channel, headless, `isMobile` + `hasTouch` (confirmed `(hover: none) and (pointer: coarse)` = true on every run).
Viewports: Pixel 7 (412×839), 360×740 phone, 820×1180 touch tablet, 844×390 landscape phone.
Coverage: all 88 ru routes × 4 viewports, plus `/?lang=kk` and `/?lang=en` on both phones. That is 356 successful runs; the runs that hit network drops were re-run.
Input: CDP `Input.synthesizeScrollGesture`, `gestureSourceType: 'touch'`. Each run did a slow drag (300 px/s, no fling), a medium fling (1500 px/s), fast flings (5000 px/s) to the bottom and fast flings back to the top. The phones also got a URL-bar simulation during an upward drag (viewport height 839→735→839). A rAF recorder logged the rect of the header, every fixed, sticky, reveal, split, parallax, inline-transform and CSS-var element, and every h1/h2 and img, on every frame. It also logged scrollY, doc height, scrollWidth, the `html[data-past-hero|over-*]` flags and `layout-shift` entries.
Scripts and raw JSON: `audit/jitter/_work/android-jitter/` (`sweep.mjs`, `interact.mjs`, `fade.mjs`, `flap.mjs`, `consent.mjs`, `wizard.mjs`, `out/`).

## Issues (reproduced), by severity

| ID | Route(s) | Viewport | Element | What the user sees | Measurement | Root cause | Fix |
|---|---|---|---|---|---|---|---|
| A1 (Medium) | every route, first visit (no consent stored) | 412×839, 360×740 (portrait phones) | `.oph-consent` bottom sheet | Dragging on the cookie sheet does not scroll the page. The bottom quarter to third of the screen is a scroll dead zone until the visitor makes a choice. | Sheet is 230 px = 27 % of the viewport on Pixel 7 and 257 px = 35 % on 360×740. A touch drag of −200 px starting on it moves the page 0 px. The same drag on tablet or landscape (card layout) moves it 201–202 px. The sheet does not overflow (scrollHeight 227 = clientHeight 227). | `styles/shell.css:2256-2259`: `max-height: 42dvh; overflow: auto; overscroll-behavior: contain`. A non-overflowing scroll container with `contain` swallows the gesture instead of chaining it to the page. | Drop `overscroll-behavior: contain`, or apply it only when the sheet really overflows (e.g. `[data-overflowing]` set from the existing ResizeObserver in `layout/ConsentBanner.tsx:63` when `scrollHeight > clientHeight`). |
| A2 (Medium) | all content routes (measured on `/`, `/about`, `/doctors`, `/services/femto-lasik`, `/knowledge-base/glaucoma-early-signs`) | Pixel 7 | `[data-oph-reveal]`, `.oph-split-word > span` | During a fling the page arrives mostly blank and fills in. Blocks are still fading from opacity 0 while they are already on screen: "content pops in during fling". Nothing moves, since translation is correctly 0 on touch. | Fast fling (5000 px/s): up to **66–84 %** of the viewport is covered by reveal blocks at opacity < 0.3, and more than 15 % of the viewport is blank on 17–32 % of frames. It clears 130–440 ms after the scroll stops. Moderate swipe (1200 px/s): up to **37–48 %** of the viewport is blank. Up to 9 SplitText words are hidden at once. | `frontend/src/motion/useReveal.ts:33`: touch rootMargin is only `12%` below the fold. `styles/motion.css:10-45` + `:638-662`: a 1.4 s opacity/filter entrance (`--oph-duration-reveal`). At phone fling speeds a block crosses the 12 % pre-trigger band in about 20–60 ms, so it enters the viewport at opacity ≈ 0. | On touch, start reveals a full screen ahead (`rootMargin: '0px 0px 100% 0px'`) and shorten the touch entrance to about 400–500 ms. Alternatively, skip the transition (`data-visible` with `transition: none`) when the element intersects while `Math.abs(getScrollState().delta)` exceeds about 40 px/frame. |
| A3 (Low–Med) | every route | Pixel 7 (all phones) | `.oph-assistant-launcher` (via `html[data-past-hero]`) | A small back-and-forth thumb movement near the end of the first screen makes the chat launcher bounce in and out repeatedly. | Test: ±12 px touch drags across the threshold (y = 0.6·clientHeight = 503 px on Pixel 7). Result: 6 `data-past-hero` toggles in 3.3 s, 5 direction reversals of the launcher (slides 76 px, opacity 0↔1 each time). A monotonic fling never flaps: no flag toggled back within 800 ms in any of the 356 runs. | `frontend/src/layout/Header.tsx:60`: `nextPastHero = y > viewport * 0.6` has no hysteresis (unlike `scrolled`, which uses 48/16). | Add hysteresis: `pastHero ? y > viewport * 0.45 : y > viewport * 0.6`. |
| A4 (Low) | `/`, `/about`, `/?lang=kk`, `/?lang=en` | all | `.oph-statband__item > p.oph-stat__value` | Stat numbers counting up nudge their line. | CLS 0.0013–0.0018 per page; 4 shifts of 0.0003–0.0004 while the band is in view (text rect height 36→44 px). | Count-up text changes width and wraps while animating. | Add `font-variant-numeric: tabular-nums` and reserve the final width (`min-width: <final chars>ch`, or render the final value invisibly and overlay the counter). |

## Code-only suspicions (not reproducible as real Android jitter)

- **`.oph-stack-cards { gap: 5vh }`** (`styles/shell.css:1825`). When the emulated viewport height changes, the doc height changes by 10–26 px on `/academy`, `/departments`, `/medical-programs` and `/science`. Chrome Android keeps `vh` at the large viewport, so the real URL bar does not trigger this. WebViews and in-app browsers that resize the ICB would. Use `rem` or `svh`.
- **`.svc-stickybook` visibility** (`pages/ServiceDetailPage.tsx:471`). It toggles on `start.top < 0` with no hysteresis (same class as A3), and it compares `end.top` against `window.innerHeight`, which changes when the URL bar moves. The bar can therefore show or hide without a scroll at the end boundary. Use `documentElement.clientHeight` and add a margin of about 40 px.
- **Consent `max-height: 42dvh`** (`shell.css:2257`) changes with the URL bar. The ResizeObserver then republishes `--oph-consent-offset`, and the body `padding-bottom` changes. This only affects the page bottom, so no visible shift was measured.

## Verified clean (touch)

- **Scroll direction:** 0 reverse-scroll frames in any fling (no snap-back or scroll-anchoring jumps).
- **Horizontal overflow:** scrollWidth never exceeds viewport width on any route or viewport.
- **Boot CLS:** 0 on all routes.
- **Header:** never moves on touch.
- **Parallax / transforms:** no parallax, inline-transform or `--p` element moved relative to the page. `--oph-scroll-drift = 0` and zero reveal translation are confirmed.
- **Sticky elements** (`.oph-kb-letters`, `.oph-kb-tabbar`): only the stick/unstick frames change, with no oscillation.
- **Horizontal rails** (`.oph-home-stories__row`, `.oph-kb-authors`, chip rows, `.oph-kb-tabbar__scroll`): `scrollLeft` moves monotonically to its snap point. There is no vertical page drift during horizontal swipes and no height change. Short drags snap back to the current card (`scroll-snap-stop: always`), which is intended.
- **Filter chips** (`/faq`, `/pricing`, `/services`, `/doctors`, `/news`, `/media-center`): the chip row stays put when tapped (0 px). The list below collapses, which counts as input-excused CLS.
- **Booking wizard** (`/appointment`): steps change the stage height (842 → 830 → 504 → 147 → 271 px) with no non-input layout shift. After "Далее" the page smooth-scrolls to the step top (intended, `BookingWizard.tsx:351`).
- **Launcher / sticky-book state flags:** they toggle only on real threshold crossings. The sticky-book bar's 8 px offset on over-form/CTA is intended.
- **Harness note:** the `/faq` and `/knowledge-base` scroll jumps seen with Playwright `tap()` were harness artifacts (Playwright's own scrolling). They do not happen with raw CDP touch events.

## Fixed (2026-09-28)

Before = production. After = local `vite preview` of the patched build. Measured with `_work/android-jitter/_fix_*.mjs` (the auditor's scripts with a `BASE` env var).

| ID | Fix | Before → after |
|---|---|---|
| A1 | `shell.css`: dropped `overscroll-behavior: contain` from the phone sheet. It now applies only on `.oph-consent[data-overflowing]`, which `ConsentBanner.tsx` sets when `scrollHeight > clientHeight`. `max-height` changed `42dvh → 42svh`. | −200 px touch drag on the sheet: Pixel 7 **0 → 200 px** scrolled, 360×740 **0 → 200 px**. Tablet and landscape unchanged (199/203). |
| A2 | `useReveal.ts`: touch `rootMargin` is now `0px 0px 100% 0px`, so reveals start one viewport ahead. `tokens.css`: touch `--oph-duration-reveal` goes 1400 → 450 ms. `motion.css`: touch reveals are opacity-only (`filter: none`, `transition-property: opacity`). | 5×5000 px/s flings, max share of the viewport hidden: `/` **0.66 → 0.33**, `/about` **0.66 → 0.22**, `/doctors` **0.84 → 0.15**, `/services/femto-lasik` **0.78 → 0.27**, KB article **0.79 → 0.19**. Frames with more than 15 % hidden: **17–25 % → 0–2 %**. |
| A3 | `Header.tsx` hysteresis (show above 0.6·vh, hide below 0.45·vh). | ±12 px touch drags at the threshold: **6 → 1** `data-past-hero` toggles (the single intended crossing). Launcher direction reversals **5 → 0**. |
| A4 | `Counter` (`motion/components.tsx`) renders the final value invisibly in the same inline-grid cell (`aria-hidden`), so the counter has its final width from the first frame. `tabular-nums` was already set. | Width is constant by construction. The CLS sweep was not re-run. |
| Stack gap | `.oph-stack-cards { gap: 5svh }` (with a `5vh` fallback). | — |
| Sticky-book | `ServiceDetailPage.tsx`: 40 px hysteresis on both edges, measured against `documentElement.clientHeight` instead of `innerHeight`. | ±8 px wobble at the end boundary: 0 toggles before and after. The URL-bar dependency is removed. |
| Consent `dvh` | See A1 (`svh`), plus an 8 px dead band on the republished `--oph-consent-offset`. | — |
