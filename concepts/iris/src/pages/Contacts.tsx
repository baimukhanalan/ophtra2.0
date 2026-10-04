import type { CSSProperties } from 'react';
import { C, clinic, site } from '../content';
import { usePage } from '../lib/usePage';
import { Arrow, Hero, SectionHead, Station } from '../components/ui';
import { RequestForm, contactFields } from '../components/forms';

const K = C.services.contactsCopy;
const twoGis = `https://2gis.kz/search/${encodeURIComponent(clinic.address)}?m=${clinic.geo.lng}%2C${clinic.geo.lat}%2F17`;
const gmaps = `https://www.google.com/maps/search/?api=1&query=${clinic.geo.lat},${clinic.geo.lng}`;

const CH_TEXT: Record<string, string> = { phone: K.phoneText, whatsapp: K.whatsappText, email: K.emailText, threads: C.people_founder.FOUNDER.threadsText };

export default function Contacts() {
  usePage('Контакты', 'gaze');
  return (
    <>
      <Hero station="gaze" layer="Взгляд — смотрим друг на друга" eyebrow={K.clinicTitleOne} title={clinic.address} lead={K.lead} size="d-l">
        <a href={`tel:${site.organization.phoneHref}`} className="btn">
          {site.organization.phone} <Arrow />
        </a>
        <a href={`https://wa.me/${site.organization.whatsapp}`} className="btn btn--ghost" target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </Hero>

      <section className="sect" aria-labelledby="urg-h">
        <Station id="approach" />
        <div className="wrap">
          <div className="urgent" role="note" aria-labelledby="urg-h" data-reveal>
            <h2 id="urg-h" className="h4">
              Срочно
            </h2>
            <p>{K.urgent}</p>
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="ch-h">
        <Station id="iris" />
        <div className="wrap">
          <SectionHead eyebrow={K.channelsLabel} title={K.channelsTitle} />
          <h2 id="ch-h" className="sr-only">
            {K.channelsTitle}
          </h2>
          <ul className="grid-4 channels">
            {site.channels.map((c: { id: string; label: string; href: string }, i: number) => (
              <li key={c.id} data-reveal style={{ '--d': i * 80 } as CSSProperties}>
                <a className="card channel" href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <span className="tag">{c.id === 'phone' ? 'Телефон' : c.id === 'email' ? 'E-mail' : c.id === 'whatsapp' ? 'WhatsApp' : 'Threads'}</span>
                  <span className="h4 channel__v">{c.label}</span>
                  <span className="body">{CH_TEXT[c.id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sect" aria-labelledby="where-h">
        <Station id="irisSide" />
        <div className="wrap split-2">
          <div>
            <SectionHead eyebrow={K.clinicsLabel} title={clinic.name} />
            <h2 id="where-h" className="sr-only">
              {K.route}
            </h2>
            <dl className="docd-facts">
              <div data-reveal>
                <dt>Адрес</dt>
                <dd>{clinic.address}</dd>
              </div>
              <div data-reveal>
                <dt>Часы работы</dt>
                <dd>{clinic.schedule}</dd>
              </div>
              <div data-reveal>
                <dt>{K.route}</dt>
                <dd>{clinic.transport}</dd>
              </div>
              <div data-reveal>
                <dt>Формат</dt>
                <dd>{clinic.isSurgical ? K.surgical : K.outpatient}</dd>
              </div>
            </dl>
            <div className="btn-row" style={{ marginTop: 28 }} data-reveal>
              <a className="btn btn--sm" href={twoGis} target="_blank" rel="noreferrer">
                {K.open2gis}
              </a>
              <a className="btn btn--sm btn--ghost" href={gmaps} target="_blank" rel="noreferrer">
                {K.openGoogle}
              </a>
            </div>
          </div>
          <div className="stack">
            <figure className="photo" data-reveal>
              <img src="/media/clinic-night.jpg" alt="Вход в офтальмологический центр доктора Кулмаганбетова вечером" loading="lazy" width={1440} height={1079} />
            </figure>
            <figure className="schema" role="img" aria-label={K.mapAria} data-reveal>
              <svg viewBox="0 0 400 220">
                <g className="schema__roads">
                  <path d="M0 150 L400 120" />
                  <path d="M120 0 L170 220" />
                  <path d="M0 60 L400 40" />
                  <path d="M300 0 L320 220" />
                </g>
                <g className="schema__pin" transform="translate(236 132)">
                  <circle r="26" />
                  <circle r="12" />
                  <circle r="4" />
                </g>
                <text x="236" y="178" textAnchor="middle">
                  Мәңгілік Ел, 72
                </text>
              </svg>
              <figcaption className="small">{K.mapText}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="sect" aria-labelledby="cf-h">
        <Station id="gaze" />
        <div className="wrap form-block">
          <div>
            <p className="eyebrow">Обратная связь</p>
            <h2 id="cf-h" className="h2">
              Напишите нам
            </h2>
            <p className="body">{K.formLead}</p>
          </div>
          <div className="panel">
            <RequestForm prefix="MSG" submit="Отправить сообщение" fields={[...contactFields({ email: true }), { name: 'msg', label: 'Сообщение', type: 'textarea', required: true }]} />
          </div>
        </div>
      </section>
    </>
  );
}
