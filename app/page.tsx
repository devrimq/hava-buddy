'use client'; 
import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState({
    device: "Bağlantı bekleniyor...",
    temperature: 0,
    humidity: 0,
    hashrate: 0,
    accepted: 0,
    rejected: 0,
    lastUpdate: "-"
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/update');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Veri çekilemedi:", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', background: '#0f172a', color: '#f8fafc', minHeight: '100vh', textAlign: 'center', padding: '50px 20px' }}>
      <h1 style={{ color: '#38bdf8', marginBottom: '10px' }}>Ofis & Duino-Coin Canlı Takip</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Son Güncelleme: {data.lastUpdate}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Sıcaklık</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fb923c' }}>{data.temperature} &deg;C</div>
        </div>

        <div style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Nem</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#38bdf8' }}>{data.humidity} %</div>
        </div>

        <div style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Hashrate</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80' }}>{(typeof data.hashrate === 'number' ? data.hashrate : 0).toFixed(2)} kH/s</div>
        </div>

        <div style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Kabul / Red</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#c084fc' }}>{data.accepted} / {data.rejected}</div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', color: '#64748b' }}>
        Cihaz: {data.device}
      </div>
    </main>
  );
}