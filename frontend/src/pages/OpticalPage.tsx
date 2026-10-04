import { useI18n } from '@/i18n';
import { byId, departments } from '@/content';
import { DepartmentPageTemplate } from '@/components/DepartmentPageTemplate';

const OpticalPage = () => {
  const { t } = useI18n();
  const department = byId(departments, 'optical')!;

  return (
    <DepartmentPageTemplate
      department={department}
      navLabel={t.nav.optical}
      faqTopics={['general', 'payments']}
      indications={[
        {
          ru: 'Изготовление очков по рецепту врача центра',
          kk: 'Орталық дәрігерінің рецепті бойынша көзілдірік дайындау',
          en: 'Prescription glasses made to a centre prescription',
        },
        {
          ru: 'Подбор мягких контактных линз и обучение уходу',
          kk: 'Жұмсақ контакт линзаларын таңдау және күтуге үйрету',
          en: 'Soft contact lens fitting and care training',
        },
        {
          ru: 'Сложные случаи: склеральные и ортокератологические линзы',
          kk: 'Күрделі жағдайлар: склеральды және ортокератологиялық линзалар',
          en: 'Complex cases: scleral and orthokeratology lenses',
        },
        {
          ru: 'Очки с периферическим дефокусом для контроля близорукости',
          kk: 'Миопияны бақылауға арналған перифериялық дефокусы бар көзілдірік',
          en: 'Peripheral defocus lenses for myopia control',
        },
        {
          ru: 'Замена линз в собственной оправе и ремонт',
          kk: 'Өз жақтауындағы линзаларды ауыстыру және жөндеу',
          en: 'Lens replacement in your own frame, and repairs',
        },
      ]}
      steps={[
        {
          id: 'step-1',
          title: { ru: 'Рецепт врача', kk: 'Дәрігер рецепті', en: 'The prescription' },
          text: {
            ru: 'Оптика работает только по действующему рецепту — его выдаёт офтальмолог центра после обследования.',
            kk: 'Оптика тек қолданыстағы рецепт бойынша жұмыс істейді — оны тексеруден кейін орталық офтальмологы береді.',
            en: 'The store works only from a valid prescription, issued by a centre ophthalmologist after examination.',
          },
        },
        {
          id: 'step-2',
          title: { ru: 'Подбор оправы', kk: 'Жақтау таңдау', en: 'Frame selection' },
          text: {
            ru: 'Оптометрист учитывает межзрачковое расстояние, посадку на переносице и вес будущих линз.',
            kk: 'Оптометрист қарашық аралық қашықтықты, мұрын үстіндегі отыруын және болашақ линзалар салмағын ескереді.',
            en: 'The optometrist accounts for pupillary distance, the fit on the bridge and the weight of the future lenses.',
          },
        },
        {
          id: 'step-3',
          title: { ru: 'Выбор линз', kk: 'Линза таңдау', en: 'Lens choice' },
          text: {
            ru: 'Покрытия, индекс преломления и тип конструкции подбираются под зрительные задачи: работа за экраном, вождение, спорт.',
            kk: 'Жабындар, сыну көрсеткіші және құрылым түрі көру міндеттеріне қарай таңдалады: экран алдында жұмыс, көлік жүргізу, спорт.',
            en: 'Coatings, refractive index and lens design are matched to visual tasks: screen work, driving, sport.',
          },
        },
        {
          id: 'step-4',
          title: { ru: 'Изготовление', kk: 'Дайындау', en: 'Production' },
          text: {
            ru: 'Очки собирают по рецепту и проверяют параметры перед выдачей. Срок изготовления называют при заказе.',
            kk: 'Көзілдірік рецепт бойынша жиналып, берер алдында параметрлері тексеріледі. Дайындау мерзімі тапсырыс кезінде айтылады.',
            en: 'Glasses are made to the prescription and checked before you collect them. You are told the turnaround when you order.',
          },
        },
        {
          id: 'step-5',
          title: { ru: 'Примерка и настройка', kk: 'Өлшеп көру және баптау', en: 'Fitting and adjustment' },
          text: {
            ru: 'При выдаче оправу подгоняют по лицу. Повторная настройка выполняется бесплатно в любое время.',
            kk: 'Беру кезінде жақтау бетке лайықталады. Қайта баптау кез келген уақытта тегін орындалады.',
            en: 'The frame is adjusted to the face on collection. Re-adjustment is free at any time.',
          },
        },
      ]}
    />
  );
};

export default OpticalPage;
