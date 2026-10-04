import type { KnowledgeArticleBody } from '../knowledge-types';

/**
 * Knowledge base — body of «Правила ухода за контактными линзами».
 * Loaded on demand by the article page; the listing only reads
 * knowledge-articles-index.ts.
 */
const body: KnowledgeArticleBody = {
  sections: [
    {
      id: 'why-rules-matter',
      title: {
        ru: 'Почему правила так важны',
        kk: 'Ережелер неге соншалықты маңызды',
        en: 'Why the rules matter',
      },
      body: {
        ru: [
          'Контактная линза лежит прямо на роговице и ограничивает доступ к ней кислорода и слезы. При правильном уходе это безопасно, но любые нарушения создают условия для размножения микроорганизмов. Самое серьёзное осложнение — кератит, воспаление роговицы, которое может оставить рубец и снизить зрение.',
          'Большинство таких осложнений связано не с самими линзами, а с привычками их владельцев. Хорошая новость в том, что эти ошибки легко исправить. Достаточно один раз разобраться в правилах и превратить их в ежедневную привычку — так же, как чистку зубов. Ниже — ошибки, которые встречаются чаще всего.',
        ],
        kk: [
          'Контакт линзасы тікелей қасаң қабықтың үстінде жатады және оған оттегі мен жастың жетуін шектейді. Дұрыс күтім жасалса, бұл қауіпсіз, бірақ кез келген бұзушылық микроорганизмдердің көбеюіне жағдай туғызады. Ең ауыр асқыну — кератит, яғни қасаң қабықтың қабынуы, ол тыртық қалдырып, көруді төмендетуі мүмкін.',
          'Мұндай асқынулардың көбі линзалардың өзімен емес, оларды киетін адамдардың әдеттерімен байланысты. Қуантарлығы, бұл қателерді түзету оңай. Ережелерді бір рет жақсылап түсініп алып, оларды тіс тазалау сияқты күнделікті әдетке айналдыру жеткілікті. Төменде ең жиі кездесетін қателер берілген.',
        ],
        en: [
          'A contact lens sits directly on the cornea and limits its supply of oxygen and tears. With proper care this is safe, but any lapse creates conditions in which microorganisms can multiply. The most serious complication is keratitis, an inflammation of the cornea that can leave a scar and reduce vision.',
          'Most of these complications are caused not by the lenses themselves but by the habits of the people who wear them. The good news is that these mistakes are easy to correct. It is enough to learn the rules once and turn them into a daily habit, like brushing your teeth. The most frequent mistakes are listed below.',
        ],
      },
    },
    {
      id: 'five-mistakes',
      title: {
        ru: 'Пять частых ошибок',
        kk: 'Жиі кездесетін бес қате',
        en: 'Five common mistakes',
      },
      body: {
        ru: [
          'Самая частая ошибка — носить линзы дольше установленного срока. Даже если линза выглядит чистой, со временем на ней накапливаются отложения, а проницаемость для кислорода снижается. Вторая по значимости — контакт с водой: в водопроводной воде, бассейнах и водоёмах могут находиться акантамёбы, устойчивые к обычным растворам и вызывающие тяжёлый кератит.',
        ],
        kk: [
          'Ең жиі кездесетін қате — линзаларды белгіленген мерзімнен ұзақ кию. Линза таза көрінсе де, уақыт өте келе оның бетінде шөгінділер жиналып, оттегі өткізгіштігі төмендейді. Маңыздылығы жағынан екінші қате — сумен жанасу: құбыр суында, бассейн мен су қоймаларында кәдімгі ерітінділерге төзімді, ауыр кератит тудыратын акантамёбалар болуы мүмкін.',
        ],
        en: [
          'The most common mistake is wearing lenses beyond their replacement period. Even if a lens looks clean, deposits build up over time and its oxygen permeability falls. The second most important is contact with water: tap water, swimming pools and open water may contain acanthamoeba, which resist ordinary solutions and can cause severe keratitis.',
        ],
      },
      list: {
        ru: [
          'Продление срока ношения линз',
          'Плавание, душ и промывание линз водой',
          'Доливание раствора вместо полной замены',
          'Использование контейнера дольше трёх месяцев',
          'Сон в линзах, не предназначенных для ночного ношения',
        ],
        kk: [
          'Линзаларды кию мерзімін ұзарту',
          'Линзамен жүзу, душ қабылдау және оларды сумен шаю',
          'Ерітіндіні толық ауыстырудың орнына үстінен құю',
          'Контейнерді үш айдан ұзақ пайдалану',
          'Түнде киюге арналмаған линзалармен ұйықтау',
        ],
        en: [
          'Wearing lenses beyond their replacement date',
          'Swimming, showering or rinsing lenses in water',
          'Topping up solution instead of replacing it',
          'Using the same case for more than three months',
          'Sleeping in lenses not approved for overnight wear',
        ],
      },
    },
    {
      id: 'daily-routine',
      title: {
        ru: 'Правильный ежедневный уход',
        kk: 'Күнделікті дұрыс күтім',
        en: 'A safe daily routine',
      },
      body: {
        ru: [
          'Безопасный уход строится на нескольких простых привычках. Перед тем как взять линзу, руки нужно вымыть с мылом и насухо вытереть безворсовым полотенцем. Раствор используют только свежий и только тот, что рекомендовал специалист, а контейнер после каждого использования промывают раствором и оставляют сохнуть открытым. Однодневные линзы не хранят и не надевают повторно.',
        ],
        kk: [
          'Қауіпсіз күтім бірнеше қарапайым әдетке негізделеді. Линзаны алмас бұрын қолды сабынмен жуып, түгі түспейтін сүлгімен құрғатып сүрту керек. Ерітіндінің тек жаңасын және тек маман ұсынғанын қолданады, ал контейнерді әр қолданғаннан кейін ерітіндімен шайып, ашық күйінде кептіруге қалдырады. Бір күндік линзаларды сақтамайды және қайта кимейді.',
        ],
        en: [
          'Safe care comes down to a few simple habits. Before handling a lens, wash your hands with soap and dry them with a lint-free towel. Use only fresh solution, and only the type your specialist recommended; after each use, rinse the case with solution and leave it open to air-dry. Daily disposable lenses should never be stored or worn again.',
        ],
      },
      list: {
        ru: [
          'Мыть и вытирать руки перед каждым касанием линзы',
          'Каждый раз заливать в контейнер свежий раствор',
          'Менять линзы строго по графику',
          'Всегда иметь с собой запасные очки',
        ],
        kk: [
          'Линзаны ұстар алдында әр жолы қолды жуып, құрғату',
          'Контейнерге әр жолы жаңа ерітінді құю',
          'Линзаларды кесте бойынша қатаң ауыстыру',
          'Әрдайым өзіңізбен қосалқы көзілдірік алып жүру',
        ],
        en: [
          'Wash and dry your hands before every lens contact',
          'Fill the case with fresh solution every time',
          'Replace lenses strictly on schedule',
          'Always carry a spare pair of glasses',
        ],
      },
    },
    {
      id: 'warning-signs',
      title: {
        ru: 'Тревожные признаки',
        kk: 'Қауіпті белгілер',
        en: 'Warning signs',
      },
      body: {
        ru: [
          'Любой дискомфорт в линзах — сигнал снять их. Если после снятия неприятные ощущения быстро проходят, линзу стоит заменить новой. Но если сохраняются боль, покраснение или снижение зрения, к врачу нужно обратиться в тот же день: кератит развивается быстро, и от своевременности лечения зависит результат. Линзу и контейнер лучше взять с собой.',
        ],
        kk: [
          'Линзадағы кез келген жайсыздық — оны шешу керектігінің белгісі. Шешкеннен кейін жағымсыз сезім тез басылса, линзаны жаңасына ауыстырған жөн. Ал ауырсыну, қызару немесе көрудің төмендеуі сақталса, дәрігерге сол күні қаралу керек: кератит тез дамиды, нәтиже емнің уақтылы басталуына байланысты. Линза мен контейнерді өзіңізбен бірге алып келген дұрыс.',
        ],
        en: [
          'Any discomfort while wearing lenses is a signal to take them out. If the unpleasant feeling passes quickly after removal, replace the lens with a new one. But if pain, redness or reduced vision persists, see a doctor the same day: keratitis develops quickly, and the outcome depends on prompt treatment. Bring the lens and case with you.',
        ],
      },
      list: {
        ru: [
          'Боль или ощущение инородного тела после снятия линзы',
          'Выраженное покраснение глаза',
          'Снижение или затуманивание зрения',
          'Светобоязнь и обильное слезотечение',
          'Белое пятно на роговице',
        ],
        kk: [
          'Линзаны шешкеннен кейін ауырсыну немесе бөгде зат сезімі',
          'Көздің айқын қызаруы',
          'Көрудің төмендеуі немесе бұлдырауы',
          'Жарықтан қорқу және көздің қатты жасаурауы',
          'Қасаң қабықта ақ дақтың пайда болуы',
        ],
        en: [
          'Pain or a foreign-body feeling after removing the lens',
          'Marked redness of the eye',
          'Reduced or blurred vision',
          'Sensitivity to light and heavy watering',
          'A white spot on the cornea',
        ],
      },
    },
    {
      id: 'fitting-at-the-centre',
      title: {
        ru: 'Подбор линз в центре',
        kk: 'Орталықта линза таңдау',
        en: 'Lens fitting at the centre',
      },
      body: {
        ru: [
          'Безопасное ношение начинается с правильного подбора. На приёме врач проверяет зрение и рефракцию, оценивает состояние роговицы, век и слёзной плёнки, измеряет параметры глаза и подбирает тип линз и режим замены с учётом образа жизни. Затем линзы примеряют, чтобы убедиться в их правильной посадке и комфорте.',
          'Новичков учат надевать и снимать линзы и объясняют правила ухода. Даже при отсутствии жалоб линзы и состояние роговицы стоит проверять раз в год — это помогает вовремя заметить ранние изменения. Если за год изменилось зрение или появился дискомфорт, приходить стоит раньше.',
        ],
        kk: [
          'Қауіпсіз кию дұрыс таңдаудан басталады. Қабылдауда дәрігер көру мен рефракцияны тексеріп, қасаң қабықтың, қабақтардың және жас қабықшасының жағдайын бағалайды, көз параметрлерін өлшеп, өмір салтын ескере отырып линза түрі мен ауыстыру тәртібін таңдайды. Содан кейін линзалардың дұрыс отырғанына және ыңғайлы екеніне көз жеткізу үшін оларды киіп көреді.',
          'Жаңадан бастағандарды линзаны киіп-шешуге үйретіп, күтім ережелерін түсіндіреді. Ешқандай шағым болмаса да, линзалар мен қасаң қабықтың жағдайын жылына бір рет тексеріп тұрған жөн — бұл бастапқы өзгерістерді уақытында байқауға көмектеседі. Егер бір жыл ішінде көру өзгерсе немесе жайсыздық пайда болса, ертерек келген жөн.',
        ],
        en: [
          'Safe lens wear begins with a proper fitting. At the visit the doctor checks vision and refraction, assesses the cornea, eyelids and tear film, measures the eye and chooses the lens type and replacement schedule to suit your lifestyle. Trial lenses are then fitted to confirm that they sit correctly and feel comfortable.',
          'New wearers are taught how to put lenses in and take them out, and the care rules are explained. Even without any complaints, it is worth having your lenses and cornea checked once a year to catch early changes in time. If your vision changes or discomfort appears within the year, come in sooner.',
        ],
      },
    },
  ],
  faq: [
    {
      q: {
        ru: 'Можно ли промыть линзу водой, если раствора нет под рукой?',
        kk: 'Ерітінді жоқ болса, линзаны сумен шаюға бола ма?',
        en: 'Can I rinse a lens with water if I have no solution?',
      },
      a: {
        ru: 'Нет. Водопроводная и даже бутилированная вода не стерильны и могут содержать микроорганизмы, опасные для роговицы. Если раствора нет, линзу лучше выбросить и надеть очки или новую пару линз.',
        kk: 'Жоқ. Құбыр суы, тіпті бөтелкедегі су да стерильді емес және қасаң қабыққа қауіпті микроорганизмдер болуы мүмкін. Ерітінді болмаса, линзаны лақтырып, көзілдірік немесе жаңа жұп линза киген дұрыс.',
        en: 'No. Tap water and even bottled water are not sterile and may contain microorganisms that are dangerous to the cornea. If you have no solution, throw the lens away and wear glasses or a fresh pair of lenses instead.',
      },
    },
    {
      q: {
        ru: 'Опасно ли один раз уснуть в линзах?',
        kk: 'Бір рет линзамен ұйықтап қалу қауіпті ме?',
        en: 'Is falling asleep in lenses once dangerous?',
      },
      a: {
        ru: 'Сон в линзах, не предназначенных для ночного ношения, повышает риск кератита даже однократно. Если это случилось, снимите линзы после пробуждения, дайте глазам отдохнуть и следите за самочувствием. При боли, покраснении или ухудшении зрения обратитесь к врачу.',
        kk: 'Түнде киюге арналмаған линзалармен ұйықтау тіпті бір рет болса да кератит қаупін арттырады. Егер бұлай болса, оянғаннан кейін линзаларды шешіп, көзге демалыс беріңіз және жағдайыңызды бақылаңыз. Ауырсыну, қызару немесе көрудің нашарлауы байқалса, дәрігерге қаралыңыз.',
        en: 'Sleeping in lenses not designed for overnight wear raises the risk of keratitis even on a single occasion. If it happens, remove the lenses when you wake up, give your eyes a rest and watch how they feel. If you notice pain, redness or worse vision, see a doctor.',
      },
    },
  ],
  sources: [
    {
      label: 'American Academy of Ophthalmology — Contact Lens Care',
      href: 'https://www.aao.org/eye-health/glasses-contacts/contact-lens-care',
    },
  ],
};

export default body;
