#include "../include/SensorManager.h"

SensorManager::SensorManager() 
    : _temperature(22.5), _humidity(45.0), _lastRead(0), _sensorOk(false) {}

void SensorManager::init() {
    Wire.begin(I2C_SDA, I2C_SCL);
    delay(100);
    
    if (!_sht30.begin(0x44)) {
        Serial.println("[Sensor] SHT30 not found! Using mock data.");
        _sensorOk = false;
        _temperature = 22.5;
        _humidity = 45.0;
    } else {
        Serial.println("[Sensor] SHT30 initialized");
        _sensorOk = true;
    }
}

void SensorManager::update() {
    unsigned long now = millis();
    
    if (now - _lastRead >= 2000) {
        _lastRead = now;
        
        if (_sensorOk) {
            float t = _sht30.readTemperature();
            float h = _sht30.readHumidity();
            
            if (!isnan(t) && !isnan(h)) {
                _temperature = t;
                _humidity = h;
                Serial.printf("[Sensor] T: %.1fC, H: %.0f%%\n", t, h);
            }
        } else {
            // Mock data - hafif değişen test verileri
            static float mockTemp = 22.5;
            static float mockHum = 45.0;
            mockTemp += (random(-10, 10) / 100.0);
            mockHum += (random(-20, 20) / 10.0);
            
            _temperature = constrain(mockTemp, 18.0, 30.0);
            _humidity = constrain(mockHum, 30.0, 70.0);
        }
    }
}