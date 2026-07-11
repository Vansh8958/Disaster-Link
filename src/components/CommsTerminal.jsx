import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Radio, MessageSquare, Terminal } from 'lucide-react';

const CommsTerminal = ({ onClose, activeMission }) => {
  const [mode, setMode] = useState(activeMission ? 'mission' : 'mesh'); // 'mesh' or 'mission'
  const [meshMessages, setMeshMessages] = useState([
    { id: 1, sender: 'SYS_BROADCAST', text: 'Mesh network established. 14 nodes active.', time: '11:42 AM', isSys: true },
    { id: 2, sender: 'Node_7A4', text: 'Bridge on route 9 is out. Do not attempt crossing.', time: '11:45 AM' },
    { id: 3, sender: 'Node_2B1', text: 'Copy that. Rerouting convoy.', time: '11:46 AM' }
  ]);
  const [missionMessages, setMissionMessages] = useState([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    // If activeMission changes, reset mission messages
    if (activeMission) {
      setMode('mission');
      setMissionMessages([
        { id: 1, sender: 'DISPATCH', text: `Mission assigned: ${activeMission.type}. Units en route to ${activeMission.address}.`, time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), isSys: true }
      ]);
    } else {
      setMode('mesh');
    }
  }, [activeMission]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [meshMessages, missionMessages, mode]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'HQ (You)',
      text: input.trim(),
      time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
      isOwn: true
    };

    if (mode === 'mesh') {
      setMeshMessages(prev => [...prev, newMsg]);
    } else {
      setMissionMessages(prev => [...prev, newMsg]);
      // Simulate AI response for mission
      setTimeout(() => {
        setMissionMessages(prev => [...prev, {
          id: Date.now()+1,
          sender: activeMission?.responder === 'official' ? 'Rescue Squad Alpha' : 'Volunteer_19',
          text: 'Copy that, HQ. Proceeding with instructions.',
          time: new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})
        }]);
      }, 2000);
    }
    setInput('');
  };

  const messages = mode === 'mesh' ? meshMessages : missionMessages;

  return (
    <div style={{
      position: 'absolute', bottom: '20px', left: '420px', width: '360px', height: '400px',
      zIndex: 1000, borderRadius: '12px', overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)', padding: '12px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc', fontSize: '0.9rem', fontWeight: 'bold' }}>
          <Terminal size={16} color="#3b82f6" /> COMMS TERMINAL
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <button 
          onClick={() => setMode('mesh')}
          style={{ flex: 1, padding: '8px', background: mode === 'mesh' ? 'rgba(59, 130, 246, 0.2)' : 'transparent', border: 'none', color: mode === 'mesh' ? '#60a5fa' : '#94a3b8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
        >
          <Radio size={12} /> GLOBAL MESH
        </button>
        <button 
          onClick={() => setMode('mission')}
          style={{ flex: 1, padding: '8px', background: mode === 'mission' ? 'rgba(16, 185, 129, 0.2)' : 'transparent', border: 'none', color: activeMission ? (mode === 'mission' ? '#34d399' : '#94a3b8') : (mode === 'mission' ? '#34d399' : '#475569'), fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
        >
          <MessageSquare size={12} /> MISSION {activeMission && '(ACTIVE)'}
        </button>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace' }}>
        
        {mode === 'mission' && !activeMission ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#64748b', textAlign: 'center', padding: '24px' }}>
            <MessageSquare size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold' }}>NO ACTIVE MISSION</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem' }}>Click on a distress signal (red pin) on the map and dispatch a team to open direct communications.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{
              alignSelf: msg.isSys ? 'center' : (msg.isOwn ? 'flex-end' : 'flex-start'),
              background: msg.isSys ? 'transparent' : (msg.isOwn ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)'),
              border: msg.isSys ? 'none' : `1px solid ${msg.isOwn ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
              padding: msg.isSys ? '4px' : '8px 12px', borderRadius: '8px', maxWidth: '80%',
              color: msg.isSys ? '#94a3b8' : '#f8fafc', fontSize: msg.isSys ? '0.7rem' : '0.8rem', textAlign: msg.isSys ? 'center' : 'left'
            }}>
              {!msg.isSys && <div style={{ fontSize: '0.65rem', color: msg.isOwn ? '#93c5fd' : '#cbd5e1', marginBottom: '4px' }}>{msg.sender} • {msg.time}</div>}
              <div>{msg.text}</div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '12px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <input 
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'mission' && !activeMission ? 'Select a mission first...' : (mode === 'mission' ? 'Message Rescue Team...' : 'Broadcast to Mesh Network...')}
          style={{ flex: 1, background: 'transparent', border: 'none', color: '#f8fafc', outline: 'none', fontSize: '0.8rem', fontFamily: 'monospace' }}
          disabled={mode === 'mission' && !activeMission}
        />
        <button type="submit" style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default CommsTerminal;
