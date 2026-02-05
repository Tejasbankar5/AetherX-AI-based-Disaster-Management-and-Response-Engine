import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createDisaster, createResource, fetchSimulationData, fetchSafeAreas, allocateResources, dispatchResources, deleteResource, deleteDisaster, startSimulation, type DisasterCreate, type ResourceCreate, type Resource, type DisasterZone, type SafeArea, type AllocationPlan } from '../lib/api';
import { Activity, Flame, Truck, AlertTriangle, Map as MapIcon, Info, BrainCircuit, Send, Layers, Radio, Crosshair, Trash2, PlayCircle } from 'lucide-react';

// Fix for Leaflet default icon issues in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons same as Operation Office for consistency
const createIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}80;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const resourceIcon = createIcon('#3b82f6'); // Blue
const disasterIcon = createIcon('#ef4444'); // Red
const safeAreaIcon = createIcon('#22c55e'); // Green

// --- Map Helper Components (Defined outside to prevent re-renders) ---

const MapNavigator = ({ view }: { view: { lat: number, lng: number, zoom: number } | null }) => {
    const map = useMap();
    useEffect(() => {
        if (view) {
            map.flyTo([view.lat, view.lng], view.zoom);
        }
    }, [view, map]);
    return null;
};

const MapEvents = ({
    activeTab,
    setDisasterForm,
    setResourceForm
}: {
    activeTab: string,
    setDisasterForm: React.Dispatch<React.SetStateAction<DisasterCreate>>,
    setResourceForm: React.Dispatch<React.SetStateAction<ResourceCreate>>
}) => {
    const map = useMap();
    useEffect(() => {
        const handleClick = (e: any) => {
            const { lat, lng } = e.latlng;
            const roundedLat = parseFloat(lat.toFixed(4));
            const roundedLng = parseFloat(lng.toFixed(4));

            // Update whichever form is active
            if (activeTab === 'disaster') {
                setDisasterForm(prev => ({ ...prev, location: { lat: roundedLat, lng: roundedLng } }));
            } else if (activeTab === 'resource') {
                setResourceForm(prev => ({ ...prev, location: { lat: roundedLat, lng: roundedLng } }));
            }
        };

        map.on('click', handleClick);
        return () => {
            map.off('click', handleClick);
        };
    }, [map, activeTab, setDisasterForm, setResourceForm]);
    return null;
};

const SimulationPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'disaster' | 'resource' | 'allocation'>('disaster');
    const [mapView, setMapView] = useState<{ lat: number, lng: number, zoom: number } | null>(null);

    // Forms Data
    const [disasterForm, setDisasterForm] = useState<DisasterCreate>({
        type: 'Flood',
        location: { lat: 20.59, lng: 78.96 }, // Default India Center
        severity: 'Medium',
    });

    const [resourceForm, setResourceForm] = useState<ResourceCreate>({
        type: 'Ambulance',
        location: { lat: 19.0760, lng: 72.8777 }, // Mumbai
        capacity: 10,
        specialization: [],
    });

    // Simulation State
    const [resources, setResources] = useState<Resource[]>([]);
    const [zones, setZones] = useState<DisasterZone[]>([]);
    const [safeAreas, setSafeAreas] = useState<SafeArea[]>([]);
    const [allocationPlan, setAllocationPlan] = useState<AllocationPlan | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();

        // Auto-refresh every 5 seconds to stay in sync with Operation Office
        const interval = setInterval(loadData, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            const simData = await fetchSimulationData();
            setResources(simData.resources);
            setZones(simData.zones);
            const safeData = await fetchSafeAreas();
            setSafeAreas(safeData);
            setLastUpdate(new Date());
        } catch (e) {
            console.error("Failed to load simulation data", e);
        }
    };

    const handleDisasterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'lat' || name === 'lng') {
            setDisasterForm(prev => ({
                ...prev,
                location: { ...prev.location, [name]: parseFloat(value) }
            }));
        } else {
            setDisasterForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'lat' || name === 'lng') {
            setResourceForm(prev => ({
                ...prev,
                location: { ...prev.location, [name]: parseFloat(value) }
            }));
        } else if (name === 'capacity') {
            setResourceForm(prev => ({ ...prev, capacity: parseInt(value) }));
        } else {
            setResourceForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDisasterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const result = await createDisaster(disasterForm);
            setMessage(`Disaster "${result.zone.type}" injected at [${result.zone.location.lat}, ${result.zone.location.lng}]!`);
            loadData();
        } catch (err) {
            console.error(err);
            setError('Failed to create disaster.');
        } finally {
            setLoading(false);
        }
    };

    const handleResourceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            await createResource(resourceForm);
            setMessage(`Resource "${resourceForm.type}" deployed successfully!`);
            loadData();
        } catch (err) {
            setError('Failed to create resource.');
        } finally {
            setLoading(false);
        }
    };

    const handleAllocate = async () => {
        setLoading(true);
        try {
            const plan = await allocateResources(resources, zones);
            setAllocationPlan(plan);
            setMessage(`Allocation Plan Generated! Score: ${plan.total_score.toFixed(2)}`);
        } catch (e) {
            setError("Failed to generate allocation plan.");
        } finally {
            setLoading(false);
        }
    };

    const handleDispatch = async () => {
        if (!allocationPlan) return;
        setLoading(true);
        try {
            await dispatchResources(allocationPlan);
            setMessage("Resources Dispatched Successfully (Simulation)!");
            setAllocationPlan(null);
        } catch (e) {
            setError("Failed to dispatch resources.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteZone = async (e: React.MouseEvent, zoneId: string) => {
        e.stopPropagation(); // Prevent map flyTo

        const zone = zones.find(z => z.id === zoneId);
        if (!zone) return;

        setLoading(true);
        try {
            // 1. Delete ALL resources (not just allocated ones)
            const deletePromises = resources.map(res => deleteResource(res.id));
            await Promise.all(deletePromises);

            // 2. Delete Zone
            await deleteDisaster(zoneId);

            // 3. Update UI
            if (allocationPlan) {
                // Remove allocations for this zone from local plan to avoid ghost lines
                setAllocationPlan(prev => prev ? ({
                    ...prev,
                    allocations: prev.allocations.filter(a => a.zone_id !== zoneId)
                }) : null);
            }

            setMessage(`✅ Disaster zone and ${resources.length} resources removed.`);
            loadData();

        } catch (err) {
            console.error(err);
            setError("Failed to remove disaster data.");
        } finally {
            setLoading(false);
        }
    };

    const handleStartSimulation = async () => {
        if (!window.confirm("This will clear all current simulation data and generate a new scenario. Continue?")) return;
        setLoading(true);
        setMessage(null);
        setError(null);
        try {
            const res = await startSimulation();
            setMessage(res.message);
            setAllocationPlan(null); // Clear old plan
            await loadData(); // Reload new data
        } catch (e) {
            console.error(e);
            setError("Failed to start new simulation.");
        } finally {
            setLoading(false);
        }
    };

    const handleAlertClick = (lat: number, lng: number) => {
        setMapView({ lat, lng, zoom: 12 });
    };

    return (
        <div className="flex flex-col h-screen bg-background text-white overflow-hidden font-sans selection:bg-cyan-500/30 pt-24">
            {/* Header */}
            <header className="px-6 h-16 flex items-center justify-between border-b border-white/5 bg-background/80 backdrop-blur-xl z-50 shrink-0 relative">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-600/10 border border-cyan-500/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                        <Activity className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight text-white leading-tight font-[Outfit]">
                            AETHER<span className="text-cyan-500">X</span>
                        </h1>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                            DISASTER SIMULATION ENVIRONMENT
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleStartSimulation}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/50 rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] font-[Outfit]"
                    >
                        <PlayCircle size={14} />
                        New Simulation
                    </button>
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                            <span className="text-xs font-semibold text-gray-300">{zones.length} Active Zones</span>
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
                            <span className="text-xs font-semibold text-gray-300">{resources.length} Resources</span>
                        </div>
                        <div className="w-px h-3 bg-white/10"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs text-gray-500 font-mono">{lastUpdate.toLocaleTimeString()}</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Left Panel: Controls */}
                <div className="w-[400px] flex flex-col bg-card/60 backdrop-blur-xl border-r border-white/10 z-20 shadow-2xl relative">

                    {/* Navigation Tabs */}
                    <div className="p-4 pb-0">
                        <div className="grid grid-cols-3 gap-1 p-1 bg-black/20 rounded-xl border border-white/5">
                            <button
                                onClick={() => setActiveTab('disaster')}
                                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 font-[Outfit] ${activeTab === 'disaster'
                                    ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Flame size={14} /> Inject
                            </button>
                            <button
                                onClick={() => setActiveTab('resource')}
                                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 font-[Outfit] ${activeTab === 'resource'
                                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Truck size={14} /> Deploy
                            </button>
                            <button
                                onClick={() => setActiveTab('allocation')}
                                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 font-[Outfit] ${activeTab === 'allocation'
                                    ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <BrainCircuit size={14} /> AI Plan
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

                        {/* Feedback Messages */}
                        {message && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-sm flex items-start gap-3 shadow-[0_0_15px_rgba(16,185,129,0.1)] animate-in fade-in slide-in-from-top-2">
                                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                <p className="leading-snug font-medium">{message}</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm flex items-start gap-3 shadow-[0_0_15px_rgba(239,68,68,0.1)] animate-in fade-in slide-in-from-top-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p className="leading-snug font-medium">{error}</p>
                            </div>
                        )}

                        {/* Forms */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-inner relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            {activeTab === 'disaster' && (
                                <form onSubmit={handleDisasterSubmit} className="space-y-5 relative z-10">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block font-[Outfit]">Disaster Type</label>
                                            <div className="relative">
                                                <select name="type" value={disasterForm.type} onChange={handleDisasterChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all appearance-none cursor-pointer hover:bg-black/60">
                                                    <option value="Flood" className="bg-gray-900">Flood</option>
                                                    <option value="Cyclone" className="bg-gray-900">Cyclone</option>
                                                    <option value="Earthquake" className="bg-gray-900">Earthquake</option>
                                                    <option value="Landslide" className="bg-gray-900">Landslide</option>
                                                    <option value="Heat Wave" className="bg-gray-900">Heat Wave</option>
                                                    <option value="Drought" className="bg-gray-900">Drought</option>
                                                </select>
                                                <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
                                                    <Layers size={14} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block font-[Outfit]">Latitude</label>
                                                <div className="relative">
                                                    <input type="number" step="0.0001" name="lat" value={disasterForm.location.lat} onChange={handleDisasterChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-mono pl-3 hover:bg-black/60" />
                                                    <span className="absolute right-3 top-3.5 text-gray-600 text-xs font-mono">N</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block font-[Outfit]">Longitude</label>
                                                <div className="relative">
                                                    <input type="number" step="0.0001" name="lng" value={disasterForm.location.lng} onChange={handleDisasterChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50 transition-all font-mono pl-3 hover:bg-black/60" />
                                                    <span className="absolute right-3 top-3.5 text-gray-600 text-xs font-mono">E</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
                                            <Crosshair size={12} />
                                            <span>Click map to set coordinates</span>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block font-[Outfit]">Intensity Level</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                                                    <button
                                                        key={level}
                                                        type="button"
                                                        onClick={() => setDisasterForm(prev => ({ ...prev, severity: level }))}
                                                        className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border transition-all ${disasterForm.severity === level
                                                            ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                                            : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'
                                                            }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group font-[Outfit]">
                                        <div className={`p-1 bg-white/20 rounded-full ${loading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`}>
                                            <Radio size={14} />
                                        </div>
                                        {loading ? 'INITIATING...' : 'INJECT SCENARIO'}
                                    </button>
                                </form>
                            )}

                            {activeTab === 'resource' && (
                                <form onSubmit={handleResourceSubmit} className="space-y-5 relative z-10">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block font-[Outfit]">Resource Type</label>
                                            <select name="type" value={resourceForm.type} onChange={handleResourceChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer hover:bg-black/60">
                                                <option value="Ambulance" className="bg-gray-900">Ambulance</option>
                                                <option value="Fire Truck" className="bg-gray-900">Fire Truck</option>
                                                <option value="Police" className="bg-gray-900">Police</option>
                                                <option value="Rescue Team" className="bg-gray-900">Rescue Team</option>
                                                <option value="NDRF Team" className="bg-gray-900">NDRF Team</option>
                                                <option value="Helicopter" className="bg-gray-900">Helicopter</option>
                                                <option value="Supply Truck" className="bg-gray-900">Supply Truck</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block font-[Outfit]">Latitude</label>
                                                <input type="number" step="0.01" name="lat" value={resourceForm.location.lat} onChange={handleResourceChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono hover:bg-black/60" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block font-[Outfit]">Longitude</label>
                                                <input type="number" step="0.01" name="lng" value={resourceForm.location.lng} onChange={handleResourceChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono hover:bg-black/60" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block font-[Outfit]">Unit Capacity</label>
                                            <input type="number" name="capacity" value={resourceForm.capacity} onChange={handleResourceChange} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all hover:bg-black/60" />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group font-[Outfit]">
                                        <div className={`p-1 bg-white/20 rounded-full ${loading ? 'animate-pulse' : 'group-hover:translate-x-1 transition-transform'}`}>
                                            <Truck size={14} />
                                        </div>
                                        {loading ? 'DEPLOYING...' : 'DEPLOY RESOURCE'}
                                    </button>
                                </form>
                            )}

                            {activeTab === 'allocation' && (
                                <div className="space-y-6 relative z-10">
                                    <div className="text-sm text-gray-300 leading-relaxed border-l-2 border-violet-500 pl-3">
                                        <strong className="text-violet-400 block mb-1 font-[Outfit]">AI Allocation Engine</strong>
                                        Optimizes resource distribution using geospatial analysis and severity weighting to maximize coverage score.
                                    </div>

                                    {!allocationPlan ? (
                                        <button
                                            onClick={handleAllocate}
                                            disabled={loading}
                                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(124,58,237,0.4)] border border-violet-500/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden font-[Outfit]"
                                        >
                                            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                            <BrainCircuit size={18} />
                                            <span className="relative">{loading ? 'CALCULATING STRATEGY...' : 'GENERATE AI PLAN'}</span>
                                        </button>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                            <div className="bg-black/40 border border-violet-500/30 p-4 rounded-xl shadow-inner backdrop-blur-md">
                                                <div className="flex justify-between items-end mb-4 pb-4 border-b border-white/5">
                                                    <span className="text-xs font-bold text-gray-500 uppercase font-[Outfit]">Optimization Score</span>
                                                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-white font-[Outfit]">{allocationPlan.total_score.toFixed(1)}</span>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Resources Allocated</span>
                                                        <span className="font-bold text-white">{allocationPlan.allocations.length}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Critical Zones Pending</span>
                                                        <span className="font-bold text-red-400">{allocationPlan.unserved_zones.length}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-400">Compute Time</span>
                                                        <span className="font-mono text-xs text-violet-400">{allocationPlan.computation_time_ms}ms</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setAllocationPlan(null)}
                                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm font-semibold transition border border-white/10"
                                                >
                                                    Discard
                                                </button>
                                                <button
                                                    onClick={handleDispatch}
                                                    disabled={loading}
                                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 border border-emerald-500/30"
                                                >
                                                    <Send size={16} />
                                                    Dispatch
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mini List / Live Feed */}
                        <div className="pt-2">
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2 font-[Outfit]">
                                <Activity size={10} /> Live Feed
                            </h3>
                            <div className="space-y-2">
                                {zones.length === 0 && resources.length === 0 && (
                                    <div className="text-center py-8 text-gray-600 text-xs italic">
                                        No active events in simulation
                                    </div>
                                )}
                                {zones.slice(0, 5).map(zone => (
                                    <div
                                        key={zone.id}
                                        onClick={() => handleAlertClick(zone.location.lat, zone.location.lng)}
                                        className="group flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-red-500/10 hover:border-red-500/40 cursor-pointer transition-all hover:bg-white/10"
                                    >
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className="text-xs font-bold text-gray-200 group-hover:text-red-400 transition-colors font-[Outfit]">{zone.type} Alert</div>
                                                <button
                                                    onClick={(e) => handleDeleteZone(e, zone.id)}
                                                    className="text-gray-500 hover:text-red-400 p-1.5 rounded-md hover:bg-red-500/20 transition-all border border-transparent hover:border-red-500/30"
                                                    title="Delete Zone & All Resources"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-0.5 font-mono">{zone.location.lat.toFixed(2)}, {zone.location.lng.toFixed(2)}</div>
                                        </div>
                                        <div className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 self-center">
                                            {zone.severity}
                                        </div>
                                    </div>
                                ))}
                                {resources.slice(0, 5).map(res => (
                                    <div
                                        key={res.id}
                                        onClick={() => handleAlertClick(res.location.lat, res.location.lng)}
                                        className="group flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-cyan-500/10 hover:border-cyan-500/40 cursor-pointer transition-all hover:bg-white/10"
                                    >
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-200 group-hover:text-cyan-400 transition-colors font-[Outfit]">{res.type} Deployed</div>
                                            <div className="text-[10px] text-gray-500 mt-0.5 font-mono">ID: {res.id.slice(0, 8)}...</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content: Map */}
                <div className="flex-1 relative bg-[#020617]">
                    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }} className="z-0 bg-[#020617]">
                        <MapNavigator view={mapView} />
                        <MapEvents activeTab={activeTab} setDisasterForm={setDisasterForm} setResourceForm={setResourceForm} />
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />

                        {/* Resources */}
                        {resources.map(res => (
                            <Marker
                                key={res.id}
                                position={[res.location.lat, res.location.lng]}
                                icon={resourceIcon}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-1">
                                        <div className="text-xs font-bold text-cyan-600 uppercase mb-1">{res.type}</div>
                                        <div className="text-xs text-slate-700 font-medium">Status: {res.status}</div>
                                        <div className="text-xs text-slate-500">Capacity: {res.capacity}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Disaster Zones */}
                        {zones.map(zone => (
                            <Marker key={zone.id} position={[zone.location.lat, zone.location.lng]} icon={disasterIcon}>
                                <Popup className="custom-popup">
                                    <div className="p-1 min-w-[120px]">
                                        <div className="text-sm font-black text-red-600 uppercase mb-1">{zone.type}</div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">Severity</span>
                                            <span className="font-bold text-slate-800">{zone.severity}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Affected</span>
                                            <span className="font-bold text-slate-800">{zone.affected_population.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Popup>
                                <Circle center={[zone.location.lat, zone.location.lng]} radius={zone.severity * 2000} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 1, dashArray: '5,5' }} />
                            </Marker>
                        ))}

                        {/* Safe Areas */}
                        {safeAreas.map(safe => (
                            <Marker key={safe.id} position={[safe.location.lat, safe.location.lng]} icon={safeAreaIcon}>
                                <Popup>
                                    <div className="text-slate-800 text-xs">
                                        <strong className="text-emerald-600 block mb-1">{safe.type}</strong>
                                        Capacity: {safe.capacity}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Allocations Lines */}
                        {allocationPlan && allocationPlan.allocations.map((alloc, i) => {
                            const res = resources.find(r => r.id === alloc.resource_id);
                            const zone = zones.find(z => z.id === alloc.zone_id);
                            if (!res || !zone) return null;
                            return (
                                <Polyline
                                    key={i}
                                    positions={[[res.location.lat, res.location.lng], [zone.location.lat, zone.location.lng]]}
                                    pathOptions={{ color: '#8b5cf6', weight: 2, dashArray: '8, 8', opacity: 0.8 }}
                                />
                            );
                        })}
                    </MapContainer>

                    {/* Legend Overlay */}
                    <div className="absolute bottom-8 right-8 glassy-panel p-5 rounded-2xl shadow-2xl border border-white/5 backdrop-blur-md z-[1000] min-w-[180px]">
                        <h4 className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-wider flex items-center gap-2 font-[Outfit]">
                            <MapIcon size={12} /> Live Legend
                        </h4>
                        <div className="space-y-3.5">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-cyan-500 border-2 border-black/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
                                <span className="text-xs font-medium text-gray-300">Active Units</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-black/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                <span className="text-xs font-medium text-gray-300">High Risk Zones</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-black/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-xs font-medium text-gray-300">Safe Shelters</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-0.5 w-4 bg-violet-500 border border-violet-500 border-dashed"></div>
                                <span className="text-xs font-medium text-gray-300">Allocation Path</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SimulationPage;
