
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
    return <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#0a0a2a]" />;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#0a0a2a]">
      <div 
        className="absolute w-64 h-64 bg-cyan-400/30 rounded-full filter blur-2xl opacity-50 transition-all duration-700 ease-out"
        style={{ 
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: `translate(-50%, -50%)`,
        }}
       />
       <div 
        className="absolute w-48 h-48 bg-purple-400/30 rounded-full filter blur-xl opacity-40 transition-all duration-1000 ease-out delay-100"
        style={{ 
            left: `${100 - mousePosition.x}%`,
            top: `${100 - mousePosition.y}%`,
            transform: `translate(-50%, -50%)`,
        }}
       />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
    </div>
  );
}
