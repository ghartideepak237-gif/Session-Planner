import React, { useState } from 'react';
import { X, ArrowRight, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddGameModal({ game, onClose }) {
  const { sessions, setActiveTab, loadSessionToBuilder, addGameToSession, builder, setBuilderField } = useStore();
  
  // Combine saved sessions and the current active builder un-saved session
  const activeUnsavedOptions = builder.selectedGames.length > 0 || (builder.college || builder.sessionNumber)
    ? [{ id: 'active_builder', label: `Active Builder: ${builder.college} - ${builder.sessionNumber || 'Untitled'}`, obj: builder }]
    : [];
  
  const savedOptions = sessions.map(s => ({
    id: s.id, label: `Saved: ${s.college} - ${s.sessionNumber || 'Session'}`, obj: s
  }));

  const targetOptions = [...activeUnsavedOptions, ...savedOptions];
  
  // Default to the first available target or 'new'
  const [selectedTargetId, setSelectedTargetId] = useState(targetOptions.length > 0 ? targetOptions[0].id : 'new');

  if (!game) return null;

  const handleRouteGame = () => {
    if (selectedTargetId === 'new') {
      // Clear builder implicitly via logic below, or manually clear
      setActiveTab('builder');
      setBuilderField('selectedGames', []);
      setBuilderField('notes', '');
      setBuilderField('college', '');
      setBuilderField('sessionNumber', '');
      addGameToSession(game);
    } else if (selectedTargetId === 'active_builder') {
      // Just add to current builder
      addGameToSession(game);
      setActiveTab('builder');
    } else {
      // Load saved session to builder, then add game
      loadSessionToBuilder(selectedTargetId);
      addGameToSession(game);
      setActiveTab('builder');
    }
    onClose();
  };

  // Predictive Math
  let targetSessionObj = null;
  if (selectedTargetId === 'active_builder') targetSessionObj = builder;
  if (selectedTargetId !== 'new' && selectedTargetId !== 'active_builder') {
    targetSessionObj = sessions.find(s => s.id === selectedTargetId);
  }

  let baseTargetDuration = 45;
  let currentPlannedTime = 0;

  if (targetSessionObj) {
    baseTargetDuration = targetSessionObj.baseDuration || 45;
    currentPlannedTime = targetSessionObj.selectedGames ? targetSessionObj.selectedGames.reduce((acc, g) => acc + (g.actualDuration || g.baseDurationNum || 10), 0) : 0;
  }
  
  const originalDuration = game.baseDurationNum || 10;
  const remainingTime = baseTargetDuration - currentPlannedTime;
  const remainingAfter = remainingTime - originalDuration;
  const exceedsTime = originalDuration > remainingTime;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          className="modal-content-glass"
          style={{ maxWidth: '440px', padding: '0', display: 'flex', flexDirection: 'column' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ padding: '24px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>Route <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Activity</span></h2>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-inactive)', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '0.5px solid var(--border-soft)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>{game.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-sans)' }}>Initial Allocation: <strong style={{ color: 'var(--text-primary)' }}>{originalDuration} min</strong></p>
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '10px', fontFamily: 'var(--font-sans)' }}>Select Destination</label>
              <select 
                value={selectedTargetId} 
                onChange={e => setSelectedTargetId(e.target.value)}
                className="v8-input-premium"
                style={{ width: '100%', appearance: 'none' }}
              >
                <option value="new" style={{ background: 'var(--bg-deep)' }}>+ Initialize fresh session track</option>
                {targetOptions.map(opt => (
                  <option key={opt.id} value={opt.id} style={{ background: 'var(--bg-deep)' }}>{opt.label}</option>
                ))}
              </select>
            </div>

            {selectedTargetId !== 'new' && (
              <div style={{ padding: '16px', borderRadius: '16px', background: exceedsTime ? 'rgba(239, 68, 68, 0.05)' : 'rgba(125, 200, 255, 0.03)', border: `0.5px solid ${exceedsTime ? 'rgba(239,68,68,0.3)' : 'var(--border-accent)'}` }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontFamily: 'var(--font-sans)' }}>Current Capacity: <strong style={{ color: 'var(--text-primary)' }}>{remainingTime} min</strong></p>
                <p style={{ fontSize: '14px', fontWeight: '700', color: exceedsTime ? '#f87171' : 'var(--accent-silver)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                  Projected remaining: {remainingAfter} min
                </p>
                {exceedsTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '12px', marginTop: '12px', fontFamily: 'var(--font-sans)', fontWeight: '600' }}>
                    <AlertTriangle size={14} /> <span>Capacity warning</span>
                  </div>
                )}
              </div>
            )}

            <button 
              className="btn-primary" 
              style={{ justifyContent: 'center', padding: '16px', borderRadius: '14px', background: '#FFFFFF', color: '#000000', fontWeight: '700', border: 'none', cursor: 'pointer' }} 
              onClick={handleRouteGame}
            >
              Confirm Deployment <ArrowRight size={14} style={{ marginLeft: '8px' }} />
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
