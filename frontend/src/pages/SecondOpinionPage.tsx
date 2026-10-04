import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileUp,
  Hash,
  Inbox,
  ListChecks,
  MessagesSquare,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { Counter, Reveal, Stagger, StickyStory, TextFill } from '@/motion';
import { Seo, breadcrumbSchema, faqSchema } from '@/seo/Seo';
import { PageHero, HeroLink } from '@/components/PageHero';
import { FeatureTile, SectionHead, SectionIndex, StepFlow } from '@/components/editorial';
import { LeadForm, type LeadExtraField } from '@/components/LeadForm';
import { CtaBand } from '@/components/CtaBand';
import { ROUTES } from '@/app/navigation';
import { ptFieldLabels, ptShared } from '@/content/pages/patients';
import { second } from '@/content/pages/patients-second-opinion';
import {
  PortalFaq,
  PortalLinks,
  countryField,
  diagnosisField,
  faqForSchema,
  languageField,
} from './patients/PortalParts';

const FEATURE_ICONS = [FileUp, ShieldCheck, Hash, Stethoscope, MessagesSquare, ListChecks];
const STATUS_ICONS = [Inbox, Clock3, CheckCircle2];

/** Checklist starts open on wide screens and folded on phones. */
const wideScreen = () => {
  try {
    return window.matchMedia('(min-width: 768px)').matches;
  } catch {
    return true;
  }
};

/**
 * Hero illustration: a small stack of the records a patient sends (report,
 * OCT scan, visual fields). Typographic, so the page doesn't reuse a clinic
 * photo that already appears elsewhere.
 */
const RecordsStack = ({ labels, note }: { labels: string[]; note: string }) => (
  <div className="oph-pt-docs" aria-hidden="true">
    {labels.map((label, index) => (
      <div key={label} className="oph-pt-docs__sheet" style={{ ['--i' as string]: index }}>
        <span className="oph-pt-docs__label">{label}</span>
        {index === 1 ? (
          <svg className="oph-pt-docs__scan" viewBox="0 0 200 60" preserveAspectRatio="none">
            <path d="M0 34 C30 34 42 30 60 30 S86 46 100 46 S128 30 142 30 S172 34 200 34" />
            <path d="M0 42 C30 42 44 38 60 38 S86 52 100 52 S128 38 142 38 S172 42 200 42" />
            <path d="M0 50 C34 50 48 47 64 47 S88 57 100 57 S126 47 138 47 S170 50 200 50" />
          </svg>
        ) : (
          <span className="oph-pt-docs__lines">
            <span />
            <span />
            <span />
            <span />
          </span>
        )}
      </div>
    ))}
    <span className="oph-pt-docs__note">{note}</span>
  </div>
);

const SecondOpinionPage = () => {
  const { t, L } = useI18n();
  const [checklistOpen] = useState(wideScreen);

  const extraFields: LeadExtraField[] = [
    countryField(),
    languageField(),
    diagnosisField(true),
    {
      name: 'question',
      label: ptFieldLabels.question,
      type: 'textarea',
      placeholder: ptFieldLabels.questionHint,
      required: true,
    },
  ];

  return (
    <>
      <Seo
        title={L(second.seoTitle)}
        description={L(second.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.secondOpinion, url: ROUTES.secondOpinion },
          ]),
          faqSchema(faqForSchema(second.faq, L)),
        ]}
      />

      <PageHero
        eyebrow={L(second.eyebrow)}
        title={L(second.title)}
        text={L(second.lead)}
        crumbs={[{ label: t.nav.secondOpinion }]}
        actions={
          <>
            <HeroLink to="#request">
              {L(second.heroUpload)}
              <ArrowRight size={15} aria-hidden="true" />
            </HeroLink>
            <HeroLink to="#process" muted>
              {L(second.heroProcess)}
              <ArrowDown size={15} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.consultation} muted>
              {t.nav.consultation}
            </HeroLink>
          </>
        }
        aside={<RecordsStack labels={second.heroDocs.map((doc) => L(doc))} note={L(second.heroDocsNote)} />}
      />

      {/* -------------------------------------------------- 01 · ADVANTAGE */}
      <Section aria-labelledby="so-adv">
        <Container>
          <SectionIndex n={1} label={L(second.advEyebrow)} />
          <div id="so-adv">
            <TextFill as="h2" text={L(second.advStatement)} className="oph-pt-statement oph-pt-statement--lg" />
          </div>
          <div className="oph-pt-advgrid">
            <Reveal variant="up">
              <p className="oph-lead">{L(second.advText)}</p>
            </Reveal>
            <Stagger className="oph-pt-minis" step={110}>
              {second.stats.map((stat) => (
                <Reveal key={stat.label.en} variant="up" className="oph-pt-mini">
                  <p className="oph-pt-mini__value">
                    <Counter value={stat.value} />
                    {stat.unit ? L(stat.unit) : null}
                  </p>
                  <p className="oph-pt-mini__label">{L(stat.label)}</p>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------- 02 · PROCESS */}
      <Section tone="tint" id="process" className="oph-pt-anchor" aria-labelledby="so-process">
        <Container>
          <SectionIndex n={2} label={L(second.processEyebrow)} />
          <SectionHead id="so-process" title={L(second.processTitle)} />
          <StepFlow
            steps={second.process.map((step) => ({
              title: L(step.title),
              text: L(step.text),
            }))}
          />
        </Container>
      </Section>

      {/* --------------------------------------------------- 03 · FEATURES */}
      <Section tone="deep" className="oph-on-dark" aria-labelledby="so-features">
        <Container>
          <SectionIndex n={3} label={L(second.featEyebrow)} onDark />
          <SectionHead id="so-features" title={L(second.featTitle)} />
          <Stagger className="oph-pt-tiles oph-pt-tiles--3" step={80}>
            {second.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
              return (
                <Reveal key={feature.title.en} variant="up">
                  <FeatureTile icon={<Icon size={20} />} title={L(feature.title)} text={L(feature.text)} />
                </Reveal>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* ----------------------------------------------- 04 · STATUS TRACKER */}
      <Section aria-labelledby="so-status">
        <Container>
          <SectionIndex n={4} label={L(second.statusEyebrow)} />
          <SectionHead id="so-status" title={L(second.statusTitle)} />
          {/* Short pinned track: three compact chapters beside a sticky sample
              card. On phones and narrow tablets the pin is dropped entirely:
              the chapters become a static vertical timeline (no sticky strip,
              no scroll-linked motion, nothing to jitter under a finger). */}
          <StickyStory
            className="oph-pt-statusstory"
            visual={(active) => (
              <div className="oph-pt-status" aria-hidden="true">
                <div className="oph-pt-status__head">
                  <span className="oph-pt-status__title">{L(second.statusCardTitle)}</span>
                  <span className="oph-pt-status__ref">OPH-······</span>
                </div>
                <ol className="oph-pt-status__list">
                  {second.statuses.map((status, index) => {
                    const Icon = STATUS_ICONS[index];
                    const state = index < active ? 'done' : index === active ? 'active' : 'next';
                    return (
                      <li key={status.title.en} data-state={state} className="oph-pt-status__item">
                        <span className="oph-pt-status__dot">
                          <Icon size={16} />
                        </span>
                        <span className="oph-pt-status__label">{L(status.title)}</span>
                        <span className="oph-pt-status__meta">{L(status.meta)}</span>
                      </li>
                    );
                  })}
                </ol>
                <div className="oph-pt-status__bar">
                  <span
                    style={{
                      transform: `scaleX(${(active + 1) / second.statuses.length})`,
                    }}
                  />
                </div>
                <p className="oph-pt-status__now">
                  {L(second.statusNow)}: <strong>{L(second.statuses[active].title)}</strong>
                </p>
              </div>
            )}
          >
            {second.statuses.map((status, index) => {
              const Icon = STATUS_ICONS[index];
              return (
                <div key={status.title.en} className="oph-pt-chapter">
                  {/* Timeline marker — only shown on phones, where the pinned
                    sample card is replaced by a plain vertical timeline. */}
                  <span className="oph-pt-chapter__dot" aria-hidden="true">
                    <Icon size={16} />
                  </span>
                  <span className="oph-pt-chapter__n">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="oph-pt-chapter__title">{L(status.title)}</h3>
                  <p className="oph-pt-chapter__text">{L(status.text)}</p>
                  <span className="oph-tag">{L(status.meta)}</span>
                </div>
              );
            })}
          </StickyStory>
        </Container>
      </Section>

      {/* ---------------------------------------- 05 · WHAT TO ATTACH + FORM */}
      <Section tone="tint" id="request" className="oph-pt-anchor" aria-labelledby="so-form">
        <Container>
          <SectionIndex n={5} label={L(ptShared.formEyebrow)} />
          <div className="oph-pt-formgrid">
            <div className="oph-pt-formgrid__aside">
              <SectionHead id="so-form" title={L(second.formTitle)} text={L(second.formLead)} size="sm" />
              <Reveal variant="up" className="oph-pt-next oph-pt-attach">
                <details className="oph-pt-more oph-pt-more--flush" open={checklistOpen}>
                  <summary>
                    <span className="oph-pt-next__title">{L(second.attachTitle)}</span>
                    <span aria-hidden="true" className="oph-pt-more__count">
                      {second.attach.length}
                    </span>
                  </summary>
                  <ul className="oph-ringlist">
                    {second.attach.map((item) => (
                      <li key={item.en}>{L(item)}</li>
                    ))}
                  </ul>
                  <p className="oph-pt-tip">{L(second.attachTip)}</p>
                </details>
              </Reveal>
              <Stagger className="oph-pt-notes" step={120}>
                <Reveal variant="up" className="oph-pt-note">
                  <Clock3 size={18} aria-hidden="true" />
                  <div>
                    <h3>{L(second.turnaroundTitle)}</h3>
                    <p>{L(second.turnaroundText)}</p>
                  </div>
                </Reveal>
                <Reveal variant="up" className="oph-pt-note">
                  <ShieldCheck size={18} aria-hidden="true" />
                  <div>
                    <h3>{L(second.privacyTitle)}</h3>
                    <p>{L(second.privacyText)}</p>
                    <Link className="oph-link oph-pt-textlink" to={ROUTES.privacy}>
                      {L(second.privacyLink)}
                    </Link>
                  </div>
                </Reveal>
              </Stagger>
            </div>
            <Reveal variant="up" delay={120} className="oph-panel oph-pt-formpanel">
              <LeadForm
                source="second-opinion"
                withFiles
                emailRequired
                submitLabel={L(second.formSubmit)}
                extraFields={extraFields}
                filesLabel={second.filesLabel}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <PortalFaq n={6} items={second.faq} />
      <PortalLinks n={7} current="secondOpinion" tone="tint" />

      <CtaBand />
    </>
  );
};

export default SecondOpinionPage;
