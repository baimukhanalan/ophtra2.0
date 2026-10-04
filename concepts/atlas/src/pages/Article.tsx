import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { authorName, K_CATEGORIES, knowledge, services, type KBody } from '../lib/data';
import { date } from '../lib/format';
import { ArticleCard } from './Knowledge';

type Load = { state: 'loading' } | { state: 'ok'; body: KBody } | { state: 'error' };

export default function Article() {
  const { slug } = useParams();
  const a = knowledge.find((x) => x.slug === slug);
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!a) return;
    let alive = true;
    setLoad({ state: 'loading' });
    import('../data/knowledge-bodies.json')
      .then((m) => {
        const body = (m.default as Record<string, KBody>)[a.slug];
        if (alive) setLoad(body ? { state: 'ok', body } : { state: 'error' });
      })
      .catch(() => alive && setLoad({ state: 'error' }));
    return () => {
      alive = false;
    };
  }, [a, attempt]);

  if (!a) {
    return (
      <Page title="Материал не найден">
        <Chapter shot="sky-all" size="sm">
          <div className="col">
            <Eyebrow>Звезда не найдена</Eyebrow>
            <h1 className="h2">Такого материала нет</h1>
            <p className="lead">Возможно, ссылка устарела. Все статьи — в базе знаний.</p>
            <BtnLink to="/knowledge">База знаний</BtnLink>
          </div>
        </Chapter>
      </Page>
    );
  }
  const cat = K_CATEGORIES.find((c) => c.id === a.category);
  const related = knowledge.filter((x) => x.slug !== a.slug && (x.category === a.category || x.tags.some((t) => a.tags.includes(t)))).slice(0, 3);
  const svc = services.find((s) => s.slug === a.serviceSlug);
  return (
    <Page title={a.title}>
      <Chapter shot={`star-${a.slug}|${a.category}`} size="md" label="Материал">
        <div className="col col--wide">
          <p className="coord" data-reveal>
            <Link to="/knowledge">База знаний</Link> / {cat?.label}
          </p>
          <SplitTitle as="h1" className="h2" text={a.title} delay={80} />
          <R d={200}>
            <p className="lead">{a.excerpt}</p>
            <p className="coord">
              {authorName(a.authorId)} · {date(a.date)} · {a.readingMinutes} мин чтения
            </p>
          </R>
        </div>
      </Chapter>

      <Chapter shot={`const-${a.category}`} pin={false} size="auto" label="Текст">
        <div className="panel" style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(22px, 5vw, 64px)' }}>
          {load.state === 'loading' && (
            <div role="status" aria-live="polite" style={{ display: 'grid', gap: 14 }}>
              <span className="sr-only">Загружаем материал…</span>
              {[80, 100, 92, 60, 100, 85].map((w, i) => (
                <div key={i} style={{ height: i === 0 ? 28 : 14, width: `${w}%`, borderRadius: 8, background: 'linear-gradient(90deg, rgba(244,242,237,.06), rgba(244,242,237,.12), rgba(244,242,237,.06))' }} />
              ))}
            </div>
          )}
          {load.state === 'error' && (
            <div role="alert">
              <h2 className="h3">Не удалось загрузить текст</h2>
              <p className="body">Проверьте соединение и попробуйте ещё раз.</p>
              <button type="button" className="btn" onClick={() => setAttempt((n) => n + 1)}>
                Повторить
              </button>
            </div>
          )}
          {load.state === 'ok' && (
            <article className="prose">
              <nav aria-label="Содержание" style={{ marginBottom: 12 }}>
                <p className="coord" style={{ marginTop: 0 }}>
                  Содержание
                </p>
                <ol style={{ margin: 0, paddingLeft: 20, color: 'var(--muted)' }}>
                  {load.body.sections.map((s) => (
                    <li key={s.id} style={{ fontSize: 15 }}>
                      <a href={`#${s.id}`}>{s.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
              {load.body.sections.map((s) => (
                <section key={s.id} aria-labelledby={s.id}>
                  <h2 id={s.id}>{s.title}</h2>
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {s.list && (
                    <ul>
                      {s.list.map((li, i) => (
                        <li key={i}>{li}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              {load.body.faq.length > 0 && (
                <>
                  <h2>Вопросы и ответы</h2>
                  <div className="acc">
                    {load.body.faq.map((f) => (
                      <details key={f.q}>
                        <summary>{f.q}</summary>
                        <div className="acc__body">{f.a}</div>
                      </details>
                    ))}
                  </div>
                </>
              )}
              {load.body.sources.length > 0 && (
                <>
                  <h2>Источники</h2>
                  <ol style={{ paddingLeft: 20 }}>
                    {load.body.sources.map((s) => (
                      <li key={s.href} style={{ fontSize: 15 }}>
                        <a href={s.href} target="_blank" rel="noreferrer">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              <p className="note">Материал носит информационный характер и не заменяет консультацию врача.</p>
              {svc && (
                <div className="actions" style={{ marginTop: 24 }}>
                  <BtnLink to={`/services/${svc.slug}`}>{svc.name}</BtnLink>
                </div>
              )}
            </article>
          )}
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <Eyebrow>Соседние звёзды</Eyebrow>
            <div className="grid grid--3">
              {related.map((r) => (
                <ArticleCard key={r.slug} a={r} />
              ))}
            </div>
          </div>
        )}
      </Chapter>
    </Page>
  );
}
