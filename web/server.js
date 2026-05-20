const express = require('express');
const mqtt = require('mqtt');
const path = require('path');

const app = express();
app.use(express.json());

// "public" adındaki klasörü frontend dosyalarımız için dışa açıyoruz
app.use(express.static('public')); 

// --- MQTT BAĞLANTISI ---
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');

// Buddy'nin son verisini hafızada tutacağımız obje
let buddyData = { inTemp: "--", inHum: "--", outTemp: "--" };

mqttClient.on('connect', () => {
    console.log('[MQTT] HiveMQ Sunucusuna Bağlanıldı!');
    // Buddy'nin veri gönderdiği kanalı dinlemeye başla
    mqttClient.subscribe('ostimbul/buddy/data');
});

mqttClient.on('message', (topic, message) => {
    if (topic === 'ostimbul/buddy/data') {
        try {
            // Buddy'den gelen JSON verisini parse et
            buddyData = JSON.parse(message.toString());
            console.log('[MQTT] Yeni Veri Geldi:', buddyData);
        } catch (e) {
            console.log('[HATA] JSON Parse edilemedi');
        }
    }
});

// --- API UÇLARI (ENDPOINTS) ---

// 1. Frontend'in verileri çekeceği API
app.get('/api/data', (req, res) => {
    res.json(buddyData);
});

// 2. Frontend'in komut göndereceği API
app.post('/api/command', (req, res) => {
    const cmd = req.body.command;
    if (cmd) {
        // Gelen komutu Buddy'nin dinlediği kanala fırlat
        mqttClient.publish('ostimbul/buddy/command', cmd);
        console.log('[API] Komut Buddy\'e İletildi:', cmd);
        res.json({ success: true, message: "Komut gönderildi" });
    } else {
        res.status(400).json({ error: "Geçersiz komut" });
    }
});

// Sunucuyu Başlat
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Uzay Üssü Aktif: http://localhost:${PORT}`);
});