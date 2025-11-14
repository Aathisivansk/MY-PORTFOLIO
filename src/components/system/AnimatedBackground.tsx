"use client"

export function AnimatedBackground() {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full -z-10 bg-gradient-to-r from-blue-900 via-cyan-500 to-purple-500 bg-[length:200%_200%] animate-liquid-gradient"
    />
  );
}
