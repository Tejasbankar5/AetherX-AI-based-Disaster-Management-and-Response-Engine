import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import RiskChart from "@/components/Dashboard/RiskChart"
import { Button } from "@/components/ui/button"
import { Activity, Users, Shield, Zap, Brain, BrainCircuit } from "lucide-react"
import { useState, useEffect } from "react"
import { allocateResources, fetchSimulationData } from "@/lib/api"
import type { Resource, DisasterZone, AllocationPlan } from "@/lib/api"

export default function ResourcesPage() {
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<AllocationPlan | null>(null);
    const [resources, setResources] = useState<Resource[]>([]);
    const [zones, setZones] = useState<DisasterZone[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchSimulationData();
                setResources(data.resources);
                setZones(data.zones);
            } catch (e) {
                console.error("Failed to load resources", e);
            }
        };
        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAllocate = async () => {
        setLoading(true);
        try {
            // Use real data from backend
            const result = await allocateResources(resources, zones);
            setPlan(result);
        } catch (error) {
            console.error("Allocation failed", error);
        } finally {
            setLoading(false);
        }
    };

    const medicalCount = resources.filter(r => r.type === 'Ambulance' || r.type === 'Medical').length;
    const fireCount = resources.filter(r => r.type === 'Fire Truck').length;
    // Police + NDRF + Rescue Teams
    const personnelCount = resources.filter(r => ['Police', 'NDRF Team', 'Rescue Team'].includes(r.type)).length;

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans selection:bg-cyan-500/30 pt-24">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid pointer-events-none z-0" />
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none z-0" />



            <main className="flex-1 p-6 md:p-8 relative z-10 max-w-7xl mx-auto w-full">
                <div className="mb-10">
                    <h2 className="text-4xl font-black tracking-tight uppercase text-white font-[Outfit]">Logistics Matrix</h2>
                    <p className="text-gray-400 mt-2 max-w-2xl font-light">Real-time inventory and deployment status of emergency response assets across all sectors.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card className="glass-card border-none bg-emerald-900/10 hover:bg-emerald-900/20 transition-all duration-500 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-400/80">Medical Units</CardTitle>
                            <Activity className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-black tracking-tighter text-white font-[Outfit]">{medicalCount}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <p className="text-[10px] font-bold uppercase text-emerald-400/60">Operational & Ready</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-none bg-red-900/10 hover:bg-red-900/20 transition-all duration-500 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-red-400/80">Fire Response</CardTitle>
                            <Shield className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-black tracking-tighter text-white font-[Outfit]">{fireCount}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                <p className="text-[10px] font-bold uppercase text-red-400/60">Active in Field</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card border-none bg-blue-900/10 hover:bg-blue-900/20 transition-all duration-500 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-blue-400/80">Active Personnel</CardTitle>
                            <Users className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-5xl font-black tracking-tighter text-white font-[Outfit]">{personnelCount}</div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <p className="text-[10px] font-bold uppercase text-blue-400/60">Verified On-Duty</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <Card className="glass-panel border-white/10 shadow-2xl">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-white font-[Outfit]">Resource Utilization Stream</CardTitle>
                                    <CardDescription className="text-gray-400">Temporal analysis of asset commitment and depletion rates.</CardDescription>
                                </div>
                                <Zap className="h-5 w-5 text-yellow-500 opacity-50" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <RiskChart />
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-violet-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-br from-violet-900/10 to-transparent">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Brain className="w-32 h-32 text-violet-500" />
                        </div>
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-lg text-violet-300 font-[Outfit] flex items-center gap-2">
                                <BrainCircuit className="w-5 h-5" /> Autonomous Allocation Engine
                            </CardTitle>
                            <CardDescription className="text-violet-200/60">AI-driven resource distribution optimization.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 relative z-10">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    Deploy constraints-based heuristic algorithms to optimize resource assignment across active disaster zones in real-time.
                                </p>
                                <Button
                                    onClick={handleAllocate}
                                    disabled={loading}
                                    className={`w-full font-bold tracking-wide transition-all duration-500 border ${loading ? 'bg-violet-900/20 border-violet-500/20 text-violet-400' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] border-violet-400/50'}`}
                                >
                                    {loading ? "Optimizing..." : "Execute AI Allocation Strategy"}
                                    {!loading && <Brain className="ml-2 w-4 h-4" />}
                                </Button>

                                {plan && (
                                    <div className="mt-4 space-y-3 bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex justify-between items-center text-xs uppercase tracking-wider text-gray-500 border-b border-white/5 pb-2">
                                            <span>Optimization Result</span>
                                            <span className="text-emerald-400 font-mono">{plan.computation_time_ms.toFixed(2)}ms</span>
                                        </div>
                                        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            {plan.allocations.map((alloc, i) => (
                                                <div key={i} className="flex justify-between items-start text-sm group hover:bg-white/5 p-1 rounded transition">
                                                    <div>
                                                        <span className="font-bold text-white">{alloc.resource_id.slice(0, 8)}...</span>
                                                        <span className="text-gray-600 mx-2">→</span>
                                                        <span className="text-red-400">{alloc.zone_id}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs font-mono text-emerald-400">{alloc.eta_minutes}m ETA</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-2 border-t border-white/5 flex gap-4 text-xs font-mono">
                                            <div className="text-gray-500">Score: <span className="text-white">{plan.total_score.toFixed(1)}</span></div>
                                            <div className="text-gray-500">Allocated: <span className="text-white">{plan.allocations.length}</span></div>
                                            <div className="text-gray-500">Unserved: <span className="text-red-500">{plan.unserved_zones.length}</span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}

