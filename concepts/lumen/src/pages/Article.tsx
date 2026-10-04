import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { byId, bySlug, date, doctors, initials, services } from '../lib/data';
import { ARTICLES, K, categoryLabel, loadBody, type ArticleBody } from '../lib/knowledge';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { ScrollTrigger } from '../lib/scroll';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { GlassPortrait } from '../ui/GlassPortrait';
import { Accordion, Arrow, Hero, JumpLink, LensCta, SectionHead, usePageTitle } from '../ui/parts';
import { authorName } from './Knowledge';
import NotFound from './NotFound';
import './pages.css';
import './knowledge.css';
import './services.css';

const A = K.articleCopy;

function ReadingRing() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = document.querySelector('.art-body');
    if (!el) return;
    const st = ScrollTrigger.create({ trigger: el, start: 'top 70%', end: 'bottom 60%', onUpdate: (s) => setP(Math.round(s.progress * 100)) });
    return () => st.kill();
  });
  const c = 2 * Math.PI * 28;
  return (
    <div className="art-progress" role="progressbar" aria-label="Прочитано" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="bg" cx="32" cy="32" r="28" />
        <circle className="fg" cx="32" cy="32" r="28" strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} />
      </svg>
      <span>{p}%</span>
    </div>
  );
}

export default function Article() {
  const { slug = '' } = useParams();
  const meta = bySlug(ARTICLES, slug);
  useScenePreset(PRESETS.article);
  usePageTitle(meta ? meta.title : 'Материал не найден');
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error'; body?: ArticleBody }>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [active, setActive] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    loadBody(slug)
      .then((b) => alive && setState(b ? { status: 'ready', body: b } : { status: 'error' }))
      .catch(() => alive && setState({ status: 'error' }));
    return () => {
      alive = false;
    };
  }, [slug, attempt]);

  // Highlight the section being read.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root || state.status !== 'ready') return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    root.querySelectorAll('.art-sec[id]').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [state.status]);

  if (!meta) return <NotFound />;
  const doc = byId(doctors, meta.authorId);
  const svc = meta.serviceSlug ? bySlug(services, meta.serviceSlug) : undefined;
  const related = ARTICLES.filter((a) => a.slug !== slug && (a.category === meta.category || a.tags.some((t) => meta.tags.includes(t)))).slice(0, 3);
  const body = state.body;

  return (
    <div className="article" key={slug}>
      <Hero
        eyebrow={categoryLabel(meta.category)}
        title={meta.title}
        lead={meta.excerpt}
        tag={`${A.published} ${date(meta.date)} · ${meta.readingMinutes} ${K.knowledgeCopy.minutes}`}
        actions={
          <div className="art-hero-meta">
            <span>{authorName(meta.authorId)}</span>
            {meta.tags.map((t) => (
              <span key={t}>#{K.TAG_LABELS[t] ?? t}</span>
            ))}
          </div>
        }
      />

      <section className="sec sec--paper" aria-label="Текст материала">
        <div className="wrap split">
          <aside className="split__sticky">
            <nav aria-label={A.toc} className="art-toc">
              <p className="anno">{A.toc}</p>
              <div className="svc-toc mt-s">
                {(body?.sections ?? meta.headings.map((h, i) => ({ id: 's' + i, title: h }))).map((s) => (
                  <JumpLink key={s.id} to={s.id}>
                    <span aria-current={active === s.id ? 'true' : undefined}>{s.title}</span>
                  </JumpLink>
                ))}
              </div>
            </nav>
            {svc && (
              <TLink to={`${R.services}/${svc.slug}`} className="link mt-m">
                {A.serviceLink.replace('{name}', svc.name)} <Arrow />
              </TLink>
            )}
          </aside>

          <div className="art-body" ref={bodyRef}>
            {state.status === 'loading' && (
              <div className="skeleton" role="status">
                <span className="sr-only">{A.loading}</span>
                {Array.from({ length: 8 }, (_, i) => (
                  <i key={i} style={{ width: `${95 - ((i * 13) % 35)}%` }} />
                ))}
              </div>
            )}
            {state.status === 'error' && (
              <div className="empty" role="alert">
                <p className="body">{A.loadError}</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAttempt((a) => a + 1)}>
                  {A.retry}
                </button>
              </div>
            )}
            {body &&
              body.sections.map((s) => (
                <section key={s.id} id={s.id} className="art-sec">
                  <FocusText as="h2" className="h2" text={s.title} />
                  {s.body.map((p) => (
                    <p key={p} className="rv">
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="list-dots rv">
                      {s.list.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            {body && body.faq.length > 0 && (
              <section className="art-sec" aria-labelledby="afaq-h">
                <p className="eyebrow">{A.faqEyebrow}</p>
                <h2 id="afaq-h" className="h2">
                  {A.faqTitle}
                </h2>
                <Accordion items={body.faq} />
              </section>
            )}
            {body && (
              <section className="art-sec" aria-labelledby="src-h">
                <h2 id="src-h" className="h3">
                  {A.sources}
                </h2>
                <ul className="sources" role="list">
                  {body.sources.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noreferrer">
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="small muted">{A.sourcesNote}</p>
              </section>
            )}
            <div className="art-author">
              <GlassPortrait compact monogram={doc ? initials(doc.name) : 'Ред'} label={authorName(meta.authorId)} />
              <div>
                <p className="anno">{A.authorEyebrow}</p>
                <p className="h3">{authorName(meta.authorId)}</p>
                <p className="small muted">{doc ? `${doc.role} · демо-профиль` : 'Редакция базы знаний офтальмологического центра'}</p>
                {doc && (
                  <TLink to={`${R.booking}?doctor=${doc.slug}`} className="link mt-s">
                    {A.bookAuthor} <Arrow />
                  </TLink>
                )}
              </div>
            </div>
            <p className="small muted">{A.disclaimer}</p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="stage" data-stage data-el={1} aria-labelledby="rel-h" style={{ paddingBlock: 'clamp(100px, 14vh, 160px)' }}>
          <div className="wrap">
            <SectionHead eyebrow={A.continue} title={A.related} id="rel-h" />
            <div className="lighttable mt-l">
              <ul className="lt-grid" role="list">
                {related.map((a, i) => (
                  <li key={a.slug}>
                    <TLink to={`${R.knowledge}/${a.slug}`} className="slide" style={{ ['--tilt' as string]: `${(i - 1) * 1.5}deg` }}>
                      <span className="slide__mount" aria-hidden="true" />
                      <span className="anno">
                        {categoryLabel(a.category)} · {a.readingMinutes} мин
                      </span>
                      <span className="h3">{a.title}</span>
                    </TLink>
                  </li>
                ))}
              </ul>
            </div>
            <TLink to={R.knowledge} className="link mt-m">
              {A.allMaterials} <Arrow />
            </TLink>
          </div>
        </section>
      )}

      <LensCta title={A.ctaTitle} />
      {state.status === 'ready' && <ReadingRing />}
    </div>
  );
}
