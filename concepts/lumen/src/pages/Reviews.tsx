import { useState } from 'react';
import homeJson from '../content/home.json';
import peopleJson from '../content/people.json';
import platformJson from '../content/platform.json';
import { byId, date, doctors, reviews, services } from '../lib/data';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { ElementTag, Hero, LensCta, SectionHead, usePageTitle } from '../ui/parts';
import './pages.css';
import './people.css';
import './misc.css';

const RC = (platformJson as unknown as { reviewsCopy: Record<string, string> }).reviewsCopy;
const DEMO = (peopleJson as unknown as { DEMO_NOTE: Record<string, string> }).DEMO_NOTE;
const H = (homeJson as unknown as { homeCopy: Record<string, any> }).homeCopy;

/** Rating as five tiny lenses (filled = in focus). */
const Lenses = ({ n }: { n: number }) => (
  <span className="lenses" role="img" aria-label={`Оценка ${n} из 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <i key={i} className={i <= n ? 'on' : ''} />
    ))}
  </span>
);

export default function Reviews() {
  useScenePreset(PRESETS.reviews);
  usePageTitle(RC.title);
  const [rating, setRating] = useState<number | null>(null);
  const list = reviews.filter((r) => rating === null || r.rating === rating);
  const policy = [1, 2, 3, 4].map((i) => ({ t: RC[`policy${i}Title`], x: RC[`policy${i}`] }));

  return (
    <div className="reviews">
      <Hero eyebrow={RC.eyebrow} title={RC.title} accent={[2]} lead={RC.lead} tag="Отзывы · Элемент 01 / 02" />

      <section className="stage rv-stmt" data-stage data-el={1} aria-labelledby="stmt-h">
        <div className="wrap">
          <ElementTag n={2} of={2} label="мениск" />
          <FocusText as="p" id="stmt-h" className="statement mt-m" text={RC.statement} />
          <p className="body rv mt-m">{RC.verifiedNote}</p>
        </div>
      </section>

      <section className="sec sec--solid" aria-labelledby="list-h">
        <div className="wrap">
          <SectionHead eyebrow={H.storiesEyebrow} title={RC.listTitle} id="list-h" />
          <p className="demo-note mt-m">{DEMO.reviews}</p>
          <div className="filters mt-m" role="group" aria-label={RC.filter}>
            <button type="button" className="filter" aria-pressed={rating === null} onClick={() => setRating(null)}>
              Все
            </button>
            {[5, 4].map((n) => (
              <button key={n} type="button" className="filter" aria-pressed={rating === n} onClick={() => setRating(n)}>
                {n} из 5
              </button>
            ))}
            <button type="button" className="filter" aria-pressed={rating === 3} onClick={() => setRating(3)}>
              3 из 5
            </button>
          </div>
          {list.length === 0 ? (
            <div className="empty mt-m">
              <p className="h3">Отзывов с такой оценкой нет</p>
              <p className="body">{RC.policy2}</p>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setRating(null)}>
                Показать все
              </button>
            </div>
          ) : (
            <ul className="rv-list mt-l" role="list">
              {list.map((r, i) => {
                const d = byId(doctors, r.doctorId);
                const s = byId(services, r.serviceId);
                return (
                  <li key={r.id} className="rv" style={{ ['--d' as string]: `${(i % 2) * 0.08}s` }}>
                    <figure className="rv-card">
                      <Lenses n={r.rating} />
                      <blockquote>{r.text}</blockquote>
                      <figcaption>
                        <strong>{r.author}</strong>
                        <span className="small muted">{date(r.date)}</span>
                        <span className="small">
                          {s && (
                            <>
                              {RC.service}: <TLink to={`${R.services}/${s.slug}`}>{s.name}</TLink>
                            </>
                          )}
                          {d && (
                            <>
                              {' · '}
                              {RC.doctor}: <TLink to={`${R.doctors}/${d.slug}`}>{d.name}</TLink>
                            </>
                          )}
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="sec sec--paper" aria-labelledby="pol-h">
        <div className="wrap">
          <SectionHead eyebrow={RC.policyTitle} title="Четыре правила" id="pol-h" />
          <ol className="tiles mt-l" role="list">
            {policy.map((p, i) => (
              <li key={p.t} className="tile rv">
                <span className="tile__n">0{i + 1}</span>
                <h3 className="h3">{p.t}</h3>
                <p>{p.x}</p>
              </li>
            ))}
          </ol>
          <div className="empty mt-l rv">
            <p className="h3">{RC.emptyTitle}</p>
            <p className="body">{RC.emptyText}</p>
          </div>
        </div>
      </section>

      <LensCta title={H.storiesCta} />
    </div>
  );
}
