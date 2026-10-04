import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Info, Link2 } from 'lucide-react';
import { useI18n } from '@/i18n';
import { LOCALE_TAGS } from '@/i18n/types';
import { Container, Section } from '@/ui';
import { Reveal, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import NotFoundPage from './NotFoundPage';
import { bySlug } from '@/content';
import { publishedNews } from '@/content/news';
import { editorialNews, mediaCopy as C } from '@/content/pages/media';
import { BRAND, SITE_URL, absolute } from '@/content/pages/knowledge-schema';

/** Representative raster for social cards and NewsArticle until per-story images exist. */
const NEWS_IMAGE = '/media/clinic-day.jpg';

/**
 * News article in the Figma article language: forest hero with date meta,
 * a sticky side rail (date, rubric, back link, copy link) beside the text —
 * the lead paragraph lights up with scroll — then more news.
 */
const NewsDetailPage = () => {
  const { slug = '' } = useParams();
  const { t, L, language, formatDate } = useI18n();
  const [copied, setCopied] = useState(false);

  const items = useMemo(() => publishedNews().map(editorialNews), []);
  const item = bySlug(items, slug);

  const jsonLd = useMemo(() => {
    if (!item) return [];
    const url = `${ROUTES.news}/${item.slug}`;
    return [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: t.nav.mediaCenter, url: ROUTES.media },
        { name: t.nav.news, url: ROUTES.news },
        { name: L(item.title), url },
      ]),
      // Demo stories get no NewsArticle markup (and are noindex below).
      ...(item.demo
        ? []
        : [
            {
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: L(item.title),
              description: L(item.excerpt),
              datePublished: item.date,
              inLanguage: LOCALE_TAGS[language],
              url: absolute(url),
              mainEntityOfPage: absolute(url),
              image: [absolute(NEWS_IMAGE)],
              articleSection: L(item.category),
              author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
              publisher: {
                '@type': 'Organization',
                name: BRAND,
                url: SITE_URL,
                logo: { '@type': 'ImageObject', url: absolute('/brand/logo.png') },
              },
            },
          ]),
    ];
  }, [item, t, L, language]);

  if (!item) return <NotFoundPage />;

  const related = items.filter((entry) => entry.id !== item.id).slice(0, 3);
  const eyebrowFor = (entry: typeof item) =>
    entry.demo ? `${L(entry.category)} · ${L(C.demoTag)}` : L(entry.category);
  const [lead, ...rest] = L(item.body).split('\n\n');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Seo
        title={L(item.title)}
        description={L(item.excerpt)}
        type="article"
        publishedAt={item.date}
        image={absolute(NEWS_IMAGE)}
        noIndex={item.demo}
        jsonLd={jsonLd}
      />

      <PageHero
        eyebrow={eyebrowFor(item)}
        title={L(item.title)}
        text={L(item.excerpt)}
        crumbs={[
          { label: t.nav.mediaCenter, to: ROUTES.media },
          { label: t.nav.news, to: ROUTES.news },
          { label: L(item.title) },
        ]}
        meta={
          <ul className="oph-kb-meta">
            <li>
              <CalendarDays size={14} aria-hidden="true" />
              <time dateTime={item.date}>{formatDate(item.date)}</time>
            </li>
          </ul>
        }
      />

      <Section aria-labelledby="news-body-title">
        <Container>
          <h2 id="news-body-title" className="oph-visually-hidden">
            {L(item.title)}
          </h2>
          <div className="oph-kb-newsbody">
            <aside className="oph-kb-newsbody__rail">
              <Reveal variant="fade">
                <p className="oph-eyebrow">{L(item.category)}</p>
                <p className="oph-kb-newsbody__date">
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                </p>
                <button type="button" className="oph-kb-textlink oph-kb-copy" onClick={copyLink}>
                  <Link2 size={15} aria-hidden="true" />
                  {copied ? L(C.copied) : L(C.share)}
                </button>
                <span className="oph-visually-hidden" role="status">
                  {copied ? L(C.copied) : ''}
                </span>
                <Link className="oph-kb-textlink oph-kb-textlink--muted" to={ROUTES.news}>
                  <ArrowLeft size={15} aria-hidden="true" />
                  {L(C.backToNews)}
                </Link>
              </Reveal>
            </aside>
            <article className="oph-kb-newsbody__main">
              {item.demo ? (
                <p className="oph-kb-note oph-kb-note--demo oph-kb-note--flush" role="note">
                  <Info size={16} aria-hidden="true" />
                  <span>{L(C.demoArticleNote)}</span>
                </p>
              ) : null}
              {lead ? <TextFill text={lead} className="oph-kb-newsbody__lead" /> : null}
              {rest.map((paragraph, index) => (
                <Reveal key={index} variant="up" as="p" delay={index * 60}>
                  {paragraph}
                </Reveal>
              ))}
            </article>
          </div>
        </Container>
      </Section>

      {related.length ? (
        <Section tone="tint" aria-labelledby="news-related">
          <Container>
            <SectionIndex n={1} />
            <SectionHead
              id="news-related"
              eyebrow={t.nav.news}
              title={L(C.relatedTitle)}
              size="sm"
              aside={
                <Link className="oph-kb-textlink" to={ROUTES.news}>
                  {t.common.allNews} →
                </Link>
              }
            />
            <EditorialGrid className="oph-kb-egrid">
              {related.map((entry) => (
                <EditorialCard
                  key={entry.id}
                  eyebrow={eyebrowFor(entry)}
                  title={L(entry.title)}
                  text={L(entry.excerpt)}
                  to={`${ROUTES.news}/${entry.slug}`}
                  linkLabel={L(C.read)}
                  meta={<time dateTime={entry.date}>{formatDate(entry.date)}</time>}
                />
              ))}
            </EditorialGrid>
          </Container>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
};

export default NewsDetailPage;
