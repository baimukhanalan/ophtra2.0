# ios-jitter: iPhone Safari (WebKit) jitter audit

**Engine:** Playwright WebKit 26.0 (build 2203, iPhone UA, `(hover:none) and (pointer:coarse)` = true). Profiles: `devices['iPhone 14']` at 390×844 and `devices['iPhone SE']` at 375×667.

**WebKit install:** the shared install (`npx playwright install webkit`) hung while extracting `libwebrtc.dylib`. I unpacked the already-downloaded, intact zip into `_work/ios-jitter/wk` and launched WebKit from there with `executablePath`. Chromium with isMobile/hasTouch/CDP touch was used only for the swipe-gesture and scroll-lock cross-checks.

**Coverage:**
- iPhone 14: all 88 ru sitemap routes.
- iPhone SE: the 23 priority routes, including `/account`.
- Each page was scrolled top→bottom→top with touch-like flicks. A flick is a 14-frame finger drag, then momentum decay ×0.94 per frame, then a 260 ms pause.
- The URL bar was simulated once per page at about 40% depth (844→760→844, and 667→583→667 on the SE).
- A per-frame rAF recorder tracked 56–320 elements per page: fixed/sticky elements, the header, reveal/parallax/story nodes, and anything with an inline transform or CSS vars. Layout shift was measured with a transform-independent `offsetTop` sum, because WebKit has no `layout-shift` entry type.
- The recorder was self-tested against a synthetic ±2 px shaker and a transition-glide element. It caught both: 38 flips and a 97 px tail.

Scripts and raw JSON are in `audit/jitter/_work/ios-jitter/`.

## Issues (reproduced), by severity

| ID | Route(s) | Viewport / engine | Element | What the user sees | Measurement | Root cause | Fix |
|---|---|---|---|---|---|---|---|
| IOS-1 | all (burger drawer, and the assistant sheet on phones) | iPhone 14 / SE, WebKit + Chromium | `header.oph-header`, `html` scroll | **1.** When the menu opens, the sticky header jumps off-screen. You can see it in the 31 px backdrop strip to the left of the drawer, and it snaps back on close. **2.** The page behind the drawer or chat sheet still scrolls under the finger. On iOS that scroll also collapses or expands the URL bar, and the full-height chat sheet then resizes. | Opened at y=1500: header `top` goes 0 → **−1500** in the first frame (WebKit and Chromium) and back to 0 on close. A touch gesture on the backdrop moved scrollY 1500 → **1804** (CDP touch, as shipped). With `html{overflow:hidden}` instead: stays at 1500 and header stays at 0. Assistant sheet: page scrolled 1500→1800 underneath, and the sheet height followed the viewport 844→760. Screenshot: `_work/ios-jitter/shots/chromium-drawer-open_about.png` | `base.css:33-36` sets `html, body { overflow-x: clip }`. Because the root's overflow is not `visible`, the `body.style.overflow='hidden'` lock in `ui/Overlay.tsx:23` and `features/assistant/AssistantWidget.tsx:47` is **not propagated to the viewport**. The body becomes its own clipping box instead. The viewport stays scrollable, and the header's sticky containing scroller changes to `body`, which un-sticks it. | Lock the root instead of the body. Toggle `:root[data-scroll-locked] { overflow: hidden; overscroll-behavior: none; }` on `document.documentElement` in both places, and leave `body` alone. Verified: header stays at 0 and a touch gesture no longer scrolls. Optionally add `touch-action: none` on the drawer's `.oph-overlay` backdrop. |
| IOS-2 | every page, first screen (phones <768 px) | iPhone 14, WebKit (same in Chromium) | `button.oph-assistant-launcher`, `html[data-past-hero]` | A slow drag or small finger wobble around y ≈ 0.6 × viewport makes the assistant launcher flicker in and out, stuck half-faded. | ±3 px jiggle around y=506 (60 steps): **59** `data-past-hero` toggles. Launcher opacity oscillated between 0.30 and 0.63 and never settled. | `layout/Header.tsx:60`: `nextPastHero = y > viewport * 0.6` has no hysteresis. The `data-scrolled` flag next to it has one (16/48 px). | Add hysteresis: `pastHero ? y > viewport*0.5 : y > viewport*0.6`. |
| IOS-3 | all pages while the cookie card is undecided, short phones | 320×460↔540 and 375×553↔637, WebKit | `div.oph-consent`, `body` padding-bottom | Each time the Safari toolbar collapses or expands, the cookie card's top edge jumps and the page bottom grows or shrinks by the same amount. | 320 px: card **193↔227 px**, body `padding-bottom` 205↔239, document height ±34 px. 375 SE: 232↔235 (±3 px). iPhone 14: none, because the card is not clamped. In the scan, the SE consent card moved 48.7 px on resize while the other fixed elements moved 84 px. | `styles/shell.css:2256-2257` sets `max-height: 42dvh`, and dvh follows the URL bar. `ConsentBanner.tsx:65` (ResizeObserver) republishes `--oph-consent-offset`, which drives `body{padding-bottom}` (`shell.css:2264-2266`). | Use `max-height: 42svh`, which is static. Optionally round or throttle the published offset to ignore changes smaller than 8 px. |
| IOS-4 (low, not iOS tap) | all (drawer close) | Chromium mobile, or keyboard / Android tap where the burger gets focus | `html` scroll | Closing the menu smooth-scrolls the page up by about 344 px. | Burger focused, then drawer opened and closed: scrollY 1156 → **812**, animated over about 300 ms. With a JS click (no focus, like an iOS tap) there is no jump. | `ui/Overlay.tsx:62`: `previouslyFocused?.focus?.()` scrolls to the sticky burger. `html{scroll-behavior:smooth}` in `base.css:15` animates the jump. | `previouslyFocused?.focus?.({ preventScroll: true })`. |

## Clean results (measured, no action needed)

- **Scrolling:**
  - 88 routes on iPhone 14 and 23 routes on SE, all WebKit.
  - 0 per-frame direction flips, 0 elements moving against the scroll, 0 post-scroll glides or tails.
  - 0 fixed/sticky drift during scroll, 0 horizontal overflow (`scrollWidth − clientWidth = 0` everywhere).
  - The header never hides on touch.
  - Only the launcher changes opacity, and that comes from its intended footer/CTA/form toggles (3–7 per page).
- **Load:** 0 visible layout shifts after the preloader on all 23 priority routes (8 s watch). The KB articles shift 20× only while covered by the preloader.
- **URL-bar simulation:**
  - Header and sticky elements do not move.
  - The scroll engine ignores height-only resizes on touch (`scrollController.ts:244`).
  - The only in-flow shifts are off-screen sections sized in `vh`: /departments and /medical-programs 21 px, /academy 12, /science 8, / on SE 18. `vh` and `svh` are static in real iOS Safari, so this is an emulation artefact, not a bug.
- **Swipe rows (CDP touch drag, then release):** home stories (`mandatory` + `snap-stop: always`), KB authors (`mandatory`) and chip rows (`proximity`) each settle in one clean snap with no bounce. The page does not drift vertically and row height stays constant.
  - `/reviews` has no swipe row on touch. It is a static list; StackCards are desktop-only.

## Code-only suspicions (not measurable in emulation)

1. **Scroll-driven styles still written from the main thread on touch.** These are not gated by `--oph-scroll-drift`, so on real iOS they update one frame behind the compositor scroll:
   - `home.css:129` (`clip-path: inset(var(--p)…)`, a main-thread repaint every frame) and `home.css:183`
   - `services.css:1701`, `:1936-1937` and `:2104` (`--turn`, ±25° rotation)
   - `knowledge.css:274` and `:442`
   - `shell.css:1699-1700`, `:1745` and `:1835`
   - `platform.css:1970`
   - `people.css:916`

   The biggest risks are the clip-path and the rotations. Gate them with `--oph-scroll-drift`, or switch to IO-triggered transitions on touch.
2. **Assistant sheet and the iOS keyboard.** `AssistantWidget.tsx:49-63` applies `visualViewport.offsetTop` in a later rAF, so the sheet may lag or jump one frame when the keyboard opens. IOS-1 makes this worse: the page underneath is not really locked.
3. **backdrop-filter:** nothing that scrolls has one. It is used only on the fixed `.oph-overlay` (`components.css:927`), the unused `.oph-card--glass` and `services.css:312`. `-webkit-overflow-scrolling: touch` (5 places) is obsolete but harmless.

## Fixed (2026-09-28)

Before = production (https://ophtra2.vercel.app). After = local `vite preview` build of the patched code. Measured with the scripts in `_work/ios-jitter/` (`_fix_*.mjs` = the auditor's scripts with a `BASE` env var).

| ID | Fix | Before → after |
|---|---|---|
| IOS-1 | New `ui/scrollLock.ts`: a ref-counted lock that sets `[data-scroll-locked]` on `<html>`. `base.css` turns that into `overflow: hidden; overscroll-behavior: none`. Used by `ui/Overlay.tsx` (Drawer/Modal) and `AssistantWidget.tsx`. `<body>` is no longer touched, apart from the desktop scrollbar padding. | Header `top` when the drawer opens at y=1500: **−1500 → 0** (WebKit and Chromium, on `/about`, `/` and `/services/femto-lasik`). Chromium CDP touch drag inside the open drawer or chat sheet: page **did not scroll** (y unchanged, header 0). A drag that starts on the backdrop still dismisses on pointerdown, as before, and the page then scrolls normally. |
| IOS-2 | `Header.tsx`: `pastHero ? y > 0.45·vh : y > 0.6·vh`. | ±3 px jiggle, 60 frames, WebKit iPhone 14: **25 → 0** `data-past-hero` toggles. Launcher opacity **0–1 → constant 1**. |
| IOS-3 | `shell.css`: `max-height: 42svh` (with a `vh` fallback). `ConsentBanner.tsx` ignores offset changes smaller than 8 px when it publishes `--oph-consent-offset`. | 375×553↔637: body `padding-bottom` **244↔247 → 244 constant**, document height **±3 → 0**. At 320 px the ±34 px change remains *in emulation only*: Playwright resizes the whole viewport, so `svh` changes as well. In real Safari `svh` does not follow the URL bar. The computed rule is `42svh`. |
| IOS-4 | `Overlay.tsx`: `previouslyFocused.focus({ preventScroll: true })`. | Keyboard-opened drawer, then Esc (Pixel 7, `/about`): scrollY **725 → 294 jump → stays at 725**. |
| Suspicion 1 | Most of the listed rules were already static on touch (`home.css` touch block, `services.css` touch blocks incl. `--turn: 0deg`, knowledge.css hover-only, platform.css, and `shell.css`/`motion.css` for swirl, clip reveal and stack cards). Newly gated on touch in `people.css`: `.ppl-map__arcs` / `.ppl-map__node` opacity and `.ppl-route__arc` dashoffset now rest at their final values. `.oph-stack-cards` gap `5vh → 5svh`. | Not measurable in emulation. |
