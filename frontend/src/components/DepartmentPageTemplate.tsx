import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Accordion, Container, Section } from '@/ui';
import { Reveal, Stagger, StickyStory, TextFill } from '@/motion';
import { Seo, breadcrumbSchema, faqSchema, medicalWebPageSchema, offerCatalogSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { DoctorCard } from '@/components/cards';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex, StatGrid } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { byId, clinics, doctorsOfDepartment, servicesOfDepartment } from '@/content';
import { faq as allFaq } from '@/content/faq';
import { departmentCopy as C, servicesIndexCopy, sharedCopy } from '@/content/pages/services';
import {
  DepartmentArt,
  Disclaimer,
  ServiceMeta,
  TextLink,
  departmentRoute,
  serviceRoute,
} from '@/features/services/parts';
import type { Localized } from '@/i18n';
import type { Department } from '@/types';

export interface DepartmentStep {
  id: string;
  title: Localized;
  text: Localized;
}

export interface DepartmentPageProps {
  department: Department;
  /** Breadcrumb + navigation label for this page. */
  navLabel: string;
  /** Conditions or reasons a patient comes to this department. */
  indications: Localized[];
  /** Ordered stages of care, told as a pinned scroll story. */
  steps: DepartmentStep[];
  /** FAQ topics to surface on this page. */
  faqTopics: string[];
}

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Shared layout for the six specialty pages, in the Figma editorial language:
 * forest hero with the department photograph, a scroll-lit description with
 * the reasons patients come, the visit told as a pinned story, the service
 * bento (every card opens its /services/:slug page), the team and the FAQ.
 *
 * Each page supplies its own clinical content; structure, motion and SEO are
 * defined once here so the six pages cannot drift apart.
 */
export const DepartmentPageTemplate = ({
  department,
  navLabel,
  indications,
  steps,
  faqTopics,
}: DepartmentPageProps) => {
  const { t, L, language } = useI18n();

  const services = servicesOfDepartment(department.id);
  const doctors = doctorsOfDepartment(department.id);
  const faqItems = allFaq.filter((item) => faqTopics.includes(item.topic));
  const path = departmentRoute(department.id);
  const cities = department.clinicIds
    .map((id) => byId(clinics, id))
    .filter((clinic): clinic is NonNullable<typeof clinic> => Boolean(clinic))
    .map((clinic) => L(clinic.city));
  const description = L(department.description);

  let n = 0;
  const next = () => (n += 1);

  return (
    <>
      <Seo
        title={navLabel}
        descriptionSource={description}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.departments, url: ROUTES.departments },
            { name: navLabel, url: path },
          ]),
          // A department is a page about a specialty, not a procedure:
          // Seo.tsx's medicalProcedureSchema() hard-codes SurgicalProcedure,
          // which mislabelled diagnostics, optics and paediatrics. The
          // procedures themselves are typed on their /services/:slug pages.
          medicalWebPageSchema({
            title: navLabel,
            description: L(department.short),
            path,
            language,
          }),
          ...(services.length
            ? [offerCatalogSchema(services.map((service) => ({ name: L(service.name), price: service.price })))]
            : []),
          ...(faqItems.length > 0
            ? [
                faqSchema(
                  faqItems.map((item) => ({
                    question: L(item.question),
                    answer: L(item.answer),
                  })),
                ),
              ]
            : []),
        ]}
      />

      <PageHero
        eyebrow={[L(C.eyebrow), ...cities].join(' · ')}
        title={navLabel}
        text={L(department.short)}
        crumbs={[{ label: t.nav.departments, to: ROUTES.departments }, { label: navLabel }]}
        actions={
          <>
            <HeroLink to={`${ROUTES.appointment}?department=${department.slug}`}>
              {t.common.bookNow}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.pricing} muted>
              {t.nav.pricing}
            </HeroLink>
          </>
        }
        aside={<DepartmentArt id={department.id} tone="dark" className="svc-art--hero" />}
      />

      {/* -------------------------------------------------- 01 · ABOUT */}
      <Section aria-labelledby="dept-about">
        <Container>
          <SectionIndex n={next()} label={L(C.aboutLabel)} />
          <div className="svc-dept-about">
            <div className="svc-dept-about__text">
              <SectionHead id="dept-about" title={L(C.aboutTitle)} />
              <TextFill text={L(department.description)} className="svc-dept-about__fill" />
            </div>
            <Reveal variant="left" className="oph-panel svc-dept-about__panel">
              <p className="oph-eyebrow">{L(C.indicationsTitle)}</p>
              <Stagger as="ul" className="oph-ringlist" step={70}>
                {indications.map((item) => (
                  <Reveal as="li" key={item.ru} variant="left">
                    {L(item)}
                  </Reveal>
                ))}
              </Stagger>
            </Reveal>
          </div>
          <div className="svc-block">
            <StatGrid
              // Facts from this page's own content — not headcounts or
              // branch numbers, which are demo/unverified (DESIGN.md §7).
              stats={[
                { value: services.length, label: L(C.statServices) },
                { value: steps.length, label: L(C.statSteps) },
                ...(faqItems.length ? [{ value: faqItems.length, label: L(C.statAnswers) }] : []),
              ]}
            />
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------- 02 · STEPS */}
      {steps.length > 0 ? (
        <Section tone="deep" aria-labelledby="dept-steps">
          <Container>
            <SectionIndex n={next()} label={L(C.stepsLabel)} onDark />
            <SectionHead id="dept-steps" title={L(C.stepsTitle)} />
            <div className="svc-block">
              <StickyStory
                className="svc-story"
                visual={(active) => (
                  <div className="svc-storyvis">
                    {/* Always painted: the pinned frame is never a blank
                        viewport waiting for a photo to reveal. */}
                    <div className="svc-storyvis__media svc-storyvis__media--art">
                      <DepartmentArt id={department.id} tone="dark" />
                    </div>
                    <div className="svc-storyvis__card" aria-hidden="true">
                      <span className="svc-storyvis__n">
                        {pad(active + 1)}
                        <small>/{pad(steps.length)}</small>
                      </span>
                      <span className="svc-storyvis__title">{L(steps[active]?.title ?? steps[0].title)}</span>
                      <span className="svc-storyvis__bar">
                        <span style={{ transform: `scaleX(${(active + 1) / steps.length})` }} />
                      </span>
                    </div>
                  </div>
                )}
              >
                {steps.map((step, index) => (
                  <div key={step.id} className="svc-chapter">
                    <span className="svc-chapter__n">
                      {L(C.stepWord)} {pad(index + 1)}
                    </span>
                    <h3 className="svc-chapter__title">{L(step.title)}</h3>
                    <p className="svc-chapter__text">{L(step.text)}</p>
                  </div>
                ))}
              </StickyStory>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ----------------------------------------------- 03 · SERVICES */}
      <Section aria-labelledby="dept-services">
        <Container>
          <SectionIndex n={next()} label={L(C.servicesLabel)} />
          <SectionHead id="dept-services" title={L(C.servicesTitle)} />
          <div className="svc-block">
            {services.length > 0 ? (
              <EditorialGrid>
                {services.map((service, index) => (
                  <EditorialCard
                    key={service.id}
                    index={index + 1}
                    title={L(service.name)}
                    text={L(service.short)}
                    to={serviceRoute(service.slug)}
                    linkLabel={L(sharedCopy.aboutService)}
                    meta={<ServiceMeta service={service} />}
                  />
                ))}
              </EditorialGrid>
            ) : (
              <p className="svc-empty">{t.common.nothingFoundText}</p>
            )}
          </div>
          <Reveal variant="fade" className="svc-after-grid">
            <TextLink to={ROUTES.services}>{L(servicesIndexCopy.title)}</TextLink>
          </Reveal>
        </Container>
      </Section>

      {/* ------------------------------------------------ 04 · DOCTORS */}
      {doctors.length > 0 ? (
        <Section tone="tint" aria-labelledby="dept-doctors">
          <Container>
            <SectionIndex n={next()} label={L(C.doctorsLabel)} />
            <div
              className={`svc-team svc-team--n${Math.min(doctors.length, 4)} ${doctors.length < 4 ? 'svc-team--duo' : ''}`}
              style={{ ['--count' as string]: Math.min(doctors.length, 4) }}
            >
              <SectionHead
                id="dept-doctors"
                title={L(C.doctorsTitle)}
                aside={doctors.length < 4 ? undefined : <TextLink to={ROUTES.doctors}>{t.common.allDoctors}</TextLink>}
                text={doctors.length < 4 ? <TextLink to={ROUTES.doctors}>{t.common.allDoctors}</TextLink> : undefined}
              />
              <Stagger className="svc-doctors svc-doctors--rail" step={90}>
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </Stagger>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* ---------------------------------------------------- 05 · FAQ */}
      {faqItems.length > 0 ? (
        <Section aria-labelledby="dept-faq">
          <Container>
            <SectionIndex n={next()} label={L(C.faqLabel)} />
            <div className="svc-faq">
              <SectionHead id="dept-faq" title={L(C.faqTitle)} />
              <Reveal variant="up">
                <Accordion
                  items={faqItems.map((item) => ({
                    id: item.id,
                    question: L(item.question),
                    answer: L(item.answer),
                  }))}
                />
              </Reveal>
            </div>
            <Disclaimer />
          </Container>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
};
