import type { Localized } from '@/i18n/types';

/**
 * Academy (spec §10): education for ophthalmologists, residents and
 * optometrists, patient schools, events calendar, application form.
 * The centre in Astana is still being prepared (DESIGN.md §7), so programmes
 * and dates are a provisional plan and the page says so; no Event schema is
 * emitted for them. The one verified fact is the founder's teaching role at
 * the Kazakh Research Institute of Eye Diseases.
 */

export type AcademyAudience = 'ophthalmologists' | 'residents' | 'optometrists' | 'patients';

export const AUDIENCES: Array<{ key: AcademyAudience; label: Localized }> = [
  { key: 'ophthalmologists', label: { ru: 'Офтальмологам', kk: 'Офтальмологтарға', en: 'Ophthalmologists' } },
  { key: 'residents', label: { ru: 'Резидентам', kk: 'Резиденттерге', en: 'Residents' } },
  { key: 'optometrists', label: { ru: 'Оптометристам', kk: 'Оптометристерге', en: 'Optometrists' } },
  { key: 'patients', label: { ru: 'Пациентам', kk: 'Пациенттерге', en: 'Patients' } },
];

export const academyCopy = {
  seoTitle: { ru: 'Академия — обучение врачей и пациентов', kk: 'Академия — дәрігерлер мен пациенттерді оқыту', en: 'Academy — education for clinicians and patients' },
  seoDescription: {
    ru: 'Курсы, мастер-классы, wet-lab и журнальный клуб для офтальмологов, резидентов и оптометристов; школы пациентов по глаукоме и детской миопии.',
    kk: 'Офтальмологтар, резиденттер және оптометристерге арналған курстар, шеберлік сыныптары, wet-lab және журнал клубы; глаукома мен балалар миопиясы бойынша пациенттер мектептері.',
    en: 'Courses, masterclasses, wet-labs and a journal club for ophthalmologists, residents and optometrists; patient schools on glaucoma and childhood myopia.',
  },
  heroEyebrow: { ru: 'Образовательная платформа', kk: 'Білім беру платформасы', en: 'Education platform' },
  heroTitle: { ru: 'Академия', kk: 'Академия', en: 'Academy' },
  heroText: {
    ru: 'Образовательная платформа центра в Астане для врачей и пациентов. Программы готовятся к запуску вместе с открытием центра: небольшие группы, практика на симуляторах, разбор клинических ситуаций.',
    kk: 'Астанадағы орталықтың дәрігерлер мен пациенттерге арналған білім беру платформасы. Бағдарламалар орталықтың ашылуымен бірге іске қосуға дайындалуда: шағын топтар, симуляторлардағы практика, клиникалық жағдайларды талдау.',
    en: "The Astana centre's education platform for clinicians and patients. Programmes are being prepared to launch when the centre opens: small groups, simulator practice and clinical case reviews.",
  },
  heroCalendar: { ru: 'Календарь событий', kk: 'Іс-шаралар күнтізбесі', en: 'Events calendar' },
  heroApply: { ru: 'Подать заявку', kk: 'Өтінім беру', en: 'Apply' },

  statement: {
    ru: 'Хорошая медицина передаётся из рук в руки: от хирурга к резиденту, от врача к пациенту, который понимает свою болезнь и перестаёт её бояться.',
    kk: 'Жақсы медицина қолдан-қолға беріледі: хирургтан резидентке, өз ауруын түсініп, одан қорқуды қойған пациентке дәрігерден.',
    en: 'Good medicine is passed from hand to hand: from surgeon to resident, and from doctor to a patient who understands their condition and stops fearing it.',
  },
  statsEyebrow: { ru: 'Формат', kk: 'Формат', en: 'Format' },
  stats: {
    teaching: {
      ru: 'лет преподавания основателя в Казахском НИИ глазных болезней',
      kk: 'жыл — негізін қалаушының Қазақ көз аурулары ҒЗИ-дағы оқытушылық тәжірибесі',
      en: "years of the founder's teaching at the Kazakh Research Institute of Eye Diseases",
    },
    programmes: { ru: 'программ для специалистов в плане', kk: 'мамандарға арналған жоспардағы бағдарлама', en: 'professional programmes planned' },
    schools: { ru: 'школы для пациентов в плане', kk: 'пациенттерге арналған жоспардағы мектеп', en: 'patient schools planned' },
  },
  founderTeaching: {
    ru: 'Доктор Кулмаганбетов — преподаватель и методист кафедры постдипломного образования Казахского НИИ глазных болезней; специализация — цифровые технологии в диагностике болезней глаз.',
    kk: 'Доктор Құлмағанбетов — Қазақ көз аурулары ҒЗИ-ның дипломнан кейінгі білім беру кафедрасының оқытушысы және әдіскері; мамандануы — көз ауруларын анықтаудағы цифрлық технологиялар.',
    en: 'Dr Kulmaganbetov is a lecturer and methodologist in the Department of Postgraduate Education at the Kazakh Research Institute of Eye Diseases, specialising in digital technologies for diagnosing eye disease.',
  },
  founderProfile: { ru: 'Профиль на сайте института', kk: 'Институт сайтындағы профиль', en: 'Profile on the institute website' },
  proText: {
    ru: 'Программы готовятся к запуску вместе с открытием центра; состав, длительность и даты уточняются.',
    kk: 'Бағдарламалар орталықтың ашылуымен бірге іске қосуға дайындалуда; құрамы, ұзақтығы мен күндері нақтыланады.',
    en: 'Programmes are being prepared to launch with the centre; content, length and dates are still being finalised.',
  },

  proEyebrow: { ru: 'Для специалистов', kk: 'Мамандарға', en: 'For professionals' },
  proTitle: { ru: 'Программы для врачей и оптометристов', kk: 'Дәрігерлер мен оптометристерге арналған бағдарламалар', en: 'Programmes for doctors and optometrists' },
  audienceLabel: { ru: 'Для кого', kk: 'Кімге арналған', en: 'Audience' },
  apply: { ru: 'Подать заявку', kk: 'Өтінім беру', en: 'Apply' },

  schoolEyebrow: { ru: 'Школа пациентов', kk: 'Пациенттер мектебі', en: 'Patient school' },
  schoolTitle: { ru: 'Понимать болезнь — значит лучше лечиться', kk: 'Ауруды түсіну — жақсырақ емделу деген сөз', en: 'Understanding a condition means better treatment' },
  schoolText: {
    ru: 'Планируемые бесплатные встречи для пациентов и их близких: вопросы можно будет задавать без стеснения.',
    kk: 'Пациенттер мен олардың жақындарына арналған жоспарланған тегін кездесулер: сұрақтарды еркін қоюға болады.',
    en: 'Planned free sessions for patients and their families — no question will be too small.',
  },

  calendarEyebrow: { ru: 'Календарь', kk: 'Күнтізбе', en: 'Calendar' },
  calendarTitle: { ru: 'Ближайшие события', kk: 'Жақын іс-шаралар', en: 'Upcoming events' },
  calendarNote: {
    ru: 'Предварительный план: очные события пройдут после открытия центра в Астане. Дату, место и наличие мест подтверждает координатор после заявки.',
    kk: 'Алдын ала жоспар: күндізгі іс-шаралар Астанадағы орталық ашылғаннан кейін өтеді. Күнін, орнын және бос орындарды өтінімнен кейін үйлестіруші растайды.',
    en: 'A provisional plan: in-person events will take place once the Astana centre opens. The coordinator confirms the date, venue and availability after you apply.',
  },
  filterAll: { ru: 'Все', kk: 'Барлығы', en: 'All' },
  seats: { ru: 'мест', kk: 'орын', en: 'seats' },
  free: { ru: 'Бесплатно', kk: 'Тегін', en: 'Free' },
  noEvents: {
    ru: 'Для этой аудитории пока нет запланированных событий. Оставьте заявку — мы сообщим о новых датах.',
    kk: 'Бұл аудиторияға әзірге жоспарланған іс-шаралар жоқ. Өтінім қалдырыңыз — жаңа күндер туралы хабарлаймыз.',
    en: 'No events are scheduled for this audience yet. Leave a request and we will let you know about new dates.',
  },

  howEyebrow: { ru: 'Как проходит обучение', kk: 'Оқу қалай өтеді', en: 'How it works' },
  howTitle: { ru: 'От заявки до сертификата', kk: 'Өтінімнен сертификатқа дейін', en: 'From application to certificate' },
  steps: [
    {
      title: { ru: 'Заявка', kk: 'Өтінім', en: 'Application' },
      text: {
        ru: 'Выберите программу и оставьте контакты — координатор уточнит опыт и цели.',
        kk: 'Бағдарламаны таңдап, байланыс деректерін қалдырыңыз — үйлестіруші тәжірибеңіз бен мақсатыңызды нақтылайды.',
        en: 'Choose a programme and leave your details; a coordinator will check your experience and goals.',
      },
    },
    {
      title: { ru: 'Подготовка', kk: 'Дайындық', en: 'Preparation' },
      text: {
        ru: 'Перед очной частью — материалы для самостоятельного изучения.',
        kk: 'Күндізгі бөлімге дейін — өз бетімен оқуға арналған материалдар.',
        en: 'Self-study materials are shared before the in-person part.',
      },
    },
    {
      title: { ru: 'Практика', kk: 'Практика', en: 'Practice' },
      text: {
        ru: 'Разборы случаев, симуляторы и работа под наблюдением наставника.',
        kk: 'Жағдайларды талдау, симуляторлар және тәлімгердің бақылауымен жұмыс.',
        en: 'Case reviews, simulators and supervised hands-on work.',
      },
    },
    {
      title: { ru: 'Сертификат', kk: 'Сертификат', en: 'Certificate' },
      text: {
        ru: 'Документ о прохождении программы центра с указанием часов.',
        kk: 'Сағаттары көрсетілген орталық бағдарламасынан өткені туралы құжат.',
        en: "A certificate of completion from the centre, stating the hours.",
      },
    },
  ],

  formEyebrow: { ru: 'Заявка', kk: 'Өтінім', en: 'Application' },
  formTitle: { ru: 'Записаться на обучение', kk: 'Оқуға жазылу', en: 'Sign up' },
  formText: {
    ru: 'Укажите программу или событие — координатор Академии свяжется с вами, расскажет об условиях и подтвердит место.',
    kk: 'Бағдарламаны немесе іс-шараны көрсетіңіз — Академия үйлестірушісі сізбен хабарласып, шарттар туралы айтып, орынды растайды.',
    en: 'Tell us the programme or event; the Academy coordinator will contact you, explain the terms and confirm your place.',
  },
  formRole: { ru: 'Кто вы', kk: 'Сіз кімсіз', en: 'You are' },
  formProgramme: { ru: 'Программа или событие', kk: 'Бағдарлама немесе іс-шара', en: 'Programme or event' },
  formSubmit: { ru: 'Отправить заявку', kk: 'Өтінім жіберу', en: 'Send application' },
  formComment: { ru: 'Опыт, место работы, вопросы', kk: 'Тәжірибе, жұмыс орны, сұрақтар', en: 'Experience, workplace, questions' },
  roles: [
    { value: 'ophthalmologist', label: { ru: 'Офтальмолог', kk: 'Офтальмолог', en: 'Ophthalmologist' } },
    { value: 'resident', label: { ru: 'Резидент', kk: 'Резидент', en: 'Resident' } },
    { value: 'optometrist', label: { ru: 'Оптометрист', kk: 'Оптометрист', en: 'Optometrist' } },
    { value: 'patient', label: { ru: 'Пациент или родственник', kk: 'Пациент немесе туысы', en: 'Patient or relative' } },
    { value: 'other', label: { ru: 'Другое', kk: 'Басқа', en: 'Other' } },
  ],

  ctaTitle: {
    ru: 'Учитесь у нас — или просто приходите на осмотр',
    kk: 'Бізден үйреніңіз — немесе жай ғана тексеруге келіңіз',
    en: 'Learn with us — or simply come for a check-up',
  },
} as const;

/* ========================================================= PROGRAMMES */

export interface AcademyProgramme {
  id: string;
  audience: AcademyAudience[];
  format: Localized;
  title: Localized;
  text: Localized;
  duration: Localized;
}

export const programmes: AcademyProgramme[] = [
  {
    id: 'phaco-course',
    audience: ['ophthalmologists', 'residents'],
    format: { ru: 'Курс', kk: 'Курс', en: 'Course' },
    title: { ru: 'Факоэмульсификация: от основ к сложным случаям', kk: 'Факоэмульсификация: негіздерден күрделі жағдайларға дейін', en: 'Phacoemulsification: from basics to complex cases' },
    text: {
      ru: 'Этапы операции, настройки оборудования, осложнения и их профилактика, видеоразборы.',
      kk: 'Ота кезеңдері, жабдықты баптау, асқынулар және олардың алдын алу, бейнеталдаулар.',
      en: 'Surgical steps, device settings, complications and their prevention, video reviews.',
    },
    duration: { ru: '5 дней · 40 часов', kk: '5 күн · 40 сағат', en: '5 days · 40 hours' },
  },
  {
    id: 'wetlab',
    audience: ['residents', 'ophthalmologists'],
    format: { ru: 'Wet-lab', kk: 'Wet-lab', en: 'Wet-lab' },
    title: { ru: 'Микрохирургические навыки на симуляторах', kk: 'Симуляторлардағы микрохирургиялық дағдылар', en: 'Microsurgical skills on simulators' },
    text: {
      ru: 'Капсулорексис, разрезы, швы — отработка движений на биологических моделях под контролем наставника.',
      kk: 'Капсулорексис, тіліктер, тігістер — тәлімгердің бақылауымен биологиялық модельдерде қимылдарды жаттықтыру.',
      en: 'Capsulorhexis, incisions and sutures practised on biological models under supervision.',
    },
    duration: { ru: '2 дня · 16 часов', kk: '2 күн · 16 сағат', en: '2 days · 16 hours' },
  },
  {
    id: 'oct-masterclass',
    audience: ['ophthalmologists', 'residents', 'optometrists'],
    format: { ru: 'Мастер-класс', kk: 'Шеберлік сыныбы', en: 'Masterclass' },
    title: { ru: 'Чтение ОКТ сетчатки и зрительного нерва', kk: 'Тор қабық пен көру жүйкесінің ОКТ-сын оқу', en: 'Reading retinal and optic-nerve OCT' },
    text: {
      ru: 'Норма и патология, артефакты, динамика при глаукоме и макулярных заболеваниях.',
      kk: 'Норма мен патология, артефактілер, глаукома мен макулалық аурулар кезіндегі динамика.',
      en: 'Normal and abnormal scans, artefacts, change over time in glaucoma and macular disease.',
    },
    duration: { ru: '1 день · 8 часов', kk: '1 күн · 8 сағат', en: '1 day · 8 hours' },
  },
  {
    id: 'myopia-management',
    audience: ['optometrists', 'ophthalmologists'],
    format: { ru: 'Курс', kk: 'Курс', en: 'Course' },
    title: { ru: 'Контроль миопии у детей', kk: 'Балалардағы миопияны бақылау', en: 'Myopia management in children' },
    text: {
      ru: 'Измерение длины глаза, выбор метода, ортокератология и линзы с периферическим дефокусом, работа с родителями.',
      kk: 'Көз ұзындығын өлшеу, әдісті таңдау, ортокератология және перифериялық дефокусы бар линзалар, ата-аналармен жұмыс.',
      en: 'Axial length measurement, choosing a method, orthokeratology and defocus lenses, working with parents.',
    },
    duration: { ru: '3 дня · 24 часа', kk: '3 күн · 24 сағат', en: '3 days · 24 hours' },
  },
  {
    id: 'journal-club',
    audience: ['residents', 'ophthalmologists', 'optometrists'],
    format: { ru: 'Журнальный клуб', kk: 'Журнал клубы', en: 'Journal club' },
    title: { ru: 'Журнальный клуб: читаем исследования критически', kk: 'Журнал клубы: зерттеулерді сын көзбен оқимыз', en: 'Journal club: reading research critically' },
    text: {
      ru: 'Раз в месяц разбираем свежие статьи: дизайн, статистика, применимость к нашей практике.',
      kk: 'Айына бір рет жаңа мақалаларды талдаймыз: дизайн, статистика, біздің тәжірибеге қолданылуы.',
      en: 'Once a month we dissect new papers: design, statistics and relevance to our practice.',
    },
    duration: { ru: 'Ежемесячно · 2 часа', kk: 'Ай сайын · 2 сағат', en: 'Monthly · 2 hours' },
  },
  {
    id: 'ai-imaging',
    audience: ['ophthalmologists', 'residents'],
    format: { ru: 'Семинар', kk: 'Семинар', en: 'Seminar' },
    title: { ru: 'ИИ в офтальмологии: возможности и ограничения', kk: 'Офтальмологиядағы ЖИ: мүмкіндіктер мен шектеулер', en: 'AI in ophthalmology: possibilities and limits' },
    text: {
      ru: 'Как устроены алгоритмы анализа изображений, как оценивать их качество и где проходит граница ответственности врача.',
      kk: 'Кескінді талдау алгоритмдері қалай құрылған, олардың сапасын қалай бағалау керек және дәрігер жауапкершілігінің шегі қайда.',
      en: "How image-analysis algorithms work, how to judge their quality and where the clinician's responsibility lies.",
    },
    duration: { ru: '1 день · 6 часов', kk: '1 күн · 6 сағат', en: '1 day · 6 hours' },
  },
];

/* ======================================================== PATIENT SCHOOL */

export const patientSchools: Array<{ id: string; title: Localized; text: Localized; points: Record<'ru' | 'kk' | 'en', string[]> }> = [
  {
    id: 'glaucoma-school',
    title: { ru: 'Школа глаукомы', kk: 'Глаукома мектебі', en: 'Glaucoma school' },
    text: {
      ru: 'Как работает давление в глазу, почему капли нужны каждый день и как не пропускать контроль.',
      kk: 'Көздегі қысым қалай жұмыс істейді, тамшылар неге күн сайын қажет және бақылауды қалай өткізіп алмау керек.',
      en: 'How eye pressure works, why drops are needed every day and how not to miss check-ups.',
    },
    points: {
      ru: ['Техника закапывания', 'Дневник давления', 'Вопросы о зрении за рулём'],
      kk: ['Тамызу техникасы', 'Қысым күнделігі', 'Көлік жүргізу кезіндегі көру туралы сұрақтар'],
      en: ['Eye-drop technique', 'Pressure diary', 'Vision and driving'],
    },
  },
  {
    id: 'myopia-parents',
    title: { ru: 'Школа для родителей детей с миопией', kk: 'Миопиясы бар балалардың ата-аналарына арналған мектеп', en: 'School for parents of children with myopia' },
    text: {
      ru: 'Почему глаз растёт, что дают прогулки и режим, как выбрать метод контроля вместе с врачом.',
      kk: 'Көз неге өседі, серуен мен күн тәртібі не береді, дәрігермен бірге бақылау әдісін қалай таңдау керек.',
      en: 'Why the eye grows, what outdoor time and routine achieve, and choosing a control method with the doctor.',
    },
    points: {
      ru: ['Правило двух часов на улице', 'Экраны и чтение', 'Линзы и очки для контроля'],
      kk: ['Далада екі сағат ережесі', 'Экрандар және оқу', 'Бақылауға арналған линзалар мен көзілдірік'],
      en: ['The two-hours-outdoors rule', 'Screens and reading', 'Control lenses and spectacles'],
    },
  },
  {
    id: 'cataract-prep',
    title: { ru: 'Перед операцией катаракты', kk: 'Катаракта отасы алдында', en: 'Before cataract surgery' },
    text: {
      ru: 'Как проходит операция, какие бывают линзы и как вести себя в первые недели после неё.',
      kk: 'Ота қалай өтеді, қандай линзалар болады және отадан кейінгі алғашқы апталарда өзін қалай ұстау керек.',
      en: 'How the operation works, the choice of lenses and what to do in the first weeks afterwards.',
    },
    points: {
      ru: ['Выбор интраокулярной линзы', 'День операции', 'Восстановление'],
      kk: ['Көзішілік линзаны таңдау', 'Ота күні', 'Қалпына келу'],
      en: ['Choosing a lens implant', 'The day of surgery', 'Recovery'],
    },
  },
  {
    id: 'diabetes-eyes',
    title: { ru: 'Диабет и глаза', kk: 'Диабет және көз', en: 'Diabetes and the eyes' },
    text: {
      ru: 'Зачем ежегодный осмотр глазного дна и как сахар и давление влияют на сетчатку.',
      kk: 'Көз түбін жыл сайын тексеру не үшін қажет және қант пен қысым тор қабыққа қалай әсер етеді.',
      en: 'Why a yearly retinal check matters and how blood sugar and pressure affect the retina.',
    },
    points: {
      ru: ['График осмотров', 'Симптомы, требующие визита', 'Лечение без страха'],
      kk: ['Тексеру кестесі', 'Қабылдауды қажет ететін белгілер', 'Қорқынышсыз ем'],
      en: ['Check-up schedule', 'Symptoms that need a visit', 'Treatment without fear'],
    },
  },
];

/* ================================================================ EVENTS */

export interface AcademyEvent {
  id: string;
  /** ISO date. */
  date: string;
  time: string;
  audience: AcademyAudience[];
  format: Localized;
  title: Localized;
  place: Localized;
  seats?: number;
  free?: boolean;
}

export const events: AcademyEvent[] = [
  {
    id: 'ev-oct-oct',
    date: '2026-10-17',
    time: '10:00',
    audience: ['ophthalmologists', 'residents', 'optometrists'],
    format: { ru: 'Мастер-класс', kk: 'Шеберлік сыныбы', en: 'Masterclass' },
    title: { ru: 'Чтение ОКТ сетчатки и зрительного нерва', kk: 'Тор қабық пен көру жүйкесінің ОКТ-сын оқу', en: 'Reading retinal and optic-nerve OCT' },
    place: { ru: 'Астана, центр (после открытия)', kk: 'Астана, орталық (ашылғаннан кейін)', en: 'Astana, the centre (once open)' },
    seats: 20,
  },
  {
    id: 'ev-glaucoma-school',
    date: '2026-10-24',
    time: '11:00',
    audience: ['patients'],
    format: { ru: 'Школа пациентов', kk: 'Пациенттер мектебі', en: 'Patient school' },
    title: { ru: 'Школа глаукомы: капли, давление, контроль', kk: 'Глаукома мектебі: тамшылар, қысым, бақылау', en: 'Glaucoma school: drops, pressure, follow-up' },
    place: { ru: 'Астана и онлайн', kk: 'Астана және онлайн', en: 'Astana and online' },
    free: true,
  },
  {
    id: 'ev-journal-nov',
    date: '2026-11-05',
    time: '18:30',
    audience: ['residents', 'ophthalmologists', 'optometrists'],
    format: { ru: 'Журнальный клуб', kk: 'Журнал клубы', en: 'Journal club' },
    title: { ru: 'Журнальный клуб: ИИ в скрининге сетчатки', kk: 'Журнал клубы: тор қабық скринингіндегі ЖИ', en: 'Journal club: AI in retinal screening' },
    place: { ru: 'Онлайн', kk: 'Онлайн', en: 'Online' },
    free: true,
  },
  {
    id: 'ev-wetlab-nov',
    date: '2026-11-14',
    time: '09:00',
    audience: ['residents', 'ophthalmologists'],
    format: { ru: 'Wet-lab', kk: 'Wet-lab', en: 'Wet-lab' },
    title: { ru: 'Wet-lab: капсулорексис и разрезы', kk: 'Wet-lab: капсулорексис және тіліктер', en: 'Wet-lab: capsulorhexis and incisions' },
    place: { ru: 'Астана, центр (после открытия)', kk: 'Астана, орталық (ашылғаннан кейін)', en: 'Astana, the centre (once open)' },
    seats: 8,
  },
  {
    id: 'ev-myopia-parents',
    date: '2026-11-21',
    time: '11:00',
    audience: ['patients'],
    format: { ru: 'Школа пациентов', kk: 'Пациенттер мектебі', en: 'Patient school' },
    title: { ru: 'Родителям: как замедлить близорукость у ребёнка', kk: 'Ата-аналарға: баладағы миопияны қалай баяулатуға болады', en: "For parents: slowing a child's myopia" },
    place: { ru: 'Астана и онлайн', kk: 'Астана және онлайн', en: 'Astana and online' },
    free: true,
  },
  {
    id: 'ev-myopia-course',
    date: '2026-12-03',
    time: '10:00',
    audience: ['optometrists', 'ophthalmologists'],
    format: { ru: 'Курс', kk: 'Курс', en: 'Course' },
    title: { ru: 'Контроль миопии у детей — трёхдневный курс', kk: 'Балалардағы миопияны бақылау — үш күндік курс', en: 'Myopia management in children — three-day course' },
    place: { ru: 'Астана, центр (после открытия)', kk: 'Астана, орталық (ашылғаннан кейін)', en: 'Astana, the centre (once open)' },
    seats: 16,
  },
  {
    id: 'ev-ai-seminar',
    date: '2026-12-12',
    time: '10:00',
    audience: ['ophthalmologists', 'residents'],
    format: { ru: 'Семинар', kk: 'Семинар', en: 'Seminar' },
    title: { ru: 'ИИ в офтальмологии: возможности и ограничения', kk: 'Офтальмологиядағы ЖИ: мүмкіндіктер мен шектеулер', en: 'AI in ophthalmology: possibilities and limits' },
    place: { ru: 'Астана и онлайн', kk: 'Астана және онлайн', en: 'Astana and online' },
    seats: 40,
  },
];
