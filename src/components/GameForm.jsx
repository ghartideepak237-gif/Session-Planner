import React, { useState } from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameForm({ isOpen, onClose }) {
  const { addGame, categories, energyTypes, engagementTypes, interactionTypes } = useStore();
  
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    theme_clean: categories[0] || 'General',
    energyType: energyTypes[0],
    engagementType: engagementTypes[0],
    rules: '',
    context: '',
    interaction_types: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.duration || !formData.rules || !formData.context) {
      alert('Please fill out all required fields.');
      return;
    }
    
    addGame({
      ...formData,
      cat_clean: 'Activity'
    });
    
    setFormData({
      title: '', duration: '', theme_clean: categories[0] || 'General',
      energyType: energyTypes[0], engagementType: engagementTypes[0], rules: '', context: '',
      interaction_types: []
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleInteractionType = (type) => {
    setFormData(prev => {
      const current = prev.interaction_types || [];
      const next = current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type];
      return { ...prev, interaction_types: next };
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="modal-content-glass"
          style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div style={{ padding: '20px 32px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                Add Custom <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Activity</span>
                <Sparkles size={16} color="var(--accent-gold)" />
              </h2>
            </div>
            <button onClick={onClose} className="tool-btn-v8" style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
          </div>

          <form style={{ flex: 1, overflowY: 'auto', padding: '32px' }} onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Activity Name */}
              <div className="v8-form-group">
                <label className="v8-form-label">Activity Name *</label>
                <input 
                  name="title" 
                  placeholder="e.g. Rapid Retro / Deep Dive..."
                  value={formData.title} 
                  onChange={handleChange} 
                  className="v8-input-premium" 
                  style={{ width: '100%' }}
                  required 
                />
              </div>

              {/* Grid: Duration & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="v8-form-group">
                  <label className="v8-form-label">Base Duration *</label>
                  <input 
                    name="duration" 
                    placeholder="e.g. 15 min" 
                    value={formData.duration} 
                    onChange={handleChange} 
                    className="v8-input-premium" 
                    style={{ width: '100%' }}
                    required 
                  />
                </div>
                <div className="v8-form-group">
                  <label className="v8-form-label">Primary Category</label>
                  <select 
                    name="theme_clean" 
                    value={formData.theme_clean} 
                    onChange={handleChange} 
                    className="v8-input-premium" 
                    style={{ appearance: 'none', width: '100%' }}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Energy Type Select */}
              <div className="v8-form-group">
                <label className="v8-form-label">Energy Classification</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {energyTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, energyType: type }))}
                      className={`pill-v8 ${formData.energyType === type ? 'active' : ''}`}
                      style={{ padding: '6px 14px', fontSize: '10px' }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Engagement Profile - Multiselect */}
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
                        style={{
                          padding: '6px 12px',
                          borderRadius: '99px',
                          fontSize: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          border: '0.5px solid',
                          transition: 'all 0.2s',
                          background: isSelected ? 'rgba(125, 200, 255, 0.1)' : 'rgba(255,255,255,0.03)',
                          borderColor: isSelected ? 'var(--accent-silver)' : 'rgba(255,255,255,0.08)',
                          color: isSelected ? 'var(--accent-silver)' : 'var(--text-inactive)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isSelected && <Check size={8} />}
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="v8-form-group">
                <label className="v8-form-label">Facilitation Instructions *</label>
                <textarea 
                  name="rules" 
                  placeholder="Describe the flow, rules, and variations..."
                  rows="3" 
                  value={formData.rules} 
                  onChange={handleChange} 
                  className="v8-input-premium" 
                  style={{ resize: 'none', lineHeight: '1.6', width: '100%' }} 
                  required 
                />
              </div>

              {/* Best Used When */}
              <div className="v8-form-group">
                <label className="v8-form-label" style={{ color: 'var(--accent-silver)' }}>Strategic Context *</label>
                <textarea 
                  name="context" 
                  placeholder="e.g. When psychological safety is high..." 
                  rows="2" 
                  value={formData.context} 
                  onChange={handleChange} 
                  className="v8-input-premium" 
                  style={{ background: 'rgba(125,200,255,0.02)', borderColor: 'rgba(125,200,255,0.1)', resize: 'none', width: '100%' }} 
                  required 
                />
              </div>
            </div>
            
            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingBottom: '8px' }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ border: 'none', background: 'none' }}>Discard</button>
              <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={14} /> Save Activity
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
