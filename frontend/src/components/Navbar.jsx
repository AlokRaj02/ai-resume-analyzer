import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileSearch, Clock, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FileSearch className="text-primary" size={28} />
        <span>AI Resume Analyzer</span>
      </Link>
      <div className="navbar-nav">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Home size={18} /> Home
          </span>
        </Link>
        <Link 
          to="/history" 
          className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={18} /> History
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
