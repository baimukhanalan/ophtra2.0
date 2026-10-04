import type { ServiceContent } from '../services-types';

/** Long-form patient copy for /services/prk (spec §6). Loaded on demand. */
const content: ServiceContent = {
  kind: 'surgery',
  lead: {
    ru: 'ФРК (фоторефрактивная кератэктомия) — поверхностная лазерная коррекция зрения без роговичного лоскута, которую часто выбирают при тонкой роговице.',
    kk: 'ФРК (фоторефрактивтік кератэктомия) — қасаң қабық жапырақшасын жасамай көруді беткі лазермен түзету, оны көбінесе қасаң қабық жұқа болғанда таңдайды.',
    en: 'PRK (photorefractive keratectomy) is surface laser vision correction without a corneal flap, often chosen when the cornea is thin.',
  },
  overview: {
    ru: [
      'При ФРК хирург удаляет тонкий поверхностный слой роговицы — эпителий, а затем эксимерный лазер изменяет форму роговицы. Лоскут не формируется, поэтому сохраняется больше собственной ткани роговицы. После операции на глаз надевают защитную мягкую линзу, пока эпителий восстанавливается.',
      'Восстановление после ФРК дольше и в первые дни ощутимее, чем после Femto-LASIK или SMILE, но метод остаётся надёжным вариантом при тонкой роговице, особенностях её поверхности или высоком риске травм глаза. При кератоконусе, выраженном «сухом глазе», некоторых общих заболеваниях и во время беременности ФРК может быть не рекомендована — это определяет врач.',
    ],
    kk: [
      'ФРК кезінде хирург қасаң қабықтың жұқа беткі қабатын — эпителийді алып тастайды, содан кейін эксимерлік лазер қасаң қабықтың пішінін өзгертеді. Жапырақша жасалмайтындықтан, қасаң қабықтың өз тіні көбірек сақталады. Операциядан кейін эпителий қалпына келгенше көзге қорғаныш жұмсақ линза кигізіледі.',
      'ФРК-дан кейін қалпына келу Femto-LASIK немесе SMILE-мен салыстырғанда ұзағырақ әрі алғашқы күндері сезілерліктей болады, бірақ қасаң қабық жұқа болса, оның бетінде ерекшеліктер болса немесе көз жарақатының қаупі жоғары болса, бұл әдіс сенімді нұсқа болып қала береді. Кератоконус, айқын «құрғақ көз», кейбір жалпы аурулар кезінде және жүктілік кезеңінде ФРК ұсынылмауы мүмкін — мұны дәрігер анықтайды.',
    ],
    en: [
      'In PRK the surgeon removes the thin surface layer of the cornea — the epithelium — and an excimer laser then reshapes the cornea. No flap is made, so more of the cornea\'s own tissue is preserved. A soft bandage contact lens is placed on the eye while the epithelium heals.',
      'Recovery after PRK takes longer and is more noticeable in the first days than after Femto-LASIK or SMILE, but the method remains a reliable option for a thin cornea, particular surface features or a high risk of eye injury. PRK may not be recommended with keratoconus, significant dry eye, certain general health conditions or during pregnancy — your doctor will assess this.',
    ],
  },
  indications: {
    ru: [
      'Близорукость, дальнозоркость или астигматизм небольшой и средней степени',
      'Возраст 18 лет и старше, стабильная рефракция не менее одного года',
      'Тонкая роговица, при которой формирование лоскута нежелательно',
      'Особенности поверхности роговицы (например, рубцы или дистрофия эпителия)',
      'Профессии и виды спорта с повышенным риском травм глаза',
    ],
    kk: [
      'Шамалы және орташа дәрежедегі жақыннан көргіштік, алыстан көргіштік немесе астигматизм',
      'Жасы 18-ден асқан, рефракция кемінде бір жыл тұрақты',
      'Жапырақша жасау қалаусыз болатын жұқа қасаң қабық',
      'Қасаң қабық бетінің ерекшеліктері (мысалы, тыртықтар немесе эпителий дистрофиясы)',
      'Көз жарақатының қаупі жоғары мамандықтар мен спорт түрлері',
    ],
    en: [
      'Low to moderate short-sightedness, long-sightedness or astigmatism',
      'Age 18 or over, with a stable prescription for at least one year',
      'A thin cornea where creating a flap is best avoided',
      'Corneal surface features (for example, scarring or epithelial dystrophy)',
      'Jobs and sports with a higher risk of eye injury',
    ],
  },
  diagnostics: {
    intro: {
      ru: 'Перед ФРК проводится то же расширенное обследование, что и перед другими видами лазерной коррекции.',
      kk: 'ФРК алдында басқа лазерлік түзету түрлері алдындағыдай кеңейтілген тексеру жүргізіледі.',
      en: 'Before PRK you have the same extended assessment as for other types of laser correction.',
    },
    list: {
      ru: [
        'Кератотопография и томография роговицы',
        'Пахиметрия — толщина роговицы',
        'Рефрактометрия, в том числе после расширения зрачка',
        'Оценка слёзной плёнки и глазной поверхности',
        'Осмотр глазного дна',
      ],
      kk: [
        'Кератотопография және қасаң қабық томографиясы',
        'Пахиметрия — қасаң қабықтың қалыңдығы',
        'Рефрактометрия, оның ішінде қарашықты кеңейткеннен кейін',
        'Жас қабықшасы мен көз бетін бағалау',
        'Көз түбін қарау',
      ],
      en: [
        'Corneal topography and tomography',
        'Pachymetry — corneal thickness',
        'Refraction, including after pupil dilation',
        'Tear film and eye surface assessment',
        'Retinal examination',
      ],
    },
  },
  treatment: {
    intro: {
      ru: 'ФРК — один из вариантов лазерной коррекции. Врач объясняет, почему в вашем случае подходит именно он или другой метод.',
      kk: 'ФРК — лазерлік түзетудің бір нұсқасы. Дәрігер сіздің жағдайыңызға неліктен дәл осы немесе басқа әдіс сәйкес келетінін түсіндіреді.',
      en: 'PRK is one of the laser correction options. Your doctor will explain why it, or another method, suits your situation.',
    },
    list: {
      ru: [
        'ФРК — без лоскута, с большим запасом толщины роговицы',
        'Femto-LASIK — более быстрое восстановление при достаточной толщине роговицы',
        'SMILE — через микроразрез, при близорукости и астигматизме',
        'Факичная интраокулярная линза — при высокой рефракции',
        'Очки или контактные линзы',
      ],
      kk: [
        'ФРК — жапырақшасыз, қасаң қабық қалыңдығының қоры көбірек сақталады',
        'Femto-LASIK — қасаң қабық жеткілікті қалың болса, тезірек қалпына келу',
        'SMILE — микрокесік арқылы, жақыннан көргіштік пен астигматизм кезінде',
        'Факиялық көзішілік линза — рефракция жоғары болса',
        'Көзілдірік немесе жанаспа линзалар',
      ],
      en: [
        'PRK — no flap, leaving more corneal thickness in reserve',
        'Femto-LASIK — faster recovery when the cornea is thick enough',
        'SMILE — through a micro-incision, for short-sightedness and astigmatism',
        'Phakic intraocular lens — for high prescriptions',
        'Glasses or contact lenses',
      ],
    },
  },
  preparation: {
    ru: [
      'Прекратите носить контактные линзы до обследования и операции — срок уточнит врач',
      'Не используйте макияж и кремы для лица в день операции',
      'Запланируйте несколько дней отдыха: первые дни после ФРК глаза чувствительны к свету',
      'Попросите кого-то проводить вас домой — за руль садиться нельзя',
    ],
    kk: [
      'Тексеру мен операцияға дейін жанаспа линзаларды тағуды тоқтатыңыз — мерзімін дәрігер нақтылайды',
      'Операция күні бояу-опа мен бетке арналған кремдерді қолданбаңыз',
      'Бірнеше күн демалысты жоспарлаңыз: ФРК-дан кейінгі алғашқы күндері көз жарыққа сезімтал болады',
      'Үйге дейін шығарып салуды біреуден өтініңіз — көлік жүргізуге болмайды',
    ],
    en: [
      'Stop wearing contact lenses before the examination and surgery — your doctor will confirm how long',
      'Do not wear make-up or face creams on the day of surgery',
      'Plan a few days of rest: the eyes are sensitive to light in the first days after PRK',
      'Ask someone to take you home — you must not drive',
    ],
  },
  result: {
    ru: 'Первые дни после ФРК могут сопровождаться дискомфортом, слезотечением и светобоязнью, пока восстанавливается эпителий; защитную линзу врач снимает на контрольном осмотре. Зрение улучшается постепенно и стабилизируется в течение нескольких недель, иногда дольше. Назначаются капли и график контрольных визитов; важно защищать глаза от яркого солнца. Возможны временная сухость и ореолы вокруг огней. Результат индивидуален, и гарантировать определённую остроту зрения нельзя.',
    kk: 'ФРК-дан кейінгі алғашқы күндері эпителий қалпына келгенше жайсыздық, жас ағуы және жарықтан қорқу байқалуы мүмкін; қорғаныш линзаны дәрігер бақылау тексеруінде алады. Көру бірте-бірте жақсарып, бірнеше апта ішінде, кейде одан да ұзағырақ уақытта тұрақтанады. Тамшылар мен бақылау сапарларының кестесі тағайындалады; көзді жарқыраған күннен қорғау маңызды. Уақытша құрғақтық пен шамдардың айналасында гало болуы мүмкін. Нәтиже жеке сипатта, белгілі бір көру өткірлігіне кепілдік беру мүмкін емес.',
    en: 'The first days after PRK may bring discomfort, watering and light sensitivity while the epithelium heals; the bandage lens is removed by your doctor at a check-up. Vision improves gradually and settles over several weeks, sometimes longer. You will be prescribed drops and a schedule of follow-up visits; protecting your eyes from bright sun is important. Temporary dryness and halos around lights are possible. Outcomes vary between individuals, and no specific level of vision can be guaranteed.',
  },
  faq: [
    {
      q: {
        ru: 'Почему после ФРК восстановление дольше?',
        kk: 'ФРК-дан кейін неліктен қалпына келу ұзағырақ?',
        en: 'Why is recovery longer after PRK?',
      },
      a: {
        ru: 'Во время операции удаляется поверхностный слой роговицы, и ему нужно несколько дней, чтобы нарасти заново. Пока это происходит, зрение нечёткое, а глаз может быть чувствительным.',
        kk: 'Операция кезінде қасаң қабықтың беткі қабаты алынып тасталады, оның қайта өсуіне бірнеше күн қажет. Осы уақыт ішінде көру анық болмайды, ал көз сезімтал болуы мүмкін.',
        en: 'The surface layer of the cornea is removed during surgery and takes a few days to grow back. Until then, vision is blurred and the eye may feel sensitive.',
      },
    },
    {
      q: {
        ru: 'Отличается ли итоговый результат ФРК от LASIK?',
        kk: 'ФРК-ның соңғы нәтижесі LASIK-тен өзгеше ме?',
        en: 'Is the final result of PRK different from LASIK?',
      },
      a: {
        ru: 'По данным исследований, при правильном отборе пациентов отдалённые результаты методов сопоставимы; различаются в основном скорость и ощущения в период восстановления.',
        kk: 'Зерттеу деректері бойынша пациенттер дұрыс іріктелгенде әдістердің ұзақ мерзімді нәтижелері салыстырмалы; негізінен қалпына келу жылдамдығы мен сол кезеңдегі сезімдер ерекшеленеді.',
        en: 'Studies suggest that with appropriate patient selection the long-term results are comparable; the main differences are the speed of recovery and how it feels.',
      },
    },
    {
      q: {
        ru: 'Можно ли делать ФРК на оба глаза одновременно?',
        kk: 'ФРК-ны екі көзге бірдей жасауға бола ма?',
        en: 'Can both eyes have PRK at the same time?',
      },
      a: {
        ru: 'Иногда оба глаза оперируют в один день, иногда — с интервалом, чтобы облегчить восстановление. Это обсуждается с хирургом.',
        kk: 'Кейде екі көзге бір күнде операция жасалады, кейде қалпына келуді жеңілдету үшін аралық уақыт қалдырылады. Бұл хирургпен талқыланады.',
        en: 'Sometimes both eyes are treated on the same day, sometimes a few days apart to make recovery easier. This is discussed with your surgeon.',
      },
    },
  ],
  sources: [
    {
      label: 'EyeWiki (AAO) — Photorefractive Keratectomy',
      href: 'https://eyewiki.org/Photorefractive_Keratectomy',
    },
    {
      label: 'NICE IPG164 — Photorefractive (laser) surgery for the correction of refractive errors',
      href: 'https://www.nice.org.uk/guidance/ipg164',
    },
  ],
  topics: ['лазер', 'коррекц', 'близорук', 'роговиц', 'рефракц'],
};

export default content;
