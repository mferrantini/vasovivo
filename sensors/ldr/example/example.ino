/**
 * VasoVivo — Fotoresistenza LDR
 *
 * Legge il valore analogico di una fotoresistenza (LDR) collegata
 * in un partitore di tensione con una resistenza da 10kΩ.
 *
 * Nessuna libreria esterna richiesta.
 *
 * Schema partitore:
 *   3.3V → LDR → GPIO34
 *                   ↓
 *                 10kΩ
 *                   ↓
 *                  GND
 *
 * Più luce = resistenza LDR più bassa = valore ADC più alto.
 */

#define LDR_PIN 34

// Soglie indicative — adatta in base all'ambiente
#define SOGLIA_BUIO   500
#define SOGLIA_LUCE  3000

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);  // 12 bit → range 0-4095 su ESP32
  Serial.println("[OK] LDR inizializzata.");
}

void loop() {
  int rawValue = analogRead(LDR_PIN);

  // Mappatura orientativa in percentuale (0 = buio, 100 = piena luce)
  int lightPercent = map(rawValue, SOGLIA_BUIO, SOGLIA_LUCE, 0, 100);
  lightPercent = constrain(lightPercent, 0, 100);

  String lightLevel;
  if (rawValue < SOGLIA_BUIO)        lightLevel = "Buio";
  else if (rawValue < SOGLIA_LUCE)   lightLevel = "Luce parziale";
  else                               lightLevel = "Piena luce";

  Serial.println("--- Lettura LDR ---");
  Serial.print("Valore ADC grezzo : ");
  Serial.println(rawValue);
  Serial.print("Luce stimata      : ");
  Serial.print(lightPercent);
  Serial.println(" %");
  Serial.print("Condizione        : ");
  Serial.println(lightLevel);
  Serial.println();

  delay(3000);
}
