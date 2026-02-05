import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import WorkflowSection from '../components/WorkflowSection';

const LandingPage: React.FC = () => {
    return (
        <div className="bg-background min-h-screen text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
            {/* Background Decorative Elements */}
            <div className="fixed top-0 left-0 w-full h-full bg-grid pointer-events-none z-0 opacity-[0.05]" />
            <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none z-0 rotate-12" />

            <div className="relative z-10 space-y-0">
                <HeroSection />
                <FeaturesSection />
                <WorkflowSection />

                {/* Simple Footer */}
                <footer className="py-12 border-t border-white/5 bg-black/40 text-center text-gray-500 text-sm backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="font-[Outfit] tracking-widest uppercase text-xs mb-4 opacity-50">Secure Operational Environment</p>
                        <p>&copy; 2026 AetherX Disaster Management System. ISRO / NRSC Data Integration.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default LandingPage;
