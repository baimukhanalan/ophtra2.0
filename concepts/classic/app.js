/* ===== Names of the doctor and the centre, per language: change here, in one place. ===== */
var BRAND = { ru: 'доктор Кулмаганбетов', kk: 'доктор Кұлмағанбетов', en: 'Dr Kulmaganbetov' };
var CENTER = {
  ru: 'Офтальмологический центр доктора Кулмаганбетова',
  kk: 'Доктор Кұлмағанбетов офтальмологиялық орталығы',
  en: 'Ophthalmic Centre of Dr Kulmaganbetov'
};
var DOCTOR = { ru: 'Мухит Аскарович Кулмаганбетов', kk: 'Мұхит Асқарұлы Кұлмағанбетов', en: 'Dr Mukhit Kulmaganbetov' };
/* The only verified contact channel so far (also used in JSON-LD sameAs). */
var THREADS_URL = 'https://www.threads.com/@mukhit_kulmaganbetov';
/* Max size of one uploaded file (Second opinion form). Not set by the TZ; adjust as needed. */
var MAX_FILE_MB = 10;

(function () {
  'use strict';

  /* Russian is the base text and is read from index.html at start-up.
     KK and EN below are translations of the same texts. {brand}/{Brand}/{center}/{doctor} are replaced by the constants. */
  var T = {
    en: {
      'meta.title': '{center} — A new era of eye care begins in Kazakhstan',
      'meta.desc': 'World-class ophthalmic science. Advanced eye care. A healthier future.',
      'skip': 'Skip to content', 'lang.label': 'Language', 'nav.label': 'Site sections', 'nav.menu': 'Sections',
      'nav.about': 'About the center', 'nav.services': 'Medical services', 'nav.science': 'Science and innovation',
      'nav.intl': 'International patients', 'nav.academy': 'Academy', 'nav.experts': 'Global expert network',
      'nav.knowledge': 'Knowledge base', 'nav.media': 'Media center', 'nav.partners': 'Partnerships', 'nav.contacts': 'Contacts',
      'hero.h1': 'A new era of eye care begins in Kazakhstan',
      'hero.lead': 'World-class ophthalmic science. Advanced eye care. A healthier future.',
      'cta.consult': 'Book a consultation', 'cta.intl': 'International patients', 'cta.second': 'Get a second opinion',
      'why.h2': 'Why {brand}?', 'why.1': 'Global experience', 'why.2': 'Scientific expertise', 'why.3': 'Patient care',
      'mission.h2': 'Our mission', 'mission.q': '“Preventing blindness and preserving vision for future generations.”',
      'centers.h2': 'Centers of excellence', 'centers.lead': 'The center’s main areas:',
      'c1.t': 'Center for the Prevention of Vision Disorders', 'c1.d': 'Early diagnosis and prevention.',
      'c2.t': 'Advanced Ophthalmic Surgery', 'c2.d': 'Modern surgical treatment.',
      'c3.t': 'Retina and Macula Disease Center', 'c3.d': 'Diagnosis and treatment of retinal and macular diseases.',
      'c4.t': 'Pediatric Ophthalmology Center', 'c4.d': 'Pediatric ophthalmology.',
      'c5.t': 'Science and Innovation Laboratory', 'c5.d': 'Science and innovation.',
      'experts.h2': 'Global expert network', 'experts.p': 'This is an international-level center.',
      'note.later': 'Section content will be added.', 'note.info': 'Information will be added.',
      'note.contacts': 'Contact details will be added.', 'note.materials': 'Materials will be added.',
      'stories.h2': 'Patient stories', 'stories.p': 'Building emotional trust through real patient stories.',
      'knowledge.h2': 'Knowledge base', 'knowledge.p': 'Goal: to become the No. 1 information platform on eye health in Kazakhstan.',
      'knowledge.search': 'Search sections', 'knowledge.ph': 'e.g. glaucoma', 'knowledge.reset': 'Clear',
      'knowledge.empty': 'Nothing found. Try another query.',
      'k1.t': 'Children’s vision', 'k1.d': 'A section for parents.',
      'k2.t': 'Eye health after 40', 'k2.d': 'Vision health after the age of 40.',
      'k3.t': 'Cataract and refractive surgery', 'k4.t': 'Retina and macula health',
      'k5.t': 'Glaucoma', 'k5.d': 'Complete information about glaucoma.',
      'k6.t': 'Disease library', 'k6.d': 'An encyclopedia of eye diseases.',
      'k7.t': 'Research in plain language', 'k7.d': 'Scientific news explained in plain language.',
      'k8.t': 'Prevention of eye diseases',
      'about.h2': 'About the center',
      'about.p': 'Welcome to a world-class scientific ophthalmology center dedicated to preserving and improving vision.',
      'about.h3': 'Areas', 'a1': 'Healthcare', 'a2': 'Science', 'a3': 'Education', 'a4': 'International patient services', 'a5': 'Medical tourism',
      'doctor.p': 'The scientist behind the mission to preserve vision',
      'd1': 'Scientific path', 'd2': 'Global experience', 'd3': 'Research focus', 'd4': 'Vision for Kazakhstan',
      'd5': 'Publications', 'd6': 'Awards', 'd7': 'Conferences', 'd8': 'Media and talks',
      'services.h2': 'Medical services', 'services.p': 'Each service page includes:',
      's1': 'Overview', 's2': 'Indications for treatment', 's3': 'Diagnostics', 's4': 'Treatment options',
      's5': 'FAQ', 's6': 'Related articles', 's7': 'Consultation booking form',
      'science.h2': 'Science and innovation',
      'sc1': 'Research projects', 'sc2': 'Publications', 'sc3': 'Clinical research', 'sc4': 'Innovation programs',
      'sc5': 'Collaboration', 'sc6': 'Research reports',
      'intl.h2': 'International patients', 'intl.p': 'Goal: minimizing all barriers for international patients.',
      'intl.kz.h3': 'Why Kazakhstan?', 'intl.kz.p': 'Advantages of treatment in Kazakhstan.',
      'intl.center.h3': 'Why our center?', 'intl.center.p': 'Features of the center.',
      'intl.path.h3': 'Patient treatment path',
      'p1': 'Online application', 'p2': 'Medical review', 'p3': 'Treatment plan', 'p4': 'Travel arrangements',
      'p5': 'Treatment', 'p6': 'Post-treatment follow-up',
      'intl.travel.h3': 'Travel information', 't1': 'Visa support', 't2': 'Accommodation', 't3': 'Transport', 't4': 'Translation services',
      'intl.cost.h3': 'Cost estimate', 'intl.lang.h3': 'Languages',
      'l1': 'English', 'l2': 'Russian', 'l3': 'Kazakh', 'l4': 'Arabic — at the next stage',
      'intl.coord.h3': 'International coordinator', 'intl.form.h3': 'Online application form',
      'second.h2': 'Second opinion', 'second.p': 'Many patients come to us saying: “I need a second medical opinion.”',
      'second.proc': 'Process', 'so1': 'The patient sends medical documents.', 'so2': 'Specialists review them.',
      'so3': 'A medical opinion is provided.', 'so4': 'If necessary, the patient is invited to Kazakhstan.',
      'second.adv.h3': 'Advantage', 'second.adv': 'Contact with the patient begins before geography becomes a question.',
      'second.formats': 'Supported file formats: PDF, JPG, PNG.', 'second.form.h3': 'Send documents',
      'consult.h2': 'Online consultations', 'consult.p': 'A service for international patients.',
      'oc1': 'The patient submits a request.', 'oc2': 'A medical coordinator contacts the patient.',
      'oc3': 'An online consultation takes place.', 'oc4': 'An individual treatment plan is provided.', 'oc5': 'A clinic visit is arranged.',
      'academy.h2': 'Academy', 'academy.p': 'Research and education platform.',
      'media.h2': 'Media center', 'm1': 'News', 'm2': 'Press releases', 'm3': 'Interviews', 'm4': 'Videos', 'm5': 'Podcasts', 'm6': 'Events',
      'partners.h2': 'Partnerships', 'pa1': 'Building connections with the scientific community.',
      'pa2': 'Information for investors and strategic partners.',
      'contacts.h2': 'Contacts', 'contacts.form.h3': 'Write to us',
      'f.req': '* required fields', 'f.name': 'Name', 'f.contact': 'Phone or email', 'f.country': 'Country',
      'f.service': 'Service of interest', 'f.choose': 'Select', 'f.diagnosis': 'Diagnosis (if known)', 'f.message': 'Message',
      'f.platform': 'Consultation platform', 'f.files': 'Medical documents',
      'f.files.hint': 'PDF, JPG or PNG, up to {mb} MB per file.',
      'f.consent': 'I agree to the processing of my personal data.',
      'f.submit': 'Submit application', 'f.submit.docs': 'Send documents', 'f.submit.consult': 'Book', 'f.submit.msg': 'Send message',
      'svc.second': 'Second opinion', 'svc.online': 'Online consultation', 'footer.top': 'Back to top',
      /* Verified facts about the centre and the doctor */
      'why.1.d': 'PhD in Vision Sciences (Cardiff University, UK). The doctor’s device has been tested in clinics in Hong Kong and Canada.',
      'why.2.d': 'A quantum-optics device for early detection of age-related macular degeneration: 200 patients examined, patent received. Three co-authored scientific publications in 2026.',
      'why.3.d': 'The doctor’s specialisation: digital technologies for early and accurate diagnosis of eye diseases.',
      'experts.d': 'Dr Kulmaganbetov’s work has drawn interest from specialists in the USA, Europe, China, Canada and Japan. The device he developed has been tested in clinics in Hong Kong and Canada.',
      'about.center': 'A new ophthalmology center in Astana for clinical work and innovation projects.',
      'doctor.role': 'Scientist and ophthalmologist.',
      'd1.1': 'MD in Ophthalmology.', 'd1.2': 'PhD in Vision Sciences, Cardiff University, UK.',
      'd1.3': 'AFHEA (Associate Fellow of the Higher Education Academy).',
      'd1.4': 'Lecturer and methodologist, Department of Postgraduate Education, Kazakh Research Institute of Eye Diseases.',
      'd1.5': '6 years of professional experience.',
      'd2.1': 'The device for early detection of age-related macular degeneration has been tested in clinics in Hong Kong and Canada.',
      'd2.2': 'His work has drawn interest from specialists in the USA, Europe, China, Canada and Japan.',
      'r1': 'Quantum optics for early detection of age-related macular degeneration: a device developed, 200 patients examined, patent received.',
      'r2': 'A quantum-optics technology for diagnosing and treating myopia, at the animal-study stage.',
      'd3.3': 'Digital technologies in the diagnosis of eye diseases.',
      'pubs.p': 'Co-authored publications, 2026:',
      'd8.1': 'A report on the doctor’s work on 24.kz:',
      'd8.2': 'The doctor publishes articles and videos on Threads:',
      'a11y.newtab': '(opens in a new tab)',
      'contacts.city.l': 'City:', 'contacts.city': 'Astana',
      'note.address': 'Address, phone and e-mail will be added.'
    },
    kk: {
      'meta.title': '{center} — Көз саулығына қамқорлықтың жаңа дәуірі Қазақстанда басталады',
      'meta.desc': 'Әлемдік деңгейдегі офтальмология ғылымы. Көру қабілетіне озық қамқорлық. Салауатты болашақ.',
      'skip': 'Мазмұнға өту', 'lang.label': 'Тіл', 'nav.label': 'Сайт бөлімдері', 'nav.menu': 'Бөлімдер',
      'nav.about': 'Орталық туралы', 'nav.services': 'Медициналық қызметтер', 'nav.science': 'Ғылым және инновациялар',
      'nav.intl': 'Халықаралық пациенттер', 'nav.academy': 'Академия', 'nav.experts': 'Жаһандық сарапшылар желісі',
      'nav.knowledge': 'Білім базасы', 'nav.media': 'Медиаорталық', 'nav.partners': 'Серіктестік', 'nav.contacts': 'Байланыс',
      'hero.h1': 'Көз саулығына қамқорлықтың жаңа дәуірі Қазақстанда басталады',
      'hero.lead': 'Әлемдік деңгейдегі офтальмология ғылымы. Көру қабілетіне озық қамқорлық. Салауатты болашақ.',
      'cta.consult': 'Консультацияға жазылу', 'cta.intl': 'Халықаралық пациенттер', 'cta.second': 'Екінші пікір алу',
      'why.h2': 'Неліктен {brand}?', 'why.1': 'Жаһандық тәжірибе', 'why.2': 'Ғылыми сараптама', 'why.3': 'Пациентке қамқорлық',
      'mission.h2': 'Біздің миссиямыз', 'mission.q': '«Соқырлықтың алдын алу және болашақ ұрпақ үшін көру қабілетін сақтау.»',
      'centers.h2': 'Озық тәжірибе орталықтары', 'centers.lead': 'Орталықтың негізгі бағыттары:',
      'c1.t': 'Көру бұзылыстарының алдын алу орталығы', 'c1.d': 'Ерте диагностика және алдын алу.',
      'c2.t': 'Озық офтальмологиялық хирургия', 'c2.d': 'Заманауи хирургиялық емдеу.',
      'c3.t': 'Торқабық және макула аурулары орталығы', 'c3.d': 'Торқабық пен макула ауруларын диагностикалау және емдеу.',
      'c4.t': 'Балалар офтальмологиясы орталығы', 'c4.d': 'Балалар офтальмологиясы.',
      'c5.t': 'Ғылым және инновациялар зертханасы', 'c5.d': 'Ғылым және инновациялар.',
      'experts.h2': 'Жаһандық сарапшылар желісі', 'experts.p': 'Бұл — халықаралық деңгейдегі орталық.',
      'note.later': 'Бөлімнің мазмұны кейін қосылады.', 'note.info': 'Ақпарат кейін қосылады.',
      'note.contacts': 'Байланыс деректері кейін қосылады.', 'note.materials': 'Материалдар кейін қосылады.',
      'stories.h2': 'Пациенттердің тарихы', 'stories.p': 'Пациенттердің нақты тарихы арқылы эмоционалдық сенім қалыптастыру.',
      'knowledge.h2': 'Білім базасы', 'knowledge.p': 'Мақсат — Қазақстандағы көз саулығы бойынша №1 ақпараттық платформа болу.',
      'knowledge.search': 'Бөлімдер бойынша іздеу', 'knowledge.ph': 'Мысалы, глаукома', 'knowledge.reset': 'Тазарту',
      'knowledge.empty': 'Ештеңе табылмады. Басқа сұрау енгізіп көріңіз.',
      'k1.t': 'Балалардың көруі', 'k1.d': 'Ата-аналарға арналған бөлім.',
      'k2.t': '40 жастан кейінгі көз саулығы', 'k2.d': '40 жастан кейінгі көру саулығы.',
      'k3.t': 'Катаракта және рефракциялық хирургия', 'k4.t': 'Торқабық пен макула саулығы',
      'k5.t': 'Глаукома', 'k5.d': 'Глаукома туралы толық ақпарат.',
      'k6.t': 'Аурулар кітапханасы', 'k6.d': 'Көз аурулары энциклопедиясы.',
      'k7.t': 'Зерттеулер қарапайым тілмен', 'k7.d': 'Ғылыми жаңалықтарды қарапайым тілмен түсіндіру.',
      'k8.t': 'Көз ауруларының алдын алу',
      'about.h2': 'Орталық туралы',
      'about.p': 'Көру қабілетін сақтауға және жақсартуға арналған әлемдік деңгейдегі ғылыми-офтальмологиялық орталыққа қош келдіңіз.',
      'about.h3': 'Бағыттар', 'a1': 'Денсаулық сақтау', 'a2': 'Ғылым', 'a3': 'Білім беру', 'a4': 'Халықаралық пациенттерге қызмет көрсету', 'a5': 'Медициналық туризм',
      'doctor.p': 'Көру қабілетін сақтау миссиясының артындағы ғалым',
      'd1': 'Ғылыми жол', 'd2': 'Жаһандық тәжірибе', 'd3': 'Зерттеу бағыты', 'd4': 'Қазақстанға арналған пайым',
      'd5': 'Жарияланымдар', 'd6': 'Марапаттар', 'd7': 'Конференциялар', 'd8': 'Медиа және баяндамалар',
      'services.h2': 'Медициналық қызметтер', 'services.p': 'Әр қызмет беті мыналарды қамтиды:',
      's1': 'Шолу', 's2': 'Емдеуге көрсеткіштер', 's3': 'Диагностика', 's4': 'Емдеу нұсқалары',
      's5': 'Жиі қойылатын сұрақтар (FAQ)', 's6': 'Ұқсас мақалалар', 's7': 'Консультацияға жазылу формасы',
      'science.h2': 'Ғылым және инновациялар',
      'sc1': 'Ғылыми жобалар', 'sc2': 'Жарияланымдар', 'sc3': 'Клиникалық зерттеулер', 'sc4': 'Инновациялық бағдарламалар',
      'sc5': 'Ынтымақтастық', 'sc6': 'Ғылыми есептер',
      'intl.h2': 'Халықаралық пациенттер', 'intl.p': 'Мақсат — шетелдік пациент үшін барлық кедергілерді барынша азайту.',
      'intl.kz.h3': 'Неге Қазақстан?', 'intl.kz.p': 'Қазақстанда емделудің артықшылықтары.',
      'intl.center.h3': 'Неге біздің орталық?', 'intl.center.p': 'Орталықтың ерекшеліктері.',
      'intl.path.h3': 'Пациентті емдеу жолы',
      'p1': 'Онлайн-өтінім', 'p2': 'Медициналық қарау', 'p3': 'Емдеу жоспары', 'p4': 'Сапарды ұйымдастыру',
      'p5': 'Емдеу', 'p6': 'Емнен кейінгі бақылау',
      'intl.travel.h3': 'Сапар туралы ақпарат', 't1': 'Визалық қолдау', 't2': 'Тұрғын үй', 't3': 'Көлік', 't4': 'Аударма қызметтері',
      'intl.cost.h3': 'Құнын есептеу', 'intl.lang.h3': 'Тілдер',
      'l1': 'Ағылшын тілі', 'l2': 'Орыс тілі', 'l3': 'Қазақ тілі', 'l4': 'Араб тілі — келесі кезеңде',
      'intl.coord.h3': 'Халықаралық үйлестіруші', 'intl.form.h3': 'Онлайн өтінім формасы',
      'second.h2': 'Екінші пікір', 'second.p': 'Көптеген пациенттер: «Маған екінші медициналық пікір қажет» деп жүгінеді.',
      'second.proc': 'Үдеріс', 'so1': 'Пациент медициналық құжаттарын жібереді.', 'so2': 'Мамандар оларды қарайды.',
      'so3': 'Қорытынды беріледі.', 'so4': 'Қажет болған жағдайда пациент Қазақстанға шақырылады.',
      'second.adv.h3': 'Артықшылығы', 'second.adv': 'Пациентпен байланыс география мәселесінен бұрын басталады.',
      'second.formats': 'Қолдау көрсетілетін файл форматтары: PDF, JPG, PNG.', 'second.form.h3': 'Құжаттарды жіберу',
      'consult.h2': 'Онлайн-консультациялар', 'consult.p': 'Халықаралық пациенттерге арналған қызмет.',
      'oc1': 'Пациент өтінім береді.', 'oc2': 'Медициналық үйлестіруші пациентпен байланысады.',
      'oc3': 'Онлайн-консультация өткізіледі.', 'oc4': 'Жеке емдеу жоспары беріледі.', 'oc5': 'Клиникаға бару ұйымдастырылады.',
      'academy.h2': 'Академия', 'academy.p': 'Ғылыми-білім беру платформасы.',
      'media.h2': 'Медиаорталық', 'm1': 'Жаңалықтар', 'm2': 'Баспасөз релиздері', 'm3': 'Сұхбаттар', 'm4': 'Бейнелер', 'm5': 'Подкасттар', 'm6': 'Іс-шаралар',
      'partners.h2': 'Серіктестік', 'pa1': 'Ғылыми қауымдастықпен байланыс орнату.',
      'pa2': 'Инвесторлар мен стратегиялық серіктестерге арналған ақпарат.',
      'contacts.h2': 'Байланыс', 'contacts.form.h3': 'Бізге жазу',
      'f.req': '* — міндетті өрістер', 'f.name': 'Аты-жөні', 'f.contact': 'Телефон немесе email', 'f.country': 'Ел',
      'f.service': 'Қызықтыратын қызмет', 'f.choose': 'Таңдаңыз', 'f.diagnosis': 'Диагноз (белгілі болса)', 'f.message': 'Хабарлама',
      'f.platform': 'Консультация платформасы', 'f.files': 'Медициналық құжаттар',
      'f.files.hint': 'PDF, JPG немесе PNG, әр файл {mb} МБ-тан аспауы керек.',
      'f.consent': 'Дербес деректерімді өңдеуге келісемін.',
      'f.submit': 'Өтінім жіберу', 'f.submit.docs': 'Құжаттарды жіберу', 'f.submit.consult': 'Жазылу', 'f.submit.msg': 'Хабарлама жіберу',
      'svc.second': 'Екінші пікір', 'svc.online': 'Онлайн-консультация', 'footer.top': 'Жоғарыға',
      /* Verified facts about the centre and the doctor */
      'why.1.d': 'Көру туралы ғылымдар саласындағы PhD (Кардифф университеті, Ұлыбритания). Дәрігердің әзірлемесі Гонконг пен Канада клиникаларында сынақтан өтті.',
      'why.2.d': 'Жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған кванттық-оптикалық құрылғы: 200 пациент тексерілді, патент алынды. 2026 жылы бірлескен авторлықпен үш ғылыми жарияланым.',
      'why.3.d': 'Дәрігердің мамандануы — көз ауруларын ерте әрі нақты диагностикалауға арналған цифрлық технологиялар.',
      'experts.d': 'Доктор Кұлмағанбетовтің жұмыстары АҚШ, Еуропа, Қытай, Канада және Жапония мамандарының қызығушылығын тудырды. Ол әзірлеген құрылғы Гонконг пен Канада клиникаларында сынақтан өтті.',
      'about.center': 'Астанадағы клиникалық жұмыс пен инновациялық жобаларға арналған жаңа офтальмологиялық орталық.',
      'doctor.role': 'Ғалым және офтальмолог дәрігер.',
      'd1.1': 'Офтальмология саласындағы MD.', 'd1.2': 'Көру туралы ғылымдар (Vision Sciences) саласындағы PhD, Кардифф университеті, Ұлыбритания.',
      'd1.3': 'AFHEA (Associate Fellow of the Higher Education Academy).',
      'd1.4': 'Қазақ көз аурулары ғылыми-зерттеу институтының жоғары оқу орнынан кейінгі білім беру бөлімінің оқытушысы және әдіскері.',
      'd1.5': 'Кәсіби тәжірибесі — 6 жыл.',
      'd2.1': 'Жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған құрылғы Гонконг пен Канада клиникаларында сынақтан өтті.',
      'd2.2': 'Жұмыстары АҚШ, Еуропа, Қытай, Канада және Жапония мамандарының қызығушылығын тудырды.',
      'r1': 'Жасқа байланысты макулалық дегенерацияны ерте анықтауға арналған кванттық оптика: құрылғы әзірленді, 200 пациент тексерілді, патент алынды.',
      'r2': 'Миопияны диагностикалау мен емдеуге арналған кванттық-оптикалық технология — жануарларға жүргізілетін зерттеулер кезеңінде.',
      'd3.3': 'Көз ауруларын диагностикалаудағы цифрлық технологиялар.',
      'pubs.p': '2026 жылғы бірлескен авторлықпен жарияланымдар:',
      'd8.1': '24.kz-тегі дәрігердің әзірлемелері туралы материал:',
      'd8.2': 'Дәрігер мақалалары мен бейнелерін Threads-те жариялайды:',
      'a11y.newtab': '(жаңа қойындыда ашылады)',
      'contacts.city.l': 'Қала:', 'contacts.city': 'Астана',
      'note.address': 'Мекенжай, телефон және e-mail кейін қосылады.'
    }
  };

  /* Messages generated by the script (not present in the HTML), in all three languages. */
  var M = {
    ru: {
      required: 'Заполните это поле.', select: 'Выберите вариант.',
      contact: 'Укажите телефон (не менее 7 цифр) или корректный email.',
      consent: 'Необходимо согласие на обработку данных.', files: 'Прикрепите хотя бы один файл.',
      fileType: 'Файл «{name}» не поддерживается. Допустимы только PDF, JPG, PNG.',
      fileSize: 'Файл «{name}» больше {mb} МБ.',
      summary: 'Проверьте отмеченные поля.',
      ok: 'Форма заполнена верно. Отправка в CRM пока не подключена — данные никуда не отправлены и не сохранены.',
      count: 'Найдено: {n} из {total}'
    },
    en: {
      required: 'Please fill in this field.', select: 'Please choose an option.',
      contact: 'Enter a phone number (at least 7 digits) or a valid email.',
      consent: 'Consent to data processing is required.', files: 'Attach at least one file.',
      fileType: 'File “{name}” is not supported. Only PDF, JPG, PNG are allowed.',
      fileSize: 'File “{name}” is larger than {mb} MB.',
      summary: 'Please check the marked fields.',
      ok: 'The form is filled in correctly. Sending to the CRM is not connected yet — your data has not been sent or stored anywhere.',
      count: 'Found: {n} of {total}'
    },
    kk: {
      required: 'Бұл өрісті толтырыңыз.', select: 'Нұсқаны таңдаңыз.',
      contact: 'Телефон нөмірін (кемінде 7 цифр) немесе дұрыс email енгізіңіз.',
      consent: 'Деректерді өңдеуге келісім қажет.', files: 'Кемінде бір файл тіркеңіз.',
      fileType: '«{name}» файлына қолдау көрсетілмейді. Тек PDF, JPG, PNG рұқсат етіледі.',
      fileSize: '«{name}» файлы {mb} МБ-тан үлкен.',
      summary: 'Белгіленген өрістерді тексеріңіз.',
      ok: 'Форма дұрыс толтырылды. CRM-ге жіберу әлі қосылмаған — деректер ешқайда жіберілмеді және сақталмады.',
      count: 'Табылды: {n} / {total}'
    }
  };

  var LANGS = ['kk', 'ru', 'en'];
  var lang = 'ru';
  var metaDesc = document.querySelector('meta[name="description"]');

  /* {brand}, {Brand} (capitalised), {center}, {doctor}: names in the current language. */
  function name(k) {
    if (k === 'Brand') { var b = BRAND[lang]; return b.charAt(0).toUpperCase() + b.slice(1); }
    var src = { brand: BRAND, center: CENTER, doctor: DOCTOR }[k];
    return src ? src[lang] : null;
  }
  function fill(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      if (name(k) != null) return '<span data-name="' + k + '"></span>';
      return vars && k in vars ? vars[k] : m;
    });
  }
  function plain(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      if (name(k) != null) return name(k);
      return vars && k in vars ? vars[k] : m;
    });
  }
  function msg(key, vars) { return plain(M[lang][key], vars); }

  /* Capture the Russian base text from the HTML. */
  var RU = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (!(k in RU)) RU[k] = el.innerHTML.replace(/<span data-name="(\w+)">[^<]*<\/span>/g, '{$1}');
  });
  RU['f.files.hint'] = 'PDF, JPG или PNG, не более {mb} МБ каждый файл.';
  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { RU[el.getAttribute('data-i18n-ph')] = el.getAttribute('placeholder'); });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { RU[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });
  RU['meta.title'] = '{center} — Новая эра заботы о зрении начинается в Казахстане';
  RU['meta.desc'] = metaDesc.getAttribute('content');
  T.ru = RU;

  function t(k) { return (T[lang] && T[lang][k] != null) ? T[lang][k] : RU[k]; }

  function applyBrand() {
    document.querySelectorAll('[data-name]').forEach(function (el) {
      var v = name(el.getAttribute('data-name'));
      if (v != null) el.textContent = v;
    });
    var ld = document.getElementById('ld-org');
    if (ld) ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'MedicalOrganization', name: CENTER[lang],
      address: { '@type': 'PostalAddress', addressLocality: { ru: 'Астана', kk: 'Астана', en: 'Astana' }[lang], addressCountry: 'KZ' },
      founder: { '@type': 'Physician', name: DOCTOR[lang] },
      sameAs: [THREADS_URL]
    });
  }

  function setLang(next) {
    if (LANGS.indexOf(next) < 0) next = 'ru';
    lang = next;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.innerHTML = fill(t(el.getAttribute('data-i18n')), { mb: MAX_FILE_MB });
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    applyBrand();
    document.title = plain(t('meta.title'));
    metaDesc.setAttribute('content', plain(t('meta.desc')));
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    /* Re-render validation messages and status in the new language. */
    document.querySelectorAll('form.form').forEach(function (f) {
      if (f.dataset.validated) validate(f, false);
      var st = f.querySelector('.form-status');
      if (st.classList.contains('is-ok')) st.textContent = msg('ok');
    });
    filterKnowledge();
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage unavailable */ }
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* Navigation: collapsed on narrow screens, always open on wide ones. */
  var nav = document.getElementById('nav');
  var wide = window.matchMedia('(min-width: 960px)');
  function syncNav() { nav.open = wide.matches; }
  syncNav();
  if (wide.addEventListener) wide.addEventListener('change', syncNav);
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a') && !wide.matches) nav.open = false;
  });

  /* Knowledge base search. */
  var kInput = document.getElementById('k-search');
  var kItems = Array.prototype.slice.call(document.querySelectorAll('#k-list > li'));
  var kCount = document.getElementById('k-count');
  var kEmpty = document.getElementById('k-empty');
  function norm(s) { return s.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim(); }
  function filterKnowledge() {
    var q = norm(kInput.value);
    var n = 0;
    kItems.forEach(function (li) {
      var hit = !q || norm(li.textContent).indexOf(q) >= 0;
      li.hidden = !hit;
      if (hit) n++;
    });
    kEmpty.hidden = n > 0;
    kCount.textContent = q ? msg('count', { n: n, total: kItems.length }) : '';
  }
  kInput.addEventListener('input', filterKnowledge);
  document.getElementById('k-reset').addEventListener('click', function () {
    kInput.value = ''; filterKnowledge(); kInput.focus();
  });

  /* Forms: client-side validation only. Nothing is sent anywhere. */
  var ALLOWED_EXT = ['pdf', 'jpg', 'jpeg', 'png'];
  var ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];

  function fieldError(el) {
    if (el.disabled || el.closest('.hp')) return '';
    var v = (el.value || '').trim();
    if (el.type === 'checkbox') return el.required && !el.checked ? msg('consent') : '';
    if (el.type === 'file') {
      var files = Array.prototype.slice.call(el.files || []);
      if (!files.length) return el.required ? msg('files') : '';
      for (var i = 0; i < files.length; i++) {
        var f = files[i];
        var ext = (f.name.split('.').pop() || '').toLowerCase();
        if (ALLOWED_EXT.indexOf(ext) < 0 || (f.type && ALLOWED_MIME.indexOf(f.type) < 0)) return msg('fileType', { name: f.name });
        if (f.size > MAX_FILE_MB * 1024 * 1024) return msg('fileSize', { name: f.name, mb: MAX_FILE_MB });
      }
      return '';
    }
    if (el.required && !v) return el.tagName === 'SELECT' ? msg('select') : msg('required');
    if (v && el.dataset.type === 'contact') {
      var isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      var digits = v.replace(/\D/g, '').length;
      var isPhone = /^[+\d\s()\-]+$/.test(v) && digits >= 7;
      if (!isEmail && !isPhone) return msg('contact');
    }
    return '';
  }

  function showError(el, text) {
    var box = el.closest('.field');
    var id = el.id + '-err';
    var node = document.getElementById(id);
    var described = (el.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== id; });
    if (text) {
      if (!node) { node = document.createElement('p'); node.id = id; node.className = 'field-error'; box.appendChild(node); }
      node.textContent = text;
      el.setAttribute('aria-invalid', 'true');
      described.push(id);
    } else {
      if (node) node.remove();
      el.removeAttribute('aria-invalid');
    }
    if (described.length) el.setAttribute('aria-describedby', described.join(' '));
    else el.removeAttribute('aria-describedby');
  }

  function controls(form) {
    return Array.prototype.slice.call(form.querySelectorAll('input, select, textarea')).filter(function (el) { return !el.closest('.hp'); });
  }

  function validate(form, focusFirst) {
    var first = null;
    controls(form).forEach(function (el) {
      var err = fieldError(el);
      showError(el, err);
      if (err && !first) first = el;
    });
    var st = form.querySelector('.form-status');
    if (first) {
      st.className = 'form-status is-error';
      st.textContent = msg('summary');
      if (focusFirst) first.focus();
    } else if (st.classList.contains('is-error')) {
      st.className = 'form-status'; st.textContent = '';
    }
    return !first;
  }

  document.querySelectorAll('form.form').forEach(function (form) {
    var busy = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      busy = true;
      var btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      form.dataset.validated = '1';
      var st = form.querySelector('.form-status');
      var honeypot = form.querySelector('.hp input');
      if (validate(form, true)) {
        /* Honeypot filled = bot: show the same neutral message, do nothing else. */
        if (honeypot && honeypot.value) { /* ignored */ }
        st.className = 'form-status is-ok';
        st.textContent = msg('ok');
      }
      btn.disabled = false;
      busy = false;
    });
    controls(form).forEach(function (el) {
      var ev = (el.type === 'checkbox' || el.type === 'file' || el.tagName === 'SELECT') ? 'change' : 'input';
      el.addEventListener(ev, function () {
        var st = form.querySelector('.form-status');
        if (st.classList.contains('is-ok')) { st.className = 'form-status'; st.textContent = ''; }
        if (el.type === 'file' || form.dataset.validated || el.getAttribute('aria-invalid')) showError(el, fieldError(el));
      });
    });
  });

  var saved = null;
  try { saved = localStorage.getItem('lang'); } catch (e) { /* storage unavailable */ }
  setLang(saved || 'ru');
})();
