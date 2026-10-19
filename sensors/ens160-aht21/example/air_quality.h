/**
 * VasoVivo — blocco di lettura ENS160 + AHT21
 *
 * airQualityBegin()  avvia i due chip e stampa lo stato su seriale
 * airQualityRead()   restituisce temperatura, umidità, eCO2, TVOC, AQI
 *
 * Librerie: ScioSense_ENS16x, Adafruit AHTX0
 * I2C: SDA GPIO 21, SCL GPIO 22, alimentazione 3.3V
 * CS a 3.3V (modalità I2C). ADD a 3.3V → 0x53, ADD a GND → 0x52.
 */

#pragma once

#include <Wire.h>
#include <ScioSense_ENS16x.h>
#include <Adafruit_AHTX0.h>

const int I2C_SDA_PIN = 21;
const int I2C_SCL_PIN = 22;

struct AirQuality {
  bool climateOk;   // temperatura e umidità valide (AHT21)
  float tempC;
  float humRh;

  bool gasOk;       // eCO2, TVOC e AQI letti (ENS160)
  int eco2;         // ppm
  int tvoc;         // ppb
  int aqi;          // 1 ottima … 5 pessima
  int validity;     // 0 normale, 1 riscaldamento, 2 primo avvio, 3 non valido
};

Adafruit_AHTX0 aht21;
ENS160 ens160;
bool aht21Found = false;
bool ens160Found = false;

bool ens160Start(uint8_t address) {
  ens160.begin(&Wire, address);
  if (!ens160.init()) {
    return false;
  }
  ens160.startStandardMeasure();
  Serial.print("[OK] ENS160 @ 0x");
  Serial.println(address, HEX);
  return true;
}

bool airQualityBegin() {
  Wire.begin(I2C_SDA_PIN, I2C_SCL_PIN);

  aht21Found = aht21.begin();
  Serial.println(aht21Found ? "[OK] AHT21" : "[ERRORE] AHT21 non trovato");

  ens160Found = ens160Start(0x53) || ens160Start(0x52);
  if (!ens160Found) {
    Serial.println("[ERRORE] ENS160 non trovato");
  }

  return aht21Found && ens160Found;
}

const char* airQualityAqiText(int aqi) {
  switch (aqi) {
    case 1: return "ottima";
    case 2: return "buona";
    case 3: return "discreta";
    case 4: return "scarsa";
    case 5: return "pessima";
    default: return "n/d";
  }
}

const char* airQualityValidityText(int validity) {
  switch (validity) {
    case 0: return "valori affidabili";
    case 1: return "in riscaldamento (~3 min)";
    case 2: return "primo avvio (fino a 1 ora)";
    default: return "valori non validi";
  }
}

AirQuality airQualityRead() {
  AirQuality air = {};

  if (aht21Found) {
    sensors_event_t humidity, temperature;
    aht21.getEvent(&humidity, &temperature);
    air.tempC = temperature.temperature;
    air.humRh = humidity.relative_humidity;
    air.climateOk = !isnan(air.tempC) && !isnan(air.humRh);
  }

  if (ens160Found) {
    if (air.climateOk) {
      ens160.writeCompensation(
        Ens16x_CalcTempInFromCelsius(air.tempC),
        Ens16x_CalcRhIn(air.humRh)
      );
    }
    if (ens160.update() == RESULT_OK && ens160.hasNewData()) {
      air.eco2 = ens160.getEco2();
      air.tvoc = ens160.getTvoc();
      air.aqi = (int)ens160.getAirQualityIndex_UBA();
      air.validity = (ens160.getDeviceStatus() >> 2) & 0x03;
      air.gasOk = true;
    }
  }

  return air;
}
