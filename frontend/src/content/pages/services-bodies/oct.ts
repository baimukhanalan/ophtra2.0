import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/oct (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'test',
  lead: {
    ru: 'Бесконтактное сканирование, которое за несколько минут показывает слои сетчатки и зрительного нерва в поперечном срезе.',
    kk: 'Бірнеше минут ішінде тор қабық пен көру жүйкесінің қабаттарын көлденең кескінде көрсететін жанасусыз сканерлеу.',
    en: 'A non-contact scan that shows the layers of the retina and optic nerve in cross-section within a few minutes.',
  },
  overview: {
    ru: [
      'Оптическая когерентная томография (ОКТ) использует безопасный свет, а не рентгеновское излучение. Прибор строит изображения высокого разрешения, на которых видны отдельные слои сетчатки, её центральная зона (макула) и волокна зрительного нерва.',
      'ОКТ помогает выявлять и отслеживать изменения, которые не всегда заметны при обычном осмотре: отёк, жидкость под сетчаткой, истончение нервных волокон. Повторные сканы на том же приборе позволяют сравнивать результаты во времени.',
    ],
    kk: [
      'Оптикалық когерентті томография (ОКТ) рентген сәулесін емес, қауіпсіз жарықты пайдаланады. Аспап тор қабықтың жеке қабаттары, оның орталық аймағы (макула) және көру жүйкесінің талшықтары көрінетін жоғары ажыратымды суреттер жасайды.',
      'ОКТ әдеттегі қарауда әрдайым байқала бермейтін өзгерістерді анықтауға және бақылауға көмектеседі: ісіну, тор қабық астындағы сұйықтық, жүйке талшықтарының жұқаруы. Сол аспапта қайталанған сканерлеу нәтижелерді уақыт бойынша салыстыруға мүмкіндік береді.',
    ],
    en: [
      'Optical coherence tomography (OCT) uses safe light rather than X-rays. It produces high-resolution images showing the individual layers of the retina, its central area (the macula) and the optic nerve fibres.',
      'OCT helps detect and track changes that are not always visible on a routine examination, such as swelling, fluid under the retina or thinning of the nerve fibres. Repeat scans on the same device allow results to be compared over time.',
    ],
  },
  indications: {
    ru: [
      'Подозрение на глаукому или наблюдение при установленном диагнозе',
      'Возрастная макулярная дегенерация',
      'Диабетическая ретинопатия и диабетический отёк макулы',
      'Искажение линий, пятно или снижение зрения в центре поля зрения',
      'Контроль лечения заболеваний сетчатки, в том числе после инъекций',
      'Оценка сетчатки перед операцией по поводу катаракты',
    ],
    kk: [
      'Глаукомаға күдік немесе қойылған диагноз кезіндегі бақылау',
      'Жасқа байланысты макулалық дегенерация',
      'Диабеттік ретинопатия және макуланың диабеттік ісінуі',
      'Сызықтардың қисаюы, дақ немесе көру өрісінің ортасында көрудің төмендеуі',
      'Тор қабық ауруларын емдеуді, соның ішінде инъекциялардан кейін бақылау',
      'Катаракта отасы алдында тор қабықты бағалау',
    ],
    en: [
      'Suspected glaucoma or monitoring of known glaucoma',
      'Age-related macular degeneration',
      'Diabetic retinopathy and diabetic macular oedema',
      'Wavy lines, a blank spot or reduced central vision',
      'Monitoring treatment of retinal disease, including after injections',
      'Checking the retina before cataract surgery',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'В зависимости от задачи врач выбирает один или несколько протоколов сканирования.',
      kk: 'Міндетке қарай дәрігер бір немесе бірнеше сканерлеу хаттамасын таңдайды.',
      en: 'Depending on the question, the doctor chooses one or more scan protocols.',
    },
    list: {
      ru: [
        'Скан макулы — толщина и структура центральной зоны сетчатки',
        'Слой нервных волокон сетчатки и диск зрительного нерва',
        'Ганглиозный комплекс — дополнительный показатель при глаукоме',
        'Сравнение с предыдущими сканами для оценки динамики',
      ],
      kk: [
        'Макула сканы — тор қабықтың орталық аймағының қалыңдығы мен құрылымы',
        'Тор қабықтың жүйке талшықтары қабаты және көру жүйкесінің дискісі',
        'Ганглийлік кешен — глаукома кезіндегі қосымша көрсеткіш',
        'Өзгерісті бағалау үшін бұрынғы сканерлеумен салыстыру',
      ],
      en: [
        'Macular scan — thickness and structure of the central retina',
        'Retinal nerve fibre layer and optic disc',
        'Ganglion cell complex — an additional measure in glaucoma',
        'Comparison with earlier scans to assess change',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'ОКТ сама по себе не лечит, но её данные помогают врачу принять решение. Интерпретация всегда проводится вместе с осмотром и другими исследованиями.',
      kk: 'ОКТ өзі емдемейді, бірақ оның деректері дәрігерге шешім қабылдауға көмектеседі. Нәтиже әрдайым қараумен және басқа зерттеулермен бірге түсіндіріледі.',
      en: 'OCT does not treat anything itself, but its data help the doctor make decisions. It is always interpreted together with the examination and other tests.',
    },
    list: {
      ru: [
        'Начало или коррекция лечения глаукомы',
        'Решение о начале или продолжении интравитреальных инъекций',
        'Направление на лазерное или хирургическое лечение сетчатки',
        'Выбор интервала наблюдения при стабильной картине',
      ],
      kk: [
        'Глаукоманы емдеуді бастау немесе түзету',
        'Интравитреалдық инъекцияларды бастау немесе жалғастыру туралы шешім',
        'Тор қабықты лазерлік немесе хирургиялық емдеуге жолдау',
        'Жағдай тұрақты болса, бақылау аралығын таңдау',
      ],
      en: [
        'Starting or adjusting glaucoma treatment',
        'Deciding whether to start or continue eye injections',
        'Referral for laser or surgical treatment of the retina',
        'Choosing the monitoring interval when findings are stable',
      ],
    },
  },
  preparation: {
    ru: [
      'Специальной подготовки обычно не требуется',
      'Если врач решит расширить зрачок для лучшего качества снимка, не садитесь за руль 3–4 часа',
      'Возьмите результаты прошлых ОКТ, если они делались в другой клинике',
    ],
    kk: [
      'Әдетте арнайы дайындық қажет емес',
      'Суреттің сапасы үшін дәрігер қарашықты кеңейтуді шешсе, 3–4 сағат көлік жүргізбеңіз',
      'Бұрынғы ОКТ басқа клиникада жасалған болса, нәтижелерін ала келіңіз',
    ],
    en: [
      'Usually no special preparation is needed',
      'If the doctor dilates your pupils for a clearer image, do not drive for 3–4 hours',
      'Bring previous OCT results if they were done at another clinic',
    ],
  },
  result: {
    ru: 'Снимки готовы сразу после исследования. Врач описывает их и обсуждает с вами в тот же визит или на приёме, если ОКТ назначена как часть обследования. Распечатку или электронную копию можно забрать с собой.',
    kk: 'Суреттер зерттеуден кейін бірден дайын болады. Дәрігер оларды сипаттап, сол келуде немесе ОКТ тексерудің бөлігі ретінде тағайындалса, қабылдауда сізбен талқылайды. Басылымын немесе электронды көшірмесін өзіңізбен алып кетуге болады.',
    en: 'The images are ready straight after the scan. The doctor reports on them and discusses them with you at the same visit, or at your appointment if OCT is part of a wider assessment. You can take a printout or electronic copy with you.',
  },
  faq: [
    {
      q: {
        ru: 'Безопасна ли ОКТ?',
        kk: 'ОКТ қауіпсіз бе?',
        en: 'Is OCT safe?',
      },
      a: {
        ru: 'Да. Исследование бесконтактное, не использует рентгеновское излучение и может повторяться столько раз, сколько нужно для наблюдения.',
        kk: 'Иә. Зерттеу жанаспай жүргізіледі, рентген сәулесін пайдаланбайды және бақылауға қажетінше қайталана береді.',
        en: 'Yes. The scan is non-contact, uses no X-rays and can be repeated as often as monitoring requires.',
      },
    },
    {
      q: {
        ru: 'Что нужно делать во время сканирования?',
        kk: 'Сканерлеу кезінде не істеу керек?',
        en: 'What do I need to do during the scan?',
      },
      a: {
        ru: 'Вы сидите, опираясь подбородком на подставку, и смотрите на светящуюся точку. Важно не моргать и не двигать глазом несколько секунд, пока идёт запись.',
        kk: 'Сіз иегіңізді тірекке қойып отырасыз да, жарқыраған нүктеге қарайсыз. Жазба жүріп жатқан бірнеше секундта көзді жыпылықтатпай, қозғалтпау маңызды.',
        en: 'You sit with your chin on a rest and look at a small light. It is important not to blink or move your eye for the few seconds the scan takes.',
      },
    },
    {
      q: {
        ru: 'Может ли ОКТ заменить осмотр глазного дна?',
        kk: 'ОКТ көз түбін қарауды алмастыра ала ма?',
        en: 'Can OCT replace a fundus examination?',
      },
      a: {
        ru: 'Нет, это дополняющие методы. ОКТ даёт детальный срез отдельных зон, а осмотр позволяет увидеть сетчатку целиком, включая периферию.',
        kk: 'Жоқ, бұл бірін-бірі толықтыратын әдістер. ОКТ жеке аймақтардың егжей-тегжейлі кескінін береді, ал қарау тор қабықты шеткі бөліктерімен қоса тұтас көруге мүмкіндік береді.',
        en: 'No, the two complement each other. OCT gives a detailed cross-section of specific areas, while the examination shows the whole retina, including the periphery.',
      },
    },
  ],
  sources: [
    {
      label: 'American Academy of Ophthalmology — What is optical coherence tomography?',
      href: 'https://www.aao.org/eye-health/treatments/what-is-optical-coherence-tomography',
    },
    {
      label: 'EyeWiki — Optical coherence tomography',
      href: 'https://eyewiki.org/Optical_Coherence_Tomography',
    },
  ],
  topics: ['сетчат', 'макул', 'глауком', 'диабет', 'зрительн'],
};

export default content;
