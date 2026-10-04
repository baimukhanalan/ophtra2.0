import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Counter, Eyebrow, R, SplitTitle } from '../components/ui';
import { news, PUBLICATIONS, SOURCES } from '../lib/data';
import { date } from '../lib/format';

const PROJECTS = [
  { l: 'ВМД', t: 'Квантовая оптика для ранней диагностики ВМД', s: 'Испытания в клиниках проведены · патент получен', p: 'Квантовая оптика: суперпозиция поляризованного и неполяризованного света, фильтры и линзы. Испытания прошли в клиниках Гонконга и Канады, обследовано 200 пациентов.' },
  { l: 'Миопия', t: 'Технология диагностики и лечения миопии', s: 'Исследования на животных', p: 'Разработка на основе квантовой оптики. Результаты будут опубликованы по мере прохождения этапов исследования.' },
  { l: 'Сетчатка', t: 'Структурированный свет и сетчатка как часть нервной системы', s: 'Публикации 2026 года', p: 'Оценка надёжности энтоптических задач со структурированным светом и машинное обучение для анализа клеток сетчатки.' },
];
const TIMELINE = [
  { w: 'Основа', t: 'PhD в области наук о зрении', p: 'Кардиффский университет (Великобритания).' },
  { w: '6 лет практики', t: 'Преподавание', p: 'Преподаватель и методист кафедры постдипломного образования Казахского НИИ глазных болезней; специализация — цифровые технологии в диагностике.' },
  { w: 'Гонконг и Канада', t: 'Испытания устройства и патент', p: 'Устройство квантовой оптики для ранней диагностики ВМД испытано в клиниках двух стран, 200 пациентов; получен патент.' },
  { w: '2026', t: 'Три рецензируемые публикации', p: 'Scientific Reports, Diagnostics и Healthcare — энтоптические тесты, ИИ и нейродегенерация, клиническая эпидемиология.' },
  { w: 'План', t: 'Центр в Астане', p: 'Офтальмологический центр для клинической работы и инновационных проектов.' },
];
const ACADEMY = ['Офтальмологам', 'Резидентам', 'Оптометристам', 'Пациентам'];

export default function Science() {
  return (
    <Page title="Наука, академия и медиа">
      <Chapter shot="field-wide" size="hero" label="Микромир">
        <div className="col col--wide">
          <Eyebrow>Наука и инновации · масштаб: сетчатка</Eyebrow>
          <SplitTitle as="h1" className="display" text="Наука, которая *возвращается к пациенту*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Квантовая оптика для ранней диагностики возрастной макулярной дегенерации, технология для миопии и исследования сетчатки. Здесь — только проверенные факты и честный статус каждого проекта, без обещаний.
            </p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="field-beam" size="md" label="Принцип" align="center">
        <div className="col col--wide">
          <SplitTitle className="statement" text="Проверять факты. Объяснять сложное. Слышать разные профессиональные позиции. *Наука в клинике — это не витрина, а привычка задавать вопросы и публично отвечать на них.*" />
        </div>
      </Chapter>

      <Chapter shot="field-fovea" label="В цифрах">
        <div className="col col--wide">
          <Eyebrow>В цифрах · источник: 24.kz и публикации</Eyebrow>
          <SplitTitle text="Макула — место, *где начинается зрение*" />
          <R d={150}>
            <div className="metrics" style={{ marginTop: 18 }}>
              <Counter value={200} label="пациентов обследовано в испытаниях устройства для диагностики ВМД" />
              <Counter value={2} label="страны испытаний — Гонконг и Канада" />
              <Counter value={3} label="рецензируемые публикации 2026 года" />
              <Counter value={1} label="патент на устройство" />
            </div>
          </R>
        </div>
      </Chapter>

      {PROJECTS.map((p, i) => (
        <Chapter key={p.t} shot={['field-layers', 'field-scan', 'field-deep'][i]} label={p.l}>
          <div className={`col ${i % 2 ? 'col--right' : ''}`}>
            <p className="coord" data-reveal>
              Проект 0{i + 1} / 03 · статус: {p.s}
            </p>
            <SplitTitle text={p.t} />
            <R d={120}>
              <p className="lead">{p.p}</p>
            </R>
          </div>
        </Chapter>
      ))}

      <Chapter shot="field-scan" pin={false} size="auto" label="Публикации">
        <div className="section__head">
          <div>
            <Eyebrow>Публикации</Eyebrow>
            <SplitTitle text="Рецензируемые *статьи*" />
          </div>
          <R>
            <p className="lead">Публикации доктора Кулмаганбетова 2026 года в международных журналах. Полные тексты и списки соавторов — на сайтах издателей.</p>
          </R>
        </div>
        <div className="grid grid--3">
          {PUBLICATIONS.map((p, i) => (
            <R key={p.id} d={i * 80}>
              <a className="card" href={p.href} target="_blank" rel="noreferrer" style={{ height: '100%' }}>
                <span className="card__k">
                  {p.journal} · {p.direction}
                </span>
                <h3 className="card__t" style={{ fontSize: 19, fontFamily: 'var(--f-ui)', fontWeight: 500 }} lang="en">
                  {p.title}
                </h3>
                <p className="card__p">{p.summary}</p>
                <span className="card__foot mono" style={{ fontSize: 11 }}>
                  DOI {p.doi}
                  <span className="sr-only"> (откроется в новой вкладке)</span>
                </span>
              </a>
            </R>
          ))}
        </div>

        <div className="grid grid--2" style={{ marginTop: 80, alignItems: 'center' }}>
          <R>
            <figure className="photo" style={{ margin: 0, aspectRatio: '16 / 9' }}>
              <img src="/media/video-24kz.jpg" alt="Кадр сюжета телеканала 24KZ об устройстве для ранней диагностики макулярной дегенерации" loading="lazy" />
              <figcaption>Сюжет телеканала 24KZ</figcaption>
            </figure>
          </R>
          <R d={120}>
            <Eyebrow>В эфире</Eyebrow>
            <h3 className="h3">Разработка казахстанца для выявления болезней глаз проходит испытания в Гонконге</h3>
            <a className="btn btn--ghost" href={SOURCES.kz24} target="_blank" rel="noreferrer">
              Статья на 24.kz<span className="sr-only"> (откроется в новой вкладке)</span>
            </a>
          </R>
        </div>
      </Chapter>

      <Chapter shot="field-wide" pin={false} size="auto" label="Хронология">
        <Eyebrow>Хронология</Eyebrow>
        <SplitTitle text="Путь *исследований*" />
        <ol className="grid grid--4" style={{ listStyle: 'none', padding: 0, margin: '32px 0 0', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {TIMELINE.map((t, i) => (
            <R as="li" key={t.t} d={i * 70}>
              <div style={{ borderTop: '1px solid var(--gold)', paddingTop: 16 }}>
                <p className="coord" style={{ margin: 0, color: 'var(--ember)' }}>
                  {t.w}
                </p>
                <h3 style={{ margin: '8px 0 6px', fontSize: 18 }}>{t.t}</h3>
                <p className="body" style={{ fontSize: 15 }}>
                  {t.p}
                </p>
              </div>
            </R>
          ))}
        </ol>
      </Chapter>

      <Chapter shot="field-layers" label="Академия">
        <div className="col col--wide">
          <Eyebrow>Академия · образовательная платформа</Eyebrow>
          <SplitTitle text="Хорошая медицина передаётся *из рук в руки*: от хирурга к резиденту, от врача к пациенту" />
          <R d={120}>
            <p className="lead">Образовательная платформа центра в Астане для врачей и пациентов. Программы готовятся к запуску вместе с открытием центра; состав, длительность и даты уточняются.</p>
          </R>
          <R d={200}>
            <p className="body">Курсы, мастер-классы, wet-lab и журнальный клуб для офтальмологов, резидентов и оптометристов; школы пациентов по глаукоме и детской миопии.</p>
            <div className="chips" style={{ marginTop: 16 }}>
              {ACADEMY.map((a) => (
                <span key={a} className="tag">
                  {a}
                </span>
              ))}
            </div>
          </R>
        </div>
      </Chapter>

      <Chapter shot="home-return" pin={false} size="auto" label="Медиацентр">
        <div className="section__head">
          <div>
            <Eyebrow>Медиацентр</Eyebrow>
            <SplitTitle text="Новости *центра*" />
          </div>
          <R>
            <p className="lead">Новости центра, научные события и выступления врачей.</p>
          </R>
        </div>
        <div className="rows">
          {news.map((n) => (
            <R key={n.id}>
              <article className="row" style={{ gridTemplateColumns: '150px 1fr auto' }}>
                <span className="coord">{date(n.date)}</span>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 500 }}>{n.title}</h3>
                  <p className="muted" style={{ margin: 0, fontSize: 15 }}>
                    {n.excerpt}
                  </p>
                </div>
                <span className="tag">{n.category}</span>
              </article>
            </R>
          ))}
        </div>
        <div className="actions" style={{ marginTop: 48 }}>
          <BtnLink to="/experts">Исследуем вместе — сеть экспертов</BtnLink>
          <BtnLink to="/knowledge" ghost>
            База знаний
          </BtnLink>
        </div>
      </Chapter>
    </Page>
  );
}
