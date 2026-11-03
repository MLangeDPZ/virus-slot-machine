/*
 * Game flow:  idle → spinning → result → (spin again or timeout) → idle
 */
(function () {
  'use strict';

  const { Outcome, Sound, Input, Reel } = window.VSM;
  const $ = (sel) => document.querySelector(sel);
  const stage = $('#stage');

  const state = {
    content: null,
    table: null,
    lang: 'de',
    phase: 'loading',
    reels: [],
    outcome: null,
    resultTimer: 0,
    lastSpinAt: -Infinity,
  };

  /* ---------- Scaling: fixed 1080x1920 stage, fit to window ---------- */

  function fitStage() {
    const scale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  /* ---------- Text helpers ---------- */

  function t(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string' || Array.isArray(obj)) return obj;
    return obj[state.lang] ?? obj[state.content.settings.defaultLanguage] ?? '';
  }

  function fmt(str, vars) {
    return str.replace(/\{(\w+)\}/g, (m, key) => (key in vars ? vars[key] : m));
  }

  function symbolById(reelKey, id) {
    return state.content.reels[reelKey].symbols.find((s) => s.id === id);
  }

  function applyLanguage() {
    const c = state.content;
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-ui]').forEach((el) => {
      el.textContent = t(c.ui[el.dataset.ui]);
    });
    document.querySelectorAll('.reel-label').forEach((el, i) => {
      el.textContent = t(c.reels[c.reelOrder[i]].label);
    });
    state.reels.forEach((r) => r.refreshLabels());
    if (state.phase === 'result') renderResult(state.outcome, false);
  }

  function toggleLanguage() {
    const langs = state.content.languages;
    state.lang = langs[(langs.indexOf(state.lang) + 1) % langs.length];
    applyLanguage();
  }

  /* ---------- Setup ---------- */

  function buildReels() {
    const c = state.content;
    const labels = $('#reel-labels');
    const reels = $('#reels');
    c.reelOrder.forEach((key) => {
      const label = document.createElement('div');
      label.className = 'reel-label';
      labels.appendChild(label);

      const win = document.createElement('div');
      win.className = 'reel-window';
      reels.appendChild(win);
      state.reels.push(new Reel(win, c.reels[key].symbols, (sym) => t(sym.label)));
    });
  }

  /* ---------- Spin ---------- */

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  async function spin({ forced } = {}) {
    const s = state.content.settings;
    const now = performance.now();
    if (state.phase === 'loading' || state.phase === 'spinning') return;
    if (now - state.lastSpinAt < s.inputCooldownMs) return;
    state.lastSpinAt = now;

    Sound.unlock();
    hideResult();
    state.phase = 'spinning';
    stage.classList.add('is-spinning');

    const outcome = Outcome.decide(state.content, state.table, { forced });
    state.outcome = outcome;
    Sound.spinStart();

    const last = state.reels.length - 1;
    await Promise.all(state.reels.map((reel, i) => {
      let duration = s.firstStopMs + i * s.staggerMs;
      let fillerCount = 14 + i * 5;
      if (outcome.type === 'nearMiss' && i === last) {
        duration += s.nearMissExtraMs;
        fillerCount += 8;
      }
      return reel.spin(outcome.symbols[i], { duration, fillerCount, onTick: Sound.tick })
        .then(() => Sound.reelStop(i));
    }));

    await delay(s.resultDelayMs);
    stage.classList.remove('is-spinning');
    state.phase = 'result';
    renderResult(outcome, true);
    Sound[outcome.type]();

    clearTimeout(state.resultTimer);
    state.resultTimer = setTimeout(() => {
      hideResult();
      state.phase = 'idle';
    }, s.resultSeconds * 1000);
  }

  /* ---------- Result screen ---------- */

  function renderResult(outcome, animate) {
    const c = state.content;
    const el = $('#result');
    const sp = outcome.spillover;

    el.className = `result show type-${outcome.type}`;
    if (animate) el.classList.add('animate');

    $('#result-headline').textContent = t(c.ui[`${outcome.type}Headline`]);

    let virus = '';
    if (outcome.type === 'spillover') virus = t(sp.name);
    else if (outcome.type === 'nearMiss') virus = fmt(t(c.ui.nearMissVirus), { virus: t(sp.name) });
    $('#result-virus').textContent = virus;

    const tiles = $('#result-tiles');
    tiles.textContent = '';
    outcome.symbols.forEach((id, i) => {
      const reelKey = c.reelOrder[i];
      const sym = symbolById(reelKey, id);
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (outcome.type === 'nearMiss' && i === outcome.mismatchReel) tile.classList.add('off');
      const reelLabel = document.createElement('div');
      reelLabel.className = 'tile-reel';
      reelLabel.textContent = t(c.reels[reelKey].label);
      const icon = document.createElement('div');
      icon.className = 'tile-icon';
      icon.textContent = sym.icon;
      const label = document.createElement('div');
      label.className = 'tile-label';
      label.textContent = t(sym.label);
      tile.append(reelLabel, icon, label);
      tiles.appendChild(tile);
    });

    let text = '';
    if (outcome.type === 'spillover') {
      text = t(sp.evolution);
    } else if (outcome.type === 'nearMiss') {
      const reelKey = c.reelOrder[outcome.mismatchReel];
      const variants = t(c.nearMiss.byReel[reelKey]);
      const correct = symbolById(reelKey, sp[reelKey]);
      text = fmt(variants[outcome.textIndex % variants.length], {
        virus: t(sp.name),
        correct: t(correct.label),
      });
    } else {
      const variants = t(c.miss.texts);
      text = variants[outcome.textIndex % variants.length];
    }
    $('#result-text').textContent = text;
  }

  function hideResult() {
    clearTimeout(state.resultTimer);
    $('#result').classList.remove('show', 'animate');
  }

  /* ---------- Boot ---------- */

  async function boot() {
    fitStage();
    window.addEventListener('resize', fitStage);

    try {
      const res = await fetch('content.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.content = await res.json();
    } catch (err) {
      console.error('Failed to load content.json', err);
      const box = $('#error');
      box.hidden = false;
      box.textContent =
        'content.json konnte nicht geladen werden. Bitte über einen lokalen Webserver starten (siehe README). / ' +
        'Could not load content.json. Please run via a local web server (see README).';
      return;
    }

    const problems = Outcome.validate(state.content);
    problems.forEach((p) => console.warn('[content]', p));

    state.table = Outcome.buildTable(state.content);
    state.lang = state.content.settings.defaultLanguage;
    buildReels();
    applyLanguage();

    Input.init(stage);
    Input.on('spin', spin);
    Input.on('language', toggleLanguage);

    state.phase = 'idle';
  }

  boot();
})();
