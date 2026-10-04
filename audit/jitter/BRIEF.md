# Jitter & whitespace hunt — shared brief (FIND ONLY, do not edit source)

Site: https://ophtra2.vercel.app (production = current code in /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/frontend).
Routes: fetch https://ophtra2.vercel.app/sitemap.xml (88 routes; strip ?lang= duplicates, ru only unless told otherwise).
Playwright 1.55 lives in /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/e2e (run scripts from there, `import { chromium, webkit, devices } from 'playwright'`, chromium with `channel: 'chrome'`).
Put scratch scripts in your own folder: /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/audit/jitter/_work/<your-name>/ . Delete nothing outside it.

Page boot: a logo-reveal preloader runs 2.3–3.2 s on every load; wait ~3.5 s after `load` before measuring. A page RELOAD redirects inner routes to "/" — always use a fresh `page.goto`, never reload.

Motion engine facts (for diagnosing): frontend/src/motion/scrollController.ts (single rAF; lag smoothing on desktop, lag=0 on touch), frontend/src/motion/story.tsx (useProgressVars writes --p/--pin/--enter), motion.css (`--oph-scroll-drift` = 0 on touch), Reveal/Stagger/SplitText/parallax (useParallax), HorizontalScroll, StickyStory, StackCards, header (frontend/src/layout/Header.tsx, hides on scroll-down on desktop, never on touch), floating launchers (assistant, cookie banner) toggled by html[data-past-hero|data-over-footer|data-over-cta|data-over-form].

## What counts as "jitter" (measure, don't guess)
- Per-frame oscillation: an element's screen position/scale/opacity changes direction (sign flip of delta) while the scroll moves monotonically, or keeps moving after scroll stops (settle/glide), or shakes ±1–3 px.
- Layout shift during scroll or load (PerformanceObserver 'layout-shift', include hadRecentInput=false).
- Fixed/sticky elements (header, launchers, sticky visuals) moving relative to viewport when they should not; header/launcher show-hide flapping near thresholds.
- Content jumping when fonts/images load, when reveal classes flip, when the URL bar resizes the viewport (simulate by changing viewport height 844→740→844 during scroll on mobile).
- Horizontal overflow wobble, scroll-snap fighting, carousels snapping back.
- Hover/click jitter: magnetic buttons, mega-menu, accordions, drawers, tabs growing/shrinking height.

Recommended technique: inject a rAF recorder (`page.addInitScript`) that each frame logs `getBoundingClientRect()` + computed transform/opacity of all elements with inline transform or CSS vars (--p, --pin, --enter, --covered), .oph-reveal*, [data-parallax], sticky/fixed elements, the header. Drive scroll with realistic input: on mobile use CDP `Input.synthesizeScrollGesture` (gestureSourceType 'touch', chromium) or `page.touchscreen`/`mouse.wheel` in steps; on desktop `mouse.wheel` in 100 px ticks at 16 ms. Then analyse sign flips/tails. Also take short screenshot bursts or a video (`recordVideo`) of the worst spots to confirm visually.

Also do a static code read for classic sources: 100vh/100dvh units changing with URL bar, `position: sticky` inside overflow containers, transforms on fixed elements' ancestors, `background-attachment: fixed`, transitions on properties the scroll engine also writes, `will-change` missing/over-used, smooth-scroll + scroll-snap, IntersectionObserver toggling classes that change the observed element's size (feedback loops), fonts without size-adjust, images without width/height.

## Report format
Write /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/audit/jitter/<your-name>.md :
a table of issues sorted by severity: ID · route(s) · viewport/engine · element selector · what the user sees · measurement (numbers) · root cause (file:line) · proposed concrete fix. Only real, reproduced issues (mark "code-only suspicion" separately). Keep it tight. Your final message: the top issues in ≤15 lines.
