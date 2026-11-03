/*
 * A single reel. The window shows 3 rows; the middle row is the payline.
 *
 * To spin, a fresh strip is built:  [above, TARGET, below, ...filler..., currently visible 3]
 * It starts scrolled to the bottom (showing what was visible) and animates to the top,
 * so symbols move downwards and the reel always lands exactly on TARGET.
 */
(function (root) {
  'use strict';

  const CELL = 260; // must match --cell in css/style.css

  class Reel {
    constructor(windowEl, symbols, labelFor) {
      this.symbols = symbols;
      this.labelFor = labelFor;
      this.strip = document.createElement('div');
      this.strip.className = 'strip';
      windowEl.appendChild(this.strip);

      const start = Math.floor(Math.random() * symbols.length);
      const at = (i) => symbols[(i + symbols.length) % symbols.length];
      this.setCells([at(start - 1), at(start), at(start + 1)]);
    }

    randomSymbol(excludeId) {
      if (this.symbols.length < 2) return this.symbols[0];
      let s;
      do { s = this.symbols[Math.floor(Math.random() * this.symbols.length)]; } while (s.id === excludeId);
      return s;
    }

    setCells(list) {
      this.cells = list;
      this.strip.textContent = '';
      list.forEach((sym) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const icon = document.createElement('div');
        icon.className = 'cell-icon';
        icon.textContent = sym.icon;
        const label = document.createElement('div');
        label.className = 'cell-label';
        label.textContent = this.labelFor(sym);
        cell.append(icon, label);
        this.strip.appendChild(cell);
      });
      this.strip.style.transform = 'translateY(0px)';
    }

    refreshLabels() {
      this.strip.querySelectorAll('.cell-label').forEach((el, i) => {
        el.textContent = this.labelFor(this.cells[i]);
      });
    }

    /**
     * @returns {Promise} resolves when the reel has stopped on targetId
     */
    spin(targetId, { duration, fillerCount, onTick }) {
      const target = this.symbols.find((s) => s.id === targetId);
      const above = this.randomSymbol(target.id);
      const below = this.randomSymbol(target.id);

      const filler = [];
      let prev = below.id;
      for (let i = 0; i < fillerCount; i++) {
        const s = this.randomSymbol(prev);
        filler.push(s);
        prev = s.id;
      }

      const visible = this.cells.slice(0, 3);
      this.setCells([above, target, below, ...filler, ...visible]);

      const startY = -(this.cells.length - 3) * CELL;
      const anim = this.strip.animate(
        [{ transform: `translateY(${startY}px)` }, { transform: 'translateY(0px)' }],
        { duration, easing: 'cubic-bezier(.2, .55, .25, 1)', fill: 'forwards' }
      );

      // tick sound whenever a symbol passes the payline
      let lastIndex = null;
      let raf = 0;
      const watch = () => {
        const y = new DOMMatrixReadOnly(getComputedStyle(this.strip).transform).m42;
        const index = Math.floor(y / CELL);
        if (lastIndex !== null && index !== lastIndex && onTick) onTick();
        lastIndex = index;
        raf = requestAnimationFrame(watch);
      };
      raf = requestAnimationFrame(watch);

      return anim.finished.then(() => {
        cancelAnimationFrame(raf);
        anim.cancel();
        this.setCells([above, target, below]);
        // small settle bounce
        this.strip.animate(
          [{ transform: 'translateY(0px)' }, { transform: 'translateY(22px)' }, { transform: 'translateY(0px)' }],
          { duration: 260, easing: 'ease-out' }
        );
      });
    }
  }

  root.VSM = root.VSM || {};
  root.VSM.Reel = Reel;
})(window);
