import { useI18n } from '@/i18n';
import { byId, departments } from '@/content';
import { DepartmentPageTemplate } from '@/components/DepartmentPageTemplate';

const CataractPage = () => {
  const { t } = useI18n();
  const department = byId(departments, 'cataract')!;

  return (
    <DepartmentPageTemplate
      department={department}
      navLabel={t.nav.cataract}
      faqTopics={['cataract', 'payments']}
      indications={[
        {
          ru: 'Ощущение пелены или тумана перед глазами',
          kk: 'Көз алдында перде немесе тұман сезімі',
          en: 'A sense of veil or fog before the eyes',
        },
        {
          ru: 'Ухудшение зрения в сумерках и засветы от фар',
          kk: 'Ымыртта көрудің нашарлауы және шамдардан жарқыл',
          en: 'Worse vision at dusk and glare from headlights',
        },
        {
          ru: 'Частая смена очков без улучшения зрения',
          kk: 'Көру жақсармай көзілдіріктің жиі ауысуы',
          en: 'Frequent changes of glasses without improvement',
        },
        {
          ru: 'Ослабление яркости и контрастности цветов',
          kk: 'Түстердің жарықтығы мен контрастының әлсіреуі',
          en: 'Colours losing brightness and contrast',
        },
        {
          ru: 'Вторичная катаракта после ранее выполненной операции',
          kk: 'Бұрын жасалған операциядан кейінгі екіншілік катаракта',
          en: 'Secondary cataract after previous surgery',
        },
      ]}
      steps={[
        {
          id: 'step-1',
          title: { ru: 'Консультация хирурга', kk: 'Хирург кеңесі', en: 'Surgeon consultation' },
          text: {
            ru: 'Оценка стадии катаракты, состояния роговицы и сетчатки. Врач объясняет варианты линз и ожидаемый результат.',
            kk: 'Катаракта сатысын, қасаң қабық пен тор қабық жағдайын бағалау. Дәрігер линза нұсқалары мен күтілетін нәтижені түсіндіреді.',
            en: 'Assessment of the cataract stage and the condition of the cornea and retina. The surgeon explains lens options and the expected outcome.',
          },
        },
        {
          id: 'step-2',
          title: { ru: 'Расчёт линзы', kk: 'Линзаны есептеу', en: 'Lens calculation' },
          text: {
            ru: 'Биометрия глаза и подбор оптической силы интраокулярной линзы под целевую рефракцию пациента.',
            kk: 'Көз биометриясы және пациенттің мақсатты рефракциясына интраокулярлық линзаның оптикалық күшін таңдау.',
            en: 'Ocular biometry and selection of the intraocular lens power for the patient’s target refraction.',
          },
        },
        {
          id: 'step-3',
          title: { ru: 'Операция', kk: 'Операция', en: 'Surgery' },
          text: {
            ru: 'Факоэмульсификация через микроразрез под местной анестезией. Как правило, швы не нужны.',
            kk: 'Жергілікті анестезиямен микрокіру арқылы факоэмульсификация. Әдетте тігіс қажет емес.',
            en: 'Phacoemulsification through a micro-incision under local anaesthesia. Stitches are usually not needed.',
          },
        },
        {
          id: 'step-4',
          title: { ru: 'Выписка в тот же день', kk: 'Сол күні шығару', en: 'Same-day discharge' },
          text: {
            ru: 'Через 1,5–2 часа после вмешательства пациент уходит домой. Первый контроль — на следующий день.',
            kk: 'Араласудан кейін 1,5–2 сағаттан соң пациент үйіне қайтады. Алғашқы бақылау — келесі күні.',
            en: 'The patient goes home 1.5–2 hours after the procedure. The first check-up is the next day.',
          },
        },
        {
          id: 'step-5',
          title: { ru: 'Наблюдение 6 месяцев', kk: '6 ай бақылау', en: 'Six months of follow-up' },
          text: {
            ru: 'Четыре контрольных осмотра и подбор очковой коррекции при необходимости после стабилизации зрения.',
            kk: 'Төрт бақылау қарауы және көру тұрақтанғаннан кейін қажет болса көзілдірік түзетуін таңдау.',
            en: 'Four follow-up examinations and, once vision stabilises, spectacle correction if needed.',
          },
        },
      ]}
    />
  );
};

export default CataractPage;
