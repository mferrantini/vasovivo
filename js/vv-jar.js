/**
 * VasoVivo — dashboard illustrata (tavola del barattolo)
 *
 * Disegna il barattolo EKLATANT e lo aggiorna a ogni lettura di VVData:
 *   umidità dell'aria → gocce di condensa e nebbia
 *   luce              → raggi dall'alto
 *   CO₂ e TVOC        → pulviscolo sospeso
 *   temperatura       → colore dell'alone
 *   umidità substrato → colore del substrato
 */

(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const HISTORY = 48;
  const SOIL_Y = 278;
  const JAR_LEFT = 122;
  const JAR_RIGHT = 398;

  const art = document.getElementById('jar-art');
  const page = document.getElementById('dashboard');
  if (!art || !page) return;

  let seed = 20261019;
  function random() {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function between(min, max) {
    return min + (max - min) * random();
  }

  function round(value) {
    return Math.round(value * 10) / 10;
  }

  function make(name, attributes, parent) {
    const node = document.createElementNS(SVG_NS, name);
    Object.keys(attributes).forEach(function (key) {
      node.setAttribute(key, attributes[key]);
    });
    parent.appendChild(node);
    return node;
  }

  function path(parts) {
    return parts.map(function (part) {
      return typeof part === 'number' ? round(part) : part;
    }).join(' ');
  }

  // Cespo centrato nel barattolo (asse x ≈ 260); altezze leggermente contenute
  const MUSHROOMS = [
    [228, 86, -8, 17], [250, 106, -2, 20], [272, 97, 4, 19], [294, 76, 10, 15],
    [238, 56, -14, 11], [308, 52, 16, 10], [260, 38, 1, 8], [215, 43, -18, 8]
  ];

  function drawMushrooms() {
    const group = document.getElementById('jar-shrooms');
    const feet = document.getElementById('jar-mycelium');
    if (!group || !feet) return;

    MUSHROOMS.forEach(function (mushroom, i) {
      const x = mushroom[0];
      const h = mushroom[1];
      const lean = mushroom[2];
      const r = mushroom[3];
      const w = 2.2 + r * 0.14;
      const bend = lean > 0 ? 2.5 : -2.5;
      const top = -h;

      const place = make('g', { transform: 'translate(' + x + ' ' + SOIL_Y + ') rotate(' + lean + ')' }, group);
      const grow = make('g', { class: 'vv-shroom', style: '--i: ' + i }, place);
      const sway = make('g', {
        class: 'vv-sway',
        style: '--d: ' + between(4.5, 7.5).toFixed(2) + 's; --dd: -' + between(0, 6).toFixed(2) + 's'
      }, grow);

      make('path', {
        class: 'vv-stem',
        d: path([
          'M', -w, 0,
          'C', -w, -h * 0.4, -w * 0.6 + bend, -h * 0.75, -w * 0.5 + bend, top,
          'L', w * 0.5 + bend, top,
          'C', w * 0.6 + bend, -h * 0.75, w, -h * 0.4, w, 0, 'Z'
        ])
      }, sway);
      make('path', {
        class: 'vv-cap',
        d: path([
          'M', bend - r, top + 3,
          'C', bend - r, top - r * 0.95, bend + r, top - r * 0.95, bend + r, top + 3,
          'C', bend + r * 0.5, top + r * 0.28, bend - r * 0.5, top + r * 0.28, bend - r, top + 3, 'Z'
        ])
      }, sway);
      make('path', {
        class: 'vv-gills',
        d: path(['M', bend - r * 0.82, top + 3, 'Q', bend, top + r * 0.32, bend + r * 0.82, top + 3])
      }, sway);
      make('ellipse', {
        class: 'vv-cap-shine',
        cx: round(bend - r * 0.35), cy: round(top - r * 0.42),
        rx: round(r * 0.28), ry: round(r * 0.12),
        transform: 'rotate(-18 ' + round(bend - r * 0.35) + ' ' + round(top - r * 0.42) + ')'
      }, sway);

      make('ellipse', {
        class: 'vv-foot', style: '--i: ' + i,
        cx: x, cy: SOIL_Y - 1, rx: round(w * 2), ry: 3
      }, feet);
    });
  }

  function drawSubstrate() {
    const chips = document.getElementById('jar-chips');
    if (!chips) return;
    for (let i = 0; i < 56; i++) {
      const cx = round(between(JAR_LEFT + 4, JAR_RIGHT - 4));
      const cy = round(between(286, 340));
      const rx = between(1.2, 3.6);
      make('ellipse', {
        class: random() < 0.55 ? 'vv-chip' : 'vv-chip vv-chip--dark',
        cx: cx, cy: cy, rx: round(rx), ry: round(rx * between(0.4, 0.8)),
        transform: 'rotate(' + Math.round(between(-40, 40)) + ' ' + cx + ' ' + cy + ')'
      }, chips);
    }

    const mycelium = document.getElementById('jar-mycelium');
    if (!mycelium) return;
    for (let i = 0; i < 20; i++) {
      let x = between(JAR_LEFT + 6, JAR_RIGHT - 6);
      let y = between(280, 286);
      const parts = ['M', x, y];
      for (let step = 0; step < 5; step++) {
        const nx = Math.max(JAR_LEFT, Math.min(JAR_RIGHT, x + between(-14, 14)));
        const ny = Math.min(342, y + between(4, 12));
        parts.push('Q', x + between(-8, 8), (y + ny) / 2, nx, ny);
        x = nx;
        y = ny;
      }
      make('path', { class: 'vv-hypha', d: path(parts), pathLength: 1, style: '--i: ' + i }, mycelium);
    }
  }

  function drawDrops() {
    const group = document.getElementById('jar-drops');
    if (!group) return;
    const count = 30;
    for (let i = 0; i < count; i++) {
      const band = random();
      const x = band < 0.38 ? between(120, 138) : band < 0.76 ? between(382, 400) : between(150, 370);
      const y = band < 0.76 ? between(140, 270) : between(140, 220);
      const r = between(1.2, 3.4);
      const drop = make('g', { class: 'vv-drop', style: '--t: ' + ((i + random()) / count).toFixed(3) }, group);

      if (r > 2.6 && random() < 0.55) {
        make('path', {
          class: 'vv-drop__trail',
          'stroke-width': round(r * 0.55),
          d: path(['M', x, y + r, 'Q', x + 0.8, y + r + 6, x, y + r + between(6, 16)])
        }, drop);
      }
      make('ellipse', { class: 'vv-drop__bead', cx: round(x), cy: round(y), rx: round(r), ry: round(r * 1.18) }, drop);
      make('circle', { class: 'vv-drop__light', cx: round(x - r * 0.35), cy: round(y - r * 0.4), r: round(r * 0.3) }, drop);
    }
  }

  function drawParticles() {
    const group = document.getElementById('jar-particles');
    if (!group) return;
    const count = 22;
    for (let i = 0; i < count; i++) {
      const mote = make('g', { class: 'vv-mote', style: '--t: ' + ((i + random()) / count).toFixed(3) }, group);
      make('circle', {
        class: 'vv-mote__dot',
        cx: round(between(130, 390)), cy: round(between(150, 270)), r: round(between(0.8, 1.9)),
        style: '--d: ' + between(7, 13).toFixed(1) + 's; --dd: -' + between(0, 13).toFixed(1) + 's; --x: ' + Math.round(between(-14, 14)) + 'px'
      }, mote);
    }
  }

  drawParticles();
  drawMushrooms();
  drawSubstrate();
  drawDrops();

  const DECIMALS = { 'r-temp': 1, 'r-hum': 0, 'r-eco2': 0, 'r-lux': 0, 'r-moisture': 0 };
  const STATE_TEXT = { ok: 'nella fascia', low: 'sotto la fascia', high: 'sopra la fascia' };
  const readings = {};

  function position(reading, value) {
    const p = reading.log
      ? (Math.log10(Math.max(value, reading.min)) - Math.log10(reading.min)) / (Math.log10(reading.max) - Math.log10(reading.min))
      : (value - reading.min) / (reading.max - reading.min);
    return Math.max(0, Math.min(1, p));
  }

  Array.prototype.forEach.call(document.querySelectorAll('.vv-reading'), function (node) {
    const reading = {
      node: node,
      min: Number(node.dataset.min),
      max: Number(node.dataset.max),
      low: Number(node.dataset.low),
      high: Number(node.dataset.high),
      log: node.dataset.scale === 'log',
      value: null,
      history: [],
      number: node.querySelector('.vv-reading__number'),
      state: node.querySelector('.vv-reading__state'),
      line: node.querySelector('.vv-reading__spark polyline'),
      needle: node.querySelector('.vv-scale__needle')
    };
    const ideal = node.querySelector('.vv-scale__ideal');
    if (ideal) {
      ideal.style.setProperty('--from', (position(reading, reading.low) * 100).toFixed(2) + '%');
      ideal.style.setProperty('--to', (position(reading, reading.high) * 100).toFixed(2) + '%');
    }
    readings[node.id] = reading;
  });

  function valuesOf(data) {
    const air = data.air;
    return {
      'r-temp': air.climateOk ? air.tempC : null,
      'r-hum': air.climateOk ? air.humRh : null,
      'r-eco2': air.gasOk ? air.eco2 : null,
      'r-lux': data.light.ok ? data.light.lux : null,
      'r-moisture': data.substrate.percent
    };
  }

  function drawSpark(reading) {
    if (!reading.line) return;
    const history = reading.history;
    if (history.length < 2) {
      reading.line.setAttribute('points', '');
      return;
    }
    let low = Math.min.apply(null, history);
    let high = Math.max.apply(null, history);
    if (high - low < 1e-6) {
      low -= 1;
      high += 1;
    }
    const step = 100 / (HISTORY - 1);
    const start = 100 - (history.length - 1) * step;
    reading.line.setAttribute('points', history.map(function (value, i) {
      const y = 22 - ((value - low) / (high - low)) * 20;
      return (start + i * step).toFixed(2) + ',' + y.toFixed(2);
    }).join(' '));
  }

  function remember(id, value) {
    const reading = readings[id];
    if (!reading) return;
    reading.history.push(value);
    if (reading.history.length > HISTORY) reading.history.shift();
  }

  function setReading(id, value) {
    const reading = readings[id];
    if (!reading) return null;
    const decimals = DECIMALS[id];
    reading.node.classList.remove('vv-reading--ok', 'vv-reading--low', 'vv-reading--high');

    if (value === null || value === undefined || isNaN(value)) {
      reading.value = null;
      reading.number.textContent = '—';
      reading.state.textContent = 'non disponibile';
      reading.node.classList.remove('vv-reading--live');
      return null;
    }

    const rounded = Number(value.toFixed(decimals));
    if (reading.value === null) {
      reading.number.textContent = VVData.formatNumber(rounded, decimals);
    } else if (reading.value !== rounded) {
      VVData.animateNumber(reading.number, reading.value, rounded, decimals);
    }
    reading.value = rounded;

    const state = rounded < reading.low ? 'low' : rounded > reading.high ? 'high' : 'ok';
    reading.node.classList.add('vv-reading--live', 'vv-reading--' + state);
    reading.state.textContent = STATE_TEXT[state];
    if (reading.needle) {
      reading.needle.style.setProperty('--pos', (position(reading, rounded) * 100).toFixed(2) + '%');
    }

    remember(id, rounded);
    drawSpark(reading);
    return state;
  }

  if (typeof VVData !== 'undefined' && VVData.source === 'demo') {
    for (let k = HISTORY - 1; k >= 1; k--) {
      const values = valuesOf(VVData.demo(Date.now() - k * VVData.REFRESH_MS));
      Object.keys(values).forEach(function (id) {
        if (values[id] !== null && values[id] !== undefined) {
          remember(id, Number(values[id].toFixed(DECIMALS[id])));
        }
      });
    }
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function updateArt(data, values) {
    const style = art.style;
    if (values['r-hum'] !== null) {
      style.setProperty('--humidity', clamp01((values['r-hum'] - 40) / 60).toFixed(3));
    }
    if (values['r-lux'] !== null) {
      style.setProperty('--light', clamp01(Math.log10(values['r-lux'] + 1) / Math.log10(2001)).toFixed(3));
    }
    if (data.air.gasOk) {
      const air = Math.max(clamp01((data.air.eco2 - 400) / 1600), clamp01(data.air.tvoc / 800));
      style.setProperty('--air', air.toFixed(3));
    }
    if (values['r-temp'] !== null) {
      const warmth = clamp01((values['r-temp'] - 10) / 25);
      style.setProperty('--glow', 'hsl(' + Math.round(210 - warmth * 180) + ' 48% 80%)');
    }
    const wet = clamp01(data.substrate.percent / 100);
    style.setProperty('--soil', 'hsl(' + Math.round(34 - wet * 10) + ' ' + Math.round(28 + wet * 14) + '% ' + Math.round(66 - wet * 42) + '%)');

    art.classList.remove('is-reading');
    void art.getBoundingClientRect();
    art.classList.add('is-reading');
  }

  /** Esposto per il kit: aggiorna solo le variabili CSS dell'illustrazione. */
  window.VVArt = {
    set: function (opts) {
      const style = art.style;
      if (opts.humidity !== undefined) style.setProperty('--humidity', clamp01(opts.humidity).toFixed(3));
      if (opts.light !== undefined) style.setProperty('--light', clamp01(opts.light).toFixed(3));
      if (opts.air !== undefined) style.setProperty('--air', clamp01(opts.air).toFixed(3));
      if (opts.temp !== undefined) {
        const warmth = clamp01((opts.temp - 10) / 25);
        style.setProperty('--glow', 'hsl(' + Math.round(210 - warmth * 180) + ' 48% 80%)');
      }
      if (opts.moisture !== undefined) {
        const wet = clamp01(opts.moisture / 100);
        style.setProperty('--soil', 'hsl(' + Math.round(34 - wet * 10) + ' ' + Math.round(28 + wet * 14) + '% ' + Math.round(66 - wet * 42) + '%)');
      }
    }
  };

  const ADVICE = {
    'r-hum': {
      name: 'umidità dell\'aria',
      low: ['L\'aria è troppo secca.', 'Nebulizza un po\' d\'acqua sulle pareti del barattolo.'],
      high: ['L\'aria è satura.', 'Socchiudi il coperchio qualche minuto: troppa condensa rovina i cappelli.']
    },
    'r-temp': {
      name: 'temperatura',
      low: ['Fa troppo freddo.', 'Sposta il barattolo in un punto più caldo, lontano da finestre e spifferi.'],
      high: ['Fa troppo caldo.', 'Allontanalo da termosifoni e sole diretto.']
    },
    'r-eco2': {
      name: 'CO₂',
      high: ['Serve aria fresca.', 'Apri il coperchio qualche minuto: il micelio respira e accumula CO₂.']
    },
    'r-moisture': {
      name: 'umidità del substrato',
      low: ['Il substrato è asciutto.', 'Bagnalo con poca acqua, senza lasciare ristagni sul fondo.'],
      high: ['Il substrato è zuppo.', 'Togli l\'acqua in eccesso e lascialo respirare.']
    },
    'r-lux': {
      name: 'luce',
      low: ['Serve un po\' di luce.', 'Basta luce indiretta: i funghi la usano per orientarsi e formare i cappelli.'],
      high: ['Troppa luce diretta.', 'Spostalo dal sole: scalda e asciuga il barattolo.']
    }
  };
  const PRIORITY = ['r-hum', 'r-temp', 'r-eco2', 'r-moisture', 'r-lux'];

  function setVerdict(title, detail) {
    const titleNode = document.getElementById('verdict');
    const detailNode = document.getElementById('verdict-detail');
    if (!titleNode || !detailNode) return;
    if (titleNode.textContent === title && detailNode.textContent === detail) return;

    if (titleNode.textContent === title) {
      detailNode.textContent = detail;
      return;
    }
    titleNode.classList.add('is-changing');
    detailNode.classList.add('is-changing');
    setTimeout(function () {
      titleNode.textContent = title;
      detailNode.textContent = detail;
      titleNode.classList.remove('is-changing');
      detailNode.classList.remove('is-changing');
    }, 350);
  }

  function updateVerdict(states, data) {
    const known = PRIORITY.filter(function (id) { return states[id]; });
    const issues = known.filter(function (id) { return states[id] !== 'ok'; });
    let title;
    let detail;

    if (!known.length) {
      title = 'Il barattolo tace.';
      detail = 'Nessun sensore ha dato una lettura: controlla i collegamenti.';
    } else if (!issues.length) {
      title = 'Il barattolo sta bene.';
      detail = 'Aria, luce e substrato sono nella fascia ideale per il pioppino.';
    } else {
      const advice = ADVICE[issues[0]][states[issues[0]]];
      title = advice[0];
      detail = advice[1];
      if (issues.length > 1) {
        detail += ' Da controllare anche: ' + issues.slice(1).map(function (id) { return ADVICE[id].name; }).join(', ') + '.';
      }
    }

    if (data.air.gasOk && data.air.validity !== 0) {
      detail += ' Sensore dei gas: ' + data.air.validityText + '.';
    }
    setVerdict(title, detail);
  }

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  function renderNotes(data) {
    const air = data.air;
    setText('air-aside', air.gasOk
      ? 'Composti volatili ' + VVData.formatNumber(air.tvoc, 0) + ' ppb. Indice di qualità dell\'aria ' + air.aqi + ' su 5: ' + air.aqiText + '.'
      : 'Il sensore dei gas non risponde: CO₂, composti volatili e qualità dell\'aria non sono disponibili.');

    const s = data.substrate;
    setText('substrate-aside', 'Valore grezzo ' + s.raw + ' su 4095, tarato tra ' + s.dry + ' (secco) e ' + s.wet + ' (bagnato).');
  }

  function renderLabel(data) {
    setText('info-network', data.wifi.name);
    setText('info-ip', data.wifi.ip);
    setText('info-clients', String(data.wifi.clients));
    setText('info-uptime', VVData.uptimeText(data.uptime));
  }

  function setOnline(online) {
    const status = document.getElementById('status');
    if (status) {
      status.classList.toggle('vv-status--ok', online);
      status.classList.toggle('vv-status--warn', !online);
    }
    page.classList.toggle('vv-dash--stale', !online);

    if (online) {
      setText('status-text', VVData.source === 'demo' ? 'Anteprima' : 'Connesso');
      setText('updated', 'Aggiornato alle ' + new Date().toLocaleTimeString('it-IT'));
    } else {
      setText('status-text', 'Non raggiungibile');
      setVerdict('Il barattolo non risponde.', 'Controlla che la scheda sia accesa e di essere collegato alla rete VasoVivo.');
    }
  }

  function render(data) {
    page.classList.remove('vv-dash--loading');
    const values = valuesOf(data);
    const states = {};
    Object.keys(values).forEach(function (id) {
      states[id] = setReading(id, values[id]);
    });
    updateArt(data, values);
    updateVerdict(states, data);
    renderNotes(data);
    renderLabel(data);
    setOnline(true);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.vv-copy [data-marker]'), function (section) {
    const marker = art.querySelector('.vv-marker[data-marker="' + section.dataset.marker + '"]');
    if (!marker) return;
    section.addEventListener('mouseenter', function () { marker.classList.add('is-active'); });
    section.addEventListener('mouseleave', function () { marker.classList.remove('is-active'); });
  });

  setText('footer-source', typeof VVData !== 'undefined' && VVData.source === 'demo'
    ? 'Dati simulati: anteprima della dashboard'
    : 'Dati letti in tempo reale dall\'ESP32');

  if (typeof VVData !== 'undefined' && !page.dataset.manual) {
    VVData.watch(render, function () {
      setOnline(false);
    });
  }
})();
