/**
 * VasoVivo — DS18B20 (temperatura substrato)
 *
 * Stampa su seriale, ogni 5 secondi, la lettura di substrate_temperature.h.
 */

#include "substrate_temperature.h"

void setup() {
  Serial.begin(115200);
  substrateTempBegin();
}

void loop() {
  SubstrateTemp substrate = substrateTempRead();

  Serial.println("--- DS18B20 ---");
  if (substrate.ok) {
    Serial.printf("Temperatura substrato : %.2f °C\n", substrate.tempC);
  } else {
    Serial.println("Temperatura substrato : n/d");
  }

  Serial.println();
  delay(5000);
}
