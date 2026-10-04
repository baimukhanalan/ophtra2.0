import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/contact-lens-fitting (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'consultation',
  lead: {
    ru: 'Подбор контактных линз по параметрам вашего глаза, первая примерка и обучение безопасному уходу.',
    kk: 'Көзіңіздің параметрлері бойынша контакт линзаларын таңдау, алғашқы кию және қауіпсіз күтімге үйрету.',
    en: 'Contact lenses chosen to fit your eyes, a first trial fitting and training in safe lens care.',
  },
  overview: {
    ru: [
      'Контактные линзы — медицинские изделия, которые располагаются прямо на поверхности глаза. Поэтому их нельзя подбирать только по рецепту на очки: сила линзы, радиус кривизны, диаметр и материал должны соответствовать форме роговицы и состоянию слёзной плёнки.',
      'На приёме врач обследует глаз, подбирает тип линз и режим ношения, проверяет посадку линзы и учит надевать, снимать и ухаживать за ней. Большинство осложнений связаны с нарушением гигиены и режима, поэтому обучению уделяется отдельное время.',
    ],
    kk: [
      'Контакт линзалары — тікелей көздің бетінде орналасатын медициналық бұйымдар. Сондықтан оларды тек көзілдірік рецепті бойынша таңдауға болмайды: линзаның күші, қисықтық радиусы, диаметрі және материалы мөлдір қабықтың пішіні мен жас қабықшасының жағдайына сәйкес келуі тиіс.',
      'Қабылдауда дәрігер көзді тексеріп, линза түрі мен тағу режимін таңдайды, линзаның орналасуын тексереді және оны киюге, шешуге және күтуге үйретеді. Асқынулардың көбі гигиена мен режимнің бұзылуына байланысты, сондықтан үйретуге жеке уақыт бөлінеді.',
    ],
    en: [
      'Contact lenses are medical devices that sit directly on the surface of the eye. That is why they cannot be chosen from a glasses prescription alone: lens power, base curve, diameter and material must suit the shape of the cornea and the tear film.',
      'During the visit the doctor examines the eye, chooses the lens type and wearing schedule, checks how the lens sits and teaches you to insert, remove and care for it. Most complications are linked to poor hygiene or overwear, so training gets dedicated time.',
    ],
  },
  indications: {
    ru: [
      'Желание носить линзы вместо очков или вместе с ними',
      'Занятия спортом, где очки неудобны',
      'Астигматизм — подбор торических линз',
      'Большая разница рефракции между глазами (анизометропия)',
      'Пресбиопия — мультифокальные линзы по показаниям',
      'Замена или проверка уже используемых линз',
    ],
    kk: [
      'Көзілдіріктің орнына немесе онымен бірге линза тағу ниеті',
      'Көзілдірік ыңғайсыз болатын спорт түрлерімен айналысу',
      'Астигматизм — торикалық линзаларды таңдау',
      'Екі көздің рефракциясындағы үлкен айырмашылық (анизометропия)',
      'Пресбиопия — көрсеткіштер бойынша мультифокалды линзалар',
      'Қазір қолданылып жүрген линзаларды ауыстыру немесе тексеру',
    ],
    en: [
      'Wanting to wear lenses instead of, or alongside, glasses',
      'Sports where glasses are impractical',
      'Astigmatism — fitting toric lenses',
      'A large difference in prescription between the eyes (anisometropia)',
      'Presbyopia — multifocal lenses where suitable',
      'Replacing or checking lenses you already wear',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Перед подбором врач оценивает, подходят ли вам линзы и какие именно:',
      kk: 'Таңдау алдында дәрігер сізге линзалардың сәйкес келетін-келмейтінін және қандай линзалар керек екенін бағалайды:',
      en: 'Before fitting, the doctor checks whether lenses suit you and which type:',
    },
    list: {
      ru: [
        'Рефракцию с пересчётом силы для контактной коррекции',
        'Кератометрию и при необходимости топографию роговицы',
        'Оценку слёзной плёнки и признаков сухости глаза',
        'Осмотр век, конъюнктивы и роговицы на щелевой лампе',
        'Контроль посадки и подвижности пробной линзы',
      ],
      kk: [
        'Рефракция және контакт түзетуіне күшті қайта есептеу',
        'Кератометрия және қажет болса мөлдір қабықтың топографиясы',
        'Жас қабықшасын және көз құрғауының белгілерін бағалау',
        'Саңылаулы шаммен қабақты, конъюнктиваны және мөлдір қабықты қарау',
        'Сынақ линзаның орналасуы мен қозғалғыштығын бақылау',
      ],
      en: [
        'Refraction with power conversion for contact lenses',
        'Keratometry and, where needed, corneal topography',
        'Tear film assessment and signs of dry eye',
        'Slit-lamp examination of the lids, conjunctiva and cornea',
        'Checking the fit and movement of a trial lens',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'Тип линз подбирается по рефракции, состоянию глаз и образу жизни:',
      kk: 'Линза түрі рефракцияға, көздің жағдайына және өмір салтына қарай таңдалады:',
      en: 'The lens type is chosen according to refraction, eye health and lifestyle:',
    },
    list: {
      ru: [
        'Мягкие однодневные линзы — без ухода за контейнером и растворами',
        'Мягкие линзы плановой замены (двухнедельные, месячные)',
        'Торические линзы для коррекции астигматизма',
        'Мультифокальные линзы при пресбиопии',
        'Жёсткие газопроницаемые и ортокератологические линзы — по показаниям',
      ],
      kk: [
        'Бір күндік жұмсақ линзалар — контейнер мен ерітінділерді күтусіз',
        'Жоспарлы ауыстырылатын жұмсақ линзалар (екі апталық, айлық)',
        'Астигматизмді түзетуге арналған торикалық линзалар',
        'Пресбиопия кезіндегі мультифокалды линзалар',
        'Қатты газөткізгіш және ортокератологиялық линзалар — көрсеткіштер бойынша',
      ],
      en: [
        'Daily disposable soft lenses — no case or solutions to look after',
        'Planned-replacement soft lenses (two-weekly, monthly)',
        'Toric lenses to correct astigmatism',
        'Multifocal lenses for presbyopia',
        'Rigid gas-permeable and orthokeratology lenses — when indicated',
      ],
    },
  },
  preparation: {
    ru: [
      'Если вы уже носите мягкие линзы, снимите их заранее — врач подскажет, за сколько времени до визита',
      'Возьмите упаковку от текущих линз и ваши очки',
      'Не наносите макияж на глаза в день приёма',
      'Коротко подстригите ногти — так легче учиться надевать и снимать линзы',
    ],
    kk: [
      'Жұмсақ линзаларды тағып жүрсеңіз, оларды алдын ала шешіңіз — келуден қанша уақыт бұрын екенін дәрігер айтады',
      'Қазіргі линзаларыңыздың қорабын және көзілдірігіңізді алыңыз',
      'Қабылдау күні көзге макияж жасамаңыз',
      'Тырнақтарыңызды қысқа алыңыз — линзаларды киіп-шешуді үйрену оңайырақ болады',
    ],
    en: [
      'If you already wear soft lenses, take them out in advance — the doctor will tell you how long before the visit',
      'Bring the box of your current lenses and your glasses',
      'Avoid eye make-up on the day of the visit',
      'Keep your nails short — it makes learning to insert and remove lenses easier',
    ],
  },
  result: {
    ru: 'Вы уходите с подобранными линзами, рецептом, понятным режимом ношения и навыками ухода; через некоторое время назначается контрольный осмотр. Не спите в линзах, если это не предусмотрено врачом, не используйте водопроводную воду и не плавайте в линзах. Если появились боль, покраснение, светобоязнь или снижение зрения, сразу снимите линзы и в тот же день обратитесь к офтальмологу.',
    kk: 'Сіз таңдалған линзалармен, рецептпен, түсінікті тағу режимімен және күтім дағдыларымен кетесіз; біраз уақыттан кейін бақылау тексеруі тағайындалады. Дәрігер рұқсат етпесе, линзамен ұйықтамаңыз, құбыр суын қолданбаңыз және линзамен жүзбеңіз. Ауырсыну, қызару, жарықтан қорқу немесе көрудің төмендеуі пайда болса, линзаларды дереу шешіп, сол күні офтальмологқа қаралыңыз.',
    en: 'You leave with fitted lenses, a prescription, a clear wearing schedule and care skills, and a follow-up check is booked. Do not sleep in lenses unless the doctor has approved it, never use tap water on them and do not swim in them. If you get pain, redness, light sensitivity or blurred vision, remove the lenses at once and see an eye doctor the same day.',
  },
  faq: [
    {
      q: {
        ru: 'Можно ли купить линзы по рецепту на очки?',
        kk: 'Көзілдірік рецепті бойынша линза сатып алуға бола ма?',
        en: 'Can I buy lenses using my glasses prescription?',
      },
      a: {
        ru: 'Нет. Рецепт на линзы учитывает не только силу, но и радиус кривизны, диаметр и материал, а сила при высоких значениях отличается от очковой. Линзы без подбора могут неправильно сидеть и повредить роговицу.',
        kk: 'Жоқ. Линза рецепті тек күшті ғана емес, қисықтық радиусын, диаметрін және материалын да ескереді, ал жоғары мәндерде күш көзілдірік күшінен өзгеше болады. Таңдалмаған линзалар дұрыс орналаспай, мөлдір қабықты зақымдауы мүмкін.',
        en: 'No. A contact lens prescription includes base curve, diameter and material as well as power, and at higher powers the value differs from the glasses prescription. Lenses that have not been fitted may sit poorly and damage the cornea.',
      },
    },
    {
      q: {
        ru: 'С какого возраста можно носить контактные линзы?',
        kk: 'Контакт линзаларын қай жастан тағуға болады?',
        en: 'From what age can contact lenses be worn?',
      },
      a: {
        ru: 'Строгого возрастного порога нет: всё зависит от показаний и от того, может ли ребёнок вместе с родителями соблюдать гигиену. Для контроля близорукости линзы иногда назначают и детям младшего школьного возраста — решение принимает врач.',
        kk: 'Қатаң жас шегі жоқ: бәрі көрсеткіштерге және баланың ата-анасымен бірге гигиенаны сақтай алатынына байланысты. Миопияны бақылау үшін линзалар кейде бастауыш сынып жасындағы балаларға да тағайындалады — шешімді дәрігер қабылдайды.',
        en: 'There is no strict age limit: it depends on the reason for lenses and whether the child, with parental help, can keep to good hygiene. For myopia control, lenses are sometimes prescribed to younger school-age children — the doctor decides.',
      },
    },
    {
      q: {
        ru: 'Что делать, если глаз покраснел в линзе?',
        kk: 'Линза тағылған көз қызарса не істеу керек?',
        en: 'What should I do if my eye turns red while wearing a lens?',
      },
      a: {
        ru: 'Сразу снимите линзу и не надевайте её снова. Если покраснение сопровождается болью, светобоязнью или ухудшением зрения, в тот же день обратитесь к офтальмологу и возьмите с собой линзы и контейнер.',
        kk: 'Линзаны дереу шешіп, оны қайта кимеңіз. Қызарумен бірге ауырсыну, жарықтан қорқу немесе көрудің нашарлауы болса, сол күні линзалар мен контейнерді ала отырып офтальмологқа қаралыңыз.',
        en: 'Take the lens out straight away and do not put it back in. If the redness comes with pain, light sensitivity or worse vision, see an eye doctor the same day and bring the lenses and case with you.',
      },
    },
  ],
  sources: [
    {
      label: 'U.S. Food and Drug Administration (FDA) — Contact lenses',
      href: 'https://www.fda.gov/medical-devices/consumer-products/contact-lenses',
    },
  ],
  topics: ['линз', 'оптик', 'контакт', 'ортокератолог'],
};

export default content;
