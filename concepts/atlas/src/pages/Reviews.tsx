import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { departments, doctorById, reviews, serviceById, DEPT_SHORT } from '../lib/data';
import { date, plural } from '../lib/format';

const RULES = [
  { t: 'Только с согласия автора', p: 'История публикуется, только если пациент сам этого захотел и подтвердил текст.' },
  { t: 'Только после визита', p: 'Координатор сверяет историю с записью о приёме — без анонимных оценок.' },
  { t: 'Без медицинских подробностей', p: 'Имена сокращаются, диагнозы и документы не публикуются.' },
  { t: 'Критика остаётся', p: 'Мы не удаляем неудобные отзывы — отвечаем на них и меняем процессы.' },
];

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`Оценка ${n} из 5`} role="img" style={{ color: 'var(--ember)', letterSpacing: 2 }}>
      {'★'.repeat(n)}
      <span style={{ color: 'rgba(244,242,237,.2)' }}>{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export default function Reviews() {
  const [dept, setDept] = useState('all');
  const [sort, setSort] = useState<'new' | 'rating'>('new');
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const list = useMemo(() => {
    const l = reviews.filter((r) => dept === 'all' || serviceById(r.serviceId)?.departmentId === dept);
    return [...l].sort((a, b) => (sort === 'new' ? b.date.localeCompare(a.date) : b.rating - a.rating));
  }, [dept, sort]);
  const usedDepts = departments.filter((d) => reviews.some((r) => serviceById(r.serviceId)?.departmentId === d.id));
  return (
    <Page title="Отзывы">
      <Chapter shot="reviews-city" size="hero" label="Огни">
        <div className="col col--wide">
          <Eyebrow>Истории пациентов</Eyebrow>
          <SplitTitle as="h1" className="display" text="Каждая история — *огонь в окне*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Доверие, которое рассказывают сами пациенты. Листайте — в городе зажигаются окна.
            </p>
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: 'var(--f-display)', fontSize: 64, margin: 0, lineHeight: 1 }}>{avg.toFixed(1).replace('.', ',')}</p>
                <p className="coord">средняя оценка · {reviews.length} {plural(reviews.length, 'отзыв', 'отзыва', 'отзывов')}</p>
              </div>
            </div>
            <p className="note">Отзывы в демо-режиме показывают формат раздела.</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="reviews-near" pin={false} size="auto" label="Отзывы">
        <div className="panel" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div className="chips" role="group" aria-label="Отделение">
            <button type="button" className="chip-btn" aria-pressed={dept === 'all'} onClick={() => setDept('all')}>
              Все
            </button>
            {usedDepts.map((d) => (
              <button key={d.id} type="button" className="chip-btn" aria-pressed={dept === d.id} onClick={() => setDept(d.id)}>
                {DEPT_SHORT[d.id]}
              </button>
            ))}
          </div>
          <div className="field" style={{ minWidth: 200 }}>
            <label htmlFor="rev-sort" className="sr-only">
              Сортировка
            </label>
            <select id="rev-sort" className="select" value={sort} onChange={(e) => setSort(e.target.value as 'new' | 'rating')}>
              <option value="new">Сначала новые</option>
              <option value="rating">Сначала высокие оценки</option>
            </select>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          Показано отзывов: {list.length}
        </p>
        <div className="grid grid--2">
          {list.map((r, i) => {
            const s = serviceById(r.serviceId);
            const d = doctorById(r.doctorId);
            return (
              <R key={r.id} d={(i % 2) * 80}>
                <figure className="card" style={{ margin: 0, height: '100%' }}>
                  <Stars n={r.rating} />
                  <blockquote style={{ margin: 0 }}>
                    <p style={{ fontFamily: 'var(--f-display)', fontSize: 21, lineHeight: 1.4, margin: 0 }}>«{r.text}»</p>
                  </blockquote>
                  <figcaption className="card__foot" style={{ flexWrap: 'wrap' }}>
                    <span>
                      <strong style={{ color: 'var(--cream)', fontWeight: 500 }}>{r.author}</strong>
                      {s && (
                        <>
                          {' · '}
                          <Link to={`/services/${s.slug}`}>{s.name}</Link>
                        </>
                      )}
                      {d && (
                        <>
                          {' · '}
                          <Link to={`/doctors/${d.slug}`}>{d.name}</Link>
                        </>
                      )}
                    </span>
                    <span className="mono" style={{ fontSize: 12 }}>
                      {date(r.date)}
                    </span>
                  </figcaption>
                </figure>
              </R>
            );
          })}
        </div>
      </Chapter>

      <Chapter shot="ground-front" label="Правила">
        <div className="col col--wide">
          <Eyebrow>Как мы публикуем истории</Eyebrow>
          <SplitTitle text="Четыре правила *честных отзывов*" />
          <div className="grid grid--2" style={{ marginTop: 12 }}>
            {RULES.map((r, i) => (
              <R key={r.t} d={i * 70}>
                <h3 style={{ margin: '0 0 6px', fontSize: 19 }}>{r.t}</h3>
                <p className="body">{r.p}</p>
              </R>
            ))}
          </div>
          <R d={300}>
            <BtnLink to="/booking">Станьте одним из первых пациентов центра</BtnLink>
          </R>
        </div>
      </Chapter>
    </Page>
  );
}
