/** Site map of the concept: every page is a layer of the eye. */
export interface RouteMeta {
  path: string;
  title: string;
  layer: string;
  menu?: boolean;
}

export const ROUTES: RouteMeta[] = [
  { path: '/', title: 'Главная', layer: 'Взгляд', menu: true },
  { path: '/about', title: 'О центре', layer: 'Роговица', menu: true },
  { path: '/dr-kulmaganbetov', title: 'Основатель', layer: 'Макула', menu: true },
  { path: '/doctors', title: 'Врачи', layer: 'Радужка', menu: true },
  { path: '/services', title: 'Центры и услуги', layer: 'Все слои', menu: true },
  { path: '/international-patients', title: 'Международным пациентам', layer: 'Зрительный нерв', menu: true },
  { path: '/second-opinion', title: 'Второе мнение', layer: 'Хрусталик', menu: true },
  { path: '/online-consultation', title: 'Онлайн-консультация', layer: 'Зрачок', menu: true },
  { path: '/appointment', title: 'Запись на приём', layer: 'Фокус', menu: true },
  { path: '/knowledge-base', title: 'База знаний', layer: 'Стекловидное тело', menu: true },
  { path: '/science', title: 'Наука и академия', layer: 'Фоторецепторы', menu: true },
  { path: '/global-experts', title: 'Глобальные эксперты', layer: 'Нервные волокна', menu: true },
  { path: '/reviews', title: 'Отзывы', layer: 'Отражения', menu: true },
  { path: '/faq', title: 'Вопросы и ответы', layer: 'Водянистая влага', menu: true },
  { path: '/contacts', title: 'Контакты', layer: 'Взгляд', menu: true },
  { path: '/account', title: 'Личный кабинет', layer: 'Сетчатка', menu: true },
];

export const metaFor = (pathname: string): RouteMeta | undefined => {
  if (pathname === '/') return ROUTES[0];
  return ROUTES.filter((r) => r.path !== '/' && pathname.startsWith(r.path)).sort((a, b) => b.path.length - a.path.length)[0];
};

export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII'];
