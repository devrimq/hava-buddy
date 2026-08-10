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
    
    latestData = {
      ...latestData,
      ...body,
      lastUpdate: new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul' })
    };

    // ESP32'den kullanıcı adı gönderildiyse Duino-Coin API'sinden güncel bakiyeyi çek
    if (body.username) {
      try {
        const resBalance = await fetch(`https://server.duinocoin.com/users/${body.username}`);
        const jsonBalance = await resBalance.json();
        if (jsonBalance && jsonBalance.success) {
          latestData.balance = jsonBalance.result.balance.balance;
        }
      } catch (err) {
        console.error("Bakiye çekilemedi:", err);
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