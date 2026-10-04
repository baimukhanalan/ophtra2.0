import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import servicesJson from '../content/services.json';
import { departments, money, programs, services } from '../lib/data';
import { PRESETS, serviceCurve } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { FocusText } from '../ui/FocusText';
import { Arrow, ElementTag, Hero, JumpLink, LensCta, LensGlyph, SectionHead, usePageTitle } from '../ui/parts';
import { scrollToEl } from '../lib/scroll';
import './pages.css';
import './services.css';

const S = servicesJson as unknown as { servicesIndexCopy: Record<string, string>; programsCopy: Record<string, string>; sharedCopy: Record<string, string> };
const C = S.servicesIndexCopy;
const DEPT_CURVE = [0.15, 0.3, 0.45, 0.5, 0.7, 0.9];

/** Short department labels — the production navigation vocabulary (nav.*). */
const DEPT_LABEL: Record<string, string> = {
  'Отделение диагностики': 'Диагностика',
  'Отделение лечения заболеваний глаз': 'Лечение заболеваний глаз',
  'Отделение лазерной коррекции': 'Лазерная коррекция зрения',
  'Отделение хирургии катаракты': 'Хирургия катаракты',
  'Детская офтальмология': 'Детская офтальмология',
  'Оптический салон': 'Оптика',
};
export const deptShort = (name: string) => DEPT_LABEL[name] ?? name;

export default function Services() {
  useScenePreset(PRESETS.services);
  usePageTitle(C.seoTitle);
  const [params, setParams] = useSearchParams();
  const dept = params.get('d') ?? 'all';
  const list = useMemo(() => services.map((s, i) => ({ s, i })).filter(({ s }) => dept === 'all' || s.departmentId === dept), [dept]);
  const setDept = (d: string) => {
    const next = new URLSearchParams(params);
    if (d === 'all') next.delete('d');
    else next.set('d', d);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <div className="services">
      <Hero
        eyebrow={C.eyebrow}
        title={C.title}
        accent={[1]}
        size="xl"
        lead={C.lead}
        tag="Элементы 01–06 — линзы разной кривизны"
        actions={
          <>
            <JumpLink to="catalogue" className="btn">
              {C.listTitle} <Arrow />
            </JumpLink>
            <TLink to={R.booking} className="btn btn--ghost">
              Записаться
            </TLink>
          </>
        }
      />

      {/* departments: each a lens with its own curvature */}
      <section className="stage services-areas" data-stage data-el={2} aria-labelledby="areas-h">
        <div className="wrap">
          <ElementTag n={2} of={6} label="шесть отделений" />
          <SectionHead eyebrow={C.areasLabel} title={C.areasTitle} text={C.areasText} id="areas-h" />
          <div className="areas mt-l">
            {departments.map((d, i) => (
              <button
                key={d.id}
                type="button"
                className={'area glass rv' + (dept === d.id ? ' is-on' : '')}
                style={{ ['--d' as string]: `${i * 0.06}s` }}
                aria-pressed={dept === d.id}
                onClick={() => {
                  setDept(d.id);
                  scrollToEl(document.getElementById('catalogue'));
                }}
              >
                <LensGlyph curve={DEPT_CURVE[i]} size={60} />
                <span className="h3">{deptShort(d.name)}</span>
                <span className="body">{d.short}</span>
                <span className="area__k anno">Линза 0{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--ink services-statement" aria-labelledby="st-h">
        <div className="wrap">
          <p className="eyebrow rv" id="st-h">
            {C.statementLabel}
          </p>
          <FocusText as="p" className="statement mt-m" text={C.statement} />
        </div>
      </section>

      <section className="sec sec--solid" id="catalogue" aria-labelledby="cat-h">
        <div className="wrap">
          <SectionHead eyebrow={C.listLabel} title={C.listTitle} id="cat-h" />
          <div className="filters mt-m" role="group" aria-label={C.filterLabel}>
            <button type="button" className="filter" aria-pressed={dept === 'all'} onClick={() => setDept('all')}>
              Все
            </button>
            {departments.map((d) => (
              <button key={d.id} type="button" className="filter" aria-pressed={dept === d.id} onClick={() => setDept(d.id)}>
                {deptShort(d.name)}
              </button>
            ))}
          </div>
          <p className="anno mt-m" aria-live="polite">
            {C.countLabel}: {list.length}
          </p>
          <ul className="catalogue mt-s" role="list">
            {list.map(({ s, i }) => (
              <li key={s.id}>
                <TLink to={`${R.services}/${s.slug}`} className="cat-row">
                  <LensGlyph curve={serviceCurve(i)} size={52} className="cat-row__g" />
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
          <p className="small muted mt-m">{S.sharedCopy.disclaimer}</p>
        </div>
      </section>

      <section className="sec sec--sand" aria-labelledby="path-h">
        <div className="wrap">
          <SectionHead eyebrow={C.pathLabel} title={C.pathTitle} id="path-h" />
          <ol className="steps-line mt-l" role="list">
            {[1, 2, 3, 4].map((n) => (
              <li key={n} className="rv" style={{ ['--d' as string]: `${n * 0.07}s` }}>
                <h3 className="h3">{C['step' + n]}</h3>
                <p>{C['step' + n + 'Text']}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec sec--paper" id="programs" aria-labelledby="prog-h">
        <div className="wrap">
          <SectionHead eyebrow={S.programsCopy.listLabel} title="Медицинские программы" text={S.programsCopy.lead} id="prog-h" />
          <div className="programs mt-l">
            {programs.map((p, i) => {
              const inc = Array.isArray(p.includes) ? p.includes : p.includes.ru;
              return (
                <article key={p.id} className="program rv" style={{ ['--d' as string]: `${(i % 3) * 0.07}s` }}>
                  <p className="anno">{p.duration}</p>
                  <h3 className="h3">{p.name}</h3>
                  <p className="body">{p.short}</p>
                  <ul className="list-dots small">
                    {inc.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <p className="program__price">
                    <span className="anno">{S.programsCopy.price}</span>
                    <strong>{money(p.price)}</strong>
                  </p>
                </article>
              );
            })}
          </div>
          <FocusText as="p" className="statement mt-xl services-prog-st" text={S.programsCopy.statement} />
        </div>
      </section>

      <LensCta el={5} title="Любая услуга начинается с разговора" text={C.step1Text} />
    </div>
  );
}
