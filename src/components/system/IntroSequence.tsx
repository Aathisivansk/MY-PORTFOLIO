"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface IntroSequenceProps {
    onComplete: () => void;
}

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
            { threshold: 0.5 }
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
                    // Reached the bottom
                    setTimeout(onComplete, 500);
                }
            },
            { threshold: 1.0 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, [onComplete]);

    return (
        <div className="bg-black text-white selection:bg-white/20">
            <IntroSection>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter">
                    Hello.
                </h1>
            </IntroSection>

            <IntroSection className="flex-row gap-12 text-center md:text-left">
                <div className="space-y-4 max-w-xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Placeholder for Profile Photo */}
                        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-white/10 flex-shrink-0" />

                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                                I am Aathisivan.
                            </h2>
                            <p className="text-xl md:text-2xl text-gray-400 mt-4 leading-relaxed">
                                I build things for the web.
                            </p>
                        </div>
                    </div>
                </div>
            </IntroSection>

            <IntroSection>
                <div className="text-center space-y-6">
                    <h3 className="text-3xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">
                        Full Stack Developer.
                    </h3>
                    <h3 className="text-3xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 delay-100">
                        Creative Technologist.
                    </h3>
                    <h3 className="text-3xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 delay-200">
                        Problem Solver.
                    </h3>
                </div>
            </IntroSection>

            {/* Trigger for completion */}
            <div ref={footerRef} className="h-32 flex items-center justify-center">
                <p className="text-sm text-gray-600 animate-pulse">Initializing System...</p>
            </div>
        </div>
    );
};
