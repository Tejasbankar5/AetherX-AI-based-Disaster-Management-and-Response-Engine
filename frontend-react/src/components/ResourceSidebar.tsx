import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Navigation, CheckCircle, Map as MapIcon, LogIn, LayoutDashboard, Newspaper, ExternalLink, BrainCircuit, RefreshCw, Trash2 } from 'lucide-react';
import { type Resource, type DisasterZone, type AllocationPlan, fetchDisasterNews, type NewsItem, sendChatMessage, requestReinforcements } from '../lib/api';
import { getResourceIcon } from '../utils/mapUtils';

interface ResourceSidebarProps {
    resources: Resource[];
    zones: DisasterZone[];
    allocationPlan: AllocationPlan | null;
    loading: boolean;
    dispatchStatus: string | null;
    showSafeAreas: boolean;
    onToggleSafeAreas: () => void;
    onAllocate: () => void;
    onDispatch: () => void;
    onLogout: () => void;
    onAlertClick: (lat: number, lng: number, zoneId?: string) => void;
    onClearSelection: () => void;
    selectedZoneId?: string | null;
    onDeleteZone?: (id: string) => void;
}

const ResourceSidebar: React.FC<ResourceSidebarProps> = ({
    resources,
    zones,
    allocationPlan,
    loading,
    dispatchStatus,
    showSafeAreas,
    onToggleSafeAreas,
    onAllocate,
    onDispatch,
    onLogout,
    onAlertClick,
    onClearSelection,
    selectedZoneId,
    onDeleteZone
}) => {
    // ... [rest of state code omitted for brevity while applying logic in return] ...

    const [activeTab, setActiveTab] = useState<'dashboard' | 'news'>('dashboard');
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loadingNews, setLoadingNews] = useState(false);
    const navigate = useNavigate();

    // AI Analysis State
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (activeTab === 'news' && news.length === 0) {
            setLoadingNews(true);
            fetchDisasterNews()
                .then(items => setNews(items))
                .catch(err => console.error("News fetch failed", err))
                .finally(() => setLoadingNews(false));
        }
    }, [activeTab, news.length]);

    // ... rest of effect hooks ...

    useEffect(() => {
        setAiAnalysis(null);
    }, [selectedZoneId]);

    // Auto-save to localStorage for Help Desk persistence
    useEffect(() => {
        if (allocationPlan) {
            const data = {
                allocationPlan,
                resources,
                zones,
                selectedZoneId,
                dispatchStatus
            };
            localStorage.setItem('helpDeskData', JSON.stringify(data));
        }
    }, [allocationPlan, resources, zones, selectedZoneId, dispatchStatus]);

    const handleAnalyzeSituation = async () => {
        setAnalyzing(true);
        setAiAnalysis(null);
        try {
            // Construct Detailed Context
            let contextMsg = "";
            let nearbyResourcesContext = "";

            if (selectedZoneId) {
                const zone = zones.find(z => z.id === selectedZoneId);
                if (zone) {
                    contextMsg = `URGENT FOCUS: ${zone.type} (Severity ${zone.severity}) at [${zone.location.lat.toFixed(2)}, ${zone.location.lng.toFixed(2)}].`;

                    // Specific Proximity Check
                    const nearby = resources
                        .map(r => ({ ...r, dist: Math.sqrt(Math.pow(r.location.lat - zone.location.lat, 2) + Math.pow(r.location.lng - zone.location.lng, 2)) * 111 }))
                        .filter(r => r.dist < 200) // 200km radius
                        .sort((a, b) => a.dist - b.dist);

                    if (nearby.length > 0) {
                        const nearbySummary = nearby.map(r => `- ${r.type} (${r.status}) at ${r.dist.toFixed(0)}km`).join('\n');
                        nearbyResourcesContext = `\nAVAILABLE ASSETS WITHIN 200KM:\n${nearbySummary}`;
                    } else {
                        nearbyResourcesContext = "\nWARNING: NO ASSETS WITHIN 200KM RANGE.";
                    }
                }
            } else {
                const zoneSummary = zones.map(z => `- ${z.type} (Sev ${z.severity})`).join('\n');
                contextMsg = `OVERVIEW OF ACTIVE INCIDENTS:\n${zoneSummary}`;
                nearbyResourcesContext = `\nFleet Status: ${resources.filter(r => r.status === 'Available').length} units available out of ${resources.length}.`;
            }

            const prompt = `COMMANDER BRIEFING REQUEST\n${contextMsg}\n${nearbyResourcesContext}\n\nTask: Provide a concise, tactical response plan. If assets are nearby, mandate their specific deployment. If no assets are close, request reinforcements. Be direct.`;

            const response = await sendChatMessage(prompt, "commander-1");
            setAiAnalysis(response.reply);
        } catch (error) {
            console.error(error);
            setAiAnalysis("Communication link with AI Command failed.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="w-96 glass-panel border-r border-white/10 flex flex-col z-20 shadow-2xl h-full font-sans backdrop-blur-xl">
            <div className="p-4 bg-white/5 border-b border-white/10">
                <h1 className="text-lg font-bold flex items-center gap-2 tracking-wide text-white font-[Outfit]">
                    <MapIcon className="text-cyan-400" size={20} />
                    NDEM Ops Center
                </h1>
                <p className="text-[10px] text-cyan-300/70 uppercase tracking-widest ml-7">ISRO / NRSC Powered</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-transparent p-1 gap-1">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition ${activeTab === 'dashboard' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
                >
                    <LayoutDashboard size={16} /> Dashboard
                </button>

                <button
                    onClick={() => setActiveTab('news')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition ${activeTab === 'news' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
                >
                    <Newspaper size={16} /> News
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-transparent custom-scrollbar">

                {/* 1. DASHBOARD TAB */}
                {activeTab === 'dashboard' && (
                    <div className="p-4 space-y-6">
                        {/* Stats Panel */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center hover:bg-white/10 transition">
                                <div className="text-red-400 font-bold text-2xl filter drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">{zones.length}</div>
                                <div className="text-[10px] uppercase text-gray-400 tracking-wider">Active Zones</div>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center hover:bg-white/10 transition">
                                <div className="text-cyan-400 font-bold text-2xl filter drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{resources.length}</div>
                                <div className="text-[10px] uppercase text-gray-400 tracking-wider">Resources</div>
                            </div>
                        </div>

                        {/* Allocation Plan / Help Desk */}
                        {allocationPlan && (
                            <div className="p-1">
                                <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-3 shadow-lg backdrop-blur-md">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                            <span className="text-cyan-400">🤖</span> AI Response Logistics
                                        </h3>
                                        <button
                                            onClick={() => {
                                                const data = {
                                                    allocationPlan,
                                                    resources,
                                                    zones,
                                                    selectedZoneId
                                                };
                                                localStorage.setItem('helpDeskData', JSON.stringify(data));
                                                navigate('/help-desk', { state: data });
                                            }}
                                            title="Open Full Screen Help Desk"
                                            className="text-gray-400 hover:text-cyan-400 transition"
                                        >
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>

                                    {/* Help Desk Table */}
                                    <div className="overflow-hidden rounded border border-white/10">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-white/5 text-gray-300 uppercase font-bold text-[10px]">
                                                <tr>
                                                    <th className="px-2 py-1">Resource</th>
                                                    <th className="px-2 py-1 text-right">Dist</th>
                                                    <th className="px-2 py-1 text-right">ETA</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5 bg-transparent">
                                                {allocationPlan.allocations.map((alloc, idx) => {
                                                    const res = resources.find(r => r.id === alloc.resource_id);
                                                    return (
                                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                                            <td className="px-2 py-1.5 flex items-center gap-2">
                                                                <span className="text-sm">{res ? getResourceIcon(res.type) : '📦'}</span>
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-gray-200">{res?.type}</span>
                                                                    <span className="text-[9px] text-gray-500 font-mono">{alloc.resource_id.slice(0, 6)}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-2 py-1.5 text-right font-mono text-cyan-400">
                                                                {alloc.distance_km ? alloc.distance_km.toFixed(1) : '?'}km
                                                            </td>
                                                            <td className="px-2 py-1.5 text-right font-mono text-emerald-400">
                                                                {alloc.eta_minutes}m
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={onDispatch}
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <span>🚀</span> Confirm & Dispatch
                                        </button>
                                        <button
                                            onClick={onClearSelection}
                                            className="px-3 bg-white/10 hover:bg-white/20 text-gray-300 rounded transition text-xs font-bold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                {/* AI Rationale Box */}
                                <div className="bg-cyan-900/10 border border-cyan-500/20 p-3 rounded text-xs text-cyan-100 italic mb-4">
                                    <span className="font-bold text-cyan-400 not-italic">Strategy: </span>
                                    {allocationPlan.ai_rationale || "Resources optimized for proximity and severity coverage."}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Response Tools</h3>

                            {/* Dispatch Summary Report */}
                            {dispatchStatus && (
                                <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 rounded animate-in fade-in zoom-in duration-300 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2 border-b border-emerald-500/20 pb-1">
                                        <CheckCircle size={14} /> Mission Authorized
                                    </div>
                                    <div className="space-y-1.5 max-h-[150px] overflow-y-auto scrollbar-thin">
                                        {allocationPlan?.allocations.map((alloc, idx) => {
                                            const res = resources.find(r => r.id === alloc.resource_id);
                                            return (
                                                <div key={idx} className="flex justify-between items-center text-[10px] text-gray-300">
                                                    <span>{res?.type || alloc.resource_id}</span>
                                                    <span className="text-emerald-500">➜ Deployed</span>
                                                </div>
                                            );
                                        }) || <div className="text-[10px] text-gray-400">Status Updated</div>}
                                    </div>
                                </div>
                            )}

                            {/* AI Analysis Button */}
                            <button
                                onClick={handleAnalyzeSituation}
                                disabled={analyzing}
                                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition text-sm box-border border ${analyzing ? 'bg-purple-900/50 text-purple-300 border-purple-500/30 animate-pulse' : 'bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-500 hover:to-violet-700 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] border-violet-500/30'}`}
                            >
                                <BrainCircuit size={16} />
                                {analyzing ? 'Consulting AI...' : 'AI Strategic Analysis'}
                            </button>

                            {/* AI Result Card */}
                            {aiAnalysis && (
                                <div className="bg-violet-900/10 border border-violet-500/30 p-3 rounded-xl animate-in fade-in zoom-in duration-300 backdrop-blur-sm">
                                    <h4 className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <BrainCircuit size={12} /> Commander's Brief
                                    </h4>
                                    <div className="text-xs text-violet-100 leading-relaxed font-mono space-y-2">
                                        {aiAnalysis.split('\n').map((line, i) => {
                                            const parts = line.split(/(\*\*.*?\*\*)/g);
                                            return (
                                                <p key={i} className={line.trim().startsWith('1.') || line.trim().startsWith('2.') ? 'pl-2' : ''}>
                                                    {parts.map((part, j) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <span key={j} className="font-bold text-white bg-violet-500/20 px-1 rounded">{part.slice(2, -2)}</span>;
                                                        }
                                                        return part;
                                                    })}
                                                </p>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={onAllocate}
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition text-sm border box-border ${loading ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-transparent' : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] border-cyan-400/50'}`}
                            >
                                <Navigation size={16} />
                                {allocationPlan ? 'Re-Calculate Plan' : (selectedZoneId ? 'Plan for Selected Zone' : 'Generate Allocation Plan')}
                            </button>

                            {/* Allocation Plan Details */}
                            {allocationPlan && (
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <h3 className="text-xs font-bold text-emerald-400 mb-3 flex items-center justify-between uppercase tracking-wider">
                                        <span>Plan Generated</span>
                                        <span className="bg-emerald-900/30 px-2 py-0.5 rounded text-[10px]">{allocationPlan.allocations.length} Routes</span>
                                    </h3>

                                    {/* AI Rationale Display */}
                                    {allocationPlan.ai_rationale && (
                                        <div className="bg-blue-900/20 p-2 mb-3 rounded border-l-2 border-blue-500">
                                            <p className="text-[10px] text-blue-200 italic font-mono leading-tight">
                                                "{allocationPlan.ai_rationale}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Reinforcement Workflow */}
                                    {allocationPlan.unserved_zones.length > 0 && (
                                        <div className="mb-3 animate-in fade-in slide-in-from-left-4">
                                            <button
                                                onClick={async () => {
                                                    // Request reinforcements for unserved zones
                                                    if (allocationPlan.unserved_zones.length > 0) {
                                                        const btn = document.getElementById('reinforce-btn');
                                                        if (btn) btn.innerText = "Deploying National Assets...";

                                                        await requestReinforcements(allocationPlan.unserved_zones);

                                                        // Brief delay to simulate deployment then re-plan
                                                        setTimeout(() => {
                                                            onAllocate(); // Re-trigger allocation to incorporate new units
                                                        }, 1500);
                                                    }
                                                }}
                                                id="reinforce-btn"
                                                className="w-full py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 border border-red-500/50"
                                            >
                                                <RefreshCw size={14} className="animate-spin-slow" />
                                                Request National Reinforcements
                                            </button>
                                            <p className="text-[9px] text-orange-300/60 text-center mt-1">
                                                *Authorizes deployment of NDRF reserve units
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-400">
                                        <div>Score: <span className="text-white">{allocationPlan.total_score.toFixed(1)}</span></div>
                                        <div>Pending: <span className="text-red-400">{allocationPlan.unserved_zones.length}</span></div>
                                    </div>
                                    <button
                                        onClick={onDispatch}
                                        disabled={loading}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 uppercase tracking-wide transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                    >
                                        <CheckCircle size={14} />
                                        Confirm & Dispatch
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={onToggleSafeAreas}
                                className={`w-full py-2 px-4 rounded-lg border font-semibold flex items-center justify-center gap-2 transition text-xs uppercase tracking-wide ${showSafeAreas ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400' : 'bg-transparent border-white/10 hover:bg-white/5 text-gray-400'}`}
                            >
                                <Shield size={14} />
                                {showSafeAreas ? 'Hide Safe Areas' : 'Show Safe Areas'}
                            </button>
                        </div>

                        {/* Live Alerts */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest pl-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                Current Incidents
                            </h3>
                            <div className="space-y-2">
                                {zones.map(zone => (
                                    <div
                                        key={zone.id}
                                        onClick={() => onAlertClick(zone.location.lat, zone.location.lng, zone.id)}
                                        className={`glass-panel p-3 rounded-xl border-l-4 hover:bg-white/5 cursor-pointer transition relative group ${selectedZoneId === zone.id ? 'border-l-yellow-400 bg-white/10' : 'border-l-red-500 border-white/5'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-sm font-bold text-gray-200">{zone.type}</span>
                                            <div className="flex items-center gap-2">
                                                {(allocationPlan?.allocations.some(a => a.zone_id === zone.id) || zone.status === 'Processing') && (
                                                    <span className="text-[9px] bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider animate-pulse border border-emerald-500/30">
                                                        Processing
                                                    </span>
                                                )}
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${zone.severity >= 8 ? 'bg-red-900/50 text-red-500' :
                                                    zone.severity >= 5 ? 'bg-orange-900/50 text-orange-500' :
                                                        'bg-cyan-900/50 text-cyan-500'
                                                    }`}>
                                                    Lv {zone.severity}
                                                </span>
                                                {onDeleteZone && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDeleteZone(zone.id);
                                                        }}
                                                        className="text-gray-600 hover:text-red-400 p-1 rounded hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Delete Incident"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="text-[10px] text-gray-500">
                                                Pop: <span className="text-gray-300">{zone.affected_population}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-mono">
                                                {zone.location.lat.toFixed(2)}, {zone.location.lng.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Last Updated Timestamp */}
                        <div className="text-center pt-2">
                            <div className="text-[9px] uppercase text-gray-600 tracking-wider flex items-center justify-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                Last Updated: {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SERVICES TAB (Static/Mock for Visuals) */}


                {/* 3. NEWS TAB (Static/Mock) */}
                {activeTab === 'news' && (
                    <div className="p-4 space-y-3">
                        <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest pl-1">Latest Updates</h3>
                        {loadingNews ? (
                            <div className="text-center text-gray-500 text-xs py-4">Fetching live updates...</div>
                        ) : (
                            news.map((item, i) => (
                                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="block bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 cursor-pointer transition group">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-[10px] text-cyan-400">{item.source}</div>
                                        <ExternalLink size={10} className="text-gray-600 group-hover:text-gray-400" />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-300 leading-snug mb-1">
                                        {item.title}
                                    </p>
                                    <div className="text-[9px] text-gray-500">{new Date(item.published).toLocaleString()}</div>
                                </a>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
                <button onClick={onLogout} className="w-full py-2 flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition text-xs font-bold uppercase tracking-wider">
                    <LogIn size={14} /> System Logout
                </button>
            </div>
        </div >
    );
};

export default ResourceSidebar;
