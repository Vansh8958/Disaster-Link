import React from 'react';
import { Info, X, ShieldAlert, Navigation, MessageSquare, Radio } from 'lucide-react';

const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div className="modal-content" style={{
        background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '600px',
        color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px' }}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem', color: '#3b82f6' }}>
            <Info size={28} /> Welcome to Disaster Link AI
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem', lineHeight: '1.6', color: '#cbd5e1' }}>
          <p style={{ margin: 0 }}>This is an AI-powered Emergency Command Center designed for low-connectivity disaster zones. Here is how to operate the system:</p>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <ShieldAlert size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '4px' }} />
            <div><strong>Interactive Map & Triage:</strong> Click on any Red Pin (Emergency) to view details. You can dispatch a Volunteer (Blue Route) or an Official Team (Red Route from an NGO base).</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Radio size={20} color="#8b5cf6" style={{ flexShrink: 0, marginTop: '4px' }} />
            <div><strong>Live API Integration:</strong> The "Gov Alert" pins and the Weather Widget are pulling 100% real, live data from the USGS and Open-Meteo APIs based on your GPS location.</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Navigation size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '4px' }} />
            <div><strong>Drone Recon (DRONE Button):</strong> Click "DRONE" in the left sidebar to overlay a live picture-in-picture aerial video feed of the disaster zone.</div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <MessageSquare size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: '4px' }} />
            <div><strong>Comms Terminal:</strong> Click "OPEN COMMS" at the bottom. Use "Global Mesh" to establish an offline P2P chat. If you dispatch a team, use the "Mission" tab to chat directly with them via AI.</div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="pulsing"
          style={{
            background: '#3b82f6', color: 'white', border: 'none', padding: '16px', borderRadius: '8px',
            fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}
        >
          INITIALIZE COMMAND CENTER
        </button>

      </div>
    </div>
  );
};

export default InstructionsModal;
