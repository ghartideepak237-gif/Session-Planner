import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, ArrowRight, LogOut, Zap, Menu, X, ArrowUp, Rocket } from 'lucide-react';
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
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fix: Re-bind scroll listener when isLoading changes to false (scroll-container ready)
  useEffect(() => {
    if (isLoading) return;
    
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Lower threshold (20px) for immediate 'scrolled' state
      setScrolled(container.scrollTop > 20);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  // Liquid Smooth Inertial Scrolling Layer
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isMobile || isLoading) return;

    let velocity = 0;
    let lastTime = 0;
    let rafId;

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; 

      if (e.target.closest('.local-scroll')) return;

      e.preventDefault();
      const now = Date.now();
      const dt = now - lastTime || 1;
      
      velocity = (e.deltaY / dt) * 16;
      lastTime = now;

      const ease = () => {
        if (Math.abs(velocity) < 0.1) {
          cancelAnimationFrame(rafId);
          return;
        }
        container.scrollTop += velocity;
        velocity *= 0.88; 
        rafId = requestAnimationFrame(ease);
      };

      cancelAnimationFrame(rafId);
      ease();
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile, isLoading]);

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)', color: '#FFF' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent-gold)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('eSocializeAuth');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0B0D10', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 0%, rgba(125,211,252,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ background: 'rgba(15, 19, 24, 0.8)', backdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px', width: '420px', textAlign: 'center', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--grad-vibrant)', borderRadius: '18px', margin: '0 auto 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/e-logo.png" style={{ height: '40px' }} alt="logo" />
          </div>
          <h1 style={{ color: '#FFF', fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Session Planner</h1>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={(e) => {
            e.preventDefault();
            if (password === 'socialize123') { setIsAuthenticated(true); localStorage.setItem('eSocializeAuth', 'true'); }
          }}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }} />
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>Access</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`page-wrapper ${isMobile ? 'is-mobile' : ''}`}>
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000 }} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 40 }} style={{ position: 'fixed', inset: '0 auto 0 0', width: '280px', background: 'var(--bg-deep)', zIndex: 2001, padding: '40px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#FFF' }}>Menu</span>
                <X onClick={() => setIsMenuOpen(false)} color="#FFF" style={{ cursor: 'pointer' }} />
              </div>
              {['repository', 'builder', 'programs', 'guidelines'].map(tab => (
                <button key={tab} className={`sidebar-link-v9 ${activeTab === tab ? 'active' : ''}`} onClick={() => { setActiveTab(tab); setIsMenuOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '16px', borderRadius: '12px', background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#FFF', border: 'none', marginBottom: '12px', fontSize: '15px', fontWeight: '600' }}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <nav className={`navbar glass-header ${scrolled ? 'scrolled' : ''}`} style={{ padding: isMobile ? '8px 16px' : '12px 40px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', flex: 1, minWidth: 0 }} onClick={() => setActiveTab('repository')}>
          {isMobile && <Menu onClick={(e) => { e.stopPropagation(); setIsMenuOpen(true); }} color="#FFF" style={{ flexShrink: 0 }} />}
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px', flexShrink: 0 }}><img src="/e-logo.png" style={{ height: '24px' }} alt="logo" /></div>
          <span style={{ color: '#FFF', fontWeight: '800', fontSize: isMobile ? '16px' : '18px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Session Planner</span>
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {['repository', 'builder', 'programs', 'guidelines'].map(tab => (
              <button key={tab} className={`nav-link ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
            ))}
          </div>
        )}
        <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', padding: isMobile ? '8px 12px' : '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: isMobile ? '12px' : '14px', flexShrink: 0 }}>Logout</button>
      </nav>

      <main ref={scrollRef} className="scroll-container" style={{ height: 'calc(100vh - 72px)' }}>
        <GameForm isOpen={showAddGame} onClose={() => setShowAddGame(false)} />
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div style={{ padding: isMobile ? '16px 0' : '20px 80px', width: '100%', boxSizing: 'border-box' }}>
              {activeTab === 'repository' && <Repository scrollRef={scrollRef} />}
              {activeTab === 'builder' && <SessionBuilder />}
              {activeTab === 'programs' && <Programs />}
              {activeTab === 'roadmap' && activeProgramId && <ProgramDetail />}
              {activeTab === 'guidelines' && <AnchorGuidelines />}
            </div>
            <footer style={{ padding: '60px', textAlign: 'center', opacity: 0.4 }}>
              <p style={{ color: '#FFF', fontSize: '12px' }}>Positive Emotions Lab • {new Date().getFullYear()}</p>
            </footer>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global FABs - Liquid Glass Arrow Restoration */}
      <AnimatePresence>
        <div style={{ 
          position: 'fixed', 
          bottom: isMobile ? 'calc(env(safe-area-inset-bottom, 20px) + 20px)' : '40px', 
          right: isMobile ? '20px' : '40px', 
          zIndex: 10000, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          pointerEvents: 'none'
        }}>
          {activeTab === 'repository' && (
            <motion.button 
              initial={{ scale: 0, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0, opacity: 0 }} 
              onClick={() => setShowAddGame(true)} 
              style={{ 
                width: '54px', 
                height: '54px', 
                borderRadius: '50%', 
                background: 'var(--accent-gold)', 
                border: 'none', 
                color: '#000', 
                cursor: 'pointer', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                pointerEvents: 'auto'
              }}>
              <Plus size={24} strokeWidth={3} />
            </motion.button>
          )}
          
          {scrolled && (
            <motion.button 
              initial={{ scale: 0, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0, opacity: 0, y: 10 }} 
              onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })} 
              style={{ 
                width: '54px', 
                height: '54px', 
                borderRadius: '50%',
                background: 'rgba(15, 19, 24, 0.4)',
                backdropFilter: 'blur(32px) saturate(160%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                border: '1.5px solid rgba(255, 255, 255, 0.12)',
                color: '#FFF', 
                cursor: 'pointer', 
                boxShadow: '0 15px 40px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.05)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                pointerEvents: 'auto'
              }}>
              <ArrowUp size={24} strokeWidth={2.5} />
            </motion.button>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
