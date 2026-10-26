# Wi-Fi e pagina HTML

L'ESP32-WROOM crea una propria rete Wi-Fi e mostra le letture dei sensori su una pagina web, senza stile, che si aggiorna da sola ogni 5 secondi. Non serve internet né un router. È l'esempio più semplice per verificare cablaggio e letture; allo stand si usano anche le dashboard con UI Kit.

---

## Sensori

| Sensore | Misure | Blocco |
|---|---|---|
| [ENS160 + AHT21](../../sensors/ens160-aht21/) | Temperatura, umidità aria, CO₂eq, TVOC, qualità dell'aria | `air_quality.h` |
| [GY-302 BH1750](../../sensors/bh1750/) | Luce in lux | `light_lux.h` |
| [Sensore capacitivo](../../sensors/capacitive-moisture/) | Umidità substrato | `substrate_moisture.h` |

---

## Collegamenti

I moduli I²C a **3.3V** e GND. Il sensore capacitivo v1.2 va a **5V** (pin VIN): l'uscita analogica resta intorno ai 3 V.

| Modulo | Pin modulo | Pin ESP32 |
|---|---|---|
| ENS160 + AHT21 | SDA / SCL | GPIO 21 / GPIO 22 |
| | CS, ADD | 3.3V |
| | INT, VN | non collegati |
| GY-302 BH1750 | SDA / SCL | GPIO 21 / GPIO 22 |
| | ADDR | GND |
| Sensore capacitivo | AOUT | GPIO 34 |

I due moduli I²C stanno in parallelo sugli stessi SDA e SCL.

---

## Librerie

Dal Library Manager di Arduino IDE:

- `ScioSense_ENS16x` by ScioSense
- `Adafruit AHTX0` by Adafruit
- `BH1750` by Christopher Laws

---

## Uso

1. Apri `wifi-page/wifi-page.ino` dalla repository completa e caricalo sulla scheda (ESP32-WROOM, board package `esp32`).
2. Collegati alla rete **VasoVivo**, password **VasoVivo123**.
3. Apri **http://192.168.4.1** nel browser. Su questa rete non c'è internet: l'indirizzo va digitato.

Sul monitor seriale, a 115200 baud, l'avvio indica quali sensori sono stati trovati.

---

## Cosa mostra la pagina

- **Aria nel barattolo:** temperatura, umidità, CO₂ equivalente, TVOC e qualità dell'aria da 1 (ottima) a 5 (pessima), con lo stato dell'ENS160. Nei primi minuti l'ENS160 è in riscaldamento e i valori dei gas non sono ancora affidabili.
- **Luce:** intensità in lux.
- **Substrato:** umidità in percentuale e valore ADC grezzo, con i due estremi di calibrazione usati.
- **Sensori:** quali sono stati trovati all'avvio.
- **Scheda:** nome della rete, indirizzo e dispositivi collegati.

Un valore che non si può leggere compare come `n/d`.

---

## Personalizzare

- Nome e password della rete: `WIFI_NAME` e `WIFI_PASSWORD` in `wifi-page.ino`.
- Calibrazione dell'umidità: `MOISTURE_DRY` e `MOISTURE_WET` in [`substrate_moisture.h`](../../sensors/capacitive-moisture/example/substrate_moisture.h).
