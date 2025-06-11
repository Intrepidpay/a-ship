import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ isAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.mobile-nav') && !e.target.closest('.hamburger')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo no-translate">
         <span className="color-1">Ajet</span>
         <span className="color-2">Ship</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/">Home</Link>
          <Link to="/shipping">Shipping</Link>
          <Link to="/support">Support</Link>
          <Link to="/about">About</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>

        {/* Mobile Hamburger */}
        <button 
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shipping" onClick={() => setMenuOpen(false)}>Shipping</Link>
          <Link to="/support" onClick={() => setMenuOpen(false)}>Support</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            {isAdmin ? 'Admin' : 'Login'}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
