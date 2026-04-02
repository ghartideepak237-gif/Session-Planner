import React, { useState, useEffect } from 'react';
import { Users, Plus, ArrowRight, LogOut, Zap } from 'lucide-react';
import Repository from './components/Repository';
import SessionBuilder from './components/SessionBuilder';
import Programs from './components/Programs';
import ProgramDetail from './components/ProgramDetail';
import GameForm from './components/GameForm';
import AnchorGuidelines from './components/AnchorGuidelines';
import { useStore } from './store';
import './index.css';
import './components.css';

export default function App() {
  const { activeTab, setActiveTab, activeProgramId, isLoading, initialize, dbStatus } = useStore();
  const [showAddGame, setShowAddGame] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('eSocializeAuth') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'var(--text-main)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: 'var(--spacing-4)' }}></div>
        <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>Initializing Session Planner...</p>
      </div>
    );
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'socialize123') {
      setIsAuthenticated(true);
      localStorage.setItem('eSocializeAuth', 'true');
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('eSocializeAuth');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <div style={{ background: 'var(--bg-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <img src="/e-logo.png?v=2" alt="Logo" style={{ height: '48px', marginBottom: 'var(--spacing-2)' }} />
          <h1 style={{ color: 'var(--text-main)', fontSize: '20px', marginBottom: '4px' }}>Session Planner Access</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: 'var(--spacing-4)' }}>e-Socialize Program Tool</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <input 
              type="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-dark)', color: 'var(--text-main)', fontSize: '14px', outline: 'none' }}
              autoFocus
            />
            {error && <p style={{ color: 'var(--accent)', fontSize: '12px', textAlign: 'left', marginTop: '-4px' }}>{error}</p>}
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '10px' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <nav className={`glass-header ${scrolled ? 'scrolled' : ''}`} style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px 48px',
      }}>
        <a href="/" onClick={(e) => { e.preventDefault(); setActiveTab('repository'); }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent-gold)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} color="#000" fill="#000" />
          </div>
          <div className="logo-text">
            <h1 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '18px', fontWeight: '700' }}>Session Planner</h1>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>e-Socialize Program Tool</p>
          </div>
        </a>

        <div className="nav-center">
          <nav className="header-nav" style={{ display: 'flex', gap: '8px' }}>
            {['repository', 'builder', 'programs', 'guidelines'].map(tab => (
              <button 
                key={tab}
                className={`nav-link ${activeTab === tab || (tab === 'builder' && activeTab === 'plan') || (tab === 'programs' && activeTab === 'roadmap') ? 'active' : ''}`} 
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? 'rgba(255,255,255,0.08)' : 'none',
                  border: 'none',
                  color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-inactive)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {activeTab === 'repository' && (
             <button className="btn-primary" onClick={() => setShowAddGame(true)} style={{ padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
               <Plus size={14} /> Add Game
             </button>
          )}
          <button 
            className="btn-secondary" 
            onClick={handleLogout} 
            title="Logout"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid var(--border-soft)',
              color: 'var(--text-primary)',
              padding: 0
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="force-logout-svg" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </nav>

      <GameForm isOpen={showAddGame} onClose={() => setShowAddGame(false)} />

      {activeTab === 'repository' && <Repository />}
      {activeTab === 'builder' && <SessionBuilder />}
      {activeTab === 'programs' && <Programs />}
      {activeTab === 'roadmap' && activeProgramId && <ProgramDetail />}
      {activeTab === 'guidelines' && <AnchorGuidelines />}

      <footer style={{ padding: 'var(--spacing-4)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: '500' }}>
          Prepared by Positive Emotions Lab Team • {new Date().getFullYear()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'var(--bg-dark)', border: '1px solid var(--border)' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dbStatus === 'connected' ? '#10b981' : dbStatus === 'loading' ? 'var(--accent)' : '#ef4444' }}></div>
          <span style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>
            {dbStatus === 'connected' ? 'Cloud Synced' : dbStatus === 'loading' ? 'Connecting...' : 'Offline Mode (Local Cache)'}
          </span>
        </div>
      </footer>
    </div>
  );
}
