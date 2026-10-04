import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/complex-diagnostics (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'test',
  lead: {
    ru: 'Около двенадцати исследований за одно посещение и заключение врача — подробная картина состояния глаз, от роговицы до сетчатки и зрительного нерва.',
    kk: 'Бір келуде шамамен он екі зерттеу және дәрігер қорытындысы — қасаң қабықтан бастап тор қабық пен көру жүйкесіне дейінгі көз жағдайының толық көрінісі.',
    en: 'About twelve tests in one visit plus a doctor’s conclusion — a detailed picture of your eyes, from the cornea to the retina and optic nerve.',
  },
  overview: {
    ru: [
      'Комплексная диагностика объединяет базовый осмотр и приборные исследования, которые обычно проводят по отдельности: рефракцию, внутриглазное давление, измерение параметров глаза, оптическую когерентную томографию (ОКТ) и осмотр глазного дна с расширением зрачка.',
      'Такой формат удобен, когда нужно разобраться в причинах жалоб, оценить риск глаукомы или заболеваний сетчатки, а также перед обсуждением операции. Конкретный набор тестов врач может скорректировать с учётом ваших жалоб и уже имеющихся результатов.',
    ],
    kk: [
      'Кешенді диагностика негізгі қарау мен әдетте бөлек жүргізілетін аспаптық зерттеулерді біріктіреді: рефракция, көз ішілік қысым, көз параметрлерін өлшеу, оптикалық когерентті томография (ОКТ) және қарашықты кеңейтіп көз түбін қарау.',
      'Бұл формат шағымдардың себебін анықтау, глаукома немесе тор қабық ауруларының қаупін бағалау қажет болғанда, сондай-ақ отаны талқылар алдында ыңғайлы. Нақты зерттеулер жиынын дәрігер шағымдарыңыз бен бұрынғы нәтижелерді ескеріп өзгертуі мүмкін.',
    ],
    en: [
      'Complete diagnostics brings together a basic examination and instrument tests that are usually done separately: refraction, eye pressure, measurements of the eye, optical coherence tomography (OCT) and a dilated fundus examination.',
      'This format is useful when the cause of symptoms is unclear, when the risk of glaucoma or retinal disease needs assessing, or before surgery is discussed. The doctor may adjust the exact set of tests to your symptoms and any results you already have.',
    ],
  },
  indications: {
    ru: [
      'Необъяснимое снижение или колебания зрения',
      'Подозрение на глаукому или глаукома у близких родственников',
      'Сахарный диабет и другие заболевания с риском поражения сетчатки',
      'Подготовка к лазерной коррекции зрения или операции по поводу катаракты',
      'Возрастные изменения зрения и желание пройти полную проверку',
      'Второе мнение по ранее поставленному диагнозу',
    ],
    kk: [
      'Көрудің себепсіз төмендеуі немесе құбылуы',
      'Глаукомаға күдік немесе жақын туыстарда глаукома болуы',
      'Қант диабеті және тор қабықты зақымдау қаупі бар басқа аурулар',
      'Көруді лазерлік түзетуге немесе катаракта отасына дайындық',
      'Жасқа байланысты көрудің өзгеруі және толық тексеруден өту ниеті',
      'Бұрын қойылған диагноз бойынша екінші пікір',
    ],
    en: [
      'Unexplained loss of vision or fluctuating vision',
      'Suspected glaucoma or glaucoma in close relatives',
      'Diabetes and other conditions that put the retina at risk',
      'Planning for laser vision correction or cataract surgery',
      'Age-related changes in vision and a wish for a thorough check',
      'A second opinion on an existing diagnosis',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'В программу обычно входят следующие группы исследований; точный перечень согласует врач.',
      kk: 'Бағдарламаға әдетте мына зерттеулер топтары кіреді; нақты тізімді дәрігер келіседі.',
      en: 'The programme usually covers the following groups of tests; the doctor confirms the exact list.',
    },
    list: {
      ru: [
        'Острота зрения, авторефрактометрия и подбор коррекции',
        'Внутриглазное давление и толщина роговицы',
        'Биометрия и кератометрия — измерение длины и оптики глаза',
        'ОКТ сетчатки и диска зрительного нерва',
        'Осмотр глазного дна с расширением зрачка',
      ],
      kk: [
        'Көру өткірлігі, авторефрактометрия және түзету құралын таңдау',
        'Көз ішілік қысым және қасаң қабықтың қалыңдығы',
        'Биометрия және кератометрия — көздің ұзындығы мен оптикасын өлшеу',
        'Тор қабық пен көру жүйкесі дискісінің ОКТ-сы',
        'Қарашықты кеңейтіп көз түбін қарау',
      ],
      en: [
        'Visual acuity, autorefraction and spectacle correction',
        'Eye pressure and corneal thickness',
        'Biometry and keratometry — measuring the length and optics of the eye',
        'OCT of the retina and optic disc',
        'Dilated fundus examination',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Результаты обследования помогают врачу выбрать дальнейшую тактику. Решение принимается индивидуально и обсуждается с вами.',
      kk: 'Зерттеу нәтижелері дәрігерге әрі қарайғы тәсілді таңдауға көмектеседі. Шешім жеке қабылданып, сізбен талқыланады.',
      en: 'The results help the doctor choose the next steps. The decision is individual and discussed with you.',
    },
    list: {
      ru: [
        'Динамическое наблюдение, если значимых изменений не выявлено',
        'Подбор очков или контактных линз',
        'Капли или лазерное лечение при глаукоме',
        'Направление к специалисту по сетчатке для уточнения тактики',
        'Обсуждение пригодности к лазерной коррекции или хирургии катаракты',
      ],
      kk: [
        'Елеулі өзгерістер анықталмаса — бақылау',
        'Көзілдірік немесе жанаспалы линза таңдау',
        'Глаукома кезінде тамшылар немесе лазерлік ем',
        'Тәсілді нақтылау үшін тор қабық маманына жолдау',
        'Лазерлік түзетуге немесе катаракта хирургиясына жарамдылықты талқылау',
      ],
      en: [
        'Monitoring if no significant changes are found',
        'Glasses or contact lens prescription',
        'Eye drops or laser treatment for glaucoma',
        'Referral to a retina specialist to plan care',
        'Discussion of suitability for laser correction or cataract surgery',
      ],
    },
  },
  preparation: {
    ru: [
      'Заложите на визит около полутора часов и возьмите результаты прошлых обследований',
      'Мягкие контактные линзы не носите в день исследования; о более длительном перерыве для жёстких линз уточните при записи',
      'Из-за расширения зрачка не планируйте вождение в течение 3–4 часов — лучше приехать с сопровождающим',
      'Возьмите солнцезащитные очки и список принимаемых лекарств',
    ],
    kk: [
      'Келуге шамамен бір жарым сағат бөліңіз және бұрынғы зерттеу нәтижелерін ала келіңіз',
      'Зерттеу күні жұмсақ жанаспалы линза тақпаңыз; қатты линзалар үшін ұзағырақ үзіліс керегін жазылу кезінде нақтылаңыз',
      'Қарашық кеңейтілетіндіктен, 3–4 сағат көлік жүргізуді жоспарламаңыз — біреумен бірге келген дұрыс',
      'Күннен қорғайтын көзілдірікті және қабылдап жүрген дәрілер тізімін ала келіңіз',
    ],
    en: [
      'Allow about an hour and a half and bring results from earlier examinations',
      'Do not wear soft contact lenses on the day; ask when booking whether rigid lenses need a longer break',
      'Your pupils will be dilated, so do not plan to drive for 3–4 hours — it is best to come with someone',
      'Bring sunglasses and a list of your medicines',
    ],
  },
  result: {
    ru: 'В конце визита врач разбирает с вами результаты всех исследований и выдаёт письменное заключение с рекомендациями. Распечатки ОКТ и другие данные можно получить на руки или в электронном виде — они пригодятся для сравнения при следующих обследованиях.',
    kk: 'Келу соңында дәрігер барлық зерттеу нәтижелерін сізбен бірге талдап, ұсынымдары бар жазбаша қорытынды береді. ОКТ басылымдарын және басқа деректерді қағаз немесе электронды түрде алуға болады — олар келесі тексерулерде салыстыру үшін керек болады.',
    en: 'At the end of the visit the doctor goes through all the results with you and gives you a written conclusion with recommendations. OCT printouts and other data are available on paper or electronically — they are useful for comparison at future check-ups.',
  },
  faq: [
    {
      q: {
        ru: 'Чем комплексная диагностика отличается от консультации?',
        kk: 'Кешенді диагностиканың кеңестен айырмашылығы неде?',
        en: 'How is complete diagnostics different from a consultation?',
      },
      a: {
        ru: 'Консультация включает базовый осмотр, а комплексная диагностика дополнительно охватывает приборные исследования — в том числе ОКТ и измерения глаза — за одно посещение.',
        kk: 'Кеңес негізгі қарауды қамтиды, ал кешенді диагностика бір келуде қосымша аспаптық зерттеулерді — соның ішінде ОКТ мен көз өлшемдерін — қамтиды.',
        en: 'A consultation covers a basic examination, while complete diagnostics also includes instrument tests — such as OCT and eye measurements — in the same visit.',
      },
    },
    {
      q: {
        ru: 'Больно ли это?',
        kk: 'Бұл ауырта ма?',
        en: 'Does it hurt?',
      },
      a: {
        ru: 'Нет. Большинство исследований бесконтактные. Капли для расширения зрачка могут ненадолго пощипывать, а после них несколько часов сохраняется чувствительность к свету.',
        kk: 'Жоқ. Зерттеулердің көбі жанаспай жүргізіледі. Қарашықты кеңейтетін тамшылар сәл ашытуы мүмкін, одан кейін бірнеше сағат жарыққа сезімталдық сақталады.',
        en: 'No. Most tests are non-contact. Dilating drops may sting briefly, and you may be sensitive to light for a few hours afterwards.',
      },
    },
    {
      q: {
        ru: 'Нужно ли проходить её каждый год?',
        kk: 'Оны жыл сайын өту керек пе?',
        en: 'Do I need it every year?',
      },
      a: {
        ru: 'Не обязательно. Частоту повторных обследований врач определяет по результатам и факторам риска — для одних достаточно редких проверок, другим нужно более частое наблюдение.',
        kk: 'Міндетті емес. Қайталама тексерулердің жиілігін дәрігер нәтижелер мен қауіп факторларына қарай анықтайды — біреулерге сирек тексеру жеткілікті, басқаларға жиірек бақылау қажет.',
        en: 'Not necessarily. The doctor sets the interval based on your results and risk factors — some people need only occasional checks, others closer monitoring.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Get a dilated eye exam',
      href: 'https://www.nei.nih.gov/learn-about-eye-health/healthy-vision/get-dilated-eye-exam',
    },
    {
      label: 'American Academy of Ophthalmology — What is optical coherence tomography?',
      href: 'https://www.aao.org/eye-health/treatments/what-is-optical-coherence-tomography',
    },
  ],
  topics: ['диагност', 'глауком', 'сетчат', 'зрени', 'катаракт'],
};

export default content;
