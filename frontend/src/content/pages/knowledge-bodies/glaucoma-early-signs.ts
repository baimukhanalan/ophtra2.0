import type { KnowledgeArticleBody } from '../knowledge-types';

/**
 * Knowledge base — body of «Глаукома: почему её замечают поздно».
 * Loaded on demand by the article page; the listing only reads
 * knowledge-articles-index.ts.
 */
const body: KnowledgeArticleBody = {
  sections: [
    {
      id: 'silent-disease',
      title: {
        ru: 'Почему глаукому не замечают',
        kk: 'Глаукоманы неге байқамайды',
        en: 'Why glaucoma goes unnoticed',
      },
      body: {
        ru: [
          'Глаукома — группа заболеваний, при которых постепенно повреждается зрительный нерв. Чаще всего это связано с повышенным внутриглазным давлением, хотя болезнь возможна и при нормальных цифрах. Наиболее распространённая форма развивается медленно и без боли, поэтому долгое время человек не чувствует никаких изменений.',
          'Потеря зрения начинается с периферии поля зрения, а центральное зрение сохраняется до поздних стадий. Мозг «достраивает» картинку, а второй глаз перекрывает выпадения. К моменту, когда человек замечает проблему, значительная часть нервных волокон уже утрачена, и восстановить их невозможно.',
        ],
        kk: [
          'Глаукома — көру жүйкесі біртіндеп зақымданатын аурулар тобы. Бұл көбінесе көзішілік қысымның жоғарылауымен байланысты, дегенмен ауру қысым қалыпты болғанда да дамуы мүмкін. Ең жиі кездесетін түрі баяу әрі ауырсынусыз өршиді, сондықтан адам ұзақ уақыт бойы ешқандай өзгерісті сезбейді.',
          'Көрудің жоғалуы көру өрісінің шетінен басталады, ал орталық көру кеш кезеңдерге дейін сақталады. Ми суретті «толықтырады», ал екінші көз түсіп қалған аймақтардың орнын басады. Адам мәселені байқаған кезде жүйке талшықтарының едәуір бөлігі жоғалып үлгереді, оларды қалпына келтіру мүмкін емес.',
        ],
        en: [
          'Glaucoma is a group of diseases in which the optic nerve is gradually damaged. It is most often linked to raised intraocular pressure, although it can also occur at normal pressure levels. The most common form develops slowly and painlessly, so for a long time a person feels no change at all.',
          'Vision loss starts at the periphery of the visual field, while central vision is preserved until late stages. The brain “fills in” the picture and the other eye covers the gaps. By the time a person notices a problem, a substantial proportion of nerve fibres has already been lost, and they cannot be restored.',
        ],
      },
    },
    {
      id: 'risk-factors',
      title: {
        ru: 'Кто в группе риска',
        kk: 'Қауіп тобына кім жатады',
        en: 'Who is at risk',
      },
      body: {
        ru: [
          'Глаукома может развиться у любого человека, но у некоторых людей вероятность выше. Если вы узнали себя хотя бы в одном пункте списка, регулярные проверки особенно важны. Наличие факторов риска не означает, что болезнь обязательно появится, — это лишь повод не откладывать обследование.',
        ],
        kk: [
          'Глаукома кез келген адамда дамуы мүмкін, бірақ кейбір адамдарда оның ықтималдығы жоғары. Егер төмендегі тізімнің ең болмағанда бір тармағында өзіңізді таныса, тұрақты тексерілу ерекше маңызды. Қауіп факторларының болуы аурудың міндетті түрде пайда болатынын білдірмейді — бұл тек тексеруді кейінге қалдырмауға себеп.',
        ],
        en: [
          'Anyone can develop glaucoma, but some people are more likely to. If you recognise yourself in at least one item on the list, regular check-ups are especially important. Having risk factors does not mean the disease will definitely appear — it is simply a reason not to put off an examination.',
        ],
      },
      list: {
        ru: [
          'Возраст старше 40 лет',
          'Глаукома у близких родственников',
          'Высокая близорукость или дальнозоркость',
          'Длительный приём гормональных препаратов',
          'Перенесённые травмы глаза',
        ],
        kk: [
          '40 жастан асқан жас',
          'Жақын туыстарда глаукоманың болуы',
          'Жоғары дәрежелі миопия немесе гиперметропия',
          'Гормондық препараттарды ұзақ қабылдау',
          'Бұрын көз жарақатын алу',
        ],
        en: [
          'Age over 40',
          'Glaucoma in close relatives',
          'High short- or long-sightedness',
          'Long-term use of steroid medicines',
          'A previous eye injury',
        ],
      },
    },
    {
      id: 'how-it-is-detected',
      title: {
        ru: 'Как выявляют глаукому',
        kk: 'Глаукома қалай анықталады',
        en: 'How glaucoma is detected',
      },
      body: {
        ru: [
          'Одного измерения внутриглазного давления для диагностики недостаточно: давление меняется в течение дня, а глаукома бывает и при нормальных значениях. Поэтому врач оценивает сразу несколько показателей — давление, состояние зрительного нерва, поле зрения и строение угла передней камеры, через который оттекает внутриглазная жидкость.',
          'После 40 лет проверять глаза рекомендуется регулярно, а при семейной истории глаукомы — раньше и чаще; конкретный интервал определяет врач. Повторные исследования позволяют заметить даже небольшие изменения со временем. Именно поэтому важно проходить исследования на одном и том же оборудовании и сохранять их результаты.',
        ],
        kk: [
          'Диагноз қою үшін көзішілік қысымды бір рет өлшеу жеткіліксіз: қысым тәулік бойы өзгеріп отырады, ал глаукома қалыпты көрсеткіштерде де болады. Сондықтан дәрігер бірнеше көрсеткішті қатар бағалайды — қысымды, көру жүйкесінің жағдайын, көру өрісін және көзішілік сұйықтық ағып шығатын алдыңғы камера бұрышының құрылымын.',
          '40 жастан кейін көзді тұрақты түрде тексеріп тұру ұсынылады, ал отбасында глаукома болса — ертерек әрі жиірек; нақты аралықты дәрігер белгілейді. Қайталама зерттеулер уақыт өте келе болатын шамалы өзгерістердің өзін байқауға мүмкіндік береді. Сондықтан зерттеулерді бір құрылғыда өтіп, олардың нәтижелерін сақтап қою маңызды.',
        ],
        en: [
          'A single intraocular pressure reading is not enough for a diagnosis: pressure varies during the day, and glaucoma can occur at normal values. The doctor therefore looks at several things together — pressure, the state of the optic nerve, the visual field and the structure of the drainage angle through which fluid leaves the eye.',
          'Regular eye checks are recommended after 40, and earlier and more often if glaucoma runs in the family; the doctor sets the exact interval. Repeated tests make it possible to spot even small changes over time. That is why it helps to have tests on the same equipment and to keep the results.',
        ],
      },
      list: {
        ru: [
          'Тонометрия — измерение внутриглазного давления',
          'Периметрия — исследование полей зрения',
          'ОКТ зрительного нерва и слоя нервных волокон',
          'Гониоскопия — осмотр угла передней камеры',
        ],
        kk: [
          'Тонометрия — көзішілік қысымды өлшеу',
          'Периметрия — көру өрісін зерттеу',
          'Көру жүйкесі мен жүйке талшықтары қабатының ОКТ-сы',
          'Гониоскопия — алдыңғы камера бұрышын қарау',
        ],
        en: [
          'Tonometry — measuring intraocular pressure',
          'Perimetry — visual field testing',
          'OCT of the optic nerve and nerve fibre layer',
          'Gonioscopy — examining the drainage angle',
        ],
      },
    },
    {
      id: 'treatment-adherence',
      title: {
        ru: 'Лечение и дисциплина',
        kk: 'Емдеу және тәртіп',
        en: 'Treatment and consistency',
      },
      body: {
        ru: [
          'Утраченные нервные волокна восстановить нельзя, поэтому цель лечения — снизить давление до безопасного для конкретного глаза уровня и остановить дальнейшую потерю зрения. Чаще всего начинают с капель; при необходимости применяют лазерные вмешательства или операцию. Лечение подбирают индивидуально и корректируют по результатам контрольных исследований.',
          'Ключевую роль играет регулярность: пропуски закапывания заметно снижают эффект терапии, даже если самочувствие не меняется. Отдельно стоит знать о признаках острого приступа — сильной боли в глазу и голове, покраснении, затуманивании, радужных кругах вокруг источников света, тошноте. В этом случае нужна срочная помощь в тот же час.',
        ],
        kk: [
          'Жоғалған жүйке талшықтарын қалпына келтіру мүмкін емес, сондықтан емнің мақсаты — қысымды нақты көз үшін қауіпсіз деңгейге дейін төмендетіп, көрудің одан әрі жоғалуын тоқтату. Көбінесе тамшыдан бастайды; қажет болса, лазерлік ем немесе операция қолданылады. Ем жеке таңдалып, бақылау зерттеулерінің нәтижелері бойынша түзетіліп отырады.',
          'Мұнда тұрақтылық шешуші рөл атқарады: тамшыны өткізіп алу, тіпті көңіл-күй өзгермесе де, ем әсерін айтарлықтай төмендетеді. Жедел ұстама белгілерін де білген жөн — көз бен бастың қатты ауыруы, қызару, бұлдырау, жарық көздерінің айналасындағы кемпірқосақ түстес шеңберлер, жүрек айну. Мұндай жағдайда дереу, сол сағатта көмекке жүгіну қажет.',
        ],
        en: [
          'Lost nerve fibres cannot be restored, so the aim of treatment is to lower pressure to a level that is safe for that particular eye and to stop further loss of vision. Treatment usually starts with eye drops; laser procedures or surgery are used when needed. It is tailored to each patient and adjusted according to follow-up tests.',
          'Consistency is crucial: missed doses noticeably reduce the effect of treatment, even if you feel no different. It is also important to know the signs of an acute attack — severe eye pain and headache, redness, blurred vision, rainbow-coloured halos around lights and nausea. In that case seek emergency care within the hour.',
        ],
      },
    },
    {
      id: 'at-the-centre',
      title: {
        ru: 'Обследование в центре',
        kk: 'Орталықтағы тексеру',
        en: 'Examination at the centre',
      },
      body: {
        ru: [
          'Обследование на глаукому в центре занимает один визит. Врач измеряет внутриглазное давление, проводит компьютерную периметрию и ОКТ зрительного нерва, осматривает глазное дно и угол передней камеры. Результаты сохраняются, чтобы при следующих визитах можно было точно сравнить их и увидеть динамику. Исследования безболезненны, но если зрачок расширяют, несколько часов после визита лучше не садиться за руль.',
          'Если диагноз подтверждается, врач объясняет, какой уровень давления считается целевым, как правильно закапывать капли и как часто нужно приходить на контроль. Если глаукомы нет, но есть факторы риска, вы получите рекомендации по срокам следующего осмотра. Родственникам пациентов с глаукомой также стоит пройти обследование.',
        ],
        kk: [
          'Орталықта глаукомаға тексеру бір рет келумен өтеді. Дәрігер көзішілік қысымды өлшейді, компьютерлік периметрия мен көру жүйкесінің ОКТ-сын жүргізеді, көз түбі мен алдыңғы камера бұрышын қарайды. Келесі келгенде оларды дәл салыстырып, өзгерісті көру үшін нәтижелер сақталады. Зерттеулер ауыртпайды, бірақ қарашық кеңейтілсе, қабылдаудан кейін бірнеше сағат көлік жүргізбеген дұрыс.',
          'Диагноз расталса, дәрігер қандай қысым деңгейі мақсатты саналатынын, тамшыны қалай дұрыс тамызу керектігін және бақылауға қаншалықты жиі келу қажеттігін түсіндіреді. Глаукома болмаса, бірақ қауіп факторлары бар болса, келесі тексеру мерзімі бойынша ұсыныс аласыз. Глаукомасы бар пациенттердің туыстарына да тексерілген жөн.',
        ],
        en: [
          'A glaucoma examination at the centre takes a single visit. The doctor measures intraocular pressure, performs computerised perimetry and optic nerve OCT, and examines the fundus and the drainage angle. The results are stored so that they can be compared precisely at later visits to see any change. The tests are painless, but if your pupils are dilated, avoid driving for a few hours afterwards.',
          'If the diagnosis is confirmed, the doctor explains the target pressure level, how to instil drops correctly and how often to come for check-ups. If there is no glaucoma but you have risk factors, you will be advised when to return for your next examination. Relatives of people with glaucoma should also consider being examined.',
        ],
      },
    },
  ],
  faq: [
    {
      q: {
        ru: 'Если давление в норме, глаукомы точно нет?',
        kk: 'Қысым қалыпты болса, глаукома мүлдем жоқ па?',
        en: 'If my eye pressure is normal, can I rule out glaucoma?',
      },
      a: {
        ru: 'Не всегда. Существует глаукома нормального давления, а однократное измерение может не отразить колебания в течение суток. Поэтому при факторах риска давление оценивают вместе с периметрией и ОКТ зрительного нерва.',
        kk: 'Әрдайым емес. Қалыпты қысымды глаукома деген түрі бар, ал бір рет өлшеу тәулік ішіндегі ауытқуларды көрсетпеуі мүмкін. Сондықтан қауіп факторлары болса, қысым периметриямен және көру жүйкесінің ОКТ-сымен бірге бағаланады.',
        en: 'Not always. Normal-tension glaucoma exists, and a single reading may miss fluctuations during the day. That is why, when risk factors are present, pressure is assessed together with perimetry and optic nerve OCT.',
      },
    },
    {
      q: {
        ru: 'Можно ли прекратить капли, если зрение не ухудшается?',
        kk: 'Көру нашарламаса, тамшыны тоқтатуға бола ма?',
        en: 'Can I stop the drops if my vision is not getting worse?',
      },
      a: {
        ru: 'Нет. Стабильное зрение как раз и означает, что лечение работает. Глаукома — хроническое заболевание, и самостоятельная отмена капель может привести к росту давления и незаметной потере поля зрения. Любые изменения схемы обсуждаются с врачом.',
        kk: 'Жоқ. Көрудің тұрақты болуы емнің нәтиже беріп жатқанын білдіреді. Глаукома — созылмалы ауру, тамшыны өз бетіңізше тоқтату қысымның көтерілуіне және көру өрісінің байқаусыз жоғалуына әкелуі мүмкін. Ем сызбасындағы кез келген өзгеріс дәрігермен талқыланады.',
        en: 'No. Stable vision is exactly what shows the treatment is working. Glaucoma is a chronic condition, and stopping drops on your own can lead to rising pressure and unnoticed visual field loss. Any change to the regimen should be discussed with your doctor.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute — Glaucoma',
      href: 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/glaucoma',
    },
    {
      label: 'American Academy of Ophthalmology — What Is Glaucoma?',
      href: 'https://www.aao.org/eye-health/diseases/what-is-glaucoma',
    },
    {
      label: 'NICE — Glaucoma: diagnosis and management (NG81)',
      href: 'https://www.nice.org.uk/guidance/ng81',
    },
  ],
};

export default body;
