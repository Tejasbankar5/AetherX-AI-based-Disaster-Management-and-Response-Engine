import React from 'react';
import { BrainCircuit, Globe, Zap, Users } from 'lucide-react';

const features = [
    {
        icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
        title: "AI-Driven Strategy",
        desc: "Llama-3 powered strategic analysis and resource allocation justification."
    },
    {
        icon: <Globe className="w-8 h-8 text-blue-400" />,
        title: "Real-Time Mapping",
        desc: "Live geospatial visualization of disaster zones and assets across India."
    },
    {
        icon: <Zap className="w-8 h-8 text-yellow-400" />,
        title: "Instant Deployment",
        desc: "One-click activation of NDRF units with automated route optimization."
    },
    {
        icon: <Users className="w-8 h-8 text-green-400" />,
        title: "Citizen Safety",
        desc: "Integrated chatbot and alert system for mass civilian communication."
    }
];

const FeaturesSection: React.FC = () => {
    return (
        <div id="features" className="py-32 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05),_transparent_70%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-[Outfit] tracking-tighter">
                        CORE <span className="text-cyan-500">CAPABILITIES</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium tracking-wide">
                        Advanced neural modules integrated into a unified disaster response environment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="group p-10 glass-panel rounded-3xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-8 p-5 bg-white/5 border border-white/10 rounded-2xl w-fit group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300 shadow-xl">
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors font-[Outfit] tracking-tight">{f.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-medium text-sm group-hover:text-gray-300 transition-colors">{f.desc}</p>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/40 group-hover:text-cyan-500/80 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                Module Online
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
