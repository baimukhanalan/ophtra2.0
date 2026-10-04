import { Link } from 'react-router-dom';
import { ArrowRight, CalendarClock } from 'lucide-react';
import { useI18n } from '@/i18n';
import { Accordion, ButtonLink, Container, EmptyState, Section } from '@/ui';
import { Reveal, TextFill } from '@/motion';
import { Seo, breadcrumbSchema } from '@/seo/Seo';
import { HeroLink, PageHero } from '@/components/PageHero';
import { CtaBand } from '@/components/CtaBand';
import { EditorialGrid, SectionHead, SectionIndex } from '@/components/editorial';
import { ROUTES } from '@/app/navigation';
import { byId, services } from '@/content';
import { activePromotions } from '@/content/promotions';
import { promotionTitles, promotionsCopy as C, sharedCopy } from '@/content/pages/services';
import type { Promotion } from '@/types';
import { DepartmentArt, Disclaimer, NamedSection, bookServiceRoute, serviceRoute } from '@/features/services/parts';

/** «−20%» in any position of a title, with the Russian «на» that follows it. */
const BADGE_IN_TITLE = /\s*[−-]\s?\d+\s?%\s*(?:на\s+)?/u;

/**
 * Promotions: bento of current offers, a scroll-lit statement that the
 * standard of care never changes, and the full terms in an accordion. Empty
 * state points to fixed-price programmes.
 *
 * Audit S4/S5: the discount is static text (a counter passed through «−96 %»
 * on its way to a free consultation), a 100 % offer reads «Бесплатно», titles
 * no longer repeat the badge, and every card has a second link.
 */
const PromotionsPage = () => {
  const { t, L, formatDate } = useI18n();
  const promotions = activePromotions();

  const titleOf = (promotion: Promotion) => {
    const override = promotionTitles[promotion.id];
    if (override) return L(override);
    const raw = L(promotion.title);
    const stripped = raw.replace(BADGE_IN_TITLE, ' ').trim();
    return stripped ? stripped.charAt(0).toLocaleUpperCase() + stripped.slice(1) : raw;
  };

  return (
    <>
      <Seo
        title={t.nav.promotions}
        description={L(C.lead)}
        jsonLd={[
          breadcrumbSchema([
            { name: t.common.breadcrumbHome, url: ROUTES.home },
            { name: t.nav.promotions, url: ROUTES.promotions },
          ]),
          ...(promotions.length
            ? [
                {
                  '@context': 'https://schema.org',
                  '@type': 'OfferCatalog',
                  name: t.nav.promotions,
                  itemListElement: promotions.map((promotion) => ({
                    '@type': 'Offer',
                    name: titleOf(promotion),
                    description: L(promotion.short),
                    validFrom: promotion.validFrom,
                    priceValidUntil: promotion.validTo,
                  })),
                },
              ]
            : []),
        ]}
      />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={t.nav.promotions}
        text={L(C.lead)}
        crumbs={[{ label: t.nav.promotions }]}
        aside={<DepartmentArt id="percent" tone="dark" className="svc-art--hero" />}
        actions={
          <>
            <HeroLink to={ROUTES.appointment}>
              {t.common.bookNow}
              <ArrowRight size={16} aria-hidden="true" />
            </HeroLink>
            <HeroLink to={ROUTES.pricing} muted>
              {t.nav.pricing}
            </HeroLink>
          </>
        }
      />

      {/* ------------------------------------------------------ 01 · LIST */}
      <Section aria-labelledby="promotions-list">
        <Container>
          <SectionIndex n={1} label={L(C.listLabel)} />
          <SectionHead id="promotions-list" title={L(C.listTitle)} />
          <div className="svc-block">
            {promotions.length > 0 ? (
              <EditorialGrid>
                {promotions.map((promotion) => {
                  const service = promotion.serviceIds.map((id) => byId(services, id)).find(Boolean);
                  return (
                    <article key={promotion.id} className="svc-promo" aria-labelledby={`promo-${promotion.id}`}>
                      {promotion.discount >= 100 ? (
                        <p className="svc-promo__off svc-promo__off--free">
                          {L(C.free)}
                          <small>{L(C.freeNote)}</small>
                        </p>
                      ) : (
                        <p className="svc-promo__off">
                          <span>−{promotion.discount}%</span>
                          <small>{L(C.off)}</small>
                        </p>
                      )}
                      <h3 id={`promo-${promotion.id}`} className="oph-ecard__title">
                        {titleOf(promotion)}
                      </h3>
                      <p className="oph-ecard__text">{L(promotion.short)}</p>
                      <p className="svc-promo__valid">
                        <CalendarClock size={14} aria-hidden="true" />
                        {L(C.validTo)} {formatDate(promotion.validTo)}
                      </p>
                      <div className="svc-promo__actions">
                        <ButtonLink
                          to={service ? bookServiceRoute(service.slug) : ROUTES.appointment}
                          variant="primary"
                          size="sm"
                        >
                          {L(C.bookOffer)}
                        </ButtonLink>
                        {service ? (
                          <Link className="svc-textlink" to={serviceRoute(service.slug)}>
                            {L(sharedCopy.aboutService)}
                            <ArrowRight size={15} aria-hidden="true" />
                          </Link>
                        ) : (
                          <Link className="svc-textlink" to={ROUTES.contacts}>
                            {L(C.discussTerms)}
                            <ArrowRight size={15} aria-hidden="true" />
                          </Link>
                        )}
                      </div>
                    </article>
                  );
                })}
              </EditorialGrid>
            ) : (
              <EmptyState
                title={L(C.emptyTitle)}
                text={L(C.emptyText)}
                action={
                  <ButtonLink to={ROUTES.programs} variant="outline">
                    {t.nav.programs}
                  </ButtonLink>
                }
              />
            )}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------- 02 · STATEMENT */}
      <NamedSection tone="deep" label={L(C.statementLabel)}>
        <Container>
          <SectionIndex n={2} label={L(C.statementLabel)} onDark />
          <TextFill text={L(C.statement)} className="svc-statement__text svc-statement__text--wide" />
        </Container>
      </NamedSection>

      {/* ----------------------------------------------------- 03 · TERMS */}
      {promotions.length > 0 ? (
        <Section tone="tint" aria-labelledby="promotions-terms">
          <Container>
            <SectionIndex n={3} label={L(C.termsLabel)} />
            <div className="svc-faq">
              <SectionHead id="promotions-terms" title={L(C.termsTitle)} />
              <Reveal variant="up">
                <Accordion
                  items={promotions.map((promotion) => ({
                    id: promotion.id,
                    question: titleOf(promotion),
                    answer: L(promotion.description),
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

export default PromotionsPage;
