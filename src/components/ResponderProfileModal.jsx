import React from 'react';
import { X, Award, Activity, MapPin, CheckCircle } from 'lucide-react';

const ResponderProfileModal = ({ isOpen, onClose, responder }) => {
  if (!isOpen || !responder) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div className="modal-content" style={{
        background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '400px',
        color: '#f8fafc', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', gap: '24px'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {responder.largePicture ? (
              <img src={responder.largePicture} alt={responder.name} style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid #3b82f6', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                {responder.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{responder.name}</h2>
              <div style={{ color: '#10b981', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                <CheckCircle size={14} /> Verified {responder.role}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}><Award size={18} /> Rescues Completed</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>{responder.saves}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}><MapPin size={18} /> Origin</span>
            <span style={{ fontWeight: '500' }}>{responder.location || 'Local Sector'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}><Activity size={18} /> Status</span>
            <span style={{ fontWeight: '500', color: '#3b82f6' }}>Active / En Route</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResponderProfileModal;
