import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  availableDates,
  bookingReference,
  DEFAULT_SLOT_RULE,
  generateSlots,
  isDuplicateBooking,
} from '../../shared/booking/slots.ts';
import { analyseDialogue, createSession, isKnowledgeGap, respond } from '../../shared/assistant/engine.ts';
import type { AssistantKnowledge } from '../../shared/assistant/types.ts';
import { issueToken, verifyToken } from '../src/lib/auth.ts';
import { HttpError } from '../src/lib/http.ts';

/* ================================================================ BOOKING */

test('slots respect the clinic opening hours and step', () => {
  const slots = generateSlots('2030-06-10', 'doc-1');
  assert.ok(slots.length > 0);

  for (const slot of slots) {
    const [hour, minute] = slot.time.split(':').map(Number);
    assert.ok(hour >= DEFAULT_SLOT_RULE.opensAt, `${slot.time} is before opening`);
    assert.ok(hour < DEFAULT_SLOT_RULE.closesAt, `${slot.time} is after closing`);
    assert.equal(minute % DEFAULT_SLOT_RULE.stepMinutes, 0);
  }
});

test('slots inside the lead-time window are never offered', () => {
  const now = new Date('2030-06-10T12:00:00');
  const slots = generateSlots('2030-06-10', 'doc-1', DEFAULT_SLOT_RULE, now);
  const earliest = slots[0]?.time ?? '';
  // Lead time is 2 hours, so nothing before 14:00 may appear.
  assert.ok(earliest >= '14:00', `earliest offered slot was ${earliest}`);
});

test('slot availability is deterministic for the same doctor and date', () => {
  const a = generateSlots('2030-06-10', 'doc-1');
  const b = generateSlots('2030-06-10', 'doc-1');
  assert.deepEqual(a, b, 'the same query must produce the same schedule');

  const other = generateSlots('2030-06-10', 'doc-2');
  assert.notDeepEqual(
    a.map((slot) => slot.available),
    other.map((slot) => slot.available),
    'different doctors should not share an identical schedule',
  );
});

test('available dates skip the clinic’s closed days', () => {
  const rule = { ...DEFAULT_SLOT_RULE, closedDays: [0] };
  const dates = availableDates(14, new Date('2030-06-10T00:00:00'), rule);

  assert.equal(dates.length, 14);
  for (const date of dates) {
    assert.notEqual(new Date(`${date}T00:00:00`).getDay(), 0, `${date} is a Sunday`);
  }
});

test('duplicate booking detection catches a repeated slot and ignores cancellations', () => {
  const candidate = { patientPhone: '+7 700 000 00 00', doctorId: 'doc-1', date: '2030-06-10', time: '10:00' };

  assert.equal(
    isDuplicateBooking(candidate, [{ ...candidate, status: 'confirmed' }]),
    true,
    'an existing confirmed appointment in the same slot is a duplicate',
  );
  assert.equal(
    isDuplicateBooking(candidate, [{ ...candidate, status: 'cancelled' }]),
    false,
    'a cancelled appointment must not block rebooking',
  );
  assert.equal(
    isDuplicateBooking(candidate, [{ ...candidate, time: '10:30', status: 'confirmed' }]),
    false,
    'a different time is not a duplicate',
  );
});

test('booking references are stable and human-readable', () => {
  const reference = bookingReference('+7 700 000 00 00|2030-06-10|10:00|doc-1');
  assert.match(reference, /^OPH-[A-Z2-9]{6}$/);
  assert.equal(reference, bookingReference('+7 700 000 00 00|2030-06-10|10:00|doc-1'));
});

/* ============================================================== ASSISTANT */

const knowledge: AssistantKnowledge = {
  faq: [
    {
      id: 'faq-1',
      topic: 'booking',
      question: 'Как записаться на приём?',
      answer: 'Через форму онлайн-записи, по телефону или в WhatsApp.',
    },
  ],
  departments: [
    { id: 'laser', slug: 'laser', name: 'Лазерная коррекция', short: '', keywords: [] },
    { id: 'cataract', slug: 'cataract', name: 'Катаракта', short: '', keywords: [] },
    { id: 'pediatric', slug: 'pediatric', name: 'Детская офтальмология', short: '', keywords: [] },
  ],
  services: [
    { id: 'svc-femto', slug: 'femto', departmentId: 'laser', name: 'Femto-LASIK', price: 290000 },
    { id: 'svc-phaco', slug: 'phaco', departmentId: 'cataract', name: 'Факоэмульсификация', price: 380000 },
  ],
  doctors: [
    { id: 'doc-1', slug: 'd1', name: 'Данияр Сериков', role: 'Хирург', departmentIds: ['laser'] },
    { id: 'doc-2', slug: 'd2', name: 'Айгуль Ахметова', role: 'Хирург', departmentIds: ['cataract'] },
  ],
};

test('assistant answers a knowledge-base question', () => {
  const session = createSession('s-faq', 'ru');
  session.turns = 1;
  const reply = respond({ message: 'Как записаться на приём?', session, knowledge });

  assert.equal(reply.intent, 'faq');
  assert.ok(reply.reply.includes('WhatsApp'));
  assert.equal(reply.handoff, false);
});

test('assistant routes a complaint to the right department and recommends a doctor', () => {
  const session = createSession('s-route', 'ru');
  session.turns = 1;
  const reply = respond({ message: 'у меня близорукость, надоели очки', session, knowledge });

  assert.equal(reply.entities.departmentId, 'laser');
  assert.equal(reply.entities.serviceId, 'svc-femto');
  assert.equal(reply.entities.doctorId, 'doc-1');
  assert.ok(reply.reply.includes('Femto-LASIK'));
  assert.ok(reply.reply.includes('не диагноз'), 'a medical disclaimer is mandatory');
});

test('assistant transfers to an operator on request', () => {
  const session = createSession('s-op', 'ru');
  session.turns = 1;
  const reply = respond({ message: 'соедините с оператором', session, knowledge });

  assert.equal(reply.intent, 'operator_handoff');
  assert.equal(reply.handoff, true);
  assert.equal(session.handedOff, true);
});

test('assistant escalates sudden vision loss with pain instead of booking', () => {
  const session = createSession('s-urgent', 'ru');
  session.turns = 1;
  const reply = respond({
    message: 'резко упало зрение и сильная боль в глазу',
    session,
    knowledge,
  });

  assert.equal(reply.handoff, true, 'a red-flag combination must reach a human immediately');
  assert.equal(reply.entities.urgency, 'high');
});

test('assistant collects symptoms across turns before recommending', () => {
  const session = createSession('s-symptoms', 'ru');
  session.turns = 1;

  const first = respond({ message: 'мушки перед глазами', session, knowledge });
  assert.equal(first.intent, 'symptom_collection');

  const second = respond({ message: 'оба глаза', session, knowledge });
  assert.equal(session.symptoms.eye, 'both');
  assert.equal(second.intent, 'symptom_collection');

  respond({ message: 'несколько недель', session, knowledge });
  assert.equal(session.symptoms.duration, 'weeks');
});

test('assistant answers in the session language', () => {
  const session = createSession('s-en', 'en');
  session.turns = 1;
  const reply = respond({ message: 'I want laser correction', session, knowledge });

  assert.ok(/specialty|service|recommend/i.test(reply.reply), `unexpected reply: ${reply.reply}`);
});

test('unanswerable questions are flagged as knowledge gaps', () => {
  const session = createSession('s-gap', 'ru');
  session.turns = 1;
  const reply = respond({ message: 'зурбаган кримпель фаустпатрон', session, knowledge });

  assert.equal(reply.intent, 'fallback');
  assert.equal(isKnowledgeGap(reply), true);
});

test('dialogue analysis summarises intents, handoff and unresolved turns', () => {
  const session = createSession('s-analysis', 'ru');
  session.turns = 3;
  session.handedOff = true;

  const analysis = analyseDialogue(session, [
    { reply: '', intent: 'faq', suggestions: [], handoff: false, entities: {}, confidence: 0.9 },
    { reply: '', intent: 'fallback', suggestions: [], handoff: false, entities: {}, confidence: 0.1 },
  ]);

  assert.equal(analysis.turns, 3);
  assert.equal(analysis.handoff, true);
  assert.equal(analysis.unresolved, 1);
  assert.equal(analysis.intents.faq, 1);
});

/* =================================================================== AUTH */

test('tokens round-trip and carry their role', () => {
  const token = issueToken('patient', 'pat-1');
  const payload = verifyToken(token);

  assert.equal(payload.role, 'patient');
  assert.equal(payload.subject, 'pat-1');
  assert.ok(payload.exp > Date.now());
});

test('a tampered token is rejected', () => {
  const token = issueToken('admin', 'admin');
  const [body] = token.split('.');
  const forged = `${body}.aGFja2Vk`;

  assert.throws(() => verifyToken(forged), (error: unknown) => error instanceof HttpError);
});

test('a token signed for a patient cannot be reused as an admin token', () => {
  const payload = verifyToken(issueToken('patient', 'pat-1'));
  assert.notEqual(payload.role, 'admin');
});
