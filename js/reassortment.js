/*
 * Reassortment: one round of mixing in the host.
 * Pure logic – no DOM access. Works in the browser (window.VSM.Reassortment)
 * and in Node (module.exports), e.g. for tools/simulate.js later.
 */
(function (root) {
  'use strict';

  /**
   * For each segment, randomly draw one of the source viruses as its origin.
   *
   * @param {Array<{number:number}>} segments  content.segments.items
   * @param {Array<{id:string}>}     viruses   content.viruses
   * @param {() => number}           [random]  RNG in [0, 1), defaults to Math.random
   * @returns {Array<{segment:number, virus:string}>} one entry per segment, in segment order
   */
  function roll(segments, viruses, random = Math.random) {
    if (!segments.length || !viruses.length) {
      throw new Error('reassortment.roll: segments and viruses must not be empty');
    }
    return segments.map((seg) => ({
      segment: seg.number,
      virus: viruses[Math.floor(random() * viruses.length)].id,
    }));
  }

  const api = { roll };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else {
    root.VSM = root.VSM || {};
    root.VSM.Reassortment = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
