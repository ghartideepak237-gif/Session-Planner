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
    
    <main className="container-max" style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1fr) 320px', minHeight: 'calc(100vh - 80px)' }}>
      
      {/* COLUMN 1: Session Flow details & Summary */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', paddingRight: '16px' }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: '1.2' }}>
              {builder.sessionNumber || 'Untitled Workspace'}
            </h2>
            <button 
              title="Edit Session Details"
              onClick={() => setIsEditingSession(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
            >
              <Pencil size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${statusColor}`, color: statusColor, background: 'var(--bg-transparent)' }}>
              {sessionStatus}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '11px' }}>
              {autosaveStatus === 'saving' ? (
                <><RotateCcw size={10} className="spin" /><span>Saving...</span></>
              ) : (
                <><CheckCircle2 size={10} color="#22c55e" /><span>Saved</span></>
              )}
            </div>
          </div>
        </div>

        <div className="builder-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
          <div>
            <label className="form-label">College / Group</label>
            <input 
              value={builder.college} 
              onChange={e => setBuilderField('college', e.target.value)}
              className="search-input" placeholder="e.g. MIT Batch" 
            />
          </div>
          <div>
            <label className="form-label">Session Target Time (min)</label>
            <input 
              type="number"
              value={builder.baseDuration} 
              onChange={e => setBuilderField('baseDuration', parseInt(e.target.value) || 45)}
              className="search-input" 
            />
          </div>
        </div>

        <div className="builder-card">
          <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '12px' }}>TIMING SUMMARY</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Target Time:</span>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>{builder.baseDuration} min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Planned:</span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: remainingTime < 0 ? '#ef4444' : 'var(--text-main)' }}>{totalPlanned} min</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Remaining:</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: remainingColor }}>
              {Math.abs(remainingTime)} min {remainingTime < 0 ? 'Over' : ''}
            </span>
          </div>
        </div>

        <div>
          <label className="form-label">Session Notes</label>
          <textarea 
            value={builder.notes}
            onChange={e => setBuilderField('notes', e.target.value)}
            className="search-input" 
            style={{ width: '100%', height: '80px', resize: 'vertical' }} 
            placeholder="Special instructions, materials needed..."
          />
        </div>

        {/* GUIDANCE MODULES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="builder-card" style={{ padding: '12px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>PEL Flow Model</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', marginBottom: '2px', fontWeight: '600' }}>Quick Engage ⚡ (2-5 min)</p>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Fast, low-barrier activities to break silence.</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', marginBottom: '2px', fontWeight: '600' }}>Build Energy 🎯 (5-10 min)</p>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Interactive games: movement & collaboration.</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', marginBottom: '2px', fontWeight: '600' }}>Core Interaction 🧠 (10-20 min)</p>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Cognitive or emotional heart of the session.</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-primary)', marginBottom: '2px', fontWeight: '600' }}>Tadka 🔥 (High Energy)</p>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Humor/Energy closing to leave on a high.</p>
              </div>
            </div>
          </div>

          <div className="builder-card" style={{ padding: '12px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Execution Principles</h3>
            <ul style={{ fontSize: '11px', color: 'var(--text-secondary)', paddingLeft: '16px', margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Zero Dead Time</strong>: Transitions &lt; 15s.</li>
              <li><strong>High Participation</strong>: No eliminations.</li>
              <li><strong>Energy Discipline</strong>: Pivot if energy dips.</li>
              <li><strong>Peak-End Rule</strong>: Stop while it's still fun.</li>
            </ul>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div style={{ padding: '12px', background: 'rgba(255, 122, 47, 0.05)', border: '1px solid rgba(255, 122, 47, 0.3)', borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '6px' }}>SESSION STRUCTURE REQUIREMENTS</h3>
            <ul style={{ fontSize: '11px', color: 'var(--text-primary)', margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', marginTop: 'auto' }}>
          <button className="btn-secondary" onClick={() => saveSession()} style={{ justifyContent: 'center' }}>
            <Save size={14} /> {autosaveStatus === 'saving' ? 'Saving...' : 'Save Plan'}
          </button>
          <button className="btn-primary" onClick={() => generateSessionPDF(builder)} style={{ justifyContent: 'center' }}>
            <FileDown size={14} /> Export PDF
          </button>
        </div>
      </aside>

      {/* COLUMN 2: Timeline Builder */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', padding: '0 24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', marginBottom: 'var(--spacing-3)' }}>Session Timeline</h3>
        
        {builder.selectedGames.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
             <p style={{ fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>Timeline is empty</p>
             <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Select activities from the right panel to build your flow.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: '24px' }}>
            <div style={{ position: 'absolute', left: '6px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border)' }}></div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="builder-list">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                            <div style={{ position: 'absolute', left: '-23px', top: '20px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--bg-main)', border: '2px solid var(--accent)', zIndex: 2 }}></div>

                            <div 
                              className="builder-card" 
                              style={{ 
                                padding: '12px', 
                                background: 'var(--bg-card)', 
                                border: '1px solid var(--border)', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                                borderColor: snapshot.isDragging ? 'var(--text-secondary)' : 'var(--border)' 
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div {...provided.dragHandleProps} style={{ cursor: 'grab', padding: '4px', margin: '-4px' }}>
                                    <GripVertical size={16} color="var(--text-dim)" />
                                  </div>
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <h3 
                                        onClick={() => setEditingActivity(game)}
                                        style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', cursor: 'pointer', margin: 0 }}
                                      >
                                        {game.title}
                                      </h3>
                                      <div style={{ display: 'flex', gap: '2px' }}>
                                        <button onClick={() => setEditingActivity(game)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Pencil size={12} /></button>
                                        <button onClick={() => duplicateActivityInSession(game.instanceId)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}><Copy size={12} /></button>
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                                      <span style={{ color: 'var(--accent)' }}>{game.flowPosition}</span>
                                      <span>• Org: {game.baseDurationNum}m</span>
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                  <div style={{ display: 'flex', gap: '2px' }}>
                                    <button onClick={() => moveSessionGameUp(game.instanceId)} disabled={index === 0} style={{ background: 'none', border: 'none', color: index === 0 ? 'transparent' : 'var(--text-dim)', cursor: 'pointer', padding: '2px' }} title="Move Up"><ChevronUp size={14} /></button>
                                    <button onClick={() => moveSessionGameDown(game.instanceId)} disabled={index === builder.selectedGames.length - 1} style={{ background: 'none', border: 'none', color: index === builder.selectedGames.length - 1 ? 'transparent' : 'var(--text-dim)', cursor: 'pointer', padding: '2px' }} title="Move Down"><ChevronDown size={14} /></button>
                                  </div>
                                  <button onClick={() => removeGameFromSession(game.instanceId)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px', hover: { color: '#ef4444' } }}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-panel)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', marginTop: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: '600' }}>ADJUST TIME:</span>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    {[-5, -1, 1, 5].map(delta => (
                                      <button 
                                        key={delta}
                                        onClick={() => adjustGameDuration(game.instanceId, delta)}
                                        className="btn-secondary" 
                                        style={{ padding: '2px 6px', fontSize: '10px' }}
                                      >
                                        {delta > 0 ? `+${delta}` : delta}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                                  {game.actualDuration} min
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

      {/* COLUMN 3: Repository Quick Pick */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', background: 'var(--bg-panel)', padding: '16px', marginLeft: '16px', borderRadius: '12px', border: '1px solid var(--border)', maxHeight: 'calc(100vh - 100px)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {selectedFolderId && !isQuickAddingCustom && (
              <button 
                onClick={() => setSelectedFolderId(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                ←
              </button>
            )}
            {isQuickAddingCustom ? 'Custom Activity' : selectedFolderId ? folders.find(f => f.id === selectedFolderId)?.name : 'Repository'}
          </h3>
          <button 
            onClick={() => setIsQuickAddingCustom(!isQuickAddingCustom)}
            className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}
          >
            {isQuickAddingCustom ? 'Back to Library' : '+ Custom'}
          </button>
        </div>

        {isQuickAddingCustom ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', flex: 1, overflowY: 'auto' }}>
            <input placeholder="Game Name *" className="search-input" value={customForm.title} onChange={e => setCustomForm({...customForm, title: e.target.value})} autoFocus />
            <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
              <input placeholder="Duration (min) *" className="search-input" style={{ width: '50%' }} value={customForm.duration} onChange={e => setCustomForm({...customForm, duration: e.target.value})} />
              <select className="search-input" style={{ width: '50%' }} value={customForm.energyType} onChange={e => setCustomForm({...customForm, energyType: e.target.value})}>
                {energyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <select className="search-input" value={customForm.theme_clean} onChange={e => setCustomForm({...customForm, theme_clean: e.target.value})}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea placeholder="Description (optional)" className="search-input" rows="2" style={{ resize: 'vertical' }} value={customForm.rules} onChange={e => setCustomForm({...customForm, rules: e.target.value})} />
            <button className="btn-primary" style={{ justifyContent: 'center', marginTop: '4px' }} onClick={() => handleCustomGameSave(true)}>Add to Session</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'hidden' }}>
            <div className="search-container">
              <Search className="search-icon" size={14} />
              <input 
                type="text" placeholder="Search activities..." className="search-input"
                style={{ background: 'var(--bg-main)', border: '1px solid var(--border)' }}
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Folders List */}
            {folders && folders.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scrollbar">
                <button 
                  onClick={() => setSelectedFolderId(null)}
                  className={`pill ${selectedFolderId === null ? 'active' : ''}`}
                  style={{ whiteSpace: 'nowrap', fontSize: '11px', padding: '4px 10px' }}
                >
                  All
                </button>
                {folders.map(f => (
                  <button 
                    key={f.id}
                    onClick={() => setSelectedFolderId(f.id)}
                    className={`pill ${selectedFolderId === f.id ? 'active' : ''}`}
                    style={{ whiteSpace: 'nowrap', fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Folder size={10} /> {f.name}
                  </button>
                ))}
              </div>
            )}

            {/* Activities List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingRight: '4px' }}>
              {favoriteGames.length > 0 && !search && !selectedFolderId && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 8px 4px' }}>Favorites</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {favoriteGames.map(game => (
                      <div key={game.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 2px 0' }}>{game.title}</h5>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{game.baseDurationNum}m • {game.energyType}</div>
                        </div>
                        <button onClick={() => addGameToSession(game)} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'background 0.2s' }}><Plus size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {remainingGames.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-dim)', margin: '0 0 8px 4px' }}>Games</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {remainingGames.map(game => (
                      <div key={game.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 2px 0' }}>{game.title}</h5>
                          <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{game.baseDurationNum}m • {game.energyType}</div>
                        </div>
                        <button onClick={() => addGameToSession(game)} style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'background 0.2s' }}><Plus size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </aside>

    </main>
    </>
  );
}
