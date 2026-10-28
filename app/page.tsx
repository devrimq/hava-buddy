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
    lastUpdate: "-",
    lastSeenTimestamp: null
  });

  const [ducoBalance, setDucoBalance] = useState(0);
  const [isOnline, setIsOnline] = useState(false);

  // 1. ESP32 Verilerini Vercel API'den Çekme
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/update', { cache: 'no-store' });
        const json = await res.json();
        setData(json);

        if (json.lastSeenTimestamp) {
          const diffInSeconds = (Date.now() - json.lastSeenTimestamp) / 1000;
          setIsOnline(diffInSeconds <= 45);
        } else {
          setIsOnline(false);
        }
      } catch (err) {
        console.error("Veri çekilemedi:", err);
        setIsOnline(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // 2. DUCO Bakiyesini Doğrudan Duino-Coin API'sinden Canlı Çekme
  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch('https://server.duinocoin.com/balances/devrimq', { cache: 'no-store' });
        const json = await res.json();
        
        let currentBalance = null;
        if (json?.result?.balance !== undefined) {
          currentBalance = json.result.balance;
        } else if (Array.isArray(json?.result) && json.result[0]?.balance !== undefined) {
          currentBalance = json.result[0].balance;
        }

        if (currentBalance !== null) {
          setDucoBalance(currentBalance);
        }
      } catch (err) {
        console.error("Duino-Coin bakiye canlı çekilemedi:", err);
      }
    }

    fetchBalance();
    const balanceInterval = setInterval(fetchBalance, 15000);
    return () => clearInterval(balanceInterval);
  }, []);

  const hashrateVal = Number(data.hashrate) || 0;

  return (
    <main style={{ 
      fontFamily: 'Arial, sans-serif', 
      background: '#0f172a', 
      color: '#f8fafc', 
      minHeight: '100vh', 
      textAlign: 'center', 
      padding: '50px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* --- Pembe Hareketli Baloncuk Efekti Arka Plan Stilleri ve Elementleri --- */}
      <style jsx global>{`
        @keyframes floatBubble {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40px) scale(1.1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
        }
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 4px 6px rgba(0,0,0,0.3), 0 0 15px rgba(236, 72, 153, 0.2);
          }
          50% {
            box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 25px rgba(236, 72, 153, 0.5);
          }
        }
        .pink-bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ec4899, #be185d);
          filter: blur(15px);
          z-index: 0;
          pointer-events: none;
        }
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          animation: pulseGlow 2s infinite ease-in-out;
        }
      `}</style>

      {/* Rastgele Konumlandırılmış Pembe Baloncuklar */}
      <div className="pink-bubble" style={{ width: '180px', height: '180px', top: '10%', left: '5%', animation: 'floatBubble 6s ease-in-out infinite' }} />
      <div className="pink-bubble" style={{ width: '250px', height: '250px', bottom: '15%', right: '8%', animation: 'floatBubble 8s ease-in-out infinite 1s' }} />
      <div className="pink-bubble" style={{ width: '120px', height: '120px', top: '40%', right: '15%', animation: 'floatBubble 5s ease-in-out infinite 2s' }} />

      {/* --- İçerik Katmanı (Z-Index ile üstte tutuluyor) --- */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        
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

        {/* Veri Kartları */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          flexWrap: 'wrap', 
          maxWidth: '1000px', 
          margin: '0 auto'
        }}>
          <div className="card-hover" style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Sıcaklık</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fb923c' }}>{data.temperature} &deg;C</div>
          </div>

          <div className="card-hover" style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Nem</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#38bdf8' }}>{data.humidity} %</div>
          </div>

          <div className="card-hover" style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Hashrate</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80' }}>{hashrateVal.toFixed(2)} kH/s</div>
          </div>

          <div className="card-hover" style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>Kabul / Red</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#c084fc' }}>{data.accepted} / {data.rejected}</div>
          </div>

          <div className="card-hover" style={{ background: '#1e293b', padding: '20px 30px', borderRadius: '12px', minWidth: '200px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#cbd5e1' }}>DUCO Bakiye</h3>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#facc15' }}>{Number(ducoBalance).toFixed(4)} DUCO</div>
          </div>
        </div>
        
        <div style={{ marginTop: '30px', color: '#64748b' }}>
          Cihaz: {data.device}
        </div>

      </div>
    </main>
  );
}