import React, { useState } from 'react';

const SOSModal = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState('Medical Emergency');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, description });
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <h2 style={{ marginBottom: '8px', color: 'var(--primary)' }}>Broadcast SOS</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          Your exact GPS location will be sent to nearby responders.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Emergency Type</label>
          <select 
            className="select-field"
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option>Medical Emergency</option>
            <option>Trapped / Rescue Needed</option>
            <option>Food / Water Required</option>
            <option>Shelter Needed</option>
          </select>

          <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Additional Details (Optional)</label>
          <textarea 
            className="input-field" 
            rows="3" 
            placeholder="E.g., 2 people trapped, diabetic needs insulin..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="action-btn btn-primary">Broadcast Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SOSModal;
