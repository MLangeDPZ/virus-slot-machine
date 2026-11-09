#!/usr/bin/env node
/*
 * Dev tool, not part of the web app.
 * Runs the reassortment + rules logic many times and prints how often each
 * combination of property states and the jackpot occur. Uses the same modules
 * and the same content.json as the exhibit, so any rule change in content.json
 * can be checked here immediately.
 *
 *   node tools/simulate.js           # 10 000 rounds
 *   node tools/simulate.js 100000    # custom number of rounds
 */
'use strict';

const path = require('path');
const fs = require('fs');
const Reassortment = require('../js/reassortment.js');
const Rules = require('../js/rules.js');

const content = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content.json'), 'utf8'));
const rounds = Number(process.argv[2]) || 10000;
const lang = content.defaultLanguage;

const problems = Rules.validate(content);
if (problems.length) {
  console.error('Problems in content.json rules:\n  ' + problems.join('\n  '));
  process.exit(1);
}

const propIds = content.properties.map((p) => p.id);
const keyOf = (states) => propIds.map((id) => states[id]).join(' | ');
const labelOf = (key) => key.split(' | ')
  .map((s, i) => content.properties[i].states[s][lang])
  .join(' · ');
const pct = (n, total) => (100 * n / total).toFixed(2).padStart(6) + ' %';

// --- Simulation ---
const counts = {};
let jackpots = 0;
const categoryCounts = {};
for (let i = 0; i < rounds; i++) {
  const mix = Reassortment.roll(content.segments.items, content.viruses);
  const states = Rules.derive(mix, content);
  const key = keyOf(states);
  counts[key] = (counts[key] || 0) + 1;
  if (Rules.isJackpot(states, content)) jackpots++;
  const cat = Rules.classify(states, content);
  const catId = cat ? cat.id : '(none)';
  categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
}

// --- Exact probability: enumerate every possible mix (viruses ^ segments) ---
const segs = content.segments.items;
const viruses = content.viruses;
const totalMixes = viruses.length ** segs.length;
let exactJackpots = 0;
const mix = segs.map((s) => ({ segment: s.number, virus: viruses[0].id }));
for (let code = 0; code < totalMixes; code++) {
  let c = code;
  for (let j = 0; j < segs.length; j++) {
    mix[j].virus = viruses[c % viruses.length].id;
    c = Math.floor(c / viruses.length);
  }
  if (Rules.isJackpot(Rules.derive(mix, content), content)) exactJackpots++;
}

// --- Output ---
console.log(`\n${rounds} rounds · order: ${content.properties.map((p) => p.shortLabel[lang]).join(' · ')}\n`);
Object.entries(counts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([key, n]) => {
    const jp = Rules.isJackpot(Object.fromEntries(key.split(' | ').map((s, i) => [propIds[i], s])), content);
    console.log(`${pct(n, rounds)}  ${String(n).padStart(7)}  ${labelOf(key)}${jp ? '   ← JACKPOT' : ''}`);
  });
console.log('\nResult screen categories (content.json "results"):');
(content.results.categories || []).forEach((cat) => {
  const n = categoryCounts[cat.id] || 0;
  console.log(`${pct(n, rounds)}  ${String(n).padStart(7)}  ${cat.id} – ${cat.title[lang].replace(/­/g, '')}`);
});
console.log(`\nJackpot simulated: ${pct(jackpots, rounds).trim()}  (${jackpots} of ${rounds})`);
console.log(`Jackpot exact:     ${pct(exactJackpots, totalMixes).trim()}  (${exactJackpots} of ${totalMixes} possible mixes, ≈ 1 in ${(totalMixes / exactJackpots).toFixed(1)})\n`);
