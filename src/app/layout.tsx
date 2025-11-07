
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FirebaseClientProvider, useUser, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { CartProvider } from '@/context/cart-context';
import { ParticleBackground } from '@/components/layout/particle-background';
import { useEffect } from 'react';
import { doc, increment } from 'firebase/firestore';


function ActivityTracker() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userRef = useMemoFirebase(() => {
    return user ? doc(firestore, 'users', user.uid) : null;
  }, [user, firestore]);

  useEffect(() => {
    if (!userRef) return;
    
    // Update time spent every 30 seconds
    const interval = setInterval(() => {
      updateDocumentNonBlocking(userRef, {
        timeSpent: increment(30),
        ecoPoints: increment(1) // Award 1 EcoPoint every 30 seconds
      });
    }, 30000); 

    return () => clearInterval(interval);
  }, [userRef]);

  return null; // This component does not render anything
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <title>EcoCity - Join the Green Revolution</title>
        <meta name="description" content="A comprehensive platform for waste awareness and recycling, making waste management easy and rewarding." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <CartProvider>
            <ActivityTracker />
            <Header />
            <div className="relative z-10">
                <ParticleBackground />
                <main>{children}</main>
            </div>
            <Footer />
          </CartProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
