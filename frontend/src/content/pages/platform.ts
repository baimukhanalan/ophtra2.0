import type { Localized } from '@/i18n/types';
import type { KnowledgeCategory } from './knowledge-types';

/**
 * Platform copy (spec §13–§18): administrator workspace, patient account,
 * FAQ / reviews / legal / 404, cookie card and floating controls.
 * Every visible string is trilingual; read with `L()` from `useI18n()`.
 */

type Dict = Record<string, Localized>;

const l = (ru: string, kk: string, en: string): Localized => ({ ru, kk, en });

/* ================================================================== ADMIN */

export const adminNav = {
  groupContent: l('Контент', 'Контент', 'Content'),
  groupCrm: l('Пациенты и CRM', 'Пациенттер және CRM', 'Patients & CRM'),
  groupSettings: l('Настройки', 'Баптаулар', 'Settings'),
  pages: l('Страницы', 'Беттер', 'Pages'),
  articles: l('Статьи', 'Мақалалар', 'Articles'),
  news: l('Новости', 'Жаңалықтар', 'News'),
  promotions: l('Акции', 'Акциялар', 'Promotions'),
  doctors: l('Врачи', 'Дәрігерлер', 'Doctors'),
  prices: l('Цены', 'Бағалар', 'Prices'),
  photos: l('Фотографии', 'Фотосуреттер', 'Photos'),
  requests: l('Лиды', 'Лидтер', 'Leads'),
  forms: l('Формы', 'Формалар', 'Forms'),
  analytics: l('Аналитика', 'Аналитика', 'Analytics'),
  automation: l('Автоматизация', 'Автоматтандыру', 'Automation'),
  integrations: l('Интеграции', 'Интеграциялар', 'Integrations'),
  seo: l('SEO и AI', 'SEO және AI', 'SEO & AI'),
  security: l('Безопасность', 'Қауіпсіздік', 'Security'),
} satisfies Dict;

export const adminCopy = {
  eyebrow: l('Администрирование', 'Әкімшілік', 'Administration'),
  heroText: l(
    'Страницы, статьи, формы, заявки и аналитика — ежедневные изменения без программиста.',
    'Беттер, мақалалар, формалар, өтінімдер және аналитика — күнделікті өзгерістер бағдарламашысыз.',
    'Pages, articles, forms, leads and analytics — day-to-day changes without a developer.',
  ),
  login: l('Логин', 'Логин', 'Login'),
  password: l('Пароль', 'Құпиясөз', 'Password'),
  loginError: l('Неверный логин или пароль', 'Логин немесе құпиясөз қате', 'Incorrect login or password'),
  loginRequired: l('Введите логин и пароль', 'Логин мен құпиясөзді енгізіңіз', 'Enter your login and password'),
  demoMode: l('Демо-режим', 'Демо-режим', 'Demo mode'),
  demoModeText: l(
    'API недоступен: изменения сохраняются в этом браузере и будут отправлены, когда сервер подключат.',
    'API қолжетімсіз: өзгерістер осы браузерде сақталады және сервер қосылғанда жіберіледі.',
    'The API is unreachable: changes are kept in this browser and will be sent once the server is connected.',
  ),
  online: l('Подключено к API', 'API-ге қосылған', 'Connected to the API'),
  signedInAs: l('Вы вошли как', 'Сіз кірдіңіз', 'Signed in as'),
  savedLocal: l('Сохранено локально', 'Жергілікті сақталды', 'Saved locally'),
  saved: l('Сохранено', 'Сақталды', 'Saved'),
  create: l('Создать', 'Құру', 'Create'),
  save: l('Сохранить', 'Сақтау', 'Save'),
  pagesTitle: l('Страницы сайта', 'Сайт беттері', 'Site pages'),
  articlesTitle: l('Статьи базы знаний', 'Білім базасының мақалалары', 'Knowledge-base articles'),
  sectionsShort: l('секц.', 'бөлім', 'sections'),
  edit: l('Редактировать', 'Өңдеу', 'Edit'),
  cancel: l('Отмена', 'Болдырмау', 'Cancel'),
  delete: l('Удалить', 'Жою', 'Delete'),
  confirmDelete: l('Удалить без возможности восстановления?', 'Қалпына келтірусіз жою керек пе?', 'Delete permanently?'),
  status: l('Статус', 'Мәртебе', 'Status'),
  published: l('Опубликовано', 'Жарияланды', 'Published'),
  draft: l('Черновик', 'Жоба', 'Draft'),
  publish: l('Опубликовать', 'Жариялау', 'Publish'),
  unpublish: l('Снять с публикации', 'Жариялаудан алу', 'Unpublish'),
  updated: l('Обновлено', 'Жаңартылды', 'Updated'),
  title: l('Заголовок', 'Тақырып', 'Title'),
  slug: l('Адрес (slug)', 'Мекенжай (slug)', 'URL slug'),
  slugHint: l('Латиница, цифры и дефис', 'Латын әріптері, сандар және сызықша', 'Latin letters, digits and hyphens'),
  slugInvalid: l('Только a–z, 0–9 и дефис', 'Тек a–z, 0–9 және сызықша', 'Only a–z, 0–9 and hyphens'),
  slugTaken: l('Такой адрес уже занят', 'Бұл мекенжай бос емес', 'This address is already taken'),
  required: l('Обязательное поле', 'Міндетті өріс', 'Required'),
  description: l('Описание (meta description)', 'Сипаттама (meta description)', 'Meta description'),
  sections: l('Секции страницы', 'Бет бөлімдері', 'Page sections'),
  sectionHeading: l('Заголовок секции', 'Бөлім тақырыбы', 'Section heading'),
  sectionBody: l('Текст секции', 'Бөлім мәтіні', 'Section text'),
  addSection: l('Добавить секцию', 'Бөлім қосу', 'Add section'),
  moveUp: l('Выше', 'Жоғары', 'Move up'),
  moveDown: l('Ниже', 'Төмен', 'Move down'),
  removeSection: l('Удалить секцию', 'Бөлімді жою', 'Remove section'),
  newPage: l('Новая страница', 'Жаңа бет', 'New page'),
  pagesLead: l(
    'Создавайте посадочные страницы и правьте тексты разделов. На сайт и в sitemap страницы попадают после подключения API.',
    'Қону беттерін жасаңыз және бөлім мәтіндерін өңдеңіз. Беттер сайтқа және sitemap-ке API қосылғаннан кейін түседі.',
    'Create landing pages and edit section copy. Pages reach the site and the sitemap once the API is connected.',
  ),
  noPages: l('Страниц пока нет', 'Беттер әзірге жоқ', 'No pages yet'),
  newArticle: l('Новая статья', 'Жаңа мақала', 'New article'),
  articlesLead: l(
    'База знаний: категория, теги и автор. Статья без автора-врача не публикуется.',
    'Білім базасы: санат, тегтер және автор. Дәрігер-авторы жоқ мақала жарияланбайды.',
    'Knowledge base: category, tags and author. An article without a medical author cannot be published.',
  ),
  category: l('Категория', 'Санат', 'Category'),
  tags: l('Теги', 'Тегтер', 'Tags'),
  tagsHint: l('Через запятую', 'Үтір арқылы', 'Comma-separated'),
  author: l('Автор', 'Автор', 'Author'),
  excerpt: l('Краткое описание', 'Қысқаша сипаттама', 'Excerpt'),
  body: l('Текст статьи', 'Мақала мәтіні', 'Article body'),
  authorRequired: l('Укажите автора перед публикацией', 'Жарияламас бұрын авторды көрсетіңіз', 'Choose an author before publishing'),
  noArticles: l('Статей не найдено', 'Мақалалар табылмады', 'No articles found'),
  allCategories: l('Все категории', 'Барлық санаттар', 'All categories'),
  allStatuses: l('Все статусы', 'Барлық мәртебелер', 'All statuses'),
  search: l('Поиск', 'Іздеу', 'Search'),
  actions: l('Действия', 'Әрекеттер', 'Actions'),
  photoInvalid: l('Пропущены файлы: только изображения до 8 МБ', 'Файлдар өткізілді: тек 8 МБ-қа дейінгі суреттер', 'Skipped files: images up to 8 MB only'),
  photosLocal: l(
    'Предпросмотр в браузере. Загрузка в медиатеку выполняется, когда подключён API.',
    'Браузердегі алдын ала қарау. Медиатекаға жүктеу API қосылғанда орындалады.',
    'Browser preview. Upload to the media library runs once the API is connected.',
  ),
  removePhoto: l('Убрать фото', 'Фотоны алып тастау', 'Remove photo'),
  workspace: l('Рабочее пространство', 'Жұмыс кеңістігі', 'Workspace'),
  photosLead: l('JPG, PNG, WebP · до 8 МБ', 'JPG, PNG, WebP · 8 МБ-қа дейін', 'JPG, PNG, WebP · up to 8 MB'),
  seoTitle: l('SEO и готовность к AI-поиску', 'SEO және AI-іздеуге дайындық', 'SEO & AI-search readiness'),
  seoFiles: l('Файлы для поисковых и AI-систем', 'Іздеу және AI жүйелеріне арналған файлдар', 'Files for search and AI engines'),
  seoSchema: l('Структурированные данные', 'Құрылымдалған деректер', 'Structured data'),
  seoSchemaText: l(
    'MedicalClinic, Organization, Person (основатель), Physician, Article, MedicalWebPage, FAQPage, BreadcrumbList.',
    'MedicalClinic, Organization, Person (негізін қалаушы), Physician, Article, MedicalWebPage, FAQPage, BreadcrumbList.',
    'MedicalClinic, Organization, Person (founder), Physician, Article, MedicalWebPage, FAQPage, BreadcrumbList.',
  ),
  ogImage: l('Изображение Open Graph', 'Open Graph суреті', 'Open Graph image'),
  open: l('Открыть', 'Ашу', 'Open'),
  seoLead: l(
    'Индексация, sitemap, llms.txt для ChatGPT, Gemini, Perplexity и Google AI Overview.',
    'Индекстеу, sitemap, ChatGPT, Gemini, Perplexity және Google AI Overview үшін llms.txt.',
    'Indexing, sitemap and llms.txt for ChatGPT, Gemini, Perplexity and Google AI Overview.',
  ),
  aiCrawlers: l('AI-краулеры разрешены в robots.txt', 'AI-краулерлерге robots.txt-те рұқсат етілген', 'AI crawlers are allowed in robots.txt'),
  backToSite: l('На сайт', 'Сайтқа', 'Back to site'),
  sectionPicker: l('Раздел панели', 'Панель бөлімі', 'Panel section'),
  a11y: l('Доступность', 'Қолжетімділік', 'Accessibility'),
  signInLead: l(
    'Доступ только для сотрудников центра. Учётные данные выдаёт администратор.',
    'Тек орталық қызметкерлеріне арналған. Тіркелгі деректерін әкімші береді.',
    'Staff only. Credentials are issued by the administrator.',
  ),
  pending: l('Ожидает ключей', 'Кілттерді күтуде', 'Awaiting keys'),
  pendingServer: l('Требует сервер', 'Сервер қажет', 'Needs the server'),
  clientSide: l('Работает в браузере', 'Браузерде жұмыс істейді', 'Runs in the browser'),
  demoData: l('Демо-данные', 'Демо-деректер', 'Demo data'),
} satisfies Dict;

/**
 * Honest status notes for screens whose back-end connections do not exist
 * yet (audit: admin must not claim live integrations).
 */
export const pendingCopy = {
  analyticsTitle: l('Аналитика ещё не подключена', 'Аналитика әлі қосылмаған', 'Analytics is not connected yet'),
  analyticsText: l(
    'Графики и KPI ниже — демонстрационные, чтобы показать вид отчёта. Реальные данные появятся, когда в сборку добавят VITE_GA4_ID (и при необходимости VITE_GTM_ID, VITE_CLARITY_ID), а на сервере — доступ к GA4 Data API. Блок «Лиды по источникам» считается по списку лидов этой панели.',
    'Төмендегі графиктер мен KPI — есептің түрін көрсету үшін демонстрациялық. Нақты деректер жинаққа VITE_GA4_ID (қажет болса VITE_GTM_ID, VITE_CLARITY_ID), ал серверге GA4 Data API қолжетімділігі қосылғанда пайда болады. «Дереккөздер бойынша лидтер» блогы осы панельдегі лидтер тізімі бойынша есептеледі.',
    'The charts and KPIs below are demo figures that show what the report will look like. Real data appears once VITE_GA4_ID (and, if needed, VITE_GTM_ID and VITE_CLARITY_ID) is added to the build and the server has GA4 Data API access. «Leads by source» is counted from this panel’s lead list.',
  ),
  automationTitle: l('Отправка сообщений не подключена', 'Хабарлама жіберу қосылмаған', 'Message delivery is not connected'),
  automationText: l(
    'Сценарии и шаблоны сохраняются как настройка, но письма и WhatsApp-сообщения не отправляются, пока на сервере не заданы ключи e-mail-провайдера и WhatsApp Business API.',
    'Сценарийлер мен үлгілер баптау ретінде сақталады, бірақ серверде e-mail провайдері мен WhatsApp Business API кілттері берілмейінше хаттар мен WhatsApp хабарламалары жіберілмейді.',
    'Scenarios and templates are saved as settings, but no e-mail or WhatsApp message is sent until the server has e-mail provider and WhatsApp Business API keys.',
  ),
  integrationsTitle: l('Интеграции в статусе настройки', 'Интеграциялар баптау күйінде', 'Integrations are pending configuration'),
  integrationsText: l(
    'Выбор CRM и видеоплатформы сохраняется как настройка. Соединение появится, когда разработчик добавит ключ API выбранного сервиса в переменные окружения сервера; до этого лиды никуда не передаются.',
    'CRM мен бейнеплатформа таңдауы баптау ретінде сақталады. Әзірлеуші таңдалған қызметтің API кілтін сервердің орта айнымалыларына қосқанда байланыс пайда болады; оған дейін лидтер ешқайда жіберілмейді.',
    'The CRM and video-platform choice is stored as a setting. The connection goes live once a developer adds the chosen service’s API key to the server environment; until then leads are not sent anywhere.',
  ),
  statusLabel: l('Статус соединения', 'Байланыс күйі', 'Connection status'),
  notSelected: l('Не выбрано', 'Таңдалмаған', 'Not selected'),
  formsNote: l(
    'Настройки форм и адреса уведомлений применяются после подключения API; сейчас они хранятся в этом браузере.',
    'Форма баптаулары мен хабарландыру мекенжайлары API қосылғаннан кейін қолданылады; қазір олар осы браузерде сақталады.',
    'Form settings and notification addresses take effect once the API is connected; for now they are kept in this browser.',
  ),
  backupsText: l(
    'Резервное копирование базы данных настраивается на сервере при развёртывании. Здесь можно скачать копию настроек панели.',
    'Дерекқордың сақтық көшірмесі серверде орналастыру кезінде бапталады. Мұнда панель баптауларының көшірмесін жүктеуге болады.',
    'Database backups are configured on the server at deployment. Here you can download a copy of the panel settings.',
  ),
  backupNever: l('ещё не скачивалась', 'әлі жүктелмеген', 'not downloaded yet'),
  backupDone: l('Копия настроек скачана', 'Баптаулар көшірмесі жүктелді', 'Settings copy downloaded'),
  spamText: l(
    'Скрытое поле и минимальное время заполнения работают в формах сайта уже сейчас. Лимит запросов, проверка файлов и капча включаются на сервере.',
    'Жасырын өріс пен толтырудың ең аз уақыты сайт формаларында қазір жұмыс істейді. Сұрау шектеуі, файл тексеру және капча серверде қосылады.',
    'The honeypot field and minimum fill time already work in the site forms. Rate limiting, file checks and the challenge are switched on at the server.',
  ),
} satisfies Dict;

/** The eight knowledge-base categories (spec §16). */
export const knowledgeCategoryLabels: Record<KnowledgeCategory, Localized> = {
  children: l('Детское зрение', 'Балалар көруі', "Children's vision"),
  after40: l('Зрение после 40', '40-тан кейінгі көру', 'Vision after 40'),
  surgery: l('Хирургия', 'Хирургия', 'Surgery'),
  retina: l('Сетчатка', 'Торқабық', 'Retina'),
  glaucoma: l('Глаукома', 'Глаукома', 'Glaucoma'),
  library: l('Библиотека пациента', 'Пациент кітапханасы', 'Patient library'),
  research: l('Исследования', 'Зерттеулер', 'Research'),
  prevention: l('Профилактика', 'Алдын алу', 'Prevention'),
};

/* ------------------------------------------------------------------ FORMS */

export const formSourceLabels: Record<string, Localized> = {
  contacts: l('Контакты', 'Байланыс', 'Contacts'),
  international: l('Международные пациенты', 'Халықаралық пациенттер', 'International patients'),
  'second-opinion': l('Второе мнение', 'Екінші пікір', 'Second opinion'),
  'online-consultation': l('Онлайн-консультация', 'Онлайн-кеңес', 'Online consultation'),
  'service-consultation': l('Консультация по услуге', 'Қызмет бойынша кеңес', 'Service consultation'),
  partnership: l('Партнёрство', 'Серіктестік', 'Partnership'),
  academy: l('Академия', 'Академия', 'Academy'),
  'expert-network': l('Сеть экспертов', 'Сарапшылар желісі', 'Expert network'),
  'science-collaboration': l('Научное сотрудничество', 'Ғылыми ынтымақтастық', 'Science collaboration'),
  appointment: l('Онлайн-запись', 'Онлайн-жазылу', 'Online booking'),
  other: l('Другое', 'Басқа', 'Other'),
};

export const formsCopy = {
  title: l('Формы сайта', 'Сайт формалары', 'Site forms'),
  lead: l(
    'Каждая форма сайта создаёт лид с тегом источника. Выключенная форма показывает посетителю телефон и WhatsApp.',
    'Сайттағы әр форма дереккөз тегімен лид жасайды. Өшірілген форма келушіге телефон мен WhatsApp көрсетеді.',
    'Every site form creates a lead tagged with its source. A disabled form shows the visitor the phone number and WhatsApp instead.',
  ),
  form: l('Форма', 'Форма', 'Form'),
  enabled: l('Включена', 'Қосулы', 'Enabled'),
  disabled: l('Выключена', 'Өшірулі', 'Disabled'),
  email: l('E-mail для уведомлений', 'Хабарландыру e-mail', 'Notification e-mail'),
  emailInvalid: l('Проверьте адрес e-mail', 'E-mail мекенжайын тексеріңіз', 'Check the e-mail address'),
  leads: l('Лидов', 'Лидтер', 'Leads'),
  lastLead: l('Последний', 'Соңғы', 'Latest'),
  never: l('ещё не было', 'әлі болған жоқ', 'none yet'),
  path: l('Где размещена', 'Орналасқан жері', 'Placed on'),
} satisfies Dict;

/* ------------------------------------------------------------------- LEADS */

export type LeadStage = 'new' | 'qualified' | 'documents' | 'consultation' | 'treatment' | 'closed';
export type ConversionStatus = 'open' | 'converted' | 'lost';

export const leadStages: Array<{ id: LeadStage; label: Localized }> = [
  { id: 'new', label: l('Новый', 'Жаңа', 'New') },
  { id: 'qualified', label: l('Квалифицирован', 'Іріктелген', 'Qualified') },
  { id: 'documents', label: l('Документы', 'Құжаттар', 'Records') },
  { id: 'consultation', label: l('Консультация', 'Кеңес', 'Consultation') },
  { id: 'treatment', label: l('Лечение', 'Емдеу', 'Treatment') },
  { id: 'closed', label: l('Закрыт', 'Жабық', 'Closed') },
];

export const conversionLabels: Record<ConversionStatus, Localized> = {
  open: l('В работе', 'Жұмыста', 'Open'),
  converted: l('Конверсия', 'Конверсия', 'Converted'),
  lost: l('Потерян', 'Жоғалған', 'Lost'),
};

export const leadsCopy = {
  lead: l(
    'CRM-поля по ТЗ §13: страна, источник, диагноз, этап и статус конверсии. Перетащите карточку между этапами или выберите этап в списке.',
    'ТТ §13 бойынша CRM өрістері: ел, дереккөз, диагноз, кезең және конверсия мәртебесі. Карточканы кезеңдер арасында сүйреңіз немесе тізімнен таңдаңыз.',
    'CRM fields per spec §13: country, source, diagnosis, stage and conversion status. Drag a card between stages or pick the stage from its list.',
  ),
  board: l('Воронка', 'Воронка', 'Pipeline'),
  table: l('Таблица', 'Кесте', 'Table'),
  view: l('Вид', 'Көрініс', 'View'),
  exportCsv: l('Экспорт CSV', 'CSV экспорты', 'Export CSV'),
  name: l('Пациент', 'Пациент', 'Patient'),
  contact: l('Контакт', 'Байланыс', 'Contact'),
  country: l('Страна', 'Ел', 'Country'),
  source: l('Источник', 'Дереккөз', 'Lead source'),
  diagnosis: l('Диагноз', 'Диагноз', 'Diagnosis'),
  stage: l('Этап', 'Кезең', 'Stage'),
  conversion: l('Конверсия', 'Конверсия', 'Conversion'),
  date: l('Дата', 'Күні', 'Date'),
  utm: l('Кампания', 'Науқан', 'Campaign'),
  allCountries: l('Все страны', 'Барлық елдер', 'All countries'),
  allSources: l('Все источники', 'Барлық дереккөздер', 'All sources'),
  allStages: l('Все этапы', 'Барлық кезеңдер', 'All stages'),
  allConversions: l('Любая конверсия', 'Кез келген конверсия', 'Any conversion'),
  reset: l('Сбросить', 'Тастау', 'Reset'),
  shown: l('Показано', 'Көрсетілді', 'Shown'),
  empty: l('Лидов по этим фильтрам нет', 'Бұл сүзгілер бойынша лид жоқ', 'No leads match these filters'),
  emptyText: l('Измените фильтры или дождитесь новых заявок с сайта.', 'Сүзгілерді өзгертіңіз немесе сайттан жаңа өтінімдерді күтіңіз.', 'Change the filters or wait for new requests from the site.'),
  queued: l('в очереди', 'кезекте', 'queued'),
  queuedHint: l(
    'Заявки из локальной очереди: сайт принял их, пока API был недоступен.',
    'Жергілікті кезектегі өтінімдер: API қолжетімсіз кезде сайт оларды қабылдады.',
    'Requests from the local outbox: the site accepted them while the API was unreachable.',
  ),
  demo: l('демо', 'демо', 'demo'),
  loading: l('Загружаем лиды…', 'Лидтер жүктелуде…', 'Loading leads…'),
  moved: l('Этап обновлён', 'Кезең жаңартылды', 'Stage updated'),
  dropHere: l('Перетащите сюда', 'Осында сүйреңіз', 'Drop here'),
  unknown: l('Не указано', 'Көрсетілмеген', 'Not specified'),
  title: l('Лиды и воронка', 'Лидтер және воронка', 'Leads & pipeline'),
  search: l('Поиск по имени, телефону, диагнозу', 'Аты, телефоны, диагнозы бойынша іздеу', 'Search name, phone, diagnosis'),
} satisfies Dict;

/* --------------------------------------------------------------- ANALYTICS */

export const analyticsCopy = {
  lead: l(
    'Демонстрационные показатели за 30 дней — пример отчёта до подключения GA4.',
    '30 күнгі демонстрациялық көрсеткіштер — GA4 қосылғанға дейінгі есеп үлгісі.',
    'Demo figures for 30 days — a sample of the report until GA4 is connected.',
  ),
  traffic: l('Посещения', 'Кірулер', 'Visits'),
  leads: l('Лиды', 'Лидтер', 'Leads'),
  conversion: l('Конверсия в лид', 'Лидке конверсия', 'Lead conversion'),
  appointments: l('Запросы на приём', 'Қабылдауға сұраулар', 'Appointment requests'),
  trafficTitle: l('Трафик за 30 дней', '30 күндегі трафик', 'Traffic, last 30 days'),
  countriesTitle: l('Лиды по странам', 'Елдер бойынша лидтер', 'Leads by country'),
  sourcesTitle: l('Лиды по источникам', 'Дереккөздер бойынша лидтер', 'Leads by source'),
  funnelTitle: l('Воронка записи', 'Жазылу воронкасы', 'Booking funnel'),
  funnelView: l('Просмотр услуги', 'Қызметті қарау', 'Service viewed'),
  funnelStart: l('Начали запись', 'Жазылуды бастады', 'Booking started'),
  funnelSubmit: l('Отправили заявку', 'Өтінім жіберді', 'Request sent'),
  funnelConfirm: l('Подтверждено', 'Расталды', 'Confirmed'),
  vsPrev: l('к прошлому периоду', 'өткен кезеңге', 'vs previous period'),
  day: l('День', 'Күн', 'Day'),
  tableView: l('Данные графика', 'График деректері', 'Chart data'),
  trackingStatus: l('Статус трекинга', 'Трекинг мәртебесі', 'Tracking status'),
  active: l('активен', 'белсенді', 'active'),
  notSet: l('ожидает ID', 'ID күтуде', 'awaiting ID'),
  consentNote: l(
    'Теги GA4, GTM и Clarity загружаются только после согласия посетителя на аналитические cookie.',
    'GA4, GTM және Clarity тегтері келуші аналитикалық cookie-ге келісім бергеннен кейін ғана жүктеледі.',
    'GA4, GTM and Clarity tags load only after the visitor consents to analytics cookies.',
  ),
} satisfies Dict;

/* -------------------------------------------------------------- AUTOMATION */

export const automationCopy = {
  title: l('Автоматизация коммуникаций', 'Байланысты автоматтандыру', 'Communication automation'),
  lead: l(
    'Сценарии коммуникации с пациентом. Шаблоны поддерживают переменные {name}, {date}, {time}, {ref}, {doctor}.',
    'Пациентпен байланыс сценарийлері. Үлгілер {name}, {date}, {time}, {ref}, {doctor} айнымалыларын қолдайды.',
    'Patient communication scenarios. Templates support the variables {name}, {date}, {time}, {ref} and {doctor}.',
  ),
  email: l('E-mail цепочки', 'E-mail тізбектері', 'E-mail sequences'),
  emailText: l('Подтверждение заявки, напоминание о документах, повторное касание.', 'Өтінімді растау, құжаттар туралы еске салу, қайта байланыс.', 'Request confirmation, records reminder, follow-up touch.'),
  whatsapp: l('WhatsApp-уведомления', 'WhatsApp хабарламалары', 'WhatsApp notifications'),
  whatsappText: l('Координатору — о новом лиде; пациенту — о смене статуса.', 'Үйлестірушіге — жаңа лид туралы; пациентке — мәртебенің өзгергені туралы.', 'To the coordinator on a new lead; to the patient on a status change.'),
  reminders: l('Напоминания о приёме', 'Қабылдау туралы еске салулар', 'Appointment reminders'),
  remindersText: l('За 24 часа и за 2 часа до визита, с адресом и схемой проезда.', 'Сапарға 24 сағат және 2 сағат қалғанда, мекенжаймен және жол сызбасымен.', '24 hours and 2 hours before the visit, with the address and directions.'),
  followup: l('Follow-up сценарии', 'Follow-up сценарийлері', 'Follow-up scenarios'),
  followupText: l('После операции, после неявки и для незавершённых заявок.', 'Операциядан кейін, келмей қалғаннан кейін және аяқталмаған өтінімдер үшін.', 'After surgery, after a no-show and for unfinished requests.'),
  delay: l('Отправка', 'Жіберу', 'Send'),
  template: l('Шаблон', 'Үлгі', 'Template'),
  on: l('Включено', 'Қосулы', 'On'),
  off: l('Выключено', 'Өшірулі', 'Off'),
  preview: l('Предпросмотр', 'Алдын ала қарау', 'Preview'),
  saveAll: l('Сохранить сценарии', 'Сценарийлерді сақтау', 'Save scenarios'),
  steps: l('Шаги', 'Қадамдар', 'Steps'),
} satisfies Dict;

export const delayLabels: Record<string, Localized> = {
  '0m': l('Сразу', 'Бірден', 'Immediately'),
  '15m': l('Через 15 минут', '15 минуттан кейін', 'After 15 minutes'),
  '2h': l('Через 2 часа', '2 сағаттан кейін', 'After 2 hours'),
  '24h': l('Через 24 часа', '24 сағаттан кейін', 'After 24 hours'),
  '48h': l('Через 2 дня', '2 күннен кейін', 'After 2 days'),
  '3d': l('Через 3 дня', '3 күннен кейін', 'After 3 days'),
  '7d': l('Через 7 дней', '7 күннен кейін', 'After 7 days'),
  '30d': l('Через 30 дней', '30 күннен кейін', 'After 30 days'),
  '-24h': l('За 24 часа до приёма', 'Қабылдауға 24 сағат қалғанда', '24 hours before the visit'),
  '-2h': l('За 2 часа до приёма', 'Қабылдауға 2 сағат қалғанда', '2 hours before the visit'),
};

/* ------------------------------------------------------------ INTEGRATIONS */

export const integrationsCopy = {
  title: l('Интеграции', 'Интеграциялар', 'Integrations'),
  notSet: l('не задан', 'берілмеген', 'not set'),
  lead: l(
    'Ключи доступа хранятся только на сервере в переменных окружения — здесь выбирается поставщик и публичные идентификаторы.',
    'Қолжетімділік кілттері тек серверде орта айнымалыларында сақталады — мұнда жеткізуші мен жария идентификаторлар таңдалады.',
    'Access keys live only on the server in environment variables — here you choose the provider and public identifiers.',
  ),
  crm: l('CRM', 'CRM', 'CRM'),
  crmText: l('Куда передаются лиды с сайта.', 'Сайттан лидтер қайда жіберіледі.', 'Where site leads are delivered.'),
  none: l('Не выбрано', 'Таңдалмаған', 'Not selected'),
  video: l('Видеоконсультации', 'Бейнекеңестер', 'Video consultations'),
  videoText: l('Ссылка на встречу создаётся при подтверждении онлайн-консультации.', 'Онлайн-кеңес расталғанда кездесу сілтемесі жасалады.', 'A meeting link is created when an online consultation is confirmed.'),
  tracking: l('Аналитика и поиск', 'Аналитика және іздеу', 'Analytics & search'),
  trackingText: l(
    'На сборке сайт читает VITE_GA4_ID, VITE_GTM_ID, VITE_CLARITY_ID и VITE_GSC_VERIFICATION. Значения здесь — для передачи разработчику.',
    'Жинақ кезінде сайт VITE_GA4_ID, VITE_GTM_ID, VITE_CLARITY_ID және VITE_GSC_VERIFICATION оқиды. Мұндағы мәндер — әзірлеушіге беру үшін.',
    'At build time the site reads VITE_GA4_ID, VITE_GTM_ID, VITE_CLARITY_ID and VITE_GSC_VERIFICATION. The values here are for handing to the developer.',
  ),
  envActive: l('в сборке', 'жинақта', 'in build'),
  formatInvalid: l('Неверный формат', 'Формат қате', 'Invalid format'),
  accountId: l('ID аккаунта / портала', 'Аккаунт / портал ID', 'Account / portal ID'),
} satisfies Dict;

/* ---------------------------------------------------------------- SECURITY */

export type RoleId = 'admin' | 'editor' | 'coordinator' | 'doctor';
export type PermissionId = 'pages' | 'articles' | 'leads' | 'medical' | 'analytics' | 'settings' | 'users';

export const roleLabels: Record<RoleId, Localized> = {
  admin: l('Администратор', 'Әкімші', 'Administrator'),
  editor: l('Редактор', 'Редактор', 'Editor'),
  coordinator: l('Координатор', 'Үйлестіруші', 'Coordinator'),
  doctor: l('Врач', 'Дәрігер', 'Doctor'),
};

export const permissionLabels: Record<PermissionId, Localized> = {
  pages: l('Страницы', 'Беттер', 'Pages'),
  articles: l('Статьи', 'Мақалалар', 'Articles'),
  leads: l('Лиды', 'Лидтер', 'Leads'),
  medical: l('Мед. документы', 'Мед. құжаттар', 'Medical records'),
  analytics: l('Аналитика', 'Аналитика', 'Analytics'),
  settings: l('Настройки', 'Баптаулар', 'Settings'),
  users: l('Пользователи', 'Пайдаланушылар', 'Users'),
};

export const securityCopy = {
  rbac: l('Роли и права (RBAC)', 'Рөлдер мен құқықтар (RBAC)', 'Roles & permissions (RBAC)'),
  rbacText: l(
    'Минимально необходимый доступ: медицинские документы видят только врач и координатор. Права администратора не редактируются.',
    'Ең аз қажетті қолжетімділік: медициналық құжаттарды тек дәрігер мен үйлестіруші көреді. Әкімші құқықтары өңделмейді.',
    'Least privilege: medical records are visible only to doctors and coordinators. Administrator rights are fixed.',
  ),
  role: l('Роль', 'Рөл', 'Role'),
  backups: l('Резервные копии', 'Сақтық көшірмелер', 'Backups'),
  lastBackup: l('Копия настроек', 'Баптаулар көшірмесі', 'Settings copy'),
  backupNow: l('Скачать копию настроек', 'Баптаулар көшірмесін жүктеу', 'Download settings backup'),
  spam: l('Защита от спама', 'Спамнан қорғау', 'Spam protection'),
  honeypot: l('Скрытое поле-ловушка (honeypot)', 'Жасырын тұзақ өріс (honeypot)', 'Hidden honeypot field'),
  minTime: l('Минимальное время заполнения — 2,5 с', 'Толтырудың ең аз уақыты — 2,5 с', 'Minimum fill time — 2.5 s'),
  rateLimit: l('Лимит запросов с одного IP', 'Бір IP-ден сұрау шектеуі', 'Per-IP rate limit'),
  fileScan: l('Проверка вложений (PDF/JPG/PNG, до 10 МБ)', 'Тіркемелерді тексеру (PDF/JPG/PNG, 10 МБ-қа дейін)', 'Attachment checks (PDF/JPG/PNG, up to 10 MB)'),
  captcha: l('Невидимая капча при подозрительной активности', 'Күдікті әрекет кезінде көрінбейтін капча', 'Invisible challenge on suspicious activity'),
  headers: l('Заголовки безопасности', 'Қауіпсіздік тақырыптары', 'Security headers'),
  headersText: l('CSP, HSTS, X-Frame-Options, Referrer-Policy и Permissions-Policy заданы в vercel.json.', 'CSP, HSTS, X-Frame-Options, Referrer-Policy және Permissions-Policy vercel.json-да берілген.', 'CSP, HSTS, X-Frame-Options, Referrer-Policy and Permissions-Policy are set in vercel.json.'),
} satisfies Dict;

/* ================================================================ ACCOUNT */

export type OpinionStatus = 'received' | 'review' | 'ready';

export const opinionStatuses: Array<{ id: OpinionStatus; label: Localized; text: Localized }> = [
  {
    id: 'received',
    label: l('Получено', 'Қабылданды', 'Received'),
    text: l('Документы приняты, координатор проверяет полноту.', 'Құжаттар қабылданды, үйлестіруші толықтығын тексеруде.', 'Records received; a coordinator is checking they are complete.'),
  },
  {
    id: 'review',
    label: l('На рассмотрении', 'Қаралуда', 'Under review'),
    text: l('Врач изучает снимки и заключения.', 'Дәрігер суреттер мен қорытындыларды зерттеуде.', 'A doctor is studying the images and reports.'),
  },
  {
    id: 'ready',
    label: l('Заключение готово', 'Қорытынды дайын', 'Opinion ready'),
    text: l('Письменное заключение доступно для скачивания.', 'Жазбаша қорытынды жүктеуге қолжетімді.', 'The written opinion is ready to download.'),
  },
];

export const accountCopy = {
  opinionsTab: l('Второе мнение / заявки', 'Екінші пікір / өтінімдер', 'Second opinion / requests'),
  opinionsTitle: l('Ваши заявки', 'Сіздің өтінімдеріңіз', 'Your requests'),
  opinionsLead: l(
    'Статус обновляется, когда врач берёт документы в работу. Уведомление придёт в WhatsApp и на e-mail.',
    'Дәрігер құжаттарды жұмысқа алғанда мәртебе жаңарады. Хабарлама WhatsApp пен e-mail-ге келеді.',
    'The status updates when a doctor takes up your records. You will be notified on WhatsApp and by e-mail.',
  ),
  submitted: l('Отправлено', 'Жіберілді', 'Submitted'),
  eta: l('Ожидаемый срок', 'Күтілетін мерзім', 'Expected by'),
  files: l('Файлов', 'Файлдар', 'Files'),
  downloadOpinion: l('Скачать заключение', 'Қорытындыны жүктеу', 'Download opinion'),
  newRequest: l('Новый запрос второго мнения', 'Екінші пікірге жаңа сұрау', 'New second-opinion request'),
  noRequests: l('Заявок пока нет', 'Өтінімдер әзірге жоқ', 'No requests yet'),
  noRequestsText: l('Отправьте документы — статус заявки появится здесь.', 'Құжаттарды жіберіңіз — өтінім мәртебесі осында пайда болады.', 'Send your records — the request status will appear here.'),
  welcome: l('Добро пожаловать', 'Қош келдіңіз', 'Welcome'),
  demoBanner: l('Демо-данные: сервер кабинета не подключён.', 'Демо-деректер: кабинет сервері қосылмаған.', 'Demo data: the account server is not connected.'),
  menu: l('Разделы кабинета', 'Кабинет бөлімдері', 'Account sections'),
  secureNote: l(
    'Вход по одноразовому коду. Медицинские данные передаются по защищённому соединению.',
    'Бір реттік кодпен кіру. Медициналық деректер қорғалған байланыс арқылы беріледі.',
    'Sign-in with a one-time code. Medical data travels over an encrypted connection.',
  ),
  step1: l('Номер телефона', 'Телефон нөмірі', 'Phone number'),
  step2: l('Код подтверждения', 'Растау коды', 'Confirmation code'),
  changePhone: l('Изменить номер', 'Нөмірді өзгерту', 'Change number'),
  codeInvalid: l('Код из 4 цифр', '4 саннан тұратын код', 'A 4-digit code'),
  actions: l('Действия', 'Әрекеттер', 'Actions'),
  statusConfirmed: l('Подтверждена', 'Расталды', 'Confirmed'),
  statusCancelled: l('Отменена', 'Бас тартылды', 'Cancelled'),
  statusCompleted: l('Состоялась', 'Өтті', 'Completed'),
} satisfies Dict;

/** Demo second-opinion requests for the account tab. */
export const demoOpinions: Array<{
  id: string;
  reference: string;
  topic: Localized;
  submitted: string;
  eta: string;
  files: number;
  status: OpinionStatus;
}> = [
  {
    id: 'op-1',
    reference: 'OPH-SO-2418',
    topic: l('ОКТ сетчатки: оценка макулярного отёка', 'Торқабық ОКТ: макулярлы ісінуді бағалау', 'Retinal OCT: macular oedema review'),
    submitted: '2026-09-02',
    eta: '2026-09-09',
    files: 6,
    status: 'ready',
  },
  {
    id: 'op-2',
    reference: 'OPH-SO-2477',
    topic: l('Выбор ИОЛ перед операцией катаракты', 'Катаракта операциясы алдында ИОЛ таңдау', 'Choosing an IOL before cataract surgery'),
    submitted: '2026-09-16',
    eta: '2026-09-26',
    files: 4,
    status: 'review',
  },
  {
    id: 'op-3',
    reference: 'OPH-SO-2502',
    topic: l('Поля зрения при подозрении на глаукому', 'Глаукомаға күдік кезіндегі көру өрістері', 'Visual fields with suspected glaucoma'),
    submitted: '2026-09-23',
    eta: '2026-10-03',
    files: 3,
    status: 'received',
  },
];

/* ============================================================ PUBLIC PAGES */

export const faqCopy = {
  eyebrow: l('Пациентам', 'Пациенттерге', 'For patients'),
  title: l('Частые вопросы', 'Жиі қойылатын сұрақтар', 'Frequently asked questions'),
  lead: l(
    'Короткие ответы о записи, обследованиях, операциях и оплате. Если ответа нет — спросите координатора.',
    'Жазылу, тексерулер, операциялар және төлем туралы қысқа жауаптар. Жауап болмаса — үйлестірушіден сұраңыз.',
    'Short answers about booking, examinations, surgery and payment. If yours is missing, ask a coordinator.',
  ),
  searchLabel: l('Найти вопрос', 'Сұрақты табу', 'Find a question'),
  searchPlaceholder: l('Например: подготовка к ОКТ', 'Мысалы: ОКТ-ға дайындық', 'For example: preparing for OCT'),
  topics: l('Темы', 'Тақырыптар', 'Topics'),
  found: l('Вопросов', 'Сұрақтар', 'Questions'),
  askTitle: l('Не нашли ответ?', 'Жауап таппадыңыз ба?', "Didn't find an answer?"),
  askText: l(
    'Координатор ответит в рабочее время в WhatsApp или по телефону. Помощник на сайте работает круглосуточно.',
    'Үйлестіруші жұмыс уақытында WhatsApp немесе телефон арқылы жауап береді. Сайттағы көмекші тәулік бойы жұмыс істейді.',
    'A coordinator replies during working hours on WhatsApp or by phone. The on-site assistant works around the clock.',
  ),
  contacts: l('Контакты', 'Байланыс', 'Contacts'),
  disclaimer: l(
    'Ответы носят справочный характер и не заменяют очную консультацию офтальмолога.',
    'Жауаптар анықтамалық сипатта және офтальмологтың бетпе-бет кеңесін алмастырмайды.',
    'Answers are for information only and do not replace an in-person consultation with an ophthalmologist.',
  ),
} satisfies Dict;

export const reviewsCopy = {
  eyebrow: l('Отзывы пациентов', 'Пациенттер пікірлері', 'Patient reviews'),
  title: l('Что говорят пациенты', 'Пациенттер не дейді', 'What patients say'),
  lead: l(
    'Отзывы публикуются после визита и не редактируются, кроме удаления персональных данных.',
    'Пікірлер сапардан кейін жарияланады және дербес деректерді жоюдан басқа өңделмейді.',
    'Reviews are published after the visit and are not edited, except to remove personal data.',
  ),
  verifiedNote: l(
    'Отзывы публикуются после проверки клиникой: мы подтверждаем, что автор был на приёме, и получаем его согласие на публикацию.',
    'Пікірлер клиника тексергеннен кейін жарияланады: автордың қабылдауда болғанын растап, жариялауға келісімін аламыз.',
    'Reviews are published after the clinic checks them: we confirm the author attended an appointment and obtain their consent to publish.',
  ),
  policy4Title: l('Проверка до публикации', 'Жарияланғанға дейін тексеру', 'Checked before publishing'),
  policy4: l(
    'Координатор сверяет отзыв с записью о визите и публикует его только с согласия автора.',
    'Үйлестіруші пікірді сапар жазбасымен салыстырып, тек автордың келісімімен жариялайды.',
    'A coordinator matches each review to a visit record and publishes it only with the author’s consent.',
  ),
  statement: l(
    'Нам важно не количество звёзд, а то, понял ли человек свой диагноз и чувствовал ли себя услышанным.',
    'Біз үшін жұлдыздар саны емес, адам өз диагнозын түсінді ме және өзін тыңдалған сезінді ме — сол маңызды.',
    'What matters to us is not the number of stars but whether a person understood their diagnosis and felt heard.',
  ),
  listTitle: l('Истории пациентов', 'Пациенттер оқиғалары', 'Patient stories'),
  emptyTitle: l('Первые истории появятся после открытия центра', 'Алғашқы оқиғалар орталық ашылғаннан кейін пайда болады', 'The first stories will appear once the centre opens'),
  emptyText: l(
    'Центр в Астане только начинает работу, поэтому мы не публикуем отзывы, которых ещё нет. Истории пациентов будут появляться здесь после визитов — с согласия авторов.',
    'Астанадағы орталық енді ғана жұмысын бастайды, сондықтан әлі жоқ пікірлерді жарияламаймыз. Пациенттер оқиғалары сапарлардан кейін — авторлардың келісімімен осында пайда болады.',
    'The Astana centre is only just opening, so we do not publish reviews that do not exist yet. Patient stories will appear here after visits, with the authors’ consent.',
  ),
  filter: l('Фильтр по оценке', 'Баға бойынша сүзгі', 'Filter by rating'),
  policyTitle: l('Как мы работаем с отзывами', 'Пікірлермен қалай жұмыс істейміз', 'How we handle reviews'),
  policy1Title: l('Только пациенты', 'Тек пациенттер', 'Patients only'),
  policy2Title: l('Критика остаётся', 'Сын қалады', 'Criticism stays'),
  policy3Title: l('Приватность', 'Құпиялылық', 'Privacy'),
  policy1: l('Отзыв может оставить только пациент после визита.', 'Пікірді тек сапардан кейін пациент қалдыра алады.', 'Only a patient can leave a review, after a visit.'),
  policy2: l('Мы не удаляем критические отзывы — отвечаем на них.', 'Сыни пікірлерді жоймаймыз — оларға жауап береміз.', 'We do not delete critical reviews — we reply to them.'),
  policy3: l('Имена сокращены, медицинские подробности убраны.', 'Аттар қысқартылған, медициналық егжей-тегжейлер алынып тасталған.', 'Names are shortened and medical details removed.'),
  doctor: l('Врач', 'Дәрігер', 'Doctor'),
  service: l('Услуга', 'Қызмет', 'Service'),
} satisfies Dict;

export const legalCopy = {
  eyebrow: l('Правовая информация', 'Құқықтық ақпарат', 'Legal'),
  updated: l('Редакция от', 'Редакция күні', 'Version of'),
  contents: l('Содержание', 'Мазмұны', 'Contents'),
  gdprTitle: l('Ваши права (GDPR и Закон РК о персональных данных)', 'Сіздің құқықтарыңыз (GDPR және ҚР дербес деректер туралы заңы)', 'Your rights (GDPR and the Kazakhstan Personal Data Law)'),
  gdprBody: l(
    'Пациенты из ЕС и других стран имеют право на доступ к своим данным, исправление, удаление («право на забвение»), ограничение обработки, переносимость данных и возражение против обработки. Согласие на аналитические cookie можно отозвать в любой момент. Медицинские данные относятся к особой категории и обрабатываются только для оказания помощи, на основании явного согласия (ст. 9(2)(a) и 9(2)(h) GDPR). Трансграничная передача выполняется со стандартными договорными условиями. Запрос направляйте на info@drkulmaganbetov.kz — ответим в течение 30 дней; вы также вправе подать жалобу в надзорный орган своей страны.',
    'ЕО және басқа елдердің пациенттері өз деректеріне қол жеткізуге, түзетуге, жоюға («ұмытылу құқығы»), өңдеуді шектеуге, деректерді тасымалдауға және өңдеуге қарсылық білдіруге құқылы. Аналитикалық cookie-ге келісімді кез келген уақытта қайтарып алуға болады. Медициналық деректер ерекше санатқа жатады және тек көмек көрсету үшін, айқын келісім негізінде өңделеді (GDPR 9(2)(a) және 9(2)(h) баптары). Трансшекаралық беру стандартты шарттық талаптармен жүзеге асырылады. Сұрауды info@drkulmaganbetov.kz мекенжайына жіберіңіз — 30 күн ішінде жауап береміз; сондай-ақ еліңіздің қадағалау органына шағым беруге құқылысыз.',
    'Patients from the EU and elsewhere have the right to access, rectify and erase their data ("right to be forgotten"), to restrict processing, to data portability and to object to processing. Consent to analytics cookies can be withdrawn at any time. Health data is a special category and is processed only to provide care, on the basis of explicit consent (GDPR Art. 9(2)(a) and 9(2)(h)). Cross-border transfers use standard contractual clauses. Send requests to info@drkulmaganbetov.kz — we reply within 30 days; you may also lodge a complaint with your national supervisory authority.',
  ),
  cookiesTitle: l('Cookie и аналитика', 'Cookie және аналитика', 'Cookies and analytics'),
  cookiesBody: l(
    'Необходимые cookie обеспечивают работу сайта и не требуют согласия. Аналитические (Google Analytics 4, Google Tag Manager, Microsoft Clarity) включаются только после нажатия «Принять» и помогают понять, какие страницы полезны пациентам. IP-адреса анонимизируются, данные хранятся не более 14 месяцев.',
    'Қажетті cookie сайттың жұмысын қамтамасыз етеді және келісімді қажет етпейді. Аналитикалық cookie (Google Analytics 4, Google Tag Manager, Microsoft Clarity) тек «Қабылдау» басылғаннан кейін қосылады және пациенттерге қандай беттер пайдалы екенін түсінуге көмектеседі. IP-мекенжайлар анонимделеді, деректер 14 айдан артық сақталмайды.',
    'Essential cookies keep the site working and need no consent. Analytics cookies (Google Analytics 4, Google Tag Manager, Microsoft Clarity) are enabled only after you press "Accept" and help us see which pages are useful to patients. IP addresses are anonymised and data is kept for no longer than 14 months.',
  ),
  cookieSettings: l('Изменить настройки cookie', 'Cookie баптауларын өзгерту', 'Change cookie settings'),
  cookieReset: l('Выбор сброшен — баннер появится снова.', 'Таңдау тасталды — баннер қайта пайда болады.', 'Your choice was reset — the banner will appear again.'),
  controllerTitle: l('Оператор данных и контакты', 'Деректер операторы және байланыс', 'Data controller and contacts'),
  controllerBody: l(
    'Оператор: Офтальмологический центр доктора Кулмаганбетова, Астана, Казахстан. Ответственный за защиту данных (DPO): info@drkulmaganbetov.kz.',
    'Оператор: Доктор Кұлмағанбетов офтальмологиялық орталығы, Астана, Қазақстан. Деректерді қорғауға жауапты (DPO): info@drkulmaganbetov.kz.',
    'Controller: Ophthalmic Centre of Dr Kulmaganbetov, Astana, Kazakhstan. Data protection officer (DPO): info@drkulmaganbetov.kz.',
  ),
  questions: l('Вопросы по документу', 'Құжат бойынша сұрақтар', 'Questions about this document'),
} satisfies Dict;
