import { create } from 'zustand';
import { GAMES } from './gamesData';
import { v4 as uuidv4 } from 'uuid';

const ENERGY_TYPES = ['Quick Fire', 'Interactive', 'Core Engagement', 'Deep Connect', 'Closing'];
const ENGAGEMENT_TYPES = ['Talking', 'Movement', 'Thinking', 'Laughing', 'Storytelling', 'Team interaction'];
const FLOW_POSITIONS = ['Opening', 'Warm up', 'Core', 'Energy Boost', 'Closing'];

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
    // Removed difficulty via strict extraction if needed, but leaving it harmlessly attached is ok
  };
};

const initializedGames = GAMES.map(mapLegacyToNewFields);

export const useStore = create((set, get) => ({
  activeTab: 'repository',
  games: initializedGames,
  categories: [...new Set(GAMES.map(g => g.theme_clean))], // Legacy categories
  sessions: [],
  programs: [],
  activeProgramId: null,
  
  // V3 Options
  energyTypes: ENERGY_TYPES,
  engagementTypes: ENGAGEMENT_TYPES,
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

  // Actions - Games
  addGame: (game) => set((state) => ({ 
    games: [...state.games, { ...game, id: uuidv4(), baseDurationNum: parseDuration(game.duration) }] 
  })),
  toggleFavorite: (gameTitle) => set((state) => ({
    games: state.games.map(g => g.title === gameTitle ? { ...g, favorite: !g.favorite } : g)
  })),
  duplicateGame: (game) => set((state) => ({
    games: [...state.games, { ...game, title: `${game.title} (Copy)`, id: uuidv4() }]
  })),

  // Actions - Builder
  setBuilderField: (field, value) => set((state) => ({
    builder: { ...state.builder, [field]: value }
  })),
  addGameToSession: (game) => set((state) => {
    // V3: Initialize flow defaults based on order or hard defaults
    const currentLen = state.builder.selectedGames.length;
    let newFlowPos = 'Core';
    if (currentLen === 0) newFlowPos = 'Opening';
    if (currentLen === 1) newFlowPos = 'Warm up';
    
    return {
      builder: { 
        ...state.builder, 
        selectedGames: [
          ...state.builder.selectedGames, 
          { 
            ...game, 
            instanceId: uuidv4(),
            actualDuration: game.baseDurationNum, // starts as base
            flowPosition: newFlowPos
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
  
  // V3 Dynamics Timeline Actions
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

  // Actions - Sessions
  saveSession: () => set((state) => {
    const totalActual = state.builder.selectedGames.reduce((acc, g) => acc + g.actualDuration, 0);
    const newSession = { 
      ...state.builder, 
      date: new Date().toISOString(),
      createdAt: state.builder.createdAt || Date.now(),
      totalActualDuration: totalActual
    };
    
    const existingIndex = state.sessions.findIndex(s => s.id === newSession.id);
    const updatedSessions = [...state.sessions];
    
    if (existingIndex >= 0) {
      updatedSessions[existingIndex] = newSession;
    } else {
      updatedSessions.push(newSession);
    }

    return {
      sessions: updatedSessions,
      builder: {
        ...newSession, // Stay on the saved session
      }
    };
  }),

  deleteSession: (sessionId) => set((state) => ({
    sessions: state.sessions.filter(s => s.id !== sessionId)
  })),
  duplicateSession: (session) => set((state) => ({
    sessions: [...state.sessions, { ...session, id: uuidv4(), date: new Date().toISOString(), college: `${session.college} (Copy)` }]
  })),
  loadSessionToBuilder: (sessionId) => set((state) => {
    const sessionToLoad = state.sessions.find(s => s.id === sessionId);
    if (sessionToLoad) {
      return { builder: { ...sessionToLoad, id: uuidv4() } }; 
    }
    return state;
  }),
  saveSessionReflection: (sessionId, reflectionObj) => set((state) => ({
    sessions: state.sessions.map(s => 
      s.id === sessionId 
        ? { ...s, reflection: reflectionObj }
        : s
    )
  })),

  // Actions - Programs
  addProgram: (programData) => set((state) => {
    const programId = uuidv4();
    const { name, college, duration, totalSessions, objective, weeks } = programData;
    
    const newProgram = {
      id: programId,
      name, college, duration, totalSessions, objective, weeks, date: new Date().toISOString()
    };
    
    // Auto-scaffold empty sessions
    const newSessions = [];
    const sessionsPerWeek = Math.ceil(totalSessions / duration);
    
    let currentWeek = 1;
    let weekSessionCount = 0;

    for (let i = 1; i <= totalSessions; i++) {
       const weekData = weeks.find(w => w.week === currentWeek) || { theme: 'General', focus: 'General' };
       
       newSessions.push({
         id: uuidv4(),
         programId: programId,
         programWeek: currentWeek,
         programTheme: weekData.theme,
         programFocus: weekData.focus,
         college: college,
         sessionNumber: `Session ${i}`,
         targetGroup: '',
         objective: objective,
         baseDuration: 45,
         selectedGames: [],
         notes: '',
         totalActualDuration: 0
       });

       weekSessionCount++;
       if (weekSessionCount >= sessionsPerWeek && currentWeek < duration) {
          currentWeek++;
          weekSessionCount = 0;
       }
    }

    return {
      programs: [...state.programs, newProgram],
      sessions: [...state.sessions, ...newSessions]
    };
  }),

  deleteProgram: (programId) => set((state) => ({
    programs: state.programs.filter(p => p.id !== programId),
    sessions: state.sessions.filter(s => s.programId !== programId)
  })),

  // Phase 8: Smart Slot Assignment
  assignSessionToProgram: (sessionId, programId, week, slotStr) => set((state) => {
    // Determine the new properties
    const newWeek = week ? parseInt(week, 10) : null;
    const newSlotStr = slotStr;

    const programSessions = state.sessions.filter(s => s.programId === programId);
    let updatedSessions = [...state.sessions];
    
    // Find the session we are moving
    const movingSessionIndex = updatedSessions.findIndex(s => s.id === sessionId);
    if (movingSessionIndex === -1) return state;

    const movingSession = { ...updatedSessions[movingSessionIndex], programId, programWeek: newWeek, sessionNumber: newSlotStr };

    // If unassigning, just clear out properties
    if (!programId) {
      movingSession.programId = null;
      movingSession.programWeek = null;
      movingSession.sessionNumber = '';
      updatedSessions[movingSessionIndex] = movingSession;
      return { sessions: updatedSessions, builder: state.builder.id === sessionId ? movingSession : state.builder };
    }

    // Unassigned Pool Target
    if (newWeek === null || !newSlotStr) {
      movingSession.programWeek = null;
      movingSession.sessionNumber = '';
      updatedSessions[movingSessionIndex] = movingSession;
      return { sessions: updatedSessions, builder: state.builder.id === sessionId ? movingSession : state.builder };
    }

    // Displacement Logic
    // Check if slot currently occupied by another session
    const occupantIndex = updatedSessions.findIndex(s => s.programId === programId && s.programWeek === newWeek && s.sessionNumber === newSlotStr && s.id !== sessionId);

    if (occupantIndex >= 0) {
      // Slot Occupied: We need to bump the occupant forward.
      const occupant = { ...updatedSessions[occupantIndex] };
      
      // We will place movingSession in the target spot first
      updatedSessions[movingSessionIndex] = movingSession;

      // Now we find the next empty slot for occupant
      const program = state.programs.find(p => p.id === programId);
      if (program) {
        let placed = false;
        
        // Let's look forward week by week, and session by session
        const sessionsPerWeek = Math.ceil(program.totalSessions / program.duration);
        
        outerLoop: for (let w = newWeek; w <= program.duration; w++) {
          for (let slot = 1; slot <= sessionsPerWeek; slot++) {
            const potentialSlotStr = `Session ${(w - 1) * sessionsPerWeek + slot}`;
            // If checking the initial week, skip slots before the target slot
            if (w === newWeek && slot < parseInt(newSlotStr.replace('Session ', ''), 10)) continue;
            
            // Is this potential slot empty?
            const isOccupied = updatedSessions.some(s => s.programId === programId && s.programWeek === w && s.sessionNumber === potentialSlotStr);
            if (!isOccupied) {
              occupant.programWeek = w;
              occupant.sessionNumber = potentialSlotStr;
              placed = true;
              break outerLoop;
            }
          }
        }

        if (!placed) {
          // No empty slots remaining in the program
          occupant.programWeek = null;
          occupant.sessionNumber = 'Unassigned';
        }
      } else {
        occupant.programWeek = null;
      }
      
      updatedSessions[occupantIndex] = occupant;

    } else {
      updatedSessions[movingSessionIndex] = movingSession;
    }

    // Sync builder if it's currently open
    let newBuilder = state.builder;
    if (state.builder.id === sessionId) {
      newBuilder = { ...movingSession };
    }

    return { sessions: updatedSessions, builder: newBuilder };
  })

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
