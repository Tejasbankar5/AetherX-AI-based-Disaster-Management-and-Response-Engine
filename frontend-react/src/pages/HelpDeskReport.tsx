import React, { useState, useEffect } from 'react';
import { MapPin, Mic, MicOff, Send, AlertTriangle, Flame, Droplets, Stethoscope, Car, HelpCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';

// Types for Speech Recognition
declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

interface HelpDeskReportProps {
    onSubmit: (data: any) => void;
}

const IncidentCategory = ({ icon: Icon, label, selected, onClick }: any) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${selected
            ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105'
            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
            }`}
    >
        <Icon size={32} className={`mb-2 ${selected ? 'text-cyan-400' : 'text-gray-400'}`} />
        <span className={`text-xs font-bold uppercase tracking-wider ${selected ? 'text-white' : 'text-gray-400'}`}>
            {label}
        </span>
    </button>
);

// Map updater component to fly to location
const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 15);
    }, [center, map]);
    return null;
};

const HelpDeskReport: React.FC<HelpDeskReportProps> = ({ onSubmit }) => {
    const [location, setLocation] = useState<[number, number] | null>(null);
    const [locationStatus, setLocationStatus] = useState<'locating' | 'found' | 'error'>('locating');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSOSActive, setIsSOSActive] = useState(false);
    const [voiceError, setVoiceError] = useState<string | null>(null);

    // 1. Get Geolocation on Mount
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation([position.coords.latitude, position.coords.longitude]);
                setLocationStatus('found');
            },
            () => {
                setLocationStatus('error');
                // Fallback to center of India or a default city if needed
                setLocation([20.5937, 78.9629]);
            }
        );
    }, []);

    // 2. Voice Input Logic
    const toggleListing = () => {
        setVoiceError(null);
        if (!('webkitSpeechRecognition' in window)) {
            setVoiceError("Voice input not supported in this browser.");
            setTimeout(() => setVoiceError(null), 3000);
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setDescription(prev => prev + (prev ? ' ' : '') + transcript);
        };

        recognition.onerror = (event: any) => {
            console.error(event.error);
            setIsListening(false);
            setVoiceError("Voice error. Try typing.");
            setTimeout(() => setVoiceError(null), 3000);
        };

        recognition.start();
    };

    // 3. Handle Submit
    const handleSubmit = () => {
        if (!selectedCategory && !isSOSActive) {
            alert("Please select an incident type.");
            return;
        }

        // Simulate delay
        setTimeout(() => {
            onSubmit({
                type: selectedCategory || 'SOS',
                description: isSOSActive ? 'SOS - PANIC BUTTON ACTIVATED' : description,
                location: location,
                timestamp: new Date().toISOString()
            });
        }, 1500);
    };

    // SOS Animation Variants
    const sosVariants = {
        idle: { scale: 1 },
        active: { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full text-white">

            {/* Left: Reporting Form */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">

                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3 font-[Outfit]">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                            REPORT INCIDENT
                        </span>
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                    </h2>
                    <p className="text-gray-300 text-sm mt-1 font-medium">
                        Your report will be prioritized by AI and dispatched to the nearest response unit.
                    </p>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    <IncidentCategory
                        icon={Flame}
                        label="Fire"
                        selected={selectedCategory === 'fire'}
                        onClick={() => setSelectedCategory('fire')}
                    />
                    <IncidentCategory
                        icon={Stethoscope}
                        label="Medical"
                        selected={selectedCategory === 'medical'}
                        onClick={() => setSelectedCategory('medical')}
                    />
                    <IncidentCategory
                        icon={Droplets}
                        label="Flood"
                        selected={selectedCategory === 'flood'}
                        onClick={() => setSelectedCategory('flood')}
                    />
                    <IncidentCategory
                        icon={Car}
                        label="Accident"
                        selected={selectedCategory === 'accident'}
                        onClick={() => setSelectedCategory('accident')}
                    />
                    <IncidentCategory
                        icon={AlertTriangle}
                        label="Collapse"
                        selected={selectedCategory === 'collapse'}
                        onClick={() => setSelectedCategory('collapse')}
                    />
                    <IncidentCategory
                        icon={HelpCircle}
                        label="Other"
                        selected={selectedCategory === 'other'}
                        onClick={() => setSelectedCategory('other')}
                    />
                </div>

                {/* Description & Voice */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-8 relative group focus-within:border-cyan-500/50 transition-colors backdrop-blur-md">
                    <label className="text-xs uppercase font-bold text-cyan-400 mb-2 block tracking-wider">Situation Details</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the emergency... (e.g. 'Trapped on 2nd floor, 3 people')"
                        className="w-full bg-transparent text-gray-200 placeholder-gray-600 focus:outline-none resize-none h-24 font-mono text-sm"
                    />

                    <button
                        onClick={toggleListing}
                        className={`absolute bottom-4 right-4 p-3 rounded-full transition-all ${isListening
                            ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500/50'
                            : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    {isListening && <span className="absolute bottom-5 right-16 text-xs text-red-500 font-bold animate-pulse">Listening...</span>}
                    {voiceError && <span className="absolute bottom-5 right-16 text-xs text-orange-500 font-bold bg-black/50 px-2 py-1 rounded">{voiceError}</span>}
                </div>

                {/* SOS Button */}
                <div className="mb-8 flex items-center gap-4">
                    <motion.button
                        variants={sosVariants}
                        animate={isSOSActive ? "active" : "idle"}
                        onMouseDown={() => setIsSOSActive(true)}
                        onMouseUp={() => setIsSOSActive(false)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-black py-6 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center gap-4 text-xl border border-red-500/30 transition-all font-[Outfit]"
                        onClick={handleSubmit}
                    >
                        <AlertTriangle size={32} />
                        PANIC / SOS
                    </motion.button>
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                    <Send size={20} />
                    Submit Incident Report
                </button>

            </div>

            {/* Right: Map Location Confirmation */}
            <div className="hidden lg:block w-1/3 glass-panel rounded-2xl overflow-hidden border border-white/10 relative shadow-2xl">
                {location ? (
                    <MapContainer
                        center={location}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <Marker position={location} />
                        <MapUpdater center={location} />
                    </MapContainer>
                ) : (
                    <div className="h-full flex items-center justify-center flex-col gap-4 text-gray-500 bg-transparent">
                        <MapPin size={48} className="animate-bounce" />
                        <p>{locationStatus === 'locating' ? 'Acquiring Satellite Lock...' : 'Location Services Unavailable'}</p>
                    </div>
                )}

                <div className="absolute top-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-xl z-[1000] shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${locationStatus === 'found' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-yellow-500 animate-pulse'}`} />
                        <div>
                            <div className="text-xs text-gray-400 uppercase font-bold">Detected Location</div>
                            <div className="text-sm font-mono text-cyan-300">
                                {location ? `${location[0].toFixed(4)}, ${location[1].toFixed(4)}` : 'Searching...'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpDeskReport;
