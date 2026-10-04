import type { AssistantLanguage } from './types.ts';

/** Trilingual response templates. Keys mirror the assistant's intents. */
export const PHRASES: Record<string, Record<AssistantLanguage, string>> = {
  greeting: {
    ru: 'Здравствуйте! Я ассистент OPHTRA. Подберу услугу и врача, отвечу на вопросы и запишу на приём. С чего начнём?',
    kk: 'Сәлеметсіз бе! Мен OPHTRA ассистентімін. Қызмет пен дәрігер таңдап беремін, сұрақтарға жауап беремін және қабылдауға жазамын. Неден бастаймыз?',
    en: 'Hello! I am the OPHTRA assistant. I can suggest a service and a doctor, answer questions and book an appointment. Where shall we start?',
  },
  askSymptom: {
    ru: 'Расскажите, что беспокоит. Например: «двоится в глазах», «резь после компьютера», «упало зрение вдаль».',
    kk: 'Не мазалайтынын айтыңыз. Мысалы: «көзім екі көреді», «компьютерден кейін ашиды», «алысты нашар көремін».',
    en: 'Tell me what is bothering you. For example: “double vision”, “stinging after screen work”, “distance vision has dropped”.',
  },
  askEye: {
    ru: 'Симптом на одном глазу или на обоих?',
    kk: 'Симптом бір көзде ме, әлде екеуінде де ме?',
    en: 'Is the symptom in one eye or both?',
  },
  askDuration: {
    ru: 'Как давно это началось?',
    kk: 'Бұл қашан басталды?',
    en: 'How long ago did it start?',
  },
  urgent: {
    ru: 'Резкое падение зрения с болью требует осмотра сегодня. Позвоните в контакт-центр — вас примут вне очереди.',
    kk: 'Көрудің күрт төмендеуі мен ауырсыну бүгін қаралуды талап етеді. Байланыс орталығына қоңырау шалыңыз — сізді кезексіз қабылдайды.',
    en: 'A sudden drop in vision with pain needs to be seen today. Please call the contact centre — you will be seen out of turn.',
  },
  bookingOpen: {
    ru: 'Открываю форму записи — выбранная услуга уже подставлена.',
    kk: 'Жазылу нысанын ашып жатырмын — таңдалған қызмет қойылған.',
    en: 'Opening the booking form with the service already selected.',
  },
  bookingReady: {
    ru: 'Готов открыть форму записи с уже выбранными параметрами. Продолжаем?',
    kk: 'Таңдалған параметрлермен жазылу нысанын ашуға дайынмын. Жалғастырамыз ба?',
    en: 'I can open the booking form with your selections prefilled. Shall we continue?',
  },
  cancel: {
    ru: 'Отменить запись можно в личном кабинете — там же видно время и врача. Открыть кабинет?',
    kk: 'Жазылуды жеке кабинетте болдырмауға болады — сонда уақыт пен дәрігер де көрінеді. Кабинетті ашайын ба?',
    en: 'You can cancel an appointment in your patient account, where the time and doctor are also shown. Open the account?',
  },
  reschedule: {
    ru: 'Перенос доступен в личном кабинете: выберите запись и новое время. Открыть кабинет?',
    kk: 'Ауыстыру жеке кабинетте қолжетімді: жазбаны және жаңа уақытты таңдаңыз. Кабинетті ашайын ба?',
    en: 'Rescheduling is available in your patient account: pick the appointment and a new time. Open the account?',
  },
  notifications: {
    ru: 'После записи придёт подтверждение, затем напоминания за 24 часа и за 2 часа до приёма — в WhatsApp и на e-mail.',
    kk: 'Жазылғаннан кейін растау келеді, содан кейін қабылдауға 24 сағат және 2 сағат қалғанда еске салулар — WhatsApp пен e-mail-ға.',
    en: 'After booking you receive a confirmation, then reminders 24 hours and 2 hours before the visit — on WhatsApp and by email.',
  },
  operator: {
    ru: 'Передаю диалог оператору контакт-центра. Специалист подключится в течение 3 минут — история переписки уже у него.',
    kk: 'Диалогты байланыс орталығының операторына беремін. Маман 3 минут ішінде қосылады — хат алмасу тарихы онда бар.',
    en: 'I am transferring this conversation to a contact-centre operator. A specialist will join within 3 minutes and already has the chat history.',
  },
  fallback: {
    ru: 'Пока не нашёл точного ответа. Могу подобрать услугу, порекомендовать врача, записать на приём или соединить с оператором.',
    kk: 'Әзірге нақты жауап таппадым. Қызмет таңдай аламын, дәрігер ұсына аламын, қабылдауға жаза аламын немесе оператормен байланыстыра аламын.',
    en: 'I have not found an exact answer yet. I can suggest a service, recommend a doctor, book an appointment or connect you to an operator.',
  },
  disclaimer: {
    ru: 'Это предварительная рекомендация, а не диагноз — заключение даёт врач на очном приёме.',
    kk: 'Бұл алдын ала ұсыныс, диагноз емес — қорытындыны дәрігер очно қабылдауда береді.',
    en: 'This is a preliminary suggestion, not a diagnosis — a doctor gives the conclusion at an in-person visit.',
  },
  serviceIntro: {
    ru: 'По вашему запросу подходит направление «{department}».',
    kk: '«{department}» бағыты сұрауыңызға сәйкес келеді.',
    en: 'The “{department}” specialty matches your request.',
  },
  servicePrice: {
    ru: 'Услуга «{service}» — от {price} ₸.',
    kk: '«{service}» қызметі — {price} ₸ бастап.',
    en: 'The “{service}” service starts at {price} ₸.',
  },
  doctorIntro: {
    ru: 'Рекомендую врача: {doctor}, {role}.',
    kk: 'Дәрігер ұсынамын: {doctor}, {role}.',
    en: 'I recommend: {doctor}, {role}.',
  },
};

export const SUGGESTIONS: Record<AssistantLanguage, Record<string, string>> = {
  ru: {
    faq: 'Частые вопросы',
    service: 'Подобрать услугу',
    doctor: 'Подобрать врача',
    symptoms: 'Описать симптомы',
    booking: 'Записаться на приём',
    reschedule: 'Перенести запись',
    cancel: 'Отменить запись',
    operator: 'Связаться с оператором',
    prices: 'Сколько стоит?',
    both: 'Оба глаза',
    one: 'Один глаз',
    today: 'Сегодня',
    days: 'Несколько дней',
    weeks: 'Несколько недель',
    months: 'Больше месяца',
    yes: 'Да, продолжаем',
  },
  kk: {
    faq: 'Жиі қойылатын сұрақтар',
    service: 'Қызмет таңдау',
    doctor: 'Дәрігер таңдау',
    symptoms: 'Симптомдарды сипаттау',
    booking: 'Қабылдауға жазылу',
    reschedule: 'Жазылуды ауыстыру',
    cancel: 'Жазылудан бас тарту',
    operator: 'Оператормен байланысу',
    prices: 'Қанша тұрады?',
    both: 'Екі көз',
    one: 'Бір көз',
    today: 'Бүгін',
    days: 'Бірнеше күн',
    weeks: 'Бірнеше апта',
    months: 'Бір айдан астам',
    yes: 'Иә, жалғастырамыз',
  },
  en: {
    faq: 'Frequent questions',
    service: 'Recommend a service',
    doctor: 'Recommend a doctor',
    symptoms: 'Describe symptoms',
    booking: 'Book an appointment',
    reschedule: 'Reschedule',
    cancel: 'Cancel appointment',
    operator: 'Talk to an operator',
    prices: 'How much does it cost?',
    both: 'Both eyes',
    one: 'One eye',
    today: 'Today',
    days: 'A few days',
    weeks: 'A few weeks',
    months: 'Over a month',
    yes: 'Yes, continue',
  },
};

export const phrase = (key: string, language: AssistantLanguage): string =>
  PHRASES[key]?.[language] ?? PHRASES[key]?.ru ?? '';

export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
