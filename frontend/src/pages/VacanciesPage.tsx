import { useState } from 'react';
import { ArrowDown, ArrowRight, Briefcase, MapPin, Wallet } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, EmptyState, Section } from '@/ui';
import { ClipReveal, Reveal, Stagger } from '@/motion';
import { Seo, breadcrumbSchema, jobPostingSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { LeadForm } from '@/components/LeadForm';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex, StepFlow } from '@/components/editorial';
import { Photo } from '@/components/Photo';
import { ROUTES } from '@/app/navigation';
import { byId, clinics, site } from '@/content';
import { publishedVacancies } from '@/content/vacancies';
import { VACANCIES } from '@/content/pages/people';

const VacanciesPage = () => {
  const { t, L, language } = useI18n();
  const vacancies = publishedVacancies();
  // «Откликнуться» pre-fills the open application with the position instead
  // of opening a mail client (the public e-mail is a placeholder for now).
  const [position, setPosition] = useState('');

  const applyFor = (title: string) => {
    setPosition(title);
    window.requestAnimationFrame(() => {
      document.getElementById('vacancies-apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => {
        document.querySelector<HTMLInputElement>('#vacancies-apply input:not([type="hidden"]):not([tabindex="-1"])')?.focus({ preventScroll: true });
      }, 500);
    });
  };

  return (
    <>
      <Seo
        title={t.nav.vacancies}
        description={L(VACANCIES.lead)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.about, url: ROUTES.about },
            { name: t.nav.vacancies, url: ROUTES.vacancies },
          ]),
          ...vacancies.map((vacancy) => {
            const clinic = byId(clinics, vacancy.clinicId);
            return jobPostingSchema({
              title: L(vacancy.title),
              description: (vacancy.requirements[language] ?? vacancy.requirements.ru).join('. '),
              employment: L(vacancy.employment),
              city: clinic ? L(clinic.city) : 'Астана',
            });
          }),
        ]}
      />

      <PageHero
        eyebrow={L(VACANCIES.eyebrow)}
        title={t.nav.vacancies}
        text={L(VACANCIES.lead)}
        crumbs={[{ label: t.nav.aboutClinic, to: ROUTES.about }, { label: t.nav.vacancies }]}
        actions={
          <>
            <HeroLink to="#vacancies-open">
              {L(VACANCIES.toOpenings)}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={`mailto:${site.organization.email}`} external muted>
              {t.contacts.writeUs}
            </HeroLink>
          </>
        }
      />

      {/* 01 ------------------------------------------------------ WHY */}
      <Section aria-labelledby="vacancies-why">
        <Container>
          <SectionIndex n={1} />
          <SectionHead id="vacancies-why" eyebrow={L(VACANCIES.whyEyebrow)} title={L(VACANCIES.whyTitle)} />
          <EditorialGrid>
            {VACANCIES.why.map((item, index) => (
              <EditorialCard key={item.title.en} index={index + 1} title={L(item.title)} text={L(item.text)} />
            ))}
          </EditorialGrid>
        </Container>
      </Section>

      {/* 02 ------------------------------------------------- OPENINGS */}
      <Section tone="tint" id="vacancies-open" aria-labelledby="vacancies-list" className="ppl-anchor">
        <Container>
          <SectionIndex n={2} />
          <SectionHead
            id="vacancies-list"
            eyebrow={L(VACANCIES.openingsEyebrow)}
            title={L(VACANCIES.toOpenings)}
            aside={
              <p className="ppl-count">
                {t.nav.vacancies}: <strong>{vacancies.length}</strong>
              </p>
            }
          />

          {vacancies.length ? (
            <Stagger className="ppl-vacancies" step={110}>
              {vacancies.map((vacancy) => {
                const clinic = byId(clinics, vacancy.clinicId);
                const requirements = vacancy.requirements[language] ?? vacancy.requirements.ru;
                const offer = vacancy.offer[language] ?? vacancy.offer.ru;
                return (
                  <Reveal key={vacancy.id} as="article" variant="up" className="ppl-vacancy">
                    <header className="ppl-vacancy__head">
                      <div>
                        <h3 className="ppl-vacancy__title">{L(vacancy.title)}</h3>
                        <ul className="ppl-vacancy__meta">
                          <li>
                            <Wallet size={15} aria-hidden="true" />
                            {L(vacancy.salary)}
                          </li>
                          <li>
                            <Briefcase size={15} aria-hidden="true" />
                            {L(vacancy.employment)}
                          </li>
                          {clinic ? (
                            <li>
                              <MapPin size={15} aria-hidden="true" />
                              {L(clinic.name)}
                            </li>
                          ) : null}
                        </ul>
                      </div>
                      <a
                        className="ppl-vacancy__apply"
                        href="#vacancies-apply"
                        onClick={(event) => {
                          event.preventDefault();
                          applyFor(L(vacancy.title));
                        }}
                        aria-label={`${L(VACANCIES.apply)}: ${L(vacancy.title)}`}
                      >
                        {L(VACANCIES.apply)}
                        <ArrowDown size={16} aria-hidden="true" />
                      </a>
                    </header>
                    <div className="ppl-vacancy__cols">
                      <div>
                        <p className="ppl-filterrow__label">{L(VACANCIES.requirements)}</p>
                        <ul className="oph-ringlist">
                          {requirements.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="ppl-filterrow__label">{L(VACANCIES.offer)}</p>
                        <ul className="oph-ringlist">
                          {offer.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </Stagger>
          ) : (
            <EmptyState
              title={L(VACANCIES.emptyTitle)}
              text={L(VACANCIES.emptyText)}
              icon={<Briefcase size={28} />}
            />
          )}
        </Container>
      </Section>

      {/* 03 -------------------------------------------------- PROCESS */}
      <Section tone="deep" className="ppl-darkflow" aria-labelledby="vacancies-process">
        <Container>
          <SectionIndex n={3} onDark />
          <SectionHead id="vacancies-process" eyebrow={L(VACANCIES.processEyebrow)} title={L(VACANCIES.processTitle)} />
          <StepFlow steps={VACANCIES.process.map((step) => ({ title: L(step.title), text: L(step.text) }))} />
        </Container>
      </Section>

      {/* 04 ----------------------------------------- OPEN APPLICATION */}
      <Section id="vacancies-apply" aria-labelledby="vacancies-apply-title" className="ppl-anchor">
        <Container>
          <SectionIndex n={4} />
          <div className="ppl-formsplit">
            <div className="ppl-formsplit__intro">
              <SectionHead
                id="vacancies-apply-title"
                eyebrow={L(VACANCIES.formEyebrow)}
                title={L(VACANCIES.formTitle)}
                text={L(VACANCIES.formText)}
                size="sm"
              />
              <ClipReveal className="ppl-formsplit__media">
                <Photo src="/media/clinic-evening.jpg" alt="" width={1440} height={1085} sizes="(max-width: 900px) 100vw, 40vw" />
              </ClipReveal>
            </div>
            <Reveal variant="up" className="oph-panel">
              <LeadForm
                source="careers"
                submitLabel={L(VACANCIES.submit)}
                extraFields={[{ name: 'position', label: VACANCIES.fieldPosition, required: true }]}
                initialValues={position ? { position } : undefined}
                commentLabel={VACANCIES.commentLabel}
                withFiles
                filesLabel={VACANCIES.filesLabel}
                filesHint={VACANCIES.filesHint}
              />
            </Reveal>
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default VacanciesPage;
