import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const [profile, setProfile] = useState(null);
  const [dueAssessments, setDueAssessments] = useState([]);
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = getAuthHeaders();
      
      // Fetch user profile
      const profileRes = await fetch('/api/user/profile', { headers });
      const profileData = await profileRes.json();
      setProfile(profileData);

      // Fetch due assessments
      const assessmentsRes = await fetch('/api/user/assessments/due', { headers });
      const assessmentsData = await assessmentsRes.json();
      setDueAssessments(assessmentsData);

      // Fetch assessment results
      const resultsRes = await fetch('/api/user/results', { headers });
      const resultsData = await resultsRes.json();
      setResults(resultsData);

      // Fetch analytics
      const analyticsRes = await fetch('/api/user/analytics', { headers });
      const analyticsData = await analyticsRes.json();
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return '#28a745';
      case 'declining': return '#dc3545';
      case 'stable': return '#6c757d';
      default: return '#4A9B8E';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    if (score >= 40) return '#fd7e14';
    return '#dc3545';
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Track your health assessments and progress</p>
          </div>
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-value">{results.length}</div>
              <div className="stat-label">Assessments Taken</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{analytics?.latestScore || 'N/A'}</div>
              <div className="stat-label">Latest Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{dueAssessments.length}</div>
              <div className="stat-label">Due Assessments</div>
            </div>
          </div>
        </div>

        {/* Due Assessments */}
        {dueAssessments.length > 0 && (
          <div className="dashboard-section">
            <h2>📋 Assessments Due</h2>
            <div className="assessments-grid">
              {dueAssessments.map(assessment => (
                <div key={assessment.id} className="assessment-card due">
                  <div className="assessment-header">
                    <h3>{assessment.title}</h3>
                    <span className="due-badge">Due Now</span>
                  </div>
                  <p className="assessment-description">{assessment.description}</p>
                  <div className="assessment-meta">
                    <span>Questions: {assessment.groups.reduce((total, group) => 
                      total + group.subgroups.reduce((subTotal, subgroup) => 
                        subTotal + subgroup.questions.length, 0), 0)}</span>
                    <span>Est. Time: 10-15 min</span>
                  </div>
                  <Link 
                    to={`/assessment/${assessment.id}`} 
                    className="take-assessment-btn"
                  >
                    Take Assessment
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Assessment Schedule */}
        {profile?.nextAssessment && !profile.assessmentsDue && (
          <div className="dashboard-section">
            <h2>📅 Next Assessment</h2>
            <div className="schedule-card">
              <div className="schedule-info">
                <div className="schedule-date">
                  {formatDate(profile.nextAssessment)}
                </div>
                <div className="schedule-text">
                  <p>Your next assessment is scheduled for the date above.</p>
                  <p>We'll notify you when it becomes available.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics */}
        {analytics && analytics.trend !== 'no-data' && (
          <div className="dashboard-section">
            <h2>📊 Your Progress</h2>
            <div className="analytics-grid">
              <div className="analytics-card trend">
                <div className="analytics-header">
                  <h3>Trend Analysis</h3>
                  <div className="trend-indicator" style={{ color: getTrendColor(analytics.trend) }}>
                    {getTrendIcon(analytics.trend)} {analytics.trend.charAt(0).toUpperCase() + analytics.trend.slice(1)}
                  </div>
                </div>
                <div className="trend-stats">
                  <div className="trend-stat">
                    <span className="trend-value">{analytics.averageScore}%</span>
                    <span className="trend-label">Average Score</span>
                  </div>
                  <div className="trend-stat">
                    <span className="trend-value">{analytics.totalAssessments}</span>
                    <span className="trend-label">Total Assessments</span>
                  </div>
                </div>
              </div>

              <div className="analytics-card chart">
                <h3>Score History</h3>
                <div className="score-chart">
                  {analytics.scores.map((score, index) => (
                    <div key={index} className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ 
                          height: `${score.score}%`,
                          backgroundColor: getScoreColor(score.score)
                        }}
                      ></div>
                      <div className="score-date">{formatDate(score.date)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Results */}
        {results.length > 0 && (
          <div className="dashboard-section">
            <h2>📈 Recent Results</h2>
            <div className="results-table">
              <div className="table-header">
                <div>Assessment</div>
                <div>Date</div>
                <div>Score</div>
                <div>Feedback</div>
              </div>
              {results.slice(0, 5).map(result => (
                <div key={result.id} className="table-row">
                  <div className="result-assessment">Health Assessment</div>
                  <div className="result-date">{formatDate(result.completedAt)}</div>
                  <div className="result-score">
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

        {/* No Data State */}
        {results.length === 0 && dueAssessments.length === 0 && (
          <div className="no-data-state">
            <div className="no-data-icon">📋</div>
            <h3>No Assessments Yet</h3>
            <p>You haven't taken any assessments yet. Check back later for available assessments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
