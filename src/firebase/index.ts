'use client';

import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

import { firebaseConfig } from './config';

// The function to initialize Firebase services
function initializeFirebase(config: FirebaseOptions) {
  const app = initializeApp(config);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const db = getDatabase(app);

  // NOTE: This is a placeholder for the emulator URLs.
  // In a real-world scenario, you would use environment variables.
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR) {
    console.log('Using Firebase Emulators');
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    connectDatabaseEmulator(db, '127.0.0.1', 9000);
  }
  
  return { app, auth, firestore, db };
}

// Export the initialized services
const { app, auth, firestore, db } = initializeFirebase(firebaseConfig);

export { app, auth, firestore, db, initializeFirebase };
export { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth, useDatabase } from './provider';
export { FirebaseClientProvider } from './client-provider';
export { useUser } from './auth/use-user';
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useMemoFirebase } from './use-memo-firebase';
