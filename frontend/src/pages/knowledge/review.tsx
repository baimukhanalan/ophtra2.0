import { Link } from 'react-router-dom';
import { ExternalLink, FileSearch, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n';
import { articleCopy } from '@/content/pages/knowledge';
import { authorById } from '@/content/pages/knowledge-authors';
import { publications } from '@/content/pages/science-publications';
import type { KnowledgeArticleMeta } from '@/content/pages/knowledge-types';

/* ========================================================= REVIEW STATUS */

/**
 * Medical-review line under the article hero. Shows the named reviewer only
 * when a real sign-off is recorded; otherwise an explicit placeholder, so an
 * unreviewed draft is never presented as reviewed.
 */
export const ReviewStatus = ({ article }: { article: KnowledgeArticleMeta }) => {
  const { L, formatDate } = useI18n();
  const reviewer = article.review ? authorById(article.review.reviewerId) : undefined;
  const papers = (article.basedOn ?? [])
    .map((id) => publications.find((paper) => paper.id === id))
    .filter((paper): paper is (typeof publications)[number] => Boolean(paper));

  return (
    <div className="oph-kb-review">
      {article.review && reviewer ? (
        <p className="oph-kb-reviewed">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>
            {L(articleCopy.reviewed)}: <Link to={reviewer.pageRoute}>{L(reviewer.name)}</Link>,{' '}
            <time dateTime={article.review.date}>{formatDate(article.review.date)}</time>
          </span>
        </p>
      ) : (
        <div className="oph-kb-review__pending" role="note">
          <p className="oph-kb-review__label">
            <FileSearch size={16} aria-hidden="true" />
            {L(articleCopy.reviewPendingLabel)}
          </p>
          <p className="oph-kb-review__text">{L(articleCopy.reviewPending)}</p>
        </div>
      )}
      {papers.length ? (
        <div className="oph-kb-review__basis">
          <p className="oph-kb-review__text">{L(articleCopy.basedOn)}</p>
          <ul>
            {papers.map((paper) => (
              <li key={paper.id}>
                <a className="oph-kb-textlink" href={paper.href} target="_blank" rel="noopener noreferrer">
                  {/* One text run: the link is a flex row, so bare text nodes
                      would each become an item and get the gap between them. */}
                  <span>
                    {L(articleCopy.paperLink)}: <em>{paper.journal}</em>, {paper.year}
                  </span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
