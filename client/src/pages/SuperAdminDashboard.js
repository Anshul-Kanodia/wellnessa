import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
  const { user, getAuthHeaders } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);
  const [content, setContent] = useState([]);
  const [questionnaire, setQuestionnaire] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditContent, setShowEditContent] = useState(false);
  const [showEditQuestionnaire, setShowEditQuestionnaire] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    accessLevel: 1
  });

  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    category: '',
    content: ''
  });

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    category: '',
    difficulty: 'medium'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [usersRes, assessmentsRes, resultsRes, contentRes, questionnaireRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/assessments', { headers }),
        fetch('/api/admin/results', { headers }),
        fetch('/api/content', { headers }),
        fetch('/api/questionnaire', { headers })
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (assessmentsRes.ok) setAssessments(await assessmentsRes.json());
      if (resultsRes.ok) setResults(await resultsRes.json());
      if (contentRes.ok) setContent(await contentRes.json());
      if (questionnaireRes.ok) setQuestionnaire(await questionnaireRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setShowAddUser(false);
        setNewUser({ username: '', password: '', name: '', email: '', accessLevel: 1 });
        fetchData();
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (response.ok) {
          fetchData();
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    try {
      const url = selectedContent ? `/api/content/${selectedContent.id}` : '/api/content';
      const method = selectedContent ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(newContent)
      });

      if (response.ok) {
        setShowEditContent(false);
        setSelectedContent(null);
        setNewContent({ title: '', description: '', category: '', content: '' });
        fetchData();
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const url = selectedQuestion ? `/api/questionnaire/${selectedQuestion.id}` : '/api/questionnaire';
      const method = selectedQuestion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(newQuestion)
      });

      if (response.ok) {
        setShowEditQuestionnaire(false);
        setSelectedQuestion(null);
        setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0, category: '', difficulty: 'medium' });
        fetchData();
      }
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const getAccessLevelBadge = (level) => {
    const badges = {
      1: { text: 'User', class: 'badge-user' },
      2: { text: 'Admin', class: 'badge-admin' },
      3: { text: 'Super Admin', class: 'badge-superadmin' }
    };
    const badge = badges[level] || badges[1];
    return <span className={`access-badge ${badge.class}`}>{badge.text}</span>;
  };

  const renderOverview = () => (
    <div className="overview-grid">
      <div className="stat-card">
        <h3>Total Users</h3>
        <div className="stat-number">{users.length}</div>
      </div>
      <div className="stat-card">
        <h3>Total Assessments</h3>
        <div className="stat-number">{assessments.length}</div>
      </div>
      <div className="stat-card">
        <h3>Completed Results</h3>
        <div className="stat-number">{results.length}</div>
      </div>
      <div className="stat-card">
        <h3>Content Items</h3>
        <div className="stat-number">{content.length}</div>
      </div>
      <div className="stat-card">
        <h3>Questions</h3>
        <div className="stat-number">{questionnaire.length}</div>
      </div>
      <div className="stat-card">
        <h3>System Status</h3>
        <div className="stat-status">✅ Online</div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="user-management">
      <div className="section-header">
        <h3>User Management</h3>
        <button className="btn-primary" onClick={() => setShowAddUser(true)}>
          Add New User
        </button>
      </div>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Access Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{getAccessLevelBadge(user.accessLevel)}</td>
                <td>
                  <button 
                    className="btn-danger btn-small"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="content-management">
      <div className="section-header">
        <h3>Content Management</h3>
        <button className="btn-primary" onClick={() => {
          setSelectedContent(null);
          setNewContent({ title: '', description: '', category: '', content: '' });
          setShowEditContent(true);
        }}>
          Add New Content
        </button>
      </div>
      
      <div className="content-grid">
        {content.map(item => (
          <div key={item.id} className="content-card">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
            <div className="content-meta">
              <span className="category">{item.category}</span>
              <button 
                className="btn-secondary btn-small"
                onClick={() => {
                  setSelectedContent(item);
                  setNewContent(item);
                  setShowEditContent(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestionnaireManagement = () => (
    <div className="questionnaire-management">
      <div className="section-header">
        <h3>Questionnaire Management</h3>
        <button className="btn-primary" onClick={() => {
          setSelectedQuestion(null);
          setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0, category: '', difficulty: 'medium' });
          setShowEditQuestionnaire(true);
        }}>
          Add New Question
        </button>
      </div>
      
      <div className="questions-list">
        {questionnaire.map((q, index) => (
          <div key={q.id || index} className="question-card">
            <h4>{q.question}</h4>
            <div className="options">
              {q.options?.map((option, i) => (
                <div key={i} className={`option ${i === q.correctAnswer ? 'correct' : ''}`}>
                  {option}
                </div>
              ))}
            </div>
            <div className="question-meta">
              <span className="category">{q.category}</span>
              <span className="difficulty">{q.difficulty}</span>
              <button 
                className="btn-secondary btn-small"
                onClick={() => {
                  setSelectedQuestion(q);
                  setNewQuestion(q);
                  setShowEditQuestionnaire(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="superadmin-dashboard">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
        <p>Welcome back, {user?.name}! You have full system control.</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button 
          className={`tab ${activeTab === 'questionnaire' ? 'active' : ''}`}
          onClick={() => setActiveTab('questionnaire')}
        >
          Questionnaire
        </button>
        <button 
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'content' && renderContentManagement()}
        {activeTab === 'questionnaire' && renderQuestionnaireManagement()}
        {activeTab === 'results' && (
          <div className="results-section">
            <h3>Assessment Results</h3>
            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Assessment</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr key={result.id}>
                      <td>{result.userName}</td>
                      <td>{result.assessmentTitle}</td>
                      <td>{result.score}%</td>
                      <td>{new Date(result.completedAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${result.score >= 70 ? 'passed' : 'failed'}`}>
                          {result.score >= 70 ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
              <select
                value={newUser.accessLevel}
                onChange={(e) => setNewUser({...newUser, accessLevel: parseInt(e.target.value)})}
              >
                <option value={1}>User (Level 1)</option>
                <option value={2}>Admin (Level 2)</option>
                <option value={3}>Super Admin (Level 3)</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddUser(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      {showEditContent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedContent ? 'Edit Content' : 'Add New Content'}</h3>
            <form onSubmit={handleSaveContent}>
              <input
                type="text"
                placeholder="Title"
                value={newContent.title}
                onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newContent.description}
                onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={newContent.category}
                onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                required
              />
              <textarea
                placeholder="Content"
                value={newContent.content}
                onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                rows="5"
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditContent(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditQuestionnaire && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selectedQuestion ? 'Edit Question' : 'Add New Question'}</h3>
            <form onSubmit={handleSaveQuestion}>
              <input
                type="text"
                placeholder="Question"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                required
              />
              {newQuestion.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[index] = e.target.value;
                    setNewQuestion({...newQuestion, options: newOptions});
                  }}
                  required
                />
              ))}
              <select
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: parseInt(e.target.value)})}
              >
                <option value={0}>Option 1 (Correct)</option>
                <option value={1}>Option 2 (Correct)</option>
                <option value={2}>Option 3 (Correct)</option>
                <option value={3}>Option 4 (Correct)</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                required
              />
              <select
                value={newQuestion.difficulty}
                onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditQuestionnaire(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
