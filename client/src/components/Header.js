import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.accessLevel >= 3) return '/dashboard';
    if (user.accessLevel >= 2) return '/dashboard';
    return '/dashboard';
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <Link to="/" className="logo-link">
            <span className="logo-text">Wellnessa</span>
            <span className="logo-icon">🏥</span>
          </Link>
        </div>

        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          
          {user ? (
            <div className="user-menu">
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
              <span className="user-name">Hi, {user.name}</span>
            </div>
          ) : (
            <div className="auth-menu">
              <Link to="/login" className="nav-link">Login</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;