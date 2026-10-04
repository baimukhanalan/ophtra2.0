/**
 * Assistant contract shared by the browser widget and the API.
 *
 * Keeping the types (and the engine next to them) in one module guarantees the
 * two runtimes can never drift: the server answers with exactly the shape the
 * widget renders, and the widget's offline fallback behaves identically.
 */

export type AssistantLanguage = 'ru' | 'kk' | 'en';

/** Every capability the assistant is specified to have. */
export type AssistantIntent =
  | 'greeting'
  | 'faq'
  | 'service_consultation'
  | 'service_recommendation'
  | 'doctor_recommendation'
  | 'symptom_collection'
  | 'appointment_booking'
  | 'appointment_cancellation'
  | 'appointment_rescheduling'
  | 'notifications'
  | 'operator_handoff'
  | 'fallback';

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  intent?: AssistantIntent;
  at: string;
}

/** Structured symptom profile built up across turns. */
export interface SymptomProfile {
  complaints: string[];
  eye?: 'left' | 'right' | 'both';
  duration?: 'today' | 'days' | 'weeks' | 'months';
  pain?: boolean;
  visionDrop?: boolean;
  /** Set when the answers contain a red-flag combination. */
  urgent?: boolean;
}

export interface AssistantSession {
  id: string;
  language: AssistantLanguage;
  symptoms: SymptomProfile;
  /** Slug of the department the conversation has converged on. */
  suggestedDepartmentId?: string;
  suggestedServiceId?: string;
  suggestedDoctorId?: string;
  /** Booking route offered in the last recommendation; a "yes" opens it. */
  pendingBooking?: string;
  /** Set once the visitor has been handed to a human operator. */
  handedOff: boolean;
  turns: number;
}

export interface AssistantReply {
  reply: string;
  intent: AssistantIntent;
  /** Quick-reply chips offered under the message. */
  suggestions: string[];
  /** True when a human operator should take over. */
  handoff: boolean;
  /** Extracted entities: departmentId, serviceId, doctorId, action… */
  entities: Record<string, string>;
  /** 0..1 match strength; low values feed the knowledge-base gap report. */
  confidence: number;
  /** Route the widget should offer to open (booking, account, page…). */
  action?: { type: 'navigate' | 'book' | 'cancel' | 'reschedule' | 'call'; target: string };
}

/** Minimal catalogue projection the engine needs; supplied by the caller. */
export interface AssistantKnowledge {
  faq: Array<{ id: string; topic: string; question: string; answer: string }>;
  departments: Array<{ id: string; slug: string; name: string; short: string; keywords: string[] }>;
  services: Array<{ id: string; slug: string; departmentId: string; name: string; price: number }>;
  doctors: Array<{ id: string; slug: string; name: string; role: string; departmentIds: string[] }>;
}

/**
 * Voice channel contract — reserved for the voice assistant described in the
 * specification as future architecture. The text engine already returns
 * everything a voice runtime needs (plain reply text plus a structured intent),
 * so adding speech means implementing this interface, not reworking the engine.
 */
export interface VoiceChannel {
  /** Speech-to-text for an inbound audio chunk. */
  transcribe(audio: ArrayBuffer, language: AssistantLanguage): Promise<string>;
  /** Text-to-speech for an assistant reply. */
  synthesize(text: string, language: AssistantLanguage): Promise<ArrayBuffer>;
  /** Barge-in support: whether the caller may interrupt playback. */
  readonly supportsInterruption: boolean;
}
