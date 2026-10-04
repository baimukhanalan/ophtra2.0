import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/yag-capsulotomy (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'surgery',
  lead: {
    ru: 'YAG-лазерная капсулотомия — быстрая безболезненная процедура, которая устраняет помутнение задней капсулы хрусталика (вторичную катаракту) после операции по поводу катаракты.',
    kk: 'YAG-лазерлік капсулотомия — катаракта операциясынан кейін көз бұршағының артқы капсуласының бұлыңғырлануын (екіншілік катарактаны) жоятын жылдам әрі ауыртпайтын процедура.',
    en: 'YAG laser capsulotomy is a quick, painless procedure that clears clouding of the posterior lens capsule (secondary cataract) after cataract surgery.',
  },
  overview: {
    ru: [
      'Во время операции по поводу катаракты искусственную линзу помещают в тонкую прозрачную капсулу собственного хрусталика. Со временем задняя стенка этой капсулы у части пациентов мутнеет, и зрение снова становится затуманенным, появляются блики — как будто катаракта вернулась.',
      'YAG-лазер создаёт небольшое отверстие в центре мутной капсулы, открывая свету путь к сетчатке. Разрезов нет, процедура проходит амбулаторно, после закапывания капель, и занимает несколько минут. Помутнение после этого обычно не возвращается. Перед лечением врач убеждается, что снижение зрения связано именно с капсулой, а не с другими причинами.',
    ],
    kk: [
      'Катаракта операциясы кезінде жасанды линза өз көз бұршағының жұқа мөлдір капсуласына орналастырылады. Уақыт өте келе кейбір пациенттерде осы капсуланың артқы қабырғасы бұлыңғырланып, көру қайтадан тұманданады, жылтыр пайда болады — катаракта қайта оралғандай сезіледі.',
      'YAG-лазер бұлыңғыр капсуланың ортасынан шағын тесік жасап, жарықтың торқабыққа өтетін жолын ашады. Кесік жасалмайды, процедура тамшы тамызылғаннан кейін амбулаториялық түрде өтеді және бірнеше минутқа созылады. Осыдан кейін бұлыңғырлану әдетте қайталанбайды. Емдеу алдында дәрігер көрудің нашарлауы басқа себептерге емес, дәл капсулаға байланысты екеніне көз жеткізеді.',
    ],
    en: [
      'During cataract surgery the artificial lens is placed inside the thin, clear capsule of the natural lens. Over time, in some people, the back wall of this capsule becomes cloudy, and vision turns hazy again with glare — as if the cataract had returned.',
      'The YAG laser makes a small opening in the centre of the cloudy capsule, clearing the path for light to reach the retina. There are no incisions; the procedure is done as an outpatient after eye drops and takes a few minutes. The clouding usually does not come back. Before treatment the doctor makes sure the loss of vision is due to the capsule and not to other causes.',
    ],
  },
  indications: {
    ru: [
      'Постепенное затуманивание зрения спустя месяцы или годы после операции по поводу катаракты',
      'Усиление бликов и ослепления от яркого света',
      'Снижение контрастности и трудности при чтении или вождении',
      'Помутнение задней капсулы, подтверждённое при осмотре',
      'Помутнение, мешающее врачу осматривать сетчатку',
    ],
    kk: [
      'Катаракта операциясынан бірнеше ай немесе жыл өткен соң көрудің бірте-бірте тұмандануы',
      'Жылтырдың және жарқыраған жарықтан көз қарығуының күшеюі',
      'Контрасттың төмендеуі, оқу немесе көлік жүргізу кезіндегі қиындықтар',
      'Тексеру кезінде расталған артқы капсуланың бұлыңғырлануы',
      'Дәрігердің торқабықты қарауына кедергі келтіретін бұлыңғырлану',
    ],
    en: [
      'Gradually hazy vision months or years after cataract surgery',
      'Increasing glare and dazzle from bright light',
      'Reduced contrast and difficulty reading or driving',
      'Posterior capsule opacification confirmed on examination',
      'Clouding that prevents the doctor from examining the retina',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Перед лазером врач оценивает, насколько помутнение капсулы объясняет ваши жалобы, и проверяет другие структуры глаза.',
      kk: 'Лазер алдында дәрігер капсула бұлыңғырлануының сіздің шағымдарыңызды қаншалықты түсіндіретінін бағалап, көздің басқа құрылымдарын тексереді.',
      en: 'Before the laser, the doctor assesses how far the capsule clouding explains your symptoms and checks the other structures of the eye.',
    },
    list: {
      ru: [
        'Проверка остроты зрения и рефракции',
        'Биомикроскопия с расширенным зрачком — оценка капсулы и положения линзы',
        'Измерение внутриглазного давления',
        'Осмотр глазного дна и, при необходимости, ОКТ сетчатки',
      ],
      kk: [
        'Көру өткірлігі мен рефракцияны тексеру',
        'Қарашықты кеңейтіп биомикроскопия — капсула мен линзаның орналасуын бағалау',
        'Көзішілік қысымды өлшеу',
        'Көз түбін қарау және қажет болса торқабықтың ОКТ-сы',
      ],
      en: [
        'Visual acuity and refraction testing',
        'Dilated slit-lamp examination — assessing the capsule and lens position',
        'Eye pressure measurement',
        'Retinal examination and, if needed, retinal OCT',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Помутнение задней капсулы не проходит само и не лечится каплями или очками. Основной способ — лазерная капсулотомия; решение о времени её проведения зависит от того, насколько помутнение мешает зрению.',
      kk: 'Артқы капсуланың бұлыңғырлануы өздігінен кетпейді және тамшымен немесе көзілдірікпен емделмейді. Негізгі тәсіл — лазерлік капсулотомия; оны қашан жүргізу туралы шешім бұлыңғырланудың көруге қаншалықты кедергі келтіретініне байланысты.',
      en: 'Posterior capsule clouding does not clear on its own and cannot be treated with drops or glasses. The main treatment is laser capsulotomy; when to do it depends on how much the clouding affects your vision.',
    },
    list: {
      ru: [
        'YAG-лазерная капсулотомия — стандартное амбулаторное лечение',
        'Наблюдение — если помутнение лёгкое и зрение пока не страдает',
        'Капли для контроля давления и воспаления после процедуры — по назначению врача',
        'Хирургическое вскрытие капсулы — в редких случаях, когда лазер неприменим',
      ],
      kk: [
        'YAG-лазерлік капсулотомия — стандартты амбулаториялық ем',
        'Бақылау — бұлыңғырлану жеңіл болып, көру әзірге зардап шекпесе',
        'Процедурадан кейін қысым мен қабынуды бақылауға арналған тамшылар — дәрігердің тағайындауы бойынша',
        'Капсуланы хирургиялық жолмен ашу — лазер қолдануға болмайтын сирек жағдайларда',
      ],
      en: [
        'YAG laser capsulotomy — the standard outpatient treatment',
        'Monitoring — if the clouding is mild and vision is not yet affected',
        'Drops to control pressure and inflammation after the procedure — as prescribed',
        'Surgical opening of the capsule — in rare cases when the laser cannot be used',
      ],
    },
  },
  preparation: {
    ru: [
      'Возьмите с собой список лекарств и, если есть, выписку об операции по поводу катаракты',
      'Зрачок расширят каплями, поэтому несколько часов зрение будет нечётким — не планируйте вождение',
      'Приходите с сопровождающим, если это возможно',
      'Возьмите солнцезащитные очки',
    ],
    kk: [
      'Өзіңізбен бірге дәрі-дәрмектер тізімін және бар болса, катаракта операциясы туралы көшірмені алыңыз',
      'Қарашық тамшымен кеңейтіледі, сондықтан бірнеше сағат бойы көру анық болмайды — көлік жүргізуді жоспарламаңыз',
      'Мүмкін болса, еріп жүретін адаммен келіңіз',
      'Күннен қорғайтын көзілдірік алыңыз',
    ],
    en: [
      'Bring a list of your medicines and, if available, the discharge summary from your cataract surgery',
      'Your pupil will be dilated with drops, so vision will be blurred for a few hours — do not plan to drive',
      'Come with a companion if you can',
      'Bring sunglasses',
    ],
  },
  result: {
    ru: 'Зрение обычно проясняется в течение нескольких часов или дней. Временно могут появиться плавающие точки («мушки») — они, как правило, уменьшаются. Через короткое время после процедуры может быть проверено внутриглазное давление; контрольный осмотр назначает врач. Редкие осложнения включают повышение давления и отслойку сетчатки, поэтому при внезапном появлении множества «мушек», вспышек или завесы перед глазом нужно срочно обратиться к врачу. Итоговое зрение зависит и от состояния сетчатки, поэтому определённую остроту гарантировать нельзя.',
    kk: 'Көру әдетте бірнеше сағат немесе күн ішінде айқындалады. Уақытша қалқыған нүктелер («шыбындар») пайда болуы мүмкін — әдетте олар азаяды. Процедурадан кейін көп ұзамай көзішілік қысым тексерілуі мүмкін; бақылау тексеруін дәрігер тағайындайды. Сирек асқынуларға қысымның жоғарылауы мен торқабықтың ажырауы жатады, сондықтан көз алдында кенеттен көптеген «шыбындар», жарқылдар немесе перде пайда болса, дереу дәрігерге жүгіну қажет. Соңғы көру торқабықтың жағдайына да байланысты, сондықтан белгілі бір өткірлікке кепілдік беру мүмкін емес.',
    en: 'Vision usually clears within a few hours to days. Floaters may appear for a while and generally fade. Eye pressure may be checked shortly after the procedure, and your doctor will arrange a follow-up visit. Rare complications include raised pressure and retinal detachment, so if you suddenly notice many new floaters, flashes or a shadow over your vision, seek urgent care. Final vision also depends on the retina, so no specific level can be guaranteed.',
  },
  faq: [
    {
      q: {
        ru: 'Это значит, что операция по поводу катаракты прошла неудачно?',
        kk: 'Бұл катаракта операциясы сәтсіз өтті дегенді білдіре ме?',
        en: 'Does this mean my cataract surgery went wrong?',
      },
      a: {
        ru: 'Нет. Помутнение задней капсулы — частое и ожидаемое явление после удаления катаракты, оно связано с естественной реакцией клеток капсулы, а не с ошибкой при операции.',
        kk: 'Жоқ. Артқы капсуланың бұлыңғырлануы — катарактаны алғаннан кейін жиі кездесетін әрі күтілетін құбылыс, ол операциядағы қателікпен емес, капсула жасушаларының табиғи реакциясымен байланысты.',
        en: 'No. Posterior capsule clouding is a common and expected occurrence after cataract removal. It reflects a natural response of the capsule cells, not a mistake during surgery.',
      },
    },
    {
      q: {
        ru: 'Больно ли во время процедуры?',
        kk: 'Процедура кезінде ауырта ма?',
        en: 'Is the procedure painful?',
      },
      a: {
        ru: 'Нет. Глаз обезболивают каплями, и пациент обычно ощущает лишь лёгкие щелчки. Процедура занимает несколько минут.',
        kk: 'Жоқ. Көз тамшымен жансыздандырылады, пациент әдетте тек жеңіл шертулерді сезеді. Процедура бірнеше минутқа созылады.',
        en: 'No. The eye is numbed with drops and most people feel only light clicks. The procedure takes a few minutes.',
      },
    },
    {
      q: {
        ru: 'Может ли помутнение появиться снова?',
        kk: 'Бұлыңғырлану қайта пайда болуы мүмкін бе?',
        en: 'Can the clouding come back?',
      },
      a: {
        ru: 'После создания отверстия в капсуле помутнение в этой зоне, как правило, не возвращается, и повторная процедура обычно не требуется.',
        kk: 'Капсулада тесік жасалғаннан кейін бұл аймақта бұлыңғырлану әдетте қайталанбайды, қайта процедура әдетте қажет болмайды.',
        en: 'Once the opening has been made, clouding in that area generally does not return, and a repeat procedure is usually not needed.',
      },
    },
  ],
  sources: [
    {
      label: 'EyeWiki (AAO) — Posterior Capsule Opacification',
      href: 'https://eyewiki.org/Posterior_Capsule_Opacification',
    },
  ],
  topics: ['катаракт', 'капсул', 'хрусталик', 'вторичн', 'лазер'],
};

export default content;
