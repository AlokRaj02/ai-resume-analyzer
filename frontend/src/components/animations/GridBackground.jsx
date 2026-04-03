import React from 'react';

const GridBackground = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 0, pointerEvents: 'none',
      opacity: 0.3,
      backgroundImage: `radial-gradient(var(--text-muted) 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
      maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
    }} />
  );
};

export default GridBackground;
