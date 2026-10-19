/**
 * VasoVivo — blocco di lettura umidità substrato (sensore capacitivo)
 *
 * moistureBegin()  prepara l'ADC
 * moistureRead()   restituisce il valore ADC grezzo e la percentuale
 *
 * Nessuna libreria esterna.
 * VCC 3.3V, GND, AOUT → GPIO 34.
 *
 * Calibrazione: annota l'ADC con il sensore asciutto in aria (DRY)
 * e con la lama immersa / substrato saturo (WET), poi aggiorna i due valori.
 */

#pragma once

const int MOISTURE_PIN = 34;
const int MOISTURE_DRY = 2800;
const int MOISTURE_WET = 900;

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
