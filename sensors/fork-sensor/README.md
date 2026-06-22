# Sensore a forchetta — Umidità substrato

Sensore resistivo a due elettrodi (detto "a forchetta" o "soil moisture sensor") che misura l'**umidità del substrato** sfruttando la variazione di conduttività elettrica del materiale. Più il substrato è umido, minore è la resistenza tra i due elettrodi e più alto è il valore letto.

Nel contesto di **VasoVivo**, viene inserito direttamente nella zolletta di substrato per monitorare se le condizioni di umidità sono ottimali per la crescita del micelio.

---

## Parametri misurati

| Parametro | Tipo | Output |
|---|---|---|
| Umidità substrato | Analogico | Valore grezzo ADC (0 – 4095 su ESP32 a 12 bit) |

> Alcuni moduli forniscono anche un output digitale (D0) con soglia regolabile tramite potenziometro. Lo sketch usa l'uscita analogica (A0) per una lettura più granulare.

---

## Collegamento all'ESP32

| Pin modulo | Pin ESP32 |
|---|---|
| VCC | 3.3V |
| GND | GND |
| A0 (analogico) | GPIO 34 (o altro pin ADC) |
| D0 (digitale, opz.) | GPIO 35 (opzionale) |

> Su ESP32, i pin ADC1 (GPIO32–GPIO39) sono preferibili. Evitare i pin ADC2 (GPIO0, 2, 4, 12–15, 25–27) se si usa il Wi-Fi.

---

## Librerie necessarie

Nessuna libreria esterna richiesta — lettura tramite `analogRead()` nativo di Arduino/ESP32.

---

## Calibrazione

Il sensore non fornisce valori in percentuale direttamente: è necessario calibrare i valori limite:

1. **Valore in aria** (sensore completamente asciutto) → annotare il valore ADC massimo
2. **Valore in acqua** (sensore immerso) → annotare il valore ADC minimo
3. Usare `map()` per convertire il range ADC in percentuale

Vedere lo sketch di esempio per un'implementazione pratica.

---

## Note

- L'alimentazione continua accelera la corrosione degli elettrodi: per applicazioni a lungo termine, valutare di alimentare il sensore solo durante la lettura (tramite un pin digitale come VCC).
- Il valore ADC può variare tra schede diverse: ricalibrate dopo ogni sostituzione.
