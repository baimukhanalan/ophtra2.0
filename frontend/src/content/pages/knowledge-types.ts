import type { Language, Localized } from '@/i18n/types';

/**
 * Knowledge base data model (spec §6.7, §6.8, §16).
 *
 * knowledge-articles-index.ts holds the metadata of every article (small, shipped with
 * the listing); each body lives in knowledge-bodies/<slug>.ts and is loaded
 * only when that article is opened.
 */

/** The eight knowledge-base themes from the specification. */
export type KnowledgeCategory =
  | 'children'
  | 'after40'
  | 'surgery'
  | 'retina'
  | 'glaucoma'
  | 'library'
  | 'research'
  | 'prevention';

/** Controlled tag vocabulary (labels live in content/pages/knowledge.ts). */
export type KnowledgeTag =
  | 'myopia'
  | 'children'
  | 'cataract'
  | 'lens-implants'
  | 'laser-correction'
  | 'glaucoma'
  | 'eye-pressure'
  | 'retina'
  | 'macula'
  | 'diabetes'
  | 'dry-eye'
  | 'screens'
  | 'contact-lenses'
  | 'prevention'
  | 'diagnostics'
  | 'oct'
  | 'ai'
  | 'research'
  | 'neuro'
  | 'keratoconus'
  | 'amblyopia'
  | 'strabismus'
  | 'presbyopia'
  | 'emergency'
  | 'surgery';

/** Same list in each language: `{ ru: [...], kk: [...], en: [...] }`. */
export type LocalizedList = Record<Language, string[]>;

export interface KnowledgeSection {
  /** Anchor id, kebab-case, unique within the article (e.g. 'what-is-it'). */
  id: string;
  title: Localized;
  /** Paragraphs. */
  body: LocalizedList;
  /** Optional ring-bullet list shown after the paragraphs. */
  list?: LocalizedList;
}

export interface KnowledgeFaq {
  q: Localized;
  a: Localized;
}

export interface KnowledgeSource {
  label: string;
  href: string;
}

/** Long-form part of an article: loaded on demand, one module per slug. */
export interface KnowledgeArticleBody {
  sections: KnowledgeSection[];
  faq: KnowledgeFaq[];
  sources: KnowledgeSource[];
}

/**
 * Sign-off by a named clinician. Left empty until a real doctor has reviewed
 * the text; the article then shows the «медицинская проверка» placeholder
 * instead of claiming a review that has not happened.
 */
export interface KnowledgeReview {
  /** Author id (knowledge-authors.ts) of the reviewing clinician. */
  reviewerId: string;
  /** ISO date of the review. */
  date: string;
}

/** Everything the listing, search and related blocks need — no body text. */
export interface KnowledgeArticleMeta {
  id: string;
  slug: string;
  category: KnowledgeCategory;
  tags: KnowledgeTag[];
  /** Doctor id from data/doctors.json, or 'editorial' for the editorial team. */
  authorId: string;
  /** Slug of a record in data/services.json, linked from «Продолжить знакомство». */
  serviceSlug?: string;
  /** Publication ids (content/pages/science.ts) the material explains. */
  basedOn?: string[];
  /** ISO date, e.g. '2026-08-14'. */
  date: string;
  readingMinutes: number;
  title: Localized;
  excerpt: Localized;
  /** Section titles, in order — used by search. */
  headings: Localized[];
  review?: KnowledgeReview;
}

/** A complete article (meta + body), e.g. for the admin seed. */
export type KnowledgeArticle = KnowledgeArticleMeta & KnowledgeArticleBody;
