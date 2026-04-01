import React, { useState, useMemo } from 'react';
import { Search, Shuffle, Star, Clock, Target, Plus, Copy, ArrowRight, Zap, Users, Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import AddGameModal from './AddGameModal';

const GameCard = ({ game, onAdd }) => {
  const { toggleFavorite, updateGame, categories } = useStore();
  const [isEditingCategory, setIsEditingCategory] = useState(false);

  const handleCategoryChange = (newCategory) => {
    updateGame(game.id || game.title, { theme_clean: newCategory });
    setIsEditingCategory(false);
  };

  return (
    <div className="game-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 className="game-title">{game.title}</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => toggleFavorite(game.id || game.title)} title="Mark as go-to activity" style={{ background: 'none', border: 'none', cursor: 'pointer', color: game.favorite ? 'var(--accent)' : 'var(--text-dim)' }}>
            <Star size={16} fill={game.favorite ? 'var(--accent)' : 'none'} />
          </button>
          <button 
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
                useStore.getState().deleteActivity(game.id);
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
        <span className="game-meta-item">
          <Users size={12} /> {game.engagementType}
        </span>
      </div>

      <p className="game-desc">{game.rules}</p>

      {game.context && (
        <div className="game-context">
          <strong>Best used when:</strong> {game.context}
        </div>
      )}

      <div className="game-footer">
        {isEditingCategory ? (
          <select 
            autoFocus
            className="search-input"
            style={{ fontSize: '11px', padding: '2px 4px', height: 'auto', width: 'auto' }}
            value={game.theme_clean}
            onChange={(e) => handleCategoryChange(e.target.value)}
            onBlur={() => setIsEditingCategory(false)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        ) : (
          <div 
            className="category-label" 
            onClick={() => setIsEditingCategory(true)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            title="Click to edit category"
          >
            {game.theme_clean}
            <Pencil size={10} color="var(--text-dim)" />
          </div>
        )}
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
  const { games, categories, energyTypes } = useStore();
  const [energyF, setEnergyF] = useState('all');
  const [themeF, setThemeF] = useState('all');
  const [search, setSearch] = useState('');
  const [gameToRoute, setGameToRoute] = useState(null);

  const filteredGames = useMemo(() => {
    let result = games.filter(g => {
      const matchesEnergy = energyF === 'all' || g.energyType === energyF;
      const matchesTheme = themeF === 'all' || g.theme_clean === themeF;
      const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase()) || 
                           (g.rules && g.rules.toLowerCase().includes(search.toLowerCase()));
      return matchesEnergy && matchesTheme && matchesSearch;
    });

    // Sort: Favorites first, then alphabetical (or just maintain existing order)
    result.sort((a, b) => {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return 0;
    });

    return result;
  }, [games, energyF, themeF, search]);

  return (
    <>
    <AddGameModal game={gameToRoute} onClose={() => setGameToRoute(null)} />
    <main className="container-max">
      
      <section className="filters-section">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="search-container">
            <Search className="search-icon" size={14} />
            <input 
              type="text" 
              placeholder="Search games, rules, contexts..." 
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-secondary" onClick={() => {}}>
            <Shuffle size={14} /> Random
          </button>
        </div>

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

        <div className="filter-group">
          <span className="filter-label">Category</span>
          <div className="filter-pills">
            <button onClick={() => setThemeF('all')} className={`pill ${themeF === 'all' ? 'active' : ''}`}>All</button>
            {categories.map(t => (
              <button key={t} onClick={() => setThemeF(t)} className={`pill ${themeF === t ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div style={{ marginBottom: 'var(--spacing-2)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Games Library <span style={{ color: 'var(--text-dim)', fontWeight: '500', fontSize: '14px' }}>{filteredGames.length}</span></h2>
        </div>

        {filteredGames.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
            <Search className="text-dim" size={24} style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No matches found for this filter.</p>
          </div>
        ) : (
          <div className="game-grid">
            {filteredGames.map((game, i) => (
              <GameCard key={`${game.id || game.title}-${i}`} game={game} onAdd={setGameToRoute} />
            ))}
          </div>
        )}
      </section>

    </main>
    </>
  );
}
