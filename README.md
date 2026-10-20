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
| [Wi-Fi e dashboard a schede](examples/wifi-dashboard/) | Rete Wi-Fi propria, dashboard a schede su http://192.168.4.1 | ENS160 + AHT21, BH1750, umidità substrato |
| [Wi-Fi e tavola illustrata](examples/wifi-illustrated/) | Rete Wi-Fi propria, tavola illustrata su http://192.168.4.1 | ENS160 + AHT21, BH1750, umidità substrato |

Gli esempi Bluetooth e bot Telegram sono in preparazione.

## Stampa 3D

| Modello | Compatibilità | Documentazione |
|---|---|---|
| [Coperchio generico](prints/generic-lid/) | Barattoli adattabili | README |
| [Coperchio per EKLATANT](prints/eklatant/) | IKEA EKLATANT | README |

Vedi [`prints/README.md`](prints/README.md) per l'indice completo. I file STL verranno aggiunti nelle rispettive cartelle.

---

## UI Toolkit

Un solo kit, prefisso `vv-`: entry point [`css/style.css`](css/style.css), moduli in [`css/vv-ui/`](css/vv-ui/).
Stile carta con grana, titoli in Fraunces, dati in Lexend. Le letture arrivano da [`js/vv-data.js`](js/vv-data.js)
(`data-source` sul `<body>`: `demo` oppure `/api/readings`).

| Pagina | Descrizione |
|---|---|
| [UI/index.html](UI/index.html) | Tavola illustrata del barattolo EKLATANT (letture vere in [`wifi-illustrated`](examples/wifi-illustrated/)) |
| [UI/schede.html](UI/schede.html) | Dashboard a schede (letture vere in [`wifi-dashboard`](examples/wifi-dashboard/)) |
| [UI/elements.html](UI/elements.html) | Glossario componenti, token e utility |

Componenti principali: `.vv-art` / `.vv-reading` / `.vv-scale` (tavola), `.vv-metric` (schede),
`.vv-card`, `.vv-panel`, `.vv-item`, `.vv-section` (sito). Per spazi, colori e tipografia
usa le classi utility (`.vv-m-*`, `.vv-p-*`, `.vv-gap-*`, `.vv-text-*`, `.vv-bg-*`, `.vv-serif`, …)
su una scala a passo 4&nbsp;px, documentate nel glossario.

Logo wordmark: [`img/logo.svg`](img/logo.svg) (varianti `logo-ink.svg`, `logo-light.svg`).

---

## Struttura della repository

```
VASOVIVO/
├── index.html          # Homepage (GitHub Pages)
├── hardware.html       # Elenco componenti e link acquisto
├── prints.html         # Elenco file stampa 3D
├── css/
│   ├── style.css       # Entry point UI Kit
│   └── vv-ui/          # Moduli del kit
├── js/
│   ├── vv-data.js      # Letture (demo o ESP32)
│   ├── vv-dashboard.js # Dashboard a schede
│   └── vv-jar.js       # Tavola illustrata
├── UI/
│   ├── index.html      # Tavola illustrata (template di wifi-illustrated)
│   ├── schede.html     # Dashboard a schede (template di wifi-dashboard)
│   └── elements.html   # Glossario UI Kit
├── img/
│   ├── logo.svg        # Wordmark orizzontale
│   ├── logo-ink.svg
│   └── logo-light.svg
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
- [Tavola illustrata](UI/index.html) — dashboard del barattolo, con dati dimostrativi
- [Dashboard a schede](UI/schede.html) — metriche a card
- [Glossario UI Kit](UI/elements.html)
- [Sito del progetto](https://mferrantini.github.io/vasovivo/)

---

## Contributi

Pull request e segnalazioni sono benvenute. Il progetto è pensato per essere replicabile e adattabile: ognuno può configurare sensori, connettività e contenitore secondo le proprie esigenze.
