export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

let latestData = {
  device: "Bekleniyor...",
  temperature: 0,
  humidity: 0,
  hashrate: 0,
  accepted: 0,
  rejected: 0,
  balance: 0,
  lastUpdate: "Veri yok",
  lastSeenTimestamp: null // Son paket geliş zamanı
};

export async function POST(request) {
  try {
    const body = await request.json();
    const now = new Date();
    
    latestData = {
      ...latestData,
      ...body,
      lastSeenTimestamp: now.getTime(), // Milisaniye cinsinden kaydediyoruz
      lastUpdate: now.toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul' })
    };

  if (body.username) {
      try {
        const resBalance = await fetch(`https://server.duinocoin.com/balances/${body.username}`, {
          cache: 'no-store',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        const jsonBalance = await resBalance.json();
        
        if (jsonBalance && jsonBalance.success && jsonBalance.result && jsonBalance.result.balance !== undefined) {
          latestData.balance = jsonBalance.result.balance;
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