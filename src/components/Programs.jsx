import React, { useState } from 'react';
import { FolderOpen, Plus, Trash2, Calendar, Download, Upload } from 'lucide-react';
import { useStore } from '../store';

export default function Programs() {
  const { programs, addProgram, deleteProgram, setActiveProgram, exportBackup, importBackup } = useStore();
  const [showForm, setShowForm] = useState(false);
  
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) importBackup(file);
  };

  const [form, setForm] = useState({
    name: '', college: '', duration: 4, totalSessions: 8, objective: '', weeks: []
  });

  const handleWeekChange = (weekNum, field, value) => {
    setForm(prev => {
      const existingWeeks = [...prev.weeks];
      const index = existingWeeks.findIndex(w => w.week === weekNum);
      if (index >= 0) {
        existingWeeks[index] = { ...existingWeeks[index], [field]: value };
      } else {
        existingWeeks.push({ week: weekNum, theme: '', focus: '', [field]: value });
      }
      return { ...prev, weeks: existingWeeks };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.duration || !form.totalSessions) return;
    addProgram(form);
    setShowForm(false);
    setForm({ name: '', college: '', duration: 4, totalSessions: 8, objective: '', weeks: [] });
  };

  return (
    <main className="container-max v8-theme">
      <style>{`
        .program-card-v8 {
          background: var(--card-grad);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 0.5px solid var(--border-main);
          border-radius: 20px;
          padding: 24px;
          transition: all 0.4s var(--smooth);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }

        .program-card-v8:hover {
          transform: translateY(-6px) scale(1.02);
          background: linear-gradient(145deg, #11161C, #0C1015);
          border-color: var(--accent-silver);
          box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 20px var(--glow-silver);
        }

        .program-card-v8.active {
          border-color: var(--accent-gold);
          box-shadow: 0 0 30px var(--glow-gold);
          animation: activePulse 3s infinite ease-in-out;
        }

        @keyframes activePulse {
          0% { box-shadow: 0 0 15px var(--glow-gold); }
          50% { box-shadow: 0 0 35px var(--glow-gold); }
          100% { box-shadow: 0 0 15px var(--glow-gold); }
        }

        .v9-grad-border {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, var(--accent-silver), var(--accent-gold), var(--accent-silver));
          opacity: 0.4;
        }

        .program-title-v8 {
          font-family: var(--font-serif);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .program-meta-v8 {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-family: var(--font-sans);
        }

        .program-footer-v8 {
          margin-top: auto;
          padding-top: 16px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-top: 0.5px solid var(--border-soft);
          font-size: 11px;
          color: var(--text-muted);
        }

        .hub-title-v8 {
          font-family: var(--font-serif);
          font-size: 26px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.2px;
        }

        .hub-subtitle-v8 {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 4px;
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', padding: '40px 0 0' }}>
        <div>
          <h2 className="hub-title-v8">Program <span style={{ fontStyle: 'italic', background: 'linear-gradient(to right, var(--accent-silver), var(--accent-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Curriculum</span></h2>
          <p className="hub-subtitle-v8">Structured multi-week developmental architectures</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
            <button 
              onClick={exportBackup}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              <Download size={12} /> Export All
            </button>
            
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Upload size={12} /> Import Backup
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
        
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> {showForm ? 'Cancel Creation' : 'Initialize Program'}
        </button>
      </div>

      {showForm && (
        <form className="glass-panel" style={{ marginBottom: '48px', padding: '32px' }} onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-serif)', color: '#FFFFFF', marginBottom: '24px' }}>Architect New Roadmap</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Program Name *</label>
              <input className="v7-input" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '12px', padding: '12px' }} value={form.name} onChange={e => setForm({...form, name: e.target.value})} required autoFocus />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>College / Organization</label>
              <input className="v7-input" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '12px', padding: '12px' }} value={form.college} onChange={e => setForm({...form, college: e.target.value})} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Duration (Weeks)</label>
              <input type="number" min="1" max="52" className="v7-input" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '12px', padding: '12px' }} value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value) || 1})} required />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Total Sessions</label>
              <input type="number" min="1" max="200" className="v7-input" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '12px', padding: '12px' }} value={form.totalSessions} onChange={e => setForm({...form, totalSessions: parseInt(e.target.value) || 1})} required />
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>Global Objective</label>
            <textarea className="v7-input" rows="2" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '12px', padding: '12px', resize: 'vertical' }} value={form.objective} onChange={e => setForm({...form, objective: e.target.value})} />
          </div>

          <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '0.5px solid rgba(255,255,255,0.08)' }}>
            <h4 style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', marginBottom: '16px' }}>Weekly Sequential Mapping</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: Math.min(form.duration, 52) }).map((_, i) => {
                const weekNum = i + 1;
                const activeData = form.weeks.find(w => w.week === weekNum) || { theme: '', focus: '' };
                return (
                  <div key={weekNum} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.4)' }}>Week {weekNum}</span>
                    <input style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '10px', padding: '10px', fontSize: '13px' }} placeholder="Week Theme" value={activeData.theme} onChange={e => handleWeekChange(weekNum, 'theme', e.target.value)} />
                    <input style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', color: '#FFFFFF', borderRadius: '10px', padding: '10px', fontSize: '13px' }} placeholder="Key Focus Area" value={activeData.focus} onChange={e => handleWeekChange(weekNum, 'focus', e.target.value)} />
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="submit" className="btn-primary" style={{ background: '#FFFFFF', color: '#000000', fontWeight: '700' }}>Confirm Roadmap Initialization</button>
          </div>
        </form>
      )}

      {programs.length === 0 && !showForm ? (
        <div style={{ padding: '80px 40px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px', background: 'rgba(255,255,255,0.02)' }}>
          <FolderOpen size={32} style={{ margin: '0 auto 16px', color: 'rgba(255,255,255,0.2)' }} />
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '8px' }}>No Curriculums Defined</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', maxWidth: '400px', margin: '0 auto' }}>Initialize a new multi-week developmental program to begin structuring your sessions.</p>
        </div>
      ) : (
        <div className="game-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
          {programs.map(p => {
             const { activeProgram } = useStore.getState();
             const isActive = activeProgram?.id === p.id;
             return (
               <div key={p.id} className={`program-card-v8 ${isActive ? 'active' : ''}`} onClick={() => setActiveProgram(p.id)}>
                  <div className="v9-grad-border"></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="program-title-v8">{p.name}</h3>
                  <button onClick={(e) => { e.stopPropagation(); deleteProgram(p.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-inactive)', cursor: 'pointer', padding: '4px' }}><Trash2 size={14} /></button>
                </div>
                <div className="program-meta-v8">{p.college}</div>
                
                <div className="program-footer-v8">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} /> {p.duration} Weeks</span>
                  <span style={{ opacity: 0.3 }}>•</span>
                  <span>{p.totalSessions} Sessions</span>
                </div>
             </div>
          )})}
        </div>
      )}
    </main>
  );
}
