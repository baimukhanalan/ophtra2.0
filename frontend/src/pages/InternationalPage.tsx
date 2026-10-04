import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  Car,
  CheckCircle2,
  FileText,
  HeartPulse,
  Hotel,
  Languages,
  Mail,
  MessageCircle,
  Microscope,
  Phone,
  Plane,
  Stethoscope,
  UserRound,
} from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { Counter, Reveal, SplitText, Stagger, Timeline, TimelineItem, useParallax, useProgressVars } from '@/motion';
import { Seo, breadcrumbSchema, faqSchema } from '@/seo/Seo';
import { PageHero, HeroLink } from '@/components/PageHero';
import { ArticleBody, ContinueBox, FeatureTile, RingMotif, SectionHead, SectionIndex } from '@/components/editorial';
import { LeadForm, type LeadExtraField } from '@/components/LeadForm';
import { CtaBand } from '@/components/CtaBand';
import { Photo } from '@/components/Photo';
import { ROUTES } from '@/app/navigation';
import { services, site } from '@/content';
import { ptFieldLabels, ptShared } from '@/content/pages/patients';
import { intl } from '@/content/pages/patients-international';
import { track } from '@/services/analytics';
import { CostEstimator, type EstimatePrefill } from './patients/CostEstimator';
import {
  PortalFaq,
  Statement,
  countryField,
  diagnosisField,
  faqForSchema,
  languageField,
  whatsappHref,
} from './patients/PortalParts';

const WHY_KZ_ICONS = [Plane, BadgeCheck, FileText];
const WHY_US_ICONS = [Microscope, CalendarClock, Languages, HeartPulse];
const TRAVEL_ICONS = [BadgeCheck, Hotel, Car, Languages];
const NEXT_ICONS = [CheckCircle2, MessageCircle, Stethoscope];

/**
 * International patient portal (spec §6.5, §8; Figma frame 09).
 *
 * Order follows the decision a patient makes: the Figma travel guide, why
 * Kazakhstan / why this centre, the treatment path, the cost estimate, travel
 * support, the coordinator, then the application. The path is a scroll-drawn
 * timeline rather than a pinned story, so no viewport is ever blank and the
 * page stays short on phones; secondary lists sit in disclosures.
 */
const InternationalPage = () => {
  const { t, L } = useI18n();
  const parallaxRef = useParallax<HTMLDivElement>(0.12);
  const travelRef = useProgressVars<HTMLDivElement>();
  const [prefill, setPrefill] = useState<Record<string, string> | undefined>();

  const extraFields: LeadExtraField[] = [
    countryField(),
    languageField(),
    {
      name: 'service',
      label: ptFieldLabels.service,
      type: 'select',
      options: [
        ...services.map((service) => ({
          value: service.id,
          label: service.name,
        })),
        { value: 'unknown', label: ptFieldLabels.otherService },
      ],
    },
    diagnosisField(),
    {
      name: 'dates',
      label: ptFieldLabels.dates,
      placeholder: ptFieldLabels.datesHint,
      half: true,
    },
  ];

  const applyEstimate = ({ serviceId, summary }: EstimatePrefill) => {
    setPrefill({
      ...(serviceId ? { service: serviceId } : {}),
      comment: summary,
    });
    track('estimate_to_form', { from: 'international_estimator' });
  };

  return (
    <>
      <Seo
        title={L(intl.seoTitle)}
        description={L(intl.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.international, url: ROUTES.international },
          ]),
          faqSchema(faqForSchema(intl.faq, L)),
        ]}
      />

      <PageHero
        eyebrow={L(intl.eyebrow)}
        title={L(intl.title)}
        text={L(intl.lead)}
        crumbs={[{ label: t.nav.international }]}
        actions={
          <>
            <HeroLink to="#apply">
              {L(intl.heroApply)}
              <ArrowRight size={15} aria-hidden="true" />
            </HeroLink>
            <HeroLink to="#estimate" muted>
              {L(intl.heroEstimate)}
              <ArrowDown size={15} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={whatsappHref()} external muted>
              WhatsApp
            </HeroLink>
          </>
        }
        aside={
          <Photo
            src="/media/clinic-day.jpg"
            alt={L(intl.heroPhotoAlt)}
            width={1440}
            height={1079}
            sizes="(max-width: 900px) 100vw, 460px"
            className="oph-pagehero__photo"
            eager
          />
        }
      />

      {/* ------------------------------------------ 01 · FIGMA ARTICLE GUIDE */}
      <Section className="oph-pt-guide">
        <Container>
          <SectionIndex n={1} label={L(intl.guideLabel)} />
          <ArticleBody
            tocLabel={L(ptShared.toc)}
            sections={intl.guide.map((section) => ({
              id: section.id,
              title: L(section.title),
              body: <p>{L(section.text)}</p>,
              list: section.list?.map((item) => L(item)),
            }))}
            after={
              <ContinueBox
                title={L(intl.continueTitle)}
                links={[
                  { label: t.nav.secondOpinion, to: ROUTES.secondOpinion },
                  { label: t.nav.consultation, to: ROUTES.consultation },
                  { label: t.nav.doctors, to: ROUTES.doctors },
                  { label: t.nav.pricing, to: ROUTES.pricing },
                ]}
              />
            }
          />
        </Container>
      </Section>

      {/* --------------------------------------------- 02 · WHY KAZAKHSTAN */}
      <Section tone="tint" aria-labelledby="pt-why-kz">
        <Container>
          <SectionIndex n={2} label={L(intl.whyKzEyebrow)} />
          <SectionHead id="pt-why-kz" title={L(intl.whyKzTitle)} />
          <Statement text={L(intl.whyKzStatement)} />
          <Stagger as="ol" className="oph-pt-reasons" step={110}>
            {intl.whyKz.map((item, index) => {
              const Icon = WHY_KZ_ICONS[index % WHY_KZ_ICONS.length];
              return (
                <Reveal as="li" key={item.title.en} variant="up" className="oph-pt-reason">
                  <span className="oph-pt-reason__top">
                    <span className="oph-pt-reason__n" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon size={20} aria-hidden="true" className="oph-pt-reason__icon" />
                  </span>
                  <h3 className="oph-pt-reason__title">{L(item.title)}</h3>
                  <p className="oph-pt-reason__text">{L(item.text)}</p>
                </Reveal>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* ------------------------------------------------ 03 · WHY OUR CENTRE */}
      <Section tone="deep" className="oph-on-dark" aria-labelledby="pt-why-us">
        <div ref={parallaxRef} className="oph-pt-deco" aria-hidden="true">
          <RingMotif />
        </div>
        <Container>
          <SectionIndex n={3} label={L(intl.whyUsEyebrow)} onDark />
          <SectionHead id="pt-why-us" title={L(intl.whyUsTitle)} text={L(intl.whyUsLead)} />
          <Stagger className="oph-pt-tiles oph-pt-tiles--4" step={80}>
            {intl.whyUs.map((item, index) => {
              const Icon = WHY_US_ICONS[index % WHY_US_ICONS.length];
              return (
                <Reveal key={item.title.en} variant="up">
                  <FeatureTile icon={<Icon size={20} />} title={L(item.title)} text={L(item.text)} />
                </Reveal>
              );
            })}
          </Stagger>

          {/* Proof points: only the verified research facts (DESIGN.md §7), with the source. */}
          <div className="oph-pt-proof">
            <Reveal variant="up" className="oph-pt-proof__intro">
              <h3 className="oph-pt-proof__title">{L(intl.proofTitle)}</h3>
              <p className="oph-pt-proof__text">{L(intl.proofText)}</p>
              <a className="oph-pt-proof__source" href={intl.proofUrl} target="_blank" rel="noopener noreferrer">
                {L(intl.proofSource)}
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </Reveal>
            <Stagger as="dl" className="oph-pt-proof__facts" step={120}>
              {intl.proof.map((fact) => (
                <Reveal key={fact.label.en} variant="up" className="oph-pt-proof__fact">
                  <dt className="oph-pt-proof__value">
                    {fact.value ? <Counter value={fact.value} /> : fact.text ? L(fact.text) : null}
                  </dt>
                  <dd className="oph-pt-proof__label">{L(fact.label)}</dd>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------ 04 · TREATMENT PATH */}
      <Section aria-labelledby="pt-journey">
        <Container>
          <SectionIndex n={4} label={L(intl.journeyEyebrow)} />
          <div className="oph-pt-journey">
            <div className="oph-pt-journey__head">
              <SectionHead id="pt-journey" title={L(intl.journeyTitle)} size="sm" />
              <div className="oph-pt-journey__mark" aria-hidden="true">
                <Reveal variant="scale">
                  <RingMotif />
                </Reveal>
              </div>
            </div>
            <Timeline className="oph-pt-timeline">
              {intl.journey.map((step, index) => (
                <TimelineItem key={step.title.en}>
                  <div className="oph-pt-step">
                    <span className="oph-pt-step__n">
                      {L(intl.journeyStepLabel)} {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="oph-pt-step__title">{L(step.title)}</h3>
                    <p className="oph-pt-step__text">{L(step.text)}</p>
                    <span className="oph-tag">{L(step.meta)}</span>
                  </div>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------- 05 · COST ESTIMATE */}
      <Section tone="tint" id="estimate" className="oph-pt-anchor" aria-labelledby="pt-estimate">
        <Container>
          <SectionIndex n={5} label={L(intl.estEyebrow)} />
          <SectionHead id="pt-estimate" title={L(intl.estTitle)} text={L(intl.estLead)} />
          <CostEstimator onApply={applyEstimate} />
        </Container>
      </Section>

      {/* ------------------------------------------------ 06 · TRAVEL SUPPORT */}
      <Section aria-labelledby="pt-travel">
        <Container>
          <SectionIndex n={6} label={L(intl.travelEyebrow)} />
          <SectionHead id="pt-travel" title={L(intl.travelTitle)} />
          <div ref={travelRef} className="oph-pt-travel">
            <Stagger className="oph-pt-travel__grid" step={100}>
              {intl.travel.map((item, index) => {
                const Icon = TRAVEL_ICONS[index % TRAVEL_ICONS.length];
                return (
                  <Reveal key={item.title.en} variant={index % 2 ? 'right' : 'left'} className="oph-pt-tcardwrap">
                    <article className="oph-pt-tcard" aria-labelledby={`pt-travel-${index}`}>
                      <div className="oph-pt-tcard__head">
                        <span className="oph-pt-tcard__icon" aria-hidden="true">
                          <Icon size={22} />
                        </span>
                        <span className="oph-pt-tcard__n" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h3 id={`pt-travel-${index}`} className="oph-pt-tcard__title">
                        {L(item.title)}
                      </h3>
                      <p className="oph-pt-tcard__text">{L(item.text)}</p>
                      {item.list?.length ? (
                        <details className="oph-pt-more">
                          <summary>
                            {L(intl.travelMore)}
                            <span aria-hidden="true" className="oph-pt-more__count">
                              {item.list.length}
                            </span>
                          </summary>
                          <ul className="oph-ringlist">
                            {item.list.map((entry) => (
                              <li key={entry.en}>{L(entry)}</li>
                            ))}
                          </ul>
                        </details>
                      ) : null}
                    </article>
                  </Reveal>
                );
              })}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------- 07 · COORDINATOR + LANGUAGES */}
      <Section tone="tint" aria-labelledby="pt-coord">
        <Container>
          <SectionIndex n={7} label={L(intl.coordEyebrow)} />
          <div className="oph-pt-coordgrid">
            <Reveal variant="up" className="oph-pt-coord">
              <div className="oph-pt-coord__top">
                <span className="oph-pt-coord__avatar" aria-hidden="true">
                  <UserRound size={26} />
                </span>
                <p className="oph-pt-coord__role">{L(intl.coordRole)}</p>
              </div>
              <div id="pt-coord">
                <SplitText text={L(intl.coordTitle)} as="h2" className="oph-pt-coord__title" step={36} />
              </div>
              <p className="oph-pt-coord__text">{L(intl.coordText)}</p>
              <p className="oph-pt-coord__hours">
                <CalendarClock size={16} aria-hidden="true" />
                {L(intl.coordHours)}
              </p>
              <div className="oph-pt-coord__actions">
                <a
                  className="oph-btn"
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track('whatsapp_click', {
                      from: 'international_coordinator',
                    })
                  }
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  {L(ptShared.whatsapp)}
                </a>
                <a className="oph-pt-coord__channel" href={`mailto:${site.organization.email}`}>
                  <Mail size={15} aria-hidden="true" />
                  {site.organization.email}
                </a>
                <a className="oph-pt-coord__channel" href={`tel:${site.organization.phoneHref}`}>
                  <Phone size={15} aria-hidden="true" />
                  {site.organization.phone}
                </a>
              </div>
            </Reveal>

            <div className="oph-pt-langs">
              <SectionHead eyebrow={L(intl.langEyebrow)} title={L(intl.langTitle)} text={L(intl.langLead)} size="sm" />
              <Stagger as="ul" className="oph-pt-langs__list" step={90}>
                {intl.langs.map((lang) => (
                  <Reveal
                    as="li"
                    key={lang.code}
                    variant="left"
                    className={`oph-pt-lang ${lang.ready ? '' : 'oph-pt-lang--soon'}`}
                  >
                    <span className="oph-pt-lang__code" aria-hidden="true">
                      {lang.code}
                    </span>
                    <span className="oph-pt-lang__name">{L(lang.name)}</span>
                    {lang.ready ? null : <span className="oph-pt-lang__status">{L(intl.langSoon)}</span>}
                  </Reveal>
                ))}
              </Stagger>
              <Reveal variant="fade">
                <p className="oph-pt-muted">{L(intl.langNote)}</p>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- 08 · APPLY FORM */}
      <Section id="apply" className="oph-pt-anchor" aria-labelledby="pt-apply">
        <Container>
          <SectionIndex n={8} label={L(ptShared.formEyebrow)} />
          <div className="oph-pt-formgrid">
            <div className="oph-pt-formgrid__aside">
              <SectionHead id="pt-apply" title={L(intl.formTitle)} text={L(intl.formLead)} size="sm" />
              <Reveal variant="up" className="oph-pt-next">
                <h3 className="oph-pt-next__title">{L(intl.formAsideTitle)}</h3>
                <ol>
                  {intl.formAside.map((item, index) => {
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
              <p className="oph-pt-prefill" role="status">
                {prefill ? (
                  <>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    {L(intl.prefillNote)}
                  </>
                ) : null}
              </p>
            </div>
            <Reveal variant="up" delay={120} className="oph-panel oph-pt-formpanel">
              <LeadForm
                source="international"
                withFiles
                submitLabel={L(intl.formSubmit)}
                extraFields={extraFields}
                initialValues={prefill}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <PortalFaq n={9} items={intl.faq} tone="tint" />

      <CtaBand />
    </>
  );
};

export default InternationalPage;
