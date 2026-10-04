/**
 * Patient portals — copy shared by the international-patients, second-opinion
 * and online-consultation pages (spec §6.5, §6.6, §6.9, §8, §9, §12).
 *
 * Page-specific copy lives in `patients-international.ts`,
 * `patients-second-opinion.ts` and `patients-consultation.ts`, so each route
 * chunk carries only its own text. Read everything with `L()` from `useI18n()`.
 */
import type { Localized } from '@/i18n';

export interface PtItem {
  title: Localized;
  text: Localized;
}

export interface PtListItem extends PtItem {
  list?: Localized[];
}

export interface PtFaq {
  q: Localized;
  a: Localized;
}

export interface PtOption {
  value: string;
  label: Localized;
}

/* ================================================================ SHARED */

export const ptShared = {
  toc: { ru: 'На этой странице', kk: 'Осы бетте', en: 'On this page' },
  faqEyebrow: { ru: 'Вопросы и ответы', kk: 'Сұрақтар мен жауаптар', en: 'Questions and answers' },
  faqTitle: { ru: 'Что обычно спрашивают', kk: 'Жиі қойылатын сұрақтар', en: 'What patients usually ask' },
  formEyebrow: { ru: 'Заявка', kk: 'Өтінім', en: 'Request' },
  portalsEyebrow: { ru: 'Другие пути', kk: 'Басқа жолдар', en: 'Other routes' },
  portalsTitle: {
    ru: 'Выберите удобный способ начать',
    kk: 'Бастаудың ыңғайлы жолын таңдаңыз',
    en: 'Choose the way to start that suits you',
  },
  open: { ru: 'Открыть', kk: 'Ашу', en: 'Open' },
  whatsapp: { ru: 'Написать в WhatsApp', kk: 'WhatsApp-қа жазу', en: 'Message on WhatsApp' },
  disclaimer: {
    ru: 'Информация на странице носит справочный характер и не заменяет очную консультацию. Решение о лечении врач принимает только после осмотра и изучения документов.',
    kk: 'Беттегі ақпарат анықтамалық сипатта және дәрігердің қабылдауын алмастырмайды. Емдеу туралы шешімді дәрігер тексеру мен құжаттарды зерделегеннен кейін ғана қабылдайды.',
    en: 'This page is for general information and does not replace an in-person examination. Treatment decisions are made by a doctor only after an examination and a review of your records.',
  },
} satisfies Record<string, Localized>;

/* Portal titles keep «Онлайн-…» on one line: U+2060 (word joiner) around the
   hyphen stops a break there without needing a U+2011 glyph in the fonts (D5). */
export const ptPortals: Array<{ key: 'international' | 'secondOpinion' | 'consultation' | 'doctors' | 'appointment' | 'contacts'; eyebrow: Localized; title: Localized; text: Localized }> = [
  {
    key: 'international',
    eyebrow: { ru: 'Портал', kk: 'Портал', en: 'Portal' },
    title: { ru: 'Международным пациентам', kk: 'Халықаралық пациенттерге', en: 'International patients' },
    text: {
      ru: 'Путь лечения, расчёт стоимости, виза, проживание, трансфер и перевод.',
      kk: 'Емделу жолы, құнын есептеу, виза, тұру, трансфер және аударма.',
      en: 'Treatment path, cost estimate, visa, accommodation, transfers and interpreting.',
    },
  },
  {
    key: 'secondOpinion',
    eyebrow: { ru: 'Дистанционно', kk: 'Қашықтан', en: 'Remote' },
    title: { ru: 'Второе мнение', kk: 'Екінші пікір', en: 'Second opinion' },
    text: {
      ru: 'Заключение специалистов по вашим снимкам и выпискам — ещё до поездки.',
      kk: 'Суреттеріңіз бен көшірмелеріңіз бойынша мамандар қорытындысы — сапарға дейін.',
      en: 'A specialist conclusion based on your scans and reports, before you travel.',
    },
  },
  {
    key: 'consultation',
    eyebrow: { ru: 'Видеосвязь', kk: 'Бейнебайланыс', en: 'Video call' },
    title: { ru: 'Онлайн\u2060-\u2060консультация', kk: 'Онлайн кеңес', en: 'Online consultation' },
    text: {
      ru: 'Разговор с офтальмологом в Zoom, Google Meet или Microsoft Teams.',
      kk: 'Офтальмологпен Zoom, Google Meet немесе Microsoft Teams арқылы сөйлесу.',
      en: 'Talk to an ophthalmologist on Zoom, Google Meet or Microsoft Teams.',
    },
  },
  {
    key: 'doctors',
    eyebrow: { ru: 'Команда', kk: 'Команда', en: 'Team' },
    title: { ru: 'Врачи центра', kk: 'Орталық дәрігерлері', en: 'Our doctors' },
    text: {
      ru: 'Опыт, языки и направления каждого специалиста.',
      kk: 'Әр маманның тәжірибесі, тілдері мен бағыттары.',
      en: 'Experience, languages and focus of every specialist.',
    },
  },
  {
    key: 'appointment',
    eyebrow: { ru: 'Очный приём', kk: 'Бетпе-бет қабылдау', en: 'In person' },
    title: { ru: 'Онлайн\u2060-\u2060запись', kk: 'Онлайн жазылу', en: 'Book a visit' },
    text: {
      ru: 'Выберите услугу, врача, дату и время за пару минут.',
      kk: 'Қызметті, дәрігерді, күн мен уақытты бірнеше минутта таңдаңыз.',
      en: 'Pick a service, doctor, date and time in a couple of minutes.',
    },
  },
  {
    key: 'contacts',
    eyebrow: { ru: 'Связь', kk: 'Байланыс', en: 'Get in touch' },
    title: { ru: 'Контакты', kk: 'Байланыс', en: 'Contacts' },
    text: {
      ru: 'Адреса клиник, телефоны, e-mail и WhatsApp.',
      kk: 'Клиника мекенжайлары, телефондар, e-mail және WhatsApp.',
      en: 'Clinic addresses, phone numbers, e-mail and WhatsApp.',
    },
  },
];

/** Countries offered in the application forms (plus «Other»). */
export const ptCountries: PtOption[] = [
  { value: 'RU', label: { ru: 'Россия', kk: 'Ресей', en: 'Russia' } },
  { value: 'UZ', label: { ru: 'Узбекистан', kk: 'Өзбекстан', en: 'Uzbekistan' } },
  { value: 'KG', label: { ru: 'Кыргызстан', kk: 'Қырғызстан', en: 'Kyrgyzstan' } },
  { value: 'TJ', label: { ru: 'Таджикистан', kk: 'Тәжікстан', en: 'Tajikistan' } },
  { value: 'TM', label: { ru: 'Туркменистан', kk: 'Түрікменстан', en: 'Turkmenistan' } },
  { value: 'AZ', label: { ru: 'Азербайджан', kk: 'Әзербайжан', en: 'Azerbaijan' } },
  { value: 'GE', label: { ru: 'Грузия', kk: 'Грузия', en: 'Georgia' } },
  { value: 'AM', label: { ru: 'Армения', kk: 'Армения', en: 'Armenia' } },
  { value: 'MN', label: { ru: 'Монголия', kk: 'Моңғолия', en: 'Mongolia' } },
  { value: 'CN', label: { ru: 'Китай', kk: 'Қытай', en: 'China' } },
  { value: 'TR', label: { ru: 'Турция', kk: 'Түркия', en: 'Türkiye' } },
  { value: 'AE', label: { ru: 'ОАЭ', kk: 'БАӘ', en: 'United Arab Emirates' } },
  { value: 'SA', label: { ru: 'Саудовская Аравия', kk: 'Сауд Арабиясы', en: 'Saudi Arabia' } },
  { value: 'IN', label: { ru: 'Индия', kk: 'Үндістан', en: 'India' } },
  { value: 'DE', label: { ru: 'Германия', kk: 'Германия', en: 'Germany' } },
  { value: 'GB', label: { ru: 'Великобритания', kk: 'Ұлыбритания', en: 'United Kingdom' } },
  { value: 'US', label: { ru: 'США', kk: 'АҚШ', en: 'United States' } },
  { value: 'KZ', label: { ru: 'Казахстан', kk: 'Қазақстан', en: 'Kazakhstan' } },
  { value: 'OTHER', label: { ru: 'Другая страна', kk: 'Басқа ел', en: 'Other country' } },
];

export const ptLanguages: PtOption[] = [
  { value: 'ru', label: { ru: 'Русский', kk: 'Орыс тілі', en: 'Russian' } },
  { value: 'kk', label: { ru: 'Казахский', kk: 'Қазақ тілі', en: 'Kazakh' } },
  { value: 'en', label: { ru: 'Английский', kk: 'Ағылшын тілі', en: 'English' } },
];

export const ptFieldLabels = {
  country: { ru: 'Страна проживания', kk: 'Тұратын еліңіз', en: 'Country of residence' },
  service: { ru: 'Интересующая услуга', kk: 'Қызықтыратын қызмет', en: 'Service of interest' },
  diagnosis: { ru: 'Диагноз или жалобы', kk: 'Диагноз немесе шағымдар', en: 'Diagnosis or symptoms' },
  diagnosisHint: {
    ru: 'Например: катаракта обоих глаз, близорукость −5',
    kk: 'Мысалы: екі көздің катарактасы, алыстан көрмеушілік −5',
    en: 'For example: cataract in both eyes, myopia −5',
  },
  dates: { ru: 'Желаемые даты поездки', kk: 'Сапардың қалаған күндері', en: 'Preferred travel dates' },
  datesHint: { ru: 'Например: 10–20 ноября', kk: 'Мысалы: 10–20 қараша', en: 'For example: 10–20 November' },
  language: { ru: 'Язык общения', kk: 'Байланыс тілі', en: 'Preferred language' },
  question: { ru: 'Вопрос специалисту', kk: 'Маманға сұрақ', en: 'Your question for the specialist' },
  questionHint: {
    ru: 'Что именно вы хотите узнать: подтвердить диагноз, оценить предложенную операцию, выбрать между вариантами',
    kk: 'Нақты не білгіңіз келеді: диагнозды растау, ұсынылған операцияны бағалау, нұсқалар арасынан таңдау',
    en: 'What exactly you want to know: confirm a diagnosis, assess a proposed operation, choose between options',
  },
  platform: { ru: 'Платформа видеосвязи', kk: 'Бейнебайланыс платформасы', en: 'Video platform' },
  date: { ru: 'Желаемая дата', kk: 'Қалаған күн', en: 'Preferred date' },
  timezone: { ru: 'Часовой пояс или город', kk: 'Уақыт белдеуі немесе қала', en: 'Time zone or city' },
  otherService: { ru: 'Пока не знаю — нужна консультация', kk: 'Әзірге білмеймін — кеңес керек', en: 'Not sure yet — I need advice' },
} satisfies Record<string, Localized>;
