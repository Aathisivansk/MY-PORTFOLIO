
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AboutMe() {
  return (
    <div className="p-4 rounded-lg text-right text-foreground" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        <h1 className="text-3xl font-bold">aathisivan.dev</h1>
        <p className="mt-2 text-md max-w-md ml-auto">
            A passionate full-stack developer with a love for creating beautiful, functional, and user-centric digital experiences.
        </p>
    </div>
  );
}
