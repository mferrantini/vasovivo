# VasoVivo

Monitoraggio intelligente per la coltivazione di funghi in barattolo, con **ESP32** e sensori ambientali.

Progetto open source presentato alla **Maker Faire Roma 2026**.

**Sito:** [mferrantini.github.io/vasovivo](https://mferrantini.github.io/vasovivo/)

---

## Cos'è

**VasoVivo** è un sistema di monitoraggio attivo per la coltivazione di funghi in piccolo contenitore: un barattolo con zolletta di substrato, chiuso da un coperchio intelligente con sensoristica integrata.

I sensori, collegati a una scheda **ESP32**, misurano temperatura, umidità, qualità dell'aria e luminosità. I dati sono accessibili in diversi modi — tramite **Bluetooth**, **Wi-Fi** o un **bot Telegram** — a seconda di come si configura la scheda.

Il contenitore di riferimento è il barattolo [**IKEA EKLATANT**](https://www.ikea.com/it/it/p/eklatant-contenitore-con-coperchio-vetro-trasparente-bambu-50621766/) (IKEA hack). I componenti stampati in 3D si adattano a diversi modelli del catalogo IKEA; l'elettronica usa componenti economici e facilmente reperibili.

---

## Hardware

| Componente | Parametri | Documentazione |
|---|---|---|
| ESP32-WROOM-32 | Microcontrollore, Wi-Fi, Bluetooth | — |
| [ENS160 + AHT21](sensors/ens160-aht21/) | CO₂eq, TVOC, temperatura, umidità aria | README + sketch |
| [DHT22](sensors/dht22/) | Temperatura, umidità aria | README + sketch |
| [DHT11](sensors/dht11/) | Temperatura, umidità aria | README + sketch |
| [Sensore capacitivo](sensors/capacitive-moisture/) | Umidità substrato | README + sketch |
| [DS18B20](sensors/ds18b20/) | Temperatura substrato | README + sketch |
| [Fotoresistenza (LDR)](sensors/ldr/) | Luminosità | README + sketch |
| [GY-302 BH1750FVI](sensors/bh1750/) | Intensità luminosa (lux) | README + sketch |

Ogni sensore ha una cartella in [`sensors/`](sensors/) con pinout, librerie Arduino e uno sketch di esempio per ESP32. Vedi anche [`sensors/README.md`](sensors/README.md) per i requisiti comuni.

L'elenco completo con link per l'acquisto è disponibile sul sito: [hardware.html](hardware.html).

## Esempi completi

Sketch pronti da caricare, costruiti con gli stessi blocchi di lettura degli esempi dei singoli sensori. Indice e requisiti in [`examples/README.md`](examples/README.md).

| Esempio | Connessione | Sensori |
|---|---|---|
| [Wi-Fi e pagina HTML](examples/wifi-page/) | Rete Wi-Fi propria, pagina senza stile su http://192.168.4.1 | ENS160 + AHT21, BH1750, umidità substrato |
| [Wi-Fi e dashboard](examples/wifi-dashboard/) | Rete Wi-Fi propria, dashboard UI v1 (schede) su http://192.168.4.1 | ENS160 + AHT21, BH1750, umidità substrato |
| [Wi-Fi e dashboard illustrata](examples/wifi-illustrated/) | Rete Wi-Fi propria, dashboard UI v2 (tavola) su http://192.168.4.1 | ENS160 + AHT21, BH1750, umidità substrato |

Gli esempi Bluetooth e bot Telegram sono in preparazione.

## Stampa 3D

| Modello | Compatibilità | Documentazione |
|---|---|---|
| [Coperchio generico](prints/generic-lid/) | Barattoli adattabili | README |
| [Coperchio per EKLATANT](prints/eklatant/) | IKEA EKLATANT | README |

Vedi [`prints/README.md`](prints/README.md) per l'indice completo. I file STL verranno aggiunti nelle rispettive cartelle.

---

## UI Toolkit

Ci sono due toolkit, indipendenti: la **v1** a schede e la **v2** illustrata. Entrambi leggono i dati tramite [`js/vv-data.js`](js/vv-data.js) (`data-source` sul `<body>`: `demo` oppure `/api/readings`).

### UI v1 — schede

Prefisso `vv-`, entry point [`css/style.css`](css/style.css), moduli in [`css/vv-ui/`](css/vv-ui/).

| Pagina | Descrizione |
|---|---|
| [UI/index.html](UI/index.html) | Dashboard a schede (dati dimostrativi; letture vere in [`wifi-dashboard`](examples/wifi-dashboard/)) |
| [UI/elements.html](UI/elements.html) | Glossario dei componenti v1 |

Componenti principali: `.vv-metric-grid`, `.vv-metric`, `.vv-dashboard-group`, `.vv-status`, `.vv-panel`, animazioni in `motion.css`.

### UI v2 — tavola illustrata

Prefisso `vv2-`, entry point [`css/style-v2.css`](css/style-v2.css), moduli in [`css/vv-ui-v2/`](css/vv-ui-v2/).

| Pagina | Descrizione |
|---|---|
| [UI/v2/index.html](UI/v2/index.html) | Dashboard illustrata del barattolo EKLATANT (letture vere in [`wifi-illustrated`](examples/wifi-illustrated/)) |
| [UI/v2/elements.html](UI/v2/elements.html) | Glossario e guida d'uso dei componenti v2 |

Componenti principali: `.vv2-art` (illustrazione), `.vv2-reading` e `.vv2-scale` (fascia ideale), `.vv2-verdict`, `.vv2-label`, `.vv2-chapter`. Su desktop e tablet in orizzontale la pagina sta in un solo schermo.

Per spazi, colori e allineamenti ci sono classi utility (`.vv2-m-*`, `.vv2-p-*`, `.vv2-gap-*`, `.vv2-text-*`, `.vv2-bg-*`) basate su una scala di spazi a passo 4&nbsp;px, definite in `css/vv-ui-v2/utilities.css` e documentate nel glossario.

---

## Struttura della repository

```
VASOVIVO/
├── index.html          # Homepage (GitHub Pages)
├── hardware.html       # Elenco componenti e link acquisto
├── prints.html         # Elenco file stampa 3D
├── css/
│   ├── style.css       # Entry point UI v1
│   ├── style-v2.css    # Entry point UI v2
│   ├── vv-ui/          # Moduli UI v1
│   └── vv-ui-v2/       # Moduli UI v2
├── js/
│   ├── vv-data.js      # Letture (demo o ESP32), condiviso
│   ├── vv-dashboard.js # UI v1
│   └── v2/
│       └── vv2-jar.js  # UI v2
├── UI/
│   ├── index.html      # Dashboard v1 (template di wifi-dashboard)
│   ├── elements.html   # Glossario UI v1
│   └── v2/
│       ├── index.html  # Dashboard v2 (template di wifi-illustrated)
│       └── elements.html
├── img/
├── docs/
│   └── mf_intro.md     # Testo introduttivo per la Maker Faire
├── examples/           # Esempi completi (più sensori + connessione)
│   ├── wifi-page/
│   ├── wifi-dashboard/
│   └── wifi-illustrated/
├── sensors/            # Documentazione, blocco di lettura e sketch per ogni sensore
│   ├── ens160-aht21/
│   ├── dht22/
│   ├── dht11/
│   ├── capacitive-moisture/
│   ├── ds18b20/
│   ├── ldr/
│   └── bh1750/
└── prints/             # Modelli STL e documentazione per ogni barattolo
    ├── generic-lid/
    └── eklatant/
```

---

## Requisiti

- Scheda **ESP32** (testato su ESP32-WROOM-32)
- **Arduino IDE** 2.x o PlatformIO
- Board package `esp32` by Espressif

---

## Documentazione

- [Introduzione al progetto](docs/mf_intro.md) — testo per la Maker Faire
- [Sensori](sensors/README.md) — indice, blocchi di lettura e mappa pin
- [Esempi completi](examples/README.md) — sketch pronti con più sensori
- [Dashboard UI v1](UI/index.html) — schede, con dati dimostrativi
- [Dashboard UI v2](UI/v2/index.html) — tavola illustrata del barattolo EKLATANT
- [Glossario UI v1](UI/elements.html) · [Glossario UI v2](UI/v2/elements.html)
- [Sito del progetto](https://mferrantini.github.io/vasovivo/)

---

## Contributi

Pull request e segnalazioni sono benvenute. Il progetto è pensato per essere replicabile e adattabile: ognuno può configurare sensori, connettività e contenitore secondo le proprie esigenze.
