import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { Arrow, BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { departments, programs, services, DEPT_SHORT } from '../lib/data';
import { tenge } from '../lib/format';
import { DEPT_FLOOR } from '../world/floors';

export default function Services() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => {
      const el = document.getElementById(hash.slice(1));
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const lenis = (window as unknown as { __lenis?: { scrollTo: (n: number, o?: object) => void } }).__lenis;
      if (lenis) lenis.scrollTo(top, { duration: 1.8 });
      else window.scrollTo({ top });
    }, 1300);
    return () => clearTimeout(t);
  }, [hash]);
  const ordered = [...departments].sort((a, b) => (DEPT_FLOOR[a.id] ?? 0) - (DEPT_FLOOR[b.id] ?? 0));
  return (
    <Page title="Направления и услуги">
      <Chapter shot="clinic-section" size="md" label="Здание">
        <div className="col col--wide">
          <Eyebrow>Центры передового опыта</Eyebrow>
          <SplitTitle as="h1" className="display" text="Здание в разрезе: *шесть этажей заботы*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Каждый этаж — отделение со своими врачами и оборудованием. Листайте: камера поднимается от диагностики на первом этаже до оптического салона на шестом. Цены — по прейскуранту центра.
            </p>
          </R>
          <R d={350}>
            <nav aria-label="Этажи" className="chips">
              {ordered.map((d) => (
                <a key={d.id} className="chip-btn" href={`#${d.slug}`}>
                  0{(DEPT_FLOOR[d.id] ?? 0) + 1} · {DEPT_SHORT[d.id]}
                </a>
              ))}
            </nav>
          </R>
        </div>
      </Chapter>

      {ordered.map((d) => {
        const f = DEPT_FLOOR[d.id] ?? 0;
        const list = services.filter((s) => s.departmentId === d.id);
        return (
          <Chapter key={d.id} id={d.slug} shot={`floor-${f}`} pin={false} size="auto" label={`Этаж 0${f + 1}`}>
            <div className="grid grid--2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,80px)' }}>
              <div>
                <p className="coord" data-reveal>
                  Этаж 0{f + 1} / 06
                </p>
                <SplitTitle text={d.name} />
                <R d={120}>
                  <p className="lead">{d.description}</p>
                  <Link className="btn btn--ghost btn--sm" to={`/doctors`}>
                    Врачи этажа
                  </Link>
                </R>
              </div>
              <R d={150}>
                <ul className="rows" style={{ listStyle: 'none', margin: 0, padding: 0 }} aria-label={`Услуги: ${d.name}`}>
                  {list.map((s) => (
                    <li key={s.id}>
                      <Link to={`/services/${s.slug}`} className="row" style={{ textDecoration: 'none' }}>
                        <span>
                          <span style={{ display: 'block', fontWeight: 500 }}>{s.name}</span>
                          <span className="muted" style={{ fontSize: 14 }}>
                            {s.short}
                          </span>
                        </span>
                        <span className="coord">{s.duration} мин</span>
                        <span className="price">{tenge(s.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </R>
            </div>
          </Chapter>
        );
      })}

      <Chapter shot="ground-city" pin={false} size="auto" label="Программы">
        <div className="section__head">
          <div>
            <Eyebrow>Программы наблюдения</Eyebrow>
            <SplitTitle text="Маршруты *на год вперёд*" />
          </div>
        </div>
        <div className="grid grid--3">
          {programs.map((p, i) => (
            <R key={p.id} d={i * 70}>
              <div className="card" style={{ height: '100%' }}>
                <span className="card__k">{p.duration}</span>
                <h3 className="card__t">{p.name}</h3>
                <p className="card__p">{p.short}</p>
                <ul className="ticks" style={{ fontSize: 14 }}>
                  {p.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="card__foot">
                  <span className="price">{tenge(p.price)}</span>
                  <Link to="/booking" className="btn btn--sm btn--ghost">
                    Записаться <Arrow />
                  </Link>
                </div>
              </div>
            </R>
          ))}
        </div>
        <div className="actions" style={{ marginTop: 48 }}>
          <BtnLink to="/booking">Записаться на приём</BtnLink>
        </div>
      </Chapter>
    </Page>
  );
}
