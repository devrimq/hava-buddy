#include "../include/WeatherManager.h"
#include "../include/secrets.h"
#include <HTTPClient.h>
#include <ArduinoJson.h>

WeatherManager::WeatherManager() : _outTemp(0.0), _weatherId(0), _lastFetch(0), _hasData(false) {}

void WeatherManager::init() {
    Serial.println("[Weather] Initialized");
}

void WeatherManager::update() {
    // API sınırlarına takılmamak için sadece 10 dakikada bir (600,000 ms) güncelle
    unsigned long now = millis();
    if (now - _lastFetch >= 600000 || _lastFetch == 0) {
        _lastFetch = now;
        
        HTTPClient http;
        // DİKKAT: secrets.h dosyasındaki URL'nin sonuna API Key'ini eklemeyi unutma!
        http.begin(WEATHER_API_URL); 
        int httpCode = http.GET();
        
        if (httpCode == HTTP_CODE_OK) {
            String payload = http.getString();
            
            JsonDocument doc;
            DeserializationError error = deserializeJson(doc, payload);
            
            if (!error) {
                _outTemp = doc["main"]["temp"];
                _outHum = doc["main"]["humidity"];
                _weatherId = doc["weather"][0]["id"];
                _hasData = true;
                Serial.printf("[Weather] Disari: %.1fC, Durum Kodu: %d\n", _outTemp, _weatherId);
            }
        } else {
            Serial.printf("[Weather] Baglanti Hatasi! HTTP Kodu: %d\n", httpCode);
            _hasData = false;
        }
        http.end();
    }
}