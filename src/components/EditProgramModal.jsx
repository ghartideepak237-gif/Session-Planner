import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Target } from 'lucide-react';
import { useStore } from '../store';

export default function EditProgramModal({ isOpen, onClose, program }) {
  const { updateProgram } = useStore();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (program) {
      setFormData({
        name: program.name || '',
        college: program.college || '',
        objective: program.objective || '',
        duration: program.duration || 4,
        totalSessions: program.totalSessions || 4,
        weeks: program.weeks || []
      });
    }
  }, [program]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (!formData.name || !formData.college) return alert('Name and College are required');
    
    // Safety check for decreasing sessions
    if (formData.totalSessions < program.totalSessions) {
      if (!window.confirm("You are decreasing the number of sessions. Sessions beyond the new limit will remain in the database but may be hidden from the roadmap. Continue?")) {
        return;
      }
    }

    updateProgram(program.id, formData);
    onClose();
  };

  const updateWeekData = (weekIdx, field, value) => {
    const newWeeks = [...formData.weeks];
    newWeeks[weekIdx] = { ...newWeeks[weekIdx], [field]: value };
    setFormData({ ...formData, weeks: newWeeks });
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div className="modal-content-glass" style={{ maxWidth: '640px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '0' }}>
        <div style={{ padding: '24px 32px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>
            Program <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Architecture</span>
          </h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', flex: 1 }}>
          
          <div className="v8-form-group">
            <label className="v8-form-label">Program Name</label>
            <input 
              className="v8-input-premium" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="v8-form-group">
            <label className="v8-form-label">College / Institution</label>
            <input 
              className="v8-input-premium" 
              value={formData.college} 
              onChange={e => setFormData({...formData, college: e.target.value})} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            <div className="v8-form-group">
              <label className="v8-form-label">Duration (Weeks)</label>
              <input 
                type="number"
                className="v8-input-premium" 
                value={formData.duration} 
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div className="v8-form-group">
              <label className="v8-form-label">Total Sessions</label>
              <input 
                type="number"
                className="v8-input-premium" 
                value={formData.totalSessions} 
                onChange={e => setFormData({...formData, totalSessions: parseInt(e.target.value) || 0})} 
              />
            </div>
          </div>

          <div className="v8-form-group">
            <label className="v8-form-label">Program Objective</label>
            <textarea 
              className="v8-input-premium" 
              style={{ height: '80px', resize: 'none' }}
              value={formData.objective} 
              onChange={e => setFormData({...formData, objective: e.target.value})} 
            />
          </div>

          <div style={{ marginTop: '8px' }}>
            <label className="v8-form-label" style={{ marginBottom: '16px', display: 'block' }}>Weekly Themes & Focus</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: formData.duration }).map((_, i) => {
                const weekNum = i + 1;
                const weekData = formData.weeks.find(w => w.week === weekNum) || { week: weekNum, theme: '', focus: '' };
                const weekIdx = formData.weeks.findIndex(w => w.week === weekNum);

                if (weekIdx === -1) {
                   formData.weeks.push(weekData);
                }
                const actualIdx = formData.weeks.findIndex(w => w.week === weekNum);

                return (
                  <div key={weekNum} style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border-soft)', borderRadius: '16px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '900', color: 'var(--accent-silver)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Week {weekNum}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      <input 
                        placeholder="Theme" 
                        className="v8-input-premium" 
                        value={formData.weeks[actualIdx]?.theme || ''} 
                        onChange={e => updateWeekData(actualIdx, 'theme', e.target.value)}
                      />
                      <input 
                        placeholder="Focus Area" 
                        className="v8-input-premium" 
                        value={formData.weeks[actualIdx]?.focus || ''} 
                        onChange={e => updateWeekData(actualIdx, 'focus', e.target.value)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px', borderTop: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'flex-end', gap: '16px', background: 'rgba(255,255,255,0.02)' }}>
          <button className="btn-secondary" onClick={onClose} style={{ border: 'none', background: 'none' }}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} style={{ padding: '10px 24px', borderRadius: '12px' }}>Update Program</button>
        </div>
      </div>
    </div>
  );
}
