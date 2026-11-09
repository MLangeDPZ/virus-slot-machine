/*
 * Round animations (phase 3). DOM + timing only – no game logic, no text.
 * Every function returns a Promise that resolves when its part of the round is done.
 *
 *   intro()       3.1  source viruses fly into the pig (~1.2 s, slight spring)
 *   mix()         3.2  segments flicker through the virus colours and lock one by one (~2.6 s)
 *   revealTiles() 3.3  result tiles light up one after another, prior immunity last and set apart
 *
 * All timings are stage-independent milliseconds and live in TIMING below.
 */
(function (root) {
  'use strict';

  const TIMING = {
    intro: {
      fly: 820,          // flight of one virus into the pig
      stagger: 70,       // delay between the three viruses
      gulp: 380,         // spring of the pig after swallowing
      restore: 450,      // source viruses fade back in as colour legend
    },
    mix: {
      firstLock: 900,    // first segment locks
      lockStep: 190,     // then one every lockStep ms
      lastDelay: 600,    // extra wait before the last segment – the suspense moment
      minInterval: 45,   // fastest colour change (start)
      maxInterval: 280,  // slowest colour change (just before locking)
    },
    tiles: {
      leadIn: 450,       // pause after the last segment locked
      gap: 500,          // between two tiles
      humanExtra: 400,   // additional pause before the prior-immunity tile
      humanFlash: 650,   // its reveal animation is longer
    },
    result: {
      leadIn: 1400,      // let the visitor read the tiles on the machine before the result screen
      fadeIn: 600,
      fadeOut: 300,
    },
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function centerOf(node) {
    const r = node.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  // Restart a CSS animation class (works for HTML and SVG elements).
  function replayClass(node, className) {
    node.classList.remove(className);
    node.getBoundingClientRect(); // force reflow
    node.classList.add(className);
  }

  /* ---------- 3.1 Intro: viruses into the pig ---------- */

  /**
   * @param {object} o
   * @param {HTMLElement}   o.stage    scaled stage (to convert screen px → stage px)
   * @param {Element[]}     o.sources  the three source virion graphics
   * @param {HTMLElement}   o.host     the pig
   * @param {() => void}   [o.onArrive] called once per virus when it disappears in the pig
   */
  function intro({ stage, sources, host, onArrive }) {
    const T = TIMING.intro;
    const scale = stage.getBoundingClientRect().width / stage.offsetWidth;
    const target = centerOf(host);

    const flights = sources.map((node, i) => {
      const c = centerOf(node);
      const dx = (target.x - c.x) / scale;
      const dy = (target.y - c.y) / scale;
      const anim = node.animate(
        [
          { offset: 0, transform: 'translate(0, 0) scale(1)', opacity: 1, easing: 'cubic-bezier(.3, 0, .5, 1)' },
          // small lift before the fall – anticipation
          { offset: 0.18, transform: 'translate(0, -26px) scale(1.06)', opacity: 1, easing: 'cubic-bezier(.55, 0, .85, .45)' },
          { offset: 0.86, transform: `translate(${dx}px, ${dy}px) scale(.3)`, opacity: 1 },
          { offset: 1, transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 },
        ],
        { duration: T.fly, delay: i * T.stagger, fill: 'forwards' }
      );
      // small bump of the pig each time a virus arrives
      setTimeout(() => {
        host.animate(
          [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }],
          { duration: 160, easing: 'ease-out' }
        );
        if (onArrive) onArrive(i);
      }, i * T.stagger + T.fly * 0.86);
      return anim;
    });

    // Sequencing runs on timers, not on animation promises: robust even if the browser throttles frames.
    const flightsDone = (sources.length - 1) * T.stagger + T.fly;
    return wait(flightsDone).then(() => {
      // final spring: squash, stretch, settle
      host.animate(
        [
          { transform: 'scale(1, 1)' },
          { transform: 'scale(1.28, .82)', offset: 0.25 },
          { transform: 'scale(.9, 1.12)', offset: 0.55 },
          { transform: 'scale(1.04, .97)', offset: 0.8 },
          { transform: 'scale(1, 1)' },
        ],
        { duration: T.gulp, easing: 'ease-out' }
      );
      return wait(T.gulp).then(() => flights);
    });
  }

  /** Bring the source viruses back at the top (they serve as colour legend while mixing). */
  function restoreSources(flights) {
    flights.forEach((anim) => {
      const node = anim.effect.target;
      anim.cancel();
      node.animate(
        [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: TIMING.intro.restore, easing: 'cubic-bezier(.3, 1.4, .5, 1)' }
      );
    });
  }

  /* ---------- 3.2 Mixing ---------- */

  /**
   * @param {object} o
   * @param {Element[]} o.segments  segment <g> elements, in lock order
   * @param {string[]}  o.finals    final virus id per segment (same order)
   * @param {string[]}  o.virusIds  ids to flicker through
   * @param {(i:number, isLast:boolean) => void} [o.onLock]
   * @param {() => void} [o.onFlicker]  called on colour changes (for a tick sound)
   */
  function mix({ segments, finals, virusIds, onLock, onFlicker }) {
    const T = TIMING.mix;
    const n = segments.length;
    const lockAt = segments.map((_, i) =>
      i < n - 1 ? T.firstLock + i * T.lockStep : T.firstLock + (n - 2) * T.lockStep + T.lastDelay
    );
    const setColor = (g, id) => g.style.setProperty('--c', `var(--virus-${id})`);

    const slots = segments.map((g) => {
      g.classList.add('is-filled', 'is-flicker');
      g.classList.remove('is-locked');
      const idx = Math.floor(Math.random() * virusIds.length);
      setColor(g, virusIds[idx]);
      return { g, idx, next: 0, locked: false };
    });

    return new Promise((resolve) => {
      const start = performance.now();
      let remaining = n;

      function frame(now) {
        const t = now - start;
        let changed = false;
        slots.forEach((s, i) => {
          if (s.locked) return;
          if (t >= lockAt[i]) {
            s.locked = true;
            remaining--;
            setColor(s.g, finals[i]);
            s.g.classList.remove('is-flicker');
            s.g.classList.add('is-locked');
            replayClass(s.g, 'lock-flash');
            if (onLock) onLock(i, i === n - 1);
            return;
          }
          if (t >= s.next) {
            s.idx = (s.idx + 1) % virusIds.length;
            setColor(s.g, virusIds[s.idx]);
            const p = t / lockAt[i]; // 0 → 1: slows down towards its own lock
            s.next = t + T.minInterval + (T.maxInterval - T.minInterval) * p * p * p;
            changed = true;
          }
        });
        if (changed && onFlicker) onFlicker();
        if (remaining > 0) setTimeout(() => frame(performance.now()), 16);
        else resolve();
      }
      frame(start);
    });
  }

  /* ---------- 3.3 Result tiles ---------- */

  /**
   * @param {Array<{node:HTMLElement, isHuman:boolean, apply:() => void}>} tiles  in reveal order
   * @param {(isHuman:boolean) => void} [onReveal]
   */
  async function revealTiles(tiles, onReveal) {
    const T = TIMING.tiles;
    await wait(T.leadIn);
    for (let i = 0; i < tiles.length; i++) {
      const { node, isHuman, apply } = tiles[i];
      if (isHuman) await wait(T.humanExtra);
      apply();
      replayClass(node, 'reveal');
      if (onReveal) onReveal(isHuman);
      await wait(isHuman ? T.humanFlash : T.gap);
    }
  }

  /* ---------- 4.1 Result screen ---------- */

  /** Fades the (already filled) result screen in; its parts appear staggered via CSS (.is-entering). */
  async function showResult(node) {
    const T = TIMING.result;
    await wait(T.leadIn);
    node.hidden = false;
    replayClass(node, 'is-entering');
    node.animate(
      [{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'scale(1)' }],
      { duration: T.fadeIn, easing: 'cubic-bezier(.2, .8, .3, 1)' }
    );
    await wait(T.fadeIn);
  }

  async function hideResult(node) {
    const T = TIMING.result;
    node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.fadeOut, easing: 'ease-in', fill: 'forwards' });
    await wait(T.fadeOut);
    node.hidden = true;
    node.classList.remove('is-entering');
    node.getAnimations().forEach((a) => a.cancel());
  }

  root.VSM = root.VSM || {};
  root.VSM.Anim = { TIMING, intro, restoreSources, mix, revealTiles, showResult, hideResult };
})(window);
