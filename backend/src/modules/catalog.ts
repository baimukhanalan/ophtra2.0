import { Router } from 'express';
import { asyncHandler } from '../lib/http.ts';
import { listContent } from '../db/content.ts';

/**
 * Public catalogue endpoints.
 *
 * Read-only, cacheable, no authentication: this is the content the marketing
 * site renders. Everything is served from the content repository so an admin
 * edit is live on the next request.
 */
export const catalogRouter = Router();

const collection = (path: string, name: string) =>
  catalogRouter.get(
    path,
    asyncHandler(async (_req, res) => {
      // Public content changes rarely; a short shared cache absorbs traffic
      // spikes from campaigns without going stale for editors.
      res.set('Cache-Control', 'public, max-age=60, s-maxage=300');
      res.json(await listContent(name));
    }),
  );

collection('/clinics', 'clinics');
collection('/departments', 'departments');
collection('/services', 'services');
collection('/doctors', 'doctors');
collection('/programs', 'programs');
collection('/promotions', 'promotions');
collection('/news', 'news');
collection('/articles', 'articles');
collection('/faq', 'faq');
collection('/reviews', 'reviews');
collection('/vacancies', 'vacancies');
