import React from 'react';
import { UploadCloud, Search, Award } from 'lucide-react';

const ProcessTimeline = () => {
  const steps = [
    { title: "UPLOAD", icon: <UploadCloud size={24} />, desc: "Submit PDF/DOC and Job Spec" },
    { title: "ANALYZE", icon: <Search size={24} />, desc: "AI extracts deep context" },
    { title: "SCORE", icon: <Award size={24} />, desc: "Get match percentage" }
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '2rem' }}>
      <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
      
      {steps.map((step, i) => (
        <div key={i} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, animationDelay: `${i * 0.3}s` }}>
          <div style={{ 
            width: '50px', height: '50px', borderRadius: '50%', 
            background: 'var(--card-bg)', border: '2px solid var(--primary-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--primary-color)', boxShadow: '0 0 15px var(--glow-color)',
            marginBottom: '10px'
          }}>
            {step.icon}
          </div>
          <div style={{ fontFamily: 'var(--font-primary)', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-color)' }}>{step.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '100px', marginTop: '4px' }}>{step.desc}</div>
        </div>
      ))}
    </div>
  );
};

export default ProcessTimeline;
