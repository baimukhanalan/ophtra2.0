import type { KnowledgeArticleBody } from '../knowledge-types';

/**
 * Knowledge base — body of «Кератоконус: когда роговица меняет форму».
 * Loaded on demand by the article page; the listing only reads
 * knowledge-articles-index.ts.
 */
const body: KnowledgeArticleBody = {
  sections: [
    {
      id: 'what-is-keratoconus',
      title: {
        ru: 'Что такое кератоконус',
        kk: 'Кератоконус деген не',
        en: 'What keratoconus is',
      },
      body: {
        ru: [
          'Роговица — прозрачное «окно» на передней поверхности глаза, которое отвечает за большую часть его преломляющей силы. В норме она имеет ровную куполообразную форму. При кератоконусе роговица постепенно истончается и начинает выпячиваться вперёд, принимая форму конуса. Из-за этого лучи света фокусируются неравномерно, и изображение становится искажённым.',
          'Заболевание обычно начинается в подростковом или молодом возрасте и может прогрессировать несколько лет, чаще затрагивая оба глаза, но в разной степени. Точная причина до конца не известна: роль играют наследственность, особенности соединительной ткани и механическое воздействие, прежде всего привычка тереть глаза.',
        ],
        kk: [
          'Қасаң қабық — көздің алдыңғы бетіндегі мөлдір «терезе», көздің сындыру күшінің басым бөлігі осыған тиесілі. Қалыпты жағдайда оның пішіні тегіс күмбез тәрізді. Кератоконус кезінде қасаң қабық бірте-бірте жұқарып, алға қарай томпайып, конус пішініне ауысады. Соның салдарынан жарық сәулелері біркелкі фокусталмай, бейне бұрмаланады.',
          'Ауру әдетте жасөспірім не жас кезде басталып, бірнеше жыл бойы үдеуі мүмкін. Көбіне екі көзді де зақымдайды, бірақ әртүрлі дәрежеде. Нақты себебі толық анықталмаған: тұқым қуалаушылық, дәнекер тіннің ерекшеліктері және механикалық әсер, ең алдымен көзді уқалау әдеті маңызды рөл атқарады.',
        ],
        en: [
          'The cornea is the clear "window" at the front of the eye and provides most of its focusing power. Normally it has a smooth, dome-like shape. In keratoconus the cornea gradually thins and begins to bulge forward into a cone. Light is then focused unevenly, and the image becomes distorted.',
          'The condition usually starts in the teenage years or early adulthood and may progress for several years. It typically affects both eyes, though often to different degrees. The exact cause is not fully understood; inherited factors, the properties of connective tissue and mechanical stress, above all habitual eye rubbing, all appear to play a part.',
        ],
      },
    },
    {
      id: 'signs',
      title: {
        ru: 'Признаки, на которые стоит обратить внимание',
        kk: 'Назар аударатын белгілер',
        en: 'Signs worth noticing',
      },
      body: {
        ru: [
          'На ранних стадиях кератоконус легко принять за обычную близорукость или астигматизм. Человек подбирает очки, но через несколько месяцев они снова перестают подходить. Характерна именно нестабильность: рецепт меняется часто, а астигматизм нарастает и становится «неправильным», то есть плохо корригируется обычными линзами.',
        ],
        kk: [
          'Ерте кезеңдерде кератоконусты қарапайым жақыннан көргіштік не астигматизм деп қателесу оңай. Адам көзілдірік таңдайды, бірақ бірнеше айдан кейін ол қайтадан сәйкес келмей қалады. Тұрақсыздық тән белгі: рецепт жиі өзгереді, ал астигматизм күшейіп, «бұрыс» сипат алады, яғни кәдімгі линзалармен нашар түзетіледі.',
        ],
        en: [
          'In its early stages keratoconus is easily mistaken for ordinary short-sightedness or astigmatism. A person gets new glasses, only to find a few months later that they no longer help. Instability is the telling feature: the prescription changes often, and the astigmatism grows and becomes "irregular", meaning ordinary lenses correct it poorly.',
        ],
      },
      list: {
        ru: [
          'частая смена очков или контактных линз',
          'растущий астигматизм',
          'двоение или «ореолы» вокруг источников света',
          'повышенная чувствительность к яркому свету',
          'ухудшение зрения в сумерках',
        ],
        kk: [
          'көзілдірікті не жанаспалы линзаларды жиі ауыстыру',
          'үдей түскен астигматизм',
          'жарық көздерінің айналасында қосарлану не «шұғыла»',
          'жарқын жарыққа сезімталдықтың артуы',
          'ымыртта көрудің нашарлауы',
        ],
        en: [
          'frequent changes of glasses or contact lenses',
          'increasing astigmatism',
          'double images or halos around lights',
          'greater sensitivity to bright light',
          'poorer vision at dusk',
        ],
      },
    },
    {
      id: 'diagnosis',
      title: {
        ru: 'Топография и томография роговицы',
        kk: 'Қасаң қабықтың топографиясы мен томографиясы',
        en: 'Corneal topography and tomography',
      },
      body: {
        ru: [
          'Главный инструмент диагностики — карта роговицы. Топография показывает кривизну передней поверхности, а томография дополнительно оценивает заднюю поверхность и толщину роговицы в каждой точке. Именно эти исследования позволяют увидеть кератоконус раньше, чем он проявится заметным снижением зрения. Исследование занимает несколько минут, проводится бесконтактно и не вызывает неприятных ощущений.',
          'Повторные измерения через определённые промежутки времени показывают, стабильна роговица или болезнь прогрессирует. От этого напрямую зависит выбор лечения, поэтому врач сравнивает карты между визитами, а не опирается на одно обследование. Если вы носите контактные линзы, перед исследованием их, как правило, нужно какое-то время не надевать, потому что линзы временно меняют форму роговицы и могут исказить карту. Врач заранее подскажет, сколько дней обходиться без них.',
        ],
        kk: [
          'Диагностиканың басты құралы — қасаң қабықтың картасы. Топография алдыңғы беттің қисықтығын көрсетеді, ал томография қосымша артқы бетті және қасаң қабықтың әр нүктедегі қалыңдығын бағалайды. Дәл осы зерттеулер кератоконусты көру айтарлықтай нашарламай тұрып-ақ байқауға мүмкіндік береді. Зерттеу бірнеше минутқа созылады, көзге жанаспай жүргізіледі және жайсыздық тудырмайды.',
          'Белгілі бір уақыт аралығымен қайталанған өлшемдер қасаң қабықтың тұрақты екенін не аурудың үдеп жатқанын көрсетеді. Емді таңдау тікелей осыған байланысты, сондықтан дәрігер бір ғана тексеруге сүйенбей, келулер арасындағы карталарды салыстырады. Жанаспалы линзалар тақсаңыз, зерттеу алдында оларды біраз уақыт тақпау қажет, өйткені линзалар қасаң қабықтың пішінін уақытша өзгертіп, картаны бұрмалауы мүмкін. Оларсыз қанша күн жүру керегін дәрігер алдын ала айтады.',
        ],
        en: [
          'The key diagnostic tool is a map of the cornea. Topography shows the curvature of the front surface, while tomography also assesses the back surface and the thickness of the cornea at every point. These scans can reveal keratoconus before it causes a noticeable drop in vision. The scan takes a few minutes, involves no contact with the eye and is painless.',
          'Repeating the measurements at set intervals shows whether the cornea is stable or the condition is progressing. The choice of treatment depends directly on this, so the doctor compares maps across visits rather than relying on a single examination. If you wear contact lenses, you will usually need to leave them out for a while beforehand, because lenses temporarily change the shape of the cornea and can distort the map. Your doctor will tell you in advance how many days to go without them.',
        ],
      },
    },
    {
      id: 'treatment',
      title: {
        ru: 'Кросслинкинг, линзы и бережное отношение',
        kk: 'Кросслинкинг, линзалар және көзге ұқыпты қарау',
        en: 'Cross-linking, lenses and eye care',
      },
      body: {
        ru: [
          'Если заболевание прогрессирует, может быть рекомендован кросслинкинг роговицы. Во время процедуры роговицу насыщают рибофлавином и облучают ультрафиолетом определённой дозы. Это укрепляет связи между коллагеновыми волокнами и призвано замедлить или остановить дальнейшее выпячивание. Кросслинкинг не возвращает прежнюю форму роговицы, его задача — сохранить то, что есть.',
          'Для чёткого зрения при неправильном астигматизме часто подходят специальные контактные линзы: жёсткие газопроницаемые, склеральные и другие. Они создают ровную оптическую поверхность поверх роговицы. Отдельно важно перестать тереть глаза: механическое трение считается одним из факторов, способных ускорить прогрессирование. Если глаза часто чешутся, стоит обсудить с врачом лечение аллергии.',
        ],
        kk: [
          'Ауру үдеп бара жатса, қасаң қабықтың кросслинкингі ұсынылуы мүмкін. Процедура кезінде қасаң қабыққа рибофлавин сіңіріліп, белгілі мөлшердегі ультракүлгін сәулемен әсер етіледі. Бұл коллаген талшықтары арасындағы байланыстарды нығайтып, одан әрі томпаюды баяулатуға не тоқтатуға бағытталған. Кросслинкинг қасаң қабықтың бұрынғы пішінін қайтармайды, оның міндеті — барын сақтау.',
          'Бұрыс астигматизм кезінде анық көру үшін арнайы жанаспалы линзалар жиі сәйкес келеді: қатты газ өткізгіш, склералық және басқалары. Олар қасаң қабықтың үстінен тегіс оптикалық бет түзеді. Көзді уқаламау да ерекше маңызды: механикалық үйкеліс ауру үдеуін жеделдете алатын факторлардың бірі саналады. Көз жиі қышыса, аллергияны емдеу туралы дәрігермен ақылдасқан жөн.',
        ],
        en: [
          'If the condition is progressing, corneal cross-linking may be recommended. During the procedure the cornea is soaked with riboflavin and exposed to a measured dose of ultraviolet light. This strengthens the bonds between collagen fibres and aims to slow or stop further bulging. Cross-linking does not restore the original shape of the cornea; its purpose is to preserve what you have.',
          'For clear vision with irregular astigmatism, specialty contact lenses often work well, including rigid gas-permeable and scleral designs. They create a smooth optical surface over the cornea. Stopping eye rubbing matters too: mechanical friction is considered one of the factors that can speed up progression. If your eyes often itch, it is worth discussing allergy treatment with your doctor.',
        ],
      },
      list: {
        ru: [
          'не тереть глаза, даже при зуде',
          'лечить аллергию, которая провоцирует трение',
          'проходить контрольную топографию в назначенные сроки',
          'не менять линзы и очки без осмотра',
        ],
        kk: [
          'қышыса да көзді уқаламау',
          'уқалауға итермелейтін аллергияны емдеу',
          'бақылау топографиясын белгіленген мерзімде өту',
          'линзалар мен көзілдірікті тексерусіз ауыстырмау',
        ],
        en: [
          'avoid rubbing your eyes, even when they itch',
          'treat allergies that trigger rubbing',
          'keep to the scheduled follow-up topography',
          'do not change lenses or glasses without an examination',
        ],
      },
    },
    {
      id: 'lasik-and-visit',
      title: {
        ru: 'Почему это важно перед лазерной коррекцией',
        kk: 'Лазерлік түзету алдында неге маңызды',
        en: 'Why it matters before laser correction',
      },
      body: {
        ru: [
          'Лазерная коррекция зрения, например LASIK, изменяет форму роговицы и делает её тоньше. Если роговица изначально ослаблена, такое вмешательство может ускорить кератоконус. Поэтому признаки заболевания, даже скрытые, обычно становятся противопоказанием к подобным операциям, и карта роговицы — обязательная часть подготовки. При этом для многих людей с кератоконусом существуют другие способы добиться хорошего зрения.',
          'На приёме в центре врач проверит остроту зрения и рефракцию, выполнит топографию и томографию роговицы и при необходимости сравнит результаты с прежними. После этого он объяснит, есть ли признаки кератоконуса, нужна ли стабилизация и какой способ коррекции зрения подходит именно вам. Решение всегда принимается совместно, после того как вы получите ответы на свои вопросы.',
        ],
        kk: [
          'Көруді лазермен түзету, мысалы LASIK, қасаң қабықтың пішінін өзгертіп, оны жұқартады. Егер қасаң қабық бастапқыда әлсіз болса, мұндай араласу кератоконусты жеделдетуі мүмкін. Сондықтан аурудың белгілері, тіпті жасырын болса да, әдетте мұндай отаға қарсы көрсетілім болып табылады, ал қасаң қабық картасы дайындықтың міндетті бөлігі. Алайда кератоконусы бар көптеген адамдар үшін жақсы көруге жетудің басқа жолдары бар.',
          'Орталықтағы қабылдауда дәрігер көру өткірлігі мен рефракцияны тексеріп, қасаң қабықтың топографиясы мен томографиясын жасайды және қажет болса, нәтижелерді бұрынғылармен салыстырады. Содан кейін кератоконус белгілерінің бар-жоғын, тұрақтандыру қажеттігін және көруді түзетудің қай тәсілі сізге сай келетінін түсіндіреді. Шешім әрқашан сіз сұрақтарыңызға жауап алғаннан кейін бірлесіп қабылданады.',
        ],
        en: [
          'Laser vision correction such as LASIK reshapes the cornea and makes it thinner. If the cornea is already weakened, the procedure could accelerate keratoconus. Signs of the condition, even subtle ones, are therefore usually a reason not to proceed with such surgery, and a corneal map is an essential part of the assessment. Many people with keratoconus still have other ways to achieve good vision.',
          'At the centre, the doctor will check your visual acuity and refraction, perform corneal topography and tomography, and compare the results with earlier ones where available. They will then explain whether there are signs of keratoconus, whether stabilisation is needed and which form of vision correction suits you. Decisions are always made together, once your questions have been answered.',
        ],
      },
    },
  ],
  faq: [
    {
      q: {
        ru: 'Можно ли вылечить кератоконус полностью?',
        kk: 'Кератоконусты толық емдеуге бола ма?',
        en: 'Can keratoconus be cured completely?',
      },
      a: {
        ru: 'Вернуть роговице исходную форму обычно нельзя, но прогрессирование часто удаётся замедлить или остановить с помощью кросслинкинга, а хорошее зрение обеспечить подходящими линзами. Чем раньше заболевание выявлено, тем больше возможностей сохранить зрение.',
        kk: 'Қасаң қабыққа бастапқы пішінін қайтару әдетте мүмкін емес, бірақ кросслинкинг арқылы үдеуді баяулатуға не тоқтатуға, ал сәйкес линзалармен жақсы көруді қамтамасыз етуге жиі болады. Ауру неғұрлым ерте анықталса, көруді сақтау мүмкіндігі соғұрлым көп.',
        en: 'Restoring the cornea to its original shape is usually not possible, but progression can often be slowed or stopped with cross-linking, and good vision can be provided with suitable lenses. The earlier the condition is found, the more options there are to protect sight.',
      },
    },
    {
      q: {
        ru: 'Нужно ли проверять родственников?',
        kk: 'Туыстарды тексеру керек пе?',
        en: 'Should family members be checked?',
      },
      a: {
        ru: 'Кератоконус иногда встречается у нескольких членов семьи. Если диагноз поставлен вам, разумно, чтобы братья, сёстры и дети, особенно подростки, прошли осмотр с топографией роговицы, даже если они не замечают проблем со зрением.',
        kk: 'Кератоконус кейде бір отбасының бірнеше мүшесінде кездеседі. Егер сізге диагноз қойылса, бауырларыңыз бен балаларыңыздың, әсіресе жасөспірімдердің, көру мәселесін байқамаса да, қасаң қабық топографиясымен тексерілгені жөн.',
        en: 'Keratoconus sometimes runs in families. If you have been diagnosed, it is sensible for siblings and children, especially teenagers, to have an examination with corneal topography, even if they have not noticed any problems with their vision.',
      },
    },
  ],
  sources: [
    {
      label: 'American Academy of Ophthalmology — What Is Keratoconus?',
      href: 'https://www.aao.org/eye-health/diseases/what-is-keratoconus',
    },
    {
      label: 'EyeWiki (American Academy of Ophthalmology) — Keratoconus',
      href: 'https://eyewiki.aao.org/Keratoconus',
    },
  ],
};

export default body;
