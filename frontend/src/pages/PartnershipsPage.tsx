import type { ReactNode } from 'react';
import { ArrowRight, Building2, Cpu, GraduationCap, LineChart, Plane } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { ClipReveal, Reveal, Stagger, StickyStory, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { LeadForm, type LeadExtraField } from '@/components/LeadForm';
import { SectionHead, SectionIndex, StepFlow } from '@/components/editorial';
import { Photo } from '@/components/Photo';
import { ROUTES } from '@/app/navigation';
import { PARTNER_AUDIENCES, PARTNERSHIPS, type PartnerAudience } from '@/content/pages/people-network';

const AUDIENCE_ICONS: Record<PartnerAudience, ReactNode> = {
  clinics: <Building2 size={30} strokeWidth={1.4} />,
  universities: <GraduationCap size={30} strokeWidth={1.4} />,
  industry: <Cpu size={30} strokeWidth={1.4} />,
  investors: <LineChart size={30} strokeWidth={1.4} />,
  tourism: <Plane size={30} strokeWidth={1.4} />,
};

const PartnershipsPage = () => {
  const { t, L } = useI18n();

  const fields: LeadExtraField[] = [
    { name: 'organisation', label: PARTNERSHIPS.fieldOrg, required: true },
    {
      name: 'partnerType',
      label: PARTNERSHIPS.fieldType,
      type: 'select',
      required: true,
      options: PARTNER_AUDIENCES.map((audience) => ({ value: audience.id, label: audience.title })),
    },
    { name: 'position', label: PARTNERSHIPS.fieldRole, half: true },
    { name: 'country', label: PARTNERSHIPS.fieldCountry, half: true },
    { name: 'website', label: PARTNERSHIPS.fieldSite, placeholder: { ru: 'https://', kk: 'https://', en: 'https://' } },
  ];

  return (
    <>
      <Seo
        title={t.nav.partnerships}
        description={L(PARTNERSHIPS.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.about, url: ROUTES.about },
            { name: t.nav.partnerships, url: ROUTES.partnerships },
          ]),
        ]}
      />

      <PageHero
        eyebrow={L(PARTNERSHIPS.eyebrow)}
        title={L(PARTNERSHIPS.title)}
        text={L(PARTNERSHIPS.lead)}
        crumbs={[{ label: t.nav.aboutClinic, to: ROUTES.about }, { label: t.nav.partnerships }]}
        actions={
          <>
            <HeroLink to="#partner-form">
              {L(PARTNERSHIPS.discuss)}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.experts} muted>
              {t.nav.experts}
            </HeroLink>
          </>
        }
      />

      {/* 01 ------------------------------------------------ STATEMENT */}
      <Section tight>
        <Container>
          <SectionIndex n={1} />
          <TextFill text={L(PARTNERSHIPS.statement)} className="ppl-statement ppl-statement--ink" />
        </Container>
      </Section>

      {/* 02 ------------------------------------------------ AUDIENCES */}
      <Section aria-labelledby="partner-audiences">
        <Container>
          <SectionIndex n={2} />
          <SectionHead
            id="partner-audiences"
            eyebrow={L(PARTNERSHIPS.audiencesEyebrow)}
            title={L(PARTNERSHIPS.audiencesTitle)}
          />
          <StickyStory
            className="ppl-audiences"
            visual={(active) => {
              const audience = PARTNER_AUDIENCES[active] ?? PARTNER_AUDIENCES[0];
              return (
                <div className="ppl-aud-visual" aria-hidden="true" style={{ ['--a' as string]: active }}>
                  <span className="ppl-aud-visual__ring" />
                  <span className="ppl-aud-visual__ring ppl-aud-visual__ring--inner" />
                  <span className="ppl-aud-visual__icon" key={audience.id}>
                    {AUDIENCE_ICONS[audience.id]}
                  </span>
                  <span className="ppl-aud-visual__n">
                    {String(active + 1).padStart(2, '0')} / {String(PARTNER_AUDIENCES.length).padStart(2, '0')}
                  </span>
                  <span className="ppl-aud-visual__label">{L(audience.label)}</span>
                </div>
              );
            }}
          >
            {PARTNER_AUDIENCES.map((audience, index) => (
              <article key={audience.id} className="ppl-chapter">
                <span className="ppl-chapter__n">
                  {String(index + 1).padStart(2, '0')} · {L(audience.label)}
                </span>
                <span className="ppl-chapter__icon" aria-hidden="true">
                  {AUDIENCE_ICONS[audience.id]}
                </span>
                <h3 className="ppl-chapter__title">{L(audience.title)}</h3>
                <p className="ppl-chapter__text">{L(audience.text)}</p>
                <p className="ppl-filterrow__label">{L(PARTNERSHIPS.weOffer)}</p>
                <ul className="oph-ringlist">
                  {audience.offers.map((offer) => (
                    <li key={offer.en}>{L(offer)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </StickyStory>
        </Container>
      </Section>

      {/* 03 ------------------------------------------------ INVESTORS */}
      <Section tone="deep" aria-labelledby="partner-investors" className="ppl-investors">
        <Container>
          <SectionIndex n={3} onDark />
          <SectionHead
            id="partner-investors"
            eyebrow={L(PARTNERSHIPS.investorsEyebrow)}
            title={L(PARTNERSHIPS.investorsTitle)}
            text={L(PARTNERSHIPS.investorsText)}
          />
          <Stagger className="ppl-darkcards" step={120}>
            {PARTNERSHIPS.pillars.map((pillar, index) => (
              <Reveal key={pillar.id} variant="up" className="ppl-darkcard">
                <span className="ppl-darkcard__n">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="ppl-darkcard__title">{L(pillar.title)}</h3>
                <p className="ppl-darkcard__text">{L(pillar.text)}</p>
              </Reveal>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* 04 -------------------------------------------------- PROCESS */}
      <Section aria-labelledby="partner-process">
        <Container>
          <SectionIndex n={4} />
          <SectionHead id="partner-process" eyebrow={L(PARTNERSHIPS.processEyebrow)} title={L(PARTNERSHIPS.processTitle)} />
          <StepFlow steps={PARTNERSHIPS.process.map((step) => ({ title: L(step.title), text: L(step.text) }))} />
        </Container>
      </Section>

      {/* 05 ----------------------------------------------------- FORM */}
      <Section tone="tint" id="partner-form" aria-labelledby="partner-form-title" className="ppl-anchor">
        <Container>
          <SectionIndex n={5} />
          <div className="ppl-formsplit">
            <div className="ppl-formsplit__intro">
              <SectionHead
                id="partner-form-title"
                eyebrow={L(PARTNERSHIPS.formEyebrow)}
                title={L(PARTNERSHIPS.formTitle)}
                text={L(PARTNERSHIPS.formText)}
                size="sm"
              />
              <ClipReveal className="ppl-formsplit__media">
                <Photo src="/media/clinic-facade.jpg" alt="" width={1440} height={1079} sizes="(max-width: 900px) 100vw, 40vw" />
              </ClipReveal>
            </div>
            <Reveal variant="up" className="oph-panel">
              <LeadForm
                source="partnership"
                submitLabel={L(PARTNERSHIPS.submit)}
                extraFields={fields}
                emailRequired
                commentLabel={PARTNERSHIPS.commentLabel}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default PartnershipsPage;
