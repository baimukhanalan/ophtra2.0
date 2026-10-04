import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CreditCard, Receipt, Search, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Alert, Button, Container, EmptyState, Input, Section } from '@/ui';
import { Reveal, Stagger } from '@/motion';
import { Seo, breadcrumbSchema, offerCatalogSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { EditorialCard, EditorialGrid, FeatureTile, SectionHead, SectionIndex } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { departments, priceGroups, programs, services } from '@/content';
import { pricingCopy as C, servicesIndexCopy, sharedCopy } from '@/content/pages/services';
import {
  DepartmentArt,
  Disclaimer,
  FromPrice,
  SHOW_DEMO_NOTICES,
  bookServiceRoute,
  departmentRoute,
  serviceRoute,
} from '@/features/services/parts';
import { loadServiceContent } from '@/content/pages/services-content';

/**
 * Price list styled per Figma: paper panel with search and department chips,
 * then one hairline table per department under a serif group title. Each
 * service name opens its page; «Записаться» deep-links the booking wizard.
 * Tables stack into cards on phones.
 */
const PricingPage = () => {
  const { t, L, formatPrice } = useI18n();
  const [query, setQuery] = useState('');
  const [departmentId, setDepartmentId] = useState('all');
  const deferredQuery = useDeferredValue(query);

  const groups = useMemo(() => {
    const needle = deferredQuery.trim().toLocaleLowerCase();
    return priceGroups()
      .filter((group) => departmentId === 'all' || group.department.id === departmentId)
      .map((group) => ({
        ...group,
        services: group.services.filter(
          (service) =>
            !needle ||
            L(service.name).toLocaleLowerCase().includes(needle) ||
            L(service.short).toLocaleLowerCase().includes(needle),
        ),
      }))
      .filter((group) => group.services.length > 0);
  }, [deferredQuery, departmentId, L]);

  const found = groups.reduce((sum, group) => sum + group.services.length, 0);
  const filtered = query.trim() !== '' || departmentId !== 'all';

  const reset = () => {
    setQuery('');
    setDepartmentId('all');
  };

  return (
    <>
      <Seo
        title={t.nav.pricing}
        description={L(C.lead)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.pricing, url: ROUTES.pricing },
          ]),
          offerCatalogSchema(services.map((service) => ({ name: L(service.name), price: service.price }))),
        ]}
      />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={t.nav.pricing}
        text={L(C.lead)}
        crumbs={[{ label: t.nav.pricing }]}
        aside={<DepartmentArt id="tenge" tone="dark" className="svc-art--hero" />}
        actions={
          <>
            <HeroLink to={ROUTES.appointment}>
              {t.common.bookNow}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.promotions} muted>
              {t.nav.promotions}
            </HeroLink>
          </>
        }
      />

      {/* ---------------------------------------------------- 01 · PRICES */}
      <Section aria-labelledby="pricing-list">
        <Container>
          <SectionIndex n={1} label={L(C.listLabel)} />
          <SectionHead
            id="pricing-list"
            title={L(C.listTitle)}
            aside={
              <p className="svc-count" aria-live="polite">
                {L(C.found)}: <strong>{found}</strong>
              </p>
            }
          />

          <Reveal variant="up" className="oph-panel svc-pricefilter">
            <form role="search" onSubmit={(event) => event.preventDefault()}>
              <Input
                label={L(C.searchLabel)}
                type="search"
                placeholder={L(C.searchPlaceholder)}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                icon={<Search size={18} aria-hidden="true" />}
              />
            </form>
            <div className="svc-pricefilter__row">
              <div className="oph-chips" role="group" aria-label={t.common.department}>
                <button
                  type="button"
                  className="oph-chip"
                  aria-pressed={departmentId === 'all'}
                  onClick={() => setDepartmentId('all')}
                >
                  {t.common.all}
                </button>
                {departments.map((department) => (
                  <button
                    key={department.id}
                    type="button"
                    className="oph-chip"
                    aria-pressed={departmentId === department.id}
                    onClick={() => setDepartmentId(department.id)}
                  >
                    {L(department.name)}
                  </button>
                ))}
              </div>
              {filtered ? (
                <Button variant="ghost" size="sm" onClick={reset}>
                  {t.common.reset}
                </Button>
              ) : null}
            </div>
          </Reveal>

          <div className="svc-block">
            {groups.length > 0 ? (
              <div className="svc-pricegroups">
                {groups.map((group) => (
                  <Reveal key={group.department.id} variant="up" className="svc-pricegroup">
                    <div className="svc-pricegroup__head">
                      <h3 className="svc-pricegroup__title">{L(group.department.name)}</h3>
                      <Link className="svc-textlink" to={departmentRoute(group.department.id)}>
                        {L(sharedCopy.aboutDepartment)}
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                    <table className="svc-pricetable">
                      <caption className="oph-visually-hidden">{L(group.department.name)}</caption>
                      <thead>
                        <tr>
                          <th scope="col">{t.common.service}</th>
                          <th scope="col">{t.common.duration}</th>
                          <th scope="col">{t.common.price}</th>
                          <th scope="col">
                            <span className="oph-visually-hidden">{t.common.book}</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.services.map((service) => (
                          <tr key={service.id}>
                            <th scope="row" className="svc-pricetable__name">
                              <Link
                                to={serviceRoute(service.slug)}
                                onPointerEnter={() => void loadServiceContent(service.slug)}
                                onFocus={() => void loadServiceContent(service.slug)}
                              >
                                {L(service.name)}
                              </Link>
                              <span>{L(service.short)}</span>
                            </th>
                            <td className="svc-pricetable__time" data-label={t.common.duration}>
                              {service.duration} {L(sharedCopy.minutes)}
                            </td>
                            <td className="svc-pricetable__price" data-label={t.common.price}>
                              <FromPrice>{formatPrice(service.price)}</FromPrice>
                            </td>
                            <td className="svc-pricetable__action">
                              <Link
                                className="svc-textlink"
                                to={bookServiceRoute(service.slug)}
                                aria-label={`${t.common.book}: ${L(service.name)}`}
                              >
                                {t.common.book}
                                <ArrowRight size={15} aria-hidden="true" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Reveal>
                ))}
              </div>
            ) : (
              <EmptyState
                title={t.common.nothingFound}
                text={t.common.nothingFoundText}
                action={
                  <Button variant="outline" onClick={reset}>
                    {t.common.reset}
                  </Button>
                }
              />
            )}
          </div>

          {/* Payment-sandbox wording is for the demo build only (audit S6/X12). */}
          {SHOW_DEMO_NOTICES ? (
            <div className="svc-block">
              <Alert tone="info">{t.payments.demoNotice}</Alert>
            </div>
          ) : null}
        </Container>
      </Section>

      {/* -------------------------------------------------- 02 · PROGRAMS */}
      <Section tone="tint" aria-labelledby="pricing-programs">
        <Container>
          <SectionIndex n={2} label={L(C.programsLabel)} />
          <SectionHead id="pricing-programs" title={L(C.programsTitle)} text={L(C.programsText)} />
          <div className="svc-block">
            <EditorialGrid>
              {programs.map((program) => (
                <EditorialCard
                  key={program.id}
                  eyebrow={L(program.duration)}
                  title={L(program.name)}
                  text={L(program.short)}
                  to={ROUTES.programs}
                  linkLabel={L(sharedCopy.aboutProgram)}
                  meta={<span className="svc-meta__price">{formatPrice(program.price)}</span>}
                />
              ))}
            </EditorialGrid>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------- 03 · PAYMENT */}
      <Section aria-labelledby="pricing-pay">
        <Container>
          <SectionIndex n={3} label={L(C.payLabel)} />
          <SectionHead id="pricing-pay" title={L(C.payTitle)} />
          <Stagger className="oph-ftiles svc-block" step={100}>
            <Reveal variant="up">
              <FeatureTile icon={<CreditCard size={20} />} title={L(C.pay1)} text={L(C.pay1Text)} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<Receipt size={20} />} title={L(C.pay2)} text={L(C.pay2Text)} />
            </Reveal>
            <Reveal variant="up">
              <FeatureTile icon={<ShieldCheck size={20} />} title={L(C.pay3)} text={L(C.pay3Text)} />
            </Reveal>
          </Stagger>
          <p className="svc-after-grid">
            <Link className="svc-textlink" to={ROUTES.services}>
              {L(servicesIndexCopy.title)}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </p>
          <Disclaimer />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default PricingPage;
