/**
 * VasoVivo — letture per le pagine della dashboard
 *
 * La sorgente è nell'attributo data-source del <body>:
 *   "/api/readings"  → dati veri dall'ESP32
 *   "demo"           → dati simulati, per l'anteprima sul sito
 *
 * Espone window.VVData, usato da vv-dashboard.js e vv-jar.js.
 */

window.VVData = (function () {
  const REFRESH_MS = 5000;
  const source = document.body.dataset.source || 'demo';
  const demoStart = Date.now();

  function demo(at) {
    const t = ((at || Date.now()) - demoStart) / 1000;
    const wave = function (base, amplitude, period) {
      return base + amplitude * Math.sin((t / period) * 2 * Math.PI) + (Math.random() - 0.5) * amplitude * 0.3;
    };
    const aqi = Math.round(wave(2, 0.8, 90));
    const raw = Math.round(wave(1750, 120, 140));
    return {
      uptime: Math.max(0, Math.round(t) + 754),
      air: {
        aht21: true, ens160: true,
        climateOk: true, tempC: wave(22.4, 0.6, 60), humRh: wave(86, 3, 75),
        gasOk: true, eco2: Math.round(wave(840, 90, 50)), tvoc: Math.round(wave(120, 25, 45)),
        aqi: aqi, aqiText: ['ottima', 'ottima', 'buona', 'discreta', 'scarsa', 'pessima'][aqi],
        validity: 0, validityText: 'valori affidabili'
      },
      light: { bh1750: true, ok: true, lux: wave(320, 60, 80) },
      substrate: { raw: raw, percent: Math.round(((2800 - raw) / (2800 - 900)) * 100), dry: 2800, wet: 900, pin: 34 },
      wifi: { name: 'VasoVivo', ip: '192.168.4.1', clients: 1 }
    };
  }

  function load() {
    if (source === 'demo') {
      return Promise.resolve(demo());
    }
    return fetch(source, { cache: 'no-store' }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    });
  }

  /** Chiama onData a ogni lettura riuscita, onError quando la scheda non risponde. */
  function watch(onData, onError) {
    function tick() {
      load().then(onData).catch(onError);
    }
    tick();
    setInterval(tick, REFRESH_MS);
  }

  function locale() {
    return (typeof VVSettings !== 'undefined' && VVSettings.locale)
      ? VVSettings.locale()
      : 'it-IT';
  }

  function formatNumber(value, decimals) {
    return value.toLocaleString(locale(), {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function animateNumber(element, from, to, decimals) {
    const duration = 600;
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatNumber(from + (to - from) * eased, decimals);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function uptimeText(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(function (n) { return String(n).padStart(2, '0'); }).join(':');
  }

  return {
    REFRESH_MS: REFRESH_MS,
    source: source,
    demo: demo,
    load: load,
    watch: watch,
    formatNumber: formatNumber,
    animateNumber: animateNumber,
    uptimeText: uptimeText
  };
})();
