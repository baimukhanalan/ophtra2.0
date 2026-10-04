import type { Language, Localized } from '@/i18n/types';

/**
 * Structured medical content for a service page (spec §6: every service page
 * carries Overview · Indications · Diagnostics · Treatment options · FAQ ·
 * Related articles · Consultation form).
 *
 * The catalogue record itself (name, short, price, duration, department)
 * stays in data/services.json; this layer adds the long-form copy, keyed by
 * the service slug.
 */

/** Same list in each language: `{ ru: [...], kk: [...], en: [...] }`. */
export type LocalizedList = Record<Language, string[]>;

export interface ServiceFaq {
  q: Localized;
  a: Localized;
}

export interface ServiceSource {
  /** Publisher and title, e.g. "National Eye Institute — Glaucoma". */
  label: string;
  href: string;
}

export interface ServiceContent {
  /**
   * Drives the JSON-LD type:
   * - 'test'         → MedicalTest (OCT, perimetry, topography, diagnostics)
   * - 'consultation' → MedicalProcedure, procedureType Noninvasive
   * - 'therapy'      → MedicalProcedure, procedureType Therapeutic
   * - 'surgery'      → MedicalProcedure, procedureType Surgical
   */
  kind: 'test' | 'consultation' | 'therapy' | 'surgery';
  /** Hero lead — one or two calm sentences. */
  lead: Localized;
  /** «Обзор» — two short paragraphs. */
  overview: LocalizedList;
  /** «Показания» — 4–6 ring-bullet items. */
  indications: LocalizedList;
  /** «Диагностика» — what is checked before / as part of the service. */
  diagnostics: { intro: Localized; list: LocalizedList };
  /** «Варианты лечения» — options and how the choice is made. */
  treatment: { intro: Localized; list: LocalizedList };
  /** «Подготовка» — optional practical bullets. */
  preparation?: LocalizedList;
  /** «Результат и восстановление» — optional paragraph. */
  result?: Localized;
  /** Exactly three questions. */
  faq: ServiceFaq[];
  /** One or two reputable sources with real URLs. */
  sources: ServiceSource[];
  /**
   * Lower-case Russian word stems used to find related knowledge-base
   * articles by title/category, e.g. ['катаракт', 'хрусталик'].
   */
  topics: string[];
}

export type ServiceContentMap = Record<string, ServiceContent>;
