import { useI18n } from '@/i18n';
import { byId, departments } from '@/content';
import { DepartmentPageTemplate } from '@/components/DepartmentPageTemplate';

const PediatricPage = () => {
  const { t } = useI18n();
  const department = byId(departments, 'pediatric')!;

  return (
    <DepartmentPageTemplate
      department={department}
      navLabel={t.nav.pediatric}
      faqTopics={['pediatric', 'booking']}
      indications={[
        {
          ru: 'Ребёнок щурится или сидит близко к экрану',
          kk: 'Бала көзін қысады немесе экранға жақын отырады',
          en: 'The child squints or sits close to the screen',
        },
        {
          ru: 'Косоглазие, в том числе непостоянное',
          kk: 'Қылилық, оның ішінде тұрақсыз',
          en: 'Strabismus, including intermittent',
        },
        {
          ru: 'Жалобы на головную боль после уроков',
          kk: 'Сабақтан кейінгі бас ауруына шағым',
          en: 'Headaches after school work',
        },
        {
          ru: 'Наследственная близорукость у родителей',
          kk: 'Ата-анада тұқым қуалайтын миопия',
          en: 'Hereditary myopia in the parents',
        },
        {
          ru: 'Плановые осмотры: 1 месяц, 1 год, 3 года, перед школой',
          kk: 'Жоспарлы қараулар: 1 ай, 1 жас, 3 жас, мектепке дейін',
          en: 'Routine check-ups: 1 month, 1 year, 3 years, before school',
        },
      ]}
      steps={[
        {
          id: 'step-1',
          title: { ru: 'Знакомство', kk: 'Танысу', en: 'Getting acquainted' },
          text: {
            ru: 'Приём начинается в игровой зоне: ребёнок привыкает к кабинету, врач наблюдает за поведением и фиксацией взгляда.',
            kk: 'Қабылдау ойын аймағынан басталады: бала кабинетке үйренеді, дәрігер мінез-құлық пен көзқарасты бақылайды.',
            en: 'The visit starts in the play area: the child settles in while the doctor observes behaviour and gaze fixation.',
          },
        },
        {
          id: 'step-2',
          title: { ru: 'Проверка зрения', kk: 'Көруді тексеру', en: 'Vision testing' },
          text: {
            ru: 'Используются проекционные оптотипы и картинки — формат подбирается по возрасту ребёнка.',
            kk: 'Проекциялық оптотиптер мен суреттер қолданылады — формат баланың жасына қарай таңдалады.',
            en: 'Projection optotypes and pictures are used, with the format matched to the child’s age.',
          },
        },
        {
          id: 'step-3',
          title: { ru: 'Циклоплегия', kk: 'Циклоплегия', en: 'Cycloplegia' },
          text: {
            ru: 'Капли расширяют зрачок и снимают напряжение аккомодации: только так рефракция у детей измеряется достоверно.',
            kk: 'Тамшылар қарашықты кеңейтіп, аккомодация кернеуін басады: балаларда рефракция тек осылай дұрыс өлшенеді.',
            en: 'Drops dilate the pupil and relax accommodation — the only way to measure a child’s refraction reliably.',
          },
        },
        {
          id: 'step-4',
          title: { ru: 'Измерение длины глаза', kk: 'Көз ұзындығын өлшеу', en: 'Axial length measurement' },
          text: {
            ru: 'Ключевой показатель для контроля близорукости: он показывает рост глаза раньше, чем меняется острота зрения.',
            kk: 'Миопияны бақылаудың негізгі көрсеткіші: ол көру өткірлігі өзгергенге дейін көздің өсуін көрсетеді.',
            en: 'The key metric for myopia control: it reveals eye growth before visual acuity changes.',
          },
        },
        {
          id: 'step-5',
          title: { ru: 'План на год', kk: 'Бір жылға жоспар', en: 'A plan for the year' },
          text: {
            ru: 'Родители получают график осмотров каждые 6 месяцев, рекомендации по зрительному режиму и, при необходимости, коррекцию.',
            kk: 'Ата-аналар әр 6 ай сайынғы қарау кестесін, көру режимі бойынша ұсыныстарды және қажет болса түзетуді алады.',
            en: 'Parents receive a six-monthly check-up schedule, visual routine guidance and correction where needed.',
          },
        },
      ]}
    />
  );
};

export default PediatricPage;
