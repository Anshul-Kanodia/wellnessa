import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    accessLevel: 1
  });
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = getAuthHeaders();
      
      // Fetch users
      const usersRes = await fetch('/api/admin/users', { headers });
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch all assessment results
      const resultsRes = await fetch('/api/admin/results', { headers });
      const resultsData = await resultsRes.json();
      setResults(resultsData);

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      };

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers,
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers(prev => [...prev, createdUser]);
        setNewUser({
          username: '',
          password: '',
          email: '',
          name: '',
          accessLevel: 1
        });
        setShowAddUser(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccessLevelText = (level) => {
    switch (level) {
      case 3: return 'Super Admin';
      case 2: return 'Admin';
      case 1: return 'User';
      default: return 'Unknown';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    if (score >= 40) return '#fd7e14';
    return '#dc3545';
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.assessmentsDue).length;
    const completedAssessments = results.length;
    const avgScore = results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

    return { totalUsers, activeUsers, completedAssessments, avgScore };
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  const stats = getUserStats();

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-welcome">
            <h1>Admin Dashboard</h1>
            <p>Manage users and monitor assessment results</p>
          </div>
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.activeUsers}</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completedAssessments}</div>
              <div className="stat-label">Assessments</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.avgScore}%</div>
              <div className="stat-label">Avg Score</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 User Management
          </button>
          <button 
            className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            📊 Assessment Results
          </button>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>User Management</h2>
              <button 
                className="add-user-btn"
                onClick={() => setShowAddUser(true)}
              >
                + Add New User
              </button>
            </div>

            <div className="users-table">
              <div className="table-header">
                <div>Name</div>
                <div>Username</div>
                <div>Email</div>
                <div>Access Level</div>
                <div>Created</div>
                <div>Next Assessment</div>
                <div>Status</div>
              </div>
              {users.map(userItem => (
                <div key={userItem.id} className="table-row">
                  <div className="user-name">
                    <div className="user-avatar">
                      {userItem.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{userItem.name}</span>
                  </div>
                  <div className="user-username">{userItem.username}</div>
                  <div className="user-email">{userItem.email}</div>
                  <div className="user-access">
                    <span className={`access-badge level-${userItem.accessLevel}`}>
                      {getAccessLevelText(userItem.accessLevel)}
                    </span>
                  </div>
                  <div className="user-created">{formatDate(userItem.createdAt)}</div>
                  <div className="user-next-assessment">
                    {userItem.nextAssessment ? formatDate(userItem.nextAssessment) : 'N/A'}
                  </div>
                  <div className="user-status">
                    <span className={`status-badge ${userItem.assessmentsDue ? 'due' : 'current'}`}>
                      {userItem.assessmentsDue ? 'Assessment Due' : 'Up to Date'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assessment Results Tab */}
        {activeTab === 'results' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Assessment Results</h2>
              <div className="results-summary">
                Total Results: {results.length}
              </div>
            </div>

            <div className="results-table">
              <div className="table-header">
                <div>User</div>
                <div>Assessment</div>
                <div>Date</div>
                <div>Score</div>
                <div>Percentage</div>
                <div>Feedback</div>
              </div>
              {results.map(result => (
                <div key={result.id} className="table-row">
                  <div className="result-user">
                    <div className="user-avatar small">
                      {result.userName.charAt(0).toUpperCase()}
                    </div>
                    <span>{result.userName}</span>
                  </div>
                  <div className="result-assessment">Health Assessment</div>
                  <div className="result-date">{formatDate(result.completedAt)}</div>
                  <div className="result-score">{result.totalScore}/{result.maxScore}</div>
                  <div className="result-percentage">
                    <span 
                      className="score-badge"
                      style={{ backgroundColor: getScoreColor(result.percentage) }}
                    >
                      {result.percentage}%
                    </span>
                  </div>
                  <div className="result-feedback">{result.feedback}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Add New User</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowAddUser(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="add-user-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({...prev, name: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({...prev, username: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({...prev, password: e.target.value}))}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Access Level</label>
                  <select
                    value={newUser.accessLevel}
                    onChange={(e) => setNewUser(prev => ({...prev, accessLevel: parseInt(e.target.value)}))}
                  >
                    <option value={1}>User</option>
                    {user.accessLevel >= 3 && <option value={2}>Admin</option>}
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddUser(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
