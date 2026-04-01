import React from 'react';
import { 
  Zap, Target, Dice5, Flame, ClipboardList, CheckCircle2, 
  ArrowRight, Clock, MessageSquare, Move, Palette, Heart 
} from 'lucide-react';

export default function AnchorGuidelines() {
  return (
    <main className="container-max" style={{ paddingBottom: 'var(--spacing-6)' }}>
      {/* Header */}
      <header style={{ marginBottom: 'var(--spacing-5)', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Anchor Guidelines</h1>
        <p style={{ fontSize: '16px', color: 'var(--accent)', fontWeight: '600', marginBottom: '12px' }}>
          e-Socialize Session Delivery Principles
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Guidelines to help anchors run engaging, high-energy social interaction sessions.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-5)' }}>
        
        {/* Section 1: Core Execution Philosophy */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)', color: 'var(--text-main)' }}>1. Core Execution Philosophy</h2>
          <div className="builder-card" style={{ padding: 'var(--spacing-4)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: 'Fast', icon: <Zap size={20} color="var(--accent)" />, sub: '⚡' },
                { label: 'Interactive', icon: <Target size={20} color="var(--accent)" />, sub: '🎯' },
                { label: 'Physical', icon: <Dice5 size={20} color="var(--accent)" />, sub: '🎲' },
                { label: 'Engaging', icon: <Flame size={20} color="var(--accent)" />, sub: '🔥' },
                { label: 'Structured', icon: <ClipboardList size={20} color="var(--accent)" />, sub: '📋' },
                { label: 'Prepared', icon: <CheckCircle2 size={20} color="var(--accent)" />, sub: '✅' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>{item.label}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', padding: 'var(--spacing-3)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444', marginBottom: '12px', textTransform: 'uppercase' }}>Avoid:</h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><XIconSmall /> Long explanations</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><XIconSmall /> Slow activities</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><XIconSmall /> Passive listening</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><XIconSmall /> Over-explaining values</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Session Opening Flow */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>2. Session Opening Flow</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            {['High Energy Start', 'Quick Interaction Game', 'Micro Speaking Opportunity', 'Participation Begins'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <div style={{ flex: 1, padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>{step}</span>
                </div>
                {i < arr.length - 1 && <ArrowRight size={20} color="var(--text-dim)" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Section 3: First 10 Minutes Rule */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>3. First 10 Minutes Rule</h2>
          <div className="builder-card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700' }}>First 10 Minutes = Engagement Zone</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {[
                { label: '3–5 quick activities', icon: <Zap size={18} /> },
                { label: 'Simple tasks', icon: <ClipboardList size={18} /> },
                { label: 'Low effort', icon: <CheckCircle2 size={18} /> },
                { label: 'High interaction', icon: <MessageSquare size={18} /> },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ color: 'var(--accent)' }}>{item.icon}</div>
                  <span style={{ fontSize: '12px', fontWeight: '500' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Session Energy Rules */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>4. Session Energy Rules</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{ padding: '20px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#22c55e', marginBottom: '8px' }}>BEST</div>
              <div style={{ fontSize: '13px' }}>Short + High Engagement</div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid #f97316', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#f97316', marginBottom: '8px' }}>ACCEPTABLE</div>
              <div style={{ fontSize: '13px' }}>Long + High Engagement</div>
            </div>
            <div style={{ padding: '20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>AVOID</div>
              <div style={{ fontSize: '13px' }}>Long + Low Engagement</div>
            </div>
          </div>
        </section>

        {/* Section 5: Session Flow Structure */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>5. Session Flow Structure</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Opening', 'Warmup', 'Core Activity', 'Energy Boost', 'Reflection', 'Closing'].map((stage, i, arr) => (
              <div key={stage} style={{ 
                flex: 1, padding: '12px 4px', background: 'var(--bg-surface)', 
                borderBottom: '4px solid var(--border)', textAlign: 'center',
                borderLeft: i === 0 ? 'none' : '1px solid var(--border)',
                borderColor: i === 2 ? 'var(--accent)' : 'var(--border)'
              }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: i === 2 ? 'var(--accent)' : 'var(--text-dim)' }}>{stage}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-5)' }}>
          {/* Section 6: Speaking Goal */}
          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>6. Speaking Goal</h2>
            <div className="builder-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>MORE</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Micro Speaking</div>
                </div>
                <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-dim)' }}>LESS</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Long Talking</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['Small prompts', 'Quick sharing', 'Round participation'].map(t => (
                  <div key={t} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }}></div>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 7: Physical Engagement Principle */}
          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>7. Physical Engagement</h2>
            <div className="builder-card">
              <div style={{ padding: '12px', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', textAlign: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>Physical participation → Higher engagement</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Gesture games', icon: <Move size={16} /> },
                  { label: 'Show objects', icon: <Palette size={16} /> },
                  { label: 'Movement prompts', icon: <Dice5 size={16} /> },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: 'center', fontSize: '11px' }}>
                    <div style={{ marginBottom: '6px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'center' }}>{item.icon}</div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Section 8: Time Discipline */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>8. Time Discipline</h2>
          <div className="builder-card" style={{ padding: 'var(--spacing-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>
              <span>START (0 min)</span>
              <span style={{ color: 'var(--accent)' }}>IDEAL END (45 min)</span>
              <span style={{ color: '#ef4444' }}>MAX CAP (50 min)</span>
            </div>
            <div style={{ height: '12px', background: 'var(--bg-dark)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '85%', background: 'var(--accent)' }}></div>
              <div style={{ width: '10%', background: '#f97316' }}></div>
              <div style={{ width: '5%', background: '#ef4444' }}></div>
            </div>
            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
              Start on time • End on time • Never exceed 50 min
            </div>
          </div>
        </section>

        {/* Section 9: Culture Principle */}
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>9. Culture Principle</h2>
          <div className="builder-card" style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Show culture through facilitation, not through speeches.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div style={{ padding: '12px 24px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: '700', color: 'var(--accent)' }}>DESIGN</span>
              </div>
              <ArrowRight size={20} color="var(--text-dim)" />
              <div style={{ padding: '12px 24px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: '700', color: 'var(--accent)' }}>BEHAVIOR</span>
              </div>
              <ArrowRight size={20} color="var(--text-dim)" />
              <div style={{ padding: '12px 24px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: '700', color: 'var(--accent)' }}>EXPERIENCE</span>
              </div>
            </div>
          </div>
        </section>

      </div>

    </main>
  );
}

function XIconSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
