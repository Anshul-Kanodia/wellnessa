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
    if (user.accessLevel >= 3) return '/superadmin';
    if (user.accessLevel >= 2) return '/admin';
    return '/dashboard';
  };

  const getAccessLevelText = () => {
    if (!user) return '';
    switch (user.accessLevel) {
      case 3: return 'Super Admin';
      case 2: return 'Admin';
      case 1: return 'User';
      default: return '';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-icon">W</div>
          <span className="logo-text">Wellnessa</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          
          {user ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              {user.accessLevel >= 2 && (
                <Link to="/admin" className="nav-link">Admin</Link>
              )}
              {user.accessLevel >= 3 && (
                <Link to="/superadmin" className="nav-link">Super Admin</Link>
              )}
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </nav>
        
        <div className="user-section">
          {user ? (
            <div className="user-info">
              <div className="user-avatar">
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{getAccessLevelText()}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
