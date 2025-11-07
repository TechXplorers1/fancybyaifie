import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCPYLM-jEKyKZVDb9eifRLLloLn56k-A10",
  authDomain: "fancybyaifie-43f12.firebaseapp.com",
  databaseURL: "https://fancybyaifie-43f12-default-rtdb.firebaseio.com",
  projectId: "fancybyaifie-43f12",
  storageBucket: "fancybyaifie-43f12.firebasestorage.app",
  messagingSenderId: "820140493079",
  appId: "1:820140493079:web:e80296ab75bb41d3048f52",
  measurementId: "G-1CXQ7PLT2V"
};

function initializeFirebase() {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const db = getDatabase(app);

  return { app, auth, firestore, db };
}

export { initializeFirebase, firebaseConfig };