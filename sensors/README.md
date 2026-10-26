# Sensori — VasoVivo

Questa cartella raccoglie gli esempi di codice per i sensori integrabili nel progetto **VasoVivo**.
Ogni sottocartella corrisponde a un sensore o modulo specifico e contiene:

- `README.md` — descrizione, parametri misurati, schema di collegamento all'ESP32, librerie necessarie e note di utilizzo
- `example/<blocco>.h` — il blocco di lettura del sensore
- `example/example.ino` — sketch che usa il blocco e stampa i valori su seriale ogni 5 secondi

---

## Indice sensori

| Cartella | Sensore | Parametri | Blocco |
|---|---|---|---|
| [`ens160-aht21/`](ens160-aht21/) | ENS160 + AHT21 | CO₂eq, TVOC, AQI, temperatura, umidità | `air_quality.h` |
| [`dht22/`](dht22/) | DHT22 | Temperatura + umidità aria | `air_dht22.h` |
| [`dht11/`](dht11/) | DHT11 | Temperatura + umidità aria | `air_dht11.h` |
| [`capacitive-moisture/`](capacitive-moisture/) | Sensore capacitivo | Umidità substrato | `substrate_moisture.h` |
| [`ds18b20/`](ds18b20/) | DS18B20 | Temperatura substrato | `substrate_temperature.h` |
| [`ldr/`](ldr/) | Fotoresistenza LDR | Luminosità (indicativa) | `light_ldr.h` |
| [`bh1750/`](bh1750/) | GY-302 BH1750FVI | Intensità luminosa (lux) | `light_lux.h` |

---

## Come sono fatti i blocchi

Ogni blocco ha la stessa forma:

1. in cima i **pin** e le eventuali costanti di calibrazione, da modificare se serve;
2. una funzione **`…Begin()`** da chiamare in `setup()`, che stampa su seriale se il sensore è stato trovato;
3. una funzione **`…Read()`** che restituisce una struttura con i valori e un campo `ok` quando la lettura può fallire.

```cpp
#include "light_lux.h"

void setup() {
  Serial.begin(115200);
  lightBegin();
}

void loop() {
  Light light = lightRead();
  if (light.ok) {
    Serial.println(light.lux);
  }
  delay(5000);
}
```

Gli [esempi completi](../examples/) includono gli stessi file: la lettura dei sensori è identica a quella degli esempi singoli.

---

## Mappa pin

I pin sono scelti in modo che tutti i sensori possano stare sulla stessa scheda.

| Pin ESP32 | Sensore |
|---|---|
| GPIO 21 (SDA), GPIO 22 (SCL) | ENS160 + AHT21, BH1750 (stesso bus I²C) |
| GPIO 34 | Sensore capacitivo (AOUT) |
| GPIO 35 | Fotoresistenza LDR |
| GPIO 4 | DHT22 oppure DHT11 |
| GPIO 18 | DS18B20 |

I moduli I²C e le sonde digitali sono alimentati a **3.3V**. Il sensore capacitivo v1.2 va a **5V** (pin VIN).

---

## Requisiti comuni

- **Scheda:** ESP32-WROOM
- **IDE:** Arduino IDE 2.x
- **Board package:** `esp32` by Espressif — installabile dal Board Manager con URL:
  ```
  https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
  ```

Le librerie specifiche per ogni sensore sono indicate nel rispettivo `README.md`.
