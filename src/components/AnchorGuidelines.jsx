import React from 'react';
import { 
  Video, Rocket, Wind, MessageCircle, Layers, CalendarCheck, 
  Monitor, Heart, UserCheck, Timer, Layout, Globe, Star, 
  Smartphone, CheckCircle2, AlertCircle, XCircle, Zap
} from 'lucide-react';

export default function AnchorGuidelines() {
  const sections = [
    {
      id: 1,
      title: "Camera Policy (Friendly but Firm)",
      accent: 'var(--glow-blue)',
      icon: <Video size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ul className="guideline-list">
            <li>Students should keep cameras <strong>ON</strong> from the first session itself.</li>
            <li>Attendance should be linked to camera participation (except genuine technical issues).</li>
            <li>Communicate this in a friendly but firm tone.</li>
          </ul>
          <div className="quote-box">
            "We keep cameras on because these are social interaction sessions, not lectures. It helps everyone connect better."
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <div className="status-pill status-success">Camera ON = High Engagement</div>
            <div className="status-pill status-error">No Camera = Low Engagement</div>
          </div>
          <div className="note-box">
            <AlertCircle size={14} />
            <span>When someone is speaking, others may turn cameras off if mediator suggests to reduce distraction.</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Session Opening Strategy (First 10 Mins)",
      accent: 'var(--glow-gold)',
      icon: <Rocket size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>We need 3–5 highly engaging starter activities which are Simple, Low-effort, and Create instant interaction.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="sub-card">
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '8px' }}>QUICK INTERACTION</h4>
              <ul className="guideline-list-small">
                <li>Which colour do you feel like?</li>
                <li>Show 1 object near you</li>
                <li>Do something unique (tongue to nose etc)</li>
                <li>Gesture games (mini dumb charades)</li>
              </ul>
            </div>
            <div className="sub-card">
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '8px' }}>FASTEST FINGERS</h4>
              <ul className="guideline-list-small">
                <li>Type names on screen fastest</li>
                <li>Team typing challenge</li>
                <li>Touch the body part (Nose/Ear)</li>
                <li>Quick team formation</li>
              </ul>
            </div>
          </div>
          <div className="rule-box">
            <strong>IMPORTANT RULE:</strong> Games should be Short + High engagement (Best) or Long + High engagement (Acceptable). Avoid Long + Low engagement.
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Energy & Flow of Session",
      accent: 'var(--glow-pink)',
      icon: <Wind size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="highlight-banner">Main objective: Session should feel lively, not slow.</div>
          <ul className="guideline-list">
            <li>Do not stay on one activity too long.</li>
            <li>Maintain pace even with multiple activities.</li>
            <li>Keep transitions smooth and quick.</li>
            <li>Avoid dead silence. Keep students involved.</li>
          </ul>
          <div className="principle-box">
            <strong>CORE PRINCIPLE:</strong> Do not give students time to judge each other — keep them engaged.
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Speaking Participation Goal",
      icon: <MessageCircle size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Outcome after Session 1: Students start speaking more, reduce hesitation, and increase comfort.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <div className="pill">Micro speaking opportunities</div>
            <div className="pill">Small prompts</div>
            <div className="pill">Quick sharing rounds</div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Standard Structure After Session 1",
      icon: <Layers size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>EVERY SESSION MUST INCLUDE:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="check-item"><CheckCircle2 size={14} color="var(--accent)" /> Word cloud activity</div>
            <div className="check-item"><CheckCircle2 size={14} color="var(--accent)" /> Session ratings</div>
            <div className="check-item"><CheckCircle2 size={14} color="var(--accent)" /> Interactive participation</div>
            <div className="check-item"><CheckCircle2 size={14} color="var(--accent)" /> Speaking opportunities</div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Preparation Requirement",
      icon: <CalendarCheck size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ul className="guideline-list">
            <li>Prepare sessions beforehand.</li>
            <li>Finalize activities before session.</li>
            <li>Do NOT improvise everything live.</li>
          </ul>
          <div className="rule-box" style={{ borderColor: 'var(--accent)' }}>
            <strong>RULE:</strong> Prepared anchors perform better than spontaneous anchors.
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Experience Enhancement Ideas",
      icon: <Monitor size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Encourage students to Cast session to TV or join from bigger screens.</p>
          <div className="note-box" style={{ background: 'rgba(255, 122, 47, 0.05)' }}>
            <strong>REASON:</strong> Improves Experience, Engagement, and Seriousness toward session.
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Engagement Philosophy",
      icon: <Heart size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600' }}>We are different and unconventional.</p>
          <ul className="guideline-list">
            <li>Address awkwardness naturally.</li>
            <li>Reduce social oddness through interaction.</li>
            <li>Normalize participation.</li>
          </ul>
          <div className="focus-box">
            <strong>FOCUS:</strong> Remove hesitation through activity, not lecture. Make interaction natural.
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "Physical Involvement Requirement",
      icon: <UserCheck size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="highlight-banner" style={{ borderLeftColor: '#22c55e' }}>Physical involvement = Higher engagement.</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Examples: Gesture games, Touch activities, Show objects, Movement prompts.</p>
        </div>
      )
    },
    {
      id: 10,
      title: "Time Discipline",
      icon: <Timer size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>DURATION</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>45 Min</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>MAX LIMIT</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ef4444' }}>50 Min</div>
            </div>
          </div>
          <ul className="guideline-list">
            <li>Start on time. End on time.</li>
            <li>No overextension. Professional delivery matters.</li>
          </ul>
        </div>
      )
    },
    {
      id: 11,
      title: "Session Design Principle",
      icon: <Layout size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '6px', fontSize: '12px' }}>
              <CheckCircle2 size={14} /> <strong>BEST:</strong> Short + High Engagement
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(255, 122, 47, 0.1)', color: 'var(--accent)', borderRadius: '6px', fontSize: '12px' }}>
              <AlertCircle size={14} /> <strong>ACCEPTABLE:</strong> Long + High Engagement
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '6px', fontSize: '12px' }}>
              <XCircle size={14} /> <strong>AVOID:</strong> Long + Low Engagement
            </div>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "Culture Communication Approach",
      icon: <Globe size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>We do NOT need to repeatedly talk about Respect, Equality, or No judgment.</p>
          <div className="highlight-banner" style={{ borderLeftColor: 'var(--accent)' }}>Show culture through design, not speeches.</div>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Behavior should demonstrate values. Culture should reflect naturally through facilitation.</p>
        </div>
      )
    },
    {
      id: 13,
      title: "Core Execution Philosophy",
      icon: <Star size={20} />,
      content: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="sub-card" style={{ borderColor: '#22c55e' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px' }}>KEEP IT</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {['Fast', 'Interactive', 'Physical', 'Engaging', 'Structured', 'Prepared'].map(t => <span key={t} className="tiny-pill">{t}</span>)}
            </div>
          </div>
          <div className="sub-card" style={{ borderColor: '#ef4444' }}>
            <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>AVOID</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {['Long explanations', 'Slow activities', 'Passive listening', 'Over explaining'].map(t => <span key={t} className="tiny-pill-error">{t}</span>)}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: "Participation Prediction",
      icon: <Smartphone size={20} />,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Predict attendance by checking personally through WhatsApp.</p>
          <div className="check-item"><CheckCircle2 size={14} color="var(--accent)" /> Estimate participation</div>
          <div className="check-item"><CheckCircle2 size={14} color="var(--accent)" /> Improve preparation</div>
          <div className="check-item"><CheckCircle2 size={14} color="var(--accent)" /> Reduce uncertainty</div>
        </div>
      )
    }
  ];

  return (
    <main className="container-max v8-theme" style={{ padding: '60px 0', minHeight: '100vh' }}>
      <style>{`
        .guidelines-grid-v9 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }
 
        .guideline-card-v9 {
          background: var(--card-grad);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 0.5px solid var(--border-main);
          border-radius: 24px;
          padding: 32px;
          transition: all 0.4s var(--smooth);
          position: relative;
          overflow: hidden;
        }
 
        .guideline-card-v9:hover {
          background: linear-gradient(145deg, #11161C, #0C1015);
          border-color: var(--border-accent);
          transform: translateY(-4px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
        }
 
        .v9-guideline-header {
          font-family: var(--font-serif);
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 20px;
        }
 
        .v9-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
 
        .v9-list li {
          font-size: 14px;
          color: var(--text-secondary);
          padding-left: 24px;
          position: relative;
          line-height: 1.6;
        }
 
        .v9-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10px;
          width: 6px;
          height: 1px;
          background: var(--text-primary);
          opacity: 0.4;
        }
 
        .v9-quote {
          background: rgba(255, 255, 255, 0.03);
          border-left: 2px solid var(--accent-silver);
          padding: 16px 20px;
          font-style: italic;
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 16px;
          border-radius: 0 12px 12px 0;
        }

        .v7-subcard {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
        }

        .v7-highlight {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-left: 3px solid #FFFFFF;
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
        }
      `}</style>

      {/* Header */}
      <header style={{ marginBottom: '60px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px' }}>
          <Zap color="var(--accent-gold)" fill="var(--accent-gold)" size={28} />
          <h1 style={{ fontSize: '42px', fontWeight: '800', fontFamily: 'var(--font-serif)', background: 'linear-gradient(to right, #FFF, var(--accent-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Anchor <span style={{ fontStyle: 'italic', opacity: 0.7 }}>Playbook</span>
          </h1>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4em', fontWeight: '700' }}>
          Operational Excellence Protocols
        </p>
      </header>
 
      <div className="guidelines-grid-v9">
        {sections.map(section => (
          <section key={section.id} className="guideline-card-v9" style={{ boxShadow: section.accent ? `0 0 40px ${section.accent}` : 'none' }}>
            <div style={{ 
              width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', 
              color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              marginBottom: '20px', border: '0.5px solid var(--border-soft)'
            }}>
              {section.icon}
            </div>
            <h2 className="v9-guideline-header">{section.title}</h2>
            <div className="guideline-content" style={{ position: 'relative', zIndex: 2 }}>
              {section.content}
            </div>
          </section>
        ))}
      </div>
 
      <div style={{ marginTop: '60px', padding: '60px 40px', background: 'var(--bg-panel)', border: '0.5px solid var(--border-main)', borderRadius: '32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, var(--glow-gold), transparent)', opacity: 0.1 }}></div>
        <h3 style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '0.3em' }}>System Core Philosophy</h3>
        <p style={{ fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-serif)', letterSpacing: '0.05em' }}>
          FAST • <span style={{ color: 'var(--accent-gold)' }}>INTERACTIVE</span> • PHYSICAL • ENGAGING • STRUCTURED • PREPARED
        </p>
      </div>

    </main>
  );
}
