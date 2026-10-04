import type { Dictionary } from '@/i18n';

/**
 * Site map.
 *
 * One declaration drives the desktop mega-menu, the mobile drawer, the footer
 * columns and the XML sitemap generator — the navigation can never drift from
 * the routes.
 */

export interface NavLink {
  /** Key into the `nav` section of the dictionary. */
  labelKey: keyof Dictionary['nav'];
  path: string;
  /** Optional second line shown in the desktop mega-menu. */
  descriptionKey?: keyof Dictionary['nav'];
  /** Priority in sitemap.xml. */
  priority?: number;
}

export interface NavGroup {
  id: string;
  labelKey: keyof Dictionary['nav'];
  links: NavLink[];
}

export const ROUTES = {
  home: '/',
  about: '/about',
  founder: '/dr-kulmaganbetov',
  management: '/management',
  doctors: '/doctors',
  experts: '/global-experts',
  departments: '/departments',
  partnerships: '/partnerships',
  services: '/services',
  diagnostics: '/diagnostics',
  treatment: '/treatment',
  laser: '/laser-vision-correction',
  cataract: '/cataract-surgery',
  pediatric: '/pediatric-ophthalmology',
  optical: '/optical-store',
  programs: '/medical-programs',
  international: '/international-patients',
  secondOpinion: '/second-opinion',
  consultation: '/online-consultation',
  pricing: '/pricing',
  promotions: '/promotions',
  science: '/science',
  academy: '/academy',
  knowledge: '/knowledge-base',
  authors: '/authors',
  media: '/media-center',
  news: '/news',
  articles: '/articles',
  faq: '/faq',
  reviews: '/reviews',
  appointment: '/appointment',
  contacts: '/contacts',
  vacancies: '/vacancies',
  privacy: '/privacy-policy',
  terms: '/terms-of-use',
  account: '/account',
  admin: '/admin',
} as const;

/** Grouped navigation used by the header mega-menu and the footer.
 *  Mirrors the site architecture from the technical specification (§3). */
export const NAV_GROUPS: NavGroup[] = [
  {
    id: 'about',
    labelKey: 'about',
    links: [
      { labelKey: 'aboutClinic', descriptionKey: 'aboutClinicDesc', path: ROUTES.about, priority: 0.8 },
      { labelKey: 'founder', descriptionKey: 'founderDesc', path: ROUTES.founder, priority: 0.9 },
      { labelKey: 'doctors', descriptionKey: 'doctorsDesc', path: ROUTES.doctors, priority: 0.9 },
      { labelKey: 'experts', descriptionKey: 'expertsDesc', path: ROUTES.experts, priority: 0.7 },
      { labelKey: 'management', path: ROUTES.management, priority: 0.6 },
      { labelKey: 'departments', path: ROUTES.departments, priority: 0.8 },
      { labelKey: 'partnerships', descriptionKey: 'partnershipsDesc', path: ROUTES.partnerships, priority: 0.6 },
      { labelKey: 'vacancies', path: ROUTES.vacancies, priority: 0.5 },
    ],
  },
  {
    id: 'services',
    labelKey: 'services',
    links: [
      { labelKey: 'allServicesNav', descriptionKey: 'allServicesDesc', path: ROUTES.services, priority: 0.9 },
      { labelKey: 'diagnostics', path: ROUTES.diagnostics, priority: 0.9 },
      { labelKey: 'treatment', path: ROUTES.treatment, priority: 0.9 },
      { labelKey: 'laser', path: ROUTES.laser, priority: 0.9 },
      { labelKey: 'cataract', path: ROUTES.cataract, priority: 0.9 },
      { labelKey: 'pediatric', path: ROUTES.pediatric, priority: 0.9 },
      { labelKey: 'optical', path: ROUTES.optical, priority: 0.7 },
      { labelKey: 'programs', path: ROUTES.programs, priority: 0.8 },
    ],
  },
  {
    id: 'patients',
    labelKey: 'patients',
    links: [
      { labelKey: 'international', descriptionKey: 'internationalDesc', path: ROUTES.international, priority: 0.9 },
      { labelKey: 'secondOpinion', descriptionKey: 'secondOpinionDesc', path: ROUTES.secondOpinion, priority: 0.9 },
      { labelKey: 'consultation', descriptionKey: 'consultationDesc', path: ROUTES.consultation, priority: 0.9 },
      { labelKey: 'appointment', path: ROUTES.appointment, priority: 1 },
      { labelKey: 'pricing', path: ROUTES.pricing, priority: 0.9 },
      { labelKey: 'promotions', path: ROUTES.promotions, priority: 0.7 },
      { labelKey: 'faq', path: ROUTES.faq, priority: 0.7 },
      { labelKey: 'reviews', path: ROUTES.reviews, priority: 0.7 },
      { labelKey: 'contacts', path: ROUTES.contacts, priority: 0.8 },
    ],
  },
  {
    id: 'science',
    labelKey: 'scienceMedia',
    links: [
      { labelKey: 'science', descriptionKey: 'scienceDesc', path: ROUTES.science, priority: 0.8 },
      { labelKey: 'academy', descriptionKey: 'academyDesc', path: ROUTES.academy, priority: 0.7 },
      { labelKey: 'knowledge', descriptionKey: 'knowledgeDesc', path: ROUTES.knowledge, priority: 0.9 },
      { labelKey: 'mediaCenter', descriptionKey: 'mediaCenterDesc', path: ROUTES.media, priority: 0.7 },
      { labelKey: 'news', path: ROUTES.news, priority: 0.7 },
    ],
  },
];

/** Legal links shown in the footer bottom row. */
export const LEGAL_LINKS: NavLink[] = [
  { labelKey: 'privacy', path: ROUTES.privacy, priority: 0.3 },
  { labelKey: 'terms', path: ROUTES.terms, priority: 0.3 },
];

/** Every static page, used by the sitemap generator. */
export const ALL_STATIC_LINKS: NavLink[] = [
  { labelKey: 'aboutClinic', path: ROUTES.home, priority: 1 },
  ...NAV_GROUPS.flatMap((group) => group.links),
  { labelKey: 'appointment', path: ROUTES.appointment, priority: 1 },
  ...LEGAL_LINKS,
];
