import type { KnowledgeArticle, KnowledgeArticleBody } from './knowledge-types';
import { KNOWLEDGE_INDEX } from './knowledge-articles-index';

/**
 * Complete knowledge-base articles (meta + body) in one synchronous list.
 *
 * Only the admin content manager needs every body at once, so this module
 * imports them eagerly and lives in the admin chunk. Public pages must use
 * knowledge-articles-index.ts (metadata) and `loadArticleBody(slug)` instead — that
 * keeps the 17 bodies (~350 kB) out of the listing and every article.
 */

const bodies = import.meta.glob<KnowledgeArticleBody>('./knowledge-bodies/*.ts', {
  eager: true,
  import: 'default',
});

export const knowledgeArticles: KnowledgeArticle[] = KNOWLEDGE_INDEX.map((meta) => ({
  ...meta,
  ...bodies[`./knowledge-bodies/${meta.slug}.ts`],
}));

export { authorById, authorBySlug, type KnowledgeAuthor } from './knowledge-authors';
