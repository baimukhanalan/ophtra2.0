/**
 * Bundled catalogue.
 *
 * The API is the production source of truth (see src/services/api.ts). This
 * module bundles the same seed dataset so the site renders instantly on first
 * paint and stays fully browsable if the API is unavailable — the catalogue is
 * public, static content, so serving it from the bundle is correct, not a
 * workaround.
 *
 * This half is the structural data every route needs. Article, news, FAQ,
 * promotion, vacancy and legal content lives in ./editorial so it is not
 * downloaded before the first paint of a page that never shows it.
 */

import clinicsJson from '@data/clinics.json';
import departmentsJson from '@data/departments.json';
import doctorsJson from '@data/doctors.json';
import programsJson from '@data/programs.json';
import reviewsJson from '@data/reviews.json';
import servicesJson from '@data/services.json';
import siteJson from '@data/site.json';

import type {
  Clinic,
  Department,
  Doctor,
  Program,
  Review,
  Service,
  SiteData,
} from '@/types';

export const clinics = clinicsJson as unknown as Clinic[];
export const departments = departmentsJson as unknown as Department[];
export const services = servicesJson as unknown as Service[];
export const doctors = doctorsJson as unknown as Doctor[];
export const programs = programsJson as unknown as Program[];
export const reviews = reviewsJson as unknown as Review[];
export const site = siteJson as unknown as SiteData;

/* ------------------------------------------------------------- SELECTORS */

export const byId = <T extends { id: string }>(list: T[], id: string): T | undefined =>
  list.find((entry) => entry.id === id);

export const bySlug = <T extends { slug: string }>(list: T[], slug: string): T | undefined =>
  list.find((entry) => entry.slug === slug);

export const servicesOfDepartment = (departmentId: string): Service[] =>
  services.filter((service) => service.departmentId === departmentId);

export const doctorsOfDepartment = (departmentId: string): Doctor[] =>
  doctors.filter((doctor) => doctor.departmentIds.includes(departmentId));

export const doctorsOfClinic = (clinicId: string): Doctor[] =>
  doctors.filter((doctor) => doctor.clinicIds.includes(clinicId));

/** Doctors able to perform a given service, via their department. */
export const doctorsForService = (serviceId: string): Doctor[] => {
  const service = byId(services, serviceId);
  if (!service) return [];
  return doctorsOfDepartment(service.departmentId);
};

export const managementTeam = (): Doctor[] => doctors.filter((doctor) => doctor.isManagement);

export const reviewsForDoctor = (doctorId: string): Review[] =>
  reviews.filter((review) => review.doctorId === doctorId);

/** Average patient rating, rounded to one decimal. */
export const averageRating = (): number =>
  reviews.length
    ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
    : 0;

/** Price list grouped by department, for the Pricing page. */
export const priceGroups = (): Array<{ department: Department; services: Service[] }> =>
  departments
    .map((department) => ({ department, services: servicesOfDepartment(department.id) }))
    .filter((group) => group.services.length > 0);
