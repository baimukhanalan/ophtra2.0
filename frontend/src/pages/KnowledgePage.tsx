import { useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, RotateCcw, Search } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Accordion, Container, EmptyState, Input, Section, Select } from '@/ui';
import { Marquee, Reveal, ScrollFx, Stagger, TextFill } from '@/motion';
import { Seo, breadcrumbSchema, faqSchema } from '@/seo/Seo';
import { PageHero, HeroLink } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { SectionHead, SectionIndex } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import {
  DISEASE_LIBRARY,
  FOUNDER_ID,
  KNOWLEDGE_CATEGORIES,
  TAG_LABELS,
  founderProfile,
  knowledgeCopy as C,
  knowledgeFaq,
} from '@/content/pages/knowledge';
import {
  KNOWLEDGE_INDEX,
  articleBySlug,
  countByCategory,
  knowledgeAuthors,
  usedTags,
} from '@/content/pages/knowledge-articles-index';
import { authorById } from '@/content/pages/knowledge-authors';
import { publications } from '@/content/pages/science-publications';
import type { KnowledgeCategory, KnowledgeTag } from '@/content/pages/knowledge-types';
import { itemListSchema } from '@/content/pages/knowledge-schema';
import { ArticleGrid, Monogram, articlePath } from './knowledge/parts';

const normalise = (value: string) => value.toLocaleLowerCase().replace(/ё/g, 'е').trim();

/** Tags shown before «Все теги» — one calm row instead of a 25-tag cloud. */
const TAGS_COLLAPSED = 8;

/** Materials shown before «Показать ещё» (keeps the page short on phones). */
const PAGE_SIZE = 9;

/**
 * Knowledge base — Figma «07 База знаний» (spec §6.7).
 * Theme index → searchable, filterable materials (query, theme, tag; state
 * kept in the URL so a filtered view can be shared) → A–Z disease library →
 * expert authors → FAQ.
 */
const KnowledgePage = () => {
  const { t, L, language } = useI18n();
  const [params, setParams] = useSearchParams();

  // Stale or tampered links may carry a theme/tag that no longer exists:
  // ignore it instead of filtering (or rendering a label) for it.
  const rawTopic = params.get('topic') ?? '';
  const topic: KnowledgeCategory | '' = KNOWLEDGE_CATEGORIES.some((entry) => entry.key === rawTopic)
    ? (rawTopic as KnowledgeCategory)
    : '';
  const rawTag = params.get('tag') ?? '';
  const tag: KnowledgeTag | '' = Object.prototype.hasOwnProperty.call(TAG_LABELS, rawTag)
    ? (rawTag as KnowledgeTag)
    : '';
  const [query, setQuery] = useState(params.get('q') ?? '');
  const deferredQuery = useDeferredValue(query);

  // Keep the URL in step with the search box without a history entry per key.
  useEffect(() => {
    const current = params.get('q') ?? '';
    if (current === query) return;
    const next = new URLSearchParams(params);
    if (query) next.set('q', query);
    else next.delete('q');
    setParams(next, { replace: true, preventScrollReset: true });
  }, [query, params, setParams]);

  const setParam = (key: 'topic' | 'tag', value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const reset = () => {
    setQuery('');
    setParams(new URLSearchParams(), { replace: true, preventScrollReset: true });
  };

  const chooseTopic = (key: KnowledgeCategory) => {
    setParam('topic', key);
    document.getElementById('materials')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const tags = useMemo(() => usedTags(), []);
  const [tagsOpen, setTagsOpen] = useState(false);
  // Collapsed: the most used tags, plus the active one if it is further down.
  const visibleTags = tagsOpen
    ? tags
    : [...tags.slice(0, TAGS_COLLAPSED), ...(tag && !tags.slice(0, TAGS_COLLAPSED).includes(tag) ? [tag] : [])];

  const filtered = useMemo(() => {
    const needle = normalise(deferredQuery);
    return KNOWLEDGE_INDEX.filter((article) => {
      if (topic && article.category !== topic) return false;
      if (tag && !article.tags.includes(tag)) return false;
      if (!needle) return true;
      const haystack = normalise(
        [
          L(article.title),
          L(article.excerpt),
          L(KNOWLEDGE_CATEGORIES.find((entry) => entry.key === article.category)!.label),
          ...article.tags.map((entry) => L(TAG_LABELS[entry])),
          ...article.headings.map((heading) => L(heading)),
        ].join(' '),
      );
      return needle.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [deferredQuery, topic, tag, L]);

  // «Показать ещё»: reset whenever the filters change.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filterKey = `${topic}|${tag}|${deferredQuery}`;
  const [shownFor, setShownFor] = useState(filterKey);
  if (shownFor !== filterKey) {
    setShownFor(filterKey);
    setVisibleCount(PAGE_SIZE);
  }
  const shown = filtered.slice(0, visibleCount);
  const resultsRef = useRef<HTMLDivElement>(null);
  const showMore = () => {
    const first = visibleCount;
    setVisibleCount((count) => count + PAGE_SIZE);
    // Move focus to the first newly shown card so keyboard users keep their place.
    requestAnimationFrame(() =>
      resultsRef.current
        ?.querySelectorAll<HTMLElement>('.oph-egrid__cell')
        [first]?.querySelector<HTMLElement>('a')
        ?.focus(),
    );
  };

  const library = useMemo(() => {
    const collator = new Intl.Collator(language);
    const sorted = [...DISEASE_LIBRARY].sort((a, b) => collator.compare(L(a.name), L(b.name)));
    const groups = new Map<string, typeof sorted>();
    sorted.forEach((entry) => {
      const letter = L(entry.name).charAt(0).toLocaleUpperCase();
      groups.set(letter, [...(groups.get(letter) ?? []), entry]);
    });
    return [...groups.entries()];
  }, [L, language]);

  const authors = useMemo(() => knowledgeAuthors(), []);
  const founder = authorById(FOUNDER_ID);
  const filtersActive = Boolean(query || topic || tag);

  const jsonLd = useMemo(
    () => [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: L(C.heroTitle), url: ROUTES.knowledge },
      ]),
      itemListSchema(
        L(C.heroTitle),
        KNOWLEDGE_INDEX.map((article) => ({ name: L(article.title), url: articlePath(article.slug) })),
      ),
      faqSchema(knowledgeFaq.map((item) => ({ question: L(item.q), answer: L(item.a) }))),
    ],
    [t, L],
  );

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
            <a className="oph-herolink" href="#materials">
              {L(C.heroMaterials)} →
            </a>
            <a className="oph-herolink oph-herolink--muted" href="#library">
              {L(C.heroLibrary)}
            </a>
            <HeroLink to={ROUTES.faq} muted>
              {t.nav.faq}
            </HeroLink>
          </>
        }
      />

      {/* 01 — themes */}
      <Section aria-labelledby="kb-themes">
        <Container>
          <SectionIndex n={1} />
          <TextFill text={L(C.statement)} className="oph-kb-statement" />
          <SectionHead id="kb-themes" eyebrow={L(C.themesEyebrow)} title={L(C.themesTitle)} size="sm" />
          <ScrollFx className="oph-kb-themes">
            <Stagger className="oph-kb-themes__grid" step={60}>
              {KNOWLEDGE_CATEGORIES.map((category, index) => (
                <Reveal
                  key={category.key}
                  variant="up"
                  className="oph-kb-theme"
                  style={{ ['--i' as string]: index % 4 } as CSSProperties}
                >
                  <button
                    type="button"
                    className="oph-kb-theme__btn"
                    aria-pressed={topic === category.key}
                    onClick={() => chooseTopic(category.key)}
                  >
                    <span className="oph-kb-theme__n">{String(index + 1).padStart(2, '0')}</span>
                    <span className="oph-kb-theme__label">{L(category.label)}</span>
                    <span className="oph-kb-theme__text">{L(category.text)}</span>
                    <span className="oph-kb-theme__count">
                      {countByCategory(category.key)} {L(C.themeCount)}
                      <ArrowRight size={15} aria-hidden="true" />
                    </span>
                  </button>
                </Reveal>
              ))}
            </Stagger>
          </ScrollFx>
        </Container>
      </Section>

      {/* 02 — materials */}
      <Section tone="tint" aria-labelledby="kb-materials" id="materials" className="oph-kb-anchor">
        <Container>
          <SectionIndex n={2} />
          <SectionHead id="kb-materials" eyebrow={L(C.materialsEyebrow)} title={L(C.materialsTitle)} size="sm" />

          <Reveal variant="up">
            <form
              className="oph-kb-search"
              role="search"
              onSubmit={(event) => event.preventDefault()}
              aria-label={L(C.searchLabel)}
            >
              <div className="oph-kb-search__query">
                <Input
                  type="search"
                  label={L(C.searchLabel)}
                  placeholder={L(C.searchPlaceholder)}
                  icon={<Search size={16} />}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="oph-kb-search__topic">
                <Select
                  label={L(C.topicLabel)}
                  value={topic}
                  onChange={(event) => setParam('topic', event.target.value)}
                  options={[
                    { value: '', label: L(C.allTopics) },
                    ...KNOWLEDGE_CATEGORIES.map((category) => ({
                      value: category.key,
                      label: L(category.label),
                    })),
                  ]}
                />
              </div>
              <button type="button" className="oph-kb-reset" onClick={reset} disabled={!filtersActive}>
                <RotateCcw size={15} aria-hidden="true" />
                {t.common.reset}
              </button>
              <p className="oph-kb-search__count" aria-live="polite">
                {L(C.count)}: <strong>{filtered.length}</strong>
              </p>
            </form>
          </Reveal>

          <Reveal variant="fade" delay={120}>
            <div className="oph-kb-tags" id="kb-tags" role="group" aria-label={L(C.tagsLabel)}>
              {visibleTags.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  className="oph-kb-tag"
                  aria-pressed={tag === entry}
                  onClick={() => setParam('tag', tag === entry ? '' : entry)}
                >
                  #{L(TAG_LABELS[entry])}
                </button>
              ))}
              {tags.length > TAGS_COLLAPSED ? (
                <button
                  type="button"
                  className="oph-kb-tag oph-kb-tag--more"
                  aria-expanded={tagsOpen}
                  aria-controls="kb-tags"
                  onClick={() => setTagsOpen((open) => !open)}
                >
                  {tagsOpen ? L(C.tagsLess) : `${L(C.tagsMore)} (${tags.length - TAGS_COLLAPSED})`}
                  <ChevronDown size={14} aria-hidden="true" className="oph-kb-tag__chev" />
                </button>
              ) : null}
            </div>
          </Reveal>

          <div className="oph-kb-results" id="kb-results" ref={resultsRef}>
            {filtered.length ? (
              <>
                <div key={filterKey}>
                  <ArticleGrid articles={shown} />
                </div>
                {filtered.length > shown.length ? (
                  <div className="oph-kb-more">
                    <button type="button" className="oph-kb-reset" aria-controls="kb-results" onClick={showMore}>
                      {L(C.showMore)} ({filtered.length - shown.length})
                      <ChevronDown size={15} aria-hidden="true" />
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <EmptyState
                title={L(C.emptyTitle)}
                text={L(C.emptyText)}
                icon={<Search size={28} />}
                action={
                  <button type="button" className="oph-kb-reset" onClick={reset}>
                    <RotateCcw size={15} aria-hidden="true" />
                    {t.common.reset}
                  </button>
                }
              />
            )}
          </div>
        </Container>
      </Section>

      {/* 03 — disease library A–Z */}
      <Section aria-labelledby="kb-library" id="library" className="oph-kb-anchor">
        <Container>
          <SectionIndex n={3} />
          <SectionHead
            id="kb-library"
            eyebrow={L(C.libraryEyebrow)}
            title={L(C.libraryTitle)}
            text={L(C.libraryText)}
            size="sm"
          />
        </Container>

        <Marquee className="oph-kb-marquee" duration={46}>
          {DISEASE_LIBRARY.map((entry) => (
            <span key={entry.id} className="oph-kb-marquee__item">
              {L(entry.name)}
            </span>
          ))}
        </Marquee>

        <Container>
          <nav className="oph-kb-letters" aria-label={L(C.libraryLetters)}>
            {library.map(([letter], index) => (
              <a key={letter} href={`#lib-${index}`}>
                {letter}
              </a>
            ))}
          </nav>

          <div className="oph-kb-library">
            {library.map(([letter, entries], index) => (
              <section key={letter} id={`lib-${index}`} className="oph-kb-library__group" aria-label={letter}>
                <Reveal variant="fade" className="oph-kb-library__letter">
                  {letter}
                </Reveal>
                <Stagger className="oph-kb-library__entries" step={70}>
                  {entries.map((entry) => {
                    const article = entry.articleSlug ? articleBySlug(entry.articleSlug) : undefined;
                    return (
                      <Reveal key={entry.id} variant="up" as="article" className="oph-kb-disease">
                        <h3 className="oph-kb-disease__name">{L(entry.name)}</h3>
                        <p className="oph-kb-disease__text">{L(entry.text)}</p>
                        <div className="oph-kb-disease__links">
                          {article ? (
                            <Link className="oph-kb-textlink" to={articlePath(article.slug)}>
                              {L(C.readArticle)}
                              <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                          ) : null}
                          <Link className="oph-kb-textlink oph-kb-textlink--muted" to={entry.route}>
                            {L(C.seeService)}
                          </Link>
                        </div>
                      </Reveal>
                    );
                  })}
                </Stagger>
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {/* 04 — authors */}
      <Section tone="deep" aria-labelledby="kb-authors" className="oph-on-dark">
        <Container>
          <SectionIndex n={4} onDark />
          <SectionHead
            id="kb-authors"
            eyebrow={L(C.authorsEyebrow)}
            title={L(C.authorsTitle)}
            text={L(C.authorsText)}
            size="sm"
          />
          <Stagger className="oph-kb-authors" step={80}>
            {authors.map(({ author, count }) => (
              <Reveal key={author.id} variant="up" className="oph-kb-authors__cell">
                <Link className="oph-kb-authorlink" to={author.pageRoute}>
                  <Monogram name={L(author.name)} />
                  <span className="oph-kb-authorlink__name">{L(author.name)}</span>
                  <span className="oph-kb-authorlink__role">{L(author.role)}</span>
                  {author.isDemo ? <span className="oph-kb-authorlink__demo">{L(C.demoProfile)}</span> : null}
                  <span className="oph-kb-authorlink__count">
                    {count} {L(C.authorMaterials)}
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
            {founder ? (
              <Reveal variant="up" className="oph-kb-authors__cell">
                {/* Listed for his own peer-reviewed papers, not as a KB author. */}
                <Link className="oph-kb-authorlink" to={founder.pageRoute}>
                  <Monogram name={L(founder.name)} />
                  <span className="oph-kb-authorlink__name">{L(founder.name)}</span>
                  <span className="oph-kb-authorlink__role">{L(founderProfile.role)}</span>
                  <span className="oph-kb-authorlink__count">
                    {publications.length} {L(C.founderCardCount)}
                    <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ) : null}
          </Stagger>
        </Container>
      </Section>

      {/* 05 — FAQ */}
      <Section aria-labelledby="kb-faq">
        <Container>
          <div className="oph-kb-faq">
            <div>
              <SectionIndex n={5} />
              <SectionHead id="kb-faq" eyebrow={L(C.faqEyebrow)} title={L(C.faqTitle)} size="sm" />
              <Reveal variant="up" delay={160}>
                <Link className="oph-kb-textlink" to={ROUTES.faq}>
                  {L(C.faqAll)}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
            <Reveal variant="up">
              <Accordion
                items={knowledgeFaq.map((item, index) => ({
                  id: `kb-faq-${index}`,
                  question: L(item.q),
                  answer: L(item.a),
                }))}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand title={L(C.ctaTitle)} />
    </>
  );
};

export default KnowledgePage;
