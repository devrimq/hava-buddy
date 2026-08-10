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
    balance: 0,
    lastUpdate: "-",
    timestamp: null
  });

  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/update', { cache: 'no-store' });
        const json = await res.json();
        
        // Gelen veride timestamp yoksa veya uyuşmuyorsa şu anki zamanı baz alalım
        const updateTime = json.timestamp ? new Date(json.timestamp) : new Date();
        
        setData({
          ...json,
          timestamp: updateTime
        });

        // Veri başarıyla çekildiyse online yap
        setIsOnline(true);
      } catch (err) {
        console.error("Veri çekilemedi:", err);
        setIsOnline(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Zaman aşımı (Timeout) kontrolü: Son veri geleli 30 saniyeden fazla olduysa offline yap
  useEffect(() => {
    const timer = setInterval(() => {
      if (data.timestamp) {
        const diffInSeconds = (new Date() - new Date(data.timestamp)) / 1000;
        if (diffInSeconds > 30) { 
          setIsOnline(false);
        }
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [data.timestamp]);

  const hashrateVal = Number(data.hashrate) || 0;
  const balanceVal = Number(data.balance) || 0;

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', background: '#0f172a', color: '#f8fafc', minHeight: '100vh', textAlign: 'center', padding: '50px 20px' }}>
      
      {/* Üst Başlık ve Durum Rozeti */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <h1 style={{ color: '#38bdf8', margin: 0 }}>Ofis & Duino-Coin Canlı Takip</h1>
        
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          background: isOnline ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: isOnline ? '#4ade80' : '#f87171',
          border: `1px solid ${isOnline ? '#22c55e' : '#ef4444'}`
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isOnline ? '#22c55e' : '#ef4444'
          }} />
          {isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
        </span>
      </div>

      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Son Güncelleme: {data.lastUpdate}</p>

      {/* Veri Kartları - Offline olduğunda hafif soluklaşır */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        flexWrap: 'wrap', 
        maxWidth: '1000px', 
        margin: '0 auto',
        opacity: isOnline ? 1 : 0.5,
        transition: 'opacity 0.3s ease'
      }}>
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
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80' }}>{hashrateVal.toFixed(2)} kH/s</div>
        </div>

        <div style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Kabul / Red</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#c084fc' }}>{data.accepted} / {data.rejected}</div>
        </div>

        <div style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>DUCO Bakiye</h3>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#facc15' }}>{balanceVal.toFixed(4)} DUCO</div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px', color: '#64748b' }}>
        Cihaz: {data.device}
      </div>
    </main>
  );
}