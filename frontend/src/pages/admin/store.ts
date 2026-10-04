import { useEffect, useRef, useState } from 'react';
import type { Localized } from '@/i18n/types';
import type { Lead } from '@/types';
import type { KnowledgeCategory } from '@/content/pages/knowledge-types';
import type {
  ConversionStatus,
  LeadStage,
  PermissionId,
  RoleId,
} from '@/content/pages/platform';

/**
 * Admin workspace state (spec §14).
 *
 * The Vercel deployment ships the frontend only, so every editor works against
 * localStorage first and mirrors each change to the API when it answers. The
 * UI says which of the two happened (see `useRemote` in AdminPage) — it never
 * claims a change reached the server when it did not.
 */

export const STORAGE_PREFIX = 'ophtra.admin.';

const read = <T,>(key: string): T | undefined => {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : undefined;
  } catch {
    return undefined;
  }
};

const write = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* private mode or quota — the change lives for this session only */
  }
};

/** useState persisted under `ophtra.admin.<key>`. */
export const usePersisted = <T,>(key: string, seed: () => T) => {
  const [value, setValue] = useState<T>(() => read<T>(key) ?? seed());
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    write(key, value);
  }, [key, value]);
  return [value, setValue] as const;
};

/** Every admin key, for the settings backup download. */
export const exportAdminState = (): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX) && !key.endsWith('token')) {
        out[key] = JSON.parse(window.localStorage.getItem(key) ?? 'null');
      }
    }
  } catch {
    /* storage unavailable */
  }
  return out;
};

/* ================================================================= PAGES */

export type PublishStatus = 'published' | 'draft';

export interface CmsSection {
  id: string;
  heading: string;
  body: string;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: PublishStatus;
  sections: CmsSection[];
  updatedAt: string;
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugify = (value: string) => {
  const map: Record<string, string> = {
    а: 'a', ә: 'a', б: 'b', в: 'v', г: 'g', ғ: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
    к: 'k', қ: 'q', л: 'l', м: 'm', н: 'n', ң: 'n', о: 'o', ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
    ұ: 'u', ү: 'u', ф: 'f', х: 'h', һ: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', і: 'i', ь: '',
    э: 'e', ю: 'yu', я: 'ya',
  };
  return value
    .toLowerCase()
    .split('')
    .map((char) => map[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
};

export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const section = (heading: string, body: string): CmsSection => ({ id: uid('sec'), heading, body });

export const seedPages = (): CmsPage[] => [
  {
    id: 'home',
    title: 'Офтальмологический центр доктора Кулмаганбетова',
    slug: '',
    description: 'Диагностика зрения, лазерная коррекция, хирургия катаракты, детская офтальмология и оптика в Астане.',
    status: 'published',
    sections: [
      section('Зрение, которому доверяют', 'Диагностика за 60 минут, микрохирургия и сопровождение на каждом этапе.'),
      section('Единая карта заботы', 'От профилактики до сложного решения — один маршрут и один координатор.'),
    ],
    updatedAt: '2026-09-01T09:00:00.000Z',
  },
  {
    id: 'about',
    title: 'О клинике',
    slug: 'about',
    description: 'Миссия, команда и оборудование центра.',
    status: 'published',
    sections: [section('Миссия', 'Ясная информация помогает человеку принимать взвешенные решения о зрении.')],
    updatedAt: '2026-08-20T09:00:00.000Z',
  },
  {
    id: 'international',
    title: 'Международным пациентам',
    slug: 'international-patients',
    description: 'Лечение в Казахстане: стоимость, сроки, поездка и наблюдение после возвращения.',
    status: 'published',
    sections: [
      section('До покупки билетов', 'Пришлите заключения и снимки — врач оценит, нужна ли поездка.'),
      section('После возвращения', 'Контрольные осмотры онлайн и связь с вашим офтальмологом.'),
    ],
    updatedAt: '2026-09-10T09:00:00.000Z',
  },
  {
    id: 'second-opinion',
    title: 'Второе мнение',
    slug: 'second-opinion',
    description: 'Независимая оценка диагноза и плана лечения по вашим документам.',
    status: 'published',
    sections: [section('Как это работает', 'Загрузите документы, врач изучит их и подготовит письменное заключение.')],
    updatedAt: '2026-09-12T09:00:00.000Z',
  },
  {
    id: 'myopia-landing',
    title: 'Контроль миопии у детей — осень 2026',
    slug: 'myopia-control-autumn',
    description: 'Посадочная страница сезонной программы наблюдения.',
    status: 'draft',
    sections: [section('Программа', 'Осмотр, план наблюдения на год и контроль роста глаза.')],
    updatedAt: '2026-09-22T09:00:00.000Z',
  },
];

/* ============================================================== ARTICLES */

export interface CmsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category: KnowledgeCategory;
  tags: string[];
  authorId: string;
  status: PublishStatus;
  date: string;
  updatedAt: string;
}

/* ================================================================= FORMS */

export const FORM_SOURCES = [
  { id: 'contacts', path: '/contacts' },
  { id: 'international', path: '/international-patients' },
  { id: 'second-opinion', path: '/second-opinion' },
  { id: 'online-consultation', path: '/online-consultation' },
  { id: 'service-consultation', path: '/services/*' },
  { id: 'partnership', path: '/partnerships' },
  { id: 'academy', path: '/academy' },
  { id: 'expert-network', path: '/global-experts' },
  { id: 'science-collaboration', path: '/science' },
] as const;

export type FormSourceId = (typeof FORM_SOURCES)[number]['id'];

export interface FormSetting {
  enabled: boolean;
  email: string;
}

export const seedForms = (): Record<string, FormSetting> =>
  Object.fromEntries(
    FORM_SOURCES.map((form) => [
      form.id,
      {
        enabled: true,
        email:
          form.id === 'international' || form.id === 'second-opinion'
            ? 'international@drkulmaganbetov.kz'
            : form.id === 'partnership' || form.id === 'academy' || form.id.startsWith('science') || form.id === 'expert-network'
              ? 'science@drkulmaganbetov.kz'
              : 'info@drkulmaganbetov.kz',
      },
    ]),
  );

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ================================================================= LEADS */

export interface CrmLead {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  /** ISO-3166 alpha-2. */
  country: string;
  /** Form id (CRM lead source). */
  source: string;
  /** Traffic channel from attribution, e.g. 'google / organic'. */
  channel: string;
  diagnosis: string;
  stage: LeadStage;
  conversion: ConversionStatus;
  date: string;
  comment: string;
  origin: 'api' | 'outbox' | 'demo';
}

export type LeadOverride = Partial<Pick<CrmLead, 'stage' | 'conversion' | 'country' | 'diagnosis'>>;

const COUNTRY_WORDS: Record<string, string> = {
  казахстан: 'KZ', қазақстан: 'KZ', kazakhstan: 'KZ',
  узбекистан: 'UZ', өзбекстан: 'UZ', uzbekistan: 'UZ',
  кыргызстан: 'KG', қырғызстан: 'KG', kyrgyzstan: 'KG',
  россия: 'RU', ресей: 'RU', russia: 'RU',
  турция: 'TR', түркия: 'TR', turkey: 'TR', türkiye: 'TR',
  оаэ: 'AE', бұаэ: 'AE', uae: 'AE',
  германия: 'DE', germany: 'DE',
  монголия: 'MN', mongolia: 'MN',
};

const lineValue = (comment: string, labels: RegExp) => {
  const match = comment.split('\n').find((line) => labels.test(line));
  return match ? match.split(':').slice(1).join(':').trim() : '';
};

/** Maps a raw API/outbox lead (LeadForm payload) onto CRM fields. */
export const toCrmLead = (lead: Lead, index: number, origin: CrmLead['origin']): CrmLead => {
  const [form = 'other', ...rest] = lead.source.split('|');
  const countryRaw = lineValue(lead.comment, /^(Страна|Ел|Country)\b/i);
  const country =
    /^[A-Z]{2}$/.test(countryRaw) ? countryRaw : COUNTRY_WORDS[countryRaw.toLowerCase()] ?? (countryRaw ? countryRaw.slice(0, 2).toUpperCase() : 'KZ');
  return {
    id: lead.id ?? `${origin}-${index}-${lead.date}`,
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    country,
    source: form,
    channel: rest.join('|') || [lead.utm.source, lead.utm.medium].filter(Boolean).join(' / ') || 'direct',
    diagnosis: lineValue(lead.comment, /^(Диагноз|Diagnosis)\b/i),
    stage: 'new',
    conversion: 'open',
    date: lead.date,
    comment: lead.comment,
    origin,
  };
};

const daysAgo = (days: number, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

/** Clearly generic demo leads (DESIGN.md §5: no real people). */
export const demoLeads = (): CrmLead[] =>
  (
    [
      ['Пациент А. К.', 'KZ', 'contacts', 'google / organic', 'Миопия средней степени', 'new', 'open', 0],
      ['Patient D. R.', 'AE', 'international', 'instagram.com / social', 'Катаракта, OU', 'qualified', 'open', 1],
      ['Пациент Н. Б.', 'UZ', 'second-opinion', 'direct', 'Подозрение на глаукому', 'documents', 'open', 1],
      ['Пациент С. М.', 'KZ', 'online-consultation', 'yandex / organic', 'Синдром сухого глаза', 'consultation', 'open', 2],
      ['Пациент Г. Т.', 'KG', 'international', 'google / cpc', 'Кератоконус', 'treatment', 'converted', 3],
      ['Пациент Е. Ж.', 'KZ', 'service-consultation', 'google / organic', 'Пресбиопия', 'closed', 'converted', 4],
      ['Patient L. W.', 'DE', 'second-opinion', 'google / organic', 'AMD, wet form', 'consultation', 'open', 5],
      ['Пациент Р. О.', 'RU', 'online-consultation', 'direct', 'Диабетическая ретинопатия', 'qualified', 'open', 6],
      ['Пациент Ж. А.', 'KZ', 'contacts', 'whatsapp / referral', '', 'closed', 'lost', 8],
      ['Patient M. Y.', 'TR', 'partnership', 'linkedin.com / social', '', 'qualified', 'open', 9],
      ['Пациент Ә. Қ.', 'KZ', 'service-consultation', 'google / cpc', 'Косоглазие у ребёнка', 'treatment', 'converted', 11],
      ['Пациент Т. И.', 'UZ', 'international', 'direct', 'Отслойка сетчатки (после операции)', 'documents', 'open', 12],
      ['Researcher K. S.', 'GB', 'science-collaboration', 'nature.com / referral', '', 'new', 'open', 13],
      ['Врач Ф. Н.', 'KZ', 'academy', 'direct', '', 'closed', 'converted', 15],
      ['Пациент О. Л.', 'MN', 'second-opinion', 'google / organic', 'Макулярный отёк', 'new', 'open', 16],
    ] as const
  ).map(([fullName, country, source, channel, diagnosis, stage, conversion, days], index) => ({
    id: `demo-${index + 1}`,
    fullName,
    phone: `+7 700 000 ${String(10 + index).padStart(2, '0')} ${String(20 + index * 3).padStart(2, '0')}`,
    email: '',
    country,
    source,
    channel,
    diagnosis,
    stage,
    conversion,
    date: daysAgo(days, 9 + (index % 8)),
    comment: '',
    origin: 'demo' as const,
  }));

/* ============================================================ CSV EXPORT */

/** CSV with a BOM (Excel opens Cyrillic correctly) and formula-injection guard. */
export const toCsv = (header: string[], rows: string[][]) => {
  const cell = (value: string) => {
    const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
    return /[",;\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return `﻿${[header, ...rows].map((row) => row.map(cell).join(',')).join('\r\n')}`;
};

export const downloadText = (filename: string, text: string, type = 'text/csv;charset=utf-8') => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/* ============================================================ AUTOMATION */

export interface AutomationStep {
  id: string;
  label: Localized;
  delay: string;
  template: string;
  enabled: boolean;
}

export type AutomationId = 'email' | 'whatsapp' | 'reminders' | 'followup';

export interface AutomationFlow {
  id: AutomationId;
  enabled: boolean;
  steps: AutomationStep[];
}

const step = (id: string, label: Localized, delay: string, template: string): AutomationStep => ({
  id,
  label,
  delay,
  template,
  enabled: true,
});

export const DELAYS = ['0m', '15m', '2h', '24h', '48h', '3d', '7d', '30d', '-24h', '-2h'] as const;

export const seedAutomation = (): AutomationFlow[] => [
  {
    id: 'email',
    enabled: true,
    steps: [
      step('confirm', { ru: 'Подтверждение заявки', kk: 'Өтінімді растау', en: 'Request confirmation' }, '0m',
        'Здравствуйте, {name}! Заявка {ref} получена. Координатор свяжется с вами в течение рабочего дня.'),
      step('records', { ru: 'Напоминание о документах', kk: 'Құжаттар туралы еске салу', en: 'Records reminder' }, '48h',
        '{name}, чтобы врач подготовил заключение, пришлите, пожалуйста, снимки и выписки по заявке {ref}.'),
      step('nurture', { ru: 'Повторное касание', kk: 'Қайта байланыс', en: 'Follow-up touch' }, '7d',
        '{name}, остались вопросы о лечении? Ответим в WhatsApp или по телефону.'),
    ],
  },
  {
    id: 'whatsapp',
    enabled: true,
    steps: [
      step('coordinator', { ru: 'Координатору: новый лид', kk: 'Үйлестірушіге: жаңа лид', en: 'Coordinator: new lead' }, '0m',
        'Новый лид {ref}: {name}. Откройте CRM, чтобы ответить.'),
      step('status', { ru: 'Пациенту: смена статуса', kk: 'Пациентке: мәртебе өзгерді', en: 'Patient: status change' }, '0m',
        '{name}, статус вашей заявки {ref} обновлён. Подробности — в личном кабинете.'),
    ],
  },
  {
    id: 'reminders',
    enabled: true,
    steps: [
      step('day-before', { ru: 'За сутки', kk: 'Бір тәулік бұрын', en: 'Day before' }, '-24h',
        '{name}, напоминаем о приёме {date} в {time}, врач {doctor}. Перенести запись можно в кабинете.'),
      step('two-hours', { ru: 'За 2 часа', kk: '2 сағат бұрын', en: 'Two hours before' }, '-2h',
        '{name}, ждём вас сегодня в {time}. Возьмите очки и предыдущие заключения.'),
    ],
  },
  {
    id: 'followup',
    enabled: false,
    steps: [
      step('post-op', { ru: 'После операции: день 1', kk: 'Операциядан кейін: 1-күн', en: 'After surgery: day 1' }, '24h',
        '{name}, как вы себя чувствуете? Если появились боль или снижение зрения — позвоните нам сразу.'),
      step('no-show', { ru: 'После неявки', kk: 'Келмей қалғаннан кейін', en: 'After a no-show' }, '2h',
        '{name}, мы не увиделись {date}. Подобрать новое время?'),
      step('unfinished', { ru: 'Незавершённая заявка', kk: 'Аяқталмаған өтінім', en: 'Unfinished request' }, '3d',
        '{name}, заявка {ref} ждёт документов. Нужна помощь с загрузкой?'),
    ],
  },
];

export const renderTemplate = (template: string) =>
  template
    .replaceAll('{name}', 'Айгерим')
    .replaceAll('{ref}', 'OPH-7K2Q9M')
    .replaceAll('{date}', '02.10.2026')
    .replaceAll('{time}', '10:30')
    .replaceAll('{doctor}', 'офтальмолог');

/* ========================================================== INTEGRATIONS */

export type CrmProvider = 'none' | 'hubspot' | 'zoho' | 'salesforce';
export type VideoProvider = 'zoom' | 'meet' | 'teams';

export interface IntegrationSettings {
  crm: CrmProvider;
  crmAccount: string;
  video: VideoProvider;
  ga4: string;
  gtm: string;
  clarity: string;
  gsc: string;
}

export const seedIntegrations = (): IntegrationSettings => ({
  crm: 'none',
  crmAccount: '',
  video: 'zoom',
  ga4: '',
  gtm: '',
  clarity: '',
  gsc: '',
});

export const TRACKING_PATTERNS: Record<'ga4' | 'gtm' | 'clarity' | 'gsc', RegExp> = {
  ga4: /^G-[A-Z0-9]{6,12}$/,
  gtm: /^GTM-[A-Z0-9]{5,9}$/,
  clarity: /^[a-z0-9]{8,12}$/,
  gsc: /^[A-Za-z0-9_-]{20,64}$|^google[a-z0-9]+\.html$/,
};

/* ============================================================== SECURITY */

export const ROLES: RoleId[] = ['admin', 'editor', 'coordinator', 'doctor'];
export const PERMISSIONS: PermissionId[] = ['pages', 'articles', 'leads', 'medical', 'analytics', 'settings', 'users'];

export interface SecuritySettings {
  matrix: Record<RoleId, PermissionId[]>;
  spam: Record<'honeypot' | 'minTime' | 'rateLimit' | 'fileScan' | 'captcha', boolean>;
  lastBackup: string;
}

export const seedSecurity = (): SecuritySettings => ({
  matrix: {
    admin: [...PERMISSIONS],
    editor: ['pages', 'articles', 'analytics'],
    coordinator: ['leads', 'medical', 'analytics'],
    doctor: ['articles', 'medical'],
  },
  spam: { honeypot: true, minTime: true, rateLimit: true, fileScan: true, captcha: false },
  // Empty until the administrator actually downloads a settings copy.
  lastBackup: '',
});
