import React, { useState, useEffect } from 'react';
import {
  Video, Rocket, Wind, MessageCircle, Layers, CalendarCheck,
  Monitor, Heart, UserCheck, Timer, Layout, Globe, Star,
  Smartphone, CheckCircle2, AlertCircle, XCircle, Zap, ArrowRight
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
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 9px', background: s.bg, border: `0.5px solid ${s.border}`,
      borderRadius: '99px', fontSize: '10px', fontWeight: '700',
      color: s.color, whiteSpace: 'nowrap', letterSpacing: '0.02em'
    }}>{children}</span>
  );
};

const Bullet = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.55 }}>
    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-inactive)', marginTop: '7px', flexShrink: 0 }} />
    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{children}</span>
  </div>
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
    <div style={{
      borderLeft: `2.5px solid ${s.border}`, background: s.bg,
      padding: '8px 12px', borderRadius: '0 8px 8px 0',
      fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5
    }}>{children}</div>
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
  const staggerDelay = "0.1s"; // Define staggerDelay if needed for cards

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
      body: (
        <>
          <Callout type="warning">3–5 highly engaging starters needed — Simple. Low-effort. Instant interaction.</Callout>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px' }}>
              <div style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Quick Interaction</div>
              {['Colour you feel like?', 'Show 1 near object', 'Do something unique', 'Gesture game (dumb charades)'].map(t => <Bullet key={t}>{t}</Bullet>)}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px' }}>
              <div style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Fastest Fingers</div>
              {['Type names fastest', 'Team typing challenge', 'Touch body part (Nose/Ear)', 'Quick team formation'].map(t => <Bullet key={t}>{t}</Bullet>)}
            </div>
          </div>
        </>
      )
    },
    {
      icon: <Wind size={16} />, iconColor: 'var(--accent-silver)',
      title: 'Energy & Flow',
      subtitle: 'Session Momentum',
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
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 80px' }}>

      {/* ── Header ── */}
      <header style={{ marginBottom: '52px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Zap color="#EAB308" fill="#EAB308" size={26} />
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '800', fontFamily: 'var(--font-serif)', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Anchor{' '}
            <span style={{ color: '#EAB308', fontStyle: 'italic' }}>Guideline</span>
          </h1>
        </div>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.35em', fontWeight: '700', margin: 0 }}>
          Operational Excellence Protocols
        </p>
      </header>

      {/* ── 2-Column Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {sections.map((s, i) => (
          <section 
            key={i} 
            className="premium-card-v9"
            style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div className="shimmer-overlay-v9" />

            {/* Card header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 2 }}>
              <CardIcon icon={s.icon} color={s.iconColor} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', fontFamily: 'var(--font-serif)', lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>{s.subtitle}</div>
              </div>
              <div style={{ marginLeft: 'auto', width: '22px', height: '22px', borderRadius: '7px', background: `${s.iconColor}14`, border: `0.5px solid ${s.iconColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: s.iconColor, flexShrink: 0 }}>
                {i + 1}
              </div>
            </div>

            <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {s.body}
            </div>
          </section>
        ))}
      </div>

      {/* ── Footer Banner ── */}
      <div style={{ marginTop: '48px', padding: '28px 40px', background: 'rgba(234,179,8,0.04)', border: '0.5px solid rgba(234,179,8,0.15)', borderRadius: '18px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '400px', height: '100%', background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <p style={{ fontSize: '20px', fontWeight: '700', color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-serif)', letterSpacing: '0.04em', margin: 0 }}>
          FAST &bull; <span style={{ color: '#EAB308' }}>INTERACTIVE</span> &bull; PHYSICAL &bull; ENGAGING &bull; STRUCTURED &bull; PREPARED
        </p>
      </div>

      {/* Rocket Button */}
      <AnimatePresence>
        {showRocket && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={scrollToTop}
            className={`rocket-btn ${isLaunching ? 'rocket-animate' : ''}`}
            style={{ 
              position: 'fixed',
              bottom: '40px',
              right: '40px',
              zIndex: 1000
            }}
          >
            <Rocket size={24} style={{ transform: 'rotate(-45deg)' }} />
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
