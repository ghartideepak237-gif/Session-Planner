import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Search, Save, FileDown, Plus, GripVertical, Trash2, Copy, Pencil, CheckCircle2, RotateCcw, ChevronUp, ChevronDown, Folder } from 'lucide-react';
import { useStore, computeSessionEnergy } from '../store';
import { generateSessionPDF } from '../utils/pdfGenerator';
import EditActivityModal from './EditActivityModal';
import EditSessionModal from './EditSessionModal';

export default function SessionBuilder() {
  const { builder, setBuilderField, removeGameFromSession, reorderSessionGames, saveSession, games, folders, addGameToSession, sessions, adjustGameDuration, categories, energyTypes, addGame, engagementTypes, duplicateActivityInSession, autosaveStatus, moveSessionGameUp, moveSessionGameDown } = useStore();
  
  const [search, setSearch] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isQuickAddingCustom, setIsQuickAddingCustom] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [customForm, setCustomForm] = useState({
    title: '', duration: '', rules: '', context: '', energyType: energyTypes[0], theme_clean: categories[0] || 'General'
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderSessionGames(result.source.index, result.destination.index);
  };

  const availableGames = useMemo(() => {
    let list = games;
    if (selectedFolderId) {
      list = list.filter(g => Array.isArray(g.folder_ids) && g.folder_ids.includes(selectedFolderId));
    }
    if (search) {
      list = list.filter(g => g.title.toLowerCase().includes(search.toLowerCase()));
    }
    return list;
  }, [games, selectedFolderId, search]);

  const favoriteGames = availableGames.filter(g => g.favorite);
  const remainingGames = availableGames.filter(g => !g.favorite);

  const handleCustomGameSave = (saveToRepo = true) => {
    if (!customForm.title || !customForm.duration) {
      alert("Name and Planned Duration are required.");
      return;
    }
    const match = customForm.duration.match(/\d+/);
    const durationNum = match ? parseInt(match[0], 10) : 10;
    
    const newGame = {
      ...customForm,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      cat_clean: 'Activity',
      engagementType: engagementTypes[0],
      baseDurationNum: durationNum,
      folder_ids: selectedFolderId ? [selectedFolderId] : []
    };

    if (saveToRepo) addGame(newGame);
    addGameToSession(newGame);

    setCustomForm({ title: '', duration: '', rules: '', context: '', energyType: energyTypes[0], theme_clean: categories[0] || 'General' });
    setIsQuickAddingCustom(false);
  };

  // Predictive timing
  const totalPlanned = builder.selectedGames.reduce((acc, g) => acc + g.actualDuration, 0);
  const remainingTime = builder.baseDuration - totalPlanned;
  
  let remainingColor = '#ef4444'; 
  if (remainingTime >= 10) remainingColor = '#22c55e'; 
  else if (remainingTime >= 5) remainingColor = '#eab308'; 
  else if (remainingTime >= 0) remainingColor = '#f97316'; 

  // Compute Session Status
  const isSavedInStore = sessions.some(s => s.id === builder.id);
  let sessionStatus = 'Draft';
  if (builder.programId) sessionStatus = 'Assigned to Program';
  else if (isSavedInStore) sessionStatus = 'Saved';

  let statusColor = 'var(--text-dim)';
  if (sessionStatus === 'Saved') statusColor = 'var(--accent)';
  if (sessionStatus === 'Assigned to Program') statusColor = '#22c55e';

  // Smart Validation Suggestions
  const suggestions = [];
  const selected = builder.selectedGames;
  if (selected.length > 0) {
    if (selected[0].flowPosition !== 'Quick Engage ⚡') {
      suggestions.push("Consider starting with a Quick Engage activity.");
    }
    if (selected[0].actualDuration > 10) {
      suggestions.push("Move quick activity first.");
    }
    const hasBuildEnergy = selected.some(g => g.flowPosition === 'Build Energy 🎯');
    if (!hasBuildEnergy) {
      suggestions.push("Consider adding a Build Energy activity.");
    }
    const hasTadka = selected.some(g => g.flowPosition === 'Tadka 🔥');
    if (!hasTadka) {
      suggestions.push("Add a Tadka activity to end session with energy.");
    } else {
      const lastActivity = selected[selected.length - 1];
      if (lastActivity.flowPosition !== 'Tadka 🔥') {
        suggestions.push("Consider moving Tadka towards the end to finish high.");
      }
    }
  }

  return (
    <>
    <EditActivityModal isOpen={!!editingActivity} onClose={() => setEditingActivity(null)} activity={editingActivity} />
    <EditSessionModal isOpen={isEditingSession} onClose={() => setIsEditingSession(false)} session={builder} />
    
    <main className="container-max v8-theme" style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr) 340px', minHeight: 'calc(100vh - 72px)', gap: '40px', padding: '40px 0' }}>
      <style>{`
        .planner-aside-v8 {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .planner-card-v8 {
          background: var(--card-grad);
          border: 0.5px solid var(--border-main);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .timeline-node-v8 {
          background: var(--card-grad);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 0.5px solid var(--border-main);
          border-radius: 16px;
          padding: 16px;
          position: relative;
          transition: all 0.4s var(--smooth);
        }

        .timeline-node-v8:hover {
          background: linear-gradient(145deg, #11161C, #0C1015);
          border-color: var(--border-accent);
          transform: translateX(4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .timeline-dot-v8 {
          position: absolute;
          left: -27px;
          top: 22px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #000;
          border: 2px solid var(--text-primary);
          z-index: 2;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .timeline-dot-v8.glow-zap { box-shadow: 0 0 15px var(--accent-gold); border-color: var(--accent-gold); }
        .timeline-dot-v8.glow-focus { box-shadow: 0 0 15px var(--accent-silver); border-color: var(--accent-silver); }
        .timeline-dot-v8.glow-tadka { box-shadow: 0 0 15px var(--danger); border-color: var(--danger); }

        .timing-label-v8 {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-inactive);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
          font-family: var(--font-sans);
        }

        .timing-value-v8 {
          font-size: 20px;
          font-weight: 700;
          font-family: var(--font-serif);
          color: var(--text-primary);
        }

        .v8-panel-header {
          font-family: var(--font-serif);
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 24px;
          letter-spacing: -0.2px;
        }
      `}</style>
      
      {/* COLUMN 1: Session Control */}
      <aside className="planner-aside-v8">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', margin: 0 }}>
              {builder.sessionNumber || 'Untitled'}
            </h2>
            <button 
              onClick={() => setIsEditingSession(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-inactive)', cursor: 'pointer', padding: '4px' }}
            >
              <Pencil size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: '700', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)' }}>
              {sessionStatus}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '10px', fontWeight: '600' }}>
              {autosaveStatus === 'saving' ? <RotateCcw size={10} className="spin" /> : <CheckCircle2 size={10} color="var(--accent-silver)" />}
              <span>{autosaveStatus === 'saving' ? 'Syncing...' : 'Local Stable'}</span>
            </div>
          </div>
        </div>

        <div className="planner-card-v8">
          <div style={{ marginBottom: '20px' }}>
            <label className="timing-label-v8">College / Target Group</label>
            <input 
              value={builder.college} 
              onChange={e => setBuilderField('college', e.target.value)}
              className="v8-input"
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid var(--border-soft)', color: 'var(--text-primary)', borderRadius: '12px', padding: '10px', fontSize: '13px' }}
              placeholder="e.g. Master Design Team" 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="timing-label-v8">Target (min)</label>
              <div className="timing-value-v8">{builder.baseDuration}</div>
            </div>
            <div>
              <label className="timing-label-v8">Remaining</label>
              <div className="timing-value-v8" style={{ color: remainingTime < 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                {Math.abs(remainingTime)}
              </div>
            </div>
          </div>
        </div>

        <div className="planner-card-v8" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>PEL Performance Flow</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Quick Engage', icon: '⚡', desc: 'Shatter social barriers' },
              { label: 'Build Energy', icon: '🎯', desc: 'Calibrate collaboration' },
              { label: 'Core Interaction', icon: '🧠', desc: 'Cognitive heart' },
              { label: 'Tadka', icon: '🔥', desc: 'Peak exit high' }
            ].map(flow => (
              <div key={flow.label}>
                <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--accent-silver)' }}>{flow.icon}</span> {flow.label}
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0 18px', fontFamily: 'var(--font-sans)' }}>{flow.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
          <button className="btn-primary" onClick={() => generateSessionPDF(builder)} style={{ justifyContent: 'center' }}>
            <FileDown size={14} /> Deployment PDF
          </button>
          <button className="btn-secondary" onClick={() => saveSession()} style={{ justifyContent: 'center' }}>
            <Save size={14} /> Synchronize
          </button>
        </div>
      </aside>

      {/* COLUMN 2: Timeline Builder */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '0.5px solid var(--border-soft)', padding: '0 40px' }}>
        <h3 className="v8-panel-header">Session <span style={{ fontStyle: 'italic', background: 'linear-gradient(to right, var(--accent-silver), var(--accent-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Architecture</span></h3>
        
        {builder.selectedGames.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px', background: 'rgba(255,255,255,0.02)' }}>
             <p style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF', marginBottom: '8px' }}>Empty Architecture</p>
             <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Deploy activities from the Asset Library to begin building the flow.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            <div style={{ position: 'absolute', left: '6px', top: '24px', bottom: '24px', width: '1px', background: 'var(--border-soft)' }}></div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="builder-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {builder.selectedGames.map((game, index) => (
                      <Draggable key={game.instanceId} draggableId={game.instanceId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{ 
                              ...provided.draggableProps.style,
                              position: 'relative'
                            }}
                          >
                            <div className={`timeline-dot-v8 ${
                              game.flowPosition?.includes('Zap') ? 'glow-zap' : 
                              game.flowPosition?.includes('Focus') ? 'glow-focus' : 
                              game.flowPosition?.includes('Tadka') ? 'glow-tadka' : ''
                            }`}></div>

                            <div className="timeline-node-v8">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div {...provided.dragHandleProps} style={{ cursor: 'grab', opacity: 0.3 }}>
                                    <GripVertical size={16} />
                                  </div>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <h3 
                                        onClick={() => setEditingActivity(game)}
                                        style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer', margin: 0, fontFamily: 'var(--font-serif)' }}
                                      >
                                        {game.title}
                                      </h3>
                                      <div style={{ display: 'flex', gap: '4px' }}>
                                        <button onClick={() => setEditingActivity(game)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><Pencil size={12} /></button>
                                        <button onClick={() => duplicateActivityInSession(game.instanceId)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><Copy size={12} /></button>
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: '500', fontFamily: 'var(--font-sans)' }}>
                                      <span style={{ color: 'var(--text-primary)', opacity: 0.7 }}>{game.flowPosition}</span>
                                      <span style={{ opacity: 0.2 }}>|</span>
                                      <span>Original: {game.baseDurationNum}m</span>
                                    </div>
                                  </div>
                                </div>

                                <button onClick={() => removeGameFromSession(game.instanceId)} style={{ background: 'none', border: 'none', color: 'var(--text-inactive)', cursor: 'pointer', padding: '6px' }}>
                                  <Trash2 size={16} />
                                </button>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px 16px', borderRadius: '12px', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)' }}>Allocation</span>
                                  <div style={{ display: 'flex', gap: '6px' }}>
                                    {[ -5, -1, 1, 5 ].map(delta => (
                                      <button 
                                        key={delta}
                                        onClick={() => adjustGameDuration(game.instanceId, delta)}
                                        style={{ width: '28px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '0.5px solid var(--border-soft)', borderRadius: '6px', fontSize: '10px', color: 'var(--text-primary)', cursor: 'pointer' }}
                                      >
                                        {delta > 0 ? `+${delta}` : delta}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>
                                  {game.actualDuration}m
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>

      {/* COLUMN 3: Asset Library Quick Pick */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--secondary)', padding: '24px', border: '0.5px solid var(--border-soft)', borderRadius: '24px', maxHeight: 'calc(100vh - 120px)', overflow: 'hidden' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', margin: 0 }}>
            Asset <span style={{ fontStyle: 'italic', color: 'var(--accent-gold)' }}>Library</span>
          </h3>
          <button 
            onClick={() => setIsQuickAddingCustom(!isQuickAddingCustom)}
            className="btn-secondary" style={{ padding: '6px 14px', fontSize: '10px' }}
          >
            {isQuickAddingCustom ? 'Close' : '+ Manual Entry'}
          </button>
        </div>

        {isQuickAddingCustom ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input placeholder="Activity Name *" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '12px', padding: '12px' }} value={customForm.title} onChange={e => setCustomForm({...customForm, title: e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input placeholder="Duration (m)" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '12px', padding: '12px' }} value={customForm.duration} onChange={e => setCustomForm({...customForm, duration: e.target.value})} />
              <select style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '12px', padding: '12px' }} value={customForm.energyType} onChange={e => setCustomForm({...customForm, energyType: e.target.value})}>
                {energyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <button className="btn-primary" style={{ background: '#FFFFFF', color: '#000000', fontWeight: '700', justifyContent: 'center' }} onClick={() => handleCustomGameSave(true)}>Add & Save</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflow: 'hidden' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', opacity: 0.3 }} />
              <input 
                placeholder="Search repository..." 
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', color: '#FFFFFF', borderRadius: '99px', padding: '10px 10px 10px 36px', fontSize: '13px' }}
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
              {availableGames.map(game => (
                <div key={game.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border-soft)', borderRadius: '14px' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '13px', fontWeight: '700', margin: '0 0 2px 0', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)' }}>{game.title}</h5>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', fontFamily: 'var(--font-sans)' }}>{game.baseDurationNum}m • {game.energyType}</div>
                  </div>
                  <button onClick={() => addGameToSession(game)} style={{ width: '28px', height: '28px', background: 'var(--text-primary)', border: 'none', borderRadius: '50%', color: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}><Plus size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </main>
    </>
  );
}
