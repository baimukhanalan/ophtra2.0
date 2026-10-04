/**
 * Build-time SEO & AI-readiness generator.
 *
 * Writes into public/ from the same route table and dataset the app renders,
 * so a static deployment (no API) still ships complete, accurate documents:
 *
 *   sitemap.xml  — every public route with ru/kk/en/x-default hreflang
 *   robots.txt   — search engines AND AI answer engines explicitly allowed
 *   llms.txt     — plain-language site summary for ChatGPT, Gemini,
 *                  Perplexity, Claude and Google AI Overviews (llmstxt.org)
 *   google*.html — Search Console file verification, when configured
 *
 * It also checks that the inline <script> hashes allowed by the
 * Content-Security-Policy in ../vercel.json still match index.html, and warns
 * loudly if someone edits an inline script without updating the policy.
 *
 * When the API is deployed it serves the same documents dynamically from live
 * content — see backend/src/modules/seo.ts.
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dataDir = resolve(root, '../data');
const publicDir = resolve(root, 'public');
const contentPagesDir = resolve(root, 'src/content/pages');

const SITE_URL = (process.env.VITE_SITE_URL || 'https://ophtra2.vercel.app').replace(/\/$/, '');

/** [path, priority, changefreq] — mirrors src/app/navigation.ts ROUTES. */
const STATIC_PATHS = [
  ['/', 1.0, 'weekly'],
  // Centre & people
  ['/about', 0.8, 'monthly'],
  ['/dr-kulmaganbetov', 0.9, 'monthly'],
  ['/management', 0.6, 'monthly'],
  ['/doctors', 0.9, 'weekly'],
  ['/global-experts', 0.7, 'monthly'],
  ['/departments', 0.8, 'monthly'],
  ['/partnerships', 0.6, 'monthly'],
  ['/vacancies', 0.5, 'weekly'],
  // Services
  ['/services', 0.9, 'monthly'],
  ['/diagnostics', 0.9, 'monthly'],
  ['/treatment', 0.9, 'monthly'],
  ['/laser-vision-correction', 0.9, 'monthly'],
  ['/cataract-surgery', 0.9, 'monthly'],
  ['/pediatric-ophthalmology', 0.9, 'monthly'],
  ['/optical-store', 0.7, 'monthly'],
  ['/medical-programs', 0.8, 'monthly'],
  // Patients
  ['/international-patients', 0.9, 'monthly'],
  ['/second-opinion', 0.9, 'monthly'],
  ['/online-consultation', 0.9, 'monthly'],
  ['/appointment', 1.0, 'monthly'],
  ['/pricing', 0.9, 'weekly'],
  ['/promotions', 0.7, 'weekly'],
  ['/faq', 0.7, 'monthly'],
  ['/reviews', 0.7, 'weekly'],
  // Science & media
  ['/science', 0.8, 'monthly'],
  ['/academy', 0.7, 'monthly'],
  ['/knowledge-base', 0.9, 'weekly'],
  ['/media-center', 0.7, 'weekly'],
  ['/news', 0.7, 'daily'],
  ['/contacts', 0.8, 'monthly'],
  // Legal
  ['/privacy-policy', 0.3, 'yearly'],
  ['/terms-of-use', 0.3, 'yearly'],
];

const HREFLANGS = ['ru-RU', 'kk-KZ', 'en-US', 'x-default'];

/** AI answer engines and their crawlers — allowed explicitly (spec §15). */
const AI_CRAWLERS = [
  'GPTBot', // OpenAI training / ChatGPT
  'OAI-SearchBot', // ChatGPT search
  'ChatGPT-User', // ChatGPT browsing on a user's request
  'Google-Extended', // Gemini / Vertex AI grounding
  'GoogleOther',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'anthropic-ai',
  'Applebot-Extended',
  'Bingbot', // Copilot answers
  'DuckAssistBot',
  'Meta-ExternalAgent',
  'Amazonbot',
  'cohere-ai',
  'YouBot',
  'CCBot',
];

const PRIVATE_PATHS = ['/account', '/admin', '/api/'];

/* ---------------------------------------------------------------- helpers */

const readJson = (file) => JSON.parse(readFileSync(resolve(dataDir, file), 'utf8'));

const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (char) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char],
  );

const urlEntry = (loc, priority, changefreq, lastmod) => {
  // Russian is the default at the canonical URL; Kazakh and English are
  // addressable with ?lang= (the i18n provider honours it on first load).
  const alternates = HREFLANGS.map((lang) => {
    const code = lang.slice(0, 2).toLowerCase();
    const href = code === 'kk' || code === 'en' ? `${loc}?lang=${code}` : loc;
    return `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(href)}" />`;
  }).join('\n');

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : null,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    alternates,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
};

/**
 * Knowledge-base articles defined in code (src/content/pages/knowledge-articles-*.ts).
 * They are TypeScript, so the slug and date are read with a pattern rather
 * than imported; a record's `slug:` is always followed by its `date:`.
 */
const codeArticles = () => {
  if (!existsSync(contentPagesDir)) return [];
  return readdirSync(contentPagesDir)
    .filter((file) => /^knowledge-articles-.*\.ts$/.test(file))
    .flatMap((file) => {
      const source = readFileSync(resolve(contentPagesDir, file), 'utf8');
      const found = [];
      const pattern = /\n {4}slug: '([a-z0-9-]+)',[\s\S]*?\n {4}date: '(\d{4}-\d{2}-\d{2})'[\s\S]*?\n {4}title: \{[\s\S]*?\n {6}en: '((?:[^'\\]|\\.)*)'/g;
      let match;
      while ((match = pattern.exec(source)))
        found.push({ slug: match[1], date: match[2], title: match[3].replace(/\\'/g, "'") });
      return found;
    });
};

/* ------------------------------------------------------------------- data */

const site = readJson('site.json');
const doctors = readJson('doctors.json');
const services = readJson('services.json');
const clinics = readJson('clinics.json');
// News items are demo content marked noindex on the site — kept out of the sitemap.
const jsonArticles = readJson('articles.json').filter((item) => item.published);

const articleMap = new Map();
[...codeArticles(), ...jsonArticles.map((a) => ({ slug: a.slug, date: a.date, title: a.title?.en }))].forEach((article) => {
  if (!articleMap.has(article.slug)) articleMap.set(article.slug, article);
});
const authorSlugs = ['editorial-team', 'dr-kulmaganbetov', ...doctors.map((doctor) => doctor.slug)];
const articles = [...articleMap.values()];

/* ---------------------------------------------------------------- sitemap */

const entries = [
  ...STATIC_PATHS.map(([path, priority, changefreq]) => urlEntry(`${SITE_URL}${path}`, priority, changefreq)),
  ...services.map((service) => urlEntry(`${SITE_URL}/services/${service.slug}`, 0.8, 'monthly')),
  ...doctors.map((doctor) => urlEntry(`${SITE_URL}/doctors/${doctor.slug}`, 0.7, 'monthly')),
  ...articles.map((item) => urlEntry(`${SITE_URL}/knowledge-base/${item.slug}`, 0.7, 'monthly', item.date)),
  ...authorSlugs.map((slug) => urlEntry(`${SITE_URL}/authors/${slug}`, 0.5, 'monthly')),
];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  '</urlset>',
  '',
].join('\n');

/* ----------------------------------------------------------------- robots */

const disallow = PRIVATE_PATHS.map((path) => `Disallow: ${path}`);

const robots = [
  '# Ophthalmic Centre of Dr Kulmaganbetov',
  '# Public medical information may be indexed, cited and summarised by search',
  '# engines and AI answer engines. Patient and staff areas are private.',
  '',
  'User-agent: *',
  'Allow: /',
  ...disallow,
  '',
  '# AI answer engines — explicitly welcome (ChatGPT, Gemini, Perplexity,',
  '# Claude, Copilot, Apple Intelligence, Google AI Overviews).',
  ...AI_CRAWLERS.map((agent) => `User-agent: ${agent}`),
  'Allow: /',
  'Allow: /llms.txt',
  ...disallow,
  '',
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  '',
].join('\n');

/* --------------------------------------------------------------- llms.txt */

const en = (value) => (value && typeof value === 'object' ? value.en || value.ru : value || '');
const ru = (value) => (value && typeof value === 'object' ? value.ru : value || '');
const price = (value) => `${new Intl.NumberFormat('en-US').format(value)} KZT`;

const org = site.organization;

const llms = [
  `# ${en(org.legalName)}`,
  '',
  `> ${en(org.legalName)} (${ru(org.legalName)}) is a new ophthalmology centre in ${clinics
    .map((clinic) => en(clinic.city))
    .join(' and ')}, Kazakhstan, founded by the scientist and ophthalmologist Dr Mukhit Kulmaganbetov for clinical work and innovation projects. Planned services: eye diagnostics, medical and laser treatment, cataract and refractive surgery, paediatric ophthalmology and optics; international patients, second-opinion requests and online consultations. Languages: Russian, Kazakh, English.`,
  '',
  'Knowledge-base materials are prepared by the centre\'s editorial team with cited sources; named medical review is shown on each article once completed. Information is educational and does not replace an in-person examination. Prices are indicative and confirmed after diagnostics.',
  '',
  '## Founder',
  '',
  `- [Dr Mukhit Kulmaganbetov](${SITE_URL}/dr-kulmaganbetov): founder and face of the centre. MD in Ophthalmology, PhD in Vision Sciences (Cardiff University), AFHEA. Lecturer and methodologist, Department of Postgraduate Education, Kazakh Research Institute of Eye Diseases. Developed a patented quantum-optics device for early detection of age-related macular degeneration, tested in clinics in Hong Kong and Canada on 200 patients (24.kz, https://24.kz/ru/news/in-the-world/788733-razrabotka-kazakhstantsa-dlya-vyyavleniya-boleznej-glaz-prokhodit-ispytaniya-v-gonkonge); developing a quantum-optics technology for myopia (animal-study stage).`,
  '- Selected publications (2026): "Evaluating the reliability of structured light entoptic tasks", Scientific Reports (https://www.nature.com/articles/s41598-026-63276-7); "The Machine Learning Classification of Retinal Ganglion Cell Dendritic Texture in a 3xTg-Alzheimer\'s Disease Mouse Model", Diagnostics (https://www.mdpi.com/2075-4418/16/16/2672); "Impact of Chronic Kidney Disease Severity on COVID-19 Outcomes: A Retrospective Cohort Study", Healthcare (https://www.mdpi.com/2227-9032/14/16/2575).',
  '',
  '## Key pages',
  '',
  `- [About the centre](${SITE_URL}/about): mission, values, equipment, the Astana centre`,
  `- [Doctors](${SITE_URL}/doctors): the medical team (profiles currently demo placeholders)`,
  `- [Services](${SITE_URL}/services): every diagnostic, treatment and surgical service with prices`,
  `- [Pricing](${SITE_URL}/pricing): full price list in tenge (KZT)`,
  `- [International patients](${SITE_URL}/international-patients): travel, cost, duration and follow-up for patients from abroad`,
  `- [Second opinion](${SITE_URL}/second-opinion): remote review of existing diagnoses and imaging (OCT, fields, reports)`,
  `- [Online consultation](${SITE_URL}/online-consultation): video consultation with an ophthalmologist`,
  `- [Online booking](${SITE_URL}/appointment): book an appointment by clinic, department, service, doctor and time`,
  `- [Knowledge base](${SITE_URL}/knowledge-base): editorial articles on eye health with sources`,
  `- [Science](${SITE_URL}/science): research, publications and collaborations`,
  `- [Academy](${SITE_URL}/academy): education for ophthalmologists`,
  `- [Global experts](${SITE_URL}/global-experts): how the international expert network is being built`,
  `- [FAQ](${SITE_URL}/faq): common patient questions`,
  `- [Contacts](${SITE_URL}/contacts): addresses, opening hours, phone and WhatsApp`,
  '',
  '## Services',
  '',
  ...services.map(
    (service) =>
      `- [${en(service.name)}](${SITE_URL}/services/${service.slug}): from ${price(service.price)}${
        service.duration ? `, about ${service.duration} min` : ''
      }`,
  ),
  '',
  '## Knowledge base articles',
  '',
  ...articles.map((article) => `- [${article.title || article.slug}](${SITE_URL}/knowledge-base/${article.slug})`),
  '',
  '## Contact',
  '',
  `- Address, opening hours and phone: see ${SITE_URL}/contacts (the centre in Astana is opening; contact details on the site are being finalised).`,
  '',
  '## Optional',
  '',
  `- [Sitemap](${SITE_URL}/sitemap.xml)`,
  `- [Privacy policy](${SITE_URL}/privacy-policy): GDPR-aligned processing of personal and health data`,
  `- [Terms of use](${SITE_URL}/terms-of-use)`,
  '',
].join('\n');

/* ---------------------------------------------------------- write outputs */

mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf8');
writeFileSync(resolve(publicDir, 'llms.txt'), llms, 'utf8');

// Search Console HTML-file verification (VITE_GSC_VERIFICATION=google123abc.html).
const gsc = (process.env.VITE_GSC_VERIFICATION || '').trim();
if (/^google[a-z0-9]+\.html$/i.test(gsc)) {
  writeFileSync(resolve(publicDir, gsc), `google-site-verification: ${gsc}\n`, 'utf8');
  console.log(`[seo] ${gsc} written (Search Console)`);
}

console.log(`[seo] sitemap.xml — ${entries.length} URLs`);
console.log(`[seo] robots.txt — ${AI_CRAWLERS.length} AI crawlers allowed`);
console.log('[seo] llms.txt written');

/* ------------------------------------------------------- CSP hash check */

try {
  const html = readFileSync(resolve(root, 'index.html'), 'utf8');
  const vercel = readFileSync(resolve(root, '../vercel.json'), 'utf8');
  const inline = [...html.matchAll(/<script(?![^>]*\b(?:src\b|type="application\/ld\+json"))[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .filter((body) => body.trim());
  const missing = inline
    .map((body) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`)
    .filter((hash) => !vercel.includes(hash));
  if (missing.length) {
    console.warn(
      `\n[seo] WARNING: ${missing.length} inline script(s) in index.html are not allowed by the CSP in vercel.json.\n` +
        `      Add to script-src: ${missing.join(' ')}\n`,
    );
  } else {
    console.log(`[seo] CSP — ${inline.length} inline script hash(es) match vercel.json`);
  }
} catch (error) {
  console.warn('[seo] CSP check skipped:', error.message);
}
