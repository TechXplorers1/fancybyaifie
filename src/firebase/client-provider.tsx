'use client';

import { FirebaseProvider } from './provider';
import { app, auth, firestore, db } from './index';

interface FirebaseClientProviderProps {
  children: React.ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  return (
    <FirebaseProvider value={{ app, auth, firestore, db }}>
      {children}
    </FirebaseProvider>
  );
}
