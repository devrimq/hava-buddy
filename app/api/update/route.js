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
  lastSeenTimestamp: null
};

export async function POST(request) {
  try {
    const body = await request.json();
    const now = new Date();
    
    latestData = {
      ...latestData,
      ...body,
      lastSeenTimestamp: now.getTime(),
      lastUpdate: now.toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul' })
    };

    // ESP32 username göndermezse varsayılan devrimq kullanılsın
    const username = body.username || "devrimq";

    try {
      const resBalance = await fetch(`https://server.duinocoin.com/balances/${username}`, {
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });

      if (resBalance.ok) {
        const jsonBalance = await resBalance.json();
        
        // Duino-Coin API farklı yanıt formatları dönebiliyor, ikisini de kontrol ediyoruz
        let currentBalance = null;
        
        if (jsonBalance?.result?.balance !== undefined) {
          currentBalance = jsonBalance.result.balance;
        } else if (Array.isArray(jsonBalance?.result) && jsonBalance.result[0]?.balance !== undefined) {
          currentBalance = jsonBalance.result[0].balance;
        } else if (typeof jsonBalance?.result === 'number') {
          currentBalance = jsonBalance.result;
        }

        if (currentBalance !== null) {
          latestData.balance = currentBalance;
        }
      }
    } catch (err) {
      console.error("Duino-Coin Bakiye Çekme Hatası:", err);
    }

    return NextResponse.json({ success: true, message: "Veri kaydedildi!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Hatalı veri" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(latestData);
}