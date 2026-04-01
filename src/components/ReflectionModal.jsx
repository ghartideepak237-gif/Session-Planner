import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

const GAME_MARKS = ['Worked well', 'Needs adjustment', 'Remove next time'];

export default function ReflectionModal({ sessionId, onClose }) {
  const { sessions, saveSessionReflection } = useStore();
  const session = sessions.find(s => s.id === sessionId);

  const [formData, setFormData] = useState({
    whatWorked: '',
    whatDidNotWork: '',
    bestMoment: '',
    timingIssues: '',
    improvements: '',
    energyRating: 5,
    engagementRating: 5,
    gameMarks: {}
  });

  useEffect(() => {
    if (session && session.reflection) {
      setFormData(session.reflection);
    } else {
      setFormData({
        whatWorked: '', whatDidNotWork: '', bestMoment: '',
        timingIssues: '', improvements: '',
        energyRating: 5, engagementRating: 5, gameMarks: {}
      });
    }
  }, [sessionId, session]);

  if (!session) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSessionReflection(sessionId, formData);
    onClose();
  };

  const handleMark = (gameId, mark) => {
    setFormData(prev => ({
      ...prev,
      gameMarks: {
        ...prev.gameMarks,
        [gameId]: prev.gameMarks[gameId] === mark ? null : mark
      }
    }));
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, padding: 'var(--spacing-4)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="modal-content"
          style={{ maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ padding: 'var(--spacing-3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Session Reflection</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>{session.college} - {session.sessionNumber}</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
              <div>
                <label className="form-label">Overall Energy (1-5)</label>
                <input type="range" min="1" max="5" value={formData.energyRating} onChange={e => setFormData({...formData, energyRating: Number(e.target.value)})} style={{ width: '100%' }} />
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>{formData.energyRating} / 5</div>
              </div>
              <div>
                <label className="form-label">Engagement Level (1-5)</label>
                <input type="range" min="1" max="5" value={formData.engagementRating} onChange={e => setFormData({...formData, engagementRating: Number(e.target.value)})} style={{ width: '100%' }} />
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>{formData.engagementRating} / 5</div>
              </div>
            </div>

            <div style={{ padding: 'var(--spacing-2) 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>Activity Viability</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                {session.selectedGames.map(game => (
                  <div key={game.instanceId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>{game.title}</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {GAME_MARKS.map(m => {
                        const active = formData.gameMarks[game.instanceId] === m;
                        return (
                          <button 
                            key={m} type="button" 
                            onClick={() => handleMark(game.instanceId, m)}
                            className="btn-secondary"
                            style={{ 
                              padding: '2px 8px', fontSize: '10px', 
                              background: active ? 'var(--accent)' : 'var(--bg-dark)', 
                              borderColor: active ? 'var(--accent)' : 'var(--border)',
                              color: active ? '#fff' : 'var(--text-secondary)'
                            }}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">What worked well?</label>
              <textarea className="search-input" rows="2" value={formData.whatWorked} onChange={e => setFormData({...formData, whatWorked: e.target.value})} style={{ resize: 'vertical' }} />
            </div>
            
            <div>
              <label className="form-label">What did not work?</label>
              <textarea className="search-input" rows="2" value={formData.whatDidNotWork} onChange={e => setFormData({...formData, whatDidNotWork: e.target.value})} style={{ resize: 'vertical' }} />
            </div>

            <div>
              <label className="form-label">Best engagement moment?</label>
              <input className="search-input" value={formData.bestMoment} onChange={e => setFormData({...formData, bestMoment: e.target.value})} />
            </div>

            <div>
              <label className="form-label">Timing issues?</label>
              <input className="search-input" value={formData.timingIssues} onChange={e => setFormData({...formData, timingIssues: e.target.value})} placeholder="e.g. Icebreaker took 20m instead of 10m" />
            </div>

            <div>
              <label className="form-label">Improvements for next session</label>
              <textarea className="search-input" rows="2" value={formData.improvements} onChange={e => setFormData({...formData, improvements: e.target.value})} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-2)', paddingTop: 'var(--spacing-2)' }}>
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary"><Save size={14} /> Save Notes</button>
            </div>
            
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
