import React, { useState, useEffect } from 'react';
import { X, Maximize2, Radio, Target } from 'lucide-react';

const DroneVideoFeed = ({ onClose, location }) => {
  const [telemetry, setTelemetry] = useState({ alt: 420, spd: 45, battery: 88 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        alt: prev.alt + (Math.random() - 0.5) * 5,
        spd: prev.spd + (Math.random() - 0.5) * 2,
        battery: Math.max(0, prev.battery - 0.1)
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'absolute', top: '20px', left: '420px', width: '320px', height: '240px',
      zIndex: 1000, borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(16, 185, 129, 0.4)',
      background: '#000', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(0,0,0,0.8)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', backdropFilter: 'blur(4px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          <Radio size={14} className="pulsing" /> LIVE UAV FEED
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <X size={16} />
        </button>
      </div>

      {/* Video Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <video 
          autoPlay loop muted playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.2) sepia(0.2) hue-rotate(90deg)' }} // Green night-vision/tactical vibe
          src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4"
        />
        
        {/* Telemetry Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontFamily: 'monospace', fontSize: '0.7rem', textShadow: '0 1px 2px black' }}>
            <div>ALT: {telemetry.alt.toFixed(1)}m<br/>SPD: {telemetry.spd.toFixed(1)}km/h</div>
            <div style={{ textAlign: 'right' }}>BAT: {telemetry.battery.toFixed(1)}%<br/>UPLINK: SECURE</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, opacity: 0.5 }}>
            <Target size={48} color="#10b981" strokeWidth={1} />
          </div>

          <div style={{ color: '#10b981', fontFamily: 'monospace', fontSize: '0.7rem', textShadow: '0 1px 2px black', textAlign: 'center' }}>
            {location ? `TGT: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'SCANNING SECTOR...'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneVideoFeed;
