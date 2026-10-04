import { useI18n } from '@/i18n';
import { byId, departments } from '@/content';
import { DepartmentPageTemplate } from '@/components/DepartmentPageTemplate';

const LaserPage = () => {
  const { t } = useI18n();
  const department = byId(departments, 'laser')!;

  return (
    <DepartmentPageTemplate
      department={department}
      navLabel={t.nav.laser}
      faqTopics={['laser', 'diagnostics']}
      indications={[
        {
          ru: 'Близорукость от −1,0 до −10,0 диоптрий',
          kk: '−1,0-ден −10,0 диоптрияға дейінгі миопия',
          en: 'Myopia from −1.0 to −10.0 dioptres',
        },
        {
          ru: 'Дальнозоркость до +5,0 диоптрий',
          kk: '+5,0 диоптрияға дейінгі гиперметропия',
          en: 'Hyperopia up to +5.0 dioptres',
        },
        {
          ru: 'Астигматизм до 6,0 диоптрий',
          kk: '6,0 диоптрияға дейінгі астигматизм',
          en: 'Astigmatism up to 6.0 dioptres',
        },
        {
          ru: 'Стабильная рефракция в течение последнего года',
          kk: 'Соңғы жыл ішінде тұрақты рефракция',
          en: 'Refraction stable for the past year',
        },
        {
          ru: 'Возраст от 18 лет и достаточная толщина роговицы',
          kk: '18 жастан бастап және қасаң қабықтың жеткілікті қалыңдығы',
          en: 'Age 18 or over with sufficient corneal thickness',
        },
      ]}
      steps={[
        {
          id: 'step-1',
          title: { ru: 'Расширенное обследование', kk: 'Кеңейтілген тексеру', en: 'Extended examination' },
          text: {
            ru: 'Кератотопография, пахиметрия, оценка слёзной плёнки и осмотр глазного дна. Занимает около двух часов.',
            kk: 'Кератотопография, пахиметрия, жас қабықшасын бағалау және көз түбін қарау. Шамамен екі сағат алады.',
            en: 'Corneal topography, pachymetry, tear film assessment and fundus examination. Takes about two hours.',
          },
        },
        {
          id: 'step-2',
          title: { ru: 'Выбор методики', kk: 'Әдістемені таңдау', en: 'Choosing the technique' },
          text: {
            ru: 'Femto-LASIK, SMILE или ФРК — решение зависит от толщины роговицы, степени аметропии и образа жизни.',
            kk: 'Femto-LASIK, SMILE немесе ФРК — шешім қасаң қабық қалыңдығына, аметропия дәрежесіне және өмір салтына байланысты.',
            en: 'Femto-LASIK, SMILE or PRK — the choice depends on corneal thickness, the degree of ametropia and lifestyle.',
          },
        },
        {
          id: 'step-3',
          title: { ru: 'Подготовка', kk: 'Дайындық', en: 'Preparation' },
          text: {
            ru: 'Мягкие линзы снимают за 7 дней, жёсткие — за 14. В день операции — без косметики и парфюма.',
            kk: 'Жұмсақ линзалар 7 күн, қаттылары 14 күн бұрын шешіледі. Операция күні — косметика мен иіссусыз.',
            en: 'Soft lenses are removed 7 days before, rigid ones 14 days. No make-up or perfume on the day.',
          },
        },
        {
          id: 'step-4',
          title: { ru: 'Операция', kk: 'Операция', en: 'The procedure' },
          text: {
            ru: 'Около 15 минут на оба глаза под капельной анестезией. Госпитализация не требуется.',
            kk: 'Тамшылы анестезиямен екі көзге шамамен 15 минут. Ауруханаға жату қажет емес.',
            en: 'About 15 minutes for both eyes under drop anaesthesia. No hospital stay required.',
          },
        },
        {
          id: 'step-5',
          title: { ru: 'Восстановление', kk: 'Қалпына келу', en: 'Recovery' },
          text: {
            ru: 'Зрение восстанавливается в течение суток. Контрольные осмотры — на следующий день, через неделю и через месяц.',
            kk: 'Көру бір тәулік ішінде қалпына келеді. Бақылау қараулары — келесі күні, бір аптадан және бір айдан кейін.',
            en: 'Vision recovers within a day. Follow-ups take place the next day, after a week and after a month.',
          },
        },
      ]}
    />
  );
};

export default LaserPage;
