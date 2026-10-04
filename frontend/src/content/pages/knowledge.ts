import type { Localized } from '@/i18n/types';
import { ROUTES } from '@/app/navigation';
import type { KnowledgeCategory, KnowledgeTag } from './knowledge-types';

/**
 * Knowledge base copy (spec §6.7, §6.8, §16) — Figma «07 База знаний» and
 * «08 Статья». Article metadata lives in knowledge-articles-index.ts, bodies in
 * knowledge-bodies/<slug>.ts (loaded per article).
 */

/* ============================================================ CATEGORIES */

export interface KnowledgeCategoryInfo {
  key: KnowledgeCategory;
  label: Localized;
  text: Localized;
  /** Service area page this theme leads to. */
  route: string;
}

/** Exactly the eight themes of the specification, in its order. */
export const KNOWLEDGE_CATEGORIES: KnowledgeCategoryInfo[] = [
  {
    key: 'children',
    label: { ru: 'Зрение детей', kk: 'Балалардың көруі', en: "Children's vision" },
    text: {
      ru: 'Близорукость, косоглазие, «ленивый глаз» и первые осмотры.',
      kk: 'Миопия, қылилық, «жалқау көз» және алғашқы тексерулер.',
      en: 'Myopia, squint, lazy eye and the first eye checks.',
    },
    route: ROUTES.pediatric,
  },
  {
    key: 'after40',
    label: { ru: 'Здоровье глаз после 40', kk: '40 жастан кейінгі көз саулығы', en: 'Eye health after 40' },
    text: {
      ru: 'Возрастная дальнозоркость и регулярные обследования.',
      kk: 'Жасқа байланысты алыстан көргіштік және тұрақты тексерулер.',
      en: 'Presbyopia and regular examinations.',
    },
    route: ROUTES.diagnostics,
  },
  {
    key: 'surgery',
    label: {
      ru: 'Катаракта и рефракционная хирургия',
      kk: 'Катаракта және рефракциялық хирургия',
      en: 'Cataract and refractive surgery',
    },
    text: {
      ru: 'Когда оперировать, как готовиться и чего ожидать.',
      kk: 'Қашан ота жасау керек, қалай дайындалу және неден күту керек.',
      en: 'When to operate, how to prepare and what to expect.',
    },
    route: ROUTES.cataract,
  },
  {
    key: 'retina',
    label: { ru: 'Здоровье сетчатки и макулы', kk: 'Тор қабық пен сары дақ саулығы', en: 'Retina and macula' },
    text: {
      ru: 'ВМД, диабетическая ретинопатия, ОКТ-контроль.',
      kk: 'ЖМД, диабеттік ретинопатия, ОКТ бақылауы.',
      en: 'AMD, diabetic retinopathy, OCT monitoring.',
    },
    route: ROUTES.treatment,
  },
  {
    key: 'glaucoma',
    label: { ru: 'Глаукома', kk: 'Глаукома', en: 'Glaucoma' },
    text: {
      ru: 'Тихая болезнь зрительного нерва: выявление и контроль.',
      kk: 'Көру жүйкесінің үнсіз ауруы: анықтау және бақылау.',
      en: 'The silent optic-nerve disease: detection and control.',
    },
    route: ROUTES.treatment,
  },
  {
    key: 'library',
    label: { ru: 'Библиотека заболеваний', kk: 'Аурулар кітапханасы', en: 'Disease library' },
    text: {
      ru: 'Краткие статьи о заболеваниях глаз от А до Я.',
      kk: 'Көз аурулары туралы А-дан Я-ға дейінгі қысқа мақалалар.',
      en: 'Concise explainers on eye conditions from A to Z.',
    },
    route: ROUTES.treatment,
  },
  {
    key: 'research',
    label: { ru: 'Исследования простым языком', kk: 'Зерттеулер қарапайым тілмен', en: 'Research in plain language' },
    text: {
      ru: 'Что говорит наука — без преувеличений.',
      kk: 'Ғылым не дейді — асыра айтусыз.',
      en: 'What the science says — without the hype.',
    },
    route: ROUTES.science,
  },
  {
    key: 'prevention',
    label: {
      ru: 'Профилактика заболеваний глаз',
      kk: 'Көз ауруларының алдын алу',
      en: 'Preventing eye disease',
    },
    text: {
      ru: 'Экраны, линзы, сухость и ежедневные привычки.',
      kk: 'Экрандар, линзалар, құрғақтық және күнделікті әдеттер.',
      en: 'Screens, lenses, dryness and daily habits.',
    },
    route: ROUTES.diagnostics,
  },
];

export const categoryInfo = (key: KnowledgeCategory): KnowledgeCategoryInfo =>
  KNOWLEDGE_CATEGORIES.find((entry) => entry.key === key) ?? KNOWLEDGE_CATEGORIES[0];

/* ================================================================== TAGS */

export const TAG_LABELS: Record<KnowledgeTag, Localized> = {
  myopia: { ru: 'миопия', kk: 'миопия', en: 'myopia' },
  children: { ru: 'дети', kk: 'балалар', en: 'children' },
  cataract: { ru: 'катаракта', kk: 'катаракта', en: 'cataract' },
  'lens-implants': { ru: 'интраокулярные линзы', kk: 'көзішілік линзалар', en: 'lens implants' },
  'laser-correction': { ru: 'лазерная коррекция', kk: 'лазерлік түзету', en: 'laser correction' },
  glaucoma: { ru: 'глаукома', kk: 'глаукома', en: 'glaucoma' },
  'eye-pressure': { ru: 'внутриглазное давление', kk: 'көзішілік қысым', en: 'eye pressure' },
  retina: { ru: 'сетчатка', kk: 'тор қабық', en: 'retina' },
  macula: { ru: 'макула', kk: 'сары дақ', en: 'macula' },
  diabetes: { ru: 'диабет', kk: 'қант диабеті', en: 'diabetes' },
  'dry-eye': { ru: 'сухой глаз', kk: 'құрғақ көз', en: 'dry eye' },
  screens: { ru: 'экраны', kk: 'экрандар', en: 'screens' },
  'contact-lenses': { ru: 'контактные линзы', kk: 'жанаспалы линзалар', en: 'contact lenses' },
  prevention: { ru: 'профилактика', kk: 'алдын алу', en: 'prevention' },
  diagnostics: { ru: 'диагностика', kk: 'диагностика', en: 'diagnostics' },
  oct: { ru: 'ОКТ', kk: 'ОКТ', en: 'OCT' },
  ai: { ru: 'искусственный интеллект', kk: 'жасанды интеллект', en: 'AI' },
  research: { ru: 'исследования', kk: 'зерттеулер', en: 'research' },
  neuro: { ru: 'нейроофтальмология', kk: 'нейроофтальмология', en: 'neuro-ophthalmology' },
  keratoconus: { ru: 'кератоконус', kk: 'кератоконус', en: 'keratoconus' },
  amblyopia: { ru: 'амблиопия', kk: 'амблиопия', en: 'amblyopia' },
  strabismus: { ru: 'косоглазие', kk: 'қылилық', en: 'strabismus' },
  presbyopia: { ru: 'пресбиопия', kk: 'пресбиопия', en: 'presbyopia' },
  emergency: { ru: 'неотложно', kk: 'шұғыл', en: 'urgent' },
  surgery: { ru: 'хирургия', kk: 'хирургия', en: 'surgery' },
};

/* ============================================================ PAGE COPY */

export const knowledgeCopy = {
  seoTitle: { ru: 'База знаний о здоровье глаз', kk: 'Көз саулығы туралы білім қоры', en: 'Eye health knowledge base' },
  seoDescription: {
    ru: 'Материалы о детском зрении, катаракте, глаукоме, сетчатке и профилактике — простым языком, с источниками и указанием автора.',
    kk: 'Балалардың көруі, катаракта, глаукома, тор қабық және алдын алу туралы материалдар — қарапайым тілмен, дереккөздері мен авторы көрсетілген.',
    en: "Materials on children's vision, cataract, glaucoma, the retina and prevention — in plain language, with sources and a named author.",
  },
  heroEyebrow: { ru: 'Знания и наука', kk: 'Білім және ғылым', en: 'Knowledge and science' },
  heroTitle: { ru: 'База знаний', kk: 'Білім қоры', en: 'Knowledge base' },
  heroText: {
    ru: 'Материалы о здоровье глаз: как устроены заболевания, когда обследоваться и какие решения существуют. У каждой статьи указаны автор, источники и статус медицинской проверки.',
    kk: 'Көз саулығы туралы материалдар: аурулар қалай дамиды, қашан тексерілу керек және қандай шешімдер бар. Әр мақалада автор, дереккөздер және медициналық тексеру мәртебесі көрсетілген.',
    en: 'Materials on eye health: how conditions develop, when to get checked and what options exist. Every article shows its author, its sources and its medical-review status.',
  },
  heroMaterials: { ru: 'К материалам', kk: 'Материалдарға', en: 'Browse materials' },
  heroLibrary: { ru: 'Библиотека заболеваний', kk: 'Аурулар кітапханасы', en: 'Disease library' },

  statement: {
    ru: 'Ясная информация помогает человеку принимать взвешенные решения о зрении. Мы объясняем сложное спокойно, опираемся на доказательства и честно говорим о границах возможного.',
    kk: 'Анық ақпарат адамға көру туралы салмақты шешім қабылдауға көмектеседі. Біз күрделіні байыппен түсіндіреміз, дәлелдерге сүйенеміз және мүмкіндіктің шегін адал айтамыз.',
    en: 'Clear information helps people make considered decisions about their sight. We explain complex things calmly, rely on evidence and are honest about the limits of what is possible.',
  },
  themesEyebrow: { ru: 'Восемь тем', kk: 'Сегіз тақырып', en: 'Eight themes' },
  themesTitle: { ru: 'С чего начать', kk: 'Неден бастау керек', en: 'Where to start' },
  themeCount: { ru: 'материалов', kk: 'материал', en: 'materials' },

  materialsEyebrow: { ru: 'Материалы', kk: 'Материалдар', en: 'Materials' },
  materialsTitle: { ru: 'Все статьи базы знаний', kk: 'Білім қорының барлық мақалалары', en: 'All knowledge-base articles' },
  searchLabel: { ru: 'Поиск по материалам', kk: 'Материалдар бойынша іздеу', en: 'Search materials' },
  searchPlaceholder: {
    ru: 'Например, «катаракта» или «дети»',
    kk: 'Мысалы, «катаракта» немесе «балалар»',
    en: 'For example, "cataract" or "children"',
  },
  topicLabel: { ru: 'Тема', kk: 'Тақырып', en: 'Topic' },
  allTopics: { ru: 'Все темы', kk: 'Барлық тақырыптар', en: 'All topics' },
  tagsLabel: { ru: 'Теги', kk: 'Тегтер', en: 'Tags' },
  tagsMore: { ru: 'Все теги', kk: 'Барлық тегтер', en: 'All tags' },
  showMore: { ru: 'Показать ещё', kk: 'Тағы көрсету', en: 'Show more' },
  tagsLess: { ru: 'Свернуть теги', kk: 'Тегтерді жию', en: 'Fewer tags' },
  demoProfile: { ru: 'Демо-профиль', kk: 'Демо-профиль', en: 'Demo profile' },
  count: { ru: 'Материалов', kk: 'Материалдар', en: 'Materials' },
  open: { ru: 'Открыть материал', kk: 'Материалды ашу', en: 'Open material' },
  emptyTitle: { ru: 'Материалы не найдены', kk: 'Материалдар табылмады', en: 'No materials found' },
  emptyText: {
    ru: 'Попробуйте другое слово или сбросьте фильтры. Если нужного материала нет — задайте вопрос врачу на консультации.',
    kk: 'Басқа сөзді қолданып көріңіз немесе сүзгілерді тазалаңыз. Қажетті материал болмаса — дәрігерге кеңесте сұрақ қойыңыз.',
    en: "Try another word or reset the filters. If the material you need isn't here, ask a doctor during a consultation.",
  },
  minutes: { ru: 'мин чтения', kk: 'мин оқу', en: 'min read' },

  libraryEyebrow: { ru: 'От А до Я', kk: 'А-дан Я-ға дейін', en: 'A to Z' },
  libraryTitle: { ru: 'Библиотека заболеваний', kk: 'Аурулар кітапханасы', en: 'Disease library' },
  libraryText: {
    ru: 'Короткие определения самых частых заболеваний глаз. Подробности — в статьях и на страницах направлений.',
    kk: 'Ең жиі кездесетін көз ауруларының қысқа анықтамалары. Толығырақ — мақалаларда және бағыттар беттерінде.',
    en: 'Short definitions of the most common eye conditions. More detail is in the articles and on the service pages.',
  },
  libraryLetters: { ru: 'Алфавитный указатель', kk: 'Әліпби көрсеткіші', en: 'Alphabetical index' },
  readArticle: { ru: 'Читать статью', kk: 'Мақаланы оқу', en: 'Read the article' },
  seeService: { ru: 'Направление помощи', kk: 'Көмек бағыты', en: 'Related service' },

  authorsEyebrow: { ru: 'Авторы и проверка', kk: 'Авторлар және тексеру', en: 'Authors and review' },
  authorsTitle: { ru: 'Кто пишет материалы', kk: 'Материалдарды кім жазады', en: 'Who writes the materials' },
  authorsText: {
    ru: 'Материалы готовят редакция и врачи центра по клиническим рекомендациям. Перед публикацией каждый должен пройти проверку врачом-рецензентом: пока подпись не получена, в статье стоит пометка об этом. Профили врачей на сайте пока демонстрационные.',
    kk: 'Материалдарды редакция мен орталық дәрігерлері клиникалық ұсынымдар бойынша дайындайды. Жариялар алдында әрқайсысы рецензент-дәрігердің тексеруінен өтуі керек: қолы қойылмайынша, мақалада бұл туралы белгі тұрады. Сайттағы дәрігерлер профильдері әзірге демонстрациялық.',
    en: "Materials are prepared by the editorial team and the centre's doctors from clinical guidelines. Each must be checked by a reviewing doctor before publication; until that sign-off exists, the article says so. Doctor profiles on the site are currently demo profiles.",
  },
  authorMaterials: { ru: 'материалов', kk: 'материал', en: 'materials' },
  founderCardCount: { ru: 'научные публикации 2026', kk: '2026 ғылыми жарияланым', en: 'research papers, 2026' },

  faqEyebrow: { ru: 'Вопросы', kk: 'Сұрақтар', en: 'Questions' },
  faqTitle: { ru: 'О базе знаний', kk: 'Білім қоры туралы', en: 'About the knowledge base' },
  faqAll: { ru: 'Все вопросы и ответы', kk: 'Барлық сұрақтар мен жауаптар', en: 'All questions and answers' },

  ctaTitle: {
    ru: 'Статья не заменяет осмотр — запишитесь к врачу',
    kk: 'Мақала тексеруді алмастырмайды — дәрігерге жазылыңыз',
    en: 'An article is no substitute for an examination — book a visit',
  },
} satisfies Record<string, Localized>;

/* ========================================================= ARTICLE COPY */

export const articleCopy = {
  toc: { ru: 'На этой странице', kk: 'Осы бетте', en: 'On this page' },
  faqEyebrow: { ru: 'Частые вопросы', kk: 'Жиі қойылатын сұрақтар', en: 'Frequently asked' },
  faqTitle: { ru: 'Коротко о главном', kk: 'Негізгісі қысқаша', en: 'The short answers' },
  continue: { ru: 'Продолжить знакомство', kk: 'Танысуды жалғастыру', en: 'Keep reading' },
  related: { ru: 'Похожие материалы', kk: 'Ұқсас материалдар', en: 'Related materials' },
  sources: { ru: 'Источники и дополнительное чтение', kk: 'Дереккөздер және қосымша оқу', en: 'Sources and further reading' },
  sourcesNote: {
    ru: 'Материал подготовлен на основе клинических рекомендаций и публикаций профессиональных сообществ. Ссылки ведут на внешние ресурсы на английском языке.',
    kk: 'Материал клиникалық ұсынымдар мен кәсіби қауымдастықтардың жарияланымдары негізінде дайындалды. Сілтемелер ағылшын тіліндегі сыртқы ресурстарға апарады.',
    en: 'This material is based on clinical guidelines and publications of professional bodies. Links open external resources.',
  },
  authorEyebrow: { ru: 'Об авторе', kk: 'Автор туралы', en: 'About the author' },
  authorLink: { ru: 'Все материалы автора', kk: 'Автордың барлық материалдары', en: "All the author's materials" },
  bookAuthor: { ru: 'Записаться к врачу', kk: 'Дәрігерге жазылу', en: 'Book with this doctor' },
  published: { ru: 'Опубликовано', kk: 'Жарияланды', en: 'Published' },
  reviewed: { ru: 'Проверено врачом', kk: 'Дәрігер тексерді', en: 'Medically reviewed' },
  reviewPendingLabel: { ru: 'Медицинская проверка: ожидается', kk: 'Медициналық тексеру: күтілуде', en: 'Medical review: pending' },
  reviewPending: {
    ru: 'Материал подготовлен по клиническим рекомендациям и указанным источникам. ФИО врача-рецензента и дата проверки появятся здесь после подписания. [Заполнитель: подпись рецензента]',
    kk: 'Материал клиникалық ұсынымдар мен көрсетілген дереккөздер бойынша дайындалды. Рецензент-дәрігердің аты-жөні мен тексеру күні қол қойылғаннан кейін осында көрсетіледі. [Толтырғыш: рецензент қолы]',
    en: "Prepared from clinical guidelines and the sources listed below. The reviewing doctor's name and the review date will appear here once signed off. [Placeholder: reviewer sign-off]",
  },
  basedOn: {
    ru: 'Материал редакции простым языком объясняет опубликованную работу; это не авторский текст её исследователей.',
    kk: 'Редакция материалы жарияланған жұмысты қарапайым тілмен түсіндіреді; бұл оның зерттеушілерінің авторлық мәтіні емес.',
    en: "An editorial explainer of a published paper in plain language; it is not written by the paper's authors.",
  },
  paperLink: { ru: 'Публикация', kk: 'Жарияланым', en: 'The paper' },
  loading: { ru: 'Загружаем текст статьи…', kk: 'Мақала мәтіні жүктелуде…', en: 'Loading the article…' },
  loadError: {
    ru: 'Не удалось загрузить текст статьи. Проверьте соединение и попробуйте ещё раз.',
    kk: 'Мақала мәтінін жүктеу мүмкін болмады. Байланысты тексеріп, қайталап көріңіз.',
    en: "We couldn't load the article text. Check your connection and try again.",
  },
  retry: { ru: 'Повторить', kk: 'Қайталау', en: 'Try again' },
  tags: { ru: 'Теги', kk: 'Тегтер', en: 'Tags' },
  serviceLink: { ru: 'Направление: {name}', kk: 'Бағыт: {name}', en: 'Service: {name}' },
  themeLink: { ru: 'Тема: {name}', kk: 'Тақырып: {name}', en: 'Theme: {name}' },
  allMaterials: { ru: 'Вся база знаний', kk: 'Бүкіл білім қоры', en: 'The whole knowledge base' },
  disclaimer: {
    ru: 'Материал носит информационный характер и не заменяет консультацию врача. Имеются противопоказания. При внезапном ухудшении зрения, вспышках, «шторке» или боли в глазу обратитесь за неотложной помощью.',
    kk: 'Материал ақпараттық сипатта және дәрігер кеңесін алмастырмайды. Қарсы көрсетілімдері бар. Көру кенеттен нашарласа, жарқыл, «перде» пайда болса немесе көз ауырса, шұғыл көмекке жүгініңіз.',
    en: 'This material is for information only and does not replace a consultation. Contraindications apply. If your vision suddenly worsens, or you notice flashes, a "curtain" or eye pain, seek urgent care.',
  },
  ctaTitle: {
    ru: 'Остались вопросы? Обсудите их с врачом',
    kk: 'Сұрақтар қалды ма? Оларды дәрігермен талқылаңыз',
    en: 'Still have questions? Discuss them with a doctor',
  },
} satisfies Record<string, Localized>;

/* ================================================================ AUTHORS */

export const FOUNDER_ID = 'founder';
export const FOUNDER_SLUG = 'dr-kulmaganbetov';

export const founderProfile = {
  name: { ru: 'Мухит Кулмаганбетов', kk: 'Мұхит Құлмағанбетов', en: 'Mukhit Kulmaganbetov' },
  role: {
    ru: 'Основатель центра, офтальмолог, исследователь',
    kk: 'Орталықтың негізін қалаушы, офтальмолог, зерттеуші',
    en: 'Founder, ophthalmologist and researcher',
  },
  credentials: {
    ru: 'MD (офтальмология) · PhD в области наук о зрении, Кардиффский университет · AFHEA',
    kk: 'MD (офтальмология) · Кардифф университеті, көру ғылымдары бойынша PhD · AFHEA',
    en: 'MD (Ophthalmology) · PhD in Vision Sciences, Cardiff University · AFHEA',
  },
  bio: {
    ru: 'Врач-офтальмолог (MD) и учёный: PhD в области наук о зрении (Кардиффский университет), AFHEA. Преподаватель и методист кафедры постдипломного образования Казахского НИИ глазных болезней (6 лет опыта; цифровые технологии в диагностике). Разработал устройство квантовой оптики для ранней диагностики возрастной макулярной дегенерации: испытания в клиниках Гонконга и Канады, 200 пациентов, получен патент. Разрабатывает технологию для диагностики и лечения миопии (стадия исследований на животных). Публикации 2026 года — в Scientific Reports, Diagnostics и Healthcare.',
    kk: 'Офтальмолог дәрігер (MD) және ғалым: көру ғылымдары бойынша PhD (Кардифф университеті), AFHEA. Қазақ көз аурулары ҒЗИ-ның дипломнан кейінгі білім беру кафедрасының оқытушысы және әдіскері (6 жыл тәжірибе; диагностикадағы цифрлық технологиялар). Жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған кванттық оптика құрылғысын әзірледі: Гонконг пен Канада клиникаларындағы сынақтар, 200 пациент, патент алынды. Миопияны анықтау мен емдеу технологиясын әзірлеуде (жануарларға жүргізілетін зерттеулер кезеңі). 2026 жылғы жарияланымдары — Scientific Reports, Diagnostics және Healthcare журналдарында.',
    en: 'Ophthalmologist (MD) and scientist: PhD in Vision Sciences (Cardiff University), AFHEA. Lecturer and methodologist in the Department of Postgraduate Education at the Kazakh Research Institute of Eye Diseases (6 years; digital technologies in diagnosis). He developed a quantum-optics device for the early detection of age-related macular degeneration — tested in clinics in Hong Kong and Canada on 200 patients, and patented — and is developing a technology to diagnose and treat myopia (animal-study stage). 2026 papers in Scientific Reports, Diagnostics and Healthcare.',
  },
  interests: {
    ru: 'Офтальмология · искусственный интеллект · квантовая физика',
    kk: 'Офтальмология · жасанды интеллект · кванттық физика',
    en: 'Ophthalmology · artificial intelligence · quantum physics',
  },
  sameAs: [
    'https://www.threads.com/@mukhit_kulmaganbetov',
    'https://eyeinst.kz/catalog/kulmaganbetov-muhit-askarovich-2882/',
  ],
};

export const EDITORIAL_ID = 'editorial';
export const EDITORIAL_SLUG = 'editorial-team';

/** Unsigned materials are credited to the editorial team, not to a person. */
export const editorialProfile = {
  name: { ru: 'Редакция центра', kk: 'Орталық редакциясы', en: 'Editorial team' },
  role: {
    ru: 'Редакция базы знаний офтальмологического центра',
    kk: 'Офтальмологиялық орталықтың білім қоры редакциясы',
    en: "The ophthalmic centre's knowledge-base editors",
  },
  credentials: {
    ru: 'Медицинская проверка: [ФИО и должность врача-рецензента — будут указаны после подписания]',
    kk: 'Медициналық тексеру: [рецензент-дәрігердің аты-жөні мен лауазымы — қол қойылғаннан кейін көрсетіледі]',
    en: "Medical review: [reviewing doctor's name and position — added once signed off]",
  },
  bio: {
    ru: 'Готовим материалы по клиническим рекомендациям и рецензируемым публикациям, всегда со списком источников. Научные материалы объясняют опубликованные работы простым языком, но не являются авторскими текстами их исследователей. Перед публикацией каждый текст должен пройти проверку врачом центра; пока подпись не получена, в статье стоит пометка.',
    kk: 'Материалдарды клиникалық ұсынымдар мен рецензияланған жарияланымдар бойынша, әрдайым дереккөздер тізімімен дайындаймыз. Ғылыми материалдар жарияланған жұмыстарды қарапайым тілмен түсіндіреді, бірақ олардың зерттеушілерінің авторлық мәтіні емес. Жариялар алдында әр мәтін орталық дәрігерінің тексеруінен өтуі керек; қол қойылмайынша, мақалада белгі тұрады.',
    en: "We prepare materials from clinical guidelines and peer-reviewed publications, always with a list of sources. Research explainers describe published papers in plain language but are not written by the papers' authors. Every text must be checked by one of the centre's doctors before publication; until that sign-off exists, the article says so.",
  },
};

export const authorCopy = {
  eyebrow: { ru: 'Автор базы знаний', kk: 'Білім қорының авторы', en: 'Knowledge-base author' },
  founderEyebrow: { ru: 'Научные публикации', kk: 'Ғылыми жарияланымдар', en: 'Research publications' },
  aboutTitle: { ru: 'Об авторе', kk: 'Автор туралы', en: 'About the author' },
  allKnowledge: { ru: 'Вся база знаний', kk: 'Бүкіл білім қоры', en: 'The whole knowledge base' },
  openPaper: { ru: 'Открыть статью', kk: 'Мақаланы ашу', en: 'Open the paper' },
  demoNote: {
    ru: 'Демонстрационный профиль: сведения о враче взяты из тестовых данных сайта и будут заменены подтверждёнными до запуска.',
    kk: 'Демонстрациялық профиль: дәрігер туралы мәліметтер сайттың тест деректерінен алынған және іске қосылғанға дейін расталған мәліметтермен ауыстырылады.',
    en: "Demo profile: this doctor's details come from the site's test data and will be replaced with verified information before launch.",
  },
  papersTitle: { ru: 'Рецензируемые статьи', kk: 'Рецензияланған мақалалар', en: 'Peer-reviewed papers' },
  papersText: {
    ru: 'Публикации 2026 года. Полный список соавторов — на сайтах издательств.',
    kk: '2026 жылғы жарияланымдар. Бірлескен авторлардың толық тізімі — баспалардың сайттарында.',
    en: "Publications from 2026. The full author lists are on the publishers' websites.",
  },
  explainersTitle: { ru: 'Объяснения простым языком', kk: 'Қарапайым тілмен түсіндірмелер', en: 'Plain-language explainers' },
  explainersText: {
    ru: 'Материалы редакции базы знаний о темах этих работ. Их автор — редакция, а не доктор Кулмаганбетов.',
    kk: 'Осы жұмыстардың тақырыптары туралы білім қоры редакциясының материалдары. Олардың авторы — редакция, доктор Құлмағанбетов емес.',
    en: 'Knowledge-base explainers on the topics of these papers. They are written by the editorial team, not by Dr Kulmaganbetov.',
  },
  credentials: { ru: 'Квалификация', kk: 'Біліктілік', en: 'Credentials' },
  experience: { ru: 'лет практики', kk: 'жыл тәжірибе', en: 'years in practice' },
  materials: { ru: 'материалов в базе знаний', kk: 'білім қорындағы материал', en: 'knowledge-base materials' },
  languages: { ru: 'языка консультаций', kk: 'кеңес беру тілі', en: 'consultation languages' },
  themes: { ru: 'тем', kk: 'тақырып', en: 'themes' },
  materialsEyebrow: { ru: 'Публикации', kk: 'Жарияланымдар', en: 'Publications' },
  materialsTitle: { ru: 'Материалы автора', kk: 'Автордың материалдары', en: 'Materials by this author' },
  noMaterials: {
    ru: 'Материалы этого автора готовятся к публикации.',
    kk: 'Бұл автордың материалдары жариялауға дайындалуда.',
    en: "This author's materials are being prepared for publication.",
  },
  principlesEyebrow: { ru: 'Редакционные принципы', kk: 'Редакциялық қағидаттар', en: 'Editorial principles' },
  principlesTitle: { ru: 'Как мы пишем о здоровье', kk: 'Денсаулық туралы қалай жазамыз', en: 'How we write about health' },
  principles: [
    {
      title: { ru: 'Доказательства', kk: 'Дәлелдер', en: 'Evidence' },
      text: {
        ru: 'Опираемся на клинические рекомендации и рецензируемые публикации, указываем источники.',
        kk: 'Клиникалық ұсынымдар мен рецензияланған жарияланымдарға сүйенеміз, дереккөздерді көрсетеміз.',
        en: 'We rely on clinical guidelines and peer-reviewed publications and cite our sources.',
      },
    },
    {
      title: { ru: 'Проверка врачом', kk: 'Дәрігердің тексеруі', en: 'Medical review' },
      text: {
        ru: 'Каждый материал должен пройти проверку врачом центра. Пока подпись не получена, статья честно помечена как ожидающая проверки.',
        kk: 'Әр материал орталық дәрігерінің тексеруінен өтуі керек. Қол қойылмайынша, мақала тексеруді күтіп тұр деп адал белгіленеді.',
        en: "Every material must be checked by one of the centre's doctors. Until that sign-off exists, the article is clearly marked as awaiting review.",
      },
    },
    {
      title: { ru: 'Без обещаний', kk: 'Уәдесіз', en: 'No promises' },
      text: {
        ru: 'Мы не гарантируем результат и честно говорим о рисках и ограничениях методов.',
        kk: 'Біз нәтижеге кепілдік бермейміз және әдістердің қаупі мен шектеулері туралы адал айтамыз.',
        en: 'We never guarantee outcomes and are honest about the risks and limits of each method.',
      },
    },
  ],
  profile: { ru: 'Профиль врача', kk: 'Дәрігер профилі', en: 'Doctor profile' },
  founderPage: { ru: 'О докторе Кулмаганбетове', kk: 'Доктор Құлмағанбетов туралы', en: 'About Dr Kulmaganbetov' },
  science: { ru: 'Научная работа', kk: 'Ғылыми жұмыс', en: 'Research' },
  authors: { ru: 'Авторы', kk: 'Авторлар', en: 'Authors' },
} as const;

/* ======================================================= DISEASE LIBRARY */

export interface DiseaseEntry {
  id: string;
  name: Localized;
  text: Localized;
  /** Knowledge-base article slug. */
  articleSlug?: string;
  /** Service page (route) for the condition. */
  route: string;
}

export const DISEASE_LIBRARY: DiseaseEntry[] = [
  {
    id: 'amblyopia',
    name: { ru: 'Амблиопия', kk: 'Амблиопия', en: 'Amblyopia (lazy eye)' },
    text: {
      ru: 'Снижение зрения одного глаза из-за того, что мозг в детстве «не научился» им пользоваться. Лучше всего поддаётся лечению в раннем возрасте.',
      kk: 'Балалық шақта ми бір көзді «пайдалануды үйренбегендіктен» оның көруі төмендейді. Ерте жаста емдеуге жақсы көнеді.',
      en: 'Reduced vision in one eye because the brain did not learn to use it properly in childhood. It responds best to treatment at a young age.',
    },
    articleSlug: 'lazy-eye-and-squint-in-children',
    route: ROUTES.pediatric,
  },
  {
    id: 'amd',
    name: {
      ru: 'Возрастная макулярная дегенерация (ВМД)',
      kk: 'Жасқа байланысты макулалық дегенерация (ЖМД)',
      en: 'Age-related macular degeneration (AMD)',
    },
    text: {
      ru: 'Поражение центральной зоны сетчатки у людей старше 50 лет: искажение линий, пятно в центре поля зрения. Влажную форму лечат инъекциями.',
      kk: '50 жастан асқан адамдарда тор қабықтың орталық аймағының зақымдануы: сызықтардың қисаюы, көру өрісінің ортасында дақ. Ылғал түрін инъекциямен емдейді.',
      en: 'Damage to the central retina in people over 50: wavy lines and a blurred spot in the centre of vision. The wet form is treated with injections.',
    },
    articleSlug: 'age-related-macular-degeneration',
    route: ROUTES.treatment,
  },
  {
    id: 'glaucoma',
    name: { ru: 'Глаукома', kk: 'Глаукома', en: 'Glaucoma' },
    text: {
      ru: 'Хроническое поражение зрительного нерва, часто связанное с повышенным внутриглазным давлением. Долго протекает без симптомов; потерянное зрение не восстанавливается.',
      kk: 'Көру жүйкесінің созылмалы зақымдануы, көбіне көзішілік қысымның жоғарылауымен байланысты. Ұзақ уақыт белгісіз өтеді; жоғалған көру қалпына келмейді.',
      en: 'Chronic damage to the optic nerve, often linked to raised eye pressure. It is symptom-free for years, and lost vision does not return.',
    },
    articleSlug: 'glaucoma-early-signs',
    route: ROUTES.treatment,
  },
  {
    id: 'diabetic-retinopathy',
    name: { ru: 'Диабетическая ретинопатия', kk: 'Диабеттік ретинопатия', en: 'Diabetic retinopathy' },
    text: {
      ru: 'Поражение сосудов сетчатки при сахарном диабете. На ранних стадиях не ощущается, поэтому нужен ежегодный осмотр глазного дна.',
      kk: 'Қант диабеті кезінде тор қабық тамырларының зақымдануы. Ерте сатыларда сезілмейді, сондықтан көз түбін жыл сайын тексеру қажет.',
      en: 'Damage to retinal blood vessels caused by diabetes. It is silent early on, so a yearly retinal examination is essential.',
    },
    articleSlug: 'diabetic-retinopathy-screening',
    route: ROUTES.treatment,
  },
  {
    id: 'cataract',
    name: { ru: 'Катаракта', kk: 'Катаракта', en: 'Cataract' },
    text: {
      ru: 'Помутнение хрусталика: зрение становится туманным, яркий свет слепит. Единственный эффективный метод лечения — операция с заменой хрусталика.',
      kk: 'Көз бұршағының бұлыңғырлануы: көру тұманданады, жарық шағылысады. Жалғыз тиімді ем — көз бұршағын ауыстыру отасы.',
      en: 'Clouding of the lens: vision becomes hazy and bright light dazzles. The only effective treatment is surgery to replace the lens.',
    },
    articleSlug: 'when-to-operate-cataract',
    route: ROUTES.cataract,
  },
  {
    id: 'keratoconus',
    name: { ru: 'Кератоконус', kk: 'Кератоконус', en: 'Keratoconus' },
    text: {
      ru: 'Истончение и выпячивание роговицы в форме конуса. Проявляется растущим астигматизмом; прогрессирование можно остановить кросслинкингом.',
      kk: 'Қасаң қабықтың жұқарып, конус тәрізді томпаюы. Өсіп келе жатқан астигматизммен байқалады; үдеуін кросслинкингпен тоқтатуға болады.',
      en: 'Thinning and cone-shaped bulging of the cornea. It shows up as increasing astigmatism; progression can be halted with cross-linking.',
    },
    articleSlug: 'keratoconus-explained',
    route: ROUTES.laser,
  },
  {
    id: 'strabismus',
    name: { ru: 'Косоглазие', kk: 'Қылилық', en: 'Strabismus (squint)' },
    text: {
      ru: 'Отклонение одного глаза от общей точки фиксации. У детей требует раннего обследования, так как может привести к амблиопии.',
      kk: 'Бір көздің ортақ қарау нүктесінен ауытқуы. Балаларда ерте тексеруді қажет етеді, себебі амблиопияға әкелуі мүмкін.',
      en: 'One eye drifts away from the shared point of focus. In children it needs early assessment because it can lead to amblyopia.',
    },
    articleSlug: 'lazy-eye-and-squint-in-children',
    route: ROUTES.pediatric,
  },
  {
    id: 'myopia',
    name: { ru: 'Миопия (близорукость)', kk: 'Миопия (алыстан көрмеушілік)', en: 'Myopia (short-sightedness)' },
    text: {
      ru: 'Плохое зрение вдаль из-за удлинения глаза. У детей часто прогрессирует; существуют методы замедления роста глаза.',
      kk: 'Көз ұзаруына байланысты алысты нашар көру. Балаларда жиі үдейді; көз өсуін баяулату әдістері бар.',
      en: 'Blurred distance vision because the eye is too long. It often progresses in children, and there are ways to slow eye growth.',
    },
    articleSlug: 'child-myopia-progression',
    route: ROUTES.pediatric,
  },
  {
    id: 'retinal-detachment',
    name: { ru: 'Отслойка сетчатки', kk: 'Тор қабықтың сылынуы', en: 'Retinal detachment' },
    text: {
      ru: 'Отделение сетчатки от задней стенки глаза. Вспышки, внезапные «мушки» и «шторка» — повод обратиться за помощью в тот же день.',
      kk: 'Тор қабықтың көздің артқы қабырғасынан ажырауы. Жарқыл, кенет пайда болған «шыбындар» және «перде» — сол күні көмекке жүгінуге себеп.',
      en: 'The retina lifts away from the back of the eye. Flashes, sudden floaters or a "curtain" mean you should seek help the same day.',
    },
    articleSlug: 'retinal-detachment-warning-signs',
    route: ROUTES.treatment,
  },
  {
    id: 'presbyopia',
    name: { ru: 'Пресбиопия', kk: 'Пресбиопия', en: 'Presbyopia' },
    text: {
      ru: 'Возрастное ослабление фокусировки вблизи после 40 лет. Это не болезнь, а естественное изменение хрусталика; корректируется очками или линзами.',
      kk: '40 жастан кейін жақынды фокустаудың жасқа байланысты әлсіреуі. Бұл ауру емес, көз бұршағының табиғи өзгерісі; көзілдірікпен немесе линзамен түзетіледі.',
      en: 'The age-related loss of near focus after 40. It is not a disease but a natural change in the lens, corrected with glasses or lenses.',
    },
    articleSlug: 'presbyopia-after-40',
    route: ROUTES.optical,
  },
  {
    id: 'dry-eye',
    name: { ru: 'Синдром сухого глаза', kk: 'Құрғақ көз синдромы', en: 'Dry eye disease' },
    text: {
      ru: 'Нарушение слёзной плёнки: жжение, песок в глазах, колебания чёткости. Усиливается при работе за экраном и в сухом воздухе.',
      kk: 'Жас қабықшасының бұзылуы: ашу, көзде құм сезімі, айқындықтың құбылуы. Экранмен жұмыс істегенде және құрғақ ауада күшейеді.',
      en: 'A disturbed tear film: burning, grittiness and fluctuating clarity. Screen work and dry air make it worse.',
    },
    articleSlug: 'screen-dry-eye',
    route: ROUTES.treatment,
  },
];

/* ============================================================ KB FAQ */

export const knowledgeFaq: Array<{ q: Localized; a: Localized }> = [
  {
    q: {
      ru: 'Кто пишет статьи базы знаний?',
      kk: 'Білім қорының мақалаларын кім жазады?',
      en: 'Who writes the knowledge-base articles?',
    },
    a: {
      ru: 'Редакция и врачи центра, по клиническим рекомендациям и с указанием источников. В каждой статье указаны автор и статус медицинской проверки: имя рецензента и дата появляются после его подписи.',
      kk: 'Редакция мен орталық дәрігерлері, клиникалық ұсынымдар бойынша және дереккөздерді көрсете отырып. Әр мақалада автор мен медициналық тексеру мәртебесі көрсетіледі: рецензенттің аты мен күні ол қол қойғаннан кейін пайда болады.',
      en: "The editorial team and the centre's doctors, working from clinical guidelines and citing sources. Each article shows its author and medical-review status; the reviewer's name and date appear once they sign it off.",
    },
  },
  {
    q: {
      ru: 'Можно ли по статье поставить себе диагноз?',
      kk: 'Мақала бойынша өзіме диагноз қоюға бола ма?',
      en: 'Can I diagnose myself from an article?',
    },
    a: {
      ru: 'Нет. Материалы помогают понять заболевание и подготовиться к приёму, но диагноз ставит врач после осмотра и обследования.',
      kk: 'Жоқ. Материалдар ауруды түсінуге және қабылдауға дайындалуға көмектеседі, бірақ диагнозды дәрігер тексеруден кейін қояды.',
      en: 'No. The materials help you understand a condition and prepare for a visit, but a diagnosis is made by a doctor after an examination.',
    },
  },
  {
    q: {
      ru: 'Как часто обновляются материалы?',
      kk: 'Материалдар қаншалықты жиі жаңартылады?',
      en: 'How often are the materials updated?',
    },
    a: {
      ru: 'Мы планируем пересматривать статьи не реже раза в год и при выходе новых клинических рекомендаций. Дата публикации и статус проверки указаны в начале материала.',
      kk: 'Мақалаларды жылына кемінде бір рет және жаңа клиникалық ұсынымдар шыққанда қайта қарауды жоспарлаймыз. Жариялау күні мен тексеру мәртебесі материалдың басында көрсетілген.',
      en: 'We plan to revisit articles at least once a year and whenever new clinical guidelines appear. The publication date and review status are shown at the top of each material.',
    },
  },
  {
    q: {
      ru: 'Какие симптомы требуют срочного обращения?',
      kk: 'Қандай белгілер кезінде шұғыл жүгіну керек?',
      en: 'Which symptoms need urgent attention?',
    },
    a: {
      ru: 'Внезапная потеря или резкое ухудшение зрения, вспышки света, множество новых «мушек», «шторка» перед глазом, сильная боль и покраснение, травма или химический ожог глаза.',
      kk: 'Көрудің кенеттен жоғалуы немесе күрт нашарлауы, жарқыл, көптеген жаңа «шыбындар», көз алдындағы «перде», қатты ауырсыну мен қызару, көз жарақаты немесе химиялық күйік.',
      en: 'Sudden loss or sharp worsening of vision, flashes of light, a shower of new floaters, a "curtain" over your sight, severe pain and redness, an eye injury or a chemical burn.',
    },
  },
  {
    q: {
      ru: 'Можно ли предложить тему для статьи?',
      kk: 'Мақала тақырыбын ұсынуға бола ма?',
      en: 'Can I suggest a topic?',
    },
    a: {
      ru: 'Да. Напишите нам через форму обратной связи на странице контактов — самые частые вопросы пациентов становятся новыми материалами.',
      kk: 'Иә. Байланыс бетіндегі кері байланыс формасы арқылы жазыңыз — пациенттердің ең жиі сұрақтары жаңа материалдарға айналады.',
      en: "Yes. Write to us through the feedback form on the contacts page — patients' most common questions become new materials.",
    },
  },
];
