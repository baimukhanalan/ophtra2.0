import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { Seo } from '@/seo/Seo';
import { PageHero, HeroLink } from '@/components/PageHero';
import { EditorialCard, EditorialGrid, SectionHead, SectionIndex } from '@/components/editorial';
import { CtaBand } from '@/components/CtaBand';
import { ROUTES } from '@/app/navigation';
import { notFoundCopy as C } from '@/content/pages/overlays';

/** Page-specific hero visual (L1): the ring motif, broken — a path that ends. */
const BrokenRing = () => (
  <div className="oph-heromark" aria-hidden="true">
    <svg viewBox="0 0 200 200" className="oph-heromark__svg">
      <path d="M100 8a92 92 0 1 1-86.4 60.6" className="oph-heromark__ring" />
      <path d="M100 30a70 70 0 1 0 66 46.7" className="oph-heromark__ring oph-heromark__ring--soft" />
    </svg>
    <span className="oph-heromark__glyph oph-heromark__glyph--sm">404</span>
  </div>
);

/**
 * 404 in the Figma language: forest hero with a broken ring, then the four
 * destinations such links usually meant, as an editorial bento.
 */
const NotFoundPage = () => {
  const { t, L } = useI18n();

  const destinations = [
    { title: C.services, text: C.servicesText, to: ROUTES.services },
    { title: C.doctors, text: C.doctorsText, to: ROUTES.doctors },
    { title: C.knowledge, text: C.knowledgeText, to: ROUTES.knowledge },
    { title: C.contacts, text: C.contactsText, to: ROUTES.contacts },
  ];

  return (
    <>
      <Seo title={L(C.title)} description={L(C.lead)} noIndex />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={L(C.title)}
        text={L(C.lead)}
        crumbs={[{ label: '404' }]}
        aside={<BrokenRing />}
        actions={
          <>
            <HeroLink to={ROUTES.home}>{L(C.home)} →</HeroLink>
            <HeroLink to={ROUTES.appointment} muted>
              {t.common.bookNow}
            </HeroLink>
          </>
        }
      />

      <Section aria-labelledby="notfound-where" className="oph-notfound">
        <Container>
          <SectionIndex n={1} label={L(C.where)} />
          <SectionHead id="notfound-where" title={L(C.where)} size="sm" />
          <EditorialGrid>
            {destinations.map((item, index) => (
              <EditorialCard
                key={item.to}
                index={index + 1}
                title={L(item.title)}
                text={L(item.text)}
                to={item.to}
                linkLabel={L(C.open)}
              />
            ))}
          </EditorialGrid>
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};

export default NotFoundPage;
