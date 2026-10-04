/**
 * Online consultation portal (spec §6.9, §12).
 * Copy lives here as `Localized` triples read with `L()` from `useI18n()`.
 * Shared portal copy (labels, countries, languages) is in `./patients`.
 */
import type { Localized } from '@/i18n';
import type { PtFaq, PtItem } from './patients';
/* =================================================== ONLINE CONSULTATION */

export const consult = {
  seoTitle: { ru: 'Онлайн-консультация офтальмолога', kk: 'Офтальмологтың онлайн кеңесі', en: 'Online ophthalmology consultation' },
  seoDescription: {
    ru: 'Онлайн-консультация офтальмолога в Zoom, Google Meet или Microsoft Teams: разбор документов, план лечения и подготовка к визиту в клинику.',
    kk: 'Zoom, Google Meet немесе Microsoft Teams арқылы офтальмологтың онлайн кеңесі: құжаттарды талдау, емдеу жоспары және клиникаға келуге дайындық.',
    en: 'Online ophthalmology consultation on Zoom, Google Meet or Microsoft Teams: record review, a treatment plan and preparation for your clinic visit.',
  },
  eyebrow: { ru: 'Онлайн-консультация', kk: 'Онлайн кеңес', en: 'Online consultation' },
  title: { ru: 'Консультация офтальмолога онлайн', kk: 'Офтальмологтың онлайн кеңесі', en: 'See an ophthalmologist online' },
  lead: {
    ru: 'Поговорите с врачом по видеосвязи из любой точки мира: он изучит ваши документы, ответит на вопросы и предложит план — до того, как вы решите ехать в клинику.',
    kk: 'Дәрігермен әлемнің кез келген нүктесінен бейнебайланыс арқылы сөйлесіңіз: ол құжаттарыңызды зерделеп, сұрақтарға жауап беріп, жоспар ұсынады — клиникаға баруды шешпес бұрын.',
    en: 'Talk to a doctor by video from anywhere in the world: they review your records, answer your questions and suggest a plan — before you decide to visit the clinic.',
  },
  heroBook: { ru: 'Записаться онлайн', kk: 'Онлайн жазылу', en: 'Book online' },
  heroSteps: { ru: 'Как проходит консультация', kk: 'Кеңес қалай өтеді', en: 'How it works' },
  heroCall: {
    doctor: { ru: 'Офтальмолог', kk: 'Офтальмолог', en: 'Ophthalmologist' },
    you: { ru: 'Вы', kk: 'Сіз', en: 'You' },
    shared: { ru: 'Снимок ОКТ · на экране', kk: 'ОКТ суреті · экранда', en: 'OCT scan · shared' },
  },
  statementLabel: { ru: 'Зачем это нужно', kk: 'Бұл не үшін керек', en: 'Why it helps' },

  statement: {
    ru: 'Разговор с врачом — лучший способ понять, нужна ли поездка, до того как вы купили билет.',
    kk: 'Дәрігермен әңгіме — билет алмас бұрын сапардың қажет екенін түсінудің ең жақсы жолы.',
    en: 'A conversation with a doctor is the best way to know whether a trip is needed — before you buy a ticket.',
  },
  mandatoryTitle: { ru: 'Обязательно для международных пациентов', kk: 'Халықаралық пациенттер үшін міндетті', en: 'Required for international patients' },
  mandatoryText: {
    ru: 'Перед поездкой на лечение каждый иностранный пациент проходит онлайн-консультацию. Так врач заранее уточняет показания и план, а вы — сроки и стоимость, и поездка проходит без неожиданностей.',
    kk: 'Емделуге сапар алдында әр шетелдік пациент онлайн кеңестен өтеді. Осылайша дәрігер көрсеткіштер мен жоспарды, ал сіз мерзім мен құнды алдын ала нақтылайсыз, сапар күтпеген жағдайсыз өтеді.',
    en: 'Every international patient has an online consultation before travelling for treatment. The doctor confirms the indications and plan in advance, you confirm timing and cost, and the trip goes without surprises.',
  },
  mandatoryLink: { ru: 'Портал для международных пациентов', kk: 'Халықаралық пациенттер порталы', en: 'International patient portal' },

  stepsEyebrow: { ru: 'Пять шагов', kk: 'Бес қадам', en: 'Five steps' },
  stepsTitle: { ru: 'От заявки до визита в клинику', kk: 'Өтінімнен клиникаға келуге дейін', en: 'From request to clinic visit' },
  steps: [
    {
      title: { ru: 'Заявка пациента', kk: 'Пациенттің өтінімі', en: 'Your request' },
      text: {
        ru: 'Вы выбираете платформу и удобную дату, прикладываете документы.',
        kk: 'Платформа мен ыңғайлы күнді таңдап, құжаттарды тіркейсіз.',
        en: 'Choose a platform and a convenient date, and attach your records.',
      },
    },
    {
      title: { ru: 'Рассмотрение координатором', kk: 'Үйлестірушінің қарауы', en: 'Coordinator review' },
      text: {
        ru: 'Медицинский координатор подбирает врача и подтверждает время с учётом часового пояса.',
        kk: 'Медициналық үйлестіруші дәрігерді таңдап, уақыт белдеуін ескеріп уақытты растайды.',
        en: 'A medical coordinator matches you with a doctor and confirms the time in your time zone.',
      },
    },
    {
      title: { ru: 'Онлайн-консультация', kk: 'Онлайн кеңес', en: 'Online consultation' },
      text: {
        ru: 'Видеосвязь с врачом: разбор документов, ваши вопросы, ответы врача.',
        kk: 'Дәрігермен бейнебайланыс: құжаттарды талдау, сұрақтарыңыз, дәрігер жауаптары.',
        en: 'A video call with the doctor: record review, your questions, the doctor’s answers.',
      },
    },
    {
      title: { ru: 'План лечения', kk: 'Емдеу жоспары', en: 'Treatment plan' },
      text: {
        ru: 'Письменные рекомендации и, если нужно лечение, — план со сроками и сметой.',
        kk: 'Жазбаша ұсынымдар және ем керек болса — мерзімдері мен сметасы бар жоспар.',
        en: 'Written advice and, if treatment is needed, a plan with timing and costs.',
      },
    },
    {
      title: { ru: 'Визит в клинику', kk: 'Клиникаға келу', en: 'Clinic visit' },
      text: {
        ru: 'Приезжаете на подтверждённые даты — обследования и лечение уже согласованы.',
        kk: 'Расталған күндерге келесіз — тексерулер мен ем алдын ала келісілген.',
        en: 'You arrive on confirmed dates, with tests and treatment already agreed.',
      },
    },
  ] as PtItem[],

  platformsEyebrow: { ru: 'Платформы', kk: 'Платформалар', en: 'Platforms' },
  platformsTitle: { ru: 'Там, где вам привычно', kk: 'Сізге үйреншікті жерде', en: 'Wherever you are comfortable' },
  platformsLead: {
    ru: 'Ссылку на встречу координатор пришлёт в WhatsApp или на e-mail после подтверждения времени.',
    kk: 'Кездесу сілтемесін үйлестіруші уақытты растағаннан кейін WhatsApp-қа немесе e-mail-ге жібереді.',
    en: 'Your coordinator sends the meeting link to WhatsApp or e-mail once the time is confirmed.',
  },
  platforms: [
    {
      id: 'zoom',
      name: 'Zoom',
      text: {
        ru: 'Работает в браузере и в приложении, удобно показывать документы с экрана.',
        kk: 'Браузерде де, қосымшада да жұмыс істейді, құжаттарды экраннан көрсету ыңғайлы.',
        en: 'Works in the browser or the app; easy to share documents on screen.',
      },
    },
    {
      id: 'meet',
      name: 'Google Meet',
      text: {
        ru: 'Достаточно ссылки и браузера — без установки программ.',
        kk: 'Сілтеме мен браузер жеткілікті — бағдарлама орнатусыз.',
        en: 'All you need is the link and a browser — nothing to install.',
      },
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      text: {
        ru: 'Подойдёт, если вы привыкли к Teams по работе или ваш врач дома его использует.',
        kk: 'Teams-ке жұмыста үйренсеңіз немесе үйдегі дәрігеріңіз оны пайдаланса, жарайды.',
        en: 'A good fit if you use Teams at work or your local doctor does.',
      },
    },
  ],

  needsEyebrow: { ru: 'Подготовка', kk: 'Дайындық', en: 'Preparation' },
  needsTitle: { ru: 'Что понадобится', kk: 'Не қажет болады', en: 'What you will need' },
  needs: [
    {
      title: { ru: 'Стабильный интернет', kk: 'Тұрақты интернет', en: 'A stable connection' },
      text: {
        ru: 'Компьютер или телефон с камерой и микрофоном и связь, на которой не прерывается видео. Проверьте её за несколько минут до начала.',
        kk: 'Камерасы мен микрофоны бар компьютер немесе телефон және бейне үзілмейтін байланыс. Оны басталуға бірнеше минут қалғанда тексеріңіз.',
        en: 'A computer or phone with camera and microphone, on a connection that handles video. Test it a few minutes before the start.',
      },
    },
    {
      title: { ru: 'Свежие документы', kk: 'Жаңа құжаттар', en: 'Recent records' },
      text: {
        ru: 'Выписки, снимки ОКТ и результаты исследований за последний год — загрузите их в заявку заранее.',
        kk: 'Соңғы жылдағы көшірмелер, ОКТ суреттері және зерттеу нәтижелері — оларды өтінімге алдын ала жүктеңіз.',
        en: 'Reports, OCT scans and test results from the past year — upload them with your request in advance.',
      },
    },
    {
      title: { ru: 'Список вопросов', kk: 'Сұрақтар тізімі', en: 'Your questions' },
      text: {
        ru: 'Запишите, что хотите узнать, и какие лекарства и капли используете.',
        kk: 'Не білгіңіз келетінін және қандай дәрілер мен тамшыларды қолданатыныңызды жазып қойыңыз.',
        en: 'Write down what you want to ask, and which medicines and eye drops you use.',
      },
    },
    {
      title: { ru: 'Тихое место', kk: 'Тыныш орын', en: 'A quiet spot' },
      text: {
        ru: 'Хорошее освещение лица и возможность спокойно говорить всю консультацию. Можно подключить родственника.',
        kk: 'Бетке жақсы жарық және кеңес бойы тыныш сөйлесу мүмкіндігі. Туысыңызды қосуға болады.',
        en: 'Good light on your face and no interruptions for the whole call. A relative can join you.',
      },
    },
  ] as PtItem[],

  priceEyebrow: { ru: 'Стоимость', kk: 'Құны', en: 'Price' },
  priceTitle: { ru: 'Прозрачная цена по прейскуранту', kk: 'Прейскурант бойынша ашық баға', en: 'A clear price from our price list' },
  priceText: {
    ru: 'Онлайн-консультация оплачивается по тарифу консультации офтальмолога из прейскуранта центра. Итоговую сумму координатор подтвердит вместе со временем встречи.',
    kk: 'Онлайн кеңес орталық прейскурантындағы офтальмолог кеңесінің тарифі бойынша төленеді. Түпкілікті соманы үйлестіруші кездесу уақытымен бірге растайды.',
    en: 'An online consultation is charged at the ophthalmologist consultation rate from the centre’s price list. The coordinator confirms the amount together with the appointment time.',
  },
  priceIncludes: [
    { ru: 'Разбор присланных документов до встречи', kk: 'Кездесуге дейін жіберілген құжаттарды талдау', en: 'Review of your records before the call' },
    { ru: 'Видеоконсультация с врачом', kk: 'Дәрігермен бейнекеңес', en: 'Video consultation with a doctor' },
    { ru: 'Письменные рекомендации после консультации', kk: 'Кеңестен кейінгі жазбаша ұсынымдар', en: 'Written advice after the call' },
  ],
  priceFrom: { ru: 'Стоимость', kk: 'Құны', en: 'Price' },
  pricingLink: { ru: 'Все цены', kk: 'Барлық бағалар', en: 'Full price list' },

  formTitle: { ru: 'Записаться на онлайн-консультацию', kk: 'Онлайн кеңеске жазылу', en: 'Book an online consultation' },
  formLead: {
    ru: 'Укажите платформу, желаемую дату и часовой пояс — координатор подтвердит время и пришлёт ссылку.',
    kk: 'Платформаны, қалаған күнді және уақыт белдеуін көрсетіңіз — үйлестіруші уақытты растап, сілтеме жібереді.',
    en: 'Choose a platform, a preferred date and your time zone — the coordinator will confirm the time and send the link.',
  },
  formSubmit: { ru: 'Записаться', kk: 'Жазылу', en: 'Book' },
  tzExample: { ru: 'например', kk: 'мысалы', en: 'e.g.' },
  nextTitle: { ru: 'Что будет дальше', kk: 'Ары қарай не болады', en: 'What happens next' },
  next: [
    { ru: 'Сразу — номер заявки на экране', kk: 'Бірден — экранда өтінім нөмірі', en: 'Straight away — a reference number on screen' },
    { ru: 'В течение рабочего дня — координатор подтвердит время с учётом вашего часового пояса', kk: 'Жұмыс күні ішінде — үйлестіруші уақыт белдеуіңізді ескеріп уақытты растайды', en: 'Within one working day — the coordinator confirms a time in your time zone' },
    { ru: 'Перед встречей — ссылка на видеосвязь в WhatsApp или на e-mail', kk: 'Кездесу алдында — WhatsApp-қа немесе e-mail-ге бейнебайланыс сілтемесі', en: 'Before the call — the video link by WhatsApp or e-mail' },
  ] as Localized[],
  filesLabel: { ru: 'Документы к консультации', kk: 'Кеңеске арналған құжаттар', en: 'Records for the consultation' },

  faq: [
    {
      q: { ru: 'Можно ли поставить диагноз онлайн?', kk: 'Онлайн диагноз қоюға бола ма?', en: 'Can a diagnosis be made online?' },
      a: {
        ru: 'Врач может оценить ваши документы и жалобы, но без осмотра окончательный диагноз не ставится. Консультация помогает понять, какие обследования нужны и есть ли смысл ехать.',
        kk: 'Дәрігер құжаттарыңыз бен шағымдарыңызды бағалай алады, бірақ тексерусіз түпкілікті диагноз қойылмайды. Кеңес қандай тексерулер керегін және баруға мән бар-жоғын түсінуге көмектеседі.',
        en: 'The doctor can assess your records and symptoms, but a final diagnosis needs an examination. The consultation shows which tests you need and whether the trip is worthwhile.',
      },
    },
    {
      q: { ru: 'Что если связь прервётся?', kk: 'Байланыс үзілсе ше?', en: 'What if the connection drops?' },
      a: {
        ru: 'Врач попробует подключиться по той же ссылке или связаться в WhatsApp. Если продолжить не получится, координатор предложит другое время.',
        kk: 'Дәрігер сол сілтеме арқылы қайта қосылуға немесе WhatsApp арқылы байланысуға тырысады. Жалғастыру мүмкін болмаса, үйлестіруші басқа уақыт ұсынады.',
        en: 'The doctor will try to reconnect via the same link or reach you on WhatsApp. If that fails, the coordinator offers another time.',
      },
    },
    {
      q: { ru: 'Как перенести или отменить консультацию?', kk: 'Кеңесті қалай ауыстыруға немесе болдырмауға болады?', en: 'How do I reschedule or cancel?' },
      a: {
        ru: 'Напишите координатору в WhatsApp как можно раньше — подберём другое время.',
        kk: 'Үйлестірушіге WhatsApp-қа мүмкіндігінше ертерек жазыңыз — басқа уақыт таңдаймыз.',
        en: 'Message your coordinator on WhatsApp as early as you can and we will find another time.',
      },
    },
    {
      q: { ru: 'Можно ли выбрать врача?', kk: 'Дәрігерді таңдауға бола ма?', en: 'Can I choose my doctor?' },
      a: {
        ru: 'Да. Укажите имя врача в комментарии — профили специалистов есть в разделе «Врачи». Если не знаете, кого выбрать, координатор подберёт врача по профилю.',
        kk: 'Иә. Дәрігердің атын түсініктемеде көрсетіңіз — мамандардың профильдері «Дәрігерлер» бөлімінде. Кімді таңдарыңызды білмесеңіз, үйлестіруші бейіні бойынша дәрігер таңдайды.',
        en: 'Yes. Put the doctor’s name in the comment — specialist profiles are in the Doctors section. If you are unsure, the coordinator will match you by specialty.',
      },
    },
    {
      q: { ru: 'Нужна ли консультация, если я живу в Казахстане?', kk: 'Қазақстанда тұрсам, кеңес керек пе?', en: 'Do I need this if I live in Kazakhstan?' },
      a: {
        ru: 'Не обязательно, но онлайн-формат удобен, если вы в другом городе или хотите обсудить результаты без визита. Обязательна консультация только для иностранных пациентов перед лечением.',
        kk: 'Міндетті емес, бірақ басқа қалада болсаңыз немесе нәтижелерді келмей талқылағыңыз келсе, онлайн формат ыңғайлы. Кеңес тек шетелдік пациенттер үшін емделу алдында міндетті.',
        en: 'Not necessarily, but it is handy if you are in another city or want to discuss results without a visit. It is only mandatory for international patients before treatment.',
      },
    },
  ] as PtFaq[],
};
