import React, { useState, useEffect } from 'react';
import { X, Save, Share2, PlusCircle, Sparkles, Check } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

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
      if (mode === 'repository' || !activity.instanceId) {
        setSaveMode('repository');
      } else {
        setSaveMode('session');
      }
    }
  }, [activity, mode]);

  if (!isOpen || !formData) return null;

  const handleSave = () => {
    if (!formData.title) return alert('Title is required');
    
    // Ensure interaction_types includes the selected category to avoid "General" fallback
    let finalInteractionTypes = [...(formData.interaction_types || [])];
    if (formData.category && !finalInteractionTypes.includes(formData.category)) {
      finalInteractionTypes.push(formData.category);
    }
    
    const activityUpdates = { 
      ...formData, 
      theme_clean: formData.category,
      interaction_types: finalInteractionTypes 
    };

    updateActivityInSession(activity.instanceId, activityUpdates);
    if (saveMode === 'repository') {
       updateGame(activity.id || activity.title, activityUpdates);
    } else if (saveMode === 'new') {
       addGame({ ...activityUpdates, duration: `${formData.actualDuration} min` });
    }
    onClose();
  };

  const toggleInteractionType = (type) => {
    setFormData(prev => {
      const current = prev.interaction_types || [];
      const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
      return { ...prev, interaction_types: next };
    });
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="modal-content-glass"
          style={{ maxWidth: '640px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: '24px 32px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                Edit <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Activity</span>
                <Sparkles size={16} color="var(--accent-gold)" />
              </h2>
            </div>
            <button onClick={onClose} className="tool-btn-v8" style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                <div className="v8-form-group">
                  <label className="v8-form-label">Activity Name</label>
                  <input 
                    className="v8-input-premium"
                    style={{ width: '100%' }}
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </div>
                <div className="v8-form-group">
                  <label className="v8-form-label">Category</label>
                  <select 
                    className="v8-input-premium"
                    style={{ width: '100%', appearance: 'none' }}
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="v8-form-group">
                  <label className="v8-form-label">Planned Duration (min)</label>
                  <input 
                    type="number" 
                    className="v8-input-premium"
                    style={{ width: '100%' }}
                    value={formData.actualDuration} 
                    onChange={e => setFormData({...formData, actualDuration: parseInt(e.target.value) || 0})} 
                  />
                </div>
                <div className="v8-form-group">
                  <label className="v8-form-label">Energy Stage (PEL Flow)</label>
                  <select 
                    className="v8-input-premium"
                    style={{ width: '100%', appearance: 'none' }}
                    value={formData.flowPosition} 
                    onChange={e => {
                       const val = e.target.value;
                       setFormData({...formData, flowPosition: val, energyType: val.split(' ')[0]});
                    }}
                  >
                    {flowPositions.map(fp => <option key={fp} value={fp}>{fp}</option>)}
                  </select>
                </div>
              </div>

              <div className="v8-form-group">
                <label className="v8-form-label">Strategic Objective</label>
                <input 
                  className="v8-input-premium"
                  style={{ width: '100%', background: 'rgba(125,211,252,0.02)', borderColor: 'rgba(125,211,252,0.1)' }}
                  placeholder="e.g. Break silos, build trust..."
                  value={formData.objective} 
                  onChange={e => setFormData({...formData, objective: e.target.value})} 
                />
              </div>

              <div className="v8-form-group">
                <label className="v8-form-label">Engagement Profile</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {interactionTypes.map(type => {
                    const isSelected = formData.interaction_types?.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleInteractionType(type)}
                        className={`pill-v8 ${isSelected ? 'active' : ''}`}
                        style={{ padding: '6px 14px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {isSelected && <Check size={8} />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="v8-form-group">
                <label className="v8-form-label">Activity Description / Rules</label>
                <textarea 
                  className="v8-input-premium"
                  style={{ width: '100%', height: '100px', resize: 'none', lineHeight: '1.6' }}
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="v8-form-group">
                <label className="v8-form-label" style={{ color: 'var(--accent-gold)' }}>Anchor Notes (Facilitation context)</label>
                <textarea 
                  className="v8-input-premium"
                  style={{ width: '100%', height: '80px', resize: 'none', lineHeight: '1.6', background: 'rgba(234,179,8,0.02)', borderColor: 'rgba(234,179,8,0.1)' }}
                  placeholder="Private notes for the facilitator..."
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})} 
                />
              </div>

              <div style={{ marginTop: '16px', paddingTop: '24px', borderTop: '0.5px solid var(--border-soft)' }}>
                <label className="v8-form-label" style={{ marginBottom: '16px', display: 'block' }}>Save Specification</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { id: 'session', icon: <Save size={14} />, label: 'Session Only', desc: 'Local jump' },
                    { id: 'repository', icon: <Share2 size={14} />, label: 'Update Master', desc: 'Sync library' },
                    { id: 'new', icon: <PlusCircle size={14} />, label: 'Save New', desc: 'Create copy' }
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      type="button"
                      onClick={() => setSaveMode(opt.id)}
                      className={`sidebar-link-v9 ${saveMode === opt.id ? 'active' : ''}`}
                      style={{ padding: '12px', textAlign: 'left', minHeight: '80px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '4px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: saveMode === opt.id ? 'var(--accent-silver)' : 'var(--text-secondary)' }}>
                        {opt.icon}
                        <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>{opt.label}</span>
                      </div>
                      <span style={{ fontSize: '9px', opacity: 0.5 }}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button className="btn-secondary" onClick={onClose} style={{ border: 'none', background: 'none' }}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={handleSave}
                style={{ padding: '10px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Save size={14} /> Confirm Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
