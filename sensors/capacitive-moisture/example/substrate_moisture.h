/**
 * VasoVivo — blocco di lettura umidità substrato (sensore capacitivo)
 *
 * moistureBegin()  prepara l'ADC
 * moistureRead()   restituisce il valore ADC grezzo e la percentuale
 *
 * Nessuna libreria esterna.
 * VCC 5V (VIN dell'ESP32), GND, AOUT → GPIO 34.
 * Il v1.2 non parte a 3,3V; l'uscita resta comunque entro circa 3 V.
 *
 * Calibrazione sul modulo v1.2, lama inserita a metà:
 * aria 4095 = 0 %, substrato umido 3054 = 55 %, da 2203 in giù = 100 %.
 */

#pragma once

const int MOISTURE_PIN = 34;
const int MOISTURE_DRY = 4095;
const int MOISTURE_WET = 2203;

struct Moisture {
  int raw;       // 0 – 4095
  int percent;   // 0 secco … 100 bagnato
};

void moistureBegin() {
  analogReadResolution(12);
  Serial.println("[OK] Umidità substrato su GPIO 34");
}

Moisture moistureRead() {
  Moisture moisture;
  moisture.raw = analogRead(MOISTURE_PIN);
  moisture.percent = map(moisture.raw, MOISTURE_DRY, MOISTURE_WET, 0, 100);
  moisture.percent = constrain(moisture.percent, 0, 100);
  return moisture;
}
