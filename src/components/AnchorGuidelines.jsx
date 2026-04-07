import React, { useState, useEffect } from 'react';
import {
  Video, Rocket, Wind, MessageCircle, Layers, CalendarCheck,
  Monitor, Heart, UserCheck, Timer, Layout, Globe, Star,
  Smartphone, CheckCircle2, AlertCircle, XCircle, Zap, ArrowRight, ArrowUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Primitive components ─── */

const Tag = ({ children, type = 'neutral' }) => {
  const map = {
    green:  { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',   color: 'var(--success)'  },
    red:    { bg: 'rgba(239,68,68,0.1)',    border: 'rgba(239,68,68,0.25)',   color: 'var(--danger)'   },
    orange: { bg: 'rgba(249,115,22,0.1)',   border: 'rgba(249,115,22,0.25)',  color: '#fb923c'         },
    blue:   { bg: 'rgba(125,211,252,0.1)',  border: 'rgba(125,211,252,0.25)', color: 'var(--accent-silver)' },
    gold:   { bg: 'rgba(234,179,8,0.1)',    border: 'rgba(234,179,8,0.3)',    color: 'var(--accent-gold)' },
    neutral:{ bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.1)',  color: 'var(--text-muted)' },
  };
  const s = map[type] || map.neutral;
  return (
    <motion.span 
      whileHover={{ scale: 1.05, y: -1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '2px 9px', background: s.bg, border: `0.5px solid ${s.border}`,
        borderRadius: '99px', fontSize: '10px', fontWeight: '700',
        color: s.color, whiteSpace: 'nowrap', letterSpacing: '0.02em',
        textTransform: 'uppercase', cursor: 'default'
      }}
    >{children}</motion.span>
  );
};

const SummaryPill = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.05, background: 'rgba(234, 179, 8, 0.12)' }}
    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '6px 16px',
      background: 'rgba(234, 179, 8, 0.08)',
      border: '0.5px solid rgba(234, 179, 8, 0.25)',
      borderRadius: '14px',
      fontSize: '12px',
      fontWeight: '800',
      color: 'var(--accent-gold)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      marginBottom: '12px',
      cursor: 'default'
    }}
  >
    <Star size={11} fill="var(--accent-gold)" style={{ marginRight: '8px' }} />
    {children}
  </motion.div>
);

const Bullet = ({ children }) => (
  <motion.div 
    initial={{ opacity: 0, x: -5 }}
    animate={{ opacity: 1, x: 0 }}
    style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.55 }}
  >
    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-inactive)', marginTop: '7px', flexShrink: 0 }} />
    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{children}</span>
  </motion.div>
);

const Callout = ({ children, type = 'info' }) => {
  const map = {
    info:    { border: 'var(--accent-silver)', bg: 'rgba(125,211,252,0.04)' },
    warning: { border: 'var(--accent-gold)',   bg: 'rgba(234,179,8,0.04)'   },
    danger:  { border: 'var(--danger)',        bg: 'rgba(239,68,68,0.04)'   },
    success: { border: 'var(--success)',       bg: 'rgba(34,197,94,0.04)'   },
  };
  const s = map[type];
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderLeft: `2.5px solid ${s.border}`, background: s.bg,
        padding: '8px 12px', borderRadius: '0 8px 8px 0',
        fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5
      }}
    >{children}</motion.div>
  );
};

const Quote = ({ children }) => (
  <div style={{
    padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
    borderLeft: '2px solid var(--border-accent)',
    borderRadius: '0 10px 10px 0',
    fontSize: '11px', fontStyle: 'italic',
    color: 'var(--text-muted)', lineHeight: 1.6
  }}>{children}</div>
);

const Flow = ({ steps }) => (
  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
    {steps.map((s, i) => (
      <React.Fragment key={i}>
        <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.65)' }}>
          {s}
        </span>
        {i < steps.length - 1 && <ArrowRight size={10} color="rgba(255,255,255,0.2)" />}
      </React.Fragment>
    ))}
  </div>
);

const Divider = () => <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)', margin: '12px 0' }} />;

const CardIcon = ({ icon, color }) => (
  <div style={{
    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
    background: `${color}18`, border: `0.5px solid ${color}35`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color
  }}>{icon}</div>
);

export default function AnchorGuidelines() {
  const [showRocket, setShowRocket] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const staggerDelay = "0.1s";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowRocket(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsLaunching(false), 1200);
  };

  const sections = [
    {
      icon: <Video size={16} />, iconColor: '#7DD3FC',
      title: 'Camera Policy',
      subtitle: 'Friendly but Firm',
      summary: 'Cameras ON = Presence',
      body: (
        <>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Tag type="green">Camera ON → High Engagement</Tag>
            <Tag type="red">No Camera → Disengaged</Tag>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Bullet>Cameras <strong style={{ color: '#FFFFFF' }}>ON</strong> from session 1. Link attendance to participation.</Bullet>
            <Bullet>Communicate policy warmly — not as a punishment.</Bullet>
            <Bullet>Exception only for genuine technical issues.</Bullet>
          </div>
          <Quote>"Social interaction sessions — cameras help everyone connect, not lectures."</Quote>
          <Callout type="info">When someone is speaking, mediator may suggest others turn off temporarily to reduce distraction.</Callout>
        </>
      )
    },
    {
      icon: <Rocket size={16} />, iconColor: '#EAB308',
      title: 'Session Opening',
      subtitle: 'First 10 Minutes',
      summary: 'First 10m: High Energy',
      body: (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px', opacity: 0.8 }}>Quick Interaction</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Colour you feel like?', 'Show 1 near object', 'Do something unique', 'Gesture game (dumb charades)'].map(t => <Bullet key={t}>{t}</Bullet>)}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '10px', opacity: 0.8 }}>Fastest Fingers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Type names fastest', 'Team typing challenge', 'Touch body part (Nose/Ear)', 'Quick team formation'].map(t => <Bullet key={t}>{t}</Bullet>)}
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      icon: <Wind size={16} />, iconColor: 'var(--accent-silver)',
      title: 'Energy & Flow',
      subtitle: 'Session Momentum',
      summary: 'Momentum is your Shield',
      body: (
        <>
          <div style={{ padding: '8px 12px', background: 'rgba(125,211,252,0.07)', border: '0.5px solid rgba(125,211,252,0.2)', borderRadius: '10px', fontSize: '12px', fontWeight: '600', color: 'var(--accent-silver)', textAlign: 'center' }}>
            Goal: Session feels lively, never slow
          </div>
          <Flow steps={['Opener', 'Core Activity', 'Quick Transition', 'Close — No Dead Silence']} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Bullet>Don't stay on one activity too long.</Bullet>
            <Bullet>Avoid dead silence — keep students continuously engaged.</Bullet>
            <Bullet>Keep transitions smooth and quick.</Bullet>
          </div>
          <Callout type="warning">Don't give students time to judge each other — momentum is your shield.</Callout>
        </>
      )
    },
    {
      icon: <Layout size={16} />, iconColor: 'var(--accent-gold)',
      title: 'Activity Design Principle',
      subtitle: 'Engagement Formula',
      summary: 'Short + High Engagement',
      body: (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { icon: <CheckCircle2 size={13} />, color: 'var(--success)', label: 'BEST', desc: 'Short + High Engagement' },
              { icon: <AlertCircle size={13} />,   color: 'var(--accent-gold)',   label: 'OK',   desc: 'Long + High Engagement' },
              { icon: <XCircle size={13} />,       color: 'var(--danger)',        label: 'AVOID',desc: 'Long + Low Engagement'  },
            ].map(({ icon, color, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: `${color}12`, border: `0.5px solid ${color}30`, borderRadius: '9px', fontSize: '12px' }}>
                <span style={{ color }}>{icon}</span>
                <strong style={{ color, minWidth: '42px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</strong>
                <span style={{ color: 'var(--text-secondary)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      icon: <MessageCircle size={16} />, iconColor: '#7DD3FC',
      title: 'Speaking Participation',
      subtitle: 'Building Comfort',
      summary: 'Build Comfort Gradually',
      body: (
        <>
          <Callout type="info">After Session 1: Students start speaking more, reduce hesitation, increase comfort.</Callout>
          <div style={{ display: 'flex', flexColumn: 'column', gap: '6px' }}>
            <Bullet>Build micro speaking moments in every session.</Bullet>
            <Bullet>Use small prompts and quick sharing rounds.</Bullet>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {['Micro speaking', 'Small prompts', 'Quick sharing', 'Name sharing', 'Group chats'].map(t => <Tag key={t} type="blue">{t}</Tag>)}
          </div>
        </>
      )
    },
    {
      icon: <Layers size={16} />, iconColor: 'var(--accent-silver)',
      title: 'Standard Session Structure',
      subtitle: 'Every Session Must Have',
      summary: 'Structured Flow, Word Clouds',
      body: (
        <>
          <Flow steps={['Quick Open', 'Core Activity', 'Debrief', 'Word Cloud', 'Session Ratings']} />
          <Divider />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {['Word cloud activity', 'Session ratings', 'Interactive participation', 'Speaking opportunities'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
                <CheckCircle2 size={11} color="#4ade80" />{t}
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      icon: <CalendarCheck size={16} />, iconColor: '#EAB308',
      title: 'Preparation Requirement',
      subtitle: 'Before Every Session',
      summary: 'Prepare, Don\'t Improvise',
      body: (
        <>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Tag type="green">Prepared Anchor = Better Delivery</Tag>
            <Tag type="red">No Improvisation</Tag>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Bullet>Prepare and finalize activities before the session starts.</Bullet>
            <Bullet>Do <strong style={{ color: '#f87171' }}>NOT</strong> improvise everything live on the spot.</Bullet>
          </div>
          <Callout type="success">Prepared anchors consistently out-deliver spontaneous ones.</Callout>
        </>
      )
    },
    {
      icon: <Monitor size={16} />, iconColor: '#7DD3FC',
      title: 'Experience Enhancement',
      subtitle: 'Screen & Setup Tips',
      summary: 'Big Screens, Big Impact',
      body: (
        <>
          <Bullet>Encourage students to cast session to TV or join from a bigger screen.</Bullet>
          <Callout type="info"><strong style={{ color: '#7DD3FC' }}>Reason:</strong> A larger screen improves experience, engagement, and seriousness toward the session.</Callout>
        </>
      )
    },
    {
      icon: <Heart size={16} />, iconColor: 'var(--accent-silver)',
      title: 'Engagement Philosophy',
      subtitle: 'We are Unconventional',
      summary: 'Normalise, Don\'t Lecture',
      body: (
        <>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', padding: '8px 12px', background: 'rgba(125,211,252,0.06)', border: '0.5px solid rgba(125,211,252,0.15)', borderRadius: '10px' }}>
            Address awkwardness through activity, not by talking about it.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <Bullet>Address awkwardness naturally through interaction.</Bullet>
            <Bullet>Normalise participation — don't lecture about it.</Bullet>
            <Bullet>Make interaction feel natural, not forced.</Bullet>
          </div>
        </>
      )
    },
    {
      icon: <UserCheck size={16} />, iconColor: 'var(--accent-gold)',
      title: 'Physical Involvement',
      subtitle: 'Presence = Engagement',
      summary: 'Movement = Engagement',
      body: (
        <>
          <div style={{ padding: '8px 12px', background: 'rgba(234,179,8,0.07)', border: '0.5px solid rgba(234,179,8,0.2)', borderRadius: '10px', fontSize: '12px', fontWeight: '700', color: 'var(--accent-gold)', textAlign: 'center' }}>
            Physical involvement = Higher engagement
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {['Gesture games', 'Touch activities', 'Show objects', 'Movement prompts'].map(t => <Tag key={t} type="green">{t}</Tag>)}
          </div>
        </>
      )
    },
    {
      icon: <Timer size={16} />, iconColor: 'var(--danger)',
      title: 'Time Discipline',
      subtitle: 'Start on Time. End on Time.',
      summary: '45m Target, 50m Max',
      body: (
        <>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(34,197,94,0.07)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '12px 8px' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#4ade80', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>45m</div>
            </div>
            <ArrowRight size={14} color="rgba(255,255,255,0.2)" />
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(239,68,68,0.07)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '12px 8px' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Max Limit</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#f87171', fontFamily: 'var(--font-serif)', lineHeight: 1.1 }}>50m</div>
            </div>
          </div>
          <Bullet>No overextension — professional delivery matters.</Bullet>
        </>
      )
    },
    {
      icon: <Globe size={16} />, iconColor: 'var(--accent-silver)',
      title: 'Culture Communication',
      subtitle: 'Show, Don\'t Tell',
      summary: 'Culture Through Design',
      body: (
        <>
          <Tag type="red">Don't lecture about Respect, Equality, No Judgment</Tag>
          <div style={{ padding: '8px 12px', background: 'rgba(125,211,252,0.07)', border: '0.5px solid rgba(125,211,252,0.2)', borderRadius: '10px', fontSize: '12px', fontWeight: '600', color: 'var(--accent-silver)' }}>
            Show culture through design, not speeches.
          </div>
          <Bullet>Values should reflect naturally through how you facilitate.</Bullet>
          <Bullet>Behavior demonstrates culture more than words ever will.</Bullet>
        </>
      )
    },
    {
      icon: <Star size={16} />, iconColor: '#EAB308',
      title: 'Core Execution Philosophy',
      subtitle: 'The 6 Pillars',
      summary: 'Execution Pillars',
      body: (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {['Fast', 'Interactive', 'Physical', 'Engaging', 'Structured', 'Prepared'].map(t => <Tag key={t} type="gold">{t}</Tag>)}
          </div>
          <Divider />
          <div style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avoid</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {['Long explanations', 'Slow activities', 'Passive listening', 'Over-explaining'].map(t => <Tag key={t} type="red">✕ {t}</Tag>)}
          </div>
        </>
      )
    },
    {
      icon: <Smartphone size={16} />, iconColor: '#7DD3FC',
      title: 'Participation Prediction',
      subtitle: 'Know Before You Go',
      summary: 'Know Your Numbers Early',
      body: (
        <>
          <Bullet>Check attendance personally via WhatsApp before every session.</Bullet>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {['Estimate participation count', 'Improve preparation accuracy', 'Reduce last-minute uncertainty'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.55)' }}>
                <CheckCircle2 size={11} color="#4ade80" />{t}
              </div>
            ))}
          </div>
        </>
      )
    },
  ];

  return (
    <main style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '24px 16px 80px' : '48px 40px 80px' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: isMobile ? '32px' : '64px', textAlign: 'center' }}>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}
        >
          <Zap color="#EAB308" fill="#EAB308" size={isMobile ? 24 : 32} />
          <h1 style={{ margin: 0, fontSize: isMobile ? '28px' : '44px', fontWeight: '800', fontFamily: 'var(--font-serif)', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Anchor{' '}
            <span style={{ color: '#EAB308', fontStyle: 'italic' }}>Guidelines</span>
          </h1>
        </motion.div>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: '700', margin: 0 }}>
          Operational Excellence Protocols
        </p>
      </header>

      {/* ── Grid ── */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: isMobile ? '24px' : '32px',
        paddingBottom: '80px',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {sections.map((s, i) => (
          <motion.section 
            key={i} 
            className="premium-card-v9"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
             transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 } 
           }}
            whileHover={{ 
              y: -8, 
              scale: 1.025,
              transition: { delay: 0, type: 'spring', stiffness: 300, damping: 25, mass: 0.8 } 
            }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              padding: isMobile ? '20px' : '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '14px', 
              height: isMobile ? 'auto' : '380px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="shimmer-overlay-v9" />
            
            {/* Mirror Repository top accent bar */}
            <div 
              style={{ 
                position: 'absolute', 
                top: 0, left: 0, right: 0, height: '3px', 
                background: `linear-gradient(90deg, ${s.iconColor}, transparent)`,
                borderRadius: '20px 20px 0 0',
                zIndex: 2
              }} 
            />

            {/* Premium Watermark Numbering */}
            <div style={{ position: 'absolute', top: '20px', right: '24px', fontSize: '36px', fontWeight: '900', color: '#FFFFFF', opacity: 0.06, pointerEvents: 'none', zIndex: 1, fontFamily: 'var(--font-serif)' }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            
            {/* Card header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2 }}>
              <CardIcon icon={s.icon} color={s.iconColor} />
              <div>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFFFFF', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>{s.subtitle}</div>
              </div>
            </div>

            <Divider />

            <div className="compact-glass-scroll" style={{ flex: 1, position: 'relative', zIndex: 2, overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                {s.summary && <SummaryPill>{s.summary}</SummaryPill>}
                {s.body}
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* ── Footer Philosophy Pill ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, background: 'rgba(15, 19, 24, 0.9)', borderColor: 'rgba(255,255,255,0.2)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{ 
          marginTop: isMobile ? '32px' : '60px',
          padding: isMobile ? '14px 24px' : '20px 60px', 
          background: 'rgba(11, 13, 16, 0.8)', 
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)', 
          borderRadius: '999px', 
          textAlign: 'center', 
          position: 'relative', 
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)',
          cursor: 'default',
          marginBottom: '80px'
        }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '200px', height: '100%', background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <p style={{ 
          fontSize: isMobile ? '11px' : '15px', 
          fontWeight: '800', 
          color: 'rgba(255,255,255,0.5)', 
          fontFamily: 'var(--font-sans)', 
          letterSpacing: '0.15em', 
          margin: 0, 
          lineHeight: 1.4,
          textTransform: 'uppercase'
        }}>
          FAST &bull; <span style={{ color: 'var(--accent-gold)', textShadow: '0 0 15px rgba(234,179,8,0.3)' }}>INTERACTIVE</span> &bull; PHYSICAL &bull; ENGAGING &bull; STRUCTURED &bull; PREPARED
        </p>
      </motion.div>

      {/* Back to Top */}
      <AnimatePresence>
        {showRocket && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(20, 25, 30, 0.95)', borderColor: 'rgba(125, 211, 252, 0.5)', y: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            style={{
              position: 'fixed',
              bottom: isMobile ? '24px' : '40px',
              right: isMobile ? '18px' : '40px',
              width: isMobile ? '44px' : '56px',
              height: isMobile ? '44px' : '56px',
              background: 'rgba(15, 19, 24, 0.8)',
              backdropFilter: 'blur(32px) saturate(180%)',
              WebkitBackdropFilter: 'blur(32px) saturate(180%)',
              border: '1.5px solid rgba(125, 211, 252, 0.2)',
              borderRadius: '50%',
              color: 'var(--accent-silver)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 900,
              boxShadow: '0 12px 40px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.15)',
            }}
          >
            <ArrowUp size={isMobile ? 22 : 26} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
