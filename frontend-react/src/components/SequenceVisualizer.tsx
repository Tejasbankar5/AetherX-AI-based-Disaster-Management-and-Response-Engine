import React from 'react';

interface SequenceVisualizerProps {
    progress: number;
}

const SequenceVisualizer: React.FC<SequenceVisualizerProps> = ({ progress }) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-transparent">
            {/* Background Gradient */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-background to-background"
                style={{
                    opacity: 0.4 + progress * 0.6,
                    transform: `scale(${1 + progress * 0.1})`
                }}
            />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 flex flex-wrap opacity-20"
                style={{
                    transform: `scale(${1 + progress * 1.5}) perspective(1000px) rotateX(${60 - progress * 40}deg) translateY(${progress * -10}%)`,
                    transformOrigin: 'center bottom',
                    transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)'
                }}
            >
                {Array.from({ length: 144 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-[8.33%] h-[8.33%] border-[0.5px] border-cyan-500/10"
                        style={{
                            backgroundColor: Math.random() < progress ? `rgba(6, 182, 212, ${0.05 + progress * 0.1})` : 'transparent',
                            boxShadow: Math.random() < progress * 0.1 ? '0 0 15px rgba(6, 182, 212, 0.2)' : 'none'
                        }}
                    />
                ))}
            </div>

            {/* Central Pulse & Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="w-[400px] h-[400px] border border-cyan-500/30 rounded-full"
                    style={{
                        transform: `scale(${0.5 + progress * 3})`,
                        opacity: Math.max(0, 0.8 - progress * 1.5),
                        boxShadow: `0 0 100px rgba(6, 182, 212, ${0.1 + progress * 0.2}), inset 0 0 50px rgba(6, 182, 212, 0.05)`,
                        filter: `blur(${progress * 4}px)`
                    }}
                />
                <div
                    className="absolute w-[600px] h-[600px] border border-violet-500/20 rounded-full"
                    style={{
                        transform: `scale(${0.8 + progress * 2})`,
                        opacity: Math.max(0, 0.4 - progress),
                        boxShadow: `0 0 150px rgba(124, 58, 237, 0.1)`
                    }}
                />

                {/* scanning effect */}
                <div
                    className="absolute w-[150%] h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent top-1/2 -translate-y-1/2 blur-md"
                    style={{
                        transform: `translateY(${Math.sin(Date.now() / 1000) * 100}px)`,
                        opacity: 0.2 + progress * 0.3
                    }}
                ></div>

                {/* Data HUD particles */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                    <div className="absolute top-[20%] left-[20%] w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute top-[30%] right-[25%] w-1 h-1 bg-violet-400 rounded-full animate-ping [animation-delay:1s]"></div>
                    <div className="absolute bottom-[25%] left-[30%] w-1 h-1 bg-cyan-400 rounded-full animate-ping [animation-delay:2s]"></div>
                </div>
            </div>
        </div>
    );
};

export default SequenceVisualizer;
