import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ExternalLink, Mail, Mic, Phone } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section, type SectionTone } from '@/ui';
import { Marquee, Reveal, Stagger, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { site } from '@/content';
import { publishedNews } from '@/content/news';
import {
  MEDIA_TABS,
  editorialNews,
  interviews,
  mediaCopy as C,
  mediaTopics,
  podcastEpisodes,
  pressReleases,
  type MediaTab,
} from '@/content/pages/media';
import { events } from '@/content/pages/academy';
import { SOURCE_24KZ, VIDEO_ID, scienceCopy } from '@/content/pages/science';
import { authorById } from '@/content/pages/knowledge-authors';
import { Monogram, VideoPoster, articlePath } from './knowledge/parts';

const TAB_KEYS = MEDIA_TABS.map((tab) => tab.key);

/**
 * Media centre (spec §11): sticky section bar (all / news / press releases /
 * interviews / video / podcasts / events), each module a storytelling block,
 * press-office contact always last. The active section lives in `?tab=` so
 * a filtered view can be linked.
 */
const MediaCenterPage = () => {
  const { t, L, language, formatDate } = useI18n();
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab') as MediaTab | null;
  const tab: MediaTab = raw && TAB_KEYS.includes(raw) ? raw : 'all';

  const wrapRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const choose = (key: MediaTab) => {
    const next = new URLSearchParams(params);
    if (key === 'all') next.delete('tab');
    else next.set('tab', key);
    setParams(next, { replace: true, preventScrollReset: true });
    // Once the bar is docked, the reader is somewhere inside the sections;
    // a different filter changes everything below it, so return to the top
    // of the filtered list (the bar lands back in its own place under the
    // header) instead of leaving them mid-way through unrelated content.
    const wrap = wrapRef.current;
    const bar = document.getElementById('media-sections');
    if (wrap && bar && wrap.getBoundingClientRect().top < bar.getBoundingClientRect().top - 1) {
      window.requestAnimationFrame(() => wrap.scrollIntoView({ block: 'start' }));
    }
  };

  // Marks the row while more tabs hide past its right edge (any width: the
  // Kazakh labels overflow tablets too) so CSS can fade that edge.
  useEffect(() => {
    const row = tabsRef.current;
    if (!row) return;
    const update = () => {
      const overflow = row.scrollWidth > row.clientWidth + 1;
      row.dataset.more = String(overflow && row.scrollLeft + row.clientWidth < row.scrollWidth - 4);
    };
    update();
    const resize = new ResizeObserver(update);
    resize.observe(row);
    row.addEventListener('scroll', update, { passive: true });
    return () => {
      resize.disconnect();
      row.removeEventListener('scroll', update);
    };
  }, [language]);

  // Phones: the pressed tab may sit past the edge of the swipe row (deep
  // link, or a tab chosen from the hero) — bring it into view sideways only,
  // never scrolling the page itself.
  useEffect(() => {
    const row = tabsRef.current;
    const active = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const left = active.offsetLeft - row.offsetLeft;
    const right = left + active.offsetWidth;
    if (left < row.scrollLeft || right > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: Math.max(left - 16, 0) });
    }
  }, [tab]);

  const news = useMemo(() => publishedNews().map(editorialNews), []);
  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return events.filter((event) => event.date >= today).slice(0, 4);
  }, []);

  const show = (key: MediaTab) => tab === 'all' || tab === key;

  const jsonLd = useMemo(
    () => [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: L(C.seoTitle), url: ROUTES.media },
      ]),
    ],
    [t, L],
  );

  // Section numbering follows what is actually on screen.
  let n = 0;
  const block = (
    key: MediaTab,
    id: string,
    title: string,
    children: ReactNode,
    options: { tone?: SectionTone; text?: string; aside?: ReactNode } = {},
  ) => {
    if (!show(key)) return null;
    n += 1;
    const dark = options.tone === 'deep';
    return (
      <Section
        key={key}
        tone={options.tone}
        className={dark ? 'oph-on-dark' : undefined}
        aria-labelledby={id}
      >
        <Container>
          <SectionIndex n={n} onDark={dark} />
          <SectionHead
            id={id}
            eyebrow={L(MEDIA_TABS.find((entry) => entry.key === key)!.label)}
            title={title}
            text={options.text}
            size="sm"
            aside={options.aside}
          />
          {children}
        </Container>
      </Section>
    );
  };

  return (
    <>
      <Seo title={L(C.seoTitle)} description={L(C.seoDescription)} jsonLd={jsonLd} />

      <PageHero
        eyebrow={L(C.heroEyebrow)}
        title={L(C.heroTitle)}
        text={L(C.heroText)}
        crumbs={[{ label: L(C.heroTitle) }]}
        actions={
          <>
            <a className="oph-herolink" href="#press-office">
              {L(C.heroPress)} →
            </a>
            <button type="button" className="oph-herolink oph-herolink--muted oph-kb-herobtn" onClick={() => choose('video')}>
              {L(C.heroVideo)}
            </button>
          </>
        }
      />

      <Marquee className="oph-kb-marquee oph-kb-marquee--band" duration={36}>
        {mediaTopics.map((topic) => (
          <span key={topic.en} className="oph-kb-marquee__item">
            {L(topic)}
          </span>
        ))}
      </Marquee>

      {/* The wrapper bounds the sticky section bar: it releases after the
          press office instead of riding over the booking band and footer. */}
      <div className="oph-kb-mediawrap" ref={wrapRef}>
      <div className="oph-kb-tabbar" id="media-sections">
        <Container>
          <div className="oph-kb-tabbar__scroll" role="group" aria-label={L(C.tabsLabel)} ref={tabsRef}>
            {MEDIA_TABS.map((entry) => (
              <button
                key={entry.key}
                type="button"
                className="oph-kb-tabbar__tab"
                aria-pressed={tab === entry.key}
                onClick={() => choose(entry.key)}
              >
                {L(entry.label)}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <div className="oph-kb-mediasections">
        {block(
          'news',
          'media-news',
          L(C.newsTitle),
          <>
          {news.some((item) => item.demo) ? (
            <p className="oph-kb-note oph-kb-note--demo oph-kb-note--lead" role="note">
              <strong>{L(C.demoTitle)}.</strong> {L(C.demoNote)}
            </p>
          ) : null}
          <EditorialGrid key={`news-${tab}`} className="oph-kb-egrid">
            {(tab === 'news' ? news : news.slice(0, 5)).map((item) => (
              <EditorialCard
                key={item.id}
                eyebrow={item.demo ? `${L(item.category)} · ${L(C.demoTag)}` : L(item.category)}
                title={L(item.title)}
                text={L(item.excerpt)}
                to={`${ROUTES.news}/${item.slug}`}
                linkLabel={L(C.read)}
                meta={<time dateTime={item.date}>{formatDate(item.date)}</time>}
              />
            ))}
          </EditorialGrid>
          </>,
          {
            aside: (
              <Link className="oph-kb-textlink" to={ROUTES.news}>
                {L(C.allNews)}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ),
          },
        )}

        {block(
          'press',
          'media-press',
          L(C.pressTitle),
          <Stagger as="ol" className="oph-kb-press" step={90}>
            {pressReleases.map((release) => (
              <Reveal as="li" key={release.id} variant="left" className="oph-kb-press__item">
                <time className="oph-kb-press__date" dateTime={release.date}>
                  {formatDate(release.date)}
                </time>
                <div>
                  <h3 className="oph-kb-press__title">{L(release.title)}</h3>
                  <p className="oph-kb-press__text">{L(release.text)}</p>
                </div>
                {release.to ? (
                  <Link className="oph-kb-textlink" to={release.to}>
                    {L(C.read)}
                    <ArrowRight size={15} aria-hidden="true" />
                    <span className="oph-visually-hidden">: {L(release.title)}</span>
                  </Link>
                ) : null}
              </Reveal>
            ))}
          </Stagger>,
          { tone: 'tint' },
        )}

        {block(
          'interviews',
          'media-interviews',
          L(C.interviewsTitle),
          <Stagger className="oph-kb-quotes" step={110}>
            {interviews.map((interview) => {
              const author = authorById(interview.authorId);
              return (
                <Reveal key={interview.id} variant="up" as="article" className="oph-kb-quote">
                  <h3 className="oph-kb-quote__text">{L(interview.question)}</h3>
                  {author ? (
                    <p className="oph-kb-quote__by">
                      <Monogram name={L(author.name)} />
                      <span>
                        <small>{L(C.answeredBy)}</small>
                        <strong>{L(author.name)}</strong>
                        <small>{L(author.role)}</small>
                      </span>
                    </p>
                  ) : null}
                  <Link className="oph-kb-textlink" to={articlePath(interview.articleSlug)}>
                    {L(C.read)}
                    <ArrowRight size={15} aria-hidden="true" />
                    <span className="oph-visually-hidden">: {L(interview.question)}</span>
                  </Link>
                </Reveal>
              );
            })}
          </Stagger>,
          { tone: 'deep', text: L(C.interviewsText) },
        )}

        {block(
          'video',
          'media-video',
          L(C.videoTitle),
          <div className="oph-kb-videogrid">
            <Reveal variant="scale">
              <VideoPoster
                id={VIDEO_ID}
                title={L(scienceCopy.videoTitle)}
                caption={L(scienceCopy.videoCaption)}
                openLabel={C.openVideo}
              />
              <a className="oph-kb-textlink" href={SOURCE_24KZ.href} target="_blank" rel="noopener noreferrer">
                {L(scienceCopy.readArticle)}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </Reveal>
            <Reveal variant="up" delay={140} className="oph-kb-soon">
              <span className="oph-eyebrow">{L(C.videoSoon)}</span>
              <p className="oph-kb-soon__title">{L(C.videoSoonTitle)}</p>
              <p className="oph-kb-soon__text">{L(C.videoSoonText)}</p>
            </Reveal>
          </div>,
        )}

        {block(
          'podcasts',
          'media-podcasts',
          L(C.podcastsTitle),
          <>
            <TextFill text={L(C.podcastsText)} className="oph-kb-statement oph-kb-statement--sm" />
            <Stagger as="ol" className="oph-kb-episodes" step={100}>
              {podcastEpisodes.map((episode, index) => (
                <Reveal as="li" key={episode.id} variant="up" className="oph-kb-episode">
                  <span className="oph-kb-episode__icon" aria-hidden="true">
                    <Mic size={18} />
                  </span>
                  <span className="oph-kb-episode__n">
                    {L(C.episode)} {index + 1}
                  </span>
                  <h3 className="oph-kb-episode__title">{L(episode.title)}</h3>
                  <p className="oph-kb-episode__text">{L(episode.text)}</p>
                  <span className="oph-tag">{L(C.inProduction)}</span>
                </Reveal>
              ))}
            </Stagger>
          </>,
          { tone: 'tint' },
        )}

        {block(
          'events',
          'media-events',
          L(C.eventsTitle),
          <EditorialGrid key={`events-${tab}`} className="oph-kb-egrid">
            {upcoming.map((event) => (
              <EditorialCard
                key={event.id}
                eyebrow={L(event.format)}
                title={L(event.title)}
                text={L(event.place)}
                to={`${ROUTES.academy}#calendar`}
                linkLabel={L(C.eventsAll)}
                meta={
                  <time dateTime={event.date}>
                    {formatDate(event.date, { day: 'numeric', month: 'long' })} · {event.time}
                  </time>
                }
              />
            ))}
          </EditorialGrid>,
          {
            aside: (
              <Link className="oph-kb-textlink" to={ROUTES.academy}>
                {L(C.eventsAll)}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ),
          },
        )}
      </div>

      {/* Press office — always shown */}
      <Section tone="deep" className="oph-on-dark oph-kb-anchor" id="press-office" aria-labelledby="media-press-office">
        <Container>
          <SectionIndex n={n + 1} onDark />
          <div className="oph-duo oph-kb-duo-top">
            <SectionHead
              id="media-press-office"
              eyebrow={L(C.pressContactEyebrow)}
              title={L(C.pressContactTitle)}
              text={L(C.pressContactText)}
              size="sm"
            />
            <Reveal variant="up" className="oph-kb-presscard">
              <a className="oph-kb-presscard__line" href={`mailto:${site.organization.email}?subject=Press`}>
                <Mail size={16} aria-hidden="true" />
                {site.organization.email}
              </a>
              <a className="oph-kb-presscard__line" href={`tel:${site.organization.phoneHref}`}>
                <Phone size={16} aria-hidden="true" />
                {site.organization.phone}
              </a>
              <p className="oph-eyebrow">{L(C.pressKitTitle)}</p>
              <ul className="oph-ringlist">
                {C.pressKit[language].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a className="oph-kb-textlink" href={`mailto:${site.organization.email}?subject=Press%20kit`}>
                {L(C.write)}
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </Container>
      </Section>
      </div>

      <CtaBand title={L(C.ctaTitle)} />
    </>
  );
};

export default MediaCenterPage;
