import React, { useState, useEffect } from 'react';
import { Users, Plus, ArrowRight, LogOut, Zap, Menu, X } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          padding: isMobile ? '32px 24px' : '48px 40px',
          width: 'calc(100% - 32px)',
          maxWidth: '420px',
          margin: '16px',
          textAlign: 'center',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.05) inset'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #EAB308, #F59E0B)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 32px rgba(234,179,8,0.3)' }}>
              <img src="/e-logo.png?v=3" alt="Logo" style={{ height: '40px', width: '40px', objectFit: 'contain' }} />
            </div>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>Session Planner</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px', fontWeight: '500' }}>Platform Maintenance v9.5</p>

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
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                  fontFamily: "'DM Sans', sans-serif"
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                autoFocus
              />
            </div>
            {error && <p style={{ color: '#F97316', fontSize: '12px', textAlign: 'left', margin: '-4px 0 0 4px', fontWeight: '500' }}>{error}</p>}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '12px', justifyContent: 'center' }}
            >Access Planner →</button>
          </form>

          {/* Footer */}
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '28px', marginBottom: '0' }}>Positive Emotions Lab • Restricted Access</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-wrapper ${isMobile ? 'is-mobile' : ''}`}>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(8px)',
                zIndex: 2000
              }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                width: '100%',
                maxWidth: '280px',
                background: 'var(--bg-deep)',
                borderRight: '1px solid var(--border-soft)',
                zIndex: 2001,
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/e-logo.png" alt="Logo" style={{ width: '24px', height: '24px' }} />
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#FFF' }}>Navigation</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: '#FFF' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['repository', 'builder', 'programs', 'guidelines'].map(tab => (
                  <button
                    key={tab}
                    className={`sidebar-link-v9 ${activeTab === tab || (tab === 'builder' && activeTab === 'plan') || (tab === 'programs' && activeTab === 'roadmap') ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsMenuOpen(false);
                    }}
                    style={{ justifyContent: 'flex-start', padding: '16px 20px', fontSize: '14px' }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: 'auto' }}>
                <button 
                  onClick={handleLogout}
                  className="sidebar-link-v9"
                  style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)', gap: '12px', padding: '16px 20px' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <nav className={`navbar glass-header ${scrolled ? 'scrolled' : ''}`}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => setActiveTab('repository')}>
          {isMobile && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }}
              style={{ background: 'none', border: 'none', color: '#FFF', padding: '8px' }}
            >
              <Menu size={20} />
            </button>
          )}
          <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src="/e-logo.png" alt="Logo" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px', color: '#FFFFFF', lineHeight: 1 }}>Session Planner</span>
            <span className="hide-mobile" style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-inactive)', textTransform: 'uppercase', letterSpacing: '1px' }}>e-Socialize Program Tool</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isMobile && (
            <div className="nav-center">
              {['repository', 'builder', 'programs', 'guidelines'].map(tab => (
                <button
                  key={tab}
                  className={`nav-link ${activeTab === tab || (tab === 'builder' && activeTab === 'plan') || (tab === 'programs' && activeTab === 'roadmap') ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {activeTab === 'repository' && !isMobile && (
              <button className="btn-primary" onClick={() => setShowAddGame(true)}>
                <Plus size={14} /> Add Game
              </button>
            )}
            <button
              className="btn-secondary"
              onClick={handleLogout}
              title="Logout"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}
            >
              <span className={isMobile ? 'hide-mobile' : ''} style={{ color: '#FFFFFF', fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Out</span>
              {isMobile && <LogOut size={16} color="#FFF" />}
            </button>
          </div>
        </div>
      </nav>



      <GameForm isOpen={showAddGame} onClose={() => setShowAddGame(false)} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.99 }}
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 35,
            mass: 0.5
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

      {/* Mobile FAB for Adding Games */}
      <AnimatePresence>
        {isMobile && activeTab === 'repository' && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddGame(true)}
            style={{
              position: 'fixed',
              bottom: '84px',
              right: '18px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(15, 19, 24, 0.6)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1.5px solid rgba(234, 179, 8, 0.25)',
              color: 'var(--accent-gold)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          >
            <Plus size={22} strokeWidth={3} />
          </motion.button>
        )}
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
