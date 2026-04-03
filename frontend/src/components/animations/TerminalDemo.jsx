import React, { useState, useEffect } from 'react';

const TerminalDemo = () => {
  const [lines, setLines] = useState([]);
  
  const originalLines = [
    "> Initializing Neural Resume Scanner...",
    "> Establishing connecting to main frame...",
    "> Parsing PDF data streams...",
    "> Extracting entity keywords...",
    "> Running Gemini-2.5-flash semantic matching...",
    "> Generating actionable feedback...",
    "> Analysis complete! Match Score: 87%"
  ];

  useEffect(() => {
    let interval;
    let i = 0;
    interval = setInterval(() => {
      if (i < originalLines.length) {
        setLines(prev => [...prev, originalLines[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card" style={{ padding: '1rem', background: '#050505', border: '1px solid var(--primary-color)' }}>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
      </div>
      <div style={{ fontFamily: "'Share Tech Mono', monospace", color: 'var(--primary-color)', fontSize: '0.85rem' }}>
        {lines.map((l, i) => (
          <div key={i} className="animate-fade-in" style={{ marginBottom: '4px' }}>{l}</div>
        ))}
        {lines.length < originalLines.length && (
          <div style={{ display: 'inline-block', width: '8px', height: '14px', background: 'var(--primary-color)', animation: 'blink 1s infinite' }}></div>
        )}
      </div>
    </div>
  );
};

export default TerminalDemo;
