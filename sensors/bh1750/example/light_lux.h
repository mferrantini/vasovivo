/**
 * VasoVivo — blocco di lettura GY-302 BH1750
 *
 * lightBegin()  avvia il sensore e stampa lo stato su seriale
 * lightRead()   restituisce la luce in lux
 *
 * Libreria: BH1750 by Christopher Laws
 * I2C: SDA GPIO 21, SCL GPIO 22, alimentazione 3.3V, ADDR a GND (0x23)
 */

#pragma once

#include <Wire.h>
#include <BH1750.h>

const int LIGHT_SDA_PIN = 21;
const int LIGHT_SCL_PIN = 22;

struct Light {
  bool ok;
  float lux;
};

BH1750 bh1750;
bool bh1750Found = false;

bool lightBegin() {
  Wire.begin(LIGHT_SDA_PIN, LIGHT_SCL_PIN);
  bh1750Found = bh1750.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);
  Serial.println(bh1750Found ? "[OK] BH1750" : "[ERRORE] BH1750 non trovato");
  return bh1750Found;
}

Light lightRead() {
  Light light = {};
  if (bh1750Found) {
    light.lux = bh1750.readLightLevel();
    light.ok = light.lux >= 0;
  }
  return light;
}
