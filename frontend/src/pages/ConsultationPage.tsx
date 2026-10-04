import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowRight,
  Armchair,
  CheckCircle2,
  Clock3,
  FileText,
  Globe2,
  Link2,
  ListChecks,
  MessageCircle,
  Mic,
  Stethoscope,
  UserRound,
  Video,
  Wifi,
} from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { Reveal, StackCards, Stagger, TextFill, useProgressVars } from '@/motion';
import { Seo, breadcrumbSchema, faqSchema } from '@/seo/Seo';
import { PageHero, HeroLink } from '@/components/PageHero';
import { SectionHead, SectionIndex, StepFlow } from '@/components/editorial';
import { LeadForm, type LeadExtraField } from '@/components/LeadForm';
import { CtaBand } from '@/components/CtaBand';
import { ROUTES } from '@/app/navigation';
import { byId, services } from '@/content';
import { ptFieldLabels, ptShared } from '@/content/pages/patients';
import { consult } from '@/content/pages/patients-consultation';
import { PortalFaq, PortalLinks, countryField, faqForSchema, languageField } from './patients/PortalParts';

const NEED_ICONS = [Wifi, FileText, ListChecks, Armchair];
const NEXT_ICONS = [CheckCircle2, MessageCircle, Link2];

/** The visitor's own IANA zone, offered as an example in the time-zone field. */
const localZone = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Almaty';
  } catch {
    return 'Asia/Almaty';
  }
})();

/** Today in the visitor's calendar as yyyy-mm-dd — the earliest bookable date. */
const todayIso = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

/**
 * Hero illustration: a video-call window (doctor, patient, a shared scan).
 * Typographic rather than another clinic photo.
 */
const CallWindow = ({ doctor, you, shared }: { doctor: string; you: string; shared: string }) => (
  <div className="oph-pt-call" aria-hidden="true">
    <div className="oph-pt-call__bar">
      <span />
      <span />
      <span />
    </div>
    <div className="oph-pt-call__stage">
      <div className="oph-pt-call__main">
        <Stethoscope size={34} />
        <span>{doctor}</span>
      </div>
      <div className="oph-pt-call__self">
        <UserRound size={20} />
        <span>{you}</span>
      </div>
    </div>
    <div className="oph-pt-call__shared">
      <FileText size={15} />
      <span>{shared}</span>
    </div>
    <div className="oph-pt-call__controls">
      <span>
        <Mic size={15} />
      </span>
      <span>
        <Video size={15} />
      </span>
    </div>
  </div>
);

const ConsultationPage = () => {
  const { t, L, formatPrice } = useI18n();
  const platformsRef = useProgressVars<HTMLDivElement>();
  const consultation = byId(services, 'svc-consult');

  const extraFields: LeadExtraField[] = [
    {
      name: 'platform',
      label: ptFieldLabels.platform,
      type: 'select',
      required: true,
      half: true,
      options: consult.platforms.map((p) => ({ value: p.id, label: { ru: p.name, kk: p.name, en: p.name } })),
    },
    { name: 'date', label: ptFieldLabels.date, type: 'date', required: true, half: true, min: todayIso() },
    countryField(),
    {
      name: 'timezone',
      label: ptFieldLabels.timezone,
      half: true,
      placeholder: {
        ru: `${consult.tzExample.ru} ${localZone}`,
        kk: `${consult.tzExample.kk} ${localZone}`,
        en: `${consult.tzExample.en} ${localZone}`,
      },
    },
    languageField(),
  ];

  return (
    <>
      <Seo
        title={L(consult.seoTitle)}
        description={L(consult.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.consultation, url: ROUTES.consultation },
          ]),
          faqSchema(faqForSchema(consult.faq, L)),
        ]}
      />

      <PageHero
        eyebrow={L(consult.eyebrow)}
        title={L(consult.title)}
        text={L(consult.lead)}
        crumbs={[{ label: t.nav.consultation }]}
        actions={
          <>
            <HeroLink to="#book">
              {L(consult.heroBook)}
              <ArrowRight size={15} aria-hidden="true" />
            </HeroLink>
            <HeroLink to="#steps" muted>
              {L(consult.heroSteps)}
              <ArrowDown size={15} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.secondOpinion} muted>
              {t.nav.secondOpinion}
            </HeroLink>
          </>
        }
        aside={
          <CallWindow
            doctor={L(consult.heroCall.doctor)}
            you={L(consult.heroCall.you)}
            shared={L(consult.heroCall.shared)}
          />
        }
        meta={
          consultation ? (
            <span>
              {t.common.from} {formatPrice(consultation.price)} · {consultation.duration} {t.common.minutes}
            </span>
          ) : undefined
        }
      />

      {/* ------------------------------------------------ 01 · STATEMENT */}
      <Section aria-labelledby="oc-statement">
        <Container>
          <SectionIndex n={1} label={L(consult.statementLabel)} />
          <div id="oc-statement">
            <TextFill as="h2" text={L(consult.statement)} className="oph-pt-statement oph-pt-statement--lg" />
          </div>
          <Reveal variant="up" className="oph-pt-callout">
            <span className="oph-pt-callout__icon" aria-hidden="true">
              <Globe2 size={22} />
            </span>
            <div>
              <h3 className="oph-pt-callout__title">{L(consult.mandatoryTitle)}</h3>
              <p>{L(consult.mandatoryText)}</p>
              <Link className="oph-link oph-pt-arrowlink" to={ROUTES.international}>
                {L(consult.mandatoryLink)}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ---------------------------------------------------- 02 · STEPS */}
      <Section tone="deep" id="steps" className="oph-on-dark oph-pt-anchor oph-pt-darksteps" aria-labelledby="oc-steps">
        <Container>
          <SectionIndex n={2} label={L(consult.stepsEyebrow)} onDark />
          <SectionHead id="oc-steps" title={L(consult.stepsTitle)} />
          <StepFlow steps={consult.steps.map((step) => ({ title: L(step.title), text: L(step.text) }))} />
        </Container>
      </Section>

      {/* ------------------------------------------------ 03 · PLATFORMS */}
      <Section aria-labelledby="oc-platforms">
        <Container>
          <SectionIndex n={3} label={L(consult.platformsEyebrow)} />
          <SectionHead id="oc-platforms" title={L(consult.platformsTitle)} text={L(consult.platformsLead)} />
          <div ref={platformsRef} className="oph-pt-platforms">
            <Stagger className="oph-pt-platforms__grid" step={120}>
              {consult.platforms.map((platform, index) => (
                <Reveal key={platform.id} variant="scale" className="oph-pt-platform" style={{ ['--i' as string]: index }}>
                  <span className="oph-pt-platform__mark" aria-hidden="true">
                    <Video size={22} />
                  </span>
                  <h3 className="oph-pt-platform__name">{platform.name}</h3>
                  <p className="oph-pt-platform__text">{L(platform.text)}</p>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------- 04 · WHAT YOU NEED */}
      <Section tone="tint" aria-labelledby="oc-needs">
        <Container>
          <SectionIndex n={4} label={L(consult.needsEyebrow)} />
          <div className="oph-pt-needs">
            <div className="oph-pt-needs__intro">
              <SectionHead id="oc-needs" title={L(consult.needsTitle)} size="sm" />
            </div>
            <StackCards className="oph-pt-stack">
              {consult.needs.map((need, index) => {
                const Icon = NEED_ICONS[index % NEED_ICONS.length];
                return (
                  <article key={need.title.en} className="oph-pt-scard">
                    <div className="oph-pt-scard__head">
                      <span className="oph-pt-scard__icon" aria-hidden="true">
                        <Icon size={22} />
                      </span>
                      <span className="oph-pt-scard__n" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="oph-pt-scard__title">{L(need.title)}</h3>
                    <p className="oph-pt-scard__text">{L(need.text)}</p>
                  </article>
                );
              })}
            </StackCards>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- 05 · PRICE */}
      <Section aria-labelledby="oc-price">
        <Container>
          <SectionIndex n={5} label={L(consult.priceEyebrow)} />
          <div className="oph-duo oph-pt-price">
            <div>
              <SectionHead id="oc-price" title={L(consult.priceTitle)} text={L(consult.priceText)} size="sm" />
              <Stagger as="ul" className="oph-pt-checks" step={80}>
                {consult.priceIncludes.map((item) => (
                  <Reveal as="li" key={item.en} variant="left">
                    <CheckCircle2 size={17} aria-hidden="true" />
                    {L(item)}
                  </Reveal>
                ))}
              </Stagger>
            </div>
            {consultation ? (
              <Reveal variant="scale" className="oph-pt-pricecard oph-on-dark">
                <p className="oph-eyebrow">{L(consultation.name)}</p>
                {/* Prices are never animated: a counter would show wrong amounts mid-way. */}
                <p className="oph-pt-pricecard__value">{formatPrice(consultation.price)}</p>
                <p className="oph-pt-pricecard__meta">
                  <Clock3 size={15} aria-hidden="true" />
                  {consultation.duration} {t.common.minutes}
                </p>
                <div className="oph-pt-pricecard__actions">
                  <HeroLink to="#book">
                    {L(consult.heroBook)}
                    <ArrowDown size={15} aria-hidden="true" />
                  </HeroLink>
                  <HeroLink to={ROUTES.pricing} muted>
                    {L(consult.pricingLink)}
                  </HeroLink>
                </div>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------- 06 · FORM */}
      <Section tone="tint" id="book" className="oph-pt-anchor" aria-labelledby="oc-form">
        <Container>
          <SectionIndex n={6} label={L(ptShared.formEyebrow)} />
          <div className="oph-pt-formgrid">
            <div className="oph-pt-formgrid__aside">
              <SectionHead id="oc-form" title={L(consult.formTitle)} text={L(consult.formLead)} size="sm" />
              <Reveal variant="up" className="oph-pt-next">
                <h3 className="oph-pt-next__title">{L(consult.nextTitle)}</h3>
                <ol>
                  {consult.next.map((item, index) => {
                    const Icon = NEXT_ICONS[index % NEXT_ICONS.length];
                    return (
                      <li key={item.en}>
                        <span aria-hidden="true">
                          <Icon size={15} />
                        </span>
                        {L(item)}
                      </li>
                    );
                  })}
                </ol>
              </Reveal>
            </div>
            <Reveal variant="up" delay={120} className="oph-panel oph-pt-formpanel">
              <LeadForm
                source="online-consultation"
                withFiles
                serviceId={consultation?.id ?? ''}
                submitLabel={L(consult.formSubmit)}
                extraFields={extraFields}
                filesLabel={consult.filesLabel}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <PortalFaq n={7} items={consult.faq} />
      <PortalLinks n={8} current="consultation" tone="tint" />

      <CtaBand />
    </>
  );
};

export default ConsultationPage;
