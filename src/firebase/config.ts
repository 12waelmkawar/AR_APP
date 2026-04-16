import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase web API keys are intentionally public (security is enforced via Firestore Rules)
const firebaseConfig = {
  apiKey: "AIzaSyDLbt0e_2sYAutjbil8tMuPVVjdf5J3RpM",
  authDomain: "arapp-4d777.firebaseapp.com",
  databaseURL: "https://arapp-4d777-default-rtdb.firebaseio.com",
  projectId: "arapp-4d777",
  storageBucket: "arapp-4d777.firebasestorage.app",
  messagingSenderId: "426570182917",
  appId: "1:426570182917:web:9970587afc07ddd0e5876c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence — non-blocking, failures are warnings only
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('[Firebase] Persistence disabled: multiple tabs open.');
  } else if (err.code === 'unimplemented') {
    console.warn('[Firebase] Persistence not supported in this browser.');
  } else {
    console.warn('[Firebase] Persistence error:', err.message);
  }
});

// Initialize Auth
export const auth = getAuth(app);

export default app;
