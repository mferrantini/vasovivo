/**
 * VasoVivo — impostazioni (lingua, specie, soglie)
 * Salvate in localStorage. Espone window.VVSettings.
 */
window.VVSettings = (function () {
  const STORAGE_KEY = 'vasovivo.settings';

  const DEFAULTS = {
    lang: 'it',
    species: 'Pioppino',
    ranges: {
      temp: { low: 16, high: 24 },
      hum: { low: 85, high: 95 },
      eco2: { low: 0, high: 1000 },
      lux: { low: 200, high: 1000 },
      moisture: { low: 40, high: 80 }
    }
  };

  const RANGE_IDS = {
    'r-temp': 'temp',
    'r-hum': 'hum',
    'r-eco2': 'eco2',
    'r-lux': 'lux',
    'r-moisture': 'moisture'
  };

  const RANGE_UNITS = {
    temp: '°C',
    hum: '%',
    eco2: 'ppm',
    lux: 'lux',
    moisture: '%'
  };

  const I18N = {
    it: {
      'settings.open': 'Impostazioni',
      'settings.title': 'Impostazioni',
      'settings.species': 'Specie coltivata',
      'settings.ranges': 'Finestre consigliate',
      'settings.range.temp': 'Temperatura aria',
      'settings.range.hum': 'Umidità aria',
      'settings.range.eco2': 'CO₂ equivalente',
      'settings.range.lux': 'Luce',
      'settings.range.moisture': 'Umidità substrato',
      'settings.min': 'Min',
      'settings.max': 'Max',
      'settings.save': 'Salva',
      'settings.reset': 'Ripristina predefiniti',
      'settings.close': 'Chiudi',
      'lang.switch': 'Lingua',
      'lang.it': 'Italiano',
      'lang.en': 'English',

      'nav.home': 'Home',
      'nav.github': 'GitHub',
      'nav.settings': 'Impostazioni',
      'footer.open': 'Progetto open source',
      'footer.github': 'Vedi su GitHub',
      'footer.instagram': 'Instagram',
      'footer.linkedin': 'LinkedIn',
      'footer.mf': 'Maker Faire Roma 2026 - Stand V13',
      'back.home': '← Torna alla home',
      'link.amazon': 'Acquista su Amazon →',
      'link.docs': 'Documentazione su GitHub →',

      'home.title': 'VasoVivo',
      'home.hero': 'Il barattolo che ascolta',
      'home.lede': 'Monitoraggio intelligente per la coltivazione di funghi in barattolo, con ESP32 e sensori ambientali.',
      'home.badge': 'Maker Faire Roma 2026 - Stand V13',
      'home.s1': 'Il progetto',
      'home.s1.p1': 'VasoVivo è un sistema di monitoraggio attivo per la coltivazione di funghi in piccolo contenitore: un barattolo che ospita una zolletta di substrato, chiuso da un coperchio intelligente su cui è integrata una sensoristica completa.',
      'home.s1.p2': 'I sensori, collegati a una scheda ESP32, misurano in tempo reale i parametri ambientali rilevanti per la crescita. I dati sono accessibili in diversi modi — tramite Bluetooth, Wi-Fi o un bot Telegram — a seconda di come si sceglie di configurare la scheda.',
      'home.param.temp': 'Temperatura',
      'home.param.temp.v': 'aria & substrato',
      'home.param.hum': 'Umidità',
      'home.param.hum.v': 'aria & substrato',
      'home.param.co2': 'CO₂ / VOC',
      'home.param.co2.v': 'qualità dell\'aria',
      'home.param.light': 'Luminosità',
      'home.param.light.v': 'luce ambientale',
      'home.s1.p3': 'Il contenitore di riferimento è il barattolo IKEA EKLATANT — una scelta in pieno spirito IKEA hack. I componenti stampati in 3D si adattano a diversi modelli del catalogo IKEA. Tutta l\'elettronica è composta da componenti economici e facilmente reperibili online.',
      'home.s1.p4': 'Codice, istruzioni e schema elettrico sono disponibili pubblicamente su GitHub.',
      'home.s2': 'Hardware',
      'home.s2.p': 'Per replicare VasoVivo servono una scheda ESP32 e i sensori per monitorare aria, substrato e luminosità. Nella repository trovi documentazione e sketch di esempio; nella pagina dedicata puoi anche trovare i link per l\'acquisto.',
      'home.s2.link': 'Vedi l\'elenco hardware →',
      'home.s3': 'Esempi completi',
      'home.s3.p': 'Sketch pronti da caricare, che mettono insieme più sensori e un modo per leggere i dati. Tre esempi Wi-Fi mostrano temperatura, umidità, CO₂, luce e umidità del substrato, aggiornate ogni 5 secondi: una pagina essenziale, una dashboard a schede e una tavola illustrata del barattolo.',
      'home.s3.link': 'Vedi gli esempi su GitHub →',
      'home.s4': 'Le dashboard',
      'home.s4.p': 'I dati si leggono dal browser, senza installare nulla: la scheda crea la sua rete Wi-Fi e serve la pagina. Entrambe le interfacce condividono un unico UI Kit.',
      'home.s4.c1.t': 'Tavola illustrata',
      'home.s4.c1.s': 'Il barattolo che reagisce ai dati',
      'home.s4.c1.p': 'Il disegno del barattolo EKLATANT cambia con le letture.',
      'home.s4.c1.link': 'Anteprima →',
      'home.s4.c2.t': 'Dashboard a schede',
      'home.s4.c2.s': 'Essenziale e leggibile',
      'home.s4.c2.p': 'Ogni misura in una scheda, con stato e fascia ideale.',
      'home.s4.c2.link': 'Anteprima →',
      'home.s4.gloss': 'Glossario dei componenti:',
      'home.s5': 'Stampa 3D',
      'home.s5.p': 'I coperchi intelligenti sono progettati per essere stampati in 3D. Nella repository trovi i modelli per barattolo, con note di compatibilità e istruzioni di stampa.',
      'home.s5.link': 'Vedi i file da stampare →',
      'home.s6': 'Varietà per il barattolo',
      'home.s6.p': 'Il formato barattolo funziona meglio con specie a corpi fruttiferi contenuti. Per ora la guida documenta il pioppino, scelta di riferimento; presto aggiungeremo altre varietà comuni in Italia, con le finestre ambientali consigliate.',
      'home.s6.link': 'Vedi le varietà →',
      'var.title': 'Varietà — VasoVivo',
      'var.eyebrow': 'Guida',
      'var.h1': 'Varietà per il barattolo',
      'var.lede': 'Specie con corpi fruttiferi contenuti, adatte alla coltivazione in barattolo o in zolletta. Per ora documentiamo il pioppino, scelta di riferimento del progetto; presto aggiungeremo altre varietà comuni in Italia.',
      'var.badge.ideal': 'Ideale per il barattolo',
      'var.r.temp': 'Temperatura',
      'var.r.hum': 'Umidità aria',
      'var.r.eco2': 'CO₂',
      'var.r.lux': 'Luce',
      'var.r.moist': 'Umidità substrato',
      'var.pioppino.p': 'Fungo tipico della tradizione italiana, dal sapore deciso. Cresce naturalmente alla base dei pioppi; le dimensioni contenute lo rendono la scelta di riferimento per VasoVivo.',
      'var.pioppino.eco2': 'sotto 1000 ppm',
      'var.note': 'Le finestre sono indicative e dipendono da ceppo, substrato e fase di crescita. Nelle impostazioni della dashboard puoi cambiare nome della specie e soglie consigliate. Presto aggiungeremo altre varietà coltivabili in barattolo.',
      'home.s7': 'Cosa trovi allo stand',
      'home.s7.p1': 'Allo stand puoi vedere VasoVivo in funzione: più contenitori con coltivazioni attive, i funghi in crescita e tutti i sensori al lavoro. Un display mostra i dati ambientali in tempo reale di ciascun contenitore.',
      'home.s7.p2': 'Trovi anche la documentazione del progetto e un QR code che rimanda alla repository GitHub con tutti i file per replicarlo.',

      'hw.title': 'Hardware — VasoVivo',
      'hw.eyebrow': 'Guida',
      'hw.h1': 'Hardware',
      'hw.lede': 'Elenco della scheda e dei sensori utilizzabili in VasoVivo. Per ogni sensore trovi nella repository documentazione, schema di collegamento e uno sketch di esempio per ESP32.',
      'hw.bb.meta': 'Prototipazione · collegamenti',
      'hw.bb.p': 'Base per montare e collegare scheda e sensori in fase di prototipo, senza saldature.',
      'hw.esp.meta': 'Microcontrollore · Wi-Fi · Bluetooth',
      'hw.esp.p': 'Scheda principale del progetto: collega i sensori e gestisce lettura e invio dei dati.',
      'hw.ens.meta': 'CO₂eq · TVOC · temperatura · umidità aria',
      'hw.ens.p': 'Modulo combinato per monitorare qualità dell\'aria e condizioni ambientali nel barattolo.',
      'hw.dht22.meta': 'Temperatura · umidità aria',
      'hw.dht22.p': 'Alternativa consigliata per misurare temperatura e umidità dell\'aria con maggiore precisione.',
      'hw.dht11.meta': 'Temperatura · umidità aria',
      'hw.dht11.p': 'Alternativa economica per temperatura e umidità dell\'aria, adatta a un primo approccio al progetto.',
      'hw.cap.meta': 'Umidità substrato',
      'hw.cap.p': 'Lama PCB capacitiva resistente alla corrosione: misura l\'umidità della zolletta senza elettrodi esposti.',
      'hw.ds.meta': 'Temperatura substrato',
      'hw.ds.p': 'Sonda impermeabile per la temperatura interna al substrato, complementare alla temperatura dell\'aria.',
      'hw.ldr.meta': 'Luminosità',
      'hw.ldr.p': 'Rileva la luce ambientale per verificare l\'esposizione e correlarla con l\'andamento della coltivazione.',
      'hw.bh.meta': 'Intensità luminosa · lux',
      'hw.bh.p': 'Modulo I²C per la luce ambientale, in lux. Misura diretta dell\'intensità, a differenza della fotoresistenza.',

      'pr.title': 'Stampa 3D — VasoVivo',
      'pr.eyebrow': 'Guida',
      'pr.h1': 'Stampa 3D',
      'pr.lede': 'Modelli STL per i coperchi intelligenti di VasoVivo. Per ogni barattolo trovi nella repository documentazione e note di stampa; i file verranno aggiunti nelle rispettive cartelle.',
      'pr.gen.meta': 'Adattabile · multi-barattolo',
      'pr.gen.p': 'Coperchio universale per barattoli con bocca circolare compatibile, utile per sperimentare con contenitori diversi.',
      'pr.ek.meta': 'IKEA EKLATANT · 4.2 l',
      'pr.ek.p': 'Coperchio su misura per il barattolo IKEA EKLATANT da 4.2 l, contenitore di riferimento del progetto.',

      'dash.connecting': 'Connessione…',
      'dash.waiting': 'In attesa dei dati',
      'dash.preview': 'Anteprima',
      'dash.online': 'Connesso',
      'dash.offline': 'Non raggiungibile',
      'dash.updated': 'Aggiornato alle {time}',
      'dash.footer.demo': 'Dati simulati: anteprima della dashboard',
      'dash.footer.live': 'Dati letti in tempo reale dall\'ESP32',
      'dash.kicker': 'Barattolo n. 1 · {species}',
      'dash.meta': 'IKEA EKLATANT · 4.2 l · {species}',
      'dash.cards.title': 'Barattolo #1',
      'dash.cards.eyebrow': 'Dashboard a schede',
      'dash.group.air': 'Aria nel barattolo',
      'dash.group.light': 'Luce',
      'dash.group.substrate': 'Substrato',
      'dash.group.sensors': 'Sensori e scheda',
      'dash.m.temp': 'Temperatura',
      'dash.m.hum': 'Umidità aria',
      'dash.m.eco2': 'CO₂ equivalente',
      'dash.m.tvoc': 'Composti volatili',
      'dash.m.aqi': 'Qualità dell\'aria',
      'dash.m.lux': 'Intensità luminosa',
      'dash.m.moisture': 'Umidità substrato',
      'dash.m.adc': 'Valore ADC grezzo',
      'dash.hint.cap': 'sensore capacitivo',
      'dash.hint.cal': 'calibrazione',
      'dash.dt.wifi': 'Rete Wi-Fi',
      'dash.dt.ip': 'Indirizzo',
      'dash.dt.clients': 'Dispositivi collegati',
      'dash.dt.uptime': 'Accesa da',
      'dash.back.jar': 'Tavola illustrata →',
      'dash.back.ui': 'Componenti UI →',
      'dash.back.site': '← Torna al sito',
      'dash.clients': '{n} dispositivi',
      'dash.uptime': 'accesa da {t}',

      'jar.ch.air': 'Aria',
      'jar.ch.light': 'Luce',
      'jar.ch.substrate': 'Substrato',
      'jar.label.temp': 'Temperatura',
      'jar.label.hum': 'Umidità',
      'jar.label.eco2': 'CO₂ equivalente',
      'jar.label.lux': 'Intensità',
      'jar.label.moisture': 'Umidità',
      'jar.state.ok': 'nella fascia',
      'jar.state.low': 'sotto la fascia',
      'jar.state.high': 'sopra la fascia',
      'jar.state.na': 'non disponibile',
      'jar.range': 'ideale {low}–{high} {unit}',
      'jar.range.under': 'ideale sotto {high} {unit}',
      'jar.range.lux': 'ideale {low}–{high} lux, luce indiretta',
      'jar.verdict.listen': 'Ascolto il barattolo…',
      'jar.verdict.listen.d': 'Le prime letture arrivano in pochi secondi.',
      'jar.verdict.silent': 'Il barattolo tace.',
      'jar.verdict.silent.d': 'Nessun sensore ha dato una lettura: controlla i collegamenti.',
      'jar.verdict.ok': 'Il barattolo sta bene.',
      'jar.verdict.ok.d': 'Aria, luce e substrato sono nella fascia ideale per {species}.',
      'jar.verdict.offline': 'Il barattolo non risponde.',
      'jar.verdict.offline.d': 'Controlla che la scheda sia accesa e di essere collegato alla rete VasoVivo.',
      'jar.also': ' Da controllare anche: {list}.',
      'jar.gas': ' Sensore dei gas: {text}.',
      'jar.aside.air.ok': 'Composti volatili {tvoc} ppb. Indice di qualità dell\'aria {aqi} su 5: {aqiText}.',
      'jar.aside.air.off': 'Il sensore dei gas non risponde: CO₂, composti volatili e qualità dell\'aria non sono disponibili.',
      'jar.aside.sub': 'Valore grezzo {raw} su 4095, tarato tra {dry} (secco) e {wet} (bagnato).',
      'jar.aside.air.wait': 'Composti volatili e qualità dell\'aria in arrivo.',
      'jar.aside.sub.wait': 'Valore grezzo del sensore in arrivo.',

      'advice.hum.name': 'umidità dell\'aria',
      'advice.hum.low.t': 'L\'aria è troppo secca.',
      'advice.hum.low.d': 'Nebulizza un po\' d\'acqua sulle pareti del barattolo.',
      'advice.hum.high.t': 'L\'aria è satura.',
      'advice.hum.high.d': 'Socchiudi il coperchio qualche minuto: troppa condensa rovina i cappelli.',
      'advice.temp.name': 'temperatura',
      'advice.temp.low.t': 'Fa troppo freddo.',
      'advice.temp.low.d': 'Sposta il barattolo in un punto più caldo, lontano da finestre e spifferi.',
      'advice.temp.high.t': 'Fa troppo caldo.',
      'advice.temp.high.d': 'Allontanalo da termosifoni e sole diretto.',
      'advice.eco2.name': 'CO₂',
      'advice.eco2.high.t': 'Serve aria fresca.',
      'advice.eco2.high.d': 'Apri il coperchio qualche minuto: il micelio respira e accumula CO₂.',
      'advice.moisture.name': 'umidità del substrato',
      'advice.moisture.low.t': 'Il substrato è asciutto.',
      'advice.moisture.low.d': 'Bagnalo con poca acqua, senza lasciare ristagni sul fondo.',
      'advice.moisture.high.t': 'Il substrato è zuppo.',
      'advice.moisture.high.d': 'Togli l\'acqua in eccesso e lascialo respirare.',
      'advice.lux.name': 'luce',
      'advice.lux.low.t': 'Serve un po\' di luce.',
      'advice.lux.low.d': 'Basta luce indiretta: i funghi la usano per orientarsi e formare i cappelli.',
      'advice.lux.high.t': 'Troppa luce diretta.',
      'advice.lux.high.d': 'Spostalo dal sole: scalda e asciuga il barattolo.',

      'aqi.1': 'ottima',
      'aqi.2': 'ottima',
      'aqi.3': 'buona',
      'aqi.4': 'discreta',
      'aqi.5': 'scarsa',
      'aqi.0': 'pessima',
      'validity.ok': 'valori affidabili',
      'sub.dry': 'troppo secco',
      'sub.wet': 'troppo umido',
      'sub.ok': 'nella norma',
      'sub.na': 'non disponibile',
      'metric.drywet': 'secco {dry} · bagnato {wet}'
    },
    en: {
      'settings.open': 'Settings',
      'settings.title': 'Settings',
      'settings.species': 'Cultivated species',
      'settings.ranges': 'Recommended ranges',
      'settings.range.temp': 'Air temperature',
      'settings.range.hum': 'Air humidity',
      'settings.range.eco2': 'Equivalent CO₂',
      'settings.range.lux': 'Light',
      'settings.range.moisture': 'Substrate moisture',
      'settings.min': 'Min',
      'settings.max': 'Max',
      'settings.save': 'Save',
      'settings.reset': 'Restore defaults',
      'settings.close': 'Close',
      'lang.switch': 'Language',
      'lang.it': 'Italiano',
      'lang.en': 'English',

      'nav.home': 'Home',
      'nav.github': 'GitHub',
      'nav.settings': 'Settings',
      'footer.open': 'Open-source project',
      'footer.github': 'View on GitHub',
      'footer.instagram': 'Instagram',
      'footer.linkedin': 'LinkedIn',
      'footer.mf': 'Maker Faire Rome 2026 - Stand V13',
      'back.home': '← Back to home',
      'link.amazon': 'Buy on Amazon →',
      'link.docs': 'Docs on GitHub →',

      'home.title': 'VasoVivo',
      'home.hero': 'The jar that listens',
      'home.lede': 'Smart monitoring for mushroom growing in a jar, with ESP32 and environmental sensors.',
      'home.badge': 'Maker Faire Rome 2026 - Stand V13',
      'home.s1': 'The project',
      'home.s1.p1': 'VasoVivo is an active monitoring system for growing mushrooms in a small container: a jar that holds a substrate block, closed by a smart lid with a full set of sensors.',
      'home.s1.p2': 'Sensors connected to an ESP32 board measure growth-related parameters in real time. Data can be read in different ways — over Bluetooth, Wi-Fi, or a Telegram bot — depending on how you configure the board.',
      'home.param.temp': 'Temperature',
      'home.param.temp.v': 'air & substrate',
      'home.param.hum': 'Humidity',
      'home.param.hum.v': 'air & substrate',
      'home.param.co2': 'CO₂ / VOC',
      'home.param.co2.v': 'air quality',
      'home.param.light': 'Light',
      'home.param.light.v': 'ambient light',
      'home.s1.p3': 'The reference container is the IKEA EKLATANT jar — a classic IKEA hack. 3D-printed parts fit several IKEA models. All electronics use affordable, easy-to-find parts.',
      'home.s1.p4': 'Code, instructions and wiring diagrams are publicly available on GitHub.',
      'home.s2': 'Hardware',
      'home.s2.p': 'To rebuild VasoVivo you need an ESP32 board and sensors for air, substrate and light. The repository has documentation and sample sketches; the dedicated page also has purchase links.',
      'home.s2.link': 'See the hardware list →',
      'home.s3': 'Complete examples',
      'home.s3.p': 'Ready-to-flash sketches that combine several sensors and a way to read the data. Three Wi-Fi examples show temperature, humidity, CO₂, light and substrate moisture, refreshed every 5 seconds: a minimal page, a card dashboard and an illustrated jar board.',
      'home.s3.link': 'See examples on GitHub →',
      'home.s4': 'Dashboards',
      'home.s4.p': 'You read the data in the browser, with nothing to install: the board creates its own Wi-Fi network and serves the page. Both interfaces share one UI kit.',
      'home.s4.c1.t': 'Illustrated board',
      'home.s4.c1.s': 'The jar that reacts to data',
      'home.s4.c1.p': 'The EKLATANT jar drawing changes with the readings.',
      'home.s4.c1.link': 'Preview →',
      'home.s4.c2.t': 'Card dashboard',
      'home.s4.c2.s': 'Clear and essential',
      'home.s4.c2.p': 'Each reading in a card, with status and ideal range.',
      'home.s4.c2.link': 'Preview →',
      'home.s4.gloss': 'Component glossary:',
      'home.s5': '3D printing',
      'home.s5.p': 'The smart lids are designed for 3D printing. The repository has per-jar models, compatibility notes and print tips.',
      'home.s5.link': 'See files to print →',
      'home.s6': 'Varieties for the jar',
      'home.s6.p': 'The jar format works best with species that have compact fruiting bodies. For now the guide covers pioppino, the reference choice; more common Italian varieties will be added soon, with recommended environmental ranges.',
      'home.s6.link': 'See the varieties →',
      'var.title': 'Varieties — VasoVivo',
      'var.eyebrow': 'Guide',
      'var.h1': 'Varieties for the jar',
      'var.lede': 'Species with compact fruiting bodies, suitable for jar or block growing. For now we document pioppino, the project reference choice; more common Italian varieties will be added soon.',
      'var.badge.ideal': 'Ideal for the jar',
      'var.r.temp': 'Temperature',
      'var.r.hum': 'Air humidity',
      'var.r.eco2': 'CO₂',
      'var.r.lux': 'Light',
      'var.r.moist': 'Substrate moisture',
      'var.pioppino.p': 'A mushroom typical of Italian cooking, with a bold flavour. It grows naturally at the base of poplars; its compact size makes it the reference choice for VasoVivo.',
      'var.pioppino.eco2': 'under 1000 ppm',
      'var.note': 'Ranges are indicative and depend on strain, substrate and growth stage. In the dashboard settings you can change the species name and recommended thresholds. More jar-friendly varieties will be added soon.',
      'home.s7': 'At the stand',
      'home.s7.p1': 'At the stand you can see VasoVivo running: several jars with active grows, mushrooms developing and every sensor at work. A display shows live environmental data for each jar.',
      'home.s7.p2': 'You also find project documentation and a QR code linking to the GitHub repository with everything needed to rebuild it.',

      'hw.title': 'Hardware — VasoVivo',
      'hw.eyebrow': 'Guide',
      'hw.h1': 'Hardware',
      'hw.lede': 'Board and sensors you can use in VasoVivo. For each sensor the repository has documentation, wiring and an ESP32 sample sketch.',
      'hw.bb.meta': 'Prototyping · wiring',
      'hw.bb.p': 'Base for mounting and wiring the board and sensors while prototyping, without soldering.',
      'hw.esp.meta': 'Microcontroller · Wi-Fi · Bluetooth',
      'hw.esp.p': 'Main board of the project: connects sensors and handles reading and sending data.',
      'hw.ens.meta': 'eCO₂ · TVOC · temperature · air humidity',
      'hw.ens.p': 'Combined module to monitor air quality and conditions inside the jar.',
      'hw.dht22.meta': 'Temperature · air humidity',
      'hw.dht22.p': 'Recommended option for more precise air temperature and humidity readings.',
      'hw.dht11.meta': 'Temperature · air humidity',
      'hw.dht11.p': 'Budget option for air temperature and humidity, good for a first build.',
      'hw.cap.meta': 'Substrate moisture',
      'hw.cap.p': 'Corrosion-resistant capacitive PCB probe: measures block moisture without exposed electrodes.',
      'hw.ds.meta': 'Substrate temperature',
      'hw.ds.p': 'Waterproof probe for temperature inside the substrate, alongside air temperature.',
      'hw.ldr.meta': 'Brightness',
      'hw.ldr.p': 'Senses ambient light to check exposure and relate it to growth.',
      'hw.bh.meta': 'Light intensity · lux',
      'hw.bh.p': 'I²C ambient-light module in lux. A direct intensity reading, unlike a photoresistor.',

      'pr.title': '3D printing — VasoVivo',
      'pr.eyebrow': 'Guide',
      'pr.h1': '3D printing',
      'pr.lede': 'STL models for VasoVivo smart lids. For each jar the repository has documentation and print notes; files will be added to each folder.',
      'pr.gen.meta': 'Adaptable · multi-jar',
      'pr.gen.p': 'Universal lid for jars with a compatible circular mouth, useful for trying other containers.',
      'pr.ek.meta': 'IKEA EKLATANT · 4.2 l',
      'pr.ek.p': 'Custom lid for the 4.2 l IKEA EKLATANT jar, the project reference container.',

      'dash.connecting': 'Connecting…',
      'dash.waiting': 'Waiting for data',
      'dash.preview': 'Preview',
      'dash.online': 'Connected',
      'dash.offline': 'Unreachable',
      'dash.updated': 'Updated at {time}',
      'dash.footer.demo': 'Simulated data: dashboard preview',
      'dash.footer.live': 'Live readings from the ESP32',
      'dash.kicker': 'Jar no. 1 · {species}',
      'dash.meta': 'IKEA EKLATANT · 4.2 l · {species}',
      'dash.cards.title': 'Jar #1',
      'dash.cards.eyebrow': 'Card dashboard',
      'dash.group.air': 'Air in the jar',
      'dash.group.light': 'Light',
      'dash.group.substrate': 'Substrate',
      'dash.group.sensors': 'Sensors and board',
      'dash.m.temp': 'Temperature',
      'dash.m.hum': 'Air humidity',
      'dash.m.eco2': 'Equivalent CO₂',
      'dash.m.tvoc': 'Volatile compounds',
      'dash.m.aqi': 'Air quality',
      'dash.m.lux': 'Light intensity',
      'dash.m.moisture': 'Substrate moisture',
      'dash.m.adc': 'Raw ADC value',
      'dash.hint.cap': 'capacitive sensor',
      'dash.hint.cal': 'calibration',
      'dash.dt.wifi': 'Wi-Fi network',
      'dash.dt.ip': 'Address',
      'dash.dt.clients': 'Connected devices',
      'dash.dt.uptime': 'Up for',
      'dash.back.jar': 'Illustrated board →',
      'dash.back.ui': 'UI components →',
      'dash.back.site': '← Back to the site',
      'dash.clients': '{n} devices',
      'dash.uptime': 'up for {t}',

      'jar.ch.air': 'Air',
      'jar.ch.light': 'Light',
      'jar.ch.substrate': 'Substrate',
      'jar.label.temp': 'Temperature',
      'jar.label.hum': 'Humidity',
      'jar.label.eco2': 'Equivalent CO₂',
      'jar.label.lux': 'Intensity',
      'jar.label.moisture': 'Humidity',
      'jar.state.ok': 'in range',
      'jar.state.low': 'below range',
      'jar.state.high': 'above range',
      'jar.state.na': 'unavailable',
      'jar.range': 'ideal {low}–{high} {unit}',
      'jar.range.under': 'ideal under {high} {unit}',
      'jar.range.lux': 'ideal {low}–{high} lux, indirect light',
      'jar.verdict.listen': 'Listening to the jar…',
      'jar.verdict.listen.d': 'The first readings arrive in a few seconds.',
      'jar.verdict.silent': 'The jar is silent.',
      'jar.verdict.silent.d': 'No sensor returned a reading: check the wiring.',
      'jar.verdict.ok': 'The jar is doing well.',
      'jar.verdict.ok.d': 'Air, light and substrate are in the ideal range for {species}.',
      'jar.verdict.offline': 'The jar is not responding.',
      'jar.verdict.offline.d': 'Check that the board is on and you are connected to the VasoVivo network.',
      'jar.also': ' Also check: {list}.',
      'jar.gas': ' Gas sensor: {text}.',
      'jar.aside.air.ok': 'Volatile compounds {tvoc} ppb. Air-quality index {aqi} of 5: {aqiText}.',
      'jar.aside.air.off': 'The gas sensor is not responding: CO₂, VOCs and air quality are unavailable.',
      'jar.aside.sub': 'Raw value {raw} of 4095, calibrated between {dry} (dry) and {wet} (wet).',
      'jar.aside.air.wait': 'Volatile compounds and air quality incoming.',
      'jar.aside.sub.wait': 'Raw sensor value incoming.',

      'advice.hum.name': 'air humidity',
      'advice.hum.low.t': 'The air is too dry.',
      'advice.hum.low.d': 'Mist a little water on the jar walls.',
      'advice.hum.high.t': 'The air is saturated.',
      'advice.hum.high.d': 'Crack the lid open for a few minutes: too much condensation spoils the caps.',
      'advice.temp.name': 'temperature',
      'advice.temp.low.t': 'It is too cold.',
      'advice.temp.low.d': 'Move the jar somewhere warmer, away from windows and drafts.',
      'advice.temp.high.t': 'It is too warm.',
      'advice.temp.high.d': 'Keep it away from radiators and direct sun.',
      'advice.eco2.name': 'CO₂',
      'advice.eco2.high.t': 'Fresh air is needed.',
      'advice.eco2.high.d': 'Open the lid for a few minutes: mycelium breathes and builds up CO₂.',
      'advice.moisture.name': 'substrate moisture',
      'advice.moisture.low.t': 'The substrate is dry.',
      'advice.moisture.low.d': 'Water lightly, without leaving puddles at the bottom.',
      'advice.moisture.high.t': 'The substrate is soaked.',
      'advice.moisture.high.d': 'Remove excess water and let it breathe.',
      'advice.lux.name': 'light',
      'advice.lux.low.t': 'A little light is needed.',
      'advice.lux.low.d': 'Indirect light is enough: mushrooms use it to orient and form caps.',
      'advice.lux.high.t': 'Too much direct light.',
      'advice.lux.high.d': 'Move it out of the sun: it heats and dries the jar.',

      'aqi.1': 'excellent',
      'aqi.2': 'excellent',
      'aqi.3': 'good',
      'aqi.4': 'fair',
      'aqi.5': 'poor',
      'aqi.0': 'very poor',
      'validity.ok': 'reliable values',
      'sub.dry': 'too dry',
      'sub.wet': 'too wet',
      'sub.ok': 'normal',
      'sub.na': 'unavailable',
      'metric.drywet': 'dry {dry} · wet {wet}'
    }
  };

  let settings = clone(DEFAULTS);
  const listeners = [];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function locale() {
    return settings.lang === 'en' ? 'en-GB' : 'it-IT';
  }

  function t(key, vars) {
    const pack = I18N[settings.lang] || I18N.it;
    let text = pack[key] || I18N.it[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        text = text.split('{' + name + '}').join(String(vars[name]));
      });
    }
    return text;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        settings = clone(DEFAULTS);
        return settings;
      }
      const parsed = JSON.parse(raw);
      settings = clone(DEFAULTS);
      if (parsed.lang === 'it' || parsed.lang === 'en') settings.lang = parsed.lang;
      if (typeof parsed.species === 'string' && parsed.species.trim()) {
        settings.species = parsed.species.trim().slice(0, 40);
      }
      if (parsed.ranges && typeof parsed.ranges === 'object') {
        Object.keys(DEFAULTS.ranges).forEach(function (key) {
          const r = parsed.ranges[key];
          if (!r) return;
          const low = Number(r.low);
          const high = Number(r.high);
          if (!isNaN(low) && !isNaN(high) && low <= high) {
            settings.ranges[key] = { low: low, high: high };
          }
        });
      }
    } catch (e) {
      settings = clone(DEFAULTS);
    }
    return settings;
  }

  function save(next) {
    settings = next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    apply();
    listeners.forEach(function (fn) { fn(settings); });
    document.dispatchEvent(new CustomEvent('vvsettingschange', { detail: settings }));
  }

  function get() {
    return clone(settings);
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function fill(template, vars) {
    return t(template, vars);
  }

  function rangeLabel(key, range) {
    const unit = RANGE_UNITS[key];
    if (key === 'lux') {
      return t('jar.range.lux', { low: range.low, high: range.high });
    }
    if (key === 'eco2' && range.low <= 0) {
      return t('jar.range.under', { high: range.high, unit: unit });
    }
    return t('jar.range', { low: range.low, high: range.high, unit: unit });
  }

  function applyI18n() {
    document.documentElement.lang = settings.lang;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (node) {
      const key = node.getAttribute('data-i18n');
      if (!key) return;
      const attr = node.getAttribute('data-i18n-attr');
      const text = t(key);
      if (attr) {
        node.setAttribute(attr, text);
      } else {
        node.textContent = text;
      }
    });
  }

  function applySpecies() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-vv-species]'), function (node) {
      node.textContent = settings.species;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-species]'), function (node) {
      const key = node.getAttribute('data-i18n-species');
      node.textContent = t(key, { species: settings.species });
    });
  }

  function applyRanges() {
    Object.keys(RANGE_IDS).forEach(function (id) {
      const key = RANGE_IDS[id];
      const range = settings.ranges[key];
      const node = document.getElementById(id);
      if (!node || !range) return;
      node.dataset.low = String(range.low);
      node.dataset.high = String(range.high);
      const caption = node.querySelector('.vv-reading__range');
      if (caption) caption.textContent = rangeLabel(key, range);
      const ideal = node.querySelector('.vv-scale__ideal');
      if (ideal) {
        const min = Number(node.dataset.min);
        const max = Number(node.dataset.max);
        const log = node.dataset.scale === 'log';
        function pos(value) {
          const p = log
            ? (Math.log10(Math.max(value, min)) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))
            : (value - min) / (max - min);
          return Math.max(0, Math.min(1, p));
        }
        ideal.style.setProperty('--from', (pos(range.low) * 100).toFixed(2) + '%');
        ideal.style.setProperty('--to', (pos(range.high) * 100).toFixed(2) + '%');
      }
    });
  }

  function syncLangUi() {
    const group = document.querySelector('[data-vv-lang-switch]');
    if (group) {
      group.setAttribute('aria-label', t('lang.switch'));
      Array.prototype.forEach.call(group.querySelectorAll('[data-vv-lang]'), function (btn) {
        const code = btn.getAttribute('data-vv-lang');
        const active = code === settings.lang;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-label', t(code === 'en' ? 'lang.en' : 'lang.it'));
        btn.title = t(code === 'en' ? 'lang.en' : 'lang.it');
      });
    }
    const openBtn = document.querySelector('[data-vv-settings-open]');
    if (openBtn) {
      const label = t('settings.open');
      openBtn.setAttribute('aria-label', label);
      openBtn.title = label;
    }
  }

  function apply() {
    applyI18n();
    applySpecies();
    applyRanges();
    syncLangUi();
    syncDialog();
  }

  function ensureChrome() {
    const top = document.querySelector('.vv-top');
    if (!top || top.querySelector('[data-vv-top-tools]')) return;

    const tools = document.createElement('div');
    tools.className = 'vv-top__tools';
    tools.setAttribute('data-vv-top-tools', '');

    const lang = document.createElement('div');
    lang.className = 'vv-lang';
    lang.setAttribute('data-vv-lang-switch', '');
    lang.setAttribute('role', 'group');
    lang.setAttribute('aria-label', t('lang.switch'));
    lang.innerHTML =
      '<button type="button" class="vv-lang__btn" data-vv-lang="it" aria-pressed="false" aria-label="Italiano" title="Italiano">🇮🇹</button>' +
      '<button type="button" class="vv-lang__btn" data-vv-lang="en" aria-pressed="false" aria-label="English" title="English">🇬🇧</button>';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'vv-settings-open';
    button.setAttribute('data-vv-settings-open', '');
    button.setAttribute('aria-label', t('settings.open'));
    button.title = t('settings.open');
    button.textContent = '⚙️';

    tools.appendChild(lang);
    tools.appendChild(button);
    top.appendChild(tools);
  }

  function dialogHtml() {
    const keys = ['temp', 'hum', 'eco2', 'lux', 'moisture'];
    let ranges = '';
    keys.forEach(function (key) {
      ranges +=
        '<div class="vv-settings__range" data-range="' + key + '">' +
          '<span class="vv-settings__range-label" data-i18n="settings.range.' + key + '"></span>' +
          '<input type="number" name="' + key + '-low" step="any" aria-label="Min" />' +
          '<input type="number" name="' + key + '-high" step="any" aria-label="Max" />' +
        '</div>';
    });
    return (
      '<div class="vv-modal" id="vv-settings" hidden aria-hidden="true">' +
        '<button type="button" class="vv-modal__backdrop" data-vv-modal-close tabindex="-1" aria-hidden="true"></button>' +
        '<div class="vv-modal__panel" role="dialog" aria-modal="true" aria-labelledby="vv-settings-title">' +
          '<form class="vv-settings__form">' +
            '<header class="vv-settings__head">' +
              '<h2 id="vv-settings-title" data-i18n="settings.title"></h2>' +
              '<button type="button" class="vv-settings__x" data-vv-modal-close data-i18n-attr="aria-label" data-i18n="settings.close" aria-label="">×</button>' +
            '</header>' +
            '<label class="vv-settings__field">' +
              '<span data-i18n="settings.species"></span>' +
              '<input type="text" name="species" maxlength="40" required />' +
            '</label>' +
            '<div class="vv-settings__ranges">' +
              '<h3 class="vv-settings__section" data-i18n="settings.ranges"></h3>' +
              '<div class="vv-settings__range-head">' +
                '<span></span>' +
                '<span data-i18n="settings.min"></span>' +
                '<span data-i18n="settings.max"></span>' +
              '</div>' +
              ranges +
            '</div>' +
            '<div class="vv-settings__actions">' +
              '<button type="button" class="vv-settings__reset" data-vv-settings-reset data-i18n="settings.reset"></button>' +
              '<button type="submit" class="vv-settings__save" data-i18n="settings.save"></button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>'
    );
  }

  function ensureDialog() {
    if (document.getElementById('vv-settings')) return document.getElementById('vv-settings');
    document.body.insertAdjacentHTML('beforeend', dialogHtml());
    return document.getElementById('vv-settings');
  }

  function openModal(modal) {
    if (!modal) return;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('vv-modal-open');
    const focusable = modal.querySelector('input, button.vv-settings__save');
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('vv-modal-open');
    const trigger = document.querySelector('[data-vv-settings-open]');
    if (trigger) trigger.focus();
  }

  function syncDialog() {
    const modal = document.getElementById('vv-settings');
    if (!modal) return;
    const form = modal.querySelector('form');
    form.species.value = settings.species;
    Object.keys(settings.ranges).forEach(function (key) {
      const low = form.querySelector('[name="' + key + '-low"]');
      const high = form.querySelector('[name="' + key + '-high"]');
      if (low) {
        low.value = settings.ranges[key].low;
        low.setAttribute('aria-label', t('settings.min'));
      }
      if (high) {
        high.value = settings.ranges[key].high;
        high.setAttribute('aria-label', t('settings.max'));
      }
    });
  }

  function readForm(form) {
    const next = clone(DEFAULTS);
    next.lang = settings.lang;
    next.species = (form.species.value || DEFAULTS.species).trim().slice(0, 40) || DEFAULTS.species;
    Object.keys(DEFAULTS.ranges).forEach(function (key) {
      const low = Number(form.querySelector('[name="' + key + '-low"]').value);
      const high = Number(form.querySelector('[name="' + key + '-high"]').value);
      if (!isNaN(low) && !isNaN(high) && low <= high) {
        next.ranges[key] = { low: low, high: high };
      }
    });
    return next;
  }

  function setLang(lang) {
    const next = get();
    next.lang = lang === 'en' ? 'en' : 'it';
    save(next);
  }

  function wire() {
    ensureChrome();
    const modal = ensureDialog();
    const form = modal.querySelector('form');

    document.addEventListener('click', function (event) {
      const langBtn = event.target.closest('[data-vv-lang]');
      if (langBtn) {
        event.preventDefault();
        setLang(langBtn.getAttribute('data-vv-lang'));
        return;
      }
      if (event.target.closest('[data-vv-modal-close]')) {
        closeModal(modal);
        return;
      }
      const open = event.target.closest('[data-vv-settings-open]');
      if (!open) return;
      syncDialog();
      applyI18n();
      openModal(modal);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || modal.hidden) return;
      event.preventDefault();
      closeModal(modal);
    });

    form.addEventListener('click', function (event) {
      if (!event.target.closest('[data-vv-settings-reset]')) return;
      event.preventDefault();
      const next = clone(DEFAULTS);
      next.lang = settings.lang;
      save(next);
      syncDialog();
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      save(readForm(form));
      closeModal(modal);
    });
  }

  load();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      wire();
      apply();
    });
  } else {
    wire();
    apply();
  }

  return {
    DEFAULTS: clone(DEFAULTS),
    RANGE_IDS: RANGE_IDS,
    get: get,
    t: t,
    fill: fill,
    locale: locale,
    apply: apply,
    applyRanges: applyRanges,
    onChange: onChange,
    rangeLabel: rangeLabel
  };
})();
