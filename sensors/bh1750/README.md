# GY-302 BH1750FVI — Intensità luminosa

Modulo I²C con il sensore **BH1750FVI**. Misura la luce ambientale direttamente in lux.

Nel contesto di **VasoVivo**, sostituisce la fotoresistenza quando serve un valore in lux e non una lettura analogica grezza.

---

## Parametri misurati

| Parametro | Unità | Note |
|---|---|---|
| Intensità luminosa | lux | Modalità continua ad alta risoluzione |

---

## Collegamento all'ESP32 (I²C)

| Pin modulo | Pin ESP32 |
|---|---|
| VCC | 3.3V |
| GND | GND |
| SDA | GPIO 21 |
| SCL | GPIO 22 |
| ADDR | GND |

> ADDR a GND fissa l'indirizzo `0x23`, quello usato dallo sketch. SDA e SCL sono gli stessi del modulo ENS160 + AHT21: i due moduli stanno in parallelo sullo stesso bus.

---

## Librerie necessarie

Installabili dal Library Manager di Arduino IDE:

- **BH1750** — `BH1750` by Christopher Laws

---

## Note

- La lettura è in [`example/light_lux.h`](example/light_lux.h): `lightBegin()` e `lightRead()`.
- Il valore è già in lux: non serve la calibrazione richiesta dalla fotoresistenza.
