const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
let db;

async function initializeFirebase() {
  try {
    // Check if Firebase is already initialized
    if (admin.apps.length > 0) {
      db = admin.firestore();
      console.log('✅ Firebase already initialized');
      return true;
    }

    // Debug environment variables (without exposing sensitive data)
    console.log('🔍 Checking Firebase environment variables...');
    console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
    console.log('FIREBASE_PRIVATE_KEY_ID:', process.env.FIREBASE_PRIVATE_KEY_ID ? '✅ Set' : '❌ Missing');
    console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? `✅ Set (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : '❌ Missing');
    console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
    console.log('FIREBASE_CLIENT_ID:', process.env.FIREBASE_CLIENT_ID ? '✅ Set' : '❌ Missing');

    // Validate required environment variables
    const requiredVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID', 
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required Firebase environment variables: ${missingVars.join(', ')}`);
    }

    // Clean and format the private key
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // Handle different private key formats
    if (privateKey.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // Ensure proper formatting
    if (!privateKey.includes('\n')) {
      // If it's a single line, try to format it properly
      privateKey = privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
        .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
    }

    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL)}`
    };

    console.log('🔥 Initializing Firebase Admin SDK...');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });

    db = admin.firestore();
    
    // Test the connection
    await db.collection('test').limit(1).get();
    
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // More specific error messages
    if (error.message.includes('private_key')) {
      console.error('🔑 Private key format issue. Check that the private key is properly formatted with line breaks.');
    }
    if (error.message.includes('project_id')) {
      console.error('🏗️ Project ID issue. Verify the Firebase project ID is correct.');
    }
    
    return false;
  }
}

function getFirestore() {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
}

module.exports = {
  initializeFirebase,
  getFirestore,
  admin
};
