/**
 * VasoVivo — DHT22
 *
 * Legge temperatura e umidità relativa dell'aria.
 * Sensore consigliato per precisione ±0.5 °C / ±2 % RH.
 *
 * Librerie richieste:
 *   - DHT sensor library (by Adafruit)
 *   - Adafruit Unified Sensor (by Adafruit)
 *
 * Collegamento:
 *   VCC → 3.3V | GND → GND | DATA → GPIO4
 */

#include <DHT.h>

#define DHTPIN  4
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println("[OK] DHT22 inizializzato.");
}

void loop() {
  // Il DHT22 richiede almeno 2s tra una lettura e l'altra
  delay(2000);

  float hum  = dht.readHumidity();
  float temp = dht.readTemperature();

  if (isnan(hum) || isnan(temp)) {
    Serial.println("[ERRORE] Lettura fallita. Verifica il collegamento.");
    return;
  }

  Serial.println("--- Lettura DHT22 ---");
  Serial.print("Temperatura : ");
  Serial.print(temp, 1);
  Serial.println(" °C");
  Serial.print("Umidità     : ");
  Serial.print(hum, 1);
  Serial.println(" % RH");
  Serial.println();
}
