import { useState } from 'react';
import academyJson from '../content/academy.json';
import mediaJson from '../content/media.json';
import scienceJson from '../content/science.json';
import { date } from '../lib/data';
import { mapLink } from '../lib/links';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { AreaField, FormSuccess, SelectField, SubmitButton, TextField, emailRule, req, requestNo, useForm } from '../ui/forms';
import { Arrow, Counter, ElementTag, Hero, JumpLink, LensCta, PinnedSteps, SectionHead, usePageTitle } from '../ui/parts';
import './pages.css';
import './founder.css';
import './science.css';

const S = scienceJson as unknown as Record<string, any>;
const C = S.scienceCopy as Record<string, any>;
const AC = academyJson as unknown as Record<string, any>;
const M = mediaJson as unknown as Record<string, any>;
type Dir = { id: string; label: string; title: string; text: string; points: string[] };

function CollabForm() {
  const [no, setNo] = useState('');
  const f = useForm(
    { org: '', name: '', email: '', type: '', comment: '' },
    { org: req('Укажите организацию'), name: req('Как к вам обращаться?'), email: emailRule, type: req('Выберите формат'), comment: req('Опишите идею в двух-трёх предложениях') },
  );
  if (f.status === 'done')
    return (
      <div className="glass">
        <FormSuccess title="Предложение отправлено" text="Мы ответим на e-mail, указанный в форме." number={no} onReset={() => f.reset()} />
      </div>
    );
  return (
    <form className="form glass form-card" noValidate onSubmit={f.submit(() => setNo(requestNo('RC')))}>
      <div className="form__row">
        <TextField f={f.bind('org')} label={C.collabOrg} autoComplete="organization" />
        <SelectField f={f.bind('type')} label={C.collabType} options={S.collabTypes} />
      </div>
      <div className="form__row">
        <TextField f={f.bind('name')} label="Имя" autoComplete="name" />
        <TextField f={f.bind('email')} label="E-mail" type="email" autoComplete="email" />
      </div>
      <AreaField f={f.bind('comment')} label={C.collabComment} />
      <div className="row">
        <SubmitButton pending={f.status === 'pending'}>{C.collabSubmit}</SubmitButton>
      </div>
    </form>
  );
}

export default function Science() {
  useScenePreset(PRESETS.science);
  usePageTitle(C.seoTitle);
  const [aud, setAud] = useState('all');
  const A = AC.academyCopy as Record<string, any>;
  const progs = (AC.programmes as Array<{ id: string; audience: string[]; format: string; title: string; text: string; duration: string }>).filter((p) => aud === 'all' || p.audience.includes(aud));
  const events = (AC.events as Array<{ id: string; date: string; time: string; audience: string[]; format: string; title: string; place: string; seats?: number; free?: boolean }>).filter((e) => aud === 'all' || e.audience.includes(aud));

  return (
    <div className="science">
      <Hero
        eyebrow={C.heroEyebrow}
        title={C.heroTitle}
        accent={[3, 4]}
        lead={C.heroText}
        tag="Призма раскладывает свет · Элемент 01 / 04"
        actions={
          <>
            <JumpLink to="pubs" className="btn">
              {C.heroPublications} <Arrow />
            </JumpLink>
            <JumpLink to="collab" className="btn btn--ghost">
              {C.heroCollab}
            </JumpLink>
          </>
        }
      />

      <section className="sec sec--paper sec--tight" aria-labelledby="sst-h">
        <div className="wrap">
          <h2 id="sst-h" className="anno">
            {C.statsEyebrow}
          </h2>
          <div className="metrics mt-m">
            {[
              [200, C.stats.patients],
              [2, C.stats.countries],
              [3, C.stats.publications],
              [1, C.stats.patent],
            ].map(([v, l]) => (
              <div key={l as string} className="metric rv">
                <Counter className="num" value={v as number} />
                <p>{l as string}</p>
              </div>
            ))}
          </div>
          <p className="small muted mt-m">
            {C.source}:{' '}
            <a href="https://24.kz/ru/news/in-the-world/788733-razrabotka-kazakhstantsa-dlya-vyyavleniya-boleznej-glaz-prokhodit-ispytaniya-v-gonkonge" target="_blank" rel="noreferrer">
              24.kz
            </a>
          </p>
        </div>
      </section>

      <section className="stage sci-spectrum" data-stage data-el={0} aria-labelledby="stmt-h">
        <div className="wrap">
          <ElementTag n={1} of={4} label="спектр" />
          <FocusText as="p" id="stmt-h" className="statement mt-m" text={C.statement} />
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="proj-h" style={{ paddingBottom: 0 }}>
        <div className="wrap page-chapter-head" style={{ paddingTop: 0 }}>
          <p className="eyebrow">{C.projectsEyebrow}</p>
          <FocusText as="h2" id="proj-h" className="h2" text={C.projectsTitle} />
        </div>
        <PinnedSteps
          className="timeline-pin"
          items={S.researchDirections as Dir[]}
          aside={(a) => (
            <div className="timeline-pin__aside" aria-hidden="true">
              <span className="timeline-pin__step" key={a}>
                {(S.researchDirections as Dir[])[a].label}
              </span>
              <span className="timeline-pin__track">
                {(S.researchDirections as Dir[]).map((_, i) => (
                  <i key={i} className={i <= a ? 'on' : ''} />
                ))}
              </span>
            </div>
          )}
          render={(d) => (
            <article className="glass timeline-pin__card">
              <h3 className="h3">{d.title}</h3>
              <p className="body">{d.text}</p>
              <ul className="list-dots small">
                {d.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          )}
        />
      </section>

      <section className="sec sec--paper" id="pubs" aria-labelledby="pub-h">
        <div className="wrap">
          <SectionHead eyebrow={C.publicationsEyebrow} title={C.publicationsTitle} text={C.publicationsText} id="pub-h" />
          <ol className="pubs mt-l" role="list">
            {(S.publications as Array<{ id: string; journal: string; publisher: string; year: number; title: string; doi: string; href: string; direction: string; summary: string }>).map((p) => (
              <li key={p.id} className="rv">
                <a href={p.href} target="_blank" rel="noreferrer" className="pub">
                  <span className="pub__v">
                    {p.journal} · {p.publisher} · {p.year}
                    <br />
                    <span className="muted">DOI {p.doi}</span>
                  </span>
                  <span className="pub__t">{p.title}</span>
                  <span className="pub__s">
                    {p.direction}. {p.summary}
                  </span>
                  <span className="sr-only">(откроется в новой вкладке)</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec sec--ink" aria-labelledby="vid-h">
        <div className="wrap split">
          <div className="stack">
            <p className="eyebrow rv">{C.videoEyebrow}</p>
            <FocusText as="h2" id="vid-h" className="h3 sci-vid__t" text={C.videoTitle} />
            <p className="small rv" style={{ color: 'rgba(244,242,237,.7)' }}>
              {C.videoCaption}
            </p>
          </div>
          <a className="video rv" href={`https://youtu.be/${S.VIDEO_ID}`} target="_blank" rel="noreferrer">
            <img src="/media/video-24kz.jpg" alt="" width={480} height={360} loading="lazy" />
            <span className="video__play" aria-hidden="true" />
            <span className="video__cap">
              <strong>{C.openVideo}</strong>
              <span className="sr-only">(YouTube, откроется в новой вкладке)</span>
            </span>
          </a>
        </div>
      </section>

      <section className="stage sci-status" data-stage data-el={1} aria-labelledby="stat-h">
        <div className="wrap">
          <ElementTag n={2} of={4} label="шаровая линза" />
          <SectionHead eyebrow={C.studiesEyebrow} title={C.studiesTitle} text={C.studiesText} id="stat-h" />
          <div className="sci-grid3 mt-l">
            {(S.studyProgrammes as Array<{ id: string; title: string; text: string; status: string }>).map((p, i) => (
              <article key={p.id} className="glass rv" style={{ ['--d' as string]: `${i * 0.08}s` }}>
                <span className="chip">
                  {C.statusLabel}: {p.status}
                </span>
                <h3 className="h3">{p.title}</h3>
                <p className="body">{p.text}</p>
              </article>
            ))}
          </div>
          <p className="demo-note mt-m rv">{C.studiesNote}</p>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="inn-h">
        <div className="wrap">
          <SectionHead eyebrow={C.innovationEyebrow} title={C.innovationTitle} id="inn-h" />
          <div className="tiles mt-l">
            {(S.innovationProgrammes as Array<{ id: string; title: string; text: string }>).map((p, i) => (
              <article key={p.id} className="tile rv" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                <span className="tile__n">0{i + 1}</span>
                <h3 className="h3">{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
          <SectionHead eyebrow={C.timelineEyebrow} title={C.timelineTitle} />
          <ol className="steps-line mt-l" role="list">
            {(S.researchTimeline as Array<{ id: string; when: string; title: string; text: string }>).map((t) => (
              <li key={t.id} className="rv">
                <span className="anno">{t.when}</span>
                <h3 className="h3">{t.title}</h3>
                <p>{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Academy */}
      <section className="sec sec--sand" id="academy" aria-labelledby="ac-h">
        <div className="wrap">
          <SectionHead eyebrow={A.heroEyebrow} title={A.heroTitle} text={A.heroText} id="ac-h" />
          <FocusText as="p" className="statement mt-l sci-ac__st" text={A.statement} />
          <div className="filters mt-l" role="group" aria-label={A.audienceLabel}>
            <button type="button" className="filter" aria-pressed={aud === 'all'} onClick={() => setAud('all')}>
              {A.filterAll}
            </button>
            {(AC.AUDIENCES as Array<{ key: string; label: string }>).map((a) => (
              <button key={a.key} type="button" className="filter" aria-pressed={aud === a.key} onClick={() => setAud(a.key)}>
                {a.label}
              </button>
            ))}
          </div>
          <div className="sci-ac mt-m">
            <div>
              <h3 className="anno">{A.proTitle}</h3>
              {progs.length === 0 ? (
                <p className="body mt-s">Для этой аудитории программ пока нет — смотрите школу пациентов ниже.</p>
              ) : (
                <ul className="sci-progs mt-s" role="list">
                  {progs.map((p) => (
                    <li key={p.id} className="tile">
                      <span className="anno">
                        {p.format} · {p.duration}
                      </span>
                      <h4 className="h3">{p.title}</h4>
                      <p>{p.text}</p>
                    </li>
                  ))}
                </ul>
              )}
              <p className="small muted mt-s">{A.proText}</p>
            </div>
            <div>
              <h3 className="anno">{A.calendarTitle}</h3>
              {events.length === 0 ? (
                <p className="body mt-s">{A.noEvents}</p>
              ) : (
                <ul className="sci-events mt-s" role="list">
                  {events.map((e) => (
                    <li key={e.id}>
                      <span className="sci-events__d">
                        <strong>{new Date(e.date).getDate()}</strong>
                        <span>{new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(new Date(e.date))}</span>
                      </span>
                      <span>
                        <span className="anno">
                          {e.format} · {e.time}
                        </span>
                        <span className="sci-events__t">{e.title}</span>
                        <span className="small muted">
                          {e.place} · {e.free ? A.free : `${e.seats} ${A.seats}`}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="demo-note mt-s">{A.calendarNote}</p>
            </div>
          </div>
          <div className="mt-l">
            <h3 className="anno">
              {A.schoolEyebrow} — {A.schoolTitle}
            </h3>
            <div className="tiles mt-s">
              {(AC.patientSchools as Array<{ id: string; title: string; text: string; points: string[] }>).map((s) => (
                <article key={s.id} className="tile rv">
                  <h4 className="h3">{s.title}</h4>
                  <p>{s.text}</p>
                  <ul className="list-dots small">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="stage sci-media" id="media" data-stage data-el={2} aria-labelledby="md-h">
        <div className="wrap">
          <ElementTag n={3} of={4} label="линза" />
          <SectionHead eyebrow={M.mediaCopy.heroEyebrow} title={M.mediaCopy.heroTitle} text={M.mediaCopy.heroText} id="md-h" />
          <div className="sci-press mt-l">
            <h3 className="anno">{M.mediaCopy.pressTitle}</h3>
            <ul role="list">
              {(M.pressReleases as Array<{ id: string; date: string; title: string; text: string; to?: string }>).map((p) => (
                <li key={p.id} className="glass rv">
                  <span className="anno">{date(p.date)}</span>
                  <h4 className="h3">{p.title}</h4>
                  <p className="body">{p.text}</p>
                  {p.to && (
                    <TLink to={mapLink(p.to)} className="link">
                      {M.mediaCopy.read} <Arrow />
                    </TLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-l">
            <h3 className="anno">
              {M.mediaCopy.podcastsTitle} · {M.mediaCopy.inProduction}
            </h3>
            <p className="body mt-s">{M.mediaCopy.podcastsText}</p>
            <ol className="row mt-s" role="list">
              {(M.podcastEpisodes as Array<{ id: string; title: string }>).map((e, i) => (
                <li key={e.id} className="chip">
                  {M.mediaCopy.episode} {i + 1}: {e.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="sec sec--paper" id="collab" aria-labelledby="col-h">
        <div className="wrap form-grid">
          <div className="stack">
            <p className="eyebrow rv">{C.collabEyebrow}</p>
            <FocusText as="h2" id="col-h" className="h2" text={C.collabTitle} />
            <p className="body rv">{C.collabText}</p>
            <ul className="list-dots rv">
              {(C.collabFormats as string[]).map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <h3 className="anno rv">{C.reportsTitle}</h3>
            <ul className="stack rv" role="list" style={{ ['--gap' as string]: '.6rem' }}>
              {(S.reports as Array<{ id: string; title: string; status: string }>).map((r) => (
                <li key={r.id} className="small">
                  <strong>{r.title}</strong> — <span className="muted">{r.status}</span>
                </li>
              ))}
            </ul>
          </div>
          <CollabForm />
        </div>
      </section>

      <LensCta el={3} title={C.ctaTitle} />
    </div>
  );
}
