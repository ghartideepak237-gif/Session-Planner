import React, { useState, useEffect } from 'react';
import { Users, Plus, ArrowRight, LogOut, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0B0D10',
        fontFamily: "'DM Sans', sans-serif",
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient glow */}
        <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(125,211,252,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(234,179,8,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          background: 'rgba(15, 19, 24, 0.8)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '48px 40px',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.05) inset'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #EAB308, #F59E0B)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(234,179,8,0.3)' }}>
              <img src="/e-logo.png?v=2" alt="Logo" style={{ height: '36px', width: '36px', objectFit: 'contain' }} />
            </div>
          </div>

          {/* Heading */}
          <h1 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: '700', margin: '0 0 6px 0', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.01em' }}>Session Planner</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '0 0 32px 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500' }}>e-Socialize Program Tool</p>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)', marginBottom: '32px' }} />

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Enter access password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  fontFamily: "'DM Sans', sans-serif"
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(125,211,252,0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                autoFocus
              />
            </div>
            {error && <p style={{ color: '#F97316', fontSize: '12px', textAlign: 'left', margin: '-4px 0 0 4px', fontWeight: '500' }}>{error}</p>}
            <button
              type="submit"
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(125,211,252,0.15), rgba(125,211,252,0.05))',
                border: '0.5px solid rgba(125,211,252,0.25)',
                color: '#7DD3FC',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: '0.02em'
              }}
              onMouseEnter={(e) => { e.target.style.background = 'linear-gradient(135deg, rgba(125,211,252,0.25), rgba(125,211,252,0.1))'; e.target.style.boxShadow = '0 8px 24px rgba(125,211,252,0.15)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'linear-gradient(135deg, rgba(125,211,252,0.15), rgba(125,211,252,0.05))'; e.target.style.boxShadow = 'none'; }}
            >Access Planner →</button>
          </form>

          {/* Footer */}
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '28px', marginBottom: '0' }}>Positive Emotions Lab • Restricted Access</p>
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
            <span style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Out</span>
          </button>
        </div>
      </nav>

      <GameForm isOpen={showAddGame} onClose={() => setShowAddGame(false)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {activeTab === 'repository' && <Repository />}
          {activeTab === 'builder' && <SessionBuilder />}
          {activeTab === 'programs' && <Programs />}
          {activeTab === 'roadmap' && activeProgramId && <ProgramDetail />}
          {activeTab === 'guidelines' && <AnchorGuidelines />}
        </motion.div>
      </AnimatePresence>

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
