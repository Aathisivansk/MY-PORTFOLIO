"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface IntroSequenceProps {
    onComplete: () => void;
}

const GlideText = ({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) => {
    const [start, setStart] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setStart(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <span
            className={cn(
                "inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/20 bg-[size:200%_auto] transition-all duration-1000 ease-linear",
                start ? "animate-gradient-x opacity-100" : "opacity-0",
                className
            )}
            style={{
                // Fallback / alternate typing effect: masking
                backgroundSize: "200% 100%",
                backgroundPosition: start ? "0% center" : "100% center",
                transition: `background-position 1.5s ease-out ${delay}ms, opacity 0.5s ease-out ${delay}ms`
            }}
        >
            {text}
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

    // Added h-screen and overflow-y-auto to fix the scroll issue
    return (
        <div className="fixed inset-0 z-50 h-screen w-screen overflow-y-auto bg-black text-white selection:bg-white/20 scroll-smooth">
            <IntroSection>
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter">
                    <GlideText text="Hello." delay={200} />
                </h1>
            </IntroSection>

            <IntroSection className="flex-row gap-12 text-center md:text-left">
                <div className="space-y-4 max-w-xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Placeholder for Profile Photo */}
                        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-white/10 flex-shrink-0 animate-pulse" />

                        <div className="flex flex-col">
                            {/* GlideText for storytelling */}
                            <div className="text-4xl md:text-6xl font-bold tracking-tight">
                                <GlideText text="I am Aathisivan." delay={200} />
                            </div>
                            <p className="text-xl md:text-2xl text-gray-400 mt-4 leading-relaxed">
                                <GlideText text="I build things for the web." delay={800} className="font-light" />
                            </p>
                        </div>
                    </div>
                </div>
            </IntroSection>

            <IntroSection>
                <div className="text-center space-y-6">
                    <div className="text-3xl md:text-5xl font-medium">
                        <GlideText text="Full Stack Developer." delay={0} />
                    </div>
                    <div className="text-3xl md:text-5xl font-medium">
                        <GlideText text="Creative Technologist." delay={300} />
                    </div>
                    <div className="text-3xl md:text-5xl font-medium">
                        <GlideText text="Problem Solver." delay={600} />
                    </div>
                </div>
            </IntroSection>

            {/* Trigger for completion */}
            <div ref={footerRef} className="h-32 flex items-center justify-center pb-10">
                <p className="text-sm text-gray-600 animate-pulse">Initializing System...</p>
            </div>
        </div>
    );
};
