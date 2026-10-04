import type { CSSProperties } from 'react';
import { C } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { Arrow, Chapter, Hero, Scrub, SectionHead, Split, Station } from '../components/ui';
import { RouteMap } from '../components/RouteMap';

const F = C.people_founder.FOUNDER;
const PUBS = C.people_founder.FOUNDER_PUBLICATIONS;
const SOURCES = C.people_founder.FOUNDER_SOURCE_LIST;

export default function Founder() {
  usePage(F.fullTitle, 'retina');
  const path = F.path as Array<{ id: string; label: string; title: string; text: string; evidence: { mark: string; source: string } }>;
  return (
    <>
      <Hero
        station="retina"
        layer="Макула — центр чёткого зрения"
        eyebrow={F.eyebrow}
        title={F.title}
        accent={['сохранения', 'зрения']}
        lead={F.lead}
        size="d-l"
      >
        <a href="#pubs" className="btn">
          {F.toPublications} <Arrow />
        </a>
        <a href={F.threads} className="btn btn--ghost" target="_blank" rel="noreferrer">
          Threads
        </a>
      </Hero>

      <section className="sect fnd-name" aria-labelledby="fn-h">
        <Station id="macula" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {F.credentialsLabel}
          </p>
          <h2 id="fn-h" className="display d-xxl fnd-name__h">
            <Split text={F.name} />
          </h2>
          <p className="fnd-name__latin" data-reveal>
            {F.nameLatin} · {F.credentialsLine}
          </p>
          <ul className="creds">
            {F.credentials.map((c: { id: string; abbr: string; title: string; text: string }, i: number) => (
              <li key={c.id} data-reveal style={{ '--d': i * 110 } as CSSProperties}>
                <span className="creds__abbr">{c.abbr}</span>
                <span className="h4">{c.title}</span>
                <span className="small">{c.text}</span>
              </li>
            ))}
          </ul>
          <p className="small fnd-note" data-reveal>
            {F.honoursNote}
          </p>
        </div>
      </section>

      <section className="sect" aria-label={F.manifestoEyebrow}>
        <Station id="macula" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {F.manifestoEyebrow}
          </p>
          <Scrub className="quote fnd-manifesto" text={F.manifesto} />
        </div>
      </section>

      <Chapter steps={7} vh={80} stations={['macula', 'macula', 'micro', 'micro', 'micro', 'retina', 'disc']} className="fpath" label={F.pathTitle}>
        {(active, p) => (
          <div className="wrap fpath__in">
            <div className="fpath__head">
              <p className="eyebrow">{F.pathEyebrow}</p>
              <h2 className="h2">{F.pathTitle}</h2>
              <ol className="fpath__dots" aria-hidden="true">
                {path.map((s, i) => (
                  <li key={s.id} className={i === active ? 'is-on' : i < active ? 'is-past' : ''}>
                    <span>{s.label}</span>
                  </li>
                ))}
              </ol>
              <div className="fpath__bar" aria-hidden="true">
                <i style={{ transform: `scaleX(${p})` }} />
              </div>
            </div>
            <div className="fpath__cards">
              {path.map((s, i) => (
                <article key={s.id} className={`fcard ${i === active ? 'is-on' : ''}`} aria-hidden={i !== active}>
                  <p className="fcard__mark">{s.evidence.mark}</p>
                  <p className="fcard__src">{s.evidence.source}</p>
                  <h3 className="h3">{s.title}</h3>
                  <p className="body">{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </Chapter>

      <section className="sect" aria-labelledby="gl-h">
        <Station id="disc" />
        <div className="wrap">
          <SectionHead eyebrow={F.globalEyebrow} title={F.globalTitle} text={F.globalText} />
          <h2 id="gl-h" className="sr-only">
            {F.globalTitle}
          </h2>
          <div data-reveal>
            <RouteMap points={F.routePoints} label={F.routeLabel} />
          </div>
          <ul className="grid-4 places">
            {F.globalPlaces.map((g: { id: string; place: string; title: string; text: string }, i: number) => (
              <li key={g.id} className="card" data-reveal style={{ '--d': i * 90 } as CSSProperties}>
                <span className="tag">{g.place}</span>
                <span className="h3">{g.title}</span>
                <span className="body">{g.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sect" aria-labelledby="rs-h">
        <Station id="micro" />
        <div className="wrap">
          <SectionHead eyebrow={F.researchEyebrow} title={F.researchTitle} />
          <h2 id="rs-h" className="sr-only">
            {F.researchTitle}
          </h2>
          <ol className="research">
            {F.research.map((r: { id: string; eyebrow: string; title: string; text: string }, i: number) => (
              <li key={r.id} data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <span className="research__n">0{i + 1}</span>
                <span className="tag">{r.eyebrow}</span>
                <h3 className="h3">{r.title}</h3>
                <p className="body">{r.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sect fvision" aria-labelledby="vi-h">
        <Station id="macula" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {F.visionEyebrow}
          </p>
          <h2 id="vi-h" className="quote fvision__q" data-reveal>
            {F.visionStatement}
          </h2>
          <div className="grid-3">
            {F.visionPillars.map((v: { id: string; title: string; text: string }, i: number) => (
              <div key={v.id} className="card" data-reveal style={{ '--d': i * 100 } as CSSProperties}>
                <span className="h3">{v.title}</span>
                <span className="body">{v.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sect" id="pubs" aria-labelledby="pb-h">
        <Station id="retina" />
        <div className="wrap">
          <SectionHead eyebrow={F.publicationsEyebrow} title={F.publicationsTitle} text={F.publicationsText} />
          <h2 id="pb-h" className="sr-only">
            {F.publicationsTitle}
          </h2>
          <ul className="pubs">
            {PUBS.map((p: { id: string; kind: string; year?: number; title: string; venue: string; url: string; summary: string }, i: number) => (
              <li key={p.id} data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <a href={p.url} target="_blank" rel="noreferrer" className="pub">
                  <span className="pub__meta">
                    {p.venue}
                    {p.year ? ` · ${p.year}` : ''} · {p.kind === 'media' ? F.featured : F.coauthor}
                  </span>
                  <span className="h3" lang={p.kind === 'media' ? 'ru' : 'en'}>
                    {p.title}
                  </span>
                  <span className="body">{p.summary}</span>
                  <span className="link">
                    Первоисточник <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="fsources" data-reveal>
            <h3 className="h4">{F.sourcesTitle}</h3>
            <p className="small">{F.sourcesNote}</p>
            <ul className="list-plain">
              {SOURCES.map((s: { label: string; href: string }) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="link">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sect finale" aria-labelledby="fcta-h">
        <Station id="macula" />
        <div className="wrap finale__in">
          <h2 id="fcta-h" className="display d-l" data-reveal>
            {F.ctaTitle}
          </h2>
          <div className="btn-row" data-reveal>
            <IrisLink to="/appointment" className="btn">
              Записаться <Arrow />
            </IrisLink>
            <IrisLink to="/science" className="btn btn--ghost">
              Наука центра
            </IrisLink>
          </div>
        </div>
      </section>
    </>
  );
}
