import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import servicesJson from '../content/services.json';
import { byId, departments, doctors, initials, money, services, bySlug } from '../lib/data';
import { ARTICLES } from '../lib/knowledge';
import { serviceCurve, servicePreset } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { GlassPortrait } from '../ui/GlassPortrait';
import { Accordion, Arrow, Hero, JumpLink, LensCta, LensGlyph, SectionHead, usePageTitle } from '../ui/parts';
import { ContactForm } from '../ui/ContactForm';
import NotFound from './NotFound';
import { deptShort } from './Services';
import './pages.css';
import './services.css';
import './people.css';

interface Body {
  kind: string;
  lead: string;
  overview: string[];
  indications: string[];
  diagnostics: { intro: string; list: string[] };
  treatment: { intro: string; list: string[] };
  preparation?: string[];
  result?: string;
  faq: Array<{ q: string; a: string }>;
  sources: Array<{ label: string; href: string }>;
  topics: string[];
}

const T = (servicesJson as unknown as { serviceDetailCopy: Record<string, string>; sharedCopy: Record<string, string> }).serviceDetailCopy;
const SH = (servicesJson as unknown as { sharedCopy: Record<string, string> }).sharedCopy;
const loaders = import.meta.glob<{ default: Body }>('../content/serviceBodies/*.json');

function useBody(slug: string) {
  const [state, setState] = useState<{ status: 'loading' | 'ready' | 'error' | 'none'; body?: Body }>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const l = loaders[`../content/serviceBodies/${slug}.json`];
    if (!l) {
      setState({ status: 'none' });
      return;
    }
    let alive = true;
    setState({ status: 'loading' });
    l()
      .then((m) => alive && setState({ status: 'ready', body: m.default }))
      .catch(() => alive && setState({ status: 'error' }));
    return () => {
      alive = false;
    };
  }, [slug, attempt]);
  return { ...state, retry: () => setAttempt((a) => a + 1) };
}

export default function Service() {
  const { slug = '' } = useParams();
  const svc = bySlug(services, slug);
  const index = services.findIndex((s) => s.slug === slug);
  const preset = useMemo(() => servicePreset(slug, Math.max(0, index)), [slug, index]);
  useScenePreset(preset);
  usePageTitle(svc ? svc.name : T.notFoundTitle);
  const { status, body, retry } = useBody(slug);
  if (!svc) return <NotFound />;

  const dept = byId(departments, svc.departmentId);
  const team = doctors.filter((d) => d.departmentIds.includes(svc.departmentId));
  const siblings = services.filter((s) => s.departmentId === svc.departmentId && s.id !== svc.id);
  const related = body ? ARTICLES.filter((a) => a.serviceSlug === slug || body.topics.some((t) => a.title.toLowerCase().includes(t))).slice(0, 3) : [];
  const curve = serviceCurve(Math.max(0, index));

  const toc = body
    ? [
        ['overview', T.overview],
        ['indications', T.indications],
        ['diagnostics', T.diagnostics],
        ['treatment', T.treatment],
        body.preparation ? ['preparation', T.preparation] : null,
        body.result ? ['result', T.result] : null,
        ['faq', T.faq],
      ].filter(Boolean) as string[][]
    : [];

  return (
    <div className="service" key={slug}>
      <Hero
        eyebrow={dept ? deptShort(dept.name) : 'Услуга'}
        title={svc.name}
        lead={body?.lead ?? svc.short}
        tag={`Линза ${String(index + 1).padStart(2, '0')} / ${services.length} — собственная кривизна`}
        aside={
          <div className="svc-lensbox rv">
            <LensGlyph curve={curve} size={220} />
            <dl className="kv">
              <dt>{T.price}</dt>
              <dd>от {money(svc.price)}</dd>
              <dt>{T.duration}</dt>
              <dd>≈ {svc.duration} мин</dd>
              <dt>{T.doctorsCount}</dt>
              <dd>{team.length}</dd>
            </dl>
          </div>
        }
        actions={
          <>
            <TLink to={`${R.booking}?service=${svc.slug}`} className="btn">
              Записаться <Arrow />
            </TLink>
            <JumpLink to="svc-form" className="btn btn--ghost">
              {T.formTitle}
            </JumpLink>
          </>
        }
      />

      <section className="sec sec--paper" aria-label="Описание услуги">
        <div className="wrap split">
          <aside className="split__sticky">
            {toc.length > 0 && (
              <nav aria-label={T.toc}>
                <p className="anno">{T.toc}</p>
                <div className="svc-toc mt-s">
                  {toc.map(([id, label]) => (
                    <JumpLink key={id} to={id}>
                      {label}
                    </JumpLink>
                  ))}
                </div>
              </nav>
            )}
            <div className="svc-price mt-m">
              <div>
                <span>{T.price}</span>
                <strong>от {money(svc.price)}</strong>
              </div>
              <div>
                <span>{T.duration}</span>
                <strong>{svc.duration} мин</strong>
              </div>
              <p className="small muted mt-s">{T.priceNote}</p>
            </div>
          </aside>

          <div className="svc-body">
            {status === 'loading' && (
              <div className="skeleton" role="status" aria-live="polite">
                <span className="sr-only">{T.loading}</span>
                {Array.from({ length: 6 }, (_, i) => (
                  <i key={i} style={{ width: `${92 - i * 9}%` }} />
                ))}
              </div>
            )}
            {status === 'error' && (
              <div className="empty" role="alert">
                <p className="h3">Не удалось загрузить описание</p>
                <p className="body">Проверьте соединение и попробуйте ещё раз.</p>
                <button type="button" className="btn btn--ghost btn--sm" onClick={retry}>
                  Повторить
                </button>
              </div>
            )}
            {status === 'none' && <p className="lead">{svc.short}</p>}
            {body && (
              <>
                <section id="overview" className="svc-block">
                  <FocusText as="h2" className="h2" text={T.overview} />
                  {body.overview.map((p) => (
                    <p key={p} className="body rv">
                      {p}
                    </p>
                  ))}
                </section>
                <section id="indications" className="svc-block">
                  <FocusText as="h2" className="h2" text={T.indications} />
                  <ul className="list-dots rv">
                    {body.indications.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </section>
                <section id="diagnostics" className="svc-block">
                  <FocusText as="h2" className="h2" text={T.diagnostics} />
                  <p className="body rv">{body.diagnostics.intro}</p>
                  <ul className="list-dots rv">
                    {body.diagnostics.list.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </section>
                <section id="treatment" className="svc-block">
                  <FocusText as="h2" className="h2" text={T.treatment} />
                  <p className="body rv">{body.treatment.intro}</p>
                  <ul className="list-dots rv">
                    {body.treatment.list.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </section>
                {body.preparation && (
                  <section id="preparation" className="svc-block">
                    <FocusText as="h2" className="h2" text={T.preparation} />
                    <ul className="list-dots rv">
                      {body.preparation.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </section>
                )}
                {body.result && (
                  <section id="result" className="svc-block">
                    <FocusText as="h2" className="h2" text={T.result} />
                    <p className="body rv">{body.result}</p>
                  </section>
                )}
                <section id="faq" className="svc-block">
                  <FocusText as="h2" className="h2" text={T.faq} />
                  <Accordion items={body.faq} />
                </section>
                <section className="svc-block">
                  <h2 className="h3">{T.sourcesTitle}</h2>
                  <ul className="sources" role="list">
                    {body.sources.map((s) => (
                      <li key={s.href}>
                        <a href={s.href} target="_blank" rel="noreferrer">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="small muted">{T.sourcesNote}</p>
                </section>
              </>
            )}
            <p className="small muted">{SH.disclaimer}</p>
          </div>
        </div>
      </section>

      <section className="stage" data-stage data-el={1} aria-labelledby="team-h" style={{ paddingBlock: 'clamp(100px, 14vh, 160px)' }}>
        <div className="wrap">
          <SectionHead eyebrow={T.doctorsLabel} title={T.doctorsTitle} text={T.doctorsText} id="team-h" />
          <ul className="doc-grid mt-l" role="list">
            {team.map((d, i) => (
              <li key={d.id}>
                <TLink to={`${R.doctors}/${d.slug}`} className="doc-card">
                  <GlassPortrait compact monogram={initials(d.name)} label={`Портрет: ${d.name} (демо)`} tone={i} />
                  <span className="doc-card__body">
                    <span className="h3">{d.name}</span>
                    <span className="doc-card__role">{d.role}</span>
                  </span>
                </TLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sec sec--solid" aria-labelledby="rel-h">
          <div className="wrap">
            <SectionHead eyebrow={T.articlesLabel} title={T.articlesTitle} id="rel-h" />
            <div className="tiles mt-l">
              {related.map((a) => (
                <TLink key={a.slug} to={`${R.knowledge}/${a.slug}`} className="slide rv">
                  <span className="slide__mount" aria-hidden="true" />
                  <span className="anno">{a.readingMinutes} мин чтения</span>
                  <span className="h3">{a.title}</span>
                  <span className="small muted">{a.excerpt}</span>
                </TLink>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sec sec--sand" id="svc-form" aria-labelledby="form-h">
        <div className="wrap form-grid">
          <div className="stack">
            <p className="eyebrow rv">{T.formLabel}</p>
            <FocusText as="h2" id="form-h" className="h2" text={T.formTitle} />
            <p className="body rv">{T.formText}</p>
          </div>
          <ContactForm context={svc.name} />
        </div>
      </section>

      {siblings.length > 0 && (
        <section className="sec sec--paper" aria-labelledby="sib-h">
          <div className="wrap">
            <SectionHead title={T.otherServices} id="sib-h" />
            <ul className="catalogue mt-l" role="list">
              {siblings.map((s) => (
                <li key={s.id}>
                  <TLink to={`${R.services}/${s.slug}`} className="cat-row">
                    <LensGlyph curve={serviceCurve(services.indexOf(s))} size={52} className="cat-row__g" />
                    <span className="cat-row__main">
                      <span className="cat-row__t">{s.name}</span>
                      <span className="cat-row__x">{s.short}</span>
                    </span>
                    <span className="cat-row__m">
                      <span>{s.duration} мин</span>
                      <strong>от {money(s.price)}</strong>
                    </span>
                    <span className="cat-row__go" aria-hidden="true">
                      <Arrow />
                    </span>
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <LensCta el={2} title={T.continueTitle} primary={{ to: `${R.booking}?service=${svc.slug}`, label: 'Записаться на услугу' }} secondary={{ to: R.services, label: SH.allServices }} />
    </div>
  );
}
