/**
 * VasoVivo — DHT11
 *
 * Legge temperatura e umidità relativa dell'aria.
 * Alternativa economica al DHT22 (precisione ±2 °C / ±5 % RH).
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
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  Serial.println("[OK] DHT11 inizializzato.");
}

void loop() {
  delay(2000);

  float hum  = dht.readHumidity();
  float temp = dht.readTemperature();

  if (isnan(hum) || isnan(temp)) {
    Serial.println("[ERRORE] Lettura fallita. Verifica il collegamento.");
    return;
  }

  Serial.println("--- Lettura DHT11 ---");
  Serial.print("Temperatura : ");
  Serial.print(temp, 0);  // DHT11 restituisce valori interi
  Serial.println(" °C");
  Serial.print("Umidità     : ");
  Serial.print(hum, 0);
  Serial.println(" % RH");
  Serial.println();
}
