import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Newspaper } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, EmptyState, Section } from '@/ui';
import { Reveal, Stagger } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { PageHero, HeroLink } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { publishedNews } from '@/content/news';
import { MEDIA_TABS, editorialNews, mediaCopy as C } from '@/content/pages/media';
import { itemListSchema } from '@/content/pages/knowledge-schema';

/**
 * News list in the Figma language: forest hero, rubric chips, balanced
 * editorial grid, then a bridge to the rest of the media centre.
 * The rubric lives in `?category=` (English label, stable across languages).
 */
const NewsPage = () => {
  const { t, L, formatDate } = useI18n();
  const [params, setParams] = useSearchParams();
  const items = useMemo(() => publishedNews().map(editorialNews), []);
  const anyDemo = items.some((item) => item.demo);
  const categories = useMemo(() => {
    const unique = new Map<string, (typeof items)[number]['category']>();
    items.forEach((item) => unique.set(item.category.en, item.category));
    return [...unique.entries()];
  }, [items]);

  // An unknown rubric in the URL (stale or tampered link) falls back to «all».
  const rawCategory = params.get('category') ?? 'all';
  const category = categories.some(([key]) => key === rawCategory) ? rawCategory : 'all';

  const filtered = items.filter((item) => category === 'all' || item.category.en === category);

  const choose = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete('category');
    else next.set('category', value);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const jsonLd = useMemo(
    () => [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: t.nav.mediaCenter, url: ROUTES.media },
        { name: t.nav.news, url: ROUTES.news },
      ]),
      // Demo stories are not advertised to search engines.
      ...(items.some((item) => !item.demo)
        ? [
            itemListSchema(
              t.nav.news,
              items
                .filter((item) => !item.demo)
                .map((item) => ({ name: L(item.title), url: `${ROUTES.news}/${item.slug}` })),
            ),
          ]
        : []),
    ],
    [t, L, items],
  );

  const bridges = MEDIA_TABS.filter((tab) => tab.key !== 'all' && tab.key !== 'news');

  return (
    <>
      <Seo title={t.nav.news} description={L(C.newsSeoDescription)} jsonLd={jsonLd} />

      <PageHero
        eyebrow={t.nav.mediaCenter}
        title={t.nav.news}
        text={L(C.newsHeroText)}
        crumbs={[{ label: t.nav.mediaCenter, to: ROUTES.media }, { label: t.nav.news }]}
        actions={
          <>
            <a className="oph-herolink" href="#news-feed">
              {L(C.newsListEyebrow)} →
            </a>
            <HeroLink to={ROUTES.media} muted>
              {t.nav.mediaCenter}
            </HeroLink>
          </>
        }
      />

      <Section aria-labelledby="news-list" id="news-feed" className="oph-kb-anchor">
        <Container>
          <SectionIndex n={1} />
          <SectionHead
            id="news-list"
            eyebrow={L(C.newsListEyebrow)}
            title={t.common.allNews}
            size="sm"
            aside={
              <div className="oph-chips oph-kb-chips" role="group" aria-label={L(C.newsCategory)}>
                <button
                  type="button"
                  className="oph-chip"
                  aria-pressed={category === 'all'}
                  onClick={() => choose('all')}
                >
                  {t.common.all}
                </button>
                {categories.map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className="oph-chip"
                    aria-pressed={category === key}
                    onClick={() => choose(key)}
                  >
                    {L(label)}
                  </button>
                ))}
              </div>
            }
          />

          {anyDemo ? (
            <Reveal variant="fade">
              <div className="oph-kb-note oph-kb-note--demo" role="note">
                {/* One flex item, so the title runs into the sentence instead
                    of standing as a narrow column beside it. */}
                <span>
                  <strong>{L(C.demoTitle)}.</strong> {L(C.demoNote)}
                </span>
              </div>
            </Reveal>
          ) : null}

          <p className="oph-kb-search__count oph-kb-count" aria-live="polite">
            {L(C.newsCount)}: <strong>{filtered.length}</strong>
          </p>

          {filtered.length ? (
            <div key={category}>
              <EditorialGrid className="oph-kb-egrid">
                {filtered.map((item) => (
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
            </div>
          ) : (
            <EmptyState
              title={t.common.nothingFound}
              text={t.common.nothingFoundText}
              icon={<Newspaper size={28} />}
              action={
                <button type="button" className="oph-kb-reset" onClick={() => choose('all')}>
                  {t.common.reset}
                </button>
              }
            />
          )}
        </Container>
      </Section>

      <Section tone="tint" aria-labelledby="news-more">
        <Container>
          <SectionIndex n={2} />
          <SectionHead id="news-more" eyebrow={L(C.moreEyebrow)} title={L(C.moreTitle)} size="sm" />
          <Stagger className="oph-kb-bridges" step={70}>
            {bridges.map((tab) => (
              <Reveal key={tab.key} variant="up">
                <Link className="oph-kb-bridge" to={`${ROUTES.media}?tab=${tab.key}`}>
                  <span>{L(tab.label)}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default NewsPage;
