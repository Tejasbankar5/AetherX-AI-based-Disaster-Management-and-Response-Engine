import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import ResourceSidebar from '../components/ResourceSidebar';
import DisasterMap from '../components/DisasterMap';
import { fetchSimulationData, fetchSafeAreas, allocateResources, dispatchResources, type Resource, type DisasterZone, type AllocationPlan, type SafeArea, deleteDisaster, deleteResourcesBulk } from '../lib/api';

const OperationOffice: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessCode, setAccessCode] = useState('');

    // State
    const [resources, setResources] = useState<Resource[]>([]);
    const [zones, setZones] = useState<DisasterZone[]>([]);
    const [safeAreas, setSafeAreas] = useState<SafeArea[]>([]);
    const [allocationPlan, setAllocationPlan] = useState<AllocationPlan | null>(null);
    const [showSafeAreas, setShowSafeAreas] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Auth Check
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (accessCode === 'admin123') {
            setIsAuthenticated(true);
        } else {
            alert('Invalid Access Code');
        }
    };

    // Data Loading
    const loadSimulationData = async () => {
        setLoading(true);
        try {
            const data = await fetchSimulationData();
            setResources(data.resources);
            setZones(data.zones);
            const safe = await fetchSafeAreas();
            setSafeAreas(safe);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Failed to load data", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadSimulationData();
            const interval = setInterval(loadSimulationData, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    // Actions
    const handleAllocate = async () => {
        setLoading(true);
        const filteredZones = selectedZoneId
            ? zones.filter(z => z.id === selectedZoneId)
            : zones;

        try {
            const plan = await allocateResources(resources, filteredZones);
            setAllocationPlan(plan);
        } catch (error) {
            console.error(error);
            alert("Allocation failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDispatch = async () => {
        if (!allocationPlan) return;
        setLoading(true);
        try {
            const res = await dispatchResources(allocationPlan);
            setDispatchStatus(res.message);

            // Track active missions persistently


            setTimeout(() => setDispatchStatus(null), 5000);
            setAllocationPlan(null);
            loadSimulationData(); // Refresh to show status changes
        } catch (error) {
            alert("Dispatch failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteZone = async (zoneId: string) => {
        const zone = zones.find(z => z.id === zoneId);
        if (!zone) return;

        if (!window.confirm(`⚠️ DELETE ALERT?\n\nType: ${zone.type}\nSeverity: ${zone.severity}\n\nThis will remove:\n✓ The disaster alert\n✓ ALL resources (cleanup)\n\nContinue?`)) return;

        setLoading(true);
        try {
            // Bulk delete all resources
            const allResourceIds = resources.map(r => r.id);
            if (allResourceIds.length > 0) {
                await deleteResourcesBulk(allResourceIds);
            }

            // Delete zone
            await deleteDisaster(zoneId);

            // UI Cleanup
            if (allocationPlan) {
                setAllocationPlan(null);
            }
            loadSimulationData();
        } catch (err) {
            console.error(err);
            alert("Failed to remove data.");
        } finally {
            setLoading(false);
        }
    };

    // If not authenticated, show login
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4 pt-24">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-grid pointer-events-none" />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[150px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

                <form onSubmit={handleLogin} className="glass-panel p-8 rounded-2xl w-full max-w-md relative z-10 transition-all duration-500 hover:shadow-cyan-500/10">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                            <Shield className="w-8 h-8 text-cyan-400" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-center text-white mb-2 font-[Outfit] tracking-tight">Restricted Access</h2>
                    <p className="text-gray-400 text-center text-sm mb-4">Enter authorized credentials to access NDEM Ops Center.</p>
                    <div className="mb-8 text-center bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-2">
                        <p className="text-xs text-gray-400 font-mono">
                            Testing Credentials: <span className="text-cyan-400 font-bold tracking-wider">admin123</span>
                        </p>
                    </div>

                    <input
                        type="password"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="Access Code"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] outline-none mb-4 transition-all"
                    />
                    <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        Access Dashboard
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="w-full mt-3 text-gray-400 py-2 text-sm hover:text-white transition">
                        Cancel
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-white overflow-hidden relative pt-24">
            <ResourceSidebar
                resources={resources}
                zones={zones}
                allocationPlan={allocationPlan}
                loading={loading}
                dispatchStatus={dispatchStatus}
                showSafeAreas={showSafeAreas}
                onToggleSafeAreas={() => setShowSafeAreas(!showSafeAreas)}
                onAllocate={handleAllocate}
                onDispatch={handleDispatch}
                onLogout={() => setIsAuthenticated(false)}
                onAlertClick={(_, __, id) => setSelectedZoneId(id || null)}
                onClearSelection={() => setSelectedZoneId(null)}
                selectedZoneId={selectedZoneId}
                onDeleteZone={handleDeleteZone}
            />

            <div className="flex-1 flex flex-col h-full relative">
                {/* Map Layer */}
                <div className="absolute inset-0 z-0">
                    <DisasterMap
                        resources={resources}
                        zones={zones}
                        allocationPlan={allocationPlan}
                        safeAreas={showSafeAreas ? safeAreas : []}
                        showSafeAreas={showSafeAreas}
                        mapView={selectedZoneId
                            ? (() => {
                                const z = zones.find(z => z.id === selectedZoneId);
                                return z ? { lat: z.location.lat, lng: z.location.lng, zoom: 10 } : null;
                            })()
                            : { lat: 20.5937, lng: 78.9629, zoom: 4.5 }
                        }
                        // User request: Don't show visual paths for plan
                        showRoutes={false}
                    />
                </div>

                {/* Overlay Header */}
                <div className="absolute top-0 left-0 w-full z-10 pointer-events-none p-6">
                    <div className="flex justify-between items-start pointer-events-auto">
                        <div className="glass-panel px-6 py-4 rounded-full border border-white/10 flex items-center gap-6">
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black text-white font-[Outfit] tracking-tight leading-none">
                                    OPERATION<span className="text-cyan-400">OFFICE</span>
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] text-emerald-400 font-mono tracking-wide">
                                        DATA SYNC: {lastUpdate.toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10"></div>
                            <span className="text-xs font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">LIVE MONITORING</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperationOffice;
