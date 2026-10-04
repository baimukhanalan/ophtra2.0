# OPHTRA 2.0 — design contract (Figma → code)

Source design: Figma «Ophtra — дизайн сайта · 2026» (10 desktop frames, 1470px wide).
Source spec: «Платформа клиники» (technical specification, sections 6.1–6.13 and 1–20).
Founder / face of the centre: **Dr Mukhit Kulmaganbetov** (the spec's placeholder name
"Dr Mark Pak" = this doctor; the site brand is "Ophthalmic Centre of Dr Kulmaganbetov").

Everything below is binding for every page. **Do not introduce new colours, fonts,
radii or shadows.** Use tokens only (`frontend/src/styles/tokens.css`).

## 1. Visual language (from Figma)

| Token | Value | Use |
|---|---|---|
| `--oph-forest` | #1b2e28 | page heroes, dark sections, primary buttons, ink |
| `--oph-forest-deep` | #131f1b | footer |
| `--oph-forest-soft` | #243a32 | cards inside dark sections |
| `--oph-cream` | #f4f2ed | page background |
| `--oph-paper` | #f9f8f5 | cards, fields, panels |
| `--oph-sand` | #e9e7e1 | tinted card / alternate section / «Продолжить знакомство» box |
| `--oph-stone` | #d5d7d1 | media placeholders only |
| `--oph-gold` / `--oph-gold-soft` | #a88b5e / #c9b08a | eyebrows, section numbers, rails, bullets (soft on dark) |
| `--oph-brand-600` | #2d5b45 | text links («Открыть материал», «Записаться →») |
| `--oph-brand-400` | #5b8a71 | muted secondary link on dark («Руководство», «WhatsApp») |
| `--oph-muted` | #6e7671 | secondary text |
| `--oph-line` | #dfdbd2 | hairlines |

* Headings: **Source Serif 4, weight 400**, tight tracking (`var(--oph-font-serif)`); all h1–h6 already serif.
* Body/UI: **Manrope**. Eyebrows: 11px, bold, 0.16em tracking, uppercase, gold (`.oph-eyebrow`).
* Radius: 8–12px (`--oph-radius-sm/md`). Buttons: flat forest, 8px radius. Cards: paper + 1px line + very soft shadow.
* Section rhythm: every content section starts with a gold index «01», «02» … (`<SectionIndex n={1} />`).
* Heroes: full-bleed forest block with breadcrumbs, gold eyebrow, large serif title, lead, text-style actions
  (`<HeroLink>`), illustration/photo/ring motif on the right → use `<PageHero>` for **every** inner page.
* Every page ends with `<CtaBand />` (booking band) followed by the global footer (automatic).

## 2. Figma frames and what they contain

* **02 О центре** — hero «О клинике» (actions «Все врачи →», muted «Руководство»), 4 metric cards
  (17+ лет практики · 9400+ операций в год · 28+ врачей и хирургов · 98 % пациентов рекомендуют),
  home-page excerpts: hero «Зрение, которому *доверяют*» (sans title + italic serif green word, photo right,
  CTAs «Записаться на консультацию» / «Международным пациентам» / «Второе мнение», chips «Диагностика 60 минут»,
  «Микрохирургия»), dark metric band, equipment marquee (ОКТ-томограф, фемтосекундный лазер, факоэмульсификатор,
  компьютерный периметр, кератотопограф, YAG-лазер), dark mission block «Ясная информация помогает человеку принимать
  взвешенные решения о зрении.», split «Доктор Кулмаганбетов» (photo left, «Познакомиться с подходом →»),
  bento «От профилактики до сложного решения — единая карта заботы» (5 cards), dark «Наука и открытый обмен —
  Проверять факты. Объяснять сложное. Слышать разные профессиональные позиции.» with 2 columns.
* **03 Врачи** — hero «Врачи», search field, two filter chip rows (departments, clinics), doctor cards (photo top 3:4,
  serif name, role, pill «СТАЖ 22 ЛЕТ», arrow).
* **04 Профиль врача** — hero with name + role eyebrow + text + «Записаться на приём», portrait card right;
  3 info cards (Стаж / Языки / Клиники with department tags); «Все услуги» service cards (title, text, «от 12 000 ₸»,
  duration, «Записаться →»).
* **05 Услуги** — hero «Направления помощи», bento of service areas with «Открыть материал →».
* **06 Страница услуги — ОКТ** — hero, then article template: sticky «На этой странице» TOC + numbered sections
  (01 Что показывает ОКТ, 02 Когда исследование полезно, 03 Подготовка и результат + ring-bullet list,
  04 Заменяет ли ОКТ консультацию?), «Продолжить знакомство» sand box, «Источники и дополнительное чтение» dark box.
* **07 База знаний** — hero, search + «Тема» select + «Сбросить», count «Материалов: 10», bento of articles
  (gold category, serif title, excerpt, «Открыть материал →»).
* **08 Статья** — same article template as 06.
* **09 Международным пациентам** — hero with clinic photo, article template (До покупки билетов · Стоимость и
  длительность · Поездка: четыре вопроса · После возвращения).
* **10 Онлайн-запись** — hero with calendar illustration, stepper (Тип записи → Клиника → Отделение → Услуга →
  Врач → Дата и время), option cards with icon tiles, «Назад» / «Далее»; 3 tiles «Автоматические уведомления»,
  «WhatsApp», «Политика конфиденциальности».
* **11 Контакты** — hero «Контакты» (phone + WhatsApp actions), «Клиники» two cards (address, hours, phone, e-mail,
  «Как добраться»), «Форма обратной связи» panel.

### Figma errors that MUST be corrected (not copied)
1. Titles broken mid-word («Направле / ния», «Оптичес / кая») and clipped at the baseline — `PageHero` sizes titles
   by length; never force narrow title columns.
2. Missing spaces («консультациюофтальмолога»).
3. Bento grids with grey holes / orphan half-rows — use `<EditorialGrid>` (auto-balanced rows).
4. Doctor cards touching with no gutter; initials pasted over clinic photos — keep a gap; portraits use
   `DoctorPortrait`.
5. Cookie banner covering hero content; floating «Помощник» overlapping cards.
6. Inconsistent headers/footers between frames (two header variants, a stripped footer, stray «ЦЕНТР И ЗНАНИЯ»
   row, visible «Перейти к основному содержанию») — one global header/footer only.
7. Empty card headings in the dark «Наука» block; a home page pasted inside «О центре».
8. Disabled-looking primary buttons (grey «Далее», grey «Принять»).

## 3. Motion — scroll & storytelling on EVERY block (mandatory)

Premium feel = every section has at least one scroll effect. Available (`@/motion`):
* `SplitText` (word rise), `Reveal` (variants up/left/right/scale/blur/fade), `Stagger`
* `ScrollFx` / `useProgressVars` → CSS vars `--p` (0→1 through viewport), `--pin`, `--enter` for custom scroll-linked
  transforms, clip-paths, fills
* `TextFill` — statement paragraph lights up word by word with scroll
* `ClipReveal` — image opens from an inset window + counter-zoom
* `StickyStory` — pinned visual + scrolling chapters (active chapter drives the visual)
* `StackCards` — sticky stacking cards
* `HorizontalScroll`, `Marquee`, `Counter`, `Timeline`, `useParallax`, `ImageReveal`, `RotatingWord`
Rules: compositor-only properties (transform/opacity/clip-path/filter); respect `--oph-motion-scale`
(reduced motion); never animate layout.

## 4. Shared components (`@/components/editorial`, `@/components/PageHero`, `@/components/LeadForm`)
`PageHero`, `HeroLink`, `SectionIndex`, `SectionHead`, `EditorialGrid` + `EditorialCard`, `StatGrid`, `RingMotif`,
`ArticleBody` (+ `ContinueBox`, `SourcesBox`), `StepFlow`, `FeatureTile` (wrap in `.oph-ftiles`), `LeadForm`
(CRM lead with source tag, honeypot, file upload PDF/JPG/PNG, auto-confirmation), `CtaBand`, UI kit in `@/ui`
(`Container`, `Section tone="default|tint|deep"`, `Button`, `ButtonLink`, `Card`, `Badge`, `Input`, `Select`,
`Accordion`, …). CSS helpers: `.oph-duo` (2-col split), `.oph-tag`, `.oph-chips`/`.oph-chip`, `.oph-panel`,
`.oph-mediacard`, `.oph-italic`, `.oph-on-dark`.

## 5. Content & i18n rules
* Three languages (ru / kk / en) for all visible text. New page copy lives in `frontend/src/content/pages/<page>.ts`
  as `Localized` objects (`{ ru, kk, en }`) read with `L()` from `useI18n()`. **Do not edit the shared
  `i18n/dictionary.*.ts` files** (owner: integrator) — reuse existing keys (`t.common.*`, `t.nav.*`) or local copy.
* Real founder material: Scientific Reports 2026 «Evaluating the reliability of structured light entoptic tasks»
  (https://www.nature.com/articles/s41598-026-63276-7); Diagnostics 2026 «The Machine Learning Classification of
  Retinal Ganglion Cell Dendritic Texture in a 3xTg-Alzheimer's Disease Mouse Model»
  (https://www.mdpi.com/2075-4418/16/16/2672); Healthcare 2026 «Impact of Chronic Kidney Disease Severity on
  COVID-19 Outcomes: A Retrospective Cohort Study» (https://www.mdpi.com/2227-9032/14/16/2575); video 24kz
  «Разработка казахстанца для выявления болезней глаз проходит испытания в Гонконге»
  (https://youtu.be/YOJAdl__43Q); Threads https://www.threads.com/@mukhit_kulmaganbetov ; profile: MD in
  Ophthalmology, PhD in Vision Sciences (Cardiff University), AFHEA; interests: ophthalmology, AI, quantum physics.
* Never invent real third-party people or institutions' endorsements. Demo people must be clearly generic
  (the existing doctor dataset is demo data).
* Medical copy: calm, evidence-based, no promises; every medical page ends with the disclaimer tone of the Figma.
* SEO/AI readiness: every page renders `<Seo>` with title/description + breadcrumb JSON-LD; FAQ blocks add FAQPage
  schema; articles add Article schema with author.

## 6. File ownership (parallel work)
Each owner edits only its own pages, `src/content/pages/<own>.ts`, and `src/styles/pages/<own>.css`.
Shared files (`tokens.css`, `shell.css`, `figma-components.css`, `editorial.tsx`, `routes.tsx`, `navigation.ts`,
dictionaries, Header/Footer) belong to the integrator — request changes in your final report instead of editing.

## 7. Verified facts (web check, 2026-09-25) — the ONLY facts about the doctor and the centre
Sources: 24.kz «Разработка казахстанца для выявления болезней глаз проходит испытания в Гонконге»
(https://24.kz/ru/news/in-the-world/788733-razrabotka-kazakhstantsa-dlya-vyyavleniya-boleznej-glaz-prokhodit-ispytaniya-v-gonkonge);
eyeinst.kz profile (https://eyeinst.kz/catalog/kulmaganbetov-muhit-askarovich-2882/); Threads; the three 2026 papers.
* Mukhit Askarovich Kulmaganbetov — scientist and ophthalmologist; MD Ophthalmology, PhD Vision Sciences (Cardiff), AFHEA.
* Kazakh Research Institute of Eye Diseases: lecturer and educational-process manager (methodologist), Department of
  Postgraduate Education; 6 years of professional experience; specialisation — digital technologies in diagnosing eye disease.
* Developed a quantum-optics device for early detection of age-related macular degeneration (polarised / non-polarised light
  in superposition, filters and lenses); tested in clinics in Hong Kong and Canada; 200 patients examined; patent received.
* Developing a quantum-optics technology for diagnosing and treating myopia (animal studies stage).
* His work has drawn interest from specialists in the USA, Europe, China, Canada and Japan (per 24kz).
* Plans to open an ophthalmological centre in Astana for clinical work and innovation projects → the centre is NEW, in Astana.
* NOT supported (must be removed): "17+ years of practice", "9 400 operations a year", "28 doctors", "98 % recommend",
  "founded 2009" and its timeline, a branch in Almaty, any named awards/conferences/partners, any quotes.
* Contact data (address, phone, e-mail, licence number) are placeholders from the original project — keep clearly
  replaceable in data/site.json and data/clinics.json; do not present invented numbers as facts.
