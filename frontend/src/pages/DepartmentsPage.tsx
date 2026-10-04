import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { Reveal, StackCards, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { SectionHead, SectionIndex, StatGrid } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { departments, programs, services, servicesOfDepartment } from '@/content';
import { departmentsCopy as C, sharedCopy } from '@/content/pages/services';
import {
  CareOrbit,
  DepartmentArt,
  SITE_ORIGIN,
  ServiceMeta,
  TextLink,
  departmentRoute,
  serviceRoute,
  NamedSection,
} from '@/features/services/parts';

/**
 * Departments overview: statement beside the «one record, six teams» orbit
 * (drawn, not another facade photograph), then the six
 * departments as sticky stacking sheets — each lists its services (linking to
 * /services/:slug) and opens its own page — and the centre in figures.
 */
const DepartmentsPage = () => {
  const { t, L } = useI18n();

  return (
    <>
      <Seo
        title={t.nav.departments}
        descriptionSource={L(C.lead)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.departments, url: ROUTES.departments },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: departments.map((department, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: L(department.name),
              url: `${SITE_ORIGIN}${departmentRoute(department.id)}`,
            })),
          },
        ]}
      />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={t.nav.departments}
        text={L(C.lead)}
        crumbs={[{ label: t.nav.departments }]}
        aside={<DepartmentArt id="network" tone="dark" className="svc-art--hero" />}
        actions={
          <>
            <HeroLink to={ROUTES.appointment}>
              {t.common.bookNow}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.services} muted>
              {L(sharedCopy.allServices)}
            </HeroLink>
          </>
        }
      />

      {/* ----------------------------------------------- 01 · STATEMENT */}
      <NamedSection label={L(C.statementLabel)}>
        <Container>
          <SectionIndex n={1} label={L(C.statementLabel)} />
          <div className="oph-duo svc-statement svc-statement--light">
            <TextFill text={L(C.statement)} className="svc-statement__text" />
            <Reveal variant="scale">
              <CareOrbit
                center={L(C.orbitCenter)}
                items={departments.map((department) => ({ id: department.id, label: L(department.name) }))}
              />
            </Reveal>
          </div>
        </Container>
      </NamedSection>

      {/* ---------------------------------------------------- 02 · LIST */}
      <Section tone="tint" aria-labelledby="departments-list">
        <Container>
          <SectionIndex n={2} label={L(C.listLabel)} />
          <SectionHead id="departments-list" title={L(C.listTitle)} text={t.home.directionsText} />
          <div className="svc-block">
            <StackCards>
              {departments.map((department, index) => {
                const list = servicesOfDepartment(department.id);
                return (
                  <article key={department.id} className="svc-sheet" aria-labelledby={`dept-${department.id}`}>
                    <div className="svc-sheet__media svc-sheet__media--art" data-tone={index % 2 ? 'dark' : 'light'}>
                      <DepartmentArt id={department.id} tone={index % 2 ? 'dark' : 'light'} />
                    </div>
                    <div className="svc-sheet__body">
                      <span className="svc-sheet__n">{String(index + 1).padStart(2, '0')}</span>
                      <h3 id={`dept-${department.id}`} className="svc-sheet__title">
                        {L(department.name)}
                      </h3>
                      <p className="svc-sheet__text">{L(department.description)}</p>
                      {list.length ? (
                        <ul className="svc-sheet__services">
                          {list.map((service) => (
                            <li key={service.id}>
                              <Link to={serviceRoute(service.slug)}>
                                <span>{L(service.name)}</span>
                                <span className="svc-meta">
                                  <ServiceMeta service={service} />
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <TextLink to={departmentRoute(department.id)}>{L(sharedCopy.aboutDepartment)}</TextLink>
                    </div>
                  </article>
                );
              })}
            </StackCards>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------- 03 · FIGURES */}
      <Section tone="deep" aria-labelledby="departments-figures">
        <Container>
          <SectionIndex n={3} label={L(C.figuresLabel)} onDark />
          <SectionHead id="departments-figures" title={L(C.figuresTitle)} />
          <div className="svc-block">
            <StatGrid
              band
              // Only figures the site itself can vouch for (its own catalogue);
              // headcounts and history are not verified (DESIGN.md §7).
              stats={[
                { value: departments.length, label: L(C.statDepartments) },
                { value: services.length, label: L(C.statServices) },
                { value: programs.length, label: L(C.statPrograms) },
              ]}
            />
          </div>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default DepartmentsPage;
