# DHT22

Sensore digitale per la misura di **temperatura** e **umidità relativa** dell'aria.
È la versione più precisa e affidabile rispetto al DHT11 ed è il sensore **consigliato** per VasoVivo quando si vuole avere dati ambientali accurati.

---

## Parametri misurati

| Parametro | Unità | Range | Precisione |
|---|---|---|---|
| Temperatura | °C | -40 – 80 | ±0.5 °C |
| Umidità relativa | % RH | 0 – 100 | ±2 – 5 % RH |

---

## Collegamento all'ESP32

Il DHT22 si trova sia come sensore a 3 pin (modulo breakout) che a 4 pin (componente discreto).

**Modulo breakout (3 pin):**

| Pin modulo | Pin ESP32 |
|---|---|
| VCC (+) | 3.3V o 5V |
| GND (-) | GND |
| DATA (S) | GPIO 4 (modificabile) |

**Componente discreto (4 pin):**

| Pin DHT22 | Pin ESP32 | Note |
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

- Il DHT22 è lento: frequenza di campionamento massima **1 lettura ogni 2 secondi**.
- Usare cavi di collegamento corti (< 20 cm) per evitare errori di comunicazione.
- Preferire l'alimentazione a 3.3V su ESP32 per evitare problemi di livello logico.
