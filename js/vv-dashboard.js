/**
 * VasoVivo — dashboard in tempo reale, vista a schede
 *
 * Aggiorna la pagina a ogni lettura di VVData (vv-data.js).
 */

(function () {
  const source = VVData.source;
  const formatNumber = VVData.formatNumber;
  const animateNumber = VVData.animateNumber;

  // ── Aggiornamento di una metrica ─────────────────────────────────

  /**
   * id       id dell'elemento .vv-metric
   * value    numero, oppure null se non disponibile
   * options  decimals, hint, fill (0-100), warn (true/false)
   */
  function setMetric(id, value, options) {
    const metric = document.getElementById(id);
    if (!metric) return;
    options = options || {};

    const number = metric.querySelector('.vv-metric__number');
    const hint = metric.querySelector('.vv-metric__hint');
    const fill = metric.querySelector('.vv-metric__bar-fill');
    const decimals = options.decimals || 0;

    metric.classList.remove('vv-metric--loading');

    if (value === null || value === undefined) {
      metric.classList.add('vv-metric--na');
      metric.classList.remove('vv-metric--highlight');
      number.textContent = '—';
      if (hint) hint.textContent = options.hint || 'non disponibile';
      if (fill) fill.style.setProperty('--fill', '0%');
      metric.dataset.value = '';
      return;
    }

    metric.classList.remove('vv-metric--na');
    metric.classList.toggle('vv-metric--highlight', Boolean(options.warn));

    const previous = metric.dataset.value === '' || metric.dataset.value === undefined
      ? null
      : Number(metric.dataset.value);
    const rounded = Number(value.toFixed(decimals));

    if (previous === null) {
      number.textContent = formatNumber(rounded, decimals);
    } else if (previous !== rounded) {
      animateNumber(number, previous, rounded, decimals);
      metric.classList.remove('vv-metric--updated');
      void metric.offsetWidth;
      metric.classList.add('vv-metric--updated');
    }
    metric.dataset.value = String(rounded);

    if (hint && options.hint !== undefined) hint.textContent = options.hint;
    if (fill && options.fill !== undefined) {
      const percent = Math.max(0, Math.min(100, options.fill));
      fill.style.setProperty('--fill', percent + '%');
    }
  }

  // ── Pagina ───────────────────────────────────────────────────────

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  function substrateHint(percent) {
    if (percent < 30) return 'troppo secco';
    if (percent > 85) return 'troppo umido';
    return 'nella norma';
  }

  function luxFill(lux) {
    return (Math.log10(lux + 1) / Math.log10(10001)) * 100;
  }

  function renderSensors(data) {
    const list = document.getElementById('sensor-list');
    if (!list) return;
    const sensors = [
      ['AHT21', data.air.aht21],
      ['ENS160', data.air.ens160],
      ['BH1750', data.light.bh1750],
      ['Umidità substrato · GPIO ' + data.substrate.pin, true]
    ];
    list.innerHTML = '';
    sensors.forEach(function (sensor) {
      const badge = document.createElement('span');
      badge.className = 'vv-status ' + (sensor[1] ? 'vv-status--ok' : 'vv-status--warn');
      badge.textContent = (sensor[1] ? '✓ ' : '✕ ') + sensor[0];
      list.appendChild(badge);
    });
  }

  function render(data) {
    const air = data.air;
    const gasHint = air.gasOk && air.validity !== 0 ? air.validityText : 'ENS160';

    setMetric('m-temp', air.climateOk ? air.tempC : null, { decimals: 1, hint: 'AHT21' });
    setMetric('m-hum', air.climateOk ? air.humRh : null, { decimals: 1, hint: 'AHT21', fill: air.humRh });
    setMetric('m-eco2', air.gasOk ? air.eco2 : null, { hint: gasHint });
    setMetric('m-tvoc', air.gasOk ? air.tvoc : null, { hint: gasHint });
    setMetric('m-aqi', air.gasOk ? air.aqi : null, {
      hint: air.gasOk ? air.aqiText : undefined,
      fill: air.aqi * 20,
      warn: air.aqi >= 4
    });

    setMetric('m-lux', data.light.ok ? data.light.lux : null, {
      hint: 'BH1750',
      fill: data.light.ok ? luxFill(data.light.lux) : 0
    });

    const substrate = data.substrate;
    const dryOrWet = substrate.percent < 30 || substrate.percent > 85;
    setMetric('m-moisture', substrate.percent, {
      hint: substrateHint(substrate.percent),
      fill: substrate.percent,
      warn: dryOrWet
    });
    setMetric('m-adc', substrate.raw, {
      hint: 'secco ' + substrate.dry + ' · bagnato ' + substrate.wet,
      fill: (substrate.raw / 4095) * 100
    });

    renderSensors(data);
    setText('info-network', data.wifi.name);
    setText('info-ip', data.wifi.ip);
    setText('info-clients', String(data.wifi.clients));
    setText('info-uptime', VVData.uptimeText(data.uptime));
  }

  function setOnline(online) {
    const status = document.getElementById('status');
    const dashboard = document.getElementById('dashboard');
    status.classList.toggle('vv-status--ok', online);
    status.classList.toggle('vv-status--warn', !online);
    dashboard.classList.toggle('vv-dashboard--stale', !online);

    if (online) {
      setText('status-text', source === 'demo' ? 'Anteprima' : 'Connesso');
      setText('updated', 'Aggiornato alle ' + new Date().toLocaleTimeString('it-IT'));
    } else {
      setText('status-text', 'Non raggiungibile');
    }
  }

  setText('footer-source', source === 'demo'
    ? 'Dati simulati: anteprima della dashboard'
    : 'Dati letti in tempo reale dall\'ESP32');

  VVData.watch(
    function (data) {
      render(data);
      setOnline(true);
    },
    function () {
      setOnline(false);
    }
  );
})();
