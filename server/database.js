const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Database connection test
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('Database disconnected');
}

// User Services
const userService = {
  async createUser(userData) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, parseInt(process.env.BCRYPT_ROUNDS) || 12);
    
    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        accessLevel: true,
        createdAt: true,
      },
    });
  },

  async findUserByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
    });
  },

  async findUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        accessLevel: true,
        nextAssessment: true,
        assessmentsDue: true,
        createdAt: true,
      },
    });
  },

  async updateUser(id, userData) {
    return await prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        accessLevel: true,
        nextAssessment: true,
        assessmentsDue: true,
      },
    });
  },

  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        accessLevel: true,
        nextAssessment: true,
        assessmentsDue: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Assessment Services
const assessmentService = {
  async createAssessment(assessmentData, createdById) {
    return await prisma.assessment.create({
      data: {
        ...assessmentData,
        createdById,
        groups: {
          create: assessmentData.groups?.map((group, groupIndex) => ({
            name: group.name,
            orderIndex: groupIndex,
            subgroups: {
              create: group.subgroups?.map((subgroup, subgroupIndex) => ({
                name: subgroup.name,
                orderIndex: subgroupIndex,
                questions: {
                  create: subgroup.questions?.map((question, questionIndex) => ({
                    question: question.question,
                    questionType: question.questionType || 'multiple_choice',
                    orderIndex: questionIndex,
                    options: {
                      create: question.options?.map((option, optionIndex) => ({
                        id: option.id,
                        optionText: option.text,
                        score: option.score,
                        orderIndex: optionIndex,
                      })) || [],
                    },
                  })) || [],
                },
              })) || [],
            },
          })) || [],
        },
      },
      include: {
        groups: {
          include: {
            subgroups: {
              include: {
                questions: {
                  include: {
                    options: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  },

  async getAssessmentById(id) {
    return await prisma.assessment.findUnique({
      where: { id },
      include: {
        groups: {
          include: {
            subgroups: {
              include: {
                questions: {
                  include: {
                    options: {
                      orderBy: { orderIndex: 'asc' },
                    },
                  },
                  orderBy: { orderIndex: 'asc' },
                },
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  },

  async getActiveAssessments() {
    return await prisma.assessment.findMany({
      where: { isActive: true },
      include: {
        groups: {
          include: {
            subgroups: {
              include: {
                questions: {
                  include: {
                    options: {
                      orderBy: { orderIndex: 'asc' },
                    },
                  },
                  orderBy: { orderIndex: 'asc' },
                },
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAllAssessments() {
    return await prisma.assessment.findMany({
      include: {
        createdBy: {
          select: { name: true, username: true },
        },
        _count: {
          select: { results: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};

// Assessment Result Services
const resultService = {
  async createAssessmentResult(resultData) {
    return await prisma.assessmentResult.create({
      data: {
        userId: resultData.userId,
        assessmentId: resultData.assessmentId,
        totalScore: resultData.totalScore,
        maxScore: resultData.maxScore,
        percentage: resultData.percentage,
        feedback: resultData.feedback,
        responses: {
          create: resultData.responses.map(response => ({
            questionId: response.questionId,
            selectedOptionId: response.selectedOption,
            score: response.score,
          })),
        },
      },
      include: {
        responses: {
          include: {
            question: true,
            selectedOption: true,
          },
        },
      },
    });
  },

  async getUserResults(userId) {
    return await prisma.assessmentResult.findMany({
      where: { userId },
      include: {
        assessment: {
          select: { title: true },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  },

  async getAllResults() {
    return await prisma.assessmentResult.findMany({
      include: {
        user: {
          select: { name: true, username: true },
        },
        assessment: {
          select: { title: true },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  },

  async getUserAnalytics(userId) {
    const results = await prisma.assessmentResult.findMany({
      where: { userId },
      orderBy: { completedAt: 'asc' },
      select: {
        percentage: true,
        completedAt: true,
      },
    });

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
      latestScore: scores[scores.length - 1],
      averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      totalAssessments: scores.length,
      scores: results.map(r => ({
        date: r.completedAt,
        score: r.percentage,
      })),
    };
  },
};

// Content Management Services
const contentService = {
  async getHomePageContent() {
    const content = await prisma.homePageContent.findMany({
      where: { isActive: true },
    });

    // Transform to the expected format
    const result = {};
    content.forEach(item => {
      if (item.section === 'hero') {
        result.hero = {
          title: item.title,
          subtitle: item.subtitle,
        };
      } else {
        result.sections = result.sections || {};
        result.sections[item.section] = {
          title: item.title,
          description: item.subtitle,
          ...(item.content || {}),
        };
      }
    });

    return result;
  },

  async updateHomePageContent(contentData) {
    // Update hero section
    if (contentData.hero) {
      await prisma.homePageContent.upsert({
        where: { section: 'hero' },
        update: {
          title: contentData.hero.title,
          subtitle: contentData.hero.subtitle,
        },
        create: {
          section: 'hero',
          title: contentData.hero.title,
          subtitle: contentData.hero.subtitle,
        },
      });
    }

    // Update other sections
    if (contentData.sections) {
      for (const [sectionName, sectionData] of Object.entries(contentData.sections)) {
        await prisma.homePageContent.upsert({
          where: { section: sectionName },
          update: {
            title: sectionData.title,
            subtitle: sectionData.description,
            content: sectionData,
          },
          create: {
            section: sectionName,
            title: sectionData.title,
            subtitle: sectionData.description,
            content: sectionData,
          },
        });
      }
    }

    return await this.getHomePageContent();
  },
};

module.exports = {
  prisma,
  connectDatabase,
  disconnectDatabase,
  userService,
  assessmentService,
  resultService,
  contentService,
};
