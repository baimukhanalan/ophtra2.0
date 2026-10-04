import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { PUBLICATIONS, SOURCES } from '../lib/data';

const CREDS = [
  { a: 'MD', t: 'Доктор медицины в офтальмологии', p: 'Шесть лет профессионального опыта' },
  { a: 'PhD', t: 'PhD в науках о зрении', p: 'Cardiff University, Великобритания' },
  { a: 'AFHEA', t: 'Associate Fellow of the Higher Education Academy', p: 'Признанная квалификация в университетском преподавании' },
  { a: 'Патент', t: 'На устройство для раннего выявления ВМД', p: 'Квантовая оптика, по данным 24.kz' },
];

const ROUTE = [
  { shot: 'founder-kz', wp: 'Казахстан', mark: 'MD', label: 'Практика и преподавание', title: 'Врач, который *учит врачей*', text: 'MD в офтальмологии и шесть лет профессионального опыта. Лектор и методист отдела последипломного образования Казахского научно-исследовательского института глазных болезней; специализация — цифровые технологии в диагностике болезней глаз.', src: 'Казахский НИИ глазных болезней' },
  { shot: 'founder-cardiff', wp: 'Кардифф · 51.48° N', mark: 'PhD', label: 'Наука о зрении', title: 'PhD в *Кардиффском университете*', text: 'Докторская степень по наукам о зрении (Vision Sciences) в Cardiff University, Великобритания. Статус AFHEA подтверждает квалификацию в университетском преподавании.', src: 'Cardiff University · AFHEA' },
  { shot: 'home-hk', wp: 'Квантовая оптика', mark: 'Патент', label: 'Разработка', title: 'Свет *в суперпозиции*', text: 'Устройство на основе квантовой оптики для раннего выявления возрастной макулярной дегенерации: поляризованный и неполяризованный свет в суперпозиции, система фильтров и линз. На разработку получен патент.', src: 'Раннее выявление ВМД' },
  { shot: 'founder-trials', wp: 'Гонконг · Канада', mark: '200', label: 'Испытания', title: 'Гонконг и Канада: *200 пациентов*', text: 'Устройство испытали в клиниках Гонконга и Канады, обследовано 200 пациентов. По данным 24.kz, работа вызвала интерес у специалистов из США, Европы, Китая, Канады и Японии.', src: 'пациентов · Гонконг и Канада' },
  { shot: 'founder-myopia', wp: 'Следующая задача', mark: 'Миопия', label: 'Миопия', title: 'Следующая задача — *близорукость*', text: 'Технология диагностики и лечения миопии на основе квантовой оптики. Сейчас работа на стадии исследований на животных — до применения у пациентов ещё несколько этапов.', src: 'Стадия исследований на животных' },
  { shot: 'founder-papers', wp: '2026', mark: '2026', label: 'Публикации', title: 'Три статьи *2026 года*', text: 'Соавторство в Scientific Reports (надёжность энтоптических задач со структурированным светом), Diagnostics (машинное обучение и сетчатка) и Healthcare (когортное исследование о хронической болезни почек и COVID-19).', src: 'Scientific Reports · Diagnostics · Healthcare' },
  { shot: 'founder-astana', wp: 'Астана · 51.13° N', mark: 'Астана', label: 'Астана', title: 'Центр для клиники *и инноваций*', text: 'Следующий шаг — офтальмологический центр в Астане, где клиническая работа и инновационные проекты идут рядом.', src: 'Центр в Астане' },
];

const RESEARCH = [
  { e: 'Квантовая оптика', t: 'Раннее выявление ВМД', p: 'Запатентованное устройство: поляризованный и неполяризованный свет в суперпозиции. Испытано в клиниках Гонконга и Канады.' },
  { e: 'Квантовая оптика', t: 'Диагностика и лечение миопии', p: 'Новая технология на стадии исследований на животных.' },
  { e: 'Цифровые технологии', t: 'Цифровая диагностика болезней глаз', p: 'Специализация в преподавании врачам: как цифровые методы помогают ставить диагноз раньше и точнее.' },
  { e: 'Науки о зрении', t: 'Свет и восприятие', p: 'Структурированный свет и энтоптические задачи: насколько надёжно человек может оценить собственное зрение.' },
  { e: 'Данные', t: 'Машинное обучение и когорты', p: 'Классификация изображений сетчатки алгоритмами и когортные исследования хронических заболеваний.' },
];

export default function Founder() {
  return (
    <Page title="Основатель — Мухит Кулмаганбетов">
      <Chapter shot="founder-hero" size="hero" label="Основатель">
        <div className="col col--wide">
          <Eyebrow>Основатель центра · доктор Мухит Кулмаганбетов</Eyebrow>
          <SplitTitle as="h1" className="display" text="Учёный, стоящий за миссией *сохранения зрения*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Офтальмолог и исследователь в области наук о зрении. Разработал устройство на основе квантовой оптики для раннего выявления возрастной макулярной дегенерации: его испытали в клиниках Гонконга и Канады, на разработку получен патент.
            </p>
          </R>
          <R d={380}>
            <dl className="grid grid--4" style={{ margin: 0 }}>
              {CREDS.map((c) => (
                <div key={c.a} style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <dt className="gold" style={{ fontFamily: 'var(--f-display)', fontSize: 30 }}>
                    {c.a}
                  </dt>
                  <dd style={{ margin: '6px 0 0', fontSize: 14 }} className="muted">
                    {c.t}. {c.p}
                  </dd>
                </div>
              ))}
            </dl>
          </R>
        </div>
      </Chapter>

      <Chapter shot="founder-hero" size="md" label="Манифест" align="center">
        <div className="col col--center col--wide">
          <Eyebrow>Манифест центра</Eyebrow>
          <SplitTitle className="statement" text="Зрение теряют тихо — годами, без боли и без симптомов. Поэтому задача науки — *находить болезнь раньше*, чем её заметит сам человек." />
        </div>
      </Chapter>

      {ROUTE.map((s, i) => (
        <Chapter key={s.shot} shot={s.shot} label={s.label}>
          <div className={`col ${i % 2 ? 'col--right' : ''}`}>
            <p className="coord" data-reveal>
              Точка маршрута {String(i + 1).padStart(2, '0')} / 07 · {s.wp}
            </p>
            <R d={60}>
              <p style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(64px, 9vw, 140px)', lineHeight: 1, margin: '8px 0 12px', color: 'var(--ember)', fontStyle: 'italic' }} aria-hidden="true">
                {s.mark}
              </p>
            </R>
            <Eyebrow d={100}>{s.label}</Eyebrow>
            <SplitTitle text={s.title} />
            <R d={200}>
              <p className="lead">{s.text}</p>
              <p className="coord">Источник: {s.src}</p>
            </R>
          </div>
        </Chapter>
      ))}

      <Chapter shot="field-wide" pin={false} size="auto" label="Исследования">
        <div className="section__head">
          <div>
            <Eyebrow>Направления исследований</Eyebrow>
            <SplitTitle text="Квантовая оптика, цифровая диагностика *и науки о зрении*" />
          </div>
        </div>
        <div className="grid grid--3">
          {RESEARCH.map((r, i) => (
            <R key={r.t} d={i * 70}>
              <div className="card" style={{ height: '100%' }}>
                <span className="card__k">{r.e}</span>
                <h3 className="card__t">{r.t}</h3>
                <p className="card__p">{r.p}</p>
              </div>
            </R>
          ))}
        </div>
        <div style={{ marginTop: 64 }}>
          <Eyebrow>Публикации 2026</Eyebrow>
          <div className="rows">
            {PUBLICATIONS.map((p) => (
              <R key={p.id}>
                <div className="row">
                  <div>
                    <strong style={{ fontWeight: 500 }}>{p.title}</strong>
                    <div className="coord" style={{ marginTop: 4 }}>
                      {p.journal} · {p.publisher} · DOI {p.doi}
                    </div>
                  </div>
                  <span className="muted" style={{ fontSize: 15 }}>
                    {p.summary}
                  </span>
                  <a className="btn btn--ghost btn--sm" href={p.href} target="_blank" rel="noreferrer">
                    Статья<span className="sr-only"> (откроется в новой вкладке)</span>
                  </a>
                </div>
              </R>
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter shot="founder-astana" label="Видение">
        <div className="col col--wide">
          <Eyebrow>Видение центра</Eyebrow>
          <SplitTitle className="statement" text="Каждый человек в Казахстане должен иметь возможность *проверить зрение вовремя*." />
          <R d={200}>
            <p className="lead" style={{ marginTop: 24 }}>
              Здесь перечислены только подтверждённые сведения. Источники:{' '}
              <a href={SOURCES.kz24} target="_blank" rel="noreferrer">
                24.kz
              </a>
              ,{' '}
              <a href={SOURCES.eyeinst} target="_blank" rel="noreferrer">
                профиль на eyeinst.kz
              </a>
              ,{' '}
              <a href={SOURCES.threads} target="_blank" rel="noreferrer">
                Threads
              </a>
              .
            </p>
            <div className="actions">
              <BtnLink to="/booking">Консультация в центре</BtnLink>
              <BtnLink to="/science" ghost>
                Наука и медиа
              </BtnLink>
            </div>
          </R>
        </div>
      </Chapter>
    </Page>
  );
}
