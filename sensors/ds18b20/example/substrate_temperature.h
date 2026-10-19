/**
 * VasoVivo — blocco di lettura DS18B20 (temperatura substrato)
 *
 * substrateTempBegin()  cerca la sonda e stampa lo stato su seriale
 * substrateTempRead()   restituisce la temperatura in °C
 *
 * Librerie: OneWire by Paul Stoffregen, DallasTemperature by Miles Burton
 * Rosso 3.3V, nero GND, giallo → GPIO 18.
 * Resistenza 4.7kΩ tra giallo e 3.3V: obbligatoria.
 */

#pragma once

#include <OneWire.h>
#include <DallasTemperature.h>

const int SUBSTRATE_TEMP_PIN = 18;

struct SubstrateTemp {
  bool ok;
  float tempC;
};

OneWire oneWire(SUBSTRATE_TEMP_PIN);
DallasTemperature ds18b20(&oneWire);

bool substrateTempBegin() {
  ds18b20.begin();
  bool found = ds18b20.getDeviceCount() > 0;
  Serial.println(found ? "[OK] DS18B20" : "[ERRORE] DS18B20 non trovato");
  return found;
}

SubstrateTemp substrateTempRead() {
  SubstrateTemp substrate;
  ds18b20.requestTemperatures();
  substrate.tempC = ds18b20.getTempCByIndex(0);
  substrate.ok = substrate.tempC != DEVICE_DISCONNECTED_C;
  return substrate;
}
