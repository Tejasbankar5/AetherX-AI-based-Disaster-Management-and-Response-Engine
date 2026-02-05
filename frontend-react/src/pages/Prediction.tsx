import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { fetchRiskPrediction } from "@/lib/api"

export default function PredictionPage() {
    const [formData, setFormData] = useState({
        disaster_type: "Flood",
        severity_index: 5.0,
        economic_loss_usd: 100000,
        casualties: 0,
        response_time_hours: 12.0
    })
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlePredict = async () => {
        setLoading(true)
        setResult(null)
        try {
            const res = await fetchRiskPrediction({
                ...formData,
                severity_index: parseFloat(formData.severity_index.toString()),
                economic_loss_usd: parseFloat(formData.economic_loss_usd.toString()),
                casualties: parseInt(formData.casualties.toString()),
                response_time_hours: parseFloat(formData.response_time_hours.toString())
            })
            setResult(res)
        } catch (error) {
            console.error(error)
            alert("Error connecting to prediction API")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans selection:bg-cyan-500/30 pt-24">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid pointer-events-none z-0" />
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[150px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none z-0" />



            <main className="flex-1 p-6 md:p-8 relative z-10 max-w-6xl mx-auto w-full">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-4xl font-black tracking-tight uppercase text-white font-[Outfit]">Risk Assessment Engine</h2>
                    <p className="text-gray-400 mt-2 max-w-2xl font-light">Deploy neural models to calculate disaster impact probabilities and response optimization vectors.</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-5">
                    <Card className="lg:col-span-2 glass-panel border-white/10 shadow-2xl">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-violet-400">Input Parameters</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Disaster Type</label>
                                <select
                                    name="disaster_type"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none transition-all text-white hover:bg-white/5 cursor-pointer"
                                    value={formData.disaster_type}
                                    onChange={handleChange}
                                >
                                    <option value="Flood" className="bg-gray-900">Flood</option>
                                    <option value="Earthquake" className="bg-gray-900">Earthquake</option>
                                    <option value="Hurricane" className="bg-gray-900">Hurricane</option>
                                    <option value="Wildfire" className="bg-gray-900">Wildfire</option>
                                    <option value="Tornado" className="bg-gray-900">Tornado</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Severity Index</label>
                                    <input
                                        type="number" step="0.1" name="severity_index"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none transition-all text-white placeholder:text-gray-600 focus:bg-white/5"
                                        value={formData.severity_index}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Casualties (EST)</label>
                                    <input
                                        type="number" name="casualties"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none transition-all text-white placeholder:text-gray-600 focus:bg-white/5"
                                        value={formData.casualties}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Economic Loss (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs">$</span>
                                    <input
                                        type="number" name="economic_loss_usd"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-8 pr-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none transition-all text-white placeholder:text-gray-600 focus:bg-white/5"
                                        value={formData.economic_loss_usd}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Response Window (HRS)</label>
                                <input
                                    type="number" step="0.1" name="response_time_hours"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-violet-500/50 outline-none transition-all font-mono text-white placeholder:text-gray-600 focus:bg-white/5"
                                    value={formData.response_time_hours}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button
                                className={`w-full py-6 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${loading ? 'bg-violet-900/20 text-violet-400' : 'bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'}`}
                                onClick={handlePredict}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Computing...
                                    </div>
                                ) : "Execute Neural Analysis"}
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3 flex flex-col items-center justify-center glass-panel border-white/10 shadow-2xl relative overflow-hidden group">
                        {/* Interactive Background for Assessment */}
                        <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${result?.risk_level === 'High' ? 'bg-red-600' :
                            result?.risk_level === 'Medium' ? 'bg-amber-500' :
                                result?.risk_level === 'Low' ? 'bg-emerald-500' : 'bg-transparent'
                            }`} />

                        <CardHeader className="w-full border-b border-white/5 bg-white/5 z-10 backdrop-blur-sm">
                            <CardTitle className="text-center text-sm font-bold uppercase tracking-widest text-gray-400">Neural Assessment Output</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col items-center justify-center p-12 text-center w-full z-10">
                            {result ? (
                                <div className="space-y-8 animate-in zoom-in-95 duration-500 w-full">
                                    <div>
                                        <div className={`text-8xl font-black italic tracking-tighter transition-all duration-1000 font-[Outfit] filter drop-shadow-lg ${result.risk_level === 'High' ? 'text-red-500 text-glow' :
                                            result.risk_level === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                                            }`}>
                                            {result.risk_level}
                                        </div>
                                        <p className="text-gray-400 uppercase tracking-[0.3em] font-bold text-xs mt-2">Predicted Threat Level</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 w-full max-w-sm mx-auto p-6 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-xl">
                                        <div className="space-y-1">
                                            <div className="text-2xl font-black text-white font-[Outfit]">{(result.confidence_score * 100).toFixed(0)}%</div>
                                            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Confidence</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-2xl font-black text-cyan-400 font-[Outfit]">VALID</div>
                                            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold">Vector Status</p>
                                        </div>
                                    </div>

                                    <div className="h-1 w-full max-w-md bg-white/5 rounded-full mx-auto overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out shadow-[0_0_15px] ${result.risk_level === 'High' ? 'bg-red-500 shadow-red-500' :
                                                result.risk_level === 'Medium' ? 'bg-amber-500 shadow-amber-500' : 'bg-emerald-500 shadow-emerald-500'
                                                }`}
                                            style={{ width: `${(result.confidence_score * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mx-auto animate-pulse">
                                        <AlertTriangle className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-bold italic text-white font-[Outfit] tracking-wide">Awaiting Input Vectors</p>
                                        <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest">Neural core initialized and ready for computation</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <div className="w-full p-4 border-t border-white/5 bg-black/20 z-10 backdrop-blur-md">
                            <div className="flex justify-between items-center text-[8px] font-mono text-gray-600">
                                <span>KERNEL_ID: RX-8821-VITE</span>
                                <span>MODEL_VERSION: 4.2.0-STABLE</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    )

}
