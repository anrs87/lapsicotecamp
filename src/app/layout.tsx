import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster'; // Esta es una importación con alias, que tu tsconfig debería manejar
// ¡CORRECCIÓN IMPORTANTE AQUÍ! Asegúrate de que esta ruta relativa sea PERFECTA
// Si Header.tsx está en src/components/layout/Header.tsx, y layout.tsx está en src/app/,
// entonces necesitas subir un nivel (..) y luego bajar a components/layout/Header.
import Header from '../components/layout/Header';
import Footer from '@/components/layout/footer'; // Asumiendo que footer.tsx existe en minúsculas
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



