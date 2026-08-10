import { NextResponse } from 'next/server';

let latestData = {
  device: "Bekleniyor...",
  temperature: 0,
  humidity: 0,
  hashrate: 0,
  accepted: 0,
  rejected: 0,
  lastUpdate: "Veri yok"
};

export async function POST(request) {
  try {
    const body = await request.json();
    latestData = {
      ...body,
      lastUpdate: new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul' })
    };
    return NextResponse.json({ success: true, message: "Veri kaydedildi!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Hatalı veri" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(latestData);
}