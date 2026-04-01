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
    <main className="container-max">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>Program Hub</h2>
          <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
            <button 
              onClick={exportBackup}
              style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
            >
              <Download size={12} /> Export All Data (JSON)
            </button>
            
            <label style={{ color: 'var(--text-dim)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <Upload size={12} /> Import Backup
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
        
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> {showForm ? 'Cancel' : 'Create Program'}
        </button>
      </div>

      {showForm && (
        <form className="builder-card" style={{ marginBottom: 'var(--spacing-4)' }} onSubmit={handleSubmit}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>New Program Design</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
            <div>
              <label className="form-label">Program Name *</label>
              <input className="search-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required autoFocus />
            </div>
            <div>
              <label className="form-label">College / Organization</label>
              <input className="search-input" value={form.college} onChange={e => setForm({...form, college: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Duration (Weeks) *</label>
              <input type="number" min="1" max="52" className="search-input" value={form.duration} onChange={e => setForm({...form, duration: parseInt(e.target.value) || 1})} required />
            </div>
            <div>
              <label className="form-label">Total Sessions *</label>
              <input type="number" min="1" max="200" className="search-input" value={form.totalSessions} onChange={e => setForm({...form, totalSessions: parseInt(e.target.value) || 1})} required />
            </div>
          </div>
          
          <div style={{ marginBottom: 'var(--spacing-3)' }}>
            <label className="form-label">Program Objective</label>
            <textarea className="search-input" rows="2" style={{ resize: 'vertical' }} value={form.objective} onChange={e => setForm({...form, objective: e.target.value})} />
          </div>

          <div style={{ padding: 'var(--spacing-3)', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>Weekly Mapping</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {Array.from({ length: Math.min(form.duration, 52) }).map((_, i) => {
                const weekNum = i + 1;
                const activeData = form.weeks.find(w => w.week === weekNum) || { theme: '', focus: '' };
                return (
                  <div key={weekNum} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 'var(--spacing-2)', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Week {weekNum}</span>
                    <input className="search-input" placeholder="Week Theme" value={activeData.theme} onChange={e => handleWeekChange(weekNum, 'theme', e.target.value)} />
                    <input className="search-input" placeholder="Key Focus Area" value={activeData.focus} onChange={e => handleWeekChange(weekNum, 'focus', e.target.value)} />
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-3)' }}>
            <button type="submit" className="btn-primary">Generate Roadmap</button>
          </div>
        </form>
      )}

      {programs.length === 0 && !showForm ? (
        <div style={{ padding: 'var(--spacing-6) var(--spacing-3)', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
          <FolderOpen size={24} style={{ margin: '0 auto var(--spacing-2)', color: 'var(--text-dim)' }} />
          <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: 'var(--spacing-1)' }}>No Programs Designed</p>
          <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Design multi-week structured roadmaps using the Create button above.</p>
        </div>
      ) : (
        <div className="game-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {programs.map(p => (
             <div key={p.id} className="game-card" onClick={() => setActiveProgram(p.id)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 className="game-title">{p.name}</h3>
                  <button onClick={(e) => { e.stopPropagation(); deleteProgram(p.id); }} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>{p.college}</p>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: '12px', color: 'var(--text-dim)', marginTop: 'auto', paddingTop: 'var(--spacing-2)', borderTop: '1px solid var(--border)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {p.duration} Weeks</span>
                  <span>•</span>
                  <span>{p.totalSessions} Sessions</span>
                </div>
             </div>
          ))}
        </div>
      )}
    </main>
  );
}
