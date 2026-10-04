import { useMemo, useState, type CSSProperties } from 'react';
import { C, DEPT_LAYER, DEPT_ORDER, byId, departments, fmtPrice, services } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { Arrow, Chapter, Hero, Scrub, SectionHead, Station } from '../components/ui';
import { EyeSection, type EyePart } from '../components/EyeSection';

const S = C.services.servicesIndexCopy;

export default function Services() {
  usePage('Центры и услуги', 'gaze');
  const [dept, setDept] = useState('all');
  const list = useMemo(() => services.filter((s) => dept === 'all' || s.departmentId === dept), [dept]);
  const ordered = DEPT_ORDER.map((id) => byId(departments, id)!);

  return (
    <>
      <Hero station="gaze" layer="Все слои — от света до нерва" eyebrow={S.eyebrow} title={S.title} accent={['помощи']} lead={S.lead}>
        <a href="#catalogue" className="btn">
          {S.listTitle} <Arrow />
        </a>
        <IrisLink to="/appointment" className="btn btn--ghost">
          Записаться
        </IrisLink>
      </Hero>

      <Chapter
        steps={ordered.length}
        vh={90}
        stations={ordered.map((d) => DEPT_LAYER[d.id].station)}
        className="anat"
        label={S.areasTitle}
      >
        {(active) => {
          const d = ordered[active];
          const L = DEPT_LAYER[d.id];
          const own = services.filter((s) => s.departmentId === d.id);
          return (
            <div className="wrap anat__in">
              <div className="anat__text" key={d.id}>
                <p className="eyebrow">
                  <b>
                    0{active + 1} / 0{ordered.length}
                  </b>{' '}
                  Слой · {L.layer}
                </p>
                <h2 className="display d-l">{d.name}</h2>
                <p className="lead">{L.why}</p>
                <p className="body">{d.description}</p>
                <ul className="anat__svc">
                  {own.map((s) => (
                    <li key={s.id}>
                      <IrisLink to={`/services/${s.slug}`}>
                        {s.name} <span>от {fmtPrice(s.price)}</span>
                      </IrisLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="anat__fig">
                <EyeSection active={d.id as EyePart} label={`Схема глаза: ${L.layer}`} />
                <ol className="anat__steps" aria-hidden="true">
                  {ordered.map((o, i) => (
                    <li key={o.id} className={i === active ? 'is-on' : ''}>
                      {DEPT_LAYER[o.id].layer}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          );
        }}
      </Chapter>

      <section className="sect" aria-label={S.statementLabel}>
        <Station id="micro" />
        <div className="wrap">
          <p className="eyebrow" data-reveal>
            {S.statementLabel}
          </p>
          <Scrub className="quote" text={S.statement} />
        </div>
      </section>

      <section className="sect" id="catalogue" aria-labelledby="cat-h">
        <Station id="retina" />
        <div className="wrap">
          <SectionHead eyebrow={S.listLabel} title={S.listTitle} />
          <h2 id="cat-h" className="sr-only">
            {S.listTitle}
          </h2>
          <div className="toolbar" role="group" aria-label={S.filterLabel}>
            <button type="button" className="chip" aria-pressed={dept === 'all'} onClick={() => setDept('all')}>
              Все отделения
            </button>
            {ordered.map((d) => (
              <button key={d.id} type="button" className="chip" aria-pressed={dept === d.id} onClick={() => setDept(d.id)}>
                {DEPT_LAYER[d.id].layer}
              </button>
            ))}
          </div>
          <p className="small" aria-live="polite">
            {S.countLabel}: {list.length}
          </p>
          <ul className="svc-rows">
            {list.map((s, i) => (
              <li key={s.id} style={{ '--d': Math.min(i, 8) * 40 } as CSSProperties}>
                <IrisLink to={`/services/${s.slug}`} className="svc-row">
                  <span className="svc-row__dept">{DEPT_LAYER[s.departmentId]?.layer}</span>
                  <span className="h4">{s.name}</span>
                  <span className="small svc-row__short">{s.short}</span>
                  <span className="small">{s.duration} мин</span>
                  <span className="svc-row__price">от {fmtPrice(s.price)}</span>
                  <Arrow />
                </IrisLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sect" aria-labelledby="path-h">
        <Station id="disc" />
        <div className="wrap split-2">
          <div>
            <SectionHead eyebrow={S.pathLabel} title={S.pathTitle} />
            <h2 id="path-h" className="sr-only">
              {S.pathTitle}
            </h2>
            <IrisLink to="/appointment" className="btn" data-reveal>
              Записаться <Arrow />
            </IrisLink>
          </div>
          <ol className="steps">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} data-reveal style={{ '--d': n * 80 } as CSSProperties}>
                <div>
                  <h3 className="h3">{S[`step${n}`]}</h3>
                  <p className="body">{S[`step${n}Text`]}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
