# Classic 2: a compact one-page site (TZ structure plus verified clinic facts)

This is variant 5, based on `concepts/classic/`. The content is the same as `classic/`. `index.html` and `app.js` are identical to it except for the Google Fonts `<link>`. The layout and visual language are new, and the page is much shorter.

Live: https://ophtra-classic-2.vercel.app (Vercel project `ophtra-classic-2`).
Local: `python3 -m http.server 4410` in this folder.

## Files
- `index.html` holds the Russian base text, 18 numbered sections and JSON-LD `MedicalOrganization`.
- `styles.css` is mobile first, with no animations, transitions or scroll effects.
- `app.js` handles the KK/RU/EN switch, the knowledge search, the shared application form and validation. `BRAND` / `CENTER` / `DOCTOR` / `THREADS_URL` and `MAX_FILE_MB` are at the top of the file.

## Design
- **Fonts:** Unbounded 600/700 for headings and Golos Text for body text, both from Google Fonts with Cyrillic.
- **Colours:** white `#ffffff` and mist `#f1f5f8` backgrounds, ink `#0f2a44` for text and the primary colour, hairlines `#dbe4ec`.
- **Sky accent:** `#2f7fd1` is used only for decoration: rules, markers and the focus ring. It has 4.1:1 contrast on white, which is not enough for text. Sky-coloured text (section numbers, links, eyebrow) uses the darker `#2670b8`, which has 5.1:1 on white and 4.7:1 on mist.
- **Geometry:** 6px radius, 1px rules between sections, and numbered section labels (01–18). On desktop (≥1024px) the header is sticky.

## How the page stays short
- **Section order** follows TZ §4: Hero → Почему → Миссия → Центры → Сеть экспертов → Истории пациентов → База знаний, then the rest.
- **Two columns on desktop:** the heading and intro sit on the left and the content on the right.
- **Shared rows:** small sections sit side by side in pairs or threes (Why + Mission, Experts + Stories, About + Doctor, Services + Science, Academy + Media + Partnerships). Each is still its own `<section>` with its own id and anchor.
- **Compact lists:** lists are chips, the knowledge base is a 4-column grid, and the treatment path and consultation steps are horizontal numbered rows (vertical on phones).
- **One application form:** it replaces the four separate forms of the reference. The required «Тип обращения» field offers консультация / международный пациент / второе мнение / онлайн-консультация.
  - The file upload (PDF/JPG/PNG, checked by extension and MIME type, ≤ `MAX_FILE_MB`) appears only for «второе мнение».
  - The platform choice (Zoom / Google Meet / Microsoft Teams) appears only for «онлайн-консультация».
  - Fields are plain show/hide. Hidden fields are also disabled, so validation skips them.
  - The submit label follows the type.
- **CTAs and in-section links:** the hero CTAs and the links inside sections pre-select the type, jump to `#apply` and move focus to the type select.
- **Honeypot and CRM message:** the honeypot is kept. The success message says honestly that sending to the CRM is not connected.

New UI strings (not facts) have KK/RU/EN translations: «Тип обращения» and its four options, «Интеграции» (the TZ §12 heading for Zoom/Meet/Teams), and a one-line form hint.

## Page heights (RU, full page)
| Width | Height |
|---|---|
| 360 | 7617 px |
| 390 | 7392 px |
| 768 | 5313 px |
| 1440 | 3970 px |

## Verified clinic content (2026-09-29)
The generic placeholder name from the TZ is replaced by the real clinic. The only sources are the 24.kz article, the eyeinst.kz profile, the doctor's Threads account and the three 2026 papers. Nothing else is claimed.
- **Names** are set per language at the top of `app.js`: `BRAND` (short, e.g. «доктор Кулмаганбетов» / «доктор Кұлмағанбетов» / «Dr Kulmaganbetov»), `CENTER` («Офтальмологический центр доктора Кулмаганбетова» / «Доктор Кұлмағанбетов офтальмологиялық орталығы» / «Ophthalmic Centre of Dr Kulmaganbetov»), `DOCTOR` (full name) and `THREADS_URL`. In the markup they appear as `<span data-name="brand|Brand|center|doctor">`, where `Brand` is the capitalised form used in the menu. `index.html` keeps the Russian names as the no-JS fallback.
- **JSON-LD** `MedicalOrganization` has the name, `address.addressLocality` Astana, `founder` (a `Physician` with the doctor's name) and `sameAs` (Threads). It is rebuilt in the current language.
- **Filled with facts:**
  - The hero eyebrow shows the centre name.
  - The three «Почему…» cards.
  - «Сеть глобальных экспертов»: interest from specialists in the USA, Europe, China, Canada and Japan, and the Hong Kong / Canada trials.
  - «О центре»: a new centre in Astana for clinical work and innovation projects.
  - The doctor section now has blocks for Научный путь, Глобальный опыт, Направление исследований, Видение для Казахстана, Публикации, and Медиа и выступления.
  - «Наука и инновации»: the two research projects and the three publications.
  - «Контакты»: the city Astana and the Threads link.
- **Still marked «будет добавлено»:** Награды, Конференции, patient stories, academy, partnerships, the international coordinator and cost. In Контакты a note says that the address, phone and e-mail will be added. No metrics, reviews, prices, other doctors, addresses or phones were added.
- **Links:** external links open in a new tab with `rel="noopener"` and a visually hidden «(откроется в новой вкладке)» note, which is translated. Paper titles stay in English (`lang="en"`) in every language.
- **CSS:** one small block at the end of `styles.css` adds `.bio`, `.pubs`, `.contact-line`, `.sr-only` and `.logo { min-width: 0 }`. It uses this variant's own variables.
- **Checked** with Playwright (Chrome) at 390 and 1440 in RU/KK/EN: no console errors, no horizontal overflow, no Cyrillic in EN, and search and forms work.

## Screenshots
`_shots/` holds RU pages at 360/390/768/1440, plus `390-kk.png` and `1440-en.png`.
