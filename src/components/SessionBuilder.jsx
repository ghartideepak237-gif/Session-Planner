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
    
    <main className="builder-main-v8 container-max v8-theme">
      <style>{`
        .builder-main-v8 {
          display: grid;
          grid-template-columns: 280px minmax(0, 1fr) 340px;
          min-height: calc(100vh - 72px);
          gap: 40px;
          padding: 40px 0;
        }

        @media (max-width: 1200px) {
          .builder-main-v8 {
            grid-template-columns: 250px 1fr;
            gap: 20px;
            padding: 20px;
          }
          .builder-main-v8 > aside:last-of-type {
            display: none; /* Hide asset library on tablets to save space */
          }
        }

        @media (max-width: 768px) {
          .builder-main-v8 {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
            gap: 32px;
          }
          .builder-main-v8 > aside:last-of-type {
            display: flex; /* Show it again but stacked */
          }
        }
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
          padding: 16px;
          position: relative;
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

        .dragging-v9 {
          box-shadow: 0 40px 80px rgba(0,0,0,0.8) !important;
          border-color: var(--accent-gold) !important;
          transform: scale(1.05) !important;
          z-index: 1000 !important;
        }

        .drop-highlight-v9 {
          background: rgba(234, 179, 8, 0.05) !important;
          border: 1px dashed var(--accent-gold) !important;
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

        <div className="premium-card-v9" style={{ padding: '20px' }}>
          <div className="shimmer-overlay-v9" />
          <div style={{ position: 'relative', zIndex: 2 }}>
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
        </div>

        <div className="premium-card-v9" style={{ padding: '20px' }}>
          <div className="shimmer-overlay-v9" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <label className="timing-label-v8">Session Notes</label>
            <textarea 
              value={builder.notes || ''}
              onChange={e => setBuilderField('notes', e.target.value)}
              placeholder="Add strategic notes for this session..."
              className="v8-input"
              style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.02)', border: '0.5px solid var(--border-soft)', color: 'var(--text-secondary)', borderRadius: '12px', padding: '12px', fontSize: '12px', resize: 'none', lineHeight: '1.6' }}
            />
          </div>
        </div>

        <div className="premium-card-v9" style={{ padding: '16px' }}>
          <div className="shimmer-overlay-v9" />
          <div style={{ position: 'relative', zIndex: 2 }}>
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
                {(provided, snapshot) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef} 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '16px',
                      minHeight: '200px',
                      background: snapshot.isDraggingOver ? 'rgba(125, 211, 252, 0.02)' : 'transparent',
                      borderRadius: '24px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {builder.selectedGames.map((game, index) => (
                      <Draggable key={game.instanceId} draggableId={game.instanceId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`premium-card-v9 ${snapshot.isDragging ? 'dragging-active-v9' : ''}`}
                            style={{ 
                              ...provided.draggableProps.style,
                              marginBottom: '16px',
                              zIndex: snapshot.isDragging ? 1000 : 1
                            }}
                          >
                            <div 
                              className={`premium-card-content-v9 ${snapshot.isDragging ? 'dragging-visual-v9' : ''}`}
                              style={{
                                background: snapshot.isDragging ? 'rgba(20, 24, 28, 0.98)' : 'rgba(12, 16, 20, 0.8)',
                                border: snapshot.isDragging ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '20px',
                                padding: '20px',
                                transition: snapshot.isDragging ? 'none' : 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                                transform: snapshot.isDragging ? 'scale(0.96)' : 'scale(1)',
                                boxShadow: snapshot.isDragging ? '0 40px 80px rgba(0,0,0,0.8)' : 'none',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                            >
                              <div className="shimmer-overlay-v9" />
                              <div style={{ position: 'relative', zIndex: 2 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div {...provided.dragHandleProps} style={{ cursor: snapshot.isDragging ? 'grabbing' : 'grab', opacity: 0.3 }}>
                                      <GripVertical size={16} />
                                    </div>
                                    <h4 
                                      onClick={() => setEditingActivity(game)}
                                      style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#FFF', fontFamily: 'var(--font-serif)', cursor: 'pointer' }}
                                    >
                                      {game.title}
                                    </h4>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); setEditingActivity(game); }}
                                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '4px' }}
                                      >
                                        <Pencil size={14} />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); moveSessionGameUp(game.instanceId); }}
                                        disabled={index === 0}
                                        style={{ background: 'none', border: 'none', color: index === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.3)', cursor: index === 0 ? 'default' : 'pointer', padding: '4px' }}
                                      >
                                        <ChevronUp size={16} />
                                      </button>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); moveSessionGameDown(game.instanceId); }}
                                        disabled={index === builder.selectedGames.length - 1}
                                        style={{ background: 'none', border: 'none', color: index === builder.selectedGames.length - 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.3)', cursor: index === builder.selectedGames.length - 1 ? 'default' : 'pointer', padding: '4px' }}
                                      >
                                        <ChevronDown size={16} />
                                      </button>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-gold)', fontFamily: 'var(--font-serif)', minWidth: '40px', textAlign: 'right' }}>{game.actualDuration}m</div>
                                    <button onClick={() => removeGameFromSession(game.instanceId)} style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.3)', cursor: 'pointer', padding: '4px' }}>
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                  <span style={{ fontSize: '10px', color: 'var(--accent-silver)', fontWeight: '800', textTransform: 'uppercase' }}>{game.flowPosition}</span>
                                  <span style={{ width: '4px', height: '4px', borderRadius: '20px', background: 'rgba(255,255,255,0.2)' }} />
                                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>{game.baseDurationNum}m base</span>
                                </div>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                  {[-5, -1, 1, 5].map(delta => (
                                    <button 
                                      key={delta}
                                      onClick={(e) => { e.stopPropagation(); adjustGameDuration(game.instanceId, delta); }}
                                      style={{ width: '28px', height: '22px', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '10px', color: '#FFF', cursor: 'pointer' }}
                                    >
                                      {delta > 0 ? `+${delta}` : delta}
                                    </button>
                                  ))}
                                </div>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '99px', padding: '10px 16px' }}>
                <Search size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
                <input 
                  placeholder="Search repository..." 
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '13px', outline: 'none', minWidth: 0 }}
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                <button 
                  onClick={() => setSelectedFolderId(null)}
                  style={{ 
                    whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700',
                    background: !selectedFolderId ? 'var(--accent-silver)' : 'rgba(255,255,255,0.05)',
                    color: !selectedFolderId ? 'var(--bg-deep)' : 'var(--text-muted)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  All
                </button>
                {folders.map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    style={{ 
                      whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700',
                      background: selectedFolderId === f.id ? 'var(--accent-silver)' : 'rgba(255,255,255,0.05)',
                      color: selectedFolderId === f.id ? 'var(--bg-deep)' : 'var(--text-muted)',
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}
                  >
                    <Folder size={10} fill={selectedFolderId === f.id ? 'var(--bg-deep)' : 'none'} />
                    {f.name}
                  </button>
                ))}
              </div>
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
