import React, { useState } from 'react';
import { 
  Video, Rocket, Wind, MessageCircle, Layers, CalendarCheck, 
  Monitor, Heart, UserCheck, Timer, Layout, Globe, Star, 
  Smartphone, CheckCircle2, AlertCircle, XCircle, Zap, ArrowRight, TrendingUp, TrendingDown
} from 'lucide-react';

// --- Small reusable components ---

const Chip = ({ children, color = 'rgba(255,255,255,0.08)', textColor = 'rgba(255,255,255,0.6)', border = 'rgba(255,255,255,0.1)' }) => (
  <span style={{ display: 'inline-block', padding: '2px 8px', background: color, border: `0.5px solid ${border}`, borderRadius: '99px', fontSize: '10px', fontWeight: '700', color: textColor, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
    {children}
  </span>
);

const GreenChip = ({ children }) => <Chip color="rgba(34,197,94,0.1)" textColor="#22c55e" border="rgba(34,197,94,0.25)">{children}</Chip>;
const RedChip = ({ children }) => <Chip color="rgba(239,68,68,0.1)" textColor="#ef4444" border="rgba(239,68,68,0.25)">{children}</Chip>;
const OrangeChip = ({ children }) => <Chip color="rgba(249,115,22,0.1)" textColor="#F97316" border="rgba(249,115,22,0.25)">{children}</Chip>;
const BlueChip = ({ children }) => <Chip color="rgba(125,211,252,0.1)" textColor="#7DD3FC" border="rgba(125,211,252,0.25)">{children}</Chip>;
const GoldChip = ({ children }) => <Chip color="rgba(234,179,8,0.12)" textColor="#EAB308" border="rgba(234,179,8,0.3)">{children}</Chip>;

const MiniRule = ({ icon, color, label, children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '8px 10px', background: `${color}10`, border: `0.5px solid ${color}30`, borderRadius: '8px', fontSize: '11px', color: '#FFFFFF' }}>
    <div style={{ color, marginTop: '1px', flexShrink: 0 }}>{icon}</div>
    <div><span style={{ fontWeight: '700', color }}>{label}: </span>{children}</div>
  </div>
);

const FlowStep = ({ steps }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>
          {step}
        </div>
        {i < steps.length - 1 && <ArrowRight size={10} color="rgba(255,255,255,0.25)" />}
      </React.Fragment>
    ))}
  </div>
);

const Badge = ({ n }) => (
  <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(234,179,8,0.12)', border: '0.5px solid rgba(234,179,8,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span style={{ fontSize: '10px', fontWeight: '800', color: '#EAB308' }}>{n}</span>
  </div>
);

const SectionHeader = ({ icon, title, n }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
    <Badge n={n} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
      <div style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{icon}</div>
      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#FFFFFF', lineHeight: 1.3 }}>{title}</h3>
    </div>
  </div>
);

const Divider = () => <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />;

const BulletItem = ({ children }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>
    <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', marginTop: '6px', flexShrink: 0 }} />
    <span>{children}</span>
  </div>
);

export default function AnchorGuidelines() {
  const cardStyle = {
    background: 'rgba(11,13,16,0.85)',
    border: '0.5px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backdropFilter: 'blur(12px)',
    transition: 'border-color 0.2s'
  };

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 32px 80px', fontFamily: "var(--font-sans)" }}>
      
      {/* Header */}
      <header style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <Zap color="#EAB308" fill="#EAB308" size={24} />
          <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-serif)', background: 'linear-gradient(to right, #FFFFFF, #EAB308)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Anchor <span style={{ fontStyle: 'italic', opacity: 0.8 }}>Playbook</span>
          </h1>
        </div>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.35em', fontWeight: '700' }}>
          Operational Excellence Protocols
        </p>
      </header>

      {/* Grid of Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>

        {/* 1 - Camera Policy */}
        <div style={cardStyle}>
          <SectionHeader n={1} icon={<Video size={14} />} title="Camera Policy (Friendly but Firm)" />
          <Divider />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <GreenChip>Camera ON = High Engagement</GreenChip>
            <RedChip>No Camera = Low Engagement</RedChip>
          </div>
          <BulletItem>Cameras <strong style={{ color: '#FFFFFF' }}>ON</strong> from session 1. Linked to attendance.</BulletItem>
          <BulletItem>Communicate firmly but warmly.</BulletItem>
          <div style={{ padding: '8px 10px', background: 'rgba(125,211,252,0.05)', border: '0.5px solid rgba(125,211,252,0.15)', borderRadius: '8px', fontSize: '11px', fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
            "Social interaction sessions — cameras help everyone connect."
          </div>
        </div>

        {/* 2 - Session Opening */}
        <div style={cardStyle}>
          <SectionHeader n={2} icon={<Rocket size={14} />} title="Session Opening (First 10 Mins)" />
          <Divider />
          <BulletItem>3–5 <strong style={{ color: '#FFFFFF' }}>highly engaging</strong> starter activities needed. Simple, low-effort, instant interaction.</BulletItem>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '2px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>Quick Interaction</div>
              {['Color you feel?', 'Show 1 object near you', 'Gesture game', 'Something unique'].map(t => <BulletItem key={t}>{t}</BulletItem>)}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '8px', border: '0.5px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: '9px', fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '5px' }}>Fastest Fingers</div>
              {['Type names fastest', 'Team typing challenge', 'Touch body part', 'Quick team formation'].map(t => <BulletItem key={t}>{t}</BulletItem>)}
            </div>
          </div>
        </div>

        {/* 3 - Energy & Flow */}
        <div style={cardStyle}>
          <SectionHeader n={3} icon={<Wind size={14} />} title="Energy & Flow of Session" />
          <Divider />
          <div style={{ padding: '6px 10px', background: 'rgba(234,179,8,0.07)', border: '0.5px solid rgba(234,179,8,0.2)', borderRadius: '7px', fontSize: '11px', fontWeight: '600', color: '#EAB308' }}>
            Goal: Session feels lively, not slow
          </div>
          <FlowStep steps={['Opener', 'Main Activity', 'Transition', 'Close — No Dead Silence']} />
          <BulletItem>Don't stay on one activity too long.</BulletItem>
          <BulletItem>Keep transitions smooth and quick.</BulletItem>
          <MiniRule icon={<Zap size={11} />} color="#EAB308" label="CORE">Don't give students time to judge each other — keep engaging.</MiniRule>
        </div>

        {/* 4 - Session Design Principle (moved before speaking) */}
        <div style={cardStyle}>
          <SectionHeader n={4} icon={<Layout size={14} />} title="Activity Design Principle" />
          <Divider />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 10px', background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '7px', fontSize: '11px' }}>
              <CheckCircle2 size={12} color="#22c55e" /><strong style={{ color: '#22c55e' }}>BEST:</strong><span style={{ color: 'rgba(255,255,255,0.6)' }}>Short + High Engagement</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 10px', background: 'rgba(249,115,22,0.08)', border: '0.5px solid rgba(249,115,22,0.2)', borderRadius: '7px', fontSize: '11px' }}>
              <AlertCircle size={12} color="#F97316" /><strong style={{ color: '#F97316' }}>OK:</strong><span style={{ color: 'rgba(255,255,255,0.6)' }}>Long + High Engagement</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 10px', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '7px', fontSize: '11px' }}>
              <XCircle size={12} color="#ef4444" /><strong style={{ color: '#ef4444' }}>AVOID:</strong><span style={{ color: 'rgba(255,255,255,0.6)' }}>Long + Low Engagement</span>
            </div>
          </div>
        </div>

        {/* 5 - Speaking Participation */}
        <div style={cardStyle}>
          <SectionHeader n={5} icon={<MessageCircle size={14} />} title="Speaking Participation Goal" />
          <Divider />
          <BulletItem>After Session 1: students speak more, reduce hesitation, increase comfort.</BulletItem>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '2px' }}>
            {['Micro speaking moments', 'Small prompts', 'Quick sharing rounds', 'Name sharing', 'Group chats'].map(t => <BlueChip key={t}>{t}</BlueChip>)}
          </div>
        </div>

        {/* 6 - Standard Structure */}
        <div style={cardStyle}>
          <SectionHeader n={6} icon={<Layers size={14} />} title="Standard Session Structure" />
          <Divider />
          <BulletItem><strong style={{ color: '#FFFFFF' }}>Every session must include:</strong></BulletItem>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
            {['Word cloud activity', 'Session ratings', 'Interactive participation', 'Speaking opportunities'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>
                <CheckCircle2 size={10} color="#22c55e" /> {t}
              </div>
            ))}
          </div>
          <FlowStep steps={['Quick Open', 'Core Activity', 'Debrief', 'Word Cloud', 'Ratings']} />
        </div>

        {/* 7 - Preparation */}
        <div style={cardStyle}>
          <SectionHeader n={7} icon={<CalendarCheck size={14} />} title="Preparation Requirement" />
          <Divider />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <GreenChip>Prepared Anchor = Better Delivery</GreenChip>
            <RedChip>No Improv — Prepare Ahead</RedChip>
          </div>
          <BulletItem>Finalize all activities before session start.</BulletItem>
          <BulletItem>Do <strong style={{ color: '#ef4444' }}>NOT</strong> improvise everything live.</BulletItem>
          <MiniRule icon={<CheckCircle2 size={11} />} color="#22c55e" label="RULE">Prepared anchors consistently outperform spontaneous ones.</MiniRule>
        </div>

        {/* 8 - Experience Enhancement */}
        <div style={cardStyle}>
          <SectionHeader n={8} icon={<Monitor size={14} />} title="Experience Enhancement" />
          <Divider />
          <BulletItem>Encourage students to cast session to TV or join from a bigger screen.</BulletItem>
          <div style={{ marginTop: '4px', padding: '8px 10px', background: 'rgba(125,211,252,0.06)', border: '0.5px solid rgba(125,211,252,0.15)', borderRadius: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
            <strong style={{ color: '#7DD3FC' }}>REASON:</strong> Larger screen → better experience, engagement, and seriousness.
          </div>
        </div>

        {/* 9 - Engagement Philosophy */}
        <div style={cardStyle}>
          <SectionHeader n={9} icon={<Heart size={14} />} title="Engagement Philosophy" />
          <Divider />
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' }}>We are different and unconventional.</div>
          <BulletItem>Address awkwardness naturally through activity.</BulletItem>
          <BulletItem>Normalize participation — don't lecture about it.</BulletItem>
          <MiniRule icon={<Heart size={11} />} color="#F97316" label="FOCUS">Remove hesitation through interaction, not explanation.</MiniRule>
        </div>

        {/* 10 - Physical Involvement */}
        <div style={cardStyle}>
          <SectionHeader n={10} icon={<UserCheck size={14} />} title="Physical Involvement" />
          <Divider />
          <div style={{ padding: '6px 10px', background: 'rgba(34,197,94,0.07)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '7px', fontSize: '11px', fontWeight: '600', color: '#22c55e' }}>
            Physical involvement = Higher engagement
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '2px' }}>
            {['Gesture games', 'Touch activities', 'Show objects', 'Movement prompts'].map(t => <GreenChip key={t}>{t}</GreenChip>)}
          </div>
        </div>

        {/* 11 - Time Discipline */}
        <div style={cardStyle}>
          <SectionHeader n={11} icon={<Timer size={14} />} title="Time Discipline" />
          <Divider />
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(34,197,94,0.07)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '10px 4px' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#22c55e', fontFamily: 'var(--font-serif)' }}>45m</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}><ArrowRight size={12} color="rgba(255,255,255,0.2)" /></div>
            <div style={{ flex: 1, textAlign: 'center', background: 'rgba(239,68,68,0.07)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '10px 4px' }}>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Max Limit</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#ef4444', fontFamily: 'var(--font-serif)' }}>50m</div>
            </div>
          </div>
          <BulletItem>Start on time. End on time. No overextension.</BulletItem>
        </div>

        {/* 12 - Culture Communication */}
        <div style={cardStyle}>
          <SectionHeader n={12} icon={<Globe size={14} />} title="Culture Communication" />
          <Divider />
          <BulletItem><strong style={{ color: '#ef4444' }}>Don't</strong> repeatedly talk about Respect, Equality, No Judgment.</BulletItem>
          <div style={{ padding: '7px 10px', background: 'rgba(234,179,8,0.07)', border: '0.5px solid rgba(234,179,8,0.2)', borderRadius: '7px', fontSize: '11px', fontWeight: '600', color: '#EAB308' }}>
            Show culture through design, not speeches.
          </div>
          <BulletItem>Values should reflect naturally through how you facilitate.</BulletItem>
        </div>

        {/* 13 - Core Execution */}
        <div style={cardStyle}>
          <SectionHeader n={13} icon={<Star size={14} />} title="Core Execution Philosophy" />
          <Divider />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {['Fast', 'Interactive', 'Physical', 'Engaging', 'Structured', 'Prepared'].map(t => <GoldChip key={t}>{t}</GoldChip>)}
          </div>
          <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {['Long explanations', 'Slow activities', 'Passive listening', 'Over-explaining'].map(t => <RedChip key={t}>✕ {t}</RedChip>)}
          </div>
        </div>

        {/* 14 - Participation Prediction */}
        <div style={cardStyle}>
          <SectionHeader n={14} icon={<Smartphone size={14} />} title="Participation Prediction" />
          <Divider />
          <BulletItem>Check attendance personally via WhatsApp before session.</BulletItem>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px' }}>
            {['Estimate participation count', 'Improve preparation accuracy', 'Reduce last-minute uncertainty'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.55)' }}>
                <CheckCircle2 size={10} color="#22c55e" /> {t}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Banner */}
      <div style={{ marginTop: '48px', padding: '28px 32px', background: 'rgba(234,179,8,0.04)', border: '0.5px solid rgba(234,179,8,0.15)', borderRadius: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '20px', fontWeight: '700', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-serif)', letterSpacing: '0.04em', margin: 0 }}>
          FAST &bull; <span style={{ color: '#EAB308' }}>INTERACTIVE</span> &bull; PHYSICAL &bull; ENGAGING &bull; STRUCTURED &bull; PREPARED
        </p>
      </div>

    </main>
  );
}
