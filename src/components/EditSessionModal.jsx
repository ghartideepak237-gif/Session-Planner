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
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content-glass" style={{ maxWidth: '480px', width: '90%', maxHeight: '85vh', padding: '0', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '24px 32px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>
            Session <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Configuration</span>
          </h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', flex: 1 }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div className="v8-form-group">
              <label className="v8-form-label">Session Name</label>
              <input 
                className="v8-input-premium"
                style={{ width: '100%' }}
                value={formData.sessionNumber} 
                onChange={e => setFormData({...formData, sessionNumber: e.target.value})} 
                placeholder="e.g. Session 01: The Launch"
              />
            </div>
            <div className="v8-form-group">
              <label className="v8-form-label">Time (m)</label>
              <input 
                type="number"
                className="v8-input-premium"
                style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}
                value={45} 
                disabled
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div className="v8-form-group">
              <label className="v8-form-label">Theme Override</label>
              <input 
                className="v8-input-premium"
                style={{ width: '100%' }}
                value={formData.programTheme} 
                onChange={e => setFormData({...formData, programTheme: e.target.value})} 
                placeholder="Inherited thematic"
              />
            </div>
            <div className="v8-form-group">
              <label className="v8-form-label">Focus Area</label>
              <input 
                className="v8-input-premium"
                style={{ width: '100%' }}
                value={formData.programFocus} 
                onChange={e => setFormData({...formData, programFocus: e.target.value})} 
                placeholder="Inherited focus"
              />
            </div>
          </div>

          <div className="v8-form-group">
            <label className="v8-form-label">Executive Notes</label>
            <textarea 
              className="v8-input-premium"
              style={{ width: '100%', minHeight: '100px', resize: 'none', lineHeight: '1.6' }}
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})} 
              placeholder="Deploy strategy, materials, or special constraints..."
            />
          </div>

        </div>

        <div style={{ padding: '24px 32px', borderTop: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
          <button className="btn-secondary" onClick={onClose} style={{ border: 'none', background: 'none' }}>Discard</button>
          <button className="btn-primary" onClick={handleSave} style={{ padding: '10px 32px', borderRadius: '12px' }}>Save Parameters</button>
        </div>
      </div>
    </div>
  );
}
