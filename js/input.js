/*
 * Input abstraction. The game only knows abstract actions:
 *   "spin"     – mouse click or Space (the physical lever will send Space)
 *   "language" – L key (temporary, until the final hardware decision)
 *
 * Debug keys 1 / 2 / 3 force a spillover / near miss / miss.
 */
(function (root) {
  'use strict';

  const handlers = { spin: [], language: [] };
  const DEBUG_KEYS = { Digit1: 'spillover', Digit2: 'nearMiss', Digit3: 'miss' };

  function emit(action, payload) {
    handlers[action].forEach((fn) => fn(payload || {}));
  }

  function init(target) {
    target.addEventListener('click', () => emit('spin'));

    root.addEventListener('keydown', (e) => {
      if (e.repeat) return; // a held lever/key must not trigger repeatedly
      if (e.code === 'Space') {
        e.preventDefault();
        emit('spin');
      } else if (e.code === 'KeyL') {
        emit('language');
      } else if (DEBUG_KEYS[e.code]) {
        emit('spin', { forced: DEBUG_KEYS[e.code] });
      }
    });

    // Exhibit hygiene: no context menu, no zoom.
    root.addEventListener('contextmenu', (e) => e.preventDefault());
    root.addEventListener('wheel', (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
    root.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && ['+', '-', '=', '0'].includes(e.key)) e.preventDefault();
    });
    ['gesturestart', 'gesturechange'].forEach((t) => root.addEventListener(t, (e) => e.preventDefault()));
  }

  function on(action, fn) {
    handlers[action].push(fn);
  }

  root.VSM = root.VSM || {};
  root.VSM.Input = { init, on };
})(window);
