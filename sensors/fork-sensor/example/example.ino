/**
 * VasoVivo — Sensore a forchetta (umidità substrato)
 *
 * Legge il valore analogico del sensore e lo converte
 * in percentuale di umidità tramite calibrazione.
 *
 * Nessuna libreria esterna richiesta.
 *
 * Collegamento:
 *   VCC → 3.3V | GND → GND | A0 → GPIO34
 *
 * CALIBRAZIONE:
 *   1. Misura il valore ADC con il sensore in aria (asciutto) → DRY_VALUE
 *   2. Misura il valore ADC con il sensore in acqua → WET_VALUE
 *   3. Aggiorna le costanti qui sotto.
 */

#define SENSOR_PIN  34

// Valori di calibrazione — adatta questi alla tua scheda e sensore
#define DRY_VALUE   2800   // ADC quando il sensore è asciutto
#define WET_VALUE    900   // ADC quando il sensore è immerso in acqua

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);  // 12 bit → range 0-4095 su ESP32
  Serial.println("[OK] Sensore a forchetta inizializzato.");
}

void loop() {
  int rawValue = analogRead(SENSOR_PIN);

  // Converti in percentuale: secco = 0%, bagnato = 100%
  int moisture = map(rawValue, DRY_VALUE, WET_VALUE, 0, 100);
  moisture = constrain(moisture, 0, 100);

  Serial.println("--- Lettura umidità substrato ---");
  Serial.print("Valore ADC grezzo : ");
  Serial.println(rawValue);
  Serial.print("Umidità substrato : ");
  Serial.print(moisture);
  Serial.println(" %");

  if (moisture < 30) {
    Serial.println("[AVVISO] Substrato troppo secco!");
  } else if (moisture > 85) {
    Serial.println("[AVVISO] Substrato troppo umido!");
  }

  Serial.println();
  delay(5000);
}
