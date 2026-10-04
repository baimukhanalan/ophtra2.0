/**
 * Static prerender for crawlers and AI answer engines (spec §15–16).
 *
 * The site is a client-rendered SPA, so every URL used to return the same
 * empty shell. After `vite build`, this script opens each route listed in
 * public/sitemap.xml in headless Chrome, waits for the page to render, and
 * writes dist/<route>/index.html containing:
 *   - the route's own <title>, meta description, canonical, hreflang,
 *     Open Graph/Twitter tags and JSON-LD (as set by <Seo>)
 *   - the rendered page markup inside #root
 * Everything else (the logo-reveal overlay, CSP-hashed inline scripts,
 * bundles) stays byte-identical to dist/index.html. On boot React renders
 * over #root as before, so behaviour is unchanged for visitors.
 *
 * Usage: node scripts/prerender.mjs [dist-dir]
 * Requires Playwright (resolved from ../e2e) and a local Google Chrome.
 */

import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(process.argv[2] ?? resolve(root, 'dist'));
const require = createRequire(resolve(root, '../e2e/package.json'));
const { chromium } = require('@playwright/test');

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const origin = (sitemap.match(/<loc>(https?:\/\/[^/<]+)/) ?? [])[1];
const routes = [...new Set([...sitemap.matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map((m) => m[1] || '/'))];

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

// Serve the pristine build with SPA fallback to the ORIGINAL template, so
// already-written prerendered files never feed back into later captures.
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(dist, path);
  if (path !== '/' && existsSync(file) && extname(file) && !file.endsWith('index.html')) {
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
    return;
  }
  res.writeHead(200, { 'content-type': TYPES['.html'] });
  res.end(template);
});
await new Promise((ok) => server.listen(4391, ok));
const base = 'http://localhost:4391';


const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await context.addInitScript(() => {
  try {
    localStorage.setItem('ophtra.lang', 'ru');
  } catch {}
});

let written = 0;
const failures = [];

for (const route of routes) {
  const page = await context.newPage();
  try {
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForFunction(() => !document.getElementById('oph-preloader'), null, { timeout: 15000 });
    await page.waitForTimeout(400);

    const snapshot = await page.evaluate((siteOrigin) => {
      const pick = (selector) => [...document.head.querySelectorAll(selector)].map((el) => el.outerHTML);
      const rootEl = document.getElementById('root');
      // Freeze the markup: drop runtime-only attributes and inline motion vars.
      const clone = rootEl.cloneNode(true);
      clone.querySelectorAll('[data-visible]').forEach((el) => el.removeAttribute('data-visible'));
      const fix = (html) => html.replaceAll('http://localhost:4391', siteOrigin);
      return {
        title: document.title,
        head: fix(
          [
            ...pick('meta[name="description"]'),
            ...pick('meta[name="robots"]'),
            ...pick('link[rel="canonical"]'),
            ...pick('link[rel="alternate"][hreflang]'),
            ...pick('meta[property^="og:"]'),
            ...pick('meta[name^="twitter:"]'),
            ...pick('script[data-oph-jsonld]'),
          ].join('\n    '),
        ),
        body: fix(clone.innerHTML),
      };
    }, origin);

    let html = template
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${snapshot.title.replace(/</g, '&lt;')}</title>`)
      .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, '')
      .replace(/\s*<meta property="og:(title|description|type)"[^>]*\/>/g, '')
      .replace('</head>', `    ${snapshot.head}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${snapshot.body}</div>`);

    if (!snapshot.body || snapshot.body.length < 200) throw new Error('empty render');
    const out = route === '/' ? join(dist, 'index.html') : join(dist, route.replace(/^\//, ''), 'index.html');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
    written += 1;
    process.stdout.write(`✓ ${route}\n`);
  } catch (error) {
    failures.push(`${route}: ${error.message}`);
    process.stdout.write(`✗ ${route}: ${error.message}\n`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
console.log(`[prerender] ${written}/${routes.length} routes written${failures.length ? `, ${failures.length} failed` : ''}`);
if (failures.length) process.exitCode = 1;
