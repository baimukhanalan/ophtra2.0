import { Router } from 'express';
import { env } from '../config/env.ts';
import { asyncHandler, HttpError, requireString } from '../lib/http.ts';
import { authenticate, issueToken } from '../lib/auth.ts';
import { getDatabase } from '../db/index.ts';
import { deleteContent, listContent, patchContent } from '../db/content.ts';
import type { LeadRow } from '../db/types.ts';
import { logger } from '../lib/logger.ts';

/**
 * Administrator API.
 *
 * Backs the eight panel capabilities: edit pages, add doctors, publish news,
 * publish promotions, manage prices, manage photos, manage SEO and review
 * patient requests. Content collections are addressed generically so adding a
 * new editable collection needs no new endpoint.
 */
export const adminRouter = Router();

/** Collections an administrator may edit through the generic CRUD routes. */
const EDITABLE = new Set([
  'pages',
  'doctors',
  'news',
  'articles',
  'promotions',
  'services',
  'clinics',
  'departments',
  'programs',
  'faq',
  'reviews',
  'vacancies',
  'photos',
  'seo',
]);

const assertEditable = (collection: string) => {
  if (!EDITABLE.has(collection)) {
    throw HttpError.badRequest(`Collection "${collection}" is not editable`, 'unknown_collection');
  }
};

adminRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const login = requireString(req.body, 'login');
    const password = requireString(req.body, 'password');

    if (login !== env.adminLogin || password !== env.adminPassword) {
      // Deliberately vague: never reveal which half was wrong.
      throw HttpError.unauthorized('Invalid credentials', 'invalid_credentials');
    }

    logger.info('admin.signed_in', { login });
    res.json({ token: issueToken('admin', login) });
  }),
);

/* ---------------------------------------------------------------- LEADS */

adminRouter.get(
  '/leads',
  asyncHandler(async (req, res) => {
    authenticate(req, 'admin');
    const db = getDatabase();

    const rows = await db.all<LeadRow>('SELECT * FROM leads ORDER BY created_at DESC LIMIT 500');
    res.json(
      rows.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        phone: row.phone,
        email: row.email,
        serviceId: row.service_id,
        source: row.source,
        comment: row.comment,
        utm: JSON.parse(row.utm) as Record<string, string>,
        crmStatus: row.crm_status,
        date: row.created_at,
      })),
    );
  }),
);

/* ------------------------------------------------------------ ANALYTICS */

/** Funnel and assistant summary shown on the panel dashboard. */
adminRouter.get(
  '/insights',
  asyncHandler(async (req, res) => {
    authenticate(req, 'admin');
    const db = getDatabase();

    const [funnel, gaps, handoffs, appointments] = await Promise.all([
      db.all<{ name: string; count: number }>(
        `SELECT name, COUNT(*) AS count FROM analytics_events
         GROUP BY name ORDER BY count DESC LIMIT 25`,
      ),
      db.all<{ question: string; hits: number }>(
        'SELECT question, hits FROM assistant_gaps WHERE resolved = 0 ORDER BY hits DESC LIMIT 25',
      ),
      db.get<{ count: number }>(
        'SELECT COUNT(*) AS count FROM assistant_sessions WHERE handed_off = 1',
      ),
      db.get<{ count: number }>(
        "SELECT COUNT(*) AS count FROM appointments WHERE status <> 'cancelled'",
      ),
    ]);

    res.json({
      funnel,
      knowledgeGaps: gaps,
      assistantHandoffs: handoffs?.count ?? 0,
      appointments: appointments?.count ?? 0,
    });
  }),
);

/* ------------------------------------------------- GENERIC CONTENT CRUD */

adminRouter.get(
  '/:collection',
  asyncHandler(async (req, res) => {
    authenticate(req, 'admin');
    const collection = String(req.params.collection);
    assertEditable(collection);
    // Administrators see drafts as well as published entries.
    res.json(await listContent(collection, true));
  }),
);

adminRouter.post(
  '/:collection',
  asyncHandler(async (req, res) => {
    authenticate(req, 'admin');
    const collection = String(req.params.collection);
    assertEditable(collection);

    const body = req.body as Record<string, unknown>;
    const id = typeof body.id === 'string' && body.id ? body.id : `${collection}-${Date.now()}`;

    const created = await patchContent(collection, id, { ...body, id });
    logger.info('admin.created', { collection, id });
    res.status(201).json(created);
  }),
);

adminRouter.patch(
  '/:collection/:id',
  asyncHandler(async (req, res) => {
    authenticate(req, 'admin');
    const collection = String(req.params.collection);
    const id = String(req.params.id);
    assertEditable(collection);

    const updated = await patchContent(collection, id, req.body as Record<string, unknown>);
    logger.info('admin.updated', { collection, id });
    res.json(updated);
  }),
);

adminRouter.delete(
  '/:collection/:id',
  asyncHandler(async (req, res) => {
    authenticate(req, 'admin');
    const collection = String(req.params.collection);
    const id = String(req.params.id);
    assertEditable(collection);

    const removed = await deleteContent(collection, id);
    if (removed === 0) throw HttpError.notFound('Entry not found');

    logger.info('admin.deleted', { collection, id });
    res.status(204).end();
  }),
);
