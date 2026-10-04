import type { Localized } from '@/i18n/types';
import { ROUTES } from '@/app/navigation';
import { byId, doctors, departments } from '@/content';
import { EDITORIAL_ID, EDITORIAL_SLUG, FOUNDER_ID, FOUNDER_SLUG, editorialProfile, founderProfile } from './knowledge';

/**
 * Knowledge-base authors (spec §16 expert authorship): the editorial team,
 * doctors from data/doctors.json and the founder. Kept apart from the article
 * bodies so pages that only show a byline (science, media) stay small.
 *
 * Honesty rules: the founder is listed for his real publications only — no
 * knowledge-base text is attributed to him without his sign-off. Doctor
 * profiles are the site's demo dataset (DESIGN.md §5), so `isDemo` is set and
 * the author page says so.
 */

export interface KnowledgeAuthor {
  id: string;
  slug: string;
  name: Localized;
  role: Localized;
  credentials: Localized;
  bio: Localized;
  photo?: string;
  experience?: number;
  languages: string[];
  /** Doctor profile or founder page. */
  profileRoute: string;
  /** Page on this site describing the person. */
  pageRoute: string;
  departments: Localized[];
  sameAs: string[];
  isFounder: boolean;
  /** The editorial team (an organisation, not a person). */
  isEditorial: boolean;
  /** Profile comes from the demo doctor dataset. */
  isDemo: boolean;
}

const editorialAuthor: KnowledgeAuthor = {
  id: EDITORIAL_ID,
  slug: EDITORIAL_SLUG,
  name: editorialProfile.name,
  role: editorialProfile.role,
  credentials: editorialProfile.credentials,
  bio: editorialProfile.bio,
  languages: ['ru', 'kk', 'en'],
  profileRoute: ROUTES.knowledge,
  pageRoute: `${ROUTES.authors}/${EDITORIAL_SLUG}`,
  departments: [],
  sameAs: [],
  isFounder: false,
  isEditorial: true,
  isDemo: false,
};

const founderAuthor: KnowledgeAuthor = {
  id: FOUNDER_ID,
  slug: FOUNDER_SLUG,
  name: founderProfile.name,
  role: founderProfile.role,
  credentials: founderProfile.credentials,
  bio: founderProfile.bio,
  languages: ['ru', 'kk', 'en'],
  profileRoute: ROUTES.founder,
  pageRoute: `${ROUTES.authors}/${FOUNDER_SLUG}`,
  departments: [],
  sameAs: founderProfile.sameAs,
  isFounder: true,
  isEditorial: false,
  isDemo: false,
};

export const authorById = (id: string): KnowledgeAuthor | undefined => {
  if (id === FOUNDER_ID) return founderAuthor;
  if (id === EDITORIAL_ID) return editorialAuthor;
  const doctor = byId(doctors, id);
  if (!doctor) return undefined;
  return {
    id: doctor.id,
    slug: doctor.slug,
    name: doctor.name,
    role: doctor.role,
    credentials: {
      ru: `${doctor.category.ru} · ${doctor.education.ru}`,
      kk: `${doctor.category.kk} · ${doctor.education.kk}`,
      en: `${doctor.category.en} · ${doctor.education.en}`,
    },
    bio: doctor.bio,
    photo: doctor.photo,
    experience: doctor.experience,
    languages: doctor.languages,
    profileRoute: `${ROUTES.doctors}/${doctor.slug}`,
    pageRoute: `${ROUTES.authors}/${doctor.slug}`,
    departments: doctor.departmentIds
      .map((depId) => byId(departments, depId)?.name)
      .filter((name): name is Localized => Boolean(name)),
    sameAs: [],
    isFounder: false,
    isEditorial: false,
    isDemo: true,
  };
};

export const authorBySlug = (slug: string): KnowledgeAuthor | undefined => {
  if (slug === FOUNDER_SLUG) return founderAuthor;
  if (slug === EDITORIAL_SLUG) return editorialAuthor;
  const doctor = doctors.find((entry) => entry.slug === slug);
  return doctor ? authorById(doctor.id) : undefined;
};

