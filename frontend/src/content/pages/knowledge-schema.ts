import { site } from '@/content';

/**
 * Small JSON-LD helpers for the knowledge, science, academy and media pages.
 * Article, MedicalWebPage and Person blocks come from the shared builders in
 * seo/Seo.tsx (`articleSchema`, `medicalWebPageSchema`, `personSchema`).
 */

export const SITE_URL = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? site.organization.url).replace(
  /\/$/,
  '',
);
export const BRAND = 'Ophthalmic Centre of Dr Kulmaganbetov';

export const absolute = (path: string) => `${SITE_URL}${path}`;

export const itemListSchema = (
  name: string,
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: absolute(item.url),
  })),
});
