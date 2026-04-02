import React, { useState } from 'react';
import { ArrowLeft, FileDown, ArrowRight, Pencil, Play } from 'lucide-react';
import { useStore } from '../store';
import { generateProgramPDF } from '../utils/pdfGenerator';
import EditProgramModal from './EditProgramModal';
import EditSessionModal from './EditSessionModal';
import SessionOverviewModal from './SessionOverviewModal';

function extractSessionNumber(sessionNumber) {
  if (!sessionNumber) return 9999;
  const match = sessionNumber.match(/\d+/);
  return match ? parseInt(match[0]) : 9999;
}

export default function ProgramDetail() {
  const { programs, sessions, activeProgramId, setActiveTab, loadSessionToBuilder } = useStore();
  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionOverview, setSessionOverview] = useState(null);
  
  const program = programs.find(p => p.id === activeProgramId);

  if (!program) {
    return (
      <main className="container-max" style={{ textAlign: 'center', padding: '80px 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Program not found.</p>
        <button className="btn-secondary" style={{ margin: '16px auto' }} onClick={() => setActiveTab('programs')}>Return Home</button>
      </main>
    );
  }

  const programSessions = sessions.filter(s => s.programId === program.id);
  const weeklyMap = {};
  for (let w = 1; w <= program.duration; w++) {
    weeklyMap[w] = programSessions
      .filter(s => s.programWeek === w)
      .sort((a, b) => extractSessionNumber(a.sessionNumber) - extractSessionNumber(b.sessionNumber));
  }
  const unassignedSessions = programSessions.filter(s => !s.programWeek || s.sessionNumber === 'Unassigned');

  const handlePlanSession = (sessionId) => {
    loadSessionToBuilder(sessionId);
    setActiveTab('builder');
  };

  return (
    <>
      <EditProgramModal isOpen={isEditingProgram} onClose={() => setIsEditingProgram(false)} program={program} />
      <EditSessionModal isOpen={!!editingSession} onClose={() => setEditingSession(null)} session={editingSession} />
      <SessionOverviewModal isOpen={!!sessionOverview} onClose={() => setSessionOverview(null)} session={sessionOverview} />

      <main className="container-max" style={{ paddingTop: '32px', paddingBottom: '80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <button onClick={() => setActiveTab('programs')} style={{ marginTop: '4px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '2px' }}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>{program.name}</h1>
                <button title="Edit Program" onClick={() => setIsEditingProgram(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '3px' }}>
                  <Pencil size={13} />
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
                {program.college} &bull; {program.duration} Weeks
              </p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => generateProgramPDF(program, programSessions)} style={{ gap: '8px', whiteSpace: 'nowrap' }}>
            <FileDown size={14} /> Export Roadmap PDF
          </button>
        </div>

        {/* Progress Indicator */}
        {(() => {
          const planned = programSessions.filter(s => s.selectedGames && s.selectedGames.length > 0).length;
          const total = programSessions.length || 1;
          const pct = Math.round((planned / total) * 100);
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px 20px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Planning Progress</span>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: pct === 100 ? '#22c55e' : 'var(--accent-silver)' }}>{planned}/{total} sessions planned</span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#22c55e' : 'linear-gradient(to right, var(--accent-silver), var(--accent-gold))', borderRadius: '99px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '48px' }}>
                <div style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', fontWeight: '700', color: pct === 100 ? '#22c55e' : 'var(--accent-gold)', lineHeight: 1 }}>{pct}%</div>
              </div>
            </div>
          );
        })()}

        {/* Weekly Roadmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(weeklyMap).map(([week, weekSessions]) => {
            const wData = program.weeks?.find(wi => wi.week === parseInt(week)) || { theme: 'General', focus: '' };
            const focusPoints = wData.focus ? wData.focus.split(/[•\n,]+/).map(f => f.trim()).filter(Boolean) : [];

            return (
              <section key={week} style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
                
                {/* Left label column */}
                <div style={{ width: '150px', flexShrink: 0, paddingTop: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-gold)', marginBottom: '6px' }}>Week {week}</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF', lineHeight: '1.4', marginBottom: '8px' }}>{wData.theme}</div>
                  {focusPoints.length > 0 && (
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>
                      <span style={{ fontWeight: '700' }}>Focus: </span>
                      {focusPoints.map((f, i) => (
                        <span key={i}>{f}{i < focusPoints.length - 1 ? ' • ' : ''}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Session Cards Grid - 2 columns */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {weekSessions.map(session => {
                    const isPlanned = session.selectedGames && session.selectedGames.length > 0 && session.totalActualDuration > 0;
                    const theme = session.programTheme || wData.theme || '';
                    const focus = session.programFocus || wData.focus || '';
                    const focusBullets = focus ? focus.split(/[•\n,]+/).map(f => f.trim()).filter(Boolean) : [];

                    return (
                      <div key={session.id} style={{
                        background: 'rgba(12,16,20,0.9)',
                        border: `0.5px solid ${isPlanned ? 'rgba(125,211,252,0.2)' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: '14px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        {/* Card top: session number + status */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>{session.sessionNumber}</span>
                            <button title="Edit" onClick={() => setEditingSession(session)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '2px' }}>
                              <Pencil size={11} />
                            </button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isPlanned ? '#22c55e' : 'rgba(255,255,255,0.2)' }} />
                            <span style={{ fontSize: '10px', fontWeight: '700', color: isPlanned ? '#22c55e' : 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {isPlanned ? 'Planned' : 'Not Planned'}
                            </span>
                          </div>
                        </div>

                        {/* Theme & Focus */}
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', flex: 1 }}>
                          {theme && <p style={{ margin: '0 0 4px' }}><span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '700' }}>Theme: </span>{theme}</p>}
                          {focusBullets.length > 0 && (
                            <p style={{ margin: 0 }}>
                              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: '700' }}>Focus: </span>
                              {focusBullets.map((f, i) => (
                                <span key={i}>&bull; {f} </span>
                              ))}
                            </p>
                          )}
                        </div>

                        {/* Duration */}
                        {isPlanned && (
                          <p style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
                            {session.totalActualDuration} min structured
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                          {isPlanned ? (
                            <>
                              <button 
                                onClick={() => setSessionOverview(session)}
                                style={{ width: '100%', padding: '8px', background: 'var(--accent-gold)', border: 'none', borderRadius: '7px', color: '#000000', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                              >
                                View Flow <Play size={10} fill="#000" />
                              </button>
                              <button 
                                onClick={() => handlePlanSession(session.id)}
                                style={{ width: '100%', padding: '7px', background: 'transparent', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '7px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                              >
                                Edit Session Flow
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handlePlanSession(session.id)}
                              style={{ width: '100%', padding: '8px', background: 'var(--accent-gold)', border: 'none', borderRadius: '7px', color: '#000000', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                            >
                              Plan Session Flow <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Unassigned Sessions */}
        {unassignedSessions.length > 0 && (
          <section style={{ marginTop: '48px', display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
            <div style={{ width: '150px', flexShrink: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.3)' }}>Unassigned</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '4px' }}>Floating sessions</div>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {unassignedSessions.map(session => (
                <div key={session.id} style={{ background: 'rgba(12,16,20,0.9)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '18px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', margin: '0 0 12px' }}>{session.sessionNumber || 'Floating Session'}</h4>
                  <button onClick={() => handlePlanSession(session.id)} style={{ width: '100%', padding: '10px', background: 'var(--accent-gold)', border: 'none', borderRadius: '8px', color: '#000000', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    Plan Session <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
