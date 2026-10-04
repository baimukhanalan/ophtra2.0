/* Real catalogue data (data/*.json, Russian copy extracted by scripts/extract.mjs). */
import siteJson from '../content/data/site.json';
import clinicsJson from '../content/data/clinics.json';
import departmentsJson from '../content/data/departments.json';
import servicesJson from '../content/data/services.json';
import doctorsJson from '../content/data/doctors.json';
import reviewsJson from '../content/data/reviews.json';
import programsJson from '../content/data/programs.json';

export interface Department {
  id: string;
  slug: string;
  illustration: string;
  name: string;
  short: string;
  description: string;
}
export interface Service {
  id: string;
  slug: string;
  departmentId: string;
  name: string;
  short: string;
  price: number;
  duration: number;
  priceGroup: string;
}
export interface Doctor {
  id: string;
  slug: string;
  name: string;
  role: string;
  departmentIds: string[];
  clinicIds: string[];
  experience: number;
  category: string;
  bio: string;
  languages: string[];
  education: string;
  isManagement: boolean;
  acceptsOnline: boolean;
}
export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  serviceId: string;
  doctorId: string;
  text: string;
}
export interface Program {
  id: string;
  slug: string;
  name: string;
  short: string;
  price: number;
  duration: string;
  includes: { ru: string[] } | string[];
}

export const site = siteJson as unknown as {
  organization: { legalName: string; email: string; phone: string; phoneHref: string; whatsapp: string; telegram: string };
  metrics: Array<{ id: string; value: number; suffix: string }>;
  journey: Array<{ id: string; illustration: string; title: string; text: string }>;
  equipment: Array<{ id: string; name: string; text: string }>;
  values: Array<{ id: string; title: string; text: string }>;
  timeline: Array<{ id: string; year: string; title: string; text: string }>;
  channels: Array<{ id: string; label: string; href: string }>;
  records: Array<{ id: string; title: string; meta: string }>;
  complaints: string[];
};
export const clinic = (clinicsJson as unknown as Array<{
  id: string;
  name: string;
  city: string;
  address: string;
  schedule: string;
  phone: string;
  email: string;
  geo: { lat: number; lng: number };
  transport: string;
}>)[0];
export const departments = departmentsJson as unknown as Department[];
export const services = servicesJson as unknown as Service[];
export const doctors = doctorsJson as unknown as Doctor[];
export const reviews = reviewsJson as unknown as Review[];
export const programs = programsJson as unknown as Program[];

export const byId = <T extends { id: string }>(list: T[], id: string) => list.find((x) => x.id === id);
export const bySlug = <T extends { slug: string }>(list: T[], slug: string) => list.find((x) => x.slug === slug);

export const METRIC_LABEL: Record<string, string> = {
  years: 'лет практики',
  operations: 'операций в год',
  doctors: 'врачей и хирургов',
  satisfaction: 'пациентов рекомендуют',
};

export const money = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₸';
export const date = (iso: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

export const LANG_NAME: Record<string, string> = { ru: 'Русский', kk: 'Қазақ', en: 'English' };
