
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AboutMe() {
  return (
    <div className="p-4 rounded-lg text-right text-foreground" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        <h1 className="text-3xl font-bold">aathisivan.io</h1>
        <p className="mt-2 text-md max-w-md ml-auto">
            I build secure and useful IoT products, specializing in cybersecurity and Python. I believe in deep expertise in security combined with a broad skill set across the entire project lifecycle. Let's build something impactful.
        </p>
    </div>
  );
}
