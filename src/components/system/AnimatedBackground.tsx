
"use client"

import { useState, useEffect } from 'react';

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
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
    return <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background" />;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-background">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background via-blue-200/10 to-cyan-200/10 bg-[length:200%_200%] transition-all duration-1000 ease-out"
        style={{
            backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`
        }}
      />
       <div 
        className="absolute w-96 h-64 bg-cyan-300/40 rounded-full filter blur-3xl opacity-30 animate-pulse transition-all duration-1000 ease-in-out" 
        style={{ 
            left: `${mousePosition.x - 25}%`,
            top: `${mousePosition.y - 20}%`,
            transform: `rotate(${mousePosition.x / 2}deg)`
        }}
       />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
    </div>
  );
}
