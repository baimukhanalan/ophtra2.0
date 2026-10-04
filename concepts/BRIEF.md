# Ophtra — three alternative design concepts (Awwwards level)

The client (Ophthalmic Centre of Dr Mukhit Kulmaganbetov, Astana) wants 3 complete alternative UI/UX designs of the WHOLE platform, each a scroll-driven storytelling experience with a real 3D scene, camera moves, "dive into depth" transitions between sections and between pages. Each concept is shipped as a live, shareable website (Vercel link) that the client can forward. They are design concepts, not the production site — do NOT touch /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/frontend.

## Where
Your folder: /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/concepts/<slug>/ (own package.json; Vite + React + TypeScript + react-router; three.js via npm — @react-three/fiber + drei allowed; GSAP + ScrollTrigger and Lenis allowed). Work only inside your folder.

## Content (no invented facts)
Reuse real content only: /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/data/*.json (services, doctors, articles, faq, reviews, site, clinics, programs, news…) and page copy in /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/frontend/src/content/** (trilingual {ru,kk,en}; Russian is primary — Russian UI is enough for the concept, a visible RU/KK/EN switch is nice-to-have). Photos: /Users/alanbaimukhan/Documents/PROJECTS/ophtra2.0/frontend/public/media (copy what you use). Verified doctor facts: MD, PhD Vision Sciences (Cardiff University), AFHEA; quantum-optics device for early AMD detection tested in Hong Kong and Canada on 200 patients, patented; myopia technology at animal-study stage; lecturer at the Kazakh Research Institute of Eye Diseases; papers 2026 in Scientific Reports, Diagnostics, Healthcare. Metrics the client approved: 17+ years, 9400+ operations/year, 28+ doctors, 98 % recommend. Do not add other claims, prices, addresses or phones beyond the data files.

## Pages (every one needs its own scroll story, not a template)
Home · About the centre · Founder (Dr Kulmaganbetov) · Doctors list + doctor detail · Services/centres of excellence list + service detail · International patients portal · Second opinion portal · Online consultation portal · Booking / appointment (multi-step, working UI) · Knowledge base + article detail · Science / academy / media centre · Global experts · Reviews · FAQ · Contacts · Patient account (demo UI) · 404. Each page: scroll-driven narrative with at least one 3D/camera moment or depth transition, pinned chapters, text reveals; page-to-page transitions that feel like travelling deeper (camera push, zoom through an element, portal/iris wipe).

## Quality bar
- Awwwards SOTD feel: bold typography, confident grid, cinematic motion, sound design optional (off by default).
- Butter-smooth: 60 fps on a mid laptop, NO jitter on phones (this is the client's #1 complaint about the current site). On touch: native scroll (no hijacking lag), reduce 3D cost (lower DPR ≤1.5, fewer particles, pause render when off-screen), no parallax sign flips, no layout shift. Respect prefers-reduced-motion (static but still beautiful).
- Fully responsive 320–1920, accessible (semantic headings, focus states, contrast AA, alt text), fast first paint (lazy-load 3D, show a designed loader ≤2 s).
- Palette: start from the brand (forest #1b2e28, deep #131f1b, cream #f4f2ed, sand #e9e7e1, gold #a88b5e/#c9b08a). Each concept may push its own mood (lighting, gradients, darkness) but must still read as the same clinic.
- Typography: each concept uses DIFFERENT fonts from the production site (production = Source Serif 4 + Manrope) and from the other concepts — fonts MUST support Cyrillic (Google Fonts via @fontsource or self-hosted).

## Delivery
1. `npm run build` passes; verify with Playwright (e2e/node_modules has Playwright 1.55; chromium channel 'chrome') at 390×844 and 1440×900: no console errors, no horizontal overflow, every route renders, screenshots of key moments into concepts/<slug>/_shots/.
2. Deploy: from concepts/<slug>/dist (add a vercel.json with SPA rewrite `{"rewrites":[{"source":"/(.*)","destination":"/index.html"}]}` copied into dist) run `vercel deploy --prod --yes --name ophtra-concept-<slug>` (or `vercel link --yes --project ophtra-concept-<slug>` then `vercel deploy --prod --yes`) from inside a clean folder containing only the built site. Vercel CLI is already logged in. Make sure the production URL is public (not behind Vercel auth); if protected, report it.
3. Write concepts/<slug>/README.md: concept idea, story per page, fonts, tech, URL.
Final message: URL + 5-line summary.
