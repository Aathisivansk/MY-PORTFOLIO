"use client"

import Image from 'next/image';

export function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Image
        src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
        alt="Futuristic tech background"
        layout="fill"
        objectFit="cover"
        quality={100}
        data-ai-hint="circuit board technology"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
