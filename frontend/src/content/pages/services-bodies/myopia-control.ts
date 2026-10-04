import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/myopia-control (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'therapy',
  lead: {
    ru: 'Годовая программа для детей с прогрессирующей близорукостью: подбор методов, которые могут замедлить её рост, и регулярный контроль длины глаза.',
    kk: 'Үдемелі миопиясы бар балаларға арналған бір жылдық бағдарлама: оның өсуін баяулатуы мүмкін әдістерді таңдау және көз ұзындығын тұрақты бақылау.',
    en: 'A one-year programme for children with progressing short-sightedness: choosing methods that may slow its progression and regularly monitoring eye length.',
  },
  overview: {
    ru: [
      'Близорукость (миопия) у детей часто усиливается в школьные годы, в основном за счёт удлинения глаза. Чем выше итоговая близорукость, тем выше риск осложнений со стороны сетчатки во взрослом возрасте, поэтому современная офтальмология стремится не только корректировать зрение, но и замедлять прогрессирование.',
      'Программа включает подбор метода контроля миопии, рекомендации по образу жизни и регулярные контрольные визиты в течение года с измерением длины глаза. Ни один метод не останавливает близорукость полностью; выбор делается вместе с родителями с учётом возраста, скорости прогрессирования и образа жизни ребёнка.',
    ],
    kk: [
      'Балалардағы миопия (алыстан нашар көру) мектеп жылдарында жиі күшейеді, негізінен көз алмасының ұзаруы есебінен. Соңғы миопия неғұрлым жоғары болса, ересек жаста торқабық тарапынан асқыну қаупі соғұрлым жоғары, сондықтан қазіргі офтальмология көруді түзетіп қана қоймай, үдеуді баяулатуға да тырысады.',
      'Бағдарламаға миопияны бақылау әдісін таңдау, өмір салты бойынша ұсыныстар және бір жыл бойы көз ұзындығын өлшеумен тұрақты бақылау қабылдаулары кіреді. Бірде-бір әдіс миопияны толық тоқтатпайды; таңдау баланың жасын, үдеу жылдамдығын және өмір салтын ескере отырып, ата-анамен бірге жасалады.',
    ],
    en: [
      "Short-sightedness (myopia) in children often increases during the school years, mainly because the eye grows longer. The higher the final myopia, the greater the risk of retinal complications in adult life, so modern eye care aims not only to correct vision but also to slow progression.",
      "The programme includes choosing a myopia control method, lifestyle advice and regular follow-up visits over the year with eye length measurement. No method stops myopia completely; the choice is made together with parents, taking into account the child's age, rate of progression and lifestyle.",
    ],
  },
  indications: {
    ru: [
      'Близорукость у ребёнка школьного или дошкольного возраста',
      'Усиление близорукости с каждым годом, частая смена очков',
      'Близорукость у одного или обоих родителей',
      'Предмиопия — запас дальнозоркости меньше возрастного при наличии факторов риска',
      'Много зрительной работы вблизи и мало времени на улице',
    ],
    kk: [
      'Мектеп немесе мектепке дейінгі жастағы балада миопия',
      'Миопияның жыл сайын күшеюі, көзілдіріктің жиі ауысуы',
      'Ата-анасының біреуінде немесе екеуінде миопия',
      'Предмиопия — қауіп факторлары болған кезде гиперметропия қорының жас нормасынан аз болуы',
      'Жақыннан көп көру жұмысы және далада аз уақыт болу',
    ],
    en: [
      'Short-sightedness in a school-age or preschool child',
      'Myopia increasing year after year, frequent changes of glasses',
      'Short-sightedness in one or both parents',
      'Pre-myopia — less long-sightedness reserve than expected for age, with risk factors',
      'A lot of near work and little time outdoors',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Для выбора метода и оценки его эффекта нужны точные исходные данные:',
      kk: 'Әдісті таңдау және оның әсерін бағалау үшін нақты бастапқы деректер қажет:',
      en: 'Choosing a method and judging its effect requires accurate baseline data:',
    },
    list: {
      ru: [
        'Рефракция в условиях циклоплегии',
        'Оптическая биометрия — измерение передне-задней оси (длины) глаза, ключевой показатель прогрессирования',
        'Кератометрия и при необходимости топография роговицы (особенно перед ортокератологией)',
        'Оценка аккомодации и бинокулярного зрения',
        'Осмотр глазного дна',
      ],
      kk: [
        'Циклоплегия жағдайындағы рефракция',
        'Оптикалық биометрия — көздің алдыңғы-артқы осінің (ұзындығының) өлшемі, үдеудің негізгі көрсеткіші',
        'Кератометрия және қажет болса мөлдір қабықтың топографиясы (әсіресе ортокератология алдында)',
        'Аккомодация мен бинокулярлық көруді бағалау',
        'Көз түбін қарау',
      ],
      en: [
        'Cycloplegic refraction',
        'Optical biometry — measuring the axial length of the eye, the key marker of progression',
        'Keratometry and, where needed, corneal topography (especially before orthokeratology)',
        'Assessment of accommodation and binocular vision',
        'Retinal examination',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Врач подбирает один метод или их сочетание. Возможные варианты:',
      kk: 'Дәрігер бір әдісті немесе олардың үйлесімін таңдайды. Мүмкін нұсқалар:',
      en: 'The doctor chooses one method or a combination. Options include:',
    },
    list: {
      ru: [
        'Атропин в низкой концентрации — капли на ночь по назначению и под контролем врача',
        'Специальные очковые линзы для контроля миопии (с периферической дефокусировкой)',
        'Ортокератология — жёсткие линзы, которые надевают на ночь и которые временно изменяют форму роговицы',
        'Мягкие контактные линзы для контроля миопии — по показаниям',
        'Больше времени на улице при дневном свете и перерывы при работе вблизи',
      ],
      kk: [
        'Төмен концентрациялы атропин — дәрігердің тағайындауымен және бақылауымен түнге тамызылатын тамшылар',
        'Миопияны бақылауға арналған арнайы көзілдірік линзалары (перифериялық дефокуспен)',
        'Ортокератология — түнге киілетін және мөлдір қабықтың пішінін уақытша өзгертетін қатты линзалар',
        'Миопияны бақылауға арналған жұмсақ контакт линзалары — көрсеткіштер бойынша',
        'Күндізгі жарықта далада көбірек уақыт өткізу және жақыннан жұмыс кезінде үзіліс жасау',
      ],
      en: [
        'Low-dose atropine — eye drops at bedtime, prescribed and monitored by the doctor',
        'Myopia control spectacle lenses (with peripheral defocus designs)',
        'Orthokeratology — rigid lenses worn overnight that temporarily reshape the cornea',
        'Myopia control soft contact lenses — when appropriate',
        'More time outdoors in daylight and regular breaks from near work',
      ],
    },
  },
  preparation: {
    ru: [
      'Возьмите текущие очки и, если есть, результаты прежних измерений рефракции и длины глаза',
      'Если ребёнок носит контактные линзы, уточните у врача, за сколько дней до визита их снять',
      'После циклоплегических капель зрение вблизи несколько часов размыто — не планируйте на этот день уроки',
      'Подумайте, сколько времени ребёнок проводит на улице и за гаджетами, — это поможет составить рекомендации',
    ],
    kk: [
      'Қазіргі көзілдірікті және бар болса, бұрынғы рефракция мен көз ұзындығы өлшемдерінің нәтижелерін алыңыз',
      'Бала контакт линзаларын тақса, келуден неше күн бұрын оларды шешу керектігін дәрігерден біліңіз',
      'Циклоплегиялық тамшылардан кейін жақыннан көру бірнеше сағат бұлыңғыр болады — сол күнге сабақ жоспарламаңыз',
      'Баланың далада және гаджеттермен қанша уақыт өткізетінін ойластырыңыз — бұл ұсыныстар құруға көмектеседі',
    ],
    en: [
      'Bring current glasses and, if available, previous refraction and eye length results',
      'If your child wears contact lenses, ask the doctor how many days before the visit to stop wearing them',
      'After cycloplegic drops near vision is blurred for several hours — avoid scheduling homework that day',
      'Think about how much time your child spends outdoors and on screens — it helps shape the advice',
    ],
  },
  result: {
    ru: 'На контрольных визитах врач сравнивает рефракцию и длину глаза с исходными значениями и при необходимости корректирует метод. Цель программы — замедлить прогрессирование, а не вернуть зрение без очков; индивидуальный ответ заранее предсказать невозможно. Если ребёнок в ортокератологических или других контактных линзах жалуется на боль, покраснение или светобоязнь, снимите линзы и сразу обратитесь к врачу.',
    kk: 'Бақылау қабылдауларында дәрігер рефракция мен көз ұзындығын бастапқы мәндермен салыстырып, қажет болса әдісті түзетеді. Бағдарламаның мақсаты — көзілдіріксіз көруді қайтару емес, үдеуді баяулату; жеке нәтижені алдын ала болжау мүмкін емес. Ортокератологиялық немесе басқа контакт линзасын тағатын бала ауырсынуға, қызаруға немесе жарықтан қорқуға шағымданса, линзаларды шешіп, дәрігерге дереу қаралыңыз.',
    en: 'At follow-up visits the doctor compares refraction and eye length with the baseline and adjusts the method if needed. The aim is to slow progression, not to restore vision without glasses, and an individual response cannot be predicted in advance. If a child wearing orthokeratology or other contact lenses has eye pain, redness or light sensitivity, remove the lenses and see a doctor straight away.',
  },
  faq: [
    {
      q: {
        ru: 'Можно ли полностью остановить близорукость?',
        kk: 'Миопияны толық тоқтатуға бола ма?',
        en: 'Can myopia be stopped completely?',
      },
      a: {
        ru: 'Нет, ни один метод этого не гарантирует. Методы контроля миопии направлены на то, чтобы замедлить её рост; насколько это удастся, зависит от ребёнка и регулярности лечения.',
        kk: 'Жоқ, бірде-бір әдіс бұған кепілдік бермейді. Миопияны бақылау әдістері оның өсуін баяулатуға бағытталған; қаншалықты сәтті болатыны балаға және емнің жүйелілігіне байланысты.',
        en: 'No method can guarantee that. Myopia control methods aim to slow its progression; how well this works depends on the child and on consistent use.',
      },
    },
    {
      q: {
        ru: 'Зачем измерять длину глаза, если можно просто проверить зрение?',
        kk: 'Көруді жай ғана тексеруге болатын болса, көздің ұзындығын не үшін өлшейді?',
        en: 'Why measure eye length rather than just checking vision?',
      },
      a: {
        ru: 'Рост близорукости у детей связан прежде всего с удлинением глаза. Биометрия — точное безболезненное измерение без контакта с глазом — позволяет объективно отслеживать динамику, в том числе на фоне ортокератологии, которая меняет результат обычной проверки зрения.',
        kk: 'Балалардағы миопияның өсуі ең алдымен көздің ұзаруымен байланысты. Биометрия — көзге тимейтін нақты әрі ауыртпалықсыз өлшеу — өзгерісті объективті бақылауға мүмкіндік береді, соның ішінде кәдімгі көру тексерісінің нәтижесін өзгертетін ортокератология кезінде де.',
        en: 'Myopia progression in children is mainly driven by the eye growing longer. Biometry — a precise, painless, non-contact measurement — tracks change objectively, including during orthokeratology, which alters the result of an ordinary vision test.',
      },
    },
    {
      q: {
        ru: 'Действительно ли помогает время на улице?',
        kk: 'Далада уақыт өткізу шынымен көмектесе ме?',
        en: 'Does time outdoors really help?',
      },
      a: {
        ru: 'Исследования связывают больше времени на открытом воздухе с меньшим риском появления близорукости у детей. Это безопасная и полезная привычка, которую врач рекомендует в сочетании с другими методами.',
        kk: 'Зерттеулер ашық ауада көбірек уақыт өткізуді балаларда миопияның пайда болу қаупінің азаюымен байланыстырады. Бұл дәрігер басқа әдістермен қатар ұсынатын қауіпсіз әрі пайдалы әдет.',
        en: 'Research links more time outdoors with a lower risk of myopia developing in children. It is a safe and healthy habit that doctors recommend alongside other methods.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Nearsightedness (myopia)',
      href: 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/nearsightedness-myopia',
    },
    {
      label: 'International Myopia Institute (IMI)',
      href: 'https://myopiainstitute.org/',
    },
  ],
  topics: ['близорук', 'миоп', 'дет', 'ортокератолог', 'атропин'],
};

export default content;
