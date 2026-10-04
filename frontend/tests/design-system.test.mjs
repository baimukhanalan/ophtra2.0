import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Design-system contract tests.
 *
 * These lock the decisions the specification makes about appearance, so a
 * future edit cannot silently reintroduce the old blue identity, drop a token
 * group, or break the reduced-motion guarantee.
 */

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const tokens = read('src/styles/tokens.css');
const components = read('src/styles/components.css');
const motion = read('src/styles/motion.css');

test('palette is green and white — no blue brand values survive', () => {
  // The previous product's blue identity, which the brief required removing.
  const forbidden = ['#1D4ED8', '#1d4ed8', '#7C8EE0', '#7c8ee0', '#EEF2FE', '#eef2fe', '#0E1F44', '#0e1f44'];
  const styleFiles = readdirSync(resolve(root, 'src/styles'), { recursive: true })
    .filter((file) => String(file).endsWith('.css'))
    .map((file) => read(`src/styles/${file}`));

  for (const file of [...styleFiles, read('src/index.css')]) {
    for (const value of forbidden) {
      assert.ok(!file.includes(value), `Legacy blue ${value} must not appear in the stylesheet`);
    }
  }
});

test('brand ramp is a full green scale', () => {
  for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]) {
    assert.match(tokens, new RegExp(`--oph-brand-${step}:`), `missing --oph-brand-${step}`);
  }
  // Figma palette: forest primary, sand secondary, gold accents on cream paper.
  assert.match(tokens, /--oph-primary: var\(--oph-forest\)/);
  assert.match(tokens, /--oph-secondary: var\(--oph-sand\)/);
  for (const token of ['--oph-forest:', '--oph-cream:', '--oph-paper:', '--oph-sand:', '--oph-gold:']) {
    assert.ok(tokens.includes(token), `missing Figma token ${token}`);
  }
});

test('typography: Manrope text + Source Serif 4 display, served from our own origin', () => {
  assert.match(tokens, /--oph-font-sans: 'Manrope'/);
  assert.match(tokens, /--oph-font-serif: 'Source Serif 4'/);

  const fonts = read('src/styles/fonts.css');
  assert.match(fonts, /font-family: 'Manrope'/);
  // Cyrillic and cyrillic-ext are what render Russian and Kazakh; losing either
  // subset falls the page back to a system font mid-sentence.
  for (const subset of ['latin', 'cyrillic', 'cyrillic-ext']) {
    assert.match(fonts, new RegExp(`/fonts/manrope-${subset}\\.woff2`), `${subset} is missing`);
    assert.ok(
      existsSync(resolve(root, `public/fonts/manrope-${subset}.woff2`)),
      `public/fonts/manrope-${subset}.woff2 is not shipped`,
    );
  }

  // Every face is subset with a unicode-range so a page only fetches the
  // scripts it renders (Google's published subsets for both families).
  const faces = fonts.split('@font-face').slice(1);
  assert.ok(faces.length >= 8, 'expected Manrope + Source Serif 4 subsets');
  for (const face of faces) assert.match(face, /unicode-range:/);

  // A third-party stylesheet on the critical path costs two extra connections
  // before the first glyph can even be requested.
  assert.ok(
    !read('index.html').includes('fonts.googleapis.com'),
    'index.html must not load fonts from Google',
  );
});

test('every design-system group required by the specification has tokens', () => {
  const groups = [
    '--oph-space-',
    '--oph-radius-',
    '--oph-shadow-',
    '--oph-text-',
    '--oph-grid-',
    '--oph-container',
    '--oph-ease-',
    '--oph-duration-',
    '--oph-z-',
  ];
  for (const group of groups) {
    assert.ok(tokens.includes(group), `token group ${group} is missing`);
  }
});

test('component layer covers every element the specification lists', () => {
  const required = [
    '.oph-btn',
    '.oph-input',
    '.oph-card',
    '.oph-badge',
    '.oph-table',
    '.oph-form',
    '.oph-icon-tile',
    '.oph-illustration',
    '.oph-state', // empty / loading / success / error states
    '.oph-skeleton',
    '.oph-checkmark', // success state
    '.oph-alert',
    '.oph-modal',
    '.oph-drawer',
    '.oph-dropdown',
    '.oph-toast',
    '.oph-accordion',
    '.oph-stepper',
    '.oph-progress',
  ];
  for (const selector of required) {
    assert.ok(components.includes(selector), `${selector} is missing from the component layer`);
  }
});

test('motion layer implements the required interaction set', () => {
  const required = [
    '[data-oph-reveal]', // fade in / lazy reveal
    'oph-split-word', // image + text reveal
    '[data-oph-parallax]',
    '.oph-image-reveal',
    '.oph-scene', // sticky scroll storytelling
    '.oph-hscroll', // scroll-bound horizontal panels
    '.oph-scroll-progress',
    '.oph-marquee',
    '[data-oph-magnetic]',
    '.oph-float',
    '.oph-cursor', // premium cursor interaction
    '.oph-page-enter', // page transition
    '.oph-counter',
    '.oph-timeline',
  ];
  for (const selector of required) {
    assert.ok(motion.includes(selector), `${selector} is missing from the motion layer`);
  }
});

test('cards do not carry a 3D pointer tilt', () => {
  // Removed deliberately: the tilt made cards wobble under the pointer and cost
  // a listener plus four custom-property writes per card per mouse move.
  assert.ok(!motion.includes('data-oph-tilt'), 'the tilt effect must stay removed');
  assert.ok(
    !readFileSync(resolve(root, 'src/ui/Card.tsx'), 'utf8').includes('tilt'),
    'Card must not expose a tilt prop',
  );
});

test('every animation is driven by the motion scale so it can be disabled', () => {
  assert.match(tokens, /--oph-motion-scale: 1/);
  assert.match(tokens, /data-reduced-motion='true'\]\s*\{\s*--oph-motion-scale: 0/);
  assert.match(tokens, /@media \(prefers-reduced-motion: reduce\)/);
});

test('accessibility modes are defined for large fonts and high contrast', () => {
  assert.match(tokens, /data-font-scale='lg'/);
  assert.match(tokens, /data-font-scale='xl'/);
  assert.match(tokens, /data-contrast='high'/);
  assert.ok(read('src/styles/base.css').includes('.oph-skip-link'), 'skip link is required');
  assert.ok(
    read('src/styles/base.css').includes(':focus-visible'),
    'visible focus styling is required',
  );
});
