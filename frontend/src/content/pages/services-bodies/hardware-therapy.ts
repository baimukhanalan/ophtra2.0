import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/hardware-therapy (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'therapy',
  lead: {
    ru: 'Курс аппаратных тренировок зрения при амблиопии и нарушениях аккомодации — как дополнение к очкам и окклюзии, а не их замена.',
    kk: 'Амблиопия мен аккомодация бұзылыстарында көруді аппаратпен жаттықтыру курсы — көзілдірік пен окклюзияның орнына емес, оларға қосымша ретінде.',
    en: 'A course of instrument-based vision training for amblyopia and focusing problems — as a complement to glasses and patching, not a replacement for them.',
  },
  overview: {
    ru: [
      'Амблиопия («ленивый глаз») — состояние, при котором один глаз видит хуже, даже с правильной коррекцией, потому что зрительная система развивалась без чёткого изображения. Основу лечения с наиболее убедительной доказательной базой составляют правильно подобранные очки и окклюзия или пенализация лучше видящего глаза.',
      'Аппаратное лечение — это серия сеансов на специальных приборах и компьютерных программах, которые тренируют аккомодацию, фиксацию и бинокулярное зрение. Врач может назначить его в дополнение к основному лечению; решение о курсе и его пользе для конкретного ребёнка принимается индивидуально.',
    ],
    kk: [
      'Амблиопия («жалқау көз») — дұрыс түзетудің өзінде бір көздің нашар көруі, себебі көру жүйесі анық бейнесіз дамыған. Дәлелдік базасы ең сенімді емнің негізі — дұрыс таңдалған көзілдірік және жақсы көретін көзді окклюзиялау немесе пенализациялау.',
      'Аппараттық емдеу — аккомодацияны, фиксацияны және бинокулярлық көруді жаттықтыратын арнайы құрылғылар мен компьютерлік бағдарламалардағы сеанстар сериясы. Дәрігер оны негізгі емге қосымша тағайындауы мүмкін; курс туралы және оның нақты балаға пайдасы туралы шешім жеке қабылданады.',
    ],
    en: [
      'Amblyopia ("lazy eye") means one eye sees less well even with the right correction, because the visual system developed without a clear image. The treatments with the strongest evidence are correctly prescribed glasses and patching or penalisation (blurring) of the stronger eye.',
      'Hardware therapy is a series of sessions on special devices and computer programmes that train focusing, fixation and binocular vision. The doctor may recommend it alongside the main treatment; whether a course is appropriate and useful for a particular child is decided individually.',
    ],
  },
  indications: {
    ru: [
      'Амблиопия — как дополнение к очкам и окклюзии',
      'Спазм аккомодации и привычно-избыточное напряжение аккомодации',
      'Слабость аккомодации, быстрая зрительная утомляемость при работе вблизи',
      'Нарушения бинокулярного зрения по назначению врача',
      'Период после хирургического лечения косоглазия — по показаниям',
    ],
    kk: [
      'Амблиопия — көзілдірік пен окклюзияға қосымша ретінде',
      'Аккомодация спазмы және аккомодацияның әдеттегі шамадан тыс кернеуі',
      'Аккомодацияның әлсіздігі, жақыннан жұмыс істегенде көздің тез шаршауы',
      'Дәрігердің тағайындауы бойынша бинокулярлық көрудің бұзылыстары',
      'Қылилықты хирургиялық емдеуден кейінгі кезең — көрсеткіштер бойынша',
    ],
    en: [
      'Amblyopia — alongside glasses and patching',
      'Accommodative spasm and habitual excessive focusing effort',
      'Weak accommodation and quick eye fatigue during near work',
      'Binocular vision problems, as prescribed by the doctor',
      'The period after squint surgery — when indicated',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Перед назначением курса врач уточняет диагноз и исходные показатели, чтобы потом оценить динамику:',
      kk: 'Курсты тағайындар алдында дәрігер диагнозды және кейін өзгерісті бағалау үшін бастапқы көрсеткіштерді нақтылайды:',
      en: 'Before prescribing a course the doctor confirms the diagnosis and records baseline measurements to track progress later:',
    },
    list: {
      ru: [
        'Остроту зрения каждого глаза с коррекцией и без',
        'Рефракцию в условиях циклоплегии',
        'Объём и запас аккомодации',
        'Тесты бинокулярного зрения и оценку положения глаз',
        'Осмотр глазного дна, чтобы исключить органические причины снижения зрения',
      ],
      kk: [
        'Әр көздің түзетумен және түзетусіз көру өткірлігі',
        'Циклоплегия жағдайындағы рефракция',
        'Аккомодацияның көлемі мен қоры',
        'Бинокулярлық көру сынамалары және көздің орналасуын бағалау',
        'Көрудің төмендеуінің органикалық себептерін жоққа шығару үшін көз түбін қарау',
      ],
      en: [
        'Visual acuity of each eye with and without correction',
        'Cycloplegic refraction',
        'Amplitude and reserve of accommodation',
        'Binocular vision tests and eye alignment assessment',
        'A retinal examination to rule out structural causes of reduced vision',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Курс состоит из 10 сеансов. Набор методик подбирается по диагнозу и возрасту ребёнка:',
      kk: 'Курс 10 сеанстан тұрады. Әдістер жиынтығы баланың диагнозы мен жасына қарай таңдалады:',
      en: 'The course consists of 10 sessions. The set of techniques is chosen according to the diagnosis and the child\'s age:',
    },
    list: {
      ru: [
        'Тренировки аккомодации на приборах с изменяемыми линзами и стимулами',
        'Компьютерные программы для тренировки зрения, в том числе бинокулярные (дихоптические) упражнения',
        'Упражнения на фиксацию и зрительно-моторную координацию',
        'Продолжение ношения очков и окклюзии по плану врача — основа лечения амблиопии',
      ],
      kk: [
        'Ауыспалы линзалар мен тітіркендіргіштері бар құрылғыларда аккомодацияны жаттықтыру',
        'Көруді жаттықтыруға арналған компьютерлік бағдарламалар, соның ішінде бинокулярлық (дихоптикалық) жаттығулар',
        'Фиксацияға және көру-қозғалыс үйлесімділігіне арналған жаттығулар',
        'Дәрігер жоспары бойынша көзілдірік тағуды және окклюзияны жалғастыру — амблиопияны емдеудің негізі',
      ],
      en: [
        'Focusing exercises on devices with changing lenses and targets',
        'Computer-based vision training, including binocular (dichoptic) exercises',
        'Fixation and eye–hand coordination exercises',
        'Continued glasses wear and patching as planned by the doctor — the foundation of amblyopia treatment',
      ],
    },
  },
  preparation: {
    ru: [
      'Приходите на каждый сеанс в своих очках',
      'Старайтесь не пропускать сеансы — важна регулярность курса',
      'Ребёнок должен быть отдохнувшим; после болезни лучше перенести сеанс',
      'Продолжайте дома окклюзию и другие назначения врача',
    ],
    kk: [
      'Әр сеансқа өз көзілдірігіңізбен келіңіз',
      'Сеанстарды өткізіп алмауға тырысыңыз — курстың жүйелілігі маңызды',
      'Бала демалған болуы тиіс; ауырғаннан кейін сеансты ауыстырған дұрыс',
      'Үйде окклюзияны және дәрігердің басқа тағайындауларын жалғастырыңыз',
    ],
    en: [
      'Come to every session wearing your glasses',
      'Try not to miss sessions — regularity matters',
      'Your child should be rested; after an illness it is better to reschedule',
      'Keep up patching and other home instructions from the doctor',
    ],
  },
  result: {
    ru: 'После курса врач повторно проверяет остроту зрения и аккомодацию и сравнивает их с исходными. Ответ на лечение у детей разный, поэтому заранее гарантировать результат нельзя; при необходимости курс повторяют или меняют тактику. Лучших результатов обычно удаётся добиться, когда лечение начато в раннем возрасте и ребёнок постоянно носит очки.',
    kk: 'Курстан кейін дәрігер көру өткірлігі мен аккомодацияны қайта тексеріп, бастапқы көрсеткіштермен салыстырады. Балалардың емге жауабы әртүрлі, сондықтан нәтижеге алдын ала кепілдік беру мүмкін емес; қажет болса курс қайталанады немесе тәсіл өзгертіледі. Әдетте ем ерте жаста басталып, бала көзілдірікті үнемі тағатын болса, жақсы нәтижеге жету мүмкіндігі жоғары.',
    en: 'After the course the doctor re-checks visual acuity and focusing and compares them with the baseline. Children respond differently, so no result can be guaranteed in advance; if needed the course is repeated or the approach is changed. Results are usually better when treatment starts early and glasses are worn consistently.',
  },
  faq: [
    {
      q: {
        ru: 'Можно ли вылечить амблиопию только аппаратным лечением, без очков и окклюзии?',
        kk: 'Амблиопияны көзілдірік пен окклюзиясыз тек аппараттық еммен емдеуге бола ма?',
        en: 'Can amblyopia be treated with hardware therapy alone, without glasses or patching?',
      },
      a: {
        ru: 'Нет. Наиболее сильные доказательства эффективности есть у очковой коррекции и окклюзии (или пенализации). Аппаратные тренировки могут дополнять их, но не заменяют.',
        kk: 'Жоқ. Тиімділігінің ең күшті дәлелдері көзілдірікпен түзетуде және окклюзияда (немесе пенализацияда) бар. Аппараттық жаттығулар оларды толықтыруы мүмкін, бірақ алмастырмайды.',
        en: 'No. The strongest evidence of effectiveness is for glasses and patching (or penalisation). Instrument-based training can complement them but does not replace them.',
      },
    },
    {
      q: {
        ru: 'Больно ли ребёнку на сеансах?',
        kk: 'Сеанстарда балаға ауырмай ма?',
        en: 'Are the sessions uncomfortable for a child?',
      },
      a: {
        ru: 'Нет, процедуры безболезненные и проходят в игровой форме. Ребёнок смотрит на изображения, выполняет задания на экране или в приборе.',
        kk: 'Жоқ, процедуралар ауыртпалықсыз және ойын түрінде өтеді. Бала суреттерге қарап, экрандағы немесе құрылғыдағы тапсырмаларды орындайды.',
        en: 'No, the procedures are painless and feel like a game. Your child looks at pictures and completes tasks on a screen or in a device.',
      },
    },
    {
      q: {
        ru: 'Сколько курсов понадобится?',
        kk: 'Қанша курс қажет болады?',
        en: 'How many courses will be needed?',
      },
      a: {
        ru: 'Это решается индивидуально после контрольного осмотра. Врач оценивает динамику и объясняет, есть ли смысл в повторном курсе или стоит изменить план лечения.',
        kk: 'Бұл бақылау тексеруінен кейін жеке шешіледі. Дәрігер өзгерісті бағалап, қайта курстың мәні бар-жоғын немесе ем жоспарын өзгерту керектігін түсіндіреді.',
        en: 'This is decided individually after a follow-up check. The doctor reviews the progress and explains whether a repeat course makes sense or the treatment plan should change.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Amblyopia (lazy eye)',
      href: 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/amblyopia-lazy-eye',
    },
    {
      label: 'NHS — Lazy eye',
      href: 'https://www.nhs.uk/conditions/lazy-eye/',
    },
  ],
  topics: ['амблиоп', 'аккомодац', 'дет', 'ленив'],
};

export default content;
