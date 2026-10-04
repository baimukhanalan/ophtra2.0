import { fill, phrase, SUGGESTIONS } from './phrases.ts';
import type {
  AssistantIntent,
  AssistantKnowledge,
  AssistantLanguage,
  AssistantReply,
  AssistantSession,
  SymptomProfile,
} from './types.ts';

/**
 * Deterministic intent engine.
 *
 * The assistant is rule-based on purpose: a clinic assistant must never
 * improvise medical claims. Every reply is composed from the clinic's own
 * knowledge base (FAQ, catalogue, doctor roster), and anything it cannot match
 * confidently is handed to a human operator and logged as a knowledge gap.
 */

/* ================================================================ MATCHING */

const normalise = (input: string): string =>
  input
    .toLocaleLowerCase()
    .replace(/[ё]/g, 'е')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (input: string): string[] =>
  normalise(input)
    .split(' ')
    .filter((token) => token.length > 2);

/**
 * Similarity between a query and a candidate text.
 * Prefix matching (rather than equality) keeps Russian and Kazakh inflections
 * from breaking the match — "глаукомы"/"глаукоме" both hit "глауком".
 */
const score = (queryTokens: string[], candidate: string): number => {
  if (queryTokens.length === 0) return 0;
  const candidateTokens = tokenize(candidate);
  if (candidateTokens.length === 0) return 0;

  let hits = 0;
  queryTokens.forEach((token) => {
    const stem = token.slice(0, Math.max(4, token.length - 2));
    if (candidateTokens.some((word) => word.startsWith(stem) || token.startsWith(word.slice(0, 4)))) {
      hits += 1;
    }
  });

  return hits / queryTokens.length;
};

/* ============================================================== VOCABULARY */

const KEYWORDS: Record<string, string[]> = {
  booking: [
    'запис', 'записать', 'приём', 'прием', 'талон', 'жазыл', 'қабылдау',
    'book', 'appointment', 'schedule',
  ],
  cancel: ['отмен', 'отказ', 'болдырм', 'бас тарт', 'cancel'],
  reschedule: ['перенес', 'перенест', 'ауыстыр', 'reschedule', 'move', 'change time'],
  operator: [
    'оператор', 'человек', 'администратор', 'живой', 'адам', 'operator', 'human', 'manager',
  ],
  price: ['цена', 'стоит', 'стоимость', 'сколько', 'баға', 'қанша', 'price', 'cost', 'how much'],
  doctor: ['врач', 'доктор', 'хирург', 'специалист', 'дәрігер', 'doctor', 'surgeon', 'specialist'],
  notifications: [
    'напомин', 'уведомл', 'подтвержден', 'еске сал', 'хабарлама', 'remind', 'notification',
  ],
  symptoms: [
    'болит', 'боль', 'резь', 'двоит', 'мушки', 'пелена', 'зуд', 'краснот', 'слезит', 'туман',
    'ауыр', 'ашид', 'қызар', 'жас', 'бұлдыр',
    'pain', 'blur', 'double', 'red', 'itch', 'floaters', 'watering',
  ],
};

/** Symptom → department routing table. */
const SYMPTOM_ROUTES: Array<{ department: string; terms: string[] }> = [
  {
    department: 'cataract',
    terms: ['катаракт', 'пелена', 'мутн', 'помутнен', 'туман', 'cataract', 'cloud', 'бұлдыр'],
  },
  {
    department: 'laser',
    terms: [
      'близорук', 'миопи', 'астигмат', 'очки', 'линзы надоели', 'коррекц', 'лазер',
      'myopia', 'astigmat', 'laser', 'glasses', 'көзілдірік', 'лазерл',
    ],
  },
  {
    department: 'treatment',
    terms: [
      'глауком', 'давлен', 'сетчатк', 'диабет', 'макул', 'сухост', 'резь', 'воспал', 'краснот',
      'glaucoma', 'retina', 'dry', 'pressure', 'inflam', 'глаукома', 'қысым', 'тор қабық',
    ],
  },
  {
    department: 'pediatric',
    terms: ['ребен', 'ребён', 'дет', 'школьник', 'сын', 'дочь', 'бала', 'child', 'kid', 'son', 'daughter'],
  },
  {
    department: 'optical',
    terms: ['оправ', 'очки заказ', 'контактные линзы', 'подобрать очки', 'оптик', 'frames', 'lenses', 'optic'],
  },
  {
    department: 'diagnostics',
    terms: ['проверить зрение', 'обследован', 'диагностик', 'чекап', 'check', 'exam', 'тексер'],
  },
];

/**
 * Service vocabulary → catalogue service id. Visitors name procedures far more
 * often than departments («запишите на ОКТ», «LASIK», «катаракта»), so these
 * route straight to a concrete service instead of a symptom interview.
 * Single-word terms are matched against the start of a word (short ones such
 * as «окт» / «oct» only as a whole word, so «октябрь» / «october» do not
 * trigger); multi-word terms are matched as phrases.
 */
const SERVICE_ALIASES: Array<{ serviceId: string; terms: string[] }> = [
  { serviceId: 'svc-oct', terms: ['окт', 'oct', 'томограф', 'когерентн', 'томография'] },
  { serviceId: 'svc-perimetry', terms: ['периметр', 'поля зрения', 'поле зрения', 'perimetry', 'visual field', 'көру өріс'] },
  { serviceId: 'svc-topography', terms: ['кератотопограф', 'топограф', 'topography', 'topographer'] },
  { serviceId: 'svc-smile', terms: ['smile', 'смайл', 'релекс', 'relex'] },
  { serviceId: 'svc-prk', terms: ['фрк', 'prk', 'трансэпител'] },
  {
    serviceId: 'svc-femto',
    terms: [
      'lasik', 'ласик', 'фемто', 'femto', 'лазерная коррекция', 'лазерной коррекц', 'лазерную коррекц',
      'коррекция зрения', 'коррекцию зрения', 'laser correction', 'laser eye', 'лазерлік түзету',
    ],
  },
  { serviceId: 'svc-yag', terms: ['yag', 'капсулотом', 'вторичная катаракта', 'вторичной катаракт'] },
  { serviceId: 'svc-phaco', terms: ['катаракт', 'факоэмульс', 'phaco', 'cataract', 'хрусталик', 'замена хрусталика', 'lens replacement'] },
  { serviceId: 'svc-glaucoma', terms: ['глауком', 'glaucoma', 'внутриглазное давление', 'көз қысым'] },
  { serviceId: 'svc-laser-injection', terms: ['инъекц', 'интравитреал', 'injection', 'vegf', 'анти vegf'] },
  { serviceId: 'svc-retina', terms: ['сетчатк', 'retina', 'макул', 'macula', 'торқабық', 'тор қабық'] },
  { serviceId: 'svc-dryeye', terms: ['сухой глаз', 'сухого глаза', 'сухость', 'dry eye', 'құрғақ көз'] },
  { serviceId: 'svc-child-myopia', terms: ['контроль близорук', 'myopia control', 'ортокератолог', 'orthok'] },
  { serviceId: 'svc-child-hardware', terms: ['аппаратное лечение', 'аппаратн', 'hardware therapy'] },
  {
    serviceId: 'svc-child-consult',
    terms: [
      'детск', 'ребен', 'ребён', 'дети', 'детей', 'школьник', 'child', 'children', 'kid', 'pediatric',
      'paediatric', 'бала', 'балалар',
    ],
  },
  { serviceId: 'svc-lenses', terms: ['контактные линзы', 'контактных линз', 'contact lens', 'линзы'] },
  { serviceId: 'svc-glasses', terms: ['подобрать очки', 'подбор очков', 'оправ', 'glasses', 'spectacles', 'көзілдірік'] },
  { serviceId: 'svc-complex', terms: ['комплексн', 'чекап', 'check up', 'checkup', 'проверить зрение', 'проверка зрения'] },
];

const matchesTerm = (text: string, words: string[], term: string): boolean => {
  if (term.includes(' ')) return text.includes(term);
  // Short abbreviations only as whole words; longer stems as word prefixes.
  return term.length <= 4 ? words.includes(term) : words.some((word) => word.startsWith(term));
};

/** The catalogue service a message names explicitly, if any. */
export const matchService = (
  text: string,
  knowledge: AssistantKnowledge,
): AssistantKnowledge['services'][number] | undefined => {
  const words = text.split(' ').filter(Boolean);
  for (const alias of SERVICE_ALIASES) {
    if (!alias.terms.some((term) => matchesTerm(text, words, term))) continue;
    const service = knowledge.services.find((entry) => entry.id === alias.serviceId);
    if (service) return service;
  }
  return undefined;
};

// `\b` only knows ASCII word characters, so the end of the word is spelled out.
const AFFIRMATIVE = /^(да|ага|конечно|давайте|давай|хорошо|ок|окей|иә|ия|жарайды|yes|yeah|sure|ok|okay)(\s|$)/;

const hasKeyword = (text: string, group: string): boolean =>
  KEYWORDS[group].some((keyword) => text.includes(keyword));

/* ================================================================ SESSION */

export const createSession = (
  id: string,
  language: AssistantLanguage,
): AssistantSession => ({
  id,
  language,
  symptoms: { complaints: [] },
  handedOff: false,
  turns: 0,
});

const chips = (language: AssistantLanguage, keys: string[]): string[] =>
  keys.map((key) => SUGGESTIONS[language][key]).filter(Boolean);

/* ================================================================= INTENT */

const detectIntent = (text: string, session: AssistantSession, namesService = false): AssistantIntent => {
  // Naming a procedure together with a booking verb («записаться на ОКТ») is
  // a booking request even in the middle of a symptom interview.
  if (namesService && hasKeyword(text, 'booking')) return 'appointment_booking';
  // An in-flight symptom interview keeps priority so short answers such as
  // "both" or "a few days" are read as answers, not new questions.
  if (session.symptoms.complaints.length > 0 && !session.symptoms.duration) {
    return 'symptom_collection';
  }
  if (hasKeyword(text, 'operator')) return 'operator_handoff';
  if (hasKeyword(text, 'cancel')) return 'appointment_cancellation';
  if (hasKeyword(text, 'reschedule')) return 'appointment_rescheduling';
  if (hasKeyword(text, 'notifications')) return 'notifications';
  if (hasKeyword(text, 'booking')) return 'appointment_booking';
  if (hasKeyword(text, 'doctor')) return 'doctor_recommendation';
  if (hasKeyword(text, 'price')) return 'service_consultation';
  if (hasKeyword(text, 'symptoms')) return 'symptom_collection';
  // A bare procedure name («катаракта», «LASIK») is a service question.
  if (namesService) return 'service_consultation';
  return 'faq';
};

const routeDepartment = (text: string): string | undefined =>
  SYMPTOM_ROUTES.find((route) => route.terms.some((term) => text.includes(term)))?.department;

/* =============================================================== ANSWERING */

const answerFaq = (
  message: string,
  knowledge: AssistantKnowledge,
): { answer: string; confidence: number; id?: string } => {
  const tokens = tokenize(message);
  let best = { answer: '', confidence: 0, id: undefined as string | undefined };

  knowledge.faq.forEach((item) => {
    const value = Math.max(score(tokens, item.question), score(tokens, item.answer) * 0.7);
    if (value > best.confidence) best = { answer: item.answer, confidence: value, id: item.id };
  });

  return best;
};

const symptomFollowUp = (
  session: AssistantSession,
  language: AssistantLanguage,
): AssistantReply | null => {
  const { symptoms } = session;

  if (!symptoms.eye) {
    return {
      reply: phrase('askEye', language),
      intent: 'symptom_collection',
      suggestions: chips(language, ['both', 'one']),
      handoff: false,
      entities: { step: 'eye' },
      confidence: 1,
    };
  }

  if (!symptoms.duration) {
    return {
      reply: phrase('askDuration', language),
      intent: 'symptom_collection',
      suggestions: chips(language, ['today', 'days', 'weeks', 'months']),
      handoff: false,
      entities: { step: 'duration' },
      confidence: 1,
    };
  }

  return null;
};

const applySymptomAnswer = (text: string, symptoms: SymptomProfile) => {
  if (!symptoms.eye) {
    if (/(оба|обои|екеу|both)/.test(text)) symptoms.eye = 'both';
    else if (/(лев|сол|left)/.test(text)) symptoms.eye = 'left';
    else if (/(прав|оң|right)/.test(text)) symptoms.eye = 'right';
    else if (/(один|бір|one)/.test(text)) symptoms.eye = 'right';
  } else if (!symptoms.duration) {
    if (/(сегодня|бүгін|today|вчера)/.test(text)) symptoms.duration = 'today';
    else if (/(дн|күн|day)/.test(text)) symptoms.duration = 'days';
    else if (/(недел|апта|week)/.test(text)) symptoms.duration = 'weeks';
    else if (/(месяц|ай|month)/.test(text)) symptoms.duration = 'months';
  }

  symptoms.pain = symptoms.pain || /(боль|болит|ауыр|pain)/.test(text);
  symptoms.visionDrop =
    symptoms.visionDrop || /(упало зрение|резко|не вижу|көрмей|sudden|lost vision)/.test(text);
  // Sudden vision loss with pain is the one combination that must never wait
  // for an online booking flow.
  symptoms.urgent = Boolean(symptoms.pain && symptoms.visionDrop);
};

/* ================================================================ RESPOND */

export interface RespondInput {
  message: string;
  session: AssistantSession;
  knowledge: AssistantKnowledge;
}

export const respond = ({ message, session, knowledge }: RespondInput): AssistantReply => {
  const language = session.language;
  const text = normalise(message);
  session.turns += 1;

  if (session.turns === 1 && (!text || /^(привет|салем|сәлем|hi|hello|здравств)/.test(text))) {
    return {
      reply: phrase('greeting', language),
      intent: 'greeting',
      suggestions: chips(language, ['symptoms', 'service', 'doctor', 'booking', 'faq']),
      handoff: false,
      entities: {},
      confidence: 1,
    };
  }

  // «Да, продолжаем» after a recommendation opens the booking form that was
  // just offered, instead of starting the recommendation loop again.
  if (session.pendingBooking && AFFIRMATIVE.test(text)) {
    const target = session.pendingBooking;
    session.pendingBooking = undefined;
    return {
      reply: phrase('bookingOpen', language),
      intent: 'appointment_booking',
      suggestions: chips(language, ['operator']),
      handoff: false,
      entities: session.suggestedServiceId ? { serviceId: session.suggestedServiceId } : {},
      confidence: 1,
      action: { type: 'navigate', target },
    };
  }

  const service = matchService(text, knowledge);
  const intent = detectIntent(text, session, Boolean(service));

  switch (intent) {
    case 'operator_handoff': {
      session.handedOff = true;
      return {
        reply: phrase('operator', language),
        intent,
        suggestions: [],
        handoff: true,
        entities: {},
        confidence: 1,
        action: { type: 'call', target: 'contact-centre' },
      };
    }

    case 'appointment_cancellation':
      return {
        reply: phrase('cancel', language),
        intent,
        suggestions: chips(language, ['operator']),
        handoff: false,
        entities: { action: 'cancel' },
        confidence: 0.9,
        action: { type: 'cancel', target: '/account' },
      };

    case 'appointment_rescheduling':
      return {
        reply: phrase('reschedule', language),
        intent,
        suggestions: chips(language, ['operator']),
        handoff: false,
        entities: { action: 'reschedule' },
        confidence: 0.9,
        action: { type: 'reschedule', target: '/account' },
      };

    case 'notifications':
      return {
        reply: phrase('notifications', language),
        intent,
        suggestions: chips(language, ['booking', 'faq']),
        handoff: false,
        entities: {},
        confidence: 0.9,
      };

    case 'symptom_collection': {
      applySymptomAnswer(text, session.symptoms);

      const departmentId = routeDepartment(text) ?? session.suggestedDepartmentId;
      if (departmentId) session.suggestedDepartmentId = departmentId;
      if (text && session.symptoms.complaints.length < 5 && text.length > 3) {
        session.symptoms.complaints.push(message.trim());
      }

      if (session.symptoms.urgent) {
        session.handedOff = true;
        return {
          reply: phrase('urgent', language),
          intent: 'symptom_collection',
          suggestions: chips(language, ['operator']),
          handoff: true,
          entities: { urgency: 'high' },
          confidence: 1,
          action: { type: 'call', target: 'contact-centre' },
        };
      }

      const followUp = symptomFollowUp(session, language);
      if (followUp) return followUp;

      // Interview complete — convert the profile into a concrete suggestion.
      return recommend(session, knowledge, 'symptom_collection');
    }

    case 'doctor_recommendation':
    case 'service_consultation':
    case 'appointment_booking': {
      // A named procedure goes straight to that service (price, doctor and a
      // prefilled booking link) — never to the generic symptom prompt.
      // A precise FAQ hit («как подготовиться к ОКТ») still wins for questions.
      // «Записаться» right after talking about a service books that service.
      const named =
        service ??
        (intent === 'appointment_booking' && session.suggestedServiceId
          ? knowledge.services.find((entry) => entry.id === session.suggestedServiceId)
          : undefined);
      if (named) {
        session.suggestedServiceId = named.id;
        session.suggestedDepartmentId = named.departmentId;
        // A bare name («катаракта») matches any FAQ that mentions it, so only
        // a real question (three or more words) may be answered from the FAQ.
        const isQuestion = intent !== 'appointment_booking' && tokenize(message).length >= 3;
        const precise = isQuestion ? answerFaq(message, knowledge) : undefined;
        if (precise && precise.confidence >= 0.7) {
          return {
            reply: precise.answer,
            intent: 'faq',
            suggestions: chips(language, ['booking', 'prices', 'operator']),
            handoff: false,
            entities: precise.id ? { faqId: precise.id, serviceId: named.id } : { serviceId: named.id },
            confidence: precise.confidence,
          };
        }
        return recommend(session, knowledge, intent, named.id);
      }

      // "How do I book?" is a question the FAQ answers directly. Only fall
      // through to routing when the knowledge base has nothing strong, so a
      // plain question is never turned into a symptom interview.
      const faq = answerFaq(message, knowledge);
      if (faq.confidence >= 0.6) {
        return {
          reply: faq.answer,
          intent: 'faq',
          suggestions: chips(language, ['booking', 'service', 'operator']),
          handoff: false,
          entities: faq.id ? { faqId: faq.id } : {},
          confidence: faq.confidence,
        };
      }

      const departmentId = routeDepartment(text) ?? session.suggestedDepartmentId;
      if (departmentId) session.suggestedDepartmentId = departmentId;

      if (!departmentId) {
        return {
          reply: phrase('askSymptom', language),
          intent: 'service_recommendation',
          suggestions: knowledge.departments.slice(0, 5).map((department) => department.name),
          handoff: false,
          entities: {},
          confidence: 0.4,
        };
      }

      return recommend(session, knowledge, intent);
    }

    default: {
      const faq = answerFaq(message, knowledge);
      if (faq.confidence >= 0.45) {
        return {
          reply: faq.answer,
          intent: 'faq',
          suggestions: chips(language, ['booking', 'service', 'operator']),
          handoff: false,
          entities: faq.id ? { faqId: faq.id } : {},
          confidence: faq.confidence,
        };
      }

      const departmentId = routeDepartment(text);
      if (departmentId) {
        session.suggestedDepartmentId = departmentId;
        return recommend(session, knowledge, 'service_recommendation');
      }

      // Nothing matched: offer a handoff and let the caller log the gap.
      return {
        reply: phrase('fallback', language),
        intent: 'fallback',
        suggestions: chips(language, ['service', 'doctor', 'booking', 'operator']),
        handoff: false,
        entities: {},
        confidence: faq.confidence,
      };
    }
  }
};

/** Builds a service + doctor recommendation from the converged department. */
const recommend = (
  session: AssistantSession,
  knowledge: AssistantKnowledge,
  intent: AssistantIntent,
  serviceId?: string,
): AssistantReply => {
  const language = session.language;
  const department = knowledge.departments.find(
    (entry) => entry.id === session.suggestedDepartmentId,
  );

  if (!department) {
    return {
      reply: phrase('askSymptom', language),
      intent: 'service_recommendation',
      suggestions: knowledge.departments.slice(0, 5).map((entry) => entry.name),
      handoff: false,
      entities: {},
      confidence: 0.3,
    };
  }

  const chosen = serviceId ? knowledge.services.find((entry) => entry.id === serviceId) : undefined;
  const service = chosen ?? knowledge.services.find((entry) => entry.departmentId === department.id);
  const doctor = knowledge.doctors.find((entry) => entry.departmentIds.includes(department.id));

  session.suggestedServiceId = service?.id;
  session.suggestedDoctorId = doctor?.id;

  const lines = [fill(phrase('serviceIntro', language), { department: department.name })];

  if (service) {
    lines.push(
      fill(phrase('servicePrice', language), {
        service: service.name,
        price: service.price.toLocaleString('ru-RU'),
      }),
    );
  }
  if (doctor) {
    lines.push(fill(phrase('doctorIntro', language), { doctor: doctor.name, role: doctor.role }));
  }

  lines.push(phrase('disclaimer', language));
  lines.push(phrase('bookingReady', language));

  // An explicitly named service is prefilled; otherwise the department is.
  const target = chosen
    ? `/appointment?service=${chosen.slug}`
    : `/appointment?department=${department.slug}`;
  session.pendingBooking = target;

  return {
    reply: lines.join('\n\n'),
    intent,
    suggestions: chips(language, ['yes', 'doctor', 'prices', 'operator']),
    handoff: false,
    entities: {
      departmentId: department.id,
      ...(service ? { serviceId: service.id } : {}),
      ...(doctor ? { doctorId: doctor.id } : {}),
    },
    confidence: 0.85,
    action: { type: 'book', target },
  };
};

/* ====================================================== DIALOGUE ANALYSIS */

export interface DialogueAnalysis {
  sessionId: string;
  turns: number;
  intents: Record<string, number>;
  handoff: boolean;
  /** Turns whose confidence fell below the answer threshold. */
  unresolved: number;
  symptoms: SymptomProfile;
  /** Department the conversation converged on, if any. */
  outcome?: string;
}

/**
 * Summarises a finished conversation. The report drives two things: the
 * knowledge-base gap list (unresolved questions an editor should answer) and
 * the operator-handoff rate shown in the admin panel.
 */
export const analyseDialogue = (
  session: AssistantSession,
  replies: AssistantReply[],
): DialogueAnalysis => {
  const intents: Record<string, number> = {};
  let unresolved = 0;

  replies.forEach((reply) => {
    intents[reply.intent] = (intents[reply.intent] ?? 0) + 1;
    if (reply.confidence < 0.45) unresolved += 1;
  });

  return {
    sessionId: session.id,
    turns: session.turns,
    intents,
    handoff: session.handedOff,
    unresolved,
    symptoms: session.symptoms,
    outcome: session.suggestedDepartmentId,
  };
};

/** True when a question should be queued for a human to add to the FAQ. */
export const isKnowledgeGap = (reply: AssistantReply): boolean =>
  reply.intent === 'fallback' || reply.confidence < 0.45;
