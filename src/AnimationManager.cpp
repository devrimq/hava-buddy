// ==========================================
// AnimationManager.cpp (Final)
// ==========================================
#include "../include/AnimationManager.h"

AnimationManager::AnimationManager(DisplayManager& display) 
    : _display(display), _eyeState(0), _mood(0), _lastBlink(0), _blinkStart(0) {}

void AnimationManager::init() {
    _canvas.setColorDepth(16);
    _canvas.createSprite(160, 95); 
}

void AnimationManager::setMood(int mood) {
    _mood = constrain(mood, 0, 3);
}

void AnimationManager::drawEye(int x, int y, int state, int isLeftEye) {
    if (state == 0) {  
        _canvas.fillCircle(x, y, 16, SIBER_CYAN);
        
        int pupilSize = (_mood == 3) ? 4 : 8; 
        _canvas.fillCircle(x, y + 2, pupilSize, TFT_BLACK);
        
        _canvas.fillCircle(x - 3, y - 4, 3, TFT_WHITE);
        
        if (_mood == 1) {
            _canvas.fillRect(x - 16, y + 8, 32, 10, TFT_BLACK);
        }
        else if (_mood == 3) {
            if (isLeftEye) {
                _canvas.fillTriangle(x - 20, y - 20, x + 20, y - 20, x + 20, y, TFT_BLACK);
            } else {
                _canvas.fillTriangle(x - 20, y - 20, x + 20, y - 20, x - 20, y, TFT_BLACK);
            }
        }
    } 
    else if (state == 1) { 
        _canvas.fillRect(x - 14, y, 28, 4, SIBER_CYAN);
    }
}

void AnimationManager::drawMouth(int x, int y, int mood) {
    switch(mood) {
        case 0: 
            _canvas.fillRoundRect(x - 15, y, 30, 6, 3, SIBER_CYAN);
            break;
        case 1: 
            _canvas.fillCircle(x, y + 5, 12, SIBER_CYAN); 
            _canvas.fillRect(x - 12, y - 5, 24, 10, TFT_BLACK); 
            _canvas.fillRoundRect(x - 20, y, 40, 6, 3, SIBER_CYAN); 
            break;
        case 2: 
            _canvas.fillCircle(x, y + 4, 8, SIBER_CYAN);
            _canvas.fillCircle(x, y + 4, 4, TFT_BLACK); 
            break;
        case 3: 
            _canvas.fillTriangle(x - 18, y + 8, x + 10, y - 2, x + 15, y + 4, SIBER_CYAN);
            break;
    }
}

void AnimationManager::update() {
    unsigned long now = millis();
    
    _canvas.fillScreen(TFT_BLACK);
    
    if (_eyeState == 0 && now - _lastBlink > random(2000, 6000)) {
        _eyeState = 1; 
        _blinkStart = now;
    } else if (_eyeState == 1 && now - _blinkStart > 120) { 
        _eyeState = 0; 
        _lastBlink = now;
    }

    // Yüz 10 piksel yukarı taşındı (Y koordinatları: 30 ve 60)
    drawEye(45, 30, _eyeState, 1);
    drawEye(115, 30, _eyeState, 0);
    drawMouth(80, 60, _mood);

    _canvas.pushSprite(&_display.getLcd(), 0, 0);
}