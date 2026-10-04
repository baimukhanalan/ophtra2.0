// Summarise results/report.json (+ results/axe/*.json) for the audit report.
// Usage: node scripts/summarize.mjs [report.json]
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const file = process.argv[2] ?? 'results/report.json';
const report = JSON.parse(readFileSync(file, 'utf8'));
const strip = (s = '') => s.replace(/\x1b\[[0-9;]*m/g, '');

const rows = [];
const walk = (suite, trail = []) => {
  const here = suite.title ? [...trail, suite.title] : trail;
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests) {
      const last = t.results[t.results.length - 1];
      rows.push({
        file: spec.file,
        title: [...here.slice(1), spec.title].join(' › '),
        project: t.projectName,
        status: t.status, // expected | unexpected | flaky | skipped
        error: strip(last?.errors?.map((e) => e.message).join('\n') ?? last?.error?.message ?? '').split('\n').slice(0, 6).join('\n'),
        attachments: (last?.attachments ?? []).filter((a) => a.path).map((a) => a.path),
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child, here);
};
for (const s of report.suites) walk(s);

const count = (st) => rows.filter((r) => r.status === st).length;
console.log(`TOTAL ${rows.length}  passed ${count('expected')}  failed ${count('unexpected')}  flaky ${count('flaky')}  skipped ${count('skipped')}`);
const byFile = {};
for (const r of rows) {
  byFile[r.file] ??= { expected: 0, unexpected: 0, flaky: 0, skipped: 0 };
  byFile[r.file][r.status] += 1;
}
console.table(byFile);

for (const r of rows.filter((x) => x.status === 'unexpected' || x.status === 'flaky')) {
  console.log(`\n[${r.status}] [${r.project}] ${r.file} › ${r.title}\n${r.error}\n${r.attachments.join('\n')}`);
}

const axeDir = 'results/axe';
if (existsSync(axeDir)) {
  const agg = {};
  for (const f of readdirSync(axeDir)) {
    for (const v of JSON.parse(readFileSync(path.join(axeDir, f), 'utf8'))) {
      const key = `${v.impact} ${v.id}`;
      agg[key] ??= { impact: v.impact, id: v.id, help: v.help, pages: [], nodes: 0, sample: v.targets[0] };
      agg[key].pages.push(f.replace('.json', ''));
      agg[key].nodes += v.nodes;
    }
  }
  const order = { critical: 0, serious: 1, moderate: 2, minor: 3 };
  console.log('\nAXE');
  for (const v of Object.values(agg).sort((a, b) => order[a.impact] - order[b.impact] || b.pages.length - a.pages.length)) {
    console.log(`${v.impact}\t${v.id}\t${v.pages.length} pages\t${v.nodes} nodes\t${v.help}\t e.g. ${v.sample}\t[${v.pages.slice(0, 8).join(', ')}${v.pages.length > 8 ? ', …' : ''}]`);
  }
}
