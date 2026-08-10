export const dynamic = 'force-dynamic'; // Next.js'in veriyi dondurmasını (cache) kesin olarak engeller!
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

    if (body.username) {
      try {
        const resBalance = await fetch(`https://server.duinocoin.com/balances/${body.username}`, {
          cache: 'no-store' 
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