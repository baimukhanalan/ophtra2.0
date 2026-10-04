# Responsive + mobile-jitter sprint — common brief for every agent

Project: /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0 (React 19 + Vite, frontend/). Read DESIGN.md first.
The client says: responsiveness is badly broken, and on phones several blocks SHAKE / JITTER while scrolling
(including the patient reviews carousel). Fix your scope completely and fast; many agents work in parallel.

## Targets
Widths: 320, 360, 375, 390, 414, 600, 768, 834, 1024, 1180, 1280, 1440, 1920 and landscape phone 844×390.
Languages: ru (default), kk (longest strings), en — switch with `?lang=kk` / `?lang=en`.
Must hold on every width: no horizontal page overflow (scrollWidth ≤ innerWidth), no element past the right edge,
no clipped / overflowing text (long Kazakh words, numbers like 9400+, e-mails, URLs), no overlapping elements,
no floating button over a CTA, sensible stacking and spacing (no huge empty gaps, no cramped columns), tap targets
≥ 44 px on phones, font-size ≥ 12 px, images keep aspect ratio, sticky elements sit under the header
(`top: var(--oph-sticky-top)`), grids never leave half-empty rows.

## Jitter rule (phones / touch)
On `(hover: none) and (pointer: coarse)` nothing may move against the native scroll or oscillate.
In YOUR pages: remove or neutralise scroll-linked transforms that wobble on touch (parallax via --p vars,
pinned horizontal tracks, sticky scale/stack effects, transitions on properties that are also written per frame).
Prefer: static layout or IntersectionObserver reveals on touch, native horizontal swipe rows with scroll-snap
instead of vertical-scroll-driven horizontal tracks. Keep the premium effects on desktop.
The motion engine itself (frontend/src/motion/*, styles/motion.css, styles/scenes.css) is owned by the motion
agent — do not edit it; use CSS media queries / props in your own files.

## Method
* Run your OWN dev server on your assigned port: `cd frontend && npx vite --port <PORT> --strictPort`
  (dev mode; never use port 4173 and never build into frontend/dist).
* Playwright from /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/e2e (`channel: 'chrome'`, never download
  browsers). Put scripts in `e2e/rs/<your-id>/`, outputs in `e2e/results/rs/<your-id>/`.
* Wait for `#oph-preloader` to disappear; click the cookie card's accept button.
* For phones use `isMobile: true, hasTouch: true` contexts. Scroll down each page step by step, take screenshots
  and LOOK at them (Read the PNGs). Add automatic checks for the rules above.
* Jitter check on phones: scroll with touch-like gestures (CDP `Input.synthesizeScrollGesture`) and sample per
  animation frame the viewport position of animated elements; any element whose on-screen delta changes sign
  during one continuous scroll, or lags then snaps, is a defect.

## File rules (parallel safety)
* Edit ONLY the files listed as yours. Page CSS files are shared by two agents — edit only rules whose selectors
  belong to YOUR pages, with small Edit-tool changes (never rewrite a whole shared file).
* Shared shell files (layout/*, PageHero, CtaBand, editorial.tsx, LeadForm, cards.tsx, ui/*, tokens.css,
  shell.css, figma-components.css, base.css, components.css, layout.css) belong to the shell agent.
  Report needed changes instead of editing.
* Tokens only, no new colours. Keep every feature and all copy.
* `cd frontend && npx tsc --noEmit` must be clean for your files at the end (ignore others' in-progress errors).
* No in-app browser tools. Final report: what was broken (route, width, selector), what you changed, anything left.
