/* Russian content extracted from the production site (see scripts/build-content.mjs). */
import copyJson from './copy.json';
import dataJson from './data.json';
import type { StationId } from '../lib/stations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const C: any = copyJson;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const D: any = dataJson;

export interface Department { id: string; slug: string; name: string; short: string; description: string }
export interface Service { id: string; slug: string; departmentId: string; name: string; short: string; price: number; duration: number }
export interface Doctor {
  id: string; slug: string; name: string; role: string; departmentIds: string[]; experience: number;
  category: string; bio: string; languages: string[]; education: string; isManagement: boolean; acceptsOnline: boolean;
}
export interface Review { id: string; author: string; date: string; rating: number; serviceId: string; doctorId: string; text: string }
export interface Faq { id: string; topic: string; question: string; answer: string }

export const departments: Department[] = D.departments;
export const services: Service[] = D.services;
export const doctors: Doctor[] = D.doctors;
export const reviews: Review[] = D.reviews;
export const faq: Faq[] = D.faq;
export const site = D.site;
export const clinic = D.clinics[0];
export const patientDemo = D.patientDemo;
export const programs = D.programs;

export const byId = <T extends { id: string }>(list: T[], id: string) => list.find((x) => x.id === id);

/** Each department is anchored to the eye structure it treats. */
export const DEPT_LAYER: Record<string, { station: StationId; layer: string; why: string }> = {
  optical: { station: 'gaze', layer: 'Свет до глаза', why: 'Очки и линзы работают ещё до того, как свет коснётся роговицы.' },
  laser: { station: 'cornea', layer: 'Роговица', why: 'Лазер меняет профиль роговицы — главной линзы глаза.' },
  pediatric: { station: 'iris', layer: 'Радужка и зрачок', why: 'Растущий глаз ребёнка — от первого взгляда до 18 лет.' },
  cataract: { station: 'lens', layer: 'Хрусталик', why: 'Помутневший хрусталик заменяют прозрачной линзой.' },
  treatment: { station: 'retina', layer: 'Сетчатка', why: 'Глаукома, сетчатка, роговица и воспаления — терапия в глубине.' },
  diagnostics: { station: 'micro', layer: 'Все слои', why: 'Диагностика видит каждый слой — до микрон.' },
};

/** Order of departments along the optical axis, front to back. */
export const DEPT_ORDER = ['optical', 'laser', 'pediatric', 'cataract', 'treatment', 'diagnostics'];

export const METRIC_LABEL: Record<string, string> = {
  years: 'лет опыта',
  operations: 'операций в год',
  doctors: 'врачей',
  satisfaction: 'пациентов рекомендуют',
};

export const fmtPrice = (n: number) => new Intl.NumberFormat('ru-RU').format(n) + ' ₸';
export const fmtDate = (iso: string) =>
  new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export const LANG_LABEL: Record<string, string> = { ru: 'Русский', kk: 'Қазақша', en: 'English' };

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

export const loadServiceBodies = () => import('./service-bodies.json').then((m) => m.default as Record<string, any>); // eslint-disable-line @typescript-eslint/no-explicit-any
export const loadKnowledgeBodies = () => import('./knowledge-bodies.json').then((m) => m.default as Record<string, any>); // eslint-disable-line @typescript-eslint/no-explicit-any
