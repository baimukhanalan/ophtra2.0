import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ru, type Dictionary } from './dictionary.ru';
import {
  LANGUAGES,
  LANGUAGE_LABELS,
  LOCALE_TAGS,
  pick,
  type Language,
  type Localized,
} from './types';

/**
 * Russian is bundled; Kazakh and English are fetched on demand.
 *
 * The three dictionaries are ~9 kB gzipped between them and only one is ever
 * displayed, so shipping all three in the app shell taxed every visitor for two
 * they will not read. A visitor who arrives with kk or en stored sees Russian
 * for the first frame while the chunk lands — a same-origin fetch of a few kB.
 */
const loaders: Record<Exclude<Language, 'ru'>, () => Promise<Dictionary>> = {
  kk: () => import('./dictionary.kk').then((m) => m.kk),
  en: () => import('./dictionary.en').then((m) => m.en),
};

const loaded: Partial<Record<Language, Dictionary>> = { ru };

const STORAGE_KEY = 'ophtra.lang';

const detectLanguage = (): Language => {
  if (typeof window === 'undefined') return 'ru';

  // An explicit ?lang= wins (hreflang alternates link to it), then the
  // visitor's saved choice. Russian is the default — not the browser locale,
  // so crawlers index the primary-language site.
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param && LANGUAGES.includes(param as Language)) return param as Language;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LANGUAGES.includes(stored as Language)) return stored as Language;
  } catch {
    /* storage unavailable */
  }
  return 'ru';
};

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Dictionary for the active language. */
  t: Dictionary;
  /** Resolve a `Localized` content field. */
  L: (value: Localized) => string;
  /** Locale-aware number formatting. */
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  /** Price in tenge, no fraction digits. */
  formatPrice: (value: number) => string;
  formatDate: (value: string | Date, options?: Intl.DateTimeFormatOptions) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(detectLanguage);
  const [dictionary, setDictionary] = useState<Dictionary>(() => loaded[detectLanguage()] ?? ru);

  useEffect(() => {
    const cached = loaded[language];
    if (cached) {
      setDictionary(cached);
      return;
    }

    let live = true;
    loaders[language as Exclude<Language, 'ru'>]().then((dict) => {
      loaded[language] = dict;
      // Ignore a resolution that lost a race with a newer language choice.
      if (live) setDictionary(dict);
    });
    return () => {
      live = false;
    };
  }, [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* private mode — the language simply resets next visit */
    }
  }, [language]);

  const setLanguage = useCallback((next: Language) => setLanguageState(next), []);

  const value = useMemo<I18nContextValue>(() => {
    const tag = LOCALE_TAGS[language];

    return {
      language,
      setLanguage,
      t: dictionary,
      L: (localized: Localized) => pick(localized, language),
      formatNumber: (input, options) => new Intl.NumberFormat(language === 'kk' ? 'ru-RU' : tag, options).format(input),
      // Kazakh uses space-grouped thousands like Russian; ICU's kk-KZ data
      // falls back to comma grouping in some engines.
      formatPrice: (input) =>
        `${new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ru-RU', { maximumFractionDigits: 0 }).format(input)} ₸`,
      formatDate: (input, options) => {
        const date = typeof input === 'string' ? new Date(input) : input;
        // Browsers without full ICU data render kk-KZ as "2026 M06 28"; format
        // Kazakh long dates by hand ("28 маусым 2026 ж.").
        if (language === 'kk' && (!options || options.month === 'long' || options.month === 'short')) {
          const months = ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'];
          const day = !options || options.day ? `${date.getDate()} ` : '';
          const month = months[date.getMonth()];
          const year = !options || options.year ? ` ${date.getFullYear()} ж.` : '';
          const weekdays = ['жексенбі', 'дүйсенбі', 'сейсенбі', 'сәрсенбі', 'бейсенбі', 'жұма', 'сенбі'];
          const weekday = options?.weekday ? `${weekdays[date.getDay()]}, ` : '';
          return `${weekday}${day}${options?.month === 'short' ? month.slice(0, 3) : month}${year}`;
        }
        return new Intl.DateTimeFormat(tag, options ?? { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
      },
    };
  }, [language, dictionary, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
};

export { LANGUAGES, LANGUAGE_LABELS, LOCALE_TAGS, pick };
export type { Dictionary, Language, Localized };
