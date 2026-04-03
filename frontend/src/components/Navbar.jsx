import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileSearch, Clock, Home, Palette, BookOpen, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, setTheme, themes } = useTheme();

  return (
    <>
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FileSearch className="text-primary" size={28} />
        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', marginRight: '1rem' }}>Resume AI</span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--success)', padding: '0.2rem 0.6rem', borderRadius: '4px', background: 'rgba(0,255,0,0.05)' }} className="hide-on-mobile">
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)', animation: 'pulse 2s infinite' }}></div>
          <span style={{ fontSize: '0.7rem', color: 'var(--success)', letterSpacing: '1px', fontFamily: 'var(--font-secondary)', textShadow: '0 0 5px var(--success)' }}>SYS_ONLINE</span>
        </div>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <Palette size={16} color="var(--primary-color)" />
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{
              background: 'transparent', border: 'none', color: 'var(--text-color)',
              fontFamily: 'var(--font-secondary)', fontSize: '0.9rem', outline: 'none',
              cursor: 'pointer', textTransform: 'capitalize'
            }}
          >
            {themes.map(t => (
              <option key={t} value={t} style={{ background: '#000' }}>{t.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="navbar-nav">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Home size={18} /> HUB
            </span>
          </Link>
          <Link to="/history" className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={18} /> ARCHIVE
            </span>
          </Link>
          <Link to="#" className="nav-link hide-on-mobile">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.7 }}>
              <BookOpen size={18} /> DOCS
            </span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.8rem', border: '1px solid var(--primary-color)', borderRadius: '4px', background: 'rgba(0, 204, 255, 0.1)' }}>
          <User size={16} color="var(--primary-color)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontFamily: 'var(--font-secondary)', textShadow: '0 0 5px var(--primary-color)' }}>[ GUEST_ACCESS ]</span>
        </div>
      </div>
    </nav>
    <style dangerouslySetInnerHTML={{__html: `
      @media (max-width: 900px) {
        .hide-on-mobile { display: none !important; }
        .navbar { padding: 1rem; }
      }
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.4; }
        100% { opacity: 1; }
      }
    `}} />
    </>
  );
};

export default Navbar;
