import React from 'react';
import { X, Clock, Target, Info, MessageSquare, Zap, Target as Bullseye, Flame } from 'lucide-react';

export default function SessionOverviewModal({ isOpen, onClose, session }) {
  if (!isOpen || !session) return null;

  const games = session.selectedGames || [];
  const totalDuration = games.reduce((acc, g) => acc + (g.actualDuration || 0), 0);

  return (
    <div className="modal-overlay" style={{ zIndex: 1000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}>
      <div className="premium-card-v9" style={{ maxWidth: '800px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 30px 100px rgba(0,0,0,0.8)' }}>
        <div className="shimmer-overlay-v9" style={{ opacity: 0.1 }} />
        
        {/* Header */}
        <div style={{ position: 'relative', zIndex: 2, padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--font-serif)', margin: 0, letterSpacing: '-0.8px' }}>
              {session.sessionNumber} <span style={{ fontStyle: 'italic', background: 'linear-gradient(to right, #7DD3FC, #FDBA74)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Architecture</span>
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                {session.programTheme || 'General Theme'}
              </span>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FDBA74', boxShadow: '0 0 8px #FDBA74' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} color="#FDBA74" />
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#FFFFFF' }}>{totalDuration}m Structured Flow</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', cursor: 'pointer', padding: '12px', borderRadius: '50%', display: 'flex', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
            <X size={22} />
          </button>
        </div>

        {/* Content - Timeline Style */}
        <div style={{ position: 'relative', zIndex: 2, padding: '40px', overflowY: 'auto', flex: 1, background: 'rgba(10, 12, 14, 0.4)' }}>
          <div style={{ position: 'absolute', left: '54px', top: '40px', bottom: '40px', width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, transparent)' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {games.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: '16px' }}>
                No activities deployed for this session architecture.
              </div>
            ) : (
              games.map((game, index) => (
                <div key={game.instanceId || index} style={{ display: 'flex', gap: '24px', position: 'relative' }}>
                  {/* Timeline Dot */}
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', background: '#0B0D10', 
                    border: `2px solid ${game.flowPosition?.includes('Zap') ? '#FDBA74' : game.flowPosition?.includes('Focus') ? '#7DD3FC' : game.flowPosition?.includes('Tadka') ? '#EF4444' : '#FFFFFF'}`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3, flexShrink: 0, 
                    boxShadow: `0 0 20px ${game.flowPosition?.includes('Zap') ? 'rgba(253,186,116,0.2)' : 'rgba(255,255,255,0.1)'}` 
                  }}>
                    <span style={{ fontSize: '13px', fontWeight: '900', color: '#FFF' }}>{index + 1}</span>
                  </div>

                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '28px', transition: 'all 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div>
                        <h4 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)', letterSpacing: '-0.3px' }}>
                          {game.title}
                        </h4>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: '900', color: game.flowPosition?.includes('Zap') ? '#FDBA74' : '#7DD3FC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {game.flowPosition}
                          </span>
                          <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                          <span style={{ fontSize: '11px', fontWeight: '800', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                            {game.category || game.theme_clean || 'Activity'}
                          </span>
                        </div>
                      </div>
                      <div style={{ padding: '8px 16px', borderRadius: '12px', background: 'rgba(253,186,116,0.1)', border: '1px solid rgba(253,186,116,0.2)', fontSize: '15px', fontWeight: '900', color: '#FDBA74' }}>
                        {game.actualDuration}m
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '32px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {game.objective && (
                          <div style={{ display: 'flex', gap: '14px' }}>
                            <Bullseye size={18} style={{ color: '#FDBA74', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <p style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.1em' }}>Strategic Objective</p>
                              <p style={{ fontSize: '14px', color: '#FFFFFF', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>{game.objective}</p>
                            </div>
                          </div>
                        )}
                        {(game.notes || game.rules || game.description) && (
                          <div style={{ display: 'flex', gap: '14px' }}>
                            <MessageSquare size={18} style={{ color: '#7DD3FC', flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <p style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.1em' }}>Anchor Notes</p>
                              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                                {game.notes || game.rules || game.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {game.context && (
                        <div style={{ display: 'flex', gap: '14px', background: 'rgba(255,255,255,0.04)', padding: '20px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <Info size={18} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <p style={{ fontSize: '11px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 6px', letterSpacing: '0.1em' }}>Facilitation Guardrail</p>
                            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>{game.context}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 2, padding: '24px 40px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ padding: '12px 32px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '12px' }}>Close Architecture</button>
        </div>
      </div>
    </div>
  );
}
