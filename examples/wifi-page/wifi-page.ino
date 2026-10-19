/**
 * VasoVivo — esempio completo: Wi-Fi e pagina HTML
 *
 * L'ESP32 crea la rete Wi-Fi "VasoVivo" e mostra le letture dei sensori
 * su una pagina senza stile, aggiornata ogni 5 secondi.
 *
 * Le letture arrivano dai blocchi degli esempi singoli in sensors/:
 *   ENS160 + AHT21  → air_quality.h
 *   GY-302 BH1750   → light_lux.h
 *   Umidità substrato → substrate_moisture.h
 *
 * Librerie: ScioSense_ENS16x, Adafruit AHTX0, BH1750 (Christopher Laws)
 * Rete: VasoVivo, password VasoVivo123 — pagina http://192.168.4.1
 */

#include <WiFi.h>
#include <WebServer.h>

#include "../../sensors/ens160-aht21/example/air_quality.h"
#include "../../sensors/bh1750/example/light_lux.h"
#include "../../sensors/capacitive-moisture/example/substrate_moisture.h"

const char* WIFI_NAME = "VasoVivo";
const char* WIFI_PASSWORD = "VasoVivo123";
const unsigned long READ_INTERVAL_MS = 5000;

WebServer server(80);

AirQuality air;
Light light;
Moisture moisture;
unsigned long lastReadMs = 0;

void readSensors() {
  air = airQualityRead();
  light = lightRead();
  moisture = moistureRead();
  lastReadMs = millis();
}

void setup() {
  Serial.begin(115200);

  airQualityBegin();
  lightBegin();
  moistureBegin();

  WiFi.mode(WIFI_AP);
  if (!WiFi.softAP(WIFI_NAME, WIFI_PASSWORD)) {
    Serial.println("[ERRORE] Rete Wi-Fi non avviata");
    while (true) {
      delay(1000);
    }
  }
  Serial.printf("[OK] Rete %s — pagina http://%s\n",
                WIFI_NAME, WiFi.softAPIP().toString().c_str());

  server.on("/", showPage);
  server.begin();

  readSensors();
}

void loop() {
  server.handleClient();

  if (millis() - lastReadMs >= READ_INTERVAL_MS) {
    readSensors();
  }
}

// ---------------------------------------------------------------------------
// Pagina HTML
// ---------------------------------------------------------------------------

String uptimeText() {
  unsigned long seconds = millis() / 1000;
  char text[16];
  snprintf(text, sizeof(text), "%02lu:%02lu:%02lu",
           seconds / 3600, (seconds / 60) % 60, seconds % 60);
  return text;
}

String tableRow(const String& measure, const String& value, const String& sensor) {
  return "<tr><td>" + measure + "</td><td>" + value + "</td><td>" + sensor + "</td></tr>\n";
}

String valueOrNa(bool ok, const String& value) {
  return ok ? value : String("n/d");
}

String foundText(bool found) {
  return found ? "trovato" : "non trovato";
}

void showPage() {
  String page;
  page.reserve(3000);

  page += F("<!DOCTYPE html>\n<html lang=\"it\">\n<head>\n"
            "<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
            "<meta http-equiv=\"refresh\" content=\"5\">\n"
            "<title>VasoVivo</title>\n</head>\n<body>\n");

  page += F("<h1>VasoVivo</h1>\n");
  page += "<p>Letture in tempo reale. La pagina si aggiorna da sola ogni 5 secondi.<br>\n";
  page += "Scheda accesa da " + uptimeText() + ", ultima lettura "
          + String((millis() - lastReadMs) / 1000) + " s fa.</p>\n";

  page += F("<h2>Aria nel barattolo</h2>\n<table>\n"
            "<tr><th>Misura</th><th>Valore</th><th>Sensore</th></tr>\n");
  page += tableRow("Temperatura", valueOrNa(air.climateOk, String(air.tempC, 1) + " &deg;C"), "AHT21");
  page += tableRow("Umidità", valueOrNa(air.climateOk, String(air.humRh, 1) + " %"), "AHT21");
  page += tableRow("CO<sub>2</sub> equivalente", valueOrNa(air.gasOk, String(air.eco2) + " ppm"), "ENS160");
  page += tableRow("Composti volatili (TVOC)", valueOrNa(air.gasOk, String(air.tvoc) + " ppb"), "ENS160");
  page += tableRow("Qualità dell'aria (1-5)",
                   valueOrNa(air.gasOk, String(air.aqi) + ", " + airQualityAqiText(air.aqi)), "ENS160");
  page += F("</table>\n");
  if (air.gasOk) {
    page += "<p>Stato ENS160: " + String(airQualityValidityText(air.validity)) + ".</p>\n";
  }

  page += F("<h2>Luce</h2>\n<table>\n"
            "<tr><th>Misura</th><th>Valore</th><th>Sensore</th></tr>\n");
  page += tableRow("Intensità luminosa", valueOrNa(light.ok, String(light.lux, 0) + " lux"), "BH1750");
  page += F("</table>\n");

  page += F("<h2>Substrato</h2>\n<table>\n"
            "<tr><th>Misura</th><th>Valore</th><th>Sensore</th></tr>\n");
  page += tableRow("Umidità", String(moisture.percent) + " %", "Sensore analogico");
  page += tableRow("Valore ADC grezzo", String(moisture.raw) + " su 4095", "Sensore analogico");
  page += F("</table>\n");
  page += "<p>La percentuale dipende dalla calibrazione: secco = "
          + String(MOISTURE_DRY) + ", bagnato = " + String(MOISTURE_WET) + " (ADC).</p>\n";

  page += F("<h2>Sensori</h2>\n<ul>\n");
  page += "<li>AHT21 (temperatura, umidità aria): " + foundText(aht21Found) + "</li>\n";
  page += "<li>ENS160 (CO<sub>2</sub>eq, TVOC): " + foundText(ens160Found) + "</li>\n";
  page += "<li>BH1750 (luce): " + foundText(bh1750Found) + "</li>\n";
  page += "<li>Umidità substrato: GPIO " + String(MOISTURE_PIN) + "</li>\n";
  page += F("</ul>\n");

  page += F("<h2>Scheda</h2>\n<ul>\n");
  page += "<li>Rete Wi-Fi: " + String(WIFI_NAME) + "</li>\n";
  page += "<li>Indirizzo: " + WiFi.softAPIP().toString() + "</li>\n";
  page += "<li>Dispositivi collegati: " + String(WiFi.softAPgetStationNum()) + "</li>\n";
  page += F("</ul>\n");

  page += F("<hr>\n<p>VasoVivo, progetto open source: github.com/mferrantini/vasovivo</p>\n"
            "</body>\n</html>\n");

  server.sendHeader("Cache-Control", "no-store");
  server.send(200, "text/html; charset=utf-8", page);
}
