import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/dry-eye (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'therapy',
  lead: {
    ru: 'Выясняем, почему глаза пересыхают, и подбираем поэтапное лечение, чтобы уменьшить дискомфорт и сделать зрение более стабильным в течение дня.',
    kk: 'Көздің неліктен құрғайтынын анықтап, ыңғайсыздықты азайту және күні бойы көруді тұрақтырақ ету үшін кезең-кезеңімен ем таңдаймыз.',
    en: 'We find out why your eyes are drying out and build a step-by-step plan to ease discomfort and keep vision steadier through the day.',
  },
  overview: {
    ru: [
      'Синдром сухого глаза возникает, когда слёзы не увлажняют поверхность глаза достаточно или слишком быстро испаряются. Он проявляется жжением, ощущением песка, покраснением, колебаниями чёткости зрения, а иногда, парадоксально, слезотечением. Частые причины — дисфункция мейбомиевых желёз, длительная работа за экраном, сухой воздух, контактные линзы, возрастные и гормональные изменения, некоторые лекарства.',
      'Это обычно хроническое состояние, которое хорошо поддаётся контролю, но редко проходит само. Лечение подбирается по типу и тяжести нарушения и, как правило, сочетает несколько мер: от ухода за веками и изменения привычек до противовоспалительной терапии.',
    ],
    kk: [
      'Құрғақ көз синдромы көз жасы көз бетін жеткілікті ылғалдандырмағанда немесе тым тез буланғанда пайда болады. Ол ашыту, көзге құм түскендей сезім, қызару, көрудің анықтығының ауытқуы, кейде, керісінше, көзден жас ағуы түрінде байқалады. Жиі себептері — мейбомий бездерінің дисфункциясы, экран алдында ұзақ жұмыс, құрғақ ауа, линзалар, жасқа және гормонға байланысты өзгерістер, кейбір дәрілер.',
      'Бұл әдетте жақсы бақыланатын, бірақ өздігінен сирек кететін созылмалы жағдай. Ем бұзылыстың түрі мен ауырлығына қарай таңдалады және, әдетте, бірнеше шараны біріктіреді: қабақ күтімі мен әдеттерді өзгертуден бастап қабынуға қарсы емге дейін.',
    ],
    en: [
      'Dry eye occurs when tears do not keep the surface of the eye moist enough or evaporate too quickly. It can cause burning, a gritty feeling, redness, fluctuating vision and sometimes, surprisingly, watery eyes. Common causes include meibomian gland dysfunction, long screen time, dry air, contact lenses, age-related and hormonal changes, and some medicines.',
      'It is usually a long-term condition that can be managed well but rarely resolves on its own. Treatment is matched to the type and severity of the problem and usually combines several measures, from eyelid care and changes in daily habits to anti-inflammatory therapy.',
    ],
  },
  indications: {
    ru: [
      'Жжение, резь, ощущение песка или инородного тела в глазах',
      'Покраснение и усталость глаз к концу дня или после работы за экраном',
      'Затуманивание зрения, которое проходит после моргания',
      'Непереносимость контактных линз',
      'Подготовка к рефракционной операции или операции по поводу катаракты',
      'Хронический блефарит, розацеа, аутоиммунные заболевания',
    ],
    kk: [
      'Көздің ашуы, шаншуы, көзге құм немесе бөгде зат түскендей сезім',
      'Күннің соңында немесе экран алдындағы жұмыстан кейін көздің қызаруы мен шаршауы',
      'Көзді жыпылықтатқаннан кейін басылатын көрудің бұлдырауы',
      'Байланыс линзаларын көтере алмау',
      'Рефракциялық операцияға немесе катаракта операциясына дайындық',
      'Созылмалы блефарит, розацеа, аутоиммундық аурулар',
    ],
    en: [
      'Burning, stinging, or a gritty or foreign-body sensation',
      'Red, tired eyes by the end of the day or after screen work',
      'Blurred vision that clears when you blink',
      'Contact lens intolerance',
      'Preparation for refractive or cataract surgery',
      'Chronic blepharitis, rosacea or autoimmune conditions',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Чтобы подобрать лечение, важно понять, чего не хватает — количества слёзы или её качества, и есть ли воспаление век.',
      kk: 'Емді таңдау үшін неге жетіспейтінін — көз жасының мөлшері ме, әлде сапасы ма, және қабақтың қабынуы бар-жоғын түсіну маңызды.',
      en: 'To choose treatment, it is important to understand what is lacking, the amount of tears or their quality, and whether the eyelids are inflamed.',
    },
    list: {
      ru: [
        'Опрос о симптомах и факторах риска, анкета оценки дискомфорта',
        'Биомикроскопия век, края век и поверхности глаза',
        'Время разрыва слёзной плёнки и окрашивание поверхности глаза',
        'Тест Ширмера — оценка выработки слёзы',
        'Оценка состояния мейбомиевых желёз',
      ],
      kk: [
        'Белгілер мен қауіп факторлары туралы сұрау, ыңғайсыздықты бағалау сауалнамасы',
        'Қабақтың, қабақ жиегінің және көз бетінің биомикроскопиясы',
        'Жас қабықшасының жыртылу уақыты және көз бетін бояу',
        'Ширмер тесті — көз жасының бөлінуін бағалау',
        'Мейбомий бездерінің жағдайын бағалау',
      ],
      en: [
        'Discussion of symptoms and risk factors, with a symptom questionnaire',
        'Slit-lamp examination of the eyelids, lid margins and eye surface',
        'Tear break-up time and surface staining',
        'Schirmer test to assess tear production',
        'Assessment of the meibomian glands',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Обычно лечение начинают с простых мер и при необходимости постепенно добавляют следующие шаги. План пересматривается на контрольных визитах.',
      kk: 'Әдетте ем қарапайым шаралардан басталып, қажет болса келесі қадамдар біртіндеп қосылады. Жоспар бақылау сапарларында қайта қаралады.',
      en: 'Treatment usually starts with simple measures, adding further steps gradually if needed. The plan is reviewed at follow-up visits.',
    },
    list: {
      ru: [
        'Слёзозаменители — предпочтительно без консервантов при частом применении; врач подберёт тип (капли, гель, мазь на ночь)',
        'Гигиена век: тёплые компрессы, массаж и очищение края век — особенно при дисфункции мейбомиевых желёз',
        'Изменение привычек: перерывы при работе за экраном, увлажнение воздуха, защита от ветра и кондиционера',
        'Противовоспалительная терапия по назначению врача — например, короткие курсы капель или препараты, уменьшающие воспаление поверхности глаза',
        'Окклюзия слёзных точек (пробки) — чтобы собственная слеза дольше оставалась на поверхности глаза',
      ],
      kk: [
        'Көз жасын алмастырғыштар — жиі қолданғанда консервантсыз түрі жөн; дәрігер түрін таңдайды (тамшы, гель, түнге арналған жақпа май)',
        'Қабақ гигиенасы: жылы компресс, массаж және қабақ жиегін тазалау — әсіресе мейбомий бездерінің дисфункциясында',
        'Әдеттерді өзгерту: экран алдында жұмыс кезінде үзіліс жасау, ауаны ылғалдандыру, желден және кондиционерден қорғану',
        'Дәрігер тағайындаған қабынуға қарсы ем — мысалы, тамшылардың қысқа курстары немесе көз бетінің қабынуын азайтатын препараттар',
        'Жас нүктелерін жабу (тығындар) — өз көз жасыңыз көз бетінде ұзағырақ сақталуы үшін',
      ],
      en: [
        'Artificial tears, preferably preservative-free if used often; the doctor will suggest the right type (drops, gel or night-time ointment)',
        'Eyelid hygiene: warm compresses, lid massage and cleaning of the lid margins, especially for meibomian gland dysfunction',
        'Habit changes: screen breaks, humidifying the air, protection from wind and air conditioning',
        'Anti-inflammatory treatment prescribed by the doctor, such as short courses of drops or medicines that reduce surface inflammation',
        'Punctal plugs, which help your own tears stay on the eye surface longer',
      ],
    },
  },
  preparation: {
    ru: [
      'В день визита не наносите макияж на глаза',
      'Не закапывайте увлажняющие капли за 2 часа до приёма, если врач не сказал иначе',
      'Если носите контактные линзы, уточните при записи, нужно ли снять их заранее',
      'Составьте список лекарств, которые вы принимаете, включая общие',
    ],
    kk: [
      'Сапар күні көзге макияж жасамаңыз',
      'Дәрігер басқаша айтпаса, қабылдаудан 2 сағат бұрын ылғалдандыратын тамшыларды тамызбаңыз',
      'Байланыс линзаларын тағатын болсаңыз, оларды алдын ала шешу керек пе екенін жазылу кезінде нақтылаңыз',
      'Қабылдайтын дәрілеріңіздің, соның ішінде жалпы дәрілердің тізімін жасаңыз',
    ],
    en: [
      'Do not wear eye make-up on the day of the visit',
      'Avoid lubricating drops for 2 hours before the appointment unless told otherwise',
      'If you wear contact lenses, ask when booking whether to remove them in advance',
      'Make a list of the medicines you take, including general ones',
    ],
  },
  result: {
    ru: 'Большинство пациентов замечают облегчение через несколько недель регулярного лечения, но скорость и степень улучшения индивидуальны. Сухой глаз обычно требует постоянного ухода, а не разового курса: поддерживающие меры стоит продолжать и после того, как симптомы ослабнут. Контрольный визит помогает оценить эффект и при необходимости изменить план. Если появились сильная боль, выраженное покраснение, светобоязнь или снижение зрения, обратитесь к врачу без промедления.',
    kk: 'Пациенттердің көбі тұрақты емнің бірнеше аптасынан кейін жеңілдік сезеді, бірақ жақсарудың жылдамдығы мен дәрежесі әркімде әртүрлі. Құрғақ көз әдетте бір реттік курсты емес, тұрақты күтімді қажет етеді: белгілер басылғаннан кейін де қолдаушы шараларды жалғастырған жөн. Бақылау сапары нәтижені бағалауға және қажет болса жоспарды өзгертуге көмектеседі. Қатты ауырсыну, айқын қызару, жарықтан қорқу немесе көрудің нашарлауы пайда болса, дәрігерге кідірмей жүгініңіз.',
    en: 'Most people notice relief after a few weeks of regular treatment, though how quickly and how much things improve varies. Dry eye usually needs ongoing care rather than a single course, so it is worth continuing maintenance measures even once symptoms ease. A follow-up visit helps assess the effect and adjust the plan if needed. If you develop severe pain, marked redness, sensitivity to light or reduced vision, see a doctor promptly.',
  },
  faq: [
    {
      q: {
        ru: 'Почему глаза слезятся, если у меня «сухой глаз»?',
        kk: 'Менде «құрғақ көз» болса, көзім неге жасаурайды?',
        en: 'Why do my eyes water if I have dry eye?',
      },
      a: {
        ru: 'Раздражённая сухая поверхность глаза может вызывать рефлекторное слезотечение. Такая слеза в основном водянистая, быстро стекает и плохо увлажняет, поэтому дискомфорт сохраняется.',
        kk: 'Тітіркенген құрғақ көз беті рефлекторлық жас ағуын тудыруы мүмкін. Мұндай көз жасы негізінен сулы болады, тез ағып кетеді және нашар ылғалдандырады, сондықтан ыңғайсыздық сақталады.',
        en: 'An irritated, dry eye surface can trigger reflex watering. These tears are mostly watery, drain away quickly and do not moisturise well, so the discomfort continues.',
      },
    },
    {
      q: {
        ru: 'Можно ли пользоваться увлажняющими каплями постоянно?',
        kk: 'Ылғалдандыратын тамшыларды үнемі қолдануға бола ма?',
        en: 'Can I use lubricating drops all the time?',
      },
      a: {
        ru: 'Слёзозаменители обычно безопасны для длительного применения. Если закапывать их нужно часто, предпочтительны формы без консервантов. Капли «от покраснения» с сосудосуживающим эффектом для постоянного использования не подходят — уточните у врача, что вам подходит.',
        kk: 'Көз жасын алмастырғыштар әдетте ұзақ қолдануға қауіпсіз. Оларды жиі тамызу керек болса, консервантсыз түрлері жөн. Тамырды тарылтатын «қызаруға қарсы» тамшылар үнемі қолдануға жарамайды — өзіңізге не сәйкес келетінін дәрігерден нақтылаңыз.',
        en: 'Artificial tears are generally safe for long-term use. If you need them often, preservative-free versions are preferable. Redness-relief drops that constrict blood vessels are not suitable for regular use, so ask your doctor which product suits you.',
      },
    },
    {
      q: {
        ru: 'Можно ли носить контактные линзы при сухом глазе?',
        kk: 'Құрғақ көз кезінде байланыс линзаларын тағуға бола ма?',
        en: 'Can I wear contact lenses with dry eye?',
      },
      a: {
        ru: 'Часто да, но может понадобиться сменить тип линз, сократить время ношения или добавить совместимые с линзами капли. Врач оценит состояние поверхности глаза и подскажет безопасный режим.',
        kk: 'Көбіне болады, бірақ линза түрін ауыстыру, тағу уақытын қысқарту немесе линзамен үйлесімді тамшыларды қосу қажет болуы мүмкін. Дәрігер көз бетінің жағдайын бағалап, қауіпсіз режимді ұсынады.',
        en: 'Often yes, but you may need a different lens type, shorter wearing time or lens-compatible drops. The doctor will assess the eye surface and advise on a safe routine.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Dry Eye',
      href: 'https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/dry-eye',
    },
    {
      label: 'TFOS DEWS II Report',
      href: 'https://www.tfosdewsreport.org/',
    },
  ],
  topics: ['сух', 'слез', 'слёз', 'мейбоми', 'блефарит'],
};

export default content;
