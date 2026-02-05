import React from 'react';
import { BrainCircuit, Globe, Zap, Users } from 'lucide-react';

const features = [
    {
        icon: <BrainCircuit className="w-8 h-8 md:w-10 md:h-10 text-purple-400 group-hover:text-purple-300 transition-colors" />,
        title: "AI-Driven Strategy",
        desc: "Llama-3 powered strategic analysis and resource allocation justification.",
        glow: "group-hover:shadow-[0_0_50px_rgba(192,132,252,0.2)]",
        border: "group-hover:border-purple-500/50"
    },
    {
        icon: <Globe className="w-8 h-8 md:w-10 md:h-10 text-blue-400 group-hover:text-blue-300 transition-colors" />,
        title: "Real-Time Mapping",
        desc: "Live geospatial visualization of disaster zones and assets across India.",
        glow: "group-hover:shadow-[0_0_50px_rgba(34,211,238,0.2)]",
        border: "group-hover:border-cyan-500/50"
    },
    {
        icon: <Zap className="w-8 h-8 md:w-10 md:h-10 text-yellow-400 group-hover:text-yellow-300 transition-colors" />,
        title: "Instant Deployment",
        desc: "One-click activation of NDRF units with automated route optimization.",
        glow: "group-hover:shadow-[0_0_50px_rgba(250,204,21,0.2)]",
        border: "group-hover:border-yellow-500/50"
    },
    {
        icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-green-400 group-hover:text-green-300 transition-colors" />,
        title: "Citizen Safety",
        desc: "Integrated chatbot and alert system for mass civilian communication.",
        glow: "group-hover:shadow-[0_0_50px_rgba(74,222,128,0.2)]",
        border: "group-hover:border-green-500/50"
    }
];

const FeaturesSection: React.FC = () => {
    return (
        <div id="features" className="py-24 md:py-48 bg-[#020205] relative overflow-hidden">
            {/* Pulsing Neural Nodes in Background */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
                <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-violet-400 rounded-full animate-ping [animation-delay:1s]"></div>
                <div className="absolute top-1/2 left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.1),_transparent_70%)]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-32">
                    <div className="inline-block px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md mb-6 shadow-lg">
                        <span className="text-[10px] font-black tracking-widest text-cyan-500 uppercase">Core Infrastructure</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-8 font-[Outfit] tracking-tighter leading-none italic">
                        SYSTEM <span className="text-cyan-500">CAPABILITIES</span>
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto text-lg md:text-xl font-medium tracking-wide leading-relaxed">
                        Advanced neural modules integrated into a unified, secure disaster response environment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((f, i) => (
                        <div key={i} className={`group p-8 md:p-12 bg-white/5 border border-white/5 rounded-[2.5rem] transition-all duration-700 hover:-translate-y-4 hover:bg-white/10 ${f.glow} ${f.border} relative overflow-hidden shadow-2xl backdrop-blur-lg`}>
                            {/* Decorative Corner Glow */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/5 blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700 rounded-full" />

                            <div className="relative z-10">
                                <div className="mb-10 p-6 bg-white/5 border border-white/10 rounded-3xl w-fit group-hover:scale-110 transition-all duration-500 shadow-2xl backdrop-blur-xl">
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 transition-colors font-[Outfit] tracking-tight group-hover:text-white leading-none italic">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base group-hover:text-gray-300 transition-colors">{f.desc}</p>

                                <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/30 group-hover:text-cyan-500/80 transition-all duration-500">
                                    <span className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_10px_rgba(6,182,212,1)]"></span>
                                    Module Active
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
