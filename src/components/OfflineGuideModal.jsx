import React from 'react';
import { X, Activity, AlertCircle } from 'lucide-react';

const OfflineGuideModal = ({ isOpen, onClose, guideType }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' }}>
      <div className="glass-panel" style={{ width: '400px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto', padding: '24px', borderRadius: '24px', position: 'relative', background: '#1e293b', border: '1px solid #334155' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        
        {guideType === 'firstaid' && (
          <>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '16px' }}><Activity /> First Aid Basics</h2>
            <div style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '12px' }}><strong>1. Bleeding:</strong> Apply firm, direct pressure with a clean cloth. Elevate the injured area if possible.</p>
              <p style={{ marginBottom: '12px' }}><strong>2. Burns:</strong> Cool with running water for 10 minutes. Do not apply ice or ointments immediately.</p>
              <p style={{ marginBottom: '12px' }}><strong>3. CPR:</strong> Push hard and fast in the center of the chest (100-120 beats/min). Continue until help arrives.</p>
              <p style={{ marginBottom: '12px' }}><strong>4. Shock:</strong> Lay the person flat, elevate their feet, and keep them warm with a blanket.</p>
              <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <em>Note: This guide is cached on your device for offline emergency access. No internet required.</em>
              </div>
            </div>
          </>
        )}
        
        {guideType === 'gobag' && (
          <>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '16px' }}><AlertCircle /> Go-Bag Checklist</h2>
            <div style={{ color: '#cbd5e1', lineHeight: '1.6', fontSize: '0.95rem' }}>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Water (1 gallon per person per day)</li>
                <li>Non-perishable food (3-day supply)</li>
                <li>Battery-powered radio and flashlight</li>
                <li>First aid kit</li>
                <li>Extra batteries</li>
                <li>Whistle to signal for help</li>
                <li>Dust mask (for contaminated air)</li>
                <li>Local maps</li>
              </ul>
              <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <em>Note: This guide is cached on your device for offline emergency access. No internet required.</em>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineGuideModal;
