/**
 * VasoVivo — blocco di lettura DHT22
 *
 * dht22Begin()  avvia il sensore
 * dht22Read()   restituisce temperatura e umidità dell'aria
 *
 * Librerie: DHT sensor library, Adafruit Unified Sensor (Adafruit)
 * VCC 3.3V, GND, DATA → GPIO 4.
 * Con il componente a 4 pin serve una resistenza 10kΩ tra DATA e VCC.
 * Il sensore accetta al massimo una lettura ogni 2 secondi.
 */

#pragma once

#include <DHT.h>

const int DHT22_PIN = 4;

struct DhtAir {
  bool ok;
  float tempC;
  float humRh;
};

DHT dht22(DHT22_PIN, DHT22);

void dht22Begin() {
  dht22.begin();
  Serial.println("[OK] DHT22 su GPIO 4");
}

DhtAir dht22Read() {
  DhtAir air;
  air.tempC = dht22.readTemperature();
  air.humRh = dht22.readHumidity();
  air.ok = !isnan(air.tempC) && !isnan(air.humRh);
  return air;
}
