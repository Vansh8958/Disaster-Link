import React, { useState } from 'react';
import { AlertCircle, Navigation, Users, Activity, CheckCircle, Radar, Cloud, Wind, Thermometer, Filter, ChevronLeft, ChevronRight, PhoneCall, Sun, Moon, CloudRain, CloudSnow, CloudLightning, CloudFog, HelpCircle } from 'lucide-react';

const Sidebar = ({ incidents, weatherData, filters, setFilters, lang, setLang, mapStyle, setMapStyle, onSOSClick, onSafeClick, onIncidentClick, droneScanActive, onToggleDrone, meshNetworkActive, onToggleMesh, heatmapActive, onToggleHeatmap, activeMission, onResolveMission, onOpenInstructions }) => {
  const [isOpen, setIsOpen] = useState(true);

  const getWeatherIcon = (code, isDay) => {
    if (code === undefined) return <CheckCircle size={16} />;
    if (code === 0) return isDay ? <Sun size={16} /> : <Moon size={16} />;
    if (code >= 1 && code <= 3) return <Cloud size={16} />;
    if (code >= 45 && code <= 48) return <CloudFog size={16} />;
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={16} />;
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return <CloudSnow size={16} />;
    if (code >= 95) return <CloudLightning size={16} />;
    return <Sun size={16} />;
  };

  const getWeatherDesc = (code) => {
    if (code === undefined) return 'API Active';
    if (code === 0) return 'Clear';
    if (code >= 1 && code <= 3) return 'Cloudy';
    if (code >= 45 && code <= 48) return 'Fog';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'Rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Snow';
    if (code >= 95) return 'Storm';
    return 'Active';
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute', left: isOpen ? '420px' : '20px', top: '20px', zIndex: 1001,
          background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid var(--border-color)',
          borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'left 0.3s ease', backdropFilter: 'blur(10px)'
        }}
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      <div className="glass-panel" style={{
        position: 'absolute', left: isOpen ? '20px' : '-420px', top: '20px', bottom: '20px', width: '380px',
        zIndex: 1000, borderRadius: '24px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
        transition: 'left 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
          <Navigation size={32} color="#ef4444" style={{ transform: 'rotate(45deg)' }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>Disaster Link AI</h1>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button 
                  onClick={() => setMapStyle(mapStyle === 'dark' ? 'satellite' : 'dark')}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '4px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Toggle Map Style"
                >
                  {mapStyle === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                </button>
                <select value={lang} onChange={e => setLang(e.target.value)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75rem', padding: '2px 4px', cursor: 'pointer' }}>
                  <option value="EN">EN</option>
                  <option value="ES">ES</option>
                  <option value="HI">HI</option>
                </select>
                <button onClick={onOpenInstructions} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  <HelpCircle size={18} />
                </button>
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
              {lang === 'ES' ? 'Motor de triaje activo' : lang === 'HI' ? 'ट्राइएज इंजन सक्रिय' : 'Triage Engine Active'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="sos-button pulsing" onClick={onSOSClick} style={{ flex: 2, padding: '12px' }}>
            <AlertCircle size={20} /> {lang === 'ES' ? 'ENVIAR SOS' : lang === 'HI' ? 'एसओएस भेजें' : 'SEND SOS'}
          </button>
          <button className="safe-button" onClick={onSafeClick} style={{ flex: 1, padding: '12px' }}>
            <CheckCircle size={20} />
          </button>
        </div>

        {weatherData && (
          <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '12px', display: 'flex', justifyContent: 'space-around', border: '1px solid var(--border-color)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}><Thermometer size={16} color="#3b82f6"/> {weatherData.temperature}°</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}><Wind size={16} color="#a8a29e"/> {weatherData.windspeed} km/h</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
              {getWeatherIcon(weatherData.weathercode, weatherData.is_day)} {getWeatherDesc(weatherData.weathercode)}
            </div>
          </div>
        )}

        {activeMission && (
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', marginBottom: '4px' }}>CURRENT MISSION</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white' }}>{activeMission.type}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px', marginBottom: '8px' }}>📍 {activeMission.address}</div>
            <button 
              onClick={onResolveMission}
              style={{
                width: '100%', padding: '8px', background: 'var(--success)', color: 'white', fontWeight: 600,
                border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px'
              }}
            >
              <CheckCircle size={16} /> RESOLVE MISSION
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', width: '100%' }}>
            <Activity size={18} /> Live AI Triage Feed
          </h2>
          <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
            <button 
              onClick={onToggleDrone}
              style={{ 
                flex: 1, background: droneScanActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
                border: droneScanActive ? '1px solid #10b981' : '1px solid var(--border-color)', color: droneScanActive ? '#10b981' : 'white',
                padding: '6px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer'
              }}
            >
              <Radar size={14} /> DRONE
            </button>
            <button 
              onClick={onToggleMesh}
              style={{ 
                flex: 1, background: meshNetworkActive ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.1)',
                border: meshNetworkActive ? '1px solid #3b82f6' : '1px solid var(--border-color)', color: meshNetworkActive ? '#3b82f6' : 'white',
                padding: '6px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer'
              }}
            >
              <Navigation size={14} /> MESH
            </button>
            <button 
              onClick={onToggleHeatmap}
              style={{ 
                flex: 1, background: heatmapActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)',
                border: heatmapActive ? '1px solid #ef4444' : '1px solid var(--border-color)', color: heatmapActive ? '#ef4444' : 'white',
                padding: '6px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer'
              }}
            >
              <AlertCircle size={14} /> {lang === 'ES' ? 'PREDECIR' : lang === 'HI' ? 'भविष्यवाणी' : 'PREDICT'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--card-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}><Filter size={16} color="#3b82f6"/> DATA SOURCES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <label className={`filter-pill ${filters.gov ? 'active' : ''}`}>
              <input type="checkbox" checked={filters.gov} onChange={() => setFilters({...filters, gov: !filters.gov})} /> 
              {filters.gov && <CheckCircle size={12} />} Gov (USGS)
            </label>
            <label className={`filter-pill ${filters.ngo ? 'active' : ''}`}>
              <input type="checkbox" checked={filters.ngo} onChange={() => setFilters({...filters, ngo: !filters.ngo})} /> 
              {filters.ngo && <CheckCircle size={12} />} NGO DB
            </label>
            <label className={`filter-pill ${filters.verified ? 'active' : ''}`}>
              <input type="checkbox" checked={filters.verified} onChange={() => setFilters({...filters, verified: !filters.verified})} /> 
              {filters.verified && <CheckCircle size={12} />} Verified Users
            </label>
            <label className={`filter-pill ${filters.crowd ? 'active' : ''}`}>
              <input type="checkbox" checked={filters.crowd} onChange={() => setFilters({...filters, crowd: !filters.crowd})} /> 
              {filters.crowd && <CheckCircle size={12} />} Crowd
            </label>
          </div>
        </div>

        {/* "I'm Safe" Verification Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '10px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} /> Safe Verifications
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {['Priya S.', 'Rahul M.', 'Anita D.', 'Vikram K.'].map((name, i) => (
              <span key={i} style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', color: '#d1fae5', whiteSpace: 'nowrap' }}>
                {name} marked safe
              </span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px', minHeight: 0 }}>
          
          {incidents.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active incidents.</p>
          ) : (
            incidents.map(incident => {
              let aiTag = '';
              let tagClass = '';
              let borderCol = '';
              
              if (incident.dataSource === 'gov') {
                aiTag = 'GOV ALERT'; tagClass = 'tag-critical'; borderCol = '#ef4444';
              } else if (incident.dataSource === 'ngo') {
                aiTag = 'NGO CENTER'; tagClass = 'tag-low'; borderCol = '#10b981';
              } else if (incident.type === 'Safe') {
                aiTag = 'RESOLVED'; tagClass = 'tag-low'; borderCol = 'var(--success)';
              } else if (incident.status === 'In Progress') {
                aiTag = 'IN PROGRESS'; tagClass = 'tag-low'; borderCol = '#3b82f6';
              } else if (incident.type === 'Medical Emergency' || incident.description?.toLowerCase().includes('trapped')) {
                aiTag = 'CRITICAL'; tagClass = 'tag-critical'; borderCol = '#ef4444';
              } else {
                aiTag = 'MODERATE'; tagClass = 'tag-moderate'; borderCol = '#f59e0b';
              }

              return (
                <div 
                  key={incident.id} 
                  className="incident-card"
                  onClick={() => {
                    if (onIncidentClick) onIncidentClick(incident);
                    if ('speechSynthesis' in window) {
                      const msg = new SpeechSynthesisUtterance(`Warning, ${incident.type.replace('/', 'or')} selected.`);
                      msg.volume = 0.5;
                      msg.rate = 1.1;
                      window.speechSynthesis.cancel();
                      window.speechSynthesis.speak(msg);
                    }
                  }}
                  style={{
                    background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '12px',
                    borderLeft: `4px solid ${borderCol}`, border: '1px solid var(--border-color)', borderLeftWidth: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                    <span className={`ai-tag ${tagClass}`}>{aiTag}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(incident.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '2px' }}>
                    {incident.type === 'Safe' ? 'Family Link: User Marked Safe' : incident.type}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px' }}>📍 {incident.address}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{incident.description}</p>
                </div>
              );
            })
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          <span style={{display: 'flex', alignItems:'center', gap:'4px'}}><Users size={14} /> 1,402 Responders</span>
          <span>{incidents.length} Active Signals</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fca5a5' }}>
            EMERGENCY HELPLINE<br/>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>National Dispatch Center</span>
          </div>
          <a href="tel:911" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--primary)', color: 'white', textDecoration: 'none', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
            <PhoneCall size={14} /> CALL 911
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
