import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Route inventory, derived from the site's own sources so the crawl can never
 * drift from the app: static paths from navigation.ts (ROUTES), dynamic slugs
 * from data/*.json and the knowledge-base article modules.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../../..');
const read = (rel: string) => readFileSync(path.join(ROOT, rel), 'utf8');
const json = <T>(rel: string): T => JSON.parse(read(rel)) as T;

/** ROUTES map parsed out of navigation.ts (key: '/path'). */
const routesSource = read('frontend/src/app/navigation.ts');
const routesBlock = routesSource.slice(routesSource.indexOf('export const ROUTES'), routesSource.indexOf('} as const'));
export const ROUTES: Record<string, string> = Object.fromEntries(
  [...routesBlock.matchAll(/^\s+(\w+):\s*'([^']+)'/gm)].map((m) => [m[1], m[2]]),
);

/** Static paths that render a real page ('/articles' is a redirect to the knowledge base). */
export const STATIC_ROUTES: string[] = Object.values(ROUTES).filter((p) => p !== '/articles' && p !== '/authors');

type Sluggy = { slug: string; published?: boolean };
export const DOCTOR_SLUGS = json<Sluggy[]>('data/doctors.json').map((d) => d.slug);
export const SERVICE_SLUGS = json<Sluggy[]>('data/services.json').map((d) => d.slug);
export const NEWS_SLUGS = json<Sluggy[]>('data/news.json').filter((d) => d.published !== false).map((d) => d.slug);

const legacyArticleSlugs = json<Sluggy[]>('data/articles.json').filter((d) => d.published).map((d) => d.slug);
/** The knowledge modules have been reorganised more than once; read whichever exist. */
const KNOWLEDGE_DIR = 'frontend/src/content/pages';
const moduleArticleSlugs = readdirSync(path.join(ROOT, KNOWLEDGE_DIR))
  .filter((f) => /^knowledge-(articles-.*|index)\.ts$/.test(f))
  .flatMap((f) => [...read(`${KNOWLEDGE_DIR}/${f}`).matchAll(/^ {4}slug: '([^']+)'/gm)].map((m) => m[1]));
export const KNOWLEDGE_SLUGS = [...new Set([...legacyArticleSlugs, ...moduleArticleSlugs])];
/** Founder + editorial authors declared as *_SLUG constants in knowledge.ts, plus every doctor. */
const extraAuthorSlugs = [...read(`${KNOWLEDGE_DIR}/knowledge.ts`).matchAll(/export const \w+_SLUG = '([^']+)'/g)].map((m) => m[1]);
export const AUTHOR_SLUGS = [...new Set(['dr-kulmaganbetov', ...extraAuthorSlugs, ...DOCTOR_SLUGS])];

export const DYNAMIC_ROUTES: string[] = [
  ...DOCTOR_SLUGS.map((s) => `/doctors/${s}`),
  ...SERVICE_SLUGS.map((s) => `/services/${s}`),
  ...KNOWLEDGE_SLUGS.map((s) => `/knowledge-base/${s}`),
  ...AUTHOR_SLUGS.map((s) => `/authors/${s}`),
  ...NEWS_SLUGS.map((s) => `/news/${s}`),
];

export const ALL_ROUTES = [...STATIC_ROUTES, ...DYNAMIC_ROUTES];

const DYNAMIC: Record<string, string[]> = {
  doctors: DOCTOR_SLUGS,
  services: SERVICE_SLUGS,
  'knowledge-base': KNOWLEDGE_SLUGS,
  articles: KNOWLEDGE_SLUGS, // legacy redirect keeps the slug
  authors: AUTHOR_SLUGS,
  news: NEWS_SLUGS,
};

/** True when a same-origin pathname renders a real page (not the 404 route). */
export const isKnownRoute = (pathname: string): boolean => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/articles') return true;
  if (STATIC_ROUTES.includes(clean)) return true;
  const [, first, second, ...rest] = clean.split('/');
  if (rest.length) return false;
  return Boolean(second && DYNAMIC[first]?.includes(decodeURIComponent(second)));
};
