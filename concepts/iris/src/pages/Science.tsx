import type { CSSProperties } from 'react';
import { C, fmtDate } from '../content';
import { usePage } from '../lib/usePage';
import { Arrow, Chapter, Counter, Hero, Scrub, SectionHead, Station } from '../components/ui';
import { RequestForm, contactFields } from '../components/forms';

const S = C.science;
const SC = S.scienceCopy;
const A = C.academy;
const M = C.media;

const ZOOM = ['×10', '×40', '×100'];

export default function Science() {
  usePage('Наука и академия', 'macula');
  const stats = [
    { v: 200, l: SC.stats.patients },
    { v: 2, l: SC.stats.countries },
    { v: 3, l: SC.stats.publications },
    { v: 1, l: SC.stats.patent },
  ];
  return (
    <>
      <Hero station="macula" layer="Фоторецепторы — масштаб микроскопа" eyebrow={SC.heroEyebrow} title={SC.heroTitle} accent={['возвращается']} lead={SC.heroText}>
        <a href="#papers" className="btn">
          {SC.heroPublications} <Arrow />
        </a>
        <a href="#collab" className="btn btn--ghost">
          {SC.heroCollab}
        </a>
      </Hero>

      <section className="sect" aria-label="Принцип">
        <Station id="micro" />
        <div className="wrap">
          <Scrub className="quote" text={SC.statement} />
        </div>
      </section>

      <section className="sect" aria-labelledby="ss-h">
        <Station id="micro" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {SC.statsEyebrow}
          </p>
          <h2 id="ss-h" className="sr-only">
            {SC.statsEyebrow}
          </h2>
          <ul className="big-stats">
            {stats.map((s, i) => (
              <li key={s.l} data-reveal style={{ '--d': i * 100 } as CSSProperties}>
                <Counter value={s.v} />
                <span>{s.l}</span>
              </li>
            ))}
          </ul>
          <p className="small about-note" data-reveal>
            {SC.source}:{' '}
            <a className="link" href={S.SOURCE_24KZ.href} target="_blank" rel="noreferrer">
              24.kz
            </a>
          </p>
        </div>
      </section>

      <Chapter steps={S.researchDirections.length} vh={90} stations={['micro', 'micro', 'macula']} className="scope" label={SC.projectsTitle}>
        {(active) => (
          <div className="wrap scope__in">
            <div className="scope__lens" aria-hidden="true">
              <span className="scope__zoom">{ZOOM[active]}</span>
              <span className="scope__ring" />
              <span className="scope__cross" />
            </div>
            <div className="scope__cards">
              <p className="eyebrow">{SC.projectsEyebrow}</p>
              <h2 className="h2 scope__title">{SC.projectsTitle}</h2>
              {S.researchDirections.map((r: { id: string; label: string; title: string; text: string; points: string[] }, i: number) => (
                <article key={r.id} className={`scard ${i === active ? 'is-on' : ''}`} aria-hidden={i !== active}>
                  <span className="tag">{r.label}</span>
                  <h3 className="h3">{r.title}</h3>
                  <p className="body">{r.text}</p>
                  <ul className="ring-list">
                    {r.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        )}
      </Chapter>

      <section className="sect" id="papers" aria-labelledby="pp-h">
        <Station id="macula" />
        <div className="wrap">
          <SectionHead eyebrow={SC.publicationsEyebrow} title={SC.publicationsTitle} text={SC.publicationsText} />
          <h2 id="pp-h" className="sr-only">
            {SC.publicationsTitle}
          </h2>
          <ul className="pubs">
            {S.publications.map((p: { id: string; journal: string; publisher: string; year: number; title: string; href: string; summary: string; direction: string }, i: number) => (
              <li key={p.id} data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <a className="pub" href={p.href} target="_blank" rel="noreferrer">
                  <span className="pub__meta">
                    {p.journal} · {p.publisher} · {p.year}
                  </span>
                  <span className="h3" lang="en">
                    {p.title}
                  </span>
                  <span className="body">{p.summary}</span>
                  <span className="link">
                    {SC.openPaper} <Arrow />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sect" aria-labelledby="vd-h">
        <Station id="retina" />
        <div className="wrap split-2">
          <a className="video" href={`https://www.youtube.com/watch?v=${S.VIDEO_ID}`} target="_blank" rel="noreferrer" data-reveal>
            <img src="/media/video-24kz.jpg" alt={SC.videoCaption} loading="lazy" />
            <span className="video__play" aria-hidden="true" />
            <span className="sr-only">{SC.openVideo}</span>
          </a>
          <div>
            <p className="eyebrow" data-reveal>
              {SC.videoEyebrow}
            </p>
            <h2 id="vd-h" className="h3" data-reveal>
              {SC.videoTitle}
            </h2>
            <p className="small" data-reveal>
              {SC.videoCaption}
            </p>
            <div className="btn-row" data-reveal>
              <a className="btn btn--sm" href={`https://www.youtube.com/watch?v=${S.VIDEO_ID}`} target="_blank" rel="noreferrer">
                {SC.openVideo}
              </a>
              <a className="btn btn--sm btn--ghost" href={S.SOURCE_24KZ.href} target="_blank" rel="noreferrer">
                {SC.readArticle}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="sp-h">
        <Station id="micro" />
        <div className="wrap">
          <SectionHead eyebrow={SC.studiesEyebrow} title={SC.studiesTitle} text={SC.studiesText} />
          <h2 id="sp-h" className="sr-only">
            {SC.studiesTitle}
          </h2>
          <div className="grid-3">
            {S.studyProgrammes.map((p: { id: string; title: string; text: string; status: string }, i: number) => (
              <div key={p.id} className="card" data-reveal style={{ '--d': i * 90 } as CSSProperties}>
                <span className="tag">
                  {SC.statusLabel}: {p.status}
                </span>
                <span className="h3">{p.title}</span>
                <span className="body">{p.text}</span>
              </div>
            ))}
          </div>
          <p className="notice" style={{ marginTop: 24 }} data-reveal>
            {SC.studiesNote}
          </p>
        </div>
      </section>

      <section className="sect" aria-labelledby="tl-h">
        <Station id="macula" />
        <div className="wrap">
          <SectionHead eyebrow={SC.timelineEyebrow} title={SC.timelineTitle} />
          <h2 id="tl-h" className="sr-only">
            {SC.timelineTitle}
          </h2>
          <ol className="timeline">
            {S.researchTimeline.map((t: { id: string; when: string; title: string; text: string }, i: number) => (
              <li key={t.id} data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <span className="timeline__step">{t.when}</span>
                <h3 className="h3">{t.title}</h3>
                <p className="body">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sect" aria-labelledby="in-h">
        <Station id="retina" />
        <div className="wrap">
          <SectionHead eyebrow={SC.innovationEyebrow} title={SC.innovationTitle} />
          <h2 id="in-h" className="sr-only">
            {SC.innovationTitle}
          </h2>
          <div className="grid-4">
            {S.innovationProgrammes.map((p: { id: string; title: string; text: string }, i: number) => (
              <div key={p.id} className="card" data-reveal style={{ '--d': i * 70 } as CSSProperties}>
                <span className="h3">{p.title}</span>
                <span className="body">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="ac-h">
        <Station id="vitreous" />
        <div className="wrap">
          <SectionHead eyebrow={A.academyCopy.heroEyebrow} title={A.academyCopy.heroTitle} text={A.academyCopy.heroText} />
          <h2 id="ac-h" className="sr-only">
            {A.academyCopy.heroTitle}
          </h2>
          <ul className="svc-rows">
            {A.programmes.map((p: { id: string; format: string; title: string; text: string; duration: string }) => (
              <li key={p.id} data-reveal>
                <div className="svc-row svc-row--static">
                  <span className="svc-row__dept">{p.format}</span>
                  <span className="h4">{p.title}</span>
                  <span className="small svc-row__short">{p.text}</span>
                  <span className="small">{p.duration}</span>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="h3 sci-events__h" data-reveal>
            Календарь событий
          </h3>
          <ul className="grid-3">
            {A.events.map((e: { id: string; date: string; time: string; format: string; title: string; place: string; seats: number }) => (
              <li key={e.id} className="card" data-reveal>
                <span className="tag">{e.format}</span>
                <span className="h4">{e.title}</span>
                <span className="small">
                  {fmtDate(e.date)}, {e.time} · {e.place} · мест: {e.seats}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sect" aria-labelledby="md-h">
        <Station id="macula" />
        <div className="wrap">
          <SectionHead eyebrow={M.mediaCopy.heroEyebrow} title={M.mediaCopy.heroTitle} text={M.mediaCopy.heroText} />
          <h2 id="md-h" className="sr-only">
            {M.mediaCopy.heroTitle}
          </h2>
          <ul className="press">
            {M.pressReleases.map((p: { id: string; date: string; title: string; text: string }) => (
              <li key={p.id} data-reveal>
                <time dateTime={p.date}>{fmtDate(p.date)}</time>
                <div>
                  <h3 className="h4">{p.title}</h3>
                  <p className="body">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sect" id="collab" aria-labelledby="cb-h">
        <Station id="micro" />
        <div className="wrap form-block">
          <div>
            <p className="eyebrow">{SC.collabEyebrow}</p>
            <h2 id="cb-h" className="h2">
              {SC.collabTitle}
            </h2>
            <p className="body">{SC.collabText}</p>
            <ul className="ring-list" style={{ marginTop: 24 }}>
              {SC.collabFormats.map((f: string) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <RequestForm
              prefix="SCI"
              submit={SC.collabSubmit}
              fields={[
                ...contactFields({ email: true, emailRequired: true }),
                { name: 'org', label: SC.collabOrg, required: true },
                { name: 'type', label: SC.collabType, type: 'select', required: true, options: S.collabTypes },
                { name: 'idea', label: SC.collabComment, type: 'textarea', required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
