import { useDeferredValue, useMemo, useState } from 'react';
import { byId, doctors } from '../lib/data';
import { ARTICLES, K, categoryLabel } from '../lib/knowledge';
import { mapLink } from '../lib/links';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { scrollToEl } from '../lib/scroll';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { Accordion, Arrow, Hero, JumpLink, LensCta, SectionHead, usePageTitle } from '../ui/parts';
import './pages.css';
import './knowledge.css';

const C = K.knowledgeCopy;
const PAGE = 9;

export const authorName = (id: string) =>
  id === 'editorial' ? 'Редакция центра' : id === 'founder' ? 'Мухит Кулмаганбетов' : (byId(doctors, id)?.name ?? '');

export default function Knowledge() {
  useScenePreset(PRESETS.knowledge);
  usePageTitle(C.seoTitle);
  const [cat, setCat] = useState('all');
  const [tag, setTag] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [allTags, setAllTags] = useState(false);
  const dq = useDeferredValue(q.trim().toLowerCase());

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    ARTICLES.forEach((a) => (m[a.category] = (m[a.category] ?? 0) + 1));
    return m;
  }, []);
  const tags = useMemo(() => [...new Set(ARTICLES.flatMap((a) => a.tags))], []);
  const list = useMemo(
    () =>
      [...ARTICLES]
        .sort((a, b) => b.date.localeCompare(a.date))
        .filter(
          (a) =>
            (cat === 'all' || a.category === cat) &&
            (!tag || a.tags.includes(tag)) &&
            (!dq || (a.title + ' ' + a.excerpt + ' ' + categoryLabel(a.category) + ' ' + a.tags.map((t) => K.TAG_LABELS[t]).join(' ')).toLowerCase().includes(dq)),
        ),
    [cat, tag, dq],
  );
  const letters = useMemo(() => [...new Set(K.DISEASE_LIBRARY.map((d) => d.name[0].toUpperCase()))].sort((a, b) => a.localeCompare(b, 'ru')), []);
  const authors = useMemo(() => {
    const m = new Map<string, number>();
    ARTICLES.forEach((a) => m.set(a.authorId, (m.get(a.authorId) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const pickCat = (c: string) => {
    setCat(c);
    setShown(PAGE);
    scrollToEl(document.getElementById('materials'));
  };
  const reset = () => {
    setCat('all');
    setTag(null);
    setQ('');
  };

  return (
    <div className="kb">
      <Hero
        eyebrow={C.heroEyebrow}
        title={C.heroTitle}
        size="xl"
        accent={[1]}
        lead={C.heroText}
        tag="Световой стол · Элемент 01 / 03 — цилиндрическая линза"
        actions={
          <>
            <JumpLink to="materials" className="btn">
              {C.heroMaterials} <Arrow />
            </JumpLink>
            <JumpLink to="library" className="btn btn--ghost">
              {C.heroLibrary}
            </JumpLink>
          </>
        }
      />

      <section className="sec sec--ink sec--tight">
        <div className="wrap">
          <FocusText as="p" className="statement kb__statement" text={C.statement} />
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="themes-h">
        <div className="wrap">
          <SectionHead eyebrow={C.themesEyebrow} title={C.themesTitle} id="themes-h" />
          <div className="themes mt-l">
            {K.KNOWLEDGE_CATEGORIES.map((c, i) => (
              <button key={c.key} type="button" className="theme rv" style={{ ['--d' as string]: `${(i % 4) * 0.05}s` }} onClick={() => pickCat(c.key)} aria-pressed={cat === c.key}>
                <span className="theme__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="h3">{c.label}</span>
                <span className="small muted">{c.text}</span>
                <span className="anno">
                  {counts[c.key] ?? 0} {C.themeCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* the light table */}
      <section className="sec sec--sand" id="materials" aria-labelledby="mat-h">
        <div className="wrap">
          <SectionHead eyebrow={C.materialsEyebrow} title={C.materialsTitle} id="mat-h" />
          <div className="lt-tools mt-m" role="search">
            <div className="field search">
              <label htmlFor="kb-q" className="sr-only">
                {C.searchLabel}
              </label>
              <input id="kb-q" className="field__input" type="search" placeholder={C.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="filters" role="group" aria-label={C.topicLabel}>
              <button type="button" className="filter" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
                {C.allTopics}
              </button>
              {K.KNOWLEDGE_CATEGORIES.map((c) => (
                <button key={c.key} type="button" className="filter" aria-pressed={cat === c.key} onClick={() => setCat(c.key)}>
                  {c.label}
                </button>
              ))}
            </div>
            <div className="filters lt-tags" role="group" aria-label={C.tagsLabel}>
              {(allTags ? tags : tags.slice(0, 10)).map((t) => (
                <button key={t} type="button" className="filter filter--tag" aria-pressed={tag === t} onClick={() => setTag(tag === t ? null : t)}>
                  #{K.TAG_LABELS[t] ?? t}
                </button>
              ))}
              <button type="button" className="link" onClick={() => setAllTags((v) => !v)} aria-expanded={allTags}>
                {allTags ? C.tagsLess : C.tagsMore}
              </button>
            </div>
          </div>
          <p className="anno mt-m" aria-live="polite">
            {C.count}: {list.length}
          </p>

          <div className="lighttable mt-s">
            {list.length === 0 ? (
              <div className="empty lt-empty">
                <p className="h3">{C.emptyTitle}</p>
                <p className="body">{C.emptyText}</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <ul className="lt-grid" role="list">
                {list.slice(0, shown).map((a, i) => (
                  <li key={a.slug}>
                    <TLink to={`${R.knowledge}/${a.slug}`} className="slide" style={{ ['--tilt' as string]: `${((i * 7) % 5) - 2}deg` }}>
                      <span className="slide__mount" aria-hidden="true" />
                      <span className="anno">
                        {categoryLabel(a.category)} · {a.readingMinutes} {C.minutes}
                      </span>
                      <span className="h3">{a.title}</span>
                      <span className="small muted">{a.excerpt}</span>
                      <span className="slide__by small">
                        {authorName(a.authorId)}
                        {a.authorId !== 'editorial' && <em> · {C.demoProfile}</em>}
                      </span>
                    </TLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {list.length > shown && (
            <div className="center mt-m">
              <button type="button" className="btn btn--ghost" onClick={() => setShown((s) => s + PAGE)}>
                {C.showMore}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="stage kb-lib" id="library" data-stage data-el={1} aria-labelledby="lib-h">
        <div className="wrap split">
          <div className="split__sticky">
            <SectionHead eyebrow={C.libraryEyebrow} title={C.libraryTitle} text={C.libraryText} id="lib-h" />
            <nav className="letters mt-m" aria-label={C.libraryLetters}>
              {letters.map((l) => (
                <JumpLink key={l} to={'lib-' + l} className="letter">
                  {l}
                </JumpLink>
              ))}
            </nav>
          </div>
          <dl className="lib">
            {K.DISEASE_LIBRARY.map((d, i) => {
              const first = K.DISEASE_LIBRARY.findIndex((x) => x.name[0].toUpperCase() === d.name[0].toUpperCase()) === i;
              return (
                <div key={d.id} className="lib__item glass rv" id={first ? 'lib-' + d.name[0].toUpperCase() : undefined}>
                  <dt className="h3">{d.name}</dt>
                  <dd>
                    <p className="body">{d.text}</p>
                    <p className="row mt-s">
                      {d.articleSlug && (
                        <TLink to={`${R.knowledge}/${d.articleSlug}`} className="link">
                          {C.readArticle}
                        </TLink>
                      )}
                      {d.route && (
                        <TLink to={mapLink(d.route)} className="link">
                          {C.seeService}
                        </TLink>
                      )}
                    </p>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      <section className="sec sec--paper" aria-labelledby="auth-h">
        <div className="wrap">
          <SectionHead eyebrow={C.authorsEyebrow} title={C.authorsTitle} text={C.authorsText} id="auth-h" />
          <ul className="tiles mt-l" role="list">
            {authors.map(([id, n]) => {
              const d = byId(doctors, id);
              return (
                <li key={id} className="tile rv">
                  <span className="h3">{authorName(id)}</span>
                  <span className="small muted">{d ? `${d.role} · ${C.demoProfile}` : 'Материалы по клиническим рекомендациям и публикациям'}</span>
                  <span className="anno">
                    {n} {C.authorMaterials}
                  </span>
                  {d && (
                    <TLink to={`${R.doctors}/${d.slug}`} className="link">
                      Профиль <Arrow />
                    </TLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="kfaq-h">
        <div className="wrap split">
          <SectionHead eyebrow={C.faqEyebrow} title={C.faqTitle} id="kfaq-h">
            <TLink to={R.faq} className="link">
              {C.faqAll} <Arrow />
            </TLink>
          </SectionHead>
          <Accordion items={K.knowledgeFaq} />
        </div>
      </section>

      <LensCta el={2} title={C.ctaTitle} />
    </div>
  );
}
