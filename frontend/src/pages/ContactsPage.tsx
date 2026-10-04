import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Alert, Container, Section } from '@/ui';
import { ClipReveal, Reveal, ScrollFx, Stagger } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { LeadForm } from '@/components/LeadForm';
import { SectionHead, SectionIndex } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { clinics, site } from '@/content';
import { contactsCopy as C } from '@/content/pages/services';
import { CLINIC_ID, ClinicPhoto, DepartmentArt, MEDIA } from '@/features/services/parts';
import { resolveTrackedPhone, track, trackCall } from '@/services/analytics';
import type { Clinic } from '@/types';

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** 2GIS: search the street address, centred on the clinic's coordinates. */
const twoGisHref = (clinic: Clinic) =>
  `https://2gis.kz/search/${encodeURIComponent(clinic.address.ru)}?m=${clinic.geo.lng}%2C${clinic.geo.lat}%2F17`;

const googleHref = (clinic: Clinic) =>
  `https://www.google.com/maps/search/?api=1&query=${clinic.geo.lat},${clinic.geo.lng}`;

const CLINIC_MEDIA: Record<string, string> = { astana: MEDIA.facade, dostyk: MEDIA.entrance };

/**
 * Figma «11 Контакты»: hero with phone and WhatsApp as text actions, the two
 * clinic cards (address, hours, phone, e-mail, «Как добраться» with transport
 * notes and map links), a stylised map drawn in SVG — no third-party map
 * scripts — the contact channels and the feedback form (CRM lead, source
 * "contacts").
 */
const ContactsPage = () => {
  const { t, L } = useI18n();
  const phone = resolveTrackedPhone(site.organization.phone);

  return (
    <>
      <Seo
        title={t.contacts.title}
        description={L(C.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.contacts.title, url: ROUTES.contacts },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'MedicalClinic',
            // Same entity as the clinic declared in index.html, not a second
            // one (perf/SEO audit SEO-8).
            '@id': CLINIC_ID,
            name: t.brand.name,
            telephone: site.organization.phone,
            email: site.organization.email,
            location: clinics.map((clinic) => ({
              '@type': 'Place',
              name: L(clinic.name),
              address: {
                '@type': 'PostalAddress',
                streetAddress: L(clinic.address),
                addressLocality: L(clinic.city),
                addressCountry: 'KZ',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: clinic.geo.lat,
                longitude: clinic.geo.lng,
              },
            })),
          },
        ]}
      />

      <PageHero
        eyebrow={t.contacts.callCenter}
        title={t.contacts.title}
        text={L(C.lead)}
        crumbs={[{ label: t.contacts.title }]}
        aside={<DepartmentArt id="pin" tone="dark" className="svc-art--hero" />}
        actions={
          <>
            <a className="oph-herolink" href={telHref(phone)} onClick={() => trackCall(phone)}>
              {phone}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              className="oph-herolink oph-herolink--muted"
              href={`https://wa.me/${site.organization.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { from: 'contacts_hero' })}
            >
              WhatsApp
            </a>
          </>
        }
      />

      {/* --------------------------------------------------- 01 · CLINICS */}
      <Section aria-labelledby="contacts-clinics">
        <Container>
          <SectionIndex n={1} label={L(C.clinicsLabel)} />
          <SectionHead id="contacts-clinics" title={clinics.length === 1 ? L(C.clinicTitleOne) : t.contacts.clinics} />
          {/* One clinic → one horizontal card (photo beside the details), not
              a half-empty two-column grid. */}
          <Stagger className={`svc-clinics svc-block ${clinics.length === 1 ? 'svc-clinics--single' : ''}`} step={120}>
            {clinics.map((clinic) => (
              <Reveal key={clinic.id} variant="up">
                <article className="svc-clinic" aria-labelledby={`clinic-${clinic.id}`}>
                  <ClipReveal className="svc-clinic__media">
                    <ClinicPhoto src={CLINIC_MEDIA[clinic.id] ?? MEDIA.day} sizes="(max-width: 900px) 100vw, 45vw" />
                  </ClipReveal>
                  <div className="svc-clinic__body">
                    <span className="oph-tag">{L(clinic.isSurgical ? C.surgical : C.outpatient)}</span>
                    <h3 id={`clinic-${clinic.id}`} className="svc-clinic__title">
                      {L(clinic.name)}
                    </h3>
                    <ul className="svc-clinic__rows">
                      <li>
                        <MapPin size={16} aria-hidden="true" />
                        <span>
                          <span className="oph-visually-hidden">{t.common.address}: </span>
                          {L(clinic.address)}
                        </span>
                      </li>
                      <li>
                        <Clock size={16} aria-hidden="true" />
                        <span>
                          <span className="oph-visually-hidden">{t.common.schedule}: </span>
                          {L(clinic.schedule)}
                        </span>
                      </li>
                      <li>
                        <Phone size={16} aria-hidden="true" />
                        <a href={telHref(clinic.phone)} onClick={() => trackCall(clinic.phone)}>
                          {clinic.phone}
                        </a>
                      </li>
                      <li>
                        <Mail size={16} aria-hidden="true" />
                        <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
                      </li>
                    </ul>
                    <div className="svc-clinic__route">
                      <p className="oph-eyebrow">{t.contacts.howToGet}</p>
                      <p>{L(clinic.transport)}</p>
                      <div className="svc-clinic__links">
                        <MapLink href={twoGisHref(clinic)} label={L(C.open2gis)} />
                        <MapLink href={googleHref(clinic)} label={L(C.openGoogle)} />
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ------------------------------------------------------- 02 · MAP */}
      <Section tone="tint" aria-labelledby="contacts-map">
        <Container>
          <SectionIndex n={2} label={L(C.mapLabel)} />
          <SectionHead id="contacts-map" title={L(C.mapTitle)} text={L(C.mapText)} />
          <ClinicMap />
        </Container>
      </Section>

      {/* -------------------------------------------------- 03 · CHANNELS */}
      <Section aria-labelledby="contacts-channels">
        <Container>
          <SectionIndex n={3} label={L(C.channelsLabel)} />
          <SectionHead id="contacts-channels" title={L(C.channelsTitle)} />
          <Stagger className="svc-channels svc-block" step={100}>
            <Reveal variant="up">
              <a className="svc-channel" href={telHref(phone)} onClick={() => trackCall(phone)}>
                <span className="oph-ftile__icon" aria-hidden="true">
                  <Phone size={20} />
                </span>
                <span className="svc-channel__label">{t.common.phone}</span>
                <span className="svc-channel__value">{phone}</span>
                <span className="svc-channel__text">{L(C.phoneText)}</span>
              </a>
            </Reveal>
            <Reveal variant="up">
              <a
                className="svc-channel"
                href={`https://wa.me/${site.organization.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { from: 'contacts_channels' })}
              >
                <span className="oph-ftile__icon" aria-hidden="true">
                  <MessageCircle size={20} />
                </span>
                <span className="svc-channel__label">WhatsApp</span>
                <span className="svc-channel__value">+{site.organization.whatsapp}</span>
                <span className="svc-channel__text">{L(C.whatsappText)}</span>
              </a>
            </Reveal>
            <Reveal variant="up">
              <a className="svc-channel" href={`mailto:${site.organization.email}`}>
                <span className="oph-ftile__icon" aria-hidden="true">
                  <Mail size={20} />
                </span>
                <span className="svc-channel__label">{t.common.email}</span>
                <span className="svc-channel__value">{site.organization.email}</span>
                <span className="svc-channel__text">{L(C.emailText)}</span>
              </a>
            </Reveal>
          </Stagger>
        </Container>
      </Section>

      {/* ------------------------------------------------------ 04 · FORM */}
      <Section tone="tint" aria-labelledby="contacts-form">
        <Container>
          <SectionIndex n={4} label={t.contacts.writeUs} />
          <div className="oph-duo svc-formduo">
            <div className="svc-formduo__intro">
              <SectionHead id="contacts-form" title={t.contacts.formTitle} text={L(C.formLead)} />
              <Reveal variant="up" delay={200}>
                <Alert tone="warning">{L(C.urgent)}</Alert>
              </Reveal>
            </div>
            <Reveal variant="up" className="oph-panel">
              <LeadForm source="contacts" />
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

const MapLink = ({ href, label }: { href: string; label: string }) => (
  <a className="svc-maplink" href={href} target="_blank" rel="noopener noreferrer">
    <Navigation size={14} aria-hidden="true" />
    {label}
    <ArrowUpRight size={14} aria-hidden="true" />
  </a>
);

/* ================================================================= MAP */

/**
 * Stylised city map (no external scripts, no tracking): street grid, a river
 * and parks drawn in SVG with token colours, a pin that drops onto the chosen
 * clinic, and deep links to 2GIS and Google Maps for real directions. The map
 * layer drifts with scroll (--p from ScrollFx).
 */
const ClinicMap = () => {
  const { L } = useI18n();
  const [activeId, setActiveId] = useState(clinics[0]?.id ?? '');
  const clinic = clinics.find((entry) => entry.id === activeId) ?? clinics[0];
  if (!clinic) return null;
  const variant = clinics.indexOf(clinic) % 2;

  return (
    <div className="svc-map svc-block">
      <div className="svc-map__side">
        {clinics.length > 1 ? (
          <div className="svc-map__picker" role="group" aria-label={L(C.mapPicker)}>
            {clinics.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="svc-map__pick"
                aria-pressed={entry.id === clinic.id}
                onClick={() => setActiveId(entry.id)}
              >
                <span className="svc-map__pick-city">{L(entry.city)}</span>
                <span className="svc-map__pick-addr">{L(entry.address)}</span>
              </button>
            ))}
          </div>
        ) : (
          // Nothing to choose between: show the address, no toggle.
          <p className="svc-map__pick svc-map__pick--static">
            <span className="svc-map__pick-city">{L(clinic.city)}</span>
            <span className="svc-map__pick-addr">{L(clinic.address)}</span>
          </p>
        )}
        <p className="svc-map__coords">
          {clinic.geo.lat.toFixed(4)}° N, {clinic.geo.lng.toFixed(4)}° E
        </p>
        <div className="svc-clinic__links">
          <MapLink href={twoGisHref(clinic)} label={L(C.open2gis)} />
          <MapLink href={googleHref(clinic)} label={L(C.openGoogle)} />
        </div>
      </div>

      <ScrollFx className="svc-map__canvas">
        <svg viewBox="0 0 640 420" role="img" aria-label={`${L(C.mapAria)}: ${L(clinic.address)}`}>
          <rect className="svc-map__ground" width="640" height="420" />
          <g className="svc-map__layer">
            {variant === 0 ? (
              <>
                <path className="svc-map__water" d="M-20 300 C 120 250, 220 360, 360 310 S 560 230, 680 280 L 680 350 C 560 300, 470 390, 360 372 S 120 320, -20 370 Z" />
                <rect className="svc-map__park" x="380" y="60" width="150" height="100" rx="10" />
                <rect className="svc-map__park" x="70" y="80" width="90" height="70" rx="10" />
              </>
            ) : (
              <>
                <path className="svc-map__water" d="M470 -20 C 440 90, 520 160, 480 250 S 430 380, 470 460 L 520 460 C 480 380, 540 300, 530 240 S 490 90, 520 -20 Z" />
                <rect className="svc-map__park" x="90" y="250" width="160" height="110" rx="10" />
                <circle className="svc-map__park" cx="560" cy="90" r="46" />
              </>
            )}
            {[70, 150, 230, 390, 470, 550].map((x) => (
              <line key={`v${x}`} className="svc-map__street" x1={x} y1="-20" x2={x + (variant ? 30 : -24)} y2="440" />
            ))}
            {[40, 120, 200, 280, 360].map((y) => (
              <line key={`h${y}`} className="svc-map__street" x1="-20" y1={y} x2="660" y2={y + (variant ? -18 : 14)} />
            ))}
            <line className="svc-map__avenue" x1="-20" y1={variant ? 330 : 214} x2="660" y2={variant ? 150 : 196} />
            <line className="svc-map__avenue" x1={variant ? 300 : 316} y1="-20" x2={variant ? 340 : 300} y2="440" />
          </g>
          <g key={clinic.id} className="svc-map__pin" transform="translate(316 205)">
            <circle className="svc-map__pulse" r="34" />
            <circle className="svc-map__pulse svc-map__pulse--2" r="34" />
            <g className="svc-map__marker">
              <path d="M0 0 C -18 -22, -22 -34, -22 -44 A 22 22 0 1 1 22 -44 C 22 -34, 18 -22, 0 0 Z" />
              <circle cx="0" cy="-44" r="8" />
            </g>
          </g>
        </svg>
        <p className="svc-map__label" aria-hidden="true">
          <MapPin size={14} />
          {L(clinic.name)}
        </p>
      </ScrollFx>
    </div>
  );
};

export default ContactsPage;
