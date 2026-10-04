import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Specification conformance tests.
 *
 * One test per mandatory section of the brief, asserted against the source
 * rather than a screenshot, so a regression fails the build instead of being
 * noticed months later.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repo = resolve(root, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const readRepo = (path) => readFileSync(resolve(repo, path), 'utf8');

const routes = read('src/app/navigation.ts');
const routeTable = read('src/app/routes.tsx');

/* ------------------------------------------------------------------ PAGES */

const REQUIRED_PAGES = [
  ['Home', '/'],
  ['About Clinic', '/about'],
  ['Management', '/management'],
  ['Doctors', '/doctors'],
  ['Departments', '/departments'],
  ['Diagnostics', '/diagnostics'],
  ['Eye Disease Treatment', '/treatment'],
  ['Laser Vision Correction', '/laser-vision-correction'],
  ['Cataract Surgery', '/cataract-surgery'],
  ['Pediatric Ophthalmology', '/pediatric-ophthalmology'],
  ['Optical Store', '/optical-store'],
  ['Medical Programs', '/medical-programs'],
  ['Pricing', '/pricing'],
  ['Promotions', '/promotions'],
  ['News', '/news'],
  ['Articles', '/articles'],
  ['FAQ', '/faq'],
  ['Patient Reviews', '/reviews'],
  ['Online Appointment', '/appointment'],
  ['Contacts', '/contacts'],
  ['Vacancies', '/vacancies'],
  ['Privacy Policy', '/privacy-policy'],
  ['Terms of Use', '/terms-of-use'],
];

test('all 23 specified pages exist and are routed', () => {
  assert.equal(REQUIRED_PAGES.length, 23);
  for (const [name, path] of REQUIRED_PAGES) {
    assert.ok(routes.includes(`'${path}'`), `${name} (${path}) missing from the route map`);
    assert.ok(routeTable.includes(`ROUTES.`), 'routes.tsx must build paths from the route map');
  }
});

test('every routed page component file exists', () => {
  const pages = [...routeTable.matchAll(/import\('@\/pages\/([A-Za-z]+)'\)/g)].map((m) => m[1]);
  assert.ok(pages.length >= 23, `expected at least 23 lazy pages, found ${pages.length}`);
  for (const page of pages) {
    assert.ok(existsSync(resolve(root, `src/pages/${page}.tsx`)), `src/pages/${page}.tsx missing`);
  }
});

/* -------------------------------------------------------------- LANGUAGES */

test('three languages are implemented with identical key structures', async () => {
  const flatten = (value, prefix = '') =>
    typeof value === 'object' && value !== null
      ? Object.entries(value).flatMap(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key))
      : [prefix];

  const parse = (file) => {
    const source = read(`src/i18n/${file}`);
    // Start at the object literal of the `export const … = {` declaration so
    // the `import type { … }` line above it is not mistaken for the body.
    const start = source.indexOf('{', source.indexOf('export const'));
    const body = source.slice(start, source.lastIndexOf('};') + 1);
    // The dictionaries are plain object literals, so evaluating the literal is
    // enough to compare their shapes without a bundler in the loop.
    return new Function(`return ${body.replace(/;$/, '')}`)();
  };

  const ru = flatten(parse('dictionary.ru.ts')).sort();
  const kk = flatten(parse('dictionary.kk.ts')).sort();
  const en = flatten(parse('dictionary.en.ts')).sort();

  assert.ok(ru.length > 150, `expected a substantial dictionary, got ${ru.length} keys`);
  assert.deepEqual(kk, ru, 'Kazakh dictionary structure differs from Russian');
  assert.deepEqual(en, ru, 'English dictionary structure differs from Russian');
});

test('content dataset is trilingual for every record', () => {
  const files = ['clinics', 'departments', 'services', 'doctors', 'news', 'articles', 'faq', 'reviews', 'vacancies', 'promotions'];
  for (const file of files) {
    const records = JSON.parse(readRepo(`data/${file}.json`));
    // reviews.json is intentionally empty until real, consented patient stories exist.
    if (file !== 'reviews') assert.ok(records.length > 0, `data/${file}.json is empty`);

    for (const record of records) {
      for (const [key, value] of Object.entries(record)) {
        if (value && typeof value === 'object' && !Array.isArray(value) && 'ru' in value) {
          assert.ok(value.kk, `${file}.${record.id}.${key} missing Kazakh`);
          assert.ok(value.en, `${file}.${record.id}.${key} missing English`);
        }
      }
    }
  }
});

/* -------------------------------------------------------------- FEATURES */

test('online booking offers the three visit types the specification names', () => {
  const wizard = read('src/features/booking/BookingWizard.tsx');
  for (const type of ['consultation', 'diagnostics', 'surgery']) {
    assert.ok(wizard.includes(`'${type}'`), `visit type "${type}" missing`);
  }
  assert.ok(wizard.includes('wa.me'), 'continue-in-WhatsApp handover missing');
});

test('the main centre is in Astana, as the specification states', () => {
  const clinics = JSON.parse(readRepo('data/clinics.json'));
  assert.equal(clinics[0].id, 'astana', 'Astana must be the primary clinic');
  assert.equal(clinics[0].isSurgical, true, 'the main centre performs surgery');
  assert.match(clinics[0].city.ru, /Астана/);
});

test('online booking implements every required step', () => {
  const wizard = read('src/features/booking/BookingWizard.tsx');
  for (const step of ['type', 'clinic', 'department', 'service', 'doctor', 'date', 'confirm']) {
    assert.ok(wizard.includes(`'${step}'`), `booking step "${step}" missing`);
  }
  assert.ok(wizard.includes('duplicate'), 'duplicate booking handling missing');
  assert.ok(wizard.includes('notificationsText'), 'automatic notification messaging missing');
});

test('assistant implements every specified ability', () => {
  const types = readRepo('shared/assistant/types.ts');
  const engine = readRepo('shared/assistant/engine.ts');

  for (const intent of [
    'faq',
    'service_consultation',
    'service_recommendation',
    'doctor_recommendation',
    'symptom_collection',
    'appointment_booking',
    'appointment_cancellation',
    'appointment_rescheduling',
    'notifications',
    'operator_handoff',
  ]) {
    assert.ok(types.includes(intent), `assistant intent "${intent}" missing`);
  }

  assert.ok(engine.includes('analyseDialogue'), 'dialogue analysis missing');
  assert.ok(engine.includes('isKnowledgeGap'), 'knowledge-base learning loop missing');
  assert.ok(types.includes('VoiceChannel'), 'voice AI architecture preparation missing');
});

test('patient account covers appointments, records, invoices and payments', () => {
  const account = read('src/pages/AccountPage.tsx');
  for (const tab of ['appointments', 'history', 'recommendations', 'prescriptions', 'results', 'invoices']) {
    assert.ok(account.includes(`'${tab}'`), `account section "${tab}" missing`);
  }
  assert.ok(account.includes('repeat'), 'repeat appointment missing');
  assert.ok(account.includes('refund'), 'refund missing');
  assert.ok(account.includes('receipt'), 'electronic receipt missing');
});

test('admin panel exposes the eight specified capabilities', () => {
  const admin = read('src/pages/AdminPage.tsx');
  for (const section of ['pages', 'doctors', 'news', 'promotions', 'prices', 'photos', 'seo', 'requests']) {
    assert.ok(admin.includes(`'${section}'`), `admin section "${section}" missing`);
  }
});

/* ------------------------------------------------------- SEO & ANALYTICS */

test('SEO covers schema.org, Open Graph, sitemap, robots and meta automation', () => {
  const seo = read('src/seo/Seo.tsx');
  for (const feature of [
    'breadcrumbSchema',
    'faqSchema',
    'physicianSchema',
    'medicalProcedureSchema',
    'articleSchema',
    'reviewSchema',
    'jobPostingSchema',
    'og:title',
    'twitter:card',
    'canonical',
    'hreflang',
    'autoDescription',
  ]) {
    assert.ok(seo.includes(feature), `SEO feature "${feature}" missing`);
  }
  assert.ok(existsSync(resolve(root, 'scripts/generate-seo.mjs')), 'sitemap generator missing');
});

test('analytics wires every required platform plus funnels and experiments', () => {
  const analytics = read('src/services/analytics.ts');
  for (const feature of [
    'ga4',
    'gtm',
    'yandex',
    'metaPixel',
    'tiktokPixel',
    'callTracking',
    'captureAttribution',
    'getVariant', // A/B testing
    'addSegment', // segmentation / remarketing
    'trackConversion',
    'FunnelStep',
  ]) {
    assert.ok(analytics.includes(feature), `analytics feature "${feature}" missing`);
  }
});

test('no vendor tag loads before analytics consent is granted', () => {
  const analytics = read('src/services/analytics.ts');
  assert.ok(
    analytics.includes('if (vendorsLoaded || typeof window === \'undefined\' || !hasAnalyticsConsent()) return;'),
    'loadVendorTags must be gated on consent',
  );
});
