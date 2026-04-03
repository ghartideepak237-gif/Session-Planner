import React, { useState, useMemo, useEffect } from 'react';
import { Search, Shuffle, Star, Clock, Plus, ArrowRight, Zap, Users, Pencil, Trash2, Folder, FolderPlus, Edit2, ListFilter, Rocket, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import AddGameModal from './AddGameModal';
import ManageFoldersModal from './ManageFoldersModal';
import EditActivityModal from './EditActivityModal';

const GameCard = ({ game, onAdd, onEdit, index }) => {
  const { toggleFavorite, folders, toggleActivityInFolder } = useStore();
  const [isPickingFolder, setIsPickingFolder] = useState(false);

  const assignedFolderIds = Array.isArray(game.folder_ids) ? game.folder_ids : [];
  const isInFolder = assignedFolderIds.length > 0;
  const staggerDelay = `${index * 0.06}s`;

  return (
    <div 
      className="game-card-v8"
      style={{
        animation: `fadeInUp 0.6s var(--spring-bounce) ${staggerDelay} forwards`,
        opacity: 0,
        padding: '20px'
      }}
    >
      <div className="shimmer-overlay-v8" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
        <h3 className="game-title-v8" style={{ fontSize: '16px' }}>{game.title}</h3>
        <button 
          onClick={() => toggleFavorite(game.id || game.title)} 
          className="fav-btn-v8"
        >
          <Star size={13} fill={game.favorite ? 'var(--accent-gold)' : 'none'} color={game.favorite ? 'var(--accent-gold)' : 'var(--text-primary)'} strokeWidth={2.5} />
        </button>
      </div>

      <div className="game-meta-v8" style={{ position: 'relative', zIndex: 2, marginTop: '8px' }}>
        <span>{game.duration || 'Flexible'}</span>
        <span className="dot-sep-v8" />
        <span>{game.energyType}</span>
      </div>

      <p className="game-desc-v8" style={{ position: 'relative', zIndex: 2, marginTop: '12px', fontSize: '13px', lineHeight: '1.5', height: '60px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
        {game.rules || game.description}
      </p>

      {/* Footer: Folder + Category + Add */}
      <div className="game-footer-v8" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '0.5px solid var(--border-soft)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                onClick={() => setIsPickingFolder(!isPickingFolder)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: isInFolder ? 'var(--accent-silver)' : 'var(--text-muted)', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: 0,
                  opacity: isInFolder ? 0.9 : 0.6,
                  transition: 'all 0.2s ease'
                }}
              >
                <Folder size={12} fill={isInFolder ? 'var(--accent-silver)' : 'none'} />
                <span style={{ fontSize: '11px' }}>
                  {isPickingFolder ? 'Select folder...' : isInFolder ? 'In Library' : 'Add to folder'}
                </span>
              </button>
              
              {isPickingFolder && (
                <div style={{ 
                  position: 'absolute', bottom: '100%', left: 0, marginBottom: '8px', 
                  background: 'var(--bg-secondary)', border: '0.5px solid var(--border-main)', 
                  borderRadius: '12px', padding: '6px', zIndex: 1000, minWidth: '160px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(20px)'
                }}>
                  <div style={{ padding: '4px 8px 8px', fontSize: '10px', color: 'var(--text-dim)', borderBottom: '0.5px solid var(--border-soft)', marginBottom: '4px' }}>
                    ASSIGN TO FOLDER
                  </div>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {folders.map(f => {
                      const isActivityInThisFolder = assignedFolderIds.includes(f.id);
                      return (
                        <button 
                          key={f.id}
                          onClick={() => {
                            toggleActivityInFolder(game.id, f.id);
                            // Keep menu open for multi-assignment
                          }}
                          style={{ 
                            width: '100%', textAlign: 'left', padding: '8px 10px', background: isActivityInThisFolder ? 'rgba(125, 211, 252, 0.05)' : 'none', 
                            border: 'none', color: isActivityInThisFolder ? 'var(--accent-silver)' : 'var(--text-secondary)', fontSize: '11px', cursor: 'pointer',
                            borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            marginBottom: '2px'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = isActivityInThisFolder ? 'rgba(125, 211, 252, 0.05)' : 'none'}
                        >
                          <span>{f.name}</span>
                          {isActivityInThisFolder && <CheckCircle2 size={10} color="var(--accent-silver)" />}
                        </button>
                      );
                    })}
                  </div>
                  {folders.length === 0 && (
                    <div style={{ padding: '8px 10px', fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center' }}>No folders created</div>
                  )}
                  <button 
                    onClick={() => setIsPickingFolder(false)}
                    style={{ width: '100%', marginTop: '4px', padding: '6px', fontSize: '10px', background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--border-soft)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          <div style={{ fontSize: '10px', color: 'var(--text-inactive)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {game.interaction_types?.[0] || 'GENERAL'} 
            <button 
              onClick={() => onEdit(game)}
              style={{ background: 'none', border: 'none', color: 'var(--text-inactive)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
            >
              <Pencil size={10} style={{ opacity: 0.6 }} />
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => onAdd(game)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', transition: 'transform 0.2s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
        >
          Add <ArrowRight size={14} style={{ color: '#F97316' }} />
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
  const [showRocket] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);

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
  }, [games, energyF, search, primaryFilter, sortBy, activeFolderId]);

  return (
    <div className="page-wrapper v8-theme">
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
          padding: 20px;
          overflow: hidden;
          position: relative;
          transition: transform 0.4s var(--spring-bounce), box-shadow 0.3s ease, background 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .game-card-v8::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-main), transparent);
          z-index: 1;
        }

        .shimmer-overlay-v8 {
          position: absolute;
          top: -100%;
          left: -100%;
          width: 80%;
          height: 300%;
          background: linear-gradient(110deg, transparent, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }

        .game-card-v8:hover {
          transform: translateY(-6px) rotateX(4deg) rotateY(-2deg) scale(1.02);
          box-shadow: 0 25px 70px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.10);
          border-color: var(--border-accent);
          background: linear-gradient(145deg, #11161C, #0C1015);
        }

        .game-card-v8:hover .shimmer-overlay-v8 {
          opacity: 1;
          animation: shimmerSweepV8 0.5s ease forwards;
        }

        @keyframes shimmerSweepV8 {
          0% { left: -100%; opacity: 0; }
          40% { opacity: 1; }
          60% { opacity: 1; }
          100% { left: 150%; opacity: 0; }
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
      
      <main className="container-max" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', padding: '60px 20px', position: 'relative', zIndex: 10 }}>
        
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div className="search-container-v8">
            <Search className="search-icon-v8" size={16} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="v8-input-search"
              value={search || ''}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '10px', color: 'var(--text-inactive)', letterSpacing: '0.15em', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>VIEWS</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['All', 'Favorites', 'Recently Added'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => {
                    setPrimaryFilter(filter);
                    setActiveFolderId('all');
                  }}
                  className={`sidebar-link-v9 ${primaryFilter === filter ? 'active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '10px', color: 'var(--text-inactive)', letterSpacing: '0.15em', fontWeight: '700', textTransform: 'uppercase', margin: 0 }}>CUSTOM FOLDERS</h4>
              <button 
                onClick={() => { const name = window.prompt('Folder Name?'); if(name) addFolder(name); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer' }}
              >
                <FolderPlus size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            </div>
          </div>
        </aside>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <h2 className="title-v8">Games Library</h2>
              <span style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: '500' }}>{filteredGames.length}</span>
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

          <div className="filters-grid-v8" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-inactive)', width: '60px' }}>ENERGY</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button onClick={() => setEnergyF('all')} className={`pill-v8 ${energyF === 'all' ? 'active' : ''}`}>All</button>
                {energyTypes.map(t => (
                  <button key={t} onClick={() => setEnergyF(t)} className={`pill-v8 ${energyF === t ? 'active' : ''}`}>{t}</button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

          <div className="game-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
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
      </main>
    </div>
  );
}
