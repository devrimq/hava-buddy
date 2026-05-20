#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>

// ============================================
// SPI LCD Pins (ST7735)
// ============================================
#define TFT_SCLK 18
#define TFT_MOSI 23
#define TFT_MISO -1
#define TFT_DC   2
#define TFT_CS   5
#define TFT_RST  4
#define TFT_BL   15

// ============================================
// I2C Pins (SHT30)
// ============================================
#define I2C_SDA 21
#define I2C_SCL 22

// ============================================
// Touch/Button Pin
// ============================================
#define TOUCH_PIN 13

// ============================================
// Renk Tanımları (RGB565 formatında)
// ============================================
#define TFT_BLACK   0x0000
#define TFT_WHITE   0xFFFF
#define TFT_RED     0xF800
#define TFT_GREEN   0x07E0
#define TFT_BLUE    0x001F
#define TFT_YELLOW  0xFFE0

// Siber temalı renkler
#define SIBER_CYAN  0x07FF      // Parlak mavi/cyan
#define SIBER_BLUE  0x001F      // Koyu mavi
#define DARK_GRAY   0x4208      // Koyu gri

// ============================================
// Animasyon Ayarları
// ============================================
#define ANIMATION_FRAME_MS 33    // ~30 FPS
#define BLINK_INTERVAL_MS  3000  // 3 saniyede bir göz kırp
#define BLINK_DURATION_MS  100   // Kırpma süresi

// ============================================
// Zaman Ayarları
// ============================================
#define GMT_OFFSET_SEC  10800    // Türkiye GMT+3
#define DAYLIGHT_OFFSET 0

#endif