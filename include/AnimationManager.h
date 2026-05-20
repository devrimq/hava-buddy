#ifndef ANIMATION_MANAGER_H
#define ANIMATION_MANAGER_H

#include <LovyanGFX.hpp>
#include "DisplayManager.h"
#include "config.h"

class AnimationManager {
private:
    LGFX_Sprite _canvas;
    DisplayManager& _display;
    int _eyeState;
    int _mood;
    unsigned long _lastBlink;
    unsigned long _blinkStart;
    
    // isLeftEye parametresini buraya ekledik!
    void drawEye(int x, int y, int state, int isLeftEye); 
    void drawMouth(int x, int y, int mood);
    
public:
    AnimationManager(DisplayManager& display);
    void init();
    void update();
    void setMood(int mood);
    int getMood() const { return _mood; }
    
    LGFX_Sprite& getCanvas() { return _canvas; }
};

#endif