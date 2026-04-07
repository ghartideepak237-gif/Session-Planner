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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
        style={{ zIndex: 1100 }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="modal-content-glass"
          style={{ padding: '0', display: 'flex', flexDirection: 'column' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ padding: '24px 32px', borderBottom: '0.5px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>Session <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Reflection</span></h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{session.college} - {session.sessionNumber}</p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div className="v8-form-group">
                <label className="v8-form-label">Overall Energy (1-5)</label>
                <input type="range" min="1" max="5" value={formData.energyRating} onChange={e => setFormData({...formData, energyRating: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--accent-gold)' }} />
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--accent-gold)', fontWeight: '800', marginTop: '8px' }}>{formData.energyRating} / 5</div>
              </div>
              <div className="v8-form-group">
                <label className="v8-form-label">Engagement Level (1-5)</label>
                <input type="range" min="1" max="5" value={formData.engagementRating} onChange={e => setFormData({...formData, engagementRating: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--accent-silver)' }} />
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--accent-silver)', fontWeight: '800', marginTop: '8px' }}>{formData.engagementRating} / 5</div>
              </div>
            </div>

            <div style={{ padding: '24px 0', borderTop: '0.5px solid var(--border-soft)', borderBottom: '0.5px solid var(--border-soft)' }}>
              <h3 style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Activity Viability</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {session.selectedGames.map(game => (
                  <div key={game.instanceId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{game.title}</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {GAME_MARKS.map(m => {
                        const active = formData.gameMarks[game.instanceId] === m;
                        return (
                          <button 
                            key={m} type="button" 
                            onClick={() => handleMark(game.instanceId, m)}
                            className={`pill-v8 ${active ? 'active' : ''}`}
                            style={{ 
                              padding: '6px 12px', fontSize: '10px', 
                              background: active ? 'rgba(125,211,252,0.15)' : 'rgba(255,255,255,0.03)', 
                              border: `0.5px solid ${active ? 'var(--accent-silver)' : 'var(--border-soft)'}`,
                              color: active ? '#fff' : 'var(--text-muted)'
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

            <div className="v8-form-group">
              <label className="v8-form-label">What worked well?</label>
              <textarea className="v8-input-premium" rows="2" value={formData.whatWorked} onChange={e => setFormData({...formData, whatWorked: e.target.value})} style={{ resize: 'none' }} />
            </div>
            
            <div className="v8-form-group">
              <label className="v8-form-label">What did not work?</label>
              <textarea className="v8-input-premium" rows="2" value={formData.whatDidNotWork} onChange={e => setFormData({...formData, whatDidNotWork: e.target.value})} style={{ resize: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div className="v8-form-group">
                <label className="v8-form-label">Best engagement moment?</label>
                <input className="v8-input-premium" value={formData.bestMoment} onChange={e => setFormData({...formData, bestMoment: e.target.value})} />
              </div>
              <div className="v8-form-group">
                <label className="v8-form-label">Timing issues?</label>
                <input className="v8-input-premium" value={formData.timingIssues} onChange={e => setFormData({...formData, timingIssues: e.target.value})} placeholder="e.g. Activity took 20m instead of 10m" />
              </div>
            </div>

            <div className="v8-form-group">
              <label className="v8-form-label">Improvements for next session</label>
              <textarea className="v8-input-premium" rows="2" value={formData.improvements} onChange={e => setFormData({...formData, improvements: e.target.value})} style={{ resize: 'none' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingTop: '16px', borderTop: '0.5px solid var(--border-soft)' }}>
              <button type="button" onClick={onClose} style={{ border: 'none', background: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Save size={14} /> Save Reflection
              </button>
            </div>
            
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
