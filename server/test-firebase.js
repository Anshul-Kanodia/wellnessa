require('dotenv').config();
const { initializeFirebase, getFirestore } = require('./firebase-config');

async function testFirebaseConnection() {
  console.log('🧪 Testing Firebase connection...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  try {
    const success = await initializeFirebase();
    
    if (success) {
      const db = getFirestore();
      
      // Try to write a test document
      console.log('📝 Testing write operation...');
      await db.collection('test').doc('connection-test').set({
        timestamp: new Date(),
        message: 'Firebase connection test successful'
      });
      
      // Try to read it back
      console.log('📖 Testing read operation...');
      const doc = await db.collection('test').doc('connection-test').get();
      
      if (doc.exists) {
        console.log('✅ Firebase connection test PASSED');
        console.log('Data:', doc.data());
        
        // Clean up test document
        await db.collection('test').doc('connection-test').delete();
        console.log('🧹 Test document cleaned up');
      } else {
        console.log('❌ Could not read test document');
      }
    } else {
      console.log('❌ Firebase initialization failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Firebase connection test FAILED:', error.message);
    process.exit(1);
  }
}

// Run the test
testFirebaseConnection();
