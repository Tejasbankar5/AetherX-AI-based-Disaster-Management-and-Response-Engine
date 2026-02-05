import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Activity, MessageCircle, X, Minimize2, Send } from 'lucide-react';
import { sendChatMessage } from '../lib/api';

const FloatingChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
        { role: 'bot', content: 'AetherX AI: Online. Monitoring active zones. How can I assist you?' }
    ]);
    const [language, setLanguage] = useState("en");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
        { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
        { code: 'es', name: 'Spanish', flag: '🇪🇸' },
        { code: 'fr', name: 'French', flag: '🇫🇷' },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵' }
    ];

    const getGreeting = (lang: string) => {
        switch (lang) {
            case 'hi': return 'AetherX AI: ऑनलाइन। सक्रिय क्षेत्रों की निगरानी। मैं आपकी क्या सहायता कर सकता हूँ?';
            case 'mr': return 'AetherX AI: ऑनलाइन. सक्रिय क्षेत्रांचे निरीक्षण सुरू आहे. मी तुम्हाला कशी मदत करू शकतो?';
            case 'es': return 'AetherX AI: En línea. Monitoreo de zonas activas. ¿En qué puedo ayudarte?';
            case 'fr': return 'AetherX AI: En ligne. Surveillance des zones actives. Comment puis-je vous aider ?';
            case 'ja': return 'AetherX AI: オンライン。アクティブゾーンを監視中。何かお手伝いしましょうか？';
            default: return 'AetherX AI: Online. Monitoring active zones. How can I assist you?';
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const response = await sendChatMessage(userMsg, "user-1", language);
            setMessages(prev => [...prev, { role: 'bot', content: response.reply }]);
        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { role: 'bot', content: "Connection interrupted. Retrying neural link..." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
            {/* Chat Box */}
            <div
                className={`pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-bottom-right ${isOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
                    }`}
            >
                <Card className="w-[350px] md:w-[400px] h-[500px] flex flex-col overflow-hidden border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl rounded-2xl">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02] px-4 py-3 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                            </div>
                            <div>
                                <CardTitle className="text-sm font-bold text-white">AetherX AI</CardTitle>
                                <span className="text-[10px] uppercase text-blue-400/80 font-mono tracking-wider">Secure Channel</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Language Selector */}
                            <div className="relative group">
                                <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 text-xs font-medium text-gray-300 transition-colors border border-transparent hover:border-white/5">
                                    <span>{languages.find(l => l.code === language)?.flag}</span>
                                    <span className="uppercase">{language}</span>
                                </button>
                                <div className="absolute right-0 top-full mt-1 w-32 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code);
                                                setMessages(prev => [...prev, { role: 'bot', content: getGreeting(lang.code) }]);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-white/10 transition-colors ${language === lang.code ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400'}`}
                                        >
                                            <span>{lang.flag}</span>
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-white/10 text-gray-400" onClick={() => setIsOpen(false)}>
                                <Minimize2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1`}>
                                    <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${m.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-3 py-2 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-3 border-t border-white/5 bg-white/[0.02] flex gap-2">
                            <input
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white placeholder:text-gray-500"
                                placeholder={`Type command... (${language.toUpperCase()})`}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={loading}
                                size="icon"
                                className={`w-10 h-10 rounded-xl transition-all ${input.trim() ? 'bg-blue-600 hover:bg-blue-500' : 'bg-white/5'}`}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Toggle Button (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen
                    ? 'bg-red-500 hover:bg-red-400 rotate-90'
                    : 'bg-blue-600 hover:bg-blue-500 rotate-0'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </button>
        </div>
    );
};

export default FloatingChatbot;
