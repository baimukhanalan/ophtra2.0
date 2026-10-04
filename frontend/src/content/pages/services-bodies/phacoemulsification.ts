import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/phacoemulsification (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'surgery',
  lead: {
    ru: 'Факоэмульсификация — современная операция при катаракте: помутневший хрусталик удаляется через микроразрез и заменяется искусственной интраокулярной линзой.',
    kk: 'Факоэмульсификация — катарактаға жасалатын заманауи операция: бұлыңғырланған көз бұршағы микрокесік арқылы алынып, жасанды көзішілік линзамен ауыстырылады.',
    en: 'Phacoemulsification is modern cataract surgery: the clouded lens is removed through a micro-incision and replaced with an artificial intraocular lens.',
  },
  overview: {
    ru: [
      'Через небольшой разрез хирург с помощью ультразвука дробит и удаляет помутневшее вещество хрусталика, сохраняя его тонкую капсулу. В капсулу устанавливают свёрнутую искусственную линзу, которая расправляется внутри глаза. Разрез обычно самогерметизирующийся и не требует швов.',
      'Операция проводится под местной анестезией, как правило амбулаторно. В этой услуге используется монофокальная линза: она даёт чёткое зрение на одном расстоянии, чаще вдаль, а для чтения обычно нужны очки. Время операции и оптическая сила линзы подбираются индивидуально с учётом состояния глаза и повседневных потребностей.',
    ],
    kk: [
      'Хирург шағын кесік арқылы ультрадыбыстың көмегімен көз бұршағының бұлыңғырланған затын ұсақтап, алып тастайды, ал оның жұқа капсуласын сақтайды. Капсулаға бүктелген жасанды линза орнатылады, ол көздің ішінде жазылады. Кесік әдетте өздігінен бітеледі және тігісті қажет етпейді.',
      'Операция жергілікті жансыздандырумен, әдетте амбулаториялық түрде жүргізіледі. Бұл қызметте монофокалды линза қолданылады: ол бір қашықтықта, көбінесе алысқа анық көруді қамтамасыз етеді, ал оқу үшін әдетте көзілдірік қажет. Операция уақыты мен линзаның оптикалық күші көздің жағдайы мен күнделікті қажеттіліктерді ескере отырып, жеке таңдалады.',
    ],
    en: [
      'Through a small incision the surgeon uses ultrasound to break up and remove the clouded lens material, keeping its thin capsule. A folded artificial lens is placed in the capsule, where it unfolds. The incision is usually self-sealing and needs no stitches.',
      'The operation is performed under local anaesthesia, usually as day surgery. This service uses a monofocal lens: it gives clear vision at one distance, most often for distance, and glasses are usually needed for reading. The timing of surgery and the lens power are chosen individually, based on the eye\'s condition and your daily needs.',
    ],
  },
  indications: {
    ru: [
      'Катаракта, которая мешает повседневным делам: чтению, вождению, работе',
      'Снижение контрастности, затуманивание зрения, ослепление от яркого света',
      'Частая смена очков из-за изменения рефракции на фоне катаракты',
      'Катаракта, затрудняющая осмотр или лечение других заболеваний глаза',
      'Некоторые виды повышенного внутриглазного давления, связанные с хрусталиком — по решению врача',
    ],
    kk: [
      'Күнделікті істерге — оқуға, көлік жүргізуге, жұмысқа кедергі келтіретін катаракта',
      'Контрасттың төмендеуі, көрудің тұмандануы, жарқыраған жарықтан көздің қарығуы',
      'Катаракта салдарынан рефракция өзгеріп, көзілдірікті жиі ауыстыру',
      'Көздің басқа ауруларын тексеруге немесе емдеуге кедергі келтіретін катаракта',
      'Көз бұршағына байланысты көзішілік қысымның жоғарылауының кейбір түрлері — дәрігердің шешімі бойынша',
    ],
    en: [
      'A cataract that interferes with daily activities such as reading, driving or work',
      'Reduced contrast, hazy vision, or glare from bright light',
      'Frequent changes of glasses because the cataract is altering your prescription',
      'A cataract that makes it hard to examine or treat other eye conditions',
      'Some types of raised eye pressure related to the lens — at the doctor\'s discretion',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Перед операцией проводятся измерения, по которым рассчитывается сила искусственной линзы, и проверяется состояние всех структур глаза.',
      kk: 'Операция алдында жасанды линзаның күші есептелетін өлшемдер жүргізіледі және көздің барлық құрылымдарының жағдайы тексеріледі.',
      en: 'Before surgery, measurements are taken to calculate the artificial lens power, and all structures of the eye are checked.',
    },
    list: {
      ru: [
        'Оптическая биометрия — длина глаза и расчёт силы интраокулярной линзы',
        'Кератометрия и топография роговицы — учёт астигматизма',
        'Биомикроскопия и осмотр глазного дна с расширенным зрачком',
        'ОКТ сетчатки — чтобы оценить жёлтое пятно до операции',
        'Измерение внутриглазного давления',
      ],
      kk: [
        'Оптикалық биометрия — көздің ұзындығы және көзішілік линза күшін есептеу',
        'Кератометрия және қасаң қабық топографиясы — астигматизмді ескеру',
        'Биомикроскопия және қарашықты кеңейтіп, көз түбін қарау',
        'Торқабықтың ОКТ-сы — операцияға дейін сары дақты бағалау үшін',
        'Көзішілік қысымды өлшеу',
      ],
      en: [
        'Optical biometry — eye length and calculation of the intraocular lens power',
        'Keratometry and corneal topography — to account for astigmatism',
        'Slit-lamp examination and dilated retinal examination',
        'Retinal OCT — to assess the macula before surgery',
        'Eye pressure measurement',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Катаракту не лечат каплями или очками — единственный эффективный способ её устранить — операция. Главный выбор касается типа искусственной линзы и того, на какое расстояние она будет настроена.',
      kk: 'Катаракта тамшымен немесе көзілдірікпен емделмейді — оны жоюдың бірден-бір тиімді жолы — операция. Негізгі таңдау жасанды линзаның түріне және ол қай қашықтыққа бапталатынына қатысты.',
      en: 'Cataract cannot be treated with drops or glasses — surgery is the only effective way to remove it. The main choice concerns the type of artificial lens and the distance it is set for.',
    },
    list: {
      ru: [
        'Монофокальная линза, настроенная на зрение вдаль, — очки для чтения',
        'Монофокальная линза, настроенная на зрение вблизи, — очки для дали',
        'Торическая линза — при выраженном роговичном астигматизме',
        'Мультифокальная или EDOF-линза — меньшая зависимость от очков, но подходит не всем',
        'Наблюдение и обновление очков — пока катаракта не мешает повседневной жизни',
      ],
      kk: [
        'Алысқа бапталған монофокалды линза — оқуға арналған көзілдірікпен',
        'Жақынға бапталған монофокалды линза — алысқа арналған көзілдірікпен',
        'Торикалық линза — қасаң қабық астигматизмі айқын болса',
        'Мультифокалды немесе EDOF линза — көзілдірікке тәуелділік азырақ, бірақ бәріне сәйкес келмейді',
        'Бақылау және көзілдірікті жаңарту — катаракта күнделікті өмірге кедергі келтірмейінше',
      ],
      en: [
        'Monofocal lens set for distance — with reading glasses',
        'Monofocal lens set for near — with distance glasses',
        'Toric lens — for significant corneal astigmatism',
        'Multifocal or EDOF lens — less reliance on glasses, but not suitable for everyone',
        'Monitoring and updated glasses — while the cataract does not affect daily life',
      ],
    },
  },
  preparation: {
    ru: [
      'Если вы носите контактные линзы, прекратите их использование до биометрии — срок уточнит врач',
      'Сообщите врачу обо всех лекарствах, особенно разжижающих кровь и препаратах от простаты (тамсулозин и аналоги)',
      'В день операции не наносите макияж на лицо и область глаз',
      'Попросите кого-то проводить вас домой после операции',
    ],
    kk: [
      'Жанаспа линза тағатын болсаңыз, биометрияға дейін оларды қолдануды тоқтатыңыз — мерзімін дәрігер нақтылайды',
      'Дәрігерге барлық дәрі-дәрмектер, әсіресе қанды сұйылтатын және қуықасты безіне арналған (тамсулозин және оның баламалары) препараттар туралы айтыңыз',
      'Операция күні бетке және көз аймағына бояу-опа жақпаңыз',
      'Операциядан кейін үйге дейін шығарып салуды біреуден өтініңіз',
    ],
    en: [
      'If you wear contact lenses, stop before the biometry measurements — your doctor will confirm how long',
      'Tell your doctor about all medicines, especially blood thinners and prostate medicines (tamsulosin and similar)',
      'Do not wear make-up on your face or around your eyes on the day of surgery',
      'Ask someone to take you home after the operation',
    ],
  },
  result: {
    ru: 'Зрение обычно начинает проясняться в первые дни, а полностью стабилизируется за несколько недель; после этого подбираются новые очки. Контрольные осмотры назначаются на следующий день и далее по графику врача, в течение нескольких недель используются капли. Временно возможны ощущение инородного тела, сухость, блики и повышенная яркость цветов. Итоговое зрение зависит и от состояния сетчатки и зрительного нерва, поэтому гарантировать определённую остроту невозможно. Через месяцы или годы может развиться помутнение задней капсулы, которое устраняется YAG-лазером.',
    kk: 'Көру әдетте алғашқы күндері айқындала бастайды, ал толық тұрақтануы бірнеше аптаға созылады; осыдан кейін жаңа көзілдірік таңдалады. Бақылау тексерулері келесі күні және одан әрі дәрігердің кестесі бойынша тағайындалады, бірнеше апта бойы тамшылар қолданылады. Уақытша көзге бөгде зат түскендей сезім, құрғақтық, жылтыр және түстердің ашықтығы артуы мүмкін. Соңғы көру торқабық пен көру жүйкесінің жағдайына да байланысты, сондықтан белгілі бір өткірлікке кепілдік беру мүмкін емес. Бірнеше айдан немесе жылдан кейін артқы капсула бұлыңғырлануы мүмкін, ол YAG-лазермен жойылады.',
    en: 'Vision usually starts to clear within the first days and settles fully over several weeks, after which new glasses are prescribed. Check-ups are scheduled for the next day and then as your doctor advises, and drops are used for several weeks. A foreign-body sensation, dryness, glare and brighter colours may be noticed for a while. The final vision also depends on the health of the retina and optic nerve, so no specific level can be guaranteed. Months or years later the back of the lens capsule may become cloudy; this is treated with a YAG laser.',
  },
  faq: [
    {
      q: {
        ru: 'Нужно ли ждать, пока катаракта «созреет»?',
        kk: 'Катарактаның «пісіп-жетілуін» күту керек пе?',
        en: 'Do I need to wait for the cataract to \'ripen\'?',
      },
      a: {
        ru: 'Нет. Современные рекомендации связывают решение об операции не со стадией катаракты, а с тем, насколько она мешает вашей жизни. Слишком плотная катаракта, наоборот, может усложнить операцию.',
        kk: 'Жоқ. Қазіргі ұсыныстар операция туралы шешімді катарактаның сатысымен емес, оның өміріңізге қаншалықты кедергі келтіретінімен байланыстырады. Керісінше, тым тығыз катаракта операцияны қиындатуы мүмкін.',
        en: 'No. Current guidance links the decision to operate not to the stage of the cataract but to how much it affects your life. A very dense cataract can actually make surgery more difficult.',
      },
    },
    {
      q: {
        ru: 'Оперируют оба глаза сразу?',
        kk: 'Екі көзге бірден операция жасала ма?',
        en: 'Are both eyes operated on at once?',
      },
      a: {
        ru: 'Обычно глаза оперируют поочерёдно, с интервалом, который определяет хирург. Это позволяет учесть результат первой операции при планировании второй.',
        kk: 'Әдетте көздерге кезекпен, хирург белгілеген аралықпен операция жасалады. Бұл бірінші операцияның нәтижесін екіншісін жоспарлағанда ескеруге мүмкіндік береді.',
        en: 'Usually the eyes are operated on one at a time, at an interval set by the surgeon. This allows the result of the first operation to guide planning for the second.',
      },
    },
    {
      q: {
        ru: 'Может ли катаракта вернуться?',
        kk: 'Катаракта қайталануы мүмкін бе?',
        en: 'Can a cataract come back?',
      },
      a: {
        ru: 'Сама катаракта не возвращается, так как хрусталик удалён. Но у части пациентов со временем мутнеет капсула, в которой находится линза, — это так называемая вторичная катаракта, её устраняют коротким лазерным вмешательством.',
        kk: 'Көз бұршағы алынып тасталғандықтан, катарактаның өзі қайталанбайды. Бірақ кейбір пациенттерде уақыт өте келе линза орналасқан капсула бұлыңғырланады — бұл екіншілік катаракта деп аталады, ол қысқа лазерлік араласумен жойылады.',
        en: 'The cataract itself cannot return, because the lens has been removed. However, in some people the capsule holding the new lens becomes cloudy over time — a so-called secondary cataract — which is treated with a short laser procedure.',
      },
    },
  ],
  sources: [
    {
      label: 'NICE NG77 — Cataracts in adults: management',
      href: 'https://www.nice.org.uk/guidance/ng77',
    },
    {
      label: 'National Eye Institute — Cataracts',
      href: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/cataracts',
    },
  ],
  topics: ['катаракт', 'хрусталик', 'факоэмульсификац', 'интраокуляр'],
};

export default content;
