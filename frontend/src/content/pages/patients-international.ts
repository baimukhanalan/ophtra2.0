/**
 * International patient portal (spec §6.5, §8).
 * Copy lives here as `Localized` triples read with `L()` from `useI18n()`.
 * Shared portal copy (labels, countries, languages) is in `./patients`.
 */
import type { PtFaq, PtItem, PtListItem } from './patients';
/* ================================================ INTERNATIONAL PATIENTS */

export const intl = {
  seoTitle: { ru: 'Лечение в Казахстане для иностранных пациентов', kk: 'Шетелдік пациенттерге Қазақстанда емделу', en: 'Eye treatment in Kazakhstan for international patients' },
  seoDescription: {
    ru: 'Офтальмологическое лечение в Казахстане для иностранных пациентов: предварительное рассмотрение документов, план и стоимость, визовая поддержка, проживание, трансфер и перевод.',
    kk: 'Шетелдік пациенттерге Қазақстанда офтальмологиялық ем: құжаттарды алдын ала қарау, жоспар мен құн, визалық қолдау, тұру, трансфер және аударма.',
    en: 'Eye care in Kazakhstan for international patients: preliminary review of your records, a costed plan, visa support, accommodation, transfers and interpreting.',
  },
  eyebrow: { ru: 'Международным пациентам', kk: 'Халықаралық пациенттерге', en: 'International patients' },
  title: { ru: 'Лечение в Казахстане без лишних барьеров', kk: 'Қазақстанда кедергісіз емделу', en: 'Treatment in Kazakhstan, without the hurdles' },
  lead: {
    ru: 'Мы изучаем документы до вашей поездки, составляем план и смету, помогаем с визой, жильём, трансфером и переводом. Один координатор ведёт вас от первой заявки до наблюдения после возвращения домой.',
    kk: 'Сапарыңызға дейін құжаттарды зерделеп, жоспар мен смета жасаймыз, виза, тұрғын үй, трансфер және аудармаға көмектесеміз. Алғашқы өтінімнен бастап үйге оралғаннан кейінгі бақылауға дейін сізді бір үйлестіруші жүргізеді.',
    en: 'We review your records before you travel, prepare a plan and a cost estimate, and help with the visa, accommodation, transfers and interpreting. One coordinator stays with you from the first request to follow-up after you are back home.',
  },
  heroApply: { ru: 'Отправить заявку', kk: 'Өтінім жіберу', en: 'Send a request' },
  heroEstimate: { ru: 'Рассчитать стоимость', kk: 'Құнын есептеу', en: 'Estimate the cost' },
  heroPhotoAlt: {
    ru: 'Здание офтальмологического центра доктора Кулмаганбетова днём',
    kk: 'Доктор Кұлмағанбетов офтальмологиялық орталығының ғимараты күндіз',
    en: 'The Ophthalmic Centre of Dr Kulmaganbetov by day',
  },

  guideLabel: { ru: 'Памятка перед поездкой', kk: 'Сапар алдындағы жадынама', en: 'Before you travel' },
  guide: [
    {
      id: 'before-tickets',
      title: { ru: 'До покупки билетов', kk: 'Билет алмас бұрын', en: 'Before you buy tickets' },
      text: {
        ru: 'Сначала пришлите документы — выписки, снимки, результаты ОКТ и других исследований. Врач оценит, подходит ли вам лечение и какие обследования нужно повторить на месте. Только после этого имеет смысл планировать даты.',
        kk: 'Алдымен құжаттарды жіберіңіз — көшірмелер, суреттер, ОКТ және басқа зерттеулердің нәтижелері. Дәрігер емнің сізге сәйкес келетінін және орнында қандай тексерулерді қайталау керегін бағалайды. Күндерді содан кейін ғана жоспарлаған жөн.',
        en: 'Send your records first — discharge summaries, scans, OCT and other test results. A doctor will assess whether the treatment suits you and which tests need to be repeated here. Only then does it make sense to plan dates.',
      },
      list: [
        { ru: 'Проверьте срок действия паспорта и визовые требования для вашей страны', kk: 'Паспорттың жарамдылық мерзімін және еліңіз үшін визалық талаптарды тексеріңіз', en: 'Check your passport validity and the visa rules for your country' },
        { ru: 'Соберите исследования за последние 6–12 месяцев', kk: 'Соңғы 6–12 айдағы зерттеулерді жинаңыз', en: 'Gather tests from the last 6–12 months' },
        { ru: 'Составьте список лекарств, которые принимаете постоянно', kk: 'Тұрақты қабылдайтын дәрілердің тізімін жасаңыз', en: 'List the medicines you take regularly' },
        { ru: 'Не покупайте невозвратные билеты до подтверждения плана', kk: 'Жоспар расталмайынша қайтарылмайтын билет алмаңыз', en: 'Avoid non-refundable tickets until the plan is confirmed' },
      ],
    },
    {
      id: 'cost-duration',
      title: { ru: 'Стоимость и длительность', kk: 'Құны мен ұзақтығы', en: 'Cost and length of stay' },
      text: {
        ru: 'Смету вы получаете письменно ещё до поездки, в тенге и в долларах. Ориентиры по времени: комплексная диагностика — один день, лазерная коррекция — два-три дня с контрольным осмотром, хирургия катаракты — от трёх до пяти дней. Окончательный план врач подтверждает после очного обследования.',
        kk: 'Сметаны сапарға дейін жазбаша түрде теңгемен және доллармен аласыз. Уақыт бойынша бағдар: кешенді диагностика — бір күн, лазерлік түзету — бақылау тексеруімен екі-үш күн, катаракта хирургиясы — үштен бес күнге дейін. Түпкілікті жоспарды дәрігер бетпе-бет тексеруден кейін растайды.',
        en: 'You receive a written estimate before you travel, in tenge and US dollars. As a guide: comprehensive diagnostics takes one day, laser vision correction two to three days including a check-up, cataract surgery three to five days. The doctor confirms the final plan after examining you in person.',
      },
    },
    {
      id: 'four-questions',
      title: { ru: 'Поездка: четыре вопроса', kk: 'Сапар: төрт сұрақ', en: 'The trip: four questions' },
      text: {
        ru: 'Координатор заранее отвечает на вопросы, которые обычно тревожат больше всего, — и фиксирует договорённости в переписке.',
        kk: 'Үйлестіруші ең көп алаңдататын сұрақтарға алдын ала жауап береді — және уағдаластықтарды хат алмасуда бекітеді.',
        en: 'Your coordinator answers the questions that tend to worry people most — in advance and in writing.',
      },
      list: [
        { ru: 'Где жить — гостиница или апартаменты рядом с клиникой', kk: 'Қайда тұру — клиникаға жақын қонақүй немесе пәтер', en: 'Where to stay — a hotel or apartment near the clinic' },
        { ru: 'Как добраться из аэропорта и на приёмы', kk: 'Әуежайдан және қабылдауларға қалай жету', en: 'How to get from the airport and to appointments' },
        { ru: 'Кто будет переводить на осмотрах', kk: 'Тексерулерде кім аударады', en: 'Who will interpret during consultations' },
        { ru: 'Что делать, если планы или самочувствие изменятся', kk: 'Жоспар немесе көңіл-күй өзгерсе не істеу керек', en: 'What happens if plans or your health change' },
      ],
    },
    {
      id: 'after-return',
      title: { ru: 'После возвращения', kk: 'Оралғаннан кейін', en: 'After you return home' },
      text: {
        ru: 'Вы уезжаете с выпиской на русском или английском языке и понятным графиком контроля. Контрольные осмотры можно проходить онлайн или у вашего офтальмолога — мы на связи с ним, если нужно. Все документы остаются в личном кабинете.',
        kk: 'Сіз орыс немесе ағылшын тіліндегі көшірмемен және түсінікті бақылау кестесімен кетесіз. Бақылау тексерулерін онлайн немесе өз офтальмологыңызда өтуге болады — қажет болса, біз онымен байланыстамыз. Барлық құжат жеке кабинетте сақталады.',
        en: 'You leave with a discharge summary in Russian or English and a clear follow-up schedule. Check-ups can be done online or with your local ophthalmologist — we will liaise with them if needed. All documents stay in your personal account.',
      },
    },
  ],
  continueTitle: { ru: 'Продолжить знакомство', kk: 'Танысуды жалғастыру', en: 'Keep exploring' },

  whyKzEyebrow: { ru: 'Почему Казахстан', kk: 'Неге Қазақстан', en: 'Why Kazakhstan' },
  whyKzTitle: { ru: 'Близко, понятно и прозрачно', kk: 'Жақын, түсінікті және ашық', en: 'Close, clear and transparent' },
  whyKzStatement: {
    ru: 'Хорошее лечение не обязано начинаться с долгого перелёта, очереди на визу и счёта, который невозможно понять заранее.',
    kk: 'Сапалы ем ұзақ ұшудан, визаға кезектен және алдын ала түсіну мүмкін емес шоттан басталуы міндетті емес.',
    en: 'Good treatment should not have to begin with a long-haul flight, a visa queue and a bill nobody can explain in advance.',
  },
  whyKz: [
    {
      title: { ru: 'Короткая дорога', kk: 'Қысқа жол', en: 'A short journey' },
      text: {
        ru: 'Центр находится в Астане — городе с прямыми рейсами из Центральной Азии, с Кавказа, из Турции, с Ближнего Востока и из Европы.',
        kk: 'Орталық Астанада орналасқан — Орталық Азиядан, Кавказдан, Түркиядан, Таяу Шығыстан және Еуропадан тікелей рейстері бар қалада.',
        en: 'The centre is in Astana, a city with direct flights from Central Asia, the Caucasus, Türkiye, the Middle East and Europe.',
      },
    },
    {
      title: { ru: 'Простой въезд', kk: 'Қарапайым кіру', en: 'Straightforward entry' },
      text: {
        ru: 'Для граждан многих стран действует безвизовый режим. Если виза нужна, мы подготовим приглашение на лечение.',
        kk: 'Көптеген елдің азаматтары үшін визасыз режим қолданылады. Виза керек болса, емделуге шақыру дайындаймыз.',
        en: 'Citizens of many countries can enter visa-free. If you do need a visa, we prepare a medical invitation letter.',
      },
    },
    {
      title: { ru: 'Прозрачная стоимость', kk: 'Ашық құн', en: 'Transparent cost' },
      text: {
        ru: 'Услуги оплачиваются по опубликованному прейскуранту центра, а письменную смету вы получаете ещё до поездки.',
        kk: 'Қызметтер орталықтың жарияланған прейскуранты бойынша төленеді, ал жазбаша сметаны сапарға дейін аласыз.',
        en: 'Services are charged from the centre’s published price list, and you receive a written estimate before you travel.',
      },
    },
  ] as PtItem[],

  whyUsEyebrow: { ru: 'Почему наш центр', kk: 'Неге біздің орталық', en: 'Why our centre' },
  whyUsTitle: {
    ru: 'Решение принимается до поездки, а не после',
    kk: 'Шешім сапардан кейін емес, оған дейін қабылданады',
    en: 'Decisions are made before the trip, not after it',
  },
  whyUsLead: {
    ru: 'Это новый центр в Астане, который носит имя доктора Мухита Кулмаганбетова — офтальмолога и учёного (MD in Ophthalmology, PhD in Vision Sciences, Cardiff University). Мы объясняем медицину ясно и опираемся на доказательства.',
    kk: 'Бұл — Астанадағы жаңа орталық, ол офтальмолог әрі ғалым доктор Мұхит Құлмағанбетовтың атымен аталады (MD in Ophthalmology, PhD in Vision Sciences, Cardiff University). Біз медицинаны түсінікті түсіндіріп, дәлелдерге сүйенеміз.',
    en: 'This is a new centre in Astana named after Dr Mukhit Kulmaganbetov, an ophthalmologist and scientist (MD in Ophthalmology, PhD in Vision Sciences, Cardiff University). We explain medicine plainly and rely on evidence.',
  },
  whyUs: [
    {
      title: { ru: 'Предварительное заключение', kk: 'Алдын ала қорытынды', en: 'Preliminary opinion' },
      text: {
        ru: 'Врач изучает ваши документы и говорит, чего ожидать, ещё до покупки билетов.',
        kk: 'Дәрігер құжаттарыңызды зерделеп, билет алмас бұрын не күтуге болатынын айтады.',
        en: 'A doctor reviews your records and tells you what to expect before you buy a ticket.',
      },
    },
    {
      title: { ru: 'Одна диагностика — один день', kk: 'Бір диагностика — бір күн', en: 'Diagnostics in a single day' },
      text: {
        ru: 'ОКТ, периметрия, кератотопография и осмотр врача — за одно посещение.',
        kk: 'ОКТ, периметрия, кератотопография және дәрігердің тексеруі — бір келуде.',
        en: 'OCT, visual fields, corneal topography and a doctor’s examination in one visit.',
      },
    },
    {
      title: { ru: 'Документы на вашем языке', kk: 'Құжаттар сіздің тіліңізде', en: 'Records in your language' },
      text: {
        ru: 'Выписка и рекомендации — на русском или английском, для вашего врача дома.',
        kk: 'Көшірме мен ұсынымдар — орыс немесе ағылшын тілінде, үйдегі дәрігеріңіз үшін.',
        en: 'Discharge summary and advice in Russian or English, ready for your doctor at home.',
      },
    },
    {
      title: { ru: 'Наблюдение после лечения', kk: 'Емнен кейінгі бақылау', en: 'Care after treatment' },
      text: {
        ru: 'Онлайн-контроль и связь с лечащим врачом после возвращения.',
        kk: 'Оралғаннан кейін онлайн бақылау және емдеуші дәрігермен байланыс.',
        en: 'Online check-ups and direct contact with your doctor once you are home.',
      },
    },
  ] as PtItem[],

  proofTitle: {
    ru: 'Разработка основателя уже проверена на пациентах',
    kk: 'Негізін қалаушының әзірлемесі пациенттерде тексерілген',
    en: 'The founder’s research has already been tested with patients',
  },
  proofText: {
    ru: 'Доктор Кулмаганбетов разработал прибор на основе квантовой оптики для раннего выявления возрастной макулярной дегенерации.',
    kk: 'Доктор Құлмағанбетов жасқа байланысты макулярлық дегенерацияны ерте анықтауға арналған кванттық оптикаға негізделген құрылғы әзірледі.',
    en: 'Dr Kulmaganbetov developed a quantum-optics device for the early detection of age-related macular degeneration.',
  },
  proof: [
    {
      value: 200,
      label: { ru: 'пациентов обследованы с его помощью', kk: 'пациент оның көмегімен тексерілді', en: 'patients examined with it' },
    },
    {
      text: { ru: 'Гонконг · Канада', kk: 'Гонконг · Канада', en: 'Hong Kong · Canada' },
      label: { ru: 'клиники, где прибор проходил испытания', kk: 'құрылғы сынақтан өткен клиникалар', en: 'clinics where the device was tested' },
    },
    {
      text: { ru: 'Патент', kk: 'Патент', en: 'Patent' },
      label: { ru: 'получен на устройство', kk: 'құрылғыға алынды', en: 'granted for the device' },
    },
  ] as Array<{ value?: number; text?: { ru: string; kk: string; en: string }; label: { ru: string; kk: string; en: string } }>,
  proofSource: { ru: 'Источник: 24.kz', kk: 'Дереккөз: 24.kz', en: 'Source: 24.kz' },
  proofUrl:
    'https://24.kz/ru/news/in-the-world/788733-razrabotka-kazakhstantsa-dlya-vyyavleniya-boleznej-glaz-prokhodit-ispytaniya-v-gonkonge',

  journeyEyebrow: { ru: 'Путь лечения', kk: 'Емделу жолы', en: 'Treatment path' },
  journeyTitle: { ru: 'Шесть шагов от заявки до наблюдения', kk: 'Өтінімнен бақылауға дейін алты қадам', en: 'Six steps from request to follow-up' },
  journeyStepLabel: { ru: 'Шаг', kk: 'Қадам', en: 'Step' },
  journey: [
    {
      title: { ru: 'Онлайн-заявка', kk: 'Онлайн өтінім', en: 'Online request' },
      text: {
        ru: 'Вы заполняете форму и перечисляете документы. Номер заявки появляется сразу после отправки.',
        kk: 'Сіз форманы толтырып, құжаттарды тізімдейсіз. Өтінім нөмірі жіберген соң бірден шығады.',
        en: 'You fill in the form and list your records. A reference number appears as soon as you send it.',
      },
      meta: { ru: '10 минут', kk: '10 минут', en: '10 minutes' },
    },
    {
      title: { ru: 'Медицинское рассмотрение', kk: 'Медициналық қарау', en: 'Medical review' },
      text: {
        ru: 'Профильный специалист изучает документы и при необходимости назначает онлайн-консультацию.',
        kk: 'Бейінді маман құжаттарды зерделеп, қажет болса онлайн кеңес тағайындайды.',
        en: 'A specialist in your condition reviews the records and, if needed, schedules an online consultation.',
      },
      meta: { ru: 'срок называет координатор', kk: 'мерзімін үйлестіруші айтады', en: 'timeline set by your coordinator' },
    },
    {
      title: { ru: 'План лечения', kk: 'Емдеу жоспары', en: 'Treatment plan' },
      text: {
        ru: 'Вы получаете письменный план: обследования, вмешательство, сроки и смету в тенге и долларах.',
        kk: 'Сіз жазбаша жоспар аласыз: тексерулер, араласу, мерзімдер және теңге мен доллардағы смета.',
        en: 'You receive a written plan: tests, procedure, timing and an estimate in tenge and US dollars.',
      },
      meta: { ru: 'письменно', kk: 'жазбаша', en: 'in writing' },
    },
    {
      title: { ru: 'Организация поездки', kk: 'Сапарды ұйымдастыру', en: 'Travel arrangements' },
      text: {
        ru: 'Приглашение для визы, бронирование жилья, трансфер из аэропорта и переводчик — по вашему выбору.',
        kk: 'Визаға шақыру, тұрғын үй брондау, әуежайдан трансфер және аудармашы — өз таңдауыңыз бойынша.',
        en: 'Visa invitation, accommodation booking, airport transfer and an interpreter — whatever you need.',
      },
      meta: { ru: 'по запросу', kk: 'сұраныс бойынша', en: 'on request' },
    },
    {
      title: { ru: 'Лечение', kk: 'Емделу', en: 'Treatment' },
      text: {
        ru: 'Очная диагностика подтверждает план, затем — лечение или операция и контрольный осмотр перед отъездом.',
        kk: 'Бетпе-бет диагностика жоспарды растайды, содан кейін — ем немесе операция және кетер алдында бақылау тексеруі.',
        en: 'In-person diagnostics confirm the plan, followed by treatment or surgery and a check-up before you leave.',
      },
      meta: { ru: '1–5 дней', kk: '1–5 күн', en: '1–5 days' },
    },
    {
      title: { ru: 'Наблюдение после лечения', kk: 'Емнен кейінгі бақылау', en: 'Follow-up care' },
      text: {
        ru: 'Выписка на вашем языке, график контроля и онлайн-связь с врачом, который вас лечил.',
        kk: 'Сіздің тіліңіздегі көшірме, бақылау кестесі және сізді емдеген дәрігермен онлайн байланыс.',
        en: 'A summary in your language, a follow-up schedule and online contact with the doctor who treated you.',
      },
      meta: { ru: 'дистанционно', kk: 'қашықтан', en: 'remotely' },
    },
  ],

  estEyebrow: { ru: 'Расчёт стоимости', kk: 'Құнын есептеу', en: 'Cost estimate' },
  estTitle: { ru: 'Прикиньте бюджет поездки', kk: 'Сапар бюджетін шамалаңыз', en: 'Get a feel for the budget' },
  estLead: {
    ru: 'Отметьте услуги и условия поездки — калькулятор покажет ориентировочный диапазон. Цены на услуги взяты из прейскуранта центра; расходы на поездку — типовые диапазоны для Астаны, а не цены клиники.',
    kk: 'Қызметтер мен сапар шарттарын белгілеңіз — калькулятор болжамды ауқымды көрсетеді. Қызмет бағалары орталық прейскурантынан алынған; сапар шығындары — клиника бағасы емес, Астана үшін әдеттегі ауқымдар.',
    en: 'Tick the services and travel options — the calculator shows an indicative range. Service prices come from the centre’s price list; travel costs are typical Astana ranges, not clinic prices.',
  },
  estServices: { ru: 'Медицинские услуги', kk: 'Медициналық қызметтер', en: 'Medical services' },
  estNights: { ru: 'Ночей в Астане', kk: 'Астанадағы түндер', en: 'Nights in Astana' },
  estClinicDays: { ru: 'Дней с визитами в клинику', kk: 'Клиникаға келетін күндер', en: 'Days with clinic visits' },
  estStay: { ru: 'Проживание', kk: 'Тұру', en: 'Accommodation' },
  estTransfer: { ru: 'Трансфер', kk: 'Трансфер', en: 'Transfers' },
  estInterpreter: { ru: 'Переводчик на приёмах', kk: 'Қабылдауларда аудармашы', en: 'Interpreter at appointments' },
  estResult: { ru: 'Ориентировочно', kk: 'Шамамен', en: 'Indicative total' },
  estMedical: { ru: 'Лечение и диагностика', kk: 'Ем және диагностика', en: 'Treatment and diagnostics' },
  estTravel: { ru: 'Проживание, трансфер, перевод', kk: 'Тұру, трансфер, аударма', en: 'Stay, transfers, interpreting' },
  estEmpty: {
    ru: 'Отметьте хотя бы одну услугу, чтобы увидеть расчёт.',
    kk: 'Есепті көру үшін кемінде бір қызметті белгілеңіз.',
    en: 'Tick at least one service to see an estimate.',
  },
  estNote: {
    ru: 'Это ориентир, а не счёт. Итоговую стоимость врач определит после медицинского рассмотрения и очного обследования — она будет зафиксирована в письменном плане лечения. Пересчёт в доллары — по условному курсу 1 USD ≈ {rate} ₸.',
    kk: 'Бұл шот емес, бағдар. Түпкілікті құнды дәрігер медициналық қараудан және бетпе-бет тексеруден кейін анықтайды — ол жазбаша емдеу жоспарында бекітіледі. Долларға шартты бағам бойынша аударылған: 1 USD ≈ {rate} ₸.',
    en: 'This is a guide, not an invoice. The final cost is set by the doctor after the medical review and an in-person examination, and is fixed in your written treatment plan. Dollar figures use an indicative rate of 1 USD ≈ {rate} ₸.',
  },
  estCta: { ru: 'Перенести расчёт в заявку', kk: 'Есепті өтінімге көшіру', en: 'Add this estimate to my request' },
  estSelected: { ru: 'выбрано', kk: 'таңдалды', en: 'selected' },
  estYes: { ru: 'да', kk: 'иә', en: 'yes' },
  estPrefill: {
    ru: 'Расчёт с сайта',
    kk: 'Сайттағы есеп',
    en: 'Estimate from the website',
  },
  prefillNote: {
    ru: 'Расчёт добавлен в комментарий к заявке — проверьте и дополните его.',
    kk: 'Есеп өтінім түсініктемесіне қосылды — тексеріп, толықтырыңыз.',
    en: 'Your estimate has been added to the comment — check it and add anything else.',
  },
  estPerNight: { ru: 'за ночь', kk: 'түнге', en: 'per night' },
  stayTiers: [
    { value: 'own', label: { ru: 'Сам(а) организую', kk: 'Өзім ұйымдастырамын', en: 'I’ll arrange it' }, min: 0, max: 0 },
    { value: 'comfort', label: { ru: 'Комфорт', kk: 'Комфорт', en: 'Comfort' }, min: 20000, max: 32000 },
    { value: 'business', label: { ru: 'Бизнес', kk: 'Бизнес', en: 'Business' }, min: 40000, max: 60000 },
    { value: 'premium', label: { ru: 'Премиум', kk: 'Премиум', en: 'Premium' }, min: 80000, max: 120000 },
  ],
  transferOptions: [
    { value: 'none', label: { ru: 'Не нужен', kk: 'Керек емес', en: 'Not needed' } },
    { value: 'airport', label: { ru: 'Аэропорт ⇄ отель', kk: 'Әуежай ⇄ қонақүй', en: 'Airport ⇄ hotel' } },
    { value: 'full', label: { ru: 'Аэропорт + на приёмы', kk: 'Әуежай + қабылдауларға', en: 'Airport + appointments' } },
  ],

  travelEyebrow: { ru: 'Организация поездки', kk: 'Сапарды ұйымдастыру', en: 'Travel support' },
  travelMore: { ru: 'Что входит', kk: 'Не кіреді', en: 'What’s included' },
  travelTitle: { ru: 'Берём на себя всё, что не касается медицины', kk: 'Медицинаға қатысы жоқтың бәрін өзімізге аламыз', en: 'We take care of everything that isn’t medicine' },
  travel: [
    {
      title: { ru: 'Визовая поддержка', kk: 'Визалық қолдау', en: 'Visa support' },
      text: {
        ru: 'Проверим, нужна ли вам виза, и при необходимости подготовим официальное приглашение на лечение для консульства — для пациента и сопровождающего.',
        kk: 'Сізге виза керек пе, тексереміз және қажет болса консулдыққа пациент пен ілесіп жүрушіге арналған ресми емделу шақыруын дайындаймыз.',
        en: 'We check whether you need a visa and, if so, prepare an official medical invitation for the consulate — for you and a companion.',
      },
      list: [
        { ru: 'Приглашение на бланке клиники', kk: 'Клиника бланкісіндегі шақыру', en: 'Invitation on clinic letterhead' },
        { ru: 'Письмо о продлении пребывания при необходимости', kk: 'Қажет болса болу мерзімін ұзарту туралы хат', en: 'Letter to extend your stay if needed' },
        { ru: 'Подсказки по регистрации на месте', kk: 'Орнында тіркелу бойынша кеңестер', en: 'Guidance on local registration' },
      ],
    },
    {
      title: { ru: 'Проживание', kk: 'Тұру', en: 'Accommodation' },
      text: {
        ru: 'Подберём гостиницу или апартаменты в нескольких минутах от клиники — с учётом бюджета, сопровождающих и восстановления после операции.',
        kk: 'Бюджетті, ілесіп жүрушілерді және операциядан кейінгі қалпына келуді ескере отырып, клиникадан бірнеше минуттық жердегі қонақүй немесе пәтер таңдаймыз.',
        en: 'We find a hotel or apartment a few minutes from the clinic, taking into account your budget, companions and recovery after surgery.',
      },
      list: [
        { ru: 'Три уровня: комфорт, бизнес, премиум', kk: 'Үш деңгей: комфорт, бизнес, премиум', en: 'Three tiers: comfort, business, premium' },
        { ru: 'Бронирование с гибкой отменой', kk: 'Икемді бас тартуы бар брондау', en: 'Bookings with flexible cancellation' },
        { ru: 'Номера, удобные после операции', kk: 'Операциядан кейін ыңғайлы бөлмелер', en: 'Rooms suited to post-operative recovery' },
      ],
    },
    {
      title: { ru: 'Транспорт', kk: 'Көлік', en: 'Transport' },
      text: {
        ru: 'Встретим в аэропорту с табличкой, отвезём в отель и на приёмы. После операции за руль садиться нельзя — водитель решает этот вопрос.',
        kk: 'Әуежайда тақтайшамен қарсы алып, қонақүйге және қабылдауларға апарамыз. Операциядан кейін көлік жүргізуге болмайды — жүргізуші бұл мәселені шешеді.',
        en: 'We meet you at the airport with a name sign and drive you to the hotel and appointments. You cannot drive after surgery — a driver solves that.',
      },
      list: [
        { ru: 'Встреча в аэропорту Астаны', kk: 'Астана әуежайында қарсы алу', en: 'Meet-and-greet at Astana airport' },
        { ru: 'Поездки на приёмы по расписанию', kk: 'Кесте бойынша қабылдауларға бару', en: 'Scheduled rides to appointments' },
        { ru: 'Проводы в аэропорт', kk: 'Әуежайға шығарып салу', en: 'Drop-off at the airport' },
      ],
    },
    {
      title: { ru: 'Услуги перевода', kk: 'Аударма қызметтері', en: 'Interpreting' },
      text: {
        ru: 'Приём ведётся на русском, казахском или английском. Для других языков пригласим медицинского переводчика на приёмы и переведём документы.',
        kk: 'Қабылдау орыс, қазақ немесе ағылшын тілінде жүреді. Басқа тілдер үшін қабылдауларға медициналық аудармашы шақырып, құжаттарды аударамыз.',
        en: 'Appointments are held in Russian, Kazakh or English. For other languages we bring a medical interpreter to appointments and translate your documents.',
      },
      list: [
        { ru: 'Устный перевод на приёмах', kk: 'Қабылдауларда ауызша аударма', en: 'Interpreting during appointments' },
        { ru: 'Перевод выписок и заключений', kk: 'Көшірмелер мен қорытындыларды аудару', en: 'Translation of reports and summaries' },
        { ru: 'Сопровождение при подписании согласий', kk: 'Келісімдерге қол қою кезінде сүйемелдеу', en: 'Support when signing consent forms' },
      ],
    },
  ] as PtListItem[],

  coordEyebrow: { ru: 'Международный координатор', kk: 'Халықаралық үйлестіруші', en: 'International coordinator' },
  coordTitle: { ru: 'Один человек на связи всю поездку', kk: 'Бүкіл сапар бойы бір адам байланыста', en: 'One person to call for the whole trip' },
  coordText: {
    ru: 'Координатор отвечает на вопросы, согласует даты с врачами, бронирует жильё и трансфер, напоминает о приёмах.',
    kk: 'Үйлестіруші сұрақтарға жауап береді, күндерді дәрігерлермен келіседі, тұрғын үй мен трансферді брондайды, қабылдаулар туралы еске салады.',
    en: 'Your coordinator answers questions, agrees dates with the doctors, books accommodation and transfers, and reminds you of appointments.',
  },
  coordRole: { ru: 'Международный отдел', kk: 'Халықаралық бөлім', en: 'International department' },
  coordHours: {
    ru: 'Пишите в любое время — отвечаем в рабочие часы по времени Астаны (UTC+5)',
    kk: 'Кез келген уақытта жазыңыз — Астана уақытымен (UTC+5) жұмыс сағаттарында жауап береміз',
    en: 'Write any time — we reply during working hours, Astana time (UTC+5)',
  },

  langEyebrow: { ru: 'Языки', kk: 'Тілдер', en: 'Languages' },
  langTitle: { ru: 'Говорим на вашем языке', kk: 'Сіздің тіліңізде сөйлейміз', en: 'We speak your language' },
  langs: [
    { code: 'EN', name: { ru: 'Английский', kk: 'Ағылшын', en: 'English' }, ready: true },
    { code: 'RU', name: { ru: 'Русский', kk: 'Орыс', en: 'Russian' }, ready: true },
    { code: 'KK', name: { ru: 'Казахский', kk: 'Қазақ', en: 'Kazakh' }, ready: true },
    { code: 'AR', name: { ru: 'Арабский', kk: 'Араб', en: 'Arabic' }, ready: false },
  ],
  langLead: {
    ru: 'Сайт, документы и координатор — на английском, русском и казахском.',
    kk: 'Сайт, құжаттар және үйлестіруші — ағылшын, орыс және қазақ тілдерінде.',
    en: 'Website, documents and coordinator in English, Russian and Kazakh.',
  },
  langSoon: { ru: 'Скоро — второй этап', kk: 'Жақында — екінші кезең', en: 'Coming in phase 2' },
  langNote: {
    ru: 'Для других языков пригласим медицинского переводчика — сообщите об этом в заявке.',
    kk: 'Басқа тілдер үшін медициналық аудармашы шақырамыз — бұл туралы өтінімде хабарлаңыз.',
    en: 'For any other language we will bring in a medical interpreter — just mention it in your request.',
  },

  formTitle: { ru: 'Заявка на лечение в Казахстане', kk: 'Қазақстанда емделуге өтінім', en: 'Request treatment in Kazakhstan' },
  formLead: {
    ru: 'Расскажите о себе и приложите документы — координатор свяжется с вами в течение рабочего дня, а врач начнёт рассмотрение.',
    kk: 'Өзіңіз туралы айтып, құжаттарды тіркеңіз — үйлестіруші жұмыс күні ішінде хабарласады, ал дәрігер қарауды бастайды.',
    en: 'Tell us about yourself and attach your records — a coordinator will contact you within one working day and a doctor will begin the review.',
  },
  formSubmit: { ru: 'Отправить заявку', kk: 'Өтінім жіберу', en: 'Send request' },
  formAsideTitle: { ru: 'Что будет дальше', kk: 'Ары қарай не болады', en: 'What happens next' },
  formAside: [
    { ru: 'Сразу — номер заявки на экране', kk: 'Бірден — экранда өтінім нөмірі', en: 'Straight away — a reference number on screen' },
    { ru: 'В течение дня — звонок или сообщение координатора', kk: 'Бір күн ішінде — үйлестірушінің қоңырауы немесе хабары', en: 'Within a day — a call or message from your coordinator' },
    { ru: 'После рассмотрения — мнение врача и предварительный план; срок координатор назовёт, когда увидит документы', kk: 'Қараудан кейін — дәрігер пікірі және алдын ала жоспар; мерзімді үйлестіруші құжаттарды көрген соң айтады', en: 'After the review — the doctor’s view and a preliminary plan; your coordinator gives the timeline once the records are in' },
  ],

  faq: [
    {
      q: { ru: 'Можно ли приехать без предварительного рассмотрения документов?', kk: 'Құжаттарды алдын ала қаратпай келуге бола ма?', en: 'Can I come without a preliminary review of my records?' },
      a: {
        ru: 'Можно, но мы не советуем. Предварительное рассмотрение помогает избежать поездки, которая может оказаться ненужной или слишком короткой. Условия рассмотрения координатор сообщит при первом контакте.',
        kk: 'Болады, бірақ кеңес бермейміз. Алдын ала қарау қажетсіз немесе тым қысқа болуы мүмкін сапардан сақтайды. Қарау шарттарын үйлестіруші алғашқы байланыста айтады.',
        en: 'You can, but we advise against it. A preliminary review helps you avoid a trip that turns out to be unnecessary or too short. Your coordinator will explain the review terms at first contact.',
      },
    },
    {
      q: { ru: 'Насколько точен расчёт на сайте?', kk: 'Сайттағы есеп қаншалықты дәл?', en: 'How accurate is the online estimate?' },
      a: {
        ru: 'Калькулятор использует действующие цены прейскуранта и типовые расходы на поездку, но это только ориентир. Точная сумма указывается в письменном плане лечения после медицинского рассмотрения.',
        kk: 'Калькулятор прейскуранттың қолданыстағы бағаларын және сапардың әдеттегі шығындарын пайдаланады, бірақ бұл тек бағдар. Нақты сома медициналық қараудан кейін жазбаша емдеу жоспарында көрсетіледі.',
        en: 'The calculator uses current list prices and typical travel costs, but it is only a guide. The exact amount is stated in your written treatment plan after the medical review.',
      },
    },
    {
      q: { ru: 'Как оплатить лечение?', kk: 'Емді қалай төлеуге болады?', en: 'How do I pay for treatment?' },
      a: {
        ru: 'Сумма, валюта и порядок оплаты указываются в письменном плане лечения, который вы получаете до поездки. Если что-то непонятно, координатор объяснит заранее.',
        kk: 'Сома, валюта және төлем тәртібі сапарға дейін алатын жазбаша емдеу жоспарында көрсетіледі. Түсініксіз болса, үйлестіруші алдын ала түсіндіреді.',
        en: 'The amount, currency and payment terms are set out in the written treatment plan you receive before you travel. If anything is unclear, your coordinator explains it in advance.',
      },
    },
    {
      q: { ru: 'Можно ли приехать с сопровождающим?', kk: 'Ілесіп жүрушімен келуге бола ма?', en: 'Can someone come with me?' },
      a: {
        ru: 'Да, а после операции мы даже рекомендуем это. Приглашение для визы и бронирование жилья оформим и на сопровождающего.',
        kk: 'Иә, ал операциядан кейін тіпті ұсынамыз. Визаға шақыру мен тұрғын үй брондауын ілесіп жүрушіге де рәсімдейміз.',
        en: 'Yes — after surgery we actually recommend it. We can issue the visa invitation and book accommodation for your companion too.',
      },
    },
    {
      q: { ru: 'Когда можно лететь домой после операции?', kk: 'Операциядан кейін үйге қашан ұшуға болады?', en: 'When can I fly home after surgery?' },
      a: {
        ru: 'Зависит от вмешательства. После лазерной коррекции и хирургии катаракты перелёт обычно возможен после контрольного осмотра на следующий день или через несколько дней — точный срок назовёт хирург.',
        kk: 'Араласуға байланысты. Лазерлік түзету мен катаракта хирургиясынан кейін ұшу әдетте келесі күні немесе бірнеше күннен соң бақылау тексеруінен кейін мүмкін — нақты мерзімді хирург айтады.',
        en: 'It depends on the procedure. After laser correction or cataract surgery you can usually fly after a check-up the next day or a few days later — your surgeon will give you the exact date.',
      },
    },
    {
      q: { ru: 'Что если после возвращения появятся вопросы?', kk: 'Оралғаннан кейін сұрақтар туындаса ше?', en: 'What if I have questions once I am home?' },
      a: {
        ru: 'Пишите координатору или записывайтесь на онлайн-консультацию к врачу, который вас лечил. Документы и рекомендации доступны в личном кабинете.',
        kk: 'Үйлестірушіге жазыңыз немесе сізді емдеген дәрігерге онлайн кеңеске жазылыңыз. Құжаттар мен ұсынымдар жеке кабинетте қолжетімді.',
        en: 'Message your coordinator or book an online consultation with the doctor who treated you. Documents and advice are available in your personal account.',
      },
    },
  ] as PtFaq[],
};
