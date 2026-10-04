import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/retina-treatment (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'therapy',
  lead: {
    ru: 'Ведём пациентов с диабетической ретинопатией, возрастной макулярной дегенерацией и окклюзией вен сетчатки: от точной диагностики до лечения и длительного наблюдения.',
    kk: 'Диабеттік ретинопатиясы, жасқа байланысты макулалық дегенерациясы және тор қабық веналарының окклюзиясы бар пациенттерді дәл диагностикадан бастап емдеу мен ұзақ бақылауға дейін жүргіземіз.',
    en: 'We care for people with diabetic retinopathy, age-related macular degeneration and retinal vein occlusion, from accurate diagnosis to treatment and long-term monitoring.',
  },
  overview: {
    ru: [
      'Сетчатка — светочувствительный слой в глубине глаза, а её центральная зона, макула, отвечает за чёткое зрение при чтении и различении лиц. Заболевания сетчатки часто развиваются постепенно и долго остаются незаметными, особенно если страдает только один глаз.',
      'Современное лечение — инъекции анти-VEGF препаратов, лазерная коагуляция и, при необходимости, хирургия — помогает уменьшить отёк, остановить рост патологических сосудов и во многих случаях сохранить зрение. Схема подбирается индивидуально и корректируется по результатам регулярных обследований.',
    ],
    kk: [
      'Тор қабық — көздің түбіндегі жарық сезгіш қабат, ал оның орталық аймағы — макула оқу мен адамның бетін ажырату кезіндегі анық көруге жауап береді. Тор қабық аурулары көбіне біртіндеп дамиды және ұзақ уақыт байқалмайды, әсіресе тек бір көз зақымданса.',
      'Қазіргі ем — анти-VEGF препараттарының инъекциялары, лазерлік коагуляция және қажет болса хирургия — ісінуді азайтуға, патологиялық тамырлардың өсуін тоқтатуға және көп жағдайда көруді сақтауға көмектеседі. Ем жоспары жеке таңдалып, тұрақты тексерулердің нәтижесі бойынша түзетіледі.',
    ],
    en: [
      'The retina is the light-sensitive layer at the back of the eye, and its centre, the macula, gives the sharp vision needed for reading and recognising faces. Retinal diseases often develop gradually and may go unnoticed for a long time, especially when only one eye is affected.',
      'Modern treatment, including anti-VEGF injections, laser photocoagulation and surgery where needed, can reduce swelling, stop abnormal blood vessels from growing and in many cases preserve vision. The plan is tailored to each person and adjusted based on regular examinations.',
    ],
  },
  indications: {
    ru: [
      'Сахарный диабет — плановый контроль сетчатки',
      'Диабетическая ретинопатия и диабетический макулярный отёк',
      'Возрастная макулярная дегенерация (сухая или влажная форма)',
      'Окклюзия центральной вены сетчатки или её ветвей',
      'Искажение прямых линий, пятно или «туман» в центре зрения',
    ],
    kk: [
      'Қант диабеті — тор қабықты жоспарлы бақылау',
      'Диабеттік ретинопатия және диабеттік макулалық ісіну',
      'Жасқа байланысты макулалық дегенерация (құрғақ немесе ылғалды түрі)',
      'Тор қабықтың орталық венасының немесе оның тармақтарының окклюзиясы',
      'Түзу сызықтардың қисаюы, көрудің ортасындағы дақ немесе «тұман»',
    ],
    en: [
      'Diabetes, for routine retinal screening',
      'Diabetic retinopathy and diabetic macular oedema',
      'Age-related macular degeneration (dry or wet)',
      'Central or branch retinal vein occlusion',
      'Wavy straight lines, a blank spot or haze in the centre of vision',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Решение о лечении основывается на детальной оценке сетчатки. Большинство исследований безболезненны и выполняются в день визита.',
      kk: 'Ем туралы шешім тор қабықты егжей-тегжейлі бағалауға негізделеді. Зерттеулердің көбі ауыртпайды және сапар күні жасалады.',
      en: 'Treatment decisions are based on a detailed assessment of the retina. Most tests are painless and done on the day of the visit.',
    },
    list: {
      ru: [
        'Проверка остроты зрения и тест Амслера',
        'Осмотр глазного дна с расширенным зрачком',
        'ОКТ макулы — оценка отёка и структуры сетчатки',
        'Фотографирование глазного дна для контроля в динамике',
        'По показаниям — ОКТ-ангиография или флюоресцентная ангиография',
      ],
      kk: [
        'Көру өткірлігін тексеру және Амслер тесті',
        'Қарашықты кеңейтіп көз түбін қарау',
        'Макуланың ОКТ-сы — ісіну мен тор қабық құрылымын бағалау',
        'Динамикада бақылау үшін көз түбін суретке түсіру',
        'Көрсетілім бойынша — ОКТ-ангиография немесе флюоресценттік ангиография',
      ],
      en: [
        'Visual acuity and Amsler grid test',
        'Dilated examination of the back of the eye',
        'Macular OCT to assess swelling and retinal structure',
        'Retinal photography to track changes over time',
        'OCT angiography or fluorescein angiography when indicated',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Тактика зависит от диагноза, стадии и состояния второго глаза. При диабете важную роль играет и общий контроль сахара, давления и холестерина вместе с эндокринологом и терапевтом.',
      kk: 'Ем тәсілі диагнозға, кезеңге және екінші көздің жағдайына байланысты. Диабетте эндокринолог пен терапевтпен бірге қант, қан қысымы мен холестеринді жалпы бақылаудың да рөлі зор.',
      en: 'The approach depends on the diagnosis, the stage and the condition of the other eye. In diabetes, overall control of blood sugar, blood pressure and cholesterol with your endocrinologist and GP also plays an important role.',
    },
    list: {
      ru: [
        'Интравитреальные инъекции анти-VEGF препаратов — при влажной ВМД, диабетическом макулярном отёке и отёке после окклюзии вен',
        'Лазерная коагуляция сетчатки (панретинальная или фокальная) — при пролиферативной диабетической ретинопатии и ряде других состояний',
        'Наблюдение с регулярной ОКТ — при ранних и стабильных изменениях, включая сухую форму ВМД',
        'Направление на витрэктомию к витреоретинальному хирургу — при кровоизлиянии в стекловидное тело, тракции или отслойке сетчатки',
      ],
      kk: [
        'Анти-VEGF препараттарының интравитреальді инъекциялары — ылғалды ЖМД, диабеттік макулалық ісіну және вена окклюзиясынан кейінгі ісіну кезінде',
        'Тор қабықтың лазерлік коагуляциясы (панретиналды немесе фокалды) — пролиферативті диабеттік ретинопатия мен кейбір басқа жағдайларда',
        'Тұрақты ОКТ-мен бақылау — ерте және тұрақты өзгерістерде, соның ішінде ЖМД-ның құрғақ түрінде',
        'Витреоретиналды хирургқа витрэктомияға жолдама — шыны тәрізді денеге қан құйылғанда, тракцияда немесе тор қабық ажырағанда',
      ],
      en: [
        'Intravitreal anti-VEGF injections for wet AMD, diabetic macular oedema and swelling after vein occlusion',
        'Retinal laser photocoagulation (panretinal or focal) for proliferative diabetic retinopathy and some other conditions',
        'Monitoring with regular OCT for early or stable changes, including dry AMD',
        'Referral to a vitreoretinal surgeon for vitrectomy in case of vitreous haemorrhage, traction or retinal detachment',
      ],
    },
  },
  preparation: {
    ru: [
      'Будет расширен зрачок — приезжайте не за рулём и возьмите солнцезащитные очки',
      'Принесите очки, список лекарств и последние анализы (например, гликированный гемоглобин при диабете)',
      'Возьмите выписки и снимки предыдущих обследований, если они есть',
    ],
    kk: [
      'Қарашық кеңейтіледі — көлікпен келмеңіз және күннен қорғайтын көзілдірік алыңыз',
      'Көзілдірігіңізді, дәрілер тізімін және соңғы талдауларды (мысалы, диабетте гликирленген гемоглобин) әкеліңіз',
      'Бар болса, бұрынғы тексерулердің үзінді көшірмелері мен суреттерін алыңыз',
    ],
    en: [
      'Your pupils will be dilated, so do not drive to the visit and bring sunglasses',
      'Bring your glasses, a list of medicines and recent blood tests (for example HbA1c if you have diabetes)',
      'Bring letters and scans from previous examinations if you have them',
    ],
  },
  result: {
    ru: 'Цель лечения — стабилизировать состояние сетчатки и сохранить зрение; у части пациентов оно улучшается, но это зависит от давности и тяжести изменений. Заболевания сетчатки, как правило, требуют длительного наблюдения, а иногда многолетнего лечения. При внезапном снижении зрения, появлении вспышек, множества «плавающих мушек» или тёмной «шторки» обратитесь к офтальмологу в тот же день.',
    kk: 'Емнің мақсаты — тор қабықтың жағдайын тұрақтандыру және көруді сақтау; кейбір пациенттерде көру жақсарады, бірақ бұл өзгерістердің ұзақтығы мен ауырлығына байланысты. Тор қабық аурулары әдетте ұзақ бақылауды, кейде көпжылдық емді қажет етеді. Көру кенеттен нашарласа, жарқылдар, көптеген «қалқыған шыбындар» немесе қараңғы «перде» пайда болса, сол күні офтальмологқа жүгініңіз.',
    en: 'The aim of treatment is to stabilise the retina and preserve vision; some people also see an improvement, but this depends on how long-standing and severe the changes are. Retinal conditions usually need long-term monitoring and sometimes treatment over many years. If you notice a sudden drop in vision, flashes of light, a shower of new floaters or a dark curtain across your vision, see an eye doctor the same day.',
  },
  faq: [
    {
      q: {
        ru: 'Как часто людям с диабетом нужно проверять сетчатку?',
        kk: 'Диабеті бар адамдарға тор қабықты қаншалықты жиі тексеру керек?',
        en: 'How often should people with diabetes have their retina checked?',
      },
      a: {
        ru: 'Обычно рекомендуется осмотр с расширенным зрачком не реже раза в год, даже если зрение кажется нормальным. При выявленных изменениях, во время беременности или при резких колебаниях сахара врач может назначить более частые визиты.',
        kk: 'Көру қалыпты сияқты болса да, әдетте қарашықты кеңейтіп тексеруді жылына кемінде бір рет жасау ұсынылады. Өзгерістер анықталса, жүктілік кезінде немесе қант күрт ауытқығанда дәрігер сапарларды жиілетуі мүмкін.',
        en: 'A dilated eye examination at least once a year is usually recommended, even if your vision seems fine. If changes are found, during pregnancy or when blood sugar fluctuates sharply, the doctor may advise more frequent visits.',
      },
    },
    {
      q: {
        ru: 'Лазерная коагуляция возвращает зрение?',
        kk: 'Лазерлік коагуляция көруді қалпына келтіре ме?',
        en: 'Does laser treatment restore vision?',
      },
      a: {
        ru: 'Лазер в первую очередь помогает предотвратить дальнейшее ухудшение: он снижает риск роста патологических сосудов и кровоизлияний. Улучшение зрения после него не ожидается, а в некоторых случаях возможны изменения периферического или сумеречного зрения — врач обсудит это заранее.',
        kk: 'Лазер ең алдымен одан әрі нашарлаудың алдын алуға көмектеседі: ол патологиялық тамырлардың өсуі мен қан құйылу қаупін азайтады. Одан кейін көрудің жақсаруы күтілмейді, ал кейбір жағдайларда шеткі немесе ымырт кезіндегі көру өзгеруі мүмкін — дәрігер мұны алдын ала талқылайды.',
        en: 'Laser mainly helps prevent further deterioration by lowering the risk of abnormal vessel growth and bleeding. It is not expected to improve vision, and in some cases it may affect side or night vision; the doctor will discuss this with you beforehand.',
      },
    },
    {
      q: {
        ru: 'Можно ли следить за зрением дома?',
        kk: 'Көруді үйде бақылауға бола ма?',
        en: 'Can I monitor my vision at home?',
      },
      a: {
        ru: 'Да, при заболеваниях макулы полезно регулярно проверять каждый глаз отдельно по сетке Амслера или ровным линиям (например, дверной раме). Если линии стали искривлёнными или появилось пятно, запишитесь к врачу без ожидания планового визита.',
        kk: 'Иә, макула ауруларында әр көзді жеке Амслер торымен немесе түзу сызықтармен (мысалы, есік жақтауымен) үнемі тексеріп отыру пайдалы. Сызықтар қисайса немесе дақ пайда болса, жоспарлы сапарды күтпей дәрігерге жазылыңыз.',
        en: 'Yes. With macular conditions it helps to check each eye separately using an Amsler grid or a straight line such as a door frame. If lines look wavy or a blank spot appears, book an appointment without waiting for your planned visit.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Diabetic Retinopathy',
      href: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/diabetic-retinopathy',
    },
    {
      label: 'National Eye Institute (NEI) — Age-Related Macular Degeneration',
      href: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/age-related-macular-degeneration',
    },
  ],
  topics: ['сетчатк', 'ретинопат', 'макул', 'диабет', 'дегенерац'],
};

export default content;
