import type { Localized } from '@/i18n/types';

/**
 * Copy for the always-mounted overlays (cookie card, assistant chrome) and the
 * 404 page. Kept apart from `platform.ts` so the ~33 kB of admin / account /
 * CRM copy no longer rides in the entry chunk (perf report, bundle item 3).
 */

type Dict = Record<string, Localized>;

const l = (ru: string, kk: string, en: string): Localized => ({ ru, kk, en });

export const notFoundCopy = {
  eyebrow: l('Ошибка 404', '404 қатесі', 'Error 404'),
  title: l('Страница не найдена', 'Бет табылмады', 'Page not found'),
  lead: l(
    'Возможно, адрес изменился после обновления сайта. Вот куда обычно ведут эти ссылки.',
    'Сайт жаңартылғаннан кейін мекенжай өзгерген болуы мүмкін. Бұл сілтемелер әдетте осында апарады.',
    'The address may have changed when the site was updated. Here is where such links usually lead.',
  ),
  home: l('На главную', 'Басты бетке', 'Home page'),
  where: l('Популярные разделы', 'Танымал бөлімдер', 'Popular sections'),
  services: l('Услуги', 'Қызметтер', 'Services'),
  servicesText: l('Диагностика, лечение и хирургия.', 'Диагностика, емдеу және хирургия.', 'Diagnostics, treatment and surgery.'),
  doctors: l('Врачи', 'Дәрігерлер', 'Doctors'),
  doctorsText: l('Команда центра и опыт.', 'Орталық командасы және тәжірибе.', 'The team and their experience.'),
  knowledge: l('База знаний', 'Білім базасы', 'Knowledge base'),
  knowledgeText: l('Статьи врачей о зрении.', 'Дәрігерлердің көру туралы мақалалары.', 'Doctors’ articles about vision.'),
  contacts: l('Контакты', 'Байланыс', 'Contacts'),
  contactsText: l('Адреса, телефоны, WhatsApp.', 'Мекенжайлар, телефондар, WhatsApp.', 'Addresses, phones, WhatsApp.'),
  open: l('Открыть', 'Ашу', 'Open'),
} satisfies Dict;

export const consentCopy = {
  title: l('Cookie и конфиденциальность', 'Cookie және құпиялылық', 'Cookies & privacy'),
  text: l(
    'Необходимые cookie обеспечивают работу сайта. С вашего согласия мы включим аналитику (GA4, Clarity), чтобы понять, какие страницы полезны пациентам. Согласие можно отозвать в любой момент.',
    'Қажетті cookie сайттың жұмысын қамтамасыз етеді. Келісіміңізбен пациенттерге қандай беттер пайдалы екенін түсіну үшін аналитиканы (GA4, Clarity) қосамыз. Келісімді кез келген уақытта қайтарып алуға болады.',
    'Essential cookies keep the site working. With your consent we enable analytics (GA4, Clarity) to learn which pages help patients. You can withdraw consent at any time.',
  ),
  accept: l('Принять', 'Қабылдау', 'Accept'),
  decline: l('Только необходимые', 'Тек қажеттілері', 'Essential only'),
  settings: l('Настройки и политика', 'Баптаулар және саясат', 'Settings & policy'),
  region: l('Согласие на cookie', 'Cookie-ге келісім', 'Cookie consent'),
} satisfies Dict;

/** Assistant chrome strings not covered by the shared dictionary. */
export const assistantUiCopy = {
  openBooking: l('Открыть запись', 'Жазылуды ашу', 'Open booking'),
  opening: l('Открываю форму записи…', 'Жазылу нысанын ашып жатырмын…', 'Opening the booking form…'),
} satisfies Dict;
