import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { Eyebrow, R, SplitTitle } from '../components/ui';
import { departments, doctors, type Doctor, DEPT_SHORT } from '../lib/data';
import { plural } from '../lib/format';
import { DEPT_FLOOR } from '../world/floors';

const LANG: Record<string, string> = { ru: 'RU', kk: 'KK', en: 'EN' };

export function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
}

export function DoctorCard({ d }: { d: Doctor }) {
  return (
    <Link to={`/doctors/${d.slug}`} className="card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <span
          aria-hidden="true"
          style={{ width: 56, height: 56, borderRadius: '50%', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', fontFamily: 'var(--f-display)', fontSize: 22, color: 'var(--ember)', flex: 'none', background: 'radial-gradient(circle at 30% 30%, rgba(232,194,124,.18), transparent 70%)' }}
        >
          {initials(d.name)}
        </span>
        <div>
          <h3 className="card__t" style={{ fontSize: 21 }}>
            {d.name}
          </h3>
          <p className="card__p" style={{ fontSize: 14 }}>
            {d.role}
          </p>
        </div>
      </div>
      <p className="card__p">{d.bio}</p>
      <div className="card__foot">
        <span className="mono" style={{ fontSize: 12 }}>
          {d.experience} {plural(d.experience, 'год', 'года', 'лет')} · {d.languages.map((l) => LANG[l]).join(' ')}
        </span>
        {d.acceptsOnline && <span className="tag">онлайн</span>}
      </div>
    </Link>
  );
}

export default function Doctors() {
  const [q, setQ] = useState('');
  const [dept, setDept] = useState<string>('all');
  const [online, setOnline] = useState(false);
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return doctors.filter(
      (d) =>
        (!s || `${d.name} ${d.role} ${d.bio}`.toLowerCase().includes(s)) &&
        (dept === 'all' || d.departmentIds.includes(dept)) &&
        (!online || d.acceptsOnline),
    );
  }, [q, dept, online]);
  const groups = departments
    .filter((dep) => dept === 'all' || dep.id === dept)
    .map((dep) => ({ dep, list: dept === 'all' ? filtered.filter((d) => d.departmentIds[0] === dep.id) : filtered }))
    .filter((g) => g.list.length);

  return (
    <Page title="Врачи">
      <Chapter shot="doctors-hero" size="md" label="Команда">
        <div className="col col--wide">
          <Eyebrow>Люди центра</Eyebrow>
          <SplitTitle as="h1" className="display" text="Врачи — *на своих этажах*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Врачи и хирурги центра: поиск по отделению, стаж, языки и запись к конкретному специалисту. Камера поднимается по этажам — у каждого отделения своя команда.
            </p>
            <p className="note">Профили врачей на сайте пока демонстрационные: имена, описания и стаж показывают, как устроены страницы, и будут заменены сведениями клиники.</p>
          </R>
        </div>
      </Chapter>

      <section className="section" aria-label="Фильтр врачей" style={{ paddingTop: 0, paddingBottom: 24 }}>
        <div className="wrap pad">
          <div className="panel" style={{ display: 'grid', gap: 18 }}>
            <div className="form__row">
              <div className="field searchbox">
                <label htmlFor="doc-q">Поиск по имени или специализации</label>
                <div style={{ position: 'relative' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)' }}>
                    <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <input id="doc-q" className="input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Например, «глаукома»" style={{ paddingLeft: 44 }} />
                </div>
              </div>
              <label className="check" style={{ alignSelf: 'end', minHeight: 50, alignItems: 'center' }}>
                <input type="checkbox" checked={online} onChange={(e) => setOnline(e.target.checked)} />
                <span>Только ведущие онлайн-приём</span>
              </label>
            </div>
            <div className="chips" role="group" aria-label="Отделение">
              <button type="button" className="chip-btn" aria-pressed={dept === 'all'} onClick={() => setDept('all')}>
                Все этажи
              </button>
              {departments.map((d) => (
                <button key={d.id} type="button" className="chip-btn" aria-pressed={dept === d.id} onClick={() => setDept(d.id)}>
                  0{(DEPT_FLOOR[d.id] ?? 0) + 1} · {DEPT_SHORT[d.id]}
                </button>
              ))}
            </div>
            <p className="coord" aria-live="polite" style={{ margin: 0 }}>
              Найдено: {filtered.length} {plural(filtered.length, 'врач', 'врача', 'врачей')}
            </p>
          </div>
        </div>
      </section>

      {groups.length === 0 && (
        <Chapter shot="clinic-section" pin={false} size="auto">
          <div className="panel" style={{ textAlign: 'center' }}>
            <h2 className="h3">Никого не нашли</h2>
            <p className="body">Попробуйте другое слово или сбросьте фильтры.</p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setQ('');
                setDept('all');
                setOnline(false);
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        </Chapter>
      )}

      {groups.map(({ dep, list }) => {
        const f = DEPT_FLOOR[dep.id] ?? 0;
        return (
          <Chapter key={dep.id} shot={`floor-${f}`} pin={false} size="auto" label={`Этаж 0${f + 1}`}>
            <div className="section__head" style={{ marginBottom: 28 }}>
              <div>
                <p className="coord">Этаж 0{f + 1} / 06</p>
                <h2 className="h2" style={{ marginTop: 8 }}>
                  {dep.name}
                </h2>
              </div>
              <p className="lead" style={{ margin: 0 }}>
                {dep.short}
              </p>
            </div>
            <div className="grid grid--3">
              {list.map((d, i) => (
                <R key={d.id} d={i * 70}>
                  <DoctorCard d={d} />
                </R>
              ))}
            </div>
          </Chapter>
        );
      })}
    </Page>
  );
}
