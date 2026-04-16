import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Priority: .env file → localStorage (setup wizard) → placeholder defaults
const envConfig = import.meta.env.VITE_FIREBASE_PROJECT_ID ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
} : null;

// Fallback: check localStorage (from setup wizard)
const storedConfig = localStorage.getItem('firebase_config');
let localConfig: any = null;
if (storedConfig) {
  try {
    localConfig = JSON.parse(storedConfig);
  } catch (e) {
    console.error('Failed to parse Firebase config from localStorage:', e);
  }
}

// Use env config first, then localStorage, then placeholders
const firebaseConfig = envConfig || localConfig || {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

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
