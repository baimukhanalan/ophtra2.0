import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/smile (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'surgery',
  lead: {
    ru: 'SMILE — лазерная коррекция зрения, при которой хирург удаляет тонкую линзу из ткани роговицы через микроразрез, не формируя лоскут.',
    kk: 'SMILE — көруді лазермен түзету әдісі: хирург жапырақша жасамай, микрокесік арқылы қасаң қабық тінінен жұқа линзаны алып тастайды.',
    en: 'SMILE is laser vision correction in which the surgeon removes a thin lens of corneal tissue through a micro-incision, without creating a flap.',
  },
  overview: {
    ru: [
      'Фемтосекундный лазер формирует внутри роговицы тонкий диск ткани — лентикулу — и небольшой разрез. Через этот разрез хирург извлекает лентикулу, и форма роговицы меняется так, что изображение фокусируется на сетчатке. Поверхность роговицы при этом остаётся в основном нетронутой.',
      'SMILE применяют прежде всего для коррекции близорукости и астигматизма. Метод подходит не каждому: при тонкой или неправильной роговице, кератоконусе, некоторых заболеваниях глаз и общих заболеваниях, во время беременности врач может предложить другой вариант. Решение принимает хирург после обследования.',
    ],
    kk: [
      'Фемтосекундтық лазер қасаң қабықтың ішінде жұқа тін дискісін — лентикуланы — және шағын кесікті қалыптастырады. Хирург осы кесік арқылы лентикуланы шығарып алады, нәтижесінде қасаң қабықтың пішіні кескін торқабыққа дәл түсетіндей өзгереді. Бұл ретте қасаң қабықтың беті негізінен зақымданбайды.',
      'SMILE негізінен жақыннан көргіштік пен астигматизмді түзету үшін қолданылады. Әдіс бәріне бірдей сәйкес келмейді: қасаң қабық жұқа немесе пішіні дұрыс болмаса, кератоконус, көздің кейбір аурулары мен жалпы аурулар кезінде, жүктілік кезеңінде дәрігер басқа нұсқаны ұсынуы мүмкін. Шешімді хирург тексеруден кейін қабылдайды.',
    ],
    en: [
      'A femtosecond laser creates a thin disc of tissue inside the cornea — the lenticule — together with a small incision. The surgeon removes the lenticule through this incision, changing the shape of the cornea so that images focus on the retina. The corneal surface stays largely intact.',
      'SMILE is used mainly for short-sightedness and astigmatism. It is not suitable for everyone: with a thin or irregular cornea, keratoconus, some eye and general health conditions, or during pregnancy, your doctor may suggest another option. The decision is made by the surgeon after examination.',
    ],
  },
  indications: {
    ru: [
      'Близорукость, в том числе в сочетании с астигматизмом',
      'Возраст 18 лет и старше',
      'Стабильная рефракция не менее одного года',
      'Достаточная толщина роговицы и отсутствие признаков кератоконуса',
      'Активный образ жизни, контактные виды спорта, где нежелателен роговичный лоскут',
    ],
    kk: [
      'Жақыннан көргіштік, оның ішінде астигматизммен қатар',
      'Жасы 18-ден асқан',
      'Рефракцияның кемінде бір жыл тұрақты болуы',
      'Қасаң қабықтың жеткілікті қалыңдығы және кератоконус белгілерінің болмауы',
      'Белсенді өмір салты, қасаң қабық жапырақшасы қалаусыз болатын жанаспалы спорт түрлері',
    ],
    en: [
      'Short-sightedness, including with astigmatism',
      'Age 18 or over',
      'Stable prescription for at least one year',
      'Adequate corneal thickness and no signs of keratoconus',
      'An active lifestyle or contact sports where a corneal flap is best avoided',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Обследование перед SMILE такое же подробное, как перед любой лазерной коррекцией: оно подтверждает, что роговица здорова и достаточно прочна.',
      kk: 'SMILE алдындағы тексеру кез келген лазерлік түзету алдындағыдай толық жүргізіледі: ол қасаң қабықтың сау әрі жеткілікті берік екенін растайды.',
      en: 'The assessment before SMILE is as thorough as before any laser correction: it confirms that the cornea is healthy and strong enough.',
    },
    list: {
      ru: [
        'Кератотопография и томография роговицы',
        'Пахиметрия — толщина роговицы',
        'Рефрактометрия, в том числе после расширения зрачка',
        'Оценка слёзной плёнки',
        'Осмотр глазного дна',
      ],
      kk: [
        'Кератотопография және қасаң қабық томографиясы',
        'Пахиметрия — қасаң қабықтың қалыңдығы',
        'Рефрактометрия, оның ішінде қарашықты кеңейткеннен кейін',
        'Жас қабықшасын бағалау',
        'Көз түбін қарау',
      ],
      en: [
        'Corneal topography and tomography',
        'Pachymetry — corneal thickness',
        'Refraction, including after pupil dilation',
        'Tear film assessment',
        'Retinal examination',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Выбор между SMILE и другими методами зависит от вида и величины рефракции, особенностей роговицы и ваших повседневных задач.',
      kk: 'SMILE мен басқа әдістердің арасындағы таңдау рефракцияның түрі мен шамасына, қасаң қабықтың ерекшеліктеріне және күнделікті міндеттеріңізге байланысты.',
      en: 'The choice between SMILE and other methods depends on the type and size of your prescription, your corneal features and your everyday needs.',
    },
    list: {
      ru: [
        'SMILE — без лоскута, через небольшой разрез',
        'Femto-LASIK — более широкий диапазон коррекции, включая дальнозоркость',
        'ФРК — при тонкой роговице или особенностях её поверхности',
        'Факичная интраокулярная линза — при высокой близорукости',
        'Очки или контактные линзы — если хирургия не показана или нежелательна',
      ],
      kk: [
        'SMILE — жапырақшасыз, шағын кесік арқылы',
        'Femto-LASIK — түзету ауқымы кеңірек, алыстан көргіштікті де қамтиды',
        'ФРК — қасаң қабық жұқа болса немесе оның бетінің ерекшеліктері болса',
        'Факиялық көзішілік линза — жақыннан көргіштік жоғары болса',
        'Көзілдірік немесе жанаспа линзалар — хирургия көрсетілмесе немесе қалаусыз болса',
      ],
      en: [
        'SMILE — no flap, through a small incision',
        'Femto-LASIK — a wider correction range, including long-sightedness',
        'PRK — for a thin cornea or particular surface features',
        'Phakic intraocular lens — for high short-sightedness',
        'Glasses or contact lenses — if surgery is not indicated or not wanted',
      ],
    },
  },
  preparation: {
    ru: [
      'Прекратите носить контактные линзы заранее — срок назовёт врач',
      'Не наносите макияж и крем на лицо в день операции',
      'Возьмите с собой солнцезащитные очки',
      'Попросите близкого проводить вас домой: садиться за руль в день операции нельзя',
    ],
    kk: [
      'Жанаспа линзаларды алдын ала тағуды тоқтатыңыз — мерзімін дәрігер айтады',
      'Операция күні бетке бояу-опа мен крем жақпаңыз',
      'Өзіңізбен бірге күннен қорғайтын көзілдірік алыңыз',
      'Жақын адамыңыздан үйге дейін шығарып салуды өтініңіз: операция күні көлік жүргізуге болмайды',
    ],
    en: [
      'Stop wearing contact lenses in advance — your doctor will tell you how long',
      'Do not wear make-up or face cream on the day of surgery',
      'Bring sunglasses with you',
      'Ask someone to take you home: you must not drive on the day of surgery',
    ],
  },
  result: {
    ru: 'Зрение улучшается в первые дни, но у некоторых пациентов чёткость нарастает постепенно в течение нескольких недель. Контрольные осмотры проводятся на следующий день и затем по графику врача. Временно могут беспокоить сухость глаз, колебания чёткости, ореолы вокруг огней в темноте. Результат зависит от особенностей глаза, и гарантировать определённую остроту зрения невозможно; при необходимости обсуждается дополнительная коррекция.',
    kk: 'Көру алғашқы күндері жақсарады, бірақ кейбір пациенттерде анықтық бірнеше апта ішінде бірте-бірте артады. Бақылау тексерулері келесі күні, содан кейін дәрігердің кестесі бойынша өткізіледі. Уақытша көздің құрғауы, анықтықтың құбылуы, қараңғыда шамдардың айналасында гало мазалауы мүмкін. Нәтиже көздің ерекшеліктеріне байланысты, белгілі бір көру өткірлігіне кепілдік беру мүмкін емес; қажет болса қосымша түзету талқыланады.',
    en: 'Vision improves in the first days, although for some people sharpness builds gradually over several weeks. Check-ups take place the next day and then as your doctor advises. Dry eyes, fluctuating clarity and halos around lights in the dark may be bothersome for a while. The outcome depends on the individual eye and no specific level of vision can be guaranteed; further correction can be discussed if needed.',
  },
  faq: [
    {
      q: {
        ru: 'Правда ли, что после SMILE меньше сухости глаз?',
        kk: 'SMILE-дан кейін көздің құрғауы азырақ болатыны рас па?',
        en: 'Is it true that SMILE causes less dry eye?',
      },
      a: {
        ru: 'Поскольку разрез небольшой, нервные волокна роговицы затрагиваются меньше, и у части пациентов сухость выражена слабее. Однако временная сухость возможна после любого метода, и её лечат увлажняющими каплями.',
        kk: 'Кесік шағын болғандықтан, қасаң қабықтың жүйке талшықтары азырақ зақымданады, сондықтан кейбір пациенттерде құрғақтық әлсіздеу білінеді. Алайда уақытша құрғақтық кез келген әдістен кейін болуы мүмкін, оны ылғалдандыратын тамшылармен емдейді.',
        en: 'Because the incision is small, fewer corneal nerve fibres are affected, and some people have milder dryness. However, temporary dryness can occur after any method and is treated with lubricating drops.',
      },
    },
    {
      q: {
        ru: 'Можно ли исправить дальнозоркость методом SMILE?',
        kk: 'SMILE әдісімен алыстан көргіштікті түзетуге бола ма?',
        en: 'Can SMILE correct long-sightedness?',
      },
      a: {
        ru: 'SMILE используется в основном при близорукости и астигматизме. При дальнозоркости врач, как правило, рассматривает другие методы, например Femto-LASIK.',
        kk: 'SMILE негізінен жақыннан көргіштік пен астигматизм кезінде қолданылады. Алыстан көргіштік болса, дәрігер әдетте басқа әдістерді, мысалы, Femto-LASIK-ті қарастырады.',
        en: 'SMILE is used mainly for short-sightedness and astigmatism. For long-sightedness your doctor will usually consider other methods, such as Femto-LASIK.',
      },
    },
    {
      q: {
        ru: 'Оперируют оба глаза в один день?',
        kk: 'Екі көзге бір күнде операция жасала ма?',
        en: 'Are both eyes treated on the same day?',
      },
      a: {
        ru: 'Часто да, но решение принимает хирург с учётом результатов обследования и ваших пожеланий.',
        kk: 'Көбінесе иә, бірақ шешімді хирург тексеру нәтижелері мен сіздің қалауыңызды ескере отырып қабылдайды.',
        en: 'Often, yes, but the surgeon decides based on your examination results and your preferences.',
      },
    },
  ],
  sources: [
    {
      label: 'EyeWiki (AAO) — Keratorefractive Lenticule Extraction (SMILE)',
      href: 'https://eyewiki.org/Small_Incision_Lenticule_Extraction_(SMILE)',
    },
    {
      label: 'NHS — Laser eye surgery and lens surgery',
      href: 'https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/',
    },
  ],
  topics: ['лазер', 'коррекц', 'близорук', 'астигматизм', 'рефракц'],
};

export default content;
