"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface IntroSequenceProps {
    onComplete: () => void;
}

const TypewriterText = ({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(startTimer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 50); // Typing speed

        return () => clearInterval(intervalId);
    }, [started, text]);

    return (
        <span className={cn("inline-block", className)}>
            {displayedText}
            <span className={cn("inline-block w-[0.1em] h-[1em] bg-current ml-1 animate-pulse", started && displayedText.length === text.length ? "hidden" : "")} />
        </span>
    );
};

const IntroSection = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.4 } // Lower threshold for better trigger on mobile
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn(
                "min-h-screen flex flex-col items-center justify-center transition-all duration-1000 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                className
            )}
        >
            {children}
        </div>
    );
};

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(onComplete, 1000); // Give user a moment to see the bottom
                }
            },
            { threshold: 0.5 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, [onComplete]);

    // Added h-screen and overflow-y-auto to fix the scroll issue. Removed bg-black/text-white for theme consistency.
    return (
        <div className="fixed inset-0 z-50 h-screen w-screen overflow-y-auto bg-background text-foreground selection:bg-primary/20 scroll-smooth">
            <IntroSection>
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter">
                    <TypewriterText text="Hello." delay={200} />
                </h1>
            </IntroSection>

            <IntroSection className="flex-row gap-12 text-center md:text-left">
                <div className="space-y-4 max-w-xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Placeholder for Profile Photo */}
                        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-border flex-shrink-0 animate-pulse" />

                        <div className="flex flex-col">
                            {/* TypewriterText for storytelling */}
                            <div className="text-4xl md:text-6xl font-bold tracking-tight">
                                <TypewriterText text="I am Aathisivan." delay={200} />
                            </div>
                            <p className="text-xl md:text-2xl text-muted-foreground mt-4 leading-relaxed">
                                <TypewriterText text="I build things for the web." delay={1500} className="font-light" />
                            </p>
                        </div>
                    </div>
                </div>
            </IntroSection>

            <IntroSection>
                <div className="text-center space-y-6">
                    <div className="text-3xl md:text-5xl font-medium">
                        <TypewriterText text="Full Stack Developer." delay={0} />
                    </div>
                    <div className="text-3xl md:text-5xl font-medium">
                        <TypewriterText text="Creative Technologist." delay={1500} />
                    </div>
                    <div className="text-3xl md:text-5xl font-medium">
                        <TypewriterText text="Problem Solver." delay={3000} />
                    </div>
                </div>
            </IntroSection>

            {/* Trigger for completion */}
            <div ref={footerRef} className="h-32 flex items-center justify-center pb-10">
                <p className="text-sm text-muted-foreground animate-pulse">Initializing System...</p>
            </div>
        </div>
    );
};
