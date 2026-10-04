import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowUpRight, FileText } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, EmptyState, Section } from '@/ui';
import { Reveal, Stagger } from '@/motion';
import { Seo, breadcrumbSchema, personSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { SectionHead, SectionIndex, StatGrid, type Stat } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import NotFoundPage from './NotFoundPage';
import { authorCopy as A, categoryInfo, founderProfile, knowledgeCopy as C } from '@/content/pages/knowledge';
import { authorBySlug } from '@/content/pages/knowledge-authors';
import { articlesBasedOn, articlesByAuthor } from '@/content/pages/knowledge-articles-index';
import { publications } from '@/content/pages/science-publications';
import { SITE_URL, absolute } from '@/content/pages/knowledge-schema';
import { ArticleGrid, Monogram, articlePath } from './knowledge/parts';

/**
 * Author page (spec §6.7 «страницы авторов», §16 expert authorship).
 *
 * - Editorial team: the unsigned materials, with the review placeholder.
 * - Doctors: their materials; the profile is flagged as demo data.
 * - Founder (`dr-kulmaganbetov`): his real peer-reviewed papers only, plus
 *   editorial explainers of them — clearly not credited to him.
 */
const AuthorPage = () => {
  const { slug = '' } = useParams();
  const { t, L } = useI18n();
  const author = authorBySlug(slug);

  const materials = useMemo(() => {
    if (!author) return [];
    if (!author.isFounder) return articlesByAuthor(author.id);
    const seen = new Set<string>();
    return publications
      .flatMap((paper) => articlesBasedOn(paper.id))
      .filter((article) => (seen.has(article.id) ? false : (seen.add(article.id), true)));
  }, [author]);

  const jsonLd = useMemo(() => {
    if (!author) return [];
    const crumbs = breadcrumbSchema([
      { name: t.common.breadcrumbHome, url: ROUTES.home },
      { name: L(C.heroTitle), url: ROUTES.knowledge },
      { name: L(author.name), url: author.pageRoute },
    ]);

    if (author.isEditorial) {
      return [
        crumbs,
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: L(author.name),
          description: L(author.bio),
          url: absolute(author.pageRoute),
          parentOrganization: { '@type': 'MedicalClinic', url: SITE_URL },
        },
      ];
    }

    const person = personSchema({
      name: L(author.name),
      jobTitle: L(author.role),
      url: author.pageRoute,
      description: L(author.bio),
      sameAs: author.sameAs,
      ...(author.isFounder
        ? {
            alumniOf: ['Cardiff University'],
            honorificSuffix: 'MD, PhD, AFHEA',
            knowsAbout: L(founderProfile.interests).split(' · '),
          }
        : {
            knowsAbout: [
              ...new Set(materials.map((article) => L(categoryInfo(article.category).label))),
              ...author.departments.map((name) => L(name)),
            ],
          }),
    });

    return [
      crumbs,
      {
        ...person,
        subjectOf: author.isFounder
          ? publications.map((paper) => ({
              '@type': 'ScholarlyArticle',
              headline: paper.title,
              url: paper.href,
              sameAs: `https://doi.org/${paper.doi}`,
              datePublished: String(paper.year),
              isPartOf: { '@type': 'Periodical', name: paper.journal },
            }))
          : materials.map((article) => ({
              '@type': 'Article',
              headline: L(article.title),
              url: absolute(articlePath(article.slug)),
            })),
      },
    ];
  }, [author, materials, t, L]);

  if (!author) return <NotFoundPage />;

  // Only figures that say something: count of materials and years of practice.
  const stats: Stat[] = author.isFounder
    ? []
    : [
        { value: materials.length, label: L(A.materials) },
        ...(author.experience ? [{ value: author.experience, suffix: '+', label: L(A.experience) }] : []),
      ];

  return (
    <>
      <Seo title={L(author.name)} description={L(author.bio)} jsonLd={jsonLd} />

      <PageHero
        eyebrow={L(author.isFounder ? A.founderEyebrow : A.eyebrow)}
        title={L(author.name)}
        text={L(author.role)}
        crumbs={[{ label: L(C.heroTitle), to: ROUTES.knowledge }, { label: L(author.name) }]}
        meta={<p className="oph-kb-herocred">{L(author.credentials)}</p>}
        aside={
          <div className="oph-kb-heromono">
            <Monogram name={L(author.name)} size="lg" />
          </div>
        }
        actions={
          author.isEditorial ? (
            <HeroLink to={ROUTES.knowledge}>{L(A.allKnowledge)} →</HeroLink>
          ) : (
            <>
              <HeroLink to={author.profileRoute}>
                {L(author.isFounder ? A.founderPage : A.profile)} →
              </HeroLink>
              {author.isFounder ? (
                <HeroLink to={ROUTES.science} muted>
                  {L(A.science)}
                </HeroLink>
              ) : (
                <HeroLink to={`${ROUTES.appointment}?doctor=${author.slug}`} muted>
                  {t.common.bookNow}
                </HeroLink>
              )}
            </>
          )
        }
      />

      {/* 01 — about */}
      <Section aria-labelledby="author-about">
        <Container>
          <SectionIndex n={1} />
          <SectionHead id="author-about" title={L(A.aboutTitle)} size="sm" />
          <Reveal variant="up" className="oph-kb-bio">
            <p>{L(author.bio)}</p>
          </Reveal>
          {author.isFounder ? (
            <Reveal variant="up">
              <p className="oph-kb-interests">{L(founderProfile.interests)}</p>
            </Reveal>
          ) : null}
          {author.departments.length ? (
            <Reveal variant="up" className="oph-kb-deps">
              <ul className="oph-kb-tags oph-kb-tags--static">
                {author.departments.map((name) => (
                  <li key={name.en} className="oph-tag">
                    {L(name)}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
          {author.isDemo ? (
            <Reveal variant="fade">
              <p className="oph-kb-note" role="note">
                {L(A.demoNote)}
              </p>
            </Reveal>
          ) : null}
          {stats.length >= 2 ? <StatGrid stats={stats} /> : null}
          {/* No materials yet: a one-line notice, not a numbered section
              around an empty-state card. */}
          {materials.length || author.isFounder ? null : (
            <Reveal variant="up" className="ppl-emptyline ppl-emptyline--after">
              <FileText size={20} aria-hidden="true" />
              <span>{L(A.noMaterials)}</span>
            </Reveal>
          )}
        </Container>
      </Section>

      {/* 02 — publications (founder) or materials */}
      {author.isFounder ? (
        <Section tone="tint" aria-labelledby="author-papers">
          <Container>
            <SectionIndex n={2} />
            <SectionHead
              id="author-papers"
              eyebrow={L(A.materialsEyebrow)}
              title={L(A.papersTitle)}
              text={L(A.papersText)}
              size="sm"
            />
            <Stagger as="ol" className="oph-kb-pubs" step={110}>
              {publications.map((paper) => (
                <Reveal as="li" key={paper.id} variant="up" className="oph-kb-pub">
                  <div className="oph-kb-pub__head">
                    <span className="oph-eyebrow">{L(paper.direction)}</span>
                    <span className="oph-kb-pub__journal">
                      <em>{paper.journal}</em>, {paper.year}
                    </span>
                  </div>
                  <h3 className="oph-kb-pub__title" lang="en">
                    {paper.title}
                  </h3>
                  <p className="oph-kb-pub__summary">{L(paper.summary)}</p>
                  <div className="oph-kb-pub__foot">
                    <span className="oph-kb-pub__doi">DOI: {paper.doi}</span>
                    <a className="oph-kb-textlink" href={paper.href} target="_blank" rel="noopener noreferrer">
                      {L(A.openPaper)}
                      <ArrowUpRight size={15} aria-hidden="true" />
                      <span className="oph-visually-hidden">: {paper.title}</span>
                    </a>
                  </div>
                </Reveal>
              ))}
            </Stagger>
          </Container>
        </Section>
      ) : null}

      {materials.length || author.isFounder ? (
        <Section tone={author.isFounder ? undefined : 'tint'} aria-labelledby="author-materials">
          <Container>
            <SectionIndex n={author.isFounder ? 3 : 2} />
            <SectionHead
              id="author-materials"
              eyebrow={L(author.isFounder ? C.materialsEyebrow : A.materialsEyebrow)}
              title={L(author.isFounder ? A.explainersTitle : A.materialsTitle)}
              text={author.isFounder ? L(A.explainersText) : undefined}
              size="sm"
            />
            {materials.length ? <ArticleGrid articles={materials} /> : <EmptyState title={L(A.noMaterials)} />}
          </Container>
        </Section>
      ) : null}

      {/* editorial principles */}
      <Section tone={author.isFounder || !materials.length ? 'tint' : undefined} aria-labelledby="author-principles">
        <Container>
          <SectionIndex n={author.isFounder ? 4 : materials.length ? 3 : 2} />
          <SectionHead
            id="author-principles"
            eyebrow={L(A.principlesEyebrow)}
            title={L(A.principlesTitle)}
            size="sm"
          />
          <Stagger className="oph-kb-principles" step={110}>
            {A.principles.map((item, index) => (
              <Reveal key={item.title.en} variant="up" className="oph-kb-principle">
                <span className="oph-kb-principle__n">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="oph-kb-principle__title">{L(item.title)}</h3>
                <p className="oph-kb-principle__text">{L(item.text)}</p>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default AuthorPage;
