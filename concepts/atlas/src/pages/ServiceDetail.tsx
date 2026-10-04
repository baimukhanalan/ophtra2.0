import { Link, useParams } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { deptById, doctors, faq, knowledge, services } from '../lib/data';
import { tenge } from '../lib/format';
import { DEPT_FLOOR } from '../world/floors';
import { DoctorCard } from './Doctors';

const FAQ_TOPIC: Record<string, string> = { diagnostics: 'diagnostics', laser: 'laser', cataract: 'cataract', pediatric: 'pediatric' };

export default function ServiceDetail() {
  const { slug } = useParams();
  const s = services.find((x) => x.slug === slug);
  if (!s) {
    return (
      <Page title="Услуга не найдена">
        <Chapter shot="clinic-section" size="sm">
          <div className="col">
            <Eyebrow>Нет такого кабинета</Eyebrow>
            <h1 className="h2">Услуга не найдена</h1>
            <p className="lead">Проверьте ссылку или откройте полный список направлений.</p>
            <BtnLink to="/services">Все направления</BtnLink>
          </div>
        </Chapter>
      </Page>
    );
  }
  const d = deptById(s.departmentId)!;
  const floor = DEPT_FLOOR[d.id] ?? 0;
  const team = doctors.filter((x) => x.departmentIds.includes(d.id));
  const siblings = services.filter((x) => x.departmentId === d.id && x.id !== s.id);
  const qa = faq.filter((f) => f.topic === FAQ_TOPIC[d.id]);
  const arts = knowledge.filter((a) => a.serviceSlug === s.slug).slice(0, 3);
  return (
    <Page title={s.name}>
      <Chapter shot={`floor-${floor}`} size="md" label="Услуга">
        <div className="col col--wide">
          <p className="coord" data-reveal>
            <Link to="/services">Направления</Link> / Этаж 0{floor + 1} · {d.name}
          </p>
          <SplitTitle as="h1" className="display" text={s.name} delay={100} />
          <R d={250}>
            <p className="lead" style={{ marginTop: 22 }}>
              {s.short}
            </p>
            <dl style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 40px', margin: '0 0 30px' }}>
              <div>
                <dt className="coord">Стоимость</dt>
                <dd className="price" style={{ margin: '4px 0 0', fontSize: 26 }}>
                  {tenge(s.price)}
                </dd>
              </div>
              <div>
                <dt className="coord">Длительность</dt>
                <dd style={{ margin: '4px 0 0', fontSize: 26, fontFamily: 'var(--f-mono)' }}>{s.duration} мин</dd>
              </div>
            </dl>
            <div className="actions">
              <BtnLink to={`/booking?service=${s.slug}`}>Записаться на услугу</BtnLink>
              <BtnLink to="/second-opinion" ghost>
                Сначала второе мнение
              </BtnLink>
            </div>
          </R>
        </div>
      </Chapter>

      <Chapter shot={`floor-${floor}`} pin={false} size="auto" label="Отделение">
        <div className="grid grid--2" style={{ gap: 'clamp(24px,5vw,80px)' }}>
          <div>
            <Eyebrow>Об отделении</Eyebrow>
            <R>
              <p className="lead">{d.description}</p>
            </R>
          </div>
          {siblings.length > 0 && (
            <R d={100}>
              <h2 className="h3">Ещё на этом этаже</h2>
              <ul className="rows" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {siblings.map((x) => (
                  <li key={x.id}>
                    <Link to={`/services/${x.slug}`} className="row" style={{ textDecoration: 'none' }}>
                      <span>{x.name}</span>
                      <span className="coord">{x.duration} мин</span>
                      <span className="price">{tenge(x.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </R>
          )}
        </div>
        {team.length > 0 && (
          <div style={{ marginTop: 72 }}>
            <Eyebrow>Врачи этажа</Eyebrow>
            <div className="grid grid--3">
              {team.map((t) => (
                <R key={t.id}>
                  <DoctorCard d={t} />
                </R>
              ))}
            </div>
          </div>
        )}
        {qa.length > 0 && (
          <div style={{ marginTop: 72, maxWidth: 860 }}>
            <Eyebrow>Частые вопросы</Eyebrow>
            <div className="acc">
              {qa.map((f) => (
                <details key={f.id}>
                  <summary>{f.question}</summary>
                  <div className="acc__body">{f.answer}</div>
                </details>
              ))}
            </div>
          </div>
        )}
        {arts.length > 0 && (
          <div style={{ marginTop: 72 }}>
            <Eyebrow>Почитать перед визитом</Eyebrow>
            <div className="grid grid--3">
              {arts.map((a) => (
                <Link key={a.slug} to={`/knowledge/${a.slug}`} className="card">
                  <span className="card__k">{a.readingMinutes} мин чтения</span>
                  <h3 className="card__t">{a.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Chapter>
    </Page>
  );
}
