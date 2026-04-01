import React, { useState, useEffect } from 'react';
import { X, Save, Share2, PlusCircle } from 'lucide-react';
import { useStore } from '../store';

export default function EditActivityModal({ isOpen, onClose, activity }) {
  const { updateActivityInSession, updateGame, addGame, energyTypes, flowPositions, categories } = useStore();
  const [formData, setFormData] = useState(null);
  const [saveMode, setSaveMode] = useState('session'); // 'session', 'repository', 'new'

  useEffect(() => {
    if (activity) {
      setFormData({
        title: activity.title || '',
        actualDuration: activity.actualDuration || 10,
        flowPosition: activity.flowPosition || 'Core',
        energyType: activity.energyType || 'Interactive',
        category: activity.theme_clean || 'General',
        context: activity.context || '',
        objective: activity.objective || '',
        notes: activity.notes || '',
        difficulty: activity.difficulty || 'Medium'
      });
      setSaveMode('session');
    }
  }, [activity]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (!formData.title) return alert('Title is required');

    const activityUpdates = {
      ...formData,
      theme_clean: formData.category // Sync back to legacy key if needed
    };

    // 1. Update in Session (Always)
    updateActivityInSession(activity.instanceId, activityUpdates);

    // 2. Repository Sync Logic
    if (saveMode === 'repository') {
       updateGame(activity.id || activity.title, activityUpdates);
    } else if (saveMode === 'new') {
       addGame({
         ...activityUpdates,
         duration: `${formData.actualDuration} min`
       });
    }

    onClose();
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Edit Activity: {activity.title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', maxHeight: '70vh', overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
            <div>
              <label className="form-label">Activity Name</label>
              <input 
                className="search-input" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select 
                className="search-input" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
            <div>
              <label className="form-label">Planned Duration (min)</label>
              <input 
                type="number" 
                className="search-input" 
                value={formData.actualDuration} 
                onChange={e => setFormData({...formData, actualDuration: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div>
              <label className="form-label">Flow Position</label>
              <select 
                className="search-input" 
                value={formData.flowPosition} 
                onChange={e => setFormData({...formData, flowPosition: e.target.value})}
              >
                {flowPositions.map(fp => <option key={fp} value={fp}>{fp}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Strategic Objective</label>
            <input 
              className="search-input" 
              placeholder="e.g. Break silos, build trust..."
              value={formData.objective} 
              onChange={e => setFormData({...formData, objective: e.target.value})} 
            />
          </div>

          <div>
            <label className="form-label">Context / When to use</label>
            <textarea 
              className="search-input" 
              style={{ height: '60px' }}
              value={formData.context} 
              onChange={e => setFormData({...formData, context: e.target.value})} 
            />
          </div>

          <div>
            <label className="form-label">Activity Notes</label>
            <textarea 
              className="search-input" 
              style={{ height: '80px' }}
              value={formData.notes} 
              onChange={e => setFormData({...formData, notes: e.target.value})} 
            />
          </div>

          <div style={{ marginTop: 'var(--spacing-2)', paddingTop: 'var(--spacing-3)', borderTop: '1px solid var(--border)' }}>
            <label className="form-label" style={{ marginBottom: '12px' }}>Save Method</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <div 
                onClick={() => setSaveMode('session')}
                style={{ 
                  padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  background: saveMode === 'session' ? 'rgba(255, 122, 47, 0.05)' : 'transparent',
                  borderColor: saveMode === 'session' ? 'var(--accent)' : 'var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={14} color={saveMode === 'session' ? 'var(--accent)' : 'var(--text-dim)'} />
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Edit this session only</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Local override, does not affect the master repository.</p>
              </div>

              <div 
                onClick={() => setSaveMode('repository')}
                style={{ 
                  padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  background: saveMode === 'repository' ? 'rgba(255, 122, 47, 0.05)' : 'transparent',
                  borderColor: saveMode === 'repository' ? 'var(--accent)' : 'var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Share2 size={14} color={saveMode === 'repository' ? 'var(--accent)' : 'var(--text-dim)'} />
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Update repository version</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Sync these changes back to the main activity library.</p>
              </div>

              <div 
                onClick={() => setSaveMode('new')}
                style={{ 
                  padding: '12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  background: saveMode === 'new' ? 'rgba(255, 122, 47, 0.05)' : 'transparent',
                  borderColor: saveMode === 'new' ? 'var(--accent)' : 'var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={14} color={saveMode === 'new' ? 'var(--accent)' : 'var(--text-dim)'} />
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Save as new activity</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Create a separate copy in the repository library.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 'var(--spacing-3)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Apply Changes</button>
        </div>
      </div>
    </div>
  );
}
