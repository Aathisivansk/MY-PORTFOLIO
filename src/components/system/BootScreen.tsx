"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BootScreenProps {
    onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
    const [isFading, setIsFading] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        // Simulate some "boot" time or just wait for effect
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleStart = () => {
        setIsFading(true);
        setTimeout(() => {
            onComplete();
        }, 500); // Duration matches CSS transition
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-500 ease-in-out",
                isFading ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
        >
            <div className="flex flex-col items-center space-y-8">
                {/* Animated User Profile / Logo Placeholder */}
                <div className="relative h-32 w-32 animate-pulse rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                    <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
                        <span className="text-4xl font-bold">AS</span>
                    </div>
                </div>

                {/* Greetings */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tighter opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">
                        Liquid Crystal OS v1.0
                    </p>
                </div>

                {/* Start Button */}
                <button
                    onClick={handleStart}
                    disabled={!showButton}
                    className={cn(
                        "group relative px-8 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/10 rounded-full transition-all duration-300 backdrop-blur-sm",
                        showButton ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                    )}
                >
                    <span className="text-sm font-medium tracking-widest uppercase">
                        Click to Start
                    </span>
                    <div className="absolute inset-0 rounded-full bg-primary/5 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};
