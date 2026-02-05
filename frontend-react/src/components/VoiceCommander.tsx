import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Activity } from 'lucide-react';
import { Card } from './ui/card';

declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}

const VoiceCommander: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            setFeedback("Browser not supported.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setFeedback("Listening...");
        };

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            setTranscript(text);
            processCommand(text);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error(event.error);
            setIsListening(false);
            setFeedback("Error: " + event.error);
        };

        (window as any).startVoice = () => recognition.start();

    }, []);

    const processCommand = (text: string) => {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('focus on') || lowerText.includes('go to')) {
            const city = lowerText.replace('focus on', '').replace('go to', '').trim();
            setFeedback(`Navigating to ${city}...`);
            speak(`Moving satellite view to ${city}`);
            window.dispatchEvent(new CustomEvent('voice-command', {
                detail: { type: 'FOCUS', payload: city }
            }));
        } else if (lowerText.includes('deploy') || lowerText.includes('send')) {
            const type = lowerText.includes('ambulance') ? 'Medical' : lowerText.includes('fire') ? 'Fire' : 'Police';
            setFeedback(`Deploying ${type} Units...`);
            speak(`Deploying nearest ${type} units immediately.`);
            window.dispatchEvent(new CustomEvent('voice-command', {
                detail: { type: 'DEPLOY', payload: type }
            }));
        } else if (lowerText.includes('status') || lowerText.includes('report')) {
            setFeedback("Generating Report...");
            speak("System operational. Active disasters: 3. Resources available: 84 percent. No critical warnings.");
        } else {
            setFeedback("Command not recognized.");
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end gap-2 pointer-events-none">
            <div className={`pointer-events-auto transition-all duration-300 ${transcript ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Card className="bg-black/80 backdrop-blur-md border border-blue-500/30 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-xs text-blue-300 font-mono tracking-wider uppercase">Voice Command</span>
                        <span className="text-sm font-bold">"{transcript}"</span>
                        <span className="text-[10px] text-gray-400">{feedback}</span>
                    </div>
                </Card>
            </div>

            <button
                onClick={() => (window as any).startVoice()}
                className={`pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 relative group ${isListening ? 'bg-red-600 animate-pulse' : 'bg-blue-600'}`}
            >
                {isListening && (
                    <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75"></span>
                )}
                {isListening ? (
                    <Mic className="w-5 h-5 text-white" />
                ) : (
                    <MicOff className="w-5 h-5 text-white/80 group-hover:text-white" />
                )}
            </button>
        </div>
    );
};

export default VoiceCommander;
