import { useMemo, useState, type CSSProperties } from 'react';
import { C, byId, departments, doctors, initials, LANG_LABEL } from '../content';
import { IrisLink } from '../lib/nav';
import { usePage } from '../lib/usePage';
import { refreshMarkers } from '../lib/engine';
import { Arrow, Chapter, Hero, SectionHead, Station } from '../components/ui';

const D = C.people.DOCTORS;
const DEMO = C.people.DEMO_NOTE;

export function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 13l5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Doctors() {
  usePage('Врачи', 'iris');
  const [dept, setDept] = useState('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return doctors.filter(
      (d) =>
        (dept === 'all' || d.departmentIds.includes(dept)) &&
        (!s || `${d.name} ${d.role} ${d.bio}`.toLowerCase().includes(s)),
    );
  }, [dept, q]);

  return (
    <>
      <Hero
        station="approach"
        layer="Радужка — у каждого свой узор"
        eyebrow="Врачи центра"
        title="Люди, которые смотрят внимательно"
        accent={['внимательно']}
        lead={D.lead}
      >
        <a href="#list" className="btn">
          Найти врача <Arrow />
        </a>
        <IrisLink to="/appointment" className="btn btn--ghost">
          Записаться
        </IrisLink>
      </Hero>

      <Chapter steps={doctors.length} vh={60} stations={['iris', 'irisSide']} className="dial" label="Команда центра">
        {(active) => {
          const doc = doctors[active];
          return (
            <div className="wrap dial__in">
              <div className="dial__ring" aria-hidden="true" style={{ '--rot': `${-active * (360 / doctors.length)}deg` } as CSSProperties}>
                {doctors.map((d, i) => (
                  <span
                    key={d.id}
                    className={`dial__node ${i === active ? 'is-on' : ''}`}
                    style={{ '--a': `${i * (360 / doctors.length)}deg` } as CSSProperties}
                  >
                    <span>{initials(d.name)}</span>
                  </span>
                ))}
                <span className="dial__pupil">
                  <b>{String(active + 1).padStart(2, '0')}</b>
                  <small>/ {String(doctors.length).padStart(2, '0')}</small>
                </span>
              </div>
              <article className="dial__card" key={doc.id}>
                <p className="eyebrow">{doc.departmentIds.map((id) => byId(departments, id)?.name).join(' · ')}</p>
                <h2 className="display d-l">{doc.name}</h2>
                <p className="lead">{doc.role}</p>
                <dl className="dial__facts">
                  <div>
                    <dt>Стаж</dt>
                    <dd>{doc.experience} лет</dd>
                  </div>
                  <div>
                    <dt>Категория</dt>
                    <dd>{doc.category}</dd>
                  </div>
                  <div>
                    <dt>Языки</dt>
                    <dd>{doc.languages.map((l) => LANG_LABEL[l]).join(', ')}</dd>
                  </div>
                </dl>
                <IrisLink to={`/doctors/${doc.slug}`} className="link">
                  {D.profile} <Arrow />
                </IrisLink>
              </article>
            </div>
          );
        }}
      </Chapter>

      <section className="sect" id="list" aria-labelledby="dl-h">
        <Station id="iris" />
        <div className="wrap">
          <SectionHead eyebrow="Все врачи" title="Найдите своего специалиста" />
          <h2 id="dl-h" className="sr-only">
            Список врачей
          </h2>
          <p className="notice" data-reveal>
            {DEMO.doctors}
          </p>
          <div className="toolbar" role="search" aria-label={D.filtersLabel}>
            <label className="search">
              <span className="sr-only">{D.searchPlaceholder}</span>
              <SearchIcon />
              <input type="search" value={q} placeholder={D.searchPlaceholder} onChange={(e) => setQ(e.target.value)} />
            </label>
            <button type="button" className="chip" aria-pressed={dept === 'all'} onClick={() => setDept('all')}>
              Все
            </button>
            {departments.map((d) => (
              <button
                key={d.id}
                type="button"
                className="chip"
                aria-pressed={dept === d.id}
                onClick={() => {
                  setDept(d.id);
                  requestAnimationFrame(refreshMarkers);
                }}
              >
                {d.name.replace('Отделение ', '').replace(/^./, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
          <p className="small" aria-live="polite">
            {D.countLabel}: {list.length}
          </p>
          {list.length === 0 ? (
            <div className="empty">
              <p className="h3">Никого не нашли</p>
              <p>Попробуйте другое имя или сбросьте фильтр.</p>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setQ(''); setDept('all'); }}>
                Сбросить
              </button>
            </div>
          ) : (
            <ul className="doc-grid">
              {list.map((d) => (
                <li key={d.id}>
                  <IrisLink to={`/doctors/${d.slug}`} className="doc">
                    <span className="monogram">
                      <span>{initials(d.name)}</span>
                    </span>
                    <span className="h3">{d.name}</span>
                    <span className="body">{d.role}</span>
                    <span className="doc__meta">
                      <span>{d.experience} лет стажа</span>
                      {d.acceptsOnline && <span>Онлайн-приём</span>}
                    </span>
                  </IrisLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
