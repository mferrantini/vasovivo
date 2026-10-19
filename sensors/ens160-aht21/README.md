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
>
> Sui moduli che espongono anche **CS** e **ADD**: CS va a 3.3V per restare in I²C, ADD a 3.3V seleziona l'indirizzo `0x53`. Se ADD è a GND l'indirizzo è `0x52` e lo sketch lo prova comunque.

---

## Librerie necessarie

Installabili dal Library Manager di Arduino IDE:

- **ScioSense ENS16x** — `ScioSense_ENS16x` by ScioSense
- **AHT21 / AHTxx** — `Adafruit AHTX0` by Adafruit

---

## Note

- Il sensore ENS160 richiede un periodo di riscaldamento di circa 1 minuto prima di fornire letture stabili.
- I valori di temperatura e umidità dell'AHT21 vengono passati all'ENS160 per compensare la risposta del sensore MOX.
- L'indirizzo I²C dell'ENS160 è `0x53` con ADD a 3.3V, `0x52` con ADD a GND. L'AHT21 è `0x38`.
- La lettura è in [`example/air_quality.h`](example/air_quality.h): `airQualityBegin()` e `airQualityRead()`. Lo stesso file restituisce anche lo stato di riscaldamento dell'ENS160.
