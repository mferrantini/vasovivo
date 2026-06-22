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

---

## Struttura della repository

```
VASOVIVO/
├── index.html          # Homepage (GitHub Pages)
├── hardware.html       # Elenco componenti e link acquisto
├── css/
├── img/
├── docs/
│   └── mf_intro.md     # Testo introduttivo per la Maker Faire
└── sensors/            # Documentazione e sketch per ogni sensore
    ├── ens160-aht21/
    ├── dht22/
    ├── dht11/
    ├── fork-sensor/
    ├── ds18b20/
    └── ldr/
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
- [Sito del progetto](https://mferrantini.github.io/vasovivo/)

---

## Contributi

Pull request e segnalazioni sono benvenute. Il progetto è pensato per essere replicabile e adattabile: ognuno può configurare sensori, connettività e contenitore secondo le proprie esigenze.
