import React, { useState } from 'react';
import { ArrowLeft, Calendar, FileDown, ArrowRight, CheckCircle2, Pencil } from 'lucide-react';
import { useStore } from '../store';
import { generateProgramPDF } from '../utils/pdfGenerator';
import EditProgramModal from './EditProgramModal';
import EditSessionModal from './EditSessionModal';

export default function ProgramDetail() {
  const { programs, sessions, activeProgramId, setActiveTab, loadSessionToBuilder } = useStore();
  const [isEditingProgram, setIsEditingProgram] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  
  const program = programs.find(p => p.id === activeProgramId);

  if (!program) {
    return (
      <main className="container-max" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
        <p>Program not found.</p>
        <button className="btn-secondary" style={{ margin: 'var(--spacing-3) auto' }} onClick={() => setActiveTab('programs')}>Return Home</button>
      </main>
    );
  }

  const programSessions = sessions.filter(s => s.programId === program.id);
  
  // Group by Week
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
    
    <main className="container-max">
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
        <button onClick={() => setActiveTab('programs')} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600' }}>{program.name}</h2>
            <button 
              title="Edit Program Details"
              onClick={() => setIsEditingProgram(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
            >
              <Pencil size={14} />
            </button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{program.college} • {program.duration} Weeks</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--spacing-2)' }}>
          <button className="btn-primary" onClick={() => generateProgramPDF(program, programSessions)}>
            <FileDown size={14} /> Export Roadmap PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
        {Object.entries(weeklyMap).map(([week, weekSessions]) => {
          const wData = program.weeks.find(wItem => wItem.week === parseInt(week)) || { theme: 'General', focus: '-' };
          
          return (
            <section key={week} style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
              
              <div style={{ width: '120px', flexShrink: 0 }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent)' }}>Week {week}</h3>
                <p style={{ fontSize: '13px', fontWeight: '500', marginTop: '4px', lineHeight: 1.3 }}>{wData.theme}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Focus: {wData.focus}</p>
              </div>

              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-3)' }}>
                {weekSessions.map(session => {
                  const isPlanned = session.selectedGames && session.selectedGames.length > 0;
                  
                  return (
                    <div key={session.id} className="builder-card" style={{ display: 'flex', flexDirection: 'column', borderColor: isPlanned ? 'var(--text-secondary)' : 'var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h4 style={{ fontSize: '13px', fontWeight: '600' }}>{session.sessionNumber}</h4>
                          <button 
                            title="Edit Session Details"
                            onClick={() => setEditingSession(session)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                        {isPlanned && <CheckCircle2 size={14} color="var(--accent)" />}
                      </div>
                      
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-3)' }}>
                        <p style={{ marginBottom: '2px' }}><span style={{ color: 'var(--text-dim)' }}>Theme:</span> {session.programTheme}</p>
                        <p><span style={{ color: 'var(--text-dim)' }}>Focus:</span> {session.programFocus}</p>
                        {isPlanned && <p style={{ marginTop: '8px', color: 'var(--text-main)', fontWeight: '500' }}>{session.totalActualDuration} min structured</p>}
                      </div>
                      
                      <button 
                        className="btn-secondary" 
                        style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
                        onClick={() => handlePlanSession(session.id)}
                      >
                        {isPlanned ? 'Edit Session Flow' : 'Plan Session Flow'} <ArrowRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>

            </section>
          );
        })}
      </div>

      {unassignedSessions.length > 0 && (
        <section style={{ marginTop: 'var(--spacing-6)', paddingTop: 'var(--spacing-4)', borderTop: '2px dashed var(--border)' }}>
          <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
            <div style={{ width: '120px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Unassigned</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>Displaced or unscheduled sessions</p>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-3)' }}>
              {unassignedSessions.map(session => {
                const isPlanned = session.selectedGames && session.selectedGames.length > 0;
                return (
                  <div key={session.id} className="builder-card" style={{ display: 'flex', flexDirection: 'column', borderColor: isPlanned ? 'var(--text-secondary)' : 'var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-dim)' }}>{session.sessionNumber || 'Floating Session'}</h4>
                        <button 
                          title="Edit Session Details"
                          onClick={() => setEditingSession(session)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                      {isPlanned && <CheckCircle2 size={14} color="var(--accent)" />}
                    </div>
                    
                    <button 
                      className="btn-secondary" 
                      style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
                      onClick={() => handlePlanSession(session.id)}
                    >
                      {isPlanned ? 'Edit Session Flow' : 'Plan Session Flow'} <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </main>
    </>
  );

}
