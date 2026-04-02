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
    <main className="container-max" style={{ paddingBottom: 'var(--spacing-6)' }}>
      <style>{`
        .guidelines-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .guideline-card {
          background: var(--bg-panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.2s ease;
        }
        .guideline-card:hover {
          border-color: var(--accent);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .guideline-header {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-main);
        }
        .icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--accent-glow);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .guideline-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .guideline-list li {
          font-size: 13px;
          color: var(--text-secondary);
          padding-left: 20px;
          position: relative;
        }
        .guideline-list li::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--accent);
        }
        .guideline-list-small {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .guideline-list-small li {
          font-size: 11px;
          color: var(--text-dim);
          padding-left: 12px;
          position: relative;
        }
        .guideline-list-small li::before {
          content: '-';
          position: absolute;
          left: 0;
        }
        .quote-box {
          background: var(--bg-main);
          border-left: 3px solid var(--accent);
          padding: 10px 14px;
          font-style: italic;
          font-size: 12px;
          color: var(--text-dim);
        }
        .status-pill {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
        }
        .status-success { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .status-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        .note-box {
          display: flex;
          gap: 8px;
          padding: 10px;
          background: var(--bg-main);
          border-radius: 6px;
          font-size: 11px;
          color: var(--text-dim);
          align-items: flex-start;
        }
        .rule-box {
          padding: 10px;
          background: var(--bg-main);
          border-right: 3px solid #ef4444;
          font-size: 12px;
          color: var(--text-secondary);
        }
        .sub-card {
          padding: 12px;
          background: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: 8px;
        }
        .highlight-banner {
          padding: 10px;
          background: var(--bg-main);
          border-left: 3px solid #f97316;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
        }
        .principle-box {
          background: var(--accent);
          color: white;
          padding: 10px;
          border-radius: 6px;
          font-size: 12px;
          text-align: center;
        }
        .pill {
          font-size: 11px;
          padding: 4px 10px;
          background: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: 20px;
          color: var(--text-secondary);
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary);
        }
        .focus-box {
          background: var(--bg-main);
          border: 1px solid var(--accent);
          padding: 10px;
          border-radius: 6px;
          font-size: 12px;
          color: var(--text-secondary);
          text-align: center;
        }
        .tiny-pill {
          font-size: 10px;
          padding: 2px 6px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border-radius: 4px;
        }
        .tiny-pill-error {
          font-size: 10px;
          padding: 2px 6px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: 4px;
        }
      `}</style>

      {/* Header */}
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
          <Zap color="var(--accent)" fill="var(--accent)" size={24} />
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>SPIT Sessions</h1>
        </div>
        <p style={{ fontSize: '18px', color: 'var(--accent)', fontWeight: '600', marginBottom: '12px' }}>
          Key Execution Guidelines (PEL)
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-dim)', maxWidth: '600px', margin: '0 auto' }}>
          Facilitator execution playbook for high-fidelity social interaction and zero-loss engagement.
        </p>
      </header>

      <div className="guidelines-grid">
        {sections.map(section => (
          <section key={section.id} className="guideline-card">
            <div className="guideline-header">
              <div className="icon-wrapper">
                {section.icon}
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: '700' }}>{section.title}</h2>
            </div>
            <div className="guideline-content">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '24px', background: 'var(--bg-panel)', border: '1px solid var(--accent)', borderRadius: '16px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>Core Execution Philosophy</h3>
        <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>
          FAST • INTERACTIVE • PHYSICAL • ENGAGING • STRUCTURED • PREPARED
        </p>
      </div>

    </main>
  );
}
