
import React, { useRef, useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SequenceVisualizer from './SequenceVisualizer';

const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const elementHeight = rect.height;
            const viewportHeight = window.innerHeight;

            // Distance available to scroll within this section
            const scrollDistance = elementHeight - viewportHeight;
            // How much we've scrolled into this section
            const scrolledInto = window.scrollY - elementTop;

            const p = Math.min(1, Math.max(0, scrolledInto / scrollDistance));
            setProgress(p);
        };

        handleScroll(); // Initial check
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Text Content based on progress
    const getTextContent = () => {
        if (progress < 0.2) return {
            title: "AETHERX",
            subtitle: "Global Surveillance Network Online",
            opacity: 1 - (progress * 5) // Fade out by 0.2
        };
        if (progress >= 0.2 && progress < 0.5) return {
            title: "DETECT",
            subtitle: "Analysing Satellite Telemetry...",
            opacity: Math.min(1, (progress - 0.2) * 5) * (progress > 0.4 ? 1 - ((progress - 0.4) * 10) : 1)
        };
        if (progress >= 0.5) return {
            title: "DEPLOY",
            subtitle: "Rapid Response Units Active",
            opacity: Math.min(1, (progress - 0.5) * 5)
        };
        return { title: "", subtitle: "", opacity: 0 };
    };

    const text = getTextContent();

    return (
        // Optimized container height for a tighter experience
        <div ref={containerRef} className="relative h-[200vh] bg-[#020205]">
            {/* Neural Glow Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-cyan-500/10 blur-[150px] rounded-full transition-transform duration-1000 ease-out"
                    style={{ transform: `translate(${progress * 50}px, ${progress * -30}px) scale(${1 + progress * 0.2})` }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full transition-transform duration-1000 ease-out"
                    style={{ transform: `translate(${progress * -40}px, ${progress * 20}px) scale(${1 + progress * 0.1})` }}
                />
            </div>

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center text-white">

                {/* Parallax background shift */}
                <div
                    className="absolute inset-0 z-0 transition-transform duration-700 ease-out"
                    style={{ transform: `scale(${1 + progress * 0.1})` }}
                >
                    <SequenceVisualizer progress={progress} />
                </div>

                {/* Dynamic Text Overlay */}
                <div
                    className="relative z-10 text-center space-y-4 md:space-y-8 px-6"
                    style={{
                        opacity: text.opacity,
                        transform: `scale(${1 + progress * 0.05}) translateY(${progress * -30}px)`
                    }}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-md mb-2 md:mb-4 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <span className="text-[8px] md:text-[10px] font-black tracking-[0.4em] text-cyan-400 uppercase flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                            PROTOCOL AETHER-X: ACTIVE
                        </span>
                    </div>

                    <div className="relative group">
                        <h1 className="text-6xl sm:text-7xl md:text-[12rem] font-black tracking-tighter text-white font-[Outfit] leading-none drop-shadow-[0_0_80px_rgba(6,182,212,0.2)] italic transition-all duration-700">
                            {text.title}
                        </h1>
                        {/* Ghost Reflection */}
                        <h1 className="absolute top-2 left-0 w-full text-6xl sm:text-7xl md:text-[12rem] font-black tracking-tighter text-cyan-500/20 font-[Outfit] leading-none -z-10 blur-md select-none">
                            {text.title}
                        </h1>
                    </div>

                    <p className="text-xs sm:text-lg md:text-xl font-medium tracking-[0.4em] md:tracking-[0.8em] uppercase text-cyan-400/80 font-[Outfit] max-w-3xl mx-auto px-4 leading-relaxed">
                        {text.subtitle}
                    </p>
                </div>

                {/* Enter Command Center - Visible at high progress */}
                <div
                    className={`absolute bottom-32 transition-all duration-1000 ${progress > 0.8 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}
                >
                    <button
                        onClick={() => navigate('/operation-office')}
                        className="group relative px-8 md:px-14 py-4 md:py-7 bg-white/5 border border-cyan-500/40 text-white font-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)] hover:shadow-[0_0_70px_rgba(6,182,212,0.4)] transition-all hover:scale-105 active:scale-95 font-[Outfit] tracking-tighter"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 to-violet-600/30 group-hover:from-cyan-600/50 group-hover:to-violet-600/50 transition-all duration-500"></div>
                        <div className="flex items-center gap-4 md:gap-6 relative z-10">
                            <span className="text-xl md:text-3xl uppercase italic tracking-tighter">Initialise Command</span>
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                    </button>
                </div>

                {/* Scroll Indicator (Only visible at start) */}
                <div
                    className={`absolute bottom-10 flex flex-col items-center transition-all duration-700 ${progress > 0.05 ? 'opacity-0 translate-y-10' : 'opacity-100'}`}
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500 mb-6 drop-shadow-md">Scroll to Synchronise</p>
                    <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-500 via-cyan-500/20 to-transparent relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/40 animate-slide-down"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
