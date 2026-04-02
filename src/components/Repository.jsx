import React, { useState, useMemo } from 'react';
import { Search, Shuffle, Star, Clock, Plus, ArrowRight, Zap, Users, Pencil, Trash2, Folder, FolderPlus, Edit2, ListFilter } from 'lucide-react';
import { useStore } from '../store';
import AddGameModal from './AddGameModal';
import ManageFoldersModal from './ManageFoldersModal';

const GameCard = ({ game, onAdd }) => {
  const { toggleFavorite, updateGame, categories, folders, toggleActivityInFolder, deleteActivity, activeTab } = useStore();
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const handleCategoryChange = (newCategory) => {
    updateGame(game.id || game.title, { theme_clean: newCategory });
    setIsEditingCategory(false);
  };

  const isInFolder = Array.isArray(game.folder_ids) && game.folder_ids.length > 0;

  return (
    <div className="game-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 className="game-title">{game.title}</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => toggleFavorite(game.id || game.title)} title="Mark as go-to activity" style={{ background: 'none', border: 'none', cursor: 'pointer', color: game.favorite ? 'var(--accent)' : 'var(--text-dim)' }}>
            <Star size={16} fill={game.favorite ? 'var(--accent)' : 'none'} />
          </button>
          <button 
            onClick={() => onEdit(game)}
            title="Edit master activity" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
          >
            <Pencil size={15} />
          </button>
          <button 
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
                deleteActivity(game.id);
              }
            }} 
            title="Delete activity" 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', transition: 'color 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="game-meta">
        <span className="game-meta-item">
          <Clock size={12} /> {game.duration || 'Flexible'}
        </span>
        <span className="game-meta-item" style={{ color: 'var(--accent)' }}>
          <Zap size={12} /> {game.energyType}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
        {(game.interaction_types || []).map(tag => (
          <span key={tag} style={{ fontSize: '10px', background: 'var(--bg-main)', color: 'var(--text-secondary)', padding: '2px 8px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            {tag}
          </span>
        ))}
      </div>

      <p className="game-desc" style={{ marginTop: '12px' }}>{game.rules || game.description}</p>

      {game.context && (
        <div className="game-context">
          <strong>Best used when:</strong> {game.context}
        </div>
      )}

      <div className="game-card-folders" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={() => setIsFolderModalOpen(true)}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
            color: isInFolder ? 'var(--accent)' : 'var(--text-dim)', fontSize: '11px', fontWeight: '500'
          }}
          title="Manage folders"
        >
          <Folder size={14} fill={isInFolder ? 'var(--accent)' : 'none'} />
          {isInFolder ? 'Organized' : 'Add to folder'}
        </button>

        {game.activeFolderContext && (
           <button 
             onClick={() => {
               if (window.confirm("Remove from this folder?")) {
                 toggleActivityInFolder(game.id, game.activeFolderContext);
               }
             }}
             style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '11px', marginLeft: 'auto' }}
           >
             Remove from folder
           </button>
        )}
      </div>

      <ManageFoldersModal 
        isOpen={isFolderModalOpen} 
        onClose={() => setIsFolderModalOpen(false)} 
        activity={game} 
      />

      <div className="game-footer" style={{ borderTop: 'none', paddingTop: '12px', marginTop: 'auto' }}>
        <div 
          className="category-label" 
          onClick={() => setIsEditingCategory(true)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}
        >
          {game.theme_clean}
          <Pencil size={10} />
        </div>
        <button 
          onClick={() => onAdd(game)}
          style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '500' }}
        >
          Add <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default function Repository() {
  const { games, categories, energyTypes, folders, addFolder, renameFolder, deleteFolder } = useStore();
  
  // Sort and Filter States
  const [energyF, setEnergyF] = useState('all');
  const [themeF, setThemeF] = useState('all');
  const [search, setSearch] = useState('');
  const [gameToRoute, setGameToRoute] = useState(null);
  const [editingRepoGame, setEditingRepoGame] = useState(null);
  
  const [primaryFilter, setPrimaryFilter] = useState('All'); // All, Favorites, Recently Added
  const [sortBy, setSortBy] = useState('Favorites first'); // Newest first, Oldest first, Alphabetical, Favorites first
  const [activeFolderId, setActiveFolderId] = useState('all');

  const filteredGames = useMemo(() => {
    let result = games.filter(g => {
      const matchesEnergy = energyF === 'all' || g.energyType === energyF;
      const matchesTheme = themeF === 'all' || g.theme_clean === themeF;
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || 
                           (g.rules && g.rules.toLowerCase().includes(search.toLowerCase()));
      const matchesFolder = activeFolderId === 'all' || (Array.isArray(g.folder_ids) && g.folder_ids.includes(activeFolderId));
      
      let matchesPrimary = true;
      if (primaryFilter === 'Favorites') matchesPrimary = g.favorite;
      
      return matchesEnergy && matchesTheme && matchesSearch && matchesFolder && matchesPrimary;
    });

    // Handle primary filter "Recently Added" sorting implicit
    if (primaryFilter === 'Recently Added') {
      result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else {
      // Explicit sorting
      result.sort((a, b) => {
        if (sortBy === 'Alphabetical') return a.title.localeCompare(b.title);
        if (sortBy === 'Newest first') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        if (sortBy === 'Oldest first') return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        if (sortBy === 'Favorites first') {
          if (a.favorite && !b.favorite) return -1;
          if (!a.favorite && b.favorite) return 1;
          return 0; // fallback to stable
        }
        return 0;
      });
    }

    return result;
  }, [games, energyF, themeF, search, primaryFilter, sortBy, activeFolderId]);

  const handleCreateFolder = () => {
    const name = window.prompt("Enter new folder name:");
    if (name && name.trim()) {
      addFolder(name.trim());
    }
  };

  const handleRenameFolder = (id, currentName) => {
    const name = window.prompt("Enter new folder name:", currentName);
    if (name && name.trim() && name.trim() !== currentName) {
      renameFolder(id, name.trim());
    }
  };

  const handleDeleteFolder = (id, name) => {
    if (window.confirm(`Are you sure you want to delete folder "${name}"? Activities inside will simply be moved out.`)) {
      deleteFolder(id);
      if (activeFolderId === id) setActiveFolderId('all');
    }
  };

  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <AddGameModal game={gameToRoute} onClose={() => setGameToRoute(null)} />
    <EditActivityModal 
      isOpen={!!editingRepoGame} 
      onClose={() => setEditingRepoGame(null)} 
      activity={editingRepoGame} 
      mode="repository"
    />
    
    {/* Scroll to Top */}
    {showScrollTop && (
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 100,
          width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', color: 'white',
          border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        <Plus size={20} style={{ transform: 'rotate(45deg)' }} /> 
      </button>
    )}

    <main className="container-max" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: 'var(--spacing-6)' }}>
      
      {/* Left Sidebar for Folders & Filters */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
        
        {/* Search */}
        <div className="search-container">
          <Search className="search-icon" size={14} />
          <input 
            type="text" 
            placeholder="Search activities..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Primary Views */}
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '8px', letterSpacing: '0.05em' }}>VIEWS</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {['All', 'Favorites', 'Recently Added'].map(filter => (
              <button 
                key={filter}
                onClick={() => setPrimaryFilter(filter)}
                style={{ 
                  textAlign: 'left', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', border: 'none',
                  background: primaryFilter === filter ? 'var(--bg-surface)' : 'transparent',
                  color: primaryFilter === filter ? 'var(--text-main)' : 'var(--text-secondary)',
                  fontWeight: primaryFilter === filter ? '600' : '500'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Folders */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>CUSTOM FOLDERS</h4>
            <button onClick={handleCreateFolder} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: '2px' }} title="New Folder">
              <FolderPlus size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button 
                onClick={() => setActiveFolderId('all')}
                style={{ 
                  textAlign: 'left', padding: '6px 10px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', border: '1px solid transparent',
                  background: activeFolderId === 'all' ? 'var(--bg-surface)' : 'transparent',
                  color: activeFolderId === 'all' ? 'var(--text-main)' : 'var(--text-secondary)',
                  fontWeight: activeFolderId === 'all' ? '600' : '500'
                }}
              >
                All Activities
            </button>
            {folders.map(folder => {
              const gameCount = games.filter(g => Array.isArray(g.folder_ids) && g.folder_ids.includes(folder.id)).length;
              return (
                <div key={folder.id} style={{ display: 'flex', alignItems: 'center', background: activeFolderId === folder.id ? 'var(--bg-surface)' : 'transparent', borderRadius: '6px' }}>
                  <button 
                    onClick={() => setActiveFolderId(folder.id)}
                    style={{ 
                      flex: 1, textAlign: 'left', padding: '6px 4px 6px 10px', fontSize: '13px', cursor: 'pointer', border: 'none', background: 'none',
                      color: activeFolderId === folder.id ? 'var(--text-main)' : 'var(--text-secondary)',
                      fontWeight: activeFolderId === folder.id ? '600' : '500', display: 'flex', alignItems: 'center', gap: '6px',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Folder size={12} color={activeFolderId === folder.id ? 'var(--accent)' : 'var(--text-dim)'} />
                      {folder.name}
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '10px' }}>
                      {gameCount}
                    </span>
                  </button>
                  <div style={{ display: 'flex', gap: '2px', paddingRight: '8px' }}>
                    <button onClick={() => handleRenameFolder(folder.id, folder.name)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}><Edit2 size={12} /></button>
                    <button onClick={() => handleDeleteFolder(folder.id, folder.name)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }}><Trash2 size={12} /></button>
                  </div>
                </div>
              );
            })}
            {folders.length === 0 && <p style={{ fontSize: '12px', color: 'var(--text-dim)', paddingLeft: '8px' }}>No folders yet.</p>}
          </div>
        </div>

      </aside>

      {/* Right Content Area */}
      <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeFolderId !== 'all' && (
              <button 
                onClick={() => setActiveFolderId('all')}
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-dim)', padding: '4px 8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                ← Back
              </button>
            )}
            <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {activeFolderId !== 'all' ? folders.find(f => f.id === activeFolderId)?.name || 'Folder' : primaryFilter !== 'All' ? primaryFilter : 'Games Library'} 
              <span style={{ color: 'var(--text-dim)', fontWeight: '500', fontSize: '14px', marginLeft: '8px' }}>{filteredGames.length}</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ListFilter size={14} color="var(--text-dim)" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="search-input"
                style={{ fontSize: '13px', padding: '6px', background: 'var(--bg-main)' }}
              >
                <option value="Newest first">Newest first</option>
                <option value="Oldest first">Oldest first</option>
                <option value="Alphabetical">Alphabetical</option>
                <option value="Favorites first">Favorites first</option>
              </select>
            </div>
          </div>

        {/* Existing Filters row */}
        <div className="filters-section" style={{ marginBottom: 'var(--spacing-4)', background: 'var(--bg-panel)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <div className="filter-group">
            <span className="filter-label">Energy</span>
            <div className="filter-pills">
              <button onClick={() => setEnergyF('all')} className={`pill ${energyF === 'all' ? 'active' : ''}`}>All</button>
              {energyTypes.map(t => (
                <button key={t} onClick={() => setEnergyF(t)} className={`pill ${energyF === t ? 'active' : ''}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group" style={{ marginTop: '12px' }}>
            <span className="filter-label">Category</span>
            <div className="filter-pills">
              <button onClick={() => setThemeF('all')} className={`pill ${themeF === 'all' ? 'active' : ''}`}>All</button>
              {categories.map(t => (
                <button key={t} onClick={() => setThemeF(t)} className={`pill ${themeF === t ? 'active' : ''}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {filteredGames.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
            <Folder size={32} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>It's quiet in here...</p>
            <p style={{ color: 'var(--text-dim)', fontSize: '13px' }}>No activities match the current filters or folder selection.</p>
          </div>
        ) : (
          <div className="game-grid">
            {filteredGames.map((game, i) => (
              <GameCard 
                key={`${game.id || game.title}-${i}`} 
                game={{
                  ...game,
                  activeFolderContext: activeFolderId !== 'all' ? activeFolderId : null
                }} 
                onAdd={setGameToRoute} 
                onEdit={setEditingRepoGame}
              />
            ))}
          </div>
        )}
      </section>

    </main>
    </>
  );
}
