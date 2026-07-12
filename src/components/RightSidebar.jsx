import React, { useState } from 'react';
import { Package, Trophy, Droplets, Flame, ShieldAlert, ChevronRight, ChevronLeft, UserPlus } from 'lucide-react';

const RightSidebar = ({ inventory, leaderboard, onResponderClick, liveActivity = [], aiLogs = [], onOpenVolunteer, volunteerProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (type) => {
    if (type === 'water') return <Droplets size={16} />;
    if (type === 'medical') return <ShieldAlert size={16} />;
    if (type === 'blankets') return <Flame size={16} />;
    return <Package size={16} />;
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.saves - a.saves);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'absolute', right: isOpen ? '360px' : '20px', top: '20px', zIndex: 1001,
          background: 'rgba(0,0,0,0.7)', color: 'white', border: '1px solid var(--border-color)',
          borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'right 0.3s ease', backdropFilter: 'blur(10px)'
        }}
        title={isOpen ? "Close Logistics & Telemetry" : "Open Logistics & Telemetry"}
      >
        {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>

      <div className="glass-panel" style={{
        position: 'absolute', right: isOpen ? '20px' : '-400px', top: '20px', bottom: '20px', width: '320px',
        zIndex: 1000, borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px',
        transition: 'right 0.3s ease', overflowY: 'auto'
      }}>
        <style>{`
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.5); border-radius: 4px; }
          ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.4); border-radius: 4px; border: 1px solid rgba(0,0,0,0.2); }
          ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.6); }
        `}</style>
      
      {/* Inventory Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
          <Package size={20} color="var(--primary)" /> Resource Command
        </h2>
        
        {inventory.map((item, idx) => {
          const percent = Math.round((item.current / item.total) * 100);
          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{getIcon(item.type)} {item.name}</span>
                <span style={{ fontWeight: 600 }}>{item.current}/{item.total}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${percent}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 1s ease' }}></div>
              </div>
            </div>
          )
        })}

        {/* Live Activity Feed */}
        {liveActivity.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: '#10b981', marginBottom: '2px' }}>Live Activity</strong>
            {liveActivity.map((act, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: '#64748b' }}>[{act.time}]</span>
                <span>{act.msg}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />
      
      <button 
        onClick={onOpenVolunteer}
        style={{ 
          width: '100%', padding: '12px', background: volunteerProfile?.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${volunteerProfile?.isActive ? '#10b981' : 'rgba(16, 185, 129, 0.3)'}`, color: '#10b981',
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', flexShrink: 0
        }}
      >
        <UserPlus size={18} /> {volunteerProfile?.isActive ? 'Volunteer Active' : 'Register as Volunteer'}
      </button>

      {/* Leaderboard Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
          <Trophy size={20} color="#f59e0b" /> Rescue Leaderboard
        </h2>
        
        {sortedLeaderboard.map((person, idx) => (
          <div key={idx} 
               onClick={() => onResponderClick && onResponderClick(person)}
               style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
            background: idx === 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0,0,0,0.2)',
            border: idx === 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-color)',
            borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease'
          }}>
            {person.picture ? (
              <img src={person.picture} alt={person.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: idx === 0 ? '2px solid #f59e0b' : '1px solid var(--border-color)' }} />
            ) : (
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', background: idx === 0 ? '#f59e0b' : 'var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem'
              }}>
                #{idx + 1}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: idx === 0 ? '#fcd34d' : 'white' }}>
                {person.name}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{person.role}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>{person.saves}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Saved</div>
            </div>
          </div>
        ))}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

      {/* AI Dispatch Console */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
          AI Dispatch Console
        </h2>
        <div style={{ 
          background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '12px', 
          fontFamily: 'monospace', fontSize: '0.7rem', color: '#10b981', 
          height: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          {aiLogs.map((log, i) => (
            <div key={i} style={{ opacity: i === aiLogs.length - 1 ? 1 : 0.7 }}>{log}</div>
          ))}
        </div>
      </div>
      
      <div style={{ position: 'sticky', bottom: '-24px', left: 0, right: 0, textAlign: 'center', padding: '16px 0', background: 'linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0) 100%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
        <div className="pulsing" style={{ background: 'var(--card-bg)', borderRadius: '50%', padding: '4px', marginBottom: '4px' }}>
          <ChevronDown size={16} color="#94a3b8" />
        </div>
        SCROLL FOR MORE
      </div>
    </div>
    </>
  );
};

export default RightSidebar;
