import type { KnowledgeArticleBody } from '../knowledge-types';

/**
 * Knowledge base — body of «Когда пора оперировать катаракту».
 * Loaded on demand by the article page; the listing only reads
 * knowledge-articles-index.ts.
 */
const body: KnowledgeArticleBody = {
  sections: [
    {
      id: 'what-is-cataract',
      title: {
        ru: 'Что такое катаракта',
        kk: 'Катаракта дегеніміз не',
        en: 'What a cataract is',
      },
      body: {
        ru: [
          'Хрусталик — это прозрачная линза внутри глаза, которая фокусирует свет на сетчатке. При катаракте он постепенно мутнеет, и изображение становится тусклым и размытым, словно смотришь через запотевшее стекло. Чаще всего катаракта связана с возрастом, но её развитию способствуют также сахарный диабет, травмы, длительный приём некоторых лекарств и воздействие ультрафиолета.',
        ],
        kk: [
          'Көз бұршағы — көздің ішіндегі жарықты тор қабыққа фокустайтын мөлдір линза. Катаракта кезінде ол біртіндеп бұлыңғырланып, кескін күңгірттеніп, бұлдырап көрінеді, тіпті терлеген әйнек арқылы қарағандай болады. Катаракта көбіне жасқа байланысты, алайда оның дамуына қант диабеті, жарақаттар, кейбір дәрілерді ұзақ қабылдау және ультракүлгін сәулелер де ықпал етеді.',
        ],
        en: [
          'The lens is a clear structure inside the eye that focuses light onto the retina. In a cataract it gradually becomes cloudy, and the image turns dim and blurred, as if you were looking through a misted window. Cataracts are most often age-related, but diabetes, injury, long-term use of certain medicines and ultraviolet exposure can also contribute.',
        ],
      },
      list: {
        ru: [
          'Затуманивание и снижение чёткости зрения',
          'Ореолы и ослепление от фар и яркого света',
          'Тусклые, «выцветшие» цвета',
          'Частая смена очков без заметного улучшения',
        ],
        kk: [
          'Көрудің тұманданып, анықтығының төмендеуі',
          'Фара мен жарық сәулелерінің айналасында шеңбер пайда болып, көздің шағылысуы',
          'Түстердің күңгірт, «оңған» болып көрінуі',
          'Көзілдірікті жиі ауыстырғанмен, айтарлықтай жақсармауы',
        ],
        en: [
          'Cloudy, less sharp vision',
          'Halos and glare from headlights and bright light',
          'Dull, “faded” colours',
          'Frequent changes of glasses without real improvement',
        ],
      },
    },
    {
      id: 'ripening-myth',
      title: {
        ru: 'Миф о «созревании»',
        kk: '«Пісу» туралы миф',
        en: 'The “ripening” myth',
      },
      body: {
        ru: [
          'Представление о том, что катаракта должна «созреть», сложилось в то время, когда мутный хрусталик удаляли целиком через большой разрез. Тогда операцию действительно откладывали до тех пор, пока хрусталик не становился достаточно плотным. Современная факоэмульсификация устроена иначе: хрусталик разрушают ультразвуком и удаляют через микроразрез, поэтому ждать не нужно.',
          'Более того, долгое ожидание может навредить. Перезрелый хрусталик становится плотнее, и для его удаления требуется больше энергии ультразвука. Это увеличивает нагрузку на ткани глаза, повышает риск осложнений и может удлинить восстановление. Поэтому откладывать операцию «до созревания» при уже выраженных жалобах нет смысла.',
        ],
        kk: [
          'Катаракта «пісуі» керек деген түсінік бұлыңғыр бұршақты үлкен тілік арқылы толығымен алып тастайтын кезде қалыптасқан. Ол уақытта операцияны бұршақ жеткілікті тығыздалғанша шынымен кейінге қалдыратын. Заманауи факоэмульсификация басқаша жүргізіледі: бұршақ ультрадыбыспен ұсақталып, микротілік арқылы алынады, сондықтан күтудің қажеті жоқ.',
          'Оның үстіне, ұзақ күту зиян келтіруі мүмкін. Асқынған катарактада бұршақ тығыздала түседі, оны алу үшін ультрадыбыстың көбірек энергиясы қажет. Бұл көз тіндеріне түсетін жүктемені арттырып, асқыну қаупін жоғарылатады және қалпына келу мерзімін ұзартуы ықтимал. Сондықтан шағымдар айқын болса, операцияны «піскенше» кейінге қалдырудың мәні жоқ.',
        ],
        en: [
          'The idea that a cataract must “ripen” dates from the time when the cloudy lens was removed whole through a large incision. Back then, surgery really was postponed until the lens had become dense enough. Modern phacoemulsification works differently: the lens is broken up with ultrasound and removed through a micro-incision, so there is no need to wait.',
          'In fact, waiting too long can do harm. An overripe lens becomes denser and needs more ultrasound energy to remove. This increases the stress on the eye’s tissues, raises the risk of complications and may lengthen recovery. So once symptoms are clearly troublesome, there is no point in postponing surgery until the cataract “ripens”.',
        ],
      },
    },
    {
      id: 'when-to-operate',
      title: {
        ru: 'Что определяет срок операции',
        kk: 'Операция мерзімін не анықтайды',
        en: 'What sets the timing',
      },
      body: {
        ru: [
          'Решающим фактором служит не плотность помутнения, а то, как катаракта влияет на повседневную жизнь. Если человеку трудно читать, работать, водить машину или узнавать лица, а смена очков уже не помогает, операция обоснована. Окончательное решение принимается вместе с врачом с учётом состояния второго глаза, сетчатки и общего здоровья.',
        ],
        kk: [
          'Мұнда бұлыңғырлықтың тығыздығы емес, катарактаның күнделікті өмірге әсері шешуші рөл атқарады. Егер адамға кітап оқу, жұмыс істеу, көлік жүргізу немесе адамдарды тану қиынға соқса, ал көзілдірікті ауыстыру енді көмектеспесе, операция негізді. Түпкілікті шешім екінші көздің, тор қабықтың жағдайы мен жалпы денсаулықты ескере отырып, дәрігермен бірге қабылданады.',
        ],
        en: [
          'The deciding factor is not the density of the opacity but how the cataract affects everyday life. If reading, working, driving or recognising faces has become difficult and new glasses no longer help, surgery is justified. The final decision is made together with the doctor, taking into account the other eye, the retina and general health.',
        ],
      },
      list: {
        ru: [
          'Зрение мешает водить машину, особенно в темноте',
          'Трудно читать или работать даже в очках',
          'Появился страх падений из-за плохого зрения',
          'Врач видит признаки перезревания хрусталика',
        ],
        kk: [
          'Көру көлік жүргізуге, әсіресе қараңғыда, кедергі келтіреді',
          'Көзілдірікпен де кітап оқу немесе жұмыс істеу қиын',
          'Нашар көргендіктен құлап қалудан қорқу пайда болды',
          'Дәрігер бұршақтың асқыну белгілерін байқайды',
        ],
        en: [
          'Vision makes driving difficult, especially after dark',
          'Reading or working is hard even with glasses',
          'Poor vision has made you afraid of falling',
          'The doctor sees signs of an overripe lens',
        ],
      },
    },
    {
      id: 'lens-choice',
      title: {
        ru: 'Выбор интраокулярной линзы',
        kk: 'Көзішілік линзаны таңдау',
        en: 'Choosing the intraocular lens',
      },
      body: {
        ru: [
          'Вместо удалённого хрусталика в глаз устанавливают искусственную интраокулярную линзу. Её оптическую силу рассчитывают заранее по точным измерениям глаза: длине, кривизне роговицы и глубине передней камеры. От точности этих расчётов во многом зависит, насколько хорошо человек будет видеть после операции.',
          'Тип линзы подбирают с учётом образа жизни, профессии и ожиданий пациента. Врач объясняет преимущества и ограничения каждого варианта, в том числе то, понадобятся ли очки для чтения или для дали. Честный разговор об ожиданиях до операции помогает избежать разочарования после неё.',
        ],
        kk: [
          'Алынған бұршақтың орнына көзге жасанды көзішілік линза орнатылады. Оның оптикалық күші көздің дәл өлшемдері — ұзындығы, қасаң қабықтың қисықтығы және алдыңғы камераның тереңдігі бойынша алдын ала есептеледі. Операциядан кейін адамның қаншалықты жақсы көретіні көп жағдайда осы есептеулердің дәлдігіне байланысты.',
          'Линза түрі пациенттің өмір салтын, мамандығын және күтетін нәтижесін ескере отырып таңдалады. Дәрігер әр нұсқаның артықшылықтары мен шектеулерін, соның ішінде кітап оқуға немесе алысқа қарауға көзілдірік қажет болатын-болмайтынын түсіндіреді. Операцияға дейін күтілетін нәтиже туралы ашық әңгіме кейінгі көңіл қалудың алдын алады.',
        ],
        en: [
          'The removed lens is replaced with an artificial intraocular lens. Its optical power is calculated in advance from precise measurements of the eye: its length, the curvature of the cornea and the depth of the anterior chamber. How well a person sees after surgery depends to a large extent on the accuracy of these calculations.',
          'The lens type is chosen according to the patient’s lifestyle, occupation and expectations. The doctor explains the benefits and limitations of each option, including whether glasses may still be needed for reading or for distance. An honest conversation about expectations before surgery helps avoid disappointment afterwards.',
        ],
      },
      list: {
        ru: [
          'Монофокальная — чёткое зрение на одном расстоянии',
          'Торическая — дополнительно корригирует астигматизм',
          'Мультифокальная — зрение на разных расстояниях',
        ],
        kk: [
          'Монофокалды — бір қашықтықта анық көру',
          'Торикалық — астигматизмді қосымша түзетеді',
          'Мультифокалды — әртүрлі қашықтықта көру',
        ],
        en: [
          'Monofocal — sharp vision at one distance',
          'Toric — also corrects astigmatism',
          'Multifocal — vision at several distances',
        ],
      },
    },
    {
      id: 'at-the-centre',
      title: {
        ru: 'Как проходит подготовка в центре',
        kk: 'Орталықта дайындық қалай өтеді',
        en: 'Preparing for surgery at the centre',
      },
      body: {
        ru: [
          'Подготовка начинается с консультации и полного обследования: проверки зрения, измерения внутриглазного давления, биометрии для расчёта линзы и осмотра сетчатки с расширенным зрачком. Врач обсуждает с пациентом выбор линзы, объясняет ход операции и возможные риски, а также даёт рекомендации по обследованию у терапевта перед вмешательством.',
          'Операция обычно проходит под местной анестезией, после неё пациент в тот же день отправляется домой. Контрольные осмотры назначают в первые дни и недели. Если после операции появились сильная боль, нарастающее покраснение или резкое ухудшение зрения, нужно сразу связаться с клиникой. Все назначения после операции врач подробно объясняет и выдаёт в письменном виде.',
        ],
        kk: [
          'Дайындық кеңес пен толық тексеруден басталады: көруді тексеру, көзішілік қысымды өлшеу, линзаны есептеуге арналған биометрия және қарашықты кеңейтіп тор қабықты қарау. Дәрігер пациентпен линза таңдауын талқылап, операцияның барысы мен ықтимал қауіптерді түсіндіреді, сондай-ақ операция алдында терапевтке қаралу бойынша кеңес береді.',
          'Операция әдетте жергілікті жансыздандырумен жүргізіледі, одан кейін пациент сол күні үйіне қайтады. Бақылау қараулары алғашқы күндер мен апталарда тағайындалады. Операциядан кейін қатты ауырсыну, күшейіп бара жатқан қызару немесе көрудің күрт нашарлауы байқалса, клиникаға дереу хабарласу керек. Операциядан кейінгі барлық тағайындауларды дәрігер егжей-тегжейлі түсіндіріп, жазбаша түрде береді.',
        ],
        en: [
          'Preparation begins with a consultation and a full examination: a vision test, intraocular pressure measurement, biometry to calculate the lens and a dilated retinal examination. The doctor discusses the choice of lens, explains how the operation is done and what the risks are, and advises on a check-up with a general practitioner beforehand.',
          'The operation is usually performed under local anaesthesia, and the patient goes home the same day. Follow-up visits are scheduled over the first days and weeks. If severe pain, increasing redness or a sudden drop in vision develops after surgery, contact the clinic immediately. The doctor explains all post-operative instructions in detail and provides them in writing.',
        ],
      },
    },
  ],
  faq: [
    {
      q: {
        ru: 'Можно ли вылечить катаракту каплями?',
        kk: 'Катарактаны тамшымен емдеуге бола ма?',
        en: 'Can a cataract be treated with eye drops?',
      },
      a: {
        ru: 'Нет. Не существует капель или таблеток, которые вернули бы хрусталику прозрачность. На ранней стадии помогает смена очков и хорошее освещение, но единственный способ убрать помутнение — хирургическая замена хрусталика.',
        kk: 'Жоқ. Бұршақтың мөлдірлігін қайтаратын тамшы да, таблетка да жоқ. Бастапқы кезеңде көзілдірікті ауыстыру мен жақсы жарық көмектеседі, бірақ бұлыңғырлықты кетірудің жалғыз жолы — бұршақты хирургиялық жолмен ауыстыру.',
        en: 'No. There are no drops or tablets that can make a clouded lens clear again. In the early stages new glasses and good lighting help, but the only way to remove the opacity is surgical lens replacement.',
      },
    },
    {
      q: {
        ru: 'Может ли катаракта вернуться после операции?',
        kk: 'Операциядан кейін катаракта қайта пайда бола ма?',
        en: 'Can a cataract come back after surgery?',
      },
      a: {
        ru: 'Сама катаракта не возвращается, но через месяцы или годы может помутнеть задняя капсула, на которой держится линза. Это называется вторичной катарактой и устраняется быстрой амбулаторной лазерной процедурой.',
        kk: 'Катарактаның өзі қайталанбайды, бірақ бірнеше айдан немесе жылдан кейін линза бекітілген артқы капсула бұлыңғырлануы мүмкін. Мұны екіншілік катаракта деп атайды, ол амбулаториялық жағдайда жылдам лазерлік процедурамен жойылады.',
        en: 'The cataract itself does not return, but months or years later the back capsule that holds the lens may become cloudy. This is known as posterior capsule opacification and is treated with a quick outpatient laser procedure.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute — Cataracts',
      href: 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/cataracts',
    },
    {
      label: 'American Academy of Ophthalmology — What Are Cataracts?',
      href: 'https://www.aao.org/eye-health/diseases/what-are-cataracts',
    },
    {
      label: 'NICE — Cataracts in adults: management (NG77)',
      href: 'https://www.nice.org.uk/guidance/ng77',
    },
  ],
};

export default body;
