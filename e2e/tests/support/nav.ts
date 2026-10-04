import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ROUTES } from './routes';

/**
 * NAV_GROUPS parsed from frontend/src/app/navigation.ts with English labels
 * from dictionary.en.ts — the header tests follow the site's own menu
 * definition instead of a hard-coded copy.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../../..');
const nav = readFileSync(path.join(ROOT, 'frontend/src/app/navigation.ts'), 'utf8');
const dict = readFileSync(path.join(ROOT, 'frontend/src/i18n/dictionary.en.ts'), 'utf8');

const navSection = dict.slice(dict.indexOf('  nav: {'), dict.indexOf('\n  },', dict.indexOf('  nav: {')));
const label = (key: string): string => {
  const m = navSection.match(new RegExp(`^\\s+${key}:\\s*(['"])(.*?)\\1,`, 'm'));
  return m ? m[2].replace(/\\'/g, "'") : key;
};

const groupsBlock = nav.slice(nav.indexOf('export const NAV_GROUPS'), nav.indexOf('export const LEGAL_LINKS'));

export interface NavGroupSpec {
  id: string;
  label: string;
  links: Array<{ label: string; path: string }>;
}

export const NAV_GROUPS: NavGroupSpec[] = groupsBlock
  .split(/\n\s{2}\{\n/)
  .slice(1)
  .map((chunk) => {
    const id = chunk.match(/id:\s*'([^']+)'/)?.[1] ?? '';
    const groupLabelKey = chunk.match(/^\s+labelKey:\s*'([^']+)',\s*$/m)?.[1] ?? id;
    const links = [...chunk.matchAll(/\{\s*labelKey:\s*'([^']+)'[^}]*?path:\s*ROUTES\.(\w+)/g)].map((m) => ({
      label: label(m[1]),
      path: ROUTES[m[2]],
    }));
    return { id, label: label(groupLabelKey), links };
  })
  .filter((g) => g.id && g.links.length);
