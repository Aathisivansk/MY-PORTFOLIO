"use client";

import { useState, useEffect } from "react";
import { Desktop } from "@/components/system/Desktop";
import { Taskbar } from "@/components/system/Taskbar";
import { BootScreen } from "@/components/system/BootScreen";
import { IntroSequence } from "@/components/system/IntroSequence";
import { cn } from "@/lib/utils";

export default function Home() {
  const [bootStep, setBootStep] = useState<"intro" | "boot" | "desktop">("intro");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasBooted = sessionStorage.getItem("hasBooted");
    if (hasBooted) {
      setBootStep("desktop");
    }
    setIsLoading(false);
  }, []);

  const handleIntroComplete = () => {
    setBootStep("boot");
    // Optional: scroll to top if needed, though unmounting handles it
    window.scrollTo(0, 0);
  };

  const handleBootComplete = () => {
    setBootStep("desktop");
    sessionStorage.setItem("hasBooted", "true");
  };

  if (isLoading) return null;

  return (
    <div className="h-full w-full bg-transparent">
      {/* Intro Sequence */}
      {bootStep === "intro" && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}

      {/* Boot Screen */}
      {bootStep === "boot" && (
        <BootScreen onComplete={handleBootComplete} />
      )}

      {/* Desktop Environment */}
      <div className={cn(
        "h-full w-full transition-opacity duration-1000",
        bootStep === "desktop" ? "opacity-100" : "opacity-0 hidden"
      )}>
        <Desktop />
        <Taskbar />
      </div>
    </div>
  );
}
