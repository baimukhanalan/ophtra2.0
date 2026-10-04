import { ArrowRight, Bell, MessageCircle, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { Reveal, Stagger } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { PageHero } from '@/components/PageHero';
import { FeatureTile, SectionHead, SectionIndex } from '@/components/editorial';
import { BookingWizard } from '@/features/booking/BookingWizard';
import { ROUTES } from '@/app/navigation';
import { site } from '@/content';
import { bookingCopy as C } from '@/content/pages/services';
import { CLINIC_ID, SITE_ORIGIN } from '@/features/services/parts';
import { resolveTrackedPhone, track, trackCall } from '@/services/analytics';

/**
 * Figma «10 Онлайн-запись»: hero with the paper-calendar illustration, the
 * booking wizard (stepper pills, option cards with icon tiles, «Назад» /
 * «Далее»), then the three reassurance tiles. No closing CTA band — the page
 * is the booking itself.
 */
const AppointmentPage = () => {
  const { t, L } = useI18n();
  const phone = resolveTrackedPhone(site.organization.phone);

  return (
    <>
      <Seo
        title={t.booking.title}
        description={L(C.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.booking.title, url: ROUTES.appointment },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ReserveAction',
            name: t.booking.title,
            // Same origin as the canonical links (VITE_SITE_URL), never a
            // hard-coded host (perf/SEO audit SEO-3).
            agent: { '@id': CLINIC_ID },
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${SITE_ORIGIN}${ROUTES.appointment}`,
              actionPlatform: [
                'http://schema.org/DesktopWebPlatform',
                'http://schema.org/MobileWebPlatform',
              ],
            },
          },
        ]}
      />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={t.booking.title}
        text={t.booking.subtitle}
        crumbs={[{ label: t.booking.title }]}
        actions={
          <>
            <a
              className="oph-herolink"
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              onClick={() => trackCall(phone)}
            >
              {L(C.callInstead)} {phone}
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a
              className="oph-herolink oph-herolink--muted"
              href={`https://wa.me/${site.organization.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { from: 'appointment_hero' })}
            >
              WhatsApp
            </a>
          </>
        }
        aside={<CalendarArt label={L(C.calendarAlt)} />}
      />

      {/* ---------------------------------------------------- 01 · WIZARD */}
      <Section aria-labelledby="bk-title">
        <Container>
          <SectionIndex n={1} label={L(C.wizardLabel)} />
          <SectionHead id="bk-title" title={L(C.wizardTitle)} />
          <Reveal variant="up" className="svc-block">
            <BookingWizard />
          </Reveal>
        </Container>
      </Section>

      {/* ----------------------------------------------------- 02 · TILES */}
      <Section tone="tint" aria-labelledby="bk-after">
        <Container>
          <SectionIndex n={2} label={L(C.tilesLabel)} />
          <h2 id="bk-after" className="oph-visually-hidden">
            {L(C.tilesLabel)}
          </h2>
          <Stagger className="oph-ftiles" step={100}>
            <Reveal variant="up">
              <FeatureTile icon={<Bell size={20} />} title={t.booking.notificationsTitle} text={t.booking.notificationsText} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<MessageCircle size={20} />} title="WhatsApp" text={L(C.whatsappText)} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<ShieldCheck size={20} />} title={t.nav.privacy} text={L(C.privacyText)} />
            </Reveal>
          </Stagger>
        </Container>
      </Section>
    </>
  );
};

/**
 * Figma hero illustration: a paper calendar with a forest header, gold binder
 * rings and one date ticked in gold. Drawn inline with design tokens (colours
 * come from CSS classes in services.css); the check draws itself on load and
 * the sheet tilts with the hero's scroll progress.
 */
const CalendarArt = ({ label }: { label: string }) => {
  const cols = 7;
  const rows = 5;
  const picked = 17;
  return (
    <svg className="bk-cal" viewBox="0 0 360 340" role="img" aria-label={label}>
      <rect className="bk-cal__back" x="44" y="46" width="290" height="270" rx="14" />
      <g className="bk-cal__sheet">
        <rect className="bk-cal__paper" x="24" y="30" width="300" height="280" rx="14" />
        <path className="bk-cal__head" d="M24 44a14 14 0 0 1 14-14h272a14 14 0 0 1 14 14v46H24z" />
        <rect className="bk-cal__label" x="48" y="54" width="92" height="8" rx="4" />
        <rect className="bk-cal__label bk-cal__label--soft" x="48" y="70" width="56" height="6" rx="3" />
        {[96, 174, 252].map((x) => (
          <g key={x} className="bk-cal__ring">
            <rect x={x - 6} y="14" width="12" height="30" rx="6" />
            <circle cx={x} cy="36" r="3" />
          </g>
        ))}
        {Array.from({ length: rows * cols }, (_, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = 44 + col * 38;
          const y = 108 + row * 38;
          const isPicked = index === picked;
          const muted = index < 2 || index > 31;
          return (
            <rect
              key={index}
              className={`bk-cal__day ${isPicked ? 'bk-cal__day--picked' : ''} ${muted ? 'bk-cal__day--muted' : ''}`}
              x={x}
              y={y}
              width="28"
              height="26"
              rx="6"
            />
          );
        })}
        <circle className="bk-cal__halo" cx={44 + (picked % cols) * 38 + 14} cy={108 + Math.floor(picked / cols) * 38 + 13} r="22" />
      </g>
      <g className="bk-cal__badge">
        <circle cx="300" cy="286" r="34" />
        <path className="bk-cal__check" d="M284 287l11 11 21-23" />
      </g>
    </svg>
  );
};

export default AppointmentPage;
