
"use client"

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) * 100;
      const y = (clientY / innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMounted]);

  if (!isMounted) {
    // Render a static background on the server to prevent hydration mismatch
    return <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background" />;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background">
      <div 
        className={
            "absolute w-32 h-32 rounded-full filter blur-xl opacity-50 transition-all duration-700 ease-out " + 
            (theme === 'light' ? 'bg-cyan-400/30' : 'bg-purple-600/30')
        }
        style={{ 
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: `translate(-50%, -50%)`,
        }}
       />
       <div 
        className={
            "absolute w-24 h-24 rounded-full filter blur-lg opacity-40 transition-all duration-1000 ease-out delay-100 " +
            (theme === 'light' ? 'bg-purple-400/30' : 'bg-cyan-600/30')
        }
        style={{ 
            left: `${100 - mousePosition.x}%`,
            top: `${100 - mousePosition.y}%`,
            transform: `translate(-50%, -50%)`,
        }}
       />
      <div className={
        "absolute inset-0 transition-colors " + 
        (theme === 'light' ? 'bg-transparent' : 'bg-black/40 backdrop-blur-sm')
      } />
    </div>
  );
}
