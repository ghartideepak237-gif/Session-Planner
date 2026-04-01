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
    currentPlannedTime = targetSessionObj.selectedGames ? targetSessionObj.selectedGames.reduce((acc, g) => acc + g.actualDuration, 0) : 0;
  }
  
  const originalDuration = game.baseDurationNum || 10;
  const remainingTime = baseTargetDuration - currentPlannedTime;
  const remainingAfter = remainingTime - originalDuration;
  const exceedsTime = originalDuration > remainingTime;

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, padding: 'var(--spacing-4)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="modal-content"
          style={{ maxWidth: '400px' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Route Activity</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          <div style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            
            <div style={{ background: 'var(--bg-dark)', padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{game.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Game duration: <strong style={{ color: 'var(--text-main)' }}>{originalDuration} min</strong></p>
            </div>

            <div>
              <label className="form-label">Select Destination</label>
              <select className="search-input" value={selectedTargetId} onChange={e => setSelectedTargetId(e.target.value)}>
                <option value="new">+ Create new session flow</option>
                {targetOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            {selectedTargetId !== 'new' && (
              <div style={{ padding: 'var(--spacing-2)', borderRadius: 'var(--radius-sm)', background: exceedsTime ? 'rgba(255, 60, 60, 0.05)' : 'var(--bg-dark)', border: `1px solid ${exceedsTime ? 'rgba(255, 60, 60, 0.2)' : 'var(--border)'}` }}>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Session Remaining Time: <strong style={{ color: 'var(--text-main)' }}>{remainingTime} min</strong></p>
                <p style={{ fontSize: '13px', fontWeight: '600', color: exceedsTime ? '#ef4444' : 'var(--accent)' }}>
                  Remaining after adding: {remainingAfter} min
                </p>
                {exceedsTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontSize: '12px', marginTop: 'var(--spacing-2)' }}>
                    <AlertTriangle size={14} /> <span>This may exceed your session target time.</span>
                  </div>
                )}
              </div>
            )}

            <button className="btn-primary" style={{ justifyContent: 'center', padding: '10px' }} onClick={handleRouteGame}>
              Confirm Routing <ArrowRight size={14} />
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
