/**
 * VasoVivo — Fotoresistenza (LDR)
 *
 * Stampa su seriale, ogni 5 secondi, la lettura di light_ldr.h.
 */

#include "light_ldr.h"

void setup() {
  Serial.begin(115200);
  ldrBegin();
}

void loop() {
  LdrLight light = ldrRead();

  Serial.println("--- Fotoresistenza ---");
  Serial.printf("ADC grezzo : %d\n", light.raw);
  Serial.printf("Luce       : %d %%\n", light.percent);

  Serial.println();
  delay(5000);
}
