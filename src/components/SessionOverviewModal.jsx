import React, { useState, useEffect } from 'react';
import { X, Clock, Target, Info, MessageSquare, Zap, Target as Bullseye, Flame } from 'lucide-react';

export default function SessionOverviewModal({ isOpen, onClose, session }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !session) return null;

  const games = session.selectedGames || [];
  const totalDuration = games.reduce((acc, g) => acc + (g.actualDuration || g.baseDurationNum || 0), 0);

  return (
    <div className="modal-overlay" style={{ zIndex: 3000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}>
      <div className="premium-card-v9" style={{ 
        maxWidth: '800px', 
        width: isMobile ? '100%' : '95%', 
        height: isMobile ? '100%' : 'auto',
        maxHeight: isMobile ? '100vh' : '90vh', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: 0, 
        overflow: 'hidden', 
        border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.15)', 
        boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
        borderRadius: isMobile ? '0' : '24px'
      }}>
        <div className="shimmer-overlay-v9" style={{ opacity: 0.1 }} />
        
        {/* Header */}
        <div style={{ 
          position: 'relative', 
          zIndex: 2, 
          padding: isMobile ? '24px 20px' : '32px 40px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          background: 'rgba(255,255,255,0.02)' 
        }}>
          <div>
            <h3 style={{ 
              fontSize: isMobile ? '22px' : '32px', 
              fontWeight: '800', 
              color: '#FFFFFF', 
              fontFamily: 'var(--font-serif)', 
              margin: 0, 
              letterSpacing: '-0.8px',
              lineHeight: 1.1
            }}>
              {session.sessionNumber} <span style={{ fontStyle: 'italic', background: 'linear-gradient(to right, #7DD3FC, #FDBA74)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Architecture</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: isMobile ? '8px' : '12px', marginTop: '10px' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {session.programTheme || 'General Theme'}
              </span>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FDBA74', boxShadow: '0 0 8px #FDBA74' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={12} color="#FDBA74" />
                <span style={{ fontSize: isMobile ? '12px' : '13px', fontWeight: '800', color: '#FFFFFF' }}>{totalDuration}m Flow</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFFFFF', cursor: 'pointer', padding: isMobile ? '8px' : '12px', borderRadius: '50%', display: 'flex', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
            <X size={isMobile ? 18 : 22} />
          </button>
        </div>

        {/* Content - Timeline Style */}
        <div style={{ position: 'relative', zIndex: 2, padding: isMobile ? '20px' : '40px', overflowY: 'auto', flex: 1, background: 'rgba(10, 12, 14, 0.4)' }}>
          {!isMobile && <div style={{ position: 'absolute', left: '54px', top: '40px', bottom: '40px', width: '2px', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.1) 90%, transparent)' }} />}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '32px' }}>
            {games.length === 0 ? (
              <div style={{ textAlign: 'center', padding: isMobile ? '40px 20px' : '80px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: '14px' }}>
                No activities deployed for this session architecture.
              </div>
            ) : (
              games.map((game, index) => (
                <div key={game.instanceId || index} style={{ display: 'flex', gap: isMobile ? '12px' : '24px', position: 'relative' }}>
                  {/* Timeline Dot (only show on desktop or as leading indicator) */}
                  <div style={{ 
                    width: isMobile ? '24px' : '32px', 
                    height: isMobile ? '24px' : '32px', 
                    borderRadius: '50%', 
                    background: '#0B0D10', 
                    border: `2px solid ${game.flowPosition?.includes('Zap') ? '#FDBA74' : game.flowPosition?.includes('Focus') ? '#7DD3FC' : game.flowPosition?.includes('Tadka') ? '#EF4444' : '#FFFFFF'}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    zIndex: 3, 
                    flexShrink: 0, 
                    boxShadow: `0 0 20px ${game.flowPosition?.includes('Zap') ? 'rgba(253,186,116,0.2)' : 'rgba(255,255,255,0.1)'}`,
                    marginTop: isMobile ? '6px' : '28px'
                  }}>
                    <span style={{ fontSize: isMobile ? '11px' : '13px', fontWeight: '900', color: '#FFF' }}>{index + 1}</span>
                  </div>

                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '16px' : '28px', transition: 'all 0.3s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: isMobile ? '17px' : '20px', fontWeight: '800', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)', letterSpacing: '-0.3px', wordBreak: 'break-word' }}>
                          {game.title}
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', fontWeight: '900', color: game.flowPosition?.includes('Zap') ? '#FDBA74' : '#7DD3FC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            {game.flowPosition}
                          </span>
                          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                          <span style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', wordBreak: 'break-all' }}>
                            {game.category || game.theme_clean || 'Activity'}
                          </span>
                        </div>
                      </div>
                      <div style={{ padding: '6px 12px', borderRadius: '10px', background: 'rgba(253,186,116,0.1)', border: '1px solid rgba(253,186,116,0.2)', fontSize: '13px', fontWeight: '900', color: '#FDBA74', flexShrink: 0 }}>
                        {(game.actualDuration || game.baseDurationNum || 10)}m
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: isMobile ? '20px' : '32px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {game.objective && (
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <Bullseye size={16} style={{ color: '#FDBA74', flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.1em' }}>Strategic Objective</p>
                              <p style={{ fontSize: '13px', color: '#FFFFFF', lineHeight: '1.5', margin: 0, fontWeight: '500', wordBreak: 'break-word' }}>{game.objective}</p>
                            </div>
                          </div>
                        )}
                        {(game.notes || game.rules || game.description) && (
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <MessageSquare size={16} style={{ color: '#7DD3FC', flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.1em' }}>Anchor Notes</p>
                              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.5', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {game.notes || game.rules || game.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {game.context && (
                        <div style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <Info size={16} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 4px', letterSpacing: '0.1em' }}>Facilitation Guardrail</p>
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', margin: 0, fontWeight: '500', wordBreak: 'break-word' }}>{game.context}</p>
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
        <div style={{ position: 'relative', zIndex: 2, padding: isMobile ? '16px 20px' : '24px 40px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', gap: '16px' }}>
          <button className="btn-secondary" onClick={onClose} style={{ width: isMobile ? '100%' : 'auto', padding: '12px 32px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: '12px' }}>Close Flow</button>
        </div>
      </div>
    </div>
  );
}
