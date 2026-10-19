/**
 * VasoVivo — blocco di lettura DHT11
 *
 * dht11Begin()  avvia il sensore
 * dht11Read()   restituisce temperatura e umidità dell'aria (valori interi)
 *
 * Librerie: DHT sensor library, Adafruit Unified Sensor (Adafruit)
 * VCC 3.3V, GND, DATA → GPIO 4.
 * Con il componente a 4 pin serve una resistenza 10kΩ tra DATA e VCC.
 * Alternativa al DHT22: si usa uno dei due, non entrambi.
 */

#pragma once

#include <DHT.h>

const int DHT11_PIN = 4;

struct DhtAir {
  bool ok;
  float tempC;
  float humRh;
};

DHT dht11(DHT11_PIN, DHT11);

void dht11Begin() {
  dht11.begin();
  Serial.println("[OK] DHT11 su GPIO 4");
}

DhtAir dht11Read() {
  DhtAir air;
  air.tempC = dht11.readTemperature();
  air.humRh = dht11.readHumidity();
  air.ok = !isnan(air.tempC) && !isnan(air.humRh);
  return air;
}
