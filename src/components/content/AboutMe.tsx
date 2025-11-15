
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AboutMe() {
  return (
    <div className="p-4 rounded-lg text-right text-foreground" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        <h1 className="text-3xl font-bold">aathisivan.io</h1>
        <p className="mt-2 text-md max-w-md ml-auto">
            As a Tech Enthusiast, I am on a mission to build IoT products that are not just useful, but also secure. I specialize in cybersecurity with a focus on IoT and have a strong foundation in Python. I am a strong believer in T-shaped learning: developing deep expertise in security while building a broad skill set across the full project life-cycle—from initial concept to final deployment. Let's build something impactful together.
        </p>
    </div>
  );
}
