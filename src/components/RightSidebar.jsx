import React, { useState } from 'react';
import { Package, Trophy, Droplets, Flame, ShieldAlert, ChevronRight, ChevronLeft } from 'lucide-react';

const RightSidebar = ({ inventory, leaderboard }) => {
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
      >
        {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>

      <div className="glass-panel" style={{
        position: 'absolute', right: isOpen ? '20px' : '-400px', top: '20px', bottom: '20px', width: '320px',
        zIndex: 1000, borderRadius: '24px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px',
        transition: 'right 0.3s ease'
      }}>
      
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
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

      {/* Leaderboard Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
          <Trophy size={20} color="#f59e0b" /> Rescue Leaderboard
        </h2>
        
        {sortedLeaderboard.map((person, idx) => (
          <div key={idx} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
            background: idx === 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0,0,0,0.2)',
            border: idx === 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-color)',
            borderRadius: '12px'
          }}>
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '50%', background: idx === 0 ? '#f59e0b' : 'var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem'
            }}>
              #{idx + 1}
            </div>
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
    </div>
    </>
  );
};

export default RightSidebar;
