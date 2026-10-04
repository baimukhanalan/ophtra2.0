import type { KnowledgeArticleBody, KnowledgeArticleMeta, KnowledgeCategory, KnowledgeTag } from './knowledge-types';
import { authorById, type KnowledgeAuthor } from './knowledge-authors';

/**
 * Knowledge-base index (spec §6.7): metadata of every article — no bodies.
 * The listing, search, related materials, author pages and media cards read
 * only this module; an article body is fetched on demand with
 * `loadArticleBody(slug)` (one chunk per article).
 *
 * Authorship: materials drafted by the site team are credited to the
 * editorial team («Редакция центра»); `review` stays empty until a named
 * clinician signs the text off.
 */

/* ================================================================= INDEX */

/** Newest first. */
export const KNOWLEDGE_INDEX: KnowledgeArticleMeta[] = [
  {
    id: 'art-eye-exam-after-40',
    slug: 'eye-check-after-40',
    category: 'after40',
    tags: ['diagnostics', 'presbyopia', 'glaucoma', 'oct', 'prevention'],
    authorId: 'doc-omarova',
    serviceSlug: 'complex-diagnostics',
    date: '2026-09-15',
    readingMinutes: 7,
    title: {
      ru: 'Проверка зрения после 40: что входит и как часто',
      kk: '40 жастан кейін көзді тексеру: не кіреді және қаншалықты жиі',
      en: 'Eye checks after 40: what is involved and how often',
    },
    excerpt: {
      ru: 'Из чего состоит полное обследование глаз после 40 лет, как часто его проходить, кому нужен более частый контроль и как подготовиться к визиту.',
      kk: '40 жастан кейінгі көзді толық тексеру неден тұрады, оны қаншалықты жиі өту керек, кімге жиірек бақылау қажет және келуге қалай дайындалу керек.',
      en: 'What a full eye examination after 40 includes, how often to have one, who needs closer monitoring and how to prepare for your visit.',
    },
    headings: [
      {
        ru: 'Почему после 40 стоит проверяться',
        kk: '40 жастан кейін неге тексерілу керек',
        en: 'Why checks matter after 40',
      },
      {
        ru: 'Что входит в обследование',
        kk: 'Тексеруге не кіреді',
        en: 'What the examination includes',
      },
      {
        ru: 'Как часто и кому чаще',
        kk: 'Қаншалықты жиі және кімге жиірек',
        en: 'How often, and who needs more',
      },
      {
        ru: 'Как подготовиться к визиту',
        kk: 'Келуге қалай дайындалу керек',
        en: 'How to prepare for your visit',
      },
      {
        ru: 'Обследование в центре',
        kk: 'Орталықтағы тексеру',
        en: 'Your examination at the centre',
      },
    ],
  },
  {
    id: 'art-glaucoma-treatment',
    slug: 'glaucoma-treatment-options',
    category: 'glaucoma',
    tags: ['glaucoma', 'eye-pressure', 'surgery', 'emergency', 'oct'],
    authorId: 'doc-baitursyn',
    serviceSlug: 'glaucoma-treatment',
    date: '2026-08-12',
    readingMinutes: 9,
    title: {
      ru: 'Лечение глаукомы: капли, лазер и хирургия',
      kk: 'Глаукоманы емдеу: тамшылар, лазер және хирургия',
      en: 'Treating glaucoma: drops, laser and surgery',
    },
    excerpt: {
      ru: 'Как снижают внутриглазное давление при глаукоме, почему важна регулярность лечения и контроля и какие симптомы требуют немедленной помощи.',
      kk: 'Глаукома кезінде көзішілік қысым қалай төмендетіледі, ем мен бақылаудың жүйелілігі неге маңызды және қандай белгілер шұғыл көмекті қажет етеді.',
      en: 'How eye pressure is lowered in glaucoma, why consistent treatment and follow-up matter, and which symptoms need emergency care.',
    },
    headings: [
      {
        ru: 'Цель лечения — сохранить зрительный нерв',
        kk: 'Емнің мақсаты — көру жүйкесін сақтау',
        en: 'The goal: protecting the optic nerve',
      },
      {
        ru: 'Капли: главное — регулярность',
        kk: 'Тамшылар: ең бастысы — жүйелілік',
        en: 'Eye drops: consistency is everything',
      },
      {
        ru: 'Лазер и хирургическое лечение',
        kk: 'Лазер және хирургиялық ем',
        en: 'Laser and surgical treatment',
      },
      {
        ru: 'Пожизненный контроль: периметрия и ОКТ',
        kk: 'Өмір бойғы бақылау: периметрия және ОКТ',
        en: 'Lifelong monitoring: perimetry and OCT',
      },
      {
        ru: 'Когда нужна срочная помощь',
        kk: 'Шұғыл көмек қашан қажет',
        en: 'When to seek emergency care',
      },
    ],
  },
  {
    id: 'art-amblyopia-strabismus',
    slug: 'lazy-eye-and-squint-in-children',
    category: 'children',
    tags: ['amblyopia', 'strabismus', 'children', 'diagnostics', 'prevention'],
    authorId: 'doc-nurgalieva',
    serviceSlug: 'pediatric-consultation',
    date: '2026-08-04',
    readingMinutes: 9,
    title: {
      ru: '«Ленивый глаз» и косоглазие у детей: почему важно не опоздать',
      kk: 'Балалардағы амблиопия және қылилық: неге кешікпеу маңызды',
      en: 'Lazy eye and squint in children: why timing matters',
    },
    excerpt: {
      ru: 'Амблиопия и косоглазие лучше всего поддаются лечению в раннем детстве, поэтому регулярные осмотры помогают вовремя начать коррекцию и сохранить ребёнку полноценное зрение.',
      kk: 'Амблиопия мен қылилық ерте балалық шақта жақсы емделеді, сондықтан тұрақты тексеру түзетуді уақытында бастап, баланың толыққанды көруін сақтауға көмектеседі.',
      en: 'Amblyopia and squint respond best to treatment in early childhood, so regular check-ups help start correction in time and protect a child\'s full vision.',
    },
    headings: [
      {
        ru: 'Что такое амблиопия и косоглазие',
        kk: 'Амблиопия және қылилық деген не',
        en: 'What amblyopia and squint are',
      },
      {
        ru: 'Почему важно раннее выявление',
        kk: 'Ерте анықтау неге маңызды',
        en: 'Why early detection matters',
      },
      {
        ru: 'Как лечат амблиопию',
        kk: 'Амблиопияны қалай емдейді',
        en: 'How amblyopia is treated',
      },
      {
        ru: 'Когда нужна операция',
        kk: 'Ота қашан қажет',
        en: 'When surgery is needed',
      },
      {
        ru: 'Когда проверять зрение ребёнка',
        kk: 'Баланың көзін қашан тексерту керек',
        en: 'When to check your child\'s eyes',
      },
    ],
  },
  {
    id: 'art-entoptic',
    slug: 'structured-light-entoptic-tests',
    category: 'research',
    tags: ['research', 'retina', 'macula', 'diagnostics'],
    authorId: 'editorial',
    basedOn: ['sci-rep-2026'],
    date: '2026-07-14',
    readingMinutes: 7,
    title: {
      ru: 'Как увидеть собственный глаз: энтоптические тесты со структурированным светом',
      kk: 'Өз көзіңді қалай көруге болады: құрылымды жарықпен жасалатын энтоптикалық тесттер',
      en: 'Seeing your own eye: structured-light entoptic tests',
    },
    excerpt: {
      ru: 'Что такое энтоптические явления, как структурированный свет позволяет человеку увидеть особенности собственной сетчатки и почему надёжность таких тестов проверяют заранее.',
      kk: 'Энтоптикалық құбылыстар деген не, құрылымды жарық адамға өз тор қабығының ерекшеліктерін көруге қалай мүмкіндік береді және мұндай тесттердің сенімділігі неге алдын ала тексеріледі.',
      en: 'What entoptic phenomena are, how structured light lets people perceive features of their own retina, and why the reliability of such tests is checked first.',
    },
    headings: [
      {
        ru: 'Что такое энтоптические явления',
        kk: 'Энтоптикалық құбылыстар деген не',
        en: 'What entoptic phenomena are',
      },
      {
        ru: 'Что такое структурированный свет',
        kk: 'Құрылымды жарық деген не',
        en: 'What structured light is',
      },
      {
        ru: 'Почему сначала проверяют надёжность',
        kk: 'Неліктен алдымен сенімділік тексеріледі',
        en: 'Why reliability comes first',
      },
      {
        ru: 'Исследование, а не рутинная диагностика',
        kk: 'Күнделікті диагностика емес, зерттеу',
        en: 'Research, not routine testing',
      },
    ],
  },
  {
    id: 'art-myopia',
    slug: 'child-myopia-progression',
    category: 'children',
    tags: ['myopia', 'children', 'prevention', 'diagnostics'],
    authorId: 'doc-nurgalieva',
    serviceSlug: 'myopia-control',
    date: '2026-07-05',
    readingMinutes: 7,
    title: {
      ru: 'Почему близорукость у детей прогрессирует и как это замедлить',
      kk: 'Балалардағы миопия неге үдейді және оны қалай баяулатуға болады',
      en: 'Why myopia progresses in children and how to slow it down',
    },
    excerpt: {
      ru: 'Что влияет на рост глаза, какие методы контроля работают и когда начинать наблюдение.',
      kk: 'Көздің өсуіне не әсер етеді, бақылаудың қандай әдістері жұмыс істейді және қашан бақылауды бастау керек.',
      en: 'What drives eye growth, which control methods work, and when to start monitoring.',
    },
    headings: [
      {
        ru: 'Почему глаз становится близоруким',
        kk: 'Көз неге алыстан нашар көре бастайды',
        en: 'Why the eye becomes short-sighted',
      },
      {
        ru: 'Что ускоряет прогрессирование',
        kk: 'Үдеуді не жылдамдатады',
        en: 'What speeds up progression',
      },
      {
        ru: 'Методы контроля миопии',
        kk: 'Миопияны бақылау әдістері',
        en: 'Myopia control methods',
      },
      {
        ru: 'Что могут сделать родители',
        kk: 'Ата-ана не істей алады',
        en: 'What parents can do',
      },
      {
        ru: 'Как проходит наблюдение в центре',
        kk: 'Орталықта бақылау қалай өтеді',
        en: 'How monitoring works at the centre',
      },
    ],
  },
  {
    id: 'art-cataract',
    slug: 'when-to-operate-cataract',
    category: 'surgery',
    tags: ['cataract', 'lens-implants', 'surgery', 'diagnostics'],
    authorId: 'doc-akhmetova',
    serviceSlug: 'phacoemulsification',
    date: '2026-06-19',
    readingMinutes: 6,
    title: {
      ru: 'Когда пора оперировать катаракту',
      kk: 'Катарактаны қашан операциялау керек',
      en: 'When it is time to operate on a cataract',
    },
    excerpt: {
      ru: 'Разбираем миф о «созревании» и объясняем, что определяет срок операции.',
      kk: '«Пісу» туралы мифті талдап, операция мерзімін не анықтайтынын түсіндіреміз.',
      en: 'We unpack the myth of a cataract needing to "ripen" and explain what really sets the timing.',
    },
    headings: [
      {
        ru: 'Что такое катаракта',
        kk: 'Катаракта дегеніміз не',
        en: 'What a cataract is',
      },
      {
        ru: 'Миф о «созревании»',
        kk: '«Пісу» туралы миф',
        en: 'The “ripening” myth',
      },
      {
        ru: 'Что определяет срок операции',
        kk: 'Операция мерзімін не анықтайды',
        en: 'What sets the timing',
      },
      {
        ru: 'Выбор интраокулярной линзы',
        kk: 'Көзішілік линзаны таңдау',
        en: 'Choosing the intraocular lens',
      },
      {
        ru: 'Как проходит подготовка в центре',
        kk: 'Орталықта дайындық қалай өтеді',
        en: 'Preparing for surgery at the centre',
      },
    ],
  },
  {
    id: 'art-retinal-detachment',
    slug: 'retinal-detachment-warning-signs',
    category: 'library',
    tags: ['emergency', 'retina', 'myopia', 'surgery'],
    authorId: 'doc-ibragimov',
    serviceSlug: 'retina-treatment',
    date: '2026-06-18',
    readingMinutes: 6,
    title: {
      ru: 'Отслойка сетчатки: тревожные признаки, при которых нельзя ждать',
      kk: 'Тор қабықтың сылынуы: күтуге болмайтын қауіпті белгілер',
      en: 'Retinal detachment: warning signs that should never wait',
    },
    excerpt: {
      ru: 'Вспышки света, внезапный рой «мушек» и тень, наползающая на поле зрения, — повод обратиться к офтальмологу в тот же день.',
      kk: 'Жарқылдар, кенеттен пайда болған көп «шыбындар» және көру аймағына жылжып келе жатқан көлеңке — сол күні офтальмологқа жүгінудің себебі.',
      en: 'Flashes of light, a sudden shower of floaters or a shadow spreading across your vision are reasons to see an ophthalmologist the same day.',
    },
    headings: [
      {
        ru: 'Что происходит при отслойке',
        kk: 'Тор қабық сылынғанда не болады',
        en: 'What happens in a detachment',
      },
      {
        ru: 'Тревожные признаки',
        kk: 'Қауіпті белгілер',
        en: 'Warning signs',
      },
      {
        ru: 'Кто в группе риска',
        kk: 'Қауіп тобында кімдер бар',
        en: 'Who is at higher risk',
      },
      {
        ru: 'Как лечат разрывы и отслойку',
        kk: 'Жыртық пен сылынуды қалай емдейді',
        en: 'How tears and detachments are treated',
      },
      {
        ru: 'Что делать и чего ждать в центре',
        kk: 'Не істеу керек және орталықта не күтеді',
        en: 'What to do and what to expect',
      },
    ],
  },
  {
    id: 'art-dryeye',
    slug: 'screen-dry-eye',
    category: 'prevention',
    tags: ['dry-eye', 'screens', 'prevention', 'diagnostics'],
    authorId: 'doc-baitursyn',
    serviceSlug: 'dry-eye',
    date: '2026-05-28',
    readingMinutes: 5,
    title: {
      ru: 'Сухость глаз при работе за экраном: что действительно помогает',
      kk: 'Экран алдында жұмыс істегендегі көз құрғақтығы: шынымен не көмектеседі',
      en: 'Dry eyes at the screen: what actually helps',
    },
    excerpt: {
      ru: 'Механизм появления симптомов и меры, эффективность которых подтверждена.',
      kk: 'Симптомдардың пайда болу тетігі және тиімділігі расталған шаралар.',
      en: 'How the symptoms arise and which measures have proven effective.',
    },
    headings: [
      {
        ru: 'Почему экран сушит глаза',
        kk: 'Экран көзді неге құрғатады',
        en: 'Why screens dry the eyes',
      },
      {
        ru: 'Как проявляется сухость',
        kk: 'Құрғақтық қалай білінеді',
        en: 'How dryness shows itself',
      },
      {
        ru: 'Что действительно помогает',
        kk: 'Шынымен не көмектеседі',
        en: 'What actually helps',
      },
      {
        ru: 'Увлажняющие капли: кому и какие',
        kk: 'Ылғалдандыратын тамшылар: кімге және қандай',
        en: 'Lubricating drops: who needs which',
      },
      {
        ru: 'Когда нужен осмотр в центре',
        kk: 'Орталықта қаралу қашан қажет',
        en: 'When to be examined at the centre',
      },
    ],
  },
  {
    id: 'art-diabetic-retinopathy',
    slug: 'diabetic-retinopathy-screening',
    category: 'retina',
    tags: ['diabetes', 'retina', 'macula', 'diagnostics', 'prevention'],
    authorId: 'doc-omarova',
    serviceSlug: 'retina-treatment',
    date: '2026-05-07',
    readingMinutes: 8,
    title: {
      ru: 'Диабетическая ретинопатия: почему глаза нужно проверять каждый год',
      kk: 'Диабеттік ретинопатия: көзді неге жыл сайын тексерту керек',
      en: 'Diabetic retinopathy: why your eyes need a check every year',
    },
    excerpt: {
      ru: 'Диабет может повреждать сетчатку задолго до появления жалоб, поэтому ежегодный осмотр — самый надёжный способ вовремя заметить изменения и сохранить зрение.',
      kk: 'Қант диабеті тор қабықты шағым пайда болғанға дейін-ақ зақымдауы мүмкін, сондықтан жыл сайынғы тексеру — өзгерістерді уақытында байқап, көруді сақтаудың ең сенімді жолы.',
      en: 'Diabetes can damage the retina long before you notice anything, so a yearly eye examination is the most reliable way to catch changes early and protect your sight.',
    },
    headings: [
      {
        ru: 'Почему нужен ежегодный осмотр',
        kk: 'Жыл сайынғы тексеру не үшін қажет',
        en: 'Why yearly screening matters',
      },
      {
        ru: 'Стадии и макулярный отёк',
        kk: 'Сатылары және сары дақ ісінуі',
        en: 'Stages and macular oedema',
      },
      {
        ru: 'Что зависит от вас',
        kk: 'Сізге не байланысты',
        en: 'What you can influence',
      },
      {
        ru: 'Как лечат ретинопатию',
        kk: 'Ретинопатияны қалай емдейді',
        en: 'How retinopathy is treated',
      },
      {
        ru: 'Как проходит осмотр у нас',
        kk: 'Бізде тексеру қалай өтеді',
        en: 'What a visit involves',
      },
    ],
  },
  {
    id: 'art-retina-brain',
    slug: 'retina-window-to-the-brain',
    category: 'research',
    tags: ['retina', 'neuro', 'research', 'oct', 'ai'],
    authorId: 'editorial',
    serviceSlug: 'oct',
    basedOn: ['diagnostics-2026'],
    date: '2026-05-06',
    readingMinutes: 8,
    title: {
      ru: 'Сетчатка как окно в мозг',
      kk: 'Тор қабық — миға ашылған терезе',
      en: 'The retina as a window to the brain',
    },
    excerpt: {
      ru: 'Почему учёные изучают сетчатку в поисках ранних признаков нейродегенеративных заболеваний, что показывают исследования на моделях и чего от них пока нельзя ожидать.',
      kk: 'Ғалымдар неліктен нейродегенеративтік аурулардың ерте белгілерін тор қабықтан іздейді, үлгілердегі зерттеулер нені көрсетеді және олардан әзірге нені күтуге болмайды.',
      en: 'Why scientists study the retina for early signs of neurodegenerative disease, what research in animal models shows, and what it cannot yet offer patients.',
    },
    headings: [
      {
        ru: 'Сетчатка — часть центральной нервной системы',
        kk: 'Тор қабық — орталық жүйке жүйесінің бөлігі',
        en: 'The retina is part of the brain',
      },
      {
        ru: 'Почему это интересно при нейродегенерации',
        kk: 'Нейродегенерация кезінде бұл неліктен қызықты',
        en: 'Why it matters for neurodegeneration',
      },
      {
        ru: 'Что изучают на моделях',
        kk: 'Үлгілерде не зерттеледі',
        en: 'What animal-model research explores',
      },
      {
        ru: 'Что это значит для пациентов сегодня',
        kk: 'Бұл бүгін науқастар үшін нені білдіреді',
        en: 'What it means for patients today',
      },
    ],
  },
  {
    id: 'art-laser-prep',
    slug: 'laser-correction-preparation',
    category: 'surgery',
    tags: ['laser-correction', 'surgery', 'diagnostics', 'contact-lenses'],
    authorId: 'doc-serikov',
    serviceSlug: 'femto-lasik',
    date: '2026-04-30',
    readingMinutes: 6,
    title: {
      ru: 'Как подготовиться к лазерной коррекции зрения',
      kk: 'Көруді лазерлік түзетуге қалай дайындалу керек',
      en: 'How to prepare for laser vision correction',
    },
    excerpt: {
      ru: 'Обследование, отказ от линз и что взять с собой в день операции.',
      kk: 'Тексеру, линзалардан бас тарту және операция күні өзіңізбен не алу керек.',
      en: 'The examination, giving up lenses and what to bring on the day.',
    },
    headings: [
      {
        ru: 'Кому подходит лазерная коррекция',
        kk: 'Лазерлік түзету кімге сәйкес келеді',
        en: 'Who laser correction suits',
      },
      {
        ru: 'Расширенная диагностика',
        kk: 'Кеңейтілген диагностика',
        en: 'Extended diagnostics',
      },
      {
        ru: 'Перерыв в ношении контактных линз',
        kk: 'Контакт линзаларын киюді тоқтату',
        en: 'A break from contact lenses',
      },
      {
        ru: 'День операции',
        kk: 'Операция күні',
        en: 'The day of surgery',
      },
      {
        ru: 'Восстановление и наблюдение в центре',
        kk: 'Қалпына келу және орталықта бақылау',
        en: 'Recovery and follow-up at the centre',
      },
    ],
  },
  {
    id: 'art-amd',
    slug: 'age-related-macular-degeneration',
    category: 'retina',
    tags: ['macula', 'retina', 'oct', 'prevention', 'diagnostics'],
    authorId: 'doc-ibragimov',
    serviceSlug: 'oct',
    date: '2026-03-19',
    readingMinutes: 9,
    title: {
      ru: 'Возрастная макулярная дегенерация: как сохранить центральное зрение',
      kk: 'Жасқа байланысты сары дақ дегенерациясы: орталық көруді қалай сақтауға болады',
      en: 'Age-related macular degeneration: protecting your central vision',
    },
    excerpt: {
      ru: 'Чем сухая форма ВМД отличается от влажной, как проверить себя по сетке Амслера и что на самом деле происходит при лечении инъекциями.',
      kk: 'Сары дақ дегенерациясының құрғақ түрі ылғал түрінен немен ерекшеленеді, Амслер торы арқылы өзіңізді қалай тексеруге болады және инъекциямен емдеу кезінде не болатыны туралы.',
      en: 'How dry and wet AMD differ, how to check yourself with an Amsler grid, and what treatment with eye injections actually involves.',
    },
    headings: [
      {
        ru: 'Что такое макула и ВМД',
        kk: 'Сары дақ және оның дегенерациясы',
        en: 'The macula and AMD',
      },
      {
        ru: 'Симптомы и сетка Амслера',
        kk: 'Белгілері және Амслер торы',
        en: 'Symptoms and the Amsler grid',
      },
      {
        ru: 'Лечение влажной формы',
        kk: 'Ылғал түрін емдеу',
        en: 'Treating wet AMD',
      },
      {
        ru: 'Факторы риска и добавки',
        kk: 'Қауіп факторлары және қоспалар',
        en: 'Risk factors and supplements',
      },
      {
        ru: 'Обследование в нашем центре',
        kk: 'Орталығымыздағы тексеру',
        en: 'Examination at our centre',
      },
    ],
  },
  {
    id: 'art-ai-retina',
    slug: 'ai-in-retinal-imaging',
    category: 'research',
    tags: ['ai', 'retina', 'oct', 'research', 'diagnostics'],
    authorId: 'editorial',
    serviceSlug: 'oct',
    basedOn: ['diagnostics-2026'],
    date: '2026-03-18',
    readingMinutes: 9,
    title: {
      ru: 'Искусственный интеллект в исследовании сетчатки: возможности и границы',
      kk: 'Тор қабықты зерттеудегі жасанды интеллект: мүмкіндіктер мен шектеулер',
      en: 'Artificial intelligence in retinal imaging: what it can and cannot do',
    },
    excerpt: {
      ru: 'Как алгоритмы анализируют снимки ОКТ и глазного дна, в чём они действительно полезны, где их пределы и почему окончательное решение всегда остаётся за врачом.',
      kk: 'Алгоритмдер ОКТ мен көз түбінің суреттерін қалай талдайды, олар нақты неге пайдалы, шектеулері қайда және неліктен түпкі шешім әрқашан дәрігерде қалады.',
      en: 'How algorithms analyse OCT and fundus images, where they genuinely help, where their limits lie, and why the final decision always rests with the doctor.',
    },
    headings: [
      {
        ru: 'Как ИИ «читает» снимки',
        kk: 'Жасанды интеллект суреттерді қалай «оқиды»',
        en: 'How AI "reads" an image',
      },
      {
        ru: 'Что ИИ умеет и чего не умеет',
        kk: 'Жасанды интеллект не істей алады, не істей алмайды',
        en: 'What AI can and cannot do',
      },
      {
        ru: 'Ответственность врача и защита данных',
        kk: 'Дәрігердің жауапкершілігі және деректерді қорғау',
        en: 'Clinical responsibility and data privacy',
      },
      {
        ru: 'Куда движутся исследования',
        kk: 'Зерттеулер қайда бағытталған',
        en: 'Where research is heading',
      },
      {
        ru: 'Что это значит для вас сегодня',
        kk: 'Бұл бүгін сіз үшін нені білдіреді',
        en: 'What this means for you today',
      },
    ],
  },
  {
    id: 'art-glaucoma',
    slug: 'glaucoma-early-signs',
    category: 'glaucoma',
    tags: ['glaucoma', 'eye-pressure', 'diagnostics', 'oct', 'prevention'],
    authorId: 'doc-baitursyn',
    serviceSlug: 'perimetry',
    date: '2026-03-12',
    readingMinutes: 6,
    title: {
      ru: 'Глаукома: почему её замечают поздно',
      kk: 'Глаукома: оны неге кеш байқайды',
      en: 'Glaucoma: why it is noticed too late',
    },
    excerpt: {
      ru: 'Поле зрения сужается незаметно — разбираем, что делать до появления жалоб.',
      kk: 'Көру өрісі байқаусыз тарылады — шағым пайда болғанға дейін не істеу керегін талдаймыз.',
      en: 'The visual field narrows imperceptibly — what to do before symptoms appear.',
    },
    headings: [
      {
        ru: 'Почему глаукому не замечают',
        kk: 'Глаукоманы неге байқамайды',
        en: 'Why glaucoma goes unnoticed',
      },
      {
        ru: 'Кто в группе риска',
        kk: 'Қауіп тобына кім жатады',
        en: 'Who is at risk',
      },
      {
        ru: 'Как выявляют глаукому',
        kk: 'Глаукома қалай анықталады',
        en: 'How glaucoma is detected',
      },
      {
        ru: 'Лечение и дисциплина',
        kk: 'Емдеу және тәртіп',
        en: 'Treatment and consistency',
      },
      {
        ru: 'Обследование в центре',
        kk: 'Орталықтағы тексеру',
        en: 'Examination at the centre',
      },
    ],
  },
  {
    id: 'art-lenses',
    slug: 'contact-lens-care',
    category: 'prevention',
    tags: ['contact-lenses', 'prevention', 'emergency'],
    authorId: 'doc-kim',
    serviceSlug: 'contact-lens-fitting',
    date: '2026-02-24',
    readingMinutes: 4,
    title: {
      ru: 'Правила ухода за контактными линзами',
      kk: 'Контакт линзаларын күту ережелері',
      en: 'Contact lens care rules',
    },
    excerpt: {
      ru: 'Пять ошибок, из-за которых чаще всего развивается воспаление роговицы.',
      kk: 'Қасаң қабық қабынуы жиі дамитын бес қате.',
      en: 'Five mistakes that most often lead to corneal inflammation.',
    },
    headings: [
      {
        ru: 'Почему правила так важны',
        kk: 'Ережелер неге соншалықты маңызды',
        en: 'Why the rules matter',
      },
      {
        ru: 'Пять частых ошибок',
        kk: 'Жиі кездесетін бес қате',
        en: 'Five common mistakes',
      },
      {
        ru: 'Правильный ежедневный уход',
        kk: 'Күнделікті дұрыс күтім',
        en: 'A safe daily routine',
      },
      {
        ru: 'Тревожные признаки',
        kk: 'Қауіпті белгілер',
        en: 'Warning signs',
      },
      {
        ru: 'Подбор линз в центре',
        kk: 'Орталықта линза таңдау',
        en: 'Lens fitting at the centre',
      },
    ],
  },
  {
    id: 'art-presbyopia',
    slug: 'presbyopia-after-40',
    category: 'after40',
    tags: ['presbyopia', 'contact-lenses', 'glaucoma', 'diagnostics', 'prevention'],
    authorId: 'doc-kim',
    serviceSlug: 'glasses-fitting',
    date: '2026-02-12',
    readingMinutes: 7,
    title: {
      ru: 'Очки для чтения после 40: что такое пресбиопия и как с ней жить',
      kk: 'Қырықтан кейінгі оқу көзілдірігі: пресбиопия деген не және онымен қалай өмір сүруге болады',
      en: 'Reading glasses after 40: what presbyopia is and how to live with it',
    },
    excerpt: {
      ru: 'Почему после сорока текст приходится отодвигать всё дальше, какие есть способы снова читать с комфортом и зачем в этом возрасте проверять не только зрение.',
      kk: 'Неліктен қырық жастан кейін мәтінді алысқа ұстауға тура келеді, қайтадан жайлы оқудың қандай жолдары бар және бұл жаста тек көру өткірлігін ғана емес, көзді толық тексерту не үшін керек.',
      en: 'Why text drifts further away after forty, which options bring back comfortable reading, and why an eye exam at this age checks far more than your prescription.',
    },
    headings: [
      {
        ru: 'Что такое пресбиопия',
        kk: 'Пресбиопия деген не',
        en: 'What presbyopia is',
      },
      {
        ru: 'Как понять, что это она',
        kk: 'Оны қалай байқауға болады',
        en: 'How to recognise it',
      },
      {
        ru: 'Очки и контактные линзы',
        kk: 'Көзілдірік және жанаспалы линзалар',
        en: 'Glasses and contact lenses',
      },
      {
        ru: 'А если операция?',
        kk: 'Ал ота жасатса ше?',
        en: 'What about surgery?',
      },
      {
        ru: 'Зачем проверять глаза после 40',
        kk: 'Қырықтан кейін көзді неге тексерту керек',
        en: 'Why an eye exam after 40 matters',
      },
    ],
  },
  {
    id: 'art-keratoconus',
    slug: 'keratoconus-explained',
    category: 'library',
    tags: ['keratoconus', 'diagnostics', 'contact-lenses', 'laser-correction'],
    authorId: 'doc-serikov',
    serviceSlug: 'corneal-topography',
    date: '2026-02-10',
    readingMinutes: 8,
    title: {
      ru: 'Кератоконус: когда роговица меняет форму',
      kk: 'Кератоконус: қасаң қабық пішінін өзгерткенде',
      en: 'Keratoconus: when the cornea changes shape',
    },
    excerpt: {
      ru: 'Почему роговица может постепенно истончаться и выпячиваться, как это распознают на ранней стадии и какие методы помогают остановить процесс и сохранить зрение.',
      kk: 'Қасаң қабық неліктен бірте-бірте жұқарып, алға қарай томпаяды, оны ерте кезеңде қалай анықтайды және үдерісті тоқтатып, көруді сақтауға қандай әдістер көмектеседі.',
      en: 'Why the cornea can gradually thin and bulge forward, how the condition is recognised early, and which treatments help halt it and protect your sight.',
    },
    headings: [
      {
        ru: 'Что такое кератоконус',
        kk: 'Кератоконус деген не',
        en: 'What keratoconus is',
      },
      {
        ru: 'Признаки, на которые стоит обратить внимание',
        kk: 'Назар аударатын белгілер',
        en: 'Signs worth noticing',
      },
      {
        ru: 'Топография и томография роговицы',
        kk: 'Қасаң қабықтың топографиясы мен томографиясы',
        en: 'Corneal topography and tomography',
      },
      {
        ru: 'Кросслинкинг, линзы и бережное отношение',
        kk: 'Кросслинкинг, линзалар және көзге ұқыпты қарау',
        en: 'Cross-linking, lenses and eye care',
      },
      {
        ru: 'Почему это важно перед лазерной коррекцией',
        kk: 'Лазерлік түзету алдында неге маңызды',
        en: 'Why it matters before laser correction',
      },
    ],
  },
];

/* ================================================================ BODIES */

const bodyLoaders = import.meta.glob<{ default: KnowledgeArticleBody }>('./knowledge-bodies/*.ts');
const bodyCache = new Map<string, KnowledgeArticleBody>();

/** Body already in memory (after a previous visit or prefetch), if any. */
export const cachedArticleBody = (slug: string): KnowledgeArticleBody | undefined => bodyCache.get(slug);

/** Fetches one article body (its own small chunk). Rejects if the slug is unknown. */
export const loadArticleBody = async (slug: string): Promise<KnowledgeArticleBody> => {
  const cached = bodyCache.get(slug);
  if (cached) return cached;
  const loader = bodyLoaders[`./knowledge-bodies/${slug}.ts`];
  if (!loader) throw new Error(`Unknown article: ${slug}`);
  const body = (await loader()).default;
  bodyCache.set(slug, body);
  return body;
};

/* =============================================================== QUERIES */

export const articleBySlug = (slug: string): KnowledgeArticleMeta | undefined =>
  KNOWLEDGE_INDEX.find((article) => article.slug === slug);

export const countByCategory = (category: KnowledgeCategory): number =>
  KNOWLEDGE_INDEX.filter((article) => article.category === category).length;

/** Tags actually used, most frequent first. */
export const usedTags = (): KnowledgeTag[] => {
  const counts = new Map<KnowledgeTag, number>();
  KNOWLEDGE_INDEX.forEach((article) =>
    article.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1)),
  );
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tag]) => tag);
};

/**
 * Related materials: shared tags weigh most, then the same theme, then the
 * same author; recency breaks ties.
 */
export const relatedArticles = (article: KnowledgeArticleMeta, limit = 3): KnowledgeArticleMeta[] =>
  KNOWLEDGE_INDEX.filter((entry) => entry.id !== article.id)
    .map((entry) => ({
      entry,
      score:
        entry.tags.filter((tag) => article.tags.includes(tag)).length * 3 +
        (entry.category === article.category ? 4 : 0) +
        (entry.authorId === article.authorId ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.entry.date.localeCompare(a.entry.date))
    .slice(0, limit)
    .map(({ entry }) => entry);

export const articlesByAuthor = (authorId: string): KnowledgeArticleMeta[] =>
  KNOWLEDGE_INDEX.filter((article) => article.authorId === authorId);

/** Materials that explain one of the founder's publications. */
export const articlesBasedOn = (publicationId: string): KnowledgeArticleMeta[] =>
  KNOWLEDGE_INDEX.filter((article) => article.basedOn?.includes(publicationId));

/** Authors with at least one material: editorial team first, then by output. */
export const knowledgeAuthors = (): Array<{ author: KnowledgeAuthor; count: number }> => {
  const ids = [...new Set(KNOWLEDGE_INDEX.map((article) => article.authorId))];
  return ids
    .map((id) => ({ author: authorById(id), count: articlesByAuthor(id).length }))
    .filter((entry): entry is { author: KnowledgeAuthor; count: number } => Boolean(entry.author))
    .sort((a, b) => Number(b.author.isEditorial) - Number(a.author.isEditorial) || b.count - a.count);
};
