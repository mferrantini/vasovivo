# DS18B20 — Temperatura substrato

Sonda di temperatura digitale **impermeabile**, ideale per la misura diretta all'interno del substrato. Comunica tramite il protocollo **1-Wire**, che consente di collegare più sensori sullo stesso pin utilizzando indirizzi univoci a 64 bit.

Nel contesto di **VasoVivo**, viene inserita direttamente nella zolletta per monitorare la temperatura interna del substrato, complementare alla temperatura dell'aria misurata da DHT22 o ENS160+AHT21.

---

## Parametri misurati

| Parametro | Unità | Range | Precisione |
|---|---|---|---|
| Temperatura | °C | -55 – 125 | ±0.5 °C (range -10 – 85 °C) |

---

## Collegamento all'ESP32

Il DS18B20 (versione impermeabile a cavo) ha 3 fili:

| Colore cavo | Segnale | Pin ESP32 | Note |
|---|---|---|---|
| Rosso | VCC | 3.3V | |
| Nero | GND | GND | |
| Giallo / Bianco | DATA | GPIO 4 | Resistenza pull-up **4.7kΩ** verso VCC (obbligatoria) |

> La resistenza pull-up da 4.7 kΩ tra DATA e VCC è **obbligatoria** per il corretto funzionamento del protocollo 1-Wire.

---

## Librerie necessarie

- **OneWire** by Paul Stoffregen — installabile dal Library Manager
- **DallasTemperature** by Miles Burton — installabile dal Library Manager

---

## Note

- La risoluzione è configurabile: 9, 10, 11 o 12 bit. A 12 bit (default) la conversione richiede ~750 ms.
- Con più sensori DS18B20 sullo stesso bus, ogni sensore ha un indirizzo univoco: lo sketch di esempio gestisce il caso con un singolo sensore. Per più sensori, consultare la libreria DallasTemperature.
- La versione impermeabile è incapsulata in acciaio inox: perfetta per il contatto diretto con il substrato umido.
