import { useMemo, useState, type CSSProperties } from 'react';
import { C, byId, doctors, fmtDate } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { Accordion, Arrow, Hero, Scrub, SectionHead, Station } from '../components/ui';
import { SearchIcon } from './Doctors';

const K = C.knowledge.knowledgeCopy;
const CATS = C.knowledge.KNOWLEDGE_CATEGORIES as Array<{ key: string; label: string; text: string }>;
const LIB = C.knowledge.DISEASE_LIBRARY as Array<{ id: string; name: string; text: string; articleSlug?: string }>;
export interface KArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  authorId: string;
  date: string;
  readingMinutes: number;
  headings: string[];
  serviceSlug?: string;
  basedOn?: string[];
}
export const ARTICLES = C.knowledge_articles_index.KNOWLEDGE_INDEX as KArticle[];

export const authorName = (id: string) =>
  byId(doctors, id)?.name ?? (id === 'founder' ? 'Доктор Мухит Кулмаганбетов' : 'Редакция центра');

export default function Knowledge() {
  usePage('База знаний', 'aqueous');
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(9);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return ARTICLES.filter((a) => (cat === 'all' || a.category === cat) && (!s || `${a.title} ${a.excerpt}`.toLowerCase().includes(s))).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [cat, q]);
  const letters = Array.from(new Set(LIB.map((d) => d.name[0].toUpperCase()))).sort((a, b) => a.localeCompare(b, 'ru'));

  return (
    <>
      <Hero station="aqueous" layer="Стекловидное тело — прозрачная среда" eyebrow={K.heroEyebrow} title="Знание, в котором всё видно" accent={['видно']} lead={K.heroText}>
        <a href="#materials" className="btn">
          {K.heroMaterials} <Arrow />
        </a>
        <a href="#library" className="btn btn--ghost">
          {K.heroLibrary}
        </a>
      </Hero>

      <section className="sect" aria-label="Принцип">
        <Station id="lens" />
        <div className="wrap">
          <Scrub className="quote" text={K.statement} />
        </div>
      </section>

      <section className="sect" aria-labelledby="th-h">
        <Station id="vitreous" />
        <div className="wrap">
          <SectionHead eyebrow={K.themesEyebrow} title={K.themesTitle} />
          <h2 id="th-h" className="sr-only">
            {K.themesTitle}
          </h2>
          <div className="grid-4 themes">
            {CATS.map((c, i) => {
              const n = ARTICLES.filter((a) => a.category === c.key).length;
              return (
                <button
                  key={c.key}
                  type="button"
                  className="card theme"
                  data-reveal
                  style={{ '--d': (i % 4) * 70 } as CSSProperties}
                  onClick={() => {
                    setCat(c.key);
                    document.getElementById('materials')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="theme__bubble" aria-hidden="true" />
                  <span className="h3">{c.label}</span>
                  <span className="body">{c.text}</span>
                  <span className="small">
                    {n} {K.themeCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sect" id="materials" aria-labelledby="mt-h">
        <Station id="vitreous" />
        <div className="wrap">
          <SectionHead eyebrow={K.materialsEyebrow} title={K.materialsTitle} />
          <h2 id="mt-h" className="sr-only">
            {K.materialsTitle}
          </h2>
          <div className="toolbar" role="search">
            <label className="search">
              <span className="sr-only">{K.searchLabel}</span>
              <SearchIcon />
              <input type="search" value={q} placeholder={K.searchPlaceholder} onChange={(e) => setQ(e.target.value)} />
            </label>
          </div>
          <div className="toolbar" role="group" aria-label={K.topicLabel}>
            <button type="button" className="chip" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
              {K.allTopics}
            </button>
            {CATS.map((c) => (
              <button key={c.key} type="button" className="chip" aria-pressed={cat === c.key} onClick={() => setCat(c.key)}>
                {c.label}
              </button>
            ))}
          </div>
          <p className="small" aria-live="polite">
            {K.count}: {list.length}
          </p>
          {list.length === 0 ? (
            <div className="empty">
              <p className="h3">{K.emptyTitle}</p>
              <p>{K.emptyText}</p>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setQ(''); setCat('all'); }}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <ul className="art-grid">
                {list.slice(0, limit).map((a) => (
                  <li key={a.slug}>
                    <IrisLink to={`/knowledge-base/${a.slug}`} className="art">
                      <span className="small">
                        {CATS.find((c) => c.key === a.category)?.label} · {a.readingMinutes} {K.minutes}
                      </span>
                      <span className="h3">{a.title}</span>
                      <span className="body">{a.excerpt}</span>
                      <span className="art__foot">
                        {authorName(a.authorId)} · {fmtDate(a.date)}
                      </span>
                    </IrisLink>
                  </li>
                ))}
              </ul>
              {list.length > limit && (
                <button type="button" className="btn btn--ghost" onClick={() => setLimit((l) => l + 9)}>
                  {K.showMore}
                </button>
              )}
            </>
          )}
        </div>
      </section>

      <section className="sect" id="library" aria-labelledby="lb-h">
        <Station id="retina" />
        <div className="wrap">
          <SectionHead eyebrow={K.libraryEyebrow} title={K.libraryTitle} text={K.libraryText} />
          <h2 id="lb-h" className="sr-only">
            {K.libraryTitle}
          </h2>
          <nav className="letters" aria-label={K.libraryLetters}>
            {letters.map((l) => (
              <a key={l} href={`#lib-${l}`}>
                {l}
              </a>
            ))}
          </nav>
          <dl className="lib">
            {LIB.slice()
              .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
              .map((d, i, arr) => {
                const L = d.name[0].toUpperCase();
                const firstOf = i === 0 || arr[i - 1].name[0].toUpperCase() !== L;
                return (
                  <div key={d.id} className="lib__row" id={firstOf ? `lib-${L}` : undefined} data-reveal>
                    <dt>
                      <span className="lib__l" aria-hidden="true">
                        {firstOf ? L : ''}
                      </span>
                      {d.name}
                    </dt>
                    <dd>
                      <p className="body">{d.text}</p>
                      {d.articleSlug && ARTICLES.some((a) => a.slug === d.articleSlug) && (
                        <IrisLink to={`/knowledge-base/${d.articleSlug}`} className="link">
                          {K.readArticle} <Arrow />
                        </IrisLink>
                      )}
                    </dd>
                  </div>
                );
              })}
          </dl>
        </div>
      </section>

      <section className="sect sect--tight" aria-labelledby="kfq-h">
        <Station id="macula" />
        <div className="wrap split-2">
          <SectionHead eyebrow={K.faqEyebrow} title={K.faqTitle} />
          <div>
            <h2 id="kfq-h" className="sr-only">
              {K.faqTitle}
            </h2>
            <Accordion items={C.knowledge.knowledgeFaq.map((f: { q: string; a: string }) => ({ q: f.q, a: <p>{f.a}</p> }))} />
          </div>
        </div>
      </section>
    </>
  );
}
