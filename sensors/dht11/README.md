# DHT11

Sensore digitale per la misura di **temperatura** e **umidità relativa** dell'aria.
È l'alternativa **economica** al DHT22: precisione inferiore ma sufficiente per un primo approccio al progetto VasoVivo o per chi vuole replicarlo al minimo costo.

---

## Parametri misurati

| Parametro | Unità | Range | Precisione |
|---|---|---|---|
| Temperatura | °C | 0 – 50 | ±2 °C |
| Umidità relativa | % RH | 20 – 80 | ±5 % RH |

---

## Collegamento all'ESP32

**Modulo breakout (3 pin):**

| Pin modulo | Pin ESP32 |
|---|---|
| VCC (+) | 3.3V o 5V |
| GND (-) | GND |
| DATA (S) | GPIO 4 (modificabile) |

**Componente discreto (4 pin):**

| Pin DHT11 | Pin ESP32 | Note |
|---|---|---|
| 1 – VCC | 3.3V o 5V | |
| 2 – DATA | GPIO 4 | Resistenza pull-up 10kΩ verso VCC |
| 3 – N.C. | — | Non connesso |
| 4 – GND | GND | |

> Il pin DATA è configurabile: modifica la costante `DHTPIN` nello sketch.

---

## Librerie necessarie

- **DHT sensor library** by Adafruit — installabile dal Library Manager di Arduino IDE
- **Adafruit Unified Sensor** by Adafruit (dipendenza)

---

## Note

- Il DHT11 misura solo valori interi (non decimali) di temperatura e umidità.
- Range di temperatura limitato a 0–50 °C: non adatto ad ambienti freddi.
- Frequenza di campionamento massima: **1 lettura ogni secondo** (in pratica consigliare 2s come il DHT22).
- Per applicazioni che richiedono maggiore precisione, preferire il **DHT22**.
