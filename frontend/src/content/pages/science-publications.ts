import type { Localized } from '@/i18n/types';

/**
 * The founder's peer-reviewed publications (DESIGN.md §5 — real material)
 * and the two external sources for the verified facts of DESIGN.md §7.
 * Authorship position is not stated: the full author lists are on the
 * publishers' sites.
 */

/** 24.kz article — the source for the device, trials, patient count and patent. */
export const SOURCE_24KZ = {
  label: '24.kz — «Разработка казахстанца для выявления болезней глаз проходит испытания в Гонконге»',
  href: 'https://24.kz/ru/news/in-the-world/788733-razrabotka-kazakhstantsa-dlya-vyyavleniya-boleznej-glaz-prokhodit-ispytaniya-v-gonkonge',
};

/** Faculty profile at the Kazakh Research Institute of Eye Diseases. */
export const SOURCE_EYEINST = 'https://eyeinst.kz/catalog/kulmaganbetov-muhit-askarovich-2882/';

export interface Publication {
  id: string;
  journal: string;
  publisher: string;
  year: number;
  title: string;
  doi: string;
  href: string;
  summary: Localized;
  direction: Localized;
}

export const publications: Publication[] = [
  {
    id: 'sci-rep-2026',
    journal: 'Scientific Reports',
    publisher: 'Nature Portfolio',
    year: 2026,
    title: 'Evaluating the reliability of structured light entoptic tasks',
    doi: '10.1038/s41598-026-63276-7',
    href: 'https://www.nature.com/articles/s41598-026-63276-7',
    direction: { ru: 'Энтоптические тесты', kk: 'Энтоптикалық тестер', en: 'Entoptic tests' },
    summary: {
      ru: 'Оценка надёжности задач со структурированным светом — шаг, без которого новый тест зрения нельзя переносить в клинику.',
      kk: 'Құрылымды жарық тапсырмаларының сенімділігін бағалау — онсыз жаңа көру тестін клиникаға көшіруге болмайтын қадам.',
      en: 'Assessing the reliability of structured-light tasks — a step no new vision test can skip on its way to the clinic.',
    },
  },
  {
    id: 'diagnostics-2026',
    journal: 'Diagnostics',
    publisher: 'MDPI',
    year: 2026,
    title: "The Machine Learning Classification of Retinal Ganglion Cell Dendritic Texture in a 3xTg-Alzheimer's Disease Mouse Model",
    doi: '10.3390/diagnostics16162672',
    href: 'https://www.mdpi.com/2075-4418/16/16/2672',
    direction: { ru: 'Нейроофтальмология и ИИ', kk: 'Нейроофтальмология және ЖИ', en: 'Neuro-ophthalmology and AI' },
    summary: {
      ru: 'Машинное обучение для классификации текстуры дендритов ганглиозных клеток сетчатки на модели болезни Альцгеймера.',
      kk: 'Альцгеймер ауруы моделінде тор қабықтың ганглиозды жасушалары дендриттерінің текстурасын жіктеуге арналған машиналық оқыту.',
      en: "Machine learning to classify the dendritic texture of retinal ganglion cells in an Alzheimer's disease model.",
    },
  },
  {
    id: 'healthcare-2026',
    journal: 'Healthcare',
    publisher: 'MDPI',
    year: 2026,
    title: 'Impact of Chronic Kidney Disease Severity on COVID-19 Outcomes: A Retrospective Cohort Study',
    doi: '10.3390/healthcare14162575',
    href: 'https://www.mdpi.com/2227-9032/14/16/2575',
    direction: { ru: 'Клиническая эпидемиология', kk: 'Клиникалық эпидемиология', en: 'Clinical epidemiology' },
    summary: {
      ru: 'Ретроспективное когортное исследование: как тяжесть хронической болезни почек связана с исходами COVID-19.',
      kk: 'Ретроспективті когорттық зерттеу: бүйректің созылмалы ауруының ауырлығы COVID-19 нәтижелерімен қалай байланысты.',
      en: 'A retrospective cohort study of how chronic kidney disease severity relates to COVID-19 outcomes.',
    },
  },
];
