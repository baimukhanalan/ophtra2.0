import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock3, ExternalLink, Play, UserRound } from 'lucide-react';
import { useI18n } from '@/i18n';
import type { Localized } from '@/i18n/types';
import { Reveal } from '@/motion';
import { EditorialCard, EditorialGrid } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { articleCopy, authorCopy, categoryInfo, knowledgeCopy } from '@/content/pages/knowledge';
import { authorById, type KnowledgeAuthor } from '@/content/pages/knowledge-authors';
import type { KnowledgeArticleMeta } from '@/content/pages/knowledge-types';

/**
 * Pieces shared by the knowledge base, article, author, science and media
 * pages. Page-level CSS lives in styles/pages/knowledge.css (`oph-kb-*`).
 */

export const articlePath = (slug: string) => `${ROUTES.knowledge}/${slug}`;

/* ============================================================== MONOGRAM */

/** Initials in the Figma ring motif — used instead of stock portraits. */
export const Monogram = ({ name, size = 'md' }: { name: string; size?: 'md' | 'lg' }) => (
  <span className={`oph-kb-mono oph-kb-mono--${size}`} aria-hidden="true">
    {name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')}
  </span>
);

/* ========================================================== ARTICLE META */

/** Hero meta line: author link · date · reading time. */
export const ArticleMeta = ({ article }: { article: KnowledgeArticleMeta }) => {
  const { L, formatDate } = useI18n();
  const author = authorById(article.authorId);
  return (
    <ul className="oph-kb-meta">
      {author ? (
        <li>
          <UserRound size={14} aria-hidden="true" />
          <Link to={author.pageRoute}>{L(author.name)}</Link>
        </li>
      ) : null}
      <li>
        <CalendarDays size={14} aria-hidden="true" />
        <span className="oph-visually-hidden">{L(articleCopy.published)}: </span>
        <time dateTime={article.date}>{formatDate(article.date)}</time>
      </li>
      <li>
        <Clock3 size={14} aria-hidden="true" />
        {article.readingMinutes} {L(knowledgeCopy.minutes)}
      </li>
    </ul>
  );
};

/* ========================================================== ARTICLE GRID */

/** Figma «07 База знаний» bento of materials. */
export const ArticleGrid = ({ articles }: { articles: KnowledgeArticleMeta[] }) => {
  const { L, formatDate } = useI18n();
  return (
    <EditorialGrid className="oph-kb-egrid">
      {articles.map((article) => {
        const author = authorById(article.authorId);
        return (
          <EditorialCard
            key={article.id}
            eyebrow={L(categoryInfo(article.category).label)}
            title={L(article.title)}
            text={L(article.excerpt)}
            to={articlePath(article.slug)}
            linkLabel={L(knowledgeCopy.open)}
            meta={
              <>
                <time dateTime={article.date}>{formatDate(article.date)}</time>
                <span>
                  {article.readingMinutes} {L(knowledgeCopy.minutes)}
                </span>
                {author ? <span>{L(author.name)}</span> : null}
              </>
            }
          />
        );
      })}
    </EditorialGrid>
  );
};

/* ============================================================ AUTHOR CARD */

/** Expert authorship card (spec §16). */
export const AuthorCard = ({
  author,
  heading,
  headingId,
}: {
  author: KnowledgeAuthor;
  heading?: string;
  headingId?: string;
}) => {
  const { L } = useI18n();
  return (
    <Reveal variant="up" className="oph-kb-author">
      <Monogram name={L(author.name)} size="lg" />
      <div className="oph-kb-author__body">
        {heading ? <p className="oph-eyebrow">{heading}</p> : null}
        <h2 id={headingId} className="oph-kb-author__name">
          {L(author.name)}
        </h2>
        <p className="oph-kb-author__role">{L(author.role)}</p>
        <p className="oph-kb-author__cred">{L(author.credentials)}</p>
        <p className="oph-kb-author__bio">{L(author.bio)}</p>
        {author.isDemo ? <p className="oph-kb-demo">{L(authorCopy.demoNote)}</p> : null}
        <div className="oph-kb-author__links">
          <Link className="oph-kb-textlink" to={author.pageRoute}>
            {L(articleCopy.authorLink)}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          {!author.isFounder && !author.isEditorial ? (
            <Link className="oph-kb-textlink" to={`${ROUTES.appointment}?doctor=${author.slug}`}>
              {L(articleCopy.bookAuthor)}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
};

/* =========================================================== VIDEO POSTER */

/**
 * Click-to-load YouTube embed: nothing is requested from YouTube (no cookies,
 * no player script) until the visitor presses play.
 */
export const VideoPoster = ({
  id,
  title,
  caption,
  openLabel,
}: {
  id: string;
  title: string;
  caption?: string;
  openLabel: Localized;
}) => {
  const { L, language } = useI18n();
  const [playing, setPlaying] = useState(false);
  const playLabel = { ru: 'Смотреть видео', kk: 'Бейнені көру', en: 'Play video' };

  return (
    <figure className="oph-kb-video">
      <div className="oph-kb-video__frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&hl=${language}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="oph-kb-video__poster" onClick={() => setPlaying(true)}>
            <img
              src={id === 'YOJAdl__43Q' ? '/media/video-24kz.jpg' : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              decoding="async"
            />
            <span className="oph-kb-video__play" aria-hidden="true">
              <Play size={22} />
            </span>
            <span className="oph-visually-hidden">
              {L(playLabel)}: {title}
            </span>
          </button>
        )}
      </div>
      <figcaption className="oph-kb-video__caption">
        <span className="oph-kb-video__title">{title}</span>
        {caption ? <span className="oph-kb-video__meta">{caption}</span> : null}
        <a
          className="oph-kb-textlink"
          href={`https://youtu.be/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {L(openLabel)}
          <ExternalLink size={14} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
};

/* ============================================================ DISCLAIMER */

export const Disclaimer = () => {
  const { L } = useI18n();
  return (
    <Reveal variant="fade">
      <p className="oph-kb-disclaimer" role="note">
        {L(articleCopy.disclaimer)}
      </p>
    </Reveal>
  );
};
