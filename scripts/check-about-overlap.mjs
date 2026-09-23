import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/pages/about/index.astro', import.meta.url), 'utf8');
const terms = [
  'Green SM',
  'shared AI services',
  'orchestration',
  'ops console',
  'policy checks',
  'human approval',
  'simulation',
  'replay',
  'decision logs',
];

const proseSections = [
  ...source.matchAll(/<section class="section prose-grid[^\"]*">([\s\S]*?)<\/section>/g),
]
  .map((match) => match[1])
  .filter((section) => section.includes('Green SM'));

for (const [index, section] of proseSections.entries()) {
  const found = terms.filter((term) => section.toLowerCase().includes(term.toLowerCase()));
  console.log(`Green SM prose section ${index + 1}: ${found.join(', ')}`);
}

if (proseSections.length !== 1) {
  console.error(`Expected one Green SM narrative section, found ${proseSections.length}.`);
  process.exitCode = 1;
}
