import React, { useState } from 'react';
import { X, Phone, Plus, Trash2, Save } from 'lucide-react';

const ContactsModal = ({ isOpen, onClose, contacts, setContacts }) => {
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newContact.name && newContact.phone) {
      setContacts([...contacts, { id: Date.now(), ...newContact }]);
      setNewContact({ name: '', phone: '' });
    }
  };

  const handleRemove = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ background: 'rgba(15, 23, 42, 0.9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone color="#3b82f6" /> Emergency Contacts
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          These contacts will automatically receive your GPS coordinates if you tap the "Mark Safe" or "SOS" button.
        </p>

        <div style={{ marginBottom: '24px' }}>
          {contacts.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--card-bg)', borderRadius: '8px' }}>
              No emergency contacts added yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {contacts.map(contact => (
                <div key={contact.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{contact.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{contact.phone}</div>
                  </div>
                  <button onClick={() => handleRemove(contact.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
          <h4 style={{ marginBottom: '12px', fontSize: '0.9rem' }}>Add New Contact</h4>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Contact Name (e.g., Mom)" 
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            style={{ marginBottom: '8px', padding: '10px' }}
          />
          <input 
            type="tel" 
            className="input-field" 
            placeholder="Phone Number" 
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            style={{ marginBottom: '12px', padding: '10px' }}
          />
          <button 
            className="action-btn"
            style={{ background: '#3b82f6', color: 'white', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={handleAdd}
          >
            <Plus size={16} /> Add Contact
          </button>
        </div>

      </div>
    </div>
  );
};

export default ContactsModal;
