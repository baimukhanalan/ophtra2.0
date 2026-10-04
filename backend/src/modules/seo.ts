import { Router } from 'express';
import { env } from '../config/env.ts';
import { asyncHandler } from '../lib/http.ts';
import { listContent } from '../db/content.ts';

/**
 * SEO endpoints.
 *
 * The sitemap is generated from live content, so a doctor added in the admin
 * panel is discoverable without a redeploy. A static copy is also written to
 * the frontend's public directory at build time (frontend/scripts/generate-seo.mjs)
 * for deployments that serve the site without the API.
 */
export const seoRouter = Router();

const STATIC_PATHS: Array<{ path: string; priority: number; changefreq: string }> = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.8, changefreq: 'monthly' },
  { path: '/management', priority: 0.6, changefreq: 'monthly' },
  { path: '/doctors', priority: 0.9, changefreq: 'weekly' },
  { path: '/departments', priority: 0.8, changefreq: 'monthly' },
  { path: '/diagnostics', priority: 0.9, changefreq: 'monthly' },
  { path: '/treatment', priority: 0.9, changefreq: 'monthly' },
  { path: '/laser-vision-correction', priority: 0.9, changefreq: 'monthly' },
  { path: '/cataract-surgery', priority: 0.9, changefreq: 'monthly' },
  { path: '/pediatric-ophthalmology', priority: 0.9, changefreq: 'monthly' },
  { path: '/optical-store', priority: 0.7, changefreq: 'monthly' },
  { path: '/medical-programs', priority: 0.8, changefreq: 'monthly' },
  { path: '/pricing', priority: 0.9, changefreq: 'weekly' },
  { path: '/promotions', priority: 0.7, changefreq: 'weekly' },
  { path: '/news', priority: 0.7, changefreq: 'daily' },
  { path: '/articles', priority: 0.8, changefreq: 'weekly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  { path: '/reviews', priority: 0.7, changefreq: 'weekly' },
  { path: '/appointment', priority: 1.0, changefreq: 'monthly' },
  { path: '/contacts', priority: 0.8, changefreq: 'monthly' },
  { path: '/vacancies', priority: 0.5, changefreq: 'weekly' },
  { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms-of-use', priority: 0.3, changefreq: 'yearly' },
];

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char,
  );

const urlEntry = (
  loc: string,
  priority: number,
  changefreq: string,
  lastmod?: string,
): string => {
  // Language is a user preference rather than a URL segment, so every locale
  // shares one canonical address and the alternates point back to it.
  const alternates = ['ru-RU', 'kk-KZ', 'en-US', 'x-default']
    .map(
      (lang) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(loc)}" />`,
    )
    .join('\n');

  return [
    '  <url>',
    `    <loc>${escapeXml(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority.toFixed(1)}</priority>`,
    alternates,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
};

seoRouter.get(
  '/sitemap.xml',
  asyncHandler(async (_req, res) => {
    const [doctors, news, articles] = await Promise.all([
      listContent<{ slug: string }>('doctors'),
      listContent<{ slug: string; date: string }>('news'),
      listContent<{ slug: string; date: string }>('articles'),
    ]);

    const entries = [
      ...STATIC_PATHS.map((entry) =>
        urlEntry(`${env.siteUrl}${entry.path}`, entry.priority, entry.changefreq),
      ),
      ...doctors.map((doctor) =>
        urlEntry(`${env.siteUrl}/doctors/${doctor.slug}`, 0.7, 'monthly'),
      ),
      ...news.map((item) => urlEntry(`${env.siteUrl}/news/${item.slug}`, 0.6, 'monthly', item.date)),
      ...articles.map((item) =>
        urlEntry(`${env.siteUrl}/articles/${item.slug}`, 0.7, 'monthly', item.date),
      ),
    ];

    res.type('application/xml').send(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
        ...entries,
        '</urlset>',
        '',
      ].join('\n'),
    );
  }),
);

seoRouter.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    [
      'User-agent: *',
      'Allow: /',
      '',
      '# Private areas carry no public content and must not be indexed.',
      'Disallow: /account',
      'Disallow: /admin',
      'Disallow: /api/',
      '',
      `Sitemap: ${env.siteUrl}/sitemap.xml`,
      '',
    ].join('\n'),
  );
});
