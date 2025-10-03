import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout, showNav = true }) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <div className="logo-placeholder">
              <span className="logo-text">Wellnessa</span>
              <span className="logo-icon">🏥</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        {showNav && (
          <nav className="nav-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            
            {user ? (
              <div className="user-menu">
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button onClick={onLogout} className="logout-btn">Logout</button>
                <span className="user-name">Hi, {user.name}</span>
              </div>
            ) : (
              <div className="auth-menu">
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link register-btn">Register</Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
