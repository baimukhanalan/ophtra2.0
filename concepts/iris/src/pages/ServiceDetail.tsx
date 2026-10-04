import { useEffect, useState, type CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { C, DEPT_LAYER, byId, departments, doctors, fmtPrice, initials, loadServiceBodies, services } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { refreshMarkers, scanReveals } from '../lib/engine';
import { Accordion, Arrow, SectionHead, Split, Station } from '../components/ui';
import NotFound from './NotFound';

const SD = C.services.serviceDetailCopy;
const KI = C.knowledge_articles_index.KNOWLEDGE_INDEX as Array<{ slug: string; title: string; category: string; readingMinutes: number; serviceSlug?: string }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Body = any;

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = services.find((x) => x.slug === slug);
  const L = s ? DEPT_LAYER[s.departmentId] : undefined;
  usePage(s ? s.name : 'Услуга не найдена', L?.station ?? 'blind');
  const [body, setBody] = useState<Body | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!s) return;
    let live = true;
    setBody(null);
    setErr(false);
    loadServiceBodies()
      .then((all) => live && setBody(all[s.slug] ?? {}))
      .catch(() => live && setErr(true));
    return () => {
      live = false;
    };
  }, [s]);

  useEffect(() => {
    if (!body) return;
    requestAnimationFrame(() => {
      refreshMarkers();
      scanReveals();
    });
  }, [body]);

  if (!s || !L) return <NotFound />;
  const dept = byId(departments, s.departmentId)!;
  const team = doctors.filter((d) => d.departmentIds.includes(s.departmentId));
  const siblings = services.filter((x) => x.departmentId === s.departmentId && x.id !== s.id);
  const topics: string[] = body?.topics ?? [];
  const related = KI.filter((a) => a.serviceSlug === s.slug || topics.some((t) => a.title.toLowerCase().includes(t))).slice(0, 3);

  return (
    <>
      <section className="hero svcd-hero">
        <Station id={L.station} />
        <div className="wrap hero__in">
          <ol className="breadcrumbs" data-reveal>
            <li>
              <IrisLink to="/">Главная</IrisLink>
            </li>
            <li>
              <IrisLink to="/services">Услуги</IrisLink>
            </li>
            <li aria-current="page">{s.name}</li>
          </ol>
          <p className="hero__layer" data-reveal>
            <span>Слой</span> {L.layer}
          </p>
          <p className="eyebrow" data-reveal>
            {dept.name}
          </p>
          <Split as="h1" className="display d-l" text={s.name} />
          <p className="lead hero__lead" data-reveal>
            {body?.lead ?? s.short}
          </p>
          <dl className="svcd-facts" data-reveal>
            <div>
              <dt>{SD.price}</dt>
              <dd>от {fmtPrice(s.price)}</dd>
            </div>
            <div>
              <dt>{SD.duration}</dt>
              <dd>≈ {s.duration} мин</dd>
            </div>
            <div>
              <dt>{SD.doctorsCount}</dt>
              <dd>{team.length}</dd>
            </div>
          </dl>
          <div className="hero__act" data-reveal>
            <IrisLink to={`/appointment?service=${s.slug}`} className="btn">
              Записаться на услугу <Arrow />
            </IrisLink>
            <IrisLink to="/services" className="btn btn--ghost">
              Все услуги
            </IrisLink>
          </div>
        </div>
      </section>

      {err && (
        <div className="wrap">
          <p className="notice" role="alert">
            Не удалось загрузить описание. Проверьте соединение и обновите страницу — стоимость и запись доступны выше.
          </p>
        </div>
      )}
      {!body && !err && (
        <div className="wrap" aria-busy="true">
          <p className="small">{SD.loading}…</p>
          <div className="skel" />
          <div className="skel skel--s" />
        </div>
      )}

      {body && (
        <>
          {body.overview && (
            <section className="sect" aria-labelledby="ov-h">
              <div className="wrap split-2">
                <SectionHead eyebrow="01" title={SD.overview} />
                <div className="stack">
                  <h2 id="ov-h" className="sr-only">
                    {SD.overview}
                  </h2>
                  {body.overview.map((p: string, i: number) => (
                    <p key={i} className="lead svcd-p" data-reveal>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="sect svcd-grid" aria-label="Показания, диагностика и лечение">
            <div className="wrap grid-3">
              {body.indications && (
                <div className="card" data-reveal>
                  <h2 className="h3">{SD.indications}</h2>
                  <ul className="ring-list">
                    {body.indications.map((x: string) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {body.diagnostics && (
                <div className="card" data-reveal style={{ '--d': 100 } as CSSProperties}>
                  <h2 className="h3">{SD.diagnostics}</h2>
                  <p className="body">{body.diagnostics.intro}</p>
                  <ul className="ring-list">
                    {body.diagnostics.list.map((x: string) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
              {body.treatment && (
                <div className="card" data-reveal style={{ '--d': 200 } as CSSProperties}>
                  <h2 className="h3">{SD.treatment}</h2>
                  <p className="body">{body.treatment.intro}</p>
                  <ul className="ring-list">
                    {body.treatment.list.map((x: string) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {(body.preparation || body.result) && (
            <section className="sect" aria-labelledby="prep-h">
              <div className="wrap split-2">
                {body.preparation && (
                  <div>
                    <h2 id="prep-h" className="h2" data-reveal>
                      {SD.preparation}
                    </h2>
                    <ol className="steps">
                      {body.preparation.map((x: string) => (
                        <li key={x} data-reveal>
                          <p className="body">{x}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {body.result && (
                  <div className="panel panel--gold" data-reveal>
                    <h2 className="h3">{SD.result}</h2>
                    <p className="body">{body.result}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {body.faq && (
            <section className="sect" aria-labelledby="fq-h">
              <div className="wrap split-2">
                <SectionHead eyebrow="Вопросы" title={SD.faq} />
                <div>
                  <h2 id="fq-h" className="sr-only">
                    {SD.faq}
                  </h2>
                  <Accordion items={body.faq.map((f: { q: string; a: string }) => ({ q: f.q, a: <p>{f.a}</p> }))} />
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <section className="sect" aria-labelledby="tm-h">
        <div className="wrap">
          <SectionHead eyebrow={SD.doctorsLabel} title={SD.doctorsTitle} text={SD.doctorsText} />
          <h2 id="tm-h" className="sr-only">
            {SD.doctorsTitle}
          </h2>
          <ul className="doc-grid">
            {team.map((d) => (
              <li key={d.id}>
                <IrisLink to={`/doctors/${d.slug}`} className="doc">
                  <span className="monogram">
                    <span>{initials(d.name)}</span>
                  </span>
                  <span className="h3">{d.name}</span>
                  <span className="body">{d.role}</span>
                </IrisLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sect sect--tight" aria-labelledby="rl-h">
          <div className="wrap">
            <h2 id="rl-h" className="h2" style={{ marginBottom: 32 }}>
              {SD.articlesTitle}
            </h2>
            <ul className="art-grid">
              {related.map((a) => (
                <li key={a.slug}>
                  <IrisLink to={`/knowledge-base/${a.slug}`} className="art">
                    <span className="small">{a.readingMinutes} мин чтения</span>
                    <span className="h3">{a.title}</span>
                  </IrisLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="sect sect--tight" aria-labelledby="sib-h">
        <div className="wrap">
          <h2 id="sib-h" className="h3" style={{ marginBottom: 20 }}>
            {SD.otherServices}
          </h2>
          <ul className="svc-rows">
            {siblings.map((x) => (
              <li key={x.id}>
                <IrisLink to={`/services/${x.slug}`} className="svc-row">
                  <span className="h4">{x.name}</span>
                  <span className="small">{x.duration} мин</span>
                  <span className="svc-row__price">от {fmtPrice(x.price)}</span>
                  <Arrow />
                </IrisLink>
              </li>
            ))}
          </ul>
          {body?.sources?.length > 0 && (
            <div className="fsources">
              <h3 className="h4">{SD.sourcesTitle}</h3>
              <p className="small">{SD.sourcesNote}</p>
              <ul className="list-plain">
                {body.sources.map((x: { label: string; href: string }) => (
                  <li key={x.href}>
                    <a className="link" href={x.href} target="_blank" rel="noreferrer">
                      {x.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="small svcd-note">{SD.priceNote}</p>
        </div>
      </section>
    </>
  );
}
