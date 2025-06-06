import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster'; // Esto aún usa alias, pero suele ser menos problemático para componentes UI

// ¡SOLUCIÓN CRÍTICA PARA EL ERROR DE COMPILACIÓN!
// Usamos rutas relativas directas para Header y Footer.
// ASEGÚRATE que estos paths coincidan EXACTAMENTE con la ubicación y capitalización de tus archivos.
// Si tu archivo es 'src/components/layout/Header.tsx'
import Header from '../components/layout/Header';
// Si tu archivo es 'src/components/layout/Footer.tsx'
import Footer from '../components/layout/Footer'; // Asegúrate que 'Footer' sea con F mayúscula

import './globals.css';

export const metadata: Metadata = {
  title: 'PsiConnect',
  description: 'Conectando mentes, empoderando profesionales.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}




