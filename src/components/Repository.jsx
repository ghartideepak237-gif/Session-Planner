import React, { useState, useMemo, useEffect } from 'react';
import { Search, Shuffle, Star, Clock, Plus, ArrowRight, Zap, Users, Pencil, Trash2, Folder, FolderPlus, Edit2, ListFilter, ArrowUp, Rocket, CheckCircle2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import AddGameModal from './AddGameModal';
import ManageFoldersModal from './ManageFoldersModal';
import EditActivityModal from './EditActivityModal';

const ENERGY_COLORS = {
  'Quick Fire': '#ef9f27',
  'Interactive': '#5dcaa5',
  'Core Engagement': '#7f77dd',
  'Deep Connect': '#378add',
  'Closing': '#d85a30',
  'Nostalgia': '#d4537e'
};

const GameCard = ({ game, onAdd, onEdit, onManageFolders, index, isMobile }) => {
  const { toggleFavorite, folders } = useStore();
  const assignedFolderIds = Array.isArray(game.folder_ids) ? game.folder_ids : [];
  const isInFolder = assignedFolderIds.length > 0;
  const staggerDelay = `${index * 0.04}s`;
  const energyColor = ENERGY_COLORS[game.energyType] || '#7DD3FC';

  return (
    <motion.div
      className="premium-card-v9 card-theme-blue"
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
      style={{
        padding: isMobile ? '16px' : '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        height: '100%',
        minHeight: '280px',
        cursor: 'default'
      }}
    >
      <div className="shimmer-overlay-v9" />
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, height: '3px', 
          background: `linear-gradient(90deg, ${energyColor}, transparent)`,
          borderRadius: '20px 20px 0 0',
          zIndex: 2
        }} 
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)' }}>{game.title}</h3>
        <button
          onClick={() => toggleFavorite(game.id || game.title)}
          style={{ background: 'none', border: 'none', color: game.favorite ? 'var(--accent-gold)' : 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
        >
          <Star size={18} fill={game.favorite ? 'var(--accent-gold)' : 'none'} color={game.favorite ? 'var(--accent-gold)' : 'currentColor'} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>
        <span>{game.duration || '10m'}</span>
        <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'currentColor' }} />
        <span>{game.energyType}</span>
      </div>

      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', margin: '8px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '60px' }}>
        {game.rules || game.description}
      </p>

      {/* Footer: Folder + Category + Add */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

          <button 
            onClick={() => onManageFolders(game)}
            style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', color: isInFolder ? 'var(--accent-silver)' : 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
          >
            <Folder size={12} fill={isInFolder ? 'var(--accent-silver)' : 'none'} />
            <span style={{ borderBottom: '1px dashed currentColor' }}>Add to Folder</span>
          </button>

          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {game.interaction_types?.[0] || game.theme_clean || 'GENERAL'}
            <button
              onClick={() => onEdit(game)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '2px' }}
            >
              <Pencil size={10} />
            </button>
          </div>
        </div>

        <button
          onClick={() => onAdd(game)}
          className="ghost-add-btn"
          style={{ 
            background: 'rgba(255,255,255,0.06)', 
            border: '1px solid rgba(255,255,255,0.09)', 
            borderRadius: '5px', 
            padding: '4px 10px', 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.6)',
            fontWeight: '600',
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Add →
        </button>
      </div>
    </motion.div>
  );
};

const FilterDropdown = ({ label, options, value, onChange, type, isOpen, onToggle, isMobile }) => {
  return (
    <div style={{ position: 'relative', flexShrink: 0, minWidth: 'max-content' }}>
      <button
        onClick={onToggle}
        style={{
          background: value === 'all' || value === 'All' ? 'rgba(125, 200, 255, 0.04)' : 'rgba(125, 200, 255, 0.12)',
          border: value === 'all' || value === 'All' ? '1px solid rgba(125, 200, 255, 0.15)' : '1px solid rgba(125, 200, 255, 0.45)',
          color: value === 'all' || value === 'All' ? 'rgba(255,255,255,0.55)' : 'var(--accent-silver)',
          borderRadius: '20px',
          padding: isMobile ? '4px 10px' : '6px 13px',
          fontSize: isMobile ? '11px' : '13px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '4px' : '8px',
          transition: 'all 0.2s ease',
          minHeight: isMobile ? '32px' : 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        {value === 'all' || value === 'All' ? label : value}
        <ChevronDown size={isMobile ? 12 : 14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onToggle}
            style={{ zIndex: 1100 }}
          >
            <motion.div
              initial={isMobile ? { opacity: 0, scale: 0.9, y: 20 } : { opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={isMobile ? { opacity: 0, scale: 0.9, y: 20 } : { opacity: 0, y: 10, scale: 0.95 }}
              className="modal-content-glass"
              style={{
                width: isMobile ? '92%' : '380px',
                maxWidth: '420px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', margin: 0, color: '#FFF', fontFamily: 'var(--font-serif)' }}>Select {label}</h3>
                <button onClick={onToggle} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
                {options.map(opt => {
                  const isActive = value === opt;
                  const dotColor = type === 'energy' ? ENERGY_COLORS[opt] : null;
                  return (
                    <button
                      key={opt}
                      onClick={() => { onChange(opt); onToggle(); }}
                      className="pill-v8-new"
                      style={{
                        background: isActive ? 'rgba(125, 200, 255, 0.15)' : 'rgba(255,255,255,0.06)',
                        border: isActive ? '1px solid rgba(125, 200, 255, 0.4)' : '1px solid rgba(255,255,255,0.10)',
                        color: isActive ? 'var(--accent-silver)' : 'rgba(255,255,255,0.55)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        minHeight: '44px'
                      }}
                    >
                      {dotColor && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor }} />
                      )}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FolderAssignmentModal = ({ isOpen, onClose, activity: initialActivity, folders, toggleFolder }) => {
  const { games } = useStore();
  const activity = games.find(g => (g.id || g.title) === (initialActivity?.id || initialActivity?.title)) || initialActivity;
  if (!activity) return null;
  const assigned = Array.isArray(activity.folder_ids) ? activity.folder_ids : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
          style={{ zIndex: 3000 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal-content-glass"
            style={{
              padding: '32px',
              width: '90%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', margin: 0, fontFamily: 'var(--font-serif)' }}>Folders</h3>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>Assign "{activity.title}" to folders</p>
              </div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '50vh', overflowY: 'auto', padding: '4px' }}>
              {folders.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-inactive)', fontSize: '13px', padding: '20px' }}>No folders created yet.</p>
              )}
              {folders.map(folder => {
                const isAssigned = assigned.includes(folder.id);
                return (
                  <motion.button
                    key={folder.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => toggleFolder(activity.id, folder.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      background: isAssigned ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                      border: isAssigned ? '2px solid #3B82F6' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      transition: 'all 0.15s ease',
                      cursor: 'pointer',
                      color: isAssigned ? '#FFF' : 'rgba(255,255,255,0.6)',
                      boxShadow: isAssigned ? '0 0 0 1px rgba(59, 130, 246, 0.15)' : 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      textAlign: 'left'
                    }}
                    className="folder-row-premium"
                  >
                    {/* Left Accent Bar */}
                    {isAssigned && (
                      <motion.div 
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#3B82F6' }} 
                      />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Folder 
                        size={18} 
                        fill={isAssigned ? '#3B82F6' : 'none'} 
                        color={isAssigned ? '#3B82F6' : 'currentColor'} 
                        style={{ opacity: isAssigned ? 1 : 0.5 }}
                      />
                      <span style={{ fontWeight: isAssigned ? '700' : '500', fontSize: '14px', letterSpacing: '0.01em' }}>{folder.name}</span>
                    </div>

                    <AnimatePresence>
                      {isAssigned && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.15 }}
                        >
                          <CheckCircle2 size={18} color="#3B82F6" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            <button 
              className="btn-primary" 
              onClick={onClose}
              disabled={assigned.length === 0}
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '16px', 
                marginTop: '8px',
                opacity: assigned.length === 0 ? 0.4 : 1,
                cursor: assigned.length === 0 ? 'not-allowed' : 'pointer',
                pointerEvents: assigned.length === 0 ? 'none' : 'auto'
              }}
            >
              Done
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Repository({ scrollRef }) {
  const { games, energyTypes, folders, addFolder, renameFolder, deleteFolder, toggleGameFolder } = useStore();

  const [energyF, setEnergyF] = useState('all');
  const [categoryF, setCategoryF] = useState('All');
  const [search, setSearch] = useState('');
  const [gameToRoute, setGameToRoute] = useState(null);
  const [editingRepoGame, setEditingRepoGame] = useState(null);
  const [managingGameFolders, setManagingGameFolders] = useState(null);
  const [primaryFilter, setPrimaryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Favorites first');
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [showRocket, setShowRocket] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'energy' or 'category' or 'sort' or null

  const CATEGORIES = ['All', 'Quick Fire', 'Interactive', 'Core Engagement', 'Deep Connect', 'Closing', 'Nostalgia', 'Youth & Positivity', 'General', 'Team Building', 'Icebreaker', 'Creativity', 'Trivia', 'Fun & Engagement', 'Mindfulness', 'Problem Solving', 'Communication'];

  useEffect(() => {
    const container = scrollRef?.current;
    if (!container) return;
    const handleScroll = () => setShowRocket(container.scrollTop > 400);
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  const scrollToTop = () => {
    setIsLaunching(true);
    scrollRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLaunching(false), 1200);
  };

  const filteredGames = useMemo(() => {
    let result = games.filter(g => {
      const matchesEnergy = energyF === 'all' || g.energyType === energyF;
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
        (g.rules && g.rules.toLowerCase().includes(search.toLowerCase()));
      
      const assigned = Array.isArray(g.folder_ids) ? g.folder_ids : [];
      let matchesFolder = false;
      if (activeFolderId === 'all') {
        matchesFolder = true; // Show all games in the library view
      } else {
        matchesFolder = assigned.includes(activeFolderId);
      }

      const matchesCategory = categoryF === 'All' || (Array.isArray(g.interaction_types) && g.interaction_types.includes(categoryF)) || (g.energyType === categoryF);

      let matchesPrimary = true;
      if (primaryFilter === 'Favorites') matchesPrimary = g.favorite;
      return matchesEnergy && matchesSearch && matchesFolder && matchesPrimary && matchesCategory;
    });

    result.sort((a, b) => {
      if (sortBy === 'Alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'Newest first') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      if (sortBy === 'Oldest first') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      if (sortBy === 'Favorites first') {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
        return 0;
      }
      return 0;
    });

    if (primaryFilter === 'Recently Added') {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return result;
  }, [games, energyF, search, primaryFilter, sortBy, activeFolderId, categoryF]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`repository-v8-content ${isMobile ? 'compact-mobile' : ''}`}>
      {/* Back to Top moved to App.jsx root */}
      <style>{`
        .repository-v8-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .repository-main-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 48px;
          padding: 60px 40px;
          max-width: 1300px;
          margin: 0 auto;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .repository-content-section {
          display: flex;
          flex-direction: column;
          gap: 32px;
          width: 100%;
        }

        .repository-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 32px;
          padding: 40px 0;
          width: 100%;
        }

        .game-title-v8 {
          font-family: var(--font-serif);
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          letter-spacing: -0.2px;
          margin: 0;
        }

        .game-meta-v8 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: var(--text-muted);
          font-family: var(--font-sans);
        }

        .dot-sep-v8 {
          width: 3px; height: 3px;
          background: var(--text-muted);
          border-radius: 50%;
          opacity: 0.5;
        }

        .tag-v8 {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          padding: 3px 10px;
          border-radius: 12px;
          font-family: var(--font-sans);
        }

        .game-desc-v8 {
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 300;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 10px 0 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .fav-btn-v8 {
          width: 32px; height: 32px;
          background: rgba(255, 255, 255, 0.05);
          border: 0.5px solid var(--border-main);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s var(--smooth);
        }

        .fav-btn-v8:hover {
          background: rgba(255, 255, 255, 0.10);
          transform: scale(1.1);
          border-color: var(--text-primary);
        }

        .tool-btn-v8 {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid var(--border-soft);
          color: var(--text-muted);
          width: 30px; height: 30px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .title-v8 {
          font-family: var(--font-serif);
          font-size: 26px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.2px;
        }

        .metal-italic-gold {
          color: var(--accent-gold);
          font-style: italic;
        }

        .count-badge-v8 {
          background: rgba(125, 200, 255, 0.1);
          border: 0.5px solid var(--border-accent);
          color: var(--accent-silver);
          font-size: 12px;
          border-radius: 20px;
          padding: 4px 12px;
        }

        .v8-input {
          outline: none;
          transition: all 0.3s ease;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 13px;
        }

        .pill-v8-new:hover {
          background: rgba(255,255,255,0.09) !important;
          border-color: rgba(255,255,255,0.16) !important;
          color: rgba(255,255,255,0.8) !important;
        }

        .ghost-add-btn:hover {
          background: rgba(255,255,255,0.12) !important;
          color: #fff !important;
          border-color: rgba(255,255,255,0.2) !important;
        }

        @media (max-width: 1024px) {
          .repository-main-layout {
            grid-template-columns: 1fr;
            gap: 24px;
            padding: 40px 20px;
          }
          
          .repository-sidebar {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .repository-main-layout {
            display: flex;
            flex-direction: column;
            padding: 16px;
            gap: 16px;
            margin: 0;
            width: 100%;
          }

          .repository-content-section {
            gap: 16px;
            width: 100%;
          }

          .repository-grid {
            grid-template-columns: 1fr !important;
            gap: 16px;
            padding: 12px 0;
            width: 100%;
            overflow: hidden;
          }
        }
      `}</style>

      <AddGameModal game={gameToRoute} onClose={() => setGameToRoute(null)} />
      <EditActivityModal
        isOpen={!!editingRepoGame}
        onClose={() => setEditingRepoGame(null)}
        activity={editingRepoGame}
        mode="repository"
      />

      <main className="repository-main-layout">
        {!isMobile && (
          <aside className="repository-sidebar">
            <div className="search-container-v8">
              <Search className="search-icon-v8" size={14} />
              <input
                type="text"
                placeholder="Search assets..."
                className="v8-input-search"
                value={search || ''}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>


          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile && !isFoldersExpanded ? '0' : '12px' }}>
              <button 
                onClick={() => isMobile && setIsFoldersExpanded(!isFoldersExpanded)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: isMobile ? 'pointer' : 'default', flex: 1, textAlign: 'left', padding: isMobile ? '8px 0' : '0' }}
              >
                <h4 style={{ fontSize: '9px', color: 'var(--text-inactive)', letterSpacing: '0.15em', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>CUSTOM FOLDERS</h4>
                {isMobile && (isFoldersExpanded ? <ChevronUp size={14} color="var(--text-inactive)" /> : <ChevronDown size={14} color="var(--text-inactive)" />)}
              </button>
              <button
                onClick={() => { const name = window.prompt('Folder Name?'); if (name) addFolder(name); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer' }}
              >
                <FolderPlus size={14} />
              </button>
            </div>
            <AnimatePresence>
              {(!isMobile || isFoldersExpanded) && (
                <motion.div 
                  initial={isMobile ? { height: 0, opacity: 0 } : false}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <button
                    onClick={() => setActiveFolderId('all')}
                    className={`sidebar-link-v9 ${activeFolderId === 'all' && (primaryFilter !== 'Favorites' && primaryFilter !== 'Recently Added') ? 'active' : ''}`}
                  >
                    All Activities
                  </button>
                  {folders?.map(folder => {
                    const count = games.filter(g => Array.isArray(g.folder_ids) && g.folder_ids.includes(folder.id)).length;
                    return (
                      <button
                        key={folder.id}
                        onClick={() => {
                          setActiveFolderId(folder.id);
                          setPrimaryFilter('All');
                        }}
                        className={`sidebar-link-v9 ${activeFolderId === folder.id ? 'active' : ''}`}
                        style={{ position: 'relative' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Folder size={14} fill={activeFolderId === folder.id ? 'var(--accent-silver)' : 'none'} style={{ opacity: activeFolderId === folder.id ? 1 : 0.5 }} />
                          <span>{folder.name}</span>
                        </div>
                        <span style={{ fontSize: '10px', opacity: 0.6, fontWeight: '700' }}>{count}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>
      )}

        <section className="repository-content-section">
          {isMobile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '4px' }}>
              <div 
                className="search-container-v8" 
                style={{ 
                  margin: 0, 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px'
                }}
              >
                <Search className="search-icon-v8" size={12} />
                <input
                  type="text"
                  placeholder="Search assets..."
                  className="v8-input-search"
                  style={{ fontSize: '12px', padding: '10px 0' }}
                  value={search || ''}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                overflowX: 'auto', 
                paddingRight: '12px',
                paddingBottom: '4px',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
                flexWrap: 'nowrap'
              }}>
                <FilterDropdown 
                  label="Folder" 
                  options={['all', ...folders.map(f => f.name)]} 
                  value={activeFolderId === 'all' ? 'all' : folders.find(f => f.id === activeFolderId)?.name || 'all'} 
                  onChange={(v) => {
                    if (v === 'all') setActiveFolderId('all');
                    else {
                      const f = folders.find(f => f.name === v);
                      if (f) setActiveFolderId(f.id);
                    }
                  }}
                  type="folder"
                  isOpen={openDropdown === 'folder'}
                  onToggle={() => setOpenDropdown(openDropdown === 'folder' ? null : 'folder')}
                  isMobile={isMobile}
                />
                
                <FilterDropdown 
                  label="Energy" 
                  options={['all', ...energyTypes]} 
                  value={energyF} 
                  onChange={(v) => setEnergyF(v)}
                  type="energy"
                  isOpen={openDropdown === 'energy'}
                  onToggle={() => setOpenDropdown(openDropdown === 'energy' ? null : 'energy')}
                  isMobile={isMobile}
                />
                <FilterDropdown 
                  label="Category" 
                  options={CATEGORIES} 
                  value={categoryF} 
                  onChange={(v) => setCategoryF(v)}
                  type="category"
                  isOpen={openDropdown === 'category'}
                  onToggle={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  isMobile={isMobile}
                />
                <FilterDropdown 
                  label="Sort" 
                  options={['Favorites', 'Newest', 'Alphabetical']} 
                  value={sortBy.split(' ')[0]} 
                  onChange={(v) => {
                    if (v === 'Favorites') setSortBy('Favorites first');
                    else if (v === 'Newest') setSortBy('Newest first');
                    else setSortBy('Alphabetical');
                  }}
                  type="sort"
                  isOpen={openDropdown === 'sort'}
                  onToggle={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                  isMobile={isMobile}
                />
              </div>
            </div>
          )}
          {!isMobile && (
            <div className="repository-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 className="title-v8">Games Library</h2>
                <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2px 9px', fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>
                  {filteredGames.length}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <FilterDropdown 
                  label="Energy" 
                  options={['all', ...energyTypes]} 
                  value={energyF} 
                  onChange={(v) => setEnergyF(v)}
                  type="energy"
                  isOpen={openDropdown === 'energy'}
                  onToggle={() => setOpenDropdown(openDropdown === 'energy' ? null : 'energy')}
                  isMobile={isMobile}
                />
                <FilterDropdown 
                  label="Category" 
                  options={CATEGORIES} 
                  value={categoryF} 
                  onChange={(v) => setCategoryF(v)}
                  type="category"
                  isOpen={openDropdown === 'category'}
                  onToggle={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                  isMobile={isMobile}
                />

                <FilterDropdown 
                  label="Sort" 
                  options={['Favorites first', 'Newest first', 'Oldest first', 'Alphabetical']} 
                  value={sortBy} 
                  onChange={(v) => setSortBy(v)}
                  type="sort"
                  isOpen={openDropdown === 'sort'}
                  onToggle={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                  isMobile={isMobile}
                />
              </div>
            </div>
          )}



          <div className="repository-grid">
            {filteredGames.map((game, i) => (
              <GameCard
                key={`${game.id || game.title}-${i}`}
                index={i}
                game={{
                  ...game,
                  activeFolderContext: activeFolderId !== 'all' ? activeFolderId : null
                }}
                onAdd={setGameToRoute}
                onEdit={setEditingRepoGame}
                onManageFolders={setManagingGameFolders}
                isMobile={isMobile}
              />
            ))}
          </div>
        </section>

      <AddGameModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <FolderAssignmentModal 
        isOpen={!!managingGameFolders} 
        onClose={() => setManagingGameFolders(null)} 
        activity={managingGameFolders}
        folders={folders}
        toggleFolder={toggleGameFolder}
      />
        </main>
    </div>
    );
  }
