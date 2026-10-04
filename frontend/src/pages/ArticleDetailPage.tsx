import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { DOCTORS_ARE_DEMO } from '@/content/pages/people';
import { BRAND } from '@/seo/Seo';
import { useI18n } from '@/i18n';
import { LOCALE_TAGS } from '@/i18n/types';
import { Accordion, Container, Section } from '@/ui';
import { Reveal, Stagger } from '@/motion';
import { Seo, articleSchema, breadcrumbSchema, faqSchema, medicalWebPageSchema } from '@/seo/Seo';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import {
  ArticleBody,
  ContinueBox,
  SectionHead,
  SectionIndex,
  SourcesBox,
  type ArticleSection,
} from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import NotFoundPage from './NotFoundPage';
import { bySlug, services } from '@/content';
import { TAG_LABELS, articleCopy as A, categoryInfo, knowledgeCopy as C } from '@/content/pages/knowledge';
import { authorById } from '@/content/pages/knowledge-authors';
import { articleBySlug, relatedArticles } from '@/content/pages/knowledge-articles-index';
import { publications } from '@/content/pages/science-publications';
import { absolute } from '@/content/pages/knowledge-schema';
import { ArticleGrid, ArticleMeta, AuthorCard, Disclaimer, articlePath } from './knowledge/parts';
import { useArticleBody } from './knowledge/useArticleBody';
import { ReviewStatus } from './knowledge/review';

/** Representative raster for Article rich results until per-article covers exist. */
const ARTICLE_IMAGE = '/media/clinic-day.jpg';

/**
 * Knowledge-base article — Figma «08 Статья» (spec §6.8, §16).
 * Hero → review status + tags → sticky contents + numbered sections → FAQ →
 * «Продолжить знакомство» + sources → author → related materials → booking.
 *
 * The hero, review status and related materials render from the small index
 * at once; the body (sections, FAQ, sources) is its own chunk, loaded here.
 */
const ArticleDetailPage = () => {
  const { slug = '' } = useParams();
  const { t, L, language } = useI18n();
  const article = articleBySlug(slug);
  const [bodyState, retry] = useArticleBody(article ? slug : '');
  const body = bodyState.status === 'ready' ? bodyState.body : undefined;

  const jsonLd = useMemo(() => {
    if (!article) return [];
    const author = authorById(article.authorId);
    const reviewer = article.review ? authorById(article.review.reviewerId) : undefined;
    const category = categoryInfo(article.category);
    const path = articlePath(article.slug);
    const papers = publications.filter((paper) => article.basedOn?.includes(paper.id));
    const authorName = author ? L(author.name) : L(C.heroTitle);

    const page = {
      // MedicalWebPage fields (audience, specialty) + Article fields (author,
      // publisher logo, dates); Article wins where both define a key.
      ...medicalWebPageSchema({
        title: L(article.title),
        description: L(article.excerpt),
        path,
        language: LOCALE_TAGS[language],
        ...(article.review && reviewer
          ? { lastReviewed: article.review.date, reviewedBy: L(reviewer.name) }
          : {}),
      }),
      ...articleSchema({
        title: L(article.title),
        description: L(article.excerpt),
        date: article.date,
        dateModified: article.review && article.review.date > article.date ? article.review.date : article.date,
        author: authorName,
        slug: article.slug,
        path,
        image: ARTICLE_IMAGE,
        authorUrl: author?.pageRoute,
        authorJobTitle: author && !author.isEditorial ? L(author.role) : undefined,
        category: L(category.label),
        tags: article.tags.map((tag) => L(TAG_LABELS[tag])),
        reviewedBy: article.review && reviewer ? L(reviewer.name) : undefined,
        language: LOCALE_TAGS[language],
      }),
      // The editorial team is an organisation, not a person — and demo doctor
      // profiles are never published as real authors in structured data.
      ...(author?.isEditorial || (DOCTORS_ARE_DEMO && author && author.slug !== 'dr-kulmaganbetov')
        ? {
            author: {
              '@type': 'Organization',
              name: author?.isEditorial ? authorName : BRAND,
              url: absolute(author?.isEditorial ? author.pageRoute : '/'),
            },
          }
        : {}),
      ...(papers.length
        ? {
            isBasedOn: papers.map((paper) => ({
              '@type': 'ScholarlyArticle',
              headline: paper.title,
              url: paper.href,
              sameAs: `https://doi.org/${paper.doi}`,
            })),
          }
        : {}),
      ...(body?.sources.length
        ? { citation: body.sources.map((source) => ({ '@type': 'CreativeWork', name: source.label, url: source.href })) }
        : {}),
    };

    return [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: L(C.heroTitle), url: ROUTES.knowledge },
        { name: L(article.title), url: path },
      ]),
      page,
      ...(body?.faq.length ? [faqSchema(body.faq.map((item) => ({ question: L(item.q), answer: L(item.a) })))] : []),
    ];
  }, [article, body, t, L, language]);

  if (!article) return <NotFoundPage />;

  const author = authorById(article.authorId);
  const category = categoryInfo(article.category);
  const service = article.serviceSlug ? bySlug(services, article.serviceSlug) : undefined;
  const related = relatedArticles(article, 3);

  const sections: ArticleSection[] = (body?.sections ?? []).map((section) => ({
    id: section.id,
    title: L(section.title),
    body: (
      <>
        {section.body[language].map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </>
    ),
    list: section.list?.[language],
  }));

  const continueLinks = [
    ...related.map((entry) => ({ label: L(entry.title), to: articlePath(entry.slug) })),
    ...(service
      ? [
          {
            label: L(A.serviceLink).replace('{name}', L(service.name)),
            to: `${ROUTES.services}/${service.slug}`,
          },
        ]
      : []),
    { label: L(A.themeLink).replace('{name}', L(category.label)), to: `${ROUTES.knowledge}?topic=${category.key}#materials` },
  ];

  let n = 0;
  const next = () => (n += 1);

  return (
    <>
      <Seo
        title={L(article.title)}
        description={L(article.excerpt)}
        type="article"
        publishedAt={article.date}
        image={absolute(ARTICLE_IMAGE)}
        jsonLd={jsonLd}
      />

      <PageHero
        eyebrow={L(category.label)}
        title={L(article.title)}
        text={L(article.excerpt)}
        crumbs={[{ label: L(C.heroTitle), to: ROUTES.knowledge }, { label: L(article.title) }]}
        meta={<ArticleMeta article={article} />}
      />

      <Section className="oph-kb-article">
        <Container>
          <Reveal variant="fade">
            <div className="oph-kb-articlebar">
              <ReviewStatus article={article} />
              {article.tags.length ? (
                <ul className="oph-kb-tags oph-kb-tags--static" aria-label={L(A.tags)}>
                  {article.tags.map((tag) => (
                    <li key={tag}>
                      <Link className="oph-kb-tag" to={`${ROUTES.knowledge}?tag=${tag}#materials`}>
                        #{L(TAG_LABELS[tag])}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>

          {bodyState.status === 'ready' ? (
            <ArticleBody sections={sections} tocLabel={L(A.toc)} after={<Disclaimer />} />
          ) : bodyState.status === 'error' ? (
            <div className="oph-kb-bodystate" role="alert">
              <p>{L(A.loadError)}</p>
              <button type="button" className="oph-kb-reset" onClick={retry}>
                <RotateCcw size={15} aria-hidden="true" />
                {L(A.retry)}
              </button>
            </div>
          ) : (
            // Placeholder with the article's own headings keeps the layout
            // (and the reader's place) stable while the body chunk arrives.
            <div className="oph-kb-bodystate oph-kb-bodystate--loading" aria-busy="true">
              <p className="oph-visually-hidden" role="status">
                {L(A.loading)}
              </p>
              {article.headings.map((heading) => (
                <div key={heading.en} className="oph-kb-skeleton" aria-hidden="true">
                  <p className="oph-kb-skeleton__title">{L(heading)}</p>
                  <span />
                  <span />
                  <span />
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {body?.faq.length ? (
        <Section tone="tint" aria-labelledby="article-faq">
          <Container>
            <div className="oph-kb-faq">
              <div>
                <SectionIndex n={next()} />
                <SectionHead id="article-faq" eyebrow={L(A.faqEyebrow)} title={L(A.faqTitle)} size="sm" />
              </div>
              <Reveal variant="up">
                <Accordion
                  multiple
                  items={body.faq.map((item, index) => ({
                    id: `faq-${index}`,
                    question: L(item.q),
                    answer: L(item.a),
                  }))}
                />
              </Reveal>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section aria-labelledby="article-continue" className="oph-kb-article">
        <Container>
          <SectionIndex n={next()} />
          <h2 id="article-continue" className="oph-visually-hidden">
            {L(A.continue)}
          </h2>
          <Stagger className={`oph-kb-boxes ${body?.sources.length ? '' : 'oph-kb-boxes--single'}`} step={120}>
            <ContinueBox title={L(A.continue)} links={continueLinks} />
            {body?.sources.length ? (
              <SourcesBox title={L(A.sources)} note={L(A.sourcesNote)} sources={body.sources} />
            ) : null}
          </Stagger>
        </Container>
      </Section>

      {author ? (
        <Section tone="tint" aria-labelledby="article-author">
          <Container>
            <SectionIndex n={next()} />
            <AuthorCard author={author} heading={L(A.authorEyebrow)} headingId="article-author" />
          </Container>
        </Section>
      ) : null}

      {related.length ? (
        <Section aria-labelledby="article-related">
          <Container>
            <SectionIndex n={next()} />
            <SectionHead
              id="article-related"
              eyebrow={L(C.materialsEyebrow)}
              title={L(A.related)}
              size="sm"
              aside={
                <Link className="oph-kb-textlink" to={ROUTES.knowledge}>
                  {L(A.allMaterials)} →
                </Link>
              }
            />
            <ArticleGrid articles={related} />
          </Container>
        </Section>
      ) : null}

      <CtaBand title={L(A.ctaTitle)} />
    </>
  );
};

export default ArticleDetailPage;
