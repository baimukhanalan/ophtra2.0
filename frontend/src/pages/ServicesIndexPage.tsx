import { useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Container, EmptyState, Section } from '@/ui';
import { Reveal, TextFill } from '@/motion';
import { Seo, breadcrumbSchema, offerCatalogSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex, StepFlow } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { departments, services, servicesOfDepartment } from '@/content';
import { servicesIndexCopy as C, serviceDetailCopy, sharedCopy } from '@/content/pages/services';
import { loadServiceContent } from '@/content/pages/services-content';
import {
  DepartmentArt,
  Disclaimer,
  ServiceMeta,
  TextLink,
  departmentRoute,
  serviceRoute,
  NamedSection,
} from '@/features/services/parts';

/** Warm the per-service chunk while the pointer or focus is on a link. */
const prefetch = (slug: string) => () => {
  void loadServiceContent(slug);
};

/**
 * Figma «05 Услуги»: hero «Направления помощи», bento of the six areas, a
 * scroll-lit statement, the filterable catalogue of every service and the
 * patient path.
 *
 * Figma fixes: the hero title no longer breaks mid-word (PageHero sizes it by
 * length) and the bento rows are always full (EditorialGrid rebalances).
 * The unfiltered catalogue is an index of the six departments — six columns
 * of services, so rows are always full at 1, 2 or 3 columns — revealed as one
 * block rather than twenty staggered cards (UI/UX audit S1).
 */
const ServicesIndexPage = () => {
  const { t, L } = useI18n();
  const [params, setParams] = useSearchParams();
  const active = params.get('department') ?? 'all';
  const activeDepartment = departments.find((department) => department.slug === active);

  const visible = useMemo(
    () => (activeDepartment ? servicesOfDepartment(activeDepartment.id) : services),
    [activeDepartment],
  );

  // Phones: the chips are one swipeable row. A deep link such as
  // ?department=optical must show its pressed chip, so the row (never the
  // page) is scrolled to it.
  const chipsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = chipsRef.current;
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    const left = chip.getBoundingClientRect().left - row.getBoundingClientRect().left + row.scrollLeft;
    if (left < row.scrollLeft || left + chip.offsetWidth > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: Math.max(0, left - 16), behavior: 'auto' });
    }
  }, [active]);

  const select = (slug: string) => {
    const next = new URLSearchParams(params);
    if (slug === 'all') next.delete('department');
    else next.set('department', slug);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <>
      <Seo
        title={L(C.seoTitle)}
        description={L(C.seoDescription)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: L(C.seoTitle), url: ROUTES.services },
          ]),
          offerCatalogSchema(services.map((service) => ({ name: L(service.name), price: service.price }))),
        ]}
      />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={L(C.title)}
        text={L(C.lead)}
        crumbs={[{ label: L(C.seoTitle) }]}
        aside={<DepartmentArt id="catalogue" tone="dark" className="svc-art--hero" />}
        actions={
          <>
            <HeroLink to={ROUTES.appointment}>
              {t.common.bookNow}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.pricing} muted>
              {L(sharedCopy.pricesLink)}
            </HeroLink>
          </>
        }
      />

      {/* ------------------------------------------------ 01 · SIX AREAS */}
      <Section aria-labelledby="svc-areas">
        <Container>
          <SectionIndex n={1} label={L(C.areasLabel)} />
          <SectionHead id="svc-areas" title={L(C.areasTitle)} text={L(C.areasText)} />
          <div className="svc-block">
            <EditorialGrid>
              {departments.map((department, index) => (
                <EditorialCard
                  key={department.id}
                  index={index + 1}
                  eyebrow={`${L(sharedCopy.servicesCount)}: ${servicesOfDepartment(department.id).length}`}
                  title={L(department.name)}
                  text={L(department.short)}
                  to={departmentRoute(department.id)}
                  linkLabel={L(sharedCopy.aboutDepartment)}
                />
              ))}
            </EditorialGrid>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------- 02 · STATEMENT */}
      <NamedSection tone="deep" label={L(C.statementLabel)}>
        <Container>
          <SectionIndex n={2} label={L(C.statementLabel)} onDark />
          <div className="oph-duo svc-statement">
            <TextFill text={L(C.statement)} className="svc-statement__text" />
            <Reveal variant="scale" className="svc-statement__media svc-statement__media--art">
              <DepartmentArt id="diagnostics" tone="dark" />
            </Reveal>
          </div>
        </Container>
      </NamedSection>

      {/* ------------------------------------------------ 03 · CATALOGUE */}
      <Section aria-labelledby="svc-list">
        <Container>
          <SectionIndex n={3} label={L(C.listLabel)} />
          <SectionHead
            id="svc-list"
            title={L(C.listTitle)}
            aside={
              <p className="svc-count" aria-live="polite">
                {L(C.countLabel)}: <strong>{visible.length}</strong>
              </p>
            }
          />

          <Reveal variant="up" className="svc-filter">
            <div ref={chipsRef} className="oph-chips" role="group" aria-label={L(C.filterLabel)}>
              <button
                type="button"
                className="oph-chip"
                aria-pressed={!activeDepartment}
                onClick={() => select('all')}
              >
                {t.common.all}
              </button>
              {departments.map((department) => (
                <button
                  key={department.id}
                  type="button"
                  className="oph-chip"
                  aria-pressed={activeDepartment?.id === department.id}
                  onClick={() => select(department.slug)}
                >
                  {L(department.name)}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="svc-block">
            {!activeDepartment ? (
              <Reveal variant="up" className="svc-index">
                {departments.map((department, index) => (
                  <section key={department.id} className="svc-index__group" aria-labelledby={`svc-index-${department.id}`}>
                    <p className="svc-index__n" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 id={`svc-index-${department.id}`} className="svc-index__title">
                      <Link to={departmentRoute(department.id)}>{L(department.name)}</Link>
                    </h3>
                    <ul className="svc-index__list">
                      {servicesOfDepartment(department.id).map((service) => (
                        <li key={service.id}>
                          <Link
                            to={serviceRoute(service.slug)}
                            onPointerEnter={prefetch(service.slug)}
                            onFocus={prefetch(service.slug)}
                          >
                            <span className="svc-index__name">{L(service.name)}</span>
                            <span className="svc-meta">
                              <ServiceMeta service={service} />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </Reveal>
            ) : visible.length > 0 ? (
              <EditorialGrid key={active}>
                {visible.map((service) => (
                  <EditorialCard
                    key={service.id}
                    title={L(service.name)}
                    text={L(service.short)}
                    to={serviceRoute(service.slug)}
                    linkLabel={L(sharedCopy.aboutService)}
                    meta={<ServiceMeta service={service} />}
                  />
                ))}
              </EditorialGrid>
            ) : (
              <EmptyState title={t.common.nothingFound} text={t.common.nothingFoundText} />
            )}
          </div>

          {activeDepartment ? (
            <Reveal variant="fade" className="svc-after-grid">
              <TextLink to={departmentRoute(activeDepartment.id)}>{L(serviceDetailCopy.departmentLink)}</TextLink>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {/* ------------------------------------------------- 04 · PATH */}
      <Section tone="tint" aria-labelledby="svc-path">
        <Container>
          <SectionIndex n={4} label={L(C.pathLabel)} />
          <SectionHead id="svc-path" title={L(C.pathTitle)} />
          <div className="svc-block">
            <StepFlow
              steps={[
                { title: L(C.step1), text: L(C.step1Text) },
                { title: L(C.step2), text: L(C.step2Text) },
                { title: L(C.step3), text: L(C.step3Text) },
                { title: L(C.step4), text: L(C.step4Text) },
              ]}
            />
          </div>
          <Disclaimer />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default ServicesIndexPage;
