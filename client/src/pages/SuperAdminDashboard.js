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
  const [questions, setQuestions] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditContent, setShowEditContent] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [showEditQuestionnaire, setShowEditQuestionnaire] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  // Add these new state variables
  const [allContent, setAllContent] = useState({ home: {}, about: {} });
  const [editingSection, setEditingSection] = useState(null);
  const [sectionContent, setSectionContent] = useState({});

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
    assessmentId: '',
    groupName: '',
    subgroupName: '',
    options: [
      { text: '', score: 0 },
      { text: '', score: 0 },
      { text: '', score: 0 },
      { text: '', score: 0 }
    ]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = getAuthHeaders();
      
      const [usersRes, assessmentsRes, resultsRes, questionsRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/assessments', { headers }),
        fetch('/api/admin/results', { headers }),
        fetch('/api/admin/questions', { headers })
      ]);

      if (questionsRes.ok) setQuestions(await questionsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (assessmentsRes.ok) setAssessments(await assessmentsRes.json());
      if (resultsRes.ok) setResults(await resultsRes.json());
      
      // Fetch content
      await fetchAllContent();
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

    // Add this function to fetch all content
    const fetchAllContent = async () => {
      try {
        const headers = getAuthHeaders();
        const response = await fetch('/api/content/all', { headers });
        if (response.ok) {
          const content = await response.json();
          setAllContent(content);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };
  
    // Add this function to handle section editing
    const handleEditSection = (page, section) => {
      setEditingSection({ page, section });
      setSectionContent(allContent[page][section] || {});
      setShowEditContent(true);
    };

    const handleAssignAssessment = async (userId, assessmentId) => {
      if (!assessmentId) return;
      
      try {
        const response = await fetch('/api/admin/assign-assessment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({
            userId,
            assessmentId,
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Due tomorrow
          })
        });
    
        if (response.ok) {
          alert('Assessment assigned successfully!');
          fetchData(); // Refresh data
        }
      } catch (error) {
        console.error('Error assigning assessment:', error);
      }
    };  

    const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(newQuestion)
      });
      if (response.ok) {
        setShowAddQuestion(false);
        setNewQuestion({
          question: '', assessmentId: '', groupName: '', subgroupName: '',
          options: [{ text: '', score: 0 }, { text: '', score: 0 }, { text: '', score: 0 }, { text: '', score: 0 }]
        });
        fetchData();
        alert('Question added successfully!');
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };
  
  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(`/api/admin/questions/${questionId}`, {
          method: 'DELETE', headers: getAuthHeaders()
        });
        if (response.ok) {
          setQuestions(prev => prev.filter(q => q.id !== questionId));
          alert('Question deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    try {
      if (!editingSection) return;
      
      const { page, section } = editingSection;
      const updatedPageContent = {
        ...allContent[page],
        [section]: sectionContent
      };

      const response = await fetch(`/api/content/${page}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(updatedPageContent)
      });

      if (response.ok) {
        setShowEditContent(false);
        setEditingSection(null);
        setSectionContent({});
        fetchAllContent(); // Refresh content
        alert('Content updated successfully!');
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
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Access Level</th>
                <th>Created</th>
                <th>Next Assessment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{getAccessLevelBadge(user.accessLevel)}</td>
                  <td>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</td>
                  <td>{user.nextAssessment ? formatDate(user.nextAssessment) : 'No Assessment'}</td>
                  <td>{user.assessmentsDue ? 'Assessment Due' : 'Up to Date'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-danger btn-small"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                      <select 
                        onChange={(e) => handleAssignAssessment(user.id, e.target.value)}
                        defaultValue=""
                        className="assign-select"
                      >
                        <option value="">Assign Assessment</option>
                        {assessments.map(assessment => (
                          <option key={assessment.id} value={assessment.id}>
                            {assessment.title}
                          </option>
                        ))}
                      </select>
                    </div>
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
        <p>Edit content for all website sections</p>
      </div>
      
      <div className="content-sections">
        {/* Home Page Sections */}
        <div className="page-section">
          <h4>🏠 Home Page</h4>
          <div className="content-grid">
            <div className="content-card" onClick={() => handleEditSection('home', 'hero')}>
              <h5>Hero Section</h5>
              <p>Main title and subtitle</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
            
            <div className="content-card" onClick={() => handleEditSection('home', 'product')}>
              <h5>Product Section</h5>
              <p>Product description and features</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
            
            <div className="content-card" onClick={() => handleEditSection('home', 'howItWorks')}>
              <h5>How It Works</h5>
              <p>Step-by-step process</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
            
            <div className="content-card" onClick={() => handleEditSection('home', 'testimonials')}>
              <h5>Testimonials</h5>
              <p>Customer testimonials</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
          </div>
        </div>
  
        {/* About Page Sections */}
        <div className="page-section">
          <h4>ℹ️ About Page</h4>
          <div className="content-grid">
            <div className="content-card" onClick={() => handleEditSection('about', 'hero')}>
              <h5>About Hero</h5>
              <p>About page introduction</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
            
            <div className="content-card" onClick={() => handleEditSection('about', 'whyWellnessa')}>
              <h5>Why Wellnessa</h5>
              <p>Company value proposition</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
            
            <div className="content-card" onClick={() => handleEditSection('about', 'monitorPatient')}>
              <h5>Monitor Patient</h5>
              <p>Remote monitoring features</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
            
            <div className="content-card" onClick={() => handleEditSection('about', 'values')}>
              <h5>Our Values</h5>
              <p>Company values and beliefs</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
            
            <div className="content-card" onClick={() => handleEditSection('about', 'team')}>
              <h5>Our Team</h5>
              <p>Team member information</p>
              <button className="btn-secondary btn-small">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestionnaireManagement = () => (
    <div className="questionnaire-management">
      <div className="section-header">
        <h3>Questionnaire Management</h3>
        <button className="btn-primary" onClick={() => setShowAddQuestion(true)}>
          Add New Question
        </button>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr><th>Question</th><th>Assessment</th><th>Group</th><th>Subgroup</th><th>Options</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {questions.length > 0 ? questions.map(question => (
              <tr key={question.id}>
                <td style={{maxWidth: '300px', wordWrap: 'break-word'}}>{question.question}</td>
                <td>{question.assessmentTitle}</td>
                <td>{question.groupName}</td>
                <td>{question.subgroupName}</td>
                <td>{question.options?.length || 0} options</td>
                <td><button className="btn-danger btn-small" onClick={() => handleDeleteQuestion(question.id)}>Delete</button></td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>No questions found. Add your first question to get started.</td></tr>
            )}
          </tbody>
        </table>
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

      {/* Add Question Modal */}
{showAddQuestion && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Add New Question</h3>
      <form onSubmit={handleAddQuestion}>
        <div className="form-group">
          <label>Question Text</label>
          <textarea
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            required
            rows="3"
            placeholder="Enter your question here..."
          />
        </div>
        
        <div className="form-group">
  <label>Select Category</label>
  <select
    value={newQuestion.assessmentId}
    onChange={(e) => {
      const selectedValue = e.target.value;
      if (selectedValue) {
        const [assessmentId, groupName, subgroupName] = selectedValue.split('|');
        setNewQuestion({
          ...newQuestion, 
          assessmentId, 
          groupName, 
          subgroupName
        });
      }
    }}
    required
  >
    <option value="">Select Category</option>
    {assessments.flatMap(assessment =>
      assessment.groups.flatMap(group =>
        group.subgroups.map(subgroup => (
          <option key={subgroup.id} value={`${assessment.id}|${group.name}|${subgroup.name}`}>
            {assessment.title} - {group.name} - {subgroup.name}
          </option>
        ))
      )
    )}
  </select>
</div>

        <div className="form-group">
          <label>Answer Options</label>
          {newQuestion.options.map((option, index) => (
            <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => {
                  const newOptions = [...newQuestion.options];
                  newOptions[index].text = e.target.value;
                  setNewQuestion({...newQuestion, options: newOptions});
                }}
                required
                style={{flex: 1}}
              />
              <input
                type="number"
                placeholder="Score"
                value={option.score}
                onChange={(e) => {
                  const newOptions = [...newQuestion.options];
                  newOptions[index].score = parseInt(e.target.value) || 0;
                  setNewQuestion({...newQuestion, options: newOptions});
                }}
                min="0"
                max="10"
                required
                style={{width: '80px'}}
              />
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" onClick={() => setShowAddQuestion(false)}>
            Cancel
          </button>
          <button type="submit">Add Question</button>
        </div>
      </form>
    </div>
  </div>
)}

            {/* Edit Content Modal */}
            {showEditContent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingSection ? `Edit ${editingSection.page} - ${editingSection.section}` : 'Edit Content'}</h3>
            <form onSubmit={handleSaveContent}>
              {editingSection && (
                <div className="section-editor">
                  {/* Dynamic form fields based on section type */}
                  {Object.keys(sectionContent).map((key) => (
                    <div key={key} className="form-group">
                      <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                      {typeof sectionContent[key] === 'string' ? (
                        key.includes('description') || key.includes('text') ? (
                          <textarea
                            value={sectionContent[key]}
                            onChange={(e) => setSectionContent({
                              ...sectionContent,
                              [key]: e.target.value
                            })}
                            rows="3"
                          />
                        ) : (
                          <input
                            type="text"
                            value={sectionContent[key]}
                            onChange={(e) => setSectionContent({
                              ...sectionContent,
                              [key]: e.target.value
                            })}
                          />
                        )
                      ) : (
                        <textarea
                          value={JSON.stringify(sectionContent[key], null, 2)}
                          onChange={(e) => {
                            try {
                              setSectionContent({
                                ...sectionContent,
                                [key]: JSON.parse(e.target.value)
                              });
                            } catch (err) {
                              // Handle JSON parse error
                            }
                          }}
                          rows="5"
                          placeholder="JSON format for complex data"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="modal-actions">
                <button type="button" onClick={() => {
                  setShowEditContent(false);
                  setEditingSection(null);
                  setSectionContent({});
                }}>Cancel</button>
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
