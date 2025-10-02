const { connectDatabase, contentService } = require('./firebase-database');

const seedContent = async () => {
  try {
    console.log('🌱 Starting content seeding...');
    
    // Connect to Firebase
    const connected = await connectDatabase();
    if (!connected) {
      throw new Error('Failed to connect to Firebase');
    }

    // Home Page Content
    const homePageContent = {
      hero: {
        title: 'Wellnessa',
        subtitle: 'Your comprehensive healthcare management platform for better patient outcomes and streamlined workflows'
      },
      accreditations: {
        title: 'Accreditations & Certifications'
      },
      product: {
        title: 'Our Product',
        description1: 'Wellnessa is a comprehensive digital health platform that enables healthcare providers to deliver personalized care, track patient progress, and improve health outcomes through innovative technology solutions.',
        description2: 'Our platform integrates seamlessly with existing healthcare systems to provide real-time insights, streamlined workflows, and enhanced patient engagement for better healthcare delivery.'
      },
      howItWorks: {
        title: 'How it works',
        subtitle: 'Simple steps to transform your healthcare practice',
        steps: [
          { 
            number: 1, 
            title: 'Patient Registration', 
            description: 'Seamlessly onboard patients with our intuitive registration system that captures essential health information and preferences.' 
          },
          { 
            number: 2, 
            title: 'Assessment & Analysis', 
            description: 'Conduct comprehensive health assessments using our evidence-based questionnaires and AI-powered analysis tools.' 
          },
          { 
            number: 3, 
            title: 'Personalized Care Plans', 
            description: 'Generate customized treatment plans based on patient data, medical history, and best practice guidelines.' 
          },
          { 
            number: 4, 
            title: 'Progress Monitoring', 
            description: 'Track patient progress in real-time with automated reminders, milestone tracking, and outcome measurements.' 
          },
          { 
            number: 5, 
            title: 'Continuous Improvement', 
            description: 'Analyze outcomes and refine care strategies using our advanced analytics and reporting dashboard.' 
          }
        ]
      },
      testimonials: {
        title: 'What Our Users Say',
        items: [
          { 
            name: 'Dr. Sarah Johnson', 
            role: 'Chief Medical Officer, Metro Health', 
            text: 'Wellnessa has transformed how we deliver patient care. The platform\'s intuitive design and powerful analytics have improved our patient outcomes by 40%.' 
          },
          { 
            name: 'Michael Chen', 
            role: 'Healthcare Administrator, City Hospital', 
            text: 'The seamless integration with our existing systems made implementation effortless. Our staff productivity has Increased significantly since adopting Wellnessa.' 
          },
          { 
            name: 'Dr. Emily Rodriguez', 
            role: 'Family Physician, Wellness Clinic', 
            text: 'The patient engagement features are outstanding. My patients love the personalized care plans and progress tracking capabilities.' 
          }
        ]
      }
    };

    // About Page Content
    const aboutPageContent = {
      hero: {
        title: 'About Wellnessa',
        description: 'We are dedicated to revolutionizing healthcare through innovative technology solutions that empower providers and improve patient outcomes. Our mission is to make quality healthcare accessible, efficient, and personalized for everyone.',
        buttonText: 'Get Started Today'
      },
      whyWellnessa: {
        title: 'Why Choose Wellnessa?',
        description1: 'Wellnessa offers an expert, convenient approach that integrates seamlessly into your existing workflow. Our platform provides comprehensive healthcare management solutions that enable providers to deliver personalized care while improving patient outcomes through innovative technology and streamlined processes.',
        description2: 'Our team of healthcare professionals, technology experts, and data scientist work together to create solutions that address real-world challenges in healthcare delivery, patient engagement, and clinical decision-making.'
      },
      monitorPatient: {
        title: 'Monitor Patient Health Remotely',
        description: 'Our comprehensive remote monitoring system allows healthcare providers to track patient health indicators in real-time, ensuring continuous care, early intervention when needed, and improved patient engagement through personalized health insights.'
      },
      values: {
        title: 'Our Core Values',
        subtitle: 'The principles that guide everything we do',
        items: [
          { 
            icon: '🎯', 
            title: 'Patient-Centered Care', 
            description: 'Every feature we build puts patients first, ensuring their needs, preferences, and outcomes are at the center of our healthcare solutions.' 
          },
          { 
            icon: '💡', 
            title: 'Innovation in Healthcare', 
            description: 'We continuously push the boundaries of what\'s possible in healthcare technology, leveraging AI, machine learning, and data analytics to improve care.' 
          },
          { 
            icon: '🤝', 
            title: 'Collaborative Partnerships', 
            description: 'We believe in working closely with healthcare providers, patients, and stakeholders to create solutions that truly make a difference.' 
          },
          { 
            icon: '🔬', 
            title: 'Evidence-Based Solutions', 
            description: 'All our features and recommendations are grounded in clinical research, best practices, and proven methodologies for optimal patient outcomes.' 
          },
          { 
            icon: '❤️', 
            title: 'Compassionate Technology', 
            description: 'We combine cutting-edge technology with human empathy to create healthcare solutions that are both powerful and caring.' 
          }
        ]
      },
      team: {
        title: 'Meet Our Team',
        members: [
          { name: 'Anshul Kanodia', role: 'CEO & Founder' },
          { name: 'Dr. Sarah Mitchell', role: 'Chief Medical Officer' },
          { name: 'David Park', role: 'Chief Technology Officer' }
        ]
      }
    };

    // Seed the content
    console.log('📝 Seeding Home Page content...');
    await contentService.updateHomePageContent(homePageContent);
    console.log('✅ Home Page content seeded successfully');

    console.log('📝 Seeding About Page content...');
    await contentService.updateAboutPageContent(aboutPageContent);
    console.log('✅ About Page content seeded successfully');

    console.log('🎉 Content seeding completed successfully!');
    console.log('');
    console.log('You can now:');
    console.log('1. Visit your SuperAdmin Dashboard → Content tab');
    console.log('2. Edit any section by clicking on the cards');
    console.log('3. See changes reflected immediately on your website');
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding content:', error);
    process.exit(1);
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedContent()
    .then(() => {
      console.log('✨ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedContent };
