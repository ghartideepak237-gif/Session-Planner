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
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Edit Program Details</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', maxHeight: '70vh', overflowY: 'auto' }}>
          
          <div>
            <label className="form-label">Program Name</label>
            <input 
              className="search-input" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div>
            <label className="form-label">College / Institution</label>
            <input 
              className="search-input" 
              value={formData.college} 
              onChange={e => setFormData({...formData, college: e.target.value})} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
            <div>
              <label className="form-label">Duration (Weeks)</label>
              <input 
                type="number"
                className="search-input" 
                value={formData.duration} 
                onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div>
              <label className="form-label">Total Sessions</label>
              <input 
                type="number"
                className="search-input" 
                value={formData.totalSessions} 
                onChange={e => setFormData({...formData, totalSessions: parseInt(e.target.value) || 0})} 
              />
            </div>
          </div>

          <div>
            <label className="form-label">Program Objective</label>
            <textarea 
              className="search-input" 
              style={{ height: '60px' }}
              value={formData.objective} 
              onChange={e => setFormData({...formData, objective: e.target.value})} 
            />
          </div>

          <div style={{ marginTop: 'var(--spacing-2)' }}>
            <label className="form-label">Weekly Themes & Focus</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
              {Array.from({ length: formData.duration }).map((_, i) => {
                const weekNum = i + 1;
                const weekData = formData.weeks.find(w => w.week === weekNum) || { week: weekNum, theme: '', focus: '' };
                const weekIdx = formData.weeks.findIndex(w => w.week === weekNum);

                // Ensure week exists in array for editing
                if (weekIdx === -1) {
                   formData.weeks.push(weekData);
                }
                const actualIdx = formData.weeks.findIndex(w => w.week === weekNum);

                return (
                  <div key={weekNum} style={{ padding: '12px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '8px' }}>Week {weekNum}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input 
                        placeholder="Theme" 
                        className="search-input" 
                        value={formData.weeks[actualIdx]?.theme || ''} 
                        onChange={e => updateWeekData(actualIdx, 'theme', e.target.value)}
                      />
                      <input 
                        placeholder="Focus Area" 
                        className="search-input" 
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

        <div style={{ padding: 'var(--spacing-3)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Update Program</button>
        </div>
      </div>
    </div>
  );
}
