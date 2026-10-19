/**
 * VasoVivo — ENS160 + AHT21
 *
 * Stampa su seriale, ogni 5 secondi, la lettura di air_quality.h.
 */

#include "air_quality.h"

void setup() {
  Serial.begin(115200);
  airQualityBegin();
}

void loop() {
  AirQuality air = airQualityRead();

  Serial.println("--- ENS160 + AHT21 ---");

  if (air.climateOk) {
    Serial.printf("Temperatura : %.1f °C\n", air.tempC);
    Serial.printf("Umidità     : %.1f %%\n", air.humRh);
  } else {
    Serial.println("Temperatura e umidità: n/d");
  }

  if (air.gasOk) {
    Serial.printf("eCO2        : %d ppm\n", air.eco2);
    Serial.printf("TVOC        : %d ppb\n", air.tvoc);
    Serial.printf("AQI (1-5)   : %d, %s\n", air.aqi, airQualityAqiText(air.aqi));
    Serial.printf("Stato       : %s\n", airQualityValidityText(air.validity));
  } else {
    Serial.println("eCO2, TVOC, AQI: n/d");
  }

  Serial.println();
  delay(5000);
}
