import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Header = () => {
  const { theme, toggleTheme, favorites } = useApp();
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          🌍 Global Explorer
        </Link>
        
        <nav className="nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link 
            to="/favorites" 
            className={location.pathname === '/favorites' ? 'nav-link active' : 'nav-link'}
          >
            Favorites ({favorites.length})
          </Link>
        </nav>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default Header;