import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { LANGUAGES, LOCALE_TAGS } from '@/i18n/types';
import { site } from '@/content';

export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? site.organization.url;
export const BRAND = 'Ophthalmic Centre of Dr Kulmaganbetov';
const MAX_DESCRIPTION = 160;

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
    document.head.appendChild(element);
    return element;
  }
  Object.entries(attrs).forEach(([key, value]) => element!.setAttribute(key, value));
  return element;
};

const upsertLink = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.appendChild(element);
  }
  element.href = href;
  return element;
};

/** Derives a description from body copy when a page does not supply one. */
export const autoDescription = (source: string): string => {
  const clean = source.replace(/\s+/g, ' ').trim();
  if (clean.length <= MAX_DESCRIPTION) return clean;
  const cut = clean.slice(0, MAX_DESCRIPTION);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 80 ? lastSpace : MAX_DESCRIPTION)}…`;
};

export interface SeoProps {
  /** Page title without the brand suffix — it is appended automatically. */
  title: string;
  description?: string;
  /** Raw body text to derive a description from when none is provided. */
  descriptionSource?: string;
  image?: string;
  /** `article` for news and articles, `website` elsewhere. */
  type?: 'website' | 'article';
  publishedAt?: string;
  noIndex?: boolean;
  /** Extra JSON-LD blocks (breadcrumbs, FAQ, MedicalProcedure…). */
  jsonLd?: Array<Record<string, unknown>>;
}

/**
 * Head manager. Every page renders exactly one <Seo>, which owns the title,
 * meta description, canonical URL, hreflang alternates, Open Graph/Twitter
 * cards and JSON-LD. Titles and descriptions are generated automatically when
 * a page does not supply them.
 */
export const Seo = ({
  title,
  description,
  descriptionSource,
  image,
  type = 'website',
  publishedAt,
  noIndex = false,
  jsonLd = [],
}: SeoProps) => {
  const { language } = useI18n();
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title.includes(BRAND) ? title : `${title} — ${BRAND}`;
    const resolvedDescription =
      description ?? (descriptionSource ? autoDescription(descriptionSource) : '');
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
    const ogImage = image ?? `${SITE_URL}/og/ophtra-cover.svg`;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: resolvedDescription });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    });

    upsertLink('canonical', canonical);

    // hreflang alternates — each language is addressable with ?lang=<code>
    // (read by the i18n provider); Russian is the default and x-default.
    LANGUAGES.forEach((lang) =>
      upsertLink('alternate', lang === 'ru' ? canonical : `${canonical}?lang=${lang}`, LOCALE_TAGS[lang]),
    );
    upsertLink('alternate', canonical, 'x-default');

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: resolvedDescription,
    });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: LOCALE_TAGS[language].replace('-', '_'),
    });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: BRAND });

    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: resolvedDescription,
    });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    if (publishedAt) {
      upsertMeta('meta[property="article:published_time"]', {
        property: 'article:published_time',
        content: publishedAt,
      });
    }

    // Structured data is replaced wholesale on every navigation so stale
    // schema from the previous page never leaks into the next one.
    document.head
      .querySelectorAll('script[data-oph-jsonld="page"]')
      .forEach((node) => node.remove());

    jsonLd.forEach((block) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.ophJsonld = 'page';
      script.textContent = JSON.stringify(block);
      document.head.appendChild(script);
    });
  }, [
    title,
    description,
    descriptionSource,
    image,
    type,
    publishedAt,
    noIndex,
    jsonLd,
    pathname,
    language,
  ]);

  return null;
};

/* ========================================================== SCHEMA HELPERS */

/** Resolves a site-relative path against the canonical origin. */
const absoluteUrl = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);


export const breadcrumbSchema = (
  trail: Array<{ name: string; url: string }>,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  })),
});

/** FAQPage schema. Every FAQ block on the site renders one (DESIGN.md §5). */
export const faqSchema = (
  items: Array<{ question: string; answer: string }>,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

export const physicianSchema = (doctor: {
  name: string;
  role: string;
  slug: string;
  departments: string[];
  /** Optional enrichments (all backwards-compatible). */
  image?: string;
  description?: string;
  languages?: string[];
  /** Full URL override, e.g. the founder page. */
  url?: string;
  sameAs?: string[];
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Physician',
  name: doctor.name,
  jobTitle: doctor.role,
  url: doctor.url ?? `${SITE_URL}/doctors/${doctor.slug}`,
  medicalSpecialty: 'Ophthalmologic',
  memberOf: { '@type': 'MedicalClinic', name: BRAND, url: SITE_URL },
  knowsAbout: doctor.departments,
  ...(doctor.image ? { image: absoluteUrl(doctor.image) } : {}),
  ...(doctor.description ? { description: doctor.description } : {}),
  ...(doctor.languages?.length ? { knowsLanguage: doctor.languages } : {}),
  ...(doctor.sameAs?.length ? { sameAs: doctor.sameAs } : {}),
});

/**
 * A real person (founder, author, invited expert) — used for E-E-A-T and by
 * AI answer engines to attribute medical content to a named clinician.
 */
export const personSchema = (person: {
  name: string;
  jobTitle?: string;
  /** Site path or absolute URL of the profile page. */
  url: string;
  image?: string;
  description?: string;
  sameAs?: string[];
  alumniOf?: string[];
  honorificPrefix?: string;
  honorificSuffix?: string;
  knowsAbout?: string[];
  worksFor?: string;
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  url: absoluteUrl(person.url),
  ...(person.jobTitle ? { jobTitle: person.jobTitle } : {}),
  ...(person.image ? { image: absoluteUrl(person.image) } : {}),
  ...(person.description ? { description: person.description } : {}),
  ...(person.honorificPrefix ? { honorificPrefix: person.honorificPrefix } : {}),
  ...(person.honorificSuffix ? { honorificSuffix: person.honorificSuffix } : {}),
  ...(person.sameAs?.length ? { sameAs: person.sameAs } : {}),
  ...(person.knowsAbout?.length ? { knowsAbout: person.knowsAbout } : {}),
  ...(person.alumniOf?.length
    ? { alumniOf: person.alumniOf.map((name) => ({ '@type': 'CollegeOrUniversity', name })) }
    : {}),
  worksFor: { '@type': 'MedicalClinic', name: person.worksFor ?? BRAND, url: SITE_URL },
});

/**
 * Patient-facing medical page (service, condition, international patients…).
 * `lastReviewed` + `reviewedBy` are what Google and AI engines use to judge
 * medical content freshness and authorship.
 */
export const medicalWebPageSchema = (page: {
  title: string;
  description: string;
  /** Site path, e.g. '/services/oct'. */
  path: string;
  about?: string;
  audience?: 'Patient' | 'Clinician';
  lastReviewed?: string;
  reviewedBy?: string;
  specialty?: string;
  language?: string;
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalWebPage',
  name: page.title,
  headline: page.title,
  description: page.description,
  url: absoluteUrl(page.path),
  inLanguage: page.language ?? 'ru',
  medicalAudience: { '@type': 'MedicalAudience', audienceType: page.audience ?? 'Patient' },
  specialty: page.specialty ?? 'https://schema.org/Ophthalmologic',
  ...(page.about ? { about: { '@type': 'MedicalCondition', name: page.about } } : {}),
  ...(page.lastReviewed ? { lastReviewed: page.lastReviewed } : {}),
  ...(page.reviewedBy ? { reviewedBy: { '@type': 'Physician', name: page.reviewedBy } } : {}),
  publisher: { '@type': 'MedicalClinic', name: BRAND, url: SITE_URL },
});

export const medicalProcedureSchema = (procedure: {
  name: string;
  description: string;
  price?: number;
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalProcedure',
  name: procedure.name,
  description: procedure.description,
  procedureType: 'https://schema.org/SurgicalProcedure',
  ...(procedure.price
    ? {
        offers: {
          '@type': 'Offer',
          price: procedure.price,
          priceCurrency: 'KZT',
        },
      }
    : {}),
});

export const articleSchema = (article: {
  title: string;
  description: string;
  date: string;
  author: string;
  slug: string;
  /** Optional enrichments (all backwards-compatible). */
  path?: string;
  image?: string;
  dateModified?: string;
  authorUrl?: string;
  authorJobTitle?: string;
  category?: string;
  tags?: string[];
  reviewedBy?: string;
  language?: string;
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': ['Article', 'MedicalWebPage'],
  headline: article.title,
  name: article.title,
  description: article.description,
  datePublished: article.date,
  dateModified: article.dateModified ?? article.date,
  inLanguage: article.language ?? 'ru',
  author: {
    '@type': 'Person',
    name: article.author,
    ...(article.authorUrl ? { url: absoluteUrl(article.authorUrl) } : {}),
    ...(article.authorJobTitle ? { jobTitle: article.authorJobTitle } : {}),
  },
  publisher: {
    '@type': 'Organization',
    name: BRAND,
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand/logo.png` },
  },
  mainEntityOfPage: absoluteUrl(article.path ?? `/knowledge-base/${article.slug}`),
  url: absoluteUrl(article.path ?? `/knowledge-base/${article.slug}`),
  ...(article.image ? { image: absoluteUrl(article.image) } : {}),
  ...(article.category ? { articleSection: article.category } : {}),
  ...(article.tags?.length ? { keywords: article.tags.join(', ') } : {}),
  ...(article.reviewedBy ? { reviewedBy: { '@type': 'Physician', name: article.reviewedBy } } : {}),
});

export const offerCatalogSchema = (
  services: Array<{ name: string; price: number }>,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name: BRAND,
  itemListElement: services.map((service) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'MedicalProcedure', name: service.name },
    price: service.price,
    priceCurrency: 'KZT',
  })),
});

/**
 * Reviews are published on the site, but no AggregateRating/Review markup is
 * emitted: self-hosted reviews are not eligible for review rich results and
 * the current records are demo content. Kept as a named export for callers.
 */
export const reviewSchema = (
  _reviews: Array<{ author: string; rating: number; text: string; date: string }>,
  _aggregate: { rating: number; count: number },
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: BRAND,
});

export const jobPostingSchema = (job: {
  title: string;
  description: string;
  employment: string;
  city: string;
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  employmentType: job.employment,
  hiringOrganization: { '@type': 'Organization', name: BRAND },
  jobLocation: {
    '@type': 'Place',
    address: { '@type': 'PostalAddress', addressLocality: job.city, addressCountry: 'KZ' },
  },
});
