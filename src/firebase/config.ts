import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKKlUgP--Wtzy0ZfWeDje0OohvxlnTwmw",
  authDomain: "fancy-byaifie.firebaseapp.com",
  projectId: "fancy-byaifie",
  storageBucket: "fancy-byaifie.appspot.com",
  messagingSenderId: "321225411393",
  appId: "1:321225411393:web:af785002931235659345c6"
};

function initializeFirebase() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const db = getDatabase(app);

  return { app, auth, firestore, db };
}

export { initializeFirebase, firebaseConfig };
