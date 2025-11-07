
'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

type FirebaseServices = ReturnType<typeof initializeFirebase>;

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsClient(true);
    setFirebaseServices(initializeFirebase());
  }, []);

  if (!isClient || !firebaseServices) {
    // While waiting for the client to mount and Firebase to initialize,
    // show a loading indicator. This prevents children from rendering prematurely.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Once Firebase is initialized on the client, render the full provider.
  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
      storage={firebaseServices.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
