export type Language = 'ru' | 'kk' | 'en';

export const LANGUAGES: Language[] = ['ru', 'kk', 'en'];

export const LANGUAGE_LABELS: Record<Language, { short: string; full: string }> = {
  ru: { short: 'RU', full: 'Русский' },
  kk: { short: 'KK', full: 'Қазақша' },
  en: { short: 'EN', full: 'English' },
};

/** BCP-47 tags used for <html lang>, hreflang and Intl formatting. */
export const LOCALE_TAGS: Record<Language, string> = {
  ru: 'ru-RU',
  kk: 'kk-KZ',
  en: 'en-US',
};

/** A localized string triple. Content records use this for every text field. */
export type Localized = Record<Language, string>;

/** Pick the active language out of a localized value, with a Russian fallback. */
export const pick = (value: Localized, language: Language): string =>
  value[language] || value.ru;
