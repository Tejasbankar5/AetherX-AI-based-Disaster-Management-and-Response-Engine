
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X, ChevronRight, AlertTriangle, Activity } from 'lucide-react';
import { Button } from './ui/button';
import EmergencyOverlay from './EmergencyOverlay';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [emergencyOpen, setEmergencyOpen] = useState(false);
    const location = useLocation();

    // Scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Mission Control', path: '/dashboard' },
        { name: 'Simulation', path: '/simulation' },
        { name: 'Help Desk', path: '/help-desk' },
    ];

    return (
        <>
            <EmergencyOverlay isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />

            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
                    ? 'glass-nav py-3'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">

                    {/* Left: Logo */}
                    <div className="flex-1">
                        <Link to="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative w-11 h-11 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/30 to-violet-600/30 rounded-xl blur-sm group-hover:blur-md transition-all duration-500"></div>
                                <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"></div>
                                <Zap className="w-6 h-6 text-cyan-400 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-black tracking-tighter text-white font-[Outfit]">
                                    AETHER<span className="text-cyan-500">X</span>
                                </h1>
                                <span className="text-[10px] font-bold text-cyan-500/50 uppercase tracking-[0.3em] -mt-1">Neutralize Risk</span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Navigation Pills */}
                    <div className="hidden lg:flex items-center gap-1 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-1.5 shadow-2xl">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link key={link.path} to={link.path}>
                                    <button
                                        className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 font-[Outfit] ${isActive
                                            ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {link.name}
                                    </button>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-1 flex justify-end gap-4 items-center">
                        <Button
                            variant="destructive"
                            onClick={() => setEmergencyOpen(true)}
                            className="rounded-xl px-6 py-6 font-black shadow-[0_0_25px_rgba(239,68,68,0.3)] border border-red-500/40 gap-3 hover:scale-105 transition-all bg-gradient-to-r from-red-600 to-red-800 font-[Outfit] tracking-tighter"
                        >
                            <AlertTriangle className="w-4 h-4" />
                            <span className="hidden sm:inline">SOS ACTIVATION</span>
                        </Button>

                        <Link to="/operation-office" className="hidden lg:block">
                            <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-2xl rounded-xl px-6 py-6 gap-3 group transition-all hover:border-cyan-500/40 font-[Outfit] tracking-tighter">
                                <Activity className="w-4 h-4 text-emerald-400 group-hover:animate-pulse" />
                                <span className="font-bold">OPS CONTROL</span>
                            </Button>
                        </Link>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl text-white/80 hover:text-white ml-2 transition-colors shadow-lg"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-[calc(100%+12px)] left-6 right-6 glass-panel rounded-2xl border border-white/10 p-4 flex flex-col gap-3 animate-in slide-in-from-top-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all group"
                            >
                                <span className="text-gray-400 group-hover:text-white font-bold uppercase tracking-widest text-xs font-[Outfit]">{link.name}</span>
                                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-cyan-400" />
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
