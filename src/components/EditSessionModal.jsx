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
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Edit Session Details</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          
          <div>
            <label className="form-label">Session Name</label>
            <input 
              className="search-input" 
              value={formData.sessionNumber} 
              onChange={e => setFormData({...formData, sessionNumber: e.target.value})} 
            />
          </div>

          <div>
            <label className="form-label">Target Duration (min)</label>
            <input 
              type="number"
              className="search-input" 
              value={formData.baseDuration} 
              onChange={e => setFormData({...formData, baseDuration: parseInt(e.target.value) || 0})} 
            />
          </div>

          <div>
            <label className="form-label">Theme Override</label>
            <input 
              className="search-input" 
              value={formData.programTheme} 
              onChange={e => setFormData({...formData, programTheme: e.target.value})} 
            />
          </div>

          <div>
            <label className="form-label">Focus Area Override</label>
            <input 
              className="search-input" 
              value={formData.programFocus} 
              onChange={e => setFormData({...formData, programFocus: e.target.value})} 
            />
          </div>

          <div>
            <label className="form-label">Session Notes</label>
            <textarea 
              className="search-input" 
              style={{ height: '80px' }}
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})} 
            />
          </div>

        </div>

        <div style={{ padding: 'var(--spacing-3)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
