import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function GameForm({ isOpen, onClose }) {
  const { addGame, categories, energyTypes, engagementTypes } = useStore();
  
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    theme_clean: categories[0] || 'General',
    energyType: energyTypes[0],
    engagementType: engagementTypes[0],
    rules: '',
    context: '',
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
      energyType: energyTypes[0], engagementType: engagementTypes[0], rules: '', context: ''
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="modal-content"
          style={{ maxWidth: '500px' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Add Custom Activity</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={18} /></button>
          </div>
          <form style={{ padding: 'var(--spacing-3)' }} onSubmit={handleSubmit}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div>
                <label className="form-label">Activity Name *</label>
                <input name="title" value={formData.title} onChange={handleChange} className="search-input" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
                <div>
                  <label className="form-label">Base Duration *</label>
                  <input name="duration" placeholder="e.g. 10 min" value={formData.duration} onChange={handleChange} className="search-input" required />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select name="theme_clean" value={formData.theme_clean} onChange={handleChange} className="search-input" style={{ appearance: 'none' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
                <div>
                  <label className="form-label">Energy Type</label>
                  <select name="energyType" value={formData.energyType} onChange={handleChange} className="search-input" style={{ appearance: 'none' }}>
                    {energyTypes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Engagement Profile</label>
                  <select name="engagementType" value={formData.engagementType} onChange={handleChange} className="search-input" style={{ appearance: 'none' }}>
                    {engagementTypes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Description / Instructions *</label>
                <textarea name="rules" rows="3" value={formData.rules} onChange={handleChange} className="search-input" style={{ resize: 'none' }} required />
              </div>

              <div>
                <label className="form-label" style={{ color: 'var(--accent)' }}>Best Used When *</label>
                <textarea name="context" placeholder="e.g. Group is silent, need bonding..." rows="2" value={formData.context} onChange={handleChange} className="search-input" style={{ background: 'rgba(255,107,53,0.05)', borderColor: 'rgba(255,107,53,0.2)', resize: 'none' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-4)' }}>
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Activity</button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
