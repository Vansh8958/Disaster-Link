import React from 'react';

const SafeModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ borderTop: '4px solid var(--success)' }}>
        <h2 style={{ marginBottom: '8px', color: 'var(--success)' }}>Mark as Safe</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
          This will plot a green marker at your location and simulate broadcasting an automated "I am safe" message to your emergency contacts.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="action-btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="action-btn btn-success">Broadcast Safety</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SafeModal;
