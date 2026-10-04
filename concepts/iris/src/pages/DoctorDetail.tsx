import type { CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { C, byId, departments, doctors, fmtDate, fmtPrice, initials, LANG_LABEL, reviews, services } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { Arrow, Counter, SectionHead, Split, Station } from '../components/ui';
import NotFound from './NotFound';

const DOC = C.people.DOCTOR;
const DEMO = C.people.DEMO_NOTE;
const KI = C.knowledge_articles_index.KNOWLEDGE_INDEX as Array<{ slug: string; title: string; authorId: string; readingMinutes: number }>;

export default function DoctorDetail() {
  const { slug } = useParams();
  const d = doctors.find((x) => x.slug === slug);
  usePage(d ? d.name : 'Врач не найден', d ? 'iris' : 'blind');
  if (!d) return <NotFound />;
  const svc = services.filter((s) => d.departmentIds.includes(s.departmentId));
  const revs = reviews.filter((r) => r.doctorId === d.id);
  const arts = KI.filter((a) => a.authorId === d.id);
  const others = doctors.filter((o) => o.id !== d.id && o.departmentIds.some((x) => d.departmentIds.includes(x)));

  return (
    <>
      <section className="hero docd-hero">
        <Station id="iris" />
        <div className="wrap docd-hero__in">
          <ol className="breadcrumbs" data-reveal>
            <li>
              <IrisLink to="/">Главная</IrisLink>
            </li>
            <li>
              <IrisLink to="/doctors">Врачи</IrisLink>
            </li>
            <li aria-current="page">{d.name}</li>
          </ol>
          <span className="monogram monogram--xl" data-reveal aria-hidden="true">
            <span>{initials(d.name)}</span>
          </span>
          <p className="eyebrow" data-reveal>
            {d.departmentIds.map((id) => byId(departments, id)?.name).join(' · ')}
          </p>
          <Split as="h1" className="display d-xl" text={d.name} />
          <p className="lead" data-reveal>
            {d.role}
          </p>
          <div className="btn-row" data-reveal>
            <IrisLink to={`/appointment?doctor=${d.slug}`} className="btn">
              Записаться к врачу <Arrow />
            </IrisLink>
            {d.acceptsOnline && (
              <IrisLink to="/online-consultation" className="btn btn--ghost">
                Онлайн-консультация
              </IrisLink>
            )}
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="pr-h">
        <Station id="irisSide" />
        <div className="wrap">
          <p className="notice" data-reveal>
            {DEMO.profile}
          </p>
          <div className="split-2 docd-profile">
            <div>
              <SectionHead eyebrow={DOC.profileEyebrow} title={DOC.profileTitle} />
              <h2 id="pr-h" className="sr-only">
                {DOC.profileTitle}
              </h2>
              <p className="lead" data-reveal>
                {d.bio}
              </p>
            </div>
            <dl className="docd-facts">
              <div data-reveal>
                <dt>Стаж</dt>
                <dd>
                  <Counter value={d.experience} className="docd-facts__n" /> лет
                </dd>
              </div>
              <div data-reveal>
                <dt>Категория</dt>
                <dd>{d.category}</dd>
              </div>
              <div data-reveal>
                <dt>{DOC.education}</dt>
                <dd>{d.education}</dd>
              </div>
              <div data-reveal>
                <dt>{DOC.languages}</dt>
                <dd>{d.languages.map((l) => LANG_LABEL[l]).join(' · ')}</dd>
              </div>
              <div data-reveal>
                <dt>{DOC.clinics}</dt>
                <dd>Центр в Астане</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="sv-h">
        <Station id="cornea" />
        <div className="wrap">
          <SectionHead eyebrow={DOC.servicesEyebrow} title="С чем можно прийти" />
          <h2 id="sv-h" className="sr-only">
            {DOC.servicesEyebrow}
          </h2>
          {svc.length ? (
            <ul className="svc-rows">
              {svc.map((s, i) => (
                <li key={s.id} data-reveal style={{ '--d': i * 60 } as CSSProperties}>
                  <IrisLink to={`/services/${s.slug}`} className="svc-row">
                    <span className="h4">{s.name}</span>
                    <span className="small">{s.duration} мин</span>
                    <span className="svc-row__price">от {fmtPrice(s.price)}</span>
                    <Arrow />
                  </IrisLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="body">{DOC.noServices}</p>
          )}
        </div>
      </section>

      <section className="sect" aria-labelledby="rv-h">
        <Station id="aqueous" />
        <div className="wrap">
          <SectionHead eyebrow={DOC.reviewsEyebrow} title={DOC.reviewsTitle} />
          <h2 id="rv-h" className="sr-only">
            {DOC.reviewsTitle}
          </h2>
          {revs.length ? (
            <>
              <p className="small">{DEMO.reviews}</p>
              <ul className="grid-2">
                {revs.map((r) => (
                  <li key={r.id} className="card" data-reveal>
                    <span className="stars" role="img" aria-label={`Оценка ${r.rating} из 5`}>
                      {'★'.repeat(r.rating)}
                      <span aria-hidden="true">{'★'.repeat(5 - r.rating)}</span>
                    </span>
                    <p className="body">«{r.text}»</p>
                    <span className="small">
                      {r.author} · {fmtDate(r.date)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="empty">{DOC.noReviews}</p>
          )}
        </div>
      </section>

      {arts.length > 0 && (
        <section className="sect" aria-labelledby="ar-h">
          <Station id="vitreous" />
          <div className="wrap">
            <SectionHead eyebrow={DOC.articlesEyebrow} title={DOC.articlesTitle} />
            <h2 id="ar-h" className="sr-only">
              {DOC.articlesTitle}
            </h2>
            <ul className="art-grid">
              {arts.map((a) => (
                <li key={a.slug}>
                  <IrisLink to={`/knowledge-base/${a.slug}`} className="art">
                    <span className="small">
                      {a.readingMinutes} {DOC.readMin}
                    </span>
                    <span className="h3">{a.title}</span>
                  </IrisLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="sect sect--tight" aria-labelledby="ot-h">
          <div className="wrap">
            <h2 id="ot-h" className="h3" style={{ marginBottom: 24 }}>
              {DOC.otherDoctors}
            </h2>
            <ul className="doc-grid">
              {others.map((o) => (
                <li key={o.id}>
                  <IrisLink to={`/doctors/${o.slug}`} className="doc">
                    <span className="monogram">
                      <span>{initials(o.name)}</span>
                    </span>
                    <span className="h3">{o.name}</span>
                    <span className="body">{o.role}</span>
                  </IrisLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
