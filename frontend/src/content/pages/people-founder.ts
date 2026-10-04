/**
 * Founder page copy (/dr-kulmaganbetov). Split from people.ts so the founder
 * route does not download the network, partnership and staff copy.
 *
 * Only the verified facts of DESIGN.md §5 and §7 are stated, each traceable to
 * a linked source (24.kz report and article, eyeinst.kz profile, the three 2026
 * papers, Threads). No awards, conferences, partners, quotes or operation
 * counts are claimed. Collections are plain arrays so a CMS can own them later.
 */
import type { Localized } from '@/i18n';
import { FOUNDER_BRIEF, FOUNDER_SOURCES } from './people';

const l = (ru: string, kk: string, en: string): Localized => ({ ru, kk, en });

/* ======================================================================
   FOUNDER — /dr-kulmaganbetov
   ====================================================================== */

export const FOUNDER = {
  ...FOUNDER_BRIEF,
  threads: FOUNDER_SOURCES.threads,
  seoTitle: l(
    'Dr Mukhit Kulmaganbetov — учёный и офтальмолог',
    'Dr Mukhit Kulmaganbetov — ғалым және офтальмолог',
    'Dr Mukhit Kulmaganbetov — scientist and ophthalmologist',
  ),
  seoDescription: l(
    'MD, PhD (Cardiff University), AFHEA. Запатентованное устройство квантовой оптики для раннего выявления ВМД, испытания в Гонконге и Канаде, публикации 2026.',
    'MD, PhD (Cardiff University), AFHEA. ЖМД-ны ерте анықтауға арналған патенттелген кванттық оптика құрылғысы, Гонконг пен Канададағы сынақтар, 2026 жарияланымдары.',
    'MD, PhD (Cardiff University), AFHEA. A patented quantum-optics device for early AMD detection, tested in Hong Kong and Canada; papers published in 2026.',
  ),
  eyebrow: l('Основатель центра', 'Орталықтың негізін қалаушы', 'Founder of the centre'),
  title: l(
    'Учёный, стоящий за миссией сохранения зрения',
    'Көруді сақтау миссиясының артындағы ғалым',
    'The scientist behind the mission to preserve sight',
  ),
  lead: l(
    'Офтальмолог и исследователь в области наук о зрении. Разработал устройство на основе квантовой оптики для раннего выявления возрастной макулярной дегенерации: его испытали в клиниках Гонконга и Канады, на разработку получен патент. Сейчас готовит к открытию офтальмологический центр в Астане.',
    'Офтальмолог және көру ғылымдары саласындағы зерттеуші. Жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған кванттық оптика негізіндегі құрылғыны әзірледі: ол Гонконг пен Канада клиникаларында сыналды, әзірлемеге патент алынды. Қазір Астанада офтальмологиялық орталық ашуға дайындалуда.',
    'An ophthalmologist and vision scientist. He developed a quantum-optics device for the early detection of age-related macular degeneration; it was tested in clinics in Hong Kong and Canada and has been patented. He is now preparing to open an ophthalmic centre in Astana.',
  ),
  toPublications: l('Публикации', 'Жарияланымдар', 'Publications'),
  toMedia: l('Медиа и источники', 'Медиа және дереккөздер', 'Media and sources'),

  credentialsLabel: l('Квалификация и патент', 'Біліктілік және патент', 'Credentials and patent'),
  credentials: [
    {
      id: 'md',
      abbr: l('MD', 'MD', 'MD'),
      title: l('Доктор медицины в офтальмологии', 'Офтальмология бойынша медицина докторы', 'Doctor of Medicine in Ophthalmology'),
      text: l('Шесть лет профессионального опыта', 'Алты жылдық кәсіби тәжірибе', 'Six years of professional experience'),
    },
    {
      id: 'phd',
      abbr: l('PhD', 'PhD', 'PhD'),
      title: l('PhD в науках о зрении', 'Көру ғылымдары бойынша PhD', 'PhD in Vision Sciences'),
      text: l('Cardiff University, Великобритания', 'Cardiff University, Ұлыбритания', 'Cardiff University, United Kingdom'),
    },
    {
      id: 'afhea',
      abbr: l('AFHEA', 'AFHEA', 'AFHEA'),
      title: l(
        'Associate Fellow of the Higher Education Academy',
        'Associate Fellow of the Higher Education Academy',
        'Associate Fellow of the Higher Education Academy',
      ),
      text: l(
        'Признанная квалификация в университетском преподавании',
        'Университеттік оқытудағы танылған біліктілік',
        'Recognised qualification in university teaching',
      ),
    },
    {
      id: 'patent',
      abbr: l('Патент', 'Патент', 'Patent'),
      title: l(
        'На устройство для раннего выявления ВМД',
        'ЖМД-ны ерте анықтауға арналған құрылғыға',
        'For a device for the early detection of AMD',
      ),
      text: l('Квантовая оптика, по данным 24.kz', 'Кванттық оптика, 24.kz деректері бойынша', 'Quantum optics, as reported by 24.kz'),
    },
  ],
  honoursNote: l(
    'Здесь перечислены только подтверждённые сведения. Награды, гранты и членства добавляются клиникой после проверки документов.',
    'Мұнда тек расталған мәліметтер көрсетілген. Марапаттар, гранттар мен мүшеліктерді клиника құжаттарды тексергеннен кейін қосады.',
    'Only verified details are listed here. Awards, grants and memberships are added by the clinic once documents are checked.',
  ),

  manifestoEyebrow: l('Манифест центра', 'Орталық манифесі', 'The centre’s manifesto'),
  manifesto: l(
    'Зрение теряют тихо — годами, без боли и без симптомов. Поэтому задача науки не только лечить, но и находить болезнь раньше, чем её заметит сам человек, и делать это доступным в Казахстане.',
    'Көру қабілеті үнсіз жоғалады — жылдар бойы, ауырсынусыз және белгісіз. Сондықтан ғылымның міндеті тек емдеу емес, ауруды адамның өзі байқағанға дейін анықтау және мұны Қазақстанда қолжетімді ету.',
    'Sight is lost quietly — over years, without pain or symptoms. So the task of science is not only to treat, but to find disease before a person notices it, and to make that available in Kazakhstan.',
  ),

  pathEyebrow: l('Научный путь', 'Ғылыми жол', 'Scientific path'),
  pathTitle: l(
    'Один вопрос, семь шагов: как увидеть болезнь раньше',
    'Бір сұрақ, жеті қадам: ауруды қалай ертерек көруге болады',
    'One question, seven steps: how to see disease earlier',
  ),
  path: [
    {
      id: 'practice',
      label: l('Практика и преподавание', 'Тәжірибе және оқыту', 'Practice and teaching'),
      title: l('Врач, который учит врачей', 'Дәрігерлерді оқытатын дәрігер', 'A doctor who teaches doctors'),
      text: l(
        'MD в офтальмологии и шесть лет профессионального опыта. Лектор и методист отдела последипломного образования Казахского научно-исследовательского института глазных болезней; специализация — цифровые технологии в диагностике болезней глаз.',
        'Офтальмология бойынша MD және алты жылдық кәсіби тәжірибе. Қазақ көз аурулары ғылыми-зерттеу институтының жоғары оқу орнынан кейінгі білім беру бөлімінің лекторы және әдіскері; мамандануы — көз ауруларын диагностикалаудағы цифрлық технологиялар.',
        'MD in Ophthalmology with six years of professional experience. Lecturer and methodologist in the Department of Postgraduate Education at the Kazakh Research Institute of Eye Diseases, specialising in digital technologies for diagnosing eye disease.',
      ),
      evidence: {
        mark: l('MD', 'MD', 'MD'),
        source: l('Казахский НИИ глазных болезней', 'Қазақ көз аурулары ҒЗИ', 'Kazakh Research Institute of Eye Diseases'),
      },
    },
    {
      id: 'phd',
      label: l('Наука о зрении', 'Көру ғылымы', 'Vision science'),
      title: l('PhD в Кардиффском университете', 'Кардифф университетіндегі PhD', 'A PhD at Cardiff University'),
      text: l(
        'Докторская степень по наукам о зрении (Vision Sciences) в Cardiff University, Великобритания. Статус AFHEA подтверждает квалификацию в университетском преподавании.',
        'Cardiff University-де (Ұлыбритания) көру ғылымдары (Vision Sciences) бойынша докторлық дәреже. AFHEA мәртебесі университеттік оқытудағы біліктілікті растайды.',
        'A doctorate in Vision Sciences at Cardiff University, United Kingdom. AFHEA status recognises his university teaching.',
      ),
      evidence: {
        mark: l('PhD', 'PhD', 'PhD'),
        source: l('Cardiff University · AFHEA', 'Cardiff University · AFHEA', 'Cardiff University · AFHEA'),
      },
    },
    {
      id: 'device',
      label: l('Разработка', 'Әзірлеме', 'The device'),
      title: l('Свет в суперпозиции', 'Суперпозициядағы жарық', 'Light in superposition'),
      text: l(
        'Устройство на основе квантовой оптики для раннего выявления возрастной макулярной дегенерации: поляризованный и неполяризованный свет в суперпозиции, система фильтров и линз. На разработку получен патент.',
        'Жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған кванттық оптика негізіндегі құрылғы: суперпозициядағы поляризацияланған және поляризацияланбаған жарық, сүзгілер мен линзалар жүйесі. Әзірлемеге патент алынды.',
        'A quantum-optics device for the early detection of age-related macular degeneration: polarised and non-polarised light in superposition, with a system of filters and lenses. The development has been patented.',
      ),
      evidence: {
        mark: l('Патент', 'Патент', 'Patent'),
        source: l('Раннее выявление ВМД', 'ЖМД-ны ерте анықтау', 'Early detection of AMD'),
      },
    },
    {
      id: 'trials',
      label: l('Испытания', 'Сынақтар', 'Testing'),
      title: l('Гонконг и Канада: 200 пациентов', 'Гонконг пен Канада: 200 пациент', 'Hong Kong and Canada: 200 patients'),
      text: l(
        'Устройство испытали в клиниках Гонконга и Канады, обследовано 200 пациентов. По данным 24.kz, работа вызвала интерес у специалистов из США, Европы, Китая, Канады и Японии.',
        'Құрылғы Гонконг пен Канада клиникаларында сыналды, 200 пациент тексерілді. 24.kz деректері бойынша, жұмыс АҚШ, Еуропа, Қытай, Канада және Жапония мамандарының қызығушылығын тудырды.',
        'The device was tested in clinics in Hong Kong and Canada, with 200 patients examined. According to 24.kz, the work drew interest from specialists in the USA, Europe, China, Canada and Japan.',
      ),
      evidence: {
        mark: l('200', '200', '200'),
        source: l('пациентов · Гонконг и Канада', 'пациент · Гонконг пен Канада', 'patients · Hong Kong and Canada'),
      },
    },
    {
      id: 'myopia',
      label: l('Миопия', 'Миопия', 'Myopia'),
      title: l('Следующая задача — близорукость', 'Келесі міндет — жақыннан көрмеушілік', 'Next: short-sightedness'),
      text: l(
        'Технология диагностики и лечения миопии на основе квантовой оптики. Сейчас работа на стадии исследований на животных — до применения у пациентов ещё несколько этапов.',
        'Кванттық оптика негізінде миопияны диагностикалау және емдеу технологиясы. Қазір жұмыс жануарларға жүргізілетін зерттеулер кезеңінде — пациенттерде қолдануға дейін әлі бірнеше кезең бар.',
        'A quantum-optics technology for diagnosing and treating myopia. The work is at the animal-study stage; several steps remain before it can be used with patients.',
      ),
      evidence: {
        mark: l('Миопия', 'Миопия', 'Myopia'),
        source: l('Стадия исследований на животных', 'Жануарлардағы зерттеулер кезеңі', 'Animal-study stage'),
      },
    },
    {
      id: 'papers',
      label: l('Публикации', 'Жарияланымдар', 'Publications'),
      title: l('Три статьи 2026 года', '2026 жылғы үш мақала', 'Three papers in 2026'),
      text: l(
        'Соавторство в Scientific Reports (надёжность энтоптических задач со структурированным светом), Diagnostics (машинное обучение и сетчатка) и Healthcare (когортное исследование о хронической болезни почек и COVID-19).',
        'Scientific Reports (құрылымдалған жарықпен энтоптикалық тапсырмалардың сенімділігі), Diagnostics (машиналық оқыту және тор қабық) және Healthcare (бүйректің созылмалы ауруы мен COVID-19 туралы когорттық зерттеу) жұмыстарының авторларының бірі.',
        'Co-author in Scientific Reports (reliability of structured-light entoptic tasks), Diagnostics (machine learning and the retina) and Healthcare (a cohort study of chronic kidney disease and COVID-19).',
      ),
      evidence: {
        mark: l('2026', '2026', '2026'),
        source: l('Scientific Reports · Diagnostics · Healthcare', 'Scientific Reports · Diagnostics · Healthcare', 'Scientific Reports · Diagnostics · Healthcare'),
      },
    },
    {
      id: 'astana',
      label: l('Астана', 'Астана', 'Astana'),
      title: l('Центр для клиники и инноваций', 'Клиника мен инновацияларға арналған орталық', 'A centre for clinic and innovation'),
      text: l(
        'Следующий шаг — офтальмологический центр в Астане, где клиническая работа и инновационные проекты будут идти рядом. Центр готовится к открытию.',
        'Келесі қадам — клиникалық жұмыс пен инновациялық жобалар қатар жүретін Астанадағы офтальмологиялық орталық. Орталық ашылуға дайындалуда.',
        'The next step is an ophthalmic centre in Astana where clinical work and innovation projects run side by side. The centre is preparing to open.',
      ),
      evidence: {
        mark: l('Астана', 'Астана', 'Astana'),
        source: l('Центр готовится к открытию', 'Орталық ашылуға дайындалуда', 'Preparing to open'),
      },
    },
  ],

  globalEyebrow: l('Глобальный опыт', 'Жаһандық тәжірибе', 'Global experience'),
  globalTitle: l(
    'Кардифф, Гонконг, Канада — и обратно в Казахстан',
    'Кардифф, Гонконг, Канада — және қайтадан Қазақстанға',
    'Cardiff, Hong Kong, Canada — and back to Kazakhstan',
  ),
  globalText: l(
    'Образование в Великобритании, испытания устройства в клиниках Гонконга и Канады, интерес специалистов из разных стран. Всё это возвращается туда, где находится пациент, — в новый центр в Астане.',
    'Ұлыбританиядағы білім, Гонконг пен Канада клиникаларындағы құрылғы сынақтары, әр елдің мамандарының қызығушылығы. Мұның бәрі пациент тұрған жерге — Астанадағы жаңа орталыққа қайтып оралады.',
    'Training in the UK, testing of the device in clinics in Hong Kong and Canada, interest from specialists in several countries. All of it comes back to where the patient is: the new centre in Astana.',
  ),
  routeLabel: l(
    'Схема: Кардифф (Великобритания), Гонконг и Канада соединены с Астаной',
    'Сызба: Кардифф (Ұлыбритания), Гонконг және Канада Астанамен байланысқан',
    'Diagram: Cardiff (UK), Hong Kong and Canada connected to Astana',
  ),
  routePoints: [
    { id: 'uk', lat: 51.48, lng: -3.18, name: l('Кардифф', 'Кардифф', 'Cardiff'), note: l('PhD', 'PhD', 'PhD'), hub: false },
    { id: 'ca', lat: 53.5, lng: -100, name: l('Канада', 'Канада', 'Canada'), note: l('испытания', 'сынақ', 'testing'), hub: false },
    { id: 'hk', lat: 22.32, lng: 114.17, name: l('Гонконг', 'Гонконг', 'Hong Kong'), note: l('испытания', 'сынақ', 'testing'), hub: false },
    { id: 'kz', lat: 51.17, lng: 71.45, name: l('Астана', 'Астана', 'Astana'), note: l('центр', 'орталық', 'centre'), hub: true },
  ],
  globalPlaces: [
    {
      id: 'uk',
      place: l('Великобритания', 'Ұлыбритания', 'United Kingdom'),
      title: l('Cardiff University', 'Cardiff University', 'Cardiff University'),
      text: l('PhD в науках о зрении, статус AFHEA', 'Көру ғылымдары бойынша PhD, AFHEA мәртебесі', 'PhD in Vision Sciences, AFHEA'),
    },
    {
      id: 'trials',
      place: l('Гонконг и Канада', 'Гонконг пен Канада', 'Hong Kong and Canada'),
      title: l('Испытания устройства', 'Құрылғы сынақтары', 'Testing the device'),
      text: l('200 пациентов обследовано в клиниках', 'Клиникаларда 200 пациент тексерілді', '200 patients examined in clinics'),
    },
    {
      id: 'interest',
      place: l('США · Европа · Китай · Канада · Япония', 'АҚШ · Еуропа · Қытай · Канада · Жапония', 'USA · Europe · China · Canada · Japan'),
      title: l('Интерес специалистов', 'Мамандардың қызығушылығы', 'Interest from specialists'),
      text: l('По данным 24.kz', '24.kz деректері бойынша', 'As reported by 24.kz'),
    },
    {
      id: 'kz',
      place: l('Казахстан', 'Қазақстан', 'Kazakhstan'),
      title: l('Преподавание и новый центр', 'Оқыту және жаңа орталық', 'Teaching and a new centre'),
      text: l(
        'Казахский НИИ глазных болезней; центр в Астане готовится к открытию',
        'Қазақ көз аурулары ҒЗИ; Астанадағы орталық ашылуға дайындалуда',
        'Kazakh Research Institute of Eye Diseases; the Astana centre is preparing to open',
      ),
    },
  ],

  researchEyebrow: l('Направления исследований', 'Зерттеу бағыттары', 'Research focus'),
  researchTitle: l(
    'Квантовая оптика, цифровая диагностика и науки о зрении',
    'Кванттық оптика, цифрлық диагностика және көру ғылымдары',
    'Quantum optics, digital diagnosis and vision science',
  ),
  research: [
    {
      id: 'amd',
      eyebrow: l('Квантовая оптика', 'Кванттық оптика', 'Quantum optics'),
      title: l('Раннее выявление ВМД', 'ЖМД-ны ерте анықтау', 'Early detection of AMD'),
      text: l(
        'Запатентованное устройство: поляризованный и неполяризованный свет в суперпозиции. Испытано в клиниках Гонконга и Канады.',
        'Патенттелген құрылғы: суперпозициядағы поляризацияланған және поляризацияланбаған жарық. Гонконг пен Канада клиникаларында сыналды.',
        'A patented device using polarised and non-polarised light in superposition, tested in clinics in Hong Kong and Canada.',
      ),
    },
    {
      id: 'myopia',
      eyebrow: l('Квантовая оптика', 'Кванттық оптика', 'Quantum optics'),
      title: l('Диагностика и лечение миопии', 'Миопияны диагностикалау және емдеу', 'Diagnosing and treating myopia'),
      text: l(
        'Новая технология на стадии исследований на животных.',
        'Жануарларға жүргізілетін зерттеулер кезеңіндегі жаңа технология.',
        'A new technology at the animal-study stage.',
      ),
    },
    {
      id: 'digital',
      eyebrow: l('Цифровые технологии', 'Цифрлық технологиялар', 'Digital technology'),
      title: l('Цифровая диагностика болезней глаз', 'Көз ауруларын цифрлық диагностикалау', 'Digital diagnosis of eye disease'),
      text: l(
        'Специализация в преподавании врачам: как цифровые методы помогают ставить диагноз раньше и точнее.',
        'Дәрігерлерді оқытудағы мамандану: цифрлық әдістер диагнозды ертерек әрі дәлірек қоюға қалай көмектеседі.',
        'His teaching specialism: how digital methods help doctors reach a diagnosis earlier and more precisely.',
      ),
    },
    {
      id: 'vision',
      eyebrow: l('Науки о зрении', 'Көру ғылымдары', 'Vision science'),
      title: l('Свет и восприятие', 'Жарық және қабылдау', 'Light and perception'),
      text: l(
        'Структурированный свет и энтоптические задачи: насколько надёжно человек может оценить собственное зрение.',
        'Құрылымдалған жарық және энтоптикалық тапсырмалар: адам өз көруін қаншалықты сенімді бағалай алады.',
        'Structured light and entoptic tasks: how reliably a person can judge their own vision.',
      ),
    },
    {
      id: 'data',
      eyebrow: l('Данные', 'Деректер', 'Data'),
      title: l('Машинное обучение и когорты', 'Машиналық оқыту және когорттар', 'Machine learning and cohorts'),
      text: l(
        'Классификация изображений сетчатки алгоритмами и когортные исследования хронических заболеваний.',
        'Тор қабық кескіндерін алгоритмдермен жіктеу және созылмалы аурулардың когорттық зерттеулері.',
        'Algorithmic classification of retinal images and cohort studies of chronic disease.',
      ),
    },
  ],

  visionEyebrow: l('Видение центра', 'Орталықтың көзқарасы', 'The centre’s vision'),
  visionStatement: l(
    'Каждый человек в Казахстане должен иметь возможность проверить зрение вовремя — с методами, которые не уступают лучшим мировым центрам.',
    'Қазақстандағы әр адам көруін уақытында тексере алуы керек — әлемнің үздік орталықтарынан кем түспейтін әдістермен.',
    'Everyone in Kazakhstan should be able to have their sight checked in time — with methods on a par with the world’s best centres.',
  ),
  visionPillars: [
    {
      id: 'early',
      title: l('Раннее выявление', 'Ерте анықтау', 'Early detection'),
      text: l(
        'Находить болезни сетчатки и другие угрозы зрению до того, как человек заметит симптомы, — пока зрение ещё можно сохранить.',
        'Тор қабық ауруларын және көруге төнетін басқа қатерлерді адам белгілерді байқағанға дейін — көруді әлі сақтауға болатын кезде табу.',
        'Finding retinal disease and other threats to sight before symptoms appear, while sight can still be saved.',
      ),
    },
    {
      id: 'local',
      title: l('Собственные технологии', 'Өз технологияларымыз', 'Home-grown technology'),
      text: l(
        'Разработки, созданные в Казахстане и проверенные в зарубежных клиниках, — чтобы передовая диагностика не зависела только от импорта.',
        'Қазақстанда жасалып, шетелдік клиникаларда тексерілген әзірлемелер — озық диагностика тек импортқа тәуелді болмауы үшін.',
        'Developments made in Kazakhstan and tested in clinics abroad, so advanced diagnosis does not depend on imports alone.',
      ),
    },
    {
      id: 'open',
      title: l('Открытая наука', 'Ашық ғылым', 'Open science'),
      text: l(
        'Публикации, обучение врачей и понятные материалы для пациентов: знание, которое остаётся внутри клиники, никого не лечит.',
        'Жарияланымдар, дәрігерлерді оқыту және пациенттерге түсінікті материалдар: клиника ішінде қалған білім ешкімді емдемейді.',
        'Publications, training for doctors and clear material for patients: knowledge kept inside a clinic heals no one.',
      ),
    },
  ],

  publicationsEyebrow: l('Публикации', 'Жарияланымдар', 'Publications'),
  publicationsTitle: l('Исследования и материалы', 'Зерттеулер мен материалдар', 'Research and media'),
  publicationsText: l(
    'Рецензируемые статьи и медиаматериалы с прямыми ссылками на первоисточник. Список пополняется по мере выхода новых работ.',
    'Түпнұсқаға тікелей сілтемелері бар рецензияланған мақалалар мен медиа материалдар. Тізім жаңа жұмыстар шыққан сайын толықтырылады.',
    'Peer-reviewed papers and media with direct links to the source. The list grows as new work is published.',
  ),
  filterType: l('Тип', 'Түрі', 'Type'),
  filterTopic: l('Тема', 'Тақырып', 'Topic'),
  searchLabel: l('Поиск по публикациям', 'Жарияланымдар бойынша іздеу', 'Search publications'),
  searchPlaceholder: l('Название, журнал или тема', 'Атауы, журнал немесе тақырып', 'Title, journal or topic'),
  materials: l('Материалов', 'Материалдар', 'Items'),
  credentialsLine: 'MD · PhD · AFHEA',
  coauthor: l('Соавтор', 'Авторлардың бірі', 'Co-author'),
  featured: l('Сюжет', 'Сюжет', 'Feature'),

  conferencesTitle: l('Доклады', 'Баяндамалар', 'Talks'),
  conferencesEmpty: l(
    'Подтверждённые доклады появятся здесь после согласования с организаторами. Пригласить к выступлению можно по темам работ и разработок:',
    'Расталған баяндамалар ұйымдастырушылармен келісілгеннен кейін осында пайда болады. Жұмыстар мен әзірлемелер тақырыптары бойынша сөз сөйлеуге шақыруға болады:',
    'Confirmed talks will appear here once organisers agree them. Invitations are welcome on the topics of his work:',
  ),
  topicsLabel: l('Темы работ и разработок', 'Жұмыстар мен әзірлемелер тақырыптары', 'Topics of his work'),
  speakingTopics: [
    l('Квантовая оптика в ранней диагностике ВМД', 'ЖМД-ны ерте диагностикалаудағы кванттық оптика', 'Quantum optics in early AMD diagnosis'),
    l('Цифровые технологии в диагностике болезней глаз', 'Көз ауруларын диагностикалаудағы цифрлық технологиялар', 'Digital technology in diagnosing eye disease'),
    l('Структурированный свет и энтоптические задачи', 'Құрылымдалған жарық және энтоптикалық тапсырмалар', 'Structured light and entoptic tasks'),
  ],
  inviteSpeaker: l('Пригласить спикером', 'Спикер ретінде шақыру', 'Invite as a speaker'),

  mediaEyebrow: l('Медиа и источники', 'Медиа және дереккөздер', 'Media and sources'),
  mediaTitle: l('Сюжеты, заметки и первоисточники', 'Сюжеттер, жазбалар және түпнұсқалар', 'Reports, notes and primary sources'),
  playVideo: l('Смотреть видео', 'Бейнені көру', 'Play video'),
  videoConsent: l(
    'Видео загрузится с YouTube после нажатия.',
    'Бейне басқаннан кейін YouTube-тан жүктеледі.',
    'The video loads from YouTube once you press play.',
  ),
  readArticle: l('Статья на 24.kz', '24.kz-тегі мақала', 'Article on 24.kz'),
  threadsTitle: l('Threads', 'Threads', 'Threads'),
  threadsText: l(
    'Короткие заметки о науке, зрении и технологиях.',
    'Ғылым, көру және технологиялар туралы қысқа жазбалар.',
    'Short notes on science, sight and technology.',
  ),
  threadsLink: l('Читать в Threads', 'Threads-те оқу', 'Read on Threads'),
  sourcesTitle: l('Источники сведений на этой странице', 'Осы беттегі мәліметтердің дереккөздері', 'Sources for this page'),
  sourcesNote: l(
    'Все факты о докторе Кулмаганбетове взяты из этих открытых источников.',
    'Доктор Құлмағанбетов туралы барлық деректер осы ашық дереккөздерден алынған.',
    'Every fact about Dr Kulmaganbetov on this page comes from these public sources.',
  ),

  ctaTitle: l(
    'Консультация в центре доктора Кулмаганбетова',
    'Доктор Құлмағанбетов орталығында кеңес алу',
    'A consultation at Dr Kulmaganbetov’s centre',
  ),
};

export type PublicationKind = 'article' | 'media';
export type PublicationTopic = 'vision' | 'ai' | 'neuro' | 'physics' | 'clinical' | 'innovation';

export const PUBLICATION_KINDS: Record<PublicationKind, Localized> = {
  article: l('Статья', 'Мақала', 'Paper'),
  media: l('Медиа', 'Медиа', 'Media'),
};

export const PUBLICATION_TOPICS: Record<PublicationTopic, Localized> = {
  vision: l('Науки о зрении', 'Көру ғылымдары', 'Vision science'),
  ai: l('ИИ и данные', 'ЖИ және деректер', 'AI & data'),
  neuro: l('Нейроофтальмология', 'Нейроофтальмология', 'Neuro-ophthalmology'),
  physics: l('Физика света', 'Жарық физикасы', 'Physics of light'),
  clinical: l('Клиническая эпидемиология', 'Клиникалық эпидемиология', 'Clinical epidemiology'),
  innovation: l('Разработки', 'Әзірлемелер', 'Innovation'),
};

export interface Publication {
  id: string;
  kind: PublicationKind;
  /** Publication year; omitted when the source does not state it. */
  year?: number;
  /** Original title, never translated. */
  title: string;
  venue: string;
  url: string;
  /** DOI, only when it is part of the source URL itself (nature.com/articles/<suffix>). */
  doi?: string;
  topics: PublicationTopic[];
  summary: Localized;
}

/**
 * Real publications and media (DESIGN.md §5, §7). Do not add items that
 * cannot be linked to a public source.
 */
export const FOUNDER_PUBLICATIONS: Publication[] = [
  {
    id: 'sci-rep-2026-entoptic',
    kind: 'article',
    year: 2026,
    title: 'Evaluating the reliability of structured light entoptic tasks',
    venue: 'Scientific Reports',
    url: 'https://www.nature.com/articles/s41598-026-63276-7',
    doi: '10.1038/s41598-026-63276-7',
    topics: ['vision', 'physics'],
    summary: l(
      'Насколько надёжны и воспроизводимы энтоптические задачи со структурированным светом — методы, в которых человек оценивает собственное восприятие специально сформированного света.',
      'Құрылымдалған жарықпен энтоптикалық тапсырмалар қаншалықты сенімді және қайталанатын — адам арнайы қалыптастырылған жарықты өз қабылдауын бағалайтын әдістер.',
      'How reliable and reproducible structured-light entoptic tasks are — methods in which a person judges their own perception of specially shaped light.',
    ),
  },
  {
    id: 'diagnostics-2026-rgc',
    kind: 'article',
    year: 2026,
    title:
      "The Machine Learning Classification of Retinal Ganglion Cell Dendritic Texture in a 3xTg-Alzheimer's Disease Mouse Model",
    venue: 'Diagnostics (MDPI)',
    url: 'https://www.mdpi.com/2075-4418/16/16/2672',
    topics: ['ai', 'neuro'],
    summary: l(
      'Классификация текстуры дендритов ганглиозных клеток сетчатки методами машинного обучения на мышиной модели болезни Альцгеймера (3xTg).',
      'Альцгеймер ауруының тышқан моделінде (3xTg) тор қабықтың ганглийлік жасушалары дендриттерінің текстурасын машиналық оқыту әдістерімен жіктеу.',
      'Machine-learning classification of retinal ganglion cell dendritic texture in a 3xTg Alzheimer’s disease mouse model.',
    ),
  },
  {
    id: 'healthcare-2026-ckd',
    kind: 'article',
    year: 2026,
    title: 'Impact of Chronic Kidney Disease Severity on COVID-19 Outcomes: A Retrospective Cohort Study',
    venue: 'Healthcare (MDPI)',
    url: 'https://www.mdpi.com/2227-9032/14/16/2575',
    topics: ['clinical'],
    summary: l(
      'Ретроспективное когортное исследование: как тяжесть хронической болезни почек связана с исходами COVID-19.',
      'Ретроспективті когорттық зерттеу: бүйректің созылмалы ауруының ауырлығы COVID-19 нәтижелерімен қалай байланысты.',
      'A retrospective cohort study of how chronic kidney disease severity relates to COVID-19 outcomes.',
    ),
  },
  {
    id: '24kz-article',
    kind: 'media',
    title: 'Разработка казахстанца для выявления болезней глаз проходит испытания в Гонконге',
    venue: '24.kz',
    url: FOUNDER_SOURCES.article24kz,
    topics: ['innovation', 'physics'],
    summary: l(
      'Статья 24.kz: устройство на основе квантовой оптики для раннего выявления возрастной макулярной дегенерации, испытания в клиниках Гонконга и Канады, 200 обследованных пациентов, патент и исследования миопии.',
      '24.kz мақаласы: жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған кванттық оптика құрылғысы, Гонконг пен Канада клиникаларындағы сынақтар, 200 тексерілген пациент, патент және миопия зерттеулері.',
      '24.kz article: a quantum-optics device for early detection of age-related macular degeneration, testing in clinics in Hong Kong and Canada, 200 patients examined, a patent and myopia research.',
    ),
  },
];

export interface Conference {
  id: string;
  year: number;
  title: string;
  city: Localized;
  role: Localized;
  url?: string;
}

/** Confirmed talks only — filled by the clinic. Empty renders the topics view. */
export const FOUNDER_CONFERENCES: Conference[] = [];

export const FOUNDER_VIDEO = {
  youtubeId: 'YOJAdl__43Q',
  url: 'https://youtu.be/YOJAdl__43Q',
  poster: '/media/video-24kz.jpg',
  channel: '24kz',
  title: 'Разработка казахстанца для выявления болезней глаз проходит испытания в Гонконге',
  caption: l(
    'Сюжет 24kz об устройстве на основе квантовой оптики для раннего выявления возрастной макулярной дегенерации и его испытаниях.',
    'Жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған кванттық оптика құрылғысы және оның сынақтары туралы 24kz сюжеті.',
    '24kz report on the quantum-optics device for early detection of age-related macular degeneration and its testing.',
  ),
};

/** Primary sources listed at the end of the founder page. */
export const FOUNDER_SOURCE_LIST: Array<{ label: string; href: string }> = [
  {
    label: '24.kz — «Разработка казахстанца для выявления болезней глаз проходит испытания в Гонконге»',
    href: FOUNDER_SOURCES.article24kz,
  },
  { label: 'eyeinst.kz — Кулмаганбетов Мухит Аскарович', href: FOUNDER_SOURCES.eyeinst },
  { label: 'Scientific Reports, 2026', href: 'https://www.nature.com/articles/s41598-026-63276-7' },
  { label: 'Diagnostics (MDPI), 2026', href: 'https://www.mdpi.com/2075-4418/16/16/2672' },
  { label: 'Healthcare (MDPI), 2026', href: 'https://www.mdpi.com/2227-9032/14/16/2575' },
  { label: 'Threads — @mukhit_kulmaganbetov', href: FOUNDER_SOURCES.threads },
];
