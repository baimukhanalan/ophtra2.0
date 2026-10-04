import { Chapter } from '../components/Chapter';
import { Page } from '../components/Shell';
import { BtnLink, Eyebrow, R, SplitTitle } from '../components/ui';
import { clinic, site } from '../lib/data';

export default function Contacts() {
  const o = site.organization;
  const channels = [
    { k: 'Телефон', v: clinic.phone, href: `tel:${o.phoneHref}` },
    { k: 'WhatsApp', v: 'Написать в WhatsApp', href: `https://wa.me/${o.whatsapp}` },
    { k: 'Telegram', v: `@${o.telegram}`, href: `https://t.me/${o.telegram}` },
    { k: 'E-mail', v: clinic.email, href: `mailto:${clinic.email}` },
    { k: 'Общий e-mail', v: o.email, href: `mailto:${o.email}` },
  ];
  const [days, hours] = [clinic.schedule.split(', ')[0], clinic.schedule.split(', ')[1]];
  return (
    <Page title="Контакты">
      <Chapter shot="contacts-orbit" size="hero" label="Координаты">
        <div className="col col--wide">
          <Eyebrow>Контакты · {clinic.city}</Eyebrow>
          <SplitTitle as="h1" className="display" text="51.1284° N *71.4306° E*" />
          <R d={250}>
            <p className="lead" style={{ marginTop: 26 }}>
              {clinic.address}. Точка, в которую сходятся все маршруты этого сайта. Листайте — камера снизится прямо к входу.
            </p>
          </R>
        </div>
      </Chapter>

      <Chapter shot="contacts-ground" label="Как добраться">
        <div className="col col--right">
          <Eyebrow>Как добраться</Eyebrow>
          <SplitTitle text="Вход без ступеней, *парковка под зданием*" />
          <R d={120}>
            <p className="lead">{clinic.transport}</p>
            <dl className="rows" style={{ margin: 0 }}>
              <div className="row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <dt className="coord">{days?.split(':')[0]}</dt>
                <dd style={{ margin: 0 }} className="mono">
                  {days?.split(': ')[1]}
                </dd>
              </div>
              {hours && (
                <div className="row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <dt className="coord">{hours.split(':')[0]}</dt>
                  <dd style={{ margin: 0 }} className="mono">
                    {hours.split(': ')[1]}
                  </dd>
                </div>
              )}
            </dl>
          </R>
        </div>
      </Chapter>

      <Chapter shot="contacts-front" pin={false} size="auto" label="Связь">
        <div className="grid grid--2" style={{ alignItems: 'center', gap: 'clamp(24px,5vw,80px)' }}>
          <div>
            <Eyebrow>Связь</Eyebrow>
            <SplitTitle text="Напишите или позвоните — *ответит координатор*" />
            <R>
              <ul className="rows" style={{ listStyle: 'none', padding: 0, margin: '12px 0 28px' }}>
                {channels.map((c) => (
                  <li key={c.k} className="row" style={{ gridTemplateColumns: '130px 1fr' }}>
                    <span className="coord">{c.k}</span>
                    <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={{ fontSize: 18 }}>
                      {c.v}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="actions">
                <BtnLink to="/booking">Записаться онлайн</BtnLink>
                <BtnLink to="/faq" ghost>
                  Вопросы и ответы
                </BtnLink>
              </div>
            </R>
          </div>
          <R d={120}>
            <figure className="photo" style={{ margin: 0, aspectRatio: '4 / 3' }}>
              <img src="/media/clinic-night.jpg" alt="Вход в офтальмологический центр доктора Кулмаганбетова вечером, пр. Мәңгілік Ел, 72" loading="lazy" />
              <figcaption>{clinic.address}</figcaption>
            </figure>
          </R>
        </div>
      </Chapter>
    </Page>
  );
}
