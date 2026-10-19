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
| VCC | 3.3V |
| GND | GND |
| AOUT (analogico) | GPIO 34 |

> Su ESP32, i pin ADC1 (GPIO32–GPIO39) sono preferibili. Evitare i pin ADC2 (GPIO0, 2, 4, 12–15, 25–27) se si usa il Wi-Fi.
> Alimentare a **3.3V**, non a 5V: l'uscita analogica resta nel range dell'ADC ESP32.

---

## Librerie necessarie

Nessuna libreria esterna richiesta — lettura tramite `analogRead()` nativo di Arduino/ESP32.

---

## Calibrazione

Il sensore non fornisce valori in percentuale direttamente: è necessario calibrare i valori limite:

1. **Valore in aria** (sensore completamente asciutto) → annotare il valore ADC, è `MOISTURE_DRY`
2. **Valore immerso** (lama in acqua o substrato saturo) → annotare il valore ADC, è `MOISTURE_WET`
3. Aggiornare i due valori in [`example/substrate_moisture.h`](example/substrate_moisture.h)

Lo sketch stampa sempre anche l'ADC grezzo, così la calibrazione si fa con lo stesso esempio.

---

## Note

- A differenza dei sensori resistivi a forchetta, la lama capacitiva non espone elettrodi al substrato: è più stabile nel tempo e meno soggetta a corrosione.
- Il valore ADC può variare tra moduli diversi: ricalibrate dopo ogni sostituzione.
- La lettura è in [`example/substrate_moisture.h`](example/substrate_moisture.h): `moistureBegin()` e `moistureRead()`.
