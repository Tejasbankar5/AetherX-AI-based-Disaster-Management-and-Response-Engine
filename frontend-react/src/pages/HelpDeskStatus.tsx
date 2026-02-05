import React from 'react';
import { Truck, MapPin, BrainCircuit } from 'lucide-react';
import { type AllocationPlan, type Resource, type DisasterZone } from '../lib/api';

interface HelpDeskStatusProps {
    allocationPlan: AllocationPlan;
    resources: Resource[];
    zones: DisasterZone[];
    selectedZoneId: string;
    dispatchStatus?: string | null;
}

const HelpDeskStatus: React.FC<HelpDeskStatusProps> = ({
    allocationPlan,
    resources,

    selectedZoneId,
    dispatchStatus
}) => {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full font-sans">
            {/* Left: Detailed Logistics Table */}
            <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col shadow-2xl min-h-[500px] border border-white/10">
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md">
                    <h2 className="font-bold text-lg text-white flex items-center gap-2 font-[Outfit]">
                        <Truck className="text-cyan-400" /> Deployment Schedule
                    </h2>
                    {dispatchStatus ? (
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 font-bold animate-pulse uppercase tracking-wider flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Mission Authorized
                        </span>
                    ) : (
                        <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20 font-mono flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            LIVE STATUS: PLANNING
                        </span>
                    )}
                </div>

                <div className="overflow-auto flex-1 bg-transparent custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold sticky top-0 z-10 backdrop-blur-md">
                            <tr>
                                <th className="p-4">Resource Unit</th>
                                <th className="p-4">Origin Status</th>
                                <th className="p-4 text-right">Distance</th>
                                <th className="p-4 text-right">ETA (Est)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {allocationPlan.allocations.map((alloc, idx) => {
                                const res = resources.find(r => r.id === alloc.resource_id);
                                return (
                                    <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/10">
                                                    {/* Simple icon mapping based on type */}
                                                    {res?.type.includes('Ambulance') ? '🚑' :
                                                        res?.type.includes('Fire') ? '🚒' :
                                                            res?.type.includes('Police') ? '🚓' : '🚛'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{res?.type}</div>
                                                    <div className="text-xs text-gray-500 font-mono">{alloc.resource_id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                                {res?.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-gray-300">
                                            {alloc.distance_km?.toFixed(1) || '?'} km
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="text-emerald-400 font-bold font-mono">{alloc.eta_minutes} min</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right: AI Analysis & Map Placeholder */}
            <div className="flex flex-col gap-6">
                {/* Map Stub (Could be a real mini-map) */}
                <div className="glass-card rounded-2xl h-64 relative overflow-hidden group shadow-lg border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 flex items-center justify-center">
                        <MapPin className="text-cyan-400/20" size={64} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="text-xs font-bold text-gray-400 uppercase">Target Zone</div>
                        <div className="text-sm text-white truncate font-mono">{selectedZoneId}</div>
                    </div>
                </div>

                {/* AI Rationale */}
                <div className="glass-panel bg-gradient-to-br from-violet-900/20 to-purple-900/20 rounded-2xl border border-violet-500/20 p-6 flex-1 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <BrainCircuit size={120} className="text-violet-500" />
                    </div>
                    <h3 className="font-bold text-violet-300 mb-4 flex items-center gap-2 font-[Outfit]">
                        <BrainCircuit size={20} /> Commander's Strategy
                    </h3>
                    <div className="prose prose-invert prose-sm">
                        <p className="text-gray-300 leading-relaxed italic">
                            "{allocationPlan.ai_rationale || 'Optimization based on proximity and severity algorithms.'}"
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-gray-400 uppercase">Efficiency Score</div>
                            <div className="text-2xl font-bold text-white font-[Outfit]">{allocationPlan.total_score}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400 uppercase">Pending Targets</div>
                            <div className="text-2xl font-bold text-red-400 font-[Outfit]">{allocationPlan.unserved_zones.length}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpDeskStatus;
