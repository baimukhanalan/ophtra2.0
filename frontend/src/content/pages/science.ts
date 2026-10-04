import type { Localized } from '@/i18n/types';

/**
 * Science & innovation (spec §7): projects, publications, clinical studies,
 * innovation programmes, collaboration, reports.
 *
 * Honesty rules: only the verified facts of DESIGN.md §5 and §7 — the three
 * 2026 papers, the 24.kz report (AMD quantum-optics device: trials in Hong
 * Kong and Canada, 200 patients, patent; myopia technology at the
 * animal-study stage), his teaching at the Kazakh Research Institute of Eye
 * Diseases, and the planned centre in Astana. Everything else is described as
 * a plan, with no dates, results or partners that have not been confirmed.
 */

export { SOURCE_24KZ, SOURCE_EYEINST } from './science-publications';

export const scienceCopy = {
  seoTitle: { ru: 'Наука и инновации', kk: 'Ғылым және инновациялар', en: 'Science and innovation' },
  seoDescription: {
    ru: 'Квантовая оптика для ранней диагностики ВМД (испытания в Гонконге и Канаде, патент), технология для миопии, публикации 2026 года и сотрудничество.',
    kk: 'ЖМД-ны ерте анықтауға арналған кванттық оптика (Гонконг пен Канададағы сынақтар, патент), миопияға арналған технология, 2026 жылғы жарияланымдар және ынтымақтастық.',
    en: 'Quantum optics for early AMD detection (trials in Hong Kong and Canada, patent), a myopia technology, 2026 publications and collaboration.',
  },
  heroEyebrow: { ru: 'Наука и инновации', kk: 'Ғылым және инновациялар', en: 'Science and innovation' },
  heroTitle: { ru: 'Наука, которая возвращается к пациенту', kk: 'Пациентке қайтып оралатын ғылым', en: 'Science that returns to the patient' },
  heroText: {
    ru: 'Квантовая оптика для ранней диагностики возрастной макулярной дегенерации, технология для миопии и исследования сетчатки. Здесь — только проверенные факты и честный статус каждого проекта, без обещаний.',
    kk: 'Жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған кванттық оптика, миопияға арналған технология және тор қабықты зерттеу. Мұнда — тек тексерілген фактілер және әр жобаның адал мәртебесі, уәдесіз.',
    en: 'Quantum optics for the early detection of age-related macular degeneration, a technology for myopia and research on the retina. Only verified facts and the honest status of each project — no promises.',
  },
  heroPublications: { ru: 'Публикации', kk: 'Жарияланымдар', en: 'Publications' },
  heroCollab: { ru: 'Сотрудничество', kk: 'Ынтымақтастық', en: 'Collaborate' },

  statement: {
    ru: 'Проверять факты. Объяснять сложное. Слышать разные профессиональные позиции. Наука в клинике — это не витрина, а привычка задавать вопросы и публично отвечать на них.',
    kk: 'Фактілерді тексеру. Күрделіні түсіндіру. Түрлі кәсіби көзқарастарды тыңдау. Клиникадағы ғылым — көрме емес, сұрақ қойып, оларға ашық жауап беру әдеті.',
    en: 'Check the facts. Explain the complex. Listen to different professional positions. Science in a clinic is not a showcase but a habit of asking questions and answering them in public.',
  },
  statsEyebrow: { ru: 'В цифрах', kk: 'Сандармен', en: 'In numbers' },
  // Only distinct, checkable figures (UI audit R2: four identical «3» read as filler).
  stats: {
    patients: { ru: 'пациентов обследовано в испытаниях устройства для диагностики ВМД', kk: 'ЖМД диагностикасына арналған құрылғы сынақтарында тексерілген пациент', en: 'patients examined in trials of the AMD detection device' },
    countries: { ru: 'страны испытаний — Гонконг и Канада', kk: 'сынақ елі — Гонконг және Канада', en: 'trial locations — Hong Kong and Canada' },
    publications: { ru: 'рецензируемые публикации 2026 года', kk: '2026 жылғы рецензияланған жарияланым', en: 'peer-reviewed papers in 2026' },
    patent: { ru: 'патент на устройство', kk: 'құрылғыға патент', en: 'patent for the device' },
  },
  source: { ru: 'Источник', kk: 'Дереккөз', en: 'Source' },

  projectsEyebrow: { ru: 'Научные проекты', kk: 'Ғылыми жобалар', en: 'Research projects' },
  projectsTitle: { ru: 'Три проекта доктора Кулмаганбетова', kk: 'Доктор Құлмағанбетовтың үш жобасы', en: "Dr Kulmaganbetov's three projects" },

  publicationsEyebrow: { ru: 'Публикации', kk: 'Жарияланымдар', en: 'Publications' },
  publicationsTitle: { ru: 'Рецензируемые статьи', kk: 'Рецензияланған мақалалар', en: 'Peer-reviewed papers' },
  publicationsText: {
    ru: 'Публикации доктора Кулмаганбетова 2026 года в международных журналах. Полные тексты и списки соавторов — на сайтах издательств.',
    kk: 'Доктор Құлмағанбетовтың 2026 жылғы халықаралық журналдардағы жарияланымдары. Толық мәтіндер мен бірлескен авторлар тізімі — баспалардың сайттарында.',
    en: "Dr Kulmaganbetov's 2026 publications in international journals. Full texts and author lists are on the publishers' websites.",
  },
  openPaper: { ru: 'Открыть статью', kk: 'Мақаланы ашу', en: 'Open the paper' },
  videoEyebrow: { ru: 'В эфире', kk: 'Эфирде', en: 'On air' },
  videoTitle: {
    ru: 'Разработка казахстанца для выявления болезней глаз проходит испытания в Гонконге',
    kk: 'Қазақстандықтың көз ауруларын анықтауға арналған әзірлемесі Гонконгта сынақтан өтуде',
    en: 'A Kazakhstani development for detecting eye disease is being tested in Hong Kong',
  },
  videoCaption: { ru: 'Сюжет телеканала 24KZ', kk: '24KZ телеарнасының сюжеті', en: 'Report by 24KZ television' },
  readArticle: { ru: 'Статья на 24.kz', kk: '24.kz сайтындағы мақала', en: 'Article on 24.kz' },
  openVideo: { ru: 'Открыть на YouTube', kk: 'YouTube-та ашу', en: 'Open on YouTube' },

  studiesEyebrow: { ru: 'Статус проектов', kk: 'Жобалар мәртебесі', en: 'Project status' },
  studiesTitle: { ru: 'Где сейчас каждый проект', kk: 'Әр жоба қазір қай кезеңде', en: 'Where each project stands' },
  studiesText: {
    ru: 'Любое исследование с участием пациентов начинается с одобрения этического комитета и добровольного информированного согласия. Ниже — фактический этап каждого проекта по данным 24.kz.',
    kk: 'Пациенттер қатысатын кез келген зерттеу этикалық комитеттің мақұлдауы мен ерікті ақпараттандырылған келісімнен басталады. Төменде — 24.kz деректері бойынша әр жобаның нақты кезеңі.',
    en: 'Every study involving patients begins with ethics committee approval and voluntary informed consent. Below is the actual stage of each project, as reported by 24.kz.',
  },
  statusLabel: { ru: 'Статус', kk: 'Мәртебесі', en: 'Status' },
  studiesNote: {
    ru: 'Набор участников сейчас не ведётся. Когда программа откроется, условия участия будут опубликованы здесь и в медиацентре.',
    kk: 'Қазір қатысушылар жиналмайды. Бағдарлама ашылғанда, қатысу шарттары осында және медиаорталықта жарияланады.',
    en: 'We are not recruiting participants at present. When a programme opens, the conditions will be published here and in the media centre.',
  },

  innovationEyebrow: { ru: 'Инновационные программы', kk: 'Инновациялық бағдарламалар', en: 'Innovation programmes' },
  innovationTitle: { ru: 'Что центр в Астане планирует развивать', kk: 'Астанадағы орталық нені дамытуды жоспарлайды', en: 'What the Astana centre plans to develop' },

  timelineEyebrow: { ru: 'Хронология', kk: 'Хронология', en: 'Timeline' },
  timelineTitle: { ru: 'Путь исследований', kk: 'Зерттеулер жолы', en: 'The research path' },

  collabEyebrow: { ru: 'Сотрудничество', kk: 'Ынтымақтастық', en: 'Collaboration' },
  collabTitle: { ru: 'Исследуем вместе', kk: 'Бірге зерттейміз', en: "Let's research together" },
  collabText: {
    ru: 'Открыты к совместным проектам с университетами, клиниками, инженерными командами и фондами. Опишите идею — научный отдел ответит в течение пяти рабочих дней.',
    kk: 'Университеттермен, клиникалармен, инженерлік командалармен және қорлармен бірлескен жобаларға ашықпыз. Идеяңызды сипаттаңыз — ғылыми бөлім бес жұмыс күні ішінде жауап береді.',
    en: 'We are open to joint projects with universities, clinics, engineering teams and foundations. Describe your idea and the research office will reply within five working days.',
  },
  collabFormats: {
    ru: ['Совместные исследования и публикации', 'Валидация алгоритмов на обезличенных данных', 'Стажировки исследователей и резидентов', 'Научные семинары и журнальные клубы'],
    kk: ['Бірлескен зерттеулер мен жарияланымдар', 'Иесіздендірілген деректерде алгоритмдерді тексеру', 'Зерттеушілер мен резиденттердің тағылымдамасы', 'Ғылыми семинарлар мен журнал клубтары'],
    en: ['Joint research and publications', 'Algorithm validation on de-identified data', 'Placements for researchers and residents', 'Scientific seminars and journal clubs'],
  },
  collabSubmit: { ru: 'Отправить предложение', kk: 'Ұсыныс жіберу', en: 'Send proposal' },
  collabOrg: { ru: 'Организация', kk: 'Ұйым', en: 'Organisation' },
  collabType: { ru: 'Формат сотрудничества', kk: 'Ынтымақтастық түрі', en: 'Type of collaboration' },
  collabComment: { ru: 'Кратко опишите идею проекта', kk: 'Жоба идеясын қысқаша сипаттаңыз', en: 'Briefly describe the project idea' },

  reportsEyebrow: { ru: 'Научные отчёты', kk: 'Ғылыми есептер', en: 'Research reports' },
  reportsTitle: { ru: 'Открытая отчётность', kk: 'Ашық есептілік', en: 'Open reporting' },
  reportsText: {
    ru: 'После открытия центр планирует раз в год публиковать научный отчёт: проекты, публикации и статус программ — на трёх языках.',
    kk: 'Ашылғаннан кейін орталық жылына бір рет ғылыми есеп жариялауды жоспарлайды: жобалар, жарияланымдар және бағдарламалар мәртебесі — үш тілде.',
    en: 'Once open, the centre plans to publish a yearly research report on projects, papers and programme status — in three languages.',
  },

  ctaTitle: {
    ru: 'Наука начинается с внимательного осмотра',
    kk: 'Ғылым мұқият тексеруден басталады',
    en: 'Science starts with a careful examination',
  },
} as const;

/* ============================================================ DIRECTIONS */

export interface ResearchDirection {
  id: string;
  label: Localized;
  title: Localized;
  text: Localized;
  points: Record<'ru' | 'kk' | 'en', string[]>;
}

export const researchDirections: ResearchDirection[] = [
  {
    id: 'amd-quantum',
    label: { ru: 'ВМД', kk: 'ЖМД', en: 'AMD' },
    title: {
      ru: 'Квантовая оптика для ранней диагностики ВМД',
      kk: 'ЖМД-ны ерте анықтауға арналған кванттық оптика',
      en: 'Quantum optics for early detection of AMD',
    },
    text: {
      ru: 'Доктор Кулмаганбетов разработал устройство для раннего выявления возрастной макулярной дегенерации. Оно использует суперпозицию поляризованного и неполяризованного света, фильтры и линзы. Устройство прошло испытания в клиниках Гонконга и Канады, где обследовали 200 пациентов; на разработку получен патент.',
      kk: 'Доктор Құлмағанбетов жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған құрылғы әзірледі. Ол поляризацияланған және поляризацияланбаған жарықтың суперпозициясын, сүзгілер мен линзаларды пайдаланады. Құрылғы Гонконг пен Канада клиникаларында сынақтан өтті, онда 200 пациент тексерілді; әзірлемеге патент алынды.',
      en: 'Dr Kulmaganbetov developed a device for the early detection of age-related macular degeneration. It uses a superposition of polarised and non-polarised light, with filters and lenses. The device was tested in clinics in Hong Kong and Canada, where 200 patients were examined, and it has been patented.',
    },
    points: {
      ru: ['Испытания в клиниках Гонконга и Канады', '200 обследованных пациентов', 'Патент получен'],
      kk: ['Гонконг пен Канада клиникаларындағы сынақтар', '200 тексерілген пациент', 'Патент алынды'],
      en: ['Trials in clinics in Hong Kong and Canada', '200 patients examined', 'Patent granted'],
    },
  },
  {
    id: 'myopia-quantum',
    label: { ru: 'Миопия', kk: 'Миопия', en: 'Myopia' },
    title: {
      ru: 'Квантовая оптика в диагностике и лечении миопии',
      kk: 'Миопияны анықтау мен емдеудегі кванттық оптика',
      en: 'Quantum optics to diagnose and treat myopia',
    },
    text: {
      ru: 'Следующая разработка — технология на основе квантовой оптики для диагностики и лечения близорукости. Сейчас она на стадии исследований на животных: до применения у пациентов ей предстоит пройти доклинические и клинические этапы.',
      kk: 'Келесі әзірлеме — алыстан көрмеушілікті анықтау мен емдеуге арналған кванттық оптикаға негізделген технология. Қазір ол жануарларға жүргізілетін зерттеулер кезеңінде: пациенттерге қолданылғанға дейін ол клиникаға дейінгі және клиникалық кезеңдерден өтуі тиіс.',
      en: 'The next development is a quantum-optics technology to diagnose and treat short-sightedness. It is currently at the animal-study stage and has preclinical and clinical stages ahead before it can be used in patients.',
    },
    points: {
      ru: ['Стадия исследований на животных', 'Диагностика и лечение близорукости', 'Не применяется у пациентов'],
      kk: ['Жануарларға жүргізілетін зерттеулер кезеңі', 'Алыстан көрмеушілікті анықтау және емдеу', 'Пациенттерге қолданылмайды'],
      en: ['Animal-study stage', 'Diagnosis and treatment of myopia', 'Not used in patients'],
    },
  },
  {
    id: 'retina-light',
    label: { ru: 'Сетчатка', kk: 'Тор қабық', en: 'Retina' },
    title: {
      ru: 'Структурированный свет и сетчатка как часть нервной системы',
      kk: 'Құрылымды жарық және жүйке жүйесінің бөлігі ретіндегі тор қабық',
      en: 'Structured light and the retina as part of the nervous system',
    },
    text: {
      ru: 'Публикации 2026 года: оценка надёжности энтоптических задач со структурированным светом и машинное обучение для анализа ганглиозных клеток сетчатки на модели болезни Альцгеймера. Это фундаментальная работа, а не клинический тест.',
      kk: '2026 жылғы жарияланымдар: құрылымды жарықпен жасалатын энтоптикалық тапсырмалардың сенімділігін бағалау және Альцгеймер ауруы моделінде тор қабықтың ганглиозды жасушаларын машиналық оқыту арқылы талдау. Бұл клиникалық тест емес, іргелі жұмыс.',
      en: "2026 papers: the reliability of structured-light entoptic tasks, and machine learning to analyse retinal ganglion cells in an Alzheimer's disease model. This is fundamental research, not a clinical test.",
    },
    points: {
      ru: ['Scientific Reports, 2026', 'Diagnostics, 2026', 'Фундаментальное исследование'],
      kk: ['Scientific Reports, 2026', 'Diagnostics, 2026', 'Іргелі зерттеу'],
      en: ['Scientific Reports, 2026', 'Diagnostics, 2026', 'Fundamental research'],
    },
  },
];

/* ========================================================== PUBLICATIONS */

// Kept in a tiny module of its own so article pages can cite a paper without
// downloading the whole science page copy.
export { publications, type Publication } from './science-publications';

export const VIDEO_ID = 'YOJAdl__43Q';

/* ======================================================= CLINICAL STUDIES */

export const studyProgrammes: Array<{ id: string; title: Localized; text: Localized; status: Localized }> = [
  {
    id: 'amd-device',
    title: {
      ru: 'Устройство для ранней диагностики ВМД',
      kk: 'ЖМД-ны ерте анықтауға арналған құрылғы',
      en: 'Early AMD detection device',
    },
    text: {
      ru: 'Квантовая оптика: суперпозиция поляризованного и неполяризованного света, фильтры и линзы. Испытания прошли в клиниках Гонконга и Канады; обследовано 200 пациентов.',
      kk: 'Кванттық оптика: поляризацияланған және поляризацияланбаған жарықтың суперпозициясы, сүзгілер мен линзалар. Сынақтар Гонконг пен Канада клиникаларында өтті; 200 пациент тексерілді.',
      en: 'Quantum optics: a superposition of polarised and non-polarised light, with filters and lenses. Tested in clinics in Hong Kong and Canada; 200 patients examined.',
    },
    status: { ru: 'Испытания в клиниках проведены · патент получен', kk: 'Клиникалардағы сынақтар өтті · патент алынды', en: 'Tested in clinics · patent granted' },
  },
  {
    id: 'myopia-tech',
    title: {
      ru: 'Технология диагностики и лечения миопии',
      kk: 'Миопияны анықтау және емдеу технологиясы',
      en: 'Myopia diagnosis and treatment technology',
    },
    text: {
      ru: 'Разработка на основе квантовой оптики. Результаты будут опубликованы по мере прохождения этапов исследования.',
      kk: 'Кванттық оптикаға негізделген әзірлеме. Нәтижелер зерттеу кезеңдері өткен сайын жарияланады.',
      en: 'A quantum-optics development. Results will be published as each research stage is completed.',
    },
    status: { ru: 'Исследования на животных', kk: 'Жануарларға жүргізілетін зерттеулер', en: 'Animal studies' },
  },
  {
    id: 'astana-centre',
    title: {
      ru: 'Офтальмологический центр в Астане',
      kk: 'Астанадағы офтальмологиялық орталық',
      en: 'An ophthalmic centre in Astana',
    },
    text: {
      ru: 'Доктор Кулмаганбетов планирует открыть в Астане центр для клинической работы и инновационных проектов — там разработки смогут перейти в практику после всех разрешений.',
      kk: 'Доктор Құлмағанбетов Астанада клиникалық жұмыс пен инновациялық жобаларға арналған орталық ашуды жоспарлап отыр — барлық рұқсаттардан кейін әзірлемелер сонда тәжірибеге ене алады.',
      en: 'Dr Kulmaganbetov plans to open a centre in Astana for clinical work and innovation projects, where developments can move into practice once all approvals are in place.',
    },
    status: { ru: 'Готовится к открытию', kk: 'Ашылуға дайындалуда', en: 'Preparing to open' },
  },
];

/* =================================================== INNOVATION PROGRAMMES */

export const innovationProgrammes: Array<{ id: string; title: Localized; text: Localized }> = [
  {
    id: 'quantum-diagnostics',
    title: { ru: 'Квантовая оптика в диагностике', kk: 'Диагностикадағы кванттық оптика', en: 'Quantum optics in diagnostics' },
    text: {
      ru: 'Перенос запатентованного устройства для ранней диагностики ВМД из испытаний в клиническую практику — после необходимых регистраций.',
      kk: 'ЖМД-ны ерте анықтауға арналған патенттелген құрылғыны қажетті тіркеулерден кейін сынақтардан клиникалық тәжірибеге көшіру.',
      en: 'Moving the patented early-AMD device from trials into clinical practice, once the required registrations are in place.',
    },
  },
  {
    id: 'digital-diagnostics',
    title: { ru: 'Цифровая диагностика', kk: 'Цифрлық диагностика', en: 'Digital diagnostics' },
    text: {
      ru: 'Цифровые технологии в диагностике болезней глаз — специализация доктора Кулмаганбетова и тема его преподавания.',
      kk: 'Көз ауруларын анықтаудағы цифрлық технологиялар — доктор Құлмағанбетовтың мамандануы және оның сабақ беретін тақырыбы.',
      en: "Digital technologies in diagnosing eye disease — Dr Kulmaganbetov's specialisation and the subject he teaches.",
    },
  },
  {
    id: 'tele',
    title: { ru: 'Телеофтальмология', kk: 'Телеофтальмология', en: 'Tele-ophthalmology' },
    text: {
      ru: 'Онлайн-консультации и второе мнение по снимкам для пациентов из регионов и других стран.',
      kk: 'Өңірлер мен басқа елдердегі пациенттер үшін онлайн-кеңес және суреттер бойынша екінші пікір.',
      en: 'Online consultations and second opinions on imaging for patients in the regions and abroad.',
    },
  },
  {
    id: 'education',
    title: { ru: 'Открытое образование', kk: 'Ашық білім беру', en: 'Open education' },
    text: {
      ru: 'База знаний на трёх языках и Академия для врачей: научные результаты становятся понятными пациентам и коллегам.',
      kk: 'Үш тілдегі білім қоры және дәрігерлерге арналған Академия: ғылыми нәтижелер пациенттер мен әріптестерге түсінікті болады.',
      en: 'A trilingual knowledge base and an Academy for clinicians turn research findings into something patients and colleagues can use.',
    },
  },
];

/* ============================================================== TIMELINE */

export const researchTimeline: Array<{ id: string; when: Localized; title: Localized; text: Localized }> = [
  {
    id: 'phd',
    when: { ru: 'Основа', kk: 'Негіз', en: 'Foundation' },
    title: { ru: 'PhD в области наук о зрении', kk: 'Көру ғылымдары бойынша PhD', en: 'PhD in Vision Sciences' },
    text: {
      ru: 'Доктор Кулмаганбетов — PhD в области наук о зрении, Кардиффский университет (Великобритания).',
      kk: 'Доктор Құлмағанбетов — көру ғылымдары бойынша PhD, Кардифф университеті (Ұлыбритания).',
      en: 'Dr Kulmaganbetov holds a PhD in Vision Sciences from Cardiff University (UK).',
    },
  },
  {
    id: 'teaching',
    when: { ru: '6 лет практики', kk: '6 жыл тәжірибе', en: '6 years of practice' },
    title: { ru: 'Преподавание', kk: 'Оқытушылық', en: 'Teaching' },
    text: {
      ru: 'Преподаватель и методист кафедры постдипломного образования Казахского НИИ глазных болезней; специализация — цифровые технологии в диагностике.',
      kk: 'Қазақ көз аурулары ҒЗИ-ның дипломнан кейінгі білім беру кафедрасының оқытушысы және әдіскері; мамандануы — диагностикадағы цифрлық технологиялар.',
      en: 'Lecturer and methodologist in the Department of Postgraduate Education at the Kazakh Research Institute of Eye Diseases; specialisation — digital diagnostics.',
    },
  },
  {
    id: 'trials',
    when: { ru: 'Гонконг и Канада', kk: 'Гонконг және Канада', en: 'Hong Kong and Canada' },
    title: { ru: 'Испытания устройства и патент', kk: 'Құрылғы сынақтары және патент', en: 'Device trials and patent' },
    text: {
      ru: 'Устройство квантовой оптики для ранней диагностики ВМД испытано в клиниках двух стран, 200 пациентов; получен патент. Сюжет — на телеканале 24KZ.',
      kk: 'ЖМД-ны ерте анықтауға арналған кванттық оптика құрылғысы екі елдің клиникаларында сыналды, 200 пациент; патент алынды. Сюжет — 24KZ телеарнасында.',
      en: 'The quantum-optics device for early AMD detection was tested in clinics in two countries on 200 patients and patented. Reported by 24KZ television.',
    },
  },
  {
    id: 'pubs',
    when: { ru: '2026', kk: '2026', en: '2026' },
    title: { ru: 'Три рецензируемые публикации', kk: 'Үш рецензияланған жарияланым', en: 'Three peer-reviewed papers' },
    text: {
      ru: 'Scientific Reports, Diagnostics и Healthcare — энтоптические тесты, ИИ и нейродегенерация, клиническая эпидемиология.',
      kk: 'Scientific Reports, Diagnostics және Healthcare — энтоптикалық тестер, ЖИ және нейродегенерация, клиникалық эпидемиология.',
      en: 'Scientific Reports, Diagnostics and Healthcare — entoptic tests, AI and neurodegeneration, clinical epidemiology.',
    },
  },
  {
    id: 'astana',
    when: { ru: 'План', kk: 'Жоспар', en: 'Planned' },
    title: { ru: 'Центр в Астане', kk: 'Астанадағы орталық', en: 'A centre in Astana' },
    text: {
      ru: 'Офтальмологический центр для клинической работы и инновационных проектов. Сроки будут объявлены отдельно.',
      kk: 'Клиникалық жұмыс пен инновациялық жобаларға арналған офтальмологиялық орталық. Мерзімдері бөлек жарияланады.',
      en: 'An ophthalmic centre for clinical work and innovation projects. Dates will be announced separately.',
    },
  },
];

/* =============================================================== REPORTS */

export const reports: Array<{ id: string; title: Localized; status: Localized; text: Localized }> = [
  {
    id: 'annual',
    title: { ru: 'Ежегодный научный отчёт', kk: 'Жыл сайынғы ғылыми есеп', en: 'Annual research report' },
    status: { ru: 'Планируется после открытия центра', kk: 'Орталық ашылғаннан кейін жоспарланады', en: 'Planned once the centre opens' },
    text: {
      ru: 'Публикации, статус проектов и планы на следующий год.',
      kk: 'Жарияланымдар, жобалар мәртебесі және келесі жылға жоспарлар.',
      en: "Publications, project status and next year's plans.",
    },
  },
  {
    id: 'policy',
    title: { ru: 'Политика работы с данными в исследованиях', kk: 'Зерттеулердегі деректермен жұмыс саясаты', en: 'Research data policy' },
    status: { ru: 'Готовится к публикации', kk: 'Жариялауға дайындалуда', en: 'Being prepared' },
    text: {
      ru: 'Как обезличиваются данные, получается согласие и хранятся изображения.',
      kk: 'Деректер қалай иесіздендіріледі, келісім қалай алынады және кескіндер қалай сақталады.',
      en: 'How data are de-identified, consent is obtained and images are stored.',
    },
  },
];

export const collabTypes: Array<{ value: string; label: Localized }> = [
  { value: 'research', label: { ru: 'Совместное исследование', kk: 'Бірлескен зерттеу', en: 'Joint research' } },
  { value: 'validation', label: { ru: 'Валидация технологии', kk: 'Технологияны тексеру', en: 'Technology validation' } },
  { value: 'education', label: { ru: 'Образовательный проект', kk: 'Білім беру жобасы', en: 'Educational project' } },
  { value: 'media', label: { ru: 'Экспертный комментарий для СМИ', kk: 'БАҚ үшін сараптамалық пікір', en: 'Expert comment for media' } },
  { value: 'other', label: { ru: 'Другое', kk: 'Басқа', en: 'Other' } },
];

export const researchKeywords: Localized[] = [
  { ru: 'квантовая оптика', kk: 'кванттық оптика', en: 'quantum optics' },
  { ru: 'поляризованный свет', kk: 'поляризацияланған жарық', en: 'polarised light' },
  { ru: 'ВМД', kk: 'ЖМД', en: 'AMD' },
  { ru: 'миопия', kk: 'миопия', en: 'myopia' },
  { ru: 'ОКТ', kk: 'ОКТ', en: 'OCT' },
  { ru: 'машинное обучение', kk: 'машиналық оқыту', en: 'machine learning' },
  { ru: 'структурированный свет', kk: 'құрылымды жарық', en: 'structured light' },
  { ru: 'ганглиозные клетки', kk: 'ганглиозды жасушалар', en: 'ganglion cells' },
  { ru: 'нейродегенерация', kk: 'нейродегенерация', en: 'neurodegeneration' },
  { ru: 'надёжность тестов', kk: 'тест сенімділігі', en: 'test reliability' },
  { ru: 'открытые данные', kk: 'ашық деректер', en: 'open data' },
  { ru: 'этика исследований', kk: 'зерттеу этикасы', en: 'research ethics' },
];
