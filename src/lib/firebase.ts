import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase environment variables are set
const missingVars = Object.entries(firebaseConfig).filter(([_, value]) => !value);
if (missingVars.length > 0) {
  const missing = missingVars.map(([key]) => key).join(', ');
  throw new Error(`Missing Firebase configuration variables: ${missing}. Check your .env.local file.`);
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('[Firebase] Successfully initialized');
} catch (error) {
  console.error('[Firebase] Initialization error:', error);
  throw error;
}

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
