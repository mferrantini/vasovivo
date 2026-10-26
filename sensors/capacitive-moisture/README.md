# Sensore capacitivo — Umidità substrato

Sensore di umidità del terreno **capacitivo** (tipo *Capacitive Soil Moisture Sensor v1.2*): una lama in PCB nera con punta a cuneo e elettronica in testa, resistente alla corrosione. Misura l'**umidità del substrato** in base alla variazione di capacità elettrica del materiale intorno alla lama — senza elettrodi esposti all'umidità come nei sensori resistivi a forchetta.

Nel contesto di **VasoVivo**, viene infilato nella zolletta di substrato per monitorare se le condizioni di umidità sono ottimali per la crescita del micelio.

---

## Parametri misurati

| Parametro | Tipo | Output |
|---|---|---|
| Umidità substrato | Analogico | Valore grezzo ADC (0 – 4095 su ESP32 a 12 bit) |

> Il modulo ha un connettore a 3 pin (VCC, GND, AOUT). Lo sketch usa solo l'uscita analogica.

---

## Collegamento all'ESP32

| Pin modulo | Pin ESP32 |
|---|---|
| VCC | 5V (VIN dell'ESP32, con la scheda alimentata via USB) |
| GND | GND |
| AOUT (analogico) | GPIO 34 |

> Su ESP32, i pin ADC1 (GPIO32–GPIO39) sono preferibili. Evitare i pin ADC2 (GPIO0, 2, 4, 12–15, 25–27) se si usa il Wi-Fi.
> Il v1.2 va alimentato a **5V**: a 3,3V il regolatore a bordo non parte e l'uscita resta a zero. L'uscita analogica resta intorno ai 3 V, nel range dell'ADC.

---

## Librerie necessarie

Nessuna libreria esterna richiesta — lettura tramite `analogRead()` nativo di Arduino/ESP32.

---

## Calibrazione

Il sensore non fornisce valori in percentuale direttamente: si mappa l'ADC tra due estremi in [`example/substrate_moisture.h`](example/substrate_moisture.h).

1. **`MOISTURE_DRY`** — sensore in aria (asciutto): tipicamente vicino a `4095` → 0 %.
2. **`MOISTURE_WET`** — soglia a cui consideri il substrato saturo al 100 % (non serve immergere tutta la lama): sotto questo ADC la percentuale resta a 100.
3. Aggiorna i due valori nel file e ricarica lo sketch.

Sul modulo v1.2 usato nel progetto (lama infilata a metà nella zolletta): aria `4095` = 0 %, substrato umido `3054` ≈ 55 %, da `2203` in giù = 100 %. I default nello header sono quindi `MOISTURE_DRY = 4095` e `MOISTURE_WET = 2203`.

Lo sketch stampa sempre anche l'ADC grezzo, così la calibrazione si fa con lo stesso esempio. Ricalibra se cambi modulo o substrato.

---

## Note

- A differenza dei sensori resistivi a forchetta, la lama capacitiva non espone elettrodi al substrato: è più stabile nel tempo e meno soggetta a corrosione.
- Il valore ADC può variare tra moduli diversi: ricalibrate dopo ogni sostituzione.
- La lettura è in [`example/substrate_moisture.h`](example/substrate_moisture.h): `moistureBegin()` e `moistureRead()`.
