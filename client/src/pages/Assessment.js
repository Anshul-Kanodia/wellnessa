import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import './Assessment.css';

const Assessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeaders } = useAuth();
  
  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`/api/user/assessments/${id}`, { headers });
      const data = await response.json();
      
      if (response.ok) {
        setAssessment(data);
        
        // Flatten all questions for easier navigation
        const questions = data.groups.flatMap(group => 
          group.subgroups.flatMap(subgroup => 
            subgroup.questions.map(question => ({
              ...question,
              groupName: group.name,
              subgroupName: subgroup.name
            }))
          )
        );
        setAllQuestions(questions);
      } else {
        console.error('Failed to fetch assessment');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      };
      
      const submissionData = {
        responses: Object.entries(responses).map(([questionId, selectedOption]) => ({
          questionId: parseInt(questionId),
          selectedOption
        }))
      };

      const response = await fetch(`/api/user/assessments/${id}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        console.error('Failed to submit assessment:', data.error);
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    return Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100);
  };

  const getAnsweredCount = () => {
    return Object.keys(responses).length;
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = allQuestions[currentQuestionIndex];
    return currentQuestion && responses[currentQuestion.id];
  };

  const canSubmit = () => {
    return getAnsweredCount() === allQuestions.length;
  };

  if (loading) {
    return (
      <div className="assessment-loading">
        <div className="loading-spinner"></div>
        <p>Loading assessment...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="assessment-result">
        <div className="result-container">
          <div className="result-header">
            <div className="result-icon">🎉</div>
            <h1>Assessment Complete!</h1>
            <p>Thank you for completing the {assessment.title}</p>
          </div>
          
          <div className="result-score">
            <div className="score-circle">
              <div className="score-value">{result.percentage}%</div>
              <div className="score-label">Your Score</div>
            </div>
            <div className="score-details">
              <div className="score-detail">
                <span className="detail-value">{result.totalScore}</span>
                <span className="detail-label">Points Earned</span>
              </div>
              <div className="score-detail">
                <span className="detail-value">{result.maxScore}</span>
                <span className="detail-label">Total Points</span>
              </div>
            </div>
          </div>
          
          <div className="result-feedback">
            <h3>Feedback</h3>
            <p>{result.feedback}</p>
          </div>
          
          <div className="result-actions">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="back-to-dashboard-btn"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment || allQuestions.length === 0) {
    return (
      <div className="assessment-error">
        <h2>Assessment not found</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex];

  return (
    <div className="assessment-page">
      <div className="assessment-container">
        {/* Header */}
        <div className="assessment-header">
          <div className="assessment-info">
            <h1>{assessment.title}</h1>
            <p>{assessment.description}</p>
          </div>
          <div className="assessment-progress">
            <div className="progress-text">
              Question {currentQuestionIndex + 1} of {allQuestions.length}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="progress-stats">
              Answered: {getAnsweredCount()}/{allQuestions.length}
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="question-nav">
          {allQuestions.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentQuestionIndex ? 'active' : ''} ${responses[allQuestions[index].id] ? 'answered' : ''}`}
              onClick={() => goToQuestion(index)}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current Question */}
        <div className="question-section">
          <div className="question-meta">
            <span className="question-group">{currentQuestion.groupName}</span>
            <span className="question-subgroup">{currentQuestion.subgroupName}</span>
          </div>
          
          <div className="question-content">
            <h2 className="question-text">{currentQuestion.question}</h2>
            
            <div className="options-list">
              {currentQuestion.options.map(option => (
                <label 
                  key={option.id} 
                  className={`option-item ${responses[currentQuestion.id] === option.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={responses[currentQuestion.id] === option.id}
                    onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                  />
                  <div className="option-content">
                    <div className="option-indicator"></div>
                    <span className="option-text">{option.text}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="assessment-controls">
          <div className="control-buttons">
            <button 
              onClick={goToPrevious} 
              disabled={currentQuestionIndex === 0}
              className="control-btn secondary"
            >
              Previous
            </button>
            
            {currentQuestionIndex === allQuestions.length - 1 ? (
              <button 
                onClick={submitAssessment}
                disabled={!canSubmit() || submitting}
                className="control-btn primary submit-btn"
              >
                {submitting ? 'Submitting...' : `Submit Assessment (${getAnsweredCount()}/${allQuestions.length})`}
              </button>
            ) : (
              <button 
                onClick={goToNext}
                className="control-btn primary"
              >
                Next
              </button>
            )}
          </div>
          
          <div className="assessment-status">
            {!canSubmit() && (
              <p className="status-warning">
                Please answer all questions before submitting
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
