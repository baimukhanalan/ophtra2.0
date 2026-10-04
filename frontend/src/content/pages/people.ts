/**
 * People pages: about, doctors, doctor profile, management, vacancies, plus
 * the copy shared with the founder / network files (people-founder.ts,
 * people-network.ts), which are split out so each route loads only its copy.
 *
 * All visible copy is trilingual (ru / kk / en).
 */
import type { Localized } from '@/i18n';

const l = (ru: string, kk: string, en: string): Localized => ({ ru, kk, en });

/* ======================================================================
   SHARED
   ====================================================================== */

export const PEOPLE_COMMON = {
  demo: l('Демо-профиль', 'Демо-профиль', 'Demo profile'),
};

/**
 * The doctor records in data/doctors.json are demonstration data (DESIGN.md
 * §5). While this is true every doctor card, profile and leadership entry
 * carries a discreet «Демо-профиль» label. Set to false once the clinic
 * supplies verified profiles.
 */
export const DOCTORS_ARE_DEMO = true;

export const DEMO_NOTE = {
  doctors: l(
    'Профили врачей на сайте пока демонстрационные: имена, описания и стаж показывают, как устроены страницы, и будут заменены данными клиники. Портреты появятся после фотосъёмки.',
    'Сайттағы дәрігерлер профильдері әзірге демонстрациялық: аттар, сипаттамалар мен өтіл беттердің құрылымын көрсетеді және клиника деректерімен ауыстырылады. Портреттер фотосессиядан кейін пайда болады.',
    'Doctor profiles on the site are demonstrations for now: names, descriptions and experience show how the pages work and will be replaced with the clinic’s data. Portraits will follow the photo shoot.',
  ),
  profile: l(
    'Демонстрационный профиль: данные врача будут заменены сведениями клиники.',
    'Демонстрациялық профиль: дәрігер деректері клиника мәліметтерімен ауыстырылады.',
    'Demonstration profile: the doctor’s details will be replaced with the clinic’s records.',
  ),
  reviews: l(
    'Отзывы в демо-режиме показывают формат раздела.',
    'Демо-режимдегі пікірлер бөлімнің форматын көрсетеді.',
    'Reviews in demo mode show the format of this section.',
  ),
};

/** Public sources for every founder fact (DESIGN.md §7). */
export const FOUNDER_SOURCES = {
  article24kz:
    'https://24.kz/ru/news/in-the-world/788733-razrabotka-kazakhstantsa-dlya-vyyavleniya-boleznej-glaz-prokhodit-ispytaniya-v-gonkonge',
  eyeinst: 'https://eyeinst.kz/catalog/kulmaganbetov-muhit-askarovich-2882/',
  threads: 'https://www.threads.com/@mukhit_kulmaganbetov',
};

/** Founder facts reused outside the founder page (DESIGN.md §5, §7 only). */
export const FOUNDER_BRIEF = {
  name: l('Мухит Кулмаганбетов', 'Мұхит Құлмағанбетов', 'Mukhit Kulmaganbetov'),
  nameLatin: 'Mukhit Kulmaganbetov',
  fullTitle: l('Доктор Мухит Кулмаганбетов', 'Доктор Мұхит Құлмағанбетов', 'Dr Mukhit Kulmaganbetov'),
  monogram: 'MK',
  credentials: ['MD', 'PhD', 'AFHEA'],
};

/* ======================================================================
   ABOUT — /about  (Figma «02 О центре»)
   ====================================================================== */

export const ABOUT = {
  eyebrow: l('О центре', 'Орталық туралы', 'About the centre'),
  lead: l(
    'Новый офтальмологический центр в Астане — для клинической работы и инновационных проектов. Он вырастает из исследований доктора Мухита Кулмаганбетова в области квантовой оптики и цифровой диагностики.',
    'Астанадағы жаңа офтальмологиялық орталық — клиникалық жұмыс пен инновациялық жобаларға арналған. Ол доктор Мұхит Құлмағанбетовтың кванттық оптика және цифрлық диагностика саласындағы зерттеулерінен өсіп шығады.',
    'A new ophthalmic centre in Astana for clinical work and innovation projects, growing out of Dr Mukhit Kulmaganbetov’s research in quantum optics and digital diagnosis.',
  ),
  seoDescription: l(
    'Новый офтальмологический центр в Астане: клиническая работа и инновации на основе исследований доктора Кулмаганбетова. Ценности, путь, направления и команда.',
    'Астанадағы жаңа офтальмологиялық орталық: доктор Құлмағанбетов зерттеулеріне негізделген клиникалық жұмыс пен инновациялар. Құндылықтар, жол, бағыттар және команда.',
    'A new ophthalmic centre in Astana: clinical work and innovation built on Dr Kulmaganbetov’s research. Values, story, areas of care and the team.',
  ),
  photoAlt: l(
    'Фасад офтальмологического центра доктора Кулмаганбетова',
    'Доктор Құлмағанбетов офтальмологиялық орталығының қасбеті',
    'Façade of Dr Kulmaganbetov’s ophthalmic centre',
  ),
  metricsLabel: l('Наука, из которой вырастает центр', 'Орталық өсіп шығатын ғылым', 'The science the centre grows from'),
  metricsNote: l(
    'Цифры относятся к работе основателя и подтверждены открытыми источниками: 24.kz, профиль на eyeinst.kz и сами публикации.',
    'Сандар негізін қалаушының жұмысына қатысты және ашық дереккөздермен расталған: 24.kz, eyeinst.kz профилі және жарияланымдардың өзі.',
    'The figures describe the founder’s work and are confirmed by public sources: 24.kz, the eyeinst.kz profile and the papers themselves.',
  ),
  facts: [
    { id: 'patients', value: 200, suffix: '', label: l('пациентов обследовано в испытаниях устройства', 'құрылғы сынақтарында тексерілген пациент', 'patients examined in tests of the device') },
    { id: 'countries', value: 2, suffix: '', label: l('страны испытаний — Гонконг и Канада', 'сынақ елі — Гонконг пен Канада', 'countries of testing: Hong Kong and Canada') },
    { id: 'papers', value: 3, suffix: '', label: l('научные статьи 2026 года', '2026 жылғы ғылыми мақала', 'scientific papers in 2026') },
    { id: 'years', value: 6, suffix: '', label: l('лет профессионального опыта основателя', 'негізін қалаушының кәсіби тәжірибесі, жыл', 'years of the founder’s professional experience') },
  ],
  excellenceEyebrow: l('Центры передового опыта', 'Озық тәжірибе орталықтары', 'Centres of excellence'),
  excellenceTitle: l('Пять направлений, вокруг которых строится центр', 'Орталық құрылатын бес бағыт', 'Five areas the centre is built around'),
  excellenceText: l(
    'Короткий указатель. Подробно о каждом направлении — на отдельных страницах.',
    'Қысқа көрсеткіш. Әр бағыт туралы толығырақ — жеке беттерде.',
    'A short index. Each area has its own page.',
  ),
  open: l('Подробнее', 'Толығырақ', 'Learn more'),
  excellence: [
    {
      id: 'prevention',
      title: l('Центр профилактики нарушений зрения', 'Көру бұзылыстарының алдын алу орталығы', 'Centre for the prevention of visual impairment'),
      text: l(
        'Скрининг и регулярные осмотры, чтобы глаукому, болезни сетчатки и миопию находили до потери зрения.',
        'Глаукома, тор қабық аурулары және миопия көру жоғалғанға дейін табылуы үшін скрининг және тұрақты тексерулер.',
        'Screening and regular check-ups so glaucoma, retinal disease and myopia are found before sight is lost.',
      ),
      to: '/diagnostics',
    },
    {
      id: 'surgery',
      title: l('Передовая офтальмологическая хирургия', 'Озық офтальмологиялық хирургия', 'Advanced ophthalmic surgery'),
      text: l(
        'Катаракта, лазерная коррекция и микрохирургия на современных платформах — с понятным планом до и после операции.',
        'Катаракта, лазерлік түзету және заманауи платформалардағы микрохирургия — операцияға дейін және кейін түсінікті жоспармен.',
        'Cataract, laser correction and microsurgery on modern platforms — with a clear plan before and after surgery.',
      ),
      to: '/cataract-surgery',
    },
    {
      id: 'retina',
      title: l('Центр заболеваний сетчатки и макулы', 'Тор қабық және макула аурулары орталығы', 'Retina and macula centre'),
      text: l(
        'Диагностика и лечение диабетической ретинопатии, макулярной дегенерации и сосудистых болезней глаза.',
        'Диабеттік ретинопатияны, макулалық дегенерацияны және көздің тамыр ауруларын диагностикалау және емдеу.',
        'Diagnosis and treatment of diabetic retinopathy, macular degeneration and vascular eye disease.',
      ),
      to: '/treatment',
    },
    {
      id: 'pediatric',
      title: l('Центр детской офтальмологии', 'Балалар офтальмологиясы орталығы', 'Paediatric ophthalmology centre'),
      text: l(
        'Контроль близорукости, косоглазие и амблиопия — с врачами, которые умеют работать с детьми.',
        'Жақыннан көрудің бақылауы, қылилық және амблиопия — балалармен жұмыс істей алатын дәрігерлермен.',
        'Myopia control, strabismus and amblyopia — with doctors who know how to work with children.',
      ),
      to: '/pediatric-ophthalmology',
    },
    {
      id: 'lab',
      title: l('Лаборатория науки и инноваций', 'Ғылым және инновациялар зертханасы', 'Science and innovation lab'),
      text: l(
        'Исследования в области наук о зрении и ИИ и открытые публикации.',
        'Көру ғылымдары мен ЖИ саласындағы зерттеулер және ашық жарияланымдар.',
        'Research in vision science and AI, and open publications.',
      ),
      to: '/science',
    },
  ],
  equipmentEyebrow: l('Оборудование', 'Жабдық', 'Equipment'),
  equipmentTitle: l('Технологии, на которые рассчитан центр', 'Орталық есептелген технологиялар', 'The technology the centre is designed around'),
  equipmentText: l(
    'Шесть типов приборов для диагностики и хирургии. Для каждого — одна строка о том, что он даёт пациенту.',
    'Диагностика мен хирургияға арналған алты құрал түрі. Әрқайсысы үшін — пациентке не беретіні туралы бір жол.',
    'Six kinds of instrument for diagnosis and surgery, each with one line on what it gives the patient.',
  ),
  equipment: [
    {
      id: 'oct',
      name: l('ОКТ-томограф', 'ОКТ-томограф', 'OCT scanner'),
      text: l('Послойное изображение сетчатки и зрительного нерва — основа ранней диагностики.', 'Тор қабық пен көру жүйкесінің қабатты кескіні — ерте диагностиканың негізі.', 'Layer-by-layer images of the retina and optic nerve, the basis of early diagnosis.'),
    },
    {
      id: 'perimeter',
      name: l('Компьютерный периметр', 'Компьютерлік периметр', 'Computerised perimeter'),
      text: l('Карта поля зрения — ключевое исследование при глаукоме.', 'Көру өрісінің картасы — глаукома кезіндегі негізгі зерттеу.', 'A map of the visual field, the key test in glaucoma.'),
    },
    {
      id: 'topograph',
      name: l('Кератотопограф', 'Кератотопограф', 'Corneal topographer'),
      text: l('Карта поверхности роговицы перед лазерной коррекцией и подбором линз.', 'Лазерлік түзету мен линза таңдау алдында қасаң қабық бетінің картасы.', 'A map of the corneal surface before laser correction or lens fitting.'),
    },
    {
      id: 'phaco',
      name: l('Факоэмульсификатор', 'Факоэмульсификатор', 'Phacoemulsification system'),
      text: l('Удаление помутневшего хрусталика через небольшой разрез.', 'Бұлдырлаған көз бұршағын шағын тіліктен алу.', 'Removes a clouded lens through a small incision.'),
    },
    {
      id: 'femto',
      name: l('Фемтосекундный лазер', 'Фемтосекундтық лазер', 'Femtosecond laser'),
      text: l('Точные этапы рефракционной и катарактальной хирургии.', 'Рефракциялық және катаракта хирургиясының дәл кезеңдері.', 'Precise steps in refractive and cataract surgery.'),
    },
    {
      id: 'yag',
      name: l('YAG-лазер', 'YAG-лазер', 'YAG laser'),
      text: l('Амбулаторные лазерные процедуры, например при вторичной катаракте.', 'Амбулаториялық лазерлік процедуралар, мысалы, қайталама катаракта кезінде.', 'Outpatient laser procedures, for example for secondary cataract.'),
    },
  ],
  teamEyebrow: l('Люди центра', 'Орталық адамдары', 'People of the centre'),
  teamTitle: l('С кем вы встретитесь', 'Кіммен кездесесіз', 'Who you will meet'),
  team: [
    {
      id: 'founder',
      title: l('Основатель', 'Негізін қалаушы', 'Founder'),
      text: l(
        'Доктор Мухит Кулмаганбетов — MD, PhD (Cardiff University), AFHEA. Устройство для раннего выявления ВМД, испытания в Гонконге и Канаде, публикации.',
        'Доктор Мұхит Құлмағанбетов — MD, PhD (Cardiff University), AFHEA. ЖМД-ны ерте анықтау құрылғысы, Гонконг пен Канададағы сынақтар, жарияланымдар.',
        'Dr Mukhit Kulmaganbetov — MD, PhD (Cardiff University), AFHEA. A device for early AMD detection, testing in Hong Kong and Canada, publications.',
      ),
      to: '/dr-kulmaganbetov',
    },
    {
      id: 'management',
      title: l('Руководство', 'Басшылық', 'Leadership'),
      text: l('Кто отвечает за протоколы, качество и обучение.', 'Хаттамаларға, сапаға және оқытуға кім жауап береді.', 'Who is accountable for protocols, quality and training.'),
      to: '/management',
    },
    {
      id: 'doctors',
      title: l('Врачи', 'Дәрігерлер', 'Doctors'),
      text: l('Поиск по отделению и клинике, запись к конкретному врачу.', 'Бөлімше мен клиника бойынша іздеу, нақты дәрігерге жазылу.', 'Search by department and clinic, book a specific doctor.'),
      to: '/doctors',
    },
    {
      id: 'experts',
      title: l('Международная сеть', 'Халықаралық желі', 'International network'),
      text: l('Как устроены второе мнение и телеконсилиум с зарубежными субспециалистами.', 'Шетелдік субмамандармен екінші пікір мен теле-консилиум қалай құрылған.', 'How second opinions and tele-boards with subspecialists abroad work.'),
      to: '/global-experts',
    },
    {
      id: 'science',
      title: l('Наука', 'Ғылым', 'Science'),
      text: l('Исследования, публикации и открытая база знаний.', 'Зерттеулер, жарияланымдар және ашық білім қоры.', 'Research, publications and an open knowledge base.'),
      to: '/science',
    },
    {
      id: 'vacancies',
      title: l('Карьера', 'Мансап', 'Careers'),
      text: l('Открытые вакансии и открытая заявка с резюме.', 'Ашық бос орындар және түйіндемемен ашық өтінім.', 'Open positions and an open application with your CV.'),
      to: '/vacancies',
    },
  ],
  values: [
    {
      id: 'evidence',
      title: l('Доказательность', 'Дәлелділік', 'Evidence first'),
      text: l(
        'Решения опираются на опубликованные данные и клинические рекомендации, а не на моду или маркетинг.',
        'Шешімдер сән мен маркетингке емес, жарияланған деректер мен клиникалық ұсынымдарға сүйенеді.',
        'Decisions rest on published evidence and clinical guidelines, not on fashion or marketing.',
      ),
    },
    {
      id: 'early',
      title: l('Раньше, чем появятся симптомы', 'Белгілер пайда болғанға дейін', 'Before symptoms appear'),
      text: l(
        'Главная задача — найти болезнь, пока зрение ещё можно сохранить. Отсюда интерес центра к новым методам ранней диагностики.',
        'Басты міндет — көруді әлі сақтауға болатын кезде ауруды табу. Орталықтың ерте диагностиканың жаңа әдістеріне қызығушылығы осыдан.',
        'The main task is to find disease while sight can still be saved, which is why the centre invests in new methods of early diagnosis.',
      ),
    },
    {
      id: 'clear',
      title: l('Понятность', 'Түсініктілік', 'Clarity'),
      text: l(
        'Пациент понимает, что с ним происходит и зачем нужен каждый шаг обследования и лечения.',
        'Пациент өзімен не болып жатқанын және тексеру мен емдеудің әр қадамы не үшін қажет екенін түсінеді.',
        'Patients understand what is happening and why each step of examination and treatment is needed.',
      ),
    },
    {
      id: 'science',
      title: l('Наука рядом с клиникой', 'Клиника жанындағы ғылым', 'Science next to the clinic'),
      text: l(
        'Инновационные проекты и клиническая работа идут рядом: разработки проверяются так же строго, как лечение.',
        'Инновациялық жобалар мен клиникалық жұмыс қатар жүреді: әзірлемелер емдеу сияқты қатаң тексеріледі.',
        'Innovation projects run next to clinical work, and new developments are tested as strictly as treatment.',
      ),
    },
  ],
  valuesEyebrow: l('Ценности', 'Құндылықтар', 'Values'),
  valuesTitle: l('На чём держится работа центра', 'Орталық жұмысы неге сүйенеді', 'What the centre’s work rests on'),
  historyEyebrow: l('Как появился центр', 'Орталық қалай пайда болды', 'How the centre began'),
  historyTitle: l('От исследования — к центру в Астане', 'Зерттеуден — Астанадағы орталыққа', 'From research to a centre in Astana'),
  history: [
    {
      id: 'science',
      step: l('Наука', 'Ғылым', 'Science'),
      title: l('Образование и преподавание', 'Білім және оқыту', 'Training and teaching'),
      text: l(
        'PhD в науках о зрении в Кардиффском университете, статус AFHEA, преподавание в Казахском НИИ глазных болезней.',
        'Кардифф университетінде көру ғылымдары бойынша PhD, AFHEA мәртебесі, Қазақ көз аурулары ҒЗИ-да оқыту.',
        'A PhD in Vision Sciences at Cardiff University, AFHEA status and teaching at the Kazakh Research Institute of Eye Diseases.',
      ),
    },
    {
      id: 'device',
      step: l('Разработка', 'Әзірлеме', 'Development'),
      title: l('Устройство на основе квантовой оптики', 'Кванттық оптика негізіндегі құрылғы', 'A quantum-optics device'),
      text: l(
        'Для раннего выявления возрастной макулярной дегенерации. На разработку получен патент.',
        'Жасқа байланысты макулалық дегенерацияны ерте анықтау үшін. Әзірлемеге патент алынды.',
        'For the early detection of age-related macular degeneration. The development has been patented.',
      ),
    },
    {
      id: 'trials',
      step: l('Испытания', 'Сынақтар', 'Testing'),
      title: l('Клиники Гонконга и Канады', 'Гонконг пен Канада клиникалары', 'Clinics in Hong Kong and Canada'),
      text: l(
        'Обследовано 200 пациентов; работа вызвала интерес специалистов из нескольких стран (по данным 24.kz).',
        '200 пациент тексерілді; жұмыс бірнеше ел мамандарының қызығушылығын тудырды (24.kz деректері бойынша).',
        '200 patients examined; the work drew interest from specialists in several countries (per 24.kz).',
      ),
    },
    {
      id: 'centre',
      step: l('Центр', 'Орталық', 'The centre'),
      title: l('Офтальмологический центр в Астане', 'Астанадағы офтальмологиялық орталық', 'An ophthalmic centre in Astana'),
      text: l(
        'Для клинической работы и инновационных проектов. Центр готовится к открытию.',
        'Клиникалық жұмыс пен инновациялық жобаларға арналған. Орталық ашылуға дайындалуда.',
        'For clinical work and innovation projects. The centre is preparing to open.',
      ),
    },
  ],
  founderLink: l('Познакомиться с подходом', 'Тәсілмен танысу', 'Discover the approach'),
  clinicsEyebrow: l('Где', 'Қайда', 'Where'),
  clinicsTitle: l('Центр в Астане', 'Астанадағы орталық', 'The centre in Astana'),
  clinicsText: l(
    'Центр готовится к открытию. Адрес, часы работы и телефоны публикуются на странице контактов и уточняются по мере открытия.',
    'Орталық ашылуға дайындалуда. Мекенжай, жұмыс уақыты мен телефондар байланыс бетінде жарияланады және ашылу барысында нақтыланады.',
    'The centre is preparing to open. The address, hours and phone numbers are published on the contacts page and updated as the opening approaches.',
  ),
  clinicsLink: l('Контакты и как добраться', 'Байланыс және қалай жетуге болады', 'Contacts and directions'),
};

/* ======================================================================
   DOCTORS — /doctors  (Figma «03 Врачи»)
   ====================================================================== */

export const DOCTORS = {
  lead: l(
    'Врачи и хирурги центра: поиск по отделению и клинике, стаж, языки и запись к конкретному специалисту.',
    'Орталықтың дәрігерлері мен хирургтары: бөлімше мен клиника бойынша іздеу, өтіл, тілдер және нақты маманға жазылу.',
    'The centre’s doctors and surgeons: search by department and clinic, see experience and languages, and book a specific specialist.',
  ),
  searchPlaceholder: l('Имя врача или специализация', 'Дәрігердің аты немесе мамандығы', 'Doctor’s name or specialty'),
  filtersLabel: l('Фильтры врачей', 'Дәрігерлер сүзгілері', 'Doctor filters'),
  countLabel: l('Врачей', 'Дәрігерлер', 'Doctors'),
  seoDescription: l(
    'Офтальмологи и хирурги центра доктора Кулмаганбетова: поиск по отделению и клинике, стаж, языки и онлайн-запись к врачу.',
    'Доктор Құлмағанбетов орталығының офтальмологтары мен хирургтары: бөлімше мен клиника бойынша іздеу, өтіл, тілдер және дәрігерге онлайн жазылу.',
    'Ophthalmologists and surgeons at Dr Kulmaganbetov’s centre: search by department and clinic, experience, languages and online booking.',
  ),
  profile: l('Профиль врача', 'Дәрігер профилі', 'Doctor profile'),
};

/* ======================================================================
   DOCTOR PROFILE — /doctors/:slug  (Figma «04 Профиль врача»)
   ====================================================================== */

export const DOCTOR = {
  languages: l('Языки', 'Тілдер', 'Languages'),
  clinics: l('Клиники', 'Клиникалар', 'Clinics'),
  education: l('Образование', 'Білімі', 'Education'),
  profileEyebrow: l('Профиль', 'Профиль', 'Profile'),
  profileTitle: l('Опыт и специализация', 'Тәжірибе және мамандану', 'Experience and specialty'),
  servicesEyebrow: l('Услуги врача', 'Дәрігер қызметтері', 'Services'),
  noServices: l(
    'Запись к врачу — через контакт-центр: координатор подберёт нужную услугу.',
    'Дәрігерге жазылу — байланыс орталығы арқылы: үйлестіруші қажетті қызметті таңдайды.',
    'Book this doctor through the contact centre: a coordinator will pick the right service.',
  ),
  reviewsEyebrow: l('Отзывы', 'Пікірлер', 'Reviews'),
  reviewsTitle: l('Что говорят пациенты', 'Пациенттер не дейді', 'What patients say'),
  noReviews: l('Отзывов об этом враче пока нет.', 'Бұл дәрігер туралы әзірге пікір жоқ.', 'There are no reviews for this doctor yet.'),
  articlesEyebrow: l('Материалы автора', 'Автордың материалдары', 'Articles by the author'),
  articlesTitle: l('Врач объясняет', 'Дәрігер түсіндіреді', 'The doctor explains'),
  authorPage: l('Все материалы автора', 'Автордың барлық материалдары', 'All articles by this author'),
  readMin: l('мин чтения', 'мин оқу', 'min read'),
  onlineOnly: l('Запись через контакт-центр', 'Байланыс орталығы арқылы жазылу', 'Book via the contact centre'),
  otherDoctors: l('Другие врачи отделения', 'Бөлімшенің басқа дәрігерлері', 'Other doctors in the department'),
};

/* ======================================================================
   MANAGEMENT — /management
   ====================================================================== */

export const MANAGEMENT = {
  eyebrow: l('О центре', 'Орталық туралы', 'About the centre'),
  lead: l(
    'Люди, которые отвечают за качество помощи, клинические протоколы и развитие центра.',
    'Көмек сапасына, клиникалық хаттамаларға және орталықтың дамуына жауап беретін адамдар.',
    'The people responsible for quality of care, clinical protocols and the centre’s development.',
  ),
  statement: l(
    'Руководство центра — прежде всего практикующие врачи. Решения о протоколах, оборудовании и обучении принимают те, кто сам ведёт пациентов.',
    'Орталық басшылығы — ең алдымен практик дәрігерлер. Хаттамалар, жабдық және оқыту туралы шешімдерді пациенттерді өзі жүргізетіндер қабылдайды.',
    'The centre is led first of all by practising doctors. Decisions on protocols, equipment and training are made by people who treat patients themselves.',
  ),
  teamEyebrow: l('Команда руководства', 'Басшылық командасы', 'Leadership team'),
  teamTitle: l('Кто отвечает за решения', 'Шешімдерге кім жауап береді', 'Who is accountable'),
  founderEyebrow: l('Основатель', 'Негізін қалаушы', 'Founder'),
  founderText: l(
    'Центр носит имя своего основателя — офтальмолога и исследователя в области наук о зрении: MD в офтальмологии, PhD Кардиффского университета, AFHEA.',
    'Орталық өзінің негізін қалаушының — офтальмолог және көру ғылымдары саласындағы зерттеушінің атымен аталады: офтальмология бойынша MD, Кардифф университетінің PhD дәрежесі, AFHEA.',
    'The centre bears the name of its founder, an ophthalmologist and vision scientist: MD in Ophthalmology, PhD from Cardiff University, AFHEA.',
  ),
  governanceEyebrow: l('Управление качеством', 'Сапаны басқару', 'Clinical governance'),
  governanceTitle: l('Как принимаются решения', 'Шешімдер қалай қабылданады', 'How decisions are made'),
  governance: [
    {
      title: l('Медицинский совет', 'Медициналық кеңес', 'Medical council'),
      text: l('Утверждает клинические протоколы и пересматривает их не реже раза в год.', 'Клиникалық хаттамаларды бекітеді және оларды жылына кемінде бір рет қайта қарайды.', 'Approves clinical protocols and reviews them at least once a year.'),
    },
    {
      title: l('Контроль качества', 'Сапаны бақылау', 'Quality control'),
      text: l('Разбор результатов лечения и осложнений, внутренний аудит и обратная связь пациентов.', 'Емдеу нәтижелері мен асқынуларды талдау, ішкі аудит және пациенттердің кері байланысы.', 'Outcome and complication review, internal audit and patient feedback.'),
    },
    {
      title: l('Этика и права пациента', 'Этика және пациент құқықтары', 'Ethics and patient rights'),
      text: l('Информированное согласие, защита данных и право на второе мнение.', 'Ақпараттандырылған келісім, деректерді қорғау және екінші пікірге құқық.', 'Informed consent, data protection and the right to a second opinion.'),
    },
    {
      title: l('Обучение и наука', 'Оқыту және ғылым', 'Training and research'),
      text: l('План обучения врачей, исследовательские проекты и международный обмен.', 'Дәрігерлерді оқыту жоспары, зерттеу жобалары және халықаралық алмасу.', 'A training plan for doctors, research projects and international exchange.'),
    },
  ],
  profile: l('Профиль врача', 'Дәрігер профилі', 'Doctor profile'),
};

/* ======================================================================
   VACANCIES — /vacancies
   ====================================================================== */

export const VACANCIES = {
  eyebrow: l('Карьера', 'Мансап', 'Careers'),
  lead: l(
    'Новый центр в Астане собирает команду: врачей, медсестёр и координаторов, которым важно делать медицину точной и понятной.',
    'Астанадағы жаңа орталық команда жинап жатыр: медицинаны дәл әрі түсінікті етуді маңызды деп санайтын дәрігерлер, мейірбикелер және үйлестірушілер.',
    'The new centre in Astana is building its team: doctors, nurses and coordinators who care about making medicine precise and clear.',
  ),
  toOpenings: l('Открытые вакансии', 'Ашық бос орындар', 'Open positions'),
  whyEyebrow: l('Почему у нас', 'Неге бізде', 'Why join us'),
  whyTitle: l('Среда, в которой врач растёт', 'Дәрігер өсетін орта', 'An environment where doctors grow'),
  why: [
    {
      title: l('Обучение', 'Оқыту', 'Training'),
      text: l('Наставник на время адаптации, разборы случаев и цифровые технологии диагностики — специализация основателя.', 'Бейімделу кезеңіне тәлімгер, жағдайларды талдау және диагностиканың цифрлық технологиялары — негізін қалаушының мамандануы.', 'A mentor during onboarding, case reviews and digital diagnostics, the founder’s specialism.'),
    },
    {
      title: l('Наука', 'Ғылым', 'Research'),
      text: l('Инновационные проекты рядом с клиникой: квантовая оптика, ранняя диагностика ВМД и миопии.', 'Клиника жанындағы инновациялық жобалар: кванттық оптика, ЖМД мен миопияны ерте диагностикалау.', 'Innovation projects next to the clinic: quantum optics and early diagnosis of AMD and myopia.'),
    },
    {
      title: l('Новый центр', 'Жаңа орталық', 'A new centre'),
      text: l('Возможность выстроить процессы и стандарты с нуля — вместе с командой, которая только собирается.', 'Процестер мен стандарттарды нөлден бастап құру мүмкіндігі — енді ғана жиналып жатқан командамен бірге.', 'A chance to build processes and standards from scratch with a team that is just forming.'),
    },
    {
      title: l('Международный обмен', 'Халықаралық алмасу', 'International exchange'),
      text: l('Разборы сложных случаев с зарубежными коллегами по мере развития международной сети.', 'Халықаралық желі дамыған сайын шетелдік әріптестермен күрделі жағдайларды талдау.', 'Complex-case reviews with colleagues abroad as the international network grows.'),
    },
  ],
  openingsEyebrow: l('Вакансии', 'Бос орындар', 'Openings'),
  requirements: l('Требования', 'Талаптар', 'Requirements'),
  offer: l('Мы предлагаем', 'Біз ұсынамыз', 'We offer'),
  apply: l('Откликнуться', 'Өтініш беру', 'Apply'),
  processEyebrow: l('Как проходит отбор', 'Іріктеу қалай өтеді', 'How hiring works'),
  processTitle: l('Четыре шага до первого рабочего дня', 'Алғашқы жұмыс күніне дейінгі төрт қадам', 'Four steps to your first day'),
  process: [
    {
      title: l('Отклик', 'Өтініш', 'Application'),
      text: l('Резюме и пара слов о том, чем вам интересен центр.', 'Түйіндеме және орталықтың сізге несімен қызық екені туралы бірер сөз.', 'Your CV and a few words on why the centre interests you.'),
    },
    {
      title: l('Знакомство', 'Танысу', 'Introduction'),
      text: l('Короткий звонок с HR и руководителем отделения.', 'HR және бөлімше басшысымен қысқа қоңырау.', 'A short call with HR and the head of department.'),
    },
    {
      title: l('Профессиональное интервью', 'Кәсіби сұхбат', 'Professional interview'),
      text: l('Разбор клинических случаев и знакомство с командой.', 'Клиникалық жағдайларды талдау және командамен танысу.', 'Case discussion and meeting the team.'),
    },
    {
      title: l('Адаптация', 'Бейімделу', 'Onboarding'),
      text: l('Первые месяцы — с наставником и понятным планом.', 'Алғашқы айлар — тәлімгермен және түсінікті жоспармен.', 'The first months with a mentor and a clear plan.'),
    },
  ],
  formEyebrow: l('Открытая заявка', 'Ашық өтінім', 'Open application'),
  formTitle: l('Не нашли подходящую вакансию?', 'Қолайлы бос орын таппадыңыз ба?', 'No matching opening?'),
  formText: l(
    'Отправьте резюме — мы свяжемся, когда появится позиция по вашему профилю.',
    'Түйіндемеңізді жіберіңіз — сіздің бейініңізге сай орын ашылғанда хабарласамыз.',
    'Send your CV — we will get in touch when a matching position opens.',
  ),
  fieldPosition: l('Желаемая позиция', 'Қалаған лауазым', 'Desired position'),
  commentLabel: l('О себе', 'Өзіңіз туралы', 'About you'),
  filesLabel: l('Резюме', 'Түйіндеме', 'CV'),
  filesHint: l(
    'PDF, до 10 МБ. Можно приложить дипломы и сертификаты (PDF, JPG или PNG), не более 10 файлов.',
    'PDF, 10 МБ-қа дейін. Дипломдар мен сертификаттарды да тіркеуге болады (PDF, JPG немесе PNG), 10 файлдан аспайды.',
    'PDF, up to 10 MB. You can add diplomas and certificates too (PDF, JPG or PNG), up to 10 files.',
  ),
  applyFor: l('Откликнуться через форму', 'Форма арқылы өтініш беру', 'Apply with the form'),
  submit: l('Отправить резюме', 'Түйіндеме жіберу', 'Send CV'),
  emptyTitle: l('Сейчас открытых вакансий нет', 'Қазір ашық бос орындар жоқ', 'No open positions right now'),
  emptyText: l(
    'Оставьте открытую заявку ниже — мы сохраним резюме и напишем первыми.',
    'Төменде ашық өтінім қалдырыңыз — түйіндемені сақтап, бірінші болып жазамыз.',
    'Leave an open application below — we will keep your CV and write to you first.',
  ),
};
