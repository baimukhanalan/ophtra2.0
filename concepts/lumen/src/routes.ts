import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

type Loader = () => Promise<{ default: ComponentType }>;

const def = (load: Loader) => ({ load, Component: lazy(load) as LazyExoticComponent<ComponentType> });

export const PAGES = {
  home: def(() => import('./pages/Home')),
  about: def(() => import('./pages/About')),
  founder: def(() => import('./pages/Founder')),
  doctors: def(() => import('./pages/Doctors')),
  doctor: def(() => import('./pages/Doctor')),
  services: def(() => import('./pages/Services')),
  service: def(() => import('./pages/Service')),
  international: def(() => import('./pages/International')),
  second: def(() => import('./pages/SecondOpinion')),
  consult: def(() => import('./pages/Consultation')),
  booking: def(() => import('./pages/Booking')),
  knowledge: def(() => import('./pages/Knowledge')),
  article: def(() => import('./pages/Article')),
  science: def(() => import('./pages/Science')),
  experts: def(() => import('./pages/Experts')),
  reviews: def(() => import('./pages/Reviews')),
  faq: def(() => import('./pages/Faq')),
  contacts: def(() => import('./pages/Contacts')),
  account: def(() => import('./pages/Account')),
  notFound: def(() => import('./pages/NotFound')),
};

export const R = {
  home: '/',
  about: '/about',
  founder: '/dr-kulmaganbetov',
  doctors: '/doctors',
  services: '/services',
  international: '/international-patients',
  second: '/second-opinion',
  consult: '/online-consultation',
  booking: '/booking',
  knowledge: '/knowledge-base',
  science: '/science',
  experts: '/global-experts',
  reviews: '/reviews',
  faq: '/faq',
  contacts: '/contacts',
  account: '/account',
} as const;

export const ROUTE_TABLE: Array<{ path: string; page: keyof typeof PAGES }> = [
  { path: R.home, page: 'home' },
  { path: R.about, page: 'about' },
  { path: R.founder, page: 'founder' },
  { path: R.doctors, page: 'doctors' },
  { path: R.doctors + '/:slug', page: 'doctor' },
  { path: R.services, page: 'services' },
  { path: R.services + '/:slug', page: 'service' },
  { path: R.international, page: 'international' },
  { path: R.second, page: 'second' },
  { path: R.consult, page: 'consult' },
  { path: R.booking, page: 'booking' },
  { path: R.knowledge, page: 'knowledge' },
  { path: R.knowledge + '/:slug', page: 'article' },
  { path: R.science, page: 'science' },
  { path: R.experts, page: 'experts' },
  { path: R.reviews, page: 'reviews' },
  { path: R.faq, page: 'faq' },
  { path: R.contacts, page: 'contacts' },
  { path: R.account, page: 'account' },
];

/** Warm the chunk for a path (hover / before a lens transition). */
export const preload = (to: string) => {
  const path = to.split(/[?#]/)[0];
  const hit =
    ROUTE_TABLE.find((r) => r.path === path) ??
    ROUTE_TABLE.find((r) => r.path.includes(':') && path.startsWith(r.path.split('/:')[0] + '/'));
  return (hit ? PAGES[hit.page] : PAGES.notFound).load().catch(() => undefined);
};
