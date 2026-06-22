/**
 * VasoVivo — ENS160 + AHT21
 *
 * Legge qualità dell'aria (eCO₂, TVOC) dal modulo ENS160
 * e temperatura/umidità dall'AHT21, usando quest'ultimo
 * per la compensazione interna dell'ENS160.
 *
 * Librerie richieste:
 *   - ScioSense_ENS160 (by ScioSense)
 *   - Adafruit AHTX0   (by Adafruit)
 *
 * Collegamento (I²C):
 *   VCC → 3.3V | GND → GND | SDA → GPIO21 | SCL → GPIO22
 */

#include <Wire.h>
#include <ScioSense_ENS160.h>
#include <Adafruit_AHTX0.h>

ScioSense_ENS160 ens160(ENS160_I2CADDR_1);  // 0x53
Adafruit_AHTX0 aht;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  if (!aht.begin()) {
    Serial.println("[ERRORE] AHT21 non trovato. Verifica il collegamento.");
    while (true);
  }
  Serial.println("[OK] AHT21 inizializzato.");

  if (!ens160.begin()) {
    Serial.println("[ERRORE] ENS160 non trovato. Verifica il collegamento.");
    while (true);
  }
  ens160.setMode(ENS160_OPMODE_STD);
  Serial.println("[OK] ENS160 inizializzato.");
  Serial.println("In attesa del periodo di riscaldamento (~60s)...");
  delay(60000);
}

void loop() {
  sensors_event_t hum_event, temp_event;
  aht.getEvent(&hum_event, &temp_event);

  float temp = temp_event.temperature;
  float hum  = hum_event.relative_humidity;

  // Compensazione ENS160 con i valori ambientali
  ens160.setTempHumComp(temp, hum);

  if (ens160.measure()) {
    Serial.println("--- Lettura ENS160 + AHT21 ---");
    Serial.print("Temperatura  : ");
    Serial.print(temp, 1);
    Serial.println(" °C");
    Serial.print("Umidità      : ");
    Serial.print(hum, 1);
    Serial.println(" % RH");
    Serial.print("eCO₂         : ");
    Serial.print(ens160.geteCO2());
    Serial.println(" ppm");
    Serial.print("TVOC         : ");
    Serial.print(ens160.getTVOC());
    Serial.println(" ppb");
    Serial.print("AQI (1-5)    : ");
    Serial.println(ens160.getAQI());
    Serial.println();
  }

  delay(5000);
}
