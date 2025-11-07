
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FirebaseClientProvider } from '@/firebase';
import { CartProvider } from '@/context/cart-context';
import { ParticleBackground } from '@/components/layout/particle-background';

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
      <body className="font-body antialiased flex flex-col min-h-screen">
        <FirebaseClientProvider>
          <CartProvider>
            <Header />
            <div className="flex-grow relative">
                <ParticleBackground />
                <main className="relative z-10">{children}</main>
            </div>
            <Footer />
          </CartProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
