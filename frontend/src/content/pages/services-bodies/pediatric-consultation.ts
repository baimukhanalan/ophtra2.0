import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/pediatric-consultation (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'consultation',
  lead: {
    ru: 'Спокойный осмотр ребёнка с учётом возраста: проверяем остроту зрения, рефракцию и совместную работу глаз, при необходимости подбираем очки.',
    kk: 'Жасына сай баланы асықпай қарау: көру өткірлігін, рефракцияны және екі көздің бірлесіп жұмыс істеуін тексереміз, қажет болса көзілдірік таңдаймыз.',
    en: 'A calm, age-appropriate eye examination for your child: we check visual acuity, refraction and how the two eyes work together, and fit glasses if needed.',
  },
  overview: {
    ru: [
      'Зрительная система ребёнка продолжает развиваться в первые годы жизни, и многие нарушения — близорукость, дальнозоркость, астигматизм, косоглазие, амблиопия — долго не дают жалоб. Ребёнок может не понимать, что видит хуже других, поэтому плановые осмотры особенно важны.',
      'Детский офтальмолог проводит обследование в игровой форме, объясняет родителям результаты и вместе с ними составляет план: наблюдение, очки, окклюзия или другие меры. Решение всегда принимается индивидуально, с учётом возраста и особенностей ребёнка.',
    ],
    kk: [
      'Баланың көру жүйесі алғашқы жылдары дамуын жалғастырады, ал көптеген бұзылыстар — миопия, гиперметропия, астигматизм, қылилық, амблиопия — ұзақ уақыт бойы шағымсыз өтеді. Бала өзінің басқалардан нашар көретінін түсінбеуі мүмкін, сондықтан жоспарлы тексеру ерекше маңызды.',
      'Балалар офтальмологы тексеруді ойын түрінде жүргізеді, нәтижелерін ата-анаға түсіндіреді және олармен бірге жоспар құрады: бақылау, көзілдірік, окклюзия немесе басқа шаралар. Шешім әрқашан баланың жасы мен ерекшеліктерін ескере отырып, жеке қабылданады.',
    ],
    en: [
      "A child's visual system keeps developing during the first years of life, and many conditions — short-sightedness, long-sightedness, astigmatism, squint, amblyopia — can cause no complaints for a long time. Children often do not realise they see less well than others, which is why regular check-ups matter.",
      'The pediatric ophthalmologist makes the examination feel like a game, explains the findings to parents and agrees a plan together with them: monitoring, glasses, patching or other measures. Every decision is made individually, taking the child\'s age and needs into account.',
    ],
  },
  indications: {
    ru: [
      'Плановый осмотр в рекомендованные возрастные сроки или перед школой',
      'Ребёнок щурится, близко подносит книги или низко наклоняется к гаджету',
      'Заметное или периодическое отклонение глаза (косоглазие)',
      'Жалобы на усталость глаз, головную боль после чтения',
      'Близорукость или дальнозоркость у родителей',
      'Контроль уже назначенных очков и лечения',
    ],
    kk: [
      'Ұсынылған жас мерзімдеріндегі немесе мектеп алдындағы жоспарлы тексеру',
      'Бала көзін қысады, кітапты жақын ұстайды немесе гаджетке төмен еңкейеді',
      'Көздің байқалатын немесе мезгіл-мезгіл ауытқуы (қылилық)',
      'Көздің шаршауына, оқығаннан кейінгі бас ауруына шағымдар',
      'Ата-анасында миопия немесе гиперметропия бар',
      'Бұрын тағайындалған көзілдірік пен емді бақылау',
    ],
    en: [
      'A routine check at the recommended ages or before starting school',
      'Your child squints, holds books very close or leans in towards screens',
      'A noticeable or intermittent turn of one eye (squint)',
      'Complaints of tired eyes or headaches after reading',
      'Short- or long-sightedness in the parents',
      'Follow-up of glasses or treatment already prescribed',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Объём обследования зависит от возраста и жалоб. Обычно он включает:',
      kk: 'Тексеру көлемі жасқа және шағымдарға байланысты. Әдетте оған мыналар кіреді:',
      en: 'The scope of the examination depends on age and symptoms. It usually includes:',
    },
    list: {
      ru: [
        'Проверку остроты зрения по возрастным таблицам (картинки, символы, буквы)',
        'Рефрактометрию, в том числе в условиях циклоплегии — капли расслабляют аккомодацию и позволяют определить истинную рефракцию',
        'Оценку бинокулярного зрения, положения и подвижности глаз, тесты на косоглазие',
        'Осмотр переднего отрезка и глазного дна',
        'При необходимости — измерение длины глаза (биометрию)',
      ],
      kk: [
        'Жасқа сай кестелер бойынша көру өткірлігін тексеру (суреттер, белгілер, әріптер)',
        'Рефрактометрия, соның ішінде циклоплегия жағдайында — тамшылар аккомодацияны босаңсытып, нақты рефракцияны анықтауға мүмкіндік береді',
        'Бинокулярлық көруді, көздің орналасуы мен қозғалғыштығын бағалау, қылилыққа арналған сынамалар',
        'Көздің алдыңғы бөлігі мен түбін қарау',
        'Қажет болса — көздің ұзындығын өлшеу (биометрия)',
      ],
      en: [
        'Visual acuity testing with age-appropriate charts (pictures, symbols, letters)',
        'Refraction, including cycloplegic refraction — drops relax focusing so the true prescription can be measured',
        'Assessment of binocular vision, eye alignment and eye movements, squint tests',
        'Examination of the front of the eye and the retina',
        'Eye length measurement (biometry) where needed',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'По итогам осмотра врач обсуждает с родителями дальнейшие шаги. Возможные варианты:',
      kk: 'Тексеру нәтижесі бойынша дәрігер ата-анамен келесі қадамдарды талқылайды. Мүмкін нұсқалар:',
      en: 'After the examination the doctor discusses the next steps with you. Possible options include:',
    },
    list: {
      ru: [
        'Динамическое наблюдение, если отклонения в пределах возрастной нормы',
        'Очковая коррекция — рецепт выдаётся по результатам рефракции',
        'Окклюзия (заклеивание лучше видящего глаза) при амблиопии',
        'Программа контроля близорукости при её прогрессировании',
        'Направление к смежным специалистам или на хирургическую консультацию при косоглазии',
      ],
      kk: [
        'Ауытқулар жас нормасы шегінде болса — динамикалық бақылау',
        'Көзілдірікпен түзету — рецепт рефракция нәтижесі бойынша беріледі',
        'Амблиопия кезінде окклюзия (жақсы көретін көзді жабу)',
        'Миопия үдесе — оны бақылау бағдарламасы',
        'Қылилық кезінде сабақтас мамандарға немесе хирургиялық кеңеске жолдау',
      ],
      en: [
        'Monitoring, if findings are within the normal range for age',
        'Glasses — a prescription is issued based on the refraction results',
        'Patching (occlusion) of the stronger eye for amblyopia',
        'A myopia control programme if short-sightedness is progressing',
        'Referral to other specialists or for a surgical opinion in case of squint',
      ],
    },
  },
  preparation: {
    ru: [
      'Возьмите текущие очки ребёнка и выписки предыдущих осмотров',
      'Если планируется циклоплегия, учтите: после капель зрение вблизи размыто и зрачки расширены несколько часов, лучше не планировать в этот день уроки и чтение',
      'Возьмите любимую игрушку или книжку — так ребёнку будет спокойнее',
      'Приходите, когда ребёнок выспался и не голоден',
    ],
    kk: [
      'Баланың қазіргі көзілдірігін және бұрынғы тексерулердің қорытындыларын алыңыз',
      'Циклоплегия жоспарланса, ескеріңіз: тамшылардан кейін жақыннан көру бірнеше сағат бұлыңғыр болып, қарашықтар кеңейеді, сол күні сабақ пен оқуды жоспарламаған жөн',
      'Баланың сүйікті ойыншығын немесе кітабын алыңыз — ол өзін тынышырақ сезінеді',
      'Бала ұйқысын қандырып, аш болмаған кезде келіңіз',
    ],
    en: [
      "Bring your child's current glasses and any previous eye reports",
      'If cycloplegic drops are planned, near vision will be blurred and pupils dilated for several hours — avoid planning homework or reading that day',
      'Bring a favourite toy or book to help your child feel at ease',
      'Come when your child is rested and not hungry',
    ],
  },
  result: {
    ru: 'После приёма вы получаете заключение с результатами обследования, при необходимости — рецепт на очки и понятный план наблюдения с датой следующего визита. Если у ребёнка внезапно появилось косоглазие, белый отблеск в зрачке на фотографиях или резкое снижение зрения, не ждите планового приёма — обратитесь к врачу как можно скорее.',
    kk: 'Қабылдаудан кейін сіз тексеру нәтижелері жазылған қорытынды, қажет болса көзілдірікке рецепт және келесі келу күні көрсетілген түсінікті бақылау жоспарын аласыз. Егер балада кенеттен қылилық пайда болса, суреттерде қарашықта ақ жылтыр көрінсе немесе көруі күрт төмендесе, жоспарлы қабылдауды күтпей, дәрігерге тез арада қаралыңыз.',
    en: "After the visit you receive a report of the findings, a glasses prescription if needed and a clear follow-up plan with the date of the next check. If your child suddenly develops a squint, a white reflex in the pupil appears in photos, or vision drops sharply, do not wait for a routine appointment — see a doctor promptly.",
  },
  faq: [
    {
      q: {
        ru: 'С какого возраста ребёнка стоит показывать офтальмологу?',
        kk: 'Баланы офтальмологқа қай жастан бастап көрсеткен жөн?',
        en: 'From what age should a child see an eye doctor?',
      },
      a: {
        ru: 'Первые осмотры проводят ещё в младенчестве, затем — в рекомендованные возрастные сроки и обязательно перед школой. При любых настораживающих признаках, например отклонении глаза, прийти можно в любом возрасте.',
        kk: 'Алғашқы тексерулер нәресте кезінде жүргізіледі, кейін — ұсынылған жас мерзімдерінде және міндетті түрде мектеп алдында. Көздің ауытқуы сияқты алаңдататын белгілер болса, кез келген жаста келуге болады.',
        en: 'The first checks take place in infancy, then at the recommended ages and always before school. If anything worries you, such as an eye turning, you can come at any age.',
      },
    },
    {
      q: {
        ru: 'Зачем закапывать капли, расширяющие зрачок?',
        kk: 'Қарашықты кеңейтетін тамшыларды не үшін тамызады?',
        en: 'Why are pupil-dilating drops needed?',
      },
      a: {
        ru: 'У детей сильная аккомодация, которая может исказить результат рефракции. Циклоплегические капли временно её расслабляют, и врач видит истинную рефракцию. Действие проходит само через несколько часов, иногда дольше — врач предупредит.',
        kk: 'Балаларда аккомодация күшті, ол рефракция нәтижесін бұрмалауы мүмкін. Циклоплегиялық тамшылар оны уақытша босаңсытады, дәрігер нақты рефракцияны көреді. Әсері бірнеше сағаттан кейін, кейде ұзағырақ уақытта өздігінен өтеді — дәрігер алдын ала ескертеді.',
        en: "Children have strong focusing power that can distort the refraction result. Cycloplegic drops relax it temporarily so the doctor can measure the true prescription. The effect wears off by itself within hours, sometimes longer — the doctor will let you know.",
      },
    },
    {
      q: {
        ru: 'Испортятся ли глаза, если ребёнок будет постоянно носить очки?',
        kk: 'Бала көзілдірікті үнемі тақса, көзі нашарлай ма?',
        en: 'Will wearing glasses all the time make my child\'s eyes weaker?',
      },
      a: {
        ru: 'Нет, правильно подобранные очки не ослабляют глаза. Наоборот, у детей чёткое изображение нужно для нормального развития зрения. Режим ношения врач определяет индивидуально.',
        kk: 'Жоқ, дұрыс таңдалған көзілдірік көзді әлсіретпейді. Керісінше, балаларда көрудің қалыпты дамуы үшін анық бейне қажет. Тағу режимін дәрігер жеке анықтайды.',
        en: 'No, correctly prescribed glasses do not weaken the eyes. In children a clear image is actually needed for vision to develop normally. The doctor decides individually how often they should be worn.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Refractive errors',
      href: 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/refractive-errors',
    },
    {
      label: 'NHS — Lazy eye',
      href: 'https://www.nhs.uk/conditions/lazy-eye/',
    },
  ],
  topics: ['дет', 'ребен', 'косоглаз', 'амблиоп', 'рефракц'],
};

export default content;
