import React from 'react';
import { Database, ShieldCheck, Zap } from 'lucide-react';

const GlobalStats = () => {
  const stats = [
    { label: 'ATS Bypass Success', value: '94.2%', icon: ShieldCheck, color: 'var(--success)' },
    { label: 'Profiles Indexed', value: '1.2M+', icon: Database, color: 'var(--primary-color)' },
    { label: 'Analysis Speed', value: '< 2.4s', icon: Zap, color: 'var(--warning)' }
  ];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginTop: '3rem', marginBottom: '2rem' }}>
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="card animate-fade-in" style={{ animationDelay: `${idx * 0.15}s`, display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem 2.5rem', minWidth: '260px' }}>
            <div style={{ padding: '0.8rem', borderRadius: '50%', background: `rgba(255,255,255,0.05)`, border: `1px solid ${stat.color}` }}>
              <Icon size={28} color={stat.color} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-color)', fontFamily: 'var(--font-secondary)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label.toUpperCase()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GlobalStats;
