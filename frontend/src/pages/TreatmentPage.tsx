import { useI18n } from '@/i18n';
import { byId, departments } from '@/content';
import { DepartmentPageTemplate } from '@/components/DepartmentPageTemplate';

const TreatmentPage = () => {
  const { t } = useI18n();
  const department = byId(departments, 'treatment')!;

  return (
    <DepartmentPageTemplate
      department={department}
      navLabel={t.nav.treatment}
      faqTopics={['general', 'diagnostics']}
      indications={[
        {
          ru: 'Глаукома и повышенное внутриглазное давление',
          kk: 'Глаукома және жоғары көзішілік қысым',
          en: 'Glaucoma and elevated intraocular pressure',
        },
        {
          ru: 'Диабетическая ретинопатия и макулодистрофия',
          kk: 'Диабеттік ретинопатия және макулодистрофия',
          en: 'Diabetic retinopathy and macular degeneration',
        },
        {
          ru: 'Синдром сухого глаза и хроническое раздражение',
          kk: 'Құрғақ көз синдромы және созылмалы тітіркену',
          en: 'Dry eye syndrome and chronic irritation',
        },
        {
          ru: 'Кератиты, конъюнктивиты и воспалительные заболевания',
          kk: 'Кератиттер, конъюнктивиттер және қабыну аурулары',
          en: 'Keratitis, conjunctivitis and inflammatory conditions',
        },
        {
          ru: 'Появление «мушек», вспышек или пелены перед глазами',
          kk: 'Көз алдында «шыбындар», жарқылдар немесе перде пайда болуы',
          en: 'Floaters, flashes or a veil appearing before the eyes',
        },
      ]}
      steps={[
        {
          id: 'step-1',
          title: { ru: 'Первичный приём', kk: 'Бастапқы қабылдау', en: 'Initial visit' },
          text: {
            ru: 'Осмотр, оценка жалоб и базовые измерения. Врач определяет объём дальнейшего обследования.',
            kk: 'Қарау, шағымдарды бағалау және негізгі өлшемдер. Дәрігер одан әрі тексеру көлемін анықтайды.',
            en: 'Examination, assessment of complaints and baseline measurements. The doctor sets the scope of further testing.',
          },
        },
        {
          id: 'step-2',
          title: { ru: 'Уточняющая диагностика', kk: 'Нақтылаушы диагностика', en: 'Confirmatory diagnostics' },
          text: {
            ru: 'ОКТ, периметрия, оценка слёзной плёнки или биомикроскопия — в зависимости от предполагаемого диагноза.',
            kk: 'Болжамды диагнозға байланысты ОКТ, периметрия, жас қабықшасын бағалау немесе биомикроскопия.',
            en: 'OCT, perimetry, tear film assessment or biomicroscopy, depending on the suspected diagnosis.',
          },
        },
        {
          id: 'step-3',
          title: { ru: 'Назначение терапии', kk: 'Терапия тағайындау', en: 'Prescribing therapy' },
          text: {
            ru: 'Схема лечения подбирается по международным клиническим рекомендациям и фиксируется письменно.',
            kk: 'Емдеу сызбасы халықаралық клиникалық ұсыныстар бойынша таңдалып, жазбаша тіркеледі.',
            en: 'The regimen follows international clinical guidelines and is recorded in writing.',
          },
        },
        {
          id: 'step-4',
          title: { ru: 'Контроль эффективности', kk: 'Тиімділікті бақылау', en: 'Checking effectiveness' },
          text: {
            ru: 'Повторный визит через 2–6 недель: врач сравнивает показатели с исходными и корректирует терапию.',
            kk: '2–6 аптадан кейінгі қайта келу: дәрігер көрсеткіштерді бастапқымен салыстырып, терапияны түзетеді.',
            en: 'A repeat visit after 2–6 weeks: the doctor compares readings with the baseline and adjusts therapy.',
          },
        },
        {
          id: 'step-5',
          title: { ru: 'Длительное наблюдение', kk: 'Ұзақ мерзімді бақылау', en: 'Long-term monitoring' },
          text: {
            ru: 'При хронических заболеваниях визиты планируются на год вперёд, история хранится в личном кабинете.',
            kk: 'Созылмалы ауруларда келулер бір жылға алдын ала жоспарланады, тарих жеке кабинетте сақталады.',
            en: 'For chronic conditions, visits are scheduled a year ahead and the history is kept in the patient account.',
          },
        },
      ]}
    />
  );
};

export default TreatmentPage;
