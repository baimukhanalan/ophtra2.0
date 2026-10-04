import { useDeferredValue, useMemo, useState } from 'react';
import peopleJson from '../content/people.json';
import { departments, doctors, initials, LANG_NAME } from '../lib/data';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { R } from '../routes';
import { TLink } from '../shell/Transition';
import { GlassPortrait } from '../ui/GlassPortrait';
import { FocusText } from '../ui/FocusText';
import { Arrow, Hero, LensCta, SectionHead, usePageTitle } from '../ui/parts';
import './pages.css';
import './people.css';
import { deptShort } from './Services';

const P = peopleJson as unknown as { DOCTORS: Record<string, string>; DEMO_NOTE: Record<string, string>; MANAGEMENT: Record<string, any>; PEOPLE_COMMON: { demo: string } };

export const yearsWord = (n: number) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return 'год';
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'года';
  return 'лет';
};

export default function Doctors() {
  useScenePreset(PRESETS.doctors);
  usePageTitle('Врачи');
  const [dept, setDept] = useState<string>('all');
  const [q, setQ] = useState('');
  const dq = useDeferredValue(q.trim().toLowerCase());

  const list = useMemo(
    () =>
      doctors.filter(
        (d) =>
          (dept === 'all' || d.departmentIds.includes(dept)) &&
          (!dq || (d.name + ' ' + d.role + ' ' + d.bio).toLowerCase().includes(dq)),
      ),
    [dept, dq],
  );
  const management = doctors.filter((d) => d.isManagement);

  return (
    <div className="doctors">
      <Hero
        size="xl"
        eyebrow="Команда"
        title="Врачи центра"
        accent={[1]}
        lead={P.DOCTORS.lead}
        tag="Элементы 01–03 — три стеклянные пластины"
        actions={
          <TLink to={R.booking} className="btn">
            Записаться к врачу <Arrow />
          </TLink>
        }
      />

      <section className="sec sec--solid" aria-labelledby="team-h">
        <div className="wrap">
          <div className="doctors__bar">
            <FocusText as="h2" id="team-h" className="h2" text="Офтальмохирурги и специалисты центра" />
            <p className="demo-note rv">{P.DEMO_NOTE.doctors}</p>
          </div>

          <div className="doctors__tools mt-l" role="search">
            <div className="field search">
              <label htmlFor="doc-q" className="sr-only">
                Поиск врача
              </label>
              <input
                id="doc-q"
                className="field__input"
                type="search"
                placeholder={P.DOCTORS.searchPlaceholder}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="filters" role="group" aria-label={P.DOCTORS.filtersLabel}>
              <button type="button" className="filter" aria-pressed={dept === 'all'} onClick={() => setDept('all')}>
                Все отделения
              </button>
              {departments.map((d) => (
                <button key={d.id} type="button" className="filter" aria-pressed={dept === d.id} onClick={() => setDept(d.id)}>
                  {deptShort(d.name)}
                </button>
              ))}
            </div>
          </div>

          <p className="anno mt-m" aria-live="polite">
            {P.DOCTORS.countLabel}: {list.length}
          </p>

          {list.length === 0 ? (
            <div className="empty mt-m">
              <p className="h3">Никого не нашли</p>
              <p className="body">Попробуйте другое слово или сбросьте фильтр отделения.</p>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => {
                  setQ('');
                  setDept('all');
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <ul className="doc-grid mt-m" role="list">
              {list.map((d, i) => (
                <li key={d.id}>
                  <TLink to={`${R.doctors}/${d.slug}`} className="doc-card">
                    <GlassPortrait compact monogram={initials(d.name)} label={`Портрет: ${d.name} (демо)`} tone={i % 4} />
                    <span className="doc-card__body">
                      <span className="anno doc-card__demo">{P.PEOPLE_COMMON.demo}</span>
                      <span className="h3">{d.name}</span>
                      <span className="doc-card__role">{d.role}</span>
                      <span className="doc-card__meta">
                        <span>
                          {d.experience} {yearsWord(d.experience)} опыта
                        </span>
                        <span>{d.languages.map((l) => LANG_NAME[l]).join(' · ')}</span>
                      </span>
                    </span>
                  </TLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="stage doctors-mgmt" data-stage data-el={3} aria-labelledby="mgmt-h">
        <div className="wrap split">
          <div className="stack">
            <SectionHead eyebrow={P.MANAGEMENT.teamEyebrow} title={P.MANAGEMENT.teamTitle} id="mgmt-h" text={P.MANAGEMENT.statement} />
            {management.map((m) => (
              <TLink key={m.id} to={`${R.doctors}/${m.slug}`} className="link rv">
                {m.name} — {m.role} <Arrow />
              </TLink>
            ))}
          </div>
          <div className="stack">
            <p className="eyebrow rv">{P.MANAGEMENT.governanceEyebrow}</p>
            <h3 className="h3 rv">{P.MANAGEMENT.governanceTitle}</h3>
            <ol className="gov" role="list">
              {(P.MANAGEMENT.governance as Array<{ title: string; text: string }>).map((g, i) => (
                <li key={g.title} className="glass rv" style={{ ['--d' as string]: `${i * 0.06}s` }}>
                  <span className="tile__n">0{i + 1}</span>
                  <strong>{g.title}</strong>
                  <span className="body">{g.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <LensCta title="Запишитесь на консультацию офтальмолога" text="Подберём время, врача и формат приёма. Подтверждение придёт в WhatsApp." secondary={{ to: R.experts, label: 'Сеть глобальных экспертов' }} />
    </div>
  );
}
