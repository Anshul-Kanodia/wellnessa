const { initializeFirebase, getFirestore } = require('./firebase-config-base64');
const bcrypt = require('bcryptjs');

// Initialize Firebase
let db;

async function connectDatabase() {
  const initialized = await initializeFirebase();
  if (initialized) {
    db = getFirestore();
    return true;
  }
  return false;
}

async function disconnectDatabase() {
  // Firebase doesn't require explicit disconnection
  console.log('Firebase connection closed');
}

// User Services
const userService = {
  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
      
      const userDoc = {
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
        name: userData.name,
        accessLevel: userData.accessLevel || 1,
        nextAssessment: userData.nextAssessment || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assessmentsDue: userData.assessmentsDue || true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await db.collection('users').add(userDoc);
      
      return {
        id: docRef.id,
        username: userData.username,
        email: userData.email,
        name: userData.name,
        accessLevel: userData.accessLevel || 1,
        createdAt: userDoc.createdAt
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  async findUserByUsername(username) {
    try {
      const snapshot = await db.collection('users').where('username', '==', username).get();
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  },

  async findUserById(id) {
    try {
      const doc = await db.collection('users').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
  },

  async getAllUsers() {
    try {
      const snapshot = await db.collection('users').get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        username: doc.data().username,
        email: doc.data().email,
        name: doc.data().name,
        accessLevel: doc.data().accessLevel,
        createdAt: doc.data().createdAt,
        nextAssessment: doc.data().nextAssessment,
        assessmentsDue: doc.data().assessmentsDue
      }));
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  },

  async updateUser(id, updateData) {
    try {
      const updateDoc = {
        ...updateData,
        updatedAt: new Date()
      };

      await db.collection('users').doc(id).update(updateDoc);
      return await this.findUserById(id);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }
};

// Assessment Services
const assessmentService = {
  async createAssessment(assessmentData) {
    try {
      const assessmentDoc = {
        title: assessmentData.title,
        description: assessmentData.description,
        groups: assessmentData.groups,
        active: assessmentData.active || true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await db.collection('assessments').add(assessmentDoc);
      
      return {
        id: docRef.id,
        ...assessmentDoc
      };
    } catch (error) {
      throw new Error(`Failed to create assessment: ${error.message}`);
    }
  },

  async getAssessmentById(id) {
    try {
      const doc = await db.collection('assessments').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }

      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Failed to get assessment: ${error.message}`);
    }
  },

  async getAllAssessments() {
    try {
      const snapshot = await db.collection('assessments').get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Failed to get all assessments: ${error.message}`);
    }
  },

  async getActiveAssessments() {
    try {
      const snapshot = await db.collection('assessments').where('active', '==', true).get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Failed to get active assessments: ${error.message}`);
    }
  },
  
  async updateAssessment(id, assessmentData) {
    try {
      const updateDoc = {
        ...assessmentData,
        updatedAt: new Date()
      };
  
      await db.collection('assessments').doc(id).update(updateDoc);
      return await this.getAssessmentById(id);
    } catch (error) {
      throw new Error(`Failed to update assessment: ${error.message}`);
    }
  }
};

// Result Services
const resultService = {
  async createAssessmentResult(resultData) {
    try {
      const resultDoc = {
        userId: resultData.userId,
        assessmentId: resultData.assessmentId,
        responses: resultData.responses,
        totalScore: resultData.totalScore,
        maxScore: resultData.maxScore,
        percentage: resultData.percentage,
        feedback: resultData.feedback,
        completedAt: new Date(),
        createdAt: new Date()
      };

      const docRef = await db.collection('assessment_results').add(resultDoc);
      
      return {
        id: docRef.id,
        ...resultDoc
      };
    } catch (error) {
      throw new Error(`Failed to create assessment result: ${error.message}`);
    }
  },

  async getUserResults(userId) {
    try {
      const snapshot = await db.collection('assessment_results')
        .where('userId', '==', userId)
        .orderBy('completedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Failed to get user results: ${error.message}`);
    }
  },

  async getAllResults() {
    try {
      const snapshot = await db.collection('assessment_results')
        .orderBy('completedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(`Failed to get all results: ${error.message}`);
    }
  },

  async getUserAnalytics(userId) {
    try {
      const results = await this.getUserResults(userId);
      
      if (results.length === 0) {
        return { trend: 'no-data', message: 'No assessment data available' };
      }

      const scores = results.map(r => r.percentage);
      
      let trend = 'stable';
      if (scores.length > 1) {
        const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
        const secondHalf = scores.slice(Math.ceil(scores.length / 2));
        
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg + 5) trend = 'improving';
        else if (secondAvg < firstAvg - 5) trend = 'declining';
      }

      return {
        trend,
        latestScore: scores[0],
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        totalAssessments: scores.length,
        scores: results.map(r => ({
          date: r.completedAt,
          score: r.percentage
        }))
      };
    } catch (error) {
      throw new Error(`Failed to get user analytics: ${error.message}`);
    }
  }
};

// Content Services
const contentService = {
  async getHomePageContent() {
    try {
      const doc = await db.collection('content').doc('home_page').get();
      
      if (!doc.exists) {
        // Return default content if none exists
        return {
          hero: {
            title: 'Wellnessa',
            subtitle: 'Your comprehensive healthcare management platform'
          },
          sections: {
            product: {
              title: 'Our Product',
              description: 'Comprehensive digital health platform for better patient outcomes.'
            }
          }
        };
      }

      return doc.data().content;
    } catch (error) {
      throw new Error(`Failed to get home page content: ${error.message}`);
    }
  },

  async getAboutPageContent() {
    try {
      const doc = await db.collection('content').doc('about_page').get();
      
      if (!doc.exists) {
        // Return default content structure for About page
        return {
          hero: {
            title: 'About Wellnessa',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            buttonText: 'Get Started'
          },
          whyWellnessa: {
            title: 'Why Wellnessa?',
            description1: 'Wellnessa offers an expert, convenient approach that will fit seamlessly into your existing workflow.',
            description2: 'Our team of healthcare professionals and technology experts work together to create solutions.'
          },
          monitorPatient: {
            title: 'Monitor patient mental health from afar',
            description: 'Our comprehensive remote monitoring system allows healthcare providers to track patient mental health indicators in real-time.'
          },
          values: {
            title: 'Our Values',
            subtitle: 'What our team believes in',
            items: [
              { icon: '🎯', title: 'Focusing in touch with our patients', description: 'Lorem ipsum dolor sit amet...' },
              { icon: '💡', title: 'Innovation in Healthcare', description: 'Lorem ipsum dolor sit amet...' },
              { icon: '🤝', title: 'Collaborative Care', description: 'Lorem ipsum dolor sit amet...' },
              { icon: '🔬', title: 'Evidence-Based Solutions', description: 'Lorem ipsum dolor sit amet...' },
              { icon: '❤️', title: 'Patient-Centered Approach', description: 'Lorem ipsum dolor sit amet...' }
            ]
          },
          team: {
            title: 'Our Team',
            members: [
              { name: 'Anshul Kanojia', role: 'CEO and Founder' },
              { name: 'Anshul Kanojia', role: 'CEO and Founder' },
              { name: 'Anshul Kanojia', role: 'CEO and Founder' }
            ]
          }
        };
      }

      return doc.data().content;
    } catch (error) {
      throw new Error(`Failed to get about page content: ${error.message}`);
    }
  },

  async updateAboutPageContent(content) {
    try {
      const contentDoc = {
        content,
        updatedAt: new Date()
      };

      await db.collection('content').doc('about_page').set(contentDoc, { merge: true });
      
      return content;
    } catch (error) {
      throw new Error(`Failed to update about page content: ${error.message}`);
    }
  },

  async getAllContent() {
    try {
      const [homeContent, aboutContent] = await Promise.all([
        this.getHomePageContent(),
        this.getAboutPageContent()
      ]);

      return {
        home: homeContent,
        about: aboutContent
      };
    } catch (error) {
      throw new Error(`Failed to get all content: ${error.message}`);
    }
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
  userService,
  assessmentService,
  resultService,
  contentService
};
