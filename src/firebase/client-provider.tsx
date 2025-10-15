'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider, FirebaseContext, FirebaseContextState } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

type FirebaseServices = ReturnType<typeof initializeFirebase>;

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // Initialize Firebase on the client side, once per component mount.
    setFirebaseServices(initializeFirebase());
  }, []); // Empty dependency array ensures this runs only once on mount

  if (!firebaseServices) {
    // While Firebase is initializing, you can return a loading state or null.
    // This prevents children from rendering and trying to access a null context.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
