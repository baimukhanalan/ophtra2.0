import { useMemo, useState } from 'react';
import { useI18n } from '@/i18n';
import { Container, Section } from '@/ui';
import { Seo, SITE_URL, breadcrumbSchema } from '@/seo/Seo';
import { PageHero } from '@/components/PageHero';
import { ArticleBody, ContinueBox, SectionIndex, type ArticleSection } from '@/components/editorial';
import { CtaBand } from '@/components/CtaBand';
import { ROUTES } from '@/app/navigation';
import { resetAnalyticsConsent } from '@/services/analytics';
import { legalCopy as C } from '@/content/pages/platform';
import type { LegalDocument } from '@/types';

/**
 * Shared layout for the privacy policy and terms of use (Figma article
 * template: sticky contents + numbered sections).
 *
 * GDPR additions are appended to the privacy policy — data-subject rights,
 * special-category health data, cross-border transfers, cookie consent with a
 * working "change cookie settings" control, and the controller / DPO contact —
 * so the policy is valid for international patients, not only under the
 * Kazakhstan law.
 */
export const LegalPageTemplate = ({ document, path }: { document: LegalDocument; path: string }) => {
  const { t, L, formatDate } = useI18n();
  const [cookieReset, setCookieReset] = useState(false);
  const isPrivacy = path === ROUTES.privacy;

  const sections = useMemo<ArticleSection[]>(() => {
    const base: ArticleSection[] = document.sections.map((section) => ({
      id: section.id,
      title: L(section.title),
      body: <p>{L(section.body)}</p>,
    }));
    const controller: ArticleSection = {
      id: 'controller',
      title: L(C.controllerTitle),
      body: <p>{L(C.controllerBody)}</p>,
    };
    if (!isPrivacy) return [...base, controller];
    return [
      ...base,
      { id: 'gdpr-rights', title: L(C.gdprTitle), body: <p>{L(C.gdprBody)}</p> },
      {
        id: 'cookies',
        title: L(C.cookiesTitle),
        body: (
          <>
            <p>{L(C.cookiesBody)}</p>
            <p>
              <button
                type="button"
                className="oph-link oph-legal__cookiebtn"
                onClick={() => {
                  resetAnalyticsConsent();
                  setCookieReset(true);
                }}
              >
                {L(C.cookieSettings)} →
              </button>
            </p>
            {cookieReset ? (
              <p role="status" className="oph-legal__status">
                {L(C.cookieReset)}
              </p>
            ) : null}
          </>
        ),
      },
      controller,
    ];
  }, [document, L, isPrivacy, cookieReset]);

  const jsonLd = useMemo(
    () => [
      breadcrumbSchema([
        { name: t.common.breadcrumbHome, url: ROUTES.home },
        { name: L(document.title), url: path },
      ]),
      // A legal document is a plain WebPage, not medical content (SEO-10).
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: L(document.title),
        description: L(document.intro),
        url: `${SITE_URL}${path}`,
        dateModified: document.updated,
        isPartOf: { '@type': 'WebSite', url: SITE_URL },
      },
    ],
    [t.common.breadcrumbHome, L, document, path],
  );

  return (
    <>
      <Seo title={L(document.title)} description={L(document.intro)} jsonLd={jsonLd} />

      <PageHero
        eyebrow={L(C.eyebrow)}
        title={L(document.title)}
        text={L(document.intro)}
        crumbs={[{ label: L(document.title) }]}
        meta={
          <span>
            {L(C.updated)} <time dateTime={document.updated}>{formatDate(document.updated)}</time>
          </span>
        }
      />

      <Section aria-label={L(document.title)} className="oph-legal">
        <Container>
          <SectionIndex n={1} label={L(C.contents)} />
          <ArticleBody
            sections={sections}
            tocLabel={L(C.contents)}
            after={
              <ContinueBox
                title={L(C.questions)}
                links={[
                  isPrivacy
                    ? { label: t.nav.terms, to: ROUTES.terms }
                    : { label: t.nav.privacy, to: ROUTES.privacy },
                  { label: t.nav.contacts, to: ROUTES.contacts },
                  { label: t.nav.faq, to: ROUTES.faq },
                ]}
              />
            }
          />
        </Container>
      </Section>

      <CtaBand />
    </>
  );
};
