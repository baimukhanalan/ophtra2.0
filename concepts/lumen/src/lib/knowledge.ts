import kindex from '../content/kindex.json';
import knowledgeJson from '../content/knowledge.json';

export interface ArticleMeta {
  id: string;
  slug: string;
  category: string;
  tags: string[];
  authorId: string;
  serviceSlug?: string;
  date: string;
  readingMinutes: number;
  title: string;
  excerpt: string;
  headings: string[];
  basedOn?: string;
}
export interface ArticleBody {
  sections: Array<{ id: string; title: string; body: string[]; list?: string[] }>;
  faq: Array<{ q: string; a: string }>;
  sources: Array<{ label: string; href: string }>;
}

export const ARTICLES = (kindex as unknown as { KNOWLEDGE_INDEX: ArticleMeta[] }).KNOWLEDGE_INDEX;
export const K = knowledgeJson as unknown as {
  KNOWLEDGE_CATEGORIES: Array<{ key: string; label: string; text: string; route: string }>;
  TAG_LABELS: Record<string, string>;
  knowledgeCopy: Record<string, string>;
  articleCopy: Record<string, string>;
  DISEASE_LIBRARY: Array<{ id: string; name: string; text: string; articleSlug?: string; route?: string; letter?: string }>;
  knowledgeFaq: Array<{ q: string; a: string }>;
  founderProfile: Record<string, unknown>;
  editorialProfile: Record<string, unknown>;
};

export const categoryLabel = (key: string) => K.KNOWLEDGE_CATEGORIES.find((c) => c.key === key)?.label ?? key;

const bodies = import.meta.glob<{ default: ArticleBody }>('../content/knowledgeBodies/*.json');
export const loadBody = async (slug: string): Promise<ArticleBody | null> => {
  const l = bodies[`../content/knowledgeBodies/${slug}.json`];
  if (!l) return null;
  return (await l()).default;
};

export const latestArticles = (n = 3) => [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
