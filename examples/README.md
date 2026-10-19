# Esempi completi — VasoVivo

Sketch pronti da caricare, che mettono insieme più sensori e un modo per leggere i dati.

Ogni esempio include i blocchi di lettura degli [esempi singoli](../sensors/): un sensore si legge sempre con lo stesso codice, che sia da solo o insieme agli altri. Per questo gli esempi vanno aperti dalla repository completa, non copiando la sola cartella.

---

## Indice

| Cartella | Connessione | Sensori | Stato |
|---|---|---|---|
| [`wifi-page/`](wifi-page/) | Wi-Fi, pagina HTML senza stile | ENS160 + AHT21, BH1750, umidità substrato | Pronto |
| [`wifi-dashboard/`](wifi-dashboard/) | Wi-Fi, dashboard UI v1 (schede) | ENS160 + AHT21, BH1750, umidità substrato | Pronto |
| [`wifi-illustrated/`](wifi-illustrated/) | Wi-Fi, dashboard UI v2 (tavola illustrata) | ENS160 + AHT21, BH1750, umidità substrato | Pronto |
| — | Bluetooth | — | In preparazione |
| — | Bot Telegram | — | In preparazione |

---

## Requisiti comuni

- **Scheda:** ESP32 (testato su ESP32-WROOM-32), board package `esp32` by Espressif
- **IDE:** Arduino IDE 2.x
- Le librerie dei sensori usati, indicate nel README di ogni esempio

`wifi-page` è il punto di partenza: tutto sta nello sketch. `wifi-dashboard` e `wifi-illustrated` usano gli stessi sensori e collegamenti, ma la pagina va caricata a parte nella memoria della scheda (LittleFS): la prima con il toolkit UI v1, la seconda con la tavola illustrata UI v2.
