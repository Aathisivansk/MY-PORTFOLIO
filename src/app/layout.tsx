import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { DesktopProvider } from '@/contexts/DesktopContext';
import { AnimatedBackground } from '@/components/system/AnimatedBackground';

export const metadata: Metadata = {
  title: 'Liquid Crystal OS Portfolio',
  description: 'A personal portfolio for aathisivan.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <DesktopProvider>
          <AnimatedBackground />
          <div className="relative z-10 h-screen w-screen overflow-hidden">
            {children}
          </div>
          <Toaster />
        </DesktopProvider>
      </body>
    </html>
  );
}
