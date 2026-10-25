# Wi-Fi e tavola illustrata

L'ESP32 crea una propria rete Wi-Fi e mostra le letture sulla [tavola illustrata](../../UI/index.html): una tavola con il disegno del barattolo EKLATANT che reagisce ai dati, le scale con le fasce ideali per il pioppino e un titolo che riassume lo stato in una frase. Non serve internet né un router.

Sensori, collegamenti e librerie sono gli stessi di [`wifi-page/`](../wifi-page/) e [`wifi-dashboard/`](../wifi-dashboard/). Cambia solo la pagina: usa il [UI Kit](../../UI/elements.html) condiviso (`css/vv-ui/`), interfaccia a tavola.

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
| `wifi-illustrated.ino` | Rete Wi-Fi, letture dei sensori, risposta JSON su `/api/readings` |
| `data/index.html` | La tavola illustrata, da [`UI/index.html`](../../UI/index.html) |
| `data/vasovivo.css` | Il toolkit [`css/vv-ui/`](../../css/vv-ui/) in un unico file |
| `data/vv-data.js` | Richiesta delle letture ([`js/vv-data.js`](../../js/vv-data.js)) |
| `data/vv-jar.js` | Disegno e aggiornamento della pagina ([`js/vv-jar.js`](../../js/vv-jar.js)) |
| `data/logo.png` | Logo ridotto |
| `build-data.sh` | Rigenera `data/` dopo aver modificato la UI |

La cartella `data/` è già pronta: `build-data.sh` serve solo se cambi la UI. Il glossario dei componenti è in [`UI/elements.html`](../../UI/elements.html).

---

## Uso

Vanno caricate **due cose**: lo sketch e la cartella `data/`. L'ordine non conta; la cartella resta in memoria anche quando ricarichi lo sketch.

1. Apri `wifi-illustrated/wifi-illustrated.ino` dalla repository completa e caricalo sulla scheda (ESP32 Dev Module).
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

Con gli strumenti installati dal board package `esp32` (le versioni nel percorso possono cambiare). Per la tabella partizioni predefinita, LittleFS parte da `0x290000` ed è grande `0x160000`:

```sh
TOOLS=~/Library/Arduino15/packages/esp32/tools   # Linux: ~/.arduino15/packages/esp32/tools

$TOOLS/mklittlefs/*/mklittlefs -c data -p 256 -b 4096 -s 0x160000 littlefs.bin
$TOOLS/esptool_py/*/esptool --chip esp32 --port /dev/cu.usbserial-0001 \
  write-flash 0x290000 littlefs.bin
```

Sostituisci la porta con quella della tua scheda.

---

## Cosa mostra la dashboard

- **Il disegno:** barattolo [IKEA EKLATANT](https://www.ikea.com/it/it/p/eklatant-contenitore-con-coperchio-vetro-trasparente-bambu-50621766/) da 4,2 l con coperchio bianco stampato. Gocce e nebbia seguono l'umidità dell'aria, i raggi la luce, il pulviscolo la CO₂ e i TVOC, l'alone la temperatura, il colore del substrato la sua umidità. I sensori sono sotto il coperchio, dentro il barattolo; il sensore capacitivo di umidità è infilato nel substrato.
- **Il titolo:** riassume lo stato in una frase, con un consiglio pratico se qualcosa è fuori fascia.
- **Le letture:** ogni valore ha una scala con la fascia ideale per il pioppino e un piccolo grafico degli ultimi minuti.
- **Il cartellino:** sensori trovati, rete, indirizzo, dispositivi collegati e tempo di accensione.

Su schermi grandi (desktop e tablet in orizzontale) la pagina sta in un solo schermo, senza scorrere. Su telefono resta a colonna unica.

Lo stato in alto indica **Connesso** quando le letture arrivano e **Non raggiungibile** se la scheda non risponde. Un valore che non si può leggere compare come `—`.

### Le letture in JSON

`http://192.168.4.1/api/readings` restituisce le stesse letture in formato JSON (stesso formato di `wifi-dashboard`).

---

## Modificare la dashboard

La pagina nasce da [`UI/index.html`](../../UI/index.html), che si apre anche dal computer con dati dimostrativi. Il kit dei componenti è in [`UI/elements.html`](../../UI/elements.html).

1. Modifica `UI/index.html`, i CSS in `css/vv-ui/` o `js/vv-jar.js`.
2. Esegui `./build-data.sh` da questa cartella: rigenera `data/`, toglie font esterni e link al sito e collega la pagina a `/api/readings`.
3. Ricarica la cartella `data/` sulla scheda.

---

## Personalizzare

- Nome e password della rete: `WIFI_NAME` e `WIFI_PASSWORD` in `wifi-illustrated.ino`.
- Calibrazione dell'umidità: `MOISTURE_DRY` e `MOISTURE_WET` in [`substrate_moisture.h`](../../sensors/capacitive-moisture/example/substrate_moisture.h).
- Fasce ideali delle letture: attributi `data-low` e `data-high` sugli elementi `.vv-reading` in `UI/index.html`.
