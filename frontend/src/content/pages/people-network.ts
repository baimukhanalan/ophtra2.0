/**
 * Global expert network (/global-experts) and partnerships (/partnerships).
 * Split from people.ts so these routes load only their own copy.
 *
 * No real roster or partner list was supplied: the network is described as a
 * model and every profile is labelled as a demonstration.
 */
import type { Localized } from '@/i18n';

const l = (ru: string, kk: string, en: string): Localized => ({ ru, kk, en });
/* ======================================================================
   GLOBAL EXPERT NETWORK — /global-experts
   ====================================================================== */

export type NetworkFormat = 'advisory' | 'visiting' | 'tele' | 'research';
export type RegionId = 'central-asia' | 'europe' | 'asia-pacific' | 'americas';

export const EXPERTS = {
  seoDescription: l(
    'Международная сеть офтальмологов: научный совет, приглашённые хирурги, телеконсультации и исследовательские партнёры центра.',
    'Халықаралық офтальмологтар желісі: ғылыми кеңес, шақырылған хирургтар, телекеңестер және орталықтың зерттеу серіктестері.',
    'An international ophthalmology network: advisory board, visiting surgeons, tele-consultations and research partners.',
  ),
  eyebrow: l('Центр международного уровня', 'Халықаралық деңгейдегі орталық', 'An international-level centre'),
  lead: l(
    'Сложный случай заслуживает нескольких взглядов. Центр формирует сеть субспециалистов из разных стран, которые смогут подключаться к работе — от разбора снимков до совместных операций.',
    'Күрделі жағдай бірнеше көзқарасқа лайық. Орталық жұмысқа — суреттерді талдаудан бірлескен операцияларға дейін — қосыла алатын әр елдің субмамандары желісін қалыптастыруда.',
    'A complex case deserves more than one view. The centre is building a network of subspecialists from several countries who can join its work — from reviewing scans to operating together.',
  ),
  join: l('Присоединиться к сети', 'Желіге қосылу', 'Join the network'),

  modelEyebrow: l('Модель сети', 'Желі моделі', 'How the network works'),
  modelTitle: l('Четыре формата участия', 'Қатысудың төрт форматы', 'Four ways to take part'),
  modelText: l(
    'Сеть строится вокруг четырёх форматов. Каждый отвечает на свою задачу: качество протоколов, сложная хирургия, быстрый доступ к субспециалисту и новые знания.',
    'Желі төрт формат төңірегінде құрылады. Әрқайсысы өз міндетін шешеді: хаттамалардың сапасы, күрделі хирургия, субмаманға жылдам қолжетімділік және жаңа білім.',
    'The network is built around four formats, each answering its own need: protocol quality, complex surgery, fast access to a subspecialist and new knowledge.',
  ),

  mapEyebrow: l('География', 'География', 'Geography'),
  mapTitle: l('Где центр ищет экспертов', 'Орталық сарапшыларды қайда іздейді', 'Where the centre is looking for experts'),
  mapText: l(
    'Страны, с которыми уже связана работа основателя: учёба в Великобритании, испытания его устройства в клиниках Гонконга и Канады и интерес специалистов из США, Европы, Китая, Канады и Японии (по данным 24.kz). Здесь центр в первую очередь ищет экспертов; это план, а не список действующих партнёров.',
    'Негізін қалаушының жұмысы байланысты елдер: Ұлыбританиядағы оқу, оның құрылғысының Гонконг пен Канада клиникаларындағы сынақтары және АҚШ, Еуропа, Қытай, Канада мен Жапония мамандарының қызығушылығы (24.kz деректері бойынша). Орталық сарапшыларды ең алдымен осы жерлерден іздейді; бұл жоспар, қолданыстағы серіктестер тізімі емес.',
    'Countries the founder’s work is already linked to: training in the UK, testing of his device in clinics in Hong Kong and Canada, and interest from specialists in the USA, Europe, China, Canada and Japan (per 24.kz). This is where the centre is looking for experts first; it is a plan, not a list of current partners.',
  ),
  allRegions: l('Все регионы', 'Барлық өңірлер', 'All regions'),
  mapLabel: l(
    'Схема: страны, из которых центр приглашает экспертов, соединены с центром в Казахстане',
    'Сызба: орталық сарапшыларды шақыратын елдер Қазақстандағы орталықпен байланысқан',
    'Diagram: countries the centre invites experts from, connected to the centre in Kazakhstan',
  ),
  hub: l('Центр в Казахстане', 'Қазақстандағы орталық', 'Centre in Kazakhstan'),
  countries: l('Страны поиска', 'Іздеу елдері', 'Countries in scope'),

  profilesEyebrow: l('Эксперты', 'Сарапшылар', 'Experts'),
  expertName: l('Эксперт', 'Сарапшы', 'Expert'),
  profilesTitle: l('Профили экспертов', 'Сарапшылар профильдері', 'Expert profiles'),
  profilesNote: l(
    'Профили ниже — демонстрационные: они показывают структуру сети. Имена экспертов публикуются после подписания соглашений и с их согласия.',
    'Төмендегі профильдер — демонстрациялық: олар желінің құрылымын көрсетеді. Сарапшылардың аттары келісімдерге қол қойылғаннан кейін және олардың келісімімен жарияланады.',
    'The profiles below are demonstrations of the network’s structure. Experts’ names are published once agreements are signed and with their consent.',
  ),
  noProfiles: l('В этом регионе пока нет профилей', 'Бұл өңірде әзірге профильдер жоқ', 'No profiles in this region yet'),

  flowEyebrow: l('Как эксперт подключается к случаю', 'Сарапшы жағдайға қалай қосылады', 'How an expert joins a case'),
  flowTitle: l('Второе мнение и телеконсилиум', 'Екінші пікір және теле-консилиум', 'Second opinion and tele-board'),
  flowStatement: l(
    'Международный эксперт не заменяет лечащего врача. Он добавляет ещё один взгляд — а решение принимают пациент и врач, который его ведёт.',
    'Халықаралық сарапшы емдеуші дәрігерді алмастырмайды. Ол тағы бір көзқарас қосады — ал шешімді пациент пен оны жүргізетін дәрігер қабылдайды.',
    'An international expert does not replace the treating doctor. They add another view — the decision stays with the patient and the doctor who looks after them.',
  ),
  flow: [
    {
      title: l('Вопрос врача', 'Дәрігердің сұрағы', 'The doctor’s question'),
      text: l('Лечащий врач формулирует клинический вопрос и цель консультации.', 'Емдеуші дәрігер клиникалық сұрақ пен кеңес мақсатын тұжырымдайды.', 'The treating doctor frames the clinical question and the goal.'),
    },
    {
      title: l('Подготовка данных', 'Деректерді дайындау', 'Case preparation'),
      text: l('Координатор собирает снимки, анализы и историю и обезличивает их.', 'Үйлестіруші суреттерді, талдауларды және тарихты жинап, иесіздендіреді.', 'A coordinator gathers scans, tests and history and de-identifies them.'),
    },
    {
      title: l('Подбор эксперта', 'Сарапшыны таңдау', 'Expert matching'),
      text: l('Эксперт выбирается по субспециализации, без конфликта интересов.', 'Сарапшы мүдделер қақтығысынсыз субмамандығы бойынша таңдалады.', 'An expert is matched by subspecialty, free of conflicts of interest.'),
    },
    {
      title: l('Разбор случая', 'Жағдайды талдау', 'Case review'),
      text: l('Онлайн-консилиум с лечащим врачом или письменный разбор документов.', 'Емдеуші дәрігермен онлайн-консилиум немесе құжаттарды жазбаша талдау.', 'An online board with the treating doctor, or a written review.'),
    },
    {
      title: l('Заключение', 'Қорытынды', 'Written opinion'),
      text: l('Письменное заключение на языке пациента и обсуждение плана с врачом.', 'Пациент тіліндегі жазбаша қорытынды және дәрігермен жоспарды талқылау.', 'A written opinion in the patient’s language and a plan discussed with the doctor.'),
    },
  ],
  toSecondOpinion: l('Запросить второе мнение', 'Екінші пікір сұрау', 'Request a second opinion'),

  standardsEyebrow: l('Стандарты', 'Стандарттар', 'Standards'),
  standardsTitle: l('Правила, общие для всех экспертов', 'Барлық сарапшыларға ортақ ережелер', 'Rules every expert follows'),
  standards: [
    {
      title: l('Проверка квалификации', 'Біліктілікті тексеру', 'Verified credentials'),
      text: l('Лицензия, место работы и субспециализация проверяются до первого случая.', 'Лицензия, жұмыс орны және субмамандық алғашқы жағдайға дейін тексеріледі.', 'Licence, affiliation and subspecialty are checked before the first case.'),
    },
    {
      title: l('Раскрытие интересов', 'Мүдделерді ашу', 'Declared interests'),
      text: l('Эксперт сообщает о связях с производителями и не продвигает конкретные изделия.', 'Сарапшы өндірушілермен байланыстары туралы хабарлайды және нақты бұйымдарды ілгерілетпейді.', 'Experts declare industry ties and do not promote specific products.'),
    },
    {
      title: l('Защита данных', 'Деректерді қорғау', 'Data protection'),
      text: l('Эксперт видит только обезличенные данные, необходимые для ответа.', 'Сарапшы тек жауап беруге қажетті иесіздендірілген деректерді көреді.', 'Experts see only the de-identified data they need to answer.'),
    },
    {
      title: l('Понятный ответ', 'Түсінікті жауап', 'A clear answer'),
      text: l('Заключение переводится и объясняется пациенту простым языком.', 'Қорытынды аударылып, пациентке қарапайым тілмен түсіндіріледі.', 'The opinion is translated and explained to the patient in plain language.'),
    },
  ],

  joinEyebrow: l('Присоединиться', 'Қосылу', 'Join'),
  joinTitle: l('Станьте экспертом сети', 'Желі сарапшысы болыңыз', 'Become a network expert'),
  joinText: l(
    'Для офтальмологов-субспециалистов, хирургов и исследователей. Расскажите о своей практике — медицинский директор свяжется с вами, чтобы обсудить формат.',
    'Субмаман-офтальмологтарға, хирургтарға және зерттеушілерге арналған. Өз тәжірибеңіз туралы айтыңыз — медициналық директор форматты талқылау үшін сізбен хабарласады.',
    'For subspecialist ophthalmologists, surgeons and researchers. Tell us about your practice — the medical director will contact you to discuss the format.',
  ),
  joinSubmit: l('Отправить заявку', 'Өтінім жіберу', 'Send application'),
  fieldCountry: l('Страна практики', 'Тәжірибе елі', 'Country of practice'),
  fieldSubspecialty: l('Субспециализация', 'Субмамандық', 'Subspecialty'),
  fieldFormat: l('Предпочтительный формат', 'Қалаған формат', 'Preferred format'),
  fieldProfile: l('Ссылка на профиль', 'Профильге сілтеме', 'Profile link'),
  fieldProfileHint: l('ORCID, PubMed или страница клиники', 'ORCID, PubMed немесе клиника парақшасы', 'ORCID, PubMed or clinic page'),
  commentLabel: l('О вашей практике', 'Сіздің тәжірибеңіз туралы', 'About your practice'),
};

export const NETWORK_FORMATS: Array<{
  id: NetworkFormat;
  title: Localized;
  text: Localized;
  points: Localized[];
}> = [
  {
    id: 'advisory',
    title: l('Научно-консультативный совет', 'Ғылыми-консультативтік кеңес', 'Advisory board'),
    text: l(
      'Международные специалисты рецензируют клинические протоколы центра, оценивают исследовательские проекты и помогают выбирать новые технологии.',
      'Халықаралық мамандар орталықтың клиникалық хаттамаларын рецензиялайды, зерттеу жобаларын бағалайды және жаңа технологияларды таңдауға көмектеседі.',
      'International specialists review the centre’s clinical protocols, assess research projects and help choose new technology.',
    ),
    points: [
      l('Ежегодный пересмотр протоколов', 'Хаттамаларды жыл сайын қайта қарау', 'Annual protocol review'),
      l('Рецензия исследований', 'Зерттеулерді рецензиялау', 'Research review'),
      l('Независимый взгляд на качество', 'Сапаға тәуелсіз көзқарас', 'An independent view on quality'),
    ],
  },
  {
    id: 'visiting',
    title: l('Приглашённые хирурги', 'Шақырылған хирургтар', 'Visiting surgeons'),
    text: l(
      'Хирурги зарубежных центров оперируют вместе с командой центра в сложных случаях, проводят мастер-классы и разбирают результаты.',
      'Шетелдік орталықтардың хирургтары күрделі жағдайларда орталық командасымен бірге операция жасайды, шеберлік сыныптарын өткізеді және нәтижелерді талдайды.',
      'Surgeons from centres abroad operate alongside the team on complex cases, run master classes and review outcomes.',
    ),
    points: [
      l('Совместные операции', 'Бірлескен операциялар', 'Joint operations'),
      l('Мастер-классы для врачей', 'Дәрігерлерге шеберлік сыныптары', 'Master classes for doctors'),
      l('Разбор отдалённых результатов', 'Ұзақ мерзімді нәтижелерді талдау', 'Long-term outcome review'),
    ],
  },
  {
    id: 'tele',
    title: l('Панель телеконсультаций', 'Телекеңес панелі', 'Tele-consultation panel'),
    text: l(
      'Субспециалисты подключаются дистанционно: изучают ОКТ, поля зрения и историю болезни и дают письменное заключение.',
      'Субмамандар қашықтан қосылады: ОКТ, көру өрістері мен ауру тарихын зерттеп, жазбаша қорытынды береді.',
      'Subspecialists join remotely: they study OCT, visual fields and history and give a written opinion.',
    ),
    points: [
      l('Второе мнение по документам', 'Құжаттар бойынша екінші пікір', 'Second opinion from records'),
      l('Онлайн-консилиум', 'Онлайн-консилиум', 'Online case board'),
      l('Ответ на языке пациента', 'Пациент тіліндегі жауап', 'Answers in the patient’s language'),
    ],
  },
  {
    id: 'research',
    title: l('Исследовательские партнёры', 'Зерттеу серіктестері', 'Research partners'),
    text: l(
      'Университеты и лаборатории, с которыми центр ведёт совместные исследования, публикации и обучение врачей.',
      'Орталық бірлескен зерттеулер, жарияланымдар және дәрігерлерді оқыту жүргізетін университеттер мен зертханалар.',
      'Universities and laboratories that run joint research, publications and training with the centre.',
    ),
    points: [
      l('Совместные проекты', 'Бірлескен жобалар', 'Joint projects'),
      l('Публикации и данные', 'Жарияланымдар мен деректер', 'Publications and data'),
      l('Стажировки', 'Тағылымдамалар', 'Fellowships'),
    ],
  },
];

export const NETWORK_REGIONS: Array<{ id: RegionId; name: Localized }> = [
  { id: 'central-asia', name: l('Казахстан', 'Қазақстан', 'Kazakhstan') },
  { id: 'europe', name: l('Европа', 'Еуропа', 'Europe') },
  { id: 'asia-pacific', name: l('Восточная Азия', 'Шығыс Азия', 'East Asia') },
  { id: 'americas', name: l('Северная Америка', 'Солтүстік Америка', 'North America') },
];

export interface NetworkCountry {
  id: string;
  region: RegionId;
  name: Localized;
  lat: number;
  lng: number;
  hub?: boolean;
  /** Put the map label above the pin (neighbouring pins would overlap). */
  labelAbove?: boolean;
}

/**
 * Approximate main-city coordinates for the schematic map. Only countries
 * named in the verified sources (DESIGN.md §7): the UK (PhD), Hong Kong and
 * Canada (device testing), and the USA, China, Japan and Canada, whose
 * specialists showed interest per 24.kz. «Europe» in that report is not
 * broken down by country, so the UK stands for it here.
 */
export const NETWORK_COUNTRIES: NetworkCountry[] = [
  { id: 'kz', region: 'central-asia', name: l('Казахстан', 'Қазақстан', 'Kazakhstan'), lat: 51.17, lng: 71.45, hub: true },
  { id: 'gb', region: 'europe', name: l('Великобритания', 'Ұлыбритания', 'United Kingdom'), lat: 51.5, lng: -0.13 },
  { id: 'hk', region: 'asia-pacific', name: l('Гонконг', 'Гонконг', 'Hong Kong'), lat: 22.32, lng: 114.17 },
  { id: 'cn', region: 'asia-pacific', name: l('Китай', 'Қытай', 'China'), lat: 39.9, lng: 116.4 },
  { id: 'jp', region: 'asia-pacific', name: l('Япония', 'Жапония', 'Japan'), lat: 35.68, lng: 139.69 },
  { id: 'us', region: 'americas', name: l('США', 'АҚШ', 'United States'), lat: 40.71, lng: -74.0 },
  { id: 'ca', region: 'americas', name: l('Канада', 'Канада', 'Canada'), lat: 43.65, lng: -79.38, labelAbove: true },
];

export const SUBSPECIALTIES: Array<{ value: string; label: Localized }> = [
  { value: 'retina', label: l('Сетчатка и макула', 'Тор қабық және макула', 'Retina and macula') },
  { value: 'glaucoma', label: l('Глаукома', 'Глаукома', 'Glaucoma') },
  { value: 'cornea', label: l('Роговица и рефракция', 'Қасаң қабық және рефракция', 'Cornea and refractive') },
  { value: 'cataract', label: l('Хирургия катаракты', 'Катаракта хирургиясы', 'Cataract surgery') },
  { value: 'pediatric', label: l('Детская офтальмология', 'Балалар офтальмологиясы', 'Paediatric ophthalmology') },
  { value: 'neuro', label: l('Нейроофтальмология', 'Нейроофтальмология', 'Neuro-ophthalmology') },
  { value: 'oculoplastic', label: l('Окулопластика', 'Окулопластика', 'Oculoplastics') },
  { value: 'ai', label: l('ИИ и визуальные науки', 'ЖИ және көру ғылымдары', 'AI and vision science') },
];

export interface ExpertProfile {
  id: string;
  /** Generic placeholder label — DEMO DATA, not a real person. */
  code: string;
  country: string;
  subspecialty: string;
  formats: NetworkFormat[];
  focus: Localized;
  languages: string[];
}

/**
 * DEMO DATA. No real roster was supplied: these generic profiles only show
 * how the network is structured. Replace with signed, consenting experts.
 */
export const DEMO_EXPERTS: ExpertProfile[] = [
  {
    id: 'demo-a',
    code: 'A',
    country: 'gb',
    subspecialty: 'retina',
    formats: ['advisory', 'tele'],
    focus: l('Возрастная макулярная дегенерация, ОКТ-ангиография', 'Жасқа байланысты макулалық дегенерация, ОКТ-ангиография', 'Age-related macular degeneration, OCT angiography'),
    languages: ['en'],
  },
  {
    id: 'demo-b',
    code: 'B',
    country: 'ca',
    subspecialty: 'cornea',
    formats: ['visiting'],
    focus: l('Кератоконус, пересадка роговицы', 'Кератоконус, қасаң қабықты ауыстыру', 'Keratoconus, corneal transplantation'),
    languages: ['en', 'ru'],
  },
  {
    id: 'demo-c',
    code: 'C',
    country: 'hk',
    subspecialty: 'ai',
    formats: ['research', 'tele'],
    focus: l('Автоматический скрининг диабетической ретинопатии', 'Диабеттік ретинопатияның автоматты скринингі', 'Automated diabetic retinopathy screening'),
    languages: ['en'],
  },
  {
    id: 'demo-d',
    code: 'D',
    country: 'jp',
    subspecialty: 'glaucoma',
    formats: ['tele', 'advisory'],
    focus: l('Ранняя диагностика глаукомы, периметрия', 'Глаукоманы ерте диагностикалау, периметрия', 'Early glaucoma diagnosis, perimetry'),
    languages: ['en'],
  },
  {
    id: 'demo-e',
    code: 'E',
    country: 'us',
    subspecialty: 'oculoplastic',
    formats: ['visiting'],
    focus: l('Реконструктивная хирургия век и орбиты', 'Қабақ пен орбитаның реконструктивтік хирургиясы', 'Eyelid and orbital reconstructive surgery'),
    languages: ['en', 'ru'],
  },
  {
    id: 'demo-f',
    code: 'F',
    country: 'cn',
    subspecialty: 'pediatric',
    formats: ['tele', 'research'],
    focus: l('Контроль прогрессирования миопии у детей', 'Балалардағы миопияның үдеуін бақылау', 'Myopia control in children'),
    languages: ['ru', 'en'],
  },
  {
    id: 'demo-g',
    code: 'G',
    country: 'us',
    subspecialty: 'neuro',
    formats: ['advisory', 'tele'],
    focus: l('Заболевания зрительного нерва', 'Көру жүйкесінің аурулары', 'Optic nerve disease'),
    languages: ['en'],
  },
  {
    id: 'demo-h',
    code: 'H',
    country: 'gb',
    subspecialty: 'cataract',
    formats: ['visiting', 'advisory'],
    focus: l('Сложная хирургия катаракты, премиальные ИОЛ', 'Күрделі катаракта хирургиясы, премиум ИОЛ', 'Complex cataract surgery, premium IOLs'),
    languages: ['en'],
  },
];

/* ======================================================================
   PARTNERSHIPS — /partnerships
   ====================================================================== */

export type PartnerAudience = 'clinics' | 'universities' | 'industry' | 'investors' | 'tourism';

export const PARTNERSHIPS = {
  seoDescription: l(
    'Партнёрства с клиниками, университетами, технологическими компаниями, инвесторами, операторами медицинского туризма и страховщиками.',
    'Клиникалармен, университеттермен, технологиялық компаниялармен, инвесторлармен, медициналық туризм операторларымен және сақтандырушылармен серіктестік.',
    'Partnerships with clinics, universities, technology companies, investors, medical-travel operators and insurers.',
  ),
  eyebrow: l('Партнёрства', 'Серіктестік', 'Partnerships'),
  title: l('Строим офтальмологию будущего вместе', 'Болашақ офтальмологиясын бірге құрамыз', 'Building the future of ophthalmology together'),
  lead: l(
    'Для научного сообщества, клиник, индустрии, инвесторов и стратегических партнёров. Новый центр в Астане соединяет клиническую работу и инновационные проекты — и открыт к совместной работе с самого начала.',
    'Ғылыми қауымдастыққа, клиникаларға, индустрияға, инвесторларға және стратегиялық серіктестерге арналған. Астанадағы жаңа орталық клиникалық жұмыс пен инновациялық жобаларды біріктіреді және басынан бастап бірлескен жұмысқа ашық.',
    'For the scientific community, clinics, industry, investors and strategic partners. The new centre in Astana joins clinical work and innovation projects, and is open to collaboration from the start.',
  ),
  discuss: l('Обсудить партнёрство', 'Серіктестікті талқылау', 'Discuss a partnership'),
  statement: l(
    'Хорошая медицина не строится в одиночку. Каждое партнёрство должно давать пациенту что-то конкретное: более раннюю диагностику, доступную технологию или врача, который знает больше.',
    'Жақсы медицина жалғыз құрылмайды. Әр серіктестік пациентке нақты нәрсе беруі керек: ертерек диагностика, қолжетімді технология немесе көбірек білетін дәрігер.',
    'Good medicine is not built alone. Every partnership should give the patient something concrete: earlier diagnosis, accessible technology, or a doctor who knows more.',
  ),
  audiencesEyebrow: l('Для кого', 'Кімге арналған', 'Who we work with'),
  audiencesTitle: l('Пять направлений партнёрства', 'Серіктестіктің бес бағыты', 'Five partnership tracks'),
  weOffer: l('Что мы предлагаем', 'Біз не ұсынамыз', 'What we offer'),

  investorsEyebrow: l('Инвесторам', 'Инвесторларға', 'For investors'),
  investorsTitle: l(
    'Платформа, которая растёт вместе с наукой',
    'Ғылыммен бірге өсетін платформа',
    'A platform that grows with its science',
  ),
  investorsText: l(
    'Цифры и отчётность мы не публикуем на сайте: проверяемые данные предоставляются после подписания соглашения о конфиденциальности.',
    'Сандар мен есептілікті сайтта жарияламаймыз: тексерілетін деректер құпиялылық туралы келісімге қол қойылғаннан кейін беріледі.',
    'We do not publish figures on the website: verifiable data is shared once a non-disclosure agreement is signed.',
  ),
  pillars: [
    {
      id: 'vision',
      title: l('Видение', 'Көзқарас', 'Vision'),
      text: l(
        'Новый центр в Астане, где клиническая работа и инновационные проекты идут рядом, а разработки проходят путь от лаборатории до пациента.',
        'Астанадағы жаңа орталық: клиникалық жұмыс пен инновациялық жобалар қатар жүреді, ал әзірлемелер зертханадан пациентке дейінгі жолдан өтеді.',
        'A new centre in Astana where clinical work and innovation projects run side by side, and developments travel from the lab to the patient.',
      ),
    },
    {
      id: 'growth',
      title: l('Технология', 'Технология', 'Technology'),
      text: l(
        'Запатентованное устройство основателя на основе квантовой оптики для раннего выявления ВМД: испытано в клиниках Гонконга и Канады, обследовано 200 пациентов. Следующая разработка — технология для миопии (стадия исследований на животных).',
        'Негізін қалаушының ЖМД-ны ерте анықтауға арналған кванттық оптика негізіндегі патенттелген құрылғысы: Гонконг пен Канада клиникаларында сыналды, 200 пациент тексерілді. Келесі әзірлеме — миопияға арналған технология (жануарлардағы зерттеулер кезеңі).',
        'The founder’s patented quantum-optics device for early AMD detection, tested in clinics in Hong Kong and Canada with 200 patients examined. Next in the pipeline: a myopia technology at the animal-study stage.',
      ),
    },
    {
      id: 'digital',
      title: l('Цифровая экосистема', 'Цифрлық экожүйе', 'Digital ecosystem'),
      text: l(
        'Цифровые технологии в диагностике — специализация основателя. Онлайн-запись, телеконсультации и второе мнение по документам проектируются вместе с центром.',
        'Диагностикадағы цифрлық технологиялар — негізін қалаушының мамандануы. Онлайн-жазылу, телекеңестер және құжаттар бойынша екінші пікір орталықпен бірге жобалануда.',
        'Digital diagnosis is the founder’s specialism. Online booking, tele-consultations and second opinions from records are being designed with the centre.',
      ),
    },
  ],

  processEyebrow: l('Как мы начинаем', 'Қалай бастаймыз', 'How we start'),
  processTitle: l('От заявки до совместной работы', 'Өтінімнен бірлескен жұмысқа дейін', 'From enquiry to working together'),
  process: [
    {
      title: l('Заявка', 'Өтінім', 'Enquiry'),
      text: l('Расскажите об организации и идее — ответим в течение пяти рабочих дней.', 'Ұйым мен идея туралы айтыңыз — бес жұмыс күні ішінде жауап береміз.', 'Tell us about your organisation and idea — we reply within five working days.'),
    },
    {
      title: l('Знакомство', 'Танысу', 'Introduction'),
      text: l('Встреча с медицинским директором и командой направления.', 'Медициналық директормен және бағыт командасымен кездесу.', 'A meeting with the medical director and the relevant team.'),
    },
    {
      title: l('Пилот', 'Пилот', 'Pilot'),
      text: l('Небольшой совместный проект с понятными целями и метриками.', 'Анық мақсаттары мен көрсеткіштері бар шағын бірлескен жоба.', 'A small joint project with clear goals and metrics.'),
    },
    {
      title: l('Соглашение', 'Келісім', 'Agreement'),
      text: l('Договор, этические и юридические условия, защита данных.', 'Шарт, этикалық және заңдық шарттар, деректерді қорғау.', 'Contract, ethical and legal terms, data protection.'),
    },
    {
      title: l('Развитие', 'Даму', 'Growth'),
      text: l('Регулярный обзор результатов и расширение сотрудничества.', 'Нәтижелерді тұрақты шолу және ынтымақтастықты кеңейту.', 'Regular review of results and a wider collaboration.'),
    },
  ],

  formEyebrow: l('Заявка на партнёрство', 'Серіктестікке өтінім', 'Partnership enquiry'),
  formTitle: l('Расскажите о вашей организации', 'Ұйымыңыз туралы айтыңыз', 'Tell us about your organisation'),
  formText: l(
    'Заявка попадает к руководителю по развитию. Мы отвечаем каждой организации, даже если сотрудничество пока невозможно.',
    'Өтінім даму жөніндегі басшыға түседі. Ынтымақтастық әзірге мүмкін болмаса да, біз әр ұйымға жауап береміз.',
    'Your enquiry goes to the head of development. We answer every organisation, even when a partnership is not yet possible.',
  ),
  fieldOrg: l('Организация', 'Ұйым', 'Organisation'),
  fieldType: l('Тип партнёрства', 'Серіктестік түрі', 'Partnership type'),
  fieldRole: l('Должность', 'Лауазымы', 'Position'),
  fieldCountry: l('Страна', 'Ел', 'Country'),
  fieldSite: l('Сайт организации', 'Ұйымның сайты', 'Website'),
  commentLabel: l('Идея или запрос', 'Идея немесе сұрау', 'Idea or request'),
  submit: l('Отправить заявку', 'Өтінім жіберу', 'Send enquiry'),
};

export const PARTNER_AUDIENCES: Array<{
  id: PartnerAudience;
  label: Localized;
  title: Localized;
  text: Localized;
  offers: Localized[];
}> = [
  {
    id: 'clinics',
    label: l('Клиники', 'Клиникалар', 'Clinics'),
    title: l('Клиникам и направляющим врачам', 'Клиникалар мен жолдама беретін дәрігерлерге', 'Clinics and referring doctors'),
    text: l(
      'Направляйте пациентов на сложную диагностику и хирургию и получайте их обратно с полным заключением. Пациент остаётся вашим — мы берём на себя этап, для которого нужна особая технология.',
      'Пациенттерді күрделі диагностика мен хирургияға жіберіп, оларды толық қорытындымен қайтарып алыңыз. Пациент сіздікі болып қалады — біз ерекше технология қажет кезеңді өз мойнымызға аламыз.',
      'Refer patients for complex diagnostics and surgery and get them back with a full report. The patient stays yours — we take on the step that needs special technology.',
    ),
    offers: [
      l('Приоритетная запись для направленных пациентов', 'Жолдамамен келген пациенттерге басым жазылу', 'Priority booking for referred patients'),
      l('Заключение и снимки — лечащему врачу', 'Қорытынды мен суреттер — емдеуші дәрігерге', 'Report and scans back to the referring doctor'),
      l('Совместные клинические разборы', 'Бірлескен клиникалық талдаулар', 'Joint case reviews'),
      l('Обучение на базе центра', 'Орталық базасында оқыту', 'Training at the centre'),
    ],
  },
  {
    id: 'universities',
    label: l('Наука', 'Ғылым', 'Research'),
    title: l('Университетам и исследовательским группам', 'Университеттер мен зерттеу топтарына', 'Universities and research groups'),
    text: l(
      'Совместные исследования в офтальмологии, науках о зрении, квантовой оптике и искусственном интеллекте. Центр создаётся как клиническая база для инновационных проектов и открыт к публикациям.',
      'Офтальмология, көру ғылымдары, кванттық оптика және жасанды интеллект саласындағы бірлескен зерттеулер. Орталық инновациялық жобаларға арналған клиникалық база ретінде құрылуда және жарияланымдарға ашық.',
      'Joint research in ophthalmology, vision science, quantum optics and artificial intelligence. The centre is being built as a clinical base for innovation projects and is open to publishing.',
    ),
    offers: [
      l('Совместные проекты и публикации', 'Бірлескен жобалар мен жарияланымдар', 'Joint projects and publications'),
      l('Клиническая база; этическое одобрение — для каждого проекта', 'Клиникалық база; әр жобаға этикалық мақұлдау', 'A clinical base, with ethics approval sought per project'),
      l('Стажировки и научное руководство', 'Тағылымдамалар және ғылыми жетекшілік', 'Fellowships and supervision'),
      l('Лекции и академические программы', 'Дәрістер мен академиялық бағдарламалар', 'Lectures and academic programmes'),
    ],
  },
  {
    id: 'industry',
    label: l('Индустрия', 'Индустрия', 'Industry'),
    title: l('Индустрии и технологическим компаниям', 'Индустрия мен технологиялық компанияларға', 'Industry and technology companies'),
    text: l(
      'Производителям оборудования, разработчикам медицинского ПО и ИИ-решений: клиническая валидация, пилоты в реальной практике и обратная связь от врачей.',
      'Жабдық өндірушілеріне, медициналық БҚ және ЖИ шешімдерін әзірлеушілерге: клиникалық валидация, нақты тәжірибедегі пилоттар және дәрігерлердің кері байланысы.',
      'For device makers and developers of medical software and AI: clinical validation, real-world pilots and feedback from doctors.',
    ),
    offers: [
      l('Пилотные внедрения', 'Пилоттық енгізулер', 'Pilot deployments'),
      l('Клиническая валидация', 'Клиникалық валидация', 'Clinical validation'),
      l('Обучающие площадки на базе оборудования', 'Жабдық негізіндегі оқыту алаңдары', 'Training sites built around equipment'),
      l('Совместная разработка', 'Бірлескен әзірлеу', 'Co-development'),
    ],
  },
  {
    id: 'investors',
    label: l('Инвесторы', 'Инвесторлар', 'Investors'),
    title: l('Инвесторам и стратегическим партнёрам', 'Инвесторлар мен стратегиялық серіктестерге', 'Investors and strategic partners'),
    text: l(
      'Центр открывается в Астане и строится вокруг собственной науки: запатентованной разработки основателя и новых проектов в квантовой оптике. Мы открыты к диалогу о росте.',
      'Орталық Астанада ашылады және өз ғылымы төңірегінде құрылады: негізін қалаушының патенттелген әзірлемесі және кванттық оптикадағы жаңа жобалар. Біз өсу туралы диалогқа ашықпыз.',
      'The centre is opening in Astana and is built around its own science: the founder’s patented development and new quantum-optics projects. We are open to a conversation about growth.',
    ),
    offers: [
      l('Запуск центра в Астане', 'Астанадағы орталықты іске қосу', 'Launching the Astana centre'),
      l('Цифровые сервисы и телемедицина', 'Цифрлық қызметтер және телемедицина', 'Digital services and telemedicine'),
      l('Научные разработки', 'Ғылыми әзірлемелер', 'Research-led products'),
      l('Прозрачная отчётность', 'Ашық есептілік', 'Transparent reporting'),
    ],
  },
  {
    id: 'tourism',
    label: l('Туризм и страхование', 'Туризм және сақтандыру', 'Travel & insurance'),
    title: l(
      'Операторам медицинского туризма и страховым компаниям',
      'Медициналық туризм операторлары мен сақтандыру компанияларына',
      'Medical-travel operators and insurers',
    ),
    text: l(
      'Понятные пакеты, фиксированная смета и координатор, который ведёт пациента от первого запроса до контроля после возвращения домой.',
      'Түсінікті пакеттер, тіркелген смета және пациентті алғашқы сұраудан үйге оралғаннан кейінгі бақылауға дейін жүргізетін үйлестіруші.',
      'Clear packages, a fixed estimate and a coordinator who guides the patient from the first request to follow-up after returning home.',
    ),
    offers: [
      l('Предварительная оценка по документам', 'Құжаттар бойынша алдын ала бағалау', 'Pre-assessment from records'),
      l('Фиксированная смета до поездки', 'Сапарға дейін тіркелген смета', 'A fixed estimate before travel'),
      l('Международный координатор', 'Халықаралық үйлестіруші', 'An international coordinator'),
      l('Прямое взаимодействие со страховщиком', 'Сақтандырушымен тікелей өзара іс-қимыл', 'Direct work with the insurer'),
    ],
  },
];
