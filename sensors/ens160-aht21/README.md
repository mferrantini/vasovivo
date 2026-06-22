# ENS160 + AHT21

Modulo combinato che integra due sensori in un unico componente compatto:
- **ENS160** (ScioSense) — sensore digitale per la qualità dell'aria: misura CO₂ equivalente (eCO₂) e composti organici volatili totali (TVOC) tramite ossidi metallici (MOX)
- **AHT21** — sensore di temperatura e umidità relativa dell'aria, usato anche internamente dall'ENS160 per la compensazione dei valori

Nel contesto di **VasoVivo**, questo modulo monitora la qualità dell'aria all'interno del barattolo: un aumento di CO₂/VOC indica attività metabolica del micelio o condizioni di scarso ricambio d'aria.

---

## Parametri misurati

| Parametro | Unità | Range tipico |
|---|---|---|
| eCO₂ | ppm | 400 – 65000 |
| TVOC | ppb | 0 – 65000 |
| Temperatura | °C | -40 – 85 |
| Umidità relativa | % RH | 0 – 100 |

---

## Collegamento all'ESP32 (I²C)

| Pin modulo | Pin ESP32 |
|---|---|
| VCC | 3.3V |
| GND | GND |
| SDA | GPIO 21 |
| SCL | GPIO 22 |

> I pin SDA/SCL sono i default dell'I²C su ESP32. Possono essere riassegnati via `Wire.begin(sda, scl)`.

---

## Librerie necessarie

Installabili dal Library Manager di Arduino IDE:

- **ScioSense ENS160** — `ScioSense_ENS160` by ScioSense
- **AHT21 / AHTxx** — `Adafruit AHTX0` by Adafruit (oppure `AHT20` by dvarrel)

---

## Note

- Il sensore ENS160 richiede un periodo di riscaldamento di circa 1 minuto prima di fornire letture stabili.
- I valori di temperatura e umidità dell'AHT21 vengono passati all'ENS160 per compensare la risposta del sensore MOX.
- L'indirizzo I²C del modulo combinato è tipicamente `0x53` (ENS160) e `0x38` (AHT21).
