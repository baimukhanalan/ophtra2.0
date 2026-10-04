import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/intravitreal-injection (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'therapy',
  lead: {
    ru: 'Интравитреальная инъекция — способ доставить лекарство прямо к сетчатке. Процедура проводится под местной анестезией в стерильных условиях и занимает всего несколько минут.',
    kk: 'Интравитреальді инъекция — дәріні тікелей тор қабыққа жеткізу тәсілі. Процедура стерильді жағдайда жергілікті жансыздандырумен жасалады және бірнеше минутқа ғана созылады.',
    en: 'An intravitreal injection delivers medicine directly to the retina. It is done under local anaesthetic in sterile conditions and takes only a few minutes.',
  },
  overview: {
    ru: [
      'Чаще всего в полость стекловидного тела вводят анти-VEGF препараты. Они подавляют рост патологических сосудов и уменьшают отёк сетчатки при влажной возрастной макулярной дегенерации, диабетическом макулярном отёке и отёке после окклюзии вен. По показаниям применяются и другие препараты, например стероидные.',
      'Как правило, лечение — это не одна инъекция, а курс: сначала несколько процедур с короткими интервалами, затем интервалы подбираются по результатам ОКТ и проверки зрения. Решение о начале, продолжении или паузе принимает врач индивидуально.',
    ],
    kk: [
      'Шыны тәрізді дене қуысына көбіне анти-VEGF препараттары енгізіледі. Олар ылғалды жасқа байланысты макулалық дегенерацияда, диабеттік макулалық ісінуде және вена окклюзиясынан кейінгі ісінуде патологиялық тамырлардың өсуін басып, тор қабықтың ісінуін азайтады. Көрсетілім бойынша басқа препараттар, мысалы стероидтық препараттар да қолданылады.',
      'Әдетте ем — бір инъекция емес, курс: алдымен қысқа аралықпен бірнеше процедура жасалады, кейін аралықтар ОКТ мен көруді тексеру нәтижесіне қарай таңдалады. Емді бастау, жалғастыру немесе үзіліс жасау туралы шешімді дәрігер жеке қабылдайды.',
    ],
    en: [
      'The medicines most often injected into the vitreous are anti-VEGF drugs. They suppress the growth of abnormal blood vessels and reduce retinal swelling in wet age-related macular degeneration, diabetic macular oedema and swelling after retinal vein occlusion. Other medicines, such as steroids, are used when indicated.',
      'Treatment is usually a course rather than a single injection: first several procedures at short intervals, then intervals adjusted according to OCT scans and vision checks. The doctor decides individually when to start, continue or pause treatment.',
    ],
  },
  indications: {
    ru: [
      'Влажная (неоваскулярная) возрастная макулярная дегенерация',
      'Диабетический макулярный отёк',
      'Макулярный отёк при окклюзии вен сетчатки',
      'Хориоидальная неоваскуляризация при миопии и других состояниях',
      'Отдельные случаи пролиферативной диабетической ретинопатии — по решению врача',
    ],
    kk: [
      'Ылғалды (неоваскулярлық) жасқа байланысты макулалық дегенерация',
      'Диабеттік макулалық ісіну',
      'Тор қабық веналарының окклюзиясы кезіндегі макулалық ісіну',
      'Миопия мен басқа жағдайлардағы хориоидалдық неоваскуляризация',
      'Пролиферативті диабеттік ретинопатияның жекелеген жағдайлары — дәрігердің шешімі бойынша',
    ],
    en: [
      'Wet (neovascular) age-related macular degeneration',
      'Diabetic macular oedema',
      'Macular oedema due to retinal vein occlusion',
      'Choroidal neovascularisation in myopia and other conditions',
      'Selected cases of proliferative diabetic retinopathy, at the doctor\'s discretion',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Перед каждой инъекцией и между ними врач оценивает, насколько активен процесс, чтобы подобрать интервал и убедиться в безопасности процедуры.',
      kk: 'Әр инъекция алдында және олардың арасында дәрігер процестің қаншалықты белсенді екенін бағалап, аралықты таңдайды және процедураның қауіпсіздігіне көз жеткізеді.',
      en: 'Before each injection and between injections, the doctor assesses how active the condition is in order to choose the interval and make sure the procedure is safe.',
    },
    list: {
      ru: [
        'Проверка остроты зрения',
        'ОКТ макулы — оценка отёка и жидкости в сетчатке',
        'Измерение внутриглазного давления',
        'Осмотр переднего отрезка и глазного дна, исключение воспаления или инфекции вокруг глаза',
      ],
      kk: [
        'Көру өткірлігін тексеру',
        'Макуланың ОКТ-сы — тор қабықтағы ісіну мен сұйықтықты бағалау',
        'Көзішілік қысымды өлшеу',
        'Көздің алдыңғы бөлігі мен көз түбін қарау, көз айналасындағы қабыну немесе инфекцияны жоққа шығару',
      ],
      en: [
        'Visual acuity testing',
        'Macular OCT to assess swelling and fluid in the retina',
        'Eye pressure measurement',
        'Examination of the front and back of the eye to rule out inflammation or infection around the eye',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Процедура проводится амбулаторно. Препарат и схему курса врач выбирает с учётом диагноза, ответа на лечение и общего здоровья.',
      kk: 'Процедура амбулаториялық түрде жасалады. Препарат пен курс жоспарын дәрігер диагнозды, емге жауапты және жалпы денсаулықты ескере отырып таңдайды.',
      en: 'The procedure is done as an outpatient. The doctor chooses the medicine and course schedule based on the diagnosis, the response to treatment and general health.',
    },
    list: {
      ru: [
        'Обезболивание каплями и обработка глаза антисептиком; веки фиксируются расширителем',
        'Введение препарата тонкой иглой через белочную оболочку — обычно ощущается лишь давление',
        'Стартовый курс: несколько инъекций с интервалом около месяца',
        'Поддерживающая фаза: интервалы увеличиваются или сокращаются по данным ОКТ и зрения («лечить и продлевать») либо инъекции проводятся по необходимости',
        'Регулярный мониторинг и оценка второго глаза на каждом визите',
      ],
      kk: [
        'Тамшымен жансыздандыру және көзді антисептикпен өңдеу; қабақтар кеңейткішпен бекітіледі',
        'Препаратты ақ қабық арқылы жіңішке инемен енгізу — әдетте тек қысым сезіледі',
        'Бастапқы курс: шамамен бір ай аралықпен бірнеше инъекция',
        'Қолдаушы кезең: аралықтар ОКТ мен көру деректері бойынша ұзартылады немесе қысқартылады («емдеу және ұзарту») не инъекциялар қажет болғанда жасалады',
        'Әр сапарда тұрақты мониторинг және екінші көзді бағалау',
      ],
      en: [
        'Numbing drops and antiseptic cleaning of the eye; a small clip keeps the eyelids open',
        'The medicine is injected through the white of the eye with a very fine needle; most people feel only pressure',
        'Loading phase: several injections about a month apart',
        'Maintenance phase: intervals are extended or shortened based on OCT and vision ("treat and extend"), or injections are given as needed',
        'Regular monitoring, including a check of the other eye at every visit',
      ],
    },
  },
  preparation: {
    ru: [
      'Сообщите врачу обо всех лекарствах, особенно разжижающих кровь, и о перенесённых инсультах или инфарктах',
      'Не наносите макияж на лицо и глаза в день процедуры',
      'Если появились покраснение, выделения или ячмень, предупредите клинику — инъекцию могут перенести',
      'Приезжайте с сопровождающим и не планируйте садиться за руль после процедуры',
    ],
    kk: [
      'Дәрігерге барлық дәрілер туралы, әсіресе қанды сұйылтатын дәрілер туралы, сондай-ақ бұрын болған инсульт немесе инфаркт туралы айтыңыз',
      'Процедура күні бет пен көзге макияж жасамаңыз',
      'Көз қызарса, ірің бөлінсе немесе арпа шықса, клиниканы ескертіңіз — инъекция ауыстырылуы мүмкін',
      'Ертіп жүретін адаммен келіңіз және процедурадан кейін көлік жүргізуді жоспарламаңыз',
    ],
    en: [
      'Tell the doctor about all your medicines, especially blood thinners, and about any previous stroke or heart attack',
      'Do not wear face or eye make-up on the day of the procedure',
      'If you have redness, discharge or a stye, let the clinic know, as the injection may need to be rescheduled',
      'Come with someone and do not plan to drive after the procedure',
    ],
  },
  result: {
    ru: 'После инъекции возможны лёгкий дискомфорт, ощущение песка, небольшое кровоизлияние на белочной оболочке или «плавающие» пузырьки — обычно это проходит само за несколько дней. Цель курса — остановить активность заболевания и сохранить зрение; у части пациентов оно улучшается, но результат зависит от диагноза и того, насколько рано начато лечение. Лечение, как правило, длительное, и соблюдение графика визитов очень важно. Серьёзные осложнения редки, но если в первые дни появились нарастающая боль, усиливающееся покраснение, светобоязнь, снижение зрения, вспышки или «шторка», срочно обратитесь в клинику.',
    kk: 'Инъекциядан кейін жеңіл ыңғайсыздық, көзге құм түскендей сезім, ақ қабықта шағын қан құйылу немесе «қалқыған» көпіршіктер болуы мүмкін — әдетте бұлар бірнеше күнде өздігінен басылады. Курстың мақсаты — аурудың белсенділігін тоқтату және көруді сақтау; кейбір пациенттерде көру жақсарады, бірақ нәтиже диагнозға және емнің қаншалықты ерте басталғанына байланысты. Ем әдетте ұзақ болады, сондықтан сапарлар кестесін сақтау өте маңызды. Ауыр асқынулар сирек кездеседі, бірақ алғашқы күндері ауырсыну күшейсе, қызару ұлғайса, жарықтан қорқу, көрудің нашарлауы, жарқылдар немесе «перде» пайда болса, клиникаға шұғыл жүгініңіз.',
    en: 'After the injection you may have mild discomfort, a gritty feeling, a small red patch on the white of the eye or floating bubbles; these usually settle within a few days. The aim of the course is to stop disease activity and preserve vision. Some people see an improvement, but results depend on the diagnosis and how early treatment began. Treatment is usually long-term, so keeping to the visit schedule is very important. Serious complications are rare, but if in the first days you develop increasing pain, worsening redness, sensitivity to light, reduced vision, flashes or a dark curtain, contact the clinic urgently.',
  },
  faq: [
    {
      q: {
        ru: 'Больно ли делать укол в глаз?',
        kk: 'Көзге ине салу ауыра ма?',
        en: 'Does an injection into the eye hurt?',
      },
      a: {
        ru: 'Перед процедурой глаз обезболивают каплями, поэтому большинство пациентов ощущают лишь кратковременное давление. Сама инъекция длится секунды, а вся подготовка — несколько минут.',
        kk: 'Процедура алдында көз тамшымен жансыздандырылады, сондықтан пациенттердің көбі тек қысқа уақытқа қысымды сезеді. Инъекцияның өзі бірнеше секундқа созылады, ал барлық дайындық — бірнеше минут.',
        en: 'The eye is numbed with drops beforehand, so most people feel only brief pressure. The injection itself lasts seconds, and the whole preparation takes a few minutes.',
      },
    },
    {
      q: {
        ru: 'Сколько инъекций понадобится?',
        kk: 'Қанша инъекция қажет болады?',
        en: 'How many injections will I need?',
      },
      a: {
        ru: 'Это индивидуально. Обычно начинают с нескольких ежемесячных инъекций, а дальше интервалы подбирают по результатам ОКТ и зрения. Некоторым пациентам лечение требуется годами, другим удаётся увеличить интервалы или сделать паузу.',
        kk: 'Бұл жеке шешіледі. Әдетте ай сайынғы бірнеше инъекциядан бастайды, ал кейін аралықтар ОКТ мен көру нәтижесіне қарай таңдалады. Кейбір пациенттерге ем жылдар бойы қажет, ал басқаларында аралықтарды ұзартуға немесе үзіліс жасауға болады.',
        en: 'It varies from person to person. Treatment usually starts with several monthly injections, and intervals are then adjusted according to OCT and vision. Some people need treatment for years, while others can extend the intervals or take a break.',
      },
    },
    {
      q: {
        ru: 'Что можно и чего нельзя делать после инъекции?',
        kk: 'Инъекциядан кейін не істеуге болады, не болмайды?',
        en: 'What should I avoid after the injection?',
      },
      a: {
        ru: 'В первые дни не трите глаз, избегайте бассейна и попадания в глаз нестерильной воды, закапывайте капли только по назначению врача. Обычные повседневные дела, как правило, можно продолжать с первого дня; точные рекомендации даст врач.',
        kk: 'Алғашқы күндері көзді уқаламаңыз, бассейннен және көзге стерильді емес судың түсуінен сақтаныңыз, тамшыларды тек дәрігердің тағайындауы бойынша тамызыңыз. Күнделікті әдеттегі істерді, әдетте, бірінші күннен жалғастыруға болады; нақты ұсынымдарды дәрігер береді.',
        en: 'For the first few days, do not rub the eye, avoid swimming pools and unclean water getting into the eye, and use drops only as prescribed. Everyday activities can usually continue from the first day; your doctor will give you specific advice.',
      },
    },
  ],
  sources: [
    {
      label: 'EyeWiki (American Academy of Ophthalmology) — Intravitreal Injections',
      href: 'https://eyewiki.org/Intravitreal_Injections',
    },
    {
      label: 'NICE — Age-related macular degeneration (NG82)',
      href: 'https://www.nice.org.uk/guidance/ng82',
    },
  ],
  topics: ['инъекц', 'макул', 'сетчатк', 'дегенерац', 'отёк', 'отек'],
};

export default content;
