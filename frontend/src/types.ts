import type { Localized } from '@/i18n/types';

/* ============================================================== CATALOGUE */

export interface Clinic {
  id: string;
  slug: string;
  name: Localized;
  city: Localized;
  address: Localized;
  schedule: Localized;
  phone: string;
  email: string;
  geo: { lat: number; lng: number };
  transport: Localized;
  isSurgical: boolean;
}

export interface Department {
  id: string;
  slug: string;
  illustration: string;
  name: Localized;
  short: Localized;
  description: Localized;
  clinicIds: string[];
}

export interface Service {
  id: string;
  slug: string;
  departmentId: string;
  name: Localized;
  short: Localized;
  /** Price in tenge. */
  price: number;
  /** Appointment length in minutes. */
  duration: number;
  priceGroup: string;
}

export interface Doctor {
  id: string;
  slug: string;
  name: Localized;
  role: Localized;
  departmentIds: string[];
  clinicIds: string[];
  experience: number;
  category: Localized;
  bio: Localized;
  languages: string[];
  education: Localized;
  /**
   * Path to a portrait under /public/media/doctors, e.g.
   * "/media/doctors/aigul-serikova.jpg". Optional: when it is absent the card
   * falls back to a monogram, so the site never shows a face that is not the
   * doctor's own.
   */
  photo?: string;
  /** Shown on the Management page. */
  isManagement: boolean;
  acceptsOnline: boolean;
}

export interface Program {
  id: string;
  slug: string;
  name: Localized;
  short: Localized;
  price: number;
  duration: Localized;
  includes: Record<string, string[]>;
}

/* ================================================================ CONTENT */

export interface Promotion {
  id: string;
  slug: string;
  title: Localized;
  short: Localized;
  description: Localized;
  discount: number;
  validFrom: string;
  validTo: string;
  serviceIds: string[];
  published: boolean;
}

export interface NewsItem {
  id: string;
  slug: string;
  date: string;
  category: Localized;
  title: Localized;
  excerpt: Localized;
  body: Localized;
  published: boolean;
}

export interface Article extends NewsItem {
  readingMinutes: number;
  authorId: string;
}

export interface FaqItem {
  id: string;
  topic: string;
  question: Localized;
  answer: Localized;
}

export interface Review {
  id: string;
  author: Localized;
  date: string;
  rating: number;
  serviceId: string;
  doctorId: string;
  text: Localized;
}

export interface Vacancy {
  id: string;
  slug: string;
  title: Localized;
  clinicId: string;
  employment: Localized;
  salary: Localized;
  published: boolean;
  requirements: Record<string, string[]>;
  offer: Record<string, string[]>;
}

/* =================================================================== SITE */

export interface SiteMetric {
  id: string;
  value: number;
  suffix: string;
}

export interface JourneyStage {
  id: string;
  illustration: string;
  title: Localized;
  text: Localized;
}

export interface NamedBlock {
  id: string;
  name: Localized;
  text: Localized;
}

export interface TitledBlock {
  id: string;
  title: Localized;
  text: Localized;
}

export interface TimelineEntry extends TitledBlock {
  year: string;
}

export interface Channel {
  id: string;
  label: string;
  href: string;
}

export interface RecordChip {
  id: string;
  title: Localized;
  meta: Localized;
}

export interface SiteData {
  organization: {
    legalName: Localized;
    bin: string;
    license: string;
    founded?: number;
    email: string;
    phone: string;
    phoneHref: string;
    whatsapp: string;
    telegram: string;
    url: string;
  };
  metrics: SiteMetric[];
  journey: JourneyStage[];
  equipment: NamedBlock[];
  values: TitledBlock[];
  timeline: TimelineEntry[];
  channels: Channel[];
  /** Cards flown through the corridor scene. */
  records: RecordChip[];
  /** Loose patient complaints assembled by the gravity scene. */
  complaints: Localized[];
}

export interface LegalSection {
  id: string;
  title: Localized;
  body: Localized;
}

export interface LegalDocument {
  updated: string;
  title: Localized;
  intro: Localized;
  sections: LegalSection[];
}

export interface LegalData {
  privacy: LegalDocument;
  terms: LegalDocument;
}

/* ================================================================ BOOKING */

export interface Slot {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Local time, HH:MM. */
  time: string;
  doctorId: string;
  available: boolean;
}

export interface BookingDraft {
  /** Doctor appointment, diagnostics or surgery. */
  visitType: 'consultation' | 'diagnostics' | 'surgery' | '';
  clinicId: string;
  departmentId: string;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email: string;
  comment: string;
  consent: boolean;
  marketingConsent: boolean;
}

export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export interface Appointment {
  id: string;
  reference: string;
  clinicId: string;
  departmentId: string;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  patientId: string;
  price: number;
  createdAt: string;
}

/* ================================================================ ACCOUNT */

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  email: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  title: Localized;
  detail: Localized;
}

export interface Recommendation {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  text: Localized;
}

export interface ExamResult {
  id: string;
  patientId: string;
  date: string;
  name: Localized;
  summary: Localized;
  fileName: string;
}

export type InvoiceStatus = 'paid' | 'unpaid' | 'refunded';

export interface Invoice {
  id: string;
  number: string;
  patientId: string;
  appointmentId: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  kind: 'service' | 'operation' | 'prepayment';
  receiptUrl?: string;
}

/* ================================================================== LEADS */

export interface UtmPayload {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export interface Lead {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  serviceId: string;
  source: string;
  date: string;
  utm: UtmPayload;
  comment: string;
}
