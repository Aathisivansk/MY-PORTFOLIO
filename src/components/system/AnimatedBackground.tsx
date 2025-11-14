
"use client"

import { useState, useEffect } from 'react';

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
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
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900 bg-[length:200%_200%] transition-all duration-1000 ease-out"
        style={{
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`
        }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/5 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-cyan-400/10 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000" />
    </div>
  );
}
