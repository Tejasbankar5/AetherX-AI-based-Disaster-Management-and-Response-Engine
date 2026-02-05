import { Truck, MapPin, BrainCircuit } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { type AllocationPlan, type Resource, type DisasterZone } from '../lib/api';
import { getResourceIcon, getDisasterIcon, createResourceMarkerIcon, createZoneMarkerIcon } from '../utils/mapUtils';

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
    zones,
    selectedZoneId,
    dispatchStatus
}) => {
    const targetZone = zones.find(z => z.id === selectedZoneId);
    const dispatchAllocations = allocationPlan.allocations.filter(alloc => zones.some(z => z.id === alloc.zone_id));

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
                                <th className="p-4">Target Incident</th>
                                <th className="p-4">Origin Status</th>
                                <th className="p-4 text-right">Distance</th>
                                <th className="p-4 text-right">ETA (Est)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {allocationPlan.allocations
                                .filter(alloc => zones.some(z => z.id === alloc.zone_id))
                                .map((alloc, idx) => {
                                    const res = resources.find(r => r.id === alloc.resource_id);
                                    const zone = zones.find(z => z.id === alloc.zone_id);
                                    return (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/10">
                                                        {res ? getResourceIcon(res.type) : '🚛'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{res?.type}</div>
                                                        <div className="text-xs text-gray-500 font-mono">{alloc.resource_id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {zone ? (
                                                    <div className="flex flex-col">
                                                        <div className="text-white font-semibold flex items-center gap-1.5">
                                                            <span className="text-sm">
                                                                {getDisasterIcon(zone.type)}
                                                            </span>
                                                            {zone.type}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${zone.severity >= 8 ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                                zone.severity >= 5 ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                                                                    'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
                                                                }`}>
                                                                Severity: {zone.severity}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-xs italic">Unknown Zone</span>
                                                )}
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

            {/* Right: AI Analysis & Map */}
            <div className="flex flex-col gap-6">
                {/* Real Mini-Map */}
                <div className="glass-card rounded-2xl h-64 relative overflow-hidden group shadow-lg border border-white/10">
                    <MapContainer
                        center={targetZone ? [targetZone.location.lat, targetZone.location.lng] : [20.5937, 78.9629]}
                        zoom={11}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        attributionControl={false}
                    >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />

                        {targetZone && (
                            <>
                                <Marker
                                    position={[targetZone.location.lat, targetZone.location.lng]}
                                    icon={createZoneMarkerIcon(targetZone.severity, targetZone.type)}
                                >
                                    <Popup>
                                        <div className="text-xs font-bold text-gray-900">
                                            {targetZone.type} (Severity {targetZone.severity})
                                        </div>
                                    </Popup>
                                </Marker>
                                <Circle
                                    center={[targetZone.location.lat, targetZone.location.lng]}
                                    radius={2000}
                                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1 }}
                                />
                            </>
                        )}

                        {dispatchAllocations.map((alloc, idx) => {
                            const res = resources.find(r => r.id === alloc.resource_id);
                            if (!res) return null;
                            return (
                                <Marker
                                    key={idx}
                                    position={[res.location.lat, res.location.lng]}
                                    icon={createResourceMarkerIcon(res.status || 'Deployed', res.type)}
                                >
                                    <Popup>
                                        <div className="text-xs font-bold text-gray-900">{res.type}</div>
                                        <div className="text-[10px] text-gray-500">ETA: {alloc.eta_minutes}m</div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-[1000] pointer-events-none">
                        <div className="text-xs font-bold text-gray-400 uppercase">Operational Theater</div>
                        <div className="text-sm text-cyan-400 truncate font-mono flex items-center gap-2">
                            <MapPin size={12} /> {targetZone ? targetZone.type : 'Deployment Area'}
                        </div>
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
