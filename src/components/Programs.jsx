import React, { useState } from 'react';
import { FolderOpen, Plus, Trash2, Calendar, Download, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';

export default function Programs() {
  const { programs, addProgram, deleteProgram, setActiveProgram, activeProgramId, exportBackup, importBackup } = useStore();
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
        .program-card-v9 {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 200px;
        }

        .program-title-v9 {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0;
        }

        .program-meta-v9 {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-family: var(--font-sans);
        }
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)' }}>Curriculum Roadmap</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '4px', fontSize: '14px' }}>Strategic planning for multi-week developmental programs.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input type="file" onChange={handleImport} accept=".json" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} title="Import Backup" />
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Upload size={14} /> Import</button>
          </div>
          <button onClick={exportBackup} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Download size={14} /> Export</button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel Initialization' : 'Initialize New Program'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-panel animate-fadeInUp" style={{ padding: '40px', marginBottom: '48px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ padding: '10px', background: 'rgba(234, 179, 8, 0.1)', borderRadius: '12px' }}>
              <Plus size={20} color="#EAB308" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>Configure Roadmap Parameters</h3>
          </div>
          
          <div className="program-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
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
                  <div key={weekNum} className="week-mapping-row" style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '12px', alignItems: 'center' }}>
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
        <div className="program-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {programs.map((p, i) => {
             const isActive = activeProgramId === p.id;
             return (
               <motion.div 
                 key={p.id} 
                 className="premium-card-v9 program-card-v9" 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ 
                   opacity: 1, 
                   y: 0,
                   transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }
                 }}
                 whileHover={{ 
                   scale: 1.04, 
                   y: -8,
                   transition: { delay: 0, type: 'spring', stiffness: 300, damping: 25, mass: 0.8 } 
                 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => setActiveProgram(p.id)}
                 style={{
                   border: isActive ? '2px solid var(--accent-gold)' : '1px solid rgba(255, 255, 255, 0.1)',
                   background: isActive ? 'rgba(234, 179, 8, 0.08)' : 'linear-gradient(165deg, rgba(20, 24, 30, 0.7) 0%, rgba(12, 16, 20, 0.85) 100%)',
                   padding: '28px'
                 }}
               >
                 <div className="shimmer-overlay-v9" />
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                   <h3 className="program-title-v9">{p.name}</h3>
                   <button 
                     onClick={(e) => { e.stopPropagation(); deleteProgram(p.id); }} 
                     style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
                 <div className="program-meta-v9" style={{ position: 'relative', zIndex: 2 }}>
                   <div 
                     className="premium-card-v9 card-theme-blue" 
                     style={{ 
                       display: 'inline-flex', 
                       padding: '6px 12px', 
                       borderRadius: '10px', 
                       fontSize: '10px',
                       letterSpacing: '0.1em',
                       fontWeight: '800',
                       background: 'rgba(59, 130, 246, 0.1)',
                       borderColor: 'rgba(59, 130, 246, 0.2)'
                     }}
                   >
                     {p.college || 'PRIVATE CURRICULUM'}
                   </div>
                 </div>
                 
                 <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600', position: 'relative', zIndex: 2 }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} /> {p.duration} Weeks</span>
                   <span style={{ opacity: 0.3 }}>•</span>
                   <span>{p.totalSessions} Sessions</span>
                 </div>
               </motion.div>
             );
          })}
        </div>
      )}
    </main>
  );
}
