#ifndef WEATHER_MANAGER_H
#define WEATHER_MANAGER_H

#include <Arduino.h>

class WeatherManager {
private:
    float _outTemp;
    int _weatherId;
    int _outHum;
    unsigned long _lastFetch;
    bool _hasData;

public:
    WeatherManager();
    void init();
    void update();
    
    float getOutTemp() const { return _outTemp; }
    int getWeatherId() const { return _weatherId; }
    int getOutHum() const { return _outHum; }
    bool isAvailable() const { return _hasData; }
};

#endif