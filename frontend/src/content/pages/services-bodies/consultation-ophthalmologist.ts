import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/consultation-ophthalmologist (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'consultation',
  lead: {
    ru: 'Первичный приём, на котором врач оценивает зрение, осматривает глаза и объясняет, какие обследования или лечение действительно нужны.',
    kk: 'Бастапқы қабылдауда дәрігер көруді бағалап, көзді қарайды және қандай зерттеу немесе ем шын мәнінде қажет екенін түсіндіреді.',
    en: 'A first visit where the doctor assesses your vision, examines your eyes and explains which tests or treatment you actually need.',
  },
  overview: {
    ru: [
      'Консультация начинается с беседы: врач уточняет жалобы, перенесённые заболевания глаз, общее здоровье, принимаемые лекарства и наследственность. Затем проводятся базовые исследования — проверка остроты зрения, измерение внутриглазного давления и осмотр глаз на щелевой лампе, включая глазное дно.',
      'По итогам приёма врач объясняет, что удалось выяснить, и предлагает дальнейший план: наблюдение, подбор коррекции, дополнительные исследования или лечение. Решение всегда принимается индивидуально, с учётом ваших пожеланий.',
    ],
    kk: [
      'Кеңес әңгімеден басталады: дәрігер шағымдарды, бұрын болған көз ауруларын, жалпы денсаулықты, қабылдап жүрген дәрілерді және тұқым қуалаушылықты нақтылайды. Одан кейін негізгі тексерулер жүргізіледі — көру өткірлігін анықтау, көз ішілік қысымды өлшеу және саңылаулы шаммен көзді, соның ішінде көз түбін қарау.',
      'Қабылдау соңында дәрігер не анықталғанын түсіндіріп, әрі қарайғы жоспарды ұсынады: бақылау, түзету құралын таңдау, қосымша зерттеулер немесе ем. Шешім әрқашан сіздің қалауыңызды ескере отырып, жеке қабылданады.',
    ],
    en: [
      'The consultation starts with a conversation: the doctor asks about your symptoms, past eye problems, general health, medicines and family history. Basic tests follow — visual acuity, eye pressure measurement and a slit-lamp examination of the eye, including the fundus.',
      'At the end of the visit the doctor explains the findings and suggests a plan: monitoring, glasses or contact lenses, further tests or treatment. Decisions are always made individually and take your preferences into account.',
    ],
  },
  indications: {
    ru: [
      'Снижение зрения вдаль или вблизи, затуманивание, двоение',
      'Покраснение, дискомфорт, сухость или ощущение песка в глазах',
      'Плановая проверка после 40 лет или при наследственной глаукоме',
      'Сахарный диабет, артериальная гипертензия и другие заболевания, влияющие на глаза',
      'Контроль после ранее проведённого лечения или операции',
      'Вспышки, «мушки» или пелена перед глазом — при их внезапном появлении обратитесь за помощью срочно',
    ],
    kk: [
      'Алысты немесе жақынды көрудің төмендеуі, бұлыңғырлану, екіге көрініп қалу',
      'Көздің қызаруы, жайсыздық, құрғау немесе көзге құм түскендей сезім',
      '40 жастан кейінгі жоспарлы тексеру немесе отбасында глаукома болса',
      'Қант диабеті, артериялық гипертензия және көзге әсер ететін басқа аурулар',
      'Бұрын жүргізілген емнен немесе отадан кейінгі бақылау',
      'Көз алдында жарқылдар, «шыбындар» немесе перде — кенет пайда болса, дереу көмекке жүгініңіз',
    ],
    en: [
      'Blurred distance or near vision, hazy or double vision',
      'Red, uncomfortable, dry or gritty eyes',
      'A routine check after 40 or with a family history of glaucoma',
      'Diabetes, high blood pressure and other conditions that can affect the eyes',
      'Follow-up after earlier treatment or eye surgery',
      'Flashes, floaters or a curtain over your vision — if they appear suddenly, seek urgent care',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'На приёме обычно выполняются базовые исследования; их набор врач уточняет по ходу осмотра.',
      kk: 'Қабылдауда әдетте негізгі зерттеулер жүргізіледі; олардың құрамын дәрігер қарау барысында нақтылайды.',
      en: 'The visit usually includes core tests; the doctor adjusts the set as the examination goes on.',
    },
    list: {
      ru: [
        'Проверка остроты зрения и определение рефракции',
        'Бесконтактное измерение внутриглазного давления',
        'Осмотр переднего отрезка глаза на щелевой лампе',
        'Осмотр глазного дна, при необходимости — с расширением зрачка',
      ],
      kk: [
        'Көру өткірлігін тексеру және рефракцияны анықтау',
        'Көз ішілік қысымды жанаспай өлшеу',
        'Саңылаулы шаммен көздің алдыңғы бөлігін қарау',
        'Көз түбін қарау, қажет болса — қарашықты кеңейтіп',
      ],
      en: [
        'Visual acuity and refraction',
        'Non-contact eye pressure measurement',
        'Slit-lamp examination of the front of the eye',
        'Fundus examination, with pupil dilation if needed',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'После осмотра врач обсуждает с вами возможные следующие шаги. Выбор зависит от находок, образа жизни и ваших целей.',
      kk: 'Қараудан кейін дәрігер сізбен ықтимал келесі қадамдарды талқылайды. Таңдау анықталған өзгерістерге, өмір салтына және мақсаттарыңызға байланысты.',
      en: 'After the examination the doctor discusses possible next steps with you. The choice depends on the findings, your lifestyle and your goals.',
    },
    list: {
      ru: [
        'Подбор очков или контактных линз',
        'Назначение капель или другой консервативной терапии',
        'Направление на ОКТ, периметрию или комплексную диагностику',
        'Консультация по поводу лазерного или хирургического лечения',
        'План динамического наблюдения с датой следующего визита',
      ],
      kk: [
        'Көзілдірік немесе жанаспалы линза таңдау',
        'Тамшы немесе басқа консервативті ем тағайындау',
        'ОКТ, периметрия немесе кешенді диагностикаға жолдау',
        'Лазерлік немесе хирургиялық ем бойынша кеңес',
        'Келесі келу күні көрсетілген бақылау жоспары',
      ],
      en: [
        'Glasses or contact lens prescription',
        'Eye drops or other non-surgical treatment',
        'Referral for OCT, perimetry or complete diagnostics',
        'Discussion of laser or surgical options',
        'A monitoring plan with the date of your next visit',
      ],
    },
  },
  preparation: {
    ru: [
      'Возьмите с собой очки, контактные линзы и выписки из предыдущих обследований',
      'Составьте список лекарств, которые вы принимаете, включая глазные капли',
      'Если возможно расширение зрачка, не садитесь за руль 3–4 часа после приёма',
      'Солнцезащитные очки помогут, если после расширения зрачка яркий свет будет неприятен',
    ],
    kk: [
      'Өзіңізбен көзілдірікті, жанаспалы линзаларды және бұрынғы тексеру қорытындыларын ала келіңіз',
      'Қабылдап жүрген дәрілеріңіздің, соның ішінде көз тамшыларының тізімін жасаңыз',
      'Қарашық кеңейтілуі мүмкін болса, қабылдаудан кейін 3–4 сағат көлік жүргізбеңіз',
      'Қарашық кеңейгеннен кейін жарық көзге батса, күннен қорғайтын көзілдірік көмектеседі',
    ],
    en: [
      'Bring your glasses, contact lenses and reports from earlier examinations',
      'Make a list of the medicines you take, including eye drops',
      'If your pupils may be dilated, do not drive for 3–4 hours after the visit',
      'Sunglasses help if bright light feels uncomfortable after dilation',
    ],
  },
  result: {
    ru: 'Заключение врач обсуждает с вами в конце приёма и выдаёт на руки письменные рекомендации. Если назначены дополнительные исследования, окончательный план может быть уточнён после их результатов.',
    kk: 'Дәрігер қорытындыны қабылдау соңында сізбен талқылап, жазбаша ұсынымдар береді. Қосымша зерттеулер тағайындалса, түпкілікті жоспар олардың нәтижесінен кейін нақтылануы мүмкін.',
    en: 'The doctor goes through the conclusion with you at the end of the visit and gives you written recommendations. If further tests are ordered, the final plan may be refined once their results are in.',
  },
  faq: [
    {
      q: {
        ru: 'Будут ли расширять зрачок?',
        kk: 'Қарашықты кеңейте ме?',
        en: 'Will my pupils be dilated?',
      },
      a: {
        ru: 'Не всегда. Расширение нужно для детального осмотра глазного дна, и врач решает это по показаниям. После него зрение вблизи несколько часов может быть размытым.',
        kk: 'Әрдайым емес. Кеңейту көз түбін егжей-тегжейлі қарау үшін қажет, оны дәрігер көрсеткіштерге қарай шешеді. Одан кейін бірнеше сағат жақынды көру бұлыңғыр болуы мүмкін.',
        en: 'Not always. Dilation is needed for a detailed view of the back of the eye, and the doctor decides whether it is indicated. Near vision may stay blurred for a few hours afterwards.',
      },
    },
    {
      q: {
        ru: 'Можно ли прийти в контактных линзах?',
        kk: 'Жанаспалы линзамен келуге бола ма?',
        en: 'Can I come in wearing contact lenses?',
      },
      a: {
        ru: 'Да, но возьмите контейнер: перед частью исследований линзы нужно будет снять. Если планируется подбор линз или кератотопография, уточните при записи, за сколько времени их не носить.',
        kk: 'Иә, бірақ контейнерді ала келіңіз: кейбір зерттеулер алдында линзаны алу керек болады. Линза таңдау немесе кератотопография жоспарланса, оларды қанша уақыт тақпау керегін жазылу кезінде нақтылаңыз.',
        en: 'Yes, but bring your lens case: you will need to remove them before some tests. If a lens fitting or corneal topography is planned, ask when booking how long to leave them out beforehand.',
      },
    },
    {
      q: {
        ru: 'Как часто нужно проверять зрение?',
        kk: 'Көруді қаншалықты жиі тексеру керек?',
        en: 'How often should I have my eyes checked?',
      },
      a: {
        ru: 'Это зависит от возраста, состояния глаз и общих заболеваний. Врач подскажет подходящий интервал именно для вас; при внезапном ухудшении зрения обращайтесь, не дожидаясь планового визита.',
        kk: 'Бұл жасқа, көздің жағдайына және жалпы ауруларға байланысты. Дәрігер дәл сізге қолайлы аралықты айтады; көру кенет нашарласа, жоспарлы келуді күтпей жүгініңіз.',
        en: 'It depends on your age, eye health and general conditions. The doctor will suggest an interval that suits you; if your vision suddenly gets worse, come in without waiting for a routine visit.',
      },
    },
  ],
  sources: [
    {
      label: 'National Eye Institute (NEI) — Get a dilated eye exam',
      href: 'https://www.nei.nih.gov/learn-about-eye-health/healthy-vision/get-dilated-eye-exam',
    },
  ],
  topics: ['диагност', 'зрени', 'осмотр', 'офтальмолог'],
};

export default content;
