# IRIS — Путешествие внутрь глаза

Design concept for the Ophthalmic Centre of Dr Mukhit Kulmaganbetov (Astana).

**Live:** https://ophtra-concept-iris.vercel.app

## Idea

The whole platform is one continuous camera journey into a human eye. A
procedural, photoreal-stylised eye greets you on the home page: a fibrous
gold-and-forest iris, a glossy cornea with a fresnel rim and a window
catchlight, and a pupil that dilates as you scroll. Scrolling pushes the camera
through the cornea, the aqueous humour and the lens (caustics), into the
vitreous (bokeh floaters with depth of field), onto the retina (a vascular
network, the macula glowing), then down the optic nerve, a tunnel of travelling
light.

Every page is a **layer of the eye**. Its sections carry invisible camera
markers (`data-station`), and the 3D camera blends between the stations framing
the viewport centre, so each page has its own flight path. Page changes use an
**iris-aperture wipe**: the pupil contracts to black and shows the name of the
next layer, the route swaps in the dark, the aperture opens, and the camera
dollies to the new page's first station.

## Story per page

| Page | Layer | Scroll story |
|---|---|---|
| Home `/` | Взгляд → вся глубина | Giant hero with the eye. A pinned 5-beat voyage (iris → cornea → aqueous → lens → vitreous) tells the "formula of trust" and the mission. Then metrics on the retina, the founder at the macula, centres of excellence at photoreceptor scale, the global network at the optic disc, patient portals in the nerve, and knowledge at the end of the nerve. |
| About `/about` | Роговица: прозрачность | The clinic photo opens through an iris-shaped aperture, founder-science facts, a pinned values carousel, history timeline, centres, equipment, team. |
| Founder `/dr-kulmaganbetov` | Макула | Name in huge type, credentials, a manifesto that lights up word by word, a pinned 7-step scientific path (the device step zooms to photoreceptor scale), a light-route map Cardiff → Hong Kong/Canada → Astana, research, vision, publications and sources. |
| Doctors `/doctors` | Радужка | A pinned "iris dial": doctors sit on the iris ring, which rotates as you scroll. Then search and department filters (with an empty state). |
| Doctor `/doctors/:slug` | Радужка, крупно | Iris monogram, profile, services with prices, reviews, the doctor's articles, colleagues. Booking pre-fills this doctor. |
| Services `/services` | Все слои | A pinned anatomy chapter. Each department is tied to its structure (optics before the eye, laser at the cornea, paediatrics at the iris, cataract at the lens, treatment at the retina, diagnostics at every layer), with a live cross-section diagram. Then the full priced catalogue and the patient path. |
| Service `/services/:slug` | That department's layer | Lazy-loaded medical copy: overview, indications, diagnostics, treatment, preparation, FAQ, team, sources. Loading and error states included. |
| International `/international-patients` | Зрительный нерв → мир | A pinned 6-step journey drawn as light running along the nerve, a working cost estimator that can pre-fill the application, travel, a guide, and the application form. |
| Second opinion `/second-opinion` | Хрусталик | Floating documents, then a pinned 4-step process that comes into focus as you scroll, request status, what to attach, and a form with file checks (PDF/JPG/PNG, 10 files, 10 MB each). |
| Online consultation `/online-consultation` | Зрачок | A video-call mock, the mandatory-for-international note, steps, platforms, preparation, the price from the price list, and a form. |
| Booking `/appointment` | Фокус | A 5-step wizard (department → service → doctor → date/time → details). Each step moves the camera deeper and sharpens the "focus" meter. Deep links `?service=` and `?doctor=` work, the submit button guards against double clicks, and you get a reference number at the end. |
| Knowledge `/knowledge-base` | Стекловидное тело | Floating knowledge: 8 themes, search and topic filters with an empty state, an A–Z disease library. |
| Article `/knowledge-base/:slug` | Стекловидное тело → сетчатка | A reading-progress bar, a sticky table of contents, a camera that drifts deeper section by section, FAQ, sources, related articles. |
| Science `/science` | Фоторецепторы | Microscopy scale: the retina resolves into a cone mosaic with shallow depth of field, a pinned "microscope" through three projects (×10/×40/×100), publications, the 24KZ video, study status, timeline, academy, media centre, a collaboration form. |
| Global experts `/global-experts` | Нервные волокна | A pinned 4-format model, a region-filtered light map, demo expert profiles (clearly labelled as demo), the tele-consilium flow, standards, a join form. |
| Reviews `/reviews` | Отражения на роговице | The camera sits at the corneal catchlight. Moderation rules, rating filter, reviews as reflective cards (demo note). |
| FAQ `/faq` | Водянистая влага | Search and topic filter with an accordion. |
| Contacts `/contacts` | Взгляд | The eye looks back at you. An urgent-care notice, channels, address, schedule and transport, a map schematic with 2GIS and Google links, the clinic photo, a message form. |
| Account `/account` | Сетчатка — личная карта | Demo sign-in (phone, then a 4-digit code shown on screen) leads to tabs for appointments, results, prescriptions, invoices and second-opinion status (keyboard arrow navigation). |
| 404 | Слепое пятно | The camera parks on the optic disc, where the eye has no photoreceptors. |

## Typography

- **Cormorant Garamond** (display, 300/400 plus italics) at huge sizes, with italic gold accents
- **Onest** (UI and body, 300/400/500)

Both come self-hosted through `@fontsource`, and both include the Cyrillic subset. Neither is used by production (Source Serif 4 + Manrope).

## Tech

- Vite + React 18 + TypeScript + react-router 6.
- **three.js** (raw, no R3F), loaded lazily in its own chunk. One fixed WebGL canvas sits behind every page.
  - Procedural shaders use a single 256² tileable value-noise texture instead of analytic noise, so phones stay cool.
  - The pieces: sclera with veins and velvet falloff, a fibrous iris (collarette, crypts, furrows, limbal ring) with a dilating pupil, an additive cornea (fresnel plus window catchlight), a lens with caustics, retina interior (vessels, macula, fovea, optic disc, photoreceptor mosaic), an optic-nerve tunnel with light pulses, and bokeh particles with a depth-of-field circle of confusion.
  - `setViewOffset` frames the eye to the right of the text on wide screens and above centre on phones.
- **Lenis** smooth wheel scrolling on desktop only. Touch devices keep native scroll.
- There is no JS pinning. Chapters use CSS `position: sticky`, and a single rAF loop writes a `--p` progress variable. It reads every rect first and then writes, so the loop never forces layout thrashing.
- Performance:
  - DPR is capped at 1.5 on touch and 1.75 on desktop, and adapts down when frames run long.
  - Phones get fewer particles.
  - The canvas is sized to `100lvh` and ignores height-only resizes (the URL bar), so there is no jitter.
  - Rendering pauses in hidden tabs.
- `prefers-reduced-motion`: the camera snaps, the scene renders only when its target changes, the transition becomes an instant swap, and reveals are static.
- Accessibility:
  - Semantic headings, focus moved to the new `h1` after each route change, a skip link.
  - The menu is a modal dialog with a focus trap and Esc to close.
  - Forms have labels, inline errors, `aria-invalid`, and pending and double-submit guards.
  - Visible focus rings, AA contrast on the dark palette.
- Content is Russian and real, extracted from `frontend/src/content/**` and `data/*.json` by `npm run extract` (`scripts/build-content.mjs`). No invented facts. Demo profiles and reviews are labelled as in production.

## Scripts

```bash
npm install
npm run dev        # http://localhost:5178
npm run build      # tsc + vite build → dist/
npm run extract    # regenerate src/content/*.json from the production sources
node scripts/verify.mjs http://localhost:4174   # route checks + screenshots → _shots/
```
