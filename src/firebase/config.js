// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0NKHkGQXgGH0OHlF1o4uYP82rf_6Pg7g",
  authDomain: "taskmind-1463f.firebaseapp.com",
  projectId: "taskmind-1463f",
  storageBucket: "taskmind-1463f.firebasestorage.app",
  messagingSenderId: "340435678875",
  appId: "1:340435678875:web:a597de38d9974a7a40383e",
  measurementId: "G-REBZQGLFRQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics }; 