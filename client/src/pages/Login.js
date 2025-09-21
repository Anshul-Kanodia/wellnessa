import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const demoCredentials = [
    { username: 'user1', password: 'user123', role: 'User (Level 1)' },
    { username: 'admin1', password: 'admin123', role: 'Admin (Level 2)' },
    { username: 'superadmin', password: 'super123', role: 'Super Admin (Level 3)' }
  ];

  const fillCredentials = (cred) => {
    setUsername(cred.username);
    setPassword(cred.password);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">W</div>
              <h1>Wellnessa</h1>
            </div>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="demo-section">
            <h3>Demo Credentials</h3>
            <p>Click on any credential to auto-fill the form:</p>
            <div className="demo-credentials">
              {demoCredentials.map((cred, index) => (
                <div 
                  key={index} 
                  className="demo-card"
                  onClick={() => fillCredentials(cred)}
                >
                  <div className="demo-role">{cred.role}</div>
                  <div className="demo-creds">
                    <span>Username: {cred.username}</span>
                    <span>Password: {cred.password}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="login-info">
          <h2>Welcome to Wellnessa Assessment Platform</h2>
          <div className="features">
            <div className="feature">
              <div className="feature-icon">👤</div>
              <div className="feature-text">
                <h3>User Access</h3>
                <p>Take assessments, view scores, and track your health progress</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">👨‍💼</div>
              <div className="feature-text">
                <h3>Admin Access</h3>
                <p>Manage users, view all assessment results, and create schedules</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">⚙️</div>
              <div className="feature-text">
                <h3>Super Admin Access</h3>
                <p>Full platform control, content management, and assessment configuration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
