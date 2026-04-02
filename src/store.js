import { create } from 'zustand';
import { GAMES } from './gamesData';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabaseClient';

const ENERGY_TYPES = ['Quick Fire', 'Interactive', 'Core Engagement', 'Deep Connect', 'Closing'];
const ENGAGEMENT_TYPES = ['Talking', 'Movement', 'Thinking', 'Laughing', 'Storytelling', 'Team interaction'];
const FLOW_POSITIONS = ['Quick Engage ⚡', 'Build Energy 🎯', 'Core Interaction 🧠', 'Tadka 🔥'];
const INTERACTION_TYPES = ['Talking', 'Laughing', 'Physical', 'Thinking', 'Team interaction', 'Deep connect'];

// Helper to sanitize base game data on load
const parseDuration = (dStr) => {
  const match = dStr?.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10; // Default to 10 min
};

const mapLegacyToNewFields = (game) => {
  let energyType = 'Interactive';
  let engagementType = 'Team interaction';

  // Heuristic mapping from old tiers
  if (game.tier === 'quick-fire') energyType = 'Quick Fire';
  if (game.tier === 'deep-dive') energyType = 'Deep Connect';
  if (game.theme_clean === 'Icebreaker') energyType = 'Opening';
  
  if (game.theme_clean === 'Communication') engagementType = 'Talking';
  if (game.theme_clean === 'Problem Solving') engagementType = 'Thinking';

  return {
    ...game,
    baseDurationNum: parseDuration(game.duration),
    energyType: game.energyType || energyType,
    engagementType: game.engagementType || engagementType,
    folder_ids: game.folder_ids || (game.folder_id ? [game.folder_id] : []),
    interaction_types: game.interaction_types || [engagementType],
    description: game.description || game.rules || game.comments || '',
    objective: game.objective || '',
    context: game.context || '',
    notes: game.notes || '',
    facilitatorNotes: game.facilitatorNotes || ''
  };
};

const initializedGames = GAMES.map(mapLegacyToNewFields);

export const useStore = create((set, get) => ({
  isLoading: true,
  isMigrating: false,
  dbStatus: 'loading', // 'connected' | 'disconnected' | 'loading'
  activeTab: 'repository',
  games: [],
  folders: [],
  categories: [],
  sessions: [],
  programs: [],
  activeProgramId: null,
  autosaveStatus: 'saved', // 'saved' | 'saving'
  
  // V3 Options
  energyTypes: ENERGY_TYPES,
  engagementTypes: ENGAGEMENT_TYPES,
  interactionTypes: INTERACTION_TYPES,
  flowPositions: FLOW_POSITIONS,
  
  // Active Builder State
  builder: {
    id: uuidv4(),
    programId: null,
    programWeek: null,
    programTheme: '',
    programFocus: '',
    college: '',
    sessionNumber: '',
    targetGroup: '',
    objective: '',
    baseDuration: 45,
    selectedGames: [], // V3: each will have `actualDuration` and `flowPosition`
    notes: '',
  },

  // Global UI
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveProgram: (id) => set({ activeProgramId: id, activeTab: 'roadmap' }),

  // Initialization & Migration
  initialize: async () => {
    console.log('[Supabase] Initializing connection (Soft Delete active)...');
    set({ isLoading: true });
    try {
      // 1. Fetch from Supabase - Filter only active (non-deleted) items
      const { data: dbGames, error: gErr } = await supabase.from('activities').select('*').is('deleted_at', null);
      const { data: dbPrograms, error: pErr } = await supabase.from('programs').select('*').is('deleted_at', null);
      const { data: dbSessions, error: sErr } = await supabase.from('sessions').select('*').is('deleted_at', null);
      const { data: dbFolders, error: fErr } = await supabase.from('folders').select('*').is('deleted_at', null);

      if (gErr || pErr || sErr) {
        console.error('[Supabase] Fetch error:', gErr || pErr || sErr);
        throw new Error('Database tables missing or unreachable');
      }

      console.log(`[Supabase] Loaded Active: ${dbPrograms?.length || 0} programs, ${dbSessions?.length || 0} sessions, ${dbGames?.length || 0} activities`);

      // 2. Check if migration needed
      const hasLocalData = localStorage.getItem('socialize-programs');
      if ((!dbPrograms || dbPrograms.length === 0) && hasLocalData && !localStorage.getItem('socialize-migrated')) {
        console.log('[Supabase] Empty database detected, but local data found. Triggering migration...');
        await get().migrateFromLocalStorage();
        return;
      }

      // 3. Fallback to initial games ONLY if DB is totally empty
      let games = (dbGames || []).map(g => ({
        ...g,
        folder_ids: g.folder_ids || [],
        interaction_types: g.interaction_types || []
      }));
      if (games.length === 0) {
        console.log('[Supabase] Repository empty. Seeding initial activities...');
        await supabase.from('activities').insert(initializedGames);
        const { data: reloadedGames } = await supabase.from('activities').select('*').is('deleted_at', null);
        games = (reloadedGames || initializedGames).map(g => ({
          ...g,
          folder_ids: g.folder_ids || [],
          interaction_types: g.interaction_types || []
        }));
      }

      set({ 
        games,
        programs: dbPrograms || [], 
        sessions: dbSessions || [],
        folders: dbFolders || [],
        categories: [...new Set(games.map(g => g.theme_clean))],
        dbStatus: 'connected',
        isLoading: false 
      });
    } catch (error) {
      console.error('[Supabase] Initialization failed:', error.message);
      const localPrograms = JSON.parse(localStorage.getItem('socialize-programs') || '[]');
      const localSessions = JSON.parse(localStorage.getItem('socialize-sessions') || '[]');
      
      set({ 
        games: initializedGames,
        programs: localPrograms,
        sessions: localSessions,
        folders: [],
        categories: [...new Set(initializedGames.map(g => g.theme_clean))],
        dbStatus: 'disconnected',
        isLoading: false 
      });
    }
  },

  migrateFromLocalStorage: async () => {
    console.log('[Supabase] Migration started...');
    set({ isMigrating: true });
    try {
      const localPrograms = JSON.parse(localStorage.getItem('socialize-programs') || '[]');
      const localSessions = JSON.parse(localStorage.getItem('socialize-sessions') || '[]');
      
      console.log(`[Supabase] Pushing ${localPrograms.length} programs and ${localSessions.length} sessions from localStorage...`);

      // Upsert local data to Supabase
      if (localPrograms.length > 0) {
        const { error: pErr } = await supabase.from('programs').upsert(localPrograms.map(p => ({
          ...p,
          created_at: p.date || new Date().toISOString()
        })));
        if (pErr) throw pErr;
      }
      
      if (localSessions.length > 0) {
        const { error: sErr } = await supabase.from('sessions').upsert(localSessions);
        if (sErr) throw sErr;
      }

      console.log('[Supabase] Migration successful! Clearing local cache markers...');
      // We don't delete local data for safety, but we could mark it as migrated
      localStorage.setItem('socialize-migrated', 'true');

      // Re-initialize to pull from DB
      await get().initialize();
      set({ isMigrating: false });
    } catch (error) {
      console.error('[Supabase] Migration failed:', error);
      set({ isMigrating: false, isLoading: false });
    }
  },

  // Actions - Folders
  addFolder: async (name) => {
    console.log('[Supabase] Saving new folder...');
    const newFolder = { id: uuidv4(), name, created_at: new Date().toISOString() };
    const { error } = await supabase.from('folders').insert([newFolder]);
    if (!error) {
      set((state) => ({ folders: [...state.folders, newFolder] }));
    } else {
      console.error('[Supabase] Error saving folder:', error.message);
    }
  },
  renameFolder: async (folderId, newName) => {
    console.log('[Supabase] Renaming folder...');
    const { error } = await supabase.from('folders').update({ name: newName }).eq('id', folderId);
    if (!error) {
      set((state) => ({
        folders: state.folders.map(f => f.id === folderId ? { ...f, name: newName } : f)
      }));
    } else {
      console.error('[Supabase] Error renaming folder:', error.message);
    }
  },
  deleteFolder: async (folderId) => {
    console.log('[Supabase] Soft deleting folder...');
    const now = new Date().toISOString();
    const { error } = await supabase.from('folders').update({ deleted_at: now }).eq('id', folderId);
    if (!error) {
      await supabase.from('activities').update({ folder_id: null }).eq('folder_id', folderId);
      set((state) => ({
        folders: state.folders.filter(f => f.id !== folderId),
        games: state.games.map(g => g.folder_id === folderId ? { ...g, folder_id: null } : g)
      }));
    } else {
      console.error('[Supabase] Error deleting folder:', error.message);
    }
  },
  toggleActivityInFolder: async (activityId, folderId) => {
    const activity = get().games.find(g => g.id === activityId);
    if (!activity) return;

    let newFolderIds = Array.isArray(activity.folder_ids) ? [...activity.folder_ids] : [];
    const isAlreadyIn = newFolderIds.includes(folderId);

    if (isAlreadyIn) {
      newFolderIds = newFolderIds.filter(id => id !== folderId);
      console.log(`[Supabase] Removing activity from folder ${folderId}...`);
    } else {
      newFolderIds.push(folderId);
      console.log(`[Supabase] Adding activity to folder ${folderId}...`);
    }

    const { error } = await supabase.from('activities').update({ 
      folder_ids: newFolderIds,
      folder_id: newFolderIds[0] || null // Keep legacy for safety
    }).eq('id', activityId);

    if (!error) {
      set((state) => ({
        games: state.games.map(g => g.id === activityId ? { ...g, folder_ids: newFolderIds, folder_id: newFolderIds[0] || null } : g)
      }));
    } else {
      console.error('[Supabase] Error toggling folder:', error.message);
    }
  },
  moveActivityToFolder: async (activityId, folderId) => {
    // Legacy support, maps to toggle (add)
    await get().toggleActivityInFolder(activityId, folderId);
  },

  // Actions - Games
  addGame: async (game) => {
    console.log('[Supabase] Saving new activity to Supabase...');
    const newGame = { ...game, id: uuidv4(), baseDurationNum: parseDuration(game.duration) };
    set({ autosaveStatus: 'saving' });
    const { error } = await supabase.from('activities').insert([newGame]);
    if (!error) {
      console.log('[Supabase] Activity saved successfully');
      const newGames = [...get().games, newGame];
      set({ 
        games: newGames, 
        categories: [...new Set(newGames.map(g => g.theme_clean))],
        autosaveStatus: 'saved' 
      });
    } else {
      console.error('[Supabase] Error saving activity:', error.message);
      set({ autosaveStatus: 'saved' });
    }
  },
  toggleFavorite: async (gameIdOrTitle) => {
    const game = get().games.find(g => g.id === gameIdOrTitle || g.title === gameIdOrTitle);
    if (!game) return;
    const newFavorite = !game.favorite;
    console.log(`[Supabase] Toggling favorite for "${game.title}"...`);
    const { error } = await supabase.from('activities').update({ favorite: newFavorite }).eq('id', game.id);
    if (!error) {
      console.log('[Supabase] Favorite sync successful');
      set((state) => ({
        games: state.games.map(g => g.id === game.id ? { ...g, favorite: newFavorite } : g)
      }));
    } else {
      console.error('[Supabase] Error syncing favorite:', error.message);
    }
  },
  updateGame: async (gameId, updates) => {
    console.log('[Supabase] Updating activity in Supabase...');
    set({ autosaveStatus: 'saving' });
    const { error } = await supabase.from('activities').update(updates).eq('id', gameId);
    if (!error) {
      console.log('[Supabase] Activity updated successfully');
      const newGames = get().games.map(g => g.id === gameId ? { ...g, ...updates } : g);
      set({ 
        games: newGames,
        categories: [...new Set(newGames.map(g => g.theme_clean))],
        autosaveStatus: 'saved' 
      });
    } else {
      console.error('[Supabase] Error updating activity:', error.message);
      set({ autosaveStatus: 'saved' });
    }
  },
  duplicateGame: async (game) => {
    console.log('[Supabase] Duplicating activity in Supabase...');
    const newGame = { ...game, title: `${game.title} (Copy)`, id: uuidv4() };
    const { error } = await supabase.from('activities').insert([newGame]);
    if (!error) {
      console.log('[Supabase] Duplication successful');
      const newGames = [...get().games, newGame];
      set({ 
        games: newGames,
        categories: [...new Set(newGames.map(g => g.theme_clean))]
      });
    } else {
      console.error('[Supabase] Duplication failed:', error.message);
    }
  },

  // Actions - Builder
  // ... (keeping sync builder actions as provided)
  setBuilderField: (field, value) => set((state) => ({
    builder: { ...state.builder, [field]: value }
  })),
  addGameToSession: (game) => set((state) => {
    const currentLen = state.builder.selectedGames.length;
    let newFlowPos = FLOW_POSITIONS[0]; // Quick Engage ⚡
    if (currentLen === 1) newFlowPos = FLOW_POSITIONS[1]; // Build Energy 🎯
    if (currentLen === 2) newFlowPos = FLOW_POSITIONS[2]; // Core Interaction 🧠
    if (currentLen >= 3) newFlowPos = FLOW_POSITIONS[2]; // Core Interaction 🧠
    
    // PEL Logic: If it's the last one being added, it could be Tadka 
    // but usually user adds sequentially. 
    
    return {
      builder: { 
        ...state.builder, 
        selectedGames: [
          ...state.builder.selectedGames, 
          { 
            ...game, 
            instanceId: uuidv4(),
            actualDuration: game.baseDurationNum,
            flowPosition: newFlowPos,
            // Ensure zero info loss - explicitly map all fields
            description: game.description || game.rules || '',
            objective: game.objective || '',
            context: game.context || '',
            notes: game.notes || '',
            facilitatorNotes: game.facilitatorNotes || '',
            energyType: game.energyType || 'Interactive',
            category: game.theme_clean || game.category || 'General'
          }
        ] 
      }
    };
  }),
  removeGameFromSession: (instanceId) => set((state) => ({
    builder: { ...state.builder, selectedGames: state.builder.selectedGames.filter(g => g.instanceId !== instanceId) }
  })),
  reorderSessionGames: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.builder.selectedGames);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { builder: { ...state.builder, selectedGames: result } };
  }),
  
  moveSessionGameUp: (instanceId) => set((state) => {
    const idx = state.builder.selectedGames.findIndex(g => g.instanceId === instanceId);
    if (idx <= 0) return state;
    const result = Array.from(state.builder.selectedGames);
    const [removed] = result.splice(idx, 1);
    result.splice(idx - 1, 0, removed);
    return { builder: { ...state.builder, selectedGames: result } };
  }),

  moveSessionGameDown: (instanceId) => set((state) => {
    const idx = state.builder.selectedGames.findIndex(g => g.instanceId === instanceId);
    if (idx === -1 || idx === state.builder.selectedGames.length - 1) return state;
    const result = Array.from(state.builder.selectedGames);
    const [removed] = result.splice(idx, 1);
    result.splice(idx + 1, 0, removed);
    return { builder: { ...state.builder, selectedGames: result } };
  }),
  
  adjustGameDuration: (instanceId, delta) => set((state) => ({
    builder: {
      ...state.builder,
      selectedGames: state.builder.selectedGames.map(g => 
        g.instanceId === instanceId 
          ? { ...g, actualDuration: Math.max(1, g.actualDuration + delta) } 
          : g
      )
    }
  })),
  setGameFlowPosition: (instanceId, newPosition) => set((state) => ({
    builder: {
      ...state.builder,
      selectedGames: state.builder.selectedGames.map(g => 
        g.instanceId === instanceId 
          ? { ...g, flowPosition: newPosition } 
          : g
      )
    }
  })),
  updateActivityInSession: (instanceId, updates) => set((state) => ({
    builder: {
      ...state.builder,
      selectedGames: state.builder.selectedGames.map(g => 
        g.instanceId === instanceId ? { ...g, ...updates } : g
      )
    }
  })),
  duplicateActivityInSession: (instanceId) => set((state) => {
    const gameToDup = state.builder.selectedGames.find(g => g.instanceId === instanceId);
    if (!gameToDup) return state;
    const newInstance = { ...gameToDup, instanceId: uuidv4(), title: `${gameToDup.title} (Copy)` };
    const idx = state.builder.selectedGames.findIndex(g => g.instanceId === instanceId);
    const newGames = [...state.builder.selectedGames];
    newGames.splice(idx + 1, 0, newInstance);
    return { builder: { ...state.builder, selectedGames: newGames } };
  }),

  // Actions - Sessions
  updateSession: async (sessionId, updates) => {
    console.log('[Supabase] Updating session in Supabase...');
    const { error } = await supabase.from('sessions').update(updates).eq('id', sessionId);
    if (!error) {
      console.log('[Supabase] Session updated successfully');
      set((state) => ({
        sessions: state.sessions.map(s => s.id === sessionId ? { ...s, ...updates } : s)
      }));
    } else {
      console.error('[Supabase] Error updating session:', error.message);
    }
  },
  
  saveSession: async () => {
    console.log('[Supabase] Saving session to Supabase...');
    set({ autosaveStatus: 'saving' });
    const sessionData = get().builder;
    const totalActual = sessionData.selectedGames.reduce((acc, g) => acc + (g.actualDuration || 0), 0);
    
    const finalSession = { 
      ...sessionData, 
      date: new Date().toISOString(),
      createdAt: sessionData.createdAt || Date.now(),
      totalActualDuration: totalActual
    };
    
    const { data, error } = await supabase.from('sessions').upsert([finalSession]).select();
    
    if (!error && data) {
      console.log('[Supabase] Session saved successfully');
      set((state) => {
        const existingIndex = state.sessions.findIndex(s => s.id === finalSession.id);
        const updatedSessions = [...state.sessions];
        if (existingIndex >= 0) updatedSessions[existingIndex] = data[0];
        else updatedSessions.push(data[0]);
        return { sessions: updatedSessions, builder: data[0], autosaveStatus: 'saved' };
      });
    } else {
      console.error('[Supabase] Error saving session:', error?.message);
      set({ autosaveStatus: 'saved' });
    }
  },

  deleteSession: async (sessionId) => {
    console.log('[Supabase] Soft deleting session...');
    const { error } = await supabase.from('sessions').update({ deleted_at: new Date().toISOString() }).eq('id', sessionId);
    if (!error) {
      console.log('[Supabase] Session soft deleted successfully');
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== sessionId)
      }));
    } else {
      console.error('[Supabase] Error deleting session:', error.message);
    }
  },
  duplicateSession: async (session) => {
    console.log('[Supabase] Duplicating session in Supabase...');
    const newSession = { ...session, id: uuidv4(), date: new Date().toISOString(), college: `${session.college} (Copy)` };
    const { error } = await supabase.from('sessions').insert([newSession]);
    if (!error) {
      console.log('[Supabase] Session duplication successful');
      set((state) => ({ sessions: [...state.sessions, newSession] }));
    } else {
      console.error('[Supabase] Error duplicating session:', error.message);
    }
  },
  loadSessionToBuilder: (sessionId) => set((state) => {
    const sessionToLoad = state.sessions.find(s => s.id === sessionId);
    if (sessionToLoad) return { builder: { ...sessionToLoad } };
    return state;
  }),
  saveSessionReflection: (sessionId, reflectionObj) => set((state) => ({
    sessions: state.sessions.map(s => s.id === sessionId ? { ...s, reflection: reflectionObj } : s)
  })),

  // Actions - Programs
  updateProgram: async (programId, updates) => {
    console.log('[Supabase] Updating program in Supabase...');
    const program = get().programs.find(p => p.id === programId);
    if (!program) return;

    const { error } = await supabase.from('programs').update(updates).eq('id', programId);
    if (error) {
      console.error('[Supabase] Error updating program:', error.message);
      return;
    }

    console.log('[Supabase] Program updated successfully');
    set((state) => {
      const updatedProgram = { ...program, ...updates };
      const updatedPrograms = state.programs.map(p => p.id === programId ? updatedProgram : p);
      return { programs: updatedPrograms };
    });

    if (updates.totalSessions && updates.totalSessions !== program.totalSessions) {
      const oldTotal = program.totalSessions;
      const newTotal = updates.totalSessions;
      const programObj = get().programs.find(p => p.id === programId);
      
      if (newTotal > oldTotal) {
        console.log(`[Supabase] Scaling program: Adding ${newTotal - oldTotal} sessions...`);
        const startNum = oldTotal + 1;
        const sessionsPerWeek = Math.ceil(newTotal / programObj.duration);
        const newSessions = [];
        
        for (let i = startNum; i <= newTotal; i++) {
          const currentWeek = Math.min(programObj.duration, Math.ceil(i / sessionsPerWeek));
          const weekData = (programObj.weeks || []).find(w => w.week === currentWeek) || { theme: 'General', focus: 'General' };
          newSessions.push({
            id: uuidv4(), programId: programId, programWeek: currentWeek, programTheme: weekData.theme,
            programFocus: weekData.focus, college: programObj.college, sessionNumber: `Session ${i}`,
            targetActualDuration: 0, selectedGames: [], objective: programObj.objective || ''
          });
        }
        await supabase.from('sessions').insert(newSessions);
        await get().initialize();
      }
    }
  },

  addProgram: async (programData) => {
    console.log('[Supabase] Saving program to Supabase...');
    const programId = uuidv4();
    const { name, college, duration, totalSessions, objective, weeks } = programData;
    const newProgram = {
      id: programId, name, college, duration, totalSessions, objective, weeks, 
      created_at: new Date().toISOString()
    };
    
    const { error } = await supabase.from('programs').insert([newProgram]);
    if (error) {
      console.error('[Supabase] Error saving program:', error.message);
      return;
    }

    console.log('[Supabase] Program saved successfully');
    set((state) => ({ programs: [...state.programs, newProgram] }));
    
    console.log('[Supabase] Scaffolding program sessions...');
    const newSessions = [];
    const sessionsPerWeek = Math.ceil(totalSessions / duration);
    let currentWeek = 1;
    let weekSessionCount = 0;

    for (let i = 1; i <= totalSessions; i++) {
       const weekData = weeks.find(w => w.week === currentWeek) || { theme: 'General', focus: 'General' };
       newSessions.push({
         id: uuidv4(), programId: programId, programWeek: currentWeek, programTheme: weekData.theme,
         programFocus: weekData.focus, college: college, sessionNumber: `Session ${i}`,
         targetActualDuration: 0, selectedGames: [], objective: objective || ''
       });
       weekSessionCount++;
       if (weekSessionCount >= sessionsPerWeek && currentWeek < duration) {
          currentWeek++;
          weekSessionCount = 0;
       }
    }
    const { error: sErr } = await supabase.from('sessions').insert(newSessions);
    if (!sErr) console.log('[Supabase] Sessions scaffolded successfully');
    else console.error('[Supabase] Error scaffolding sessions:', sErr.message);
    
    await get().initialize();
  },

  deleteProgram: async (programId) => {
    console.log('[Supabase] Soft deleting program and associated sessions...');
    const now = new Date().toISOString();
    // Soft delete associated sessions
    await supabase.from('sessions').update({ deleted_at: now }).eq('programId', programId);
    // Soft delete program
    const { error } = await supabase.from('programs').update({ deleted_at: now }).eq('id', programId);
    
    if (!error) {
      console.log('[Supabase] Program soft deleted successfully');
      set((state) => ({
        programs: state.programs.filter(p => p.id !== programId),
        sessions: state.sessions.filter(s => s.programId !== programId)
      }));
    } else {
      console.error('[Supabase] Error deleting program:', error.message);
    }
  },

  deleteActivity: async (activityId) => {
    console.log('[Supabase] Soft deleting activity...');
    const { error } = await supabase.from('activities').update({ deleted_at: new Date().toISOString() }).eq('id', activityId);
    if (!error) {
      console.log('[Supabase] Activity soft deleted successfully');
      set((state) => ({
        games: state.games.filter(g => g.id !== activityId)
      }));
    } else {
      console.error('[Supabase] Error deleting activity:', error.message);
    }
  },

  // Backup & Restore
  exportBackup: async () => {
    try {
      console.log('[Supabase] Preparing full data backup...');
      const { data: programs } = await supabase.from('programs').select('*');
      const { data: sessions } = await supabase.from('sessions').select('*');
      const { data: activities } = await supabase.from('activities').select('*');

      const backupData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        programs: programs || [],
        sessions: sessions || [],
        activities: activities || []
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `e-socialize-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('[Supabase] Backup exported successfully');
    } catch (err) {
      console.error('[Supabase] Backup export failed:', err);
    }
  },

  importBackup: async (jsonFile) => {
    try {
      console.log('[Supabase] Importing data from backup...');
      set({ isMigrating: true });
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const backupData = JSON.parse(e.target.result);
        
        if (backupData.programs?.length > 0) {
          await supabase.from('programs').upsert(backupData.programs);
        }
        if (backupData.sessions?.length > 0) {
          await supabase.from('sessions').upsert(backupData.sessions);
        }
        if (backupData.activities?.length > 0) {
          await supabase.from('activities').upsert(backupData.activities);
        }

        console.log('[Supabase] Backup imported and synced successfully');
        await get().initialize();
        set({ isMigrating: false });
      };
      
      reader.readAsText(jsonFile);
    } catch (err) {
      console.error('[Supabase] Backup import failed:', err);
      set({ isMigrating: false });
    }
  },

  // Phase 8: Smart Slot Assignment
  assignSessionToProgram: async (sessionId, programId, week, slotStr) => {
    const newWeek = week ? parseInt(week, 10) : null;
    const newSlotStr = slotStr;
    const state = get();
    let updatedSessions = [...state.sessions];
    
    const movingSessionIndex = updatedSessions.findIndex(s => s.id === sessionId);
    if (movingSessionIndex === -1) return;

    const movingSession = { ...updatedSessions[movingSessionIndex], programId, programWeek: newWeek, sessionNumber: newSlotStr };
    const sessionsToUpsert = [movingSession];

    if (programId && newWeek !== null && newSlotStr) {
      const occupantIndex = updatedSessions.findIndex(s => s.programId === programId && s.programWeek === newWeek && s.sessionNumber === newSlotStr && s.id !== sessionId);

      if (occupantIndex >= 0) {
        const occupant = { ...updatedSessions[occupantIndex] };
        const program = state.programs.find(p => p.id === programId);
        if (program) {
          let placed = false;
          const sessionsPerWeek = Math.ceil(program.totalSessions / program.duration);
          
          outerLoop: for (let w = newWeek; w <= program.duration; w++) {
            for (let slot = 1; slot <= sessionsPerWeek; slot++) {
              const potentialSlotStr = `Session ${(w - 1) * sessionsPerWeek + slot}`;
              if (w === newWeek && slot < parseInt(newSlotStr.replace('Session ', ''), 10)) continue;
              const isOccupied = updatedSessions.some(s => s.programId === programId && s.programWeek === w && s.sessionNumber === potentialSlotStr && s.id !== sessionId && s.id !== occupant.id);
              if (!isOccupied) {
                occupant.programWeek = w;
                occupant.sessionNumber = potentialSlotStr;
                placed = true;
                break outerLoop;
              }
            }
          }
          if (!placed) {
            occupant.programWeek = null;
            occupant.sessionNumber = 'Unassigned';
          }
        } else {
          occupant.programWeek = null;
        }
        sessionsToUpsert.push(occupant);
      }
    }

    // Unassign logic handled by initial values of movingSession if programId is null
    if (!programId) {
      movingSession.programWeek = null;
      movingSession.sessionNumber = '';
    }

    const { error } = await supabase.from('sessions').upsert(sessionsToUpsert);
    if (!error) {
      await get().initialize(); // Full sync
    }
  }

}));

// V3 Selector: Calculate Session Energy logic
export const computeSessionEnergy = (selectedGames) => {
  if (selectedGames.length === 0) return 'Neutral';
  let highCount = 0;
  let connectCount = 0;

  selectedGames.forEach(g => {
    const e = g.energyType;
    if (e === 'Quick Fire' || e === 'Interactive' || g.engagementType === 'Movement') highCount++;
    if (e === 'Deep Connect') connectCount++;
  });

  if (highCount > connectCount * 2) return 'High Energy';
  if (connectCount > highCount) return 'Deep Connection';
  return 'Balanced';
};
