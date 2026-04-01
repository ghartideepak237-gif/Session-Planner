import React from 'react';
import { X, Clock, Target, Info, MessageSquare } from 'lucide-react';

export default function SessionOverviewModal({ isOpen, onClose, session }) {
  if (!isOpen || !session) return null;

  const games = session.selectedGames || [];
  const totalDuration = games.reduce((acc, g) => acc + (g.actualDuration || 0), 0);

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div className="modal-content" style={{ maxWidth: '700px', width: '90%' }}>
        <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>
              {session.sessionNumber} Overview
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
              {session.programTheme || 'General Theme'} • {totalDuration} min planned
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '8px' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-4)', maxHeight: '75vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
          
          {games.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-6)', color: 'var(--text-dim)' }}>
              No activities planned for this session yet.
            </div>
          ) : (
            games.map((game, index) => (
              <div key={game.instanceId || index} style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)' }}>
                    {index + 1}. {game.title}
                  </h4>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', background: 'rgba(255,107,53,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                    {game.actualDuration} min
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: 'var(--spacing-3)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {game.flowPosition}
                  </span>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {game.category || game.theme_clean || 'Activity'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {game.objective && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Target size={14} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--text-dim)' }} />
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Strategic Objective</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>{game.objective}</p>
                      </div>
                    </div>
                  )}

                  {game.context && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Info size={14} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--text-dim)' }} />
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Context / When to use</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5' }}>{game.context}</p>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <MessageSquare size={14} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--text-dim)' }} />
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Anchor Notes</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {game.notes || game.rules || game.description || 'No specific notes provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: 'var(--spacing-4)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-surface)' }}>
          <button className="btn-primary" onClick={onClose}>Close Overview</button>
        </div>
      </div>
    </div>
  );
}
