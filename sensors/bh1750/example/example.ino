/**
 * VasoVivo — GY-302 BH1750
 *
 * Stampa su seriale, ogni 5 secondi, la lettura di light_lux.h.
 */

#include "light_lux.h"

void setup() {
  Serial.begin(115200);
  lightBegin();
}

void loop() {
  Light light = lightRead();

  Serial.println("--- BH1750 ---");
  if (light.ok) {
    Serial.printf("Luce : %.0f lux\n", light.lux);
  } else {
    Serial.println("Luce : n/d");
  }

  Serial.println();
  delay(5000);
}
