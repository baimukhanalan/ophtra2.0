import type { Localized } from '@/i18n/types';
import type { NewsItem } from '@/types';

/**
 * Media centre (spec §11): news, press releases, interviews, video,
 * podcasts, events, press contact. Also the copy for the restyled news list
 * and news article pages.
 *
 * Only the 24KZ report is third-party material; everything else is the
 * centre's own announcements, described with its true status. The news feed
 * (data/news.json) is still demo content: see `newsEditorial` below.
 */

export type MediaTab = 'all' | 'news' | 'press' | 'interviews' | 'video' | 'podcasts' | 'events';

export const MEDIA_TABS: Array<{ key: MediaTab; label: Localized }> = [
  { key: 'all', label: { ru: 'Все', kk: 'Барлығы', en: 'All' } },
  { key: 'news', label: { ru: 'Новости', kk: 'Жаңалықтар', en: 'News' } },
  { key: 'press', label: { ru: 'Пресс-релизы', kk: 'Баспасөз релиздері', en: 'Press releases' } },
  { key: 'interviews', label: { ru: 'Интервью', kk: 'Сұхбаттар', en: 'Interviews' } },
  { key: 'video', label: { ru: 'Видео', kk: 'Бейне', en: 'Video' } },
  { key: 'podcasts', label: { ru: 'Подкасты', kk: 'Подкасттар', en: 'Podcasts' } },
  { key: 'events', label: { ru: 'Мероприятия', kk: 'Іс-шаралар', en: 'Events' } },
];

export const mediaCopy = {
  seoTitle: { ru: 'Медиацентр', kk: 'Медиаорталық', en: 'Media centre' },
  seoDescription: {
    ru: 'Новости, пресс-релизы, интервью, видео, подкасты и мероприятия офтальмологического центра доктора Кулмаганбетова. Контакты для прессы.',
    kk: 'Доктор Құлмағанбетов офтальмологиялық орталығының жаңалықтары, баспасөз релиздері, сұхбаттары, бейнелері, подкасттары және іс-шаралары. Баспасөзге арналған байланыс.',
    en: "News, press releases, interviews, video, podcasts and events from Dr Kulmaganbetov's ophthalmic centre. Press contacts.",
  },
  heroEyebrow: { ru: 'Наука и медиа', kk: 'Ғылым және медиа', en: 'Science and media' },
  heroTitle: { ru: 'Медиацентр', kk: 'Медиаорталық', en: 'Media centre' },
  heroText: {
    ru: 'Новости центра, научные события, выступления врачей и материалы для журналистов — в одном месте.',
    kk: 'Орталық жаңалықтары, ғылыми оқиғалар, дәрігерлердің сөйлеген сөздері және журналистерге арналған материалдар — бір жерде.',
    en: "The centre's news, research milestones, doctors' talks and materials for journalists — all in one place.",
  },
  heroPress: { ru: 'Контакты для прессы', kk: 'Баспасөзге арналған байланыс', en: 'Press contacts' },
  heroVideo: { ru: 'Видео', kk: 'Бейне', en: 'Video' },
  tabsLabel: { ru: 'Разделы медиацентра', kk: 'Медиаорталық бөлімдері', en: 'Media centre sections' },

  newsTitle: { ru: 'Новости центра', kk: 'Орталық жаңалықтары', en: 'Centre news' },
  allNews: { ru: 'Все новости', kk: 'Барлық жаңалықтар', en: 'All news' },
  read: { ru: 'Читать', kk: 'Оқу', en: 'Read' },

  pressTitle: { ru: 'Официальные сообщения', kk: 'Ресми хабарламалар', en: 'Official announcements' },
  interviewsTitle: { ru: 'Ответы на частые вопросы', kk: 'Жиі қойылатын сұрақтарға жауаптар', en: 'Answers to common questions' },
  interviewsText: {
    ru: 'Интервью с врачами центра готовятся к публикации. Пока здесь — вопросы, которые пациенты задают чаще всего, со ссылкой на полный материал базы знаний и его автора.',
    kk: 'Орталық дәрігерлерімен сұхбаттар жариялауға дайындалуда. Әзірге мұнда — пациенттер жиі қоятын сұрақтар, білім қорының толық материалына және оның авторына сілтемемен.',
    en: "Interviews with the centre's doctors are being prepared. For now, here are the questions patients ask most, each linked to the full knowledge-base material and its author.",
  },
  answeredBy: { ru: 'Материал', kk: 'Материал', en: 'Written by' },
  videoTitle: { ru: 'Сюжеты и видеоответы', kk: 'Сюжеттер және бейнежауаптар', en: 'Reports and video answers' },
  videoSoon: { ru: 'Скоро', kk: 'Жақында', en: 'Coming soon' },
  videoSoonTitle: { ru: 'Видеоответы врачей', kk: 'Дәрігерлердің бейнежауаптары', en: 'Doctors answer on video' },
  videoSoonText: {
    ru: 'Короткие видео, в которых врачи центра объясняют обследования и операции. Первые выпуски готовятся к публикации.',
    kk: 'Орталық дәрігерлері тексерулер мен оталарды түсіндіретін қысқа бейнелер. Алғашқы шығарылымдар жариялауға дайындалуда.',
    en: 'Short videos in which our doctors explain examinations and operations. The first episodes are being prepared.',
  },
  openVideo: { ru: 'Открыть на YouTube', kk: 'YouTube-та ашу', en: 'Open on YouTube' },
  podcastsTitle: { ru: 'Подкаст «Ясно»', kk: '«Анық» подкасты', en: 'The “Clearly” podcast' },
  podcastsText: {
    ru: 'Короткие выпуски о зрении без сложных терминов. Первый сезон готовится к выходу — ниже темы, над которыми мы работаем.',
    kk: 'Көру туралы күрделі терминдерсіз қысқа шығарылымдар. Бірінші маусым шығуға дайындалуда — төменде біз жұмыс істеп жатқан тақырыптар.',
    en: 'Short episodes about sight without jargon. The first season is in production — below are the topics we are working on.',
  },
  episode: { ru: 'Выпуск', kk: 'Шығарылым', en: 'Episode' },
  inProduction: { ru: 'В работе', kk: 'Дайындалуда', en: 'In production' },
  eventsTitle: { ru: 'Ближайшие события', kk: 'Жақын іс-шаралар', en: 'Upcoming events' },
  eventsAll: { ru: 'Календарь Академии', kk: 'Академия күнтізбесі', en: 'Academy calendar' },

  pressContactEyebrow: { ru: 'Для журналистов', kk: 'Журналистерге', en: 'For journalists' },
  pressContactTitle: { ru: 'Пресс-служба', kk: 'Баспасөз қызметі', en: 'Press office' },
  pressContactText: {
    ru: 'Принимаем запросы на комментарий врача, интервью и съёмку в центре — с соблюдением конфиденциальности пациентов. Каждый запрос согласуем со спикером.',
    kk: 'Дәрігердің пікіріне, сұхбатқа және орталықта түсірілімге сұраныстарды қабылдаймыз — пациенттердің құпиялылығын сақтай отырып. Әр сұранысты спикермен келісеміз.',
    en: 'We handle requests for expert comment, interviews and filming at the centre, protecting patient privacy. Every request is agreed with the speaker first.',
  },
  pressKit: {
    ru: ['Логотипы и фирменные цвета', 'Краткая биография основателя', 'Список публикаций', 'Правила съёмки в клинике'],
    kk: ['Логотиптер мен фирмалық түстер', 'Негізін қалаушының қысқаша өмірбаяны', 'Жарияланымдар тізімі', 'Клиникада түсірілім ережелері'],
    en: ['Logos and brand colours', "Founder's short biography", 'List of publications', 'Filming rules at the clinic'],
  },
  pressKitTitle: { ru: 'Пресс-кит по запросу', kk: 'Сұрау бойынша пресс-кит', en: 'Press kit on request' },
  write: { ru: 'Написать в пресс-службу', kk: 'Баспасөз қызметіне жазу', en: 'E-mail the press office' },

  ctaTitle: {
    ru: 'Новости — это хорошо, а осмотр — надёжнее',
    kk: 'Жаңалықтар жақсы, ал тексеру — сенімдірек',
    en: 'News is good; an eye examination is better',
  },

  /* ---------------------------------------------------------- news pages */
  newsSeoDescription: {
    ru: 'Новости офтальмологического центра доктора Кулмаганбетова: оборудование, программы, события и научные результаты.',
    kk: 'Доктор Құлмағанбетов офтальмологиялық орталығының жаңалықтары: жабдықтар, бағдарламалар, оқиғалар және ғылыми нәтижелер.',
    en: "News from Dr Kulmaganbetov's ophthalmic centre: equipment, programmes, events and research results.",
  },
  newsHeroText: {
    ru: 'Что меняется в центре: новое оборудование, программы для пациентов, события и научная работа.',
    kk: 'Орталықта не өзгеріп жатыр: жаңа жабдық, пациенттерге арналған бағдарламалар, оқиғалар және ғылыми жұмыс.',
    en: "What's changing at the centre: new equipment, patient programmes, events and research.",
  },
  newsListEyebrow: { ru: 'Лента', kk: 'Лента', en: 'Feed' },
  newsCategory: { ru: 'Рубрика', kk: 'Айдар', en: 'Section' },
  newsCount: { ru: 'Новостей', kk: 'Жаңалықтар', en: 'Stories' },
  moreEyebrow: { ru: 'Ещё', kk: 'Тағы', en: 'More' },
  moreTitle: { ru: 'Другие разделы медиацентра', kk: 'Медиаорталықтың басқа бөлімдері', en: 'More from the media centre' },
  relatedTitle: { ru: 'Другие новости', kk: 'Басқа жаңалықтар', en: 'More news' },
  backToNews: { ru: 'Ко всем новостям', kk: 'Барлық жаңалықтарға', en: 'Back to all news' },
  share: { ru: 'Скопировать ссылку', kk: 'Сілтемені көшіру', en: 'Copy link' },
  copied: { ru: 'Ссылка скопирована', kk: 'Сілтеме көшірілді', en: 'Link copied' },
  demoTag: { ru: 'Демо', kk: 'Демо', en: 'Demo' },
  demoTitle: { ru: 'Демонстрационная лента', kk: 'Демонстрациялық лента', en: 'Demo feed' },
  demoNote: {
    ru: 'Новости ниже показывают формат раздела и пока не являются подтверждёнными сообщениями центра. Цифры и результаты из них удалены до проверки.',
    kk: 'Төмендегі жаңалықтар бөлімнің форматын көрсетеді және әзірге орталықтың расталған хабарламалары емес. Сандар мен нәтижелер тексерілгенге дейін алынып тасталды.',
    en: "The stories below show the format of this section and are not yet confirmed announcements from the centre. Figures and results have been removed pending verification.",
  },
  demoArticleNote: {
    ru: 'Демонстрационная новость: пример формата раздела, а не подтверждённое сообщение центра. Цифры и результаты не приводятся до проверки.',
    kk: 'Демонстрациялық жаңалық: бөлім форматының мысалы, орталықтың расталған хабарламасы емес. Сандар мен нәтижелер тексерілгенге дейін келтірілмейді.',
    en: 'Demo story: an example of the section format, not a confirmed announcement from the centre. No figures or results are given until verified.',
  },
} as const;

/* ======================================================== PRESS RELEASES */

export const pressReleases: Array<{ id: string; date: string; title: Localized; text: Localized; to?: string }> = [
  {
    id: 'pr-knowledge',
    date: '2026-09-22',
    title: {
      ru: 'Центр открыл трёхъязычную базу знаний о здоровье глаз',
      kk: 'Орталық көз саулығы туралы үш тілді білім қорын ашты',
      en: 'The centre launches a trilingual eye-health knowledge base',
    },
    text: {
      ru: 'Материалы на русском, казахском и английском языках — с источниками, указанием автора и статусом медицинской проверки.',
      kk: 'Орыс, қазақ және ағылшын тілдеріндегі материалдар — дереккөздерімен, авторы және медициналық тексеру мәртебесі көрсетілген.',
      en: 'Materials in Russian, Kazakh and English — with sources, a named author and their medical-review status.',
    },
    to: '/knowledge-base',
  },
  {
    id: 'pr-academy',
    date: '2026-09-10',
    title: {
      ru: 'Академия центра: программы готовятся к запуску',
      kk: 'Орталық академиясы: бағдарламалар іске қосуға дайындалуда',
      en: "The centre's Academy: programmes in preparation",
    },
    text: {
      ru: 'Мастер-классы по ОКТ, wet-lab для резидентов, курс по контролю миопии и бесплатные школы пациентов стартуют вместе с открытием центра в Астане. Расписание предварительное.',
      kk: 'ОКТ бойынша шеберлік сыныптары, резиденттерге арналған wet-lab, миопияны бақылау курсы және пациенттерге арналған тегін мектептер Астанадағы орталық ашылғанда басталады. Кесте алдын ала.',
      en: 'OCT masterclasses, a residents’ wet-lab, a myopia management course and free patient schools will start when the Astana centre opens. The schedule is provisional.',
    },
    to: '/academy',
  },
  {
    id: 'pr-publications',
    date: '2026-08-28',
    title: {
      ru: 'Работы доктора Кулмаганбетова опубликованы в международных журналах',
      kk: 'Доктор Құлмағанбетовтың жұмыстары халықаралық журналдарда жарияланды',
      en: "Dr Kulmaganbetov's research published in international journals",
    },
    text: {
      ru: 'Scientific Reports, Diagnostics и Healthcare: тесты со структурированным светом, ИИ-анализ ганглиозных клеток сетчатки и клиническая эпидемиология.',
      kk: 'Scientific Reports, Diagnostics және Healthcare: құрылымды жарық тестері, тор қабықтың ганглиозды жасушаларын ЖИ арқылы талдау және клиникалық эпидемиология.',
      en: 'Scientific Reports, Diagnostics and Healthcare: structured-light tests, AI analysis of retinal ganglion cells and clinical epidemiology.',
    },
    to: '/science',
  },
];

/* ============================================================ INTERVIEWS */

/**
 * Q&A cards; each links to a knowledge-base article and credits that
 * article's author (keep `authorId` in step with knowledge-articles-index.ts).
 */
export const interviews: Array<{ id: string; authorId: string; question: Localized; articleSlug: string }> = [
  {
    id: 'int-ai',
    authorId: 'editorial',
    question: {
      ru: 'Заменит ли искусственный интеллект офтальмолога?',
      kk: 'Жасанды интеллект офтальмологты алмастыра ма?',
      en: 'Will artificial intelligence replace the ophthalmologist?',
    },
    articleSlug: 'ai-in-retinal-imaging',
  },
  {
    id: 'int-myopia',
    authorId: 'doc-nurgalieva',
    question: {
      ru: 'Почему близорукость у детей растёт и что с этим делать?',
      kk: 'Балалардағы миопия неге өсіп келеді және онымен не істеу керек?',
      en: 'Why is myopia in children on the rise, and what can be done?',
    },
    articleSlug: 'child-myopia-progression',
  },
  {
    id: 'int-glaucoma',
    authorId: 'doc-baitursyn',
    question: {
      ru: 'Можно ли жить с глаукомой и сохранить зрение?',
      kk: 'Глаукомамен өмір сүріп, көруді сақтауға бола ма?',
      en: 'Can you live with glaucoma and keep your sight?',
    },
    articleSlug: 'glaucoma-treatment-options',
  },
];

/* ============================================================== PODCASTS */

export const podcastEpisodes: Array<{ id: string; title: Localized; text: Localized }> = [
  {
    id: 'ep1',
    title: { ru: 'Как устроен глаз за 10 минут', kk: 'Көз қалай жұмыс істейді — 10 минутта', en: 'How the eye works, in 10 minutes' },
    text: {
      ru: 'Роговица, хрусталик, сетчатка — простыми словами и без страшных терминов.',
      kk: 'Қасаң қабық, көз бұршағы, тор қабық — қарапайым сөзбен және қорқынышты терминдерсіз.',
      en: 'Cornea, lens and retina — in plain words, with no frightening jargon.',
    },
  },
  {
    id: 'ep2',
    title: { ru: 'Экраны, дети и близорукость', kk: 'Экрандар, балалар және миопия', en: 'Screens, children and myopia' },
    text: {
      ru: 'Что действительно влияет на зрение ребёнка и что — миф.',
      kk: 'Баланың көруіне шынымен не әсер етеді, ал не — аңыз.',
      en: "What really affects a child's sight — and what is myth.",
    },
  },
  {
    id: 'ep3',
    title: { ru: 'Сетчатка как окно в мозг', kk: 'Тор қабық — миға ашылған терезе', en: 'The retina as a window to the brain' },
    text: {
      ru: 'Что наука уже знает о связи сетчатки и нервной системы — и чего пока не знает.',
      kk: 'Ғылым тор қабық пен жүйке жүйесінің байланысы туралы не біледі — және әзірге нені білмейді.',
      en: 'What science already knows about the retina and the nervous system — and what it does not know yet.',
    },
  },
];

export const mediaTopics: Localized[] = [
  { ru: 'новости', kk: 'жаңалықтар', en: 'news' },
  { ru: 'наука', kk: 'ғылым', en: 'science' },
  { ru: 'интервью', kk: 'сұхбат', en: 'interviews' },
  { ru: 'видео', kk: 'бейне', en: 'video' },
  { ru: 'подкаст', kk: 'подкаст', en: 'podcast' },
  { ru: 'Академия', kk: 'Академия', en: 'Academy' },
  { ru: 'пресса', kk: 'баспасөз', en: 'press' },
];

/* ================================================================== NEWS */

/**
 * The news feed in data/news.json is demo content: its events and figures
 * are not confirmed by the clinic (compliance audit F-15–F-17). Until a story
 * is confirmed and its slug added to CONFIRMED_NEWS, it is shown with a demo
 * label, kept out of search indexes and NewsArticle schema, and the stories
 * that carried invented statistics are shown without them.
 */
export const CONFIRMED_NEWS: string[] = [];

const newsCorrections: Record<string, Partial<Pick<NewsItem, 'title' | 'excerpt' | 'body'>>> = {
  // DESIGN.md §7: the centre in Astana is planned, not open; no Almaty branch,
  // no named conferences, no results or figures that are not in §7.
  'astana-clinic-opening': {
    title: {
      ru: 'Центр в Астане готовится к открытию',
      kk: 'Астанадағы орталық ашылуға дайындалуда',
      en: 'The Astana centre is preparing to open',
    },
    excerpt: {
      ru: 'Офтальмологический центр для клинической работы и инновационных проектов.',
      kk: 'Клиникалық жұмыс пен инновациялық жобаларға арналған офтальмологиялық орталық.',
      en: 'An ophthalmic centre for clinical work and innovation projects.',
    },
    body: {
      ru: 'Доктор Мухит Кулмаганбетов планирует открыть в Астане офтальмологический центр — для клинической работы и инновационных проектов.\n\nСроки открытия, адрес и направления работы будут объявлены отдельно.',
      kk: 'Доктор Мұхит Құлмағанбетов Астанада офтальмологиялық орталық ашуды жоспарлап отыр — клиникалық жұмыс пен инновациялық жобалар үшін.\n\nАшылу мерзімі, мекенжайы және жұмыс бағыттары бөлек жарияланады.',
      en: 'Dr Mukhit Kulmaganbetov plans to open an ophthalmic centre in Astana for clinical work and innovation projects.\n\nThe opening date, address and services will be announced separately.',
    },
  },
  'pediatric-room-opened': {
    title: {
      ru: 'Детский приём: каким он будет',
      kk: 'Балаларды қабылдау: ол қандай болады',
      en: "Children's appointments: what they will be like",
    },
    excerpt: {
      ru: 'Игровой формат осмотра и отдельная зона ожидания для детей.',
      kk: 'Тексерудің ойын форматы және балаларға арналған бөлек күту аймағы.',
      en: 'A play-based examination and a separate waiting area for children.',
    },
    body: {
      ru: 'В центре планируется детский кабинет с игровой зоной ожидания: осмотр проходит в формате игры, чтобы ребёнок меньше волновался, а результаты были надёжнее.\n\nОборудование и график приёма будут объявлены после открытия центра.',
      kk: 'Орталықта ойын күту аймағы бар балалар кабинеті жоспарлануда: бала аз уайымдап, нәтижелер сенімдірек болуы үшін тексеру ойын түрінде өтеді.\n\nЖабдық пен қабылдау кестесі орталық ашылғаннан кейін жарияланады.',
      en: 'The centre plans a children’s room with a play waiting area: the examination is run as a game so the child is less anxious and the results are more reliable.\n\nEquipment and appointment hours will be announced once the centre opens.',
    },
  },
  'new-femtosecond-platform': {
    title: {
      ru: 'Лазерная коррекция в будущем центре',
      kk: 'Болашақ орталықтағы лазерлік түзету',
      en: 'Laser correction at the future centre',
    },
    excerpt: {
      ru: 'Какое оборудование планируется для отделения лазерной коррекции.',
      kk: 'Лазерлік түзету бөлімі үшін қандай жабдық жоспарлануда.',
      en: 'The equipment planned for the laser correction department.',
    },
    body: {
      ru: 'Для отделения лазерной коррекции зрения центра в Астане планируется фемтосекундная платформа.\n\nПодходит ли пациенту лазерная коррекция и какой метод выбрать, врач решает только после полного обследования. Модель оборудования и сроки будут объявлены после открытия центра.',
      kk: 'Астанадағы орталықтың көруді лазерлік түзету бөлімі үшін фемтосекундтық платформа жоспарлануда.\n\nПациентке лазерлік түзету сәйкес келе ме және қай әдісті таңдау керек екенін дәрігер толық тексеруден кейін ғана шешеді. Жабдық моделі мен мерзімдері орталық ашылғаннан кейін жарияланады.',
      en: 'A femtosecond platform is planned for the laser vision correction department of the Astana centre.\n\nWhether laser correction suits a patient, and which method to choose, is decided by the doctor only after a full examination. The equipment model and dates will be announced once the centre opens.',
    },
  },
  'glaucoma-awareness-day': {
    title: {
      ru: 'Глаукома: зачем проверять давление после 40',
      kk: 'Глаукома: 40 жастан кейін қысымды не үшін тексеру керек',
      en: 'Glaucoma: why check eye pressure after 40',
    },
    excerpt: {
      ru: 'Болезнь долго протекает без симптомов — регулярная проверка остаётся главным способом выявить её рано.',
      kk: 'Ауру ұзақ уақыт белгісіз өтеді — тұрақты тексеру оны ерте анықтаудың басты жолы болып қала береді.',
      en: 'The disease is silent for a long time, so regular checks remain the main way to catch it early.',
    },
    body: {
      ru: 'Глаукома повреждает зрительный нерв постепенно и долго не даёт симптомов. Потерянное зрение не восстанавливается, поэтому важно выявить болезнь до того, как человек заметит изменения.\n\nПосле 40 лет стоит регулярно проверять внутриглазное давление и зрительный нерв — подробнее в базе знаний.',
      kk: 'Глаукома көру жүйкесін біртіндеп зақымдайды және ұзақ уақыт белгі бермейді. Жоғалған көру қалпына келмейді, сондықтан ауруды адам өзгерісті байқағанға дейін анықтау маңызды.\n\n40 жастан кейін көзішілік қысым мен көру жүйкесін тұрақты тексеру керек — толығырақ білім қорында.',
      en: 'Glaucoma damages the optic nerve gradually and gives no symptoms for a long time. Lost sight does not come back, so the disease needs to be found before a person notices any change.\n\nAfter 40 it is worth having your eye pressure and optic nerve checked regularly — more in the knowledge base.',
    },
  },
  'international-conference': {
    title: {
      ru: 'Квантовая оптика при миопии: стадия исследований',
      kk: 'Миопиядағы кванттық оптика: зерттеу кезеңі',
      en: 'Quantum optics for myopia: the research stage',
    },
    excerpt: {
      ru: 'Технология для диагностики и лечения близорукости — на стадии исследований на животных.',
      kk: 'Алыстан көрмеушілікті анықтау мен емдеуге арналған технология — жануарларға жүргізілетін зерттеулер кезеңінде.',
      en: 'A technology to diagnose and treat short-sightedness is at the animal-study stage.',
    },
    body: {
      ru: 'Доктор Кулмаганбетов разрабатывает технологию на основе квантовой оптики для диагностики и лечения близорукости. По данным 24.kz, сейчас она на стадии исследований на животных.\n\nРезультаты будут опубликованы по мере прохождения этапов исследования; до этого технология у пациентов не применяется.',
      kk: 'Доктор Құлмағанбетов алыстан көрмеушілікті анықтау мен емдеуге арналған кванттық оптикаға негізделген технологияны әзірлеуде. 24.kz деректері бойынша, қазір ол жануарларға жүргізілетін зерттеулер кезеңінде.\n\nНәтижелер зерттеу кезеңдері өткен сайын жарияланады; оған дейін технология пациенттерге қолданылмайды.',
      en: 'Dr Kulmaganbetov is developing a quantum-optics technology to diagnose and treat short-sightedness. According to 24.kz, it is currently at the animal-study stage.\n\nResults will be published as each research stage is completed; until then the technology is not used in patients.',
    },
  },
  'whatsapp-reminders': {
    title: {
      ru: 'Напоминания о приёме в WhatsApp',
      kk: 'Қабылдау туралы WhatsApp-тағы еске салғыштар',
      en: 'Appointment reminders on WhatsApp',
    },
    excerpt: {
      ru: 'Подтверждение, напоминание и перенос записи в одном канале — так планируется сервис.',
      kk: 'Растау, еске салу және жазылуды ауыстыру бір арнада — қызмет осылай жоспарлануда.',
      en: 'Confirmation, reminders and rescheduling in one channel — how the service is planned.',
    },
    body: {
      ru: 'После открытия центра пациенты смогут получать подтверждение записи и напоминания в WhatsApp, а также переносить или отменять визит прямо в чате.\n\nРекламные сообщения будут отправляться только с отдельного согласия.',
      kk: 'Орталық ашылғаннан кейін пациенттер жазылуды растауды және еске салғыштарды WhatsApp арқылы алып, келуді тікелей чатта ауыстыра немесе болдырмай алады.\n\nЖарнамалық хабарламалар тек бөлек келісіммен жіберіледі.',
      en: 'Once the centre opens, patients will be able to receive booking confirmations and reminders on WhatsApp, and reschedule or cancel a visit in the chat.\n\nMarketing messages will only be sent with separate consent.',
    },
  },
};

export type NewsEntry = NewsItem & { demo: boolean };

/** Applies the honesty corrections and the demo flag to a news item. */
export const editorialNews = (item: NewsItem): NewsEntry => ({
  ...item,
  ...newsCorrections[item.slug],
  demo: !CONFIRMED_NEWS.includes(item.slug),
});
