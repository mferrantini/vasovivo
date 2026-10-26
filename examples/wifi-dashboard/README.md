# Wi-Fi e dashboard a schede

L'ESP32-WROOM crea una propria rete Wi-Fi e mostra le letture dei sensori sulla [dashboard a schede](../../UI/schede.html): metriche animate, barre di livello, stato dei sensori e aggiornamento ogni 5 secondi. Non serve internet né un router.

Sensori, collegamenti e librerie sono gli stessi di [`wifi-page/`](../wifi-page/). Cambia solo la pagina: invece di essere scritta nello sketch, sta nella memoria della scheda (LittleFS) e chiede i dati allo sketch in formato JSON.

Per la tavola illustrata vedi [`wifi-illustrated/`](../wifi-illustrated/).

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

LittleFS e WebServer sono già inclusi nel board package `esp32`.

---

## Contenuto della cartella

| File | Cosa contiene |
|---|---|
| `wifi-dashboard.ino` | Rete Wi-Fi, letture dei sensori, risposta JSON su `/api/readings` |
| `data/index.html` | La dashboard a schede, generata da [`UI/schede.html`](../../UI/schede.html) |
| `data/vasovivo.css` | Il toolkit [`css/vv-ui/`](../../css/vv-ui/) in un unico file |
| `data/vv-settings.js` | Lingua, specie e soglie ([`js/vv-settings.js`](../../js/vv-settings.js)) |
| `data/vv-data.js` | Richiesta delle letture ([`js/vv-data.js`](../../js/vv-data.js)) |
| `data/vv-dashboard.js` | Aggiornamento della pagina ([`js/vv-dashboard.js`](../../js/vv-dashboard.js)) |
| `data/logo.png` | Logo ridotto |
| `build-data.sh` | Rigenera `data/` dopo aver modificato la UI |

La cartella `data/` è già pronta: `build-data.sh` serve solo se cambi la UI.

---

## Uso

Vanno caricate **due cose**: lo sketch e la cartella `data/`. L'ordine non conta; la cartella resta in memoria anche quando ricarichi lo sketch.

1. Apri `wifi-dashboard/wifi-dashboard.ino` dalla repository completa e caricalo sulla scheda (ESP32-WROOM, board package `esp32`).
2. Carica la cartella `data/` in LittleFS (vedi sotto).
3. Collegati alla rete **VasoVivo**, password **VasoVivo123**.
4. Apri **http://192.168.4.1** nel browser. Su questa rete non c'è internet: l'indirizzo va digitato.

Sul monitor seriale, a 115200 baud, l'avvio indica quali sensori sono stati trovati e se la dashboard è presente:

```
[OK] AHT21
[OK] ENS160 @ 0x53
[OK] BH1750
[OK] Umidità substrato su GPIO 34
[OK] Dashboard trovata in LittleFS
[OK] Rete VasoVivo — pagina http://192.168.4.1
```

Se manca la cartella `data/`, l'avvio lo segnala con `[ERRORE] Dashboard assente` e la pagina mostra un messaggio di testo.

### Caricare `data/` da Arduino IDE

1. Scarica il file `.vsix` più recente di [arduino-littlefs-upload](https://github.com/earlephilhower/arduino-littlefs-upload/releases).
2. Copialo in `~/.arduinoIDE/plugins/` (crea la cartella se non c'è) e riavvia Arduino IDE.
3. Chiudi il monitor seriale, apri lo sketch e premi **Ctrl+Shift+P** (**Cmd+Shift+P** su Mac).
4. Scegli **Upload LittleFS to Pico/ESP8266/ESP32**.

### Caricare `data/` da riga di comando

Con gli strumenti installati dal board package `esp32` (le versioni nel percorso possono cambiare). Gli indirizzi sotto valgono per lo schema partizioni **predefinito** di Arduino IDE (`Default 4MB with spiffs` / LittleFS equivalente): LittleFS parte da `0x290000` ed è grande `0x160000`. Se cambi schema partizioni, aggiorna offset e dimensione.

```sh
TOOLS=~/Library/Arduino15/packages/esp32/tools   # Linux: ~/.arduino15/packages/esp32/tools

$TOOLS/mklittlefs/*/mklittlefs -c data -p 256 -b 4096 -s 0x160000 littlefs.bin
$TOOLS/esptool_py/*/esptool --chip esp32 --port /dev/cu.usbserial-0001 \
  write-flash 0x290000 littlefs.bin
```

Sostituisci la porta con quella della tua scheda. Non committare `littlefs.bin`: è solo un artefatto di flash.

---

## Cosa mostra la dashboard

- **Aria nel barattolo:** temperatura, umidità, CO₂ equivalente, TVOC e qualità dell'aria da 1 (ottima) a 5 (pessima). Nei primi minuti l'ENS160 è in riscaldamento e i valori dei gas non sono ancora affidabili.
- **Luce:** intensità in lux.
- **Substrato:** umidità in percentuale e valore ADC grezzo.
- **Sensori:** quali sono stati trovati all'avvio.
- **Scheda:** nome della rete, indirizzo, dispositivi collegati e tempo di accensione.

Lo stato in alto indica **Connesso** quando le letture arrivano e **Non raggiungibile** se la scheda non risponde; in quel caso i valori restano visibili ma attenuati. Un valore che non si può leggere compare come `—`.

### Le letture in JSON

`http://192.168.4.1/api/readings` restituisce le stesse letture in formato JSON, utili per collegare altri programmi:

```json
{
  "uptime": 120,
  "air": { "tempC": 22.4, "humRh": 81.0, "eco2": 650, "tvoc": 120, "aqi": 2, "aqiText": "buona", ... },
  "light": { "lux": 310 },
  "substrate": { "raw": 3054, "percent": 55, "dry": 4095, "wet": 2203, "pin": 34 },
  "wifi": { "name": "VasoVivo", "ip": "192.168.4.1", "clients": 1 }
}
```

I valori non disponibili valgono `null`. `dry` e `wet` sono i limiti di calibrazione del sensore capacitivo.

---

## Modificare la dashboard

La pagina nasce da [`UI/schede.html`](../../UI/schede.html), che si apre anche dal computer con dati dimostrativi.

1. Modifica `UI/schede.html`, i CSS in `css/vv-ui/` o gli script in `js/` (incluso `vv-settings.js`).
2. Esegui `./build-data.sh` da questa cartella: rigenera `data/`, toglie font esterni e link al sito (sulla rete dell'ESP32 non c'è internet) e collega la pagina a `/api/readings`.
3. Ricarica la cartella `data/` sulla scheda.

---

## Personalizzare

- Nome e password della rete: `WIFI_NAME` e `WIFI_PASSWORD` in `wifi-dashboard.ino`.
- Calibrazione dell'umidità: `MOISTURE_DRY` e `MOISTURE_WET` in [`substrate_moisture.h`](../../sensors/capacitive-moisture/example/substrate_moisture.h).
- Lingua (it/en), nome specie e soglie delle fasce: switch bandiere e pulsante impostazioni in alto a destra nella pagina (salvati nel browser in `localStorage`). Le fasce di default restano anche negli attributi `data-low` / `data-high` del markup.
