import { R } from '../routes';

export interface NavItem {
  label: string;
  to: string;
  desc?: string;
}
export interface NavGroup {
  label: string;
  items: NavItem[];
}

/** Labels and descriptions from the production dictionary (nav.*). */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'О центре',
    items: [
      { label: 'О клинике', to: R.about, desc: 'Миссия, центры передового опыта, оснащение' },
      { label: 'Dr Kulmaganbetov', to: R.founder, desc: 'Учёный, стоящий за миссией сохранения зрения' },
      { label: 'Врачи', to: R.doctors, desc: 'Офтальмохирурги и специалисты центра' },
      { label: 'Сеть глобальных экспертов', to: R.experts, desc: 'Консультанты из ведущих клиник мира' },
    ],
  },
  {
    label: 'Пациентам',
    items: [
      { label: 'Медицинские услуги', to: R.services, desc: 'Все направления помощи' },
      { label: 'Международные пациенты', to: R.international, desc: 'Лечение в Казахстане без барьеров' },
      { label: 'Второе мнение', to: R.second, desc: 'Заключение специалистов по вашим документам' },
      { label: 'Онлайн-консультации', to: R.consult, desc: 'Zoom, Google Meet или Microsoft Teams' },
      { label: 'Онлайн-запись', to: R.booking },
    ],
  },
  {
    label: 'Наука и медиа',
    items: [
      { label: 'Наука и инновации', to: R.science, desc: 'Проекты, публикации, исследования' },
      { label: 'База знаний', to: R.knowledge, desc: 'Здоровье глаз простым языком' },
    ],
  },
  {
    label: 'Информация',
    items: [
      { label: 'Отзывы пациентов', to: R.reviews },
      { label: 'Вопросы и ответы', to: R.faq },
      { label: 'Контакты', to: R.contacts },
      { label: 'Личный кабинет', to: R.account },
    ],
  },
];

export const HEADER_LINKS: NavItem[] = [
  { label: 'О центре', to: R.about },
  { label: 'Врачи', to: R.doctors },
  { label: 'Услуги', to: R.services },
  { label: 'Пациентам', to: R.international },
  { label: 'База знаний', to: R.knowledge },
  { label: 'Наука', to: R.science },
];
