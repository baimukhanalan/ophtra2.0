import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/corneal-topography (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'test',
  lead: {
    ru: 'Бесконтактное исследование, которое строит подробную карту кривизны и формы роговицы.',
    kk: 'Қасаң қабықтың қисықтығы мен пішінінің толық картасын жасайтын жанасусыз зерттеу.',
    en: 'A non-contact test that builds a detailed map of the curvature and shape of the cornea.',
  },
  overview: {
    ru: [
      'Роговица — прозрачная передняя оболочка глаза, которая даёт большую часть его оптической силы. Кератотопограф проецирует на неё световой рисунок или сканирует её и по полученным данным строит цветные карты: где роговица круче, где более пологая, насколько она симметрична.',
      'Исследование необходимо перед лазерной коррекцией зрения и при подборе некоторых видов контактных линз, а также помогает выявлять кератоконус и другие изменения формы роговицы, в том числе на ранних стадиях.',
    ],
    kk: [
      'Қасаң қабық — көздің оптикалық күшінің басым бөлігін беретін мөлдір алдыңғы қабығы. Кератотопограф оған жарық өрнегін түсіреді немесе оны сканерлейді де, алынған деректер бойынша түрлі түсті карталар жасайды: қасаң қабық қай жерде тіктеу, қай жерде жайпақтау, қаншалықты симметриялы.',
      'Зерттеу көруді лазерлік түзету алдында және жанаспалы линзалардың кейбір түрлерін таңдағанда қажет, сондай-ақ кератоконусты және қасаң қабық пішінінің басқа өзгерістерін, соның ішінде ерте кезеңде анықтауға көмектеседі.',
    ],
    en: [
      'The cornea is the clear front window of the eye and provides most of its focusing power. The topographer projects a light pattern onto it or scans it, then builds colour maps showing where the cornea is steeper or flatter and how symmetrical it is.',
      'The test is essential before laser vision correction and when fitting some types of contact lenses. It also helps detect keratoconus and other changes in corneal shape, including early ones.',
    ],
  },
  indications: {
    ru: [
      'Подготовка к лазерной коррекции зрения',
      'Подозрение на кератоконус или наблюдение за ним',
      'Астигматизм, особенно высокий или неправильный',
      'Подбор жёстких, склеральных или ортокератологических линз',
      'Расчёт перед операцией по поводу катаракты и контроль после операций на роговице',
    ],
    kk: [
      'Көруді лазерлік түзетуге дайындық',
      'Кератоконусқа күдік немесе оны бақылау',
      'Астигматизм, әсіресе жоғары немесе бұрыс астигматизм',
      'Қатты, склералық немесе ортокератологиялық линзаларды таңдау',
      'Катаракта отасы алдындағы есептеу және қасаң қабыққа жасалған отадан кейінгі бақылау',
    ],
    en: [
      'Planning for laser vision correction',
      'Suspected keratoconus or monitoring of known keratoconus',
      'Astigmatism, especially high or irregular',
      'Fitting rigid, scleral or orthokeratology lenses',
      'Calculations before cataract surgery and follow-up after corneal surgery',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'По одному скану врач получает несколько карт и показателей.',
      kk: 'Бір сканерлеу бойынша дәрігер бірнеше карта мен көрсеткіш алады.',
      en: 'A single scan gives the doctor several maps and measurements.',
    },
    list: {
      ru: [
        'Карта кривизны передней поверхности роговицы',
        'Величина и ось роговичного астигматизма',
        'Индексы симметрии, помогающие заподозрить кератоконус',
        'При томографическом сканировании — толщина роговицы и задняя поверхность',
      ],
      kk: [
        'Қасаң қабықтың алдыңғы бетінің қисықтық картасы',
        'Қасаң қабық астигматизмінің шамасы мен осі',
        'Кератоконусқа күдіктенуге көмектесетін симметрия индекстері',
        'Томографиялық сканерлеуде — қасаң қабықтың қалыңдығы және артқы беті',
      ],
      en: [
        'Curvature map of the front corneal surface',
        'Amount and axis of corneal astigmatism',
        'Symmetry indices that can point to keratoconus',
        'With tomographic scanning — corneal thickness and back surface',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Карта роговицы помогает врачу выбрать безопасный и подходящий вариант коррекции. Окончательное решение принимается после полного обследования.',
      kk: 'Қасаң қабық картасы дәрігерге қауіпсіз әрі қолайлы түзету жолын таңдауға көмектеседі. Түпкілікті шешім толық тексеруден кейін қабылданады.',
      en: 'The corneal map helps the doctor choose a safe and suitable form of correction. The final decision is made after a full examination.',
    },
    list: {
      ru: [
        'Решение о пригодности к лазерной коррекции и выбор методики',
        'Кросслинкинг роговицы при прогрессирующем кератоконусе',
        'Подбор специальных контактных линз',
        'Выбор интраокулярной линзы, в том числе торической, при хирургии катаракты',
      ],
      kk: [
        'Лазерлік түзетуге жарамдылық туралы шешім және әдісті таңдау',
        'Үдемелі кератоконус кезінде қасаң қабықтың кросслинкингі',
        'Арнайы жанаспалы линзаларды таңдау',
        'Катаракта хирургиясында көз ішілік линзаны, соның ішінде торикалық линзаны таңдау',
      ],
      en: [
        'Deciding suitability for laser correction and choosing the technique',
        'Corneal cross-linking for progressive keratoconus',
        'Fitting specialist contact lenses',
        'Choosing the intraocular lens, including a toric lens, for cataract surgery',
      ],
    },
  },
  preparation: {
    ru: [
      'Контактные линзы меняют форму роговицы: мягкие обычно снимают за несколько дней, жёсткие — за более длительный срок; точный перерыв уточните при записи',
      'В день исследования не используйте декоративную косметику для глаз',
      'Если глаза сухие, сообщите врачу — иногда перед сканом закапывают увлажняющие капли',
    ],
    kk: [
      'Жанаспалы линзалар қасаң қабықтың пішінін өзгертеді: жұмсақ линзаларды әдетте бірнеше күн бұрын, қатты линзаларды ұзағырақ уақыт бұрын алады; нақты үзілісті жазылу кезінде анықтаңыз',
      'Зерттеу күні көзге сәндік косметика жақпаңыз',
      'Көзіңіз құрғаса, дәрігерге айтыңыз — кейде сканерлеу алдында ылғалдандыратын тамшы тамызады',
    ],
    en: [
      'Contact lenses change the shape of the cornea: soft lenses are usually left out for several days and rigid lenses for longer; check the exact break when booking',
      'Do not wear eye make-up on the day of the test',
      'Tell the doctor if your eyes are dry — lubricating drops are sometimes used before the scan',
    ],
  },
  result: {
    ru: 'Карты формируются сразу во время исследования. Врач оценивает их вместе с другими данными — рефракцией, толщиной роговицы, осмотром — и объясняет, что они означают для планируемой коррекции или лечения. Копию карт можно получить на руки.',
    kk: 'Карталар зерттеу барысында бірден жасалады. Дәрігер оларды басқа деректермен — рефракциямен, қасаң қабықтың қалыңдығымен, қараумен — бірге бағалап, жоспарланған түзету немесе ем үшін нені білдіретінін түсіндіреді. Карталардың көшірмесін алуға болады.',
    en: 'The maps are created during the test itself. The doctor reviews them together with other data — refraction, corneal thickness and the examination — and explains what they mean for any planned correction or treatment. You can take a copy of the maps with you.',
  },
  faq: [
    {
      q: {
        ru: 'Прибор касается глаза?',
        kk: 'Аспап көзге тие ме?',
        en: 'Does the device touch my eye?',
      },
      a: {
        ru: 'Нет. Вы смотрите на светящуюся мишень, а прибор делает снимок на расстоянии. Исследование занимает несколько минут и не вызывает неприятных ощущений.',
        kk: 'Жоқ. Сіз жарқыраған нысанаға қарайсыз, ал аспап қашықтан сурет түсіреді. Зерттеу бірнеше минутқа созылады және жайсыздық тудырмайды.',
        en: 'No. You look at a light target and the device takes images from a distance. It takes a few minutes and is not uncomfortable.',
      },
    },
    {
      q: {
        ru: 'Почему нужно заранее снять контактные линзы?',
        kk: 'Жанаспалы линзаны неге алдын ала алу керек?',
        en: 'Why do I need to stop wearing contact lenses beforehand?',
      },
      a: {
        ru: 'Линзы временно меняют форму роговицы, и карта может получиться неточной. Для планирования лазерной коррекции это особенно важно, поэтому иногда исследование повторяют после более длительного перерыва.',
        kk: 'Линзалар қасаң қабықтың пішінін уақытша өзгертеді, сондықтан карта дәл шықпауы мүмкін. Лазерлік түзетуді жоспарлау үшін бұл өте маңызды, сол себепті кейде зерттеуді ұзағырақ үзілістен кейін қайталайды.',
        en: 'Lenses temporarily change the shape of the cornea, so the map may be inaccurate. This matters most when planning laser correction, which is why the test is sometimes repeated after a longer break.',
      },
    },
    {
      q: {
        ru: 'Если найдут кератоконус, лазерная коррекция невозможна?',
        kk: 'Кератоконус анықталса, лазерлік түзету мүмкін емес пе?',
        en: 'If keratoconus is found, is laser correction ruled out?',
      },
      a: {
        ru: 'Стандартная лазерная коррекция при кератоконусе обычно не проводится, но существуют другие способы стабилизации и коррекции. Врач обсудит варианты с учётом ваших результатов.',
        kk: 'Кератоконус кезінде әдеттегі лазерлік түзету әдетте жасалмайды, бірақ тұрақтандыру мен түзетудің басқа жолдары бар. Дәрігер нәтижелеріңізді ескеріп, нұсқаларды талқылайды.',
        en: 'Standard laser correction is usually not performed with keratoconus, but there are other ways to stabilise and correct vision. The doctor will discuss the options based on your results.',
      },
    },
  ],
  sources: [
    {
      label: 'EyeWiki — Corneal topography',
      href: 'https://eyewiki.org/Corneal_Topography',
    },
  ],
  topics: ['рогов', 'кератокон', 'астигмат', 'лазерн', 'линз'],
};

export default content;
