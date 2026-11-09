/*
 * Loads content.json and builds the static layout from it.
 * No game logic yet. All visible text comes from content.json.
 */
(function () {
  'use strict';

  const { Input, Reassortment, Rules, Anim, Sound } = window.VSM;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const $ = (sel) => document.querySelector(sel);
  const stage = $('#stage');

  const state = { content: null, lang: 'de' };

  /* ---------- Scaling: fixed 1080x1920 stage, fit to window ---------- */

  function fitStage() {
    const scale = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
    stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  /* ---------- Helpers ---------- */

  // Picks the current language from a { de, en } object.
  function t(obj) {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[state.lang] ?? obj[state.content.defaultLanguage] ?? '';
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function svgUse(symbolId, className) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', className);
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', `#${symbolId}`);
    svg.appendChild(use);
    return svg;
  }

  /* ---------- Build layout from content ---------- */

  function applyColors() {
    // Virus colours live in content.json; CSS keeps defaults as fallback.
    state.content.viruses.forEach((v) => {
      document.documentElement.style.setProperty(`--virus-${v.id}`, v.color);
    });
  }

  function buildSources() {
    const box = $('#sources');
    box.textContent = '';
    state.content.viruses.forEach((v) => {
      const fig = el('figure', 'virus');
      fig.dataset.virus = v.id;
      fig.style.setProperty('--c', `var(--virus-${v.id})`);
      const cap = el('figcaption');
      cap.append(
        el('span', 'caption-name', t(v.name)),
        el('span', 'caption-label', t(state.content.ui.origin[v.origin]))
      );
      fig.append(svgUse('virion', 'virion'), cap);
      box.appendChild(fig);
    });
  }

  // Empty virus shell with one placeholder dot per segment (mixer and result screen).
  // Same 7-around-1 geometry as the #virion symbol; segment 8 sits in the centre.
  function buildVirion(svg) {
    svg.textContent = '';
    const shell = document.createElementNS(SVG_NS, 'use');
    shell.setAttribute('href', '#virion-shell');
    shell.setAttribute('class', 'mix-shell');
    svg.appendChild(shell);

    const items = state.content.segments.items;
    const ring = items.length - 1;
    items.forEach((seg, i) => {
      const center = i === ring;
      const angle = (i / ring) * 2 * Math.PI;
      const x = center ? 100 : 100 + 42 * Math.sin(angle);
      const y = center ? 100 : 100 - 42 * Math.cos(angle);

      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'seg');
      g.dataset.segment = seg.number;
      g.style.setProperty('--i', i);
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', x);
      dot.setAttribute('cy', y);
      dot.setAttribute('r', 16);
      const num = document.createElementNS(SVG_NS, 'text');
      num.setAttribute('x', x);
      num.setAttribute('y', y);
      num.textContent = String(seg.number);
      g.append(dot, num);
      svg.appendChild(g);
    });
  }

  function propertyTile(p, className) {
    const tile = el('div', className);
    tile.dataset.property = p.id;
    tile.append(
      el('div', 'tile-icon', p.icon || ''),
      el('div', 'tile-value', t(state.content.ui.unknownValue))
    );
    return tile;
  }

  function buildTiles() {
    const box = $('#tiles');
    const bar = $('#human-bar');
    box.textContent = '';
    bar.textContent = '';
    state.content.properties.forEach((p) => {
      if (p.aboutHumans) {
        // Concerns people, not the virus → separate bar below the machine.
        const tile = propertyTile(p, 'human-tile');
        tile.insertBefore(el('div', 'human-label', t(p.shortLabel)), tile.lastChild);
        bar.appendChild(tile);
      } else {
        const col = el('div', 'tile-col');
        col.append(el('div', 'tile-label', t(p.shortLabel)), propertyTile(p, 'tile'));
        box.appendChild(col);
      }
    });
  }

  function render() {
    const c = state.content;
    document.documentElement.lang = state.lang;
    document.title = t(c.ui.title);
    document.querySelectorAll('[data-ui]').forEach((node) => {
      node.textContent = t(c.ui[node.dataset.ui]);
    });
    buildSources();
    buildVirion($('#mix-virion'));
    buildTiles();
    if (state.last) buildResult(state.last); // keeps the result screen in sync on re-render (language switch)
  }

  /* ---------- Result screen (4.1) ---------- */

  const resultBox = $('#result');

  function resultTile(p, s, className) {
    const tile = el('div', className);
    tile.dataset.property = p.id;
    tile.dataset.state = s;
    tile.classList.toggle('is-jackpot-state', state.content.rules.jackpot[p.id] === s);
    tile.append(
      el('div', 'rtile-icon', p.icon || ''),
      el('div', 'rtile-label', t(p.label)),
      el('div', 'rtile-value', t(p.states[s]))
    );
    return tile;
  }

  // Fills the result screen for one round: virus with its 8 coloured segments, the four
  // properties as icon tiles, the explanation of the category. All text from content.json.
  function buildResult({ mix, states, category }) {
    const c = state.content;
    resultBox.dataset.category = category.id;

    $('#result-icon').textContent = category.icon || '';
    $('#result-title').textContent = t(category.title);
    $('#result-text').textContent = t(category.text);

    // Virus: segments in the colours of their source virus
    const svg = $('#result-virion');
    buildVirion(svg);
    mix.forEach((m) => {
      const g = svg.querySelector(`.seg[data-segment="${m.segment}"]`);
      if (!g) return;
      g.classList.add('is-filled');
      g.style.setProperty('--c', `var(--virus-${m.virus})`);
    });

    // Legend: how many segments come from which source virus
    const legend = $('#result-legend');
    legend.textContent = '';
    c.viruses.forEach((v) => {
      const n = mix.filter((m) => m.virus === v.id).length;
      if (!n) return;
      const chip = el('span', 'legend-chip');
      chip.style.setProperty('--c', `var(--virus-${v.id})`);
      chip.append(el('span', 'legend-count', String(n)), el('span', 'legend-name', t(v.name)));
      legend.appendChild(chip);
    });

    // Properties: virus properties in a row, the one about people set apart below
    const tiles = $('#result-tiles');
    const human = $('#result-human');
    tiles.textContent = '';
    human.textContent = '';
    c.properties.forEach((p) => {
      const s = states[p.id];
      if (!s) return;
      if (p.aboutHumans) human.appendChild(resultTile(p, s, 'rtile rtile--human'));
      else tiles.appendChild(resultTile(p, s, 'rtile'));
    });
  }

  /* ---------- Spin ---------- */

  const segmentNode = (n) => document.querySelector(`#mix-virion .seg[data-segment="${n}"]`);
  const tileNode = (id) => document.querySelector(`[data-property="${id}"]`);

  // Back to the empty machine before a new round.
  function resetBoard() {
    stage.classList.remove('is-jackpot');
    document.querySelectorAll('#mix-virion .seg').forEach((g) => {
      g.classList.remove('is-filled', 'is-flicker', 'is-locked', 'lock-flash');
      g.style.removeProperty('--c');
    });
    state.content.properties.forEach((p) => {
      const tile = tileNode(p.id);
      if (!tile) return;
      delete tile.dataset.state;
      tile.classList.remove('is-jackpot-state', 'reveal');
      tile.querySelector('.tile-value').textContent = t(state.content.ui.unknownValue);
    });
  }

  // Show one property's state on its tile. States that match the jackpot are highlighted.
  function showProperty(p, s) {
    const tile = tileNode(p.id);
    if (!tile || !s) return;
    tile.dataset.state = s;
    tile.classList.toggle('is-jackpot-state', state.content.rules.jackpot[p.id] === s);
    tile.querySelector('.tile-value').textContent = t(p.states[s]);
  }

  let busy = false;

  async function spin() {
    if (busy) return; // ignore the lever while a round is running
    busy = true;
    Sound.unlock();
    try {
      const c = state.content;
      const mix = Reassortment.roll(c.segments.items, c.viruses);
      const states = Rules.derive(mix, c);
      const jackpot = Rules.isJackpot(states, c);
      const category = Rules.classify(states, c);
      // dev aid
      console.table(mix);
      console.log(states, jackpot ? 'JACKPOT' : '', category && category.id);

      // A lever pull on the result screen starts the next round
      if (!resultBox.hidden) await Anim.hideResult(resultBox);
      state.last = null;
      resetBoard();

      // 3.1 viruses into the pig
      Sound.swallow();
      const flights = await Anim.intro({
        stage,
        sources: [...document.querySelectorAll('#sources .virion')],
        host: $('.mixer-icon'),
        onArrive: () => Sound.plop(),
      });
      Anim.restoreSources(flights);

      // 3.2 mixing
      const n = mix.length;
      await Anim.mix({
        segments: mix.map((m) => segmentNode(m.segment)),
        finals: mix.map((m) => m.virus),
        virusIds: c.viruses.map((v) => v.id),
        onFlicker: () => Sound.tick(),
        onLock: (i, isLast) => Sound.segmentLock(i, n, isLast),
      });

      // 3.3 result tiles – properties about people (prior immunity) always last
      const ordered = [...c.properties].sort((a, b) => !!a.aboutHumans - !!b.aboutHumans);
      await Anim.revealTiles(
        ordered
          .filter((p) => tileNode(p.id) && states[p.id])
          .map((p) => ({
            node: tileNode(p.id),
            isHuman: !!p.aboutHumans,
            apply: () => showProperty(p, states[p.id]),
          })),
        (isHuman) => Sound.tileReveal(isHuman)
      );

      stage.classList.toggle('is-jackpot', jackpot);

      // 4.1 result screen
      if (category) {
        state.last = { mix, states, category };
        buildResult(state.last);
        await Anim.showResult(resultBox);
      }
    } finally {
      busy = false;
    }
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
      // The only text not from content.json: it can't be, since loading it failed.
      console.error('Failed to load content.json', err);
      const box = $('#error');
      box.hidden = false;
      box.textContent =
        'content.json konnte nicht geladen werden. Bitte über einen lokalen Webserver starten (siehe README). / ' +
        'Could not load content.json. Please run via a local web server (see README).';
      return;
    }

    Rules.validate(state.content).forEach((p) => console.warn('[content.json]', p));

    state.lang = state.content.defaultLanguage;
    applyColors();
    render();

    Input.init(stage);
    Input.on('spin', spin);
  }

  boot();
})();
