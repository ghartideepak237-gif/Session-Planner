import React, { useState, useEffect } from 'react';
import { X, Save, Share2, PlusCircle } from 'lucide-react';
import { useStore } from '../store';

export default function EditActivityModal({ isOpen, onClose, activity, mode = 'session' }) {
  const { updateActivityInSession, updateGame, addGame, energyTypes, flowPositions, categories, interactionTypes } = useStore();
  const [formData, setFormData] = useState(null);
  const [saveMode, setSaveMode] = useState(mode); // 'session', 'repository', 'new'

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
        description: activity.description || activity.rules || '',
        notes: activity.notes || '',
        facilitatorNotes: activity.facilitatorNotes || '',
        difficulty: activity.difficulty || 'Medium',
        interaction_types: activity.interaction_types || []
      });
      // Set default save mode based on prop or presence of instanceId
      if (mode === 'repository' || !activity.instanceId) {
        setSaveMode('repository');
      } else {
        setSaveMode('session');
      }
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
    <div className="modal-overlay" style={{ zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
      <div className="modal-content-v8" style={{ maxWidth: '600px', background: 'var(--bg-deep)', border: '0.5px solid var(--border-main)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}>
        <div style={{ padding: '24px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>
            Edit <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Activity</span>
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-inactive)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Activity Name</label>
              <input 
                className="v8-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px' }}
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Category</label>
              <select 
                className="v8-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px' }}
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Planned Duration (min)</label>
              <input 
                type="number" 
                className="v8-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px' }}
                value={formData.actualDuration} 
                onChange={e => setFormData({...formData, actualDuration: parseInt(e.target.value) || 0})} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Energy Stage (PEL Flow)</label>
              <select 
                className="v8-input"
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px' }}
                value={formData.flowPosition} 
                onChange={e => {
                   const val = e.target.value;
                   setFormData({...formData, flowPosition: val, energyType: val.replace(/\s\S+$/, '')});
                }}
              >
                {flowPositions.map(fp => <option key={fp} value={fp}>{fp}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px' }}>Interaction Types</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {interactionTypes.map(type => {
                const isSelected = formData.interaction_types?.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => {
                      const current = formData.interaction_types || [];
                      const next = current.includes(type)
                        ? current.filter(t => t !== type)
                        : [...current, type];
                      setFormData({...formData, interaction_types: next});
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '99px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: '0.5px solid',
                      transition: 'all 0.2s',
                      background: isSelected ? 'rgba(125,200,255,0.15)' : 'rgba(255,255,255,0.04)',
                      borderColor: isSelected ? '#7dc8ff' : 'rgba(255,255,255,0.1)',
                      color: isSelected ? '#7dc8ff' : 'rgba(255,255,255,0.4)'
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Strategic Objective</label>
            <input 
              className="v8-input"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px' }}
              placeholder="e.g. Break silos, build trust..."
              value={formData.objective} 
              onChange={e => setFormData({...formData, objective: e.target.value})} 
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-sans)' }}>Activity Description</label>
            <textarea 
              className="v8-input"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '12px', height: '100px', resize: 'none' }}
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div style={{ marginTop: '16px', paddingTop: '24px', borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
            <label style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '16px' }}>Save Specification</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {[
                { id: 'session', icon: <Save size={14} />, label: 'Current Session Only', desc: 'Local override only' },
                { id: 'repository', icon: <Share2 size={14} />, label: 'Update Master', desc: 'Sync to library' },
                { id: 'new', icon: <PlusCircle size={14} />, label: 'Save as New', desc: 'Create copy' }
              ].map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => setSaveMode(opt.id)}
                  style={{ 
                    padding: '16px', border: '0.5px solid', borderRadius: '16px', cursor: 'pointer',
                    background: saveMode === opt.id ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                    borderColor: saveMode === opt.id ? '#FFFFFF' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: saveMode === opt.id ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }}>
                    {opt.icon}
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>{opt.label}</span>
                  </div>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', borderTop: '0.5px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Confirm Changes</button>
        </div>
      </div>
    </div>
  );
}
