/**
 * VasoVivo — Sensore capacitivo (umidità substrato)
 *
 * Stampa su seriale, ogni 5 secondi, la lettura di substrate_moisture.h.
 */

#include "substrate_moisture.h"

void setup() {
  Serial.begin(115200);
  moistureBegin();
}

void loop() {
  Moisture moisture = moistureRead();

  Serial.println("--- Umidità substrato ---");
  Serial.printf("ADC grezzo : %d\n", moisture.raw);
  Serial.printf("Umidità    : %d %%\n", moisture.percent);
  Serial.println();

  delay(5000);
}
