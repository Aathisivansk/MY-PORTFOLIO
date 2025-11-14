
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
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden bg-[#0a0a2a]">
      <div 
        className="absolute w-96 h-96 bg-cyan-400/50 rounded-full filter blur-3xl opacity-40 transition-all duration-1000 ease-out"
        style={{ 
            left: `${mousePosition.x - 25}%`,
            top: `${mousePosition.y - 20}%`,
            transform: `translate(-50%, -50%) rotate(${mousePosition.x}deg) scale(${1 + mousePosition.y / 200})`,
        }}
       />
       <div 
        className="absolute w-80 h-80 bg-purple-400/50 rounded-full filter blur-3xl opacity-30 transition-all duration-1000 ease-out delay-100"
        style={{ 
            left: `${100 - mousePosition.x - 25}%`,
            top: `${100 - mousePosition.y - 20}%`,
            transform: `translate(-50%, -50%) rotate(-${mousePosition.x}deg) scale(${1 + mousePosition.x / 200})`,
        }}
       />
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
    </div>
  );
}
