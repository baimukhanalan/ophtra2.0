# LUMEN — Свет и оптика

Design concept for the Ophthalmic Centre of Dr Kulmaganbetov (Astana).
**Live:** see "URL" below.

## Idea

The story of light becoming sight. Every page is an **optical bench**: a single
beam of daylight runs through floating glass (lenses, a prism, an iris
aperture, glass panes, a ball lens) above a cream floor lit with soft moving
caustics. Scrolling moves the camera **along the beam** — each chapter frames a
new optical element, and the message goes from blur to sharp, the way a
diagnosis brings a vague complaint into focus.

- Typography is defocused first and snaps into focus: headings un-blur while
  the letters close in from wide tracking (scroll-scrubbed; transforms and one
  filter only, no layout work).
- **Page transitions:** the camera accelerates *through* the nearest lens
  (FOV warp + push), the page magnifies and defocuses, a gold lens rim rushes
  at the viewer; the next page appears refracted — magnified, blurred, seen
  through a small aperture — and snaps into focus as the aperture opens.
- Mood: bright cream daylight, forest ink, gold glints on brass mounts,
  chromatic fringes at glass edges. The deliberate opposite of the dark concepts.

## Story per page

| Page | Bench | Scroll story |
| --- | --- | --- |
| Home `/` | lens → iris → prism (spectrum) → meniscus → ball lens | Hero focuses in · mission through the iris · metrics · pinned "formula of trust" split by the prism · founder behind glass · five centres = five lens curvatures · journey from blurry to sharp · portals · experts · light-table strip · science · honest story principles · final lens |
| About `/about` | pane → lens → rod lens → lens | Photo revealed through an opening iris · founder's verified facts · pinned history (4 steps) · values · centres · instruments on an optical rail · team · clinic |
| Founder `/dr-kulmaganbetov` | ball lens → prism → lens | Glass portrait · credentials · manifesto through the prism · pinned 7-step scientific path · "light in superposition" schematic of the patented principle · Cardiff–Hong Kong–Canada–Astana beam map · research · vision · publications · 24KZ video + sources |
| Doctors `/doctors`, `/doctors/:slug` | three glass panes | Portraits behind glass that sharpen on hover/focus (on phones: when centred). Search + department filters, empty state. Detail: profile, services, demo reviews, articles, colleagues |
| Services `/services`, `/services/:slug` | six lenses of rising curvature | Each department and each service is a lens with its own curvature (glyph + the 3D lens on the detail page). Catalogue filter, programmes. Detail loads long-form copy lazily (loading / error-retry states), TOC, FAQ, sources, team, related articles, request form |
| International `/international-patients` | lens → ball → lens → iris | Why Kazakhstan · proof · pinned 6-step journey · working cost estimator (production formula) that pre-fills the application · travel · coordinator & languages · memo · form · FAQ |
| Second opinion `/second-opinion` | two lenses side by side ("two views") | Documents stack · process · features · status tracker · what to attach · form |
| Online consultation `/online-consultation` | iris → lens → pane | Call mock-up · why · pinned 5 steps · platforms · preparation · price from the price list · form |
| Booking `/booking` | iris that opens as the booking progresses | **Focusing ring** as the step control (7 steps, keyboard arrows), an eye-chart in the lens sharpens with each completed step; type → department → service → doctor → date/time (empty-slot state) → details (inline validation) → confirm (pending, no double submit) → success with .ics |
| Knowledge base `/knowledge-base`, `/:slug` | rod lens → lens → pane | Eight themes · **light table**: articles as slides on a glowing lightbox with search, topic and tag filters, empty state, paging · A–Z disease library · authors · FAQ. Article: lazy body, reading ring, active TOC, FAQ, sources, related slides |
| Science `/science` (+ `#academy`, `#media`) | prism → ball → lens → iris | Stats · statement in the spectrum · pinned projects · publications with DOI · video · study status · innovation · timeline · Academy (audience filter, programmes, event calendar) · media releases · collaboration form |
| Global experts `/global-experts` | constellation of ball lenses | Four formats · region filter over a beam map · demo profiles · teleconsult flow · standards · join form |
| Reviews `/reviews` | lens → meniscus | Statement · demo reviews with lens-dot ratings and filter · four publication rules |
| FAQ `/faq` | two irises | Search + topics over an accordion, empty state, contact band |
| Contacts `/contacts` | lens → prism | Channels · urgent note · schematic map + 2GIS / Google links · form · photo |
| Account `/account` | pane | Demo OTP sign-in → tabbed cabinet (appointments, results, prescriptions, recommendations, invoices, second-opinion tracker) · scattered records converge into one profile on scroll |
| 404 | tilted prism, scattered light | "404" out of focus, sharpens on hover; helpful links |

## Content

Only real content: `data/*.json` and the production copy in
`frontend/src/content/**`, extracted to Russian by `scripts/extract.mjs`
(esbuild bundles the production modules; nothing is rewritten). Approved
metrics: 17+ years, 9400+ operations/year, 28+ doctors, 98 % recommend.
Doctor profiles, reviews and the demo cabinet are labelled as demo, as in the
production data. Forms validate and show success states but send nothing.

## Fonts

- **Unbounded** (display, geometric, wide) — `@fontsource-variable/unbounded`
- **Inter Tight** (UI/body) — `@fontsource-variable/inter-tight`

Both with Cyrillic.

## Tech

Vite 8 + React 19 + TypeScript + react-router 7 · three.js via
@react-three/fiber + drei (`MeshTransmissionMaterial` with one shared refraction
buffer for all glass, `Environment` built from Lightformers — no HDR download) ·
custom GLSL for the caustic floor, the focusing beam, the spectrum fan and dust
motes · GSAP ScrollTrigger · Lenis (desktop pointer only).

Performance & robustness:

- The 3D chunk is lazy-loaded after first paint; a CSS loader shows instantly
  and leaves within ~1–2 s. Canvas fades in over a CSS fallback.
- Rendering pauses whenever no transparent "stage" section is on screen.
- Phones/weak CPUs: DPR ≤ 1.5, half-resolution refraction buffer, fewer
  samples/particles, single-sample caustics, native scroll (no Lenis),
  no full-page blur in transitions, `100lvh` canvas (no resize jitter when the
  URL bar moves), pinned chapters use CSS `position: sticky` (no JS pinning).
- `prefers-reduced-motion`: static camera, no scrubbed blur, cross-fade
  transitions — still composed and legible.
- No WebGL → the CSS fallback remains.

## Run

```bash
npm install
npm run extract   # optional: refresh copy from ../../data and ../../frontend
npm run dev
npm run build
node scripts/check.mjs   # Playwright pass (needs `npx vite preview --port 4174`)
```

Screenshots: `_shots/`.

## URL

https://ophtra-concept-lumen.vercel.app
