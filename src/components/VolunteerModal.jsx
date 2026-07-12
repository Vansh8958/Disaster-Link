import React, { useState } from 'react';
import { X, UserPlus, CheckCircle, Truck, HeartPulse, HardHat } from 'lucide-react';

const VolunteerModal = ({ isOpen, onClose, volunteerProfile, setVolunteerProfile }) => {
  const [name, setName] = useState(volunteerProfile?.name || '');
  const [skills, setSkills] = useState(volunteerProfile?.skills || []);

  if (!isOpen) return null;

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleSave = () => {
    setVolunteerProfile({ name, skills, isActive: true });
    onClose();
  };

  const availableSkills = [
    { id: 'medic', label: 'Medical Professional', icon: HeartPulse, color: '#ef4444' },
    { id: 'driver', label: '4x4 / Off-road Driver', icon: Truck, color: '#f59e0b' },
    { id: 'engineer', label: 'Structural Engineer', icon: HardHat, color: '#3b82f6' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()} style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus color="#10b981" /> Register as Volunteer
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          When active, the AI will prioritize and route SOS calls to you that match your specific skillset and equipment.
        </p>

        <input 
          type="text" 
          className="input-field" 
          placeholder="Your Name (Optional)" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '20px', padding: '12px' }}
        />

        <h4 style={{ marginBottom: '12px', fontSize: '0.9rem' }}>Select Your Skills/Equipment</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {availableSkills.map(skill => {
            const Icon = skill.icon;
            const isSelected = skills.includes(skill.id);
            return (
              <button 
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px',
                  background: isSelected ? `rgba(${skill.color === '#ef4444' ? '239, 68, 68' : skill.color === '#f59e0b' ? '245, 158, 11' : '59, 130, 246'}, 0.2)` : 'var(--card-bg)',
                  border: `1px solid ${isSelected ? skill.color : 'var(--border-color)'}`,
                  borderRadius: '8px', color: 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                }}
              >
                <div style={{ background: isSelected ? skill.color : 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '50%' }}>
                  <Icon size={16} color={isSelected ? 'white' : '#cbd5e1'} />
                </div>
                <div style={{ flex: 1, fontWeight: 600 }}>{skill.label}</div>
                {isSelected && <CheckCircle size={18} color={skill.color} />}
              </button>
            );
          })}
        </div>

        <button 
          className="action-btn"
          style={{ background: '#10b981', color: 'white', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', fontSize: '1rem' }}
          onClick={handleSave}
        >
          <CheckCircle size={18} /> Go Active (Receive SOS)
        </button>
      </div>
    </div>
  );
};

export default VolunteerModal;
