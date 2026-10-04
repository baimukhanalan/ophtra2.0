// Extracts the Russian copy from the production content modules + data/*.json
// into src/content/ru.json so the concept ships real, unmodified copy.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const fe = path.join(root, 'frontend');
const pages = path.join(fe, 'src/content/pages');
const tmp = path.join(here, '.tmp');
fs.mkdirSync(tmp, { recursive: true });

const bodies = (dir) => fs.readdirSync(path.join(pages, dir)).filter((f) => f.endsWith('.ts')).map((f) => f.replace('.ts', ''));
const kb = bodies('knowledge-bodies');
const sb = bodies('services-bodies');

const globStub = {
  name: 'glob-stub',
  setup(b) {
    b.onLoad({ filter: /\.ts$/ }, (args) => ({
      contents: fs.readFileSync(args.path, 'utf8').replace(/import\.meta\.glob(<[^>]*>)?\(/g, '((..._a) => ({}))('),
      loader: 'ts',
      resolveDir: path.dirname(args.path),
    }));
  },
};
const entry = `
import * as home from '@/content/pages/home';
import * as people from '@/content/pages/people';
import * as founder from '@/content/pages/people-founder';
import * as network from '@/content/pages/people-network';
import * as patients from '@/content/pages/patients';
import * as intl from '@/content/pages/patients-international';
import * as second from '@/content/pages/patients-second-opinion';
import * as consult from '@/content/pages/patients-consultation';
import * as services from '@/content/pages/services';
import * as science from '@/content/pages/science';
import * as academy from '@/content/pages/academy';
import * as media from '@/content/pages/media';
import * as knowledge from '@/content/pages/knowledge';
import * as kindex from '@/content/pages/knowledge-articles-index';
import * as platform from '@/content/pages/platform';
import * as overlays from '@/content/pages/overlays';
${kb.map((s, i) => `import kb${i} from '@/content/pages/knowledge-bodies/${s}';`).join('\n')}
${sb.map((s, i) => `import sb${i} from '@/content/pages/services-bodies/${s}';`).join('\n')}
export default {
  home, people, founder, network, patients, intl, second, consult, services, science, academy, media, knowledge,
  kindex: { KNOWLEDGE_INDEX: kindex.KNOWLEDGE_INDEX }, platform, overlays,
  knowledgeBodies: { ${kb.map((s, i) => `'${s}': kb${i}`).join(', ')} },
  serviceBodies: { ${sb.map((s, i) => `'${s}': sb${i}`).join(', ')} },
};`;
const entryFile = path.join(tmp, 'entry.ts');
fs.writeFileSync(entryFile, entry);
{
  await build({
    entryPoints: [entryFile],
    plugins: [globStub],
    bundle: true, format: 'esm', platform: 'node',
    outfile: path.join(tmp, 'bundle.mjs'),
    tsconfig: path.join(fe, 'tsconfig.json'),
    define: { 'import.meta.env': '{}' },
    logLevel: 'error',
  });
}
const mod = (await import(pathToFileURL(path.join(tmp, 'bundle.mjs')).href + '?' + Date.now())).default;

const isLoc = (v) => v && typeof v === 'object' && !Array.isArray(v) && 'ru' in v && ('en' in v || 'kk' in v);
const ru = (v) => {
  if (typeof v === 'function') return undefined;
  if (Array.isArray(v)) return v.map(ru);
  if (isLoc(v)) return ru(v.ru);
  if (v && typeof v === 'object') {
    const o = {};
    for (const [k, x] of Object.entries(v)) { const r = ru(x); if (r !== undefined) o[k] = r; }
    return o;
  }
  return v;
};
const data = {};
for (const f of fs.readdirSync(path.join(root, 'data'))) {
  if (f.endsWith('.json')) data[f.replace('.json', '')] = ru(JSON.parse(fs.readFileSync(path.join(root, 'data', f), 'utf8')));
}
const out = ru(mod);
const keepPlatform = ['accountCopy', 'faqCopy', 'reviewsCopy', 'opinionStatuses', 'demoOpinions'];
out.platform = Object.fromEntries(Object.entries(out.platform).filter(([k]) => keepPlatform.includes(k)));
const dir = path.join(here, '../src/content');
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(path.join(dir, 'data'), { recursive: true });
for (const [k, v] of Object.entries(out)) {
  if (k === 'knowledgeBodies' || k === 'serviceBodies') {
    fs.mkdirSync(path.join(dir, k), { recursive: true });
    for (const [slug, body] of Object.entries(v)) fs.writeFileSync(path.join(dir, k, slug + '.json'), JSON.stringify(body));
  } else fs.writeFileSync(path.join(dir, k + '.json'), JSON.stringify(v));
}
for (const [k, v] of Object.entries(data)) fs.writeFileSync(path.join(dir, 'data', k + '.json'), JSON.stringify(v));
fs.writeFileSync(path.join(here, 'all.json'), JSON.stringify({ ...out, data }, null, 1));
fs.rmSync(tmp, { recursive: true });
console.log('ok', Math.round(JSON.stringify(out).length / 1024), 'kB');
