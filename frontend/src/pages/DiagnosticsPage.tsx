import { useI18n } from '@/i18n';
import { byId, departments } from '@/content';
import { DepartmentPageTemplate } from '@/components/DepartmentPageTemplate';

const DiagnosticsPage = () => {
  const { t } = useI18n();
  const department = byId(departments, 'diagnostics')!;

  return (
    <DepartmentPageTemplate
      department={department}
      navLabel={t.nav.diagnostics}
      faqTopics={['diagnostics', 'booking']}
      indications={[
        {
          ru: 'Снижение остроты зрения вдаль или вблизи',
          kk: 'Алысты немесе жақынды көру өткірлігінің төмендеуі',
          en: 'Reduced distance or near visual acuity',
        },
        {
          ru: 'Быстрая утомляемость глаз при работе за экраном',
          kk: 'Экран алдында жұмыс істегенде көздің тез шаршауы',
          en: 'Rapid eye fatigue during screen work',
        },
        {
          ru: 'Наследственная глаукома или диабет в анамнезе',
          kk: 'Анамнезде тұқым қуалайтын глаукома немесе қант диабеті',
          en: 'A family history of glaucoma, or diabetes',
        },
        {
          ru: 'Подготовка к лазерной коррекции или операции',
          kk: 'Лазерлік түзетуге немесе операцияға дайындық',
          en: 'Preparation for laser correction or surgery',
        },
        {
          ru: 'Плановый осмотр после 40 лет — ежегодно',
          kk: '40 жастан кейінгі жоспарлы қарау — жыл сайын',
          en: 'A routine annual check-up after the age of 40',
        },
      ]}
      steps={[
        {
          id: 'step-1',
          title: { ru: 'Сбор жалоб', kk: 'Шағымдарды жинау', en: 'Taking the history' },
          text: {
            ru: 'Врач уточняет жалобы, перенесённые заболевания, приём препаратов и зрительную нагрузку.',
            kk: 'Дәрігер шағымдарды, бұрын өткерген ауруларды, дәрі қабылдауды және көру жүктемесін нақтылайды.',
            en: 'The doctor clarifies complaints, past conditions, medication and visual workload.',
          },
        },
        {
          id: 'step-2',
          title: { ru: 'Базовые измерения', kk: 'Негізгі өлшемдер', en: 'Baseline measurements' },
          text: {
            ru: 'Острота зрения, авторефрактометрия, измерение внутриглазного давления.',
            kk: 'Көру өткірлігі, авторефрактометрия, көзішілік қысымды өлшеу.',
            en: 'Visual acuity, autorefractometry and intraocular pressure measurement.',
          },
        },
        {
          id: 'step-3',
          title: { ru: 'Аппаратные исследования', kk: 'Аппараттық зерттеулер', en: 'Instrument tests' },
          text: {
            ru: 'ОКТ сетчатки и зрительного нерва, компьютерная периметрия, кератотопография — по показаниям.',
            kk: 'Көрсеткіштер бойынша тор қабық пен көру жүйкесінің ОКТ-сы, компьютерлік периметрия, кератотопография.',
            en: 'Retinal and optic nerve OCT, computer perimetry and corneal topography, as indicated.',
          },
        },
        {
          id: 'step-4',
          title: { ru: 'Осмотр глазного дна', kk: 'Көз түбін қарау', en: 'Fundus examination' },
          text: {
            ru: 'Проводится с расширенным зрачком. После него в течение 3–4 часов не рекомендуется садиться за руль.',
            kk: 'Қарашықты кеңейтіп жүргізіледі. Одан кейін 3–4 сағат бойы көлік жүргізу ұсынылмайды.',
            en: 'Performed with a dilated pupil. Driving is not advised for 3–4 hours afterwards.',
          },
        },
        {
          id: 'step-5',
          title: { ru: 'Заключение', kk: 'Қорытынды', en: 'Conclusion' },
          text: {
            ru: 'Пациент получает письменное заключение, план наблюдения и, при необходимости, рецепт — в день обращения.',
            kk: 'Пациент жазбаша қорытынды, бақылау жоспарын және қажет болса рецептті сол күні алады.',
            en: 'The patient receives a written conclusion, a follow-up plan and, if needed, a prescription — the same day.',
          },
        },
      ]}
    />
  );
};

export default DiagnosticsPage;
