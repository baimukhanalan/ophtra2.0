import { useParams } from 'react-router-dom';
import peopleJson from '../content/people.json';
import { byId, clinic, date, departments, doctors, initials, LANG_NAME, money, reviews, services, bySlug } from '../lib/data';
import { ARTICLES } from '../lib/knowledge';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { GlassPortrait } from '../ui/GlassPortrait';
import { Arrow, Hero, LensCta, SectionHead, usePageTitle } from '../ui/parts';
import NotFound from './NotFound';
import { yearsWord } from './Doctors';
import './pages.css';
import './people.css';

const P = peopleJson as unknown as { DOCTOR: Record<string, string>; DEMO_NOTE: Record<string, string>; PEOPLE_COMMON: { demo: string } };

export default function Doctor() {
  const { slug = '' } = useParams();
  const d = bySlug(doctors, slug);
  useScenePreset(PRESETS.doctor);
  usePageTitle(d ? d.name : 'Врач не найден');
  if (!d) return <NotFound />;

  const T = P.DOCTOR;
  const svc = services.filter((s) => d.departmentIds.includes(s.departmentId));
  const revs = reviews.filter((r) => r.doctorId === d.id);
  const arts = ARTICLES.filter((a) => a.authorId === d.id);
  const others = doctors.filter((o) => o.id !== d.id && o.departmentIds.some((x) => d.departmentIds.includes(x))).slice(0, 3);
  const depts = d.departmentIds.map((id) => byId(departments, id)?.name).filter(Boolean);

  return (
    <div className="doctor" key={d.id}>
      <Hero
        eyebrow={d.role}
        title={d.name}
        lead={d.bio}
        tag={`${P.PEOPLE_COMMON.demo} · ${d.category}`}
        aside={<GlassPortrait monogram={initials(d.name)} label={`Портрет: ${d.name} (демо)`} caption={`${d.experience} ${yearsWord(d.experience)} опыта`} />}
        actions={
          <>
            {d.acceptsOnline ? (
              <TLink to={`${R.booking}?doctor=${d.slug}`} className="btn">
                Записаться к врачу <Arrow />
              </TLink>
            ) : (
              <TLink to={R.contacts} className="btn">
                {T.onlineOnly} <Arrow />
              </TLink>
            )}
            <TLink to={R.doctors} className="btn btn--ghost">
              Все врачи
            </TLink>
          </>
        }
      >
        <p className="demo-note rv">{P.DEMO_NOTE.profile}</p>
      </Hero>

      <section className="sec sec--paper" aria-labelledby="prof-h">
        <div className="wrap split">
          <div className="stack">
            <p className="eyebrow rv">{T.profileEyebrow}</p>
            <FocusText as="h2" id="prof-h" className="h2" text={T.profileTitle} />
          </div>
          <dl className="kv doctor__kv rv">
            <dt>Отделения</dt>
            <dd>{depts.join(', ')}</dd>
            <dt>Категория</dt>
            <dd>{d.category}</dd>
            <dt>Стаж</dt>
            <dd>
              {d.experience} {yearsWord(d.experience)}
            </dd>
            <dt>{T.languages}</dt>
            <dd>{d.languages.map((l) => LANG_NAME[l]).join(', ')}</dd>
            <dt>{T.education}</dt>
            <dd>{d.education}</dd>
            <dt>{T.clinics}</dt>
            <dd>
              {clinic.name} · {clinic.address}
            </dd>
          </dl>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="svc-h">
        <div className="wrap">
          <SectionHead eyebrow={T.servicesEyebrow} title="Услуги, которые ведёт врач" id="svc-h" />
          {svc.length ? (
            <ul className="svc-rows mt-l" role="list">
              {svc.map((s) => (
                <li key={s.id} className="rv">
                  <TLink to={`${R.services}/${s.slug}`} className="svc-row">
                    <span className="svc-row__t">{s.name}</span>
                    <span className="svc-row__m">
                      {s.duration} мин · от {money(s.price)}
                    </span>
                    <Arrow />
                  </TLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="body mt-m">{T.noServices}</p>
          )}
        </div>
      </section>

      <section className="stage doctor-quotes" data-stage data-el={1} aria-labelledby="rev-h">
        <div className="wrap">
          <SectionHead eyebrow={T.reviewsEyebrow} title={T.reviewsTitle} id="rev-h" />
          {revs.length ? (
            <>
              <p className="demo-note mt-m rv">{P.DEMO_NOTE.reviews}</p>
              <div className="quotes mt-l">
                {revs.map((r) => (
                  <figure key={r.id} className="quote glass rv">
                    <blockquote>{r.text}</blockquote>
                    <figcaption className="anno">
                      {r.author} · {date(r.date)} · {r.rating}/5
                    </figcaption>
                  </figure>
                ))}
              </div>
            </>
          ) : (
            <p className="body mt-m rv">{T.noReviews}</p>
          )}
        </div>
      </section>

      {arts.length > 0 && (
        <section className="sec sec--paper" aria-labelledby="art-h">
          <div className="wrap">
            <SectionHead eyebrow={T.articlesEyebrow} title={T.articlesTitle} id="art-h" />
            <div className="tiles mt-l">
              {arts.map((a) => (
                <TLink key={a.slug} to={`${R.knowledge}/${a.slug}`} className="slide rv">
                  <span className="slide__mount" aria-hidden="true" />
                  <span className="anno">
                    {a.readingMinutes} {T.readMin}
                  </span>
                  <span className="h3">{a.title}</span>
                  <span className="small muted">{a.excerpt}</span>
                </TLink>
              ))}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="sec sec--solid" aria-labelledby="oth-h">
          <div className="wrap">
            <SectionHead title={T.otherDoctors} id="oth-h" />
            <ul className="doc-grid doc-grid--3 mt-l" role="list">
              {others.map((o, i) => (
                <li key={o.id}>
                  <TLink to={`${R.doctors}/${o.slug}`} className="doc-card">
                    <GlassPortrait compact monogram={initials(o.name)} label={`Портрет: ${o.name} (демо)`} tone={i + 1} />
                    <span className="doc-card__body">
                      <span className="h3">{o.name}</span>
                      <span className="doc-card__role">{o.role}</span>
                    </span>
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <LensCta title={`Приём: ${d.name}`} primary={{ to: d.acceptsOnline ? `${R.booking}?doctor=${d.slug}` : R.contacts, label: d.acceptsOnline ? 'Записаться к врачу' : T.onlineOnly }} />
    </div>
  );
}
