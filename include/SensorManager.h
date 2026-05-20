#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <Adafruit_SHT31.h>
#include <Wire.h>
#include "config.h"

class SensorManager {
private:
    Adafruit_SHT31 _sht30;
    float _temperature;
    float _humidity;
    unsigned long _lastRead;
    bool _sensorOk;
    
public:
    SensorManager();
    void init();
    void update();
    
    float getT() const { return _temperature; }
    float getH() const { return _humidity; }
    bool isAvailable() const { return _sensorOk; }
};

#endif