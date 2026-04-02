import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store';

export default function EditSessionModal({ isOpen, onClose, session }) {
  const { updateSession } = useStore();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (session) {
      setFormData({
        sessionNumber: session.sessionNumber || '',
        baseDuration: session.baseDuration || 45,
        programTheme: session.programTheme || '',
        programFocus: session.programFocus || '',
        notes: session.notes || ''
      });
    }
  }, [session]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (!formData.sessionNumber) return alert('Session Name is required');
    updateSession(session.id, formData);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="modal-content-v8" style={{ maxWidth: '460px', background: 'var(--bg-deep)', border: '0.5px solid var(--border-main)', borderRadius: '24px', padding: '0', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
        
        <div style={{ padding: '24px 32px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>
            Session <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Configuration</span>
          </h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 120px', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Session Name</label>
              <input 
                className="v8-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px', fontSize: '14px' }}
                value={formData.sessionNumber} 
                onChange={e => setFormData({...formData, sessionNumber: e.target.value})} 
                placeholder="e.g. Session 01: The Launch"
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Time (m)</label>
              <input 
                type="number"
                className="v8-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px', fontSize: '14px' }}
                value={formData.baseDuration} 
                onChange={e => setFormData({...formData, baseDuration: parseInt(e.target.value) || 0})} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Theme Override</label>
              <input 
                className="v8-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px', fontSize: '14px' }}
                value={formData.programTheme} 
                onChange={e => setFormData({...formData, programTheme: e.target.value})} 
                placeholder="Inherited thematic"
              />
            </div>
            <div>
              <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Focus Area</label>
              <input 
                className="v8-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px', fontSize: '14px' }}
                value={formData.programFocus} 
                onChange={e => setFormData({...formData, programFocus: e.target.value})} 
                placeholder="Inherited focus"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Executive Notes</label>
            <textarea 
              className="v8-input"
              style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '16px', padding: '16px', fontSize: '13px', resize: 'vertical', lineHeight: '1.6' }}
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})} 
              placeholder="Deploy strategy, materials, or special constraints..."
            />
          </div>

        </div>

        <div style={{ padding: '24px 32px', borderTop: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '10px 24px', borderRadius: '12px' }}>Discard</button>
          <button className="btn-primary" onClick={handleSave} style={{ padding: '10px 32px', borderRadius: '12px' }}>Save Parameters</button>
        </div>
      </div>
    </div>
  );
}
