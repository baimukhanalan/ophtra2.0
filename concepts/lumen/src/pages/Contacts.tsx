import servicesJson from '../content/services.json';
import { clinic, site } from '../lib/data';
import { PRESETS } from '../lib/presets';
import { useScenePreset } from '../lib/scene-store';
import { ContactForm } from '../ui/ContactForm';
import { FocusText } from '../ui/FocusText';
import { ElementTag, Hero, LensCta, SectionHead, usePageTitle } from '../ui/parts';
import './pages.css';
import './misc.css';

const CC = (servicesJson as unknown as { contactsCopy: Record<string, string> }).contactsCopy;

function SchemeMap() {
  return (
    <figure className="scheme">
      <svg viewBox="0 0 600 420" role="img" aria-label={CC.mapAria}>
        <rect width="600" height="420" className="scheme__bg" />
        {/* blocks */}
        {[
          [40, 40, 150, 90],
          [220, 30, 120, 110],
          [370, 40, 190, 80],
          [40, 170, 120, 120],
          [380, 160, 180, 130],
          [40, 330, 200, 60],
          [270, 320, 290, 70],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="10" className="scheme__block" />
        ))}
        <path d="M0 150 H600" className="scheme__road scheme__road--main" />
        <path d="M200 0 V420" className="scheme__road" />
        <path d="M360 0 V420" className="scheme__road" />
        <path d="M0 305 H600" className="scheme__road" />
        <text x="16" y="143" className="scheme__lbl">
          пр. Мәңгілік Ел
        </text>
        <rect x="190" y="180" width="160" height="110" rx="14" className="scheme__clinic" />
        <circle cx="270" cy="235" r="36" className="scheme__ring" />
        <circle cx="270" cy="235" r="9" className="scheme__dot" />
        <text x="270" y="300" textAnchor="middle" className="scheme__name">
          Центр · {clinic.address.split(',')[1]?.trim()}
        </text>
      </svg>
      <figcaption className="small muted">{CC.mapText}</figcaption>
    </figure>
  );
}

export default function Contacts() {
  useScenePreset(PRESETS.contacts);
  usePageTitle('Контакты');
  const g = clinic.geo;
  const channels = [
    { id: 'phone', label: site.organization.phone, href: `tel:${site.organization.phoneHref}`, text: CC.phoneText, title: 'Телефон' },
    { id: 'wa', label: 'WhatsApp', href: `https://wa.me/${site.organization.whatsapp}`, text: CC.whatsappText, title: 'WhatsApp' },
    { id: 'mail', label: site.organization.email, href: `mailto:${site.organization.email}`, text: CC.emailText, title: 'E-mail' },
  ];

  return (
    <div className="contacts">
      <Hero
        eyebrow={CC.clinicsLabel}
        title={CC.clinicTitleOne}
        accent={[2]}
        lead={CC.lead}
        tag="Линза и призма · Элемент 01 / 02"
        aside={
          <address className="glass contacts-card rv">
            <p className="anno">{clinic.name}</p>
            <p className="h3">{clinic.address}</p>
            <p className="body">{clinic.schedule}</p>
            <p className="small">
              {CC.surgical} · {CC.outpatient}
            </p>
          </address>
        }
      />

      <section className="sec sec--solid" aria-labelledby="ch-h">
        <div className="wrap">
          <SectionHead eyebrow={CC.channelsLabel} title={CC.channelsTitle} id="ch-h" />
          <ul className="channels mt-l" role="list">
            {channels.map((c, i) => (
              <li key={c.id} className="rv" style={{ ['--d' as string]: `${i * 0.07}s` }}>
                <a className="channel" href={c.href} target={c.id === 'wa' ? '_blank' : undefined} rel={c.id === 'wa' ? 'noreferrer' : undefined}>
                  <span className="anno">{c.title}</span>
                  <span className="channel__v">{c.label}</span>
                  <span className="small muted">{c.text}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="urgent mt-m rv" role="note">
            {CC.urgent}
          </p>
        </div>
      </section>

      <section className="stage contacts-map" data-stage data-el={1} aria-labelledby="map-h">
        <div className="wrap split">
          <div className="stack">
            <ElementTag n={2} of={2} label="призма" />
            <p className="eyebrow">{CC.mapLabel}</p>
            <FocusText as="h2" id="map-h" className="h2" text={CC.mapTitle} />
            <h3 className="anno">{CC.route}</h3>
            <p className="body">{clinic.transport}</p>
            <div className="row">
              <a className="btn" href={`https://2gis.kz/astana/geo/${g.lng},${g.lat}`} target="_blank" rel="noreferrer">
                {CC.open2gis}
              </a>
              <a className="btn btn--ghost" href={`https://www.google.com/maps/search/?api=1&query=${g.lat},${g.lng}`} target="_blank" rel="noreferrer">
                {CC.openGoogle}
              </a>
            </div>
          </div>
          <div className="glass rv" style={{ padding: 16 }}>
            <SchemeMap />
          </div>
        </div>
      </section>

      <section className="sec sec--sand" aria-labelledby="form-h">
        <div className="wrap form-grid">
          <div className="stack">
            <p className="eyebrow rv">Обратная связь</p>
            <FocusText as="h2" id="form-h" className="h2" text="Напишите нам" />
            <p className="body rv">{CC.formLead}</p>
          </div>
          <ContactForm submitLabel="Отправить вопрос" />
        </div>
      </section>

      <section className="sec sec--paper sec--tight">
        <div className="wrap contacts-photo">
          <figure className="photo rv">
            <img src="/media/clinic-entrance.jpg" alt="Вход в офтальмологический центр доктора Кулмаганбетова" width={1440} height={1079} loading="lazy" />
          </figure>
        </div>
      </section>

      <LensCta title="Запишитесь на консультацию офтальмолога" text="Подберём время, врача и формат приёма. Подтверждение придёт в WhatsApp." />
    </div>
  );
}
