/**
 * VasoVivo — DHT11
 *
 * Stampa su seriale, ogni 5 secondi, la lettura di air_dht11.h.
 */

#include "air_dht11.h"

void setup() {
  Serial.begin(115200);
  dht11Begin();
}

void loop() {
  DhtAir air = dht11Read();

  Serial.println("--- DHT11 ---");
  if (air.ok) {
    Serial.printf("Temperatura : %.0f °C\n", air.tempC);
    Serial.printf("Umidità     : %.0f %%\n", air.humRh);
  } else {
    Serial.println("[ERRORE] Lettura fallita: controlla il collegamento");
  }

  Serial.println();
  delay(5000);
}
