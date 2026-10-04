import { useMemo } from 'react';
import { ArrowUpRight, ExternalLink, FileText } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import {
  HorizontalScroll,
  Marquee,
  Reveal,
  StackCards,
  Stagger,
  StickyStory,
  TextFill,
  Timeline,
  TimelineItem,
} from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { LeadForm } from '@/components/LeadForm';
import { RingMotif, SectionHead, SectionIndex, StatGrid } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import {
  SOURCE_24KZ,
  VIDEO_ID,
  collabTypes,
  innovationProgrammes,
  publications,
  reports,
  researchDirections,
  researchKeywords,
  researchTimeline,
  scienceCopy as C,
  studyProgrammes,
} from '@/content/pages/science';
import { founderProfile } from '@/content/pages/knowledge';
import { SITE_URL, absolute } from '@/content/pages/knowledge-schema';
import { VideoPoster } from './knowledge/parts';

/**
 * Science & innovation (spec §7): projects → publications (+ video) →
 * clinical study programmes → innovation programmes → research timeline →
 * collaboration enquiry → reports.
 */
const SciencePage = () => {
  const { t, L, language } = useI18n();

  const jsonLd = useMemo(
    () => [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: L(C.seoTitle), url: ROUTES.science },
      ]),
      ...publications.map((paper) => ({
        '@context': 'https://schema.org',
        '@type': 'ScholarlyArticle',
        headline: paper.title,
        datePublished: String(paper.year),
        isPartOf: { '@type': 'Periodical', name: paper.journal },
        sameAs: `https://doi.org/${paper.doi}`,
        url: paper.href,
        // Co-authorship: the full author list lives on the publisher's page.
        contributor: { '@type': 'Person', name: L(founderProfile.name), url: absolute(ROUTES.founder) },
      })),
      ...studyProgrammes
        .filter((project) => project.id !== 'astana-centre')
        .map((project) => ({
          '@context': 'https://schema.org',
          '@type': 'ResearchProject',
          name: L(project.title),
          description: L(project.text),
          member: { '@type': 'Person', name: L(founderProfile.name), url: absolute(ROUTES.founder) },
          subjectOf: { '@type': 'NewsArticle', url: SOURCE_24KZ.href, publisher: { '@type': 'Organization', name: '24KZ' } },
        })),
      {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: L(C.videoTitle),
        description: L(C.videoCaption),
        thumbnailUrl: `https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`,
        contentUrl: `https://youtu.be/${VIDEO_ID}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`,
        publisher: { '@type': 'Organization', name: '24KZ' },
        about: { '@type': 'MedicalClinic', url: SITE_URL },
      },
    ],
    [t, L],
  );

  // Verified figures only (DESIGN.md §7, 24.kz): distinct, each with a source.
  const stats = [
    { value: 200, label: L(C.stats.patients) },
    { value: 2, label: L(C.stats.countries) },
    { value: publications.length, label: L(C.stats.publications) },
    { value: 1, label: L(C.stats.patent) },
  ];

  const sourceLink = (
    <a className="oph-kb-textlink oph-kb-source" href={SOURCE_24KZ.href} target="_blank" rel="noopener noreferrer">
      {L(C.source)}: 24.kz
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );

  return (
    <>
      <Seo title={L(C.seoTitle)} description={L(C.seoDescription)} jsonLd={jsonLd} />

      <PageHero
        eyebrow={L(C.heroEyebrow)}
        title={L(C.heroTitle)}
        text={L(C.heroText)}
        crumbs={[{ label: L(C.seoTitle) }]}
        actions={
          <>
            <a className="oph-herolink" href="#publications">
              {L(C.heroPublications)} →
            </a>
            <a className="oph-herolink oph-herolink--muted" href="#collaboration">
              {L(C.heroCollab)}
            </a>
            <HeroLink to={ROUTES.founder} muted>
              {t.nav.founder}
            </HeroLink>
          </>
        }
      />

      {/* 01 — statement + numbers */}
      <Section aria-labelledby="sci-numbers">
        <Container>
          <SectionIndex n={1} />
          <h2 id="sci-numbers" className="oph-visually-hidden">
            {L(C.statsEyebrow)}
          </h2>
          <TextFill text={L(C.statement)} className="oph-kb-statement" />
          <StatGrid stats={stats} />
          <Reveal variant="fade">{sourceLink}</Reveal>
        </Container>
        <Marquee className="oph-kb-marquee" duration={40}>
          {researchKeywords.map((word) => (
            <span key={word.en} className="oph-kb-marquee__item">
              {L(word)}
            </span>
          ))}
        </Marquee>
      </Section>

      {/* 02 — research projects (sticky story) */}
      <Section tone="deep" className="oph-on-dark" aria-labelledby="sci-projects">
        <Container>
          <SectionIndex n={2} onDark />
          <SectionHead id="sci-projects" eyebrow={L(C.projectsEyebrow)} title={L(C.projectsTitle)} size="sm" />
          <StickyStory
            className="oph-kb-story"
            visual={(active) => (
              <div className="oph-kb-storyvisual" data-active={active}>
                <RingMotif />
                <span className="oph-kb-storyvisual__label" aria-hidden="true">
                  {L(researchDirections[active]?.label ?? researchDirections[0].label)}
                </span>
                <span className="oph-kb-storyvisual__n" aria-hidden="true">
                  {String(active + 1).padStart(2, '0')} / {String(researchDirections.length).padStart(2, '0')}
                </span>
              </div>
            )}
          >
            {researchDirections.map((direction, index) => (
              <article key={direction.id} className="oph-kb-chapter">
                <span className="oph-kb-chapter__n">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="oph-kb-chapter__title">{L(direction.title)}</h3>
                <p className="oph-kb-chapter__text">{L(direction.text)}</p>
                <ul className="oph-ringlist">
                  {direction.points[language].map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                {direction.id === 'retina-light' ? (
                  <a className="oph-kb-textlink" href="#publications">
                    {L(C.heroPublications)} →
                  </a>
                ) : (
                  sourceLink
                )}
              </article>
            ))}
          </StickyStory>
        </Container>
      </Section>

      {/* 03 — publications + video */}
      <Section aria-labelledby="sci-publications" id="publications" className="oph-kb-anchor">
        <Container>
          <SectionIndex n={3} />
          <SectionHead
            id="sci-publications"
            eyebrow={L(C.publicationsEyebrow)}
            title={L(C.publicationsTitle)}
            text={L(C.publicationsText)}
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
                    {L(C.openPaper)}
                    <ArrowUpRight size={15} aria-hidden="true" />
                    <span className="oph-visually-hidden">: {paper.title}</span>
                  </a>
                </div>
              </Reveal>
            ))}
          </Stagger>

          <div className="oph-kb-videoblock">
            <Reveal variant="up">
              <span className="oph-eyebrow">{L(C.videoEyebrow)}</span>
            </Reveal>
            <Reveal variant="scale" delay={120}>
              <VideoPoster
                id={VIDEO_ID}
                title={L(C.videoTitle)}
                caption={L(C.videoCaption)}
                openLabel={C.openVideo}
              />
            </Reveal>
            <Reveal variant="fade">
              <a className="oph-kb-textlink" href={SOURCE_24KZ.href} target="_blank" rel="noopener noreferrer">
                {L(C.readArticle)}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 04 — clinical study programmes (stacking cards) */}
      <Section tone="tint" aria-labelledby="sci-studies">
        <Container>
          <SectionIndex n={4} />
          <SectionHead
            id="sci-studies"
            eyebrow={L(C.studiesEyebrow)}
            title={L(C.studiesTitle)}
            text={L(C.studiesText)}
            size="sm"
          />
          <StackCards className="oph-kb-stack">
            {studyProgrammes.map((study, index) => (
              <article key={study.id} className="oph-kb-study">
                <span className="oph-kb-study__n">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="oph-kb-study__title">{L(study.title)}</h3>
                  <p className="oph-kb-study__text">{L(study.text)}</p>
                </div>
                <p className="oph-kb-study__status">
                  <span>{L(C.statusLabel)}</span>
                  {L(study.status)}
                </p>
              </article>
            ))}
          </StackCards>
          <Reveal variant="fade">
            <p className="oph-kb-note" role="note">
              {L(C.studiesNote)}
            </p>
            {sourceLink}
          </Reveal>
        </Container>
      </Section>

      {/* 05 — innovation programmes (horizontal) */}
      <Section tone="deep" className="oph-on-dark oph-kb-hsection" aria-labelledby="sci-innovation">
        <Container>
          <SectionIndex n={5} onDark />
          <SectionHead id="sci-innovation" eyebrow={L(C.innovationEyebrow)} title={L(C.innovationTitle)} size="sm" />
        </Container>
        {/* Pinned sideways track on desktop; a native swipe row on phones. */}
        <HorizontalScroll length={170} className="oph-kb-hscroll">
          {innovationProgrammes.map((item, index) => (
            <article key={item.id} className="oph-kb-panel">
              <span className="oph-kb-panel__n">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="oph-kb-panel__title">{L(item.title)}</h3>
              <p className="oph-kb-panel__text">{L(item.text)}</p>
            </article>
          ))}
        </HorizontalScroll>
      </Section>

      {/* 06 — research timeline */}
      <Section aria-labelledby="sci-timeline">
        <Container>
          <div className="oph-duo oph-kb-duo-top">
            <div>
              <SectionIndex n={6} />
              <SectionHead id="sci-timeline" eyebrow={L(C.timelineEyebrow)} title={L(C.timelineTitle)} size="sm" />
            </div>
            <Timeline className="oph-kb-timeline">
              {researchTimeline.map((item) => (
                <TimelineItem key={item.id}>
                  <p className="oph-kb-timeline__when">{L(item.when)}</p>
                  <h3 className="oph-kb-timeline__title">{L(item.title)}</h3>
                  <p className="oph-kb-timeline__text">{L(item.text)}</p>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </Container>
      </Section>

      {/* 07 — collaboration */}
      <Section tone="tint" aria-labelledby="sci-collab" id="collaboration" className="oph-kb-anchor">
        <Container>
          <div className="oph-kb-formsplit">
            <div>
              <SectionIndex n={7} />
              <SectionHead
                id="sci-collab"
                eyebrow={L(C.collabEyebrow)}
                title={L(C.collabTitle)}
                text={L(C.collabText)}
                size="sm"
              />
              <Stagger as="ul" className="oph-ringlist" step={80}>
                {C.collabFormats[language].map((item) => (
                  <Reveal as="li" key={item} variant="left">
                    {item}
                  </Reveal>
                ))}
              </Stagger>
            </div>
            <Reveal variant="up" className="oph-panel">
              <LeadForm
                source="science-collaboration"
                submitLabel={L(C.collabSubmit)}
                emailRequired
                commentLabel={C.collabComment}
                extraFields={[
                  { name: 'organisation', label: C.collabOrg, required: true },
                  { name: 'collabType', label: C.collabType, type: 'select', options: collabTypes, required: true },
                ]}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 08 — reports */}
      <Section aria-labelledby="sci-reports">
        <Container>
          <SectionIndex n={8} />
          <SectionHead
            id="sci-reports"
            eyebrow={L(C.reportsEyebrow)}
            title={L(C.reportsTitle)}
            text={L(C.reportsText)}
            size="sm"
          />
          <Stagger className="oph-kb-reports" step={110}>
            {reports.map((report) => (
              <Reveal key={report.id} variant="up" className="oph-kb-report">
                <FileText size={22} aria-hidden="true" className="oph-kb-report__icon" />
                <h3 className="oph-kb-report__title">{L(report.title)}</h3>
                <p className="oph-kb-report__text">{L(report.text)}</p>
                <p className="oph-kb-report__status">{L(report.status)}</p>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaBand title={L(C.ctaTitle)} />
    </>
  );
};

export default SciencePage;
