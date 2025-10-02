const {
  connectDatabase,
  userService,
  assessmentService,
  contentService
} = require('./firebase-database');

async function seedFirebaseDatabase() {
  try {
    console.log('🌱 Starting Firebase database seeding...');
    
    // Connect to Firebase
    const connected = await connectDatabase();
    if (!connected) {
      throw new Error('Failed to connect to Firebase');
    }

    // Create initial users
    console.log('👥 Creating initial users...');
    
    const users = [
      {
        username: 'user1',
        password: 'user123',
        email: 'user1@example.com',
        name: 'John Doe',
        accessLevel: 1,
        assessmentsDue: true
      },
      {
        username: 'admin1',
        password: 'admin123',
        email: 'admin1@example.com',
        name: 'Jane Smith',
        accessLevel: 2,
        assessmentsDue: false
      },
      {
        username: 'superadmin',
        password: 'super123',
        email: 'superadmin@example.com',
        name: 'Super Admin',
        accessLevel: 3,
        assessmentsDue: false
      }
    ];

    for (const userData of users) {
      try {
        const existingUser = await userService.findUserByUsername(userData.username);
        if (!existingUser) {
          await userService.createUser(userData);
          console.log(`✅ Created user: ${userData.username}`);
        } else {
          console.log(`⚠️  User already exists: ${userData.username}`);
        }
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.username}:`, error.message);
      }
    }

    // Create sample assessment
    console.log('📋 Creating sample assessment...');
    
    const assessmentData = {
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
      active: true
    };

    try {
      const assessment = await assessmentService.createAssessment(assessmentData);
      console.log('✅ Created sample assessment');
    } catch (error) {
      console.error('❌ Failed to create assessment:', error.message);
    }

    // Create home page content
    console.log('🏠 Creating home page content...');
    
    const homeContent = {
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

    try {
      await contentService.updateHomePageContent(homeContent);
      console.log('✅ Created home page content');
    } catch (error) {
      console.error('❌ Failed to create home page content:', error.message);
    }

    console.log('\n🎉 Firebase database seeding completed successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('👤 User (Level 1): username: user1, password: user123');
    console.log('👨‍💼 Admin (Level 2): username: admin1, password: admin123');
    console.log('👨‍💻 Super Admin (Level 3): username: superadmin, password: super123');

  } catch (error) {
    console.error('❌ Firebase seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedFirebaseDatabase();
}

module.exports = { seedFirebaseDatabase };
