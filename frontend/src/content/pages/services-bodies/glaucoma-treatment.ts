import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/glaucoma-treatment (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'therapy',
  lead: {
    ru: 'Подбираем лечение, которое помогает удерживать внутриглазное давление на безопасном уровне и замедлить развитие глаукомы. Мы честно говорим о целях: утраченное зрение не возвращается, но сохранить оставшееся — реальная и важная задача.',
    kk: 'Көзішілік қысымды қауіпсіз деңгейде ұстауға және глаукоманың дамуын баяулатуға көмектесетін емді таңдаймыз. Мақсатты ашық айтамыз: жоғалған көру қайтпайды, бірақ бар көруді сақтап қалу — нақты әрі маңызды міндет.',
    en: 'We choose treatment that helps keep eye pressure at a safe level and slow the progression of glaucoma. We are honest about the goal: vision already lost does not come back, but protecting the sight that remains is a real and important aim.',
  },
  overview: {
    ru: [
      'Глаукома — группа заболеваний, при которых постепенно повреждается зрительный нерв. Чаще всего это связано с повышенным внутриглазным давлением, но болезнь возможна и при нормальных цифрах. На ранних стадиях она обычно не вызывает боли и заметных симптомов, поэтому её нередко выявляют случайно при осмотре.',
      'Лечение не устраняет уже возникшие повреждения нерва, но может остановить или существенно замедлить их прогрессирование. Для этого подбирается целевое давление для конкретного пациента и регулярно проверяется, удерживается ли оно и стабильны ли поле зрения и зрительный нерв.',
    ],
    kk: [
      'Глаукома — көру жүйкесі біртіндеп зақымданатын аурулар тобы. Көбіне бұл көзішілік қысымның жоғарылауымен байланысты, бірақ ауру қалыпты көрсеткіштерде де дамуы мүмкін. Ерте кезеңде ол әдетте ауырсыну мен байқалатын белгілер тудырмайды, сондықтан жиі тексеру кезінде кездейсоқ анықталады.',
      'Ем жүйкенің бұрыннан болған зақымын жоймайды, бірақ оның үдеуін тоқтатуы немесе айтарлықтай баяулатуы мүмкін. Ол үшін әр пациентке жеке мақсатты қысым белгіленеді және оның сақталуы, көру өрісі мен көру жүйкесінің тұрақтылығы үнемі тексеріледі.',
    ],
    en: [
      'Glaucoma is a group of conditions in which the optic nerve is gradually damaged. It is most often linked to raised pressure inside the eye, although it can also develop at normal pressure. In the early stages it usually causes no pain or noticeable symptoms, so it is often found during a routine eye examination.',
      'Treatment cannot undo nerve damage that has already occurred, but it can stop or considerably slow further progression. To do this, a target pressure is set for each patient, and we regularly check that it is being maintained and that the visual field and optic nerve remain stable.',
    ],
  },
  indications: {
    ru: [
      'Впервые выявленная глаукома или подозрение на неё',
      'Повышенное внутриглазное давление (офтальмогипертензия)',
      'Недостаточный эффект или плохая переносимость текущих капель',
      'Сужение поля зрения или изменения диска зрительного нерва',
      'Глаукома у близких родственников',
      'Узкий угол передней камеры по данным осмотра',
    ],
    kk: [
      'Алғаш анықталған глаукома немесе оған күдік',
      'Көзішілік қысымның жоғарылауы (офтальмогипертензия)',
      'Қолданып жүрген тамшылардың әсері жеткіліксіз немесе нашар көтерілуі',
      'Көру өрісінің тарылуы немесе көру жүйкесі дискісінің өзгерістері',
      'Жақын туыстарында глаукоманың болуы',
      'Тексеру бойынша алдыңғы камера бұрышының тар болуы',
    ],
    en: [
      'Newly diagnosed or suspected glaucoma',
      'Raised eye pressure (ocular hypertension)',
      'Current drops not working well enough or causing side effects',
      'Visual field loss or changes in the optic nerve head',
      'Glaucoma in close family members',
      'A narrow drainage angle found on examination',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Перед подбором лечения и на каждом контрольном визите врач оценивает давление и состояние зрительного нерва в динамике.',
      kk: 'Емді таңдамас бұрын және әр бақылау сапарында дәрігер қысым мен көру жүйкесінің жағдайын динамикада бағалайды.',
      en: 'Before choosing treatment and at every follow-up visit, the doctor assesses eye pressure and the state of the optic nerve over time.',
    },
    list: {
      ru: [
        'Тонометрия — измерение внутриглазного давления',
        'Периметрия — исследование полей зрения',
        'ОКТ диска зрительного нерва и слоя нервных волокон',
        'Гониоскопия — оценка угла передней камеры',
        'Пахиметрия — измерение толщины роговицы',
      ],
      kk: [
        'Тонометрия — көзішілік қысымды өлшеу',
        'Периметрия — көру өрісін зерттеу',
        'Көру жүйкесі дискісі мен жүйке талшықтары қабатының ОКТ-сы',
        'Гониоскопия — алдыңғы камера бұрышын бағалау',
        'Пахиметрия — мөлдір қабықтың қалыңдығын өлшеу',
      ],
      en: [
        'Tonometry to measure eye pressure',
        'Perimetry to test the visual field',
        'OCT of the optic nerve head and nerve fibre layer',
        'Gonioscopy to examine the drainage angle',
        'Pachymetry to measure corneal thickness',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Метод выбирается индивидуально с учётом типа и стадии глаукомы, уровня давления, общего здоровья и образа жизни. Нередко варианты сочетаются.',
      kk: 'Әдіс глаукоманың түрі мен кезеңін, қысым деңгейін, жалпы денсаулық пен өмір салтын ескере отырып жеке таңдалады. Нұсқалар жиі біріктіріледі.',
      en: 'The approach is chosen individually, taking into account the type and stage of glaucoma, the pressure level, general health and lifestyle. Options are often combined.',
    },
    list: {
      ru: [
        'Гипотензивные капли — чаще всего первый шаг; важны ежедневное применение и правильная техника закапывания',
        'Селективная лазерная трабекулопластика (СЛТ) — амбулаторная процедура, улучшающая отток жидкости; может применяться как первая линия или вместе с каплями',
        'Лазерная иридотомия — при узком угле передней камеры',
        'Хирургическое лечение (например, трабекулэктомия или дренажные устройства) — когда давление не удаётся контролировать другими способами; при необходимости направляем к хирургу',
      ],
      kk: [
        'Қысымды төмендететін тамшылар — көбіне алғашқы қадам; күнделікті қолдану мен дұрыс тамызу әдісі маңызды',
        'Селективті лазерлік трабекулопластика (СЛТ) — сұйықтықтың ағуын жақсартатын амбулаториялық процедура; бірінші кезектегі ем ретінде немесе тамшылармен бірге қолданылуы мүмкін',
        'Лазерлік иридотомия — алдыңғы камера бұрышы тар болғанда',
        'Хирургиялық ем (мысалы, трабекулэктомия немесе дренаждық құрылғылар) — қысымды басқа жолмен бақылау мүмкін болмағанда; қажет болса, хирургқа жолдаймыз',
      ],
      en: [
        'Pressure-lowering eye drops, most often the first step; daily use and correct technique matter',
        'Selective laser trabeculoplasty (SLT), an outpatient procedure that improves fluid drainage; it can be used first-line or alongside drops',
        'Laser iridotomy for a narrow drainage angle',
        'Surgery (for example trabeculectomy or drainage devices) when pressure cannot be controlled in other ways; we refer to a surgeon when needed',
      ],
    },
  },
  preparation: {
    ru: [
      'Возьмите список всех капель и лекарств, которые вы используете, включая общие',
      'Не отменяйте назначенные капли перед визитом, если врач не сказал иначе',
      'Принесите результаты прошлых обследований: поля зрения, ОКТ, выписки',
      'Возможно расширение зрачка — лучше не садиться за руль несколько часов после приёма',
    ],
    kk: [
      'Қолданып жүрген барлық тамшылар мен дәрілердің, соның ішінде жалпы дәрілердің тізімін алыңыз',
      'Дәрігер басқаша айтпаса, сапар алдында тағайындалған тамшыларды тоқтатпаңыз',
      'Бұрынғы тексерулердің нәтижелерін әкеліңіз: көру өрісі, ОКТ, үзінді көшірмелер',
      'Қарашықты кеңейту мүмкін — қабылдаудан кейін бірнеше сағат көлік жүргізбеген дұрыс',
    ],
    en: [
      'Bring a list of all your eye drops and other medicines',
      'Do not stop prescribed drops before the visit unless the doctor has told you to',
      'Bring previous results: visual fields, OCT scans, clinic letters',
      'Your pupils may be dilated, so it is best not to drive for a few hours afterwards',
    ],
  },
  result: {
    ru: 'Цель лечения — сохранить имеющееся зрение на долгие годы. Глаукома — хроническое заболевание: даже при хорошем давлении нужны регулярные визиты, чтобы вовремя заметить изменения и скорректировать терапию. Частоту контроля определяет врач в зависимости от стадии и стабильности. При внезапной сильной боли в глазу, покраснении, затуманивании зрения, радужных кругах вокруг источников света, головной боли с тошнотой обратитесь за неотложной помощью — это может быть острый приступ.',
    kk: 'Емнің мақсаты — бар көруді ұзақ жылдар бойы сақтау. Глаукома — созылмалы ауру: қысым жақсы болса да, өзгерістерді уақытында байқап, емді түзету үшін тұрақты сапарлар қажет. Бақылау жиілігін дәрігер кезең мен тұрақтылыққа қарай анықтайды. Көздің кенеттен қатты ауыруы, қызаруы, көрудің бұлдырауы, жарық көздерінің айналасында кемпірқосақ шеңберлері, жүрек айнумен бірге бас ауыруы пайда болса, шұғыл көмекке жүгініңіз — бұл жедел ұстама болуы мүмкін.',
    en: 'The aim of treatment is to preserve your existing sight for many years. Glaucoma is a long-term condition: even when pressure is well controlled, regular visits are needed to spot changes early and adjust treatment. The doctor sets how often you are seen based on the stage and stability. If you develop sudden severe eye pain, redness, blurred vision, rainbow haloes around lights, or headache with nausea, seek urgent care, as this may be an acute attack.',
  },
  faq: [
    {
      q: {
        ru: 'Можно ли вылечить глаукому полностью?',
        kk: 'Глаукоманы толық емдеуге бола ма?',
        en: 'Can glaucoma be cured?',
      },
      a: {
        ru: 'Нет, глаукома — хроническое заболевание, а повреждения зрительного нерва необратимы. Но своевременное и регулярное лечение позволяет у многих пациентов остановить или значительно замедлить прогрессирование и сохранить зрение.',
        kk: 'Жоқ, глаукома — созылмалы ауру, ал көру жүйкесінің зақымы қайтымсыз. Бірақ уақтылы әрі тұрақты ем көптеген пациенттерде аурудың үдеуін тоқтатуға немесе айтарлықтай баяулатуға және көруді сақтауға мүмкіндік береді.',
        en: 'No. Glaucoma is a long-term condition and optic nerve damage cannot be reversed. However, timely and consistent treatment allows many people to stop or considerably slow progression and keep their sight.',
      },
    },
    {
      q: {
        ru: 'Если я чувствую себя хорошо, можно ли перестать капать капли?',
        kk: 'Өзімді жақсы сезінсем, тамшыларды тоқтатуға бола ма?',
        en: 'If I feel fine, can I stop using the drops?',
      },
      a: {
        ru: 'Не стоит прекращать лечение самостоятельно. Глаукома обычно протекает без ощущений, и давление может повыситься незаметно. Если капли неудобны или вызывают побочные эффекты, обсудите это с врачом — существуют альтернативы, в том числе лазерное лечение.',
        kk: 'Емді өз бетіңізше тоқтатпаған жөн. Глаукома әдетте сезілмей өтеді, қысым байқаусыз көтерілуі мүмкін. Тамшылар ыңғайсыз болса немесе жанама әсер берсе, дәрігермен ақылдасыңыз — баламалар, соның ішінде лазерлік ем бар.',
        en: 'Please do not stop treatment on your own. Glaucoma usually causes no symptoms and pressure can rise without you noticing. If the drops are inconvenient or cause side effects, talk to the doctor, as there are alternatives, including laser treatment.',
      },
    },
    {
      q: {
        ru: 'Как часто нужно приходить на контроль?',
        kk: 'Бақылауға қаншалықты жиі келу керек?',
        en: 'How often do I need follow-up visits?',
      },
      a: {
        ru: 'Это зависит от стадии, уровня давления и того, насколько стабильна картина. После начала или смены лечения визиты обычно чаще, при стабильном течении — реже. Точный график составит ваш врач.',
        kk: 'Бұл кезеңге, қысым деңгейіне және жағдайдың қаншалықты тұрақты екеніне байланысты. Емді бастағаннан немесе ауыстырғаннан кейін сапарлар әдетте жиірек, тұрақты ағымда — сиректеу. Нақты кестені дәрігеріңіз құрады.',
        en: 'It depends on the stage, the pressure level and how stable things are. Visits are usually more frequent after starting or changing treatment and less frequent once the condition is stable. Your doctor will set the exact schedule.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Glaucoma',
      href: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/glaucoma',
    },
    {
      label: 'NICE — Glaucoma: diagnosis and management (NG81)',
      href: 'https://www.nice.org.uk/guidance/ng81',
    },
  ],
  topics: ['глауком', 'давлен', 'зрительн', 'трабекул'],
};

export default content;
