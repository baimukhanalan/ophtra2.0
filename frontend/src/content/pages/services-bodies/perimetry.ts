import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/perimetry (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'test',
  lead: {
    ru: 'Компьютерное исследование полей зрения: показывает, насколько хорошо вы видите не только в центре, но и по сторонам.',
    kk: 'Көру өрістерін компьютерлік зерттеу: орталықта ғана емес, жан-жақта да қаншалықты жақсы көретініңізді көрсетеді.',
    en: 'A computerised visual field test that shows how well you see not only straight ahead but also to the sides.',
  },
  overview: {
    ru: [
      'Во время периметрии вы смотрите в центр полусферы и нажимаете кнопку, когда замечаете слабые световые точки, появляющиеся в разных участках поля зрения. Программа строит карту чувствительности и отмечает зоны, где зрение снижено.',
      'Многие заболевания, прежде всего глаукома, сначала затрагивают периферию, и человек долго этого не замечает. Периметрия помогает выявить такие изменения и, при повторении, оценить, стабильна ли ситуация.',
    ],
    kk: [
      'Периметрия кезінде сіз жарты шардың ортасына қарап, көру өрісінің әр жерінде пайда болатын әлсіз жарық нүктелерін байқаған сәтте түймені басасыз. Бағдарлама сезімталдық картасын жасап, көру төмендеген аймақтарды белгілейді.',
      'Көптеген аурулар, ең алдымен глаукома, әуелі шеткі көруді зақымдайды, ал адам мұны ұзақ уақыт байқамайды. Периметрия осындай өзгерістерді анықтауға және қайталап жүргізгенде жағдайдың тұрақты екенін бағалауға көмектеседі.',
    ],
    en: [
      'During perimetry you look at the centre of a bowl and press a button whenever you notice faint spots of light appearing in different parts of your visual field. The software builds a sensitivity map and highlights areas where vision is reduced.',
      'Many conditions, glaucoma above all, affect side vision first, and people often do not notice it for a long time. Perimetry helps detect such changes and, when repeated, shows whether things are stable.',
    ],
  },
  indications: {
    ru: [
      'Подозрение на глаукому или наблюдение при установленной глаукоме',
      'Повышенное внутриглазное давление',
      'Изменения диска зрительного нерва, выявленные при осмотре или ОКТ',
      'Заболевания зрительного нерва и некоторые неврологические состояния',
      'Жалобы на «выпадение» участков зрения — при внезапной потере поля зрения обратитесь за помощью срочно',
    ],
    kk: [
      'Глаукомаға күдік немесе анықталған глаукома кезіндегі бақылау',
      'Көз ішілік қысымның жоғарылауы',
      'Қарау немесе ОКТ кезінде анықталған көру жүйкесі дискісінің өзгерістері',
      'Көру жүйкесінің аурулары және кейбір неврологиялық жағдайлар',
      'Көрудің кей бөліктері «түсіп қалғандай» сезілуі — көру өрісі кенет жоғалса, дереу көмекке жүгініңіз',
    ],
    en: [
      'Suspected glaucoma or monitoring of known glaucoma',
      'Raised eye pressure',
      'Optic disc changes seen on examination or OCT',
      'Optic nerve disease and some neurological conditions',
      'Patches of missing vision — if you suddenly lose part of your field of vision, seek urgent care',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Результат периметрии оценивается вместе с другими данными — по одному тесту диагноз не ставят.',
      kk: 'Периметрия нәтижесі басқа деректермен бірге бағаланады — бір ғана зерттеу бойынша диагноз қойылмайды.',
      en: 'Perimetry results are assessed together with other findings — a diagnosis is never based on one test alone.',
    },
    list: {
      ru: [
        'Пороговая стратегия для центральных 24° или 30° поля зрения',
        'Показатели надёжности: ложные ответы и потери фиксации',
        'Сопоставление со структурой нерва по данным ОКТ',
        'Анализ динамики по серии повторных исследований',
      ],
      kk: [
        'Көру өрісінің орталық 24° немесе 30° аймағына арналған табалдырықтық стратегия',
        'Сенімділік көрсеткіштері: жалған жауаптар және бекітудің жоғалуы',
        'ОКТ деректері бойынша жүйке құрылымымен салыстыру',
        'Қайталанған зерттеулер сериясы бойынша өзгерісті талдау',
      ],
      en: [
        'Threshold strategy for the central 24° or 30° of the field',
        'Reliability indices: false responses and fixation losses',
        'Comparison with nerve structure on OCT',
        'Trend analysis across a series of repeat tests',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Данные периметрии помогают врачу решить, нужно ли лечение и достаточно ли текущего. Тактика подбирается индивидуально.',
      kk: 'Периметрия деректері дәрігерге ем қажет пе және қазіргі ем жеткілікті ме екенін шешуге көмектеседі. Тәсіл жеке таңдалады.',
      en: 'Perimetry results help the doctor decide whether treatment is needed and whether current treatment is enough. The approach is tailored to you.',
    },
    list: {
      ru: [
        'Начало лечения глаукомы каплями',
        'Усиление терапии при признаках прогрессирования',
        'Обсуждение лазерного или хирургического снижения давления',
        'Выбор интервала повторной периметрии',
        'Направление к неврологу при нетипичной картине',
      ],
      kk: [
        'Глаукоманы тамшылармен емдеуді бастау',
        'Үдеу белгілері болса, емді күшейту',
        'Қысымды лазерлік немесе хирургиялық жолмен төмендетуді талқылау',
        'Қайталама периметрия аралығын таңдау',
        'Көрініс әдеттегіден өзгеше болса, невропатологқа жолдау',
      ],
      en: [
        'Starting glaucoma treatment with eye drops',
        'Stepping up treatment if there are signs of progression',
        'Discussing laser or surgical options to lower eye pressure',
        'Choosing when to repeat the test',
        'Referral to a neurologist if the pattern is atypical',
      ],
    },
  },
  preparation: {
    ru: [
      'Возьмите очки для чтения — при необходимости врач подберёт корригирующую линзу для теста',
      'Постарайтесь выспаться: усталость влияет на внимание и точность ответов',
      'Первый тест бывает менее точным — это нормально, повторные исследования обычно надёжнее',
    ],
    kk: [
      'Оқуға арналған көзілдірікті ала келіңіз — қажет болса, дәрігер зерттеуге түзету линзасын таңдайды',
      'Жақсылап ұйықтап алыңыз: шаршау зейін мен жауаптардың дәлдігіне әсер етеді',
      'Алғашқы зерттеу дәлдігі төменірек болуы мүмкін — бұл қалыпты жағдай, қайталама зерттеулер әдетте сенімдірек',
    ],
    en: [
      'Bring your reading glasses — the doctor may fit a correcting lens for the test',
      'Try to be well rested: tiredness affects concentration and accuracy',
      'The first test is often less accurate — this is normal, and repeat tests are usually more reliable',
    ],
  },
  result: {
    ru: 'Распечатка с картой поля зрения готова сразу после теста. Врач интерпретирует её с учётом показателей надёжности, ОКТ и осмотра и объясняет вам выводы. Для оценки динамики обычно нужно несколько исследований с интервалом.',
    kk: 'Көру өрісі картасы бар басылым зерттеуден кейін бірден дайын болады. Дәрігер оны сенімділік көрсеткіштерін, ОКТ мен қарауды ескеріп түсіндіріп, қорытындыны сізге айтады. Өзгерісті бағалау үшін әдетте белгілі бір аралықпен бірнеше зерттеу қажет.',
    en: 'The printout with your visual field map is ready straight after the test. The doctor interprets it alongside the reliability indices, OCT and examination, and explains the conclusions to you. Several tests over time are usually needed to judge change.',
  },
  faq: [
    {
      q: {
        ru: 'Что делать, если я не видел многих точек?',
        kk: 'Көп нүктені көрмесем не болады?',
        en: 'What if I missed a lot of the lights?',
      },
      a: {
        ru: 'Это нормально: часть точек специально очень слабые, и увидеть все невозможно. Отвечайте, только когда уверены, что заметили свет, и не пытайтесь угадывать.',
        kk: 'Бұл қалыпты жағдай: кейбір нүктелер әдейі өте әлсіз, барлығын көру мүмкін емес. Жарықты байқағаныңызға сенімді болғанда ғана жауап беріңіз, болжауға тырыспаңыз.',
        en: 'That is normal: some lights are deliberately very faint and nobody sees them all. Respond only when you are sure you saw a light, and do not try to guess.',
      },
    },
    {
      q: {
        ru: 'Можно ли моргать во время теста?',
        kk: 'Зерттеу кезінде жыпылықтатуға бола ма?',
        en: 'Can I blink during the test?',
      },
      a: {
        ru: 'Да, моргать можно и нужно — обычным образом. Главное — всё время смотреть на центральную точку. Если устали, скажите об этом: тест можно приостановить.',
        kk: 'Иә, әдеттегідей жыпылықтатуға болады әрі қажет. Бастысы — үнемі орталық нүктеге қарап отыру. Шаршасаңыз, айтыңыз: зерттеуді тоқтата тұруға болады.',
        en: 'Yes, blink normally — that is fine. The key is to keep looking at the central target. If you get tired, say so: the test can be paused.',
      },
    },
    {
      q: {
        ru: 'Зачем повторять периметрию, если первый результат нормальный?',
        kk: 'Алғашқы нәтиже қалыпты болса, периметрияны неге қайталау керек?',
        en: 'Why repeat perimetry if the first result was normal?',
      },
      a: {
        ru: 'При риске глаукомы важна динамика: сравнение серии тестов позволяет заметить изменения раньше, чем по одному исследованию. Интервал врач определяет индивидуально.',
        kk: 'Глаукома қаупі болса, өзгеріс маңызды: зерттеулер сериясын салыстыру өзгерістерді бір зерттеуге қарағанда ертерек байқауға мүмкіндік береді. Аралықты дәрігер жеке анықтайды.',
        en: 'When there is a risk of glaucoma, the trend matters: comparing a series of tests can reveal changes earlier than a single test. The doctor decides the interval individually.',
      },
    },
  ],
  sources: [
    {
      label: 'EyeWiki — Standard automated perimetry',
      href: 'https://eyewiki.org/Standard_Automated_Perimetry',
    },
    {
      label: 'NICE — Glaucoma: diagnosis and management (NG81)',
      href: 'https://www.nice.org.uk/guidance/ng81',
    },
  ],
  topics: ['глауком', 'периметр', 'зрительн', 'нерв', 'давлен'],
};

export default content;
