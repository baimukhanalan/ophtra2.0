/**
 * Second-opinion portal (spec §6.6, §9).
 * Copy lives here as `Localized` triples read with `L()` from `useI18n()`.
 * Shared portal copy (labels, countries, languages) is in `./patients`.
 */
import type { Localized } from '@/i18n';
import type { PtFaq, PtItem } from './patients';
/* ======================================================= SECOND OPINION */

export const second = {
  seoTitle: { ru: 'Второе мнение офтальмолога по документам', kk: 'Құжаттар бойынша офтальмологтың екінші пікірі', en: 'Ophthalmology second opinion from your records' },
  seoDescription: {
    ru: 'Дистанционное второе мнение офтальмолога: опишите вопрос, перечислите выписки и снимки (PDF, JPG, PNG) и получите письменное заключение специалиста на e-mail.',
    kk: 'Офтальмологтың қашықтан екінші пікірі: сұрағыңызды сипаттап, көшірмелер мен суреттерді (PDF, JPG, PNG) тізімдеңіз және маманның жазбаша қорытындысын e-mail-ге алыңыз.',
    en: 'Remote ophthalmology second opinion: describe your question, list your reports and scans (PDF, JPG, PNG) and receive a specialist’s written conclusion by e-mail.',
  },
  eyebrow: { ru: 'Второе мнение', kk: 'Екінші пікір', en: 'Second opinion' },
  title: { ru: 'Второе мнение по вашим документам', kk: 'Құжаттарыңыз бойынша екінші пікір', en: 'A second opinion on your records' },
  lead: {
    ru: 'Сомневаетесь в диагнозе или предложенной операции? Загрузите выписки и снимки — наши специалисты изучат их и дадут письменное заключение. Без поездки и без очереди.',
    kk: 'Диагнозға немесе ұсынылған операцияға күмәндасыз ба? Көшірмелер мен суреттерді жүктеңіз — мамандарымыз оларды зерделеп, жазбаша қорытынды береді. Сапарсыз әрі кезексіз.',
    en: 'Unsure about a diagnosis or a proposed operation? Upload your reports and scans — our specialists will study them and give you a written conclusion. No travel, no waiting list.',
  },
  heroUpload: { ru: 'Загрузить документы', kk: 'Құжаттарды жүктеу', en: 'Upload records' },
  heroProcess: { ru: 'Как это работает', kk: 'Бұл қалай жұмыс істейді', en: 'How it works' },
  heroDocs: [
    { ru: 'Выписка', kk: 'Көшірме', en: 'Report' },
    { ru: 'Снимок ОКТ', kk: 'ОКТ суреті', en: 'OCT scan' },
    { ru: 'Поля зрения', kk: 'Көру өрістері', en: 'Visual fields' },
  ],
  heroDocsNote: { ru: 'PDF · JPG · PNG', kk: 'PDF · JPG · PNG', en: 'PDF · JPG · PNG' },

  advEyebrow: { ru: 'Главное преимущество', kk: 'Басты артықшылық', en: 'The key advantage' },
  advStatement: {
    ru: 'Контакт с врачом начинается раньше, чем география начинает иметь значение.',
    kk: 'Дәрігермен байланыс география маңызды бола бастағанға дейін басталады.',
    en: 'Contact with a doctor begins before geography starts to matter.',
  },
  advText: {
    ru: 'Вам не нужно ехать, чтобы понять, нужна ли поездка. Экспертное мнение по документам помогает принять взвешенное решение — лечиться дома, приехать к нам или сначала дообследоваться.',
    kk: 'Сапар керек пе, соны түсіну үшін жол жүрудің қажеті жоқ. Құжаттар бойынша сарапшы пікірі салмақты шешім қабылдауға көмектеседі — үйде емделу, бізге келу немесе алдымен қосымша тексерілу.',
    en: 'You don’t have to travel to find out whether a trip is worth it. An expert opinion on your records helps you make a considered choice — treatment at home, a visit to us, or further tests first.',
  },
  stats: [
    { value: 10, label: { ru: 'файлов PDF, JPG или PNG в одной заявке', kk: 'PDF, JPG немесе PNG файлы бір өтінімде', en: 'PDF, JPG or PNG files per request' } },
    { value: 10, unit: { ru: ' МБ', kk: ' МБ', en: ' MB' }, label: { ru: 'максимальный размер одного файла', kk: 'бір файлдың ең үлкен көлемі', en: 'maximum size of one file' } },
    { value: 3, label: { ru: 'языка заключения: RU, KK, EN', kk: 'қорытынды тілі: RU, KK, EN', en: 'report languages: RU, KK, EN' } },
  ] as Array<{ value: number; unit?: Localized; label: Localized }>,

  processEyebrow: { ru: 'Процесс', kk: 'Үдеріс', en: 'Process' },
  processTitle: { ru: 'Четыре шага к заключению', kk: 'Қорытындыға дейін төрт қадам', en: 'Four steps to a conclusion' },
  process: [
    {
      title: { ru: 'Вы отправляете документы', kk: 'Сіз құжаттарды жібересіз', en: 'You send your records' },
      text: {
        ru: 'Заполните форму, опишите вопрос и перечислите выписки, снимки и результаты исследований.',
        kk: 'Форманы толтырып, сұрағыңызды сипаттаңыз және көшірмелерді, суреттерді, зерттеу нәтижелерін тізімдеңіз.',
        en: 'Fill in the form, describe your question and list your reports, scans and test results.',
      },
    },
    {
      title: { ru: 'Специалисты изучают', kk: 'Мамандар зерделейді', en: 'Specialists review them' },
      text: {
        ru: 'Профильный врач, а в сложных случаях — консилиум, анализирует данные и при необходимости запрашивает дополнительные.',
        kk: 'Бейінді дәрігер, ал күрделі жағдайларда — консилиум деректерді талдап, қажет болса қосымша деректер сұрайды.',
        en: 'A specialist — or a panel for complex cases — analyses the data and asks for more if needed.',
      },
    },
    {
      title: { ru: 'Заключение готово', kk: 'Қорытынды дайын', en: 'The conclusion is ready' },
      text: {
        ru: 'Письменное заключение с рекомендациями приходит на e-mail, указанный в заявке.',
        kk: 'Ұсынымдары бар жазбаша қорытынды өтінімде көрсетілген e-mail-ге келеді.',
        en: 'A written conclusion with recommendations is sent to the e-mail in your request.',
      },
    },
    {
      title: { ru: 'Приглашение при необходимости', kk: 'Қажет болса шақыру', en: 'An invitation, if needed' },
      text: {
        ru: 'Если нужно очное лечение, мы составим план и поможем организовать поездку в Казахстан.',
        kk: 'Бетпе-бет ем керек болса, жоспар құрып, Қазақстанға сапарды ұйымдастыруға көмектесеміз.',
        en: 'If you need in-person treatment, we prepare a plan and help you organise the trip to Kazakhstan.',
      },
    },
  ] as PtItem[],

  featEyebrow: { ru: 'Как устроен сервис', kk: 'Сервис қалай құрылған', en: 'How the service works' },
  featTitle: { ru: 'Надёжно на каждом этапе', kk: 'Әр кезеңде сенімді', en: 'Dependable at every stage' },
  features: [
    {
      title: { ru: 'Загрузка медицинских файлов', kk: 'Медициналық файлдарды жүктеу', en: 'Medical file upload' },
      text: {
        ru: 'Отметьте в заявке PDF, JPG и PNG до 10 МБ каждый, до 10 файлов: снимки ОКТ, выписки, результаты анализов.',
        kk: 'Өтінімде PDF, JPG және PNG файлдарын белгілеңіз, әрқайсысы 10 МБ-қа дейін, 10 файлға дейін: ОКТ суреттері, көшірмелер, талдау нәтижелері.',
        en: 'Add PDF, JPG and PNG files to your request, up to 10 MB each and 10 files in total: OCT scans, reports, lab results.',
      },
    },
    {
      title: { ru: 'Документы — по защищённой ссылке', kk: 'Құжаттар — қорғалған сілтеме арқылы', en: 'Records via a secure link' },
      text: {
        ru: 'В заявку попадает список ваших файлов. Сами документы координатор запросит по отдельной защищённой ссылке.',
        kk: 'Өтінімге файлдарыңыздың тізімі түседі. Құжаттардың өзін үйлестіруші бөлек қорғалған сілтеме арқылы сұрайды.',
        en: 'Your request carries the list of your files. The coordinator then asks for the documents themselves through a separate secure link.',
      },
    },
    {
      title: { ru: 'Номер заявки сразу', kk: 'Өтінім нөмірі бірден', en: 'A reference number at once' },
      text: {
        ru: 'Номер заявки появляется на экране сразу после отправки — назовите его координатору при любом вопросе.',
        kk: 'Өтінім нөмірі жіберген соң экранда бірден шығады — кез келген сұрақ бойынша оны үйлестірушіге айтыңыз.',
        en: 'Your reference number appears on screen as soon as you send the request — quote it to the coordinator with any question.',
      },
    },
    {
      title: { ru: 'Медицинское рассмотрение', kk: 'Медициналық қарау', en: 'Medical review' },
      text: {
        ru: 'Каждую заявку ведёт профильный специалист; сложные случаи обсуждаются коллегиально.',
        kk: 'Әр өтінімді бейінді маман жүргізеді; күрделі жағдайлар алқалы түрде талқыланады.',
        en: 'Each request is led by a specialist in the field; complex cases are discussed by a panel.',
      },
    },
    {
      title: { ru: 'Управление ответом врача', kk: 'Дәрігер жауабын басқару', en: 'Managing the doctor’s answer' },
      text: {
        ru: 'Заключение можно переслать своему врачу, задать уточняющий вопрос или обсудить его с врачом по видеосвязи.',
        kk: 'Қорытындыны өз дәрігеріңізге жіберуге, нақтылау сұрағын қоюға немесе дәрігермен бейнебайланыс арқылы талқылауға болады.',
        en: 'Forward the conclusion to your own doctor, ask a follow-up question or talk it through with the doctor on a video call.',
      },
    },
    {
      title: { ru: 'Заявка с номером и статусом', kk: 'Нөмірі мен мәртебесі бар өтінім', en: 'One reference, one status' },
      text: {
        ru: 'Заявку ведут по номеру: у неё есть статус и ответственный координатор, поэтому ничего не теряется между сообщениями.',
        kk: 'Өтінім нөмір бойынша жүргізіледі: оның мәртебесі мен жауапты үйлестірушісі бар, сондықтан хабарламалар арасында ештеңе жоғалмайды.',
        en: 'Your request is tracked by its reference, with a status and a responsible coordinator, so nothing gets lost between messages.',
      },
    },
  ] as PtItem[],

  statusEyebrow: { ru: 'Статус заявки', kk: 'Өтінім мәртебесі', en: 'Request status' },
  statusTitle: { ru: 'Вы всегда знаете, где ваша заявка', kk: 'Өтініміңіздің қайда екенін әрдайым білесіз', en: 'You always know where your request is' },
  statusCardTitle: { ru: 'Пример заявки', kk: 'Өтінім үлгісі', en: 'Sample request' },
  statusNow: { ru: 'Текущий этап', kk: 'Ағымдағы кезең', en: 'Current stage' },
  statuses: [
    {
      title: { ru: 'Получено', kk: 'Алынды', en: 'Received' },
      text: {
        ru: 'Заявке присвоен номер. Координатор связывается с вами, получает документы по защищённой ссылке и проверяет, всё ли читаемо и достаточно ли данных.',
        kk: 'Өтінімге нөмір берілді. Үйлестіруші сізбен байланысып, құжаттарды қорғалған сілтеме арқылы алады және бәрі оқылатынын, деректердің жеткілікті екенін тексереді.',
        en: 'Your request has a reference number. The coordinator contacts you, receives the documents through a secure link and checks that everything is legible and complete.',
      },
      meta: { ru: 'номер — сразу', kk: 'нөмір — бірден', en: 'reference at once' },
    },
    {
      title: { ru: 'На рассмотрении', kk: 'Қаралуда', en: 'Under review' },
      text: {
        ru: 'Специалист изучает снимки и выписки. Если чего-то не хватает, мы напишем, какие исследования дослать, — срок при этом продлевается.',
        kk: 'Маман суреттер мен көшірмелерді зерделейді. Бірдеңе жетіспесе, қандай зерттеулерді жіберу керегін жазамыз — мерзім сонда ұзарады.',
        en: 'A specialist studies the scans and reports. If something is missing, we tell you which tests to send — the timeline extends accordingly.',
      },
      meta: { ru: 'срок называет координатор', kk: 'мерзімін үйлестіруші айтады', en: 'timeline set by your coordinator' },
    },
    {
      title: { ru: 'Заключение готово', kk: 'Қорытынды дайын', en: 'Conclusion ready' },
      text: {
        ru: 'Письменное заключение с подписью врача приходит на e-mail. Можно задать уточняющий вопрос или записаться на онлайн-разбор.',
        kk: 'Дәрігер қол қойған жазбаша қорытынды e-mail-ге келеді. Нақтылау сұрағын қоюға немесе онлайн талдауға жазылуға болады.',
        en: 'A written conclusion signed by the doctor arrives by e-mail. You can ask a follow-up question or book an online walk-through.',
      },
      meta: { ru: 'на e-mail', kk: 'e-mail-ге', en: 'by e-mail' },
    },
  ],


  attachEyebrow: { ru: 'Что приложить', kk: 'Не тіркеу керек', en: 'What to attach' },
  attachTitle: { ru: 'Чем полнее документы, тем точнее ответ', kk: 'Құжаттар толық болған сайын жауап дәлірек', en: 'The fuller the records, the sharper the answer' },
  attach: [
    { ru: 'Последнюю выписку или заключение офтальмолога', kk: 'Офтальмологтың соңғы көшірмесі немесе қорытындысы', en: 'Your latest ophthalmology report or discharge summary' },
    { ru: 'Снимки ОКТ сетчатки и диска зрительного нерва', kk: 'Тор қабық пен көру жүйкесі дискісінің ОКТ суреттері', en: 'OCT scans of the retina and optic disc' },
    { ru: 'Результаты периметрии (поля зрения)', kk: 'Периметрия нәтижелері (көру өрістері)', en: 'Visual field (perimetry) results' },
    { ru: 'Кератотопографию и биометрию, если обсуждается операция', kk: 'Операция талқыланса, кератотопография мен биометрия', en: 'Corneal topography and biometry if surgery is being discussed' },
    { ru: 'Данные о внутриглазном давлении и остроте зрения', kk: 'Көзішілік қысым мен көру өткірлігі туралы деректер', en: 'Intraocular pressure and visual acuity readings' },
    { ru: 'Список лекарств и капель, которые вы используете', kk: 'Қолданатын дәрілер мен тамшылар тізімі', en: 'A list of medicines and eye drops you use' },
    { ru: 'Сведения о сопутствующих заболеваниях (диабет, гипертония)', kk: 'Қосалқы аурулар туралы мәліметтер (диабет, гипертония)', en: 'Other conditions (diabetes, hypertension)' },
  ],
  attachTip: {
    ru: 'Фото документов подойдут, если текст хорошо читается. Снимки ОКТ лучше выгружать в PDF прямо из прибора.',
    kk: 'Мәтін жақсы оқылса, құжаттардың фотосуреттері жарайды. ОКТ суреттерін аспаптан тікелей PDF-ке шығарған дұрыс.',
    en: 'Photos of documents are fine if the text is legible. OCT scans are best exported to PDF straight from the device.',
  },
  turnaroundTitle: { ru: 'Сроки', kk: 'Мерзімдер', en: 'Turnaround' },
  turnaroundText: {
    ru: 'Срок зависит от сложности случая и полноты документов — координатор назовёт его, когда увидит всё, что вы прислали. Срочные случаи он отмечает отдельно.',
    kk: 'Мерзім жағдайдың күрделілігі мен құжаттардың толықтығына байланысты — үйлестіруші жіберілгеннің бәрін көрген соң айтады. Шұғыл жағдайларды ол бөлек белгілейді.',
    en: 'The timeline depends on the complexity of the case and how complete the records are — your coordinator confirms it once they have seen everything. Urgent cases are flagged separately.',
  },
  privacyTitle: { ru: 'Конфиденциальность', kk: 'Құпиялылық', en: 'Privacy' },
  privacyText: {
    ru: 'Мы обрабатываем медицинские данные по закону РК о персональных данных и в соответствии с принципами GDPR: только с вашего согласия, только для ответа на ваш запрос и с правом на удаление по запросу.',
    kk: 'Медициналық деректерді ҚР дербес деректер туралы заңына және GDPR қағидаттарына сәйкес өңдейміз: тек келісіміңізбен, тек сұрауыңызға жауап беру үшін және сұрау бойынша жою құқығымен.',
    en: 'We process medical data under Kazakhstan’s personal data law and in line with GDPR principles: only with your consent, only to answer your request, and with the right to erasure on request.',
  },
  privacyLink: { ru: 'Политика конфиденциальности', kk: 'Құпиялылық саясаты', en: 'Privacy policy' },
  filesLabel: { ru: 'Выписки и снимки', kk: 'Көшірмелер мен суреттер', en: 'Reports and scans' },

  formTitle: { ru: 'Запросить второе мнение', kk: 'Екінші пікірді сұрау', en: 'Request a second opinion' },
  formLead: {
    ru: 'E-mail обязателен — на него придёт заключение. Сами документы координатор запросит по защищённой ссылке, их можно дослать и позже.',
    kk: 'E-mail міндетті — оған қорытынды келеді. Құжаттардың өзін үйлестіруші қорғалған сілтеме арқылы сұрайды, оларды кейін де жіберуге болады.',
    en: 'E-mail is required — the conclusion is sent there. The coordinator asks for the documents themselves through a secure link, and you can send more later.',
  },
  formSubmit: { ru: 'Отправить на рассмотрение', kk: 'Қарауға жіберу', en: 'Send for review' },

  faq: [
    {
      q: { ru: 'Заменяет ли второе мнение очный осмотр?', kk: 'Екінші пікір бетпе-бет тексеруді алмастыра ма?', en: 'Does a second opinion replace an examination?' },
      a: {
        ru: 'Нет. Заключение основано на присланных документах и помогает принять решение, но окончательный диагноз и план лечения возможны только после осмотра.',
        kk: 'Жоқ. Қорытынды жіберілген құжаттарға негізделеді және шешім қабылдауға көмектеседі, бірақ түпкілікті диагноз бен емдеу жоспары тек тексеруден кейін мүмкін.',
        en: 'No. The conclusion is based on the records you send and helps you decide, but a final diagnosis and treatment plan are only possible after an examination.',
      },
    },
    {
      q: { ru: 'Кто пишет заключение?', kk: 'Қорытындыны кім жазады?', en: 'Who writes the conclusion?' },
      a: {
        ru: 'Врач центра, специализирующийся на вашем заболевании. В сложных случаях документы обсуждаются несколькими специалистами.',
        kk: 'Сіздің ауруыңызға маманданған орталық дәрігері. Күрделі жағдайларда құжаттарды бірнеше маман талқылайды.',
        en: 'A doctor at the centre who specialises in your condition. In complex cases, several specialists discuss the records.',
      },
    },
    {
      q: { ru: 'На каком языке будет заключение?', kk: 'Қорытынды қай тілде болады?', en: 'What language will the conclusion be in?' },
      a: {
        ru: 'На русском, казахском или английском — выберите в заявке. Документы на других языках лучше прислать с переводом.',
        kk: 'Орыс, қазақ немесе ағылшын тілінде — өтінімде таңдаңыз. Басқа тілдегі құжаттарды аудармасымен жіберген дұрыс.',
        en: 'Russian, Kazakh or English — choose in your request. Documents in other languages are best sent with a translation.',
      },
    },
    {
      q: { ru: 'Что если документов недостаточно?', kk: 'Құжаттар жеткіліксіз болса ше?', en: 'What if my records are not enough?' },
      a: {
        ru: 'Мы напишем, каких исследований не хватает, и подскажем, где их можно сделать. Если это невозможно дома, предложим пройти диагностику у нас.',
        kk: 'Қандай зерттеулер жетіспейтінін жазып, оларды қайдан жасауға болатынын айтамыз. Үйде мүмкін болмаса, бізде диагностикадан өтуді ұсынамыз.',
        en: 'We tell you which tests are missing and where you can have them done. If that isn’t possible locally, we suggest diagnostics with us.',
      },
    },
    {
      q: { ru: 'Как защищены мои данные?', kk: 'Деректерім қалай қорғалған?', en: 'How is my data protected?' },
      a: {
        ru: 'Форма передаёт данные по HTTPS. Документы координатор запрашивает по отдельной защищённой ссылке; доступ к ним есть только у врачей и координатора вашей заявки. По запросу мы удалим данные.',
        kk: 'Форма деректерді HTTPS арқылы жібереді. Құжаттарды үйлестіруші бөлек қорғалған сілтеме арқылы сұрайды; оларға тек өтініміңіздің дәрігерлері мен үйлестірушісі қол жеткізе алады. Сұрау бойынша деректерді жоямыз.',
        en: 'The form sends your data over HTTPS. The coordinator asks for documents through a separate secure link, and only the doctors and coordinator on your request can see them. We delete your data on request.',
      },
    },
  ] as PtFaq[],
};
