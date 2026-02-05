import React from 'react';

const steps = [
    { num: '01', title: 'DETECTION', desc: 'Satellite telemetry and ground-based IoT sensors identify thermal anomalies in millisecond intervals.' },
    { num: '02', title: 'ANALYSIS', desc: 'Neural engines assess risk factors, projected trajectory, and population vulnerability in parallel.' },
    { num: '03', title: 'ALLOCATION', desc: 'Llama-3 logistics pipelines match regional assets to incident requirements with optimal pathfinding.' },
    { num: '04', title: 'RESPONSE', desc: 'Unified command dispatches NDRF specialized units with real-time tactical synchronization.' },
];

const WorkflowSection: React.FC = () => {
    return (
        <div className="py-24 md:py-48 bg-[#020205] text-white relative overflow-hidden">
            {/* Background Neural Grid */}
            <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 md:gap-24">
                    <div className="w-full lg:w-2/5 sticky top-32">
                        <div className="w-16 h-1 bg-cyan-500 mb-10 rounded-full shadow-[0_0_25px_rgba(6,182,212,1)]"></div>
                        <h2 className="text-6xl md:text-8xl font-black mb-10 text-white font-[Outfit] tracking-tighter leading-none italic">
                            OPERATIONAL<br />
                            <span className="text-cyan-500 animate-shimmer bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-white to-cyan-500 bg-[length:200%_auto]">SEQUENCE</span>
                        </h2>
                        <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-md">
                            From initial anomaly detection to full-scale resolution, AetherX automates the critical path of emergency response via neural synchronization.
                        </p>

                        <div className="mt-16 p-8 bg-white/5 border border-white/10 rounded-[2rem] max-w-sm backdrop-blur-xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
                            <div className="flex items-center gap-4 text-cyan-400 font-bold uppercase tracking-[0.3em] text-xs font-[Outfit] relative z-10">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></span>
                                Neural Pipeline: Synced
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-3/5 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute left-[50%] top-0 w-[2px] h-full bg-gradient-to-b from-cyan-500/5 via-cyan-500/20 to-transparent"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {steps.map((step, i) => (
                                <div key={i} className={`group relative p-10 bg-white/5 border border-white/5 rounded-[2.5rem] hover:border-cyan-500/30 transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-md ${i % 2 === 1 ? 'md:translate-y-12' : ''}`}>
                                    {/* Animated Side Indicator */}
                                    <div className="absolute -left-[1px] top-12 w-[3px] h-12 bg-gradient-to-b from-cyan-400 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />

                                    <span className="text-8xl font-black text-white/[0.02] absolute top-4 right-8 select-none font-[Outfit] group-hover:text-cyan-500/5 transition-colors duration-700">{step.num}</span>

                                    <h3 className="text-3xl font-black mb-6 relative z-10 font-[Outfit] tracking-tight group-hover:text-cyan-400 transition-colors duration-500 italic">{step.title}</h3>
                                    <p className="text-gray-500 relative z-10 font-medium leading-relaxed group-hover:text-gray-300 transition-colors duration-500 text-sm md:text-base">{step.desc}</p>

                                    <div className="mt-10 flex items-center justify-between relative z-10">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-cyan-500/40 transition-colors">Step {step.num}</div>
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-cyan-500 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowSection;
