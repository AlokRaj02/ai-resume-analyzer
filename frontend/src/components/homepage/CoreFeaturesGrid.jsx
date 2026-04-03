import React from 'react';
import { Fingerprint, BrainCircuit, Target } from 'lucide-react';

const CoreFeaturesGrid = () => {
  const features = [
    {
      icon: Fingerprint,
      title: 'Deep Keyword Extraction',
      description: 'Identifies non-obvious semantic matches and core competencies missed by traditional parsers.'
    },
    {
      icon: BrainCircuit,
      title: 'Contextual NLP',
      description: 'Understand the nuanced relationship between experiences rather than just raw keyword counting.'
    },
    {
      icon: Target,
      title: 'Predictive Gap Analysis',
      description: 'Pinpoint exact missing requirements from the job description and receive actionable upgrade tips.'
    }
  ];

  return (
    <div style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-secondary)', letterSpacing: '2px', color: 'var(--primary-color)' }}>
        // CORE_ENGINE_CAPABILITIES
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="card animate-fade-in" style={{ animationDelay: `${0.2 + (idx * 0.1)}s`, padding: '2rem', textAlign: 'center' }}>
              <Icon size={40} style={{ color: 'var(--primary-color)', margin: '0 auto 1.5rem', filter: 'drop-shadow(0 0 10px var(--primary-color))' }} />
              <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>{feature.title.toUpperCase()}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoreFeaturesGrid;
