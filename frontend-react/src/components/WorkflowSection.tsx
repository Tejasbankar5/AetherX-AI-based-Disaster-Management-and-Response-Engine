import React from 'react';

const steps = [
    { num: '01', title: 'Detection', desc: 'Satellite & IoT sensors detect anomalies.' },
    { num: '02', title: 'Analysis', desc: 'AI assesses severity and risk factors.' },
    { num: '03', title: 'Allocation', desc: 'Resources matched to needs instantly.' },
    { num: '04', title: 'Response', desc: 'Unified command dispatches assets.' },
];

const WorkflowSection: React.FC = () => {
    return (
        <div className="py-32 bg-background text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16">
                    <div className="w-full md:w-2/5">
                        <div className="w-12 h-1 bg-cyan-500 mb-8 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"></div>
                        <h2 className="text-6xl font-black mb-8 text-white font-[Outfit] tracking-tighter leading-tight">
                            OPERATIONAL<br />
                            <span className="text-cyan-500">SEQUENCE</span>
                        </h2>
                        <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-md">
                            From initial anomaly detection to full-scale resolution, AetherX automates the critical path of emergency response.
                        </p>

                        <div className="mt-12 p-6 glass-panel rounded-2xl border-cyan-500/20 max-w-sm">
                            <div className="flex items-center gap-4 text-cyan-400 font-bold uppercase tracking-widest text-xs font-[Outfit]">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Neural Pipeline Active
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="group relative p-10 glass-panel rounded-3xl border border-white/5 hover:border-cyan-500/40 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="absolute -left-1 top-10 w-2 h-1/2 bg-gradient-to-b from-cyan-500 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="text-7xl font-black text-white/5 absolute top-4 right-8 select-none font-[Outfit]">{step.num}</span>
                                <h3 className="text-3xl font-black mb-4 relative z-10 font-[Outfit] tracking-tight group-hover:text-cyan-400 transition-colors">{step.title}</h3>
                                <p className="text-gray-400 relative z-10 font-medium leading-relaxed group-hover:text-gray-300 transition-colors">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowSection;
