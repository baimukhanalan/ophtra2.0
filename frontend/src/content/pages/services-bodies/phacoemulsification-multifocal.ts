import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/phacoemulsification-multifocal (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'surgery',
  lead: {
    ru: 'Факоэмульсификация с мультифокальной линзой — удаление катаракты или хрусталика с установкой линзы, которая даёт фокус на нескольких расстояниях и может уменьшить зависимость от очков.',
    kk: 'Мультифокалды линзамен факоэмульсификация — катарактаны немесе көз бұршағын алып, бірнеше қашықтыққа фокус беретін линза орнату; ол көзілдірікке тәуелділікті азайтуы мүмкін.',
    en: 'Phacoemulsification with a multifocal lens removes the cataract or natural lens and implants a lens that focuses at several distances, which can reduce dependence on glasses.',
  },
  overview: {
    ru: [
      'Сама операция проходит так же, как стандартная факоэмульсификация: помутневший хрусталик удаляют через микроразрез и заменяют искусственной линзой. Отличие — в оптике линзы. Мультифокальная линза распределяет свет на несколько фокусов (даль, средняя дистанция, близь), а линзы с увеличенной глубиной фокуса (EDOF) дают непрерывный диапазон от дали до средних расстояний.',
      'Такие линзы подходят не всем. Возможны ореолы и блики вокруг огней в темноте, несколько сниженная контрастность; к новому зрению мозгу нужно привыкнуть. При заболеваниях сетчатки (например, макулярной дегенерации), глаукоме, неправильной роговице или выраженной «сухости глаза», а также при высоких требованиях к ночному вождению хирург может рекомендовать монофокальную линзу. Решение принимается совместно после обследования и подробного обсуждения ваших ожиданий.',
    ],
    kk: [
      'Операцияның өзі стандартты факоэмульсификация сияқты өтеді: бұлыңғырланған көз бұршағы микрокесік арқылы алынып, жасанды линзамен ауыстырылады. Айырмашылығы — линзаның оптикасында. Мультифокалды линза жарықты бірнеше фокусқа (алыс, орташа қашықтық, жақын) бөледі, ал фокус тереңдігі ұлғайтылған (EDOF) линзалар алыстан орташа қашықтыққа дейін үздіксіз ауқым береді.',
      'Мұндай линзалар бәріне бірдей сәйкес келмейді. Қараңғыда шамдардың айналасында гало мен жылтыр пайда болуы, контраст сәл төмендеуі мүмкін; жаңа көруге мидың бейімделуі қажет. Торқабық аурулары (мысалы, макулалық дегенерация), глаукома, қасаң қабық пішіні дұрыс болмаса немесе «құрғақ көз» айқын білінсе, сондай-ақ түнде көлік жүргізуге қойылатын талаптар жоғары болса, хирург монофокалды линзаны ұсынуы мүмкін. Шешім тексеруден және күтетін нәтижеңізді жан-жақты талқылағаннан кейін бірлесіп қабылданады.',
    ],
    en: [
      'The operation itself is the same as standard phacoemulsification: the clouded lens is removed through a micro-incision and replaced with an artificial lens. The difference lies in the lens optics. A multifocal lens splits light into several focal points (distance, intermediate and near), while extended depth of focus (EDOF) lenses provide a continuous range from distance to intermediate.',
      'These lenses are not for everyone. Halos and glare around lights at night and slightly reduced contrast are possible, and the brain needs time to adapt. With retinal disease (such as macular degeneration), glaucoma, an irregular cornea, significant dry eye, or high demands for night driving, the surgeon may recommend a monofocal lens instead. The decision is made together, after examination and a detailed discussion of your expectations.',
    ],
  },
  indications: {
    ru: [
      'Катаракта у пациента, который хочет реже пользоваться очками',
      'Возрастная потеря зрения вблизи (пресбиопия) в сочетании с начальными изменениями хрусталика — по решению врача',
      'Здоровая сетчатка, зрительный нерв и регулярная роговица по данным обследования',
      'Реалистичные ожидания и готовность к периоду адаптации',
      'Готовность мириться с возможными ореолами вокруг огней в темноте',
    ],
    kk: [
      'Көзілдірікті сирек пайдаланғысы келетін пациенттегі катаракта',
      'Көз бұршағының бастапқы өзгерістерімен қатар жасқа байланысты жақыннан көрудің нашарлауы (пресбиопия) — дәрігердің шешімі бойынша',
      'Тексеру нәтижесі бойынша сау торқабық, көру жүйкесі және дұрыс пішінді қасаң қабық',
      'Шынайы күтулер және бейімделу кезеңіне дайын болу',
      'Қараңғыда шамдардың айналасында болуы мүмкін галоға төзуге дайын болу',
    ],
    en: [
      'Cataract in someone who wants to rely less on glasses',
      'Age-related loss of near vision (presbyopia) with early lens changes — at the doctor\'s discretion',
      'Healthy retina, optic nerve and regular cornea on examination',
      'Realistic expectations and readiness for a period of adaptation',
      'Willingness to accept possible halos around lights at night',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Для мультифокальных линз требования к обследованию особенно высоки: любые скрытые изменения сетчатки или роговицы могут снизить качество зрения с такой оптикой.',
      kk: 'Мультифокалды линзалар үшін тексеруге қойылатын талаптар ерекше жоғары: торқабық пен қасаң қабықтағы кез келген жасырын өзгерістер осындай оптикамен көру сапасын төмендетуі мүмкін.',
      en: 'For multifocal lenses the assessment is especially demanding: any hidden changes in the retina or cornea can reduce the quality of vision with this type of optics.',
    },
    list: {
      ru: [
        'Оптическая биометрия и расчёт силы линзы',
        'Топография роговицы — астигматизм и регулярность поверхности',
        'ОКТ макулы — исключение заболеваний центральной сетчатки',
        'Оценка слёзной плёнки и глазной поверхности',
        'Измерение размера зрачка и осмотр глазного дна',
      ],
      kk: [
        'Оптикалық биометрия және линза күшін есептеу',
        'Қасаң қабық топографиясы — астигматизм және беттің біркелкілігі',
        'Макуланың ОКТ-сы — орталық торқабық ауруларын жоққа шығару',
        'Жас қабықшасы мен көз бетін бағалау',
        'Қарашық өлшемін өлшеу және көз түбін қарау',
      ],
      en: [
        'Optical biometry and lens power calculation',
        'Corneal topography — astigmatism and surface regularity',
        'Macular OCT — to rule out disease of the central retina',
        'Tear film and eye surface assessment',
        'Pupil size measurement and retinal examination',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Выбор линзы — это баланс между независимостью от очков и качеством зрения в разных условиях. Хирург объясняет плюсы и ограничения каждого варианта применительно к вашим глазам и образу жизни.',
      kk: 'Линза таңдау — көзілдіріктен тәуелсіздік пен әртүрлі жағдайлардағы көру сапасы арасындағы тепе-теңдік. Хирург әр нұсқаның артықшылықтары мен шектеулерін сіздің көзіңіз бен өмір салтыңызға қатысты түсіндіреді.',
      en: 'Choosing a lens is a balance between independence from glasses and quality of vision in different conditions. The surgeon explains the pros and limits of each option for your eyes and lifestyle.',
    },
    list: {
      ru: [
        'Мультифокальная (трифокальная) линза — даль, средняя дистанция и близь; чаще возможны ореолы',
        'EDOF-линза — даль и средняя дистанция, меньше ореолов, для мелкого шрифта могут понадобиться очки',
        'Торические версии — при сопутствующем астигматизме',
        'Монофокальная линза — максимальная контрастность, но очки для чтения',
        'Монозрение монофокальными линзами — один глаз настроен на даль, другой на близь',
      ],
      kk: [
        'Мультифокалды (трифокалды) линза — алыс, орташа қашықтық және жақын; гало жиірек болуы мүмкін',
        'EDOF линза — алыс және орташа қашықтық, гало азырақ, ұсақ қаріп үшін көзілдірік керек болуы мүмкін',
        'Торикалық нұсқалары — қосарланған астигматизм кезінде',
        'Монофокалды линза — контраст барынша жоғары, бірақ оқуға көзілдірік қажет',
        'Монофокалды линзалармен монокөру — бір көз алысқа, екіншісі жақынға бапталады',
      ],
      en: [
        'Multifocal (trifocal) lens — distance, intermediate and near; halos are more likely',
        'EDOF lens — distance and intermediate, fewer halos, glasses may be needed for small print',
        'Toric versions — when astigmatism is also present',
        'Monofocal lens — the best contrast, but reading glasses are needed',
        'Monovision with monofocal lenses — one eye set for distance, the other for near',
      ],
    },
  },
  preparation: {
    ru: [
      'Прекратите носить контактные линзы до биометрии — это важно для точного расчёта линзы',
      'Подумайте, на каком расстоянии вы чаще всего работаете (телефон, компьютер, вождение), и обсудите это с врачом',
      'Не наносите макияж в день операции и сообщите врачу о всех лекарствах',
      'Попросите кого-то проводить вас домой после операции',
    ],
    kk: [
      'Биометрияға дейін жанаспа линзаларды тағуды тоқтатыңыз — бұл линзаны дәл есептеу үшін маңызды',
      'Көбінесе қай қашықтықта жұмыс істейтініңізді (телефон, компьютер, көлік жүргізу) ойластырып, дәрігермен талқылаңыз',
      'Операция күні бояу-опа жақпаңыз және барлық дәрі-дәрмектер туралы дәрігерге айтыңыз',
      'Операциядан кейін үйге дейін шығарып салуды біреуден өтініңіз',
    ],
    en: [
      'Stop wearing contact lenses before biometry — this matters for an accurate lens calculation',
      'Think about the distances you use most (phone, computer, driving) and discuss them with your doctor',
      'Do not wear make-up on the day of surgery, and tell your doctor about all medicines',
      'Ask someone to take you home after the operation',
    ],
  },
  result: {
    ru: 'Зрение проясняется в первые дни, но полная адаптация к мультифокальной оптике может занять от нескольких недель до нескольких месяцев, особенно после операции на втором глазу. Контрольные осмотры проводятся по графику врача, в течение нескольких недель используются капли. Ореолы и блики вокруг огней ночью, как правило, со временем становятся менее заметными, но у части пациентов сохраняются. Многие пациенты пользуются очками реже, однако полной независимости от очков в любых условиях гарантировать нельзя.',
    kk: 'Көру алғашқы күндері айқындалады, бірақ мультифокалды оптикаға толық бейімделу бірнеше аптадан бірнеше айға дейін созылуы мүмкін, әсіресе екінші көзге операция жасалғаннан кейін. Бақылау тексерулері дәрігердің кестесі бойынша өткізіледі, бірнеше апта бойы тамшылар қолданылады. Түнде шамдардың айналасындағы гало мен жылтыр әдетте уақыт өте келе азаяды, бірақ кейбір пациенттерде сақталады. Көптеген пациенттер көзілдірікті сирек пайдаланады, алайда кез келген жағдайда көзілдіріктен толық тәуелсіз болуға кепілдік беру мүмкін емес.',
    en: 'Vision clears in the first days, but full adaptation to multifocal optics can take from several weeks to several months, especially after the second eye is done. Check-ups follow your doctor\'s schedule and drops are used for several weeks. Halos and glare around lights at night usually become less noticeable over time but persist for some people. Many people use glasses less often, but complete freedom from glasses in every situation cannot be guaranteed.',
  },
  faq: [
    {
      q: {
        ru: 'Чем мультифокальная линза отличается от EDOF?',
        kk: 'Мультифокалды линзаның EDOF-тан айырмашылығы неде?',
        en: 'What is the difference between a multifocal and an EDOF lens?',
      },
      a: {
        ru: 'Мультифокальная линза создаёт несколько отдельных фокусов, включая близь, но чаще даёт ореолы. EDOF-линза растягивает фокус от дали до средних расстояний, обычно с меньшими оптическими эффектами, но для чтения мелкого текста очки могут понадобиться.',
        kk: 'Мультифокалды линза бірнеше жеке фокус жасайды, оның ішінде жақынға да, бірақ гало жиірек береді. EDOF линза фокусты алыстан орташа қашықтыққа дейін созады, әдетте оптикалық әсерлері азырақ, бірақ ұсақ мәтінді оқу үшін көзілдірік керек болуы мүмкін.',
        en: 'A multifocal lens creates several separate focal points, including near, but halos are more common. An EDOF lens stretches focus from distance to intermediate, usually with fewer optical effects, but glasses may be needed for small print.',
      },
    },
    {
      q: {
        ru: 'Что делать, если ореолы сильно мешают?',
        kk: 'Гало қатты кедергі келтірсе, не істеу керек?',
        en: 'What if halos are very bothersome?',
      },
      a: {
        ru: 'Чаще всего они уменьшаются по мере адаптации. Если нет, врач ищет устранимые причины — сухость глаза, остаточную рефракцию, помутнение капсулы. В редких случаях обсуждается замена линзы.',
        kk: 'Көбінесе олар бейімделген сайын азаяды. Азаймаса, дәрігер жоюға болатын себептерді — көздің құрғауын, қалдық рефракцияны, капсуланың бұлыңғырлануын іздейді. Сирек жағдайларда линзаны ауыстыру талқыланады.',
        en: 'They usually lessen as you adapt. If not, the doctor looks for treatable causes — dry eye, a residual prescription or capsule clouding. In rare cases lens exchange is discussed.',
      },
    },
    {
      q: {
        ru: 'Можно ли поставить мультифокальную линзу только на один глаз?',
        kk: 'Мультифокалды линзаны тек бір көзге қоюға бола ма?',
        en: 'Can a multifocal lens be placed in one eye only?',
      },
      a: {
        ru: 'Иногда это возможно, но лучшие условия для адаптации обычно создаются при одинаковой оптике на обоих глазах. Подход определяется индивидуально.',
        kk: 'Кейде бұл мүмкін, бірақ бейімделуге ең қолайлы жағдай әдетте екі көзде бірдей оптика болғанда туады. Тәсіл жеке анықталады.',
        en: 'Sometimes this is possible, but adaptation is usually easiest when both eyes have the same optics. The approach is decided individually.',
      },
    },
  ],
  sources: [
    {
      label: 'NICE NG77 — Cataracts in adults: management',
      href: 'https://www.nice.org.uk/guidance/ng77',
    },
    {
      label: 'NHS — Cataracts',
      href: 'https://www.nhs.uk/conditions/cataracts/',
    },
  ],
  topics: ['катаракт', 'хрусталик', 'мультифокал', 'пресбиоп', 'интраокуляр'],
};

export default content;
