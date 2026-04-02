import React, { useState } from 'react';
import { ArrowLeft, FileDown, ArrowRight, Pencil, Play } from 'lucide-react';
import { useStore } from '../store';
import { generateProgramPDF } from '../utils/pdfGenerator';
import EditProgramModal from './EditProgramModal';
import EditSessionModal from './EditSessionModal';
import SessionOverviewModal from './SessionOverviewModal';

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
    weeklyMap[w] = programSessions.filter(s => s.programWeek === w);
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

      <main className="container-max" style={{ paddingTop: '40px', paddingBottom: '80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setActiveTab('programs')} 
              style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
              <ArrowLeft size={16} />
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: '700', color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>{program.name}</h1>
                <button title="Edit Program" onClick={() => setIsEditingProgram(true)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px' }}>
                  <Pencil size={14} />
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>
                {program.college} &bull; {program.duration} Weeks &bull; {programSessions.length} Sessions
              </p>
            </div>
          </div>
          <button className="btn-primary" onClick={() => generateProgramPDF(program, programSessions)} style={{ gap: '8px' }}>
            <FileDown size={14} /> Export Roadmap PDF
          </button>
        </div>

        {/* Progress Bar */}
        {(() => {
          const planned = programSessions.filter(s => s.selectedGames && s.selectedGames.length > 0).length;
          const total = programSessions.length || 1;
          const pct = Math.round((planned / total) * 100);
          return (
            <div style={{ marginBottom: '48px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Planning Progress</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: pct === 100 ? '#22c55e' : 'var(--accent-silver)' }}>{planned}/{total} sessions planned</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#22c55e' : 'linear-gradient(to right, var(--accent-silver), var(--accent-gold))', borderRadius: '99px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '28px', fontFamily: 'var(--font-serif)', fontWeight: '700', color: pct === 100 ? '#22c55e' : 'var(--accent-gold)', lineHeight: 1 }}>{pct}%</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Complete</div>
              </div>
            </div>
          );
        })()}

        {/* Weekly Roadmap */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {Object.entries(weeklyMap).map(([week, weekSessions]) => {
            const wData = program.weeks?.find(wi => wi.week === parseInt(week)) || { theme: 'General', focus: '-' };
            return (
              <section key={week}>
                {/* Week Header Band */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 18px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-silver)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Week {week}</span>
                    <span style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>{wData.theme}</span>
                    {wData.focus && wData.focus !== '-' && (
                      <>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>&bull;</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{wData.focus}</span>
                      </>
                    )}
                  </div>
                  <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.06)' }} />
                </div>

                {/* Session Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {weekSessions.map(session => {
                    const isPlanned = session.selectedGames && session.selectedGames.length > 0 && session.totalActualDuration > 0;
                    const gamesCount = session.selectedGames?.length || 0;
                    return (
                      <div key={session.id} style={{
                        background: 'rgba(15,19,24,0.8)',
                        border: `0.5px solid ${isPlanned ? 'rgba(125,211,252,0.2)' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: '18px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: isPlanned ? '0 0 20px rgba(125,211,252,0.04)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>
                        {/* Card Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)' }}>{session.sessionNumber}</h4>
                            <button title="Edit Session" onClick={() => setEditingSession(session)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', cursor: 'pointer', padding: '2px' }}>
                              <Pencil size={11} />
                            </button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '3px 8px', borderRadius: '20px', background: isPlanned ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', border: `0.5px solid ${isPlanned ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}` }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: isPlanned ? '#22c55e' : 'rgba(255,255,255,0.25)' }} />
                            <span style={{ fontSize: '9px', fontWeight: '700', color: isPlanned ? '#22c55e' : 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{isPlanned ? 'Planned' : 'Not Planned'}</span>
                          </div>
                        </div>

                        {/* Theme & Focus */}
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.5' }}>
                          {(session.programTheme || wData.theme) && (
                            <p style={{ margin: '0 0 2px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                              <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: '700', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.1em' }}>Theme</span> &nbsp;{session.programTheme || wData.theme}
                            </p>
                          )}
                          {isPlanned && (
                            <p style={{ margin: '6px 0 0', color: 'var(--accent-silver)', fontWeight: '600', fontSize: '12px' }}>
                              {session.totalActualDuration} min &bull; {gamesCount} activit{gamesCount === 1 ? 'y' : 'ies'}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          {isPlanned ? (
                            <>
                              <button style={{ flex: 1, padding: '9px', background: 'rgba(125,211,252,0.08)', border: '0.5px solid rgba(125,211,252,0.2)', borderRadius: '10px', color: 'var(--accent-silver)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', transition: 'all 0.2s' }} onClick={() => setSessionOverview(session)}>
                                <Play size={10} fill="currentColor" /> View Flow
                              </button>
                              <button style={{ flex: 1, padding: '9px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', transition: 'all 0.2s' }} onClick={() => handlePlanSession(session.id)}>
                                Edit Flow
                              </button>
                            </>
                          ) : (
                            <button style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }} onClick={() => handlePlanSession(session.id)}>
                              Plan Session <ArrowRight size={12} />
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
          <section style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Unassigned Sessions</span>
              </div>
              <div style={{ flex: 1, height: '0.5px', background: 'rgba(255,255,255,0.06)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {unassignedSessions.map(session => (
                <div key={session.id} style={{ background: 'rgba(15,19,24,0.8)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{session.sessionNumber || 'Floating Session'}</h4>
                  <button style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }} onClick={() => handlePlanSession(session.id)}>
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
