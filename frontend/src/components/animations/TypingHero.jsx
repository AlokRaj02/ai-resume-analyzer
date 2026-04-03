import React, { useState, useEffect } from 'react';

const TypingHero = ({ phrases, typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000 }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const currentPhrase = phrases[loopNum % phrases.length];

    if (isDeleting) {
      if (text.length === 0) {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        timer = setTimeout(() => {}, 500);
      } else {
        timer = setTimeout(() => {
          setText(currentPhrase.substring(0, text.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (text.length === currentPhrase.length) {
        timer = setTimeout(() => setIsDeleting(true), pauseTime);
      } else {
        timer = setTimeout(() => {
          setText(currentPhrase.substring(0, text.length + 1));
        }, typingSpeed);
      }
    }
    
    return () => clearTimeout(timer);
  }, [text, isDeleting, phrases, loopNum, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <span>{text}</span>
      <span className="cursor" style={{ 
        borderRight: '0.1em solid var(--primary-color)',
        animation: 'blink .75s step-end infinite',
        marginLeft: '2px'
      }}></span>
      <style>{`
        @keyframes blink {
          from, to { border-color: transparent }
          50% { border-color: var(--primary-color) }
        }
      `}</style>
    </div>
  );
};

export default TypingHero;
