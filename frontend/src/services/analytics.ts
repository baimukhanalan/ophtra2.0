/**
 * Digital marketing and analytics layer.
 *
 * Covers the tracking stack required by the specification (§18):
 * GA4 · Google Tag Manager · Microsoft Clarity · Google Search Console
 * verification · Yandex Metrica · Meta Pixel · TikTok Pixel · call tracking ·
 * end-to-end analytics, plus campaign/lead-source tracking, lead / conversion /
 * country / appointment-request events, funnels, segmentation, remarketing
 * audiences and A/B testing.
 *
 * IDs come from Vite env vars (VITE_GA4_ID, VITE_GTM_ID, VITE_CLARITY_ID,
 * VITE_GSC_VERIFICATION, …). Every vendor tag is loaded only when its ID is
 * configured AND analytics consent has been granted, so a deployment without
 * IDs ships zero third-party requests. The Search Console verification meta
 * tag is not a tracker and is applied regardless of consent.
 */

import { api } from './api';
import type { UtmPayload } from '@/types';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ym?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string };
    ttq?: Record<string, unknown> & { track?: (...args: unknown[]) => void };
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

const env = import.meta.env;

export const analyticsConfig = {
  ga4: (env.VITE_GA4_ID as string | undefined) ?? '',
  gtm: (env.VITE_GTM_ID as string | undefined) ?? '',
  yandex: (env.VITE_YANDEX_METRICA_ID as string | undefined) ?? '',
  metaPixel: (env.VITE_META_PIXEL_ID as string | undefined) ?? '',
  tiktokPixel: (env.VITE_TIKTOK_PIXEL_ID as string | undefined) ?? '',
  /** Microsoft Clarity project ID (session heatmaps; masked by default). */
  clarity: (env.VITE_CLARITY_ID as string | undefined) ?? '',
  /** Google Search Console `google-site-verification` meta content. */
  gscVerification: (env.VITE_GSC_VERIFICATION as string | undefined) ?? '',
  /** Pool of tracked numbers used for call tracking by traffic source. */
  callTracking: (env.VITE_CALL_TRACKING_MAP as string | undefined) ?? '',
};

const STORAGE = {
  session: 'ophtra.session',
  attribution: 'ophtra.attribution',
  consent: 'ophtra.consent.analytics',
  experiments: 'ophtra.experiments',
  segments: 'ophtra.segments',
};

/* ================================================================ SESSION */

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'ssr';
  let id = window.sessionStorage.getItem(STORAGE.session);
  if (!id) {
    id = createId();
    window.sessionStorage.setItem(STORAGE.session, id);
  }
  return id;
};

/* ============================================================ ATTRIBUTION */

export interface Attribution {
  utm: UtmPayload;
  /** First page the visitor landed on. */
  landing: string;
  referrer: string;
  /** Human-readable lead source used by the CRM. */
  source: string;
  firstSeen: string;
  /** Click identifiers used for offline conversion upload. */
  clickIds: Record<string, string>;
}

const CLICK_ID_KEYS = ['gclid', 'yclid', 'fbclid', 'ttclid', '_openstat'];

const deriveSource = (utm: UtmPayload, referrer: string): string => {
  if (utm.source) return `${utm.source}${utm.medium ? ` / ${utm.medium}` : ''}`;
  if (!referrer) return 'direct';
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (host === window.location.hostname) return 'direct';
    if (/google\./.test(host)) return 'google / organic';
    if (/yandex\./.test(host)) return 'yandex / organic';
    if (/(instagram|facebook|tiktok|t\.me|vk\.com)/.test(host)) return `${host} / social`;
    return `${host} / referral`;
  } catch {
    return 'direct';
  }
};

/**
 * Captures campaign parameters on the first page of the session and keeps them
 * for the whole visit, so a lead submitted three pages later is still credited
 * to the campaign that brought the visitor in.
 */
export const captureAttribution = (): Attribution => {
  if (typeof window === 'undefined') {
    return { utm: {}, landing: '', referrer: '', source: 'ssr', firstSeen: '', clickIds: {} };
  }

  const stored = window.sessionStorage.getItem(STORAGE.attribution);
  if (stored) {
    try {
      return JSON.parse(stored) as Attribution;
    } catch {
      /* corrupted value — recapture below */
    }
  }

  const params = new URLSearchParams(window.location.search);
  const utm: UtmPayload = {
    source: params.get('utm_source') ?? undefined,
    medium: params.get('utm_medium') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    content: params.get('utm_content') ?? undefined,
    term: params.get('utm_term') ?? undefined,
  };

  const clickIds: Record<string, string> = {};
  CLICK_ID_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) clickIds[key] = value;
  });

  const attribution: Attribution = {
    utm,
    landing: window.location.pathname,
    referrer: document.referrer,
    source: deriveSource(utm, document.referrer),
    firstSeen: new Date().toISOString(),
    clickIds,
  };

  window.sessionStorage.setItem(STORAGE.attribution, JSON.stringify(attribution));
  return attribution;
};

export const getAttribution = (): Attribution => captureAttribution();

/* ================================================================ CONSENT */

export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE.consent) === 'granted';
  } catch {
    return false;
  }
};

export const setAnalyticsConsent = (granted: boolean) => {
  try {
    window.localStorage.setItem(STORAGE.consent, granted ? 'granted' : 'denied');
  } catch {
    /* storage blocked — the choice applies to this page view only */
  }
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  });
  // Clarity keeps its cookies only after an explicit consent signal.
  window.clarity?.('consent', granted);
  if (granted) loadVendorTags();
};

/** Event fired on window when the stored choice is cleared (legal pages). */
export const CONSENT_RESET_EVENT = 'ophtra:consent-reset';

/**
 * GDPR: withdrawing consent must be as easy as giving it. Clears the stored
 * choice and asks the cookie card to reappear; tags already loaded stop
 * receiving events because `track` re-checks consent on every call.
 */
export const resetAnalyticsConsent = () => {
  try {
    window.localStorage.removeItem(STORAGE.consent);
  } catch {
    /* nothing stored */
  }
  window.gtag?.('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.clarity?.('consent', false);
  window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
};

/* ================================================ SEARCH CONSOLE VERIFICATION */

/**
 * Adds `<meta name="google-site-verification">` when VITE_GSC_VERIFICATION is
 * set. Not a tracker, so it does not wait for consent. (HTML-file verification
 * is also written at build time by scripts/generate-seo.mjs.)
 */
export const applySearchConsoleVerification = () => {
  if (typeof document === 'undefined' || !analyticsConfig.gscVerification) return;
  if (document.head.querySelector('meta[name="google-site-verification"]')) return;
  const meta = document.createElement('meta');
  meta.name = 'google-site-verification';
  meta.content = analyticsConfig.gscVerification;
  document.head.appendChild(meta);
};

applySearchConsoleVerification();

/* =============================================================== LOADING */

const injected = new Set<string>();

const injectScript = (id: string, src: string, attrs: Record<string, string> = {}) => {
  if (injected.has(id) || document.getElementById(id)) return;
  injected.add(id);
  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.src = src;
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.appendChild(script);
};

let vendorsLoaded = false;

/** Loads every configured vendor tag. Idempotent. */
export const loadVendorTags = () => {
  if (vendorsLoaded || typeof window === 'undefined' || !hasAnalyticsConsent()) return;
  vendorsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ??
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };

  // Consent Mode v2: tags only ever load after consent, but declaring the
  // default keeps GA4/GTM behaviour correct if the choice is later withdrawn.
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });

  if (analyticsConfig.ga4) {
    injectScript('ga4', `https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.ga4}`);
    window.gtag('js', new Date());
    window.gtag('config', analyticsConfig.ga4, { send_page_view: false, anonymize_ip: true });
  }

  if (analyticsConfig.clarity) {
    window.clarity =
      window.clarity ??
      (Object.assign(
        function clarity(...args: unknown[]) {
          (window.clarity!.q = window.clarity!.q || []).push(args);
        },
        { q: [] as unknown[] },
      ) as NonNullable<Window['clarity']>);
    injectScript('clarity', `https://www.clarity.ms/tag/${encodeURIComponent(analyticsConfig.clarity)}`);
    window.clarity('consent', true);
  }

  if (analyticsConfig.gtm) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    injectScript('gtm', `https://www.googletagmanager.com/gtm.js?id=${analyticsConfig.gtm}`);
  }

  if (analyticsConfig.yandex) {
    injectScript('ym', 'https://mc.yandex.ru/metrika/tag.js');
    window.ym =
      window.ym ??
      function ym(...args: unknown[]) {
        (window.ym as unknown as { a: unknown[][] }).a =
          (window.ym as unknown as { a?: unknown[][] }).a || [];
        (window.ym as unknown as { a: unknown[][] }).a.push(args);
      };
    window.ym(Number(analyticsConfig.yandex), 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false,
    });
  }

  if (analyticsConfig.metaPixel) {
    injectScript('meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
    const fbq: Window['fbq'] = ((...args: unknown[]) => {
      fbq!.queue = fbq!.queue || [];
      fbq!.queue.push(args);
    }) as NonNullable<Window['fbq']>;
    window.fbq = window.fbq ?? fbq;
    window.fbq('init', analyticsConfig.metaPixel);
  }

  if (analyticsConfig.tiktokPixel) {
    injectScript(
      'tiktok-pixel',
      `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${analyticsConfig.tiktokPixel}`,
    );
  }
};

/* ================================================================ EVENTS */

export type FunnelStep =
  | 'view_home'
  | 'view_service'
  | 'booking_started'
  | 'booking_clinic_selected'
  | 'booking_service_selected'
  | 'booking_doctor_selected'
  | 'booking_slot_selected'
  | 'booking_submitted'
  | 'booking_confirmed'
  | 'lead_submitted'
  | 'payment_started'
  | 'payment_completed'
  | 'assistant_opened'
  | 'assistant_handoff'
  | 'call_click'
  | 'whatsapp_click'
  | 'appointment_request'
  | 'generate_lead';

/**
 * Funnel events that count as conversions. They are mirrored to GA4's
 * recommended names (`generate_lead`) and to an `appointment_request`
 * conversion so a GA4 property can mark them as key events without GTM work.
 */
const LEAD_EVENTS = new Set(['lead_submitted', 'lead_queued']);
const APPOINTMENT_EVENTS = new Set(['booking_submitted', 'booking_confirmed']);

/**
 * Visitor country for segmentation, without geo-IP: the region subtag of the
 * browser locale, else the time zone. Server-side enrichment may override it.
 */
export const inferCountry = (): string => {
  if (typeof window === 'undefined') return '';
  const region = window.navigator.language.split('-')[1];
  if (region && /^[A-Za-z]{2}$/.test(region)) return region.toUpperCase();
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (/^Asia\/(Almaty|Qostanay|Aqtobe|Aqtau|Atyrau|Oral|Qyzylorda)$/.test(zone)) return 'KZ';
    if (/^Europe\/(Moscow|Samara|Volgograd)$/.test(zone)) return 'RU';
    if (zone === 'Asia/Tashkent' || zone === 'Asia/Samarkand') return 'UZ';
    if (zone === 'Asia/Bishkek') return 'KG';
  } catch {
    /* Intl unavailable */
  }
  return '';
};

/**
 * Single dispatch point. Fans one logical event out to every configured
 * vendor plus the backend, which stores it for end-to-end analytics.
 */
export const track = (name: FunnelStep | string, payload: Record<string, unknown> = {}) => {
  const attribution = getAttribution();
  const enriched = {
    country: inferCountry(),
    ...payload,
    session_id: getSessionId(),
    lead_source: attribution.source,
    utm_source: attribution.utm.source,
    utm_medium: attribution.utm.medium,
    utm_campaign: attribution.utm.campaign,
  };

  // Backend receives every event regardless of consent — it is first-party,
  // pseudonymous and required to reconcile online events with clinic outcomes.
  void api.track({ name, payload: enriched, sessionId: getSessionId() });

  if (!hasAnalyticsConsent()) return;

  window.dataLayer?.push({ event: name, ...enriched });
  window.gtag?.('event', name, enriched);
  window.ym?.(Number(analyticsConfig.yandex), 'reachGoal', name, enriched);
  window.fbq?.('trackCustom', name, enriched);
  window.ttq?.track?.(name, enriched);

  if (LEAD_EVENTS.has(name)) {
    window.gtag?.('event', 'generate_lead', { ...enriched, currency: 'KZT', value: 0 });
    window.dataLayer?.push({ event: 'generate_lead', ...enriched });
    window.clarity?.('event', 'generate_lead');
  }
  if (APPOINTMENT_EVENTS.has(name)) {
    window.gtag?.('event', 'appointment_request', enriched);
    window.dataLayer?.push({ event: 'appointment_request', ...enriched });
    window.clarity?.('event', 'appointment_request');
  }
};

/** Lead with CRM context (form source, country, service) — spec §13/§18. */
export const trackLead = (lead: { form: string; country?: string; service?: string; diagnosis?: string }) =>
  track('lead_submitted', {
    form: lead.form,
    ...(lead.country ? { country: lead.country } : {}),
    ...(lead.service ? { service: lead.service } : {}),
    ...(lead.diagnosis ? { has_diagnosis: true } : {}),
  });

/** Appointment request from the booking wizard or a consultation form. */
export const trackAppointmentRequest = (details: { service?: string; clinic?: string; country?: string } = {}) =>
  track('appointment_request', details);

export const trackPageView = (path: string, title: string) => {
  if (!hasAnalyticsConsent()) return;
  window.gtag?.('event', 'page_view', { page_path: path, page_title: title });
  window.ym?.(Number(analyticsConfig.yandex), 'hit', path, { title });
  window.fbq?.('track', 'PageView');
  window.dataLayer?.push({ event: 'page_view', page_path: path, page_title: title });
};

/** Conversion with monetary value — used for remarketing and ROAS. */
export const trackConversion = (name: string, value: number, currency = 'KZT') => {
  track(name, { value, currency });
  if (!hasAnalyticsConsent()) return;
  window.gtag?.('event', 'conversion', { value, currency, send_to: analyticsConfig.ga4 });
  window.fbq?.('track', 'Purchase', { value, currency });
};

/* ========================================================= CALL TRACKING */

/**
 * Dynamic number insertion. VITE_CALL_TRACKING_MAP holds
 * `source:number` pairs, e.g. `google:+77271111111,yandex:+77272222222`.
 * The visitor sees the number tied to the channel that brought them in, so
 * calls are attributed to a campaign without any client-side call recording.
 */
export const resolveTrackedPhone = (fallback: string): string => {
  if (!analyticsConfig.callTracking) return fallback;
  const attribution = getAttribution();
  const key = attribution.utm.source ?? attribution.source.split(' / ')[0];

  const map = new Map(
    analyticsConfig.callTracking.split(',').map((pair) => {
      const [source, number] = pair.split(':');
      return [source?.trim(), number?.trim()] as [string, string];
    }),
  );

  return map.get(key) ?? map.get('default') ?? fallback;
};

export const trackCall = (phone: string) => track('call_click', { phone });

/* ============================================================ EXPERIMENTS */

/**
 * Deterministic A/B assignment. The bucket is stored per visitor so the
 * experience stays stable across sessions, and is attached to every event so
 * conversion can be compared per variant.
 */
export const getVariant = <T extends string>(experiment: string, variants: T[]): T => {
  if (typeof window === 'undefined') return variants[0];

  const stored = JSON.parse(window.localStorage.getItem(STORAGE.experiments) ?? '{}') as Record<
    string,
    string
  >;

  if (stored[experiment] && variants.includes(stored[experiment] as T)) {
    return stored[experiment] as T;
  }

  const variant = variants[Math.floor(Math.random() * variants.length)];
  stored[experiment] = variant;
  window.localStorage.setItem(STORAGE.experiments, JSON.stringify(stored));
  track('experiment_assigned', { experiment, variant });
  return variant;
};

/* ============================================================== SEGMENTS */

/**
 * Behavioural segmentation for remarketing audiences: the tags accumulate as
 * the visitor engages (viewed laser pages, started a booking, and so on).
 */
export const addSegment = (segment: string) => {
  if (typeof window === 'undefined') return;
  const segments = new Set<string>(
    JSON.parse(window.localStorage.getItem(STORAGE.segments) ?? '[]') as string[],
  );
  if (segments.has(segment)) return;
  segments.add(segment);
  window.localStorage.setItem(STORAGE.segments, JSON.stringify([...segments]));
  track('segment_added', { segment, segments: [...segments] });
};

export const getSegments = (): string[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(window.localStorage.getItem(STORAGE.segments) ?? '[]') as string[];
};
