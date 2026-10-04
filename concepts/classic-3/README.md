# Classic 3 (variant 6): editorial one-page site (TZ structure plus verified clinic facts)

Live: https://ophtra-classic-3.vercel.app

This is a redesign of `concepts/classic/`. The content and functions are the same as `classic/`. `index.html` and `app.js` are identical to it except for the Google Fonts `<link>`. It is the longest and most editorial variant, at about 11 900 px tall at 1440 px wide. There are no images, no animations or transitions, and no scroll effects. Open `index.html` directly, or serve the folder (`python3 -m http.server 4420`).

## Look
- **Fonts** (Google Fonts, Cyrillic): headings use Playfair Display 600, with italic accents on key words in the hero, mission and statements. Body text uses Inter.
- **Palette**: ivory `#fbf8f3` and blush sand `#f3ebe2` backgrounds, plum `#3b2140` for headings and primary buttons, and sage `#dfe6dc` for alternating cards. Hairlines are `#e7dccf`.
  - Terracotta `#b5543c` is used only for large numerals, accents and borders.
  - Small accent text uses `#974029` so it passes AA on every background.
  - Form borders are `#95806e`, which gives 3:1 against white.
- **Shapes**: 22px radius, pill tags and serif numerals.
- **Sticky table of contents** at 1200 px and wider. It has no scroll-spy.

## Structure
1. **Editorial hero**: an oversized serif headline, plus a side panel titled «Что мне делать?» (TZ 6.3) that shows the three CTAs as large numbered links. Each CTA has a TZ-derived line under it.
2. **«Основные задачи сайта»** (TZ 6.1): a statement block with «Человек сначала доверяет. И только потом принимает решение.»
3. Why, then the mission as a large centred italic quote band, then the centres of excellence as large numbered cards.
4. Experts, patient stories and the knowledge base, with search.
5. About, including the **«Главная идея сайта»** (TZ 6.13) statement.
6. Doctor, services and science, then the process sections:
   - International patients, with the treatment path as a numbered vertical timeline next to the form.
   - Second opinion, with a timeline next to the upload form.
   - Online consultations, with a «Шаг N» timeline, the Zoom / Meet / Teams integrations, and the form.
7. Academy, media centre, partnerships, and contacts with a form.

Each section opens with an intro row: its number, a large serif heading, and the TZ's own goal or description line.

## Code
- `app.js` keeps the reference logic:
  - The per-language `BRAND` / `CENTER` / `DOCTOR` constants and `THREADS_URL` on its first lines.
  - The KK/RU/EN switch. Russian is read from the HTML, and KK and EN are written in `app.js`.
  - The knowledge search.
  - Forms with a honeypot, consent and double-submit guard.
  - The file check for PDF/JPG/PNG, by both extension and MIME type, with `MAX_FILE_MB = 10`. That limit is an assumption, because the TZ gives no size.
  - The honest "CRM not connected" message on submit.
- New translation keys: `toc.label`, `hero.panel`, `cta.*.d`, `goals.*`, `g1`–`g6`, `why.formula`, `idea.*`, `second.intro`, `consult.int`, `step.label`.
- The «будет добавлено» notes are kept wherever there is no verified content.

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
`_shots/` holds RU full pages at 360, 390, 768 and 1440, plus `390-kk.png` and `1440-en.png`.
