/*
 * Outcome logic: decides the result BEFORE the reels spin.
 *
 * At load time every possible reel combination is classified:
 *   spillover – exactly matches one of the spillover entries
 *   nearMiss  – matches 2 of 3 reels of some spillover (but none fully)
 *   miss      – shares at most 1 reel with every spillover
 * A spin first picks the outcome type by weight, then a combination of that type.
 */
(function (root) {
  'use strict';

  function matchCount(triple, spillover, order) {
    let n = 0;
    order.forEach((reel, i) => { if (triple[i] === spillover[reel]) n++; });
    return n;
  }

  function buildTable(content) {
    const order = content.reelOrder;
    const ids = order.map((reel) => content.reels[reel].symbols.map((s) => s.id));
    const near = [];
    const miss = [];

    const combos = [[]];
    ids.forEach((list) => {
      const next = [];
      combos.forEach((c) => list.forEach((id) => next.push(c.concat(id))));
      combos.splice(0, combos.length, ...next);
    });

    combos.forEach((triple) => {
      let best = 0;
      let bestSp = null;
      content.spillovers.forEach((sp) => {
        const m = matchCount(triple, sp, order);
        if (m > best) { best = m; bestSp = sp; }
      });
      if (best === order.length - 1) {
        const mismatchReel = order.findIndex((reel, i) => triple[i] !== bestSp[reel]);
        near.push({ symbols: triple, spillover: bestSp, mismatchReel });
      } else if (best < order.length - 1) {
        miss.push({ symbols: triple });
      }
    });

    return { near, miss };
  }

  function validate(content) {
    const problems = [];
    const order = content.reelOrder;
    const seen = new Set();
    content.spillovers.forEach((sp) => {
      order.forEach((reel) => {
        if (!content.reels[reel].symbols.some((s) => s.id === sp[reel])) {
          problems.push(`Spillover "${sp.id}": unknown ${reel} symbol "${sp[reel]}"`);
        }
      });
      const key = order.map((r) => sp[r]).join('|');
      if (seen.has(key)) problems.push(`Spillover "${sp.id}": duplicate combination ${key}`);
      seen.add(key);
    });
    return problems;
  }

  function pickRandom(arr, rng) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function pickWeighted(weights, rng) {
    const entries = Object.entries(weights);
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let r = rng() * total;
    for (const [key, w] of entries) {
      if ((r -= w) < 0) return key;
    }
    return entries[entries.length - 1][0];
  }

  /**
   * @param {object} content  parsed content.json
   * @param {object} table    result of buildTable(content)
   * @param {object} [opts]   { rng, forced: 'spillover' | 'nearMiss' | 'miss' }
   */
  function decide(content, table, opts = {}) {
    const rng = opts.rng || Math.random;
    const settings = content.settings;
    const order = content.reelOrder;
    let type = opts.forced || pickWeighted(settings.weights, rng);

    if (type === 'nearMiss' && table.near.length === 0) type = 'miss';
    if (type === 'miss' && table.miss.length === 0) type = 'spillover';

    const result = { type, textIndex: Math.floor(rng() * 1000) };

    if (type === 'spillover') {
      const sp = pickRandom(content.spillovers, rng);
      result.spillover = sp;
      result.symbols = order.map((reel) => sp[reel]);
    } else if (type === 'nearMiss') {
      // Prefer near misses decided on the last reel – that is where the suspense is.
      let pool = table.near;
      if (rng() < (settings.nearMissLastReelBias || 0)) {
        const lastReel = pool.filter((n) => n.mismatchReel === order.length - 1);
        if (lastReel.length) pool = lastReel;
      }
      const entry = pickRandom(pool, rng);
      result.spillover = entry.spillover;
      result.mismatchReel = entry.mismatchReel;
      result.symbols = entry.symbols.slice();
    } else {
      result.symbols = pickRandom(table.miss, rng).symbols.slice();
    }
    return result;
  }

  const api = { buildTable, validate, decide, pickWeighted };
  root.VSM = root.VSM || {};
  root.VSM.Outcome = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
