const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: 'user1' },
      update: {},
      create: {
        username: 'user1',
        email: 'user1@wellnessa.com',
        password: hashedPassword,
        name: 'John Doe',
        accessLevel: 1,
        nextAssessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assessmentsDue: true,
      },
    }),
    prisma.user.upsert({
      where: { username: 'admin1' },
      update: {},
      create: {
        username: 'admin1',
        email: 'admin1@wellnessa.com',
        password: await bcrypt.hash('admin123', 12),
        name: 'Jane Smith',
        accessLevel: 2,
      },
    }),
    prisma.user.upsert({
      where: { username: 'superadmin' },
      update: {},
      create: {
        username: 'superadmin',
        email: 'superadmin@wellnessa.com',
        password: await bcrypt.hash('super123', 12),
        name: 'Super Admin',
        accessLevel: 3,
      },
    }),
  ]);

  console.log('✅ Users created');

  // Create assessment
  const assessment = await prisma.assessment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Health Assessment Q1 2024',
      description: 'Quarterly health and wellness assessment',
      isActive: true,
      createdById: users[2].id, // Super admin
      groups: {
        create: [
          {
            name: 'Physical Health',
            orderIndex: 0,
            subgroups: {
              create: [
                {
                  name: 'Exercise & Fitness',
                  orderIndex: 0,
                  questions: {
                    create: [
                      {
                        question: 'How often do you exercise per week?',
                        questionType: 'multiple_choice',
                        orderIndex: 0,
                        options: {
                          create: [
                            { id: 'a', optionText: 'Never', score: 0, orderIndex: 0 },
                            { id: 'b', optionText: '1-2 times', score: 2, orderIndex: 1 },
                            { id: 'c', optionText: '3-4 times', score: 4, orderIndex: 2 },
                            { id: 'd', optionText: '5+ times', score: 5, orderIndex: 3 },
                          ],
                        },
                      },
                      {
                        question: 'How would you rate your current fitness level?',
                        questionType: 'multiple_choice',
                        orderIndex: 1,
                        options: {
                          create: [
                            { id: 'a', optionText: 'Poor', score: 1, orderIndex: 0 },
                            { id: 'b', optionText: 'Fair', score: 2, orderIndex: 1 },
                            { id: 'c', optionText: 'Good', score: 4, orderIndex: 2 },
                            { id: 'd', optionText: 'Excellent', score: 5, orderIndex: 3 },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  name: 'Nutrition',
                  orderIndex: 1,
                  questions: {
                    create: [
                      {
                        question: 'How many servings of fruits and vegetables do you eat daily?',
                        questionType: 'multiple_choice',
                        orderIndex: 0,
                        options: {
                          create: [
                            { id: 'a', optionText: '0-1', score: 1, orderIndex: 0 },
                            { id: 'b', optionText: '2-3', score: 2, orderIndex: 1 },
                            { id: 'c', optionText: '4-5', score: 4, orderIndex: 2 },
                            { id: 'd', optionText: '6+', score: 5, orderIndex: 3 },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Mental Health',
            orderIndex: 1,
            subgroups: {
              create: [
                {
                  name: 'Stress Management',
                  orderIndex: 0,
                  questions: {
                    create: [
                      {
                        question: 'How well do you manage stress?',
                        questionType: 'multiple_choice',
                        orderIndex: 0,
                        options: {
                          create: [
                            { id: 'a', optionText: 'Very poorly', score: 1, orderIndex: 0 },
                            { id: 'b', optionText: 'Poorly', score: 2, orderIndex: 1 },
                            { id: 'c', optionText: 'Well', score: 4, orderIndex: 2 },
                            { id: 'd', optionText: 'Very well', score: 5, orderIndex: 3 },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Assessment created');

  // Create sample assessment result
  await prisma.assessmentResult.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: users[0].id,
      assessmentId: assessment.id,
      totalScore: 14,
      maxScore: 20,
      percentage: 70,
      feedback: 'Good progress! Focus on improving fitness level and stress management.',
      completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      responses: {
        create: [
          { questionId: 1, selectedOptionId: 'c', score: 4 },
          { questionId: 2, selectedOptionId: 'b', score: 2 },
          { questionId: 3, selectedOptionId: 'c', score: 4 },
          { questionId: 4, selectedOptionId: 'c', score: 4 },
        ],
      },
    },
  });

  console.log('✅ Sample assessment result created');

  // Create home page content
  await prisma.homePageContent.upsert({
    where: { section: 'hero' },
    update: {},
    create: {
      section: 'hero',
      title: 'Wellnessa',
      subtitle: 'Your comprehensive healthcare management platform for better patient outcomes',
    },
  });

  await prisma.homePageContent.upsert({
    where: { section: 'product' },
    update: {},
    create: {
      section: 'product',
      title: 'Our Product',
      subtitle: 'Comprehensive digital health platform that enables healthcare providers to deliver personalized care, track patient progress, and improve health outcomes through innovative technology solutions.',
      content: {
        features: [
          'Patient Assessment Management',
          'Real-time Health Analytics',
          'Secure Data Management',
          'Multi-level Access Control',
        ],
      },
    },
  });

  console.log('✅ Home page content created');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
