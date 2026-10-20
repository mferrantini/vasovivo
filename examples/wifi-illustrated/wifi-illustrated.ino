/**
 * VasoVivo — esempio completo: Wi-Fi e tavola illustrata
 *
 * L'ESP32 crea la rete Wi-Fi "VasoVivo" e serve la tavola illustrata
 * costruita con il UI Kit (`UI/index.html`, `css/vv-ui/`). La pagina sta nella memoria della
 * scheda (LittleFS, cartella data/) e chiede le letture a /api/readings.
 *
 * Le letture arrivano dai blocchi degli esempi singoli in sensors/:
 *   ENS160 + AHT21  → air_quality.h
 *   GY-302 BH1750   → light_lux.h
 *   Umidità substrato → substrate_moisture.h
 *
 * Librerie: ScioSense_ENS16x, Adafruit AHTX0, BH1750 (Christopher Laws)
 * Rete: VasoVivo, password VasoVivo123 — pagina http://192.168.4.1
 *
 * Dopo lo sketch va caricata anche la cartella data/ (vedi README).
 */

#include <WiFi.h>
#include <WebServer.h>
#include <LittleFS.h>

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

  if (LittleFS.begin() && LittleFS.exists("/index.html")) {
    Serial.println("[OK] Dashboard trovata in LittleFS");
  } else {
    Serial.println("[ERRORE] Dashboard assente: carica la cartella data/ (vedi README)");
  }

  WiFi.mode(WIFI_AP);
  if (!WiFi.softAP(WIFI_NAME, WIFI_PASSWORD)) {
    Serial.println("[ERRORE] Rete Wi-Fi non avviata");
    while (true) {
      delay(1000);
    }
  }
  Serial.printf("[OK] Rete %s — pagina http://%s\n",
                WIFI_NAME, WiFi.softAPIP().toString().c_str());

  server.on("/api/readings", sendReadings);
  server.on("/", sendDashboard);
  server.serveStatic("/", LittleFS, "/", "max-age=300");
  server.onNotFound([]() { server.send(404, "text/plain", "Non trovato"); });
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
// Pagina e letture
// ---------------------------------------------------------------------------

void sendDashboard() {
  File page = LittleFS.open("/index.html", "r");
  if (!page) {
    server.send(200, "text/plain; charset=utf-8",
                "VasoVivo: la dashboard non è caricata.\n"
                "Carica la cartella data/ con 'Upload LittleFS' (vedi README dell'esempio).");
    return;
  }
  server.streamFile(page, "text/html");
  page.close();
}

String jsonNumber(bool ok, float value, int decimals) {
  return ok ? String(value, decimals) : String("null");
}

String jsonBool(bool value) {
  return value ? "true" : "false";
}

void sendReadings() {
  String json;
  json.reserve(700);

  json += "{\"uptime\":" + String(millis() / 1000);

  json += ",\"air\":{";
  json += "\"aht21\":" + jsonBool(aht21Found);
  json += ",\"ens160\":" + jsonBool(ens160Found);
  json += ",\"climateOk\":" + jsonBool(air.climateOk);
  json += ",\"tempC\":" + jsonNumber(air.climateOk, air.tempC, 1);
  json += ",\"humRh\":" + jsonNumber(air.climateOk, air.humRh, 1);
  json += ",\"gasOk\":" + jsonBool(air.gasOk);
  json += ",\"eco2\":" + jsonNumber(air.gasOk, air.eco2, 0);
  json += ",\"tvoc\":" + jsonNumber(air.gasOk, air.tvoc, 0);
  json += ",\"aqi\":" + jsonNumber(air.gasOk, air.aqi, 0);
  json += ",\"aqiText\":\"" + String(airQualityAqiText(air.aqi)) + "\"";
  json += ",\"validity\":" + String(air.validity);
  json += ",\"validityText\":\"" + String(airQualityValidityText(air.validity)) + "\"";
  json += "}";

  json += ",\"light\":{";
  json += "\"bh1750\":" + jsonBool(bh1750Found);
  json += ",\"ok\":" + jsonBool(light.ok);
  json += ",\"lux\":" + jsonNumber(light.ok, light.lux, 0);
  json += "}";

  json += ",\"substrate\":{";
  json += "\"raw\":" + String(moisture.raw);
  json += ",\"percent\":" + String(moisture.percent);
  json += ",\"dry\":" + String(MOISTURE_DRY);
  json += ",\"wet\":" + String(MOISTURE_WET);
  json += ",\"pin\":" + String(MOISTURE_PIN);
  json += "}";

  json += ",\"wifi\":{";
  json += "\"name\":\"" + String(WIFI_NAME) + "\"";
  json += ",\"ip\":\"" + WiFi.softAPIP().toString() + "\"";
  json += ",\"clients\":" + String(WiFi.softAPgetStationNum());
  json += "}}";

  server.sendHeader("Cache-Control", "no-store");
  server.send(200, "application/json", json);
}
