import React, { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import Repository from './components/Repository';
import SessionBuilder from './components/SessionBuilder';
import Programs from './components/Programs';
import ProgramDetail from './components/ProgramDetail';
import GameForm from './components/GameForm';
import { useStore } from './store';
import './index.css';
import './components.css';

export default function App() {
  const { activeTab, setActiveTab, activeProgramId } = useStore();
  const [showAddGame, setShowAddGame] = useState(false);

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
            <button className={`nav-link ${(activeTab === 'programs' || activeTab === 'roadmap') ? 'active' : ''}`} onClick={() => setActiveTab('programs')}>Programs</button>
            <button className={`nav-link ${(activeTab === 'builder' || activeTab === 'plan') ? 'active' : ''}`} onClick={() => setActiveTab('builder')}>Planner</button>
            <button className={`nav-link ${activeTab === 'repository' ? 'active' : ''}`} onClick={() => setActiveTab('repository')}>Activities</button>
          </nav>
        </div>

        <div className="nav-actions">
          {activeTab === 'repository' && (
             <button className="btn-primary" onClick={() => setShowAddGame(true)}>
               <Plus size={14} /> Add Game
             </button>
          )}
        </div>
      </nav>

      <GameForm isOpen={showAddGame} onClose={() => setShowAddGame(false)} />

      {activeTab === 'repository' && <Repository />}
      {activeTab === 'builder' && <SessionBuilder />}
      {activeTab === 'programs' && <Programs />}
      {activeTab === 'roadmap' && activeProgramId && <ProgramDetail />}

      <footer style={{ padding: 'var(--spacing-4)', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: '500' }}>
          Prepared by e-Socialize Brainstorm Tool • {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
