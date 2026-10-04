import { Link } from 'react-router-dom';
import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { Arrow, BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { clinic, site } from '../lib/data';

const EXCELLENCE = [
  { t: 'Центр профилактики нарушений зрения', p: 'Скрининг и регулярные осмотры, чтобы глаукому, болезни сетчатки и миопию находили до потери зрения.' },
  { t: 'Передовая офтальмологическая хирургия', p: 'Катаракта, лазерная коррекция и микрохирургия на современных платформах — с понятным планом до и после операции.' },
  { t: 'Центр заболеваний сетчатки и макулы', p: 'Диагностика и лечение диабетической ретинопатии, макулярной дегенерации и сосудистых болезней глаза.' },
  { t: 'Центр детской офтальмологии', p: 'Контроль близорукости, косоглазие и амблиопия — с врачами, которые умеют работать с детьми.' },
  { t: 'Лаборатория науки и инноваций', p: 'Исследования в области наук о зрении и ИИ и открытые публикации.' },
];
const TEAM = [
  { to: '/founder', t: 'Основатель', p: 'Доктор Мухит Кулмаганбетов — MD, PhD (Cardiff University), AFHEA.' },
  { to: '/doctors', t: 'Врачи', p: 'Поиск по отделению, запись к конкретному врачу.' },
  { to: '/experts', t: 'Международная сеть', p: 'Как устроены второе мнение и телеконсилиум с зарубежными субспециалистами.' },
  { to: '/science', t: 'Наука', p: 'Исследования, публикации и открытая база знаний.' },
];

export default function About() {
  return (
    <Page title="О центре">
      <Chapter shot="about-hero" size="hero" label="Центр">
        <div className="col col--wide">
          <Eyebrow>О центре · Астана</Eyebrow>
          <SplitTitle as="h1" className="display" text="Клиника, выросшая *из науки*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              Новый офтальмологический центр в Астане — для клинической работы и инновационных проектов. Он вырастает из исследований доктора Мухита Кулмаганбетова в области квантовой оптики и цифровой диагностики.
            </p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="about-coords" label="Координаты">
        <div className="col col--right">
          <Eyebrow>{clinic.geo.lat.toFixed(4)}° N · {clinic.geo.lng.toFixed(4)}° E</Eyebrow>
          <SplitTitle text="Точка на карте, *к которой ведут все дуги*" />
          <R d={150}>
            <p className="lead">{clinic.address}. {clinic.transport}</p>
            <p className="coord">{clinic.schedule}</p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="clinic-section" pin={false} size="auto" label="Направления">
        <div className="section__head">
          <div>
            <Eyebrow>Центры передового опыта</Eyebrow>
            <SplitTitle text="Пять направлений, вокруг которых *строится центр*" />
          </div>
          <R>
            <p className="lead">Короткий указатель. Подробно о каждом направлении — на отдельных страницах.</p>
          </R>
        </div>
        <div className="grid grid--3">
          {EXCELLENCE.map((e, i) => (
            <R key={e.t} d={i * 70}>
              <div className="card" style={{ height: '100%' }}>
                <span className="card__k">0{i + 1}</span>
                <h3 className="card__t">{e.t}</h3>
                <p className="card__p">{e.p}</p>
              </div>
            </R>
          ))}
          <R d={400}>
            <Link to="/services" className="card" style={{ height: '100%', justifyContent: 'center' }}>
              <h3 className="card__t">Все направления и услуги</h3>
              <span className="card__foot">
                На этажи <Arrow />
              </span>
            </Link>
          </R>
        </div>
      </Chapter>

      <Chapter shot="floor-0" pin={false} size="auto" label="Оборудование">
        <div className="col col--right" style={{ maxWidth: 680 }}>
          <Eyebrow>Оборудование · этаж 01</Eyebrow>
          <SplitTitle text="Технологии, на которые *рассчитан центр*" />
          <div className="rows" style={{ marginTop: 20 }}>
            {site.equipment.map((e, i) => (
              <R key={e.id} d={i * 60}>
                <div className="row" style={{ gridTemplateColumns: '1fr 1.6fr' }}>
                  <strong style={{ fontWeight: 500 }}>{e.name}</strong>
                  <span className="muted">{e.text}</span>
                </div>
              </R>
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter shot="about-city" label="Ценности">
        <div className="col col--wide">
          <Eyebrow>Ценности</Eyebrow>
          <SplitTitle text="На чём держится *работа центра*" />
          <div className="grid grid--2" style={{ marginTop: 16 }}>
            {site.values.map((v, i) => (
              <R key={v.id} d={i * 80}>
                <h3 className="h3" style={{ fontSize: 22 }}>
                  {v.title}
                </h3>
                <p className="body">{v.text}</p>
              </R>
            ))}
          </div>
        </div>
      </Chapter>

      <Chapter shot="ground-front" pin={false} size="auto" label="Здание">
        <div className="section__head">
          <div>
            <Eyebrow>Здание</Eyebrow>
            <SplitTitle text="Днём, вечером *и ночью*" />
          </div>
        </div>
        <div className="grid grid--3">
          {[
            ['clinic-day', 'Фасад днём'],
            ['clinic-evening', 'Вечер'],
            ['clinic-entrance', 'Вход без ступеней'],
          ].map(([f, c], i) => (
            <R key={f} d={i * 90}>
              <figure className="photo" style={{ margin: 0, aspectRatio: '4 / 5' }}>
                <img src={`/media/${f}.sm.jpg`} alt={`Офтальмологический центр доктора Кулмаганбетова — ${c.toLowerCase()}`} loading="lazy" width="600" height="750" />
                <figcaption>{c}</figcaption>
              </figure>
            </R>
          ))}
        </div>
      </Chapter>

      <Chapter shot="home-return" label="Люди">
        <div className="col col--wide">
          <Eyebrow>Люди центра</Eyebrow>
          <SplitTitle text="С кем *вы встретитесь*" />
          <div className="grid grid--2" style={{ marginTop: 18 }}>
            {TEAM.map((t, i) => (
              <R key={t.to} d={i * 70}>
                <Link className="card" to={t.to} style={{ height: '100%' }}>
                  <h3 className="card__t">{t.t}</h3>
                  <p className="card__p">{t.p}</p>
                </Link>
              </R>
            ))}
          </div>
          <R d={300}>
            <div className="actions" style={{ marginTop: 28 }}>
              <BtnLink to="/booking">Записаться</BtnLink>
            </div>
          </R>
        </div>
      </Chapter>
    </Page>
  );
}
