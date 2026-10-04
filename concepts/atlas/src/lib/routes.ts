export interface NavItem {
  to: string;
  label: string;
  /** Waypoint shown in mono next to the link: stage + where the camera goes. */
  wp: string;
}

export const NAV_GROUPS: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Центр',
    items: [
      { to: '/', label: 'Главная', wp: 'Орбита → клиника' },
      { to: '/about', label: 'О центре', wp: '51.13° N' },
      { to: '/founder', label: 'Основатель', wp: 'Маршрут' },
      { to: '/doctors', label: 'Врачи', wp: 'Этажи' },
      { to: '/services', label: 'Направления', wp: 'Этажи' },
      { to: '/reviews', label: 'Отзывы', wp: 'Огни города' },
      { to: '/contacts', label: 'Контакты', wp: 'Мәңгілік Ел, 72' },
    ],
  },
  {
    title: 'Пациентам',
    items: [
      { to: '/booking', label: 'Запись на приём', wp: 'Вход' },
      { to: '/international', label: 'Международным пациентам', wp: 'Прилёт' },
      { to: '/second-opinion', label: 'Второе мнение', wp: 'Документы' },
      { to: '/consultation', label: 'Онлайн-консультация', wp: 'Связь' },
      { to: '/account', label: 'Личный кабинет', wp: 'Демо' },
      { to: '/faq', label: 'Вопросы и ответы', wp: 'Ресепшн' },
    ],
  },
  {
    title: 'Знания и наука',
    items: [
      { to: '/knowledge', label: 'База знаний', wp: 'Созвездия' },
      { to: '/science', label: 'Наука и медиа', wp: 'Микромир' },
      { to: '/experts', label: 'Сеть экспертов', wp: 'Дуги' },
    ],
  },
];

export const TITLES: Array<[RegExp, string]> = [
  [/^\/$/, 'Орбита'],
  [/^\/about/, 'О центре'],
  [/^\/founder/, 'Основатель'],
  [/^\/doctors\/./, 'Врач'],
  [/^\/doctors/, 'Врачи'],
  [/^\/services\/./, 'Направление'],
  [/^\/services/, 'Направления'],
  [/^\/international/, 'Международным пациентам'],
  [/^\/second-opinion/, 'Второе мнение'],
  [/^\/consultation/, 'Онлайн-консультация'],
  [/^\/booking/, 'Запись'],
  [/^\/knowledge\/./, 'Материал'],
  [/^\/knowledge/, 'База знаний'],
  [/^\/science/, 'Наука'],
  [/^\/experts/, 'Сеть экспертов'],
  [/^\/reviews/, 'Отзывы'],
  [/^\/faq/, 'Вопросы и ответы'],
  [/^\/contacts/, 'Контакты'],
  [/^\/account/, 'Личный кабинет'],
];
export const titleFor = (path: string) => TITLES.find(([r]) => r.test(path))?.[1] ?? 'Вне карты';
