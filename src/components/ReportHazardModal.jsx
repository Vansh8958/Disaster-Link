import React, { useState } from 'react';
import { X, MapPin, AlertTriangle, Zap, Droplets, Image as ImageIcon } from 'lucide-react';

const ReportHazardModal = ({ isOpen, onClose, onSubmit, userLocation }) => {
  const [hazardType, setHazardType] = useState('Fallen Tree');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      id: Date.now(),
      type: 'Hazard: ' + hazardType,
      description,
      lat: userLocation[0],
      lng: userLocation[1],
      dataSource: 'crowd',
      status: 'Active',
      timestamp: new Date().toISOString()
    });
    setHazardType('Fallen Tree');
    setDescription('');
    onClose();
  };

  const hazards = [
    { type: 'Fallen Tree', icon: AlertTriangle, color: '#f59e0b' },
    { type: 'Flooded Road', icon: Droplets, color: '#3b82f6' },
    { type: 'Live Wire', icon: Zap, color: '#ef4444' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin color="#f59e0b" /> Report Hazard
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Drop a hazard pin at your current GPS location to warn others.
        </p>

        <h4 style={{ marginBottom: '12px', fontSize: '0.9rem' }}>Select Hazard Type</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
          {hazards.map(h => (
            <button 
              key={h.type}
              onClick={() => setHazardType(h.type)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '12px 8px',
                background: hazardType === h.type ? `rgba(245, 158, 11, 0.2)` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${hazardType === h.type ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px', color: hazardType === h.type ? '#fcd34d' : '#94a3b8', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <h.icon size={24} color={hazardType === h.type ? h.color : '#64748b'} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center' }}>{h.type}</span>
            </button>
          ))}
        </div>

        <textarea 
          className="input-field" 
          placeholder="Add details (optional)..." 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: '16px', padding: '12px', minHeight: '80px', resize: 'vertical' }}
        />

        <button 
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.2)', color: '#cbd5e1', width: '100%', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }}
        >
          <ImageIcon size={18} /> Add Photo (Simulated)
        </button>

        <button 
          className="action-btn"
          style={{ background: '#f59e0b', color: 'white', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', fontSize: '1rem' }}
          onClick={handleSubmit}
        >
          <MapPin size={18} /> Drop Pin
        </button>
      </div>
    </div>
  );
};

export default ReportHazardModal;
