// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbc_L5lHKzWEdXmaHLG9jlYRaO9TIRMoU",
  authDomain: "socialdm-db32c.firebaseapp.com",
  projectId: "socialdm-db32c",
  storageBucket: "socialdm-db32c.firebasestorage.app",
  messagingSenderId: "211137231544",
  appId: "1:211137231544:web:852d1ac5fef72741d4524d",
  measurementId: "G-TYZ6R5L526"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };