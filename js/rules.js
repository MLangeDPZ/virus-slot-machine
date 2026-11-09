/*
 * Coupling: mix of 8 segments → states of the four result properties.
 * Pure logic, no DOM. Every rule comes from content.json ("rules") – nothing is hardcoded here.
 * Works in the browser (window.VSM.Rules) and in Node (module.exports, used by tools/simulate.js).
 *
 * Rule format per property (content.rules.properties.<propertyId>):
 *   {
 *     "segments": [1],                       // segment number(s) that decide this property
 *     "when": { "origin": "human", "min": 1 },// condition: at least `min` of these segments come
 *                                            // from a virus with this origin (default min: all of them)
 *     "then": "human",                       // state if the condition holds
 *     "else": "bird"                         // state otherwise
 *   }
 */
(function (root) {
  'use strict';

  function originLookup(viruses) {
    const map = {};
    viruses.forEach((v) => { map[v.id] = v.origin; });
    return map;
  }

  /**
   * @param {Array<{segment:number, virus:string}>} mix  result of Reassortment.roll
   * @param {object} content                            parsed content.json
   * @returns {Object<string,string>} propertyId → state id, in content.properties order
   */
  function derive(mix, content) {
    const origin = originLookup(content.viruses);
    const bySegment = {};
    mix.forEach((m) => { bySegment[m.segment] = origin[m.virus]; });

    const states = {};
    content.properties.forEach((p) => {
      const rule = content.rules.properties[p.id];
      if (!rule) return;
      const hits = rule.segments.filter((n) => bySegment[n] === rule.when.origin).length;
      const min = rule.when.min ?? rule.segments.length;
      states[p.id] = hits >= min ? rule.then : rule.else;
    });
    return states;
  }

  function isJackpot(states, content) {
    const target = content.rules.jackpot;
    return Object.keys(target).every((id) => states[id] === target[id]);
  }

  // Does one result category's "when" condition hold? No "when" = fallback, always true.
  function categoryMatches(cat, states, content) {
    const when = cat.when;
    if (!when) return true;
    if (when.jackpot && !isJackpot(states, content)) return false;
    if (when.jackpotStates) {
      const target = content.rules.jackpot;
      const ids = when.jackpotStates.properties || Object.keys(target);
      const hits = ids.filter((id) => states[id] === target[id]).length;
      const min = when.jackpotStates.min ?? ids.length;
      if (hits < min) return false;
    }
    return true;
  }

  /**
   * Picks the result category (content.results.categories) for a set of property states.
   * Categories are checked in order; the first match wins.
   * @returns {object|null} the category object
   */
  function classify(states, content) {
    const cats = (content.results && content.results.categories) || [];
    return cats.find((cat) => categoryMatches(cat, states, content)) || null;
  }

  /** Checks the rules block against segments/properties; returns a list of human-readable problems. */
  function validate(content) {
    const problems = [];
    const rules = content.rules || {};
    const segNumbers = new Set(content.segments.items.map((s) => s.number));
    const origins = new Set(content.viruses.map((v) => v.origin));
    const props = {};
    content.properties.forEach((p) => { props[p.id] = p; });

    if (!rules.properties) problems.push('rules.properties fehlt / missing');
    content.properties.forEach((p) => {
      const r = rules.properties && rules.properties[p.id];
      if (!r) { problems.push(`rules.properties.${p.id} fehlt / missing`); return; }
      (r.segments || []).forEach((n) => {
        if (!segNumbers.has(n)) problems.push(`rules.properties.${p.id}: Segment ${n} existiert nicht / does not exist`);
      });
      if (!r.segments || !r.segments.length) problems.push(`rules.properties.${p.id}: keine Segmente / no segments`);
      if (!r.when || !origins.has(r.when.origin)) problems.push(`rules.properties.${p.id}: when.origin unbekannt / unknown`);
      [r.then, r.else].forEach((s) => {
        if (!(s in p.states)) problems.push(`rules.properties.${p.id}: Zustand "${s}" nicht in properties / state not defined`);
      });
    });
    Object.entries(rules.jackpot || {}).forEach(([id, s]) => {
      if (!props[id] || !(s in props[id].states)) problems.push(`rules.jackpot.${id}: "${s}" unbekannt / unknown`);
    });
    if (!rules.jackpot) problems.push('rules.jackpot fehlt / missing');

    const cats = (content.results && content.results.categories) || [];
    if (!cats.length) problems.push('results.categories fehlt / missing');
    else if (cats[cats.length - 1].when) {
      problems.push('results.categories: letzte Kategorie braucht kein "when" (Auffangkategorie) / last category must be a fallback without "when"');
    }
    cats.forEach((cat) => {
      const js = cat.when && cat.when.jackpotStates;
      (js && js.properties || []).forEach((id) => {
        if (!props[id]) problems.push(`results.categories.${cat.id}: Eigenschaft "${id}" unbekannt / unknown property`);
      });
      ['title', 'text'].forEach((field) => {
        (content.languages || []).forEach((lang) => {
          if (!cat[field] || !cat[field][lang]) problems.push(`results.categories.${cat.id}.${field}.${lang} fehlt / missing`);
        });
      });
    });
    return problems;
  }

  const api = { derive, isJackpot, classify, validate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    root.VSM = root.VSM || {};
    root.VSM.Rules = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
