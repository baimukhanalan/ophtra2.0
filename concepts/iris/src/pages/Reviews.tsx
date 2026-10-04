import { useMemo, useState, type CSSProperties } from 'react';
import { C, byId, doctors, fmtDate, reviews, services } from '../content';
import { usePage } from '../lib/usePage';
import { IrisLink } from '../lib/nav';
import { Arrow, Hero, Scrub, SectionHead, Station } from '../components/ui';

const R = C.platform.reviewsCopy;
const DEMO = C.people.DEMO_NOTE;

export default function Reviews() {
  usePage('Отзывы', 'irisSide');
  const [rating, setRating] = useState<'all' | '5' | '4'>('all');
  const list = useMemo(
    () => reviews.filter((r) => rating === 'all' || r.rating === Number(rating)).sort((a, b) => b.date.localeCompare(a.date)),
    [rating],
  );
  const policies = [1, 2, 3, 4].map((n) => ({ t: R[`policy${n}Title`], x: R[`policy${n}`] }));

  return (
    <>
      <Hero station="irisSide" layer="Отражения на роговице" eyebrow={R.eyebrow} title={R.title} accent={['пациенты']} lead={R.lead}>
        <a href="#stories" className="btn">
          {R.listTitle} <Arrow />
        </a>
      </Hero>

      <section className="sect" aria-label="Принцип">
        <Station id="iris" />
        <div className="wrap">
          <Scrub className="quote" text={R.statement} />
        </div>
      </section>

      <section className="sect" aria-labelledby="pol-h">
        <Station id="cornea" />
        <div className="wrap">
          <SectionHead eyebrow="Правила" title={R.policyTitle} />
          <h2 id="pol-h" className="sr-only">
            {R.policyTitle}
          </h2>
          <ol className="grid-4 policies">
            {policies.map((p, i) => (
              <li key={p.t} className="card" data-reveal style={{ '--d': i * 90 } as CSSProperties}>
                <span className="policies__n">0{i + 1}</span>
                <span className="h3">{p.t}</span>
                <span className="body">{p.x}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sect" id="stories" aria-labelledby="st-h">
        <Station id="irisSide" />
        <div className="wrap">
          <SectionHead eyebrow={R.eyebrow} title={R.listTitle} />
          <h2 id="st-h" className="sr-only">
            {R.listTitle}
          </h2>
          <p className="notice" data-reveal>
            {R.verifiedNote} {DEMO.reviews}
          </p>
          <div className="toolbar" role="group" aria-label={R.filter}>
            {(['all', '5', '4'] as const).map((v) => (
              <button key={v} type="button" className="chip" aria-pressed={rating === v} onClick={() => setRating(v)}>
                {v === 'all' ? 'Все оценки' : `${v} из 5`}
              </button>
            ))}
          </div>
          {list.length === 0 ? (
            <div className="empty">
              <p className="h3">{R.emptyTitle}</p>
              <p>{R.emptyText}</p>
            </div>
          ) : (
            <ul className="reflections">
              {list.map((r, i) => {
                const doc = byId(doctors, r.doctorId);
                const svc = byId(services, r.serviceId);
                return (
                  <li key={r.id} className="refl" data-reveal style={{ '--d': (i % 2) * 120 } as CSSProperties}>
                    <span className="stars" role="img" aria-label={`Оценка ${r.rating} из 5`}>
                      {'★'.repeat(r.rating)}
                      <span className="stars__off" aria-hidden="true">
                        {'★'.repeat(5 - r.rating)}
                      </span>
                    </span>
                    <blockquote className="refl__q">«{r.text}»</blockquote>
                    <p className="refl__by">
                      <b>{r.author}</b> · {fmtDate(r.date)}
                    </p>
                    <p className="small">
                      {svc && (
                        <>
                          {R.service}: <IrisLink to={`/services/${svc.slug}`}>{svc.name}</IrisLink>
                        </>
                      )}
                      {doc && (
                        <>
                          {' '}
                          · {R.doctor}: <IrisLink to={`/doctors/${doc.slug}`}>{doc.name}</IrisLink>
                        </>
                      )}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="sect finale" aria-labelledby="rcta-h">
        <Station id="gaze" />
        <div className="wrap finale__in">
          <h2 id="rcta-h" className="display d-l" data-reveal>
            {C.home.homeCopy.storiesCta}
          </h2>
          <IrisLink to="/appointment" className="btn" data-reveal>
            Записаться <Arrow />
          </IrisLink>
        </div>
      </section>
    </>
  );
}
