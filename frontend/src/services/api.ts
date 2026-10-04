/**
 * OPHTRA API client.
 *
 * The site is API-first: every mutation (bookings, leads, payments, admin
 * edits) goes to the backend. Read-only catalogue endpoints degrade to the
 * bundled seed dataset so the public site never shows an error page because a
 * back-office service is restarting.
 */

import type {
  Appointment,
  Article,
  BookingDraft,
  Clinic,
  Department,
  Doctor,
  ExamResult,
  FaqItem,
  Invoice,
  Lead,
  NewsItem,
  Patient,
  Prescription,
  Program,
  Promotion,
  Recommendation,
  Review,
  Service,
  Slot,
  Vacancy,
} from '@/types';
import * as seed from '@/content';

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Bearer token for account and admin endpoints. */
  token?: string | null;
  signal?: AbortSignal;
}

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, token, signal } = options;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  // Caller-provided cancellation must also abort the in-flight request.
  signal?.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (response.status === 204) return undefined as T;

    // A static deployment rewrites unknown paths to index.html, so an absent
    // API answers 200 with HTML. Without this check the client would hand a
    // null payload to callers and they would crash on it.
    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      throw new ApiError('API unavailable', response.status || 503, 'api_unavailable');
    }

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const detail = (payload ?? {}) as { message?: string; code?: string };
      throw new ApiError(detail.message ?? 'Request failed', response.status, detail.code);
    }

    if (payload === null) {
      throw new ApiError('Empty response body', response.status, 'empty_response');
    }

    return payload as T;
  } finally {
    window.clearTimeout(timeout);
  }
};

/**
 * Read-only helper: try the API, fall back to the bundled dataset.
 * Only ever used for public catalogue content.
 */
const readOrSeed = async <T>(path: string, fallback: () => T | Promise<T>): Promise<T> => {
  try {
    return await request<T>(path);
  } catch {
    return fallback();
  }
};

/*
 * Editorial seed data is imported on demand rather than at module scope: this
 * file is part of the app shell, and static imports would pull ~90 kB of
 * articles, news and legal text into the first paint of every page just to have
 * a fallback that is only read when the API is unreachable. One import per
 * dataset, so an unreachable /news does not also drag in every article.
 */

/* =============================================================== CATALOGUE */

export const api = {
  clinics: () => readOrSeed<Clinic[]>('/clinics', () => seed.clinics),
  departments: () => readOrSeed<Department[]>('/departments', () => seed.departments),
  services: () => readOrSeed<Service[]>('/services', () => seed.services),
  doctors: () => readOrSeed<Doctor[]>('/doctors', () => seed.doctors),
  programs: () => readOrSeed<Program[]>('/programs', () => seed.programs),
  promotions: () => readOrSeed<Promotion[]>('/promotions', () => import('@/content/promotions').then((m) => m.activePromotions())),
  news: () => readOrSeed<NewsItem[]>('/news', () => import('@/content/news').then((m) => m.publishedNews())),
  articles: () => readOrSeed<Article[]>('/articles', () => import('@/content/articles').then((m) => m.publishedArticles())),
  faq: () => readOrSeed<FaqItem[]>('/faq', () => import('@/content/faq').then((m) => m.faq)),
  reviews: () => readOrSeed<Review[]>('/reviews', () => seed.reviews),
  vacancies: () => readOrSeed<Vacancy[]>('/vacancies', () => import('@/content/vacancies').then((m) => m.publishedVacancies())),

  /* ============================================================== BOOKING */

  /**
   * Free slots for a doctor (or a whole department when doctorId is omitted).
   * Backed by the MIS integration layer on the server.
   */
  slots: (params: { date: string; doctorId?: string; departmentId?: string; clinicId: string }) => {
    const query = new URLSearchParams({ date: params.date, clinicId: params.clinicId });
    if (params.doctorId) query.set('doctorId', params.doctorId);
    if (params.departmentId) query.set('departmentId', params.departmentId);
    return request<Slot[]>(`/booking/slots?${query.toString()}`);
  },

  createAppointment: (draft: BookingDraft & { utm: Record<string, string | undefined>; source: string }) =>
    request<Appointment>('/booking/appointments', { method: 'POST', body: draft }),

  cancelAppointment: (id: string, token: string) =>
    request<Appointment>(`/booking/appointments/${id}/cancel`, { method: 'POST', token }),

  rescheduleAppointment: (id: string, body: { date: string; time: string }, token: string) =>
    request<Appointment>(`/booking/appointments/${id}/reschedule`, { method: 'POST', body, token }),

  /* ================================================================= CRM */

  /** Contact-form and callback leads. Transferred to CRM server-side. */
  createLead: (lead: Lead) => request<{ id: string }>('/crm/leads', { method: 'POST', body: lead }),

  /* ============================================================= ACCOUNT */

  /**
   * Requests a one-time code. Outside production, when no SMS or WhatsApp
   * provider is configured, the server returns the code so the UI can show it —
   * otherwise the demo account would be impossible to enter.
   */
  requestCode: (phone: string) =>
    request<{ sent: boolean; demoCode?: string }>('/account/request-code', {
      method: 'POST',
      body: { phone },
    }),

  verifyCode: (phone: string, code: string) =>
    request<{ token: string; patient: Patient }>('/account/verify-code', {
      method: 'POST',
      body: { phone, code },
    }),

  account: (token: string) =>
    request<{
      patient: Patient;
      appointments: Appointment[];
      prescriptions: Prescription[];
      recommendations: Recommendation[];
      results: ExamResult[];
      invoices: Invoice[];
    }>('/account', { token }),

  /* ============================================================ PAYMENTS */

  pay: (invoiceId: string, token: string) =>
    request<Invoice>(`/payments/${invoiceId}/pay`, { method: 'POST', token }),

  refund: (invoiceId: string, token: string) =>
    request<Invoice>(`/payments/${invoiceId}/refund`, { method: 'POST', token }),

  /* =========================================================== ASSISTANT */

  assistant: (body: {
    message: string;
    language: string;
    sessionId: string;
    context?: Record<string, unknown>;
  }) =>
    request<{
      reply: string;
      intent: string;
      suggestions: string[];
      handoff: boolean;
      entities?: Record<string, string>;
    }>('/assistant/message', { method: 'POST', body }),

  assistantTranscript: (sessionId: string, body: { messages: unknown[]; language: string }) =>
    request<{ stored: boolean }>(`/assistant/sessions/${sessionId}/analysis`, {
      method: 'POST',
      body,
    }),

  /* =============================================================== ADMIN */

  adminLogin: (login: string, password: string) =>
    request<{ token: string }>('/admin/login', { method: 'POST', body: { login, password } }),

  adminCollection: <T>(collection: string, token: string) =>
    request<T[]>(`/admin/${collection}`, { token }),

  adminSave: <T>(collection: string, id: string, body: Partial<T>, token: string) =>
    request<T>(`/admin/${collection}/${id}`, { method: 'PATCH', body, token }),

  adminCreate: <T>(collection: string, body: Partial<T>, token: string) =>
    request<T>(`/admin/${collection}`, { method: 'POST', body, token }),

  adminDelete: (collection: string, id: string, token: string) =>
    request<void>(`/admin/${collection}/${id}`, { method: 'DELETE', token }),

  adminLeads: (token: string) => request<Lead[]>('/admin/leads', { token }),

  /* =========================================================== ANALYTICS */

  /** End-to-end analytics: browser events joined with server-side outcomes. */
  track: (event: { name: string; payload: Record<string, unknown>; sessionId: string }) =>
    request<void>('/analytics/events', { method: 'POST', body: event }).catch(() => undefined),
};

export type Api = typeof api;
