import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
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
  const { activeTab, setActiveTab, activeProgramId } = useStore();
  const [showAddGame, setShowAddGame] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('eSocializeAuth') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      <nav className="navbar">
        <a href="/" className="logo-wrapper" style={{ textDecoration: 'none' }}>
          <img src="/e-logo.png?v=2" alt="e-Socialize Logo" style={{ height: '28px', width: 'auto' }} />
          <div className="logo-text">
            <h1>Session Planner</h1>
            <p>e-Socialize Program Tool</p>
          </div>
        </a>

        <div className="nav-center">
          <nav className="header-nav">
            <button className={`nav-link ${activeTab === 'repository' ? 'active' : ''}`} onClick={() => setActiveTab('repository')}>Repository</button>
            <button className={`nav-link ${(activeTab === 'builder' || activeTab === 'plan') ? 'active' : ''}`} onClick={() => setActiveTab('builder')}>Planner</button>
            <button className={`nav-link ${(activeTab === 'programs' || activeTab === 'roadmap') ? 'active' : ''}`} onClick={() => setActiveTab('programs')}>Programs</button>
            <button className={`nav-link ${activeTab === 'guidelines' ? 'active' : ''}`} onClick={() => setActiveTab('guidelines')}>Guidelines</button>
          </nav>
        </div>

        <div className="nav-actions">
          {activeTab === 'repository' && (
             <button className="btn-primary" onClick={() => setShowAddGame(true)}>
               <Plus size={14} /> Add Game
             </button>
          )}
          <button className="btn-secondary" onClick={handleLogout} style={{ border: 'none', background: 'transparent' }}>Logout</button>
        </div>
      </nav>

      <GameForm isOpen={showAddGame} onClose={() => setShowAddGame(false)} />

      {activeTab === 'repository' && <Repository />}
      {activeTab === 'builder' && <SessionBuilder />}
      {activeTab === 'programs' && <Programs />}
      {activeTab === 'roadmap' && activeProgramId && <ProgramDetail />}
      {activeTab === 'guidelines' && <AnchorGuidelines />}

      <footer style={{ padding: 'var(--spacing-4)', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: '500' }}>
          Prepared by Positive Emotions Lab Team • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
