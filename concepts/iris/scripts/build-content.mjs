// Regenerates src/content/*.json (Russian only) from the production content
// (frontend/src/content/**) and the seed data (data/*.json). Run: npm run extract
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
execSync(`../../frontend/node_modules/.bin/esbuild scripts/extract.ts --bundle --platform=node --format=esm --outfile=scripts/.extract.mjs --alias:@=../../frontend/src --alias:@data=../../data --log-level=error --define:import.meta.env={}`, { cwd: root });
let js = readFileSync(root + 'scripts/.extract.mjs', 'utf8');
js = js.replace(/import\.meta\.glob\(/g, '(()=>({}))(');
writeFileSync(root + 'scripts/.extract.mjs', js);
execSync('node scripts/.extract.mjs scripts/content-ru.json', { cwd: root });
const all = JSON.parse(readFileSync(root + 'scripts/content-ru.json', 'utf8'));
const out = root + 'src/content/';
mkdirSync(out, { recursive: true });
const { serviceBodies, knowledgeBodies, ...copy } = all;
writeFileSync(out + 'copy.json', JSON.stringify(copy));
writeFileSync(out + 'service-bodies.json', JSON.stringify(serviceBodies));
writeFileSync(out + 'knowledge-bodies.json', JSON.stringify(knowledgeBodies));
const ru = (v) => {
  if (Array.isArray(v)) return v.map(ru);
  if (v && typeof v === 'object') {
    if ('ru' in v && ('en' in v || 'kk' in v)) return ru(v.ru);
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, ru(x)]));
  }
  return v;
};
const data = {};
for (const f of readdirSync(root + '../../data')) {
  if (!f.endsWith('.json') || ['legal.json', 'vacancies.json', 'promotions.json'].includes(f)) continue;
  data[f.replace('.json', '').replace(/-(\w)/g, (_, c) => c.toUpperCase())] = ru(JSON.parse(readFileSync(root + '../../data/' + f, 'utf8')));
}
writeFileSync(out + 'data.json', JSON.stringify(data));
console.log('content written');
