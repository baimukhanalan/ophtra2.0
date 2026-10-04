# Classic: one-page site built from TZ.txt and verified clinic facts

The structure and wording come from `docs/TZ.txt`. The clinic facts come only from the verified sources listed below. There are no images, animations, web fonts or libraries. Open `index.html` directly, or serve the folder (`python3 -m http.server 4400`).

## Files
- `index.html` holds the Russian base text, semantic structure (h1 → h2 → h3) and JSON-LD `MedicalOrganization`.
- `styles.css` is one small stylesheet, mobile first, with one accent colour.
- `app.js` handles the KK/RU/EN switch, the knowledge-base search, and form validation.

## Changing the doctor or centre name
See «Verified clinic content» below. The names live in `BRAND` / `CENTER` / `DOCTOR` at the top of `app.js`, and there is one value per language.

## Decisions to know
- **Placeholders.** Sections where the TZ gives only a heading show the heading plus the TZ's own description line and a marked note, e.g. «Содержание раздела будет добавлено» or «Контактные данные будут добавлены». Nothing is invented. «Почему доктор Кулмаганбетов?» shows its three items, each with one line of verified facts: the TZ line «В этом разделе формируется доверие пациента» is an instruction to developers, not page copy.
- **Knowledge-base descriptions.** Where a description was identical to the category title (cataract, retina, prevention), it was dropped.
- **Forms.** Fields are: name, contact, country, service, diagnosis, plus a consent checkbox (GDPR, TZ §17) and a honeypot. The online-consultation form adds a platform choice (Zoom / Google Meet / Microsoft Teams). The second-opinion form adds a file upload: PDF/JPG/PNG only, checked by both extension and MIME type. On submit the page says that sending to the CRM is not connected. No data leaves the browser.
- **File size limit.** `MAX_FILE_MB = 10` in `app.js` is an assumption, because the TZ sets no size. Adjust it as needed.
- **Omitted.** There is no FAQ schema or FAQ block, because the TZ has no real Q&A.
- **Language choice** is remembered in `localStorage` when it is available.

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
