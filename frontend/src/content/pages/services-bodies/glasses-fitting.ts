import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/glasses-fitting (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'consultation',
  lead: {
    ru: 'Точное определение рефракции и подбор очков, в которых комфортно смотреть вдаль, работать за компьютером и читать.',
    kk: 'Рефракцияны нақты анықтау және алысқа қарауға, компьютерде жұмыс істеуге және оқуға ыңғайлы көзілдірік таңдау.',
    en: 'Accurate refraction and a glasses prescription that is comfortable for distance, computer work and reading.',
  },
  overview: {
    ru: [
      'Очки остаются самым простым и безопасным способом коррекции близорукости, дальнозоркости, астигматизма и возрастной пресбиопии. Но рецепт — это не только цифры рефрактометра: важно, для каких задач нужны очки, как глаза работают вместе и насколько комфортно человеку в новой коррекции.',
      'Врач или оптометрист проводит объективное и субъективное определение рефракции, подбирает силу линз с пробной оправой и учитывает межзрачковое расстояние. По рецепту можно изготовить очки для постоянного ношения, для работы вблизи или прогрессивные линзы.',
    ],
    kk: [
      'Көзілдірік миопияны, гиперметропияны, астигматизмді және жасқа байланысты пресбиопияны түзетудің ең қарапайым әрі қауіпсіз тәсілі болып қала береді. Бірақ рецепт — тек рефрактометр көрсеткен сандар емес: көзілдіріктің қандай міндеттерге керек екені, екі көздің бірге қалай жұмыс істейтіні және адамның жаңа түзетуде өзін қаншалықты жайлы сезінетіні маңызды.',
      'Дәрігер немесе оптометрист рефракцияны объективті және субъективті түрде анықтап, сынақ жақтауымен линзалардың күшін таңдайды және қарашықаралық қашықтықты ескереді. Рецепт бойынша үнемі тағуға, жақыннан жұмыс істеуге арналған көзілдірік немесе прогрессивті линзалар жасауға болады.',
    ],
    en: [
      'Glasses remain the simplest and safest way to correct short-sightedness, long-sightedness, astigmatism and age-related presbyopia. A prescription is more than refractometer numbers, though: what the glasses are for, how the two eyes work together and how comfortable the new correction feels all matter.',
      'The doctor or optometrist performs objective and subjective refraction, fine-tunes the lens power in a trial frame and measures the pupillary distance. The prescription can be used for full-time glasses, reading or computer glasses, or progressive lenses.',
    ],
  },
  indications: {
    ru: [
      'Снижение зрения вдаль или вблизи',
      'Трудности при чтении мелкого шрифта после 40 лет',
      'Усталость глаз, головная боль при работе за компьютером',
      'Нынешние очки стали неудобны или прошло больше года с последней проверки',
      'Нужны очки для конкретной задачи: вождение, работа за компьютером, чтение',
    ],
    kk: [
      'Алысқа немесе жақынға көрудің төмендеуі',
      '40 жастан кейін ұсақ әріпті оқудың қиындауы',
      'Компьютерде жұмыс істегенде көздің шаршауы, бас ауруы',
      'Қазіргі көзілдірік ыңғайсыз болып қалды немесе соңғы тексеруден бері бір жылдан астам уақыт өтті',
      'Нақты міндетке көзілдірік қажет: көлік жүргізу, компьютерде жұмыс, оқу',
    ],
    en: [
      'Reduced distance or near vision',
      'Difficulty reading small print after the age of 40',
      'Eye strain or headaches during computer work',
      'Current glasses feel uncomfortable, or it has been over a year since the last check',
      'Glasses needed for a specific task: driving, computer work, reading',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Подбор очков включает несколько этапов:',
      kk: 'Көзілдірік таңдау бірнеше кезеңнен тұрады:',
      en: 'Glasses fitting involves several steps:',
    },
    list: {
      ru: [
        'Проверку остроты зрения без коррекции и в текущих очках',
        'Авторефрактометрию и кератометрию',
        'Субъективную рефракцию с пробными линзами для каждого глаза и для двух глаз вместе',
        'Проверку зрения вблизи и подбор аддидации при пресбиопии',
        'Измерение межзрачкового расстояния',
      ],
      kk: [
        'Түзетусіз және қазіргі көзілдірікпен көру өткірлігін тексеру',
        'Авторефрактометрия және кератометрия',
        'Әр көз үшін және екі көз бірге сынақ линзаларымен субъективті рефракция',
        'Жақыннан көруді тексеру және пресбиопия кезінде аддидацияны таңдау',
        'Қарашықаралық қашықтықты өлшеу',
      ],
      en: [
        'Visual acuity with no correction and with current glasses',
        'Autorefraction and keratometry',
        'Subjective refraction with trial lenses for each eye and both eyes together',
        'Near vision testing and reading addition for presbyopia',
        'Pupillary distance measurement',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Тип очков подбирается под зрительные задачи и образ жизни:',
      kk: 'Көзілдірік түрі көру міндеттері мен өмір салтына қарай таңдалады:',
      en: 'The type of glasses is matched to your visual tasks and lifestyle:',
    },
    list: {
      ru: [
        'Однофокальные очки для дали или для близи',
        'Офисные линзы для работы за компьютером и на средних расстояниях',
        'Прогрессивные линзы — чёткость на всех расстояниях в одной оправе',
        'Детские очки с учётом особенностей оправы и материала линз',
        'Линзы с покрытиями: антибликовым, упрочняющим, фотохромные — по желанию',
      ],
      kk: [
        'Алысқа немесе жақынға арналған бір фокусты көзілдірік',
        'Компьютерде және орташа қашықтықта жұмыс істеуге арналған кеңселік линзалар',
        'Прогрессивті линзалар — бір жақтауда барлық қашықтықта анық көру',
        'Жақтау мен линза материалының ерекшеліктерін ескеретін балалар көзілдірігі',
        'Жабыны бар линзалар: жарқылға қарсы, беріктендіретін, фотохромды — қалауыңыз бойынша',
      ],
      en: [
        'Single-vision glasses for distance or near',
        'Office lenses for computer work and intermediate distances',
        'Progressive lenses — clear vision at all distances in one frame',
        "Children's glasses with suitable frames and lens materials",
        'Optional coatings: anti-reflective, scratch-resistant, photochromic',
      ],
    },
  },
  preparation: {
    ru: [
      'Возьмите все очки, которыми пользуетесь, и прежние рецепты',
      'Если носите мягкие контактные линзы, снимите их заранее — врач подскажет, за сколько времени до визита',
      'Подумайте, для каких задач нужны очки: вождение, экран, чтение, работа',
      'Если ребёнку проводилась циклоплегия, рецепт обычно выписывают с учётом её результатов',
    ],
    kk: [
      'Қолданатын барлық көзілдірікті және бұрынғы рецептерді алыңыз',
      'Жұмсақ контакт линзаларын тақсаңыз, оларды алдын ала шешіңіз — келуден қанша уақыт бұрын екенін дәрігер айтады',
      'Көзілдірік қандай міндеттерге керек екенін ойластырыңыз: көлік жүргізу, экран, оқу, жұмыс',
      'Балаға циклоплегия жасалған болса, рецепт әдетте оның нәтижелерін ескеріп жазылады',
    ],
    en: [
      'Bring all the glasses you use and any previous prescriptions',
      'If you wear soft contact lenses, take them out in advance — the doctor will tell you how long before the visit',
      'Think about what you need the glasses for: driving, screens, reading, work',
      "For children who had cycloplegic refraction, the prescription usually takes those results into account",
    ],
  },
  result: {
    ru: 'Вы получаете рецепт на очки с рекомендациями по типу линз и режиму ношения. К новым очкам, особенно прогрессивным или с заметно изменённой силой, обычно нужно несколько дней привыкания. Если дискомфорт, головокружение или двоение сохраняются дольше, приходите на повторную проверку. Внезапное снижение зрения, вспышки или «шторка» перед глазом — повод срочно обратиться к врачу, а не менять очки.',
    kk: 'Сіз линза түрі мен тағу режимі бойынша ұсыныстары бар көзілдірік рецептін аласыз. Жаңа көзілдірікке, әсіресе прогрессивті немесе күші айтарлықтай өзгерген көзілдірікке, әдетте бірнеше күн үйрену керек. Ыңғайсыздық, бас айналу немесе екі көрінулер ұзағырақ сақталса, қайта тексеруге келіңіз. Көрудің кенет төмендеуі, жарқылдар немесе көз алдындағы «перде» — көзілдірікті ауыстыру емес, дәрігерге шұғыл қаралу себебі.',
    en: 'You receive a glasses prescription with advice on lens type and wearing schedule. New glasses, especially progressives or a noticeably changed prescription, usually take a few days to get used to. If discomfort, dizziness or double vision persist, come back for a re-check. Sudden loss of vision, flashes or a "curtain" over your sight are a reason to see a doctor urgently rather than change glasses.',
  },
  faq: [
    {
      q: {
        ru: 'Можно ли заказать очки по данным авторефрактометра?',
        kk: 'Авторефрактометр деректері бойынша көзілдірік тапсырыс беруге бола ма?',
        en: 'Can glasses be made from autorefractor readings alone?',
      },
      a: {
        ru: 'Не рекомендуется. Авторефрактометр даёт ориентир, но окончательная сила линз определяется субъективной проверкой с пробными линзами — иначе очки могут оказаться некомфортными.',
        kk: 'Ұсынылмайды. Авторефрактометр бағдар береді, бірақ линзалардың соңғы күші сынақ линзаларымен субъективті тексеру арқылы анықталады — әйтпесе көзілдірік ыңғайсыз болуы мүмкін.',
        en: 'It is not recommended. An autorefractor gives a starting point, but the final lens power is set by subjective testing with trial lenses — otherwise the glasses may be uncomfortable.',
      },
    },
    {
      q: {
        ru: 'Как часто нужно проверять рецепт?',
        kk: 'Рецептті қаншалықты жиі тексеру керек?',
        en: 'How often should the prescription be checked?',
      },
      a: {
        ru: 'Взрослым обычно достаточно проверки раз в один-два года или при появлении жалоб, детям — чаще, по рекомендации врача, потому что рефракция у них меняется быстрее.',
        kk: 'Ересектерге әдетте бір-екі жылда бір рет немесе шағым пайда болғанда тексеру жеткілікті, балаларға — дәрігердің ұсынысы бойынша жиірек, өйткені олардың рефракциясы тезірек өзгереді.',
        en: 'Adults usually need a check every one to two years or when symptoms appear; children more often, as advised by the doctor, because their refraction changes faster.',
      },
    },
    {
      q: {
        ru: 'Вредно ли носить очки «не своей» силы?',
        kk: '«Өзіңізге сай емес» күштегі көзілдірікті тағу зиян ба?',
        en: 'Is it harmful to wear glasses with the wrong prescription?',
      },
      a: {
        ru: 'Взрослому это обычно не вредит глазам, но может вызывать усталость, головную боль и дискомфорт. У детей неправильная коррекция может мешать развитию зрения, поэтому им важен точный рецепт.',
        kk: 'Ересек адамның көзіне бұл әдетте зиян келтірмейді, бірақ шаршау, бас ауруы және ыңғайсыздық тудыруы мүмкін. Балаларда дұрыс емес түзету көрудің дамуына кедергі келтіруі мүмкін, сондықтан оларға нақты рецепт маңызды.',
        en: "In adults it usually does not harm the eyes but can cause tiredness, headaches and discomfort. In children an incorrect correction can interfere with visual development, so an accurate prescription is important.",
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Refractive errors',
      href: 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/refractive-errors',
    },
    {
      label: 'NHS — Short-sightedness (myopia)',
      href: 'https://www.nhs.uk/conditions/short-sightedness/',
    },
  ],
  topics: ['очк', 'оптик', 'рефракц', 'астигмат', 'пресбиоп'],
};

export default content;
