import type { ServiceContent } from './services-types';

/**
 * Long-form medical copy, one module per service (./services-bodies/<slug>.ts).
 *
 * The service detail route used to ship all twenty services × three languages
 * (≈330 kB raw) to show one of them. Each body is now its own chunk, fetched
 * by slug when the page mounts — about 4 kB brotli per visit. The catalogue
 * record (name, price, duration, department) stays in data/services.json, so
 * lists, prices and booking never need these files.
 */
const loaders = import.meta.glob<{ default: ServiceContent }>('./services-bodies/*.ts');

const pathFor = (slug: string) => `./services-bodies/${slug}.ts`;

const pending = new Map<string, Promise<ServiceContent | undefined>>();
const resolved = new Map<string, ServiceContent | undefined>();

/** Whether a long-form body exists for this slug (no network). */
export const hasServiceContent = (slug: string) => pathFor(slug) in loaders;

/** Synchronous read once the body has loaded (undefined while pending). */
export const peekServiceContent = (slug: string) => resolved.get(slug);

/**
 * Loads (once) and caches the body for a slug. The promise is memoised so it
 * is stable across renders — React's `use()` requires that — and resolves to
 * `undefined` for slugs without long-form copy or when the chunk fails to load
 * (the page then falls back to the catalogue's short description).
 */
export const loadServiceContent = (slug: string): Promise<ServiceContent | undefined> => {
  const cached = pending.get(slug);
  if (cached) return cached;
  const loader = loaders[pathFor(slug)];
  const promise = (loader ? loader().then((module) => module.default) : Promise.resolve(undefined))
    .catch(() => undefined)
    .then((content) => {
      resolved.set(slug, content);
      return content;
    });
  pending.set(slug, promise);
  return promise;
};
