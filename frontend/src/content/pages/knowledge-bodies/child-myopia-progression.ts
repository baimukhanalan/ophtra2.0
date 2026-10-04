import type { KnowledgeArticleBody } from '../knowledge-types';

/**
 * Knowledge base — body of «Почему близорукость у детей прогрессирует и как это замедлить».
 * Loaded on demand by the article page; the listing only reads
 * knowledge-articles-index.ts.
 */
const body: KnowledgeArticleBody = {
  sections: [
    {
      id: 'how-it-develops',
      title: {
        ru: 'Почему глаз становится близоруким',
        kk: 'Көз неге алыстан нашар көре бастайды',
        en: 'Why the eye becomes short-sighted',
      },
      body: {
        ru: [
          'При близорукости изображение удалённых предметов фокусируется не на сетчатке, а перед ней. У детей главная причина — избыточный рост глаза в длину: даже небольшое удлинение глазного яблока заметно меняет его оптику. В результате ребёнок хорошо видит вблизи, но щурится, глядя на доску, дорожные знаки или экран телевизора.',
          'Активнее всего глаз растёт в школьные годы, примерно с 7 до 14 лет. Именно в этот период близорукость чаще всего появляется и быстрее всего усиливается. Чем раньше она началась, тем более высокой может стать к взрослому возрасту, а высокая миопия со временем повышает риск изменений сетчатки. Поэтому задача наблюдения — не только подобрать очки, но и замедлить рост глаза.',
        ],
        kk: [
          'Миопия кезінде алыстағы заттардың кескіні тор қабықтың үстіне емес, оның алдына түседі. Балаларда басты себеп — көз алмасының ұзыннан шамадан тыс өсуі: көз сәл ғана ұзарғанның өзінде оның оптикасы едәуір өзгереді. Нәтижесінде бала жақыннан жақсы көреді, бірақ тақтаға, жол белгілеріне немесе теледидар экранына қарағанда көзін қысады.',
          'Көз мектеп жасында, шамамен 7 мен 14 жас аралығында, ең белсенді өседі. Миопия дәл осы кезеңде жиі пайда болып, тез үдейді. Ол неғұрлым ерте басталса, ересек жасқа қарай соғұрлым жоғары дәрежеге жетуі мүмкін, ал жоғары миопия уақыт өте келе тор қабықтағы өзгерістер қаупін арттырады. Сондықтан бақылаудың мақсаты — тек көзілдірік таңдау емес, көздің өсуін баяулату.',
        ],
        en: [
          'In myopia, the image of distant objects is focused in front of the retina rather than on it. In children the main cause is excessive growth of the eye in length: even a slight elongation of the eyeball noticeably changes its optics. As a result, a child sees well up close but squints at the classroom board, road signs or the television screen.',
          'The eye grows most actively during the school years, roughly from 7 to 14. This is when myopia most often appears and progresses fastest. The earlier it starts, the higher it may become by adulthood, and high myopia increases the long-term risk of retinal changes. That is why monitoring aims not only to prescribe glasses but also to slow the eye’s growth.',
        ],
      },
    },
    {
      id: 'risk-factors',
      title: {
        ru: 'Что ускоряет прогрессирование',
        kk: 'Үдеуді не жылдамдатады',
        en: 'What speeds up progression',
      },
      body: {
        ru: [
          'На темп прогрессирования влияют сразу несколько факторов. Одни из них изменить нельзя, например наследственность, другие связаны с образом жизни и поддаются коррекции. Исследования последовательно показывают, что время, проведённое на улице при дневном свете, связано с более медленным развитием близорукости, а длительная непрерывная работа вблизи — с более быстрым.',
        ],
        kk: [
          'Үдеу қарқынына бірнеше фактор қатар әсер етеді. Олардың кейбірін, мысалы, тұқым қуалаушылықты өзгерту мүмкін емес, ал енді біреулері өмір салтына байланысты және түзетуге көнеді. Зерттеулер күндізгі жарықта далада өткізілген уақыт миопияның баяу дамуымен, ал жақыннан ұзақ әрі үзіліссіз жұмыс оның тезірек үдеуімен байланысты екенін дәйекті түрде көрсетеді.',
        ],
        en: [
          'Several factors influence how quickly myopia progresses. Some cannot be changed, such as heredity, while others relate to lifestyle and can be adjusted. Research consistently shows that time spent outdoors in daylight is associated with slower development of myopia, whereas prolonged, uninterrupted near work is associated with faster progression.',
        ],
      },
      list: {
        ru: [
          'Близорукость у одного или обоих родителей',
          'Раннее появление миопии — до 8–9 лет',
          'Много часов чтения и гаджетов без перерывов',
          'Мало времени на улице при дневном свете',
        ],
        kk: [
          'Ата-ананың біреуінде немесе екеуінде де миопия болуы',
          'Миопияның ерте, 8–9 жасқа дейін басталуы',
          'Үзіліссіз ұзақ кітап оқу мен гаджет қолдану',
          'Күндізгі жарықта далада аз болу',
        ],
        en: [
          'Myopia in one or both parents',
          'Early onset — before the age of 8–9',
          'Many hours of reading and devices without breaks',
          'Little time outdoors in daylight',
        ],
      },
    },
    {
      id: 'control-methods',
      title: {
        ru: 'Методы контроля миопии',
        kk: 'Миопияны бақылау әдістері',
        en: 'Myopia control methods',
      },
      body: {
        ru: [
          'Обычные очки и линзы дают чёткое зрение, но сами по себе рост глаза не тормозят. Для контроля миопии применяют специальные оптические и медикаментозные методы. Их эффективность подтверждена клиническими исследованиями, но у каждого ребёнка результат индивидуален, поэтому говорить можно о замедлении прогрессирования, а не о его полной остановке.',
          'Выбор метода зависит от возраста, степени и темпа прогрессирования, состояния роговицы и того, насколько ребёнок и семья готовы соблюдать режим. Иногда методы сочетают. Решение принимает врач после обследования и затем оценивает результат по изменению длины глаза. Регулярный контроль позволяет вовремя сменить тактику, если выбранный метод работает недостаточно.',
        ],
        kk: [
          'Кәдімгі көзілдірік пен линзалар анық көруді қамтамасыз етеді, бірақ көздің өсуін өздігінен тежемейді. Миопияны бақылау үшін арнайы оптикалық және дәрілік әдістер қолданылады. Олардың тиімділігі клиникалық зерттеулерде расталған, алайда әр баладағы нәтиже жеке, сондықтан үдеуді толық тоқтату туралы емес, оны баяулату туралы айтуға болады.',
          'Әдісті таңдау баланың жасына, миопия дәрежесі мен үдеу қарқынына, қасаң қабықтың жағдайына және бала мен отбасының ем тәртібін сақтауға дайындығына байланысты. Кейде әдістер біріктіріледі. Шешімді дәрігер тексеруден кейін қабылдайды, содан соң нәтижені көз ұзындығының өзгерісі бойынша бағалайды. Тұрақты бақылау таңдалған әдіс жеткілікті нәтиже бермесе, тактиканы уақытында өзгертуге мүмкіндік береді.',
        ],
        en: [
          'Ordinary glasses and lenses provide clear vision, but on their own they do not slow the eye’s growth. Myopia control relies on specialised optical and pharmacological methods. Their effectiveness is supported by clinical studies, yet the response varies from child to child, so the realistic goal is to slow progression rather than stop it completely.',
          'The choice depends on age, the degree and rate of progression, the condition of the cornea and how ready the child and family are to follow the regimen. Methods are sometimes combined. The doctor decides after an examination and then judges the result by changes in the eye’s length. Regular monitoring makes it possible to change tactics in time if the chosen method is not working well enough.',
        ],
      },
      list: {
        ru: [
          'Очковые линзы с периферическим дефокусом',
          'Ортокератологические линзы ночного ношения',
          'Мягкие контактные линзы для контроля миопии',
          'Капли атропина в низкой концентрации по назначению врача',
        ],
        kk: [
          'Перифериялық дефокусы бар көзілдірік линзалары',
          'Түнде киілетін ортокератологиялық линзалар',
          'Миопияны бақылауға арналған жұмсақ контакт линзалары',
          'Дәрігер тағайындайтын төмен концентрациялы атропин тамшылары',
        ],
        en: [
          'Spectacle lenses with peripheral defocus',
          'Overnight orthokeratology lenses',
          'Soft contact lenses designed for myopia control',
          'Low-concentration atropine drops prescribed by a doctor',
        ],
      },
    },
    {
      id: 'daily-habits',
      title: {
        ru: 'Что могут сделать родители',
        kk: 'Ата-ана не істей алады',
        en: 'What parents can do',
      },
      body: {
        ru: [
          'Повседневные привычки не заменяют лечения, но создают для него хорошую основу. Главное — больше времени на свежем воздухе и регулярные перерывы при работе вблизи. Важно не запрещать чтение и учёбу, а сделать нагрузку более равномерной и следить за тем, чтобы ребёнок носил назначенную коррекцию.',
        ],
        kk: [
          'Күнделікті әдеттер емнің орнын баспайды, бірақ оған жақсы негіз қалыптастырады. Ең бастысы — таза ауада көбірек болу және жақыннан жұмыс істегенде тұрақты үзіліс жасау. Кітап оқуға және сабаққа тыйым салу емес, жүктемені біркелкі бөлу және баланың тағайындалған түзетуді киіп жүруін қадағалау маңызды.',
        ],
        en: [
          'Everyday habits do not replace treatment, but they provide a good foundation for it. The key points are more time outdoors and regular breaks during near work. The aim is not to forbid reading or homework but to spread the load more evenly and to make sure the child actually wears the prescribed correction.',
        ],
      },
      list: {
        ru: [
          'Прогулки при дневном свете — около двух часов в день',
          'Перерыв с взглядом вдаль каждые 20–30 минут работы вблизи',
          'Книга и экран — на расстоянии не ближе 30–40 см',
          'Хорошее освещение рабочего места',
        ],
        kk: [
          'Күндізгі жарықта серуендеу — күніне шамамен екі сағат',
          'Жақыннан әр 20–30 минут жұмыстан кейін алысқа қарап үзіліс жасау',
          'Кітап пен экранды 30–40 см-ден жақын ұстамау',
          'Жұмыс орнының жақсы жарықтандырылуы',
        ],
        en: [
          'Daylight outdoor time — about two hours a day',
          'A break looking into the distance every 20–30 minutes of near work',
          'Books and screens held no closer than 30–40 cm',
          'Good lighting at the desk',
        ],
      },
    },
    {
      id: 'monitoring-visit',
      title: {
        ru: 'Как проходит наблюдение в центре',
        kk: 'Орталықта бақылау қалай өтеді',
        en: 'How monitoring works at the centre',
      },
      body: {
        ru: [
          'Наблюдение стоит начинать сразу после того, как близорукость выявлена впервые. На первом приёме детский офтальмолог проверяет остроту зрения, определяет рефракцию после расслабления аккомодации, измеряет длину глаза и осматривает глазное дно. По результатам врач объясняет родителям, какой метод контроля подходит ребёнку и почему.',
          'Повторные осмотры обычно проводят раз в шесть месяцев с обязательным измерением длины глаза: именно этот показатель точнее всего показывает, работает ли выбранная тактика. Если ребёнок внезапно стал хуже видеть, жалуется на вспышки, «шторку» перед глазом или боль, приходить нужно сразу, не дожидаясь планового визита.',
        ],
        kk: [
          'Бақылауды миопия алғаш анықталған бойда бастаған жөн. Алғашқы қабылдауда балалар офтальмологы көру өткірлігін тексереді, аккомодацияны босаңсытқаннан кейін рефракцияны анықтайды, көз ұзындығын өлшейді және көз түбін қарайды. Нәтижелер бойынша дәрігер ата-анаға балаға бақылаудың қай әдісі сәйкес келетінін және неге екенін түсіндіреді.',
          'Қайталама қарау әдетте алты айда бір рет, көз ұзындығын міндетті түрде өлшей отырып жүргізіледі: таңдалған тактиканың нәтиже беріп жатқанын дәл осы көрсеткіш анық көрсетеді. Егер бала кенеттен нашар көре бастаса, көз алдында жарқыл, «перде» пайда болғанын немесе ауырсынуды айтса, жоспарлы қабылдауды күтпей, дереу келу керек.',
        ],
        en: [
          'Monitoring should begin as soon as myopia is first detected. At the first visit the paediatric ophthalmologist checks visual acuity, measures refraction after relaxing accommodation, measures the length of the eye and examines the fundus. Based on the results, the doctor explains to the parents which control method suits their child and why.',
          'Follow-up visits are usually every six months and always include axial length measurement, as this is the most reliable indicator of whether the chosen approach is working. If the child suddenly sees worse or reports flashes, a “curtain” over the vision or pain, come in straight away rather than waiting for the scheduled visit.',
        ],
      },
    },
  ],
  faq: [
    {
      q: {
        ru: 'Правда ли, что очки «сажают» зрение?',
        kk: 'Көзілдірік көруді «нашарлатады» деген рас па?',
        en: 'Is it true that glasses make eyesight worse?',
      },
      a: {
        ru: 'Нет. Правильно подобранные очки не ускоряют близорукость. Напротив, если ребёнок постоянно напрягается, чтобы разглядеть предметы вдали, ему сложнее учиться. Недокоррекция «на всякий случай» не помогает, поэтому силу линз должен определять врач.',
        kk: 'Жоқ. Дұрыс таңдалған көзілдірік миопияны үдетпейді. Керісінше, бала алыстағы заттарды көру үшін үнемі күш салса, оқуы қиындайды. «Абайлау үшін» әлсіз линза тағу пайда бермейді, сондықтан линза күшін дәрігер анықтауы тиіс.',
        en: 'No. Correctly prescribed glasses do not speed up myopia. On the contrary, a child who constantly strains to see distant objects finds learning harder. Deliberately weaker lenses “just in case” do not help, so lens power should be set by a doctor.',
      },
    },
    {
      q: {
        ru: 'Можно ли вылечить близорукость у ребёнка полностью?',
        kk: 'Баладағы миопияны толық емдеуге бола ма?',
        en: 'Can a child’s myopia be cured completely?',
      },
      a: {
        ru: 'Удлинение глаза необратимо, поэтому речь идёт не об излечении, а о замедлении прогрессирования. Чем меньше миопия усилится в детстве, тем ниже риски для сетчатки во взрослом возрасте. Вопрос о лазерной коррекции можно обсуждать после стабилизации зрения, как правило не раньше 18 лет.',
        kk: 'Көздің ұзаруы кері қайтпайды, сондықтан әңгіме толық емдеу туралы емес, үдеуді баяулату туралы. Балалық шақта миопия неғұрлым аз үдесе, ересек жаста тор қабыққа төнетін қауіп соғұрлым төмен. Лазерлік түзету мәселесін көру тұрақтанғаннан кейін, әдетте 18 жастан ерте емес талқылауға болады.',
        en: 'Elongation of the eye cannot be reversed, so the goal is to slow progression rather than cure it. The less myopia increases in childhood, the lower the retinal risks in adult life. Laser correction can be discussed once vision has stabilised, usually not before the age of 18.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute — Nearsightedness (Myopia)',
      href: 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/nearsightedness-myopia',
    },
    {
      label: 'AAO EyeWiki — Myopia',
      href: 'https://eyewiki.aao.org/Myopia',
    },
  ],
};

export default body;
