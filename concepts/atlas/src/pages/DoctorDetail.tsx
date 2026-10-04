import { Link, useParams } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { deptById, doctors, reviews, services, serviceById } from '../lib/data';
import { date, plural, tenge } from '../lib/format';
import { DEPT_FLOOR } from '../world/floors';
import { DoctorCard, initials } from './Doctors';

const LANG: Record<string, string> = { ru: 'Русский', kk: 'Казахский', en: 'Английский' };

export default function DoctorDetail() {
  const { slug } = useParams();
  const d = doctors.find((x) => x.slug === slug);
  if (!d) {
    return (
      <Page title="Врач не найден">
        <Chapter shot="doctors-hero" size="sm">
          <div className="col">
            <Eyebrow>Этаж не найден</Eyebrow>
            <h1 className="h2">Такого профиля нет</h1>
            <p className="lead">Возможно, ссылка устарела. Все врачи — на странице команды.</p>
            <BtnLink to="/doctors">Все врачи</BtnLink>
          </div>
        </Chapter>
      </Page>
    );
  }
  const floor = DEPT_FLOOR[d.departmentIds[0]] ?? 0;
  const svc = services.filter((s) => d.departmentIds.includes(s.departmentId));
  const revs = reviews.filter((r) => r.doctorId === d.id);
  const colleagues = doctors.filter((x) => x.id !== d.id && x.departmentIds.some((id) => d.departmentIds.includes(id))).slice(0, 3);
  return (
    <Page title={d.name}>
      <Chapter shot={`floor-${floor}`} size="md" label="Профиль">
        <div className="col col--wide">
          <p className="coord" data-reveal>
            <Link to="/doctors">Врачи</Link> / Этаж 0{floor + 1} · {deptById(d.departmentIds[0])?.name}
          </p>
          <R d={80}>
            <span
              aria-hidden="true"
              style={{ width: 88, height: 88, borderRadius: '50%', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', fontFamily: 'var(--f-display)', fontSize: 34, color: 'var(--ember)', margin: '18px 0 20px', background: 'radial-gradient(circle at 30% 30%, rgba(232,194,124,.2), transparent 70%)' }}
            >
              {initials(d.name)}
            </span>
          </R>
          <SplitTitle as="h1" className="display" text={d.name} />
          <R d={200}>
            <p className="lead" style={{ marginTop: 18 }}>
              {d.role}. {d.bio}
            </p>
            <div className="actions">
              <BtnLink to={`/booking?doctor=${d.slug}`}>Записаться к врачу</BtnLink>
              {d.acceptsOnline && (
                <BtnLink to="/consultation" ghost>
                  Онлайн-консультация
                </BtnLink>
              )}
            </div>
            <p className="note">Демонстрационный профиль: данные врача будут заменены сведениями клиники.</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot={`floor-${floor}`} pin={false} size="auto" label="Детали">
        <div className="grid grid--2" style={{ alignItems: 'start' }}>
          <R>
            <dl className="panel" style={{ margin: 0, display: 'grid', gap: 18 }}>
              {[
                ['Стаж', `${d.experience} ${plural(d.experience, 'год', 'года', 'лет')}`],
                ['Категория', d.category],
                ['Образование', d.education],
                ['Языки приёма', d.languages.map((l) => LANG[l]).join(', ')],
                ['Отделения', d.departmentIds.map((id) => deptById(id)?.name).join(', ')],
                ['Онлайн-приём', d.acceptsOnline ? 'Да' : 'Нет, только очно'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
                  <dt className="coord" style={{ paddingTop: 3 }}>
                    {k}
                  </dt>
                  <dd style={{ margin: 0 }}>{v}</dd>
                </div>
              ))}
            </dl>
          </R>
          <R d={120}>
            <h2 className="h3">Услуги отделения</h2>
            <div className="rows">
              {svc.map((s) => (
                <div key={s.id} className="row">
                  <Link to={`/services/${s.slug}`}>{s.name}</Link>
                  <span className="muted" style={{ fontSize: 14 }}>
                    {s.duration} мин
                  </span>
                  <span className="price">{tenge(s.price)}</span>
                </div>
              ))}
            </div>
          </R>
        </div>

        {revs.length > 0 && (
          <div style={{ marginTop: 72 }}>
            <Eyebrow>Отзывы пациентов (демо)</Eyebrow>
            <div className="grid grid--2">
              {revs.map((r) => (
                <R key={r.id}>
                  <blockquote className="card" style={{ margin: 0 }}>
                    <p className="card__p" style={{ fontSize: 17, color: 'var(--cream)' }}>
                      «{r.text}»
                    </p>
                    <footer className="card__foot">
                      <span>
                        {r.author} · {serviceById(r.serviceId)?.name}
                      </span>
                      <span className="mono">{date(r.date)}</span>
                    </footer>
                  </blockquote>
                </R>
              ))}
            </div>
          </div>
        )}

        {colleagues.length > 0 && (
          <div style={{ marginTop: 72 }}>
            <Eyebrow>Коллеги по этажу</Eyebrow>
            <div className="grid grid--3">
              {colleagues.map((c) => (
                <R key={c.id}>
                  <DoctorCard d={c} />
                </R>
              ))}
            </div>
          </div>
        )}
      </Chapter>
    </Page>
  );
}
