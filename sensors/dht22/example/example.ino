/**
 * VasoVivo — DHT22
 *
 * Stampa su seriale, ogni 5 secondi, la lettura di air_dht22.h.
 */

#include "air_dht22.h"

void setup() {
  Serial.begin(115200);
  dht22Begin();
}

void loop() {
  DhtAir air = dht22Read();

  Serial.println("--- DHT22 ---");
  if (air.ok) {
    Serial.printf("Temperatura : %.1f °C\n", air.tempC);
    Serial.printf("Umidità     : %.1f %%\n", air.humRh);
  } else {
    Serial.println("[ERRORE] Lettura fallita: controlla il collegamento");
  }

  Serial.println();
  delay(5000);
}
