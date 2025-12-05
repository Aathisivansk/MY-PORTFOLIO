"use client";

import { useState, useEffect } from "react";
import { Desktop } from "@/components/system/Desktop";
import { Taskbar } from "@/components/system/Taskbar";
import { BootScreen } from "@/components/system/BootScreen";
import { cn } from "@/lib/utils";

export default function Home() {
  const [hasBooted, setHasBooted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const booted = sessionStorage.getItem("hasBooted");
    if (booted) {
      setHasBooted(true);
    }
    setIsLoading(false);
  }, []);

  const handleBootComplete = () => {
    setHasBooted(true);
    sessionStorage.setItem("hasBooted", "true");
  };

  if (isLoading) return null; // Or a simple loader to prevent flash

  return (
    <div className="h-full w-full">
      {!hasBooted && <BootScreen onComplete={handleBootComplete} />}
      <div className={cn(
        "h-full w-full transition-opacity duration-1000",
        hasBooted ? "opacity-100" : "opacity-0"
      )}>
        <Desktop />
        <Taskbar />
      </div>
    </div>
  );
}
