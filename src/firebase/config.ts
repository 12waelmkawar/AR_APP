import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Get Firebase configuration from localStorage or use default
const storedConfig = localStorage.getItem('firebase_config');
let firebaseConfig: any = null;

if (storedConfig) {
  try {
    firebaseConfig = JSON.parse(storedConfig);
  } catch (e) {
    console.error('Failed to parse Firebase config from localStorage:', e);
  }
}

// Fallback config (should be replaced with actual config)
if (!firebaseConfig) {
  firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence
export const db = getFirestore(app);

// Enable offline persistence (optional but recommended)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('Browser does not support offline persistence.');
  }
});

// Initialize Auth
export const auth = getAuth(app);

export default app;
