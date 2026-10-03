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
| [Sensore a forchetta](sensors/fork-sensor/) | Umidità substrato | README + sketch |
| [DS18B20](sensors/ds18b20/) | Temperatura substrato | README + sketch |
| [Fotoresistenza (LDR)](sensors/ldr/) | Luminosità | README + sketch |

Ogni sensore ha una cartella in [`sensors/`](sensors/) con pinout, librerie Arduino e uno sketch di esempio per ESP32. Vedi anche [`sensors/README.md`](sensors/README.md) per i requisiti comuni.

L'elenco completo con link per l'acquisto è disponibile sul sito: [hardware.html](hardware.html).

## Stampa 3D

| Modello | Compatibilità | Documentazione |
|---|---|---|
| [Coperchio generico](prints/generic-lid/) | Barattoli adattabili | README |
| [Coperchio per EKLATANT](prints/eklatant/) | IKEA EKLATANT | README |

Vedi [`prints/README.md`](prints/README.md) per l'indice completo. I file STL verranno aggiunti nelle rispettive cartelle.

---

## UI Toolkit

Il progetto include un piccolo **UI toolkit CSS** per costruire interfacce di monitoraggio in tempo reale. I componenti usano il prefisso `vv-` e sono organizzati in [`css/vv-ui/`](css/vv-ui/); il file [`css/style.css`](css/style.css) ne è l'entry point.

| Pagina | Descrizione |
|---|---|
| [UI/index.html](UI/index.html) | Dashboard di prova con dati mockati (1 barattolo) |
| [UI/elements.html](UI/elements.html) | Glossario dei componenti disponibili |

### Componenti principali

- **Layout** — `.vv-header--compact`, `.vv-main--dashboard`, `.vv-divider`
- **Intestazione dashboard** — `.vv-dashboard-header`, `.vv-ts` (timestamp)
- **Stato** — `.vv-status--ok`, `.vv-status--warn`
- **Metriche** — `.vv-metric-grid`, `.vv-metric`, `.vv-metric--highlight`
- **Gruppi** — `.vv-dashboard-group` per raggruppare letture (aria, substrato, ambiente)
- **Panel** — `.vv-panel` per avvisi e note

Per iniziare una nuova dashboard: includi il font Lexend e `css/style.css`, poi consulta [`UI/elements.html`](UI/elements.html) per esempi e nomi delle classi.

---

## Struttura della repository

```
VASOVIVO/
├── index.html          # Homepage (GitHub Pages)
├── hardware.html       # Elenco componenti e link acquisto
├── prints.html         # Elenco file stampa 3D
├── css/
│   ├── style.css       # Entry point CSS del toolkit
│   └── vv-ui/          # Moduli UI toolkit (tokens, layout, componenti, dashboard)
├── UI/
│   ├── index.html      # Dashboard mock
│   └── elements.html   # Glossario componenti UI
├── img/
├── docs/
│   └── mf_intro.md     # Testo introduttivo per la Maker Faire
├── sensors/            # Documentazione e sketch per ogni sensore
│   ├── ens160-aht21/
│   ├── dht22/
│   ├── dht11/
│   ├── fork-sensor/
│   ├── ds18b20/
│   └── ldr/
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
- [Sensori](sensors/README.md) — indice e requisiti comuni
- [Dashboard mock](UI/index.html) — interfaccia di prova con dati mockati
- [Glossario UI](UI/elements.html) — componenti per costruire dashboard
- [Sito del progetto](https://mferrantini.github.io/vasovivo/)

---

## Contributi

Pull request e segnalazioni sono benvenute. Il progetto è pensato per essere replicabile e adattabile: ognuno può configurare sensori, connettività e contenitore secondo le proprie esigenze.
