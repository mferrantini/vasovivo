/**
 * VasoVivo — DS18B20
 *
 * Legge la temperatura del substrato tramite sonda impermeabile
 * su protocollo 1-Wire.
 *
 * Librerie richieste:
 *   - OneWire         (by Paul Stoffregen)
 *   - DallasTemperature (by Miles Burton)
 *
 * Collegamento:
 *   Rosso  → 3.3V
 *   Nero   → GND
 *   Giallo → GPIO4  +  resistenza pull-up 4.7kΩ verso 3.3V (OBBLIGATORIA)
 */

#include <OneWire.h>
#include <DallasTemperature.h>

#define ONE_WIRE_PIN 4

OneWire oneWire(ONE_WIRE_PIN);
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(115200);
  sensors.begin();

  int deviceCount = sensors.getDeviceCount();
  Serial.print("[OK] DS18B20 inizializzato. Sensori trovati sul bus: ");
  Serial.println(deviceCount);

  if (deviceCount == 0) {
    Serial.println("[ERRORE] Nessun sensore trovato. Verifica il collegamento e la resistenza pull-up.");
    while (true);
  }
}

void loop() {
  // Richiede la conversione a tutti i sensori sul bus
  sensors.requestTemperatures();

  // Legge il primo sensore (indice 0)
  float tempC = sensors.getTempCByIndex(0);

  if (tempC == DEVICE_DISCONNECTED_C) {
    Serial.println("[ERRORE] Sensore disconnesso.");
  } else {
    Serial.println("--- Lettura DS18B20 ---");
    Serial.print("Temperatura substrato : ");
    Serial.print(tempC, 2);
    Serial.println(" °C");
    Serial.println();
  }

  delay(5000);
}
