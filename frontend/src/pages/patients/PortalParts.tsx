import { useI18n, type Localized } from '@/i18n';
import { Accordion, Container, Section } from '@/ui';
import { Reveal, TextFill } from '@/motion';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex } from '@/components/editorial';
import type { LeadExtraField } from '@/components/LeadForm';
import { ROUTES } from '@/app/navigation';
import { site } from '@/content';
import { ptCountries, ptFieldLabels, ptLanguages, ptPortals, ptShared, type PtFaq } from '@/content/pages/patients';

/**
 * Building blocks shared by the three patient portals
 * (international patients, second opinion, online consultation).
 */

export type PortalKey = (typeof ptPortals)[number]['key'];

const PORTAL_ROUTES: Record<PortalKey, string> = {
  international: ROUTES.international,
  secondOpinion: ROUTES.secondOpinion,
  consultation: ROUTES.consultation,
  doctors: ROUTES.doctors,
  appointment: ROUTES.appointment,
  contacts: ROUTES.contacts,
};

export const whatsappHref = () => `https://wa.me/${site.organization.whatsapp}`;

/**
 * Statement paragraph that lights up word by word with scroll.
 *
 * `TextFill` puts `aria-label` on its element and hides the word spans, which
 * is not allowed on a paragraph (axe `aria-prohibited-attr`) and can lose the
 * text for screen readers. Here the readable copy is a real, visually hidden
 * paragraph and the animated layer is purely presentational.
 */
export const Statement = ({ text, large = false }: { text: string; large?: boolean }) => (
  <div className="oph-pt-statementwrap">
    <p className="oph-visually-hidden">{text}</p>
    <div aria-hidden="true">
      <TextFill as="div" text={text} className={`oph-pt-statement ${large ? 'oph-pt-statement--lg' : ''}`} />
    </div>
  </div>
);

/** Cross-links to the other portals and to booking / contacts / doctors. */
export const PortalLinks = ({
  n,
  current,
  tone = 'default',
}: {
  n: number;
  current: PortalKey;
  tone?: 'default' | 'tint';
}) => {
  const { L } = useI18n();
  const items = ptPortals.filter((portal) => portal.key !== current);
  return (
    <Section tone={tone} className="oph-pt-portals" aria-labelledby="pt-portals-title">
      <Container>
        <SectionIndex n={n} label={L(ptShared.portalsEyebrow)} />
        <SectionHead id="pt-portals-title" title={L(ptShared.portalsTitle)} size="sm" />
        <EditorialGrid>
          {items.map((portal) => (
            <EditorialCard
              key={portal.key}
              eyebrow={L(portal.eyebrow)}
              title={L(portal.title)}
              text={L(portal.text)}
              to={PORTAL_ROUTES[portal.key]}
              linkLabel={L(ptShared.open)}
            />
          ))}
        </EditorialGrid>
      </Container>
    </Section>
  );
};

/** FAQ block — pair with `faqSchema(faqForSchema(items, L))` in the page Seo. */
export const PortalFaq = ({ n, items, tone = 'default' }: { n: number; items: PtFaq[]; tone?: 'default' | 'tint' }) => {
  const { L } = useI18n();
  return (
    <Section tone={tone} aria-labelledby="pt-faq-title">
      <Container>
        <div className="oph-pt-faq">
          <div className="oph-pt-faq__head">
            <SectionIndex n={n} label={L(ptShared.faqEyebrow)} />
            <SectionHead id="pt-faq-title" title={L(ptShared.faqTitle)} size="sm" />
            <Reveal variant="fade" delay={200}>
              <p className="oph-pt-disclaimer">{L(ptShared.disclaimer)}</p>
            </Reveal>
          </div>
          <Reveal variant="up" className="oph-pt-faq__list">
            <Accordion
              defaultOpenId="q0"
              items={items.map((item, index) => ({ id: `q${index}`, question: L(item.q), answer: L(item.a) }))}
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
};

export const faqForSchema = (items: PtFaq[], L: (value: Localized) => string) =>
  items.map((item) => ({ question: L(item.q), answer: L(item.a) }));

/* ------------------------------------------------------ LEAD FORM FIELDS */

export const countryField = (required = true): LeadExtraField => ({
  name: 'country',
  label: ptFieldLabels.country,
  type: 'select',
  required,
  half: true,
  options: ptCountries,
});

export const languageField = (): LeadExtraField => ({
  name: 'language',
  label: ptFieldLabels.language,
  type: 'select',
  half: true,
  options: ptLanguages,
});

export const diagnosisField = (required = false): LeadExtraField => ({
  name: 'diagnosis',
  label: ptFieldLabels.diagnosis,
  placeholder: ptFieldLabels.diagnosisHint,
  required,
});
