import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { asyncHandler, optionalString, requireString } from '../lib/http.ts';
import { getDatabase } from '../db/index.ts';

/**
 * End-to-end analytics collector.
 *
 * First-party, pseudonymous: we store an event name, its payload and the
 * session id — never a name, phone or email. The value is the join: the same
 * session id is attached to the appointment record, so a campaign can be
 * measured against clinic outcomes rather than form submissions.
 */
export const analyticsRouter = Router();

/** Payload keys that must never be persisted, whatever the client sends. */
const FORBIDDEN_KEYS = new Set([
  'phone',
  'email',
  'fullname',
  'full_name',
  'name',
  'comment',
  'password',
  'token',
]);

const sanitise = (payload: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(payload).filter(([key]) => !FORBIDDEN_KEYS.has(key.toLocaleLowerCase())),
  );

analyticsRouter.post(
  '/events',
  asyncHandler(async (req, res) => {
    const name = requireString(req.body, 'name');
    const sessionId = optionalString(req.body, 'sessionId') || 'anonymous';
    const payload = (req.body as { payload?: Record<string, unknown> }).payload ?? {};

    const db = getDatabase();
    await db.run(
      `INSERT INTO analytics_events (id, session_id, name, payload, created_at)
       VALUES (@id, @session_id, @name, @payload, @created_at)`,
      {
        id: randomUUID(),
        session_id: sessionId,
        name,
        payload: JSON.stringify(sanitise(payload)),
        created_at: new Date().toISOString(),
      },
    );

    res.status(204).end();
  }),
);
