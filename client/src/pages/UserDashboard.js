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
    if (!dateString) return 'No date set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return 'Date error';
    }
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

        <div className="dashboard-content">
  {/* Due Assessments */}
  <div className="dashboard-section">
    <h3>Due Assessments</h3>
    {dueAssessments.length > 0 ? (
      <div className="due-assessments">
        {dueAssessments.map(assessment => (
          <div key={assessment.id} className="assessment-card">
            <h4>{assessment.title}</h4>
            <p>Due: {assessment.dueDate ? formatDate(assessment.dueDate) : 'No due date'}</p>
            <Link to={`/assessment/${assessment.id}`} className="btn-primary">
              Take Assessment
            </Link>
          </div>
        ))}
      </div>
    ) : (
      <p>No assessments due</p>
    )}
  </div>

  {/* Next Assessment */}
  <div className="dashboard-section">
    <h3>Next Scheduled Assessment</h3>
    <p>{profile?.nextAssessment ? formatDate(profile.nextAssessment) : 'No upcoming assessments'}</p>
  </div>

  {/* Recent Results */}
  <div className="dashboard-section">
    <h3>Recent Assessment Results</h3>
    {results.length > 0 ? (
      <div className="results-grid">
        {results.slice(0, 3).map(result => (
  <div key={result.id} className="result-card">
    <h4>Assessment {result.assessmentId}</h4>
    <div className="score" style={{ color: getScoreColor(result.percentage) }}>
      {result.percentage}%
    </div>
    <p>Completed: {formatDate(result.completedAt)}</p>
    <p className="feedback">{result.feedback}</p>
  </div>
))}
      </div>
    ) : (
      <p>No assessment results yet</p>
    )}
  </div>
</div>

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
        {analytics && analytics.trend !== 'no-data' && analytics.trend && (
          <div className="dashboard-section">
            <h2>📊 Your Progress</h2>
            <div className="analytics-grid">
              <div className="analytics-card trend">
                <div className="analytics-header">
                  <h3>Trend Analysis</h3>
                  <div className="trend-indicator" style={{ color: getTrendColor(analytics.trend) }}>
                  {getTrendIcon(analytics.trend)} {analytics.trend ? analytics.trend.charAt(0).toUpperCase() + analytics.trend.slice(1) : 'Unknown'}
                  </div>
                </div>
                <div className="trend-stats">
                  <div className="trend-stat">
                    <span className="trend-value">{analytics.averageScore || 0}%</span>
                    <span className="trend-label">Average Score</span>
                  </div>
                  <div className="trend-stat">
                    <span className="trend-value">{analytics.totalAssessments || 0}</span>
                    <span className="trend-label">Total Assessments</span>
                  </div>
                </div>
              </div>

              <div className="analytics-card chart">
                <h3>Score History</h3>
                <div className="score-chart">
                {analytics.scores && analytics.scores.length > 0 ? analytics.scores.map((score, index) => (
                    <div key={index} className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ 
                          height: `${score.score || 0}%`,
                          backgroundColor: getScoreColor(score.score || 0)
                        }}
                      ></div>
                      <div className="score-date">{score.date ? formatDate(score.date) : 'N/A'}</div>
                    </div>
                  )) : (
                    <div className="no-scores">No score history available</div>
                  )}
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
