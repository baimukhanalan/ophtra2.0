import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { C, fmtDate, loadKnowledgeBodies } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { refreshMarkers, scanReveals, trackProgress } from '../lib/engine';
import { Accordion, Arrow, Split, Station } from '../components/ui';
import { ARTICLES, authorName } from './Knowledge';
import NotFound from './NotFound';

const AC = C.knowledge.articleCopy;
const CATS = C.knowledge.KNOWLEDGE_CATEGORIES as Array<{ key: string; label: string }>;

interface Section {
  id: string;
  title: string;
  body: string[];
  list?: string[];
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Body = { sections: Section[]; faq?: Array<{ q: string; a: string }>; sources?: Array<{ label: string; href: string }> } & Record<string, any>;

export default function Article() {
  const { slug } = useParams();
  const a = ARTICLES.find((x) => x.slug === slug);
  usePage(a ? a.title : 'Статья не найдена', a ? 'vitreous' : 'blind');
  const [body, setBody] = useState<Body | null>(null);
  const [err, setErr] = useState(false);
  const [tries, setTries] = useState(0);
  const artRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!a) return;
    let live = true;
    setErr(false);
    loadKnowledgeBodies()
      .then((all) => live && setBody(all[a.slug] ?? { sections: [] }))
      .catch(() => live && setErr(true));
    return () => {
      live = false;
    };
  }, [a, tries]);

  useEffect(() => {
    if (!body || !artRef.current) return;
    requestAnimationFrame(() => {
      refreshMarkers();
      scanReveals();
    });
    return trackProgress(artRef.current, (p) => barRef.current?.style.setProperty('--read', p.toFixed(3)), 'through');
  }, [body]);

  if (!a) return <NotFound />;
  const related = ARTICLES.filter((x) => x.slug !== a.slug && (x.category === a.category || x.tags.some((t) => a.tags.includes(t)))).slice(0, 3);
  const cat = CATS.find((c) => c.key === a.category)?.label;

  return (
    <>
      <div className="readbar" ref={barRef} aria-hidden="true">
        <i />
      </div>
      <section className="hero art-hero">
        <Station id="vitreous" />
        <div className="wrap hero__in">
          <ol className="breadcrumbs" data-reveal>
            <li>
              <IrisLink to="/">Главная</IrisLink>
            </li>
            <li>
              <IrisLink to="/knowledge-base">База знаний</IrisLink>
            </li>
            <li aria-current="page">{cat}</li>
          </ol>
          <p className="eyebrow" data-reveal>
            {cat} · {a.readingMinutes} мин чтения
          </p>
          <Split as="h1" className="display d-l art-hero__h" text={a.title} />
          <p className="lead hero__lead" data-reveal>
            {a.excerpt}
          </p>
          <p className="small art-hero__by" data-reveal>
            {authorName(a.authorId)} · {AC.published} {fmtDate(a.date)}
          </p>
        </div>
      </section>

      {err && (
        <div className="wrap">
          <div className="notice" role="alert">
            <span>{AC.loadError}</span>
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => setTries((t) => t + 1)}>
              {AC.retry}
            </button>
          </div>
        </div>
      )}
      {!body && !err && (
        <div className="wrap" aria-busy="true">
          <p className="small">{AC.loading}</p>
          <div className="skel" />
          <div className="skel skel--s" />
        </div>
      )}

      {body && (
        <article ref={artRef} className="wrap art-body">
          <aside className="art-toc">
            <nav aria-label={AC.toc}>
              <p className="eyebrow">{AC.toc}</p>
              <ol>
                {body.sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
            <p className="notice">{AC.reviewPendingLabel}</p>
          </aside>
          <div className="art-main">
            {body.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="art-sec">
                <Station id={i === body.sections.length - 1 ? 'macula' : i % 2 ? 'retina' : 'vitreous'} />
                <h2 className="h2" data-reveal>
                  {s.title}
                </h2>
                {s.body.map((p, j) => (
                  <p key={j} className="art-p" data-reveal>
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="ring-list" data-reveal>
                    {s.list.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            {body.faq && body.faq.length > 0 && (
              <section className="art-sec" aria-labelledby="afq-h">
                <p className="eyebrow">{AC.faqEyebrow}</p>
                <h2 id="afq-h" className="h2">
                  {AC.faqTitle}
                </h2>
                <Accordion items={body.faq.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
              </section>
            )}
            {body.sources && body.sources.length > 0 && (
              <section className="fsources">
                <h2 className="h4">{AC.sources}</h2>
                <p className="small">{AC.sourcesNote}</p>
                <ul className="list-plain">
                  {body.sources.map((x) => (
                    <li key={x.href}>
                      <a className="link" href={x.href} target="_blank" rel="noreferrer">
                        {x.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <p className="small art-disc">{AC.disclaimer}</p>
            <p className="small">{AC.reviewPending}</p>
          </div>
        </article>
      )}

      {related.length > 0 && (
        <section className="sect sect--tight" aria-labelledby="rel-h">
          <div className="wrap">
            <h2 id="rel-h" className="h2" style={{ marginBottom: 32 }}>
              {AC.related}
            </h2>
            <ul className="art-grid">
              {related.map((r, i) => (
                <li key={r.slug} data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                  <IrisLink to={`/knowledge-base/${r.slug}`} className="art">
                    <span className="small">{r.readingMinutes} мин чтения</span>
                    <span className="h3">{r.title}</span>
                  </IrisLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="sect finale" aria-labelledby="acta-h">
        <div className="wrap finale__in">
          <h2 id="acta-h" className="display d-l">
            {AC.ctaTitle}
          </h2>
          <div className="btn-row">
            <IrisLink to={a.serviceSlug ? `/appointment?service=${a.serviceSlug}` : '/appointment'} className="btn">
              {AC.bookAuthor} <Arrow />
            </IrisLink>
            <IrisLink to="/knowledge-base" className="btn btn--ghost">
              {AC.allMaterials}
            </IrisLink>
          </div>
        </div>
      </section>
    </>
  );
}
