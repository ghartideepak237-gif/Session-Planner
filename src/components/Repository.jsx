import React, { useState, useMemo, useEffect } from 'react';
import { Search, Shuffle, Star, Clock, Plus, ArrowRight, Zap, Users, Pencil, Trash2, Folder, FolderPlus, Edit2, ListFilter } from 'lucide-react';
import { useStore } from '../store';
import AddGameModal from './AddGameModal';
import ManageFoldersModal from './ManageFoldersModal';
import EditActivityModal from './EditActivityModal';

const GameCard = ({ game, onAdd, onEdit, index }) => {
  const { toggleFavorite, deleteActivity } = useStore();

  const isInFolder = Array.isArray(game.folder_ids) && game.folder_ids.length > 0;

  // Stagger calculation
  const staggerDelay = `${index * 0.06}s`;

  return (
    <div 
      className="game-card-v8"
      style={{
        animation: `fadeInUp 0.6s var(--spring-bounce) ${staggerDelay} forwards`,
        opacity: 0
      }}
    >
      <div className="shimmer-overlay-v8" />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
        <h3 className="game-title-v8">{game.title}</h3>
        <button 
          onClick={() => toggleFavorite(game.id || game.title)} 
          className="fav-btn-v8"
        >
          <Star size={13} fill={game.favorite ? 'var(--accent-gold)' : 'none'} color={game.favorite ? 'var(--accent-gold)' : 'var(--text-primary)'} strokeWidth={2.5} />
        </button>
      </div>

      <div className="game-meta-v8" style={{ position: 'relative', zIndex: 2 }}>
        <span>{game.duration || 'Flexible'}</span>
        <span className="dot-sep-v8" />
        <span>{game.energyType}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px', position: 'relative', zIndex: 2 }}>
        {(game.interaction_types || []).map(tag => {
          let tagStyle = { background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', border: '0.5px solid var(--border-soft)' };
          if (tag.toLowerCase().includes('interactive')) tagStyle = { background: 'rgba(234, 179, 8, 0.10)', color: '#EAB308', border: '0.5px solid rgba(234, 179, 8, 0.2)' };
          if (tag.toLowerCase().includes('team')) tagStyle = { background: 'rgba(99, 179, 237, 0.10)', color: '#63B3ED', border: '0.5px solid rgba(99, 179, 237, 0.2)' };
          if (tag.toLowerCase().includes('quick')) tagStyle = { background: 'rgba(104, 211, 145, 0.10)', color: '#68D391', border: '0.5px solid rgba(104, 211, 145, 0.2)' };
          if (tag.toLowerCase().includes('deep')) tagStyle = { background: 'rgba(237, 100, 166, 0.10)', color: '#ED64A6', border: '0.5px solid rgba(237, 100, 166, 0.2)' };

          return (
            <span key={tag} className="tag-v8" style={tagStyle}>
              {tag}
            </span>
          );
        })}
      </div>

      <p className="game-desc-v8" style={{ position: 'relative', zIndex: 2 }}>
        {game.rules || game.description}
      </p>

      <div className="game-footer-v8" style={{ position: 'relative', zIndex: 2 }}>
        <button 
          onClick={() => onAdd(game)}
          className="add-btn-v8"
        >
          Add Activity <ArrowRight size={12} className="arrow-icon-v8" />
        </button>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onEdit(game)} className="tool-btn-v8"><Pencil size={13} /></button>
          <button 
            onClick={() => window.confirm(`Delete "${game.title}"?`) && deleteActivity(game.id)} 
            className="tool-btn-v8 delete-v8"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Repository() {
  const { games, energyTypes, folders, addFolder, renameFolder, deleteFolder } = useStore();
  
  const [energyF, setEnergyF] = useState('all');
  const [search, setSearch] = useState('');
  const [gameToRoute, setGameToRoute] = useState(null);
  const [editingRepoGame, setEditingRepoGame] = useState(null);
  const [primaryFilter, setPrimaryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Favorites first');
  const [activeFolderId, setActiveFolderId] = useState('all');

  const filteredGames = useMemo(() => {
    let result = games.filter(g => {
      const matchesEnergy = energyF === 'all' || g.energyType === energyF;
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || 
                           (g.rules && g.rules.toLowerCase().includes(search.toLowerCase()));
      const matchesFolder = activeFolderId === 'all' || (Array.isArray(g.folder_ids) && g.folder_ids.includes(activeFolderId));
      let matchesPrimary = true;
      if (primaryFilter === 'Favorites') matchesPrimary = g.favorite;
      return matchesEnergy && matchesSearch && matchesFolder && matchesPrimary;
    });

    if (primaryFilter === 'Recently Added') {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else {
      result.sort((a, b) => {
        if (sortBy === 'Alphabetical') return a.title.localeCompare(b.title);
        if (sortBy === 'Newest first') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        if (sortBy === 'Favorites first') {
          if (a.favorite && !b.favorite) return -1;
          if (!a.favorite && b.favorite) return 1;
          return 0;
        }
        return 0;
      });
    }
    return result;
  }, [games, energyF, search, primaryFilter, sortBy, activeFolderId]);

  return (
    <div className="page-wrapper v8-theme">
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
      
      <main className="container-max" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '56px', padding: '60px 0', position: 'relative', zIndex: 10 }}>
        
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div className="search-container-v8" style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '16px', top: '12px', color: 'var(--text-muted)' }} size={14} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="v8-input"
              style={{ width: '100%', height: '40px', paddingLeft: '44px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '0.5px solid var(--border-soft)' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div>
            <h4 style={{ fontSize: '10px', color: 'var(--text-inactive)', letterSpacing: '0.15em', marginBottom: '16px', fontWeight: '700', textTransform: 'uppercase' }}>COLLECTIONS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['All', 'Favorites', 'Recently Added'].map(filter => (
                <button 
                  key={filter}
                  onClick={() => setPrimaryFilter(filter)}
                  className={`pill-v8 ${primaryFilter === filter ? 'active' : ''}`}
                  style={{ textAlign: 'left' }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 className="title-v8">
                Activity <span className="metal-italic-gold">Library</span>
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '400px' }}>Premium structural facilitators for elite sessions</p>
            </div>
            <div className="count-badge-v8">
              {filteredGames.length} Assets
            </div>
          </div>

          <div className="filters-section-v8" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button 
              onClick={() => setEnergyF('all')} 
              className={`pill-v8 ${energyF === 'all' ? 'active' : ''}`}
            >
              All Energies
            </button>
            {energyTypes.map(t => (
              <button key={t} onClick={() => setEnergyF(t)} className={`pill-v8 ${energyF === t ? 'active' : ''}`}>
                {t}
              </button>
            ))}
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
