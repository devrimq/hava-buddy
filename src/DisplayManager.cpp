// ==========================================
// DisplayManager.cpp (Final + İkonlar)
// ==========================================
#include "../include/DisplayManager.h"
#include "../include/WeatherManager.h" 

extern WeatherManager weather;         

LGFX_Buddy::LGFX_Buddy() {
    {
        auto cfg = _bus.config();
        cfg.spi_host = VSPI_HOST;
        cfg.spi_mode = 0;
        cfg.freq_write = 40000000;
        cfg.pin_sclk = TFT_SCLK;
        cfg.pin_mosi = TFT_MOSI;
        cfg.pin_miso = TFT_MISO;
        cfg.pin_dc   = TFT_DC;
        _bus.config(cfg);
        _panel.setBus(&_bus);
    }
    
    {
        auto cfg = _panel.config();
        cfg.pin_cs   = TFT_CS;
        cfg.pin_rst  = TFT_RST;
        cfg.panel_width  = 128;
        cfg.panel_height = 160;
        cfg.offset_x = 0;
        cfg.offset_y = 0;
        cfg.offset_rotation = 0;
        cfg.rgb_order = true;
        _panel.config(cfg);
    }
    
    _panel.setRotation(1); 
    setPanel(&_panel);
}

DisplayManager::DisplayManager() : _backlightState(true) {}

void DisplayManager::init() {
    _lcd.init();
    pinMode(TFT_BL, OUTPUT);
    digitalWrite(TFT_BL, HIGH);
    _lcd.fillScreen(TFT_BLACK);
}

void DisplayManager::drawDataGrid(float temp, float hum) {
    // Alt paneli temizle
    _lcd.fillRect(0, 95, 160, 33, TFT_BLACK); 
    
    _lcd.drawFastHLine(0, 95, 160, SIBER_CYAN);
    _lcd.drawFastVLine(80, 95, 33, DARK_GRAY);

    // ==========================================
    // SOL: İÇ MEKAN (SHT30)
    // ==========================================
    _lcd.setTextColor(TFT_WHITE);
    _lcd.setFont(&fonts::Font2);
    _lcd.setCursor(4, 98);
    _lcd.printf("Ic: %.1fC", temp);
    
    _lcd.setFont(&fonts::Font0);
    _lcd.setTextColor(SIBER_CYAN);
    _lcd.setCursor(4, 117);
    _lcd.printf("Nem: %%%.0f", hum);

    // ==========================================
    // SAĞ: DIŞ MEKAN (WeatherManager)
    // ==========================================
    _lcd.setTextColor(TFT_WHITE);
    _lcd.setFont(&fonts::Font2);
    _lcd.setCursor(85, 98);
    
    if (weather.isAvailable()) {
        _lcd.printf("D:%.1fC", weather.getOutTemp());
        
        _lcd.setFont(&fonts::Font0);
        _lcd.setCursor(85, 117); 
        _lcd.printf("Nem:%%%d", weather.getOutHum()); 
        
        // ==========================================
        // MİNİ HAVA DURUMU İKONLARI (Geometrik Çizim)
        // ==========================================
        int wId = weather.getWeatherId();
        int ix = 142; // İkon merkez X
        int iy = 113; // İkon merkez Y
        uint16_t cloudColor = _lcd.color565(180, 180, 190); // Şık bir açık gri/bulut rengi
        
        if (wId == 800) { 
            // GÜNEŞLİ: Sarı Daire ve Işınlar
            _lcd.fillCircle(ix, iy, 5, TFT_YELLOW);
            _lcd.drawFastHLine(ix - 8, iy, 17, TFT_YELLOW);
            _lcd.drawFastVLine(ix, iy - 8, 17, TFT_YELLOW);
        }
        else if (wId > 800) { 
            // BULUTLU: İç içe geçmiş gri daireler
            _lcd.fillCircle(ix - 5, iy + 2, 4, cloudColor);
            _lcd.fillCircle(ix, iy - 2, 5, cloudColor);
            _lcd.fillCircle(ix + 5, iy + 2, 4, cloudColor);
        }
        else { 
            // YAĞMURLU/KÖTÜ HAVA: Bulut ve çapraz düşen siber mavi damlalar
            _lcd.fillCircle(ix - 5, iy, 4, cloudColor);
            _lcd.fillCircle(ix, iy - 3, 5, cloudColor);
            _lcd.fillCircle(ix + 5, iy, 4, cloudColor);
            
            _lcd.drawLine(ix - 4, iy + 5, ix - 6, iy + 9, SIBER_CYAN);
            _lcd.drawLine(ix, iy + 5, ix - 2, iy + 9, SIBER_CYAN);
            _lcd.drawLine(ix + 4, iy + 5, ix + 2, iy + 9, SIBER_CYAN);
        }
    } else {
        _lcd.printf("D: --");
        _lcd.setCursor(85, 117);
        _lcd.print("Bekliyor...");
    }
}