# Sensori — VasoVivo

Questa cartella raccoglie gli esempi di codice per i sensori integrabili nel progetto **VasoVivo**.
Ogni sottocartella corrisponde a un sensore o modulo specifico e contiene:

- `README.md` — descrizione, parametri misurati, schema di collegamento all'ESP32, librerie necessarie e note di utilizzo
- `example/example.ino` — sketch Arduino-compatibile per ESP32 con lettura e output seriale dei valori

---

## Indice sensori

| Cartella | Sensore | Parametri | Note |
|---|---|---|---|
| [`ens160-aht21/`](ens160-aht21/) | ENS160 + AHT21 | CO₂eq, TVOC, temperatura, umidità | Modulo combinato, consigliato |
| [`dht22/`](dht22/) | DHT22 | Temperatura + umidità aria | Alternativa consigliata |
| [`dht11/`](dht11/) | DHT11 | Temperatura + umidità aria | Alternativa economica |
| [`fork-sensor/`](fork-sensor/) | Sensore a forchetta | Umidità substrato | Lettura analogica |
| [`ds18b20/`](ds18b20/) | DS18B20 | Temperatura substrato | Sonda impermeabile, bus 1-Wire |
| [`ldr/`](ldr/) | Fotoresistenza LDR | Luminosità ambientale | Lettura analogica |

---

## Requisiti comuni

- **Scheda:** ESP32 (testato su ESP32-WROOM-32)
- **IDE:** Arduino IDE 2.x o PlatformIO
- **Board package:** `esp32` by Espressif — installabile dal Board Manager con URL:
  ```
  https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
  ```

Le librerie specifiche per ogni sensore sono indicate nel rispettivo `README.md`.
