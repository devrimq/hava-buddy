// ==========================================
// main.cpp (MQTT IoT Entegrasyonu)
// ==========================================
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "../include/DisplayManager.h"
#include "../include/SensorManager.h"
#include "../include/AnimationManager.h"
#include "../include/secrets.h"
#include "../include/config.h"
#include "../include/WeatherManager.h"
        
#include <ArduinoJson.h>
#include <WiFiManager.h>


WeatherManager weather;
DisplayManager display;
SensorManager sensors;
AnimationManager buddy(display);

WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastSensorUpdate = 0;
unsigned long lastAnimUpdate = 0;
unsigned long touchTime = 0;
volatile bool touched = false;

// Uzaktan MQTT komutu geldiğinde çalışacak fonksiyon
void mqttCallback(char* topic, byte* payload, unsigned int length) {
    String message = "";
    for (unsigned int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    
    Serial.print("[MQTT] Komut Geldi: ");
    Serial.println(message);

    if (message == "smile") {
        buddy.setMood(1);
        touchTime = millis(); // 3 saniye sonra normale dönecek
    } else if (message == "grinch") {
        buddy.setMood(3);
    } else if (message == "surprise") {
        buddy.setMood(2);
    } else if (message == "normal") {
        buddy.setMood(0);
    }
}

void IRAM_ATTR onTouch() {
    touched = true;
}

void setupWiFi() {
    // Ekranı bilgilendirme için kullan
    display.getLcd().fillScreen(TFT_BLACK);
    display.getLcd().setTextColor(SIBER_CYAN);
    display.getLcd().setFont(&fonts::Font2);
    display.getLcd().setCursor(10, 50);
    display.getLcd().print("Setup Mode:");
    display.getLcd().setCursor(10, 80);
    display.getLcd().print("Baglan: Buddy_Setup");

    WiFiManager wm;

    // Eğer WiFi bilgisi yoksa veya bağlantı koptuysa "Buddy_Setup" adlı ağı yayına al
    // Cihaz 3 dakika boyunca kurulmayı bekler, olmazsa devam eder
    if (!wm.autoConnect("Buddy_Setup", "buddy123")) {
        Serial.println("[WiFi] Baglanti saglanamadi, yeniden baslatiliyor...");
        ESP.restart();
    }

    Serial.println("\n[WiFi] Baglandi!");
    display.getLcd().fillScreen(TFT_BLACK); 
}

// MQTT Sunucusuna bağlanmayı deneyen fonksiyon
void reconnectMQTT() {
    if (!mqttClient.connected()) {
        Serial.print("[MQTT] Baglanti deneniyor...");
        // Rastgele bir ID ile bağlan ki çakışma olmasın
        String clientId = "BuddyESP32-";
        clientId += String(random(0xffff), HEX);
        
        if (mqttClient.connect(clientId.c_str())) {
            Serial.println(" Basarili!");
            // Uzaktan kontrol kanalını dinlemeye başla
            mqttClient.subscribe("ostimbul/buddy/command");
        } else {
            Serial.print(" Hata, rc=");
            Serial.print(mqttClient.state());
            Serial.println(" 5 sn sonra tekrar denenecek.");
        }
    }
}

void setup() {
    Serial.begin(115200);

    display.init(); 
    buddy.init();
    sensors.init();

    setupWiFi();
    weather.init();
    
    // MQTT Ayarları
    mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
    mqttClient.setCallback(mqttCallback);

    pinMode(TOUCH_PIN, INPUT_PULLDOWN);
    attachInterrupt(digitalPinToInterrupt(TOUCH_PIN), onTouch, RISING);
}

void loop() {
    unsigned long now = millis();

    // 1. MQTT Döngüsü
    if (WiFi.status() == WL_CONNECTED) {
        if (!mqttClient.connected()) {
            // Sadece her 5 saniyede bir bağlanmayı dene (Bloklamayı önler)
            static unsigned long lastMqttTry = 0;
            if (now - lastMqttTry > 5000) {
                lastMqttTry = now;
                reconnectMQTT();
            }
        } else {
            mqttClient.loop();
        }
    }

    // 2. Animasyon Döngüsü
    if (now - lastAnimUpdate >= 33) {
        lastAnimUpdate = now;
        buddy.update();
    }

    // 3. Dokunmatik Tepkisi
    if (touched) {
        buddy.setMood(1); 
        touchTime = now;  
        touched = false;
        
        // Cihaza dokunulduğunu dünyaya ilan et
        if (mqttClient.connected()) {
            mqttClient.publish("ostimbul/buddy/status", "{\"event\":\"touched\"}");
        }
    }

    // 4. Sensör ve Veri Yayınlama Döngüsü
    if (now - lastSensorUpdate >= 2000) {
        lastSensorUpdate = now;
        sensors.update();
        
        if (WiFi.status() == WL_CONNECTED) {
            weather.update();
        }

        display.drawDataGrid(sensors.getT(), sensors.getH()); 
        
        // VERİLERİ BULUTA GÖNDER (JSON Formatında)
        if (mqttClient.connected()) {
            JsonDocument doc;
            doc["inTemp"] = sensors.getT();
            doc["inHum"] = sensors.getH();
            if (weather.isAvailable()) {
                doc["outTemp"] = weather.getOutTemp();
                doc["weatherId"] = weather.getWeatherId();
                doc["outHum"] = weather.getOutHum();
            }
            
            String jsonOutput;
            serializeJson(doc, jsonOutput);
            mqttClient.publish("ostimbul/buddy/data", jsonOutput.c_str());
        }

        // --- DUYGU YÖNETİMİ ---
        if (buddy.getMood() == 1) {
            if (now - touchTime >= 3000) buddy.setMood(0); 
        }
        else if (sensors.getT() > 28.0) buddy.setMood(3); 
        else if (weather.isAvailable() && weather.getOutTemp() < 10.0) buddy.setMood(2); 
        else buddy.setMood(0); 
    }
}