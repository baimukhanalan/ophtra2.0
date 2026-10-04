import raw from '../data/ru.json';
import kIndex from '../data/knowledge-index.json';

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  role: string;
  departmentIds: string[];
  experience: number;
  category: string;
  bio: string;
  languages: string[];
  education: string;
  isManagement: boolean;
  acceptsOnline: boolean;
}
export interface Service {
  id: string;
  slug: string;
  departmentId: string;
  name: string;
  short: string;
  price: number;
  duration: number;
}
export interface Department {
  id: string;
  slug: string;
  name: string;
  short: string;
  description: string;
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
export interface Faq {
  id: string;
  topic: string;
  question: string;
  answer: string;
}
export interface KArticle {
  id: string;
  slug: string;
  category: string;
  tags: string[];
  authorId: string;
  serviceSlug?: string;
  date: string;
  readingMinutes: number;
  title: string;
  excerpt: string;
}
export interface KBody {
  sections: Array<{ id: string; title: string; body: string[]; list?: string[] }>;
  faq: Array<{ q: string; a: string }>;
  sources: Array<{ label: string; href: string }>;
}

const d = raw as unknown as {
  site: {
    organization: { legalName: string; email: string; phone: string; phoneHref: string; whatsapp: string; telegram: string };
    metrics: Array<{ id: string; value: number; suffix: string }>;
    journey: Array<{ id: string; title: string; text: string }>;
    equipment: Array<{ id: string; name: string; text: string }>;
    values: Array<{ id: string; title: string; text: string }>;
    timeline: Array<{ id: string; year: string; title: string; text: string }>;
    channels: Array<{ id: string; label: string; href: string }>;
  };
  doctors: Doctor[];
  services: Service[];
  departments: Department[];
  reviews: Review[];
  faq: Faq[];
  news: Array<{ id: string; slug: string; date: string; category: string; title: string; excerpt: string }>;
  programs: Array<{ id: string; slug: string; name: string; short: string; price: number; duration: string; includes: string[] }>;
  clinics: Array<{ name: string; city: string; address: string; schedule: string; phone: string; email: string; geo: { lat: number; lng: number }; transport: string }>;
  patient_demo: {
    patient: { fullName: string; phone: string; email: string };
    appointments: Array<{ id: string; reference: string; departmentId: string; serviceId: string; doctorId: string; date: string; time: string; status: string; price: number }>;
    recommendations: Array<{ id: string; doctorId: string; date: string; text: string }>;
    prescriptions: Array<{ id: string; doctorId: string; date: string; title: string; detail: string }>;
    results: Array<{ id: string; date: string; name: string; summary: string; fileName: string }>;
    invoices: Array<{ id: string; number: string; appointmentId: string; amount: number; status: string; issuedAt: string; kind: string }>;
  };
};

export const site = d.site;
export const doctors = d.doctors;
export const services = d.services;
export const departments = d.departments;
export const reviews = d.reviews;
export const faq = d.faq;
export const news = d.news;
export const programs = d.programs;
export const clinic = d.clinics[0];
export const patientDemo = d.patient_demo;
export const knowledge = kIndex as KArticle[];

export const deptById = (id: string) => departments.find((x) => x.id === id);
export const doctorById = (id: string) => doctors.find((x) => x.id === id);
export const serviceById = (id: string) => services.find((x) => x.id === id);

export const DEPT_SHORT: Record<string, string> = {
  diagnostics: 'Диагностика',
  treatment: 'Лечение болезней глаз',
  laser: 'Лазерная коррекция',
  cataract: 'Хирургия катаракты',
  pediatric: 'Детская офтальмология',
  optical: 'Оптический салон',
};

export const METRIC_LABELS: Record<string, string> = {
  years: 'лет опыта',
  operations: 'операций в год',
  doctors: 'врачей',
  satisfaction: 'пациентов рекомендуют',
};

export const K_CATEGORIES: Array<{ id: string; label: string; text: string }> = [
  { id: 'children', label: 'Зрение детей', text: 'Близорукость, косоглазие, «ленивый глаз» и первые осмотры.' },
  { id: 'after40', label: 'Здоровье глаз после 40', text: 'Возрастная дальнозоркость и регулярные обследования.' },
  { id: 'surgery', label: 'Катаракта и рефракционная хирургия', text: 'Когда оперировать, как готовиться и чего ожидать.' },
  { id: 'retina', label: 'Здоровье сетчатки и макулы', text: 'ВМД, диабетическая ретинопатия, ОКТ-контроль.' },
  { id: 'glaucoma', label: 'Глаукома', text: 'Тихая болезнь зрительного нерва: выявление и контроль.' },
  { id: 'library', label: 'Библиотека заболеваний', text: 'Краткие статьи о заболеваниях глаз от А до Я.' },
  { id: 'research', label: 'Исследования простым языком', text: 'Что говорит наука — без преувеличений.' },
  { id: 'prevention', label: 'Профилактика заболеваний глаз', text: 'Экраны, линзы, сухость и ежедневные привычки.' },
];

export const authorName = (id: string) => (id === 'editorial' ? 'Редакция центра' : id === 'founder' ? 'Мухит Кулмаганбетов' : doctorById(id)?.name ?? 'Редакция центра');

export const PUBLICATIONS = [
  {
    id: 'sci-rep-2026',
    journal: 'Scientific Reports',
    publisher: 'Nature Portfolio',
    title: 'Evaluating the reliability of structured light entoptic tasks',
    href: 'https://www.nature.com/articles/s41598-026-63276-7',
    doi: '10.1038/s41598-026-63276-7',
    direction: 'Энтоптические тесты',
    summary: 'Оценка надёжности задач со структурированным светом — шаг, без которого новый тест зрения нельзя переносить в клинику.',
  },
  {
    id: 'diagnostics-2026',
    journal: 'Diagnostics',
    publisher: 'MDPI',
    title: "The Machine Learning Classification of Retinal Ganglion Cell Dendritic Texture in a 3xTg-Alzheimer's Disease Mouse Model",
    href: 'https://www.mdpi.com/2075-4418/16/16/2672',
    doi: '10.3390/diagnostics16162672',
    direction: 'Нейроофтальмология и ИИ',
    summary: 'Машинное обучение для классификации текстуры дендритов ганглиозных клеток сетчатки на модели болезни Альцгеймера.',
  },
  {
    id: 'healthcare-2026',
    journal: 'Healthcare',
    publisher: 'MDPI',
    title: 'Impact of Chronic Kidney Disease Severity on COVID-19 Outcomes: A Retrospective Cohort Study',
    href: 'https://www.mdpi.com/2227-9032/14/16/2575',
    doi: '10.3390/healthcare14162575',
    direction: 'Клиническая эпидемиология',
    summary: 'Ретроспективное когортное исследование: как тяжесть хронической болезни почек связана с исходами COVID-19.',
  },
];

export const SOURCES = {
  kz24: 'https://24.kz/ru/news/in-the-world/788733-razrabotka-kazakhstantsa-dlya-vyyavleniya-boleznej-glaz-prokhodit-ispytaniya-v-gonkonge',
  eyeinst: 'https://eyeinst.kz/catalog/kulmaganbetov-muhit-askarovich-2882/',
  threads: 'https://www.threads.com/@mukhit_kulmaganbetov',
};
