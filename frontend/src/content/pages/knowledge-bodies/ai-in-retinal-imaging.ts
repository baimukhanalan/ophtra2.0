import type { KnowledgeArticleBody } from '../knowledge-types';

/**
 * Knowledge base — body of «Искусственный интеллект в исследовании сетчатки: возможности и границы».
 * Loaded on demand by the article page; the listing only reads
 * knowledge-articles-index.ts.
 */
const body: KnowledgeArticleBody = {
  sections: [
    {
      id: 'how-ai-reads-images',
      title: {
        ru: 'Как ИИ «читает» снимки',
        kk: 'Жасанды интеллект суреттерді қалай «оқиды»',
        en: 'How AI "reads" an image',
      },
      body: {
        ru: [
          'Оптическая когерентная томография (ОКТ) и фотографии глазного дна дают подробные изображения сетчатки и зрительного нерва. Алгоритмы машинного обучения тренируют на большом количестве таких снимков, размеченных специалистами. Постепенно модель учится замечать закономерности: толщину слоёв, отёк, кровоизлияния, изменения в области жёлтого пятна. Такие размеченные наборы снимков называют обучающими данными.',
          'Важно понимать, что алгоритм не «видит» глаз так, как врач. Он находит статистические признаки в пикселях, которые в обучающих данных были связаны с определённым состоянием. Поэтому качество работы модели напрямую зависит от того, на каких снимках и каких людях её обучали. Модель, обученная на снимках одного прибора или одной группы людей, может работать хуже на другом приборе или у других пациентов.',
        ],
        kk: [
          'Оптикалық когерентті томография (ОКТ) мен көз түбінің суреттері тор қабық пен көру жүйкесінің егжей-тегжейлі бейнесін береді. Машиналық оқыту алгоритмдері мамандар белгілеген осындай көптеген суреттерде үйретіледі. Модель бірте-бірте заңдылықтарды байқауға үйренеді: қабаттардың қалыңдығын, ісінуді, қан құйылуларды, сары дақ аймағындағы өзгерістерді. Мұндай белгіленген суреттер жиынтығын оқыту деректері деп атайды.',
          'Алгоритм көзді дәрігер сияқты «көрмейтінін» түсіну маңызды. Ол пиксельдерден оқыту деректерінде белгілі бір жағдаймен байланысты болған статистикалық белгілерді табады. Сондықтан модельдің жұмыс сапасы оның қандай суреттерде және қандай адамдарда үйретілгеніне тікелей байланысты. Бір құрылғының не бір топ адамның суреттерінде үйретілген модель басқа құрылғыда немесе басқа науқастарда нашар жұмыс істеуі мүмкін.',
        ],
        en: [
          'Optical coherence tomography (OCT) and fundus photographs provide detailed images of the retina and optic nerve. Machine-learning algorithms are trained on large numbers of such images that specialists have labelled. Gradually the model learns to recognise patterns: layer thickness, swelling, haemorrhages and changes around the macula. These labelled collections are known as training data.',
          'It is important to understand that an algorithm does not "see" the eye the way a doctor does. It detects statistical features in pixels that, in its training data, were associated with a particular condition. How well a model performs therefore depends directly on which images, and which people, it was trained on. A model trained on images from one device or one group of people may perform less well on another device or in other patients.',
        ],
      },
    },
    {
      id: 'what-it-can-and-cannot-do',
      title: {
        ru: 'Что ИИ умеет и чего не умеет',
        kk: 'Жасанды интеллект не істей алады, не істей алмайды',
        en: 'What AI can and cannot do',
      },
      body: {
        ru: [
          'В исследованиях алгоритмы хорошо справляются с узкими, чётко поставленными задачами, например с сортировкой снимков при диабетической ретинопатии или измерением слоёв сетчатки. Это может ускорить работу и помочь не пропустить изменения при большом потоке обследований. При этом модель не знает истории болезни, жалоб и лекарств пациента и может ошибаться на снимках, непохожих на обучающие.',
        ],
        kk: [
          'Зерттеулерде алгоритмдер тар, нақты қойылған міндеттерді жақсы орындайды, мысалы диабеттік ретинопатия кезінде суреттерді сұрыптау немесе тор қабық қабаттарын өлшеу. Бұл жұмысты жеделдетіп, тексерулер көп болғанда өзгерістерді жіберіп алмауға көмектесуі мүмкін. Алайда модель науқастың ауру тарихын, шағымдарын және қабылдайтын дәрілерін білмейді, әрі оқыту деректеріне ұқсамайтын суреттерде қателесуі мүмкін.',
        ],
        en: [
          'In research, algorithms do well at narrow, clearly defined tasks, such as sorting images in diabetic retinopathy or measuring retinal layers. This can speed up work and help avoid missing changes when many scans need reviewing. However, a model does not know the patient’s history, symptoms or medications, and it may make mistakes on images unlike those it was trained on.',
        ],
      },
      list: {
        ru: [
          'может: быстро измерять и сравнивать структуры на снимках',
          'может: подсказывать, на какие участки обратить внимание',
          'не может: учитывать жалобы и историю болезни',
          'не может: самостоятельно ставить диагноз и назначать лечение',
        ],
        kk: [
          'алады: суреттердегі құрылымдарды жылдам өлшеп, салыстыру',
          'алады: қай аймақтарға назар аудару керегін ұсыну',
          'алмайды: шағымдар мен ауру тарихын ескеру',
          'алмайды: өз бетінше диагноз қойып, ем тағайындау',
        ],
        en: [
          'can: measure and compare structures on scans quickly',
          'can: highlight areas that deserve a closer look',
          'cannot: take symptoms and medical history into account',
          'cannot: diagnose or prescribe treatment on its own',
        ],
      },
    },
    {
      id: 'doctor-and-privacy',
      title: {
        ru: 'Ответственность врача и защита данных',
        kk: 'Дәрігердің жауапкершілігі және деректерді қорғау',
        en: 'Clinical responsibility and data privacy',
      },
      body: {
        ru: [
          'Даже самый точный алгоритм — это инструмент поддержки решений, а не замена специалиста. Врач сопоставляет результат анализа с осмотром, жалобами и другими исследованиями и несёт ответственность за заключение. Всемирная организация здравоохранения в своём руководстве по этике ИИ подчёркивает, что человек должен сохранять контроль над медицинскими решениями.',
          'Снимки глаза — это персональные медицинские данные. Их использование в исследованиях требует согласия, обезличивания и надёжного хранения. Пациент вправе знать, как применяются его данные, и задавать об этом вопросы. В исследованиях снимки обычно используют без имени и других сведений, по которым можно узнать человека, а доступ к ним ограничивают. Эти правила защищают пациентов и одновременно позволяют науке развиваться.',
        ],
        kk: [
          'Ең дәл алгоритмнің өзі маманның орнын баспайды, ол тек шешім қабылдауды қолдайтын құрал. Дәрігер талдау нәтижесін тексерумен, шағымдармен және басқа зерттеулермен салыстырып, қорытындыға жауап береді. Дүниежүзілік денсаулық сақтау ұйымы жасанды интеллект этикасы жөніндегі нұсқаулығында медициналық шешімдерді адам бақылауы тиіс екенін атап көрсетеді.',
          'Көздің суреттері — дербес медициналық деректер. Оларды зерттеулерде пайдалану келісімді, иесіздендіруді және сенімді сақтауды талап етеді. Науқас өз деректерінің қалай қолданылатынын білуге және бұл туралы сұрақ қоюға құқылы. Зерттеулерде суреттер әдетте адамды тануға болатын аты-жөні мен басқа мәліметтерсіз пайдаланылады, ал оларға қолжетімділік шектеледі. Бұл ережелер науқастарды қорғайды әрі ғылымның дамуына мүмкіндік береді.',
        ],
        en: [
          'Even the most accurate algorithm is a decision-support tool, not a replacement for a specialist. The doctor weighs its output against the examination, symptoms and other tests, and remains responsible for the conclusion. The World Health Organization’s guidance on the ethics of AI in health stresses that humans must stay in control of medical decisions.',
          'Eye images are personal medical data. Using them in research requires consent, de-identification and secure storage. Patients have the right to know how their data are used and to ask questions about it. In research, images are normally used without names or other details that could identify a person, and access to them is restricted. These rules protect patients while still allowing science to move forward.',
        ],
      },
    },
    {
      id: 'research-direction',
      title: {
        ru: 'Куда движутся исследования',
        kk: 'Зерттеулер қайда бағытталған',
        en: 'Where research is heading',
      },
      body: {
        ru: [
          'Одно из направлений — поиск в изображениях сетчатки тонких признаков, которые трудно оценить глазом. Например, в работе, опубликованной в журнале Diagnostics в 2026 году, методы машинного обучения применялись для классификации текстуры дендритов ганглиозных клеток сетчатки на мышиной модели болезни Альцгеймера. Это фундаментальное исследование на животных, а не готовый клинический тест.',
          'Такие работы помогают понять, какую информацию в принципе можно извлечь из изображений сетчатки. Прежде чем подобные подходы попадут в клинику, их нужно проверить на людях, оценить надёжность и безопасность. Важно также понять, в каких ситуациях алгоритм ошибается и как врачу лучше всего использовать его подсказки. Этот путь занимает годы, и спешка здесь недопустима.',
        ],
        kk: [
          'Бағыттардың бірі — тор қабық бейнелерінен көзбен бағалау қиын нәзік белгілерді іздеу. Мысалы, 2026 жылы Diagnostics журналында жарияланған жұмыста машиналық оқыту әдістері Альцгеймер ауруының тышқан үлгісінде тор қабықтың ганглийлік жасушаларындағы дендрит текстурасын жіктеуге қолданылды. Бұл дайын клиникалық тест емес, жануарларға жүргізілген іргелі зерттеу.',
          'Мұндай жұмыстар тор қабық бейнелерінен негізінен қандай ақпарат алуға болатынын түсінуге көмектеседі. Осындай тәсілдер клиникаға енгенге дейін оларды адамдарда тексеріп, сенімділігі мен қауіпсіздігін бағалау қажет. Сондай-ақ алгоритмнің қандай жағдайларда қателесетінін және дәрігердің оның ұсыныстарын қалай тиімді пайдалана алатынын түсіну маңызды. Бұл жол жылдарға созылады, мұнда асығуға болмайды.',
        ],
        en: [
          'One direction is searching retinal images for subtle features that are hard to judge by eye. For example, a study published in Diagnostics in 2026 applied machine learning to classify the dendritic texture of retinal ganglion cells in a mouse model of Alzheimer’s disease. This is basic research in animals, not a ready-made clinical test.',
          'Work of this kind helps clarify what information can, in principle, be extracted from retinal images. Before such approaches reach the clinic, they must be tested in people and assessed for reliability and safety. It is also important to understand when an algorithm gets things wrong and how doctors can best use its suggestions. This path takes years, and it should not be rushed.',
        ],
      },
      list: {
        ru: [
          'проверка алгоритмов на разных группах пациентов',
          'прозрачность: понимать, на чём основан вывод модели',
          'поиск ранних признаков заболеваний в изображениях',
          'совместная работа врача и алгоритма',
        ],
        kk: [
          'алгоритмдерді науқастардың әртүрлі топтарында тексеру',
          'ашықтық: модель қорытындысының неге негізделгенін түсіну',
          'бейнелерден аурулардың ерте белгілерін іздеу',
          'дәрігер мен алгоритмнің бірлескен жұмысы',
        ],
        en: [
          'testing algorithms across diverse patient groups',
          'transparency about what a model’s output is based on',
          'searching images for early signs of disease',
          'doctors and algorithms working together',
        ],
      },
    },
    {
      id: 'at-the-centre',
      title: {
        ru: 'Что это значит для вас сегодня',
        kk: 'Бұл бүгін сіз үшін нені білдіреді',
        en: 'What this means for you today',
      },
      body: {
        ru: [
          'Сегодня основа диагностики — это осмотр врача и проверенные методы, такие как ОКТ и фотографирование глазного дна. На обследовании в центре снимки сетчатки оценивает офтальмолог, который объясняет результаты и при необходимости предлагает повторный контроль. Если вы заметили внезапное ухудшение зрения, искажение линий или тёмное пятно перед глазом, обратитесь к врачу без промедления, не дожидаясь планового визита.',
        ],
        kk: [
          'Бүгінде диагностиканың негізі — дәрігердің тексеруі және ОКТ, көз түбін суретке түсіру сияқты сыналған әдістер. Орталықтағы тексеруде тор қабық суреттерін офтальмолог бағалап, нәтижелерді түсіндіреді және қажет болса, қайта бақылауды ұсынады. Көрудің кенет нашарлағанын, сызықтардың қисаюын не көз алдындағы қара дақты байқасаңыз, жоспарлы келуді күтпей, дереу дәрігерге жүгініңіз.',
        ],
        en: [
          'Today, diagnosis rests on a doctor’s examination and proven methods such as OCT and fundus photography. At the centre, retinal images are assessed by an ophthalmologist who explains the results and, where needed, suggests follow-up. If you notice a sudden drop in vision, distorted straight lines or a dark patch in your sight, see a doctor promptly rather than waiting for a routine visit.',
        ],
      },
    },
  ],
  faq: [
    {
      q: {
        ru: 'Может ли программа поставить мне диагноз без врача?',
        kk: 'Бағдарлама маған дәрігерсіз диагноз қоя ала ма?',
        en: 'Can software diagnose me without a doctor?',
      },
      a: {
        ru: 'Нет. Алгоритм может помочь в анализе снимков, но не учитывает жалобы, историю болезни и данные осмотра. Заключение и выбор лечения остаются за офтальмологом, который несёт за них ответственность. Алгоритм остаётся лишь вспомогательным инструментом.',
        kk: 'Жоқ. Алгоритм суреттерді талдауға көмектесуі мүмкін, бірақ шағымдарды, ауру тарихын және тексеру деректерін ескермейді. Қорытынды мен емді таңдау оларға жауап беретін офтальмологта қалады. Алгоритм тек көмекші құрал болып қала береді.',
        en: 'No. An algorithm may help analyse images, but it does not take into account your symptoms, history or examination findings. The conclusion and the choice of treatment remain with the ophthalmologist, who is responsible for them. The algorithm remains only a supporting tool.',
      },
    },
    {
      q: {
        ru: 'Используются ли мои снимки для исследований?',
        kk: 'Менің суреттерім зерттеулерге пайдаланыла ма?',
        en: 'Are my scans used for research?',
      },
      a: {
        ru: 'Медицинские изображения могут использоваться в исследованиях только с соблюдением закона, с согласия пациента и после обезличивания. Если вас интересует этот вопрос, спросите врача: вы имеете право знать, как обрабатываются ваши данные.',
        kk: 'Медициналық бейнелер зерттеулерде тек заң талаптары сақталып, науқастың келісімімен және иесіздендірілгеннен кейін ғана пайдаланылуы мүмкін. Бұл сұрақ сізді қызықтырса, дәрігерден сұраңыз: деректеріңіздің қалай өңделетінін білуге құқығыңыз бар.',
        en: 'Medical images may be used in research only in line with the law, with patient consent and after de-identification. If this concerns you, ask your doctor: you have the right to know how your data are handled.',
      },
    },
  ],
  sources: [
    {
      label: 'Diagnostics (MDPI), 2026 — The Machine Learning Classification of Retinal Ganglion Cell Dendritic Texture in a 3xTg-Alzheimer\'s Disease Mouse Model',
      href: 'https://www.mdpi.com/2075-4418/16/16/2672',
    },
    {
      label: 'World Health Organization — Ethics and governance of artificial intelligence for health',
      href: 'https://www.who.int/publications/i/item/9789240029200',
    },
  ],
};

export default body;
