import { NextResponse } from 'next/server';

let latestData = {
  device: "Bekleniyor...",
  temperature: 0,
  humidity: 0,
  hashrate: 0,
  accepted: 0,
  rejected: 0,
  balance: 0,
  lastUpdate: "Veri yok"
};

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Önce gelen gövde verilerini güncelle
    latestData = {
      ...latestData,
      ...body,
      lastUpdate: new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul' })
    };

    // ESP32'den kullanıcı adı geldiğinde Duino-Coin API'sinden güncel bakiyeyi çek
    if (body.username) {
      try {
        const resBalance = await fetch(`https://server.duinocoin.com/users/${body.username}`, {
          cache: 'no-store' // Önceden önbelleğe alınan eski bakiyeyi engeller
        });
        const jsonBalance = await resBalance.json();
        
        if (jsonBalance && jsonBalance.success && jsonBalance.result && jsonBalance.result.balance) {
          latestData.balance = jsonBalance.result.balance.balance;
        }
      } catch (err) {
        console.error("Duino-Coin Bakiye Çekme Hatası:", err);
      }
    }

    return NextResponse.json({ success: true, message: "Veri kaydedildi!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Hatalı veri" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(latestData);
}