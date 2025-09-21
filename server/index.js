const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-domain.com'
    : 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/build')));

// In-memory data storage (replace with database in production)
let users = [
  {
    id: 1,
    username: 'user1',
    password: '$2b$10$rQZ8kHWKtGXGvqWvqWvqWOeKkKkKkKkKkKkKkKkKkKkKkKkKkKkKk', // password: user123
    email: 'user1@example.com',
    name: 'John Doe',
    accessLevel: 1,
    createdAt: new Date(),
    nextAssessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assessmentsDue: true
  },
  {
    id: 2,
    username: 'admin1',
    password: '$2b$10$rQZ8kHWKtGXGvqWvqWvqWOeKkKkKkKkKkKkKkKkKkKkKkKkKkKkKk', // password: admin123
    email: 'admin1@example.com',
    name: 'Jane Smith',
    accessLevel: 2,
    createdAt: new Date()
  },
  {
    id: 3,
    username: 'superadmin',
    password: '$2b$10$rQZ8kHWKtGXGvqWvqWvqWOeKkKkKkKkKkKkKkKkKkKkKkKkKkKkKk', // password: super123
    email: 'superadmin@example.com',
    name: 'Super Admin',
    accessLevel: 3,
    createdAt: new Date()
  }
];

let assessments = [
  {
    id: 1,
    title: 'Health Assessment Q1 2024',
    description: 'Quarterly health and wellness assessment',
    groups: [
      {
        id: 1,
        name: 'Physical Health',
        subgroups: [
          {
            id: 1,
            name: 'Exercise & Fitness',
            questions: [
              {
                id: 1,
                question: 'How often do you exercise per week?',
                options: [
                  { id: 'a', text: 'Never', score: 0 },
                  { id: 'b', text: '1-2 times', score: 2 },
                  { id: 'c', text: '3-4 times', score: 4 },
                  { id: 'd', text: '5+ times', score: 5 }
                ]
              },
              {
                id: 2,
                question: 'How would you rate your current fitness level?',
                options: [
                  { id: 'a', text: 'Poor', score: 1 },
                  { id: 'b', text: 'Fair', score: 2 },
                  { id: 'c', text: 'Good', score: 4 },
                  { id: 'd', text: 'Excellent', score: 5 }
                ]
              }
            ]
          },
          {
            id: 2,
            name: 'Nutrition',
            questions: [
              {
                id: 3,
                question: 'How many servings of fruits and vegetables do you eat daily?',
                options: [
                  { id: 'a', text: '0-1', score: 1 },
                  { id: 'b', text: '2-3', score: 2 },
                  { id: 'c', text: '4-5', score: 4 },
                  { id: 'd', text: '6+', score: 5 }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Mental Health',
        subgroups: [
          {
            id: 3,
            name: 'Stress Management',
            questions: [
              {
                id: 4,
                question: 'How well do you manage stress?',
                options: [
                  { id: 'a', text: 'Very poorly', score: 1 },
                  { id: 'b', text: 'Poorly', score: 2 },
                  { id: 'c', text: 'Well', score: 4 },
                  { id: 'd', text: 'Very well', score: 5 }
                ]
              }
            ]
          }
        ]
      }
    ],
    active: true,
    createdAt: new Date()
  }
];

let userAssessmentResults = [
  {
    id: 1,
    userId: 1,
    assessmentId: 1,
    responses: [
      { questionId: 1, selectedOption: 'c', score: 4 },
      { questionId: 2, selectedOption: 'b', score: 2 },
      { questionId: 3, selectedOption: 'c', score: 4 },
      { questionId: 4, selectedOption: 'c', score: 4 }
    ],
    totalScore: 14,
    maxScore: 20,
    percentage: 70,
    completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    feedback: 'Good progress! Focus on improving fitness level and stress management.'
  }
];

let homePageContent = {
  hero: {
    title: 'Wellnessa',
    subtitle: 'Your comprehensive healthcare management platform for better patient outcomes'
  },
  sections: {
    product: {
      title: 'Our Product',
      description: 'Comprehensive digital health platform that enables healthcare providers to deliver personalized care, track patient progress, and improve health outcomes through innovative technology solutions.'
    }
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authorization middleware
const authorize = (requiredLevel) => {
  return (req, res, next) => {
    if (req.user.accessLevel < requiredLevel) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For demo purposes, we'll use a simple password comparison
    // In production, use bcrypt.compare(password, user.password)
    const validPassword = password === 'user123' || password === 'admin123' || password === 'super123';
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        accessLevel: user.accessLevel,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        accessLevel: user.accessLevel
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User routes (Level 1+)
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    accessLevel: user.accessLevel,
    nextAssessment: user.nextAssessment,
    assessmentsDue: user.assessmentsDue
  });
});

app.get('/api/user/assessments/due', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user || !user.assessmentsDue) {
    return res.json([]);
  }
  
  const dueAssessments = assessments.filter(a => a.active);
  res.json(dueAssessments);
});

app.get('/api/user/assessments/:id', authenticateToken, (req, res) => {
  const assessmentId = parseInt(req.params.id);
  const assessment = assessments.find(a => a.id === assessmentId);
  
  if (!assessment) {
    return res.status(404).json({ error: 'Assessment not found' });
  }
  
  res.json(assessment);
});

app.post('/api/user/assessments/:id/submit', authenticateToken, (req, res) => {
  try {
    const assessmentId = parseInt(req.params.id);
    const { responses } = req.body;
    
    const assessment = assessments.find(a => a.id === assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    
    const scoredResponses = responses.map(response => {
      const question = assessment.groups
        .flatMap(g => g.subgroups)
        .flatMap(sg => sg.questions)
        .find(q => q.id === response.questionId);
      
      if (question) {
        const selectedOption = question.options.find(o => o.id === response.selectedOption);
        const score = selectedOption ? selectedOption.score : 0;
        totalScore += score;
        maxScore += Math.max(...question.options.map(o => o.score));
        
        return {
          ...response,
          score
        };
      }
      return response;
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    
    // Generate feedback based on score
    let feedback = '';
    if (percentage >= 80) {
      feedback = 'Excellent! You\'re maintaining great health habits.';
    } else if (percentage >= 60) {
      feedback = 'Good progress! Focus on areas where you can improve.';
    } else if (percentage >= 40) {
      feedback = 'There\'s room for improvement. Consider consulting with a healthcare professional.';
    } else {
      feedback = 'We recommend speaking with a healthcare provider about your wellness plan.';
    }

    const result = {
      id: userAssessmentResults.length + 1,
      userId: req.user.id,
      assessmentId,
      responses: scoredResponses,
      totalScore,
      maxScore,
      percentage,
      completedAt: new Date(),
      feedback
    };

    userAssessmentResults.push(result);
    
    // Update user's next assessment date
    const user = users.find(u => u.id === req.user.id);
    if (user) {
      user.nextAssessment = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      user.assessmentsDue = false;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/results', authenticateToken, (req, res) => {
  const userResults = userAssessmentResults.filter(r => r.userId === req.user.id);
  res.json(userResults);
});

app.get('/api/user/analytics', authenticateToken, (req, res) => {
  const userResults = userAssessmentResults.filter(r => r.userId === req.user.id);
  
  if (userResults.length === 0) {
    return res.json({ trend: 'no-data', message: 'No assessment data available' });
  }

  // Simple trend analysis
  const sortedResults = userResults.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
  const scores = sortedResults.map(r => r.percentage);
  
  let trend = 'stable';
  if (scores.length > 1) {
    const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
    const secondHalf = scores.slice(Math.ceil(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 5) trend = 'improving';
    else if (secondAvg < firstAvg - 5) trend = 'declining';
  }

  res.json({
    trend,
    latestScore: scores[scores.length - 1],
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    totalAssessments: scores.length,
    scores: sortedResults.map(r => ({
      date: r.completedAt,
      score: r.percentage
    }))
  });
});

// Admin routes (Level 2+)
app.get('/api/admin/users', authenticateToken, authorize(2), (req, res) => {
  const userList = users.map(u => ({
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email,
    accessLevel: u.accessLevel,
    createdAt: u.createdAt,
    nextAssessment: u.nextAssessment,
    assessmentsDue: u.assessmentsDue
  }));
  res.json(userList);
});

app.post('/api/admin/users', authenticateToken, authorize(2), (req, res) => {
  try {
    const { username, password, email, name, accessLevel = 1 } = req.body;
    
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      username,
      password: password, // In production, hash with bcrypt
      email,
      name,
      accessLevel: Math.min(accessLevel, req.user.accessLevel - 1), // Can't create users with higher access
      createdAt: new Date(),
      nextAssessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assessmentsDue: true
    };

    users.push(newUser);
    
    res.json({
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      accessLevel: newUser.accessLevel,
      createdAt: newUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/results', authenticateToken, authorize(2), (req, res) => {
  const results = userAssessmentResults.map(r => {
    const user = users.find(u => u.id === r.userId);
    return {
      ...r,
      userName: user ? user.name : 'Unknown User'
    };
  });
  res.json(results);
});

// Super Admin routes (Level 3)
app.get('/api/superadmin/content', authenticateToken, authorize(3), (req, res) => {
  res.json(homePageContent);
});

app.put('/api/superadmin/content', authenticateToken, authorize(3), (req, res) => {
  homePageContent = { ...homePageContent, ...req.body };
  res.json(homePageContent);
});

app.get('/api/superadmin/assessments', authenticateToken, authorize(3), (req, res) => {
  res.json(assessments);
});

app.post('/api/superadmin/assessments', authenticateToken, authorize(3), (req, res) => {
  const newAssessment = {
    id: Math.max(...assessments.map(a => a.id)) + 1,
    ...req.body,
    createdAt: new Date()
  };
  assessments.push(newAssessment);
  res.json(newAssessment);
});

app.put('/api/superadmin/assessments/:id', authenticateToken, authorize(3), (req, res) => {
  const assessmentId = parseInt(req.params.id);
  const index = assessments.findIndex(a => a.id === assessmentId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Assessment not found' });
  }
  
  assessments[index] = { ...assessments[index], ...req.body };
  res.json(assessments[index]);
});

app.delete('/api/superadmin/assessments/:id', authenticateToken, authorize(3), (req, res) => {
  const assessmentId = parseInt(req.params.id);
  const index = assessments.findIndex(a => a.id === assessmentId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Assessment not found' });
  }
  
  assessments.splice(index, 1);
  res.json({ message: 'Assessment deleted successfully' });
});

// Public routes
app.get('/api/content/home', (req, res) => {
  res.json(homePageContent);
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('\nDemo Credentials:');
  console.log('User (Level 1): username: user1, password: user123');
  console.log('Admin (Level 2): username: admin1, password: admin123');
  console.log('Super Admin (Level 3): username: superadmin, password: super123');
});
