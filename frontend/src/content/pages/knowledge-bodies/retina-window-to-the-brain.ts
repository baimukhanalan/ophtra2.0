import type { KnowledgeArticleBody } from '../knowledge-types';

/**
 * Knowledge base — body of «Сетчатка как окно в мозг».
 * Loaded on demand by the article page; the listing only reads
 * knowledge-articles-index.ts.
 */
const body: KnowledgeArticleBody = {
  sections: [
    {
      id: 'retina-is-brain',
      title: {
        ru: 'Сетчатка — часть центральной нервной системы',
        kk: 'Тор қабық — орталық жүйке жүйесінің бөлігі',
        en: 'The retina is part of the brain',
      },
      body: {
        ru: [
          'В процессе развития сетчатка формируется из той же ткани, что и головной мозг, и по сути является его частью, вынесенной в глаз. Ганглиозные клетки сетчатки — это нейроны, отростки которых образуют зрительный нерв и передают сигнал в мозг. Кроме ганглиозных клеток, в сетчатке есть и другие нейроны, связанные между собой в сложные сети, как и в головном мозге.',
          'Уникальность сетчатки в том, что эти нейроны можно увидеть без разреза и облучения: через зрачок, с помощью ОКТ и фотографирования глазного дна. Ни одну другую часть центральной нервной системы нельзя рассмотреть так же просто и безболезненно. Поэтому сетчатку всё чаще рассматривают как удобную модель для изучения нервной ткани в целом.',
        ],
        kk: [
          'Даму барысында тор қабық бас миымен бірдей тіннен қалыптасады және шын мәнінде мидың көзге шығарылған бөлігі болып табылады. Тор қабықтың ганглийлік жасушалары — нейрондар, олардың өсінділері көру жүйкесін түзіп, сигналды миға жеткізеді. Ганглийлік жасушалардан басқа тор қабықта ми сияқты күрделі желілерге байланысқан өзге нейрондар да бар.',
          'Тор қабықтың ерекшелігі — бұл нейрондарды тілмей және сәулеленбей-ақ көруге болады: қарашық арқылы, ОКТ және көз түбін суретке түсіру көмегімен. Орталық жүйке жүйесінің басқа ешбір бөлігін дәл осылай оңай әрі ауыртпай қарап шығу мүмкін емес. Сондықтан тор қабықты жүйке тінін тұтастай зерттеуге ыңғайлы үлгі ретінде жиі қарастырады.',
        ],
        en: [
          'During development the retina forms from the same tissue as the brain and is, in effect, a part of the brain placed in the eye. Retinal ganglion cells are neurons whose fibres form the optic nerve and carry signals to the brain. Besides ganglion cells, the retina contains other neurons linked into complex networks, much as in the brain.',
          'What makes the retina unique is that these neurons can be seen without surgery or radiation: through the pupil, using OCT and fundus photography. No other part of the central nervous system can be examined so simply and painlessly. This is why the retina is increasingly seen as a convenient model for studying nervous tissue more broadly.',
        ],
      },
    },
    {
      id: 'why-neurodegeneration',
      title: {
        ru: 'Почему это интересно при нейродегенерации',
        kk: 'Нейродегенерация кезінде бұл неліктен қызықты',
        en: 'Why it matters for neurodegeneration',
      },
      body: {
        ru: [
          'Болезнь Альцгеймера и другие нейродегенеративные заболевания развиваются медленно, и изменения в мозге начинаются задолго до явных симптомов. Исследователи предполагают, что часть этих процессов может отражаться и в нейронах сетчатки. Если это подтвердится, сетчатка могла бы стать источником ранних, доступных и неинвазивных маркеров.',
        ],
        kk: [
          'Альцгеймер ауруы мен басқа нейродегенеративтік аурулар баяу дамиды, ал мидағы өзгерістер айқын белгілер пайда болғанға дейін көп бұрын басталады. Зерттеушілер бұл үдерістердің бір бөлігі тор қабық нейрондарында да көрініс табуы мүмкін деп болжайды. Егер бұл расталса, тор қабық ерте, қолжетімді және инвазивті емес маркерлердің көзі бола алар еді.',
        ],
        en: [
          'Alzheimer’s disease and other neurodegenerative conditions develop slowly, and changes in the brain begin long before obvious symptoms. Researchers suspect that some of these processes may also be reflected in retinal neurons. If this is confirmed, the retina could become a source of early, accessible and non-invasive markers.',
        ],
      },
      list: {
        ru: [
          'сетчатку можно обследовать быстро и безболезненно',
          'исследование можно повторять и следить за динамикой',
          'ОКТ широко доступна в офтальмологии',
          'но связь с болезнями мозга ещё изучается',
        ],
        kk: [
          'тор қабықты жылдам әрі ауыртпай тексеруге болады',
          'зерттеуді қайталап, өзгерісті бақылауға болады',
          'ОКТ офтальмологияда кеңінен қолжетімді',
          'бірақ ми ауруларымен байланысы әлі зерттелуде',
        ],
        en: [
          'the retina can be examined quickly and painlessly',
          'tests can be repeated to track change over time',
          'OCT is widely available in eye care',
          'but the link with brain disease is still being studied',
        ],
      },
    },
    {
      id: 'mouse-model-research',
      title: {
        ru: 'Что изучают на моделях',
        kk: 'Үлгілерде не зерттеледі',
        en: 'What animal-model research explores',
      },
      body: {
        ru: [
          'Чтобы понять, как меняются нейроны сетчатки, учёные используют лабораторные модели. В работе, опубликованной в журнале Diagnostics в 2026 году, исследовалась текстура дендритов (ветвящихся отростков) ганглиозных клеток сетчатки у мышей линии 3xTg, моделирующей болезнь Альцгеймера, и возможность классифицировать её с помощью машинного обучения. Цель такой работы — проверить, различимы ли изменения нейронов при заболевании.',
          'Такие исследования отвечают на фундаментальный вопрос: несут ли микроскопические особенности нейронов сетчатки информацию о процессах, связанных с болезнью. Но мышь не человек, а микроскопия ткани — не то же самое, что снимок живого глаза. Путь от подобных результатов до клинического теста долгий и требует исследований с участием людей.',
        ],
        kk: [
          'Тор қабық нейрондарының қалай өзгеретінін түсіну үшін ғалымдар зертханалық үлгілерді пайдаланады. 2026 жылы Diagnostics журналында жарияланған жұмыста Альцгеймер ауруын үлгілейтін 3xTg желісіндегі тышқандардың тор қабық ганглийлік жасушаларының дендрит (тармақталған өсінді) текстурасы және оны машиналық оқыту арқылы жіктеу мүмкіндігі зерттелді. Мұндай жұмыстың мақсаты — ауру кезінде нейрондардағы өзгерістерді ажыратуға бола ма, соны тексеру.',
          'Мұндай зерттеулер іргелі сұраққа жауап іздейді: тор қабық нейрондарының микроскопиялық ерекшеліктері ауруға байланысты үдерістер туралы ақпарат бере ме. Бірақ тышқан адам емес, ал тінді микроскоппен зерттеу тірі көздің суретімен бірдей емес. Мұндай нәтижелерден клиникалық тестке дейінгі жол ұзақ және адамдар қатысатын зерттеулерді қажет етеді.',
        ],
        en: [
          'To understand how retinal neurons change, scientists use laboratory models. A study published in Diagnostics in 2026 examined the dendritic texture (the branching extensions) of retinal ganglion cells in 3xTg mice, a model of Alzheimer’s disease, and whether machine learning could classify it. The aim of such work is to test whether changes in neurons can be told apart in disease.',
          'Research like this addresses a fundamental question: do microscopic features of retinal neurons carry information about disease-related processes? But a mouse is not a person, and microscopy of tissue is not the same as imaging a living eye. The path from such findings to a clinical test is long and requires studies in people.',
        ],
      },
    },
    {
      id: 'what-it-means-today',
      title: {
        ru: 'Что это значит для пациентов сегодня',
        kk: 'Бұл бүгін науқастар үшін нені білдіреді',
        en: 'What it means for patients today',
      },
      body: {
        ru: [
          'Сегодня не существует признанного теста, который по снимку сетчатки ставил бы диагноз болезни Альцгеймера. Обычное обследование глаза не заменяет консультацию невролога. Если вас беспокоят память, внимание или ориентирование, обратитесь к неврологу или терапевту. Ранние признаки болезни Альцгеймера сегодня оценивают с помощью клинического обследования, тестов памяти и других методов, которые назначает специалист.',
          'При этом регулярный осмотр глаз остаётся важным сам по себе: ОКТ и осмотр глазного дна помогают выявлять глаукому, возрастные изменения жёлтого пятна и диабетическое поражение сетчатки. На приёме в центре врач выполнит эти исследования и объяснит результаты, опираясь на проверенные клинические критерии. Также врач подскажет, когда прийти на следующий осмотр.',
        ],
        kk: [
          'Бүгінде тор қабық суреті бойынша Альцгеймер ауруына диагноз қоятын танылған тест жоқ. Көзді әдеттегідей тексеру невропатолог кеңесінің орнын баспайды. Егер есте сақтау, зейін не бағдарлау сізді алаңдатса, невропатологқа не терапевтке жүгініңіз. Бүгінде Альцгеймер ауруының ерте белгілері клиникалық тексеру, есте сақтау тесттері және маман тағайындайтын басқа әдістер арқылы бағаланады.',
          'Сонымен қатар көзді үнемі тексеру өзі-ақ маңызды: ОКТ мен көз түбін қарау глаукоманы, сары дақтың жасқа байланысты өзгерістерін және тор қабықтың диабеттік зақымдануын анықтауға көмектеседі. Орталықтағы қабылдауда дәрігер осы зерттеулерді жасап, нәтижелерді сыналған клиникалық өлшемдерге сүйене отырып түсіндіреді. Сондай-ақ дәрігер келесі тексеруді қашан өту керегін айтады.',
        ],
        en: [
          'There is currently no recognised test that diagnoses Alzheimer’s disease from a retinal scan. A routine eye examination does not replace a neurological assessment. If you are worried about memory, attention or orientation, see a neurologist or your general practitioner. Early signs of Alzheimer’s disease are currently assessed through clinical examination, memory tests and other methods chosen by a specialist.',
          'Regular eye checks remain valuable in their own right: OCT and fundus examination help detect glaucoma, age-related macular changes and diabetic damage to the retina. At the centre, the doctor will carry out these tests and explain the results using established clinical criteria. The doctor will also advise when to come back for your next check.',
        ],
      },
      list: {
        ru: [
          'исследования сетчатки и мозга — перспективное научное направление',
          'результаты на животных нельзя напрямую переносить на людей',
          'диагноз болезни Альцгеймера ставит невролог',
          'регулярный осмотр глаз полезен независимо от этого',
        ],
        kk: [
          'тор қабық пен миды зерттеу — болашағы бар ғылыми бағыт',
          'жануарлардағы нәтижелерді адамдарға тікелей көшіруге болмайды',
          'Альцгеймер ауруына диагнозды невропатолог қояды',
          'көзді үнемі тексеру бұған қарамастан пайдалы',
        ],
        en: [
          'retina and brain research is a promising scientific field',
          'animal results cannot be applied directly to people',
          'Alzheimer\'s disease is diagnosed by a neurologist',
          'regular eye checks are useful regardless',
        ],
      },
    },
  ],
  faq: [
    {
      q: {
        ru: 'Можно ли по ОКТ узнать, будет ли у меня болезнь Альцгеймера?',
        kk: 'ОКТ арқылы менде Альцгеймер ауруы болатынын білуге бола ма?',
        en: 'Can an OCT scan tell me whether I will develop Alzheimer\'s?',
      },
      a: {
        ru: 'Нет. Связь между изменениями сетчатки и болезнью Альцгеймера пока изучается в исследованиях. ОКТ используется для диагностики заболеваний глаза, а оценкой памяти и мышления занимаются неврологи.',
        kk: 'Жоқ. Тор қабық өзгерістері мен Альцгеймер ауруы арасындағы байланыс әзірге зерттеулерде қарастырылуда. ОКТ көз ауруларын анықтау үшін қолданылады, ал есте сақтау мен ойлауды невропатологтар бағалайды.',
        en: 'No. The link between retinal changes and Alzheimer\'s disease is still being investigated. OCT is used to diagnose eye conditions, while memory and thinking are assessed by neurologists.',
      },
    },
    {
      q: {
        ru: 'Зачем тогда проводить такие исследования на мышах?',
        kk: 'Онда мұндай зерттеулерді тышқандарда не үшін жүргізеді?',
        en: 'Why carry out this research in mice at all?',
      },
      a: {
        ru: 'Модели позволяют детально изучить ткань и проверить идеи, которые невозможно проверить у человека напрямую. Если идея подтверждается, её переносят в исследования с участием людей, где оценивают, работает ли она в реальной клинической практике.',
        kk: 'Үлгілер тінді егжей-тегжейлі зерттеуге және адамда тікелей тексеру мүмкін емес идеяларды сынауға мүмкіндік береді. Идея расталса, ол адамдар қатысатын зерттеулерге ауыстырылып, нақты клиникалық тәжірибеде жұмыс істейтіні бағаланады.',
        en: 'Models allow tissue to be studied in detail and ideas to be tested that cannot be checked directly in people. If an idea holds up, it moves into studies with human participants, where researchers assess whether it works in real clinical practice.',
      },
    },
  ],
  sources: [
    {
      label: 'Diagnostics (MDPI), 2026 — The Machine Learning Classification of Retinal Ganglion Cell Dendritic Texture in a 3xTg-Alzheimer\'s Disease Mouse Model',
      href: 'https://www.mdpi.com/2075-4418/16/16/2672',
    },
  ],
};

export default body;
