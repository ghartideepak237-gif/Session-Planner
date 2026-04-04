import React, { useState, useMemo, useEffect } from 'react';
import { Search, Shuffle, Star, Clock, Plus, ArrowRight, Zap, Users, Pencil, Trash2, Folder, FolderPlus, Edit2, ListFilter, Rocket, CheckCircle2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import AddGameModal from './AddGameModal';
import ManageFoldersModal from './ManageFoldersModal';
import EditActivityModal from './EditActivityModal';

const GameCard = ({ game, onAdd, onEdit, index }) => {
  const { toggleFavorite, folders } = useStore();
  const assignedFolderIds = Array.isArray(game.folder_ids) ? game.folder_ids : [];
  const isInFolder = assignedFolderIds.length > 0;
  const staggerDelay = `${index * 0.04}s`;

  return (
    <div
      className="game-card-v8"
      style={{
        animation: `fadeInUp 0.6s var(--spring-bounce) ${staggerDelay} forwards`,
        opacity: 0,
        padding: '24px',
        background: 'rgba(12, 16, 20, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative'
      }}
    >
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '16px', borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isInFolder ? 'var(--accent-silver)' : 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: '700' }}>
            <Folder size={12} fill={isInFolder ? 'var(--accent-silver)' : 'none'} />
            <span>{isInFolder ? 'In Library' : 'Add to Folder'}</span>
          </div>

          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
          style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
        >
          Add <ArrowRight size={16} strokeWidth={3} style={{ color: '#F97316' }} />
        </button>
      </div>
    </div>
  );
};

export default function Repository() {
  const { games, energyTypes, folders, addFolder, renameFolder, deleteFolder } = useStore();

  const [energyF, setEnergyF] = useState('all');
  const [categoryF, setCategoryF] = useState('All');
  const [search, setSearch] = useState('');
  const [gameToRoute, setGameToRoute] = useState(null);
  const [editingRepoGame, setEditingRepoGame] = useState(null);
  const [primaryFilter, setPrimaryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Favorites first');
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [showRocket, setShowRocket] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowRocket(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLaunching(false), 1200);
  };

  const filteredGames = useMemo(() => {
    let result = games.filter(g => {
      const matchesEnergy = energyF === 'all' || g.energyType === energyF;
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) ||
        (g.rules && g.rules.toLowerCase().includes(search.toLowerCase()));
      const matchesFolder = activeFolderId === 'all' || (Array.isArray(g.folder_ids) && g.folder_ids.includes(activeFolderId));
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
    <div className={`page-wrapper v8-theme ${isMobile ? 'compact-mobile' : ''}`}>
      <AnimatePresence>
        {showRocket && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={scrollToTop}
            className={`rocket-btn ${isLaunching ? 'rocket-animate' : ''}`}
          >
            <Rocket size={24} style={{ transform: 'rotate(-45deg)' }} />
          </motion.button>
        )}
      </AnimatePresence>
      <style>{`
        .game-card-v8 {
          background: var(--card-grad);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 0.5px solid var(--border-main);
          border-radius: 20px;
          padding: 24px;
          overflow: hidden;
          position: relative;
          transition: transform 0.4s var(--spring-bounce), box-shadow 0.3s ease, border-color 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .shimmer-overlay-v8 {
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.08) 30%, 
            rgba(255, 255, 255, 0.18) 50%, 
            rgba(255, 255, 255, 0.08) 70%, 
            transparent
          );
          transform: skewX(-25deg);
          pointer-events: none;
          z-index: 5;
        }

        .game-card-v8:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
          border-color: rgba(255, 255, 255, 0.4);
        }

        .game-card-v8:hover .shimmer-overlay-v8 {
          animation: silverSweep 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes silverSweep {
          0% { left: -150%; }
          100% { left: 150%; }
        }

        .repository-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 32px;
          padding: 40px 0;
        }

        @media (max-width: 768px) {
          .repository-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px 0;
          }
          .game-card-v8 {
            padding: 20px;
          }
          .repository-main-layout {
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
            padding: 16px 12px !important;
          }
          .repository-header-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .filter-row-v8 {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
          .filter-row-v8 span {
            width: auto !important;
            font-size: 9px !important;
          }
          .title-v8 {
            font-size: 20px !important;
          }
          .game-card-v8 {
            padding: 16px !important;
            gap: 12px !important;
          }
          .game-title-v8 {
            font-size: 15px !important;
          }
          .game-desc-v8 {
            font-size: 11px !important;
            height: 52px !important;
          }
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

        .add-btn-v8 {
          background: rgba(255, 255, 255, 0.05);
          border: 0.5px solid rgba(255, 255, 255, 0.15);
          color: var(--text-primary);
          font-size: 11px;
          font-weight: 500;
          padding: 8px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.25s var(--spring-bounce);
          font-family: var(--font-sans);
          position: relative;
          overflow: hidden;
        }

        .add-btn-v8:hover {
          background: linear-gradient(120deg, rgba(255,255,255,0.05), rgba(255,255,255,0.15), rgba(255,255,255,0.05));
          border-color: rgba(255,255,255,0.25);
          box-shadow: 0 15px 40px rgba(0,0,0,.6);
        }

        .add-btn-v8::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: all 0.5s ease;
        }

        .add-btn-v8:hover::after {
          left: 100%;
        }

        .add-btn-v8:hover .arrow-icon-v8 {
          transform: translateX(2px);
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

        .tool-btn-v8:hover { background: rgba(255,255,255,0.12); color: var(--text-primary); border-color: var(--border-accent); }
        .tool-btn-v8.delete-v8:hover { border-color: var(--danger); color: var(--danger); }

        .game-footer-v8 {
          margin-top: auto;
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 0.5px solid var(--border-soft);
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

        .v8-input:focus {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: var(--border-accent) !important;
        }
      `}</style>

      <AddGameModal game={gameToRoute} onClose={() => setGameToRoute(null)} />
      <EditActivityModal
        isOpen={!!editingRepoGame}
        onClose={() => setEditingRepoGame(null)}
        activity={editingRepoGame}
        mode="repository"
      />

      <main className="container-max repository-main-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', padding: '60px 20px', position: 'relative', zIndex: 10 }}>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '40px' }}>
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

          {isMobile && (
            <div style={{ marginTop: '12px' }}>
              <button 
                onClick={() => setIsFiltersModalOpen(true)}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '11px', borderRadius: '10px', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)' }}
              >
                <ListFilter size={12} />
                <span>Adjust Filters & Categories</span>
              </button>
            </div>
          )}

          <div style={{ marginTop: isMobile ? '8px' : '32px' }}>
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

        <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="repository-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <h2 className="title-v8">Games Library</h2>
              <span style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: '500' }}>{filteredGames.length}</span>
              <button
                onClick={() => { if (confirm("Run bulk categorization? This will update interaction_types in Supabase for all games.")) runBulkCategoryUpdate(); }}
                style={{ opacity: 0.2, background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '10px', marginLeft: '20px' }}
              >
                Sync Categories
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <ListFilter size={14} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="force-sort-padding"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '0.5px solid var(--border-soft)',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Favorites first">Favorites first</option>
                  <option value="Newest first">Newest first</option>
                  <option value="Oldest first">Oldest first</option>
                  <option value="Alphabetical">Alphabetical</option>
                </select>
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="filters-grid-v8" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="filter-row-v8" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-inactive)', width: '60px' }}>ENERGY</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button onClick={() => setEnergyF('all')} className={`pill-v8 ${energyF === 'all' ? 'active' : ''}`}>All</button>
                  {energyTypes.map(t => (
                    <button key={t} onClick={() => setEnergyF(t)} className={`pill-v8 ${energyF === t ? 'active' : ''}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="filter-row-v8" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-inactive)', width: '60px' }}>CATEGORY</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    onClick={() => setCategoryF('All')}
                    className={`pill-v8 ${categoryF === 'All' ? 'active' : ''}`}
                  >
                    All
                  </button>
                  {['Quick Fire', 'Interactive', 'Core Engagement', 'Deep Connect', 'Closing', 'Nostalgia', 'Youth & Positivity', 'General', 'Team Building', 'Icebreaker', 'Creativity', 'Trivia', 'Fun & Engagement', 'Mindfulness', 'Problem Solving', 'Communication'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryF(cat)}
                      className={`pill-v8 ${categoryF === cat ? 'active' : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
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
              />
            ))}
          </div>
        </section>
      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isFiltersModalOpen && (
          <div className="modal-overlay" style={{ zIndex: 3000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)' }}>
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="premium-card-v9" 
              style={{ 
                width: '100%', 
                maxHeight: '85vh', 
                position: 'fixed', 
                bottom: 0, 
                left: 0, 
                borderRadius: '24px 24px 0 0',
                padding: '32px 24px 48px',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              <div className="shimmer-overlay-v9" style={{ opacity: 0.1 }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--font-serif)', margin: 0 }}>Filter Architecture</h3>
                  <button onClick={() => setIsFiltersModalOpen(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#FFF', borderRadius: '50%', padding: '8px' }}>
                    <X size={20} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto', maxHeight: '60vh', paddingRight: '4px' }}>
                  <div className="filter-row-v8">
                    <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '12px' }}>ENERGY LEVELS</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <button onClick={() => setEnergyF('all')} className={`pill-v8 ${energyF === 'all' ? 'active' : ''}`} style={{ padding: '10px 18px', fontSize: '12px' }}>All</button>
                      {energyTypes.map(t => (
                        <button key={t} onClick={() => setEnergyF(t)} className={`pill-v8 ${energyF === t ? 'active' : ''}`} style={{ padding: '10px 18px', fontSize: '12px' }}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <div className="filter-row-v8">
                    <span style={{ fontSize: '10px', fontWeight: '900', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'block', marginBottom: '12px' }}>CATEGORY</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <button
                        onClick={() => setCategoryF('All')}
                        className={`pill-v8 ${categoryF === 'All' ? 'active' : ''}`}
                        style={{ padding: '10px 18px', fontSize: '12px' }}
                      >
                        All
                      </button>
                      {['Quick Fire', 'Interactive', 'Core Engagement', 'Deep Connect', 'Closing', 'Nostalgia', 'Youth & Positivity', 'General', 'Team Building', 'Icebreaker', 'Creativity', 'Trivia', 'Fun & Engagement', 'Mindfulness', 'Problem Solving', 'Communication'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setCategoryF(cat)}
                          className={`pill-v8 ${categoryF === cat ? 'active' : ''}`}
                          style={{ padding: '10px 18px', fontSize: '12px' }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  className="btn-primary" 
                  onClick={() => setIsFiltersModalOpen(false)}
                  style={{ width: '100%', marginTop: '32px', justifyContent: 'center', padding: '16px' }}
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AddGameModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </main>
      </div>
    );
  }
