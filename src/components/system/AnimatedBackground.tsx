"use client"

import Image from 'next/image';

export function AnimatedBackground() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10">
      <Image
        src="https://images.unsplash.com/photo-1554034483-04fda0d3507b?q=80&w=2070&auto=format&fit=crop"
        alt="Welcome background"
        layout="fill"
        objectFit="cover"
        quality={100}
        data-ai-hint="abstract background"
      />
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}
