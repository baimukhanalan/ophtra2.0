# ATLAS — От Астаны к миру

Design concept #3 for the Ophthalmic Centre of Dr Mukhit Kulmaganbetov (Astana).

**Live:** https://ophtra-concept-atlas.vercel.app

## Idea

The whole site is one continuous 3D world, and every page is a place in it.

A stylised point-cloud planet (forest night side, gold city lights, a gold terminator rim) carries the doctor's real route:
**Astana → Cardiff (PhD) → Hong Kong & Canada (device trials) → back to Astana**. From orbit the camera dives through clouds into a night-time steppe city of wireframe towers, finds the clinic, and enters it. The building is drawn as an architectural wireframe where **each floor is a centre of excellence** (diagnostics, treatment, laser, cataract, paediatric, optical). Science zooms further down, into a particle field shaped like an OCT section of the retina with its foveal pit, and a double helix of light (the quantum-optics device).

Page-to-page navigation is a camera flight rather than a page load. The DOM zooms through (scale, blur), a "Курс на …" caption flashes, and the camera changes altitude. It climbs on long great-circle hops, pushes through with radial light streaks and motion blur, or dives through a cloud layer when it changes between orbit, city and micro-world. A live HUD shows the camera's real latitude, longitude and altitude.

Mood: nocturnal, cinematic, forest-deep with gold light trails. The brand palette is kept (forest #1b2e28, deep, cream #f4f2ed, gold #a88b5e / #c9b08a) and pushed darker.

## Typography

| Role | Font |
| --- | --- |
| Display | **Playfair Display** (variable, roman + italic): high-contrast editorial serif, italic gold accents |
| UI / body | **Golos Text** (variable): a Cyrillic-first grotesk |
| Coordinates / labels | **JetBrains Mono**: HUD, waypoints, meta |

All fonts are self-hosted via @fontsource with Cyrillic subsets, and none of them are used by production or the other concepts.

## Story per page

| Page | Stage and camera | Scroll story |
| --- | --- | --- |
| **Home** `/` | Orbit to city to clinic to orbit | Hero over the planet → Astana (mission) → flight to Cardiff (PhD) → Hong Kong (light in superposition) → Canada (200 patients, patent) → return with approved metrics (17+, 9400+, 28+, 98 %) → dive through clouds → the city → the clinic → the camera rides up six floors (one per department) → patient journey → climb back to orbit for the three portals → knowledge constellations → founder quote |
| **About** `/about` | City at dusk, orbit coordinates | The clinic that grew out of science → the coordinates everything leads to (address, transport) → centres of excellence → equipment (floor 01) → values over the lit city → photos → people |
| **Founder** `/founder` | The timeline flown as a route | Credentials → manifesto → 7 waypoints (KZ teaching → Cardiff PhD → device → HK and Canada trials → myopia → 2026 papers → Astana), with arcs drawn as the route progresses → research directions and publications → vision, sources |
| **Doctors** `/doctors` | Clinic floors | Search, floor and online filters (with an empty state) → one floor per department, and the camera moves to that floor |
| **Doctor** `/doctors/:slug` | That doctor's floor lit | Profile, facts, department services with prices, demo reviews, colleagues on the floor |
| **Services** `/services` | Building section, then each floor | Floor index → six floors with services and prices → yearly programmes |
| **Service** `/services/:slug` | Its floor, highlighted | Price and duration, the department, sibling services, doctors, FAQ by topic, related reading |
| **International** `/international` | Inbound flight arcs, then the arrival route in the city | Why Kazakhstan → 6 treatment steps flown from orbit to the airport, the stay and the clinic → travel support → **working cost estimator** (list prices + stay tiers) → request form (the estimate pre-fills the comment) with FAQ |
| **Second opinion** `/second-opinion` | Document pulses flowing along arcs to Astana | Advantage → 4-step process → status tracker → what to attach, with a **file picker** that checks type and size and uploads nothing → form |
| **Online consultation** `/consultation` | Outbound pulses, then the expert network | Mock call UI → why → 5 steps → platforms, preparation, price from the price list → form (platform, date, time zone guessed from the browser) |
| **Booking** `/booking` | Each step walks the camera closer to the entrance; confirming enters the building | A 6-step **working flow**: department → service → doctor → day and slot (clinic schedule, simulated busy slots) → contacts (validated) → review with edit links → confirmation with a reference number. Deep links `?doctor=` and `?service=` prefill it |
| **Knowledge** `/knowledge` | Constellations in the sky above Astana | The sky → 8 topic constellations (one star per article) → searchable, filterable list with an empty state |
| **Article** `/knowledge/:slug` | The camera flies to that article's star | Lazy-loaded body with loading and error/retry states, table of contents, FAQ, sources, neighbouring stars |
| **Science** `/science` | Micro-world: OCT-like retina layers, fovea, light helix | Principle → figures → 3 projects with their real status → publications (DOI links) → 24KZ report → timeline → Academy → media centre (news) |
| **Experts** `/experts` | Network arcs between UK, US, Canada, HK, China, Japan and Astana | West → East with the 8 subspecialties → 4 formats → teleconsilium flow → standards → join form |
| **Reviews** `/reviews` | City windows light up | Average rating → demo reviews, filtered and sorted → publishing rules |
| **FAQ** `/faq` | The plaza in front of the clinic | Search and topics; every opened answer lights more windows in the building |
| **Contacts** `/contacts` | Orbit → exact coordinates → entrance | 51.1284° N 71.4306° E, schedule and transport, channels, night photo |
| **Account** `/account` | Above the clinic, floor highlighted | Demo cabinet: accessible tabs for visits (cancel with confirmation, reschedule), results, prescriptions and invoices |
| **404** | Deep space | "Этой точки нет на карте" → back to orbit |

## Tech

- Vite 8, React 19, TypeScript, react-router 7, Lenis (desktop only), three.js written by hand in `src/world` (no r3f).
- **One persistent WebGL canvas** with three stages (orbit, ground, field). Pages only declare *chapters*: a DOM section plus a shot id (`<Chapter shot="home-cardiff">`). The engine maps the scroll position between chapter anchors to camera interpolation. Orbit shots slerp on the sphere and climb on long hops. Moves between stages cross through a cloud-mask shader. Chapters pin with CSS `position: sticky`, so scrolling is never hijacked.
- The land mask is rasterised from Natural Earth 110m (`world-atlas`, generated by `scripts/gen-land.mjs`) into a 12 KB run-length-encoded bitmap. Stylised night lights are scattered around real city coordinates.
- Performance: the 3D chunk is lazy-loaded behind a designed inline loader, which is released after the first frame or at 1.9 s at the latest. DPR is capped at 1.75 on desktop and 1.5 on touch, and drops automatically if frame time degrades. Particle counts are lower on touch and small screens. Rendering pauses when the tab is hidden, and the ground and field stages are built and compiled at idle time. On touch, scrolling is native (no Lenis) and the camera follows a damped scroll value, so there is no jitter. The canvas is sized to `100lvh` and does not resize when the mobile browser bars show or hide, so there is no layout shift. HUD and label updates write only transforms.
- `prefers-reduced-motion`: no smooth scroll, no flights, no drifting or twinkling. The camera cuts between chapter shots with a soft fade, frames are rendered only when something changes, and all text is visible immediately.
- Accessibility: semantic landmarks and headings (one `h1` per page); split-title reveals keep the full text in `aria-label`; a skip link; a focus-trapped route menu with Esc to close; visible focus rings; `aria-live` for filter counts and route changes; real `label`s, inline validation with `aria-invalid` and `aria-describedby`, and focus on the first invalid field; double submits are blocked while a form is pending. The canvas, world labels and HUD are `aria-hidden`. If WebGL is unavailable, a static night photo is shown instead.
- Content comes only from `data/*.json` and `frontend/src/content/**` (Russian). Doctor profiles and reviews are labelled as demo data, as in production. All forms are demo forms and send nothing.

## Scripts

```bash
npm install
npm run dev          # http://localhost:5190
npm run build        # tsc + vite build → dist/
npm run preview      # http://localhost:4391
node scripts/shots.mjs [route] [--desk|--mob]   # Playwright pass → _shots/
```
