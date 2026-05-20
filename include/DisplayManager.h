#ifndef DISPLAY_MANAGER_H
#define DISPLAY_MANAGER_H

#include <LovyanGFX.hpp>
#include "config.h"

class LGFX_Buddy : public lgfx::LGFX_Device {
private:
    lgfx::Panel_ST7735S _panel;
    lgfx::Bus_SPI _bus;
    
public:
    LGFX_Buddy();
};

class DisplayManager {
private:
    LGFX_Buddy _lcd;
    bool _backlightState;
    
public:
    DisplayManager();
    void init();
    void setBacklight(bool state);
    void clear();
    void drawBaseUI();
    void drawDataGrid(float temp, float hum);
    void drawTempIcon(int x, int y, uint16_t color);
    void drawHumIcon(int x, int y, uint16_t color);
    void updateFooter(const char* leftText, const char* rightText = nullptr);
    void drawWelcomeScreen();
    
    LGFX_Buddy& getLcd() { return _lcd; }
    bool isBacklightOn() { return _backlightState; }
};

#endif