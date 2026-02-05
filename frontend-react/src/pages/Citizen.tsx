import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Zap } from "lucide-react"
import { sendChatMessage } from "@/lib/api"

export default function CitizenPage() {
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
        { role: 'bot', content: 'Hello! I am AetherX AI. How can I help you stay safe today?' }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim() || loading) return
        const userMsg = input
        setInput("")
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setLoading(true)

        try {
            const response = await sendChatMessage(userMsg);
            setMessages(prev => [...prev, { role: 'bot', content: response.reply }])
        } catch (error) {
            console.error("Chat error", error)
            setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I am having trouble connecting to the server." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans selection:bg-cyan-500/30 text-white pt-24">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid pointer-events-none z-0 opacity-50" />
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full z-0 pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[150px] rounded-full z-0 pointer-events-none" />



            <main className="flex-1 flex flex-col p-6 md:p-8 relative z-10 max-w-5xl mx-auto w-full overflow-hidden">
                <div className="mb-8">
                    <h2 className="text-3xl font-black tracking-tight uppercase font-[Outfit] text-white">AI Safety Node</h2>
                    <p className="text-blue-200/60 mt-1 font-mono text-xs uppercase tracking-widest">Connected to AetherX Core Prediction Engine</p>
                </div>

                <Card className="flex-1 flex flex-col overflow-hidden border-none glass-panel shadow-2xl rounded-2xl h-[calc(100vh-250px)]">
                    <CardHeader className="border-b border-white/5 bg-white/5 px-6 py-4 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                                    <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-black" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-white font-[Outfit]">AetherX Neural Assistant</CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-blue-300/70 uppercase tracking-tighter">Status: Processing optimized response vectors</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col gap-6 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`group relative rounded-2xl px-5 py-4 max-w-[85%] text-sm shadow-xl transition-all ${m.role === 'user'
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-blue-900/20 border border-blue-500/30'
                                    : 'bg-white/5 border border-white/10 backdrop-blur-md rounded-tl-none text-gray-200'
                                    }`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <div className="p-4 bg-black/20 border-t border-white/5 backdrop-blur-xl">
                        <div className="relative flex items-center gap-3 max-w-3xl mx-auto">
                            <input
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600 text-white"
                                placeholder="Query neural assistant for safety protocols..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={loading}
                                size="icon"
                                className={`w-14 h-14 rounded-xl transition-all shadow-lg ${input.trim() ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 scale-100 opacity-100 shadow-blue-900/30' : 'bg-white/5 scale-95 opacity-50'}`}
                            >
                                <Zap className={`w-6 h-6 text-white ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                        </div>
                        <p className="text-center text-[9px] text-gray-600 mt-3 uppercase tracking-[0.2em]">Neural response may vary based on local telemetry</p>
                    </div>
                </Card>
            </main>
        </div>
    )

}
