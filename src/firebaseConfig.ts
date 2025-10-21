import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database'; // Required for Realtime Database

// Configuration details provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyCKKlUgP--Wtzy0ZfWeDje0OohvxlnTwmw",
  authDomain: "fancy-byaifie.firebaseapp.com",
  projectId: "fancy-byaifie",
  storageBucket: "fancy-byaifie.appspot.com",
  messagingSenderId: "321225411393",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the authentication and database instances
export const auth = getAuth(app);
export const db = getDatabase(app); // Initialize Realtime Database

export { app };