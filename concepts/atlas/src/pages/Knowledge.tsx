import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { Arrow, Eyebrow, R, SplitTitle } from '../components/ui';
import { authorName, K_CATEGORIES, knowledge, type KArticle } from '../lib/data';
import { date, plural } from '../lib/format';

export function ArticleCard({ a }: { a: KArticle }) {
  const cat = K_CATEGORIES.find((c) => c.id === a.category);
  return (
    <Link to={`/knowledge/${a.slug}`} className="card" style={{ height: '100%' }}>
      <span className="card__k">
        {cat?.label} · {a.readingMinutes} мин
      </span>
      <h3 className="card__t" style={{ fontSize: 21 }}>
        {a.title}
      </h3>
      <p className="card__p">{a.excerpt}</p>
      <span className="card__foot">
        <span style={{ fontSize: 13 }}>{authorName(a.authorId)}</span>
        <Arrow />
      </span>
    </Link>
  );
}

export default function Knowledge() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return knowledge.filter((a) => (cat === 'all' || a.category === cat) && (!s || `${a.title} ${a.excerpt}`.toLowerCase().includes(s)));
  }, [q, cat]);
  return (
    <Page title="База знаний">
      <Chapter shot="sky-all" size="hero" label="Небо">
        <div className="col col--wide">
          <Eyebrow>Знания и наука · {knowledge.length} материалов</Eyebrow>
          <SplitTitle as="h1" className="display" text="База знаний: *созвездия тем*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Материалы о здоровье глаз: как устроены заболевания, когда обследоваться и какие решения существуют. У каждой статьи указаны автор, источники и статус медицинской проверки. Каждая тема — созвездие, каждая звезда — статья.
            </p>
            <a className="btn btn--ghost" href="#k-all">
              Сразу к списку
            </a>
          </R>
        </div>
      </Chapter>

      {K_CATEGORIES.map((c, i) => {
        const arts = knowledge.filter((a) => a.category === c.id);
        return (
          <Chapter key={c.id} shot={`const-${c.id}`} size="md" label={c.label}>
            <div className={`col ${i % 2 ? 'col--right' : ''}`}>
              <p className="coord" data-reveal>
                Созвездие {String(i + 1).padStart(2, '0')} / 08 · {arts.length} {plural(arts.length, 'звезда', 'звезды', 'звёзд')}
              </p>
              <SplitTitle text={c.label} />
              <R d={120}>
                <p className="lead">{c.text}</p>
                <ul className="ticks">
                  {arts.map((a) => (
                    <li key={a.slug}>
                      <Link to={`/knowledge/${a.slug}`}>{a.title}</Link>
                    </li>
                  ))}
                </ul>
              </R>
            </div>
          </Chapter>
        );
      })}

      <Chapter shot="sky-all" pin={false} size="auto" label="Все статьи" id="k-all">
        <div className="section__head">
          <div>
            <Eyebrow>Материалы</Eyebrow>
            <SplitTitle text="Все статьи *базы знаний*" />
          </div>
          <p className="lead" style={{ margin: 0 }}>
            Ясная информация помогает человеку принимать взвешенные решения о зрении. Мы объясняем сложное спокойно, опираемся на доказательства и честно говорим о границах возможного.
          </p>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
          <div className="field">
            <label htmlFor="k-q">Поиск по материалам</label>
            <input id="k-q" type="search" className="input" placeholder="Например, «катаракта» или «дети»" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="chips" role="group" aria-label="Тема">
            <button type="button" className="chip-btn" aria-pressed={cat === 'all'} onClick={() => setCat('all')}>
              Все темы
            </button>
            {K_CATEGORIES.map((c) => (
              <button key={c.id} type="button" className="chip-btn" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>
          <p className="coord" aria-live="polite" style={{ margin: 0 }}>
            Материалов: {list.length}
          </p>
        </div>
        {list.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center' }}>
            <h3 className="h3">Материалы не найдены</h3>
            <p className="body">Попробуйте другое слово или сбросьте фильтры. Если нужного материала нет — задайте вопрос врачу на консультации.</p>
            <button type="button" className="btn btn--ghost" onClick={() => { setQ(''); setCat('all'); }}>
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid--3">
            {list.map((a) => (
              <div key={a.slug}>
                <ArticleCard a={a} />
              </div>
            ))}
          </div>
        )}
        <p className="note">Последнее обновление: {date(knowledge[0].date)}.</p>
      </Chapter>
    </Page>
  );
}
