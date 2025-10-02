const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import Firebase database services
const {
  connectDatabase,
  disconnectDatabase,
  userService,
  assessmentService,
  resultService,
  contentService,
} = require('./firebase-database');

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: 'firebase-connected' 
  });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await userService.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// User routes (Level 1+)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/assessments/due', authenticateToken, async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);
    if (!user || !user.assessmentsDue) {
      return res.json([]);
    }
    
    const dueAssessments = await assessmentService.getActiveAssessments();
    res.json(dueAssessments);
  } catch (error) {
    console.error('Due assessments error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/assessments/:id', authenticateToken, async (req, res) => {
  try {
    const assessmentId = parseInt(req.params.id);
    const assessment = await assessmentService.getAssessmentById(assessmentId);
    
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    res.json(assessment);
  } catch (error) {
    console.error('Assessment fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/user/assessments/:id/submit', authenticateToken, async (req, res) => {
  try {
    const assessmentId = parseInt(req.params.id);
    const { responses } = req.body;
    
    const assessment = await assessmentService.getAssessmentById(assessmentId);
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

    const resultData = {
      userId: req.user.id,
      assessmentId,
      responses: scoredResponses,
      totalScore,
      maxScore,
      percentage,
      feedback
    };

    const result = await resultService.createAssessmentResult(resultData);
    
    // Update user's next assessment date
    await userService.updateUser(req.user.id, {
      nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      assessmentsDue: false
    });

    res.json(result);
  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/results', authenticateToken, async (req, res) => {
  try {
    const userResults = await resultService.getUserResults(req.user.id);
    res.json(userResults);
  } catch (error) {
    console.error('User results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user/analytics', authenticateToken, async (req, res) => {
  try {
    const analytics = await resultService.getUserAnalytics(req.user.id);
    res.json(analytics);
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin routes (Level 2+)
app.get('/api/admin/users', authenticateToken, authorize(2), async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/users', authenticateToken, authorize(2), async (req, res) => {
  try {
    const { username, password, email, name, accessLevel = 1 } = req.body;
    
    const existingUser = await userService.findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const userData = {
      username,
      password,
      email,
      name,
      accessLevel: Math.min(accessLevel, req.user.accessLevel - 1), // Can't create users with higher access
      nextAssessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assessmentsDue: true
    };

    const newUser = await userService.createUser(userData);
    res.json(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/results', authenticateToken, authorize(2), async (req, res) => {
  try {
    const results = await resultService.getAllResults();
    res.json(results);
  } catch (error) {
    console.error('Admin results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Super Admin routes (Level 3)
app.get('/api/superadmin/content', authenticateToken, authorize(3), async (req, res) => {
  try {
    const content = await contentService.getHomePageContent();
    res.json(content);
  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/superadmin/content', authenticateToken, authorize(3), async (req, res) => {
  try {
    const updatedContent = await contentService.updateHomePageContent(req.body);
    res.json(updatedContent);
  } catch (error) {
    console.error('Content update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/superadmin/assessments', authenticateToken, authorize(3), async (req, res) => {
  try {
    const assessments = await assessmentService.getAllAssessments();
    res.json(assessments);
  } catch (error) {
    console.error('Assessments fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/superadmin/assessments', authenticateToken, authorize(3), async (req, res) => {
  try {
    const newAssessment = await assessmentService.createAssessment(req.body, req.user.id);
    res.json(newAssessment);
  } catch (error) {
    console.error('Assessment creation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public routes
app.get('/api/content/home', async (req, res) => {
  try {
    const content = await contentService.getHomePageContent();
    res.json(content);
  } catch (error) {
    console.error('Public content error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Question Management API Endpoints (Super Admin only)

// Get all questions with assessment details
app.get('/api/admin/questions', authenticateToken, authorize(3), async (req, res) => {
  try {
    const questions = await prisma.assessmentQuestion.findMany({
      include: {
        subgroup: {
          include: {
            group: {
              include: {
                assessment: true
              }
            }
          }
        },
        options: true
      }
    });

    const formattedQuestions = questions.map(question => ({
      id: question.id,
      question: question.question,
      assessmentId: question.subgroup.group.assessmentId,
      assessmentTitle: question.subgroup.group.assessment.title,
      groupName: question.subgroup.group.name,
      subgroupName: question.subgroup.name,
      options: question.options
    }));

    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get all assessments
app.get('/api/admin/assessments', authenticateToken, authorize(3), async (req, res) => {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        groups: {
          include: {
            subgroups: true
          }
        }
      }
    });
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// Add new question
app.post('/api/admin/questions', authenticateToken, authorize(3), async (req, res) => {
  try {
    const { question, assessmentId, groupId, subgroupId, options } = req.body;

    if (!question || !subgroupId || !options) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await prisma.$transaction(async (prisma) => {
      const newQuestion = await prisma.assessmentQuestion.create({
        data: {
          question,
          subgroupId: parseInt(subgroupId)
        }
      });

      const questionOptions = await Promise.all(
        options.map((option, index) =>
          prisma.questionOption.create({
            data: {
              questionId: newQuestion.id,
              optionKey: String.fromCharCode(97 + index),
              text: option.text,
              score: parseInt(option.score)
            }
          })
        )
      );

      return { ...newQuestion, options: questionOptions };
    });

    res.json(result);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Delete question
app.delete('/api/admin/questions/:id', authenticateToken, authorize(3), async (req, res) => {
  try {
    const questionId = parseInt(req.params.id);

    await prisma.assessmentQuestion.delete({
      where: { id: questionId }
    });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Question not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete question' });
    }
  }
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    // Connect to database
    const dbConnected = await connectDatabase();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔥 Database: Firebase Firestore`);
      console.log('\n📋 Demo Credentials:');
      console.log('👤 User (Level 1): username: user1, password: password123');
      console.log('👨‍💼 Admin (Level 2): username: admin1, password: admin123');
      console.log('👨‍💻 Super Admin (Level 3): username: superadmin, password: super123');
      console.log('\n🔗 API Health Check: http://localhost:' + PORT + '/api/health');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
