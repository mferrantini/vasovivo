# Fotoresistenza (LDR) — Luminosità

Una **fotoresistenza** (Light Dependent Resistor, LDR) è un componente passivo la cui resistenza elettrica diminuisce all'aumentare dell'intensità luminosa. Collegata in un partitore di tensione con una resistenza fissa, fornisce un segnale analogico proporzionale alla luce ambientale.

Nel contesto di **VasoVivo**, misura la quantità di luce ambientale a cui è esposto il barattolo: utile per correlare le condizioni di illuminazione con l'andamento della crescita e per verificare l'esposizione nel tempo.

---

## Parametri misurati

| Parametro | Tipo | Output |
|---|---|---|
| Luminosità ambientale | Analogico | Valore grezzo ADC (0 – 4095 su ESP32 a 12 bit) |

> Il valore non è calibrato in lux. Per una misura in lux, valutare un sensore digitale dedicato come il BH1750.

---

## Schema di collegamento (partitore di tensione)

```
3.3V ──┬── LDR ──┬── GPIO34
       │         │
      GND       10kΩ
                 │
                GND
```

Oppure:

| Componente | Collegamento |
|---|---|
| LDR — pin 1 | 3.3V |
| LDR — pin 2 | GPIO 34 + resistenza 10kΩ verso GND |

> La resistenza da 10kΩ forma il partitore: più luce = minore resistenza LDR = tensione più alta sul pin ADC.

---

## Librerie necessarie

Nessuna libreria esterna richiesta — lettura tramite `analogRead()` nativo di Arduino/ESP32.

---

## Note

- Il valore ADC è **inversamente proporzionale alla resistenza** dell'LDR: più luce → valore più alto.
- La risposta non è lineare e varia tra esemplari diversi: adatta le soglie nello sketch in base all'ambiente di utilizzo.
- Per evitare interferenze, evitare di leggere l'ADC mentre il Wi-Fi trasmette (usa ADC1, GPIO32–GPIO39).
