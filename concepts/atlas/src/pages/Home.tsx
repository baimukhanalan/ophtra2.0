import { Link } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { Arrow, BtnLink, Counter, Eyebrow, R, SplitTitle } from '../components/ui';
import { departments, knowledge, METRIC_LABELS, site } from '../lib/data';
import { DEPT_FLOOR } from '../world/floors';

const PORTALS = [
  { to: '/international', k: 'Прилёт', t: 'Международные пациенты', p: 'Заявка, медицинское рассмотрение, план лечения, виза, проживание и перевод — координатор ведёт вас на каждом шаге.' },
  { to: '/second-opinion', k: 'Документы', t: 'Второе мнение', p: 'Загрузите снимки и заключения в PDF, JPG или PNG — специалисты центра подготовят письменное заключение.' },
  { to: '/consultation', k: 'Видеосвязь', t: 'Онлайн-консультация', p: 'Разговор с врачом в Zoom, Google Meet или Microsoft Teams и индивидуальный план лечения до поездки.' },
];

export default function Home() {
  const latest = knowledge.slice(0, 3);
  return (
    <Page title="От Астаны к миру">
      <Chapter shot="home-hero" size="hero" label="Орбита" align="center">
        <div className="col col--wide">
          <Eyebrow>Новая эра заботы о зрении — в Казахстане</Eyebrow>
          <SplitTitle as="h1" className="display" text="Зрение, которому *доверяют*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 28 }}>
              Офтальмологическая наука мирового уровня. Передовая забота о зрении. Более здоровое будущее — диагностика, микрохирургия и наблюдение в одном центре.
            </p>
          </R>
          <R d={400} className="actions">
            <BtnLink to="/booking">Записаться на консультацию</BtnLink>
            <BtnLink to="/international" ghost>
              Международные пациенты
            </BtnLink>
            <BtnLink to="/second-opinion" ghost>
              Второе мнение
            </BtnLink>
          </R>
          <R d={600}>
            <p className="coord" style={{ marginTop: 40 }}>
              ↓ Листайте — камера начинает маршрут · Астана → Кардифф → Гонконг → Канада → Астана
            </p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="home-astana" label="Астана">
        <div className="col">
          <Eyebrow>51.1284° N · 71.4306° E</Eyebrow>
          <SplitTitle text="Миссия: сохранить зрение *будущим поколениям*" />
          <R d={150}>
            <p className="lead">Предотвращение слепоты и сохранение зрения для будущих поколений. Ясная информация помогает человеку принимать взвешенные решения о зрении — мы соединяем понятное объяснение, внимательное обследование и открытый разговор с врачом.</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="home-cardiff" label="Кардифф">
        <div className="col col--right">
          <Eyebrow>Кардифф · Великобритания · 51.48° N 3.18° W</Eyebrow>
          <SplitTitle text="PhD в науках *о зрении*" />
          <R d={150}>
            <p className="lead">Доктор Мухит Кулмаганбетов — MD в офтальмологии, PhD в науках о зрении (Cardiff University), AFHEA — признанная квалификация в университетском преподавании.</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="home-hk" label="Гонконг">
        <div className="col">
          <Eyebrow>Гонконг · 22.32° N 114.17° E</Eyebrow>
          <SplitTitle text="Свет *в суперпозиции*" />
          <R d={150}>
            <p className="lead">Устройство на основе квантовой оптики для раннего выявления возрастной макулярной дегенерации: поляризованный и неполяризованный свет в суперпозиции, система фильтров и линз.</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="home-canada" label="Канада">
        <div className="col col--right">
          <Eyebrow>Канада · испытания</Eyebrow>
          <SplitTitle text="200 пациентов. *Патент.*" />
          <R d={150}>
            <p className="lead">Устройство испытали в клиниках Гонконга и Канады, обследовано 200 пациентов; на разработку получен патент. По данным 24.kz, работа вызвала интерес у специалистов из США, Европы, Китая, Канады и Японии.</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="home-return" label="Возвращение" size="lg">
        <div className="col col--wide">
          <Eyebrow>Глобальный опыт</Eyebrow>
          <SplitTitle text="Кардифф, Гонконг, Канада — и обратно *в Казахстан*" />
          <R d={150}>
            <p className="lead">Всё это возвращается туда, где находится пациент, — в центр в Астане.</p>
          </R>
          <R d={300}>
            <div className="metrics">
              {site.metrics.map((m) => (
                <Counter key={m.id} value={m.value} suffix={m.suffix} label={METRIC_LABELS[m.id]} />
              ))}
            </div>
          </R>
        </div>
      </Chapter>

      <Chapter shot="home-descent" size="md" label="Снижение" align="center">
        <div className="col col--center">
          <Eyebrow>ALT ↓ · сквозь облака</Eyebrow>
          <SplitTitle className="statement" text="С орбиты — *к пациенту*" />
        </div>
      </Chapter>

      <Chapter shot="ground-city" label="Город">
        <div className="col">
          <Eyebrow>Астана · центры передового опыта</Eyebrow>
          <SplitTitle text="От профилактики до сложного решения — *единая карта заботы*" />
          <R d={150}>
            <p className="lead">Диагностика, лечение заболеваний глаз, лазерная коррекция, хирургия катаракты, детский приём и оптический салон — в одном здании.</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="ground-front" size="md" label="Клиника">
        <div className="col">
          <Eyebrow>пр. Мәңгілік Ел, 72</Eyebrow>
          <SplitTitle text="Шесть этажей — *шесть центров*" />
          <R d={150}>
            <p className="lead">Камера входит в здание. Каждый этаж этой схемы — отдельное направление со своими врачами, оборудованием и маршрутом пациента.</p>
          </R>
        </div>
      </Chapter>

      {departments.map((d) => {
        const f = DEPT_FLOOR[d.id] ?? 0;
        return (
          <Chapter key={d.id} shot={`floor-${f}`} size="sm" label={`Этаж 0${f + 1}`}>
            <div className="col col--right">
              <p className="coord" data-reveal>
                Этаж 0{f + 1} / 06
              </p>
              <SplitTitle className="h2" text={d.name} />
              <R d={120}>
                <p className="lead">{d.description}</p>
              </R>
              <R d={220}>
                <Link className="btn btn--ghost btn--sm" to={`/services#${d.slug}`}>
                  Открыть направление
                </Link>
              </R>
            </div>
          </Chapter>
        );
      })}

      <Chapter shot="clinic-section" pin={false} size="auto" label="Путь пациента">
        <div className="section__head">
          <div>
            <Eyebrow>Путь пациента</Eyebrow>
            <SplitTitle text="Пять шагов — *один маршрут*" />
          </div>
          <R>
            <p className="lead">Операции выполняются амбулаторно. Результаты и назначения — в личном кабинете.</p>
          </R>
        </div>
        <ol className="grid grid--3" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {site.journey.map((j, i) => (
            <R as="li" key={j.id} d={i * 80}>
              <div className="card" style={{ height: '100%' }}>
                <span className="card__k">Шаг 0{i + 1}</span>
                <h3 className="card__t">{j.title}</h3>
                <p className="card__p">{j.text}</p>
              </div>
            </R>
          ))}
        </ol>
      </Chapter>

      <Chapter shot="home-ascent" label="Порталы">
        <div className="col col--wide">
          <Eyebrow>ALT ↑ · для пациентов из любой страны</Eyebrow>
          <SplitTitle text="Контакт начинается раньше, чем *вопрос географии*" />
          <div className="grid grid--3" style={{ marginTop: 28 }}>
            {PORTALS.map((p, i) => (
              <R key={p.to} d={i * 90}>
                <Link to={p.to} className="card" style={{ height: '100%' }}>
                  <span className="card__k">{p.k}</span>
                  <h3 className="card__t">{p.t}</h3>
                  <p className="card__p">{p.p}</p>
                  <span className="card__foot">
                    Открыть портал <Arrow />
                  </span>
                </Link>
              </R>
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter shot="sky-all" label="Знания">
        <div className="col">
          <Eyebrow>База знаний · созвездия тем</Eyebrow>
          <SplitTitle text="Здоровье глаз *простым языком*" />
          <R d={120}>
            <p className="lead">Материалы с экспертным авторством и научными источниками — чтобы прийти на приём подготовленным.</p>
          </R>
          <R d={200}>
            <ul className="ticks" style={{ marginBottom: 28 }}>
              {latest.map((a) => (
                <li key={a.slug}>
                  <Link to={`/knowledge/${a.slug}`}>{a.title}</Link>
                </li>
              ))}
            </ul>
            <BtnLink to="/knowledge" ghost>
              Вся база знаний
            </BtnLink>
          </R>
        </div>
      </Chapter>

      <Chapter shot="home-final" label="Основатель">
        <div className="col col--wide">
          <Eyebrow>Лицо и ответственность</Eyebrow>
          <SplitTitle className="statement" text="«Сохранить зрение проще, чем вернуть. Поэтому всё начинается *с ранней и точной диагностики*»." />
          <R d={200}>
            <p className="lead" style={{ marginTop: 24 }}>
              Доктор Кулмаганбетов — MD в офтальмологии, PhD в науках о зрении (Кардиффский университет), AFHEA.
            </p>
            <div className="actions">
              <BtnLink to="/founder">Маршрут основателя</BtnLink>
              <BtnLink to="/experts" ghost>
                Сеть экспертов
              </BtnLink>
            </div>
          </R>
        </div>
      </Chapter>
    </Page>
  );
}
