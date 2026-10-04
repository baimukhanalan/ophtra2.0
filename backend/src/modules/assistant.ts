import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import {
  analyseDialogue,
  createSession,
  isKnowledgeGap,
  respond,
} from '../../../shared/assistant/engine.ts';
import type {
  AssistantKnowledge,
  AssistantLanguage,
  AssistantSession,
} from '../../../shared/assistant/types.ts';
import { asyncHandler, optionalString, requireString } from '../lib/http.ts';
import { getDatabase } from '../db/index.ts';
import { listContent } from '../db/content.ts';
import { logger } from '../lib/logger.ts';

/**
 * AI assistant service.
 *
 * Runs the shared intent engine against the clinic's live knowledge base and
 * persists three things: the session state (so a multi-turn symptom interview
 * survives page navigation), the transcript (for dialogue analysis) and the
 * unanswered questions (the knowledge-base learning loop).
 */
export const assistantRouter = Router();

interface Localized {
  ru: string;
  kk: string;
  en: string;
}

const pick = (value: Localized | undefined, language: AssistantLanguage): string =>
  value?.[language] ?? value?.ru ?? '';

/** Projects the content repository into the shape the engine consumes. */
const buildKnowledge = async (language: AssistantLanguage): Promise<AssistantKnowledge> => {
  const [faq, departments, services, doctors] = await Promise.all([
    listContent<{ id: string; topic: string; question: Localized; answer: Localized }>('faq'),
    listContent<{ id: string; slug: string; name: Localized; short: Localized }>('departments'),
    listContent<{ id: string; slug: string; departmentId: string; name: Localized; price: number }>(
      'services',
    ),
    listContent<{ id: string; slug: string; name: Localized; role: Localized; departmentIds: string[] }>(
      'doctors',
    ),
  ]);

  return {
    faq: faq.map((item) => ({
      id: item.id,
      topic: item.topic,
      question: pick(item.question, language),
      answer: pick(item.answer, language),
    })),
    departments: departments.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: pick(item.name, language),
      short: pick(item.short, language),
      keywords: [pick(item.name, language), pick(item.short, language)],
    })),
    services: services.map((item) => ({
      id: item.id,
      slug: item.slug,
      departmentId: item.departmentId,
      name: pick(item.name, language),
      price: item.price,
    })),
    doctors: doctors.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: pick(item.name, language),
      role: pick(item.role, language),
      departmentIds: item.departmentIds,
    })),
  };
};

const loadSession = async (
  sessionId: string,
  language: AssistantLanguage,
): Promise<AssistantSession> => {
  const db = getDatabase();
  const row = await db.get<{ state: string }>(
    'SELECT state FROM assistant_sessions WHERE id = @id',
    { id: sessionId },
  );

  if (row) return JSON.parse(row.state) as AssistantSession;

  const session = createSession(sessionId, language);
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO assistant_sessions (id, language, state, handed_off, turns, created_at, updated_at)
     VALUES (@id, @language, @state, 0, 0, @created_at, @updated_at)`,
    {
      id: sessionId,
      language,
      state: JSON.stringify(session),
      created_at: now,
      updated_at: now,
    },
  );
  return session;
};

const saveSession = async (session: AssistantSession) => {
  const db = getDatabase();
  await db.run(
    `UPDATE assistant_sessions
     SET state = @state, handed_off = @handed_off, turns = @turns, language = @language, updated_at = @updated_at
     WHERE id = @id`,
    {
      id: session.id,
      state: JSON.stringify(session),
      handed_off: session.handedOff ? 1 : 0,
      turns: session.turns,
      language: session.language,
      updated_at: new Date().toISOString(),
    },
  );
};

const recordMessage = async (
  sessionId: string,
  role: 'user' | 'assistant',
  text: string,
  intent?: string,
  confidence?: number,
) => {
  const db = getDatabase();
  await db.run(
    `INSERT INTO assistant_messages (id, session_id, role, text, intent, confidence, created_at)
     VALUES (@id, @session_id, @role, @text, @intent, @confidence, @created_at)`,
    {
      id: randomUUID(),
      session_id: sessionId,
      role,
      text,
      intent: intent ?? null,
      confidence: confidence ?? null,
      created_at: new Date().toISOString(),
    },
  );
};

/** Queues an unanswered question for an editor to turn into an FAQ entry. */
const recordKnowledgeGap = async (question: string, language: string) => {
  const db = getDatabase();
  const now = new Date().toISOString();
  const normalised = question.trim().toLocaleLowerCase().slice(0, 240);

  const existing = await db.get<{ id: string }>(
    'SELECT id FROM assistant_gaps WHERE question = @question AND language = @language',
    { question: normalised, language },
  );

  if (existing) {
    await db.run(
      'UPDATE assistant_gaps SET hits = hits + 1, updated_at = @updated_at WHERE id = @id',
      { id: existing.id, updated_at: now },
    );
    return;
  }

  await db.run(
    `INSERT INTO assistant_gaps (id, question, language, hits, resolved, created_at, updated_at)
     VALUES (@id, @question, @language, 1, 0, @created_at, @updated_at)`,
    { id: randomUUID(), question: normalised, language, created_at: now, updated_at: now },
  );
};

assistantRouter.post(
  '/message',
  asyncHandler(async (req, res) => {
    const message = requireString(req.body, 'message');
    const sessionId = optionalString(req.body, 'sessionId') || randomUUID();
    const language = (optionalString(req.body, 'language') || 'ru') as AssistantLanguage;

    const session = await loadSession(sessionId, language);
    session.language = language;

    const knowledge = await buildKnowledge(language);
    const reply = respond({ message, session, knowledge });

    await Promise.all([
      saveSession(session),
      recordMessage(sessionId, 'user', message),
      recordMessage(sessionId, 'assistant', reply.reply, reply.intent, reply.confidence),
    ]);

    if (isKnowledgeGap(reply)) await recordKnowledgeGap(message, language);
    if (reply.handoff) logger.info('assistant.handoff', { sessionId, intent: reply.intent });

    res.json({
      reply: reply.reply,
      intent: reply.intent,
      suggestions: reply.suggestions,
      handoff: reply.handoff,
      entities: reply.entities,
      action: reply.action,
    });
  }),
);

/** Stores the dialogue analysis produced when the widget closes. */
assistantRouter.post(
  '/sessions/:id/analysis',
  asyncHandler(async (req, res) => {
    const db = getDatabase();
    const row = await db.get<{ state: string }>(
      'SELECT state FROM assistant_sessions WHERE id = @id',
      { id: String(req.params.id) },
    );

    if (!row) {
      res.json({ stored: false });
      return;
    }

    const session = JSON.parse(row.state) as AssistantSession;
    const messages = await db.all<{ intent: string | null; confidence: number | null }>(
      'SELECT intent, confidence FROM assistant_messages WHERE session_id = @id AND role = \'assistant\'',
      { id: String(req.params.id) },
    );

    const analysis = analyseDialogue(
      session,
      messages.map((entry) => ({
        reply: '',
        intent: (entry.intent ?? 'fallback') as never,
        suggestions: [],
        handoff: false,
        entities: {},
        confidence: entry.confidence ?? 0,
      })),
    );

    logger.info('assistant.analysis', {
      sessionId: analysis.sessionId,
      turns: analysis.turns,
      unresolved: analysis.unresolved,
      handoff: analysis.handoff,
    });

    res.json({ stored: true, analysis });
  }),
);
