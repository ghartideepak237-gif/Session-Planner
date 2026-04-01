import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Search, Save, FileDown, Plus, GripVertical, Trash2, FolderOpen, Copy, Activity, PenTool, Pencil, CheckCircle2, RotateCcw } from 'lucide-react';
import { useStore, computeSessionEnergy } from '../store';
import { generateSessionPDF } from '../utils/pdfGenerator';
import ReflectionModal from './ReflectionModal';
import EditActivityModal from './EditActivityModal';
import EditSessionModal from './EditSessionModal';

export default function SessionBuilder() {
  const { builder, setBuilderField, removeGameFromSession, reorderSessionGames, saveSession, games, addGameToSession, sessions, duplicateSession, loadSessionToBuilder, adjustGameDuration, setGameFlowPosition, flowPositions, categories, energyTypes, addGame, engagementTypes, setActiveTab, duplicateActivityInSession, autosaveStatus } = useStore();
  const [search, setSearch] = useState('');
  const [isQuickAddingCustom, setIsQuickAddingCustom] = useState(false);
  const [reflectionSessionId, setReflectionSessionId] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [customForm, setCustomForm] = useState({
    title: '', duration: '', rules: '', context: '', energyType: energyTypes[0], theme_clean: categories[0] || 'General'
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderSessionGames(result.source.index, result.destination.index);
  };

  const availableGames = games.filter(g => 
    !search || g.title.toLowerCase().includes(search.toLowerCase())
  );
  
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
      baseDurationNum: durationNum
    };

    if (saveToRepo) addGame(newGame);
    addGameToSession(newGame);

    setCustomForm({ title: '', duration: '', rules: '', context: '', energyType: energyTypes[0], theme_clean: categories[0] || 'General' });
    setIsQuickAddingCustom(false);
  };

  // Predictive timing
  const totalPlanned = builder.selectedGames.reduce((acc, g) => acc + g.actualDuration, 0);
  const remainingTime = builder.baseDuration - totalPlanned;
  const sessionEnergy = computeSessionEnergy(builder.selectedGames);

  let remainingColor = '#ef4444'; // Over time Red
  if (remainingTime >= 10) remainingColor = '#22c55e'; // Green
  else if (remainingTime >= 5) remainingColor = '#eab308'; // Yellow
  else if (remainingTime >= 0) remainingColor = '#f97316'; // Orange

  // Compute Session Status
  const isSavedInStore = sessions.some(s => s.id === builder.id);
  let sessionStatus = 'Draft';
  if (builder.programId) sessionStatus = 'Assigned to Program';
  else if (isSavedInStore) sessionStatus = 'Saved';

  let statusColor = 'var(--text-dim)';
  if (sessionStatus === 'Saved') statusColor = 'var(--accent)';
  if (sessionStatus === 'Assigned to Program') statusColor = '#22c55e';

  return (
    <>
    <ReflectionModal sessionId={reflectionSessionId} onClose={() => setReflectionSessionId(null)} />
    <EditActivityModal isOpen={!!editingActivity} onClose={() => setEditingActivity(null)} activity={editingActivity} />
    <EditSessionModal isOpen={isEditingSession} onClose={() => setIsEditingSession(false)} session={builder} />
    
    <main className="container-max" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 'var(--spacing-4)' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                {builder.sessionNumber || 'Untitled Workspace'}
              </h2>
              <button 
                title="Edit Session Details"
                onClick={() => setIsEditingSession(true)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px', hover: { color: 'var(--text-main)' } }}
              >
                <Pencil size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', padding: '2px 8px', borderRadius: '12px', border: `1px solid ${statusColor}`, color: statusColor, background: 'var(--bg-transparent)' }}>
                {sessionStatus}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)', fontSize: '11px' }}>
                {autosaveStatus === 'saving' ? (
                  <>
                    <RotateCcw size={10} className="spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={10} color="#22c55e" />
                    <span>Saved</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="builder-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2)' }}>
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
        </div>

        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-2)' }}>Session Timeline</h3>
          
          {builder.selectedGames.length === 0 ? (
            <div style={{ padding: 'var(--spacing-6) var(--spacing-3)', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: 'var(--spacing-1)' }}>Start building your flow</p>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Select activities from the repository to create your timeline.</p>
            </div>
          ) : (
            <div style={{ position: 'relative', paddingLeft: 'var(--spacing-4)' }}>
              {/* Timeline connecting line */}
              <div style={{ position: 'absolute', left: '26px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border)' }}></div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="builder-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                      {builder.selectedGames.map((game, index) => (
                        <Draggable key={game.instanceId} draggableId={game.instanceId} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              style={{ 
                                ...provided.draggableProps.style,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--spacing-2)',
                                position: 'relative'
                              }}
                            >
                              {/* Timeline Node dot */}
                              <div style={{ position: 'absolute', left: '-27px', top: '16px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--bg-dark)', border: '2px solid var(--accent)', zIndex: 2 }}></div>

                              <div className="builder-card" style={{ flex: 1, padding: 'var(--spacing-2)', borderColor: snapshot.isDragging ? 'var(--text-secondary)' : 'var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
                                  
                                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                    <GripVertical size={16} color="var(--text-dim)" {...provided.dragHandleProps} />
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <h3 
                                          title="Click to edit activity"
                                          onClick={() => setEditingActivity(game)}
                                          style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', cursor: 'pointer' }}
                                        >
                                          {game.title}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                          <button 
                                            title="Edit Activity"
                                            onClick={() => setEditingActivity(game)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                                          >
                                            <Pencil size={12} />
                                          </button>
                                          <button 
                                            title="Duplicate inside session"
                                            onClick={() => duplicateActivityInSession(game.instanceId)}
                                            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}
                                          >
                                            <Copy size={12} />
                                          </button>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', gap: 'var(--spacing-2)', fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                                        <span>Org: {game.baseDurationNum}m</span>
                                        <span>Plan: {game.actualDuration}m</span>
                                        <span style={{ color: 'var(--accent)' }}>{game.flowPosition}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <button onClick={() => removeGameFromSession(game.instanceId)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', padding: 'var(--spacing-1) var(--spacing-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase' }}>Timing:</span>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                      {[-5, -1, 1, 5].map(delta => (
                                        <button 
                                          key={delta}
                                          onClick={() => adjustGameDuration(game.instanceId, delta)}
                                          className="btn-secondary" 
                                          style={{ padding: '2px 4px', fontSize: '9px', minWidth: '24px' }}
                                        >
                                          {delta > 0 ? `+${delta}` : delta}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)' }}>
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

        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button className="btn-secondary" onClick={() => { saveSession(); }}>
            <Save size={14} /> {autosaveStatus === 'saving' ? 'Saving...' : 'Save Plan'}
          </button>
          <button className="btn-primary" onClick={() => generateSessionPDF(builder)}>
            <FileDown size={14} /> Export PDF
          </button>
        </div>
      </div>


      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        
        <div className="builder-card" style={{ position: 'sticky', top: 'var(--spacing-4)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: 'var(--spacing-3)' }}>SESSION SUMMARY</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total games:</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{builder.selectedGames.length}</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Session Time:</span>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{builder.baseDuration} min</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Planned:</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: remainingTime < 0 ? '#ef4444' : 'var(--text-main)' }}>{totalPlanned} min</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>Remaining:</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: remainingColor }}>
              {Math.abs(remainingTime)} min {remainingTime < 0 ? 'Over' : ''}
            </span>
          </div>

          {remainingTime < 0 && (
            <div style={{ marginTop: 'var(--spacing-3)', padding: 'var(--spacing-2)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', textAlign: 'center' }}>
                Session exceeds time by {Math.abs(remainingTime)} min
              </p>
            </div>
          )}
        </div>

        <div className="builder-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 350px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              {isQuickAddingCustom ? 'New Custom Activity' : 'Quick Add Repository'}
            </h3>
            <button 
              onClick={() => setIsQuickAddingCustom(!isQuickAddingCustom)}
              className="btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}
            >
              {isQuickAddingCustom ? 'Cancel' : '+ Custom Game'}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)', marginTop: 'var(--spacing-2)' }}>
                <button className="btn-primary" style={{ justifyContent: 'center' }} onClick={() => handleCustomGameSave(true)}>Save to Session + Repository</button>
              </div>
            </div>
          ) : (
            <>
              <div className="search-container" style={{ marginBottom: 'var(--spacing-2)' }}>
                <Search className="search-icon" size={12} />
                <input 
                  type="text" placeholder="Search..." className="search-input"
                  value={search} onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingRight: '4px' }}>
                
                {favoriteGames.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-3)' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--accent)', margin: 'var(--spacing-1) 0 var(--spacing-2) 0', paddingLeft: '4px' }}>
                      Favorite Activities
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                      {favoriteGames.map(game => (
                        <div key={game.title} className="builder-row" style={{ padding: '8px', background: 'transparent' }}>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ fontSize: '12px', fontWeight: '600' }}>{game.title}</h5>
                            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{game.baseDurationNum}m • {game.energyType}</div>
                          </div>
                          <button 
                            onClick={() => addGameToSession(game)}
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                          ><Plus size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {remainingGames.length > 0 && (
                  <div>
                    {favoriteGames.length > 0 && (
                      <h4 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-dim)', margin: '0 0 var(--spacing-2) 0', paddingLeft: '4px' }}>
                        Remaining Activities
                      </h4>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                      {remainingGames.map(game => (
                        <div key={game.title} className="builder-row" style={{ padding: '8px', background: 'transparent' }}>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ fontSize: '12px', fontWeight: '500' }}>{game.title}</h5>
                            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{game.baseDurationNum}m • {game.energyType}</div>
                          </div>
                          <button 
                            onClick={() => addGameToSession(game)}
                            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)' }}
                          ><Plus size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </div>

      </aside>
    </main>
    </>
  );
}
