import type { Localized } from '@/i18n/types';

export type { ServiceContent, ServiceFaq, ServiceSource, LocalizedList } from './services-types';

/**
 * Copy for the medical-services area: services index and detail, department
 * pages, programmes, prices, promotions, online booking and contacts
 * (spec §6; Figma 05, 06, 10, 11).
 */

type Copy = Record<string, Localized>;

/* Long-form service content lives in ./services-content (loaded only by the
   service detail page); its types are re-exported here for convenience. */

/* ============================================================ SHARED LABELS */

export const sharedCopy = {
  openMaterial: { ru: 'Открыть материал', kk: 'Материалды ашу', en: 'Read the article' },
  /** Card links: a service page is not an article (UI/UX audit S2). */
  aboutService: { ru: 'Подробнее об услуге', kk: 'Қызмет туралы толығырақ', en: 'About this service' },
  aboutDepartment: { ru: 'Об отделении', kk: 'Бөлімше туралы', en: 'About the department' },
  aboutProgram: { ru: 'О программе', kk: 'Бағдарлама туралы', en: 'About the programme' },
  bookArrow: { ru: 'Записаться', kk: 'Жазылу', en: 'Book' },
  /** Word order differs: «от 12 000 ₸» / «12 000 ₸ бастап» / «from 12,000 ₸». */
  fromPrice: { ru: 'от {price}', kk: '{price} бастап', en: 'from {price}' },
  minutes: { ru: 'мин', kk: 'мин', en: 'min' },
  servicesCount: { ru: 'Услуг', kk: 'Қызмет', en: 'Services' },
  pricesLink: { ru: 'Цены', kk: 'Бағалар', en: 'Prices' },
  allServices: { ru: 'Все услуги', kk: 'Барлық қызметтер', en: 'All services' },
  disclaimer: {
    ru: 'Материал носит информационный характер и не заменяет очную консультацию. Имеются противопоказания — решение о лечении врач принимает после осмотра.',
    kk: 'Материал ақпараттық сипатта және күндізгі кеңесті алмастырмайды. Қарсы көрсетілімдері бар — ем туралы шешімді дәрігер тексеруден кейін қабылдайды.',
    en: 'This page is for information only and does not replace an in-person consultation. Contraindications exist — the doctor decides on treatment after an examination.',
  },
} satisfies Copy;

/* ============================================================ SERVICES INDEX */

export const servicesIndexCopy = {
  seoTitle: { ru: 'Медицинские услуги', kk: 'Медициналық қызметтер', en: 'Medical services' },
  seoDescription: {
    ru: 'Шесть отделений и двадцать услуг офтальмологического центра — от первого осмотра до микрохирургии. Цены, подготовка и онлайн-запись.',
    kk: 'Офтальмологиялық орталықтың алты бөлімшесі мен жиырма қызметі — алғашқы тексеруден микрохирургияға дейін. Бағалар, дайындық, жазылу.',
    en: 'Six departments and twenty services at our eye centre — from a first examination to microsurgery. Prices, preparation and online booking.',
  },
  eyebrow: { ru: 'Медицинские услуги', kk: 'Медициналық қызметтер', en: 'Medical services' },
  title: { ru: 'Направления помощи', kk: 'Көмек бағыттары', en: 'Areas of care' },
  lead: {
    ru: 'Шесть отделений и двадцать услуг — от первого осмотра до микрохирургии. У каждой услуги есть страница: что она показывает, кому нужна, как подготовиться и сколько стоит.',
    kk: 'Алты бөлімше және жиырма қызмет — алғашқы тексеруден микрохирургияға дейін. Әр қызметтің өз беті бар: не көрсетеді, кімге қажет, қалай дайындалу керек және қанша тұрады.',
    en: 'Six departments and twenty services — from a first examination to microsurgery. Every service has its own page: what it shows, who needs it, how to prepare and what it costs.',
  },
  areasLabel: { ru: 'Отделения', kk: 'Бөлімшелер', en: 'Departments' },
  areasTitle: { ru: 'От профилактики до сложного решения', kk: 'Алдын алудан күрделі шешімге дейін', en: 'From prevention to complex decisions' },
  areasText: {
    ru: 'Каждое направление ведёт профильная команда. Откройте отделение, чтобы увидеть путь пациента, врачей и ответы на частые вопросы.',
    kk: 'Әр бағытты бейінді команда жүргізеді. Пациент жолын, дәрігерлерді және жиі қойылатын сұрақтарға жауаптарды көру үшін бөлімшені ашыңыз.',
    en: 'Each area is led by a dedicated team. Open a department to see the patient journey, the doctors and answers to common questions.',
  },
  statement: {
    ru: 'Любая услуга начинается с разговора и точных измерений. Решение о лечении принимается только тогда, когда понятна причина — и когда вы понимаете её вместе с врачом.',
    kk: 'Кез келген қызмет әңгімеден және нақты өлшемдерден басталады. Ем туралы шешім себеп анық болғанда ғана — және сіз оны дәрігермен бірге түсінгенде ғана қабылданады.',
    en: 'Every service starts with a conversation and precise measurements. A treatment decision is made only once the cause is clear — and once you understand it together with your doctor.',
  },
  statementLabel: { ru: 'Принцип', kk: 'Қағида', en: 'Principle' },
  listLabel: { ru: 'Каталог', kk: 'Каталог', en: 'Catalogue' },
  listTitle: { ru: 'Все услуги центра', kk: 'Орталықтың барлық қызметтері', en: 'Every service at the centre' },
  filterLabel: { ru: 'Фильтр по отделению', kk: 'Бөлімше бойынша сүзгі', en: 'Filter by department' },
  countLabel: { ru: 'Услуг', kk: 'Қызметтер', en: 'Services' },
  pathLabel: { ru: 'Путь пациента', kk: 'Пациент жолы', en: 'Patient journey' },
  pathTitle: { ru: 'Четыре шага от записи до результата', kk: 'Жазылудан нәтижеге дейін төрт қадам', en: 'Four steps from booking to result' },
  step1: { ru: 'Консультация', kk: 'Кеңес', en: 'Consultation' },
  step1Text: {
    ru: 'Врач выслушивает жалобы, уточняет историю и назначает только нужные исследования.',
    kk: 'Дәрігер шағымдарды тыңдап, тарихты нақтылайды және тек қажетті зерттеулерді тағайындайды.',
    en: 'The doctor listens, clarifies your history and orders only the tests you need.',
  },
  step2: { ru: 'Диагностика', kk: 'Диагностика', en: 'Diagnostics' },
  step2Text: {
    ru: 'Измерения и снимки делаются в один визит, результаты сразу попадают в карту.',
    kk: 'Өлшемдер мен суреттер бір келуде жасалады, нәтижелер бірден картаға түседі.',
    en: 'Measurements and scans are done in one visit and go straight into your record.',
  },
  step3: { ru: 'Решение', kk: 'Шешім', en: 'Decision' },
  step3Text: {
    ru: 'Врач объясняет варианты, их пользу и ограничения — решение вы принимаете вместе.',
    kk: 'Дәрігер нұсқаларды, олардың пайдасы мен шектеулерін түсіндіреді — шешімді бірге қабылдайсыз.',
    en: 'The doctor explains the options, their benefits and limits — you decide together.',
  },
  step4: { ru: 'Наблюдение', kk: 'Бақылау', en: 'Follow-up' },
  step4Text: {
    ru: 'Контрольные визиты и напоминания приходят автоматически, динамика видна в карте.',
    kk: 'Бақылау келулері мен еске салғыштар автоматты түрде келеді, динамика картада көрінеді.',
    en: 'Check-ups and reminders arrive automatically; progress is visible in your record.',
  },
} satisfies Copy;

/* ============================================================ SERVICE DETAIL */

export const serviceDetailCopy = {
  toc: { ru: 'На этой странице', kk: 'Осы бетте', en: 'On this page' },
  overview: { ru: 'Обзор', kk: 'Шолу', en: 'Overview' },
  indications: { ru: 'Показания', kk: 'Көрсетілімдер', en: 'Indications' },
  diagnostics: { ru: 'Диагностика', kk: 'Диагностика', en: 'Diagnostics' },
  treatment: { ru: 'Варианты лечения', kk: 'Ем нұсқалары', en: 'Treatment options' },
  preparation: { ru: 'Подготовка', kk: 'Дайындық', en: 'Preparation' },
  result: { ru: 'Результат и восстановление', kk: 'Нәтиже және қалпына келу', en: 'Results and recovery' },
  faq: { ru: 'Вопросы и ответы', kk: 'Сұрақтар мен жауаптар', en: 'Questions and answers' },
  price: { ru: 'Стоимость', kk: 'Құны', en: 'Price' },
  duration: { ru: 'Длительность', kk: 'Ұзақтығы', en: 'Duration' },
  doctorsCount: { ru: 'Врачей в команде', kk: 'Командадағы дәрігерлер', en: 'Doctors on the team' },
  priceNote: {
    ru: 'Итоговая стоимость зависит от объёма, который врач назначит после осмотра. Оплата — в клинике или онлайн.',
    kk: 'Соңғы құны дәрігер тексеруден кейін тағайындайтын көлемге байланысты. Төлем — клиникада немесе онлайн.',
    en: 'The final cost depends on the scope your doctor recommends after the examination. Pay at the clinic or online.',
  },
  doctorsLabel: { ru: 'Врачи', kk: 'Дәрігерлер', en: 'Doctors' },
  doctorsTitle: { ru: 'Кто проводит', kk: 'Кім жүргізеді', en: 'Who performs it' },
  doctorsText: {
    ru: 'Врачи отделения, которые выполняют эту услугу. Выбрать конкретного специалиста можно при онлайн-записи.',
    kk: 'Осы қызметті орындайтын бөлімше дәрігерлері. Нақты маманды онлайн-жазылу кезінде таңдауға болады.',
    en: 'Doctors in the department who perform this service. You can choose a specific doctor when booking online.',
  },
  articlesLabel: { ru: 'База знаний', kk: 'Білім базасы', en: 'Knowledge base' },
  articlesTitle: { ru: 'Похожие статьи', kk: 'Ұқсас мақалалар', en: 'Related articles' },
  formLabel: { ru: 'Консультация', kk: 'Кеңес', en: 'Consultation' },
  formTitle: { ru: 'Форма записи на консультацию', kk: 'Кеңеске жазылу формасы', en: 'Request a consultation' },
  formText: {
    ru: 'Оставьте контакты — координатор перезвонит, ответит на вопросы и подберёт время. Можно приложить заключения и снимки.',
    kk: 'Байланыс деректерін қалдырыңыз — үйлестіруші қайта қоңырау шалып, сұрақтарға жауап береді және уақыт таңдайды. Қорытындылар мен суреттерді тіркеуге болады.',
    en: 'Leave your details — a coordinator will call back, answer your questions and find a time. You can attach reports and scans.',
  },
  continueTitle: { ru: 'Продолжить знакомство', kk: 'Танысуды жалғастыру', en: 'Keep exploring' },
  sourcesTitle: { ru: 'Источники и дополнительное чтение', kk: 'Дереккөздер және қосымша оқу', en: 'Sources and further reading' },
  sourcesNote: {
    ru: 'Материал подготовлен по открытым клиническим рекомендациям и обзорам. Ссылки ведут на внешние сайты.',
    kk: 'Материал ашық клиникалық ұсынымдар мен шолулар негізінде дайындалды. Сілтемелер сыртқы сайттарға апарады.',
    en: 'Prepared from open clinical guidelines and reviews. Links lead to external websites.',
  },
  notFoundTitle: { ru: 'Услуга не найдена', kk: 'Қызмет табылмады', en: 'Service not found' },
  notFoundText: {
    ru: 'Возможно, ссылка устарела. Посмотрите полный список услуг или запишитесь на консультацию — врач подскажет, что нужно.',
    kk: 'Сілтеме ескірген болуы мүмкін. Қызметтердің толық тізімін қараңыз немесе кеңеске жазылыңыз — дәрігер не қажет екенін айтады.',
    en: 'The link may be out of date. Browse the full list of services or book a consultation — the doctor will advise what you need.',
  },
  departmentLink: { ru: 'Об отделении', kk: 'Бөлімше туралы', en: 'About the department' },
  seoPrice: {
    ru: 'Стоимость — от {price}, около {duration} мин.',
    kk: 'Құны — {price} бастап, шамамен {duration} мин.',
    en: 'From {price}, about {duration} min.',
  },
  loading: { ru: 'Загружаем описание услуги', kk: 'Қызмет сипаттамасы жүктелуде', en: 'Loading the service page' },
  otherServices: { ru: 'Другие услуги отделения', kk: 'Бөлімшенің басқа қызметтері', en: 'Other services in this department' },
} satisfies Copy;

/* =============================================================== DEPARTMENT */

export const departmentCopy = {
  eyebrow: { ru: 'Отделение', kk: 'Бөлімше', en: 'Department' },
  aboutLabel: { ru: 'Об отделении', kk: 'Бөлімше туралы', en: 'About' },
  aboutTitle: { ru: 'Кому и чем мы помогаем', kk: 'Кімге және немен көмектесеміз', en: 'Who we help, and how' },
  indicationsTitle: { ru: 'С чем к нам приходят', kk: 'Бізге немен келеді', en: 'Why patients come to us' },
  statServices: { ru: 'услуг в отделении', kk: 'бөлімшедегі қызмет', en: 'services in the department' },
  statSteps: { ru: 'этапов визита описаны заранее', kk: 'келу кезеңі алдын ала сипатталған', en: 'visit stages explained in advance' },
  statAnswers: { ru: 'ответов на частые вопросы', kk: 'жиі сұраққа жауап', en: 'answers to common questions' },
  stepsLabel: { ru: 'Как проходит приём', kk: 'Қабылдау қалай өтеді', en: 'How a visit goes' },
  stepsTitle: { ru: 'Шаг за шагом, без неожиданностей', kk: 'Қадам сайын, күтпеген жағдайсыз', en: 'Step by step, with no surprises' },
  stepWord: { ru: 'Шаг', kk: 'Қадам', en: 'Step' },
  servicesLabel: { ru: 'Услуги', kk: 'Қызметтер', en: 'Services' },
  servicesTitle: { ru: 'Услуги отделения', kk: 'Бөлімше қызметтері', en: 'Services in this department' },
  doctorsLabel: { ru: 'Команда', kk: 'Команда', en: 'Team' },
  doctorsTitle: { ru: 'Врачи отделения', kk: 'Бөлімше дәрігерлері', en: 'Doctors in the department' },
  faqLabel: { ru: 'Вопросы', kk: 'Сұрақтар', en: 'Questions' },
  faqTitle: { ru: 'Частые вопросы', kk: 'Жиі қойылатын сұрақтар', en: 'Frequently asked questions' },
} satisfies Copy;

/* ============================================================== DEPARTMENTS */

export const departmentsCopy = {
  eyebrow: { ru: 'Структура центра', kk: 'Орталық құрылымы', en: 'Centre structure' },
  lead: {
    ru: 'Шесть отделений работают как одна команда: диагностика передаёт данные хирургам, детские врачи — оптикам, и пациенту не нужно пересказывать историю заново.',
    kk: 'Алты бөлімше бір команда ретінде жұмыс істейді: диагностика деректерді хирургтарға, балалар дәрігерлері оптиктерге береді, пациентке тарихын қайта айтудың қажеті жоқ.',
    en: 'Six departments work as one team: diagnostics hands data to surgeons, paediatric doctors to opticians — and patients never have to retell their story.',
  },
  statement: {
    ru: 'Один центр, одна карта пациента, шесть профильных команд — от первой проверки зрения ребёнка до замены хрусталика.',
    kk: 'Бір орталық, бір пациент картасы, алты бейінді команда — баланың көруін алғаш тексеруден бастап көз бұршағын ауыстыруға дейін.',
    en: 'One centre, one patient record, six specialist teams — from a child’s first eye test to lens replacement.',
  },
  statementLabel: { ru: 'Как мы устроены', kk: 'Біз қалай құрылғанбыз', en: 'How we work' },
  orbitCenter: { ru: 'Одна карта пациента', kk: 'Бір пациент картасы', en: 'One patient record' },
  listLabel: { ru: 'Отделения', kk: 'Бөлімшелер', en: 'Departments' },
  listTitle: { ru: 'Шесть направлений', kk: 'Алты бағыт', en: 'Six areas of care' },
  figuresLabel: { ru: 'В цифрах', kk: 'Сандармен', en: 'In figures' },
  figuresTitle: { ru: 'Центр в цифрах', kk: 'Орталық сандармен', en: 'The centre in figures' },
  statDepartments: { ru: 'отделений', kk: 'бөлімше', en: 'departments' },
  statServices: { ru: 'услуг с ценами онлайн', kk: 'бағасы онлайн қызмет', en: 'services priced online' },
  statPrograms: { ru: 'программ с фиксированной ценой', kk: 'тіркелген бағалы бағдарлама', en: 'fixed-price programmes' },
} satisfies Copy;

/* ================================================================= PROGRAMS */

export const programsCopy = {
  lead: {
    ru: 'Комплексные пакеты обследования и наблюдения с фиксированной стоимостью: всё, что входит, известно заранее.',
    kk: 'Тіркелген құны бар кешенді тексеру және бақылау пакеттері: не кіретіні алдын ала белгілі.',
    en: 'Complete examination and follow-up packages at a fixed price: you know everything included in advance.',
  },
  listLabel: { ru: 'Программы', kk: 'Бағдарламалар', en: 'Programmes' },
  listTitle: { ru: 'Выберите программу', kk: 'Бағдарламаны таңдаңыз', en: 'Choose a programme' },
  includes: { ru: 'Что входит', kk: 'Не кіреді', en: 'What’s included' },
  duration: { ru: 'Формат', kk: 'Форматы', en: 'Format' },
  price: { ru: 'Стоимость программы', kk: 'Бағдарлама құны', en: 'Programme price' },
  statement: {
    ru: 'Программа — это не набор анализов, а маршрут: один координатор, одно заключение и понятный план на год вперёд.',
    kk: 'Бағдарлама — талдаулар жиынтығы емес, бағыт: бір үйлестіруші, бір қорытынды және бір жылға анық жоспар.',
    en: 'A programme is not a bundle of tests but a route: one coordinator, one conclusion and a clear plan for the year ahead.',
  },
  statementLabel: { ru: 'Подход', kk: 'Тәсіл', en: 'Approach' },
  flowLabel: { ru: 'Как проходит', kk: 'Қалай өтеді', en: 'How it works' },
  flowTitle: { ru: 'От записи до плана наблюдения', kk: 'Жазылудан бақылау жоспарына дейін', en: 'From booking to a follow-up plan' },
  f1: { ru: 'Запись', kk: 'Жазылу', en: 'Booking' },
  f1Text: { ru: 'Онлайн или по телефону — координатор подтверждает время.', kk: 'Онлайн немесе телефон арқылы — үйлестіруші уақытты растайды.', en: 'Online or by phone — a coordinator confirms the time.' },
  f2: { ru: 'Обследование', kk: 'Тексеру', en: 'Examination' },
  f2Text: { ru: 'Все исследования программы — в один или несколько визитов.', kk: 'Бағдарламаның барлық зерттеулері — бір немесе бірнеше келуде.', en: 'All tests in the programme, in one or several visits.' },
  f3: { ru: 'Заключение', kk: 'Қорытынды', en: 'Conclusion' },
  f3Text: { ru: 'Врач разбирает результаты и отвечает на вопросы.', kk: 'Дәрігер нәтижелерді талдап, сұрақтарға жауап береді.', en: 'The doctor goes through the results and answers questions.' },
  f4: { ru: 'План', kk: 'Жоспар', en: 'Plan' },
  f4Text: { ru: 'Письменный план наблюдения и напоминания о визитах.', kk: 'Жазбаша бақылау жоспары және келулер туралы еске салғыштар.', en: 'A written follow-up plan and visit reminders.' },
  benefitsLabel: { ru: 'Почему программа', kk: 'Неге бағдарлама', en: 'Why a programme' },
  b1: { ru: 'Фиксированная цена', kk: 'Тіркелген баға', en: 'Fixed price' },
  b1Text: { ru: 'Стоимость известна до начала — без доплат за исследования из списка.', kk: 'Құны басында белгілі — тізімдегі зерттеулер үшін қосымша төлемсіз.', en: 'The price is known up front — no extra charges for listed tests.' },
  b2: { ru: 'Один координатор', kk: 'Бір үйлестіруші', en: 'One coordinator' },
  b2Text: { ru: 'Составляет расписание визитов и отвечает в WhatsApp.', kk: 'Келулер кестесін құрады және WhatsApp-та жауап береді.', en: 'Schedules your visits and answers on WhatsApp.' },
  b3: { ru: 'Единая карта', kk: 'Бірыңғай карта', en: 'One record' },
  b3Text: { ru: 'Результаты хранятся в личном кабинете и доступны врачу на следующем визите.', kk: 'Нәтижелер жеке кабинетте сақталады және келесі келуде дәрігерге қолжетімді.', en: 'Results are stored in your account and available to the doctor next time.' },
  book: { ru: 'Записаться на программу', kk: 'Бағдарламаға жазылу', en: 'Book this programme' },
} satisfies Copy;

/* ================================================================== PRICING */

export const pricingCopy = {
  eyebrow: { ru: 'Прайс-лист', kk: 'Баға тізімі', en: 'Price list' },
  lead: {
    ru: 'Актуальные цены на все услуги центра. Стоимость указана «от» — итог зависит от объёма, который врач назначит после осмотра.',
    kk: 'Орталықтың барлық қызметтеріне өзекті бағалар. Құны «бастап» көрсетілген — соңғысы дәрігер тексеруден кейін тағайындайтын көлемге байланысты.',
    en: 'Current prices for every service. Prices are shown as “from” — the total depends on the scope your doctor recommends after the examination.',
  },
  searchLabel: { ru: 'Найти услугу', kk: 'Қызметті табу', en: 'Find a service' },
  searchPlaceholder: { ru: 'Например, ОКТ или катаракта', kk: 'Мысалы, ОКТ немесе катаракта', en: 'For example, OCT or cataract' },
  listLabel: { ru: 'Цены', kk: 'Бағалар', en: 'Prices' },
  listTitle: { ru: 'Стоимость услуг', kk: 'Қызметтер құны', en: 'Service prices' },
  found: { ru: 'Найдено услуг', kk: 'Табылған қызметтер', en: 'Services found' },
  programsLabel: { ru: 'Пакеты', kk: 'Пакеттер', en: 'Packages' },
  programsTitle: { ru: 'Медицинские программы', kk: 'Медициналық бағдарламалар', en: 'Medical programmes' },
  programsText: {
    ru: 'Если нужно несколько исследований, программа с фиксированной ценой обычно выгоднее.',
    kk: 'Бірнеше зерттеу қажет болса, тіркелген бағасы бар бағдарлама әдетте тиімдірек.',
    en: 'If you need several tests, a fixed-price programme is usually better value.',
  },
  payLabel: { ru: 'Оплата', kk: 'Төлем', en: 'Payment' },
  payTitle: { ru: 'Как оплатить приём', kk: 'Қабылдауды қалай төлеуге болады', en: 'How to pay for your visit' },
  pay1: { ru: 'Онлайн-оплата', kk: 'Онлайн-төлем', en: 'Online payment' },
  pay1Text: { ru: 'Картой в личном кабинете после записи — чек приходит на e-mail.', kk: 'Жазылғаннан кейін жеке кабинетте картамен — чек e-mail-ге келеді.', en: 'By card in your account after booking — the receipt goes to your e-mail.' },
  pay2: { ru: 'В клинике', kk: 'Клиникада', en: 'At the clinic' },
  pay2Text: { ru: 'Картой, наличными или QR-переводом на ресепшене.', kk: 'Ресепшенде картамен, қолма-қол немесе QR-аударыммен.', en: 'By card, cash or QR transfer at reception.' },
  pay3: { ru: 'Без скрытых доплат', kk: 'Жасырын қосымша төлемсіз', en: 'No hidden extras' },
  pay3Text: { ru: 'Если врач предложит дополнительное исследование, стоимость называют до его проведения.', kk: 'Дәрігер қосымша зерттеу ұсынса, құны ол жүргізілгенге дейін айтылады.', en: 'If the doctor suggests an extra test, you are told the price before it is done.' },
} satisfies Copy;

/* =============================================================== PROMOTIONS */

export const promotionsCopy = {
  eyebrow: { ru: 'Специальные предложения', kk: 'Арнайы ұсыныстар', en: 'Special offers' },
  lead: {
    ru: 'Действующие акции центра. Скидки не суммируются; медицинские показания определяет врач, а не акция.',
    kk: 'Орталықтың қолданыстағы акциялары. Жеңілдіктер қосылмайды; медициналық көрсетілімдерді акция емес, дәрігер анықтайды.',
    en: 'Current offers at the centre. Discounts do not combine; medical need is decided by the doctor, not by an offer.',
  },
  listLabel: { ru: 'Акции', kk: 'Акциялар', en: 'Offers' },
  listTitle: { ru: 'Действуют сейчас', kk: 'Қазір қолданыста', en: 'Available now' },
  validTo: { ru: 'До', kk: 'Мерзімі', en: 'Until' },
  termsLabel: { ru: 'Условия', kk: 'Шарттар', en: 'Terms' },
  termsTitle: { ru: 'Подробные условия', kk: 'Толық шарттар', en: 'Full terms' },
  bookOffer: { ru: 'Записаться со скидкой', kk: 'Жеңілдікпен жазылу', en: 'Book with discount' },
  emptyTitle: { ru: 'Сейчас акций нет', kk: 'Қазір акция жоқ', en: 'No offers right now' },
  emptyText: {
    ru: 'Новые предложения появляются несколько раз в год. Посмотрите программы с фиксированной ценой.',
    kk: 'Жаңа ұсыныстар жылына бірнеше рет пайда болады. Тіркелген бағасы бар бағдарламаларды қараңыз.',
    en: 'New offers appear several times a year. Meanwhile, see our fixed-price programmes.',
  },
  statement: {
    ru: 'Акция помогает сэкономить, но не меняет стандарт: те же врачи, то же оборудование, тот же объём обследования.',
    kk: 'Акция үнемдеуге көмектеседі, бірақ стандартты өзгертпейді: сол дәрігерлер, сол жабдық, сол тексеру көлемі.',
    en: 'An offer saves money but never changes the standard: the same doctors, the same equipment, the same scope of examination.',
  },
  off: { ru: 'скидка', kk: 'жеңілдік', en: 'off' },
  free: { ru: 'Бесплатно', kk: 'Тегін', en: 'Free' },
  freeNote: { ru: 'по программе', kk: 'бағдарлама бойынша', en: 'with the programme' },
  statementLabel: { ru: 'Стандарт', kk: 'Стандарт', en: 'Standard' },
  discussTerms: { ru: 'Обсудить условия', kk: 'Шарттарды талқылау', en: 'Discuss terms' },
} satisfies Copy;

/**
 * Display titles for offers whose data title repeats the badge
 * («−20% · −20% на комплексную диагностику», UI/UX audit S4). The source
 * record in data/promotions.json should be updated the same way; until then
 * these win, and any other title has a leading/trailing «−NN%» stripped.
 */
export const promotionTitles: Record<string, Localized> = {
  'promo-checkup': { ru: 'Комплексная диагностика', kk: 'Кешенді диагностика', en: 'Complete diagnostics' },
  'promo-optics': { ru: 'Вторая пара очков', kk: 'Екінші жұп көзілдірік', en: 'A second pair of glasses' },
};

/* ================================================================== BOOKING */

export const bookingCopy = {
  eyebrow: { ru: 'Запись к врачу', kk: 'Дәрігерге жазылу', en: 'Book a visit' },
  wizardLabel: { ru: 'Запись', kk: 'Жазылу', en: 'Booking' },
  /* Count-free on purpose: the wizard has six or seven steps depending on
     how many clinics take bookings; the live counter says «Шаг n из N». */
  wizardTitle: { ru: 'Запись за минуту, шаг за шагом', kk: 'Бір минутта, қадам сайын жазылу', en: 'Book in about a minute, step by step' },
  seoDescription: {
    ru: 'Онлайн-запись к офтальмологу: клиника, отделение, услуга, врач и время за минуту. Подтверждение и напоминания приходят в WhatsApp.',
    kk: 'Офтальмологқа онлайн-жазылу: клиника, бөлімше, қызмет, дәрігер және уақыт бір минутта. Растау мен еске салғыштар WhatsApp-қа келеді.',
    en: 'Book an eye doctor online: clinic, department, service, doctor and time in about a minute. Confirmation and reminders arrive on WhatsApp.',
  },
  successTextEmail: {
    ru: 'Подтверждение отправлено в WhatsApp и на e-mail. Напоминание придёт за сутки до приёма.',
    kk: 'Растау WhatsApp-қа және e-mail-ге жіберілді. Еске салғыш қабылдаудан бір күн бұрын келеді.',
    en: 'A confirmation has been sent to WhatsApp and to your e-mail. A reminder will arrive the day before your visit.',
  },
  successTextPhone: {
    ru: 'Подтверждение придёт в WhatsApp на указанный номер. Напоминание — за сутки до приёма.',
    kk: 'Растау көрсетілген нөмірге WhatsApp арқылы келеді. Еске салғыш — қабылдаудан бір күн бұрын.',
    en: 'A confirmation will arrive on WhatsApp at the number you gave. A reminder follows the day before your visit.',
  },
  offlineTitle: { ru: 'Заявка сохранена', kk: 'Өтінім сақталды', en: 'Request saved' },
  offlineText: {
    ru: 'Система записи сейчас не отвечает, поэтому время ещё не закреплено. Отправьте номер заявки в WhatsApp или позвоните — координатор подтвердит визит.',
    kk: 'Жазылу жүйесі қазір жауап бермейді, сондықтан уақыт әлі бекітілмеген. Өтінім нөмірін WhatsApp-қа жіберіңіз немесе қоңырау шалыңыз — үйлестіруші келуді растайды.',
    en: 'The booking system is not responding, so the time is not held yet. Send the request number on WhatsApp or call us and a coordinator will confirm your visit.',
  },
  requestNumber: { ru: 'Номер заявки', kk: 'Өтінім нөмірі', en: 'Request number' },
  stepOf: { ru: 'Шаг {n} из {total}', kk: '{total} қадамның {n}-сі', en: 'Step {n} of {total}' },
  tilesLabel: { ru: 'После записи', kk: 'Жазылғаннан кейін', en: 'After booking' },
  whatsappText: {
    ru: 'Подтверждение и напоминания приходят в WhatsApp — там же можно задать вопрос или перенести визит.',
    kk: 'Растау мен еске салғыштар WhatsApp-қа келеді — сол жерде сұрақ қоюға немесе келуді ауыстыруға болады.',
    en: 'Confirmation and reminders arrive on WhatsApp — you can ask a question or reschedule there too.',
  },
  privacyText: {
    ru: 'Данные передаются по защищённому соединению и используются только для записи и связи с вами.',
    kk: 'Деректер қорғалған байланыс арқылы беріледі және тек жазылу мен сізбен байланысу үшін пайдаланылады.',
    en: 'Your data travels over an encrypted connection and is used only for the booking and to contact you.',
  },
  callInstead: { ru: 'Удобнее по телефону?', kk: 'Телефонмен ыңғайлы ма?', en: 'Prefer the phone?' },
  calendarAlt: { ru: 'Иллюстрация: календарь записи', kk: 'Иллюстрация: жазылу күнтізбесі', en: 'Illustration: booking calendar' },
  selectFirst: { ru: 'Сначала выберите вариант', kk: 'Алдымен нұсқаны таңдаңыз', en: 'Choose an option first' },
} satisfies Copy;

/* ================================================================= CONTACTS */

export const contactsCopy = {
  seoDescription: {
    ru: 'Адрес, телефон и часы работы офтальмологического центра в Астане: как добраться, WhatsApp, e-mail и форма обратной связи.',
    kk: 'Астанадағы офтальмологиялық орталықтың мекенжайы, телефоны және жұмыс уақыты: қалай жетуге болады, WhatsApp, e-mail, кері байланыс.',
    en: 'Address, phone and opening hours of our eye centre in Astana: directions, WhatsApp, e-mail and a contact form.',
  },
  lead: {
    ru: 'Офтальмологический центр в Астане. Контакт-центр запишет на приём, подскажет маршрут и ответит на вопросы о подготовке.',
    kk: 'Астанадағы офтальмологиялық орталық. Байланыс орталығы қабылдауға жазады, бағытты айтады және дайындық туралы сұрақтарға жауап береді.',
    en: 'An eye centre in Astana. The contact centre books visits, explains the route and answers questions about preparation.',
  },
  clinicsLabel: { ru: 'Адрес', kk: 'Мекенжай', en: 'Address' },
  clinicTitleOne: { ru: 'Где нас найти', kk: 'Бізді қайдан табуға болады', en: 'Where to find us' },
  surgical: { ru: 'Хирургический центр', kk: 'Хирургиялық орталық', en: 'Surgical centre' },
  outpatient: { ru: 'Амбулаторный приём', kk: 'Амбулаториялық қабылдау', en: 'Outpatient clinic' },
  route: { ru: 'Как добраться', kk: 'Қалай жетуге болады', en: 'Getting there' },
  open2gis: { ru: 'Открыть в 2ГИС', kk: '2ГИС-те ашу', en: 'Open in 2GIS' },
  openGoogle: { ru: 'Google Maps', kk: 'Google Maps', en: 'Google Maps' },
  mapLabel: { ru: 'Карта', kk: 'Карта', en: 'Map' },
  mapTitle: { ru: 'Мы на карте', kk: 'Біз картада', en: 'Find us on the map' },
  mapText: {
    ru: 'Схема упрощена. Для маршрута откройте карту в 2ГИС или Google Maps — точка уже отмечена.',
    kk: 'Сызба жеңілдетілген. Бағыт үшін картаны 2ГИС немесе Google Maps-те ашыңыз — нүкте белгіленген.',
    en: 'The map is simplified. For directions open 2GIS or Google Maps — the location is already pinned.',
  },
  mapPicker: { ru: 'Выберите клинику на карте', kk: 'Картадағы клиниканы таңдаңыз', en: 'Choose a clinic on the map' },
  mapAria: { ru: 'Схематичная карта района клиники', kk: 'Клиника ауданының сызба картасы', en: 'Schematic map of the clinic area' },
  channelsLabel: { ru: 'Связь', kk: 'Байланыс', en: 'Channels' },
  channelsTitle: { ru: 'Как с нами связаться', kk: 'Бізбен қалай байланысуға болады', en: 'How to reach us' },
  phoneText: { ru: 'Контакт-центр: запись, перенос визита, вопросы о подготовке.', kk: 'Байланыс орталығы: жазылу, келуді ауыстыру, дайындық туралы сұрақтар.', en: 'Contact centre: bookings, rescheduling, preparation questions.' },
  whatsappText: { ru: 'Быстрый ответ координатора, подтверждения и напоминания.', kk: 'Үйлестірушінің жылдам жауабы, растаулар мен еске салғыштар.', en: 'Quick replies from a coordinator, confirmations and reminders.' },
  emailText: { ru: 'Для документов, запросов организаций и второго мнения.', kk: 'Құжаттар, ұйымдардың сұраулары және екінші пікір үшін.', en: 'For documents, organisations and second-opinion requests.' },
  formLead: {
    ru: 'Напишите вопрос — ответим в течение рабочего дня. Для срочных ситуаций звоните или пишите в WhatsApp.',
    kk: 'Сұрағыңызды жазыңыз — жұмыс күні ішінде жауап береміз. Шұғыл жағдайда қоңырау шалыңыз немесе WhatsApp-қа жазыңыз.',
    en: 'Send us your question — we reply within one working day. For anything urgent, call or message us on WhatsApp.',
  },
  urgent: {
    ru: 'При внезапной потере зрения, травме глаза или сильной боли не ждите ответа — звоните 103 или обращайтесь в ближайший приёмный покой.',
    kk: 'Көру кенет жоғалса, көз жарақаттанса немесе қатты ауырса, жауап күтпеңіз — 103-ке қоңырау шалыңыз немесе жақын қабылдау бөліміне барыңыз.',
    en: 'If you suddenly lose vision, injure your eye or have severe pain, do not wait for a reply — call 103 or go to the nearest emergency department.',
  },
} satisfies Copy;
