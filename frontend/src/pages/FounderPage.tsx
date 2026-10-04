import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Mic, Search } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Button, Container, EmptyState, Input, Section } from '@/ui';
import { Reveal, ScrollFx, Stagger, StackCards, StickyStory, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex, SourcesBox } from '@/components/editorial';
import { Monogram, VideoFacade } from '@/components/people';
import { SwirlMark } from '@/layout/SwirlMark';
import { ROUTES } from '@/app/navigation';
import { site } from '@/content';
import { FOUNDER_SOURCES } from '@/content/pages/people';
import {
  FOUNDER,
  FOUNDER_CONFERENCES,
  FOUNDER_PUBLICATIONS,
  FOUNDER_SOURCE_LIST,
  FOUNDER_VIDEO,
  PUBLICATION_KINDS,
  PUBLICATION_TOPICS,
  type PublicationKind,
  type PublicationTopic,
} from '@/content/pages/people-founder';

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? site.organization.url;
const BRAND = 'Ophthalmic Centre of Dr Kulmaganbetov';
const pad = (n: number) => String(n).padStart(2, '0');

/* ======================================================== PUBLICATIONS */

type KindFilter = 'all' | PublicationKind;
type TopicFilter = 'all' | PublicationTopic;

/**
 * Database-like list: type + topic chips and free-text search over the data
 * array in content/pages/people-founder.ts. Each row reveals its summary on
 * hover or keyboard focus (desktop); on touch screens the summary is shown.
 */
const PublicationList = () => {
  const { L, t } = useI18n();
  const [kind, setKind] = useState<KindFilter>('all');
  const [topic, setTopic] = useState<TopicFilter>('all');
  const [query, setQuery] = useState('');

  const topics = useMemo(() => Array.from(new Set(FOUNDER_PUBLICATIONS.flatMap((item) => item.topics))), []);
  const kinds = useMemo(() => Array.from(new Set(FOUNDER_PUBLICATIONS.map((item) => item.kind))), []);

  const items = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return FOUNDER_PUBLICATIONS.filter((item) => {
      if (kind !== 'all' && item.kind !== kind) return false;
      if (topic !== 'all' && !item.topics.includes(topic)) return false;
      if (!needle) return true;
      const haystack = [item.title, item.venue, L(item.summary), ...item.topics.map((id) => L(PUBLICATION_TOPICS[id]))]
        .join(' ')
        .toLocaleLowerCase();
      return haystack.includes(needle);
    }).sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  }, [kind, topic, query, L]);

  const filtersActive = kind !== 'all' || topic !== 'all' || Boolean(query.trim());
  const reset = () => {
    setKind('all');
    setTopic('all');
    setQuery('');
  };

  return (
    <div className="ppl-pubs">
      <Reveal variant="up" className="oph-panel ppl-pubs__filters">
        <Input
          label={L(FOUNDER.searchLabel)}
          placeholder={L(FOUNDER.searchPlaceholder)}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          icon={<Search size={18} aria-hidden="true" />}
        />
        <div className="ppl-filterrow">
          <span className="ppl-filterrow__label" id="pub-kind-label">
            {L(FOUNDER.filterType)}
          </span>
          <div className="oph-chips" role="group" aria-labelledby="pub-kind-label">
            <button type="button" className="oph-chip" aria-pressed={kind === 'all'} onClick={() => setKind('all')}>
              {t.common.all}
            </button>
            {kinds.map((id) => (
              <button key={id} type="button" className="oph-chip" aria-pressed={kind === id} onClick={() => setKind(id)}>
                {L(PUBLICATION_KINDS[id])}
              </button>
            ))}
          </div>
        </div>
        <div className="ppl-filterrow">
          <span className="ppl-filterrow__label" id="pub-topic-label">
            {L(FOUNDER.filterTopic)}
          </span>
          <div className="oph-chips" role="group" aria-labelledby="pub-topic-label">
            <button type="button" className="oph-chip" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
              {t.common.all}
            </button>
            {topics.map((id) => (
              <button key={id} type="button" className="oph-chip" aria-pressed={topic === id} onClick={() => setTopic(id)}>
                {L(PUBLICATION_TOPICS[id])}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="ppl-resultbar">
        <p className="ppl-count" role="status" aria-live="polite">
          {L(FOUNDER.materials)}: <strong>{items.length}</strong>
        </p>
        {filtersActive && items.length ? (
          <Button variant="ghost" size="sm" onClick={reset}>
            {t.common.reset}
          </Button>
        ) : null}
      </div>

      {items.length ? (
        <Stagger as="ol" className="ppl-publist" step={80}>
          {items.map((item) => (
            <Reveal as="li" key={item.id} variant="up" className="ppl-pub">
              <span className="ppl-pub__year">{item.year ?? item.venue}</span>
              <div className="ppl-pub__main">
                <div className="ppl-pub__meta">
                  <span className="oph-eyebrow">{L(PUBLICATION_KINDS[item.kind])}</span>
                  <span className="ppl-pub__venue">{item.venue}</span>
                  <span className="ppl-pub__role">
                    {item.kind === 'article' ? L(FOUNDER.coauthor) : L(FOUNDER.featured)}
                  </span>
                </div>
                <h3 className="ppl-pub__title">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" lang={item.kind === 'article' ? 'en' : 'ru'}>
                    {item.title}
                  </a>
                </h3>
                <div className="ppl-pub__reveal">
                  <p className="ppl-pub__summary">{L(item.summary)}</p>
                  <div className="ppl-pub__tags">
                    {item.topics.map((id) => (
                      <span key={id} className="oph-tag">
                        {L(PUBLICATION_TOPICS[id])}
                      </span>
                    ))}
                    {item.doi ? (
                      <a className="ppl-pub__doi" href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer">
                        DOI {item.doi}
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
              <span className="ppl-pub__arrow" aria-hidden="true">
                <ArrowUpRight size={20} />
              </span>
            </Reveal>
          ))}
        </Stagger>
      ) : (
        <EmptyState
          title={t.common.nothingFound}
          text={t.common.nothingFoundText}
          icon={<BookOpen size={28} />}
          action={
            <Button variant="outline" size="sm" onClick={reset}>
              {t.common.reset}
            </Button>
          }
        />
      )}
    </div>
  );
};

/* ===================================================== SCIENTIFIC PATH */

/**
 * The pinned visual of the seven-step path. Instead of repeating the swirl
 * monogram for every chapter, each one shows the fact that supports it
 * (MD, PhD, the patent, 200 patients, the 2026 papers, Astana) as a typographic
 * "evidence card", with a six-step rail that fills as the reader moves on.
 */
const PathEvidence = ({ active }: { active: number }) => {
  const { L } = useI18n();
  const chapter = FOUNDER.path[active] ?? FOUNDER.path[0];
  const total = FOUNDER.path.length;
  return (
    <div className="ppl-evidence" aria-hidden="true" style={{ ['--step' as string]: active / (total - 1) }}>
      <ol className="ppl-evidence__rail">
        {FOUNDER.path.map((item, index) => (
          <li key={item.id} data-state={index < active ? 'done' : index === active ? 'active' : undefined}>
            <span>{pad(index + 1)}</span>
          </li>
        ))}
      </ol>
      <div className="ppl-evidence__card">
        <SwirlMark className="ppl-evidence__swirl" />
        <span className="ppl-evidence__count">
          {pad(active + 1)} <span>/ {pad(total)}</span>
        </span>
        <span className="ppl-evidence__label">{L(chapter.label)}</span>
        <span className="ppl-evidence__mark" key={chapter.id} data-long={L(chapter.evidence.mark).length > 6 || undefined}>
          {L(chapter.evidence.mark)}
        </span>
        <span className="ppl-evidence__source">{L(chapter.evidence.source)}</span>
      </div>
    </div>
  );
};

/* ======================================================== GLOBAL ROUTE */

/** Equirectangular projection into a 1000×500 plane, cropped by the viewBox. */
const project = (lat: number, lng: number) => ({ x: ((lng + 180) / 360) * 1000, y: ((90 - lat) / 180) * 500 });

/** Crop of the plane shown by the route map, and the edge band for labels. */
const VB = { x: 190, y: 40, w: 670, h: 215 };
const EDGE = 110;

/**
 * The real points of the path — Cardiff (PhD), Hong Kong and Canada (where
 * the device was tested) and Astana (the new centre) — drawn as arcs that
 * trace themselves with scroll. Replaces the unrelated clinic photo (X7).
 */
const RouteMap = () => {
  const { L } = useI18n();
  const hub = FOUNDER.routePoints.find((point) => point.hub) ?? FOUNDER.routePoints[0];
  const h = project(hub.lat, hub.lng);
  return (
    <ScrollFx className="ppl-route">
      <svg
        className="ppl-route__svg"
        viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
        role="img"
        aria-label={L(FOUNDER.routeLabel)}
      >
        <defs>
          <pattern id="ppl-route-dots" width="9" height="9" patternUnits="userSpaceOnUse">
            <circle cx="4.5" cy="4.5" r="0.8" className="ppl-route__dot" />
          </pattern>
        </defs>
        <rect x={VB.x} y={VB.y} width={VB.w} height={VB.h} fill="url(#ppl-route-dots)" />
        {FOUNDER.routePoints
          .filter((point) => !point.hub)
          .map((point) => {
            const p = project(point.lat, point.lng);
            const mx = (p.x + h.x) / 2;
            const my = (p.y + h.y) / 2 - Math.hypot(p.x - h.x, p.y - h.y) * 0.22;
            return (
              <path
                key={point.id}
                className="ppl-route__arc"
                pathLength={1}
                d={`M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${h.x.toFixed(1)} ${h.y.toFixed(1)}`}
              />
            );
          })}
        {FOUNDER.routePoints.map((point) => {
          const p = project(point.lat, point.lng);
          // Labels near the frame edge grow inwards, so they never hang past
          // the card when the phone font size (26 user units) applies.
          const anchor = p.x - VB.x < EDGE ? 'start' : VB.x + VB.w - p.x < EDGE ? 'end' : 'middle';
          const lx = anchor === 'start' ? -8 : anchor === 'end' ? 8 : 0;
          return (
            <g key={point.id} className={`ppl-route__node ${point.hub ? 'ppl-route__node--hub' : ''}`} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              <circle className="ppl-route__halo" r={point.hub ? 11 : 8} />
              <circle className="ppl-route__pin" r={point.hub ? 4.2 : 3.2} />
              <text className="ppl-route__name" x={lx} y={point.hub ? -16 : 20} textAnchor={anchor}>
                {L(point.name)}
              </text>
              <text className="ppl-route__note" x={lx} dy={point.hub ? '-1.7em' : '1.4em'} y={point.hub ? -16 : 20} textAnchor={anchor}>
                {L(point.note)}
              </text>
            </g>
          );
        })}
      </svg>
    </ScrollFx>
  );
};

/* =============================================================== PAGE */

const FounderPage = () => {
  const { t, L } = useI18n();
  const url = `${SITE_URL}${ROUTES.founder}`;

  const jsonLd = useMemo(() => {
    const person = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${url}#person`,
      name: FOUNDER.nameLatin,
      alternateName: [FOUNDER.name.ru, FOUNDER.name.kk],
      honorificPrefix: 'Dr',
      jobTitle: L(FOUNDER.eyebrow),
      description: L(FOUNDER.seoDescription),
      url,
      sameAs: [FOUNDER.threads, FOUNDER_SOURCES.eyeinst],
      alumniOf: { '@type': 'CollegeOrUniversity', name: 'Cardiff University' },
      hasCredential: [
        { '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', name: 'MD in Ophthalmology' },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'degree',
          name: 'PhD in Vision Sciences',
          recognizedBy: { '@type': 'CollegeOrUniversity', name: 'Cardiff University' },
        },
        {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'fellowship',
          name: 'Associate Fellow of the Higher Education Academy (AFHEA)',
          recognizedBy: { '@type': 'Organization', name: 'Higher Education Academy' },
        },
      ],
      knowsAbout: ['Ophthalmology', 'Vision science', 'Artificial intelligence', 'Quantum physics'],
      affiliation: { '@type': 'Organization', name: 'Kazakh Research Institute of Eye Diseases' },
      founder: { '@type': 'MedicalClinic', name: BRAND, url: SITE_URL },
      subjectOf: FOUNDER_PUBLICATIONS.map((item) =>
        item.kind === 'article'
          ? {
              '@type': 'ScholarlyArticle',
              headline: item.title,
              url: item.url,
              ...(item.year ? { datePublished: String(item.year) } : {}),
              ...(item.doi ? { identifier: `https://doi.org/${item.doi}` } : {}),
              isPartOf: { '@type': 'Periodical', name: item.venue },
            }
          : { '@type': 'VideoObject', name: item.title, url: item.url, thumbnailUrl: FOUNDER_VIDEO.poster },
      ),
    };
    return [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: t.nav.about, url: ROUTES.about },
        { name: t.nav.founder, url: ROUTES.founder },
      ]),
      person,
      {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url,
        name: L(FOUNDER.seoTitle),
        inLanguage: ['ru', 'kk', 'en'],
        mainEntity: { '@id': `${url}#person` },
      },
    ];
  }, [L, t, url]);

  return (
    <>
      <Seo title={L(FOUNDER.seoTitle)} description={L(FOUNDER.seoDescription)} jsonLd={jsonLd} />

      {/* The swirl monogram appears once, here. There is no photograph of the
          founder in the asset set and a stock face would misrepresent him. */}
      <PageHero
        eyebrow={`${L(FOUNDER.eyebrow)} · ${L(FOUNDER.fullTitle)}`}
        title={L(FOUNDER.title)}
        text={L(FOUNDER.lead)}
        crumbs={[{ label: t.nav.aboutClinic, to: ROUTES.about }, { label: t.nav.founder }]}
        actions={
          <>
            <HeroLink to="#founder-publications">
              {L(FOUNDER.toPublications)}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to="#founder-media" muted>
              {L(FOUNDER.toMedia)}
            </HeroLink>
          </>
        }
        aside={<Monogram letters={FOUNDER.monogram} caption={FOUNDER.credentialsLine} className="ppl-monogram--hero" />}
      />

      {/* 01 ------------------------------------ CREDENTIALS (typographic) */}
      <Section tight aria-labelledby="founder-credentials">
        <Container>
          <SectionIndex n={1} />
          <h2 id="founder-credentials" className="oph-eyebrow ppl-creds__label">
            {L(FOUNDER.credentialsLabel)}
          </h2>
          <ScrollFx className="ppl-creds">
            <Stagger className="ppl-creds__grid" step={120}>
              {FOUNDER.credentials.map((item) => (
                <Reveal key={item.id} variant="up" className="ppl-cred">
                  <span className="ppl-cred__abbr">{L(item.abbr)}</span>
                  <span className="ppl-cred__title">{L(item.title)}</span>
                  <span className="ppl-cred__text">{L(item.text)}</span>
                </Reveal>
              ))}
            </Stagger>
            <span className="ppl-creds__rail" aria-hidden="true" />
          </ScrollFx>
          <Reveal variant="fade">
            <p className="ppl-footnote">{L(FOUNDER.honoursNote)}</p>
          </Reveal>
        </Container>
      </Section>

      {/* 02 ---------------------------------------- MANIFESTO (statement) */}
      <Section tone="deep" aria-labelledby="founder-manifesto" className="ppl-manifesto">
        <Container>
          <SectionIndex n={2} onDark />
          <h2 id="founder-manifesto" className="oph-eyebrow ppl-manifesto__label">
            {L(FOUNDER.manifestoEyebrow)}
          </h2>
          <TextFill text={L(FOUNDER.manifesto)} className="ppl-statement ppl-statement--xl" />
          <span className="ppl-manifesto__quote" aria-hidden="true">
            “
          </span>
        </Container>
      </Section>

      {/* 03 ------------------------------- SCIENTIFIC PATH (evidence rail) */}
      <Section aria-labelledby="founder-path">
        <Container>
          <SectionIndex n={3} />
          <SectionHead id="founder-path" eyebrow={L(FOUNDER.pathEyebrow)} title={L(FOUNDER.pathTitle)} />
          <StickyStory className="ppl-path" visual={(active) => <PathEvidence active={active} />}>
            {FOUNDER.path.map((chapter, index) => (
              <article key={chapter.id} className="ppl-chapter">
                <span className="ppl-chapter__n">
                  {pad(index + 1)} · {L(chapter.label)}
                </span>
                <h3 className="ppl-chapter__title">{L(chapter.title)}</h3>
                <p className="ppl-chapter__text">{L(chapter.text)}</p>
                <p className="ppl-chapter__evidence">
                  <span>{L(chapter.evidence.mark)}</span> {L(chapter.evidence.source)}
                </p>
              </article>
            ))}
          </StickyStory>
        </Container>
      </Section>

      {/* 04 ------------------------------------------ GLOBAL (route map) */}
      <Section tone="tint" aria-labelledby="founder-global">
        <Container>
          <SectionIndex n={4} />
          <div className="ppl-global">
            <div className="ppl-global__head">
              <SectionHead
                id="founder-global"
                eyebrow={L(FOUNDER.globalEyebrow)}
                title={L(FOUNDER.globalTitle)}
                text={L(FOUNDER.globalText)}
                size="sm"
              />
              <Reveal variant="scale" className="ppl-global__map">
                <RouteMap />
              </Reveal>
            </div>
            <Stagger as="ol" className="ppl-places" step={100}>
              {FOUNDER.globalPlaces.map((place, index) => (
                <Reveal as="li" key={place.id} variant="up" className="ppl-place">
                  <span className="ppl-place__n">{pad(index + 1)}</span>
                  <span className="ppl-place__body">
                    <span className="oph-eyebrow">{L(place.place)}</span>
                    <span className="ppl-place__title">{L(place.title)}</span>
                    <span className="ppl-place__text">{L(place.text)}</span>
                  </span>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* 05 -------------------------------------------- RESEARCH (bento) */}
      <Section aria-labelledby="founder-research">
        <Container>
          <SectionIndex n={5} />
          <SectionHead id="founder-research" eyebrow={L(FOUNDER.researchEyebrow)} title={L(FOUNDER.researchTitle)} />
          <EditorialGrid>
            {FOUNDER.research.map((item, index) => (
              <EditorialCard key={item.id} index={index + 1} eyebrow={L(item.eyebrow)} title={L(item.title)} text={L(item.text)} />
            ))}
          </EditorialGrid>
        </Container>
      </Section>

      {/* 06 --------------------------------- VISION (statement + stack) */}
      <Section tone="deep" aria-labelledby="founder-vision" className="ppl-vision">
        <Container>
          <SectionIndex n={6} onDark />
          <h2 id="founder-vision" className="oph-eyebrow ppl-manifesto__label">
            {L(FOUNDER.visionEyebrow)}
          </h2>
          <TextFill text={L(FOUNDER.visionStatement)} className="ppl-statement" />
          <StackCards className="ppl-stack">
            {FOUNDER.visionPillars.map((pillar, index) => (
              <article key={pillar.id} className="ppl-stackcard">
                <span className="ppl-stackcard__n">{pad(index + 1)}</span>
                <h3 className="ppl-stackcard__title">{L(pillar.title)}</h3>
                <p className="ppl-stackcard__text">{L(pillar.text)}</p>
              </article>
            ))}
          </StackCards>
        </Container>
      </Section>

      {/* 07 ------------------------------------ PUBLICATIONS (database) */}
      <Section id="founder-publications" aria-labelledby="founder-publications-title" className="ppl-anchor">
        <Container>
          <SectionIndex n={7} />
          <SectionHead
            id="founder-publications-title"
            eyebrow={L(FOUNDER.publicationsEyebrow)}
            title={L(FOUNDER.publicationsTitle)}
            text={L(FOUNDER.publicationsText)}
          />
          <PublicationList />
        </Container>
      </Section>

      {/* 08 -------------------------------------- MEDIA, TALKS, THREADS */}
      <Section tone="tint" id="founder-media" aria-labelledby="founder-media-title" className="ppl-anchor">
        <Container>
          <SectionIndex n={8} />
          <SectionHead id="founder-media-title" eyebrow={L(FOUNDER.mediaEyebrow)} title={L(FOUNDER.mediaTitle)} />
          <div className="ppl-media">
            <Reveal variant="scale" className="ppl-media__video">
              <VideoFacade
                youtubeId={FOUNDER_VIDEO.youtubeId}
                poster={FOUNDER_VIDEO.poster}
                title={FOUNDER_VIDEO.title}
                playLabel={L(FOUNDER.playVideo)}
                note={L(FOUNDER.videoConsent)}
              />
              <div className="ppl-media__caption">
                <span className="oph-eyebrow">{FOUNDER_VIDEO.channel}</span>
                <h3 className="ppl-media__title" lang="ru">
                  {FOUNDER_VIDEO.title}
                </h3>
                <p>{L(FOUNDER_VIDEO.caption)}</p>
                <div className="ppl-media__links">
                  <a className="oph-link ppl-textlink" href={FOUNDER_SOURCES.article24kz} target="_blank" rel="noopener noreferrer">
                    {L(FOUNDER.readArticle)}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  <a className="oph-link ppl-textlink" href={FOUNDER_VIDEO.url} target="_blank" rel="noopener noreferrer">
                    YouTube
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </Reveal>
            <div className="ppl-media__side">
              <Reveal variant="up" delay={140}>
                <a className="ppl-social" href={FOUNDER.threads} target="_blank" rel="noopener noreferrer">
                  <span className="ppl-social__mark" aria-hidden="true">
                    @
                  </span>
                  <span className="oph-eyebrow">{L(FOUNDER.threadsTitle)}</span>
                  <span className="ppl-social__handle">@mukhit_kulmaganbetov</span>
                  <span className="ppl-social__text">{L(FOUNDER.threadsText)}</span>
                  <span className="ppl-social__link">
                    {L(FOUNDER.threadsLink)}
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </a>
              </Reveal>
              <Reveal variant="up" delay={220} className="ppl-talks">
                <h3 className="ppl-talks__title">
                  <Mic size={18} aria-hidden="true" />
                  {L(FOUNDER.conferencesTitle)}
                </h3>
                {FOUNDER_CONFERENCES.length ? (
                  <ul className="ppl-talks__list">
                    {FOUNDER_CONFERENCES.map((item) => (
                      <li key={item.id}>
                        <span className="ppl-talks__year">{item.year}</span>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.title}
                          </a>
                        ) : (
                          <span>{item.title}</span>
                        )}
                        <span className="ppl-talks__meta">
                          {L(item.role)} · {L(item.city)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <>
                    <p className="ppl-talks__text">{L(FOUNDER.conferencesEmpty)}</p>
                    <ul className="ppl-talks__topics" aria-label={L(FOUNDER.topicsLabel)}>
                      {FOUNDER.speakingTopics.map((topic) => (
                        <li key={topic.en} className="oph-tag">
                          {L(topic)}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <Link className="oph-link ppl-textlink" to={`${ROUTES.partnerships}#partner-form`}>
                  {L(FOUNDER.inviteSpeaker)}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
          </div>
          <div className="ppl-sources">
            <SourcesBox title={L(FOUNDER.sourcesTitle)} note={L(FOUNDER.sourcesNote)} sources={FOUNDER_SOURCE_LIST} />
          </div>
        </Container>
      </Section>

      <CtaBand title={L(FOUNDER.ctaTitle)} />
    </>
  );
};

export default FounderPage;
