import { useEffect, useRef, type CSSProperties } from 'react';
import { C } from '../content';
import { IrisLink } from '../lib/nav';
import { trackProgress } from '../lib/engine';
import { usePage } from '../lib/usePage';
import { Arrow, Chapter, Counter, Hero, Scrub, SectionHead, Station } from '../components/ui';

const A = C.people.ABOUT;
const LINK: Record<string, string> = {
  '/diagnostics': '/services/complex-diagnostics',
  '/cataract-surgery': '/services/phacoemulsification',
  '/treatment': '/services/retina-treatment',
  '/pediatric-ophthalmology': '/services/myopia-control',
  '/science': '/science',
  '/dr-kulmaganbetov': '/dr-kulmaganbetov',
  '/management': '/doctors',
  '/doctors': '/doctors',
  '/global-experts': '/global-experts',
  '/vacancies': '/contacts',
};

export default function About() {
  usePage('О центре', 'irisSide');
  const photoRef = useRef<HTMLElement>(null);
  useEffect(() => trackProgress(photoRef.current!, undefined, 'through'), []);

  return (
    <>
      <Hero
        station="irisSide"
        layer="Роговица — прозрачность"
        eyebrow={A.eyebrow}
        title="Центр, который вырастает из науки"
        accent={['науки']}
        lead={A.lead}
      >
        <IrisLink to="/dr-kulmaganbetov" className="btn">
          {A.founderLink} <Arrow />
        </IrisLink>
        <IrisLink to="/contacts" className="btn btn--ghost">
          {A.clinicsLink}
        </IrisLink>
      </Hero>

      <section className="sect about-photo" aria-label={A.photoAlt}>
        <Station id="cornea" />
        <div className="wrap">
          <figure ref={photoRef} className="photo photo--iris about-photo__fig">
            <img src="/media/clinic-evening.jpg" alt={A.photoAlt} loading="lazy" width={1440} height={1079} />
            <figcaption>{C.people.ABOUT.clinicsTitle}</figcaption>
          </figure>
        </div>
      </section>

      <section className="sect" aria-labelledby="facts-h">
        <Station id="aqueous" />
        <div className="wrap">
          <SectionHead eyebrow={A.metricsLabel} index="I" title="Наука, которую можно проверить" />
          <h2 id="facts-h" className="sr-only">
            {A.metricsLabel}
          </h2>
          <ul className="big-stats">
            {A.facts.map((f: { id: string; value: number; suffix: string; label: string }, i: number) => (
              <li key={f.id} data-reveal style={{ '--d': i * 100 } as CSSProperties}>
                <Counter value={f.value} suffix={f.suffix} />
                <span>{f.label}</span>
              </li>
            ))}
          </ul>
          <p className="small about-note" data-reveal>
            {A.metricsNote}
          </p>
        </div>
      </section>

      <Chapter steps={4} stations={['aqueous', 'lens', 'lens', 'vitreous']} className="values" label={A.valuesTitle}>
        {(active) => (
          <div className="wrap values__in">
            <div>
              <p className="eyebrow">
                <b>II</b> {A.valuesEyebrow}
              </p>
              <h2 className="h2">{A.valuesTitle}</h2>
              <p className="values__count" aria-hidden="true">
                <span>0{active + 1}</span> / 04
              </p>
            </div>
            <ol className="values__list">
              {A.values.map((v: { id: string; title: string; text: string }, i: number) => (
                <li key={v.id} className={i === active ? 'is-on' : i < active ? 'is-past' : ''}>
                  <h3 className="display d-l">{v.title}</h3>
                  <p className="lead">{v.text}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Chapter>

      <section className="sect" aria-labelledby="hist-h">
        <Station id="vitreous" />
        <div className="wrap">
          <SectionHead eyebrow={A.historyEyebrow} index="III" title={A.historyTitle} />
          <h2 id="hist-h" className="sr-only">
            {A.historyTitle}
          </h2>
          <ol className="timeline">
            {A.history.map((h: { id: string; step: string; title: string; text: string }, i: number) => (
              <li key={h.id} data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <span className="timeline__step">{h.step}</span>
                <h3 className="h3">{h.title}</h3>
                <p className="body">{h.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sect" aria-labelledby="exc-h">
        <Station id="retina" />
        <div className="wrap">
          <SectionHead eyebrow={A.excellenceEyebrow} index="IV" title={A.excellenceTitle} text={A.excellenceText} />
          <h2 id="exc-h" className="sr-only">
            {A.excellenceTitle}
          </h2>
          <div className="grid-3">
            {A.excellence.map((e: { id: string; title: string; text: string; to: string }, i: number) => (
              <IrisLink key={e.id} to={LINK[e.to] ?? '/services'} className="card" data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <span className="tag">0{i + 1}</span>
                <span className="h3">{e.title}</span>
                <span className="body">{e.text}</span>
                <span className="link">
                  {A.open} <Arrow />
                </span>
              </IrisLink>
            ))}
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="eq-h">
        <Station id="micro" />
        <div className="wrap">
          <SectionHead eyebrow={A.equipmentEyebrow} index="V" title={A.equipmentTitle} text={A.equipmentText} />
          <h2 id="eq-h" className="sr-only">
            {A.equipmentTitle}
          </h2>
          <ul className="equip">
            {A.equipment.map((e: { id: string; name: string; text: string }, i: number) => (
              <li key={e.id} data-reveal style={{ '--d': i * 70 } as CSSProperties}>
                <span className="equip__n">0{i + 1}</span>
                <h3 className="h3">{e.name}</h3>
                <p className="body">{e.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sect" aria-labelledby="team-h">
        <Station id="macula" />
        <div className="wrap">
          <Scrub className="quote about-scrub" text="Решения опираются на опубликованные данные и клинические рекомендации, а не на моду или маркетинг." />
          <SectionHead eyebrow={A.teamEyebrow} index="VI" title={A.teamTitle} />
          <h2 id="team-h" className="sr-only">
            {A.teamTitle}
          </h2>
          <div className="grid-3">
            {A.team.map((t: { id: string; title: string; text: string; to: string }, i: number) => (
              <IrisLink key={t.id} to={LINK[t.to] ?? '/'} className="card" data-reveal style={{ '--d': i * 70 } as CSSProperties}>
                <span className="h3">{t.title}</span>
                <span className="body">{t.text}</span>
                <span className="link">
                  Перейти <Arrow />
                </span>
              </IrisLink>
            ))}
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="where-h">
        <Station id="disc" />
        <div className="wrap split-2">
          <div>
            <p className="eyebrow" data-reveal>
              <b>VII</b> {A.clinicsEyebrow}
            </p>
            <h2 id="where-h" className="display d-l" data-reveal>
              {A.clinicsTitle}
            </h2>
          </div>
          <div className="stack">
            <p className="lead" data-reveal>
              {A.clinicsText}
            </p>
            <IrisLink to="/contacts" className="link" data-reveal>
              {A.clinicsLink} <Arrow />
            </IrisLink>
          </div>
        </div>
      </section>
    </>
  );
}
