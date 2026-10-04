import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/femto-lasik (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'surgery',
  lead: {
    ru: 'Femto-LASIK — лазерная коррекция близорукости, дальнозоркости и астигматизма, при которой роговичный лоскут формируется фемтосекундным лазером, а не механическим микрокератомом.',
    kk: 'Femto-LASIK — жақыннан көргіштікті, алыстан көргіштікті және астигматизмді лазермен түзету әдісі: қасаң қабық жапырақшасы механикалық микрокератоммен емес, фемтосекундтық лазермен жасалады.',
    en: 'Femto-LASIK is laser correction of short-sightedness, long-sightedness and astigmatism in which the corneal flap is created with a femtosecond laser rather than a mechanical microkeratome.',
  },
  overview: {
    ru: [
      'Операция проходит в два этапа. Сначала фемтосекундный лазер формирует тонкий роговичный лоскут, который хирург аккуратно отводит в сторону. Затем эксимерный лазер изменяет форму глубже лежащих слоёв роговицы, после чего лоскут укладывают на место — швы не нужны.',
      'Процедура проводится под местной анестезией каплями и обычно занимает немного времени на каждый глаз. Подходит ли вам Femto-LASIK, решает хирург после полного обследования: при тонкой или неправильной по форме роговице, выраженном «сухом глазе», кератоконусе, некоторых общих заболеваниях, во время беременности и кормления грудью метод может быть не рекомендован.',
    ],
    kk: [
      'Операция екі кезеңнен тұрады. Алдымен фемтосекундтық лазер қасаң қабықтың жұқа жапырақшасын қалыптастырады, хирург оны абайлап шетке қайырады. Содан кейін эксимерлік лазер қасаң қабықтың тереңірек қабаттарының пішінін өзгертеді, жапырақша орнына қайта салынады — тігіс қажет емес.',
      'Процедура тамшы түріндегі жергілікті жансыздандырумен жүргізіледі және әр көзге аз уақыт алады. Femto-LASIK сізге сәйкес келетінін хирург толық тексеруден кейін шешеді: қасаң қабық жұқа немесе пішіні дұрыс болмаса, «құрғақ көз» айқын білінсе, кератоконус, кейбір жалпы аурулар кезінде, жүктілік пен бала емізу кезеңінде бұл әдіс ұсынылмауы мүмкін.',
    ],
    en: [
      'The operation has two stages. First, a femtosecond laser creates a thin corneal flap, which the surgeon gently folds back. An excimer laser then reshapes the deeper corneal layers, and the flap is laid back in place — no stitches are needed.',
      'The procedure is done under anaesthetic eye drops and takes only a short time per eye. Whether Femto-LASIK suits you is decided by the surgeon after a full examination: a thin or irregular cornea, significant dry eye, keratoconus, certain general health conditions, pregnancy and breastfeeding may make the method unsuitable.',
    ],
  },
  indications: {
    ru: [
      'Близорукость, дальнозоркость или астигматизм в пределах, подходящих для лазерной коррекции',
      'Возраст 18 лет и старше',
      'Стабильная рефракция не менее одного года',
      'Достаточная толщина и правильная форма роговицы по данным обследования',
      'Непереносимость или неудобство очков и контактных линз',
      'Профессиональные или спортивные требования к зрению без оптики',
    ],
    kk: [
      'Лазерлік түзетуге сәйкес шектердегі жақыннан көргіштік, алыстан көргіштік немесе астигматизм',
      'Жасы 18-ден асқан',
      'Рефракцияның кемінде бір жыл тұрақты болуы',
      'Тексеру нәтижесі бойынша қасаң қабықтың жеткілікті қалыңдығы мен дұрыс пішіні',
      'Көзілдірік пен жанаспа линзаларды көтере алмау немесе оларды қолайсыз санау',
      'Кәсіби немесе спорттық тұрғыдан оптикасыз көру қажеттігі',
    ],
    en: [
      'Short-sightedness, long-sightedness or astigmatism within the range suitable for laser correction',
      'Age 18 or over',
      'Stable prescription for at least one year',
      'Adequate corneal thickness and regular corneal shape on examination',
      'Intolerance of, or inconvenience with, glasses and contact lenses',
      'Work or sport that calls for good vision without glasses',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Перед операцией проводится расширенное обследование: оно показывает, безопасна ли лазерная коррекция и какой метод подходит лучше.',
      kk: 'Операция алдында кеңейтілген тексеру жүргізіледі: ол лазерлік түзетудің қауіпсіз екенін және қай әдіс қолайлырақ екенін көрсетеді.',
      en: 'Before surgery you have an extended examination that shows whether laser correction is safe for you and which method fits best.',
    },
    list: {
      ru: [
        'Кератотопография и томография роговицы — форма поверхности и исключение кератоконуса',
        'Пахиметрия — измерение толщины роговицы',
        'Рефрактометрия и проверка остроты зрения, в том числе после расширения зрачка',
        'Оценка слёзной плёнки и признаков «сухого глаза»',
        'Осмотр глазного дна и, при необходимости, ОКТ сетчатки',
      ],
      kk: [
        'Кератотопография және қасаң қабық томографиясы — беткі пішінін бағалау және кератоконусты жоққа шығару',
        'Пахиметрия — қасаң қабықтың қалыңдығын өлшеу',
        'Рефрактометрия және көру өткірлігін тексеру, оның ішінде қарашықты кеңейткеннен кейін',
        'Жас қабықшасын және «құрғақ көз» белгілерін бағалау',
        'Көз түбін қарау және қажет болса торқабықтың ОКТ-сы',
      ],
      en: [
        'Corneal topography and tomography — surface shape and screening for keratoconus',
        'Pachymetry — measuring corneal thickness',
        'Refraction and visual acuity testing, including after pupil dilation',
        'Tear film and dry eye assessment',
        'Retinal examination and, if needed, retinal OCT',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Femto-LASIK — один из нескольких способов коррекции. Хирург сравнивает варианты с учётом толщины роговицы, величины рефракции, образа жизни и состояния глазной поверхности.',
      kk: 'Femto-LASIK — түзетудің бірнеше тәсілінің бірі. Хирург қасаң қабықтың қалыңдығын, рефракция шамасын, өмір салтын және көз бетінің жағдайын ескере отырып, нұсқаларды салыстырады.',
      en: 'Femto-LASIK is one of several ways to correct vision. The surgeon compares the options taking into account corneal thickness, the size of the prescription, your lifestyle and the health of the eye surface.',
    },
    list: {
      ru: [
        'Femto-LASIK — быстрое восстановление зрения при достаточной толщине роговицы',
        'SMILE — коррекция через микроразрез без лоскута',
        'ФРК — поверхностная методика, если роговица тонкая или есть риск травм глаза',
        'Факичная интраокулярная линза — при высокой рефракции, когда лазер не подходит',
        'Очки или контактные линзы — всегда остаются безопасной альтернативой',
      ],
      kk: [
        'Femto-LASIK — қасаң қабық жеткілікті қалың болғанда көру тез қалпына келеді',
        'SMILE — жапырақшасыз микрокесік арқылы түзету',
        'ФРК — қасаң қабық жұқа болса немесе көз жарақатының қаупі болса қолданылатын беткі әдіс',
        'Факиялық көзішілік линза — рефракция жоғары болып, лазер сәйкес келмегенде',
        'Көзілдірік немесе жанаспа линзалар — әрқашан қауіпсіз балама болып қала береді',
      ],
      en: [
        'Femto-LASIK — quick visual recovery when the cornea is thick enough',
        'SMILE — correction through a micro-incision without a flap',
        'PRK — a surface technique if the cornea is thin or there is a risk of eye injury',
        'Phakic intraocular lens — for high prescriptions when laser is not suitable',
        'Glasses or contact lenses — always a safe alternative',
      ],
    },
  },
  preparation: {
    ru: [
      'Не носите мягкие контактные линзы до обследования и операции — срок подскажет врач (жёсткие линзы обычно снимают раньше)',
      'В день операции не используйте макияж, кремы для лица и духи',
      'Договоритесь, чтобы кто-то проводил вас домой: за руль в этот день садиться нельзя',
      'Сообщите врачу о всех принимаемых лекарствах и общих заболеваниях',
    ],
    kk: [
      'Тексеру мен операцияға дейін жұмсақ жанаспа линзаларды таспаңыз — мерзімін дәрігер айтады (қатты линзаларды әдетте ертерек алады)',
      'Операция күні бояу-опа, бетке арналған крем мен иіссу қолданбаңыз',
      'Сізді үйге дейін шығарып салатын адамды алдын ала келісіп қойыңыз: ол күні көлік жүргізуге болмайды',
      'Қабылдап жүрген барлық дәрі-дәрмектер мен жалпы аурулар туралы дәрігерге айтыңыз',
    ],
    en: [
      'Stop wearing soft contact lenses before the examination and surgery — your doctor will tell you how long (rigid lenses usually need to come out earlier)',
      'Do not wear make-up, face cream or perfume on the day of surgery',
      'Arrange for someone to take you home: you must not drive that day',
      'Tell your doctor about all medicines you take and any general health conditions',
    ],
  },
  result: {
    ru: 'Зрение обычно заметно улучшается уже в первые сутки, а окончательно стабилизируется в течение нескольких недель. Контрольные осмотры назначают на следующий день и далее по графику врача. В первые недели возможны сухость, ощущение песка, ореолы и блики вокруг источников света ночью — как правило, они постепенно уменьшаются. Результат зависит от индивидуальных особенностей глаза; иногда сохраняется небольшая остаточная рефракция, а с возрастом могут понадобиться очки для чтения.',
    kk: 'Көру әдетте алғашқы тәуліктің өзінде айтарлықтай жақсарады, ал толық тұрақтануы бірнеше аптаға созылады. Бақылау тексерулері келесі күні және одан әрі дәрігердің кестесі бойынша тағайындалады. Алғашқы апталарда құрғақтық, көзге құм түскендей сезім, түнде жарық көздерінің айналасында гало мен жылтыр пайда болуы мүмкін — әдетте олар бірте-бірте азаяды. Нәтиже көздің жеке ерекшеліктеріне байланысты; кейде шамалы қалдық рефракция сақталуы мүмкін, ал жас ұлғайған сайын оқуға арналған көзілдірік қажет болуы ықтимал.',
    en: 'Vision usually improves noticeably within the first day and settles fully over several weeks. Check-ups are scheduled for the next day and then as your doctor advises. In the first weeks you may notice dryness, a gritty feeling, and halos or glare around lights at night — these usually fade gradually. The outcome depends on the individual eye; a small residual prescription sometimes remains, and reading glasses may still be needed with age.',
  },
  faq: [
    {
      q: {
        ru: 'Больно ли во время операции?',
        kk: 'Операция кезінде ауырта ма?',
        en: 'Does the operation hurt?',
      },
      a: {
        ru: 'Глаз обезболивают каплями, поэтому боли обычно нет — возможно ощущение давления. После операции в течение нескольких часов может быть жжение и слезотечение.',
        kk: 'Көз тамшымен жансыздандырылады, сондықтан әдетте ауырмайды — тек қысым сезілуі мүмкін. Операциядан кейін бірнеше сағат бойы ашу мен жас ағуы байқалуы мүмкін.',
        en: 'The eye is numbed with drops, so there is usually no pain — you may feel some pressure. For a few hours afterwards you may have stinging and watering.',
      },
    },
    {
      q: {
        ru: 'Чем Femto-LASIK отличается от SMILE?',
        kk: 'Femto-LASIK пен SMILE-дың айырмашылығы неде?',
        en: 'How does Femto-LASIK differ from SMILE?',
      },
      a: {
        ru: 'При Femto-LASIK формируется роговичный лоскут, а при SMILE коррекция выполняется через небольшой разрез без лоскута. Оба метода подходят не всем; какой из них уместен в вашем случае, врач определит по результатам обследования.',
        kk: 'Femto-LASIK кезінде қасаң қабық жапырақшасы жасалады, ал SMILE кезінде түзету жапырақшасыз шағын кесік арқылы жүргізіледі. Екі әдіс те бәріне бірдей сәйкес келмейді; сіздің жағдайыңызға қайсысы лайық екенін дәрігер тексеру нәтижесі бойынша анықтайды.',
        en: 'Femto-LASIK involves a corneal flap, while SMILE is done through a small incision without a flap. Neither suits everyone; your doctor will decide which is appropriate based on your examination.',
      },
    },
    {
      q: {
        ru: 'Когда можно вернуться к работе и спорту?',
        kk: 'Жұмысқа және спортқа қашан оралуға болады?',
        en: 'When can I return to work and sport?',
      },
      a: {
        ru: 'К офисной работе многие возвращаются через несколько дней. Бассейн, баню и контактные виды спорта обычно откладывают на более долгий срок — точные ограничения врач даст на контрольном осмотре.',
        kk: 'Кеңсе жұмысына көпшілігі бірнеше күннен кейін оралады. Бассейн, монша және жанаспалы спорт түрлерін әдетте ұзағырақ уақытқа кейінге қалдырады — нақты шектеулерді дәрігер бақылау тексеруінде айтады.',
        en: 'Many people return to office work within a few days. Swimming, saunas and contact sports are usually postponed for longer — your doctor will give exact restrictions at your check-up.',
      },
    },
  ],
  sources: [
    {
      label: 'American Academy of Ophthalmology — LASIK Laser Eye Surgery',
      href: 'https://www.aao.org/eye-health/treatments/lasik',
    },
    {
      label: 'NHS — Laser eye surgery and lens surgery',
      href: 'https://www.nhs.uk/conditions/laser-eye-surgery-and-lens-surgery/',
    },
  ],
  topics: ['лазер', 'коррекц', 'близорук', 'астигматизм', 'рефракц'],
};

export default content;
