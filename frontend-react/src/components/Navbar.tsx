import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, HelpCircle, Zap, Menu, X, Siren } from 'lucide-react';
import EmergencyOverlay from './EmergencyOverlay';

const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSOSOpen, setIsSOSOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Mission Control', path: '/dashboard', icon: <LayoutDashboard size={16} /> },
        { name: 'Ops Center', path: '/operation-office', icon: <Shield size={16} /> },
        { name: 'Help Desk', path: '/help-desk', icon: <HelpCircle size={16} /> },
        { name: 'Simulation', path: '/simulation', icon: <Zap size={16} /> },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[40] transition-all duration-500 ${scrolled
                ? 'py-4 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
                : 'py-8 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/30 rounded-xl group-hover:border-cyan-500 transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.15)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                        <Shield className="text-cyan-400 group-hover:scale-110 transition-transform duration-500" size={20} />
                        <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tighter text-white font-[Outfit]">AETHER<span className="text-cyan-500">X</span></span>
                        <span className="text-[8px] font-black tracking-[0.3em] text-cyan-500/60 uppercase">Operational System</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-2xl backdrop-blur-md">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${location.pathname === link.path
                                ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    ))}

                    {/* SOS Button */}
                    <button
                        onClick={() => setIsSOSOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter transition-all duration-300 bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white hover:shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse ml-2"
                    >
                        <Siren size={16} />
                        SOS
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-gray-400 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-white/10 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-4 p-4 rounded-xl text-sm font-bold uppercase tracking-widest ${location.pathname === link.path
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile SOS */}
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                setIsSOSOpen(true);
                            }}
                            className="flex items-center gap-4 p-5 rounded-xl text-lg font-black uppercase tracking-widest bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                        >
                            <Siren size={24} />
                            EMERGENCY SOS
                        </button>
                    </div>
                </div>
            )}

            {/* Global Emergency Overlay */}
            <EmergencyOverlay
                isOpen={isSOSOpen}
                onClose={() => setIsSOSOpen(false)}
            />
        </nav>
    );
};

export default Navbar;
