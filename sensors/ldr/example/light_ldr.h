/**
 * VasoVivo — blocco di lettura fotoresistenza (LDR)
 *
 * ldrBegin()  prepara l'ADC
 * ldrRead()   restituisce il valore ADC grezzo e una percentuale indicativa
 *
 * Nessuna libreria esterna.
 * Partitore: 3.3V → LDR → GPIO 35, GPIO 35 → 10kΩ → GND.
 * GPIO 35 lascia libero il GPIO 34 per il sensore di umidità.
 *
 * LDR_DARK e LDR_BRIGHT vanno adattati all'ambiente.
 */

#pragma once

const int LDR_PIN = 35;
const int LDR_DARK = 500;
const int LDR_BRIGHT = 3000;

struct LdrLight {
  int raw;       // 0 – 4095, più luce = valore più alto
  int percent;   // 0 buio … 100 piena luce
};

void ldrBegin() {
  analogReadResolution(12);
  Serial.println("[OK] Fotoresistenza su GPIO 35");
}

LdrLight ldrRead() {
  LdrLight light;
  light.raw = analogRead(LDR_PIN);
  light.percent = map(light.raw, LDR_DARK, LDR_BRIGHT, 0, 100);
  light.percent = constrain(light.percent, 0, 100);
  return light;
}
