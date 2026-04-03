import React from 'react';

const TechTicker = () => {
  const techs = [
    "REACT", "VITE", "NODE.JS", "EXPRESS", "MONGODB", "POSTGRESQL", "TAILWIND", 
    "GEMINI AI", "OPENAI", "AWS", "DOCKER", "KUBERNETES", "GRAPHQL", "TYPESCRIPT"
  ];
  
  return (
    <div style={{
      width: '100%',
      overflow: 'hidden',
      background: 'rgba(0,0,0,0.4)',
      borderTop: '1px solid var(--border-color)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.5rem 0',
      display: 'flex',
      whiteSpace: 'nowrap'
    }}>
      <style>{`
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .ticker-text {
          display: inline-block;
          animation: ticker 25s linear infinite;
          font-family: var(--font-primary);
          color: var(--primary-color);
          font-size: 0.9rem;
          letter-spacing: 2px;
          opacity: 0.7;
        }
      `}</style>
      <div className="ticker-text">
        {(techs.join(' // ') + ' // ').repeat(4)}
      </div>
    </div>
  );
};

export default TechTicker;
